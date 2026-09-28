// utils/kit.js · 知行起名「瑞士军刀」扩展工具（纯逻辑，Node 安全，无 wx 依赖）
// 功能：字典单字精解 / 生肖推荐 / 藏头诗 / 谐音避坑 / 姓名配对 / 每日美名

const { CHAR_MAP, byWuxing, CHARS } = require('../data/chars.js');
const { ZODIAC, getZodiac } = require('../data/zodiac.js');
const { DAILY } = require('../data/daily_names.js');
const { CHAR_HOMO, COMBO_HOMO, POLYPHONE, SOFT, STRONG, RARE } = require('../data/homophone.js');
const { commonWx } = require('../data/common_extra.js');
const { computeWuge, getStroke } = require('./wuge.js');
const { testName } = require('./namegen.js');

// ===== 通用 =====
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// ===== 字典·单字精解 =====
function getCharDetail(z) {
  return CHAR_MAP[z] || null;
}

// 按五行浏览字库（返回整组）
function charsByWuxing(wx) {
  return byWuxing(wx);
}

// 随机好字（用于"随机一个好字"）
function randomGoodChar() {
  const i = Math.floor(Math.random() * CHARS.length);
  return CHARS[i];
}

// ===== 生肖起名推荐 =====
function zodiacRecommend(zodiacKey, surname, count) {
  const z = getZodiac(zodiacKey);
  if (!z || !surname) return [];
  count = count || 12;
  const out = [];
  const seen = {};
  for (const wx of z.xiWx) {
    const pool = byWuxing(wx);
    for (const a of pool) {
      const partners = CHARS.filter(c => c.z !== a.z).slice(0, 5);
      for (const b of partners) {
        const name = a.z + b.z;
        if (seen[name]) continue;
        seen[name] = true;
        const py = a.py + ' ' + b.py;
        const full = surname + name;
        out.push({
          name, full, py,
          wx: [a.wx, b.wx],
          yy: a.yy + '；' + b.yy
        });
        if (out.length >= count) return out;
      }
    }
  }
  return out;
}

// ===== 藏头诗 =====
const TAILS = {
  木: {
    w5: ['风前立翠微', '临水弄清辉', '向阳木欣欣', '扶疏带露开', '幽香满袖来'],
    w7: ['一庭疏影弄清辉', '东风化雨润芳菲', '幽人独赏岁寒姿', '绿遍江南春自知']
  },
  火: {
    w5: ['晴光入绮窗', '丹心映日红', '暖律动新阳', '明霞照锦堂', '焰焰吐清光'],
    w7: ['一轮红日映楼台', '灯火阑珊夜未央', '丹心向阳自生辉', '暖风吹绽碧桃开']
  },
  土: {
    w5: ['厚地载清阴', '安卧听松声', '坦荡见平生', '山稳立云根', '宽怀纳海川'],
    w7: ['厚德载物自安然', '安得广厦庇千秋', '稳如山岳立乾坤', '坦荡胸襟纳百川']
  },
  金: {
    w5: ['清响出金石', '素月照琼楼', '铮然有正声', '玉珮响琳琅', '精金待火鍊'],
    w7: ['金石为开赖至诚', '清音一曲动梁尘', '玉树琼枝映月明', '百鍊成钢自有神']
  },
  水: {
    w5: ['澄澈见天心', '清流漱玉琴', '涵虚纳远岑', '渊渟自抱真', '微澜动素波'],
    w7: ['一泓清水照禅心', '海纳百川自有容', '烟波江上使人思', '润物无声春自知']
  },
  通用: {
    w5: ['清风伴月明', '年华不负春', '初心贵守真', '长歌怀采薇', '悠然见远岑'],
    w7: ['天地悠然一叶舟', '清辞丽句写春秋', '人间何处不风流', '寸心千古自悠悠']
  }
};

function buildAcrostic(name, type) {
  const chars = Array.from(name || '').filter(c => c.trim());
  if (!chars.length) return null;
  const is7 = (type === '7');
  const lines = chars.map((c, i) => {
    const detail = CHAR_MAP[c];
    const cat = detail && detail.wx ? detail.wx : '通用';
    const bank = TAILS[cat] || TAILS['通用'];
    const tails = is7 ? bank.w7 : bank.w5;
    const tail = tails[(c.charCodeAt(0) + i) % tails.length];
    return {
      head: c,
      tail,
      line: c + tail,
      wx: detail ? detail.wx : null,
      yy: detail ? detail.yy : '（字库未详，寓意可自由寄寓）'
    };
  });
  const title = '《藏头·' + chars.join('') + '》';
  const poemText = lines.map(l => l.line).join('，') + '。';
  const yys = lines.map(l => l.head + '：' + l.yy).join('；');
  const note = '以「' + chars.join('') + '」嵌于句首，借草木山川、风月清辉之象寄寓美意。藏头诗为趣味生成，仅供创作灵感与雅玩，不作任何断言。';
  return { title, lines, poemText, yys, note };
}

