import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../share.js', import.meta.url), 'utf8');
const destination = 'https://vijay.savvyagents.work/';
for (const mode of ['share', 'copy', 'cancel', 'failure']) {
  let click;
  let result;
  const status = { textContent: '' };
  const navigator = mode === 'copy' ? { clipboard: { writeText: async url => { result = url; } } } : {
    share: async data => {
      if (mode === 'cancel') { throw { name: 'AbortError' }; }
      if (mode === 'failure') { throw new Error('Unavailable'); }
      result = data.url;
    }
  };
  runInNewContext(source, {
    navigator,
    document: { getElementById: id => id === 'share-status' ? status : { addEventListener: (_, handler) => { click = handler; } } }
  });
  await click();
  if (mode === 'share' || mode === 'copy') { assert.equal(result, destination); }
  if (mode === 'copy') { assert.equal(status.textContent, 'Page link copied.'); }
  if (mode === 'cancel') { assert.equal(status.textContent, ''); }
  if (mode === 'failure') { assert.match(status.textContent, /vijay\.savvyagents\.work/); }
}
console.log('PASS: native sharing, clipboard fallback, cancellation, and error recovery.');
