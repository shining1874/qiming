// utils/wuge.js
// 知行起名 · 五格剖象（姓名学文化参考，纯属娱乐）
// 天格 / 人格 / 地格 / 外格 / 总格 + 81 数理吉凶 + 三才配置
// 康熙笔画取自 data/chars.js 与 data/surname.js；未收录之字会提示"暂未收录"。

const { CHAR_MAP } = require('../data/chars.js');
const { SURNAME } = require('../data/surname.js');
const { commonStroke } = require('../data/common_extra.js');

// 常用名/姓氏补充笔画（部分不在 100 好字与常见姓氏表中的常见字）
const EXTRA_STROKE = {
  '杰': 12, '伟': 11, '芳': 10, '娜': 10, '敏': 11, '婷': 12, '轩': 10, '睿': 14,
  '悦': 11, '彤': 7, '欣': 8, '琪': 13, '瑶': 14, '馨': 20, '露': 21, '颖': 16,
  '佳': 8, '俊': 9, '昊': 8, '宸': 10, '妍': 7, '萌': 14, '雪': 11, '云': 12,
  '嘉': 14, '宁': 14, '艳': 24, '航': 10, '瑞': 14, '博': 12, '文': 4, '雅': 12,
  '静': 16, '玲': 9, '珊': 10, '璐': 17, '蕾': 19, '蕊': 18, '诗': 13, '思': 9
};

// 数理尾数 → 五行（1,2木 3,4火 5,6土 7,8金 9,0水）
function numToWx(n) {
  const t = ((n % 10) + 10) % 10;
  if (t === 1 || t === 2) return '木';
  if (t === 3 || t === 4) return '火';
  if (t === 5 || t === 6) return '土';
  if (t === 7 || t === 8) return '金';
  return '水';
}

// 81 数理（索引 1..81）：[等级, 简释]  等级：吉 / 半吉 / 凶
const SHUJI = {
  1: ['吉', '太极之首，万物开泰'], 2: ['凶', '一身孤节，混沌未分'],
  3: ['吉', '进取如意，进取繁荣'], 4: ['凶', '破败凶变，辛苦不绝'],
  5: ['吉', '福寿双全，种竹成林'], 6: ['吉', '安稳余庆，厚德载福'],
  7: ['吉', '刚毅果断，刚健中正'], 8: ['吉', '坚刚克捷，意志如铁'],
  9: ['凶', '破舟进海，兴尽凶始'], 10: ['凶', '万事终局，困苦缠身'],
  11: ['吉', '旱苗逢雨，挽回家运'], 12: ['凶', '掘井无泉，薄弱无力'],
  13: ['吉', '智略超群，才华洋溢'], 14: ['凶', '破兆沦落，忍得苦难'],
  15: ['吉', '福寿圆满，立身兴家'], 16: ['吉', '厚重载德，富贵尊荣'],
  17: ['吉', '刚强突破，排除万难'], 18: ['吉', '有志竟成，铁镜重磨'],
  19: ['凶', '多难风云，虽有智谋'], 20: ['凶', '屋下藏金，非业破运'],
  21: ['吉', '明月中天，独立权威'], 22: ['凶', '秋草逢霜，薄弱乏力'],
  23: ['吉', '旭日东升，壮丽可观'], 24: ['吉', '金钱丰盈，余庆家门'],
  25: ['吉', '资性英敏，刚毅成事'], 26: ['凶', '变怪奇异，波澜重迭'],
  27: ['凶', '欲望无止，一成一败'], 28: ['凶', '阔水浮萍，遭难废疾'],
  29: ['吉', '智谋优异，如愿以偿'], 30: ['凶', '浮沉不定，绝处逢生'],
  31: ['吉', '智勇得志，春日花开'], 32: ['吉', '宝马金鞍，侥幸多望'],
  33: ['吉', '鸾凤相会，功名显达'], 34: ['凶', '破家亡身，艰难不绝'],
  35: ['吉', '温和平静，高雅温良'], 36: ['凶', '风浪重叠，侠气成仁'],
  37: ['吉', '猛虎出林，权威显达'], 38: ['凶', '磨铁成针，意志薄弱'],
  39: ['半吉', '富贵荣华，德泽四方'], 40: ['凶', '退守保安，谨慎得安'],
  41: ['吉', '天赐纯佑，德高望重'], 42: ['凶', '寒蝉在柳，十艺不成'],
  43: ['凶', '须防邪途，散财破家'], 44: ['凶', '愁眉难展，烦闷忧愁'],
  45: ['吉', '新生泰和，顺风扬帆'], 46: ['凶', '载宝沉舟，浪里淘金'],
  47: ['吉', '祯祥吉庆，点石成金'], 48: ['吉', '德智兼备，古松立鹤'],
  49: ['凶', '颠沛挫折，凶变之象'], 50: ['凶', '孤寡小舟，吉凶交加'],
  51: ['半吉', '盛衰交加，一得一失'], 52: ['半吉', '卓识达眼，先见之明'],
  53: ['凶', '忧愁困苦，先吉后凶'], 54: ['凶', '石上栽花，多难悲运'],
  55: ['凶', '历尽艰辛，善恶难分'], 56: ['凶', '浪里行舟，吉凶参半'],
  57: ['吉', '寒雪青松，日照春松'], 58: ['半吉', '先苦后甘，晚行遇月'],
  59: ['凶', '志望难达，寒蝉悲风'], 60: ['凶', '无谋无略，徒劳无功'],
  61: ['吉', '名利双收，牡丹芙蓉'], 62: ['凶', '基础虚弱，衰败之象'],
  63: ['吉', '富贵荣华，舟归平海'], 64: ['凶', '徒劳无功，骨肉分离'],
  65: ['吉', '天长地久，巨流归海'], 66: ['凶', '进退维谷，岩头步马'],
  67: ['吉', '万事如意，顺风扬帆'], 68: ['吉', '兴家立业，顺风吹帆'],
  69: ['凶', '坐立不安，非业非运'], 70: ['凶', '家运衰退，残菊逢霜'],
  71: ['半吉', '吉凶参半，石上金花'], 72: ['半吉', '先吉后凶，劳苦不断'],
  73: ['半吉', '才德兼备，无勇有谋'], 74: ['凶', '沉沦逆境，残花经霜'],
  75: ['吉', '守者可安，退守得宁'], 76: ['凶', '倾覆离散，家运衰退'],
  77: ['半吉', '家庭有悦，吉凶参半'], 78: ['凶', '晚景凄凉，无苦自甘'],
  79: ['凶', '吉凶参半，云头望月'], 80: ['凶', '凶星入度，遁吉避凶'],
  81: ['吉', '万物回春，还原复始']
};

