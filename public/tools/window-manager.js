/**
 * 窗口管理对象，用于缓存创建的窗口
 */

function WManager() {
  this._windows = [];
}

/**
 * 添加窗口
 * @param {*} key 窗口唯一标示
 * @param {*} window 窗口对象
 */
WManager.prototype.push = function (key, window) {
  this._windows.push({ key: key, window: window });
}

/**
 * 移除窗口对象
 * @param {*} key 窗口唯一标示
 */
WManager.prototype.remove = function (key) {
  for (let i = 0; i < this._windows.length; i++) {
    const win = this._windows[i];
    if (win.key === key) {
      this._windows.splice(i, 1);
      return;
    }
  }
}

/**
 * 获取窗口对象
 * @param {*} key 窗口唯一标示
 */
WManager.prototype.getWindow = function (key) {
  for (let i = 0; i < this._windows.length; i++) {
    const win = this._windows[i];
    if (win.key === key) {
      return win.window;
    }
  }
  return null;
}

/**
 * 清空窗口对象
 */
WManager.prototype.clear = function () {
  this._windows.forEach((win) => {
    win.window && win.window.destroy();
  })
  this._windows = [];
}

/**
 * 获取所有窗口对象
 */
WManager.prototype.getAllWindows = function () {
  return this._windows.map((win) => win.window);
}

/**
 * 窗口对象示例，用于构建唯一窗口管理对象
 */
let _WM = null;

module.exports = function () {
  // 如果窗口管理对象存在则直接返回，否则创建
  return _WM = _WM || new WManager();
};