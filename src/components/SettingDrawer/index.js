import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LockOpen from '@material-ui/icons/LockOpen';
import Refresh from '@material-ui/icons/Refresh';
import ClearAll from '@material-ui/icons/ClearAll';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Drawer from '../Drawer';
import './index.scss';
const nedb = require('../../nedb');
const { ipcRenderer } = window.require('electron');
const settings = window.require('electron-settings');

const fillZero = (num) => {
  if (num < 9 && num > 0) return `0${num}`;
  return num;
}

const getTime = (ts) => {
  const now = Date.now();
  const diffSec = parseInt((now - ts) / 1000);
  let days = 0, hours = 0;

  if (diffSec > 86400) {
    days = parseInt(diffSec / 86400);
    const daysSec = days * 86400;
    const hoursSec = diffSec - daysSec;
    if (hoursSec > 3600) {
      hours = parseInt(hoursSec / 3600);
    }
  } else if (diffSec > 3600) {
    hours = parseInt(diffSec / 3600);
  }
  return { days, hours }
}

class SettingDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      clearOpen: false,
      resetOpen: false,
      days: 0,
      hours: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.setTime();
    }
  }

  setTime = () => {
    const createAt = settings.get('createAt');
    const time = getTime(createAt);
    this.setState(time);
  }

  showErrorNotify = (errMsg) => {
    /**
     * 使用 HTML-API Notification 模块
     * https://w3c-html-ig-zh.github.io/notifications/whatwg/
     */
    new Notification('Warm Tips', {
      body: errMsg || 'Something wrong, try it again later!',
      silent: false
    })
  }

  onClickLock = () => {
    ipcRenderer.send('on-lock-main-window');
  }

  onClickReset = () => {
    this.setState({ resetOpen: true })
  }

  onClickClear = () => {
    this.setState({ clearOpen: true })
  }

  hideReset = () => {
    this.setState({ resetOpen: false })
  }

  handleReset = () => {
    // 在这里先删除数据，再回到login窗口时，会发生数据仍然存在的问题，因此在login窗口处理删除事件
    ipcRenderer.send('on-password-reset');
  }

  hideClear = () => {
    this.setState({ clearOpen: false })
  }

  handleClear = () => {
    nedb.category.remove({}, { multi: true }, (err) => {
      if (err) { return this.showErrorNotify(err.message) };
      nedb.card.remove({}, { multi: true }, (_err) => {
        if (_err) { return this.showErrorNotify(_err.message) };
        this.setState({ clearOpen: false }, () => {
          this.clearTimer();
          this.timer = setTimeout(this.props.onChange, 500);
        })
      })
    })
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer = () => {
    this.timer && clearTimeout(this.timer);
    this.timer = null;
  }

  render() {
    const { open, onClickMask } = this.props;
    const { resetOpen, clearOpen, days, hours } = this.state;
    return (
      <Drawer width={300} open={open} onClickMask={onClickMask}>
        <Dialog
          open={resetOpen}
          onClose={this.hideReset}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to reset password?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideReset} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleReset} >
              Reset, right now
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={clearOpen}
          onClose={this.hideClear}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to clear all data? Cannot be recovered after cleanup !
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideClear} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleClear} >
              Clear, right now
            </Button>
          </DialogActions>
        </Dialog>
        <div className="setting-container">
          <header className="setting-logo" >
            <Avatar className="avatar-text">S</Avatar>
          </header>
          <div className="time-using">
            <div className="time-text">TIME&nbsp;&nbsp;OF&nbsp;&nbsp;USING</div>
            <span className="time"><span className="time-value">{fillZero(days)} </span><span className="value-text">days</span></span>
            <span className="time time-hour">
              <span className="time-value">{fillZero(hours)} </span><span className="value-text">hours</span>
            </span>
          </div>
          <div className="sepetor"></div>
          <div className="setting-item">
            <span>Lock :</span>
            <IconButton aria-label="Menu" onClick={this.onClickLock}>
              <LockOpen className="menu-icon" />
            </IconButton>
          </div>
          <div className="setting-item">
            <span>Reset Password :</span>
            <IconButton aria-label="Menu" onClick={this.onClickReset}>
              <Refresh className="menu-icon" />
            </IconButton>
          </div>
          <div className="setting-item">
            <span>Clear All Data :</span>
            <IconButton aria-label="Menu" onClick={this.onClickClear}>
              <ClearAll className="menu-icon" />
            </IconButton>
          </div>
        </div>
      </Drawer>
    );
  }
}

SettingDrawer.propTypes = {
  onClickMask: PropTypes.func,
  onChange: PropTypes.func,
}

SettingDrawer.defaultProps = {
  onChange: () => null
}

export default SettingDrawer;