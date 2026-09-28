// pages/test/test.js · 姓名测试
const { testName } = require('../../utils/namegen.js');
const { wxClass } = require('../../utils/util.js');
const store = require('../../utils/store.js');

function favSet() { return new Set(store.getList().map(i => i.key)); }

Page({
  data: { surname: '', given: '', result: null },
  onSurname(e) { this.setData({ surname: e.detail.value }); },
  onGiven(e) { this.setData({ given: e.detail.value }); },
  test() {
    const { surname, given } = this.data;
    if (!surname.trim()) { wx.showToast({ title: '请先填写姓氏', icon: 'none' }); return; }
    if (!given.trim()) { wx.showToast({ title: '请填写名字', icon: 'none' }); return; }
    const r = testName(surname.trim(), given.trim());
    let geList = [];
    if (r.wuge.available) {
      const ge = r.wuge.ge;
      [['天格', ge.tian], ['人格', ge.ren], ['地格', ge.di], ['外格', ge.wai], ['总格', ge.zong]]
        .forEach(([lab, g]) => geList.push({ lab, num: g.num, lvl: g.lvl, cls: g.cls, desc: g.desc }));
    }
    const chars = r.chars.map(c => Object.assign({}, c, { wxcls: c.wx ? wxClass(c.wx) : 'chip-plain' }));
    this.setData({
      result: Object.assign({}, r, { geList, chars, faved: favSet().has(r.full + '|test') })
    });
  },
  toggleFav(e) {
    const key = this.data.result.full + '|test';
    const { full, py, yy } = this.data.result;
    let list;
    if (favSet().has(key)) { list = store.remove(key); wx.showToast({ title: '已取消收藏', icon: 'none' }); }
    else { list = store.add({ id: key, key, full, py, yy, type: '姓名测试', src: '五格·音形义·五行' }); wx.showToast({ title: '已收藏', icon: 'success' }); }
    this.setData({ 'result.faved': favSet().has(key) });
  }
});