function getStroke(char) {
  if (CHAR_MAP[char] && CHAR_MAP[char].bh) return CHAR_MAP[char].bh;
  if (SURNAME[char] !== undefined) return SURNAME[char];
  if (EXTRA_STROKE[char] !== undefined) return EXTRA_STROKE[char];
  if (commonStroke(char) != null) return commonStroke(char);
  return null;
}

function lvlText(lvl) {
  if (lvl === '吉') return { lvl, cls: 'chip-mu' };
  if (lvl === '半吉') return { lvl, cls: 'chip-gold' };
  return { lvl, cls: 'chip-red' };
}

function geGe(shu) {
  const info = SHUJI[shu] || ['—', '数理超出常见范围，仅供参考'];
  const t = lvlText(info[0]);
  return { num: shu, lvl: t.lvl, cls: t.cls, desc: info[1] };
}

function computeWuge(surname, given) {
  const sChars = Array.from(surname || '');
  const gChars = Array.from(given || '');
  const missing = [];
  const sStr = sChars.map(c => { const s = getStroke(c); if (s == null) missing.push(c); return s; });
  const gStr = gChars.map(c => { const s = getStroke(c); if (s == null) missing.push(c); return s; });

  if (missing.length || sChars.length === 0 || gChars.length === 0) {
    return { available: false, missing: Array.from(new Set(missing)) };
  }

  const s1 = sStr[0], s2 = sStr[1] || 0;
  const g1 = gStr[0], g2 = gStr[1] || 0;

  // 天格（祖运）：单姓 姓+1；复姓 两字和
  const tian = sChars.length === 1 ? s1 + 1 : s1 + s2;
  // 人格（主运）：姓末 + 名首
  const ren = (sChars.length === 1 ? s1 : s2) + g1;
  // 地格（前运）：单名 名+1；双名 两字和
  const di = gChars.length === 1 ? g1 + 1 : g1 + g2;
  // 总格：全部笔画和
  const zong = s1 + (sChars.length === 2 ? s2 : 0) + g1 + (gChars.length === 2 ? g2 : 0);
  // 外格（副运）：总格 - 人格 + 1
  const wai = zong - ren + 1;

  const ge = {
    tian: geGe(tian),
    ren: geGe(ren),
    di: geGe(di),
    wai: geGe(wai),
    zong: geGe(zong)
  };

  // 三才（天/人/地 尾数五行）
  const san = [numToWx(tian), numToWx(ren), numToWx(di)];
  const sanText = san.join('');

  // 综合倾向（中性描述，不作断言）
  const levels = [ge.tian.lvl, ge.ren.lvl, ge.di.lvl, ge.wai.lvl, ge.zong.lvl];
  const luck = levels.filter(l => l === '吉').length;
  const bad = levels.filter(l => l === '凶').length;
  let tendency = '五格吉凶参半，整体较为中正。';
  if (luck >= 4 && bad === 0) tendency = '五格多见吉祥，基础与运势格局较为顺遂。';
  else if (bad >= 3) tendency = '五格中凶数偏多，可斟酌调整个别用字以改善搭配。';
  else if (luck >= 2) tendency = '五格有吉有守，整体格局尚可，可作参考。';

  return {
    available: true,
    ge,
    san,
    sanText,
    tendency
  };
}

module.exports = { computeWuge, getStroke, SHUJI, numToWx };
