// pages/bazicha/bazicha.js · 八字排盘（会员专属深度解读）
const { getBazi, getDayun, explainBazi, WX } = require('../../utils/bazi.js');
const { wxColor } = require('../../utils/util.js');
const app = getApp();

const HOURS = [];
for (let i = 0; i < 24; i++) HOURS.push(i + '时');

Page({
  data: {
    sex: '男',
    date: '',
    hourIdx: 12,
    hours: HOURS,
    chart: null,
    bar: [],
    cols: [],
    dayunSteps: [],
    explain: null,
    locked: false
  },
  onLoad() {
    const gating = app.globalData.memberGating;
    const member = wx.getStorageSync(app.globalData.memberKey) === true;
    this.setData({ locked: !!(gating && !member) });
  },
  onSex(e) { this.setData({ sex: e.currentTarget.dataset.s }); },
  onDate(e) { this.setData({ date: e.detail.value }); },
  onHour(e) { this.setData({ hourIdx: Number(e.detail.value) }); },
  calc() {
    const { date, hourIdx, sex } = this.data;
    if (!date) { wx.showToast({ title: '请选择出生日期', icon: 'none' }); return; }
    const p = date.split('-').map(Number);
    const info = { y: p[0], m: p[1], d: p[2], h: hourIdx };
    const f = getBazi(info);
    const d = getDayun(info, sex);
    const ex = explainBazi(f, d);
    const sum = f.wuxing.木 + f.wuxing.火 + f.wuxing.土 + f.wuxing.金 + f.wuxing.水;
    const bar = WX.map(wx => ({
      wx, n: f.wuxing[wx], pct: Math.round(f.wuxing[wx] / sum * 100), color: wxColor(wx)
    }));
    const cols = f.pillars.map((pl, i) => ({
      lab: ['年柱', '月柱', '日柱', '时柱'][i],
      gz: pl.gan + pl.zhi,
      ganSS: f.shishen[i].gan,
      zhiSS: f.shishen[i].zhi,
      zang: f.zang[i].map(z => z.gan).join(''),
      nayin: f.nayin[i].name,
      xk: f.xunkong[i].join('')
    }));
    const dayunSteps = d.steps.map(s => ({ range: s.ageRange, gz: s.gz, wx: s.ganWx, base: s.zhiBaseWx }));
    this.setData({
      chart: {
        baziText: f.baziText.join(' '),
        dayMaster: f.dayMaster, level: f.strength.level, dims: f.strength.dims, score: f.strength.score,
        xiYongText: f.xiYong.join('、'), jiShenText: f.jiShen.length ? f.jiShen.join('、') : '无',
        wang: f.wang
      },
      bar, cols, dayunSteps, explain: ex
    });
  },
  openMember() { wx.navigateTo({ url: '/pages/member/member' }); }
});
