const { poetryNames } = require('../../utils/namegen.js');
const { CATS } = require('../../data/poetry.js');
const store = require('../../utils/store.js');

function favSet() {
  return new Set(store.getList().map(i => i.key));
}

Page({
  data: {
    cats: ['全部'].concat(CATS),
    cat: '全部',
    keyword: '',
    list: []
  },
  onShow() { this.reload(); },
  reload() {
    const fs = favSet();
    const list = poetryNames(this.data.cat, this.data.keyword).map(e => ({
      cat: e.cat, book: e.book, sentence: e.sentence,
      names: e.names.map(n => ({
        name: n.name, py: n.py, yy: n.yy,
        key: n.name + '|' + e.sentence,
        faved: fs.has(n.name + '|' + e.sentence)
      }))
    }));
    this.setData({ list });
  },
  setCat(e) {
    this.setData({ cat: e.currentTarget.dataset.cat }, () => this.reload());
  },
  onKeyword(e) {
    this.setData({ keyword: e.detail.value }, () => this.reload());
  },
  toggleFav(e) {
    const { key, name, py, yy, src } = e.currentTarget.dataset;
    const fs = favSet();
    let list;
    if (fs.has(key)) {
      list = store.remove(key);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      list = store.add({ id: key, key, full: name, py, yy, type: '诗词', src });
      wx.showToast({ title: '已收藏', icon: 'success' });
    }
    const fs2 = new Set(list.map(i => i.key));
    const nl = this.data.list.map(en => ({
      ...en,
      names: en.names.map(n => ({ ...n, faved: fs2.has(n.key) }))
    }));
    this.setData({ list: nl });
  }
});
