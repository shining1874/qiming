// pages/daily/daily.js · 每日美名
const K = require('../../utils/kit.js');
const { wxClass } = require('../../utils/util.js');
const store = require('../../utils/store.js');

function favSet() { return new Set(store.getList().map(i => i.key)); }

Page({
  data: { item: null, dateText: '', faved: false },
  onLoad() { this.load(); },
  load() {
    const d = new Date();
    const r = K.dailyName(d);
    r.wxItems = (r.wx || []).map(wx => ({ wx, cls: wxClass(wx) }));
    const dateText = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 · 第' + r.dayOfYear + '天';
    const key = r.g + '|daily';
    this.setData({ item: r, dateText, faved: favSet().has(key) });
  },
  toggleFav() {
    const item = this.data.item;
    if (!item) return;
    const key = item.g + '|daily';
    if (favSet().has(key)) { store.remove(key); wx.showToast({ title: '已取消收藏', icon: 'none' }); }
    else { store.add({ id: key, key, full: item.g, py: item.py, yy: item.yy, type: '每日美名', src: item.cd }); wx.showToast({ title: '已收藏', icon: 'success' }); }
    this.setData({ faved: favSet().has(key) });
  }
});
