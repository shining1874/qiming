// utils/store.js · 收藏（本地存储）
const KEY = 'zx_favorites';

function getList() {
  try { return wx.getStorageSync(KEY) || []; } catch (e) { return []; }
}

function has(full) {
  return getList().some(i => i.full === full);
}

function add(item) {
  const list = getList();
  if (list.some(i => i.full === item.full)) return list; // 已存在
  list.unshift(item);
  try { wx.setStorageSync(KEY, list); } catch (e) {}
  return list;
}

function remove(full) {
  const list = getList().filter(i => i.full !== full);
  try { wx.setStorageSync(KEY, list); } catch (e) {}
  return list;
}

module.exports = { getList, add, remove, has };
