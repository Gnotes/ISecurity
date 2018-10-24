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

class SettingDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
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
    nedb.user.remove({}, (err) => {
      if (err) { return this.showErrorNotify(err.message) };

    })
  }

  hideClear = () => {
    this.setState({ clearOpen: false })
  }

  handleClear = () => {
    nedb.category.remove({}, (err) => {
      if (err) { return this.showErrorNotify(err.message) };
      nedb.card.remove({}, (_err) => {
        if (_err) { return this.showErrorNotify(_err.message) };
      })
    })
  }

  render() {
    const { open, onClickMask } = this.props;
    const { resetOpen, clearOpen } = this.state;
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
            <span className="time"><span className="time-value">2 </span><span className="value-text">days</span></span>
            <span className="time time-hour">
              <span className="time-value">02 </span><span className="value-text">hours</span>
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