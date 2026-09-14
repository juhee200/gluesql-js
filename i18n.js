const english = {
  'GlueSQL Lab — 브라우저 안의 데이터베이스':
    'GlueSQL Lab — A database in your browser',
  'SQL 실행부터 OPFS 영구 저장, 멀티탭 공유까지. GlueSQL.js의 동작을 브라우저에서 직접 실험해보세요.':
    'Run SQL, persist data with OPFS, and share a database across tabs. Try GlueSQL.js right in your browser.',
  '실험실로 이동': 'Skip to the lab',
  'GlueSQL Lab 처음으로': 'GlueSQL Lab home',
  '메인 메뉴': 'Main navigation',
  실험실: 'Lab',
  '언어 선택': 'Language',
  '브라우저 설정': 'Browser default',
  '설치 없이, 지금 이 브라우저에서': 'No installation. Just your browser.',
  '브라우저 안에': 'A database.',
  '데이터베이스를 붙이다.': 'Inside your browser.',
  'SQL을 실행하고, 탭을 닫고, 다시 열어보세요.':
    'Run SQL. Close a tab. Open it again.',
  'GlueSQL.js에 더한 저장과 연결의 변화를 직접 실험합니다.':
    'Explore storage and connections with GlueSQL.js.',
  '내 기기에 저장': 'Saved on your device',
  '직접 해보는 GlueSQL': 'Try GlueSQL yourself',
  '실제 WASM 엔진으로 실행됩니다': 'Powered by the real WASM engine',
  'GlueSQL 실험실': 'GlueSQL lab',
  '실험 선택': 'CHOOSE AN EXPERIMENT',
  '저장 방식 선택': 'Storage mode',
  'SQL 플레이그라운드': 'SQL playground',
  '메모리에서 가볍게 시작': 'Start with memory storage',
  '새로고침해도 그대로': 'Survives a refresh',
  'OPFS 영구 저장': 'Persistent OPFS storage',
  '두 탭, 하나의 DB': 'Two tabs, one database',
  '멀티탭 공유 · 장애 복구': 'Shared storage · failover',
  데이터베이스: 'DATABASE',
  '테이블 목록 새로고침': 'Refresh tables',
  '엔진을 연결하고 있어요.': 'Connecting to the engine…',
  '이 데이터는 여기 머물러요.': 'Your data stays here.',
  '쿼리와 데이터는 서버로 전송되지 않습니다. 링크를 공유해도 각자의 브라우저에서 실행됩니다.':
    'Queries and data stay off the server. Shared links run in each visitor’s own browser.',
  '첫 번째 쿼리를 실행해보세요.': 'Run your first query.',
  '샘플 데이터에는 이 프로젝트에 기여한 작업들이 담겨 있어요. SQL을 자유롭게 바꿔보세요.':
    'The sample data contains contributions to this project. Make the SQL your own.',
  '연결 중': 'Connecting',
  연결됨: 'Connected',
  '연결 종료': 'Disconnected',
  '연결 실패': 'Connection failed',
  '브라우저 안의 실제 파일': 'The actual file in your browser',
  '파일 다시 읽기': 'Refresh file',
  '파일을 확인하고 있어요.': 'Looking for the file…',
  '실제 파일 크기': 'Actual file size',
  '기준 이후 바뀐 바이트': 'Bytes changed since baseline',
  '미리보기 범위 안에서 비교': 'Within the preview range',
  '파일 수정 시각': 'File last modified',
  '파일 바이트 지도': 'File byte map',
  '실제 파일의 1 KiB 블록 선택': 'Select a 1 KiB block from the actual file',
  '모두 0': 'All zero',
  '0 아닌 값 포함': 'Contains nonzero bytes',
  '기준과 달라짐': 'Changed since baseline',
  '현재를 비교 기준으로': 'Use current as baseline',
  '선택한 블록의 실제 바이트 보기': 'View the selected block’s actual bytes',
  '칸을 누르면 실제 바이트를 볼 수 있어요. 파일 앞쪽 최대 64 KiB만 읽으며, 각 칸은 1 KiB입니다. 색은 메타데이터를 포함한 바이트 비교 결과로, DB의 여유 공간이나 실제 디스크 블록을 뜻하지 않습니다. 조회에도 DB 메타데이터가 바뀔 수 있고, redb가 공간을 재사용하면 저장해도 파일 크기는 같을 수 있어요.':
    'Select a block to inspect its bytes. This preview reads up to the first 64 KiB; each block is 1 KiB. Colors compare bytes, including metadata. They do not represent free database space or physical disk blocks. Even a read can change database metadata, and a write may leave the file size unchanged when redb reuses space.',
  '예제 쿼리': 'Example query',
  '쿼리 링크 복사': 'Copy query link',
  '실행할 SQL': 'SQL to run',
  실행: 'to run',
  'SQL 실행': 'Run SQL',
  '실행 중…': 'Running…',
  '결과 표시 방식': 'Result format',
  '결과 테이블': 'Results',
  '결과 JSON 다운로드': 'Download results as JSON',
  'SQL이 데이터가 되는 곳': 'Where SQL becomes data',
  '쿼리를 실행하면 실제 결과가 여기에 표시됩니다.':
    'Run a query to see its actual results here.',
  '브라우저에서 실행': 'Running in your browser',
  '새로고침하면 초기화됩니다': 'Resets on refresh',
  '실행 구조와 기록': 'Execution path and activity',
  '어디서 실행될까요?': 'Where does it run?',
  '실행 구조': 'Execution path',
  '실행 기록': 'Activity',
  비우기: 'Clear',
  '구조도는 선택한 엔진의 실행 경로입니다. 기록은 실제 쿼리 결과를 표시합니다.':
    'The diagram shows the selected engine’s execution path. Activity records actual query results.',
  'GlueSQL 문서 ↗': 'GlueSQL docs ↗',
  '현재 브라우저 탭': 'This browser tab',
  'GlueSQL 엔진': 'GlueSQL engine',
  메모리: 'Memory',
  'SQL은 WebAssembly 엔진을 거쳐 메모리에 기록됩니다.':
    'SQL runs through the WebAssembly engine and writes to memory.',
  '메모리 모드는 현재 탭에서 실행됩니다. Worker 실행은 OPFS 실험에서 확인하세요.':
    'Memory mode runs in this tab. Try an OPFS experiment to see execution in a Worker.',
  '기여 목록 조회': 'List contributions',
  '영역별 집계': 'Group by area',
  'JOIN 실행': 'Join tables',
  '직접 테이블 만들기': 'Create your own table',
  '오류 확인하기': 'Try an error',
  '나의 첫 GlueSQL': 'My first GlueSQL',
  '새로고침해도, 메모는 그대로.': 'Refresh. Your notes stay.',
  '메모를 저장한 뒤 새로고침해보세요. Worker가 OPFS 파일에 기록한 데이터는 브라우저를 다시 열어도 남습니다.':
    'Save a note, then refresh. A Worker writes to an OPFS file that persists when you reopen your browser.',
  'OPFS 파일에 영구 저장됩니다': 'Persists in an OPFS file',
  'OPFS 파일': 'OPFS file',
  'redb · 영구 저장': 'redb · persistent storage',
  'SQL은 전용 Worker에서 실행되고, 결과는 내 브라우저의 파일에 저장됩니다.':
    'SQL runs in a dedicated Worker and data is saved to a file in your browser.',
  '단일 탭 전용입니다. 같은 DB를 여러 탭에서 열려면 ‘두 탭, 하나의 DB’를 선택하세요.':
    'This mode supports a single tab. To open the same database in multiple tabs, choose “Two tabs, one database”.',
  '저장한 메모 조회': 'Read saved notes',
  '메모 개수': 'Count notes',
  '테이블 목록': 'List tables',
  '테이블 구조': 'Table schema',
  '탭은 둘이어도, 데이터는 하나.': 'Two tabs. The same data.',
  '두 번째 탭을 열고 어느 탭에서든 메모를 저장해보세요. 먼저 연 탭을 닫아도 남은 탭에서 계속 쓸 수 있습니다.':
    'Open a second tab and save a note in either one. Close the first tab and keep writing in the other.',
  '동일 브라우저의 탭끼리 공유됩니다': 'Shared across tabs in this browser',
  '같은 브라우저의 탭들': 'Tabs in this browser',
  '리더 탭의 Worker': 'Leader tab’s Worker',
  'Web Locks · 리더 선출': 'Web Locks · leader election',
  '하나의 OPFS 파일': 'One OPFS file',
  'redb · 공유 저장': 'redb · shared storage',
  '탭들이 리더 하나를 선출합니다. 리더의 Worker가 파일을 열고 쿼리를 처리합니다.':
    'The tabs elect one leader. Its Worker opens the file and handles queries.',
  '리더가 닫히면 다른 탭이 이어받습니다. 처리 중이던 쓰기는 성공 여부가 불확실할 수 있어 자동 재시도하지 않습니다.':
    'When the leader closes, another tab takes over. An in-flight write may have an unknown outcome, so writes are never retried automatically.',
  '공유 메모 조회': 'Read shared notes',
  '조회된 행이 없어요.': 'No rows yet.',
  '조건을 바꾸거나 데이터를 추가해보세요.':
    'Try another condition or add some data.',
  '위에서 메모를 저장하고 결과를 확인해보세요.':
    'Save a note above to see it here.',
  '{count}행 반영': 'Rows affected: {count}',
  '전체 {count}행 중 500행을 표시합니다. 전체 결과는 JSON으로 다운로드할 수 있어요.':
    'Showing 500 of {count} rows. Download the JSON for the full results.',
  '{count}행 · {elapsed} ms': 'Rows: {count} · {elapsed} ms',
  'SQL과 테이블 이름을 확인한 뒤 다시 실행해주세요.':
    'Check your SQL and table names, then try again.',
  '리더가 바뀌는 동안 실행 중이던 쿼리입니다. 쓰기는 반영 여부를 먼저 확인해주세요.':
    'This query was in flight during a leader change. Check whether a write took effect before retrying.',
  '실행 오류': 'Query error',
  '테이블을 만들어보세요.': 'Create a table to get started.',
  '실행할 SQL을 입력해주세요.': 'Enter some SQL to run.',
  '{types} 실행 완료': '{types} completed',
  '테이블 목록 갱신 실패: {error}': 'Could not refresh tables: {error}',
  '메모 1행 저장 완료': 'Saved 1 note',
  '메모를 저장했습니다.': 'Note saved.',
  '공유 DB 변경 확인 · 결과 갱신':
    'Shared database changed · results refreshed',
  '공유 조회가 중지되었습니다: {error}. SQL 실행으로 다시 확인해주세요.':
    'Shared reads stopped: {error}. Run SQL to check again.',
  집계해보기: 'Try aggregation',
  'JOIN 해보기': 'Try a JOIN',
  '실험 초기화': 'Reset experiment',
  '브라우저에 남길 메모를 입력하세요': 'Write a note to keep in your browser',
  '저장할 메모': 'Note to save',
  '메모 저장': 'Save note',
  '새로고침으로 확인': 'Refresh to check',
  '두 번째 탭 열기': 'Open a second tab',
  '이 탭 연결 종료': 'Disconnect this tab',
  '이 탭의 DB 연결 종료': 'Disconnected this tab from the database',
  '연결을 종료했습니다. 다른 탭에서 메모를 저장해 이어받기를 확인하세요. 이 탭은 새로고침하면 다시 연결됩니다.':
    'Disconnected. Save a note in another tab to check failover. Refresh this tab to reconnect.',
  '다시 연결': 'Reconnect',
  '같은 브라우저·프로필에서만 공유됩니다. 기본 메모 조회는 2초마다 갱신됩니다. 다른 사람에게 링크를 보내면 그 사람의 독립된 DB가 열립니다.':
    'Shared only within the same browser profile. The default note query refreshes every 2 seconds. Other visitors get their own independent database.',
  'OPFS를 사용할 수 없습니다. HTTPS 또는 localhost에서 열거나 SQL 플레이그라운드를 선택해주세요.':
    'OPFS is unavailable. Open this site over HTTPS or localhost, or choose SQL playground.',
  '이 브라우저는 멀티탭 공유에 필요한 Web Locks / BroadcastChannel을 지원하지 않습니다. 다른 실험을 선택해주세요.':
    'This browser does not support Web Locks / BroadcastChannel, which shared mode requires. Choose another experiment.',
  'Worker 기반 OPFS 진입점': 'Worker-based OPFS entry point',
  'Worker 프록시 브라우저 테스트': 'Worker proxy browser tests',
  'redb 기반 OPFS 스토리지': 'redb-based OPFS storage',
  'OPFS npm 패키징': 'OPFS npm packaging',
  'OPFS 예제와 테스트': 'OPFS examples and tests',
  '멀티탭 공유와 장애 복구': 'Multi-tab sharing and failover',
  'UI 밖에서 SQL 실행': 'Run SQL outside the UI thread',
  '브라우저에서 동작 검증': 'Verify behavior in the browser',
  '파일 저장과 공유': 'File persistence and sharing',
  '설치해서 바로 사용': 'Install and start using',
  '{engine} 연결 완료': '{engine} connected',
  '공유된 SQL을 불러왔습니다. 내용을 확인한 뒤 SQL 실행을 눌러주세요. 데이터는 공유되지 않습니다.':
    'Shared SQL loaded. Review it, then press Run SQL. Database contents are not shared.',
  '테이블 목록을 갱신했습니다.': 'Tables refreshed.',
  '목록 갱신 실패: {error}': 'Could not refresh the list: {error}',
  '공유할 SQL은 20,000자 이하로 줄여주세요.':
    'Shorten your SQL to 20,000 characters or fewer to share it.',
  '쿼리 링크를 복사했습니다. 데이터는 포함되지 않습니다.':
    'Query link copied. Database contents are not included.',
  '클립보드에 접근할 수 없습니다. 아래 링크를 직접 복사해주세요.':
    'Clipboard access is unavailable. Copy the link below.',
  '공유 쿼리 링크': 'Shared query link',
  '엔진 연결을 확인해주세요.': 'Check the engine connection.',
  '연결 실패: {error}{hint}': 'Connection failed: {error}{hint}',
  ' 같은 실험을 연 다른 탭이 있다면 닫고 새로고침하거나 멀티탭 실험을 선택해주세요.':
    ' Close any other tabs running this experiment and refresh, or choose the shared experiment.',
  '블록 {block} · 오프셋 {offset}부터 {count}바이트 · 16진수 / ASCII':
    'Block {block} · {count} bytes from offset {offset} · Hex / ASCII',
  '이 페이지를 열기 전부터 있던 파일을 다시 읽었습니다.':
    'Reopened a file that existed before this page loaded.',
  '이번 연결에서 만들어진 실제 .db 파일입니다.':
    'This connection created this actual .db file.',
  '실제 OPFS 파일에서 읽은 정보입니다.': 'Read from the actual OPFS file.',
  '{time} 관측': 'Observed at {time}',
  '앞쪽 {preview} / 전체 {total}': 'First {preview} / {total} total',
  '비교 기준 {time}': 'Baseline at {time}',
  '{start}–{end} bytes · {count}바이트 변경':
    '{start}–{end} bytes · {count} bytes changed',
  '블록 {block}: {count}바이트 변경{absent}':
    'Block {block}: {count} bytes changed{absent}',
  ', 현재 파일에는 없음': ', absent from the current file',
  '파일 상태를 확인할 수 없습니다.': 'File status is unavailable.',
  '아직 파일이 없거나 삭제되었습니다. DB에 연결한 뒤 파일 다시 읽기를 눌러주세요.':
    'The file does not exist yet or was removed. Connect to the database, then press Refresh file.',
  '파일 관측 실패: {error}. 이 관측 결과는 SQL 실행 성공 여부와 별개입니다.':
    'File observation failed: {error}. This does not indicate whether the SQL succeeded.',
};

