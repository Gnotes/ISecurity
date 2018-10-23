const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const template = require('./tools/menu');
// 持久化设置
const settings = require('electron-settings');
const Notify = require('./tools/notify');
const WManager = require('./tools/window-manager')();
const { createMainWindow, createPrivacyWindow } = require('./tools/create-window');
const paths = require('./tools/paths');
const IS_DEV = process.env.NODE_ENV === 'development';
if (IS_DEV) {
    // 添加调试开发工具
    require('electron-debug')();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow;

// 更改主题State事件
const setThemeState = (theme) => {
    if (!loginWindow) return;
    const windows = WManager.getAllWindows();
    if (windows) {
        windows.forEach((window, i) => {
            window.webContents.send('asynchronous-theme', theme)
        })
    }
}

// 修改用户设置的数据
const setTheme = (theme) => {
    if (!settings.has('theme') || settings.get('theme') !== theme) {
        settings.set('theme', theme);
        setThemeState(theme);
    }
}

async function createWindow() {
    if (!settings.has('theme')) {
        settings.set('theme', 'light');
    }
    if (IS_DEV) {
        await installExtensions();
    }
    // 创建浏览器窗口。
    loginWindow = new BrowserWindow({ width: 300, height: 400, show: false, transparent: true, frame: false, titleBarStyle: 'hiddenInset', resizable: false, maximizable: false, title: 'iSecurity' })
    // 缓存登录窗口，用于获取窗口对象
    WManager.push('LOGIN_WINDOW', loginWindow);
    //在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁
    loginWindow.once('ready-to-show', () => {
        loginWindow.show();
        Notify.message({
            title: 'Welcome to iSecurity',
            body: 'Thanks for choosing me.',
            silent: false,
        });
    })

    if (IS_DEV) {
        // 然后加载应用的远程资源URL。
        loginWindow.loadURL('http://localhost:3000');
    } else {
        loginWindow.loadURL(`file://${paths.ROOT_PATH}/build/index.html`)
    }

    if (IS_DEV) {
        // 打开开发者工具
        loginWindow.webContents.openDevTools()
    }


    // 当 window 被关闭，这个事件会被触发。
    loginWindow.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        loginWindow = null
        // 移除窗口对象
        WManager.remove('LOGIN_WINDOW');
    })

    // 在main.js 中添加菜单，主要是为了使用 win 对象，发送 asynchronous-theme 事件
    if (process.platform === 'darwin') {
        template.unshift({
            label: 'iSecurity',
            submenu: [
                { role: 'about' },
                { role: 'services', submenu: [] },
                {
                    label: 'Theme',
                    submenu: [
                        { label: 'Light', click() { setTheme('light') } },
                        { label: 'Gradient', click() { setTheme('gradient') } }
                    ]
                },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'quit' }
            ]
        }, )
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log);
};

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (loginWindow === null) {
        createWindow()
    }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

// 监听创建新窗口事件
ipcMain.on('on-create-window', (e, windowKey) => {
    switch (windowKey) {
        case 'MAIN_WINDOW': createMainWindow(); break;
        case 'PRIVACY_WINDOW': createPrivacyWindow(); break;
        default: break;
    }
})

ipcMain.on('on-lock-main-window', (e) => {
    const mainWindow = WManager.getWindow('MAIN_WINDOW');
    if (mainWindow) {
        mainWindow.close();
    }
})