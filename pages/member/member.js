// pages/member/member.js · 会员中心 / 我的
const app = getApp();
const store = require('../../utils/store.js');

Page({
  data: {
    isMember: false,
    xhs: app.globalData.xhsAccount,
    devTrialVisible: app.globalData.devTrialVisible,
    favCount: 0,
    benefits: [
      '八字排盘全部深度白话解读',
      '大运逐运详解（十年一步）',
      '喜用神精解与五行旺衰',
      '十神格局 · 藏干纳音全解'
    ],
    plans: [
      { price: '99', title: 'AI 体验', desc: 'AI 辅助生成多套起名方案，附五行五格速评', hot: false },
      { price: '199', title: '精批标准', desc: '生辰八字喜用 + 诗词典故 + 五格三才，交付 20 个精挑名字与寓意卡片', hot: true },
      { price: '299', title: '大师一对一', desc: '王老师一对一沟通，含八字排盘深度解读 + 定制方案 + 售后微调', hot: false }
    ]
  },
  onShow() {
    const member = wx.getStorageSync(app.globalData.memberKey) === true;
    this.setData({ isMember: member, favCount: store.getList().length });
  },
  openBazicha() { wx.navigateTo({ url: '/pages/bazicha/bazicha' }); },
  goFav() { wx.switchTab({ url: '/pages/favorites/favorites' }); },
  openXhs() {
    wx.showModal({
      title: '前往小红书',
      content: '请在小红书 App 搜索「' + this.data.xhs + '」，关注后私信王老师咨询起名与会员业务～',
      confirmText: '知道了'
    });
  },
  unlock() {
    // 真实场景：接入小红书虚拟支付 / 引导至小红书账户开通会员
    wx.showModal({
      title: '开通会员',
      content: '小程序会员通过小红书账户「' + this.data.xhs + '」开通：关注后私信王老师，备注您的小程序昵称即可解锁全部深度解读。',
      confirmText: '去小红书', cancelText: '稍后',
      success: (r) => { if (r.confirm) this.openXhs(); }
    });
  },
  // 开发预览：一键体验会员（发布前请将 app.js 中 devTrialVisible 置为 false）
  devTrial() {
    wx.setStorageSync(app.globalData.memberKey, true);
    this.setData({ isMember: true });
    wx.showToast({ title: '已开启体验会员（开发预览）', icon: 'none' });
  }
});