// ===== 谐音避坑 =====
function checkHomophone(surname, given) {
  const s = (surname || '').trim();
  const g = (given || '').trim();
  const full = s + g;
  const all = Array.from(full);
  const charHints = [];
  all.forEach(c => {
    if (CHAR_HOMO[c]) charHints.push({ char: c, note: CHAR_HOMO[c] });
  });
  const combos = [];
  COMBO_HOMO.forEach(item => {
    if (full.indexOf(item.match) >= 0) combos.push(item);
  });
  const poly = all.filter(c => POLYPHONE.indexOf(c) >= 0);
  // 生僻/复杂字精确判定：仅判真正生僻字（RARE），并排除已收录好字库与常用字表，避免误伤普通常用字
  const rare = Array.from(g).filter(c => RARE.indexOf(c) >= 0 && !CHAR_MAP[c] && commonWx(c) == null);
  // 气质
  let gender = '刚柔并济 · 中性';
  let soft = 0, strong = 0;
  Array.from(g).forEach(c => {
    if (SOFT.indexOf(c) >= 0) soft++;
    if (STRONG.indexOf(c) >= 0) strong++;
  });
  if (soft > strong) gender = '偏柔美 · 更常用于女名';
  else if (strong > soft) gender = '偏刚健 · 更常用于男名';

  return {
    full, charHints, combos, poly, rare, gender,
    summary: buildHomoSummary(charHints, combos, poly, rare)
  };
}

function buildHomoSummary(charHints, combos, poly, rare) {
  const parts = [];
  if (combos.length) parts.push('发现 ' + combos.length + ' 处连读谐音需注意');
  if (charHints.length) parts.push(charHints.length + ' 个单字谐音提示');
  if (poly.length) parts.push(poly.length + ' 个多音字（请确认读音）');
  if (rare.length) parts.push(rare.length + ' 个生僻复杂字（建议斟酌，避免户籍录入困扰）');
  if (!parts.length) return '未检出明显谐音、生僻与多音风险，读音较为清爽。';
  return '共 ' + parts.join('；') + '。';
}

// ===== 姓名配对 =====
function analyzeName(item) {
  const r = testName(item.surname || '', item.given || '');
  return r;
}

function pairNames(a, b) {
  const wa = analyzeName(a);
  const wb = analyzeName(b);
  const setA = new Set(wa.wxList);
  const setB = new Set(wb.wxList);
  const union = new Set([...setA, ...setB]);
  const inter = [...setA].filter(x => setB.has(x));
  const onlyA = [...setA].filter(x => !setB.has(x));
  const onlyB = [...setB].filter(x => !setA.has(x));

  // 笔画和谐（能用则用）
  const sa = strokeSum(a), sb = strokeSum(b);

  // 默契指数（确定性 62~99）
  const h = hashStr(wa.full + '|' + wb.full);
  const index = 62 + (h % 38);

  let tier = '相识有缘';
  if (index >= 92) tier = '天作之合';
  else if (index >= 85) tier = '默契十足';
  else if (index >= 75) tier = '相知相惜';
  else if (index >= 68) tier = '合拍可人';

  let comment = '两人名字五行' + (onlyA.length + onlyB.length >= 3 ? '互补性较好' : '各有侧重') +
    '，音形义搭配可作趣味参考；默契指数仅供娱乐，感情仍需用心经营。';

  return {
    a: { full: wa.full, wuge: wa.wuge, wxList: wa.wxList },
    b: { full: wb.full, wuge: wb.wuge, wxList: wb.wxList },
    union: [...union],
    inter,
    onlyA, onlyB,
    strokeA: sa, strokeB: sb,
    index, tier, comment
  };
}

function strokeSum(item) {
  const sChars = Array.from(item.surname || '');
  const gChars = Array.from(item.given || '');
  let sum = 0, ok = true;
  for (const c of sChars) { const v = getStroke(c); if (v == null) ok = false; else sum += v; }
  for (const c of gChars) { const v = getStroke(c); if (v == null) ok = false; else sum += v; }
  return ok ? sum : null;
}

// ===== 每日美名 =====
function dailyName(date) {
  const d = date || new Date();
  let dayOfYear;
  if (typeof d === 'number') dayOfYear = d;
  else {
    const start = Date.UTC(d.getFullYear(), 0, 0);
    dayOfYear = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86400000);
  }
  const idx = dayOfYear % DAILY.length;
  return { ...DAILY[idx], index: idx, dayOfYear };
}

module.exports = {
  getCharDetail, charsByWuxing, randomGoodChar,
  zodiacRecommend, buildAcrostic, checkHomophone, pairNames, dailyName, hashStr
};
