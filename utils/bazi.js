// utils/bazi.js
// 知行起名 · 八字五行（传统文化参考，纯属娱乐，非命运断言）
// 公历 → 四柱干支 + 五行统计 + 日主强弱与喜用方向（自洽算法，不依赖外部引擎）
// 增强：藏干 / 纳音 / 旬空 / 十神 / 月令旺衰 / 大运 / 白话解读
// 说明：节气按近似值（误差 1 日内）处理，用于姓名学五行参考；不作精确命理用途。

const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GAN_WX = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
// 地支本气五行（与 ZHI 顺序一致）
const ZHI_BASE_WX = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
// 干阴阳（0=阳 1=阴）：甲丙戊庚壬阳，乙丁己辛癸阴
const GAN_YIN = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
const ZHI_YIN = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

// 地支藏干 [本气, 中气, 余气]，存的是「干索引」，无则 null
const ZANG = {
  0: [9],            // 子：癸
  1: [5, 9, 7],      // 丑：己癸辛
  2: [0, 2, 4],      // 寅：甲丙戊
  3: [1],            // 卯：乙
  4: [4, 1, 9],      // 辰：戊乙癸
  5: [2, 7, 4],      // 巳：丙庚戊
  6: [3, 5],         // 午：丁己
  7: [5, 3, 1],      // 未：己丁乙
  8: [7, 9, 4],      // 申：庚壬戊
  9: [8],            // 酉：辛
  10: [4, 7, 3],     // 戌：戊辛丁
  11: [9, 0]         // 亥：壬甲
};

// 六十甲子纳音（索引 0..29，每值对应连续两个干支）
const NAYIN_NAME = [
  '海中金', '炉中火', '大林木', '路旁土', '剑锋金', '山头火', '涧下水', '城头土', '白蜡金', '杨柳木',
  '泉中水', '屋上土', '霹雳火', '松柏木', '长流水', '沙中金', '山下火', '平地木', '壁上土', '金箔金',
  '覆灯火', '天河水', '大驿土', '钗钏金', '桑柘木', '大溪水', '沙中土', '天上火', '石榴木', '大海水'
];
const NAYIN_WX = [
  '金', '火', '木', '土', '金', '火', '水', '土', '金', '木', '水', '土', '火', '木', '水', '金',
  '火', '木', '土', '金', '金', '火', '水', '土', '金', '木', '水', '土', '火', '木'
];

// 旬空：甲子旬空戌亥，甲戌旬空申酉…… 存地支索引
const XK = [[10, 11], [8, 9], [6, 7], [4, 5], [2, 3], [0, 1]];

// 十二节近似日期（用于定月柱 / 大运起运），按公历顺序（节，非气）
const JIE = [
  { m: 1, d: 6, zhi: 1 },   // 小寒 → 丑
  { m: 2, d: 4, zhi: 2 },   // 立春 → 寅
  { m: 3, d: 6, zhi: 3 },   // 惊蛰 → 卯
  { m: 4, d: 5, zhi: 4 },   // 清明 → 辰
  { m: 5, d: 6, zhi: 5 },   // 立夏 → 巳
  { m: 6, d: 6, zhi: 6 },   // 芒种 → 午
  { m: 7, d: 7, zhi: 7 },   // 小暑 → 未
  { m: 8, d: 8, zhi: 8 },   // 立秋 → 申
  { m: 9, d: 8, zhi: 9 },   // 白露 → 酉
  { m: 10, d: 8, zhi: 10 }, // 寒露 → 戌
  { m: 11, d: 7, zhi: 11 }, // 立冬 → 亥
  { m: 12, d: 7, zhi: 0 }   // 大雪 → 子
];

// 五虎遁：寅月天干（依年干）
const WU_HU = { 0: 2, 1: 4, 2: 6, 3: 8, 4: 0, 5: 2, 6: 4, 7: 6, 8: 8, 9: 0 };
// 五鼠遁：子时天干（依日干）
const WU_SHU = { 0: 0, 1: 2, 2: 4, 3: 6, 4: 8, 5: 0, 6: 2, 7: 4, 8: 6, 9: 8 };

const WX = ['木', '火', '土', '金', '水'];
const SHENG = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }; // 我生
const KE = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };    // 我克

function mod(n, m) { return ((n % m) + m) % m; }

function daysFrom1900(y, m, d) {
  const base = Date.UTC(1900, 0, 1);
  const cur = Date.UTC(y, m - 1, d);
  return Math.floor((cur - base) / 86400000);
}

// 干支序号（0=甲子 … 59=癸亥）
function gzIndex(g, z) {
  for (let n = 0; n < 60; n++) { if (n % 10 === g && n % 12 === z) return n; }
  return 0;
}

