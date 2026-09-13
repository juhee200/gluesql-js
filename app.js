const $ = (selector) => document.querySelector(selector);
const mode = ['memory', 'opfs', 'shared'].includes(
  new URLSearchParams(location.search).get('mode'),
)
  ? new URLSearchParams(location.search).get('mode')
  : 'memory';
const namespace = `gluesql-lab-${mode}-v1`;
const noteQuery =
  'SELECT author, message, created_at\nFROM Note\nORDER BY created_at DESC;';
const contributionQuery =
  'SELECT pr, title, area\nFROM Contribution\nORDER BY pr;';
const experiments = {
  memory: {
    label: 'Memory storage',
    title: '첫 번째 쿼리를 실행해보세요.',
    description:
      '샘플 데이터에는 이 프로젝트에 기여한 작업들이 담겨 있어요. SQL을 자유롭게 바꿔보세요.',
    caption: '새로고침하면 초기화됩니다',
    flow: [
      ['⌘', '현재 브라우저 탭', 'JavaScript API'],
      ['◇', 'GlueSQL 엔진', 'Rust → WebAssembly'],
      ['▦', '메모리', 'MemoryStorage'],
    ],
    flowDescription: 'SQL은 WebAssembly 엔진을 거쳐 메모리에 기록됩니다.',
    flowNote:
      '메모리 모드는 현재 탭에서 실행됩니다. Worker 실행은 OPFS 실험에서 확인하세요.',
    samples: [
      ['기여 목록 조회', contributionQuery],
      [
        '영역별 집계',
        'SELECT area, COUNT(*) AS count\nFROM Contribution\nGROUP BY area;',
      ],
      [
        'JOIN 실행',
        'SELECT c.pr, c.title, a.description\nFROM Contribution c\nJOIN Area a ON c.area = a.name\nORDER BY c.pr;',
      ],
      [
        '직접 테이블 만들기',
        "CREATE TABLE IF NOT EXISTS Todo (id INTEGER, task TEXT);\nINSERT INTO Todo VALUES (1, '나의 첫 GlueSQL');\nSELECT * FROM Todo;",
      ],
      ['오류 확인하기', 'SELECT * FROM Missing;'],
    ],
  },
  opfs: {
    label: 'OPFS storage',
    title: '새로고침해도, 메모는 그대로.',
    description:
      '메모를 저장한 뒤 새로고침해보세요. Worker가 OPFS 파일에 기록한 데이터는 브라우저를 다시 열어도 남습니다.',
    caption: 'OPFS 파일에 영구 저장됩니다',
    flow: [
      ['⌘', '현재 브라우저 탭', 'query() → Promise'],
      ['◇', 'Dedicated Worker', 'GlueSQL · WebAssembly'],
      ['▱', 'OPFS 파일', 'redb · 영구 저장'],
    ],
    flowDescription:
      'SQL은 전용 Worker에서 실행되고, 결과는 내 브라우저의 파일에 저장됩니다.',
    flowNote:
      '단일 탭 전용입니다. 같은 DB를 여러 탭에서 열려면 ‘두 탭, 하나의 DB’를 선택하세요.',
    samples: [
      ['저장한 메모 조회', noteQuery],
      ['메모 개수', 'SELECT COUNT(*) AS count FROM Note;'],
      ['테이블 목록', 'SHOW TABLES;'],
      ['테이블 구조', 'SHOW COLUMNS FROM Note;'],
    ],
  },
  shared: {
    label: 'Shared OPFS · experimental',
    title: '탭은 둘이어도, 데이터는 하나.',
    description:
      '두 번째 탭을 열고 어느 탭에서든 메모를 저장해보세요. 먼저 연 탭을 닫아도 남은 탭에서 계속 쓸 수 있습니다.',
    caption: '동일 브라우저의 탭끼리 공유됩니다',
    flow: [
      ['▥', '같은 브라우저의 탭들', 'BroadcastChannel'],
      ['◇', '리더 탭의 Worker', 'Web Locks · 리더 선출'],
      ['▱', '하나의 OPFS 파일', 'redb · 공유 저장'],
    ],
    flowDescription:
      '탭들이 리더 하나를 선출합니다. 리더의 Worker가 파일을 열고 쿼리를 처리합니다.',
    flowNote:
      '리더가 닫히면 다른 탭이 이어받습니다. 처리 중이던 쓰기는 성공 여부가 불확실할 수 있어 자동 재시도하지 않습니다.',
    samples: [
      ['공유 메모 조회', noteQuery],
      ['메모 개수', 'SELECT COUNT(*) AS count FROM Note;'],
      ['테이블 목록', 'SHOW TABLES;'],
    ],
  },
};
const experiment = experiments[mode];
let db;
let busy = false;
let closed = false;
let payloads = null;
let resultError = null;
let view = 'table';
let toastTimer;
let pollTimer;
let previousNotes = '';
let author = `tab-${Math.random().toString(36).slice(2, 6)}`;
try {
  author = sessionStorage.getItem('gluesql-lab-author') || author;
  sessionStorage.setItem('gluesql-lab-author', author);
} catch {
  /* Storage can be restricted; the database reports its own capability errors. */
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function log(message, error = false) {
  const item = element('li', undefined, error ? 'error' : '');
  const content = element('div', message);
  content.append(
    element('time', new Date().toLocaleTimeString('ko-KR', { hour12: false })),
  );
  item.append(content);
  $('#events').prepend(item);
  while ($('#events').children.length > 12) $('#events').lastChild.remove();
}
function notify(message) {
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    $('#toast').hidden = true;
  }, 4000);
}
function notice(message, error = false) {
  $('#notice').textContent = message;
  $('#notice').hidden = !message;
  $('#notice').classList.toggle('error', error);
}
function updateControls() {
  const unavailable = !db || closed || busy;
  $('#run').disabled = unavailable;
  $('#refresh-schema').disabled = unavailable;
  for (const button of $('#experiment-actions').querySelectorAll(
    '[data-needs-db]',
  ))
    button.disabled = unavailable;
  $('#run').lastChild.textContent = busy ? ' 실행 중…' : ' SQL 실행';
  $('#flow').classList.toggle('running', busy);
}
function setSQL(sql) {
  $('#sql').value = sql;
  updateLines();
}
function updateLines() {
  $('#line-numbers').textContent = $('#sql')
    .value.split('\n')
    .map((_, i) => i + 1)
    .join('\n');
}
function format(value) {
  if (value === null) return 'NULL';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}
