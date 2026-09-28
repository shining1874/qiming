// pages/wuge/wuge.js · 三才五格详解
const { computeWuge } = require('../../utils/wuge.js');
const { wxClass, wxColor } = require('../../utils/util.js');
const store = require('../../utils/store.js');

function favSet() { return new Set(store.getList().map(i => i.key)); }

Page({
  data: { surname: '', given: '', result: null },
  onSurname(e) { this.setData({ surname: e.detail.value }); },
  onGiven(e) { this.setData({ given: e.detail.value }); },
  calc() {
    const { surname, given } = this.data;
    if (!surname.trim()) { wx.showToast({ title: '请先填写姓氏', icon: 'none' }); return; }
    if (!given.trim()) { wx.showToast({ title: '请填写名字', icon: 'none' }); return; }
    const r = computeWuge(surname.trim(), given.trim());
    if (!r.available) {
      wx.showToast({ title: '部分字未收录笔画', icon: 'none' });
      return;
    }
    const ge = r.ge;
    const geList = [['天格', ge.tian], ['人格', ge.ren], ['地格', ge.di], ['外格', ge.wai], ['总格', ge.zong]]
      .map(([lab, g]) => ({ lab, num: g.num, lvl: g.lvl, cls: g.cls, desc: g.desc }));
    const sanItems = [['天', r.san[0]], ['人', r.san[1]], ['地', r.san[2]]]
      .map(([lab, wx]) => ({ lab, wx, color: wxColor(wx) }));
    const key = surname.trim() + given.trim() + '|wuge';
    this.setData({ result: Object.assign({}, r, { geList, sanItems, faved: favSet().has(key) }) });
  },
  toggleFav() {
    const { surname, given, result } = this.data;
    if (!result) return;
    const full = surname.trim() + given.trim();
    const key = full + '|wuge';
    let list;
    if (favSet().has(key)) { list = store.remove(key); wx.showToast({ title: '已取消收藏', icon: 'none' }); }
    else { list = store.add({ id: key, key, full, py: '', yy: '五格·三才·' + result.sanText, type: '三才五格', src: result.sanText }); wx.showToast({ title: '已收藏', icon: 'success' }); }
    this.setData({ 'result.faved': favSet().has(key) });
  }
});
