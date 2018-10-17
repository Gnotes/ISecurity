import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Refresh from '@material-ui/icons/Refresh';
import Switch from '@material-ui/core/Switch';
import './index.scss';

const { remote, ipcRenderer } = window.require('electron');
const nedb = require('../../tools/nedb');

const { BrowserWindow } = remote;
let win = null;
const USER_ID = 'i_security';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      checked: false,
      password: '',
    }
  }

  componentDidMount() {
    this.initialUserValue();
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
    this.setState({ loading: true })
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
      win = new BrowserWindow({ width: 800, height: 600, show: false, resizable: false, maximizable: false, minimizable: false, title: 'iSecurity' })
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

  onClickCloseWindow = () => {
    ipcRenderer.send('asynchronous-message', 'close-login-window');
  }

  onClickMinWindow = () => {
    ipcRenderer.send('asynchronous-message', 'minimize-login-window');
  }

  render() {
    const { loading, password, checked } = this.state;
    return (
      <div className="login">
        <span onClick={this.onClickCloseWindow} className="close-button">
          <svg viewBox="0 0 1024 1024" width="16" height="16">
            <path d="M512 96C282.2 96 96 282.2 96 512s186.2 416 416 416 416-186.2 416-416S741.8 96 512 96z m105.4 566.6L512 557.2l-105.4 105.4c-12.4 12.4-32.8 12.4-45.2 0-6.2-6.2-9.4-14.4-9.4-22.6 0-8.2 3.2-16.4 9.4-22.6l105.4-105.4-105.4-105.4c-6.2-6.2-9.4-14.4-9.4-22.6 0-8.2 3.2-16.4 9.4-22.6 12.4-12.4 32.8-12.4 45.2 0l105.4 105.4 105.4-105.4c12.4-12.4 32.8-12.4 45.2 0 12.4 12.4 12.4 32.8 0 45.2L557.2 512l105.4 105.4c12.4 12.4 12.4 32.8 0 45.2-12.4 12.6-32.8 12.6-45.2 0z"
              p-id="1524"></path>
          </svg>
        </span>
        <span onClick={this.onClickMinWindow} className="minus-button">
          <svg viewBox="0 0 1024 1024" width="16" height="16">
            <path d="M512 96C282.2 96 96 282.2 96 512s186.2 416 416 416c229.8 0 416-186.2 416-416S741.8 96 512 96zM512 893.4c-210.2 0-381.4-171-381.4-381.4 0-210.2 171-381.4 381.4-381.4 210.2 0 381.4 171 381.4 381.4C893.4 722.2 722.2 893.4 512 893.4z"
              p-id="2458"></path>
            <path d="M256 496l512 0 0 34-512 0 0-34Z" p-id="2459"></path>
          </svg>
        </span>
        <header className="login-logo">
          <Avatar className="avatar-text">S</Avatar>
        </header>
        <div className="login-bottom">
          <div className="logan">
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
                    checked: 'is-switch-checked',
                  }}
                  checked={checked}
                  onChange={this.handleCheckBoxChange}
                  value="checked"
                  color="primary"
                />
                <span className="remember-text">Remember the password</span>
              </div>
            </form>
            <div className="privacy-agreement">
              <p>Read the <span onClick={this.onClickPrivacy}>《Privacy agreement》</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