const storageKey = 'gluesql-lab-language';
const validPreference = (value) =>
  ['en', 'ko'].includes(value) ? value : 'auto';
let preference = 'auto';
try {
  preference = validPreference(localStorage.getItem(storageKey));
} catch {
  // The picker still works for this visit if browser storage is restricted.
}

function browserLanguage() {
  for (const language of navigator.languages?.length
    ? navigator.languages
    : [navigator.language]) {
    const base = language?.toLowerCase().split('-')[0];
    if (base === 'en' || base === 'ko') return base;
  }
  return 'en';
}

export let language = preference === 'auto' ? browserLanguage() : preference;
export const locale = () => (language === 'ko' ? 'ko-KR' : 'en-US');
export function t(message, params = {}, selectedLanguage = language) {
  const translated =
    selectedLanguage === 'en' && Object.hasOwn(english, message)
      ? english[message]
      : message;
  return translated.replace(/\{(\w+)\}/g, (match, key) =>
    String(params[key] ?? match),
  );
}

// Only explicitly bound interface text is translated. SQL and database values
// never pass through this layer. WeakMap entries disappear with removed nodes.
const bindings = new WeakMap();
function renderBinding(node, attribute, binding) {
  const params =
    typeof binding.params === 'function' ? binding.params() : binding.params;
  const value = t(binding.message, params);
  if (attribute === 'text') node.textContent = value;
  else node.setAttribute(attribute, value);
}
function bind(node, attribute, message, params) {
  const values = bindings.get(node) ?? new Map();
  const binding = { message, params };
  values.set(attribute, binding);
  bindings.set(node, values);
  node.setAttribute(
    attribute === 'text' ? 'data-i18n' : `data-i18n-${attribute}`,
    message,
  );
  renderBinding(node, attribute, binding);
  return node;
}
export const text = (node, message, params = {}) =>
  bind(node, 'text', message, params);
