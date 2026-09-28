// utils/namegen.js · 各模式起名生成
const { CHARS, CHAR_MAP, byWuxing } = require('../data/chars.js');
const { POETRY } = require('../data/poetry.js');
const { computeWuge } = require('./wuge.js');
const { toneOf, pingze } = require('./util.js');
const { commonWx } = require('../data/common_extra.js');

const SHENG = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };

function dedupe(list) {
  const s = new Set();
  const out = [];
  for (const it of list) {
    if (s.has(it.name)) continue;
    s.add(it.name);
    out.push(it);
  }
  return out;
}

// ===== 古典诗词起名 =====
function poetryNames(cat, keyword) {
  let list = POETRY.slice();
  if (cat && cat !== '全部') list = list.filter(p => p.cat === cat);
  if (keyword) {
    const k = keyword.trim();
    list = list.filter(p => p.sentence.indexOf(k) >= 0 || p.names.some(n => n.name.indexOf(k) >= 0));
  }
  return list.map(p => ({
    cat: p.cat, book: p.book, sentence: p.sentence,
    names: p.names.map(n => ({ name: n.name, py: n.py, yy: n.yy }))
  }));
}

// ===== 八字五行起名 =====
function baziNames(surname, xiYong, len, count) {
  len = len === 1 ? 1 : 2;
  count = count || 18;
  const primary = xiYong[0] ? byWuxing(xiYong[0]) : CHARS;
  const second = xiYong[1] ? byWuxing(xiYong[1]) : CHARS;
  const out = [];
  if (len === 1) {
    primary.slice(0, count).forEach(c => {
      out.push(buildName(surname, c.z, [c]));
    });
  } else {
    const secPool = second.length ? second : CHARS;
    for (const a of primary) {
      for (const b of secPool) {
        if (a.z === b.z) continue;
        out.push(buildName(surname, a.z + b.z, [a, b]));
        out.push(buildName(surname, b.z + a.z, [b, a]));
      }
      if (out.length >= count * 2) break;
    }
  }
  return dedupe(out).slice(0, count);
}

function buildName(surname, name, charObjs) {
  const py = charObjs.map(c => c.py).join(' ');
  const wx = charObjs.map(c => c.wx);
  const yy = charObjs.map(c => c.yy).join('；');
  const cd = charObjs.map(c => c.cd).filter(Boolean).join('；') || '—';
  return { name, full: surname + name, py, wx, yy, cd };
}

// ===== 定字起名 =====
function fixedNames(surname, fixedChar, count) {
  count = count || 18;
  const fixed = CHAR_MAP[fixedChar];
  const out = [];
  const others = CHARS.filter(c => c.z !== fixedChar);
  // 优先：能生"定字"五行（相生为美），其次不同五行，再次同五行
  const fixedWx = fixed ? fixed.wx : null;
  const shengFixed = fixedWx ? SHENG[fixedWx] : null;
  const ordered = others.slice().sort((a, b) => {
    const sa = (fixedWx && a.wx === shengFixed) ? 0 : (a.wx === fixedWx ? 2 : 1);
    const sb = (fixedWx && b.wx === shengFixed) ? 0 : (b.wx === fixedWx ? 2 : 1);
    return sa - sb;
  });
  const mk = (second) => fixed
    ? [fixed, second]
    : [{ z: fixedChar, py: '', wx: null, yy: '—', cd: '' }, second];
  for (const b of ordered) {
    out.push(buildName(surname, fixedChar + b.z, mk(b)));
    out.push(buildName(surname, b.z + fixedChar, mk(b).slice().reverse()));
    if (out.length >= count * 2) break;
  }
  return dedupe(out).slice(0, count);
}

// ===== 双胞胎 / 龙凤胎 =====
function twinNames(surname, mode) {
  if (mode === 'poem') {
    // 诗词对仗：取含 2 个名字的名句
    const pairs = POETRY.filter(p => p.names.length >= 2).map(p => ({
      cat: p.cat, book: p.book, sentence: p.sentence,
      a: { name: surname + p.names[0].name, py: p.names[0].py, yy: p.names[0].yy },
      b: { name: surname + p.names[1].name, py: p.names[1].py, yy: p.names[1].yy }
    }));
    return pairs;
  }
  // 共享一字（中字相同）
  const sharedPool = CHARS.slice().sort(() => Math.random() - 0.5).slice(0, 8);
  return sharedPool.map(s => {
    const rest = CHARS.filter(c => c.z !== s.z).sort(() => Math.random() - 0.5).slice(0, 2);
    return {
      shared: s.z,
      py: s.py,
      pair: [0, 1].map(i => {
        const c = rest[i] || CHARS[(i * 7 + 3) % CHARS.length];
        const name = s.z + c.z;
        return { name: surname + name, py: s.py + ' ' + c.py, yy: s.yy + '；' + c.yy };
      })
    };
  });
}

// ===== 兄弟姐妹起名 =====
function siblingNames(surname, count, genChar) {
  count = count || 2;
  let gen = genChar && CHAR_MAP[genChar] ? genChar : null;
  if (!gen) {
    // 自动选一个吉字作辈分字
    gen = CHARS[Math.floor(Math.random() * CHARS.length)].z;
  }
  const used = {};
  const names = [];
  let guard = 0;
  while (names.length < count && guard < 500) {
    guard++;
    const c = CHARS[Math.floor(Math.random() * CHARS.length)];
    if (c.z === gen || used[c.z]) continue;
    used[c.z] = true;
    names.push({ name: surname + gen + c.z, py: (CHAR_MAP[gen] ? CHAR_MAP[gen].py : '') + ' ' + c.py, yy: (CHAR_MAP[gen] ? CHAR_MAP[gen].yy : '') + '；' + c.yy });
  }
  return { gen, names };
}

// ===== 姓名测试（音形义 + 五行 + 五格） =====
function testName(surname, given) {
  const wuge = computeWuge(surname, given);
  const chars = Array.from(given).map(z => {
    const m = CHAR_MAP[z];
    if (m) return { z, py: m.py, wx: m.wx, yy: m.yy, cd: m.cd || '—', hit: true };
    const cw = commonWx(z);
    if (cw) return { z, py: '', wx: cw, yy: '—', cd: '常用名用字，五行参考《常用字归类》', hit: 'common' };
    return { z, py: '', wx: null, yy: '—', cd: '字库未收录，详情待补充', hit: false };
  });
  const tones = chars.map(c => toneOf(c.py));
  const pz = tones.map(t => pingze(t));
  const wxList = chars.map(c => c.wx).filter(Boolean);
  // 音律点评（中性）
  let soundNote = '声调信息不足，暂无法评析平仄。';
  if (tones.every(t => t)) {
    const joined = pz.join('');
    soundNote = '声调组合为「' + pz.join('、') + '」，' + (pz[0] !== pz[pz.length - 1] ? '平仄有变化，读来抑扬有致。' : '首尾同调，较为平稳。');
  }
  // 综合点评（倾向性，不作断言）
  let comment = '名字音形义与五行搭配可作文化参考；具体是否契合，仍以家庭喜好与读音顺口为先。';
  return { surname, given, full: surname + given, wuge, chars, tones, pz, wxList, soundNote, comment };
}

module.exports = {
  poetryNames, baziNames, fixedNames, twinNames, siblingNames, testName, buildName
};
