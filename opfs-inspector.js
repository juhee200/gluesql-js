// Read-only observations of the same file used by the public OPFS entry point.
// Never acquire another sync access handle or change the engine's locking mode.
import { t, text, locale } from './i18n.js';

const PREVIEW_BYTES = 64 * 1024;
const BLOCK_BYTES = 1024;

export function createOpfsInspector(namespace) {
  const panel = document.querySelector('#opfs-live');
  const $ = (selector) => panel.querySelector(selector);
  const filename = `${namespace}.db`;
  let current = null;
  let baseline = null;
  let pending = null;
  let existedBefore = null;
  let selected = 0;

  panel.hidden = false;
  $('#opfs-origin').textContent = location.origin;
  $('#opfs-filename').textContent = filename;

  const time = (value) =>
    new Date(value).toLocaleTimeString(locale(), {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  const size = (value) =>
    value < 1024
      ? `${value} B`
      : `${(value / 1024).toLocaleString('en-US', { maximumFractionDigits: 1 })} KiB`;
  const hex = (value, width = 2) => value.toString(16).padStart(width, '0');

  async function getFile() {
    const root = await navigator.storage.getDirectory();
    // Do not create a file, or enumerate unrelated files on the hosting origin.
    const handle = await root.getFileHandle(filename);
    return handle.getFile();
  }

  function showBytes() {
    if (!current) return;
    const start = selected * BLOCK_BYTES;
    const end = Math.min(start + 64, current.bytes.length);
    text(
      $('#opfs-byte-label'),
      '블록 {block} · 오프셋 {offset}부터 {count}바이트 · 16진수 / ASCII',
      {
        block: selected + 1,
        offset: start.toLocaleString('en-US'),
        count: end - start,
      },
    );
    const lines = [];
    for (let offset = start; offset < end; offset += 16) {
      const bytes = current.bytes.slice(offset, Math.min(offset + 16, end));
      const values = Array.from(bytes, (value) => hex(value)).join(' ');
      const ascii = Array.from(bytes, (value) =>
        value >= 32 && value <= 126 ? String.fromCharCode(value) : '.',
      ).join('');
      lines.push(`${hex(offset, 8)}  ${values.padEnd(47)}  ${ascii}`);
    }
    $('#opfs-bytes').textContent = lines.join('\n');
  }

  function render() {
    const focusedBlock = panel.contains(document.activeElement)
      ? document.activeElement.dataset.block
      : undefined;
    $('#opfs-error').hidden = true;
    $('#opfs-snapshot').hidden = false;
    panel.dataset.state = 'ready';
    text(
      $('#opfs-presence'),
      existedBefore === true
        ? '이 페이지를 열기 전부터 있던 파일을 다시 읽었습니다.'
        : existedBefore === false
          ? '이번 연결에서 만들어진 실제 .db 파일입니다.'
          : '실제 OPFS 파일에서 읽은 정보입니다.',
    );
    $('#opfs-size').textContent = size(current.size);
    $('#opfs-size-bytes').textContent =
      `${current.size.toLocaleString('en-US')} bytes`;
    $('#opfs-modified').textContent = time(current.lastModified);
    $('#opfs-modified').title = new Date(current.lastModified).toISOString();
    text($('#opfs-observed'), '{time} 관측', {
      time: time(current.observedAt),
    });
    text($('#opfs-range'), '앞쪽 {preview} / 전체 {total}', {
      preview: size(current.bytes.length),
      total: size(current.size),
    });
    text($('#opfs-baseline'), '비교 기준 {time}', {
      time: time(baseline.observedAt),
    });

    const fragment = document.createDocumentFragment();
    const length = Math.max(current.bytes.length, baseline.bytes.length);
    let changedTotal = 0;
    for (let start = 0; start < length; start += BLOCK_BYTES) {
      const index = start / BLOCK_BYTES;
      const end = Math.min(start + BLOCK_BYTES, length);
      let changed = 0;
      let nonzero = false;
      for (let offset = start; offset < end; offset++) {
        if (current.bytes[offset] !== baseline.bytes[offset]) changed++;
        if (current.bytes[offset] !== undefined && current.bytes[offset] !== 0)
          nonzero = true;
      }
      changedTotal += changed;
      const button = document.createElement('button');
      button.className = `opfs-block ${changed ? 'changed' : nonzero ? 'data' : 'zero'}`;
      button.dataset.block = index;
      button.textContent = index + 1;
      button.title = t('{start}–{end} bytes · {count}바이트 변경', {
        start: start.toLocaleString('en-US'),
        end: (end - 1).toLocaleString('en-US'),
        count: changed,
      });
      button.setAttribute(
        'aria-label',
        t('블록 {block}: {count}바이트 변경{absent}', {
          block: index + 1,
          count: changed,
          absent:
            start >= current.bytes.length ? t(', 현재 파일에는 없음') : '',
        }),
      );
      button.setAttribute('aria-pressed', String(index === selected));
      button.disabled = start >= current.bytes.length;
      button.addEventListener('click', () => {
        selected = index;
        for (const block of $('#opfs-blocks').children)
          block.setAttribute(
            'aria-pressed',
            String(Number(block.dataset.block) === selected),
          );
        showBytes();
        $('#opfs-byte-details').open = true;
      });
      fragment.append(button);
    }
    $('#opfs-blocks').replaceChildren(fragment);
    if (focusedBlock !== undefined)
      $('#opfs-blocks')
        .querySelector(`[data-block="${focusedBlock}"]`)
        ?.focus({ preventScroll: true });
    $('#opfs-changed-count').textContent = changedTotal.toLocaleString('en-US');
    showBytes();
  }

  function refresh() {
    if (pending) return pending;
    $('#opfs-refresh').disabled = true;
    $('#opfs-rebase').disabled = true;
    pending = (async () => {
      try {
        let snapshot;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const file = await getFile();
            const bytes = new Uint8Array(
              await file.slice(0, PREVIEW_BYTES).arrayBuffer(),
            );
            snapshot = {
              size: file.size,
              lastModified: file.lastModified,
              observedAt: Date.now(),
              bytes,
            };
            break;
          } catch (error) {
            // A concurrent writer can invalidate a File snapshot: obtain a fresh one once.
            if (attempt === 1 || error.name !== 'NotReadableError') throw error;
          }
        }
        current = snapshot;
        baseline ??= current;
        if (selected * BLOCK_BYTES >= current.bytes.length) selected = 0;
        render();
      } catch (error) {
        panel.dataset.state = 'unavailable';
        $('#opfs-snapshot').hidden = true;
        text($('#opfs-presence'), '파일 상태를 확인할 수 없습니다.');
        $('#opfs-error').hidden = false;
        text(
          $('#opfs-error'),
          error.name === 'NotFoundError'
            ? '아직 파일이 없거나 삭제되었습니다. DB에 연결한 뒤 파일 다시 읽기를 눌러주세요.'
            : '파일 관측 실패: {error}. 이 관측 결과는 SQL 실행 성공 여부와 별개입니다.',
          { error: error.message ?? error },
        );
      } finally {
        pending = null;
        $('#opfs-refresh').disabled = false;
        $('#opfs-rebase').disabled = false;
      }
    })();
    return pending;
  }

  $('#opfs-refresh').addEventListener('click', refresh);
  addEventListener('lab:languagechange', () => {
    // Reuse the same snapshot and baseline; changing language never reads or writes the DB.
    if (current && panel.dataset.state === 'ready') render();
  });
  $('#opfs-rebase').addEventListener('click', () => {
    if (!current || pending) return;
    baseline = current;
    render();
  });

  return {
    refresh,
    async checkBeforeConnect() {
      try {
        await getFile();
        existedBefore = true;
      } catch (error) {
        if (error.name === 'NotFoundError') existedBefore = false;
      }
    },
  };
}
