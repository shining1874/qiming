const app = getApp();

Page({
  data: {
    xhs: app.globalData.xhsAccount,
    coreTiles: [
      { emoji: '📜', title: '古典诗词起名', sub: '诗经楚辞·唐诗宋词', url: '/pages/poetry/poetry' },
      { emoji: '☯️', title: '八字五行起名', sub: '五行喜用·补益参考', url: '/pages/bazi/bazi' },
      { emoji: '👶', title: '双胞胎起名', sub: '共享字·诗词对仗', url: '/pages/relation/relation?mode=twin' },
      { emoji: '👨‍👩‍👦', title: '兄弟姐妹起名', sub: '字辈·主题成组', url: '/pages/relation/relation?mode=sibling' },
      { emoji: '🔤', title: '定字起名', sub: '给定一字·巧配佳名', url: '/pages/fixed/fixed' },
      { emoji: '✅', title: '姓名测试', sub: '五格·音形义·五行', url: '/pages/test/test' }
    ],
    toolTiles: [
      { emoji: '📖', title: '字典·单字精解', sub: '读音·五行·笔画·出处', url: '/pages/dict/dict' },
      { emoji: '🐭', title: '生肖起名', sub: '喜忌字根·三合六合', url: '/pages/shengxiao/shengxiao' },
      { emoji: '🔢', title: '三才五格', sub: '五格数理·81 数理', url: '/pages/wuge/wuge' },
      { emoji: '📝', title: '藏头诗', sub: '姓名嵌首·五言七言', url: '/pages/poem/poem' },
      { emoji: '🔊', title: '谐音避坑', sub: '连读翻车·多音生僻', url: '/pages/homophone/homophone' },
      { emoji: '💞', title: '姓名配对', sub: '五行互补·默契指数', url: '/pages/pairing/pairing' },
      { emoji: '🌿', title: '每日美名', sub: '按日轮播·经典雅名', url: '/pages/daily/daily' },
      { emoji: '🏛', title: '百家姓溯源', sub: '起源·郡望·名人', url: '/pages/surname/surname' }
    ],
    vipTiles: [
      { emoji: '🔮', title: '八字排盘', sub: '会员·大运喜用详解', url: '/pages/bazicha/bazicha' },
      { emoji: '👑', title: '会员中心', sub: '深度解读·起名咨询', url: '/pages/member/member' }
    ]
  },
  go(e) {
    const url = e.currentTarget.dataset.url;
    const tab = '/pages/member/member', fav = '/pages/favorites/favorites', home = '/pages/index/index';
    if (url.indexOf(tab) >= 0 || url.indexOf(fav) >= 0 || url.indexOf(home) >= 0) {
      wx.switchTab({ url });
    } else {
      wx.navigateTo({ url });
    }
  },
  goXhs() {
    wx.showModal({
      title: '前往小红书',
      content: '请在小红书 App 中搜索「' + this.data.xhs + '」，关注后私信王老师咨询起名业务～',
      confirmText: '知道了'
    });
  }
});
