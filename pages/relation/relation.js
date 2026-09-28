const { twinNames, siblingNames } = require('../../utils/namegen.js');
const store = require('../../utils/store.js');

function favSet() { return new Set(store.getList().map(i => i.key)); }
function applyFav(mode, res) {
  const fs = favSet();
  const mark = (o) => { o.faved = fs.has(o.name + '|rel'); return o; };
  if (mode === 'twin') {
    if (Array.isArray(res) && res[0] && res[0].pair) {
      return res.map(r => ({ ...r, pair: r.pair.map(mark) }));
    }
    return res.map(r => ({ ...r, a: mark({ ...r.a, name: r.a.name }), b: mark({ ...r.b, name: r.b.name }) }));
  }
  // sibling
  return { ...res, names: res.names.map(mark) };
}

Page({
  data: {
    mode: 'twin',
    surname: '',
    style: 'shared',
    count: 2,
    genChar: '',
    result: null
  },
  onLoad(q) { if (q && q.mode) this.setData({ mode: q.mode }); },
  setMode(e) { this.setData({ mode: e.currentTarget.dataset.m, result: null }); },
  onSurname(e) { this.setData({ surname: e.detail.value }); },
  onGen(e) { this.setData({ genChar: e.detail.value }); },
  setStyle(e) { this.setData({ style: e.currentTarget.dataset.s, result: null }); },
  setCount(e) { this.setData({ count: Number(e.currentTarget.dataset.c), result: null }); },
  generate() {
    const s = (this.data.surname || '').trim();
    if (!s) { wx.showToast({ title: '请先填写姓氏', icon: 'none' }); return; }
    let res;
    if (this.data.mode === 'twin') {
      res = twinNames(s, this.data.style);
    } else {
      res = siblingNames(s, this.data.count, (this.data.genChar || '').trim());
    }
    this.setData({ result: applyFav(this.data.mode, res) });
  },
  toggleFav(e) {
    const { key, name, py, yy } = e.currentTarget.dataset;
    let list;
    if (favSet().has(key)) { list = store.remove(key); wx.showToast({ title: '已取消收藏', icon: 'none' }); }
    else { list = store.add({ id: key, key, full: name, py, yy, type: '关系起名', src: '关系组合' }); wx.showToast({ title: '已收藏', icon: 'success' }); }
    this.setData({ result: applyFav(this.data.mode, this.data.result) });
  }
});
