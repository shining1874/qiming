const { getBazi, WX } = require('../../utils/bazi.js');
const { baziNames } = require('../../utils/namegen.js');
const { wxColor, wxClass } = require('../../utils/util.js');
const store = require('../../utils/store.js');

const HOURS = [];
for (let i = 0; i < 24; i++) HOURS.push(i + '时');

function favSet() { return new Set(store.getList().map(i => i.key)); }

Page({
  data: {
    surname: '',
    sex: '男',
    date: '',
    hourIdx: 12,
    hours: HOURS,
    len: 2,
    result: null,
    bar: [],
    names: []
  },
  onShow() { if (this.data.result) this.refreshFav(); },
  onSurname(e) { this.setData({ surname: e.detail.value }); },
  onSex(e) { this.setData({ sex: e.currentTarget.dataset.s }); },
  onDate(e) { this.setData({ date: e.detail.value }); },
  onHour(e) { this.setData({ hourIdx: Number(e.detail.value) }); },
  onLen(e) { this.setData({ len: Number(e.currentTarget.dataset.l) }); },
  calc() {
    const { surname, date, hourIdx, len } = this.data;
    if (!surname.trim()) { wx.showToast({ title: '请先填写姓氏', icon: 'none' }); return; }
    if (!date) { wx.showToast({ title: '请选择出生日期', icon: 'none' }); return; }
    const p = date.split('-').map(Number);
    const b = getBazi({ y: p[0], m: p[1], d: p[2], h: hourIdx });
    const sum = b.wuxing.木 + b.wuxing.火 + b.wuxing.土 + b.wuxing.金 + b.wuxing.水;
    const bar = WX.map(wx => ({
      wx, n: b.wuxing[wx], pct: Math.round(b.wuxing[wx] / sum * 100), color: wxColor(wx)
    }));
    const names = baziNames(surname.trim(), b.xiYong, len, 18).map(x => ({
      full: x.full, py: x.py, wx: x.wx, yy: x.yy, cd: x.cd,
      key: x.full + '|bazi', faved: favSet().has(x.full + '|bazi')
    }));
    const res = Object.assign({}, b, {
      xiYongText: b.xiYong.join('、'),
      jiShenText: b.jiShen.length ? b.jiShen.join('、') : '无'
    });
    this.setData({ result: res, bar, names });
  },
  refreshFav() {
    const fs = favSet();
    this.setData({ names: this.data.names.map(n => ({ ...n, faved: fs.has(n.key) })) });
  },
  toggleFav(e) {
    const { key, full, py, yy, cd } = e.currentTarget.dataset;
    let list;
    if (favSet().has(key)) { list = store.remove(key); wx.showToast({ title: '已取消收藏', icon: 'none' }); }
    else { list = store.add({ id: key, key, full, py, yy, type: '八字五行', src: cd }); wx.showToast({ title: '已收藏', icon: 'success' }); }
    const fs = new Set(list.map(i => i.key));
    this.setData({ names: this.data.names.map(n => ({ ...n, faved: fs.has(n.key) })) });
  }
});
