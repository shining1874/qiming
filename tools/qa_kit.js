// tools/qa_kit.js · 扩展工具逻辑自检（Node）
const K = require('../utils/kit.js');

function show(label, v) { console.log('【' + label + '】'); console.log(JSON.stringify(v, null, 1)); }

try {
  show('getCharDetail(梓)', K.getCharDetail('梓'));
  show('zodiacRecommend(鼠,王,6)', K.zodiacRecommend('鼠', '王', 6));
  show('buildAcrostic(知远,7)', K.buildAcrostic('知远', '7'));
  show('buildAcrostic(王,5)', K.buildAcrostic('王', '5'));
  show('checkHomophone(杜,子腾)', K.checkHomophone('杜', '子腾'));
  show('checkHomophone(李,明轩)', K.checkHomophone('李', '明轩'));
  show('pairNames', K.pairNames({ surname: '王', given: '知远' }, { surname: '李', given: '明轩' }));
  show('dailyName', K.dailyName(new Date(2026, 8, 28)));
  console.log('\nALL KIT OK');
} catch (e) {
  console.error('KIT FAIL:', e);
  process.exit(1);
}