// 年柱（立春为界，近似 2/4）
function getYearPillar(y, m, d) {
  const ey = (m < 2 || (m === 2 && d < 4)) ? y - 1 : y;
  const g = mod(ey - 4, 10);
  const z = mod(ey - 4, 12);
  return { gan: GAN[g], zhi: ZHI[z], gIdx: g, zIdx: z };
}

// 月柱（依节气近似 + 五虎遁）
function getMonthPillar(y, m, d, yearGanIdx) {
  let zhi = 0;
  for (const j of JIE) {
    if ((m > j.m) || (m === j.m && d >= j.d)) zhi = j.zhi;
  }
  const gan = mod(WU_HU[yearGanIdx] + (zhi - 2), 10);
  return { gan: GAN[gan], zhi: ZHI[zhi], gIdx: gan, zIdx: zhi };
}

// 日柱
function getDayPillar(y, m, d) {
  const idx = daysFrom1900(y, m, d) + 10; // 1900-01-01 为甲戌
  const g = mod(idx, 10);
  const z = mod(idx, 12);
  return { gan: GAN[g], zhi: ZHI[z], gIdx: g, zIdx: z };
}

// 时柱（依日干 + 五鼠遁）
function getHourPillar(h, dayGanIdx) {
  const zh = mod(Math.floor((h + 1) / 2), 12);
  const g = mod(WU_SHU[dayGanIdx] + zh, 10);
  return { gan: GAN[g], zhi: ZHI[zh], gIdx: g, zIdx: zh };
}

function countWuxing(pillars) {
  const cnt = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  pillars.forEach(p => { cnt[GAN_WX[p.gIdx]]++; cnt[ZHI_BASE_WX[p.zIdx]]++; });
  return cnt;
}

// 十神（相对日干 gIdx），入参为「目标干索引」
function shiShen(dg, tg) {
  if (tg === dg) return '比肩';
  const wm = GAN_WX[dg], wt = GAN_WX[tg];
  const sameYin = (GAN_YIN[dg] === GAN_YIN[tg]);
  if (wm === wt) return sameYin ? '比肩' : '劫财';
  if (wt === SHENG[wm]) return sameYin ? '食神' : '伤官';   // 我生
  if (SHENG[wt] === wm) return sameYin ? '偏印' : '正印';    // 生我
  if (wt === KE[wm]) return sameYin ? '偏财' : '正财';       // 我克
  if (KE[wt] === wm) return sameYin ? '七杀' : '正官';       // 克我
  return '—';
}

// 日主强弱（四维简化评分，仅作姓名学五行参考）
function evaluateStrength(pillars, dayMaster) {
  let dLing = 0;
  const mWx = ZHI_BASE_WX[pillars[1].zIdx];
  if (mWx === dayMaster) dLing = 2;
  else if (SHENG[mWx] === dayMaster) dLing = 1;

  let dDi = 0;
  pillars.forEach((p, i) => {
    if (i === 2) return;
    if (ZHI_BASE_WX[p.zIdx] === dayMaster) dDi++;
  });
  dDi = Math.min(2, dDi);

  let dSheng = 0;
  pillars.forEach((p, i) => {
    if (i === 2) return;
    if (SHENG[GAN_WX[p.gIdx]] === dayMaster) dSheng++;
    if (SHENG[ZHI_BASE_WX[p.zIdx]] === dayMaster) dSheng++;
  });
  dSheng = Math.min(2, dSheng);

  let dZhu = 0;
  pillars.forEach((p, i) => {
    if (i === 2) return;
    if (GAN_WX[p.gIdx] === dayMaster) dZhu++;
    if (ZHI_BASE_WX[p.zIdx] === dayMaster) dZhu++;
  });
  dZhu = Math.min(2, dZhu);

  const score = dLing + dDi + dSheng + dZhu;
  let level = '中和';
  if (score >= 5) level = '身强';
  else if (score <= 2) level = '身弱';

  return { score, level, dims: { 得令: dLing, 得地: dDi, 得生: dSheng, 得助: dZhu } };
}

function keWo(w) { for (const k in KE) if (KE[k] === w) return k; return null; }
function shengWo(w) { for (const k in SHENG) if (SHENG[k] === w) return k; return null; }

function getXiYong(dayMaster, level) {
  if (level === '身强') {
    return {
      xi: [SHENG[dayMaster], KE[dayMaster], keWo(dayMaster)].filter(Boolean),
      ji: [dayMaster, shengWo(dayMaster)].filter(Boolean)
    };
  } else if (level === '身弱') {
    return {
      xi: [shengWo(dayMaster), dayMaster].filter(Boolean),
      ji: [KE[dayMaster], SHENG[dayMaster]].filter(Boolean)
    };
  }
  return { xi: WX.slice(), ji: [] };
}

