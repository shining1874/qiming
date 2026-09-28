// tools/qa_pages.js · 页面逻辑自检（模拟 wx + Page，验证各页主操作不抛错）
global.wx = {
  showToast() {}, showModal() {}, switchTab() {}, navigateTo() {},
  getStorageSync() { return []; }, setStorageSync() {}
};
global.getApp = () => ({ globalData: { xhsAccount: '知行起名', appid: 'touristappid' } });

let captured = null;
global.Page = (cfg) => { captured = cfg; };

const pages = [
  'dict', 'shengxiao', 'wuge', 'poem', 'homophone', 'pairing', 'daily', 'surname',
  'index', 'test', 'fixed', 'relation', 'bazi', 'bazicha', 'favorites', 'member', 'poetry'
];

function run(name, fn) {
  try { fn(); console.log('OK  ' + name); }
  catch (e) { console.log('FAIL ' + name + ' -> ' + e.message); }
}

for (const p of pages) {
  captured = null;
  require('../pages/' + p + '/' + p + '.js');
  const c = captured;
  if (!c) { console.log('FAIL ' + p + ' -> 未捕获 Page 配置'); continue; }
  const inst = Object.assign({}, c);
  inst.data = JSON.parse(JSON.stringify(c.data || {}));
  inst.setData = function (patch) { Object.assign(this.data, patch); };
  const bound = {};
  for (const k in c) if (typeof c[k] === 'function') bound[k] = c[k].bind(inst);

  run(p + ' onLoad', () => { if (bound.onLoad) bound.onLoad(); });

  run(p + ' 主操作', () => {
    switch (p) {
      case 'dict':
        inst.setData({ char: '梓' }); bound.query();
        if (!inst.data.detail) throw new Error('detail 为空');
        inst.setData({ char: '明' }); bound.query(); // 常用字不在字典百字库，应优雅返回 null 且不抛错
        if (inst.data.detail !== null) throw new Error('常用字 明 不应有 detail');
        bound.randChar();
        bound.selectWx({ currentTarget: { dataset: { wx: '火' } } });
        if (!inst.data.wxList.length) throw new Error('五行浏览为空');
        break;
      case 'shengxiao':
        inst.setData({ surname: '王' }); bound.generate();
        if (!inst.data.recs.length) throw new Error('生肖推荐为空');
        break;
      case 'wuge':
        inst.setData({ surname: '王', given: '知远' }); bound.calc();
        if (!inst.data.result || inst.data.result.geList.length !== 5) throw new Error('五格解析异常');
        inst.setData({ surname: '李', given: '明轩' }); bound.calc();
        if (!inst.data.result) throw new Error('明轩五格异常');
        break;
      case 'poem':
        inst.setData({ name: '知远', type: '7' }); bound.gen();
        if (!inst.data.result || inst.data.result.lines.length !== 2) throw new Error('藏头诗生成异常');
        inst.setData({ name: '小明', type: '5' }); bound.gen();
        if (!inst.data.result) throw new Error('五言藏头诗异常');
        break;
      case 'homophone':
        inst.setData({ surname: '杜', given: '子腾' }); bound.check();
        if (!inst.data.result || !inst.data.result.combos.length) throw new Error('连读谐音未命中');
        inst.setData({ surname: '李', given: '明轩' }); bound.check();
        if (inst.data.result.rare.length) throw new Error('明轩 误判生僻');
        break;
      case 'pairing':
        inst.setData({ s1: '王', g1: '知远', s2: '李', g2: '明轩' }); bound.pair();
        if (!inst.data.result) throw new Error('配对失败');
        if (inst.data.result.index < 62 || inst.data.result.index > 99) throw new Error('默契指数越界');
        break;
      case 'daily':
        if (!inst.data.item || !inst.data.item.g) throw new Error('每日美名为空');
        bound.toggleFav();
        break;
      case 'surname':
        inst.setData({ surname: '王' }); bound.query();
        if (!inst.data.info) throw new Error('王姓溯源为空');
        inst.setData({ surname: '甲' }); bound.query(); // 未收录兜底
        if (inst.data.info) throw new Error('未收录姓不应有 info');
        break;
      case 'test':
        inst.setData({ surname: '王', given: '知远' }); bound.test();
        if (!inst.data.result) throw new Error('姓名测试异常');
        break;
      case 'index':
        if (inst.data.coreTiles.length !== 6) throw new Error('起名核心应为 6 项');
        if (inst.data.toolTiles.length !== 8) throw new Error('文化工具箱应为 8 项');
        if (inst.data.vipTiles.length !== 2) throw new Error('深度服务应为 2 项');
        break;
      default:
        break;
    }
  });
}

console.log('\nQA PAGES DONE');
