// app.js · 知行起名
App({
  globalData: {
    appName: '知行起名',
    // 小红书账户（用于站内引导，不在正文直接放外部联系方式）
    xhsAccount: '知行起名',
    version: '1.0.0',
    // 会员：是否开启「深度解读」付费门槛；设为 false 则全部免费开放
    memberGating: true,
    memberKey: 'zx_member',
    // 开发预览开关：发布前请置为 false（隐藏「体验会员」入口）
    devTrialVisible: true
  },
  onLaunch() {
    // 预热收藏存储
    const list = wx.getStorageSync('zx_favorites');
    if (!list) wx.setStorageSync('zx_favorites', []);
  }
});
