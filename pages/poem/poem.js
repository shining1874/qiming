// pages/poem/poem.js · 藏头诗
const K = require('../../utils/kit.js');
const { wxClass } = require('../../utils/util.js');

Page({
  data: { name: '', type: '7', result: null },
  onName(e) { this.setData({ name: e.detail.value }); },
  setType(e) { this.setData({ type: e.currentTarget.dataset.t }); },
  gen() {
    const n = (this.data.name || '').trim();
    if (!n) { wx.showToast({ title: '请输入姓名', icon: 'none' }); return; }
    if (Array.from(n).length > 4) { wx.showToast({ title: '建议 2-4 字', icon: 'none' }); return; }
    const out = K.buildAcrostic(n, this.data.type);
    out.lines = out.lines.map(l => Object.assign({}, l, { wxcls: l.wx ? wxClass(l.wx) : '' }));
    this.setData({ result: out });
  }
});