export const attr = (node, attribute, message, params = {}) =>
  bind(node, attribute, message, params);

function translatePage() {
  document.documentElement.lang = language;
  for (const attribute of [
    'text',
    'aria-label',
    'title',
    'placeholder',
    'content',
  ]) {
    const marker =
      attribute === 'text' ? 'data-i18n' : `data-i18n-${attribute}`;
    for (const node of document.querySelectorAll(`[${marker}]`)) {
      const binding = bindings.get(node)?.get(attribute);
      if (binding) renderBinding(node, attribute, binding);
      else
        bind(
          node,
          attribute,
          node.getAttribute(marker) ||
            (attribute === 'text'
              ? node.textContent
              : node.getAttribute(attribute)
            )
              .trim()
              .replace(/\s+/g, ' '),
          {},
        );
    }
  }
  document.querySelector('#language').value = preference;
}
function updateLanguage() {
  const previousLanguage = language;
  language = preference === 'auto' ? browserLanguage() : preference;
  translatePage();
  if (previousLanguage !== language)
    dispatchEvent(
      new CustomEvent('lab:languagechange', {
        detail: { previousLanguage, language },
      }),
    );
}
document.querySelector('#language').addEventListener('change', (event) => {
  preference = validPreference(event.target.value);
  try {
    if (preference === 'auto') localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, preference);
  } catch {
    // A manual choice must work even without localStorage.
  }
  updateLanguage();
});
addEventListener('languagechange', () => {
  if (preference === 'auto') updateLanguage();
});
translatePage();
