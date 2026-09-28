// tools/test_engine.js · 引擎自检（Node 运行，不进包）
const { getBazi } = require('../utils/bazi.js');
const { computeWuge } = require('../utils/wuge.js');
const { poetryNames, baziNames, fixedNames, twinNames, siblingNames, testName } = require('../utils/namegen.js');

console.log('=== 八字五行 ===');
const b = getBazi({ y: 2018, m: 4, d: 7, h: 15 });
console.log('四柱:', b.baziText.join(' '));
console.log('五行:', JSON.stringify(b.wuxing));
console.log('日主:', b.dayMaster, '| 强弱:', b.strength.level, '| 评分:', b.strength.score, JSON.stringify(b.strength.dims));
console.log('喜用:', b.xiYong.join(' '), '| 忌:', b.jiShen.join(' '));

// 连续性自检：日 +1 应推进一个干支
const b2 = getBazi({ y: 2018, m: 4, d: 8, h: 15 });
console.log('次日四柱:', b2.baziText.join(' '), '(日柱应比上例 +1)');

console.log('\n=== 五格剖象（池梓杰）===');
const w = computeWuge('池', '梓杰');
console.log(JSON.stringify(w, null, 0));

console.log('\n=== 姓名测试（池易柯）===');
const t = testName('池', '易柯');
console.log('full:', t.full, '| 音律:', t.soundNote);
console.log('wuge.available:', t.wuge.available, '| 缺字:', t.wuge.missing);

console.log('\n=== 诗词起名（诗经）===');
console.log('条数:', poetryNames('诗经').length);

console.log('\n=== 八字起名（喜用 木 火）===');
const bn = baziNames('池', ['木', '火'], 2, 6);
console.log(bn.map(x => x.full + '(' + x.wx.join('') + ')').join('  '));

console.log('\n=== 定字起名（定字：梓）===');
const fn = fixedNames('池', '梓', 6);
console.log(fn.map(x => x.full).join('  '));

console.log('\n=== 双胞胎（共享一字）===');
const tw = twinNames('池', 'shared');
console.log(tw[0].shared, '→', tw[0].pair.map(p => p.name).join(' / '));

console.log('\n=== 兄弟姐妹（2人，辈分字：知）===');
const sb = siblingNames('池', 2, '知');
console.log('辈分字:', sb.gen, '|', sb.names.map(n => n.name).join(' / '));
