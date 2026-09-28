// pages/fixed/fixed.js · 定字起名
const { fixedNames } = require('../../utils/namegen.js');
const store = require('../../utils/store.js');

function favSet() { return new Set(store.getList().map(i => i.key)); }

Page({
  data: { surname: '', fixedChar: '', len: 2, result: [] },
  onSurname(e) { this.setData({ surname: e.detail.value }); },
  onFixed(e) { this.setData({ fixedChar: e.detail.value }); },
  onLen(e) { this.setData({ len: Number(e.currentTarget.dataset.l) }); },
  gen() {
    const { surname, fixedChar, len } = this.data;
    if (!surname.trim()) { wx.showToast({ title: '请先填写姓氏', icon: 'none' }); return; }
    if (!fixedChar.trim()) { wx.showToast({ title: '请填写定字', icon: 'none' }); return; }
    const fc = fixedChar.trim().charAt(0);
    const list = fixedNames(surname.trim(), fc, 18).map(x => ({
      full: x.full, py: x.py,
      wx: (x.wx || []).filter(Boolean).join(''),
      yy: x.yy, cd: x.cd,
      key: x.full + '|fixed', faved: favSet().has(x.full + '|fixed')
    }));
    this.setData({ result: list });
  },
  toggleFav(e) {
    const { key, full, py, yy, cd } = e.currentTarget.dataset;
    let list;
    if (favSet().has(key)) { list = store.remove(key); wx.showToast({ title: '已取消收藏', icon: 'none' }); }
    else { list = store.add({ id: key, key, full, py, yy, type: '定字起名', src: cd }); wx.showToast({ title: '已收藏', icon: 'success' }); }
    const fs = new Set(list.map(i => i.key));
    this.setData({ result: this.data.result.map(n => Object.assign({}, n, { faved: fs.has(n.key) })) });
  }
});
