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
const { ipcRenderer } = window.require('electron');
const nedb = require('../../nedb');

const USER_ID = 'i_security';
const THEME_CHANGE_CHANNEL = 'asynchronous-theme';
const MAIN_WINDOW_SHOW_CHANNEL = 'on-main-window-show';

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
    this.addMainWindowShowListener();
  }

  themeChangeListener = (event, theme) => {
    this.setState({ themeName: theme });
  };

  addThemeChangeListener = () => {
    ipcRenderer.on(THEME_CHANGE_CHANNEL, this.themeChangeListener)
  }

  mainWindowShowListener = () => {
    const { checked, password } = this.state;
    this.setState({ loading: false, password: checked ? password : '' });
  }

  addMainWindowShowListener = () => {
    ipcRenderer.on(MAIN_WINDOW_SHOW_CHANNEL, this.mainWindowShowListener)
  }

  componentDidMount() {
    this.initialUserValue();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(THEME_CHANGE_CHANNEL, this.themeChangeListener)
    ipcRenderer.removeListener(MAIN_WINDOW_SHOW_CHANNEL, this.mainWindowShowListener)
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
    this.createWindow('MAIN_WINDOW');
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
    this.createWindow('PRIVACY_WINDOW');
  }

  createWindow = (key) => {
    ipcRenderer.send('on-create-window', key);
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
