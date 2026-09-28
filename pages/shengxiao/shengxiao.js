// pages/shengxiao/shengxiao.js · 生肖起名
const K = require('../../utils/kit.js');
const { ZODIAC_ORDER, getZodiac } = require('../../data/zodiac.js');
const { wxClass } = require('../../utils/util.js');

Page({
  data: {
    zodiacs: ZODIAC_ORDER,
    zIndex: 0,
    info: null,
    xiWxCls: [],
    surname: '',
    recs: [],
    generated: false
  },
  onLoad() { this.selectZodiac(0); },
  onZodiac(e) { this.selectZodiac(Number(e.detail.value)); },
  selectZodiac(i) {
    const info = getZodiac(ZODIAC_ORDER[i]);
    info.wxcls = wxClass(info.wx);
    const xiWxCls = info.xiWx.map(wx => ({ wx, cls: wxClass(wx) }));
    this.setData({ zIndex: i, info, xiWxCls, recs: [], generated: false });
  },
  onSurname(e) { this.setData({ surname: e.detail.value }); },
  generate() {
    const z = ZODIAC_ORDER[this.data.zIndex];
    const s = (this.data.surname || '').trim();
    if (!s) { wx.showToast({ title: '请填写姓氏', icon: 'none' }); return; }
    const recs = K.zodiacRecommend(z, s, 12).map(r => ({
      name: r.name, full: r.full, py: r.py,
      wxItems: r.wx.map(wx => ({ wx, cls: wxClass(wx) })),
      yy: r.yy
    }));
    this.setData({ recs, generated: true });
  }
});