function renderRows(rows) {
  if (!rows.length) {
    const empty = element('div', undefined, 'empty-state');
    empty.append(
      element('span', '▱'),
      element('strong', '조회된 행이 없어요.'),
      element(
        'p',
        mode === 'memory'
          ? '조건을 바꾸거나 데이터를 추가해보세요.'
          : '위에서 메모를 저장하고 결과를 확인해보세요.',
      ),
    );
    return empty;
  }
  const columns = [...new Set(rows.flatMap(Object.keys))];
  const table = element('table');
  const head = table.createTHead().insertRow();
  for (const column of columns) {
    const th = element('th', column);
    th.scope = 'col';
    head.append(th);
  }
  const body = table.createTBody();
  for (const row of rows.slice(0, 500)) {
    const tr = body.insertRow();
    for (const column of columns) {
      const cell = tr.insertCell();
      cell.textContent = format(row[column]);
      cell.title = cell.textContent;
    }
  }
  return table;
}
function renderResults() {
  const results = $('#results');
  if (resultError !== null) {
    results.replaceChildren(element('div', resultError, 'query-error'));
    return;
  }
  if (payloads === null) return;
  results.replaceChildren();
  if (view === 'json') {
    results.append(element('pre', JSON.stringify(payloads, null, 2)));
    return;
  }
  for (const [index, payload] of payloads.entries()) {
    if (payloads.length > 1 || !payload.rows) {
      results.append(
        element(
          'div',
          `${payloads.length > 1 ? `${index + 1}. ` : ''}${payload.type}${payload.affected !== undefined ? ` · ${payload.affected}행 반영` : ''}`,
          'payload-label',
        ),
      );
    }
    const rows =
      payload.rows ??
      payload.columns ??
      payload.tables?.map((name) => ({ table: name }));
    if (rows) {
      results.append(renderRows(rows));
      if (rows.length > 500)
        results.append(
          element(
            'p',
            `전체 ${rows.length}행 중 500행을 표시합니다. 전체 결과는 JSON으로 다운로드할 수 있어요.`,
            'payload-label',
          ),
        );
    } else if (
      Object.keys(payload).some((key) => !['type', 'affected'].includes(key))
    ) {
      results.append(element('pre', JSON.stringify(payload, null, 2)));
    }
  }
}
function showResults(result, elapsed) {
  payloads = result;
  resultError = null;
  const rowCount = result.reduce(
    (sum, p) =>
      sum + (p.rows?.length ?? p.columns?.length ?? p.tables?.length ?? 0),
    0,
  );
  $('#query-stats').textContent = `${rowCount}행 · ${elapsed.toFixed(1)} ms`;
  $('#download').disabled = false;
  renderResults();
}
function showQueryError(error) {
  resultError = `${error.message ?? error}\n\nSQL과 테이블 이름을 확인한 뒤 다시 실행해주세요.${String(error.message ?? error).includes('leader lost') ? '\n리더가 바뀌는 동안 실행 중이던 쿼리입니다. 쓰기는 반영 여부를 먼저 확인해주세요.' : ''}`;
  payloads = null;
  $('#query-stats').textContent = '실행 오류';
  $('#download').disabled = true;
  renderResults();
  log(String(error.message ?? error), true);
}
async function refreshSchema() {
  const [result] = await db.query('SHOW TABLES;');
  const fragment = document.createDocumentFragment();
  for (const name of result.tables ?? []) {
    const details = element('details');
    details.open = true;
    details.append(element('summary', name));
    // SHOW TABLES is authoritative; quote identifiers before putting them back into SQL.
    const [columns] = await db.query(
      `SHOW COLUMNS FROM "${name.replaceAll('"', '""')}";`,
    );
    for (const column of columns.columns ?? []) {
      const row = element('div', undefined, 'column');
      row.append(element('span', column.name), element('span', column.type));
      details.append(row);
    }
    fragment.append(details);
  }
  if (!fragment.childNodes.length)
    fragment.append(element('p', '테이블을 만들어보세요.'));
  $('#schema').replaceChildren(fragment);
}
async function runQuery(sql = $('#sql').value) {
  if (!db || busy || closed) return;
  if (!sql.trim()) {
    notify('실행할 SQL을 입력해주세요.');
    return;
  }
  busy = true;
  updateControls();
  const start = performance.now();
  try {
    const result = await db.query(sql);
    showResults(result, performance.now() - start);
    if (sql === noteQuery) previousNotes = JSON.stringify(result);
    log(`${result.map((p) => p.type).join(', ')} 실행 완료`);
    // Introspection failures must not turn an already successful write into an apparent failure.
    try {
      await refreshSchema();
    } catch (error) {
      log(`테이블 목록 갱신 실패: ${error.message ?? error}`, true);
    }
  } catch (error) {
    showQueryError(error);
  } finally {
    busy = false;
    updateControls();
  }
}
function action(label, callback, needsDb = true) {
  const button = element('button', label, 'secondary-button');
  if (needsDb) button.dataset.needsDb = '';
  button.addEventListener('click', callback);
  $('#experiment-actions').append(button);
  return button;
}
async function saveNote() {
  const input = $('#note-input');
  if (!input.value.trim() || busy || !db || closed) {
    if (!input.value.trim()) input.focus();
    return;
  }
  const message = input.value.trim().replaceAll("'", "''");
  const sql = `INSERT INTO Note VALUES ('${crypto.randomUUID()}', '${author}', '${message}', '${new Date().toISOString()}');`;
  busy = true;
  updateControls();
  let saved = false;
  try {
    await db.query(sql);
    saved = true;
    input.value = '';
    log('메모 1행 저장 완료');
    notify('메모를 저장했습니다.');
  } catch (error) {
    showQueryError(error);
  } finally {
    busy = false;
    updateControls();
  }
  if (saved) {
    setSQL(noteQuery);
    $('#sample').value = '0';
    await runQuery(noteQuery);
  }
}
async function pollNotes() {
  if (busy || closed || !db || document.hidden || $('#sql').value !== noteQuery)
    return;
  busy = true;
  updateControls();
  try {
    const start = performance.now();
    // Only this known read is polled. Never automatically replay SQL from the editor.
    const result = await db.query(noteQuery);
    const serialized = JSON.stringify(result);
    if (serialized !== previousNotes) {
      previousNotes = serialized;
      showResults(result, performance.now() - start);
      log('공유 DB 변경 확인 · 결과 갱신');
    }
  } catch (error) {
    // An idempotent read can be attempted on the next tick after leader failover.
    if (!String(error.message ?? error).includes('leader lost')) {
      clearInterval(pollTimer);
      notice(
        `공유 조회가 중지되었습니다: ${error.message ?? error}. SQL 실행으로 다시 확인해주세요.`,
        true,
      );
    }
  } finally {
    busy = false;
    updateControls();
  }
}
function configure() {
  for (const button of document.querySelectorAll('[data-mode]')) {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    button.addEventListener('click', () => {
      if (active) return;
      const url = new URL(location.href);
      url.search = new URLSearchParams({
        mode: button.dataset.mode,
      }).toString();
      url.hash = '';
      location.assign(url);
    });
  }
  $('#engine-label').textContent = experiment.label;
  $('#experiment-title').textContent = experiment.title;
  $('#experiment-description').textContent = experiment.description;
  $('#storage-caption').textContent = experiment.caption;
  $('#flow-description').textContent = experiment.flowDescription;
  $('#flow-note').textContent = experiment.flowNote;
  for (const [i, [icon, title, description]] of experiment.flow.entries()) {
    if (i) $('#flow').append(element('div', '↓', 'flow-arrow'));
    const node = element('div', undefined, 'flow-node');
    const content = element('div');
    content.append(element('strong', title), element('small', description));
    node.append(element('span', icon), content);
    $('#flow').append(node);
  }
  for (const [i, [label]] of experiment.samples.entries()) {
    const option = element('option', label);
    option.value = i;
    $('#sample').append(option);
  }
  setSQL(experiment.samples[0][1]);
  if (mode === 'memory') {
    action('집계해보기', () => {
      $('#sample').value = '1';
      setSQL(experiment.samples[1][1]);
      runQuery();
    });
    action('JOIN 해보기', () => {
      $('#sample').value = '2';
      setSQL(experiment.samples[2][1]);
      runQuery();
    });
    action('실험 초기화', () => location.reload(), false);
  } else {
    const input = element('input', undefined, 'note-input');
    input.id = 'note-input';
    input.placeholder = '브라우저에 남길 메모를 입력하세요';
    input.setAttribute('aria-label', '저장할 메모');
    input.maxLength = 500;
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.isComposing) saveNote();
    });
    $('#experiment-actions').append(input);
    action('메모 저장', saveNote);
    if (mode === 'opfs')
      action('새로고침으로 확인', () => location.reload(), false);
    else {
      const url = new URL(location.href);
      url.hash = '';
      const link = element('a', '두 번째 탭 열기', 'secondary-button');
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener';
      $('#experiment-actions').append(link);
      action('이 탭 연결 종료', () => {
        db.terminate();
        closed = true;
        clearInterval(pollTimer);
        $('#connection').textContent = '연결 종료';
        updateControls();
        log('이 탭의 DB 연결 종료');
        notice(
          '연결을 종료했습니다. 다른 탭에서 메모를 저장해 이어받기를 확인하세요. 이 탭은 새로고침하면 다시 연결됩니다.',
        );
      });
      action('다시 연결', () => location.reload(), false);
      notice(
        '같은 브라우저·프로필에서만 공유됩니다. 기본 메모 조회는 2초마다 갱신됩니다. 다른 사람에게 링크를 보내면 그 사람의 독립된 DB가 열립니다.',
      );
    }
  }
  updateControls();
}
async function connect() {
  const engineBase = new URL(
    document.documentElement.dataset.engineBase,
    location.href,
  );
  if (mode !== 'memory') {
    if (
      !isSecureContext ||
      !navigator.storage?.getDirectory ||
      !globalThis.Worker
    )
      throw new Error(
        'OPFS를 사용할 수 없습니다. HTTPS 또는 localhost에서 열거나 SQL 플레이그라운드를 선택해주세요.',
      );
    if (mode === 'shared' && (!navigator.locks || !globalThis.BroadcastChannel))
      throw new Error(
        '이 브라우저는 멀티탭 공유에 필요한 Web Locks / BroadcastChannel을 지원하지 않습니다. 다른 실험을 선택해주세요.',
      );
  }
  const module = await import(
    new URL(
      mode === 'memory'
        ? 'gluesql.js'
        : mode === 'shared'
          ? 'gluesql.opfs.shared.js'
          : 'gluesql.opfs.js',
      engineBase,
    )
  );
  if (mode === 'memory') db = await module.gluesql();
  else {
    db = module.gluesql({ namespace });
    // After a reload the old exclusive handle may need a moment to be released.
    if (mode === 'opfs') {
      for (let attempt = 0; ; attempt++) {
        try {
          await db.query('SELECT 1;');
          break;
        } catch (error) {
          db.terminate();
          if (attempt === 4) throw error;
          await new Promise((resolve) =>
            setTimeout(resolve, 200 * (attempt + 1)),
          );
          db = module.gluesql({ namespace });
        }
      }
    }
  }
  if (mode === 'memory') {
    await db.query(`
      CREATE TABLE Contribution (pr INTEGER, title TEXT, area TEXT);
      INSERT INTO Contribution VALUES
        (13, 'Worker 기반 OPFS 진입점', 'Worker'),
        (15, 'Worker 프록시 브라우저 테스트', 'Testing'),
        (16, 'redb 기반 OPFS 스토리지', 'Storage'),
        (17, 'OPFS npm 패키징', 'Package'),
        (19, 'OPFS 예제와 테스트', 'Testing'),
        (21, '멀티탭 공유와 장애 복구', 'Storage');
      CREATE TABLE Area (name TEXT, description TEXT);
      INSERT INTO Area VALUES ('Worker', 'UI 밖에서 SQL 실행'), ('Testing', '브라우저에서 동작 검증'), ('Storage', '파일 저장과 공유'), ('Package', '설치해서 바로 사용');
    `);
  } else {
    await db.query(
      'CREATE TABLE IF NOT EXISTS Note (id TEXT PRIMARY KEY, author TEXT, message TEXT, created_at TEXT);',
    );
  }
  $('#connection').textContent = '연결됨';
  log(`${experiment.label} 연결 완료`);
  updateControls();
  await refreshSchema();
  const sharedSQL = new URLSearchParams(location.hash.slice(1)).get('sql');
  if (sharedSQL) {
    setSQL(sharedSQL.slice(0, 20000));
    notice(
      '공유된 SQL을 불러왔습니다. 내용을 확인한 뒤 SQL 실행을 눌러주세요. 데이터는 공유되지 않습니다.',
    );
  } else await runQuery();
  if (mode === 'shared') pollTimer = setInterval(pollNotes, 2000);
}

