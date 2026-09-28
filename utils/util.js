// utils/util.js · 通用工具

// 拼音声调解析（依据声调符号）
const TONE1 = 'āēīōūǖ';
const TONE2 = 'áéíóúǘ';
const TONE3 = 'ǎěǐǒǔǚ';
const TONE4 = 'àèìòùǜ';

function toneOf(py) {
  if (!py) return null;
  for (const ch of py) {
    if (TONE1.indexOf(ch) >= 0) return 1;
    if (TONE2.indexOf(ch) >= 0) return 2;
    if (TONE3.indexOf(ch) >= 0) return 3;
    if (TONE4.indexOf(ch) >= 0) return 4;
  }
  return null;
}

// 平仄：一二声为平，三四声为仄
function pingze(tone) {
  if (tone === 1 || tone === 2) return '平';
  if (tone === 3 || tone === 4) return '仄';
  return '—';
}

// 五行 → chip 样式类
function wxClass(wx) {
  switch (wx) {
    case '木': return 'chip-mu';
    case '火': return 'chip-huo';
    case '土': return 'chip-tu';
    case '金': return 'chip-jin';
    case '水': return 'chip-shui';
    default: return 'chip-plain';
  }
}

function wxColor(wx) {
  switch (wx) {
    case '木': return '#5B8C4A';
    case '火': return '#C0392B';
    case '土': return '#B5894E';
    case '金': return '#C9A227';
    case '水': return '#3E7CB1';
    default: return '#B6A98F';
  }
}

function genId() {
  return 'zx_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

module.exports = { toneOf, pingze, wxClass, wxColor, genId };
