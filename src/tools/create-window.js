const { BrowserWindow } = require('electron');
const WManager = require('./window-manager')();
let mainWindow = null, privacyWindow = null;

module.exports = {
  createMainWindow: () => {
    if (!mainWindow) {
      mainWindow = new BrowserWindow({ width: 800, height: 600, show: false, titleBarStyle: 'hiddenInset', resizable: false, maximizable: false, title: 'iSecurity' })
      // 缓存主窗口，用于获取窗口对象
      WManager.push('MAIN_WINDOW', mainWindow);
      //在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁
      mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // 主窗口渲染完成后，隐藏登录窗口
        const loginWindow = WManager.getWindow('LOGIN_WINDOW');
        if (loginWindow) {
          loginWindow.webContents.send('on-main-window-show');
          loginWindow.hide();
        }
      })
      // 在渲染完成后添加事件监听
      mainWindow.webContents.once('did-finish-load', () => {
        // 窗口关闭时回收窗口
        mainWindow.once('close', (e) => {
          // 主窗口关闭后，显示登录窗口
          const loginWindow = WManager.getWindow('LOGIN_WINDOW');
          loginWindow && loginWindow.show();
          mainWindow.destroy();
          // 移除主窗口缓存
          WManager.remove('MAIN_WINDOW');
          mainWindow = null;
        })
      })
    }
    // 然后加载应用的远程资源URL。
    mainWindow.loadURL('http://localhost:3000/main');

  },
  createPrivacyWindow: () => {
    if (!privacyWindow) {
      privacyWindow = new BrowserWindow({ width: 800, height: 600, show: false, resizable: false, maximizable: false, titleBarStyle: 'hiddenInset', minimizable: false, title: 'iSecurity' })
      // 缓存隐私协议窗口，用于获取窗口对象
      WManager.push('PRIVACY_WINDOW', privacyWindow);
      //在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁
      privacyWindow.once('ready-to-show', () => {
        privacyWindow.show()
      })
      // 在渲染完成后添加事件监听
      privacyWindow.webContents.once('did-finish-load', () => {
        // 窗口关闭时回收窗口
        privacyWindow.once('close', (e) => {
          privacyWindow.destroy();
          // 移除窗口缓存
          WManager.remove('PRIVACY_WINDOW');
          privacyWindow = null;
        })
      })
    }
    // 然后加载应用的远程资源URL。
    privacyWindow.loadURL('http://localhost:3000/privacy');
  }
}