// 月令旺相休囚死
function wangshuai(monthZhiIdx) {
  const ml = ZHI_BASE_WX[monthZhiIdx];
  const map = {};
  WX.forEach(w => {
    if (w === ml) map[w] = '旺';
    else if (SHENG[ml] === w) map[w] = '相';
    else if (SHENG[w] === ml) map[w] = '休';
    else if (KE[ml] === w) map[w] = '囚';
    else if (KE[w] === ml) map[w] = '死';
  });
  return map;
}

function getBazi(info) {
  const { y, m, d, h } = info;
  const yP = getYearPillar(y, m, d);
  const mP = getMonthPillar(y, m, d, yP.gIdx);
  const dP = getDayPillar(y, m, d);
  const hP = getHourPillar(h, dP.gIdx);
  const pillars = [yP, mP, dP, hP];
  const wuxing = countWuxing(pillars);
  const dayMaster = GAN_WX[dP.gIdx];
  const strength = evaluateStrength(pillars, dayMaster);
  const xy = getXiYong(dayMaster, strength.level);

  // 藏干
  const zang = pillars.map(p => ZANG[p.zIdx].filter(x => x != null).map(g => ({ g, gan: GAN[g], wx: GAN_WX[g] })));
  // 纳音
  const nayin = pillars.map(p => {
    const n = gzIndex(p.gIdx, p.zIdx);
    return { wx: NAYIN_WX[Math.floor(n / 2)], name: NAYIN_NAME[Math.floor(n / 2)] };
  });
  // 旬空
  const xunkong = pillars.map(p => {
    const n = gzIndex(p.gIdx, p.zIdx);
    const xk = XK[Math.floor(n / 10)];
    return [ZHI[xk[0]], ZHI[xk[1]]];
  });
  // 十神（天干 + 地支本气，相对日干）
  const shishen = pillars.map((p, i) => ({
    gan: i === 2 ? '日主' : shiShen(dP.gIdx, p.gIdx),
    zhi: shiShen(dP.gIdx, ZANG[p.zIdx][0])
  }));
  // 旺衰
  const wang = wangshuai(mP.zIdx);

  return {
    pillars, wuxing, dayMaster, strength,
    xiYong: xy.xi, jiShen: xy.ji,
    zang, nayin, xunkong, shishen, wang,
    baziText: pillars.map(p => p.gan + p.zhi)
  };
}

// ===== 大运 =====
function getDayun(info, sex) {
  const { y, m, d } = info;
  const yP = getYearPillar(y, m, d);
  const mP = getMonthPillar(y, m, d, yP.gIdx);
  const dP = getDayPillar(y, m, d);

  // 当前月令所属「节」索引
  let curJie = 0;
  for (let i = 0; i < JIE.length; i++) {
    if ((m > JIE[i].m) || (m === JIE[i].m && d >= JIE[i].d)) curJie = i;
  }

  const birthUtc = Date.UTC(y, m - 1, d);
  const yangYear = GAN_YIN[yP.gIdx] === 0;
  const male = (sex === '男' || sex === 'm' || sex === 1 || sex === 'M');
  // 阳年男 / 阴年女 → 顺排；阴年男 / 阳年女 → 逆排
  const forward = (yangYear && male) || (!yangYear && !male);

  let days;
  if (forward) {
    const nj = (curJie + 1) % 12;
    let ny = y;
    if (nj <= curJie) ny = y + 1; // 跨年（如 大雪→小寒）
    const nextUtc = Date.UTC(ny, JIE[nj].m - 1, JIE[nj].d);
    days = Math.round((nextUtc - birthUtc) / 86400000);
  } else {
    const prevUtc = Date.UTC(y, JIE[curJie].m - 1, JIE[curJie].d);
    days = Math.round((birthUtc - prevUtc) / 86400000);
  }

  const qiYears = Math.floor(days / 3);
  const qiMonths = (days % 3) * 4; // 1 日 = 4 个月

  const mN = gzIndex(mP.gIdx, mP.zIdx);
  const steps = [];
  for (let k = 1; k <= 8; k++) {
    const n = forward ? (mN + k) % 60 : mod(mN - k, 60);
    const g = n % 10, z = n % 12;
    const startAge = qiYears + (k - 1) * 10;
    steps.push({
      idx: k, gz: GAN[g] + ZHI[z], gan: GAN[g], zhi: ZHI[z],
      ganWx: GAN_WX[g], zhiBaseWx: ZHI_BASE_WX[z],
      ageRange: startAge + '-' + (startAge + 10) + '岁'
    });
  }

  return {
    forward, yangYear, male, days, qiYears, qiMonths,
    firstStep: steps[0] ? steps[0].gz : '',
    steps
  };
}

