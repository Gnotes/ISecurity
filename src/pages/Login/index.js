import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Refresh from '@material-ui/icons/Refresh';
import Switch from '@material-ui/core/Switch';
import './index.scss';
import themes from '../../theme';

const settings = window.require('electron-settings');
const { remote, ipcRenderer } = window.require('electron');
const nedb = require('../../tools/nedb');

const { BrowserWindow } = remote;
let win = null, mainWindow = null;
const USER_ID = 'i_security';
const THEME_CHANGE_CHANNEL = 'asynchronous-theme';

class Login extends Component {

  constructor(props) {
    super(props);
    const theme = settings.get('theme');
    this.state = {
      themeName: theme,
      loading: false,
      checked: false,
      password: '',
    }
    this.addThemeChangeListener();
  }

  themeChangeListener = (event, theme) => {
    this.setState({ themeName: theme });
  };

  addThemeChangeListener = () => {
    ipcRenderer.on(THEME_CHANGE_CHANNEL, this.themeChangeListener)
  }

  componentDidMount() {
    this.initialUserValue();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(THEME_CHANGE_CHANNEL, this.themeChangeListener)
  }

  initialUserValue = () => {
    nedb.user.find({ _id: USER_ID }, (err, docs) => {
      if (err) { return console.log(err) };
      if (!docs || docs.length === 0) { return console.log('NO initial user!') };
      const user = docs[0];
      if (user.checked) {
        this.setState({ checked: true, password: user.password || '' })
      }
    })
  }

  createUser = () => {
    const { password, checked } = this.state;
    nedb.user.insert({ _id: USER_ID, checked: checked, password: password }, (err, newDoc) => {
      if (err) { return console.log(err) };
      console.log(newDoc)
    })
  }

  updateUser = () => {
    const { checked } = this.state;
    nedb.user.update({ _id: USER_ID }, { $set: { checked: checked } }, {}, (err, numAffected, affectedDocuments, upsert) => {
      if (err) { return console.log(err) };
      console.log(err, numAffected, affectedDocuments, upsert)
    })
  }

  userExist = () => {
    const { password } = this.state;
    return new Promise((resolve) => {
      nedb.user.find({ _id: USER_ID }, (err, docs) => {
        if (err) { console.log(err); return resolve('ERROR'); }
        if (!docs || docs.length === 0) return resolve('NOT_EXIST');
        const user = docs[0];
        if (user.password !== password) return resolve('INVALID');
        resolve('VALID');
      })
    })
  }

  handleChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleCheckBoxChange = (event) => {
    this.setState({ checked: event.target.checked });
  }

  showErrorNotify = () => {
    /**
     * 使用 HTML-API Notification 模块
     * https://w3c-html-ig-zh.github.io/notifications/whatwg/
     */
    new Notification('Warm Tips', {
      body: 'Please enter a valid password.',
      silent: false
    })
  }

  showMainWindow = () => {
    this.setState({ loading: true });
    if (!mainWindow) {
      mainWindow = new BrowserWindow({ width: 800, height: 600, show: false, titleBarStyle: 'hiddenInset', resizable: false, maximizable: false, minimizable: false, title: 'iSecurity' })
      //在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁
      mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        const { checked, password } = this.state;
        this.setState({ loading: false, password: checked ? password : '' }, this.hideLoginWindow);
      })
      // 在渲染完成后添加事件监听
      mainWindow.webContents.once('did-finish-load', () => {
        // 窗口关闭时回收窗口
        mainWindow.once('close', (e) => {
          mainWindow.destroy();
          mainWindow = null;
          this.showLoginWindow();
        })
      })
    }
    // 然后加载应用的远程资源URL。
    mainWindow.loadURL('http://localhost:3000/main');
  }

  handleLogin = async (event) => {
    event.preventDefault();
    const { password } = this.state;
    if (!password || password.trim() === '') return this.showErrorNotify();
    const result = await this.userExist();
    switch (result) {
      case 'ERROR':
      case 'INVALID': this.showErrorNotify(); break;
      case 'NOT_EXIST':
        this.createUser();
        this.showMainWindow(); break;
      case 'VALID':
        this.updateUser();
        this.showMainWindow();
        break;
      default: break;
    }
  };

  onClickPrivacy = () => {
    if (!win) {
      win = new BrowserWindow({ width: 800, height: 600, show: false, resizable: false, maximizable: false, titleBarStyle: 'hiddenInset', minimizable: false, title: 'iSecurity' })
      //在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁
      win.once('ready-to-show', () => {
        win.show()
      })
      // 在渲染完成后添加事件监听
      win.webContents.once('did-finish-load', () => {
        // 窗口关闭时回收窗口
        win.once('close', (e) => {
          win.destroy();
          win = null;
        })
      })
    }
    // 然后加载应用的远程资源URL。
    win.loadURL('http://localhost:3000/privacy');
  }

  hideLoginWindow = () => {
    ipcRenderer.send('asynchronous-message', 'hide-login-window');
  }

  showLoginWindow = () => {
    ipcRenderer.send('asynchronous-message', 'show-login-window');
  }

  render() {
    const { loading, password, checked, themeName } = this.state;
    const theme = themes[themeName];
    return (
      <div className="login" style={{ background: theme.background }}>
        <header className="login-logo" style={{ backgroundColor: theme.headerBackgroundColor }}>
          <Avatar className="avatar-text">S</Avatar>
        </header>
        <div className="login-bottom">
          <div className="logan" style={{ color: theme.textColor }}>
            <p>
              Welcome to iSecurity<br />
              Manage your password from here.
            </p>
          </div>
          <div className="login-form">
            <form onSubmit={this.handleLogin}>
              <div className="login-input">
                <Input
                  id="adornment-password"
                  className="is-input"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                  inputProps={{ maxLength: 20 }}
                  endAdornment={
                    <InputAdornment position="end">
                      {
                        loading ? (
                          <IconButton
                            aria-label="Loading to login"
                          >
                            <Refresh className="refresh-loading" />
                          </IconButton>
                        ) : (
                            <IconButton
                              aria-label="Enter to login"
                              onClick={this.handleLogin}
                            >
                              <ArrowForward />
                            </IconButton>
                          )
                      }
                    </InputAdornment>
                  }
                />
              </div>
              <div className="switch">
                <Switch
                  className="is-switch"
                  classes={{
                    switchBase: `is-switch-base-${theme.name}`,
                    checked: `is-switch-checked-${theme.name}`,
                    bar: `is-switch-bar-${theme.name}`,
                  }}
                  checked={checked}
                  onChange={this.handleCheckBoxChange}
                  value="checked"
                  color="primary"
                />
                <span className="remember-text" style={{ color: theme.textColor }}>Remember the password</span>
              </div>
            </form>
            <div className="privacy-agreement" style={{ color: theme.readColor }}>
              <p>Read the <span onClick={this.onClickPrivacy} style={{ color: theme.linkColor }}>《Privacy agreement》</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
