const ng = require('../utils/namegen.js');
const { CHARS, CHAR_MAP, byWuxing } = require('../utils/../data/chars.js');
const { getBazi } = require('../utils/bazi.js');

console.log('CHARS:', CHARS.length, '| CHAR_MAP:', Object.keys(CHAR_MAP).length, '| byWuxing(木):', byWuxing('木').length);

function run(name, fn) {
  try {
    const r = fn();
    console.log('OK  ' + name + ' ->', Array.isArray(r) ? r.length + ' 条' : typeof r);
  } catch (e) {
    console.log('FAIL ' + name + ' ->', e.message);
  }
}

run('poetryNames(全部)', () => ng.poetryNames('全部', ''));
run('poetryNames(诗经,静)', () => ng.poetryNames('诗经', '静'));
run('baziNames(池,金水木,2)', () => ng.baziNames('池', ['金', '水', '木'], 2, 18));
run('fixedNames(王,知)', () => ng.fixedNames('王', '知', 18));
run('twinNames(王,shared)', () => ng.twinNames('王', 'shared'));
run('twinNames(王,poem)', () => ng.twinNames('王', 'poem'));
run('siblingNames(王,3,文)', () => ng.siblingNames('王', 3, '文'));
run('testName(池,梓杰)', () => ng.testName('池', '梓杰'));
run('testName(王,一)', () => ng.testName('王', '一'));

// 排盘联调
try {
  const f = getBazi({ y: 2018, m: 4, d: 7, h: 15 });
  console.log('OK  getBazi ->', f.baziText.join(' '), '| 喜用', f.xiYong.join('/'), '| 纳音', f.nayin.map(n=>n.name).join(' '));
} catch (e) { console.log('FAIL getBazi ->', e.message); }
