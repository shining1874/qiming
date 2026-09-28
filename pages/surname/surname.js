// pages/surname/surname.js · 百家姓溯源
const { getSurnameCulture, SURNAME_FALLBACK } = require('../../data/surnames_culture.js');
const { getStroke } = require('../../utils/wuge.js');

const HOT = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];

Page({
  data: { surname: '', info: null, stroke: null, fallback: false, hot: HOT, fallbackText: SURNAME_FALLBACK },
  onSurname(e) { this.setData({ surname: e.detail.value }); },
  query() {
    const s = (this.data.surname || '').trim();
    if (!s) { wx.showToast({ title: '请输入姓氏', icon: 'none' }); return; }
    this.show(s.charAt(0));
  },
  show(c) {
    const info = getSurnameCulture(c);
    const stroke = getStroke(c);
    this.setData({ surname: c, info, stroke, fallback: !info });
  },
  tapHot(e) { this.show(e.currentTarget.dataset.s); }
});
