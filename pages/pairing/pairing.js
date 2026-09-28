// pages/pairing/pairing.js · 姓名配对
const K = require('../../utils/kit.js');
const { wxClass } = require('../../utils/util.js');

function wxItems(arr) { return (arr || []).map(wx => ({ wx, cls: wxClass(wx) })); }

Page({
  data: { s1: '', g1: '', s2: '', g2: '', result: null },
  onS1(e) { this.setData({ s1: e.detail.value }); },
  onG1(e) { this.setData({ g1: e.detail.value }); },
  onS2(e) { this.setData({ s2: e.detail.value }); },
  onG2(e) { this.setData({ g2: e.detail.value }); },
  pair() {
    const a = { surname: (this.data.s1 || '').trim(), given: (this.data.g1 || '').trim() };
    const b = { surname: (this.data.s2 || '').trim(), given: (this.data.g2 || '').trim() };
    if (!a.surname || !a.given) { wx.showToast({ title: '请完整填写第一个名字', icon: 'none' }); return; }
    if (!b.surname || !b.given) { wx.showToast({ title: '请完整填写第二个名字', icon: 'none' }); return; }
    const r = K.pairNames(a, b);
    const color = r.index >= 92 ? '#C0392B' : r.index >= 85 ? '#C9A227' : r.index >= 75 ? '#5B8C4A' : '#9C6B3C';
    r.color = color;
    r.a.wxItems = wxItems(r.a.wxList);
    r.b.wxItems = wxItems(r.b.wxList);
    r.interItems = wxItems(r.inter);
    r.onlyAItems = wxItems(r.onlyA);
    r.onlyBItems = wxItems(r.onlyB);
    this.setData({ result: r });
  }
});
