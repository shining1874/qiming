// pages/homophone/homophone.js · 谐音避坑
const K = require('../../utils/kit.js');

Page({
  data: { surname: '', given: '', result: null },
  onSurname(e) { this.setData({ surname: e.detail.value }); },
  onGiven(e) { this.setData({ given: e.detail.value }); },
  check() {
    const s = (this.data.surname || '').trim();
    const g = (this.data.given || '').trim();
    if (!s && !g) { wx.showToast({ title: '请填写姓名', icon: 'none' }); return; }
    const r = K.checkHomophone(s, g);
    const risk = r.combos.length > 0 || r.rare.length > 0;
    const mild = r.charHints.length > 0 || r.poly.length > 0;
    r.level = risk ? 'bad' : (mild ? 'warn' : 'good');
    this.setData({ result: r });
  }
});
