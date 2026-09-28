// pages/favorites/favorites.js · 我的收藏
const store = require('../../utils/store.js');

Page({
  data: { list: [] },
  onShow() { this.refresh(); },
  refresh() {
    const list = store.getList().map(i => Object.assign({}, i));
    this.setData({ list });
  },
  remove(e) {
    const key = e.currentTarget.dataset.key;
    store.remove(key);
    this.refresh();
    wx.showToast({ title: '已移除', icon: 'none' });
  },
  goIndex() { wx.switchTab({ url: '/pages/index/index' }); }
});
