/**
 * 主进程使用 Notification 模块
 */
const { Notification } = require('electron');

const Notify = (options) => {
  if (Notification.isSupported()) {
    const notification = new Notification(options)
    notification.show();
  }
}

module.exports = {
  message: Notify
}