configure();
$('#run').addEventListener('click', () => runQuery());
$('#sql').addEventListener('input', updateLines);
$('#sql').addEventListener('scroll', () => {
  $('#line-numbers').scrollTop = $('#sql').scrollTop;
});
$('#sql').addEventListener('keydown', (event) => {
  if (event.isComposing) return;
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    runQuery();
  }
});
$('#sample').addEventListener('change', () =>
  setSQL(experiment.samples[Number($('#sample').value)][1]),
);
for (const type of ['table', 'json'])
  $(`#${type}-view`).addEventListener('click', () => {
    view = type;
    for (const name of ['table', 'json']) {
      $(`#${name}-view`).classList.toggle('selected', name === type);
      $(`#${name}-view`).setAttribute('aria-pressed', String(name === type));
    }
    renderResults();
  });
$('#refresh-schema').addEventListener('click', async () => {
  if (busy || closed || !db) return;
  busy = true;
  updateControls();
  try {
    await refreshSchema();
    notify('테이블 목록을 갱신했습니다.');
  } catch (error) {
    notice(`목록 갱신 실패: ${error.message ?? error}`, true);
  } finally {
    busy = false;
    updateControls();
  }
});
$('#clear-log').addEventListener('click', () => $('#events').replaceChildren());
$('#download').addEventListener('click', () => {
  if (!payloads) return;
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(payloads, null, 2)], { type: 'application/json' }),
  );
  const link = element('a');
  link.href = url;
  link.download = `gluesql-${mode}-result.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('#share').addEventListener('click', async () => {
  if ($('#sql').value.length > 20000) {
    notify('공유할 SQL은 20,000자 이하로 줄여주세요.');
    return;
  }
  const url = new URL(location.href);
  url.search = new URLSearchParams({ mode }).toString();
  url.hash = new URLSearchParams({ sql: $('#sql').value }).toString();
  try {
    await navigator.clipboard.writeText(url.href);
    notify('쿼리 링크를 복사했습니다. 데이터는 포함되지 않습니다.');
  } catch {
    notice('클립보드에 접근할 수 없습니다. 아래 링크를 직접 복사해주세요.');
    const input = element('input', undefined, 'note-input');
    input.value = url.href;
    input.readOnly = true;
    input.setAttribute('aria-label', '공유 쿼리 링크');
    $('#notice').append(input);
    input.focus();
    input.select();
  }
});
addEventListener('pagehide', () => {
  closed = true;
  clearInterval(pollTimer);
  db?.terminate?.();
  db?.free?.();
});
addEventListener('pageshow', (event) => {
  if (event.persisted) location.reload();
});
connect().catch((error) => {
  db?.terminate?.();
  db?.free?.();
  db = null;
  $('#connection').textContent = '연결 실패';
  $('#connection').classList.add('failed');
  $('#schema').replaceChildren(element('p', '엔진 연결을 확인해주세요.'));
  notice(
    `연결 실패: ${error.message ?? error}${mode === 'opfs' ? ' 같은 실험을 연 다른 탭이 있다면 닫고 새로고침하거나 멀티탭 실험을 선택해주세요.' : ''}`,
    true,
  );
  log(String(error.message ?? error), true);
  updateControls();
});