// ===== 白话解读生成 =====
const DAY_MASTER_DESC = {
  '木': '日主为木，如草木逢春，主仁德、生长、向上。木性之人多温和而有韧性，重情义，善谋划。',
  '火': '日主为火，如旭日之光，主礼德、热情、向外。火性之人多开朗明快，富有感染力与行动力。',
  '土': '日主为土，如大地厚载，主信德、包容、稳健。土性之人多踏实可靠，重承诺，能容人容事。',
  '金': '日主为金，如金石之坚，主义德、果决、肃敛。金性之人多刚毅有原则，重义气与分寸。',
  '水': '日主为水，如江河之流，主智德、灵动、润下。水性之人多聪慧变通，善思辨，适应力强。'
};

function strengthText(level, dims) {
  const d = dims;
  let s = `从「得令、得地、得生、得助」四维看：得令 ${d.得令} 分（禀月令之气），得地 ${d.得地} 分（地支根基），得生 ${d.得生} 分（印星生扶），得助 ${d.得助} 分（比劫帮扶）。`;
  if (level === '身强') s += '综合判定为「身强」，日主气足、能担财官，取名宜用泄（食伤）、耗（财）、克（官杀）之五行以平衡过旺之势。';
  else if (level === '身弱') s += '综合判定为「身弱」，日主气弱、需人帮扶，取名宜用生我（印）与同我（比劫）之五行以补益根基。';
  else s += '综合判定为「中和」，日主气相对均衡，五行调和即可，用字以不过偏不倚为佳。';
  return s;
}

function xiYongText(dayMaster, level, xi, ji) {
  let s = `日主五行属${dayMaster}。`;
  if (level === '身强') s += `身强则宜「泄、耗、克」，喜用：${xi.join('、')}（泄其过、耗其盛、制其刚）；相对忌讳：${ji.join('、')}（再补则偏枯）。`;
  else if (level === '身弱') s += `身弱则宜「生、扶」，喜用：${xi.join('、')}（印星生身、比劫助身）；相对忌讳：${ji.join('、')}（克泄交加则更弱）。`;
  else s += '身中和，五行皆可作调候之用，以流通平衡为要。';
  return s;
}

function wxDistText(wuxing) {
  const entries = WX.map(w => ({ w, n: wuxing[w] })).sort((a, b) => b.n - a.n);
  const max = entries[0].n, min = entries[entries.length - 1].n;
  let s = `八字中天干地支五行计数为：木${wuxing.木} 火${wuxing.火} 土${wuxing.土} 金${wuxing.金} 水${wuxing.水}。`;
  const many = entries.filter(e => e.n === max).map(e => e.w);
  const few = entries.filter(e => e.n === min).map(e => e.w);
  if (max - min <= 1) s += '五行分布较为均衡，气机不偏枯，取名以顺气为主。';
  else s += `其中${many.join('、')}偏旺，${few.join('、')}偏弱；取名可作微调，使五行气韵更畅达。`;
  return s;
}

function dayunText(dayun) {
  if (!dayun) return '';
  const dir = dayun.forward ? '顺排' : '逆排';
  let s = `起运约 ${dayun.qiYears} 岁 ${dayun.qiMonths} 个月（按「三日为一岁、一日为四月」古法推算，节气日期取近似值，仅供娱乐参考）。大运${dir}，自${dayun.firstStep}运始，每运管十年。`;
  const first = dayun.steps.slice(0, 3).map(x => `${x.ageRange}（${x.gz}）`).join('、');
  s += `早年大运：${first}……（详见下方大运表）。`;
  return s;
}

function explainBazi(full, dayun) {
  const { dayMaster, strength, xiYong, jiShen, wuxing } = full;
  return {
    dayMaster: DAY_MASTER_DESC[dayMaster] || '',
    wxDist: wxDistText(wuxing),
    strength: strengthText(strength.level, strength.dims),
    xiYong: xiYongText(dayMaster, strength.level, xiYong, jiShen),
    dayun: dayunText(dayun),
    closing: '以上为传统命理文化的趣味解读，仅作姓名学与民俗赏析参考，不构成任何命运断言、吉凶承诺或人生决策依据。名字之美，更在音、形、义与家风期许之中。'
  };
}

module.exports = {
  getBazi, getDayun, explainBazi, shiShen, gzIndex, wangshuai,
  GAN, ZHI, GAN_WX, ZHI_BASE_WX, WX, SHENG, KE, NAYIN_NAME, NAYIN_WX, ZANG, XK
};
