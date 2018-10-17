import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Switch from '@material-ui/core/Switch';
import './index.scss';

const { remote } = window.require('electron');
const { BrowserWindow } = remote;
let win = null;

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      password: '',
    }
  }

  handleChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleCheckBoxChange = (event) => {
    this.setState({ checked: event.target.checked });
  }

  handleLogin = (event) => {
    event.preventDefault();
    const { password } = this.state;
    if (!password || password.trim() === '') {
      /**
       * 使用 HTML-API Notification 模块
       * https://w3c-html-ig-zh.github.io/notifications/whatwg/
       */
      new Notification('Warm Tips', {
        body: 'Please enter a valid password.',
        silent: false
      })
      return;
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

  render() {
    return (
      <div className="login">
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
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={this.state.password}
                  onChange={this.handleChange}
                  inputProps={{ maxLength: 20 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Enter to login"
                        onClick={this.handleLogin}
                      >
                        <ArrowForward />
                      </IconButton>
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
                  checked={this.state.checked}
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
