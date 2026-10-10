'use strict';
const e = require('./engine.js');
const cases = require('./expected.json');
let checks = 0, fails = 0;
function eq(a, b, label) {
  checks++;
  if (a !== b) { fails++; console.log('FAIL', label, 'engine:', a, 'oracle:', b); }
}
for (const c of cases) {
  let r, text;
  if (c.tool === 'dough') { r = e.doughYield(...c.args); text = e.renderDough(r); }
  else if (c.tool === 'filling') { r = e.fillingMatch(...c.args); text = e.renderFilling(r); }
  else { r = e.batchCook(...c.args); text = e.renderCook(r); }
  const keys = new Set([...Object.keys(r), ...Object.keys(c.expect)]);
  for (const k of keys) eq(JSON.stringify(r[k]), JSON.stringify(c.expect[k]), c.tool + ' ' + JSON.stringify(c.args) + ' .' + k);
  checks++;
  if (r.error) { if (text !== r.error) { fails++; console.log('FAIL render error passthrough', text); } }
  else if (typeof text !== 'string' || text.length < 5 || /error|undefined|NaN/.test(text)) { fails++; console.log('FAIL render text', text); }
}
eq(e.renderDough(e.doughYield(500,55,12)), '775 g of dough makes 64 wrappers with 7 g left over.', 'render dough default');
eq(e.renderFilling(e.fillingMatch(64,15,1000)), 'You need 960 g of filling - enough for every wrapper, 40 g spare.', 'render filling default');
eq(e.renderCook(e.batchCook(64,12,8)), '6 rounds, 48 minutes total; last round holds 4.', 'render cook default');
console.log(checks + ' checks, ' + fails + ' failures over ' + cases.length + ' cases');
process.exit(fails ? 1 : 0);
