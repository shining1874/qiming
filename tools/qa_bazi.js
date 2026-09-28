const B = require('../utils/bazi.js');

function show(label, info, sex) {
  const f = B.getBazi(info);
  const d = B.getDayun(info, sex);
  console.log('\n==== ' + label + ' ====');
  console.log('四柱:', f.baziText.join(' '));
  console.log('日主:', f.dayMaster, '| 身:', f.strength.level, JSON.stringify(f.strength.dims), '| 得分', f.strength.score);
  console.log('喜用:', f.xiYong.join('/'), '| 忌:', f.jiShen.join('/'));
  console.log('五行:', JSON.stringify(f.wuxing));
  console.log('旺衰:', JSON.stringify(f.wang));
  console.log('纳音:', f.nayin.map(n => n.name).join(' '));
  console.log('旬空:', f.xunkong.map(x => x.join('')).join(' '));
  console.log('十神(干/支):', f.shishen.map(s => s.gan + '/' + s.zhi).join(' '));
  console.log('藏干:', f.zang.map(z => z.map(g => g.gan).join('')).join(' | '));
  console.log('大运:', d.forward ? '顺' : '逆', '起运', d.qiYears + '岁' + d.qiMonths + '月', '首运', d.firstStep);
  console.log('大运表:', d.steps.map(s => s.ageRange + ':' + s.gz).join('  '));
}

show('池姓男宝 2018-04-07 15:00', { y: 2018, m: 4, d: 7, h: 15 }, '男');
show('对照 2000-01-01 08:00 女', { y: 2000, m: 1, d: 1, h: 8 }, '女');
show('对照 1990-08-15 22:00 男', { y: 1990, m: 8, d: 15, h: 22 }, '男');

// 解读样例
const f = B.getBazi({ y: 2018, m: 4, d: 7, h: 15 });
const d = B.getDayun({ y: 2018, m: 4, d: 7, h: 15 }, '男');
const ex = B.explainBazi(f, d);
console.log('\n==== 白话解读（池姓男宝）====');
console.log('日主:', ex.dayMaster);
console.log('五行:', ex.wxDist);
console.log('身强:', ex.strength);
console.log('喜用:', ex.xiYong);
console.log('大运:', ex.dayun);
console.log('结语:', ex.closing);
