// pages/dict/dict.js · 字典·单字精解
const K = require('../../utils/kit.js');
const { wxClass } = require('../../utils/util.js');

const WX = ['木', '火', '土', '金', '水'];

Page({
  data: {
    char: '',
    detail: null,
    curWx: '木',
    wxTabs: WX,
    wxList: []
  },
  onLoad() { this.loadWx('木'); },
  onChar(e) { this.setData({ char: e.detail.value }); },
  query() {
    const z = (this.data.char || '').trim();
    if (!z) { wx.showToast({ title: '请输入一个汉字', icon: 'none' }); return; }
    this.showDetail(z.charAt(0));
  },
  showDetail(c) {
    const d0 = K.getCharDetail(c);
    if (d0) {
      const d = Object.assign({}, d0);
      d.wxcls = wxClass(d.wx);
      this.setData({ detail: d, char: c });
    } else {
      this.setData({ detail: null, char: c });
      wx.showToast({ title: '该字未收录', icon: 'none' });
    }
  },
  loadWx(wx) {
    const list = K.charsByWuxing(wx).map(o => ({ z: o.z, py: o.py, yy: o.yy }));
    this.setData({ curWx: wx, wxList: list });
  },
  selectWx(e) { this.loadWx(e.currentTarget.dataset.wx); },
  tapChar(e) { this.showDetail(e.currentTarget.dataset.z); },
  randChar() {
    const c = K.randomGoodChar();
    this.showDetail(c.z);
  }
});
