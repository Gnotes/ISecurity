import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Delete from '@material-ui/icons/Delete';
import Backup from '@material-ui/icons/Backup';
import Link from '@material-ui/icons/Link';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { TwitterPicker } from 'react-color';
import Drawer from '../Drawer';
import './index.scss';

const nedb = require('../../tools/nedb');
const { shell } = window.require('electron');

class CardDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showColorPicker: false,
      deleteConfirmOpen: false,
      showPassword: false,
      accountType: '',
      accoutNumber: '',
      password: '',
      websiteAddress: '',
      email: '',
      others: '',
      comments: '',
      mark: '#8ED1FC'
    }
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleChange = (field, event) => {
    this.setState({ [field]: event.target.value });
  };

  handleChangeComplete = (color) => {
    this.setState({ mark: color.hex });
  };

  handleClickWebAddress = () => {
    const { websiteAddress } = this.state;
    if (!websiteAddress) return;
    shell.openExternal(websiteAddress);
  }

  showColorPicker = () => {
    this.setState(state => ({ showColorPicker: !state.showColorPicker }));
  }

  showErrorNotify = (errMsg) => {
    /**
     * 使用 HTML-API Notification 模块
     * https://w3c-html-ig-zh.github.io/notifications/whatwg/
     */
    new Notification('Warm Tips', {
      body: errMsg || 'Please check your form data !',
      silent: false
    })
  }

  createCard = () => {
    const { accountType, accoutNumber, password, websiteAddress, email, others, comments, mark } = this.state;
    const { onChange, currentCateId } = this.props;
    this.setState({ loading: true })
    nedb.card.insert({ cateId: currentCateId, accountType, accoutNumber, password, websiteAddress, email, others, comments, mark, createAt: Date.now() }, (err, newDoc) => {
      if (err) { return this.showErrorNotify(err.message) };
      this.clearState()
      onChange();
    })
  }

  updateCard = () => {
    const { accountType, accoutNumber, password, websiteAddress, email, others, comments, mark } = this.state;
    const { onChange, cardId } = this.props;
    this.setState({ loading: true })
    nedb.card.update({ _id: cardId }, { $set: { accountType, accoutNumber, password, websiteAddress, email, others, comments, mark, updateAt: Date.now() } }, {}, (err) => {
      if (err) { return this.showErrorNotify(err.message) };
      this.clearState()
      onChange();
    })
  }

  clearState = () => {
    this.setState({ accountType: '', accoutNumber: '', password: '', websiteAddress: '', email: '', others: '', comments: '', mark: '#8ED1FC', loading: false, showColorPicker: false })
  }

  onSubmit = (e) => {
    e.preventDefault(); e.stopPropagation();
    const { accountType, accoutNumber, password } = this.state;
    if (!accountType || !accoutNumber || !password) return;
    const { action } = this.props;
    if (!action) return;
    if (action === 'add') this.createCard();
    else this.updateCard();
  }

  onRemove = () => {
    this.setState({ deleteConfirmOpen: true });
  }

  hideConfirmDialog = () => {
    this.setState({ deleteConfirmOpen: false });
  }

  handleDeleteCard = () => {
    this.hideConfirmDialog();
    const { cardId } = this.props;
    if (!cardId) return;
    this.removeCard(cardId);
  }

  removeCard = (cateId) => {
    nedb.card.remove({ _id: cateId }, (err) => {
      if (err) return;
      const { onChange } = this.props;
      onChange();
    })
  }

  loadCard = (cardId) => {
    nedb.card.find({ _id: cardId }, (err, docs) => {
      if (err || docs.length === 0) return;
      const { accountType, accoutNumber, password, websiteAddress, email, others, comments, mark } = docs[0];
      this.setState({ accountType, accoutNumber, password, websiteAddress, email, others, comments, mark })
    })
  }

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    const { open, cardId, action } = nextProps;
    if (open) {
      if (action === 'edit') this.loadCard(cardId);
      else this.clearState();
    }
  }

  render() {
    const { open, onClickMask } = this.props;
    const { accountType, accoutNumber, password, websiteAddress, email, others, comments, mark, showPassword, showColorPicker, deleteConfirmOpen } = this.state;
    return (
      <Drawer width={300} open={open} onClickMask={onClickMask}>
        <Dialog
          open={deleteConfirmOpen}
          onClose={this.hideConfirmDialog}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete me? It will not be restored after deletion!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideConfirmDialog} color="primary">
              I’m kidding
            </Button>
            <Button color="primary" onClick={this.handleDeleteCard} >
              Don't wanna see you again
            </Button>
          </DialogActions>
        </Dialog>
        <div className="drawer-action">
          <Backup className="action-item" onClick={this.onSubmit} />
          <Delete className="action-item" onClick={this.onRemove} />
        </div>
        <div className="card-form">
          <form onSubmit={this.onSubmit}>
            <div className="card-input-group">
              <Input
                id="adornment-password"
                className="card-input"
                placeholder="Account Type"
                type="text"
                value={accountType}
                onChange={this.handleChange.bind(this, 'accountType')}
                inputProps={{ maxLength: 20 }}
              />
            </div>
            <div className="card-input-group">
              <Input
                id="adornment-password"
                className="card-input"
                placeholder="Account Number"
                type="text"
                value={accoutNumber}
                onChange={this.handleChange.bind(this, 'accoutNumber')}
                inputProps={{ maxLength: 40 }}
              />
            </div>
            <div className="card-input-group">
              <Input
                id="adornment-password"
                className="card-input"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={this.handleChange.bind(this, 'password')}
                inputProps={{ maxLength: 30 }}
                endAdornment={
                  <InputAdornment position="end" onClick={this.handleClickShowPassword}>
                    {showPassword ? <VisibilityOff className="icon-blue" /> : <Visibility className="icon-blue" />}
                  </InputAdornment>
                }
              />
            </div>
            <div className="seperator"></div>
            <div className="card-input-group">
              <Input
                id="adornment-password"
                className="card-input"
                placeholder="Website Address"
                type='text'
                value={websiteAddress}
                onChange={this.handleChange.bind(this, 'websiteAddress')}
                inputProps={{ maxLength: 100 }}
                endAdornment={
                  <InputAdornment position="end" onClick={this.handleClickWebAddress}>
                    <Link className="icon-blue" />
                  </InputAdornment>
                }
              />
            </div>
            <div className="card-input-group">
              <Input
                id="adornment-password"
                className="card-input"
                placeholder="Email"
                type="text"
                value={email}
                onChange={this.handleChange.bind(this, 'email')}
              />
            </div>
            <div className="card-input-group">
              <Input
                id="adornment-password"
                className="card-input"
                placeholder="Others"
                type="text"
                value={others}
                onChange={this.handleChange.bind(this, 'others')}
              />
            </div>
            <div className="seperator"></div>
            <div className="card-input-group">
              <Input
                id="adornment-password"
                className="card-input"
                placeholder="Comments"
                type="text"
                multiline
                rows={1}
                rowsMax={3}
                value={comments}
                onChange={this.handleChange.bind(this, 'comments')}
                inputProps={{ maxLength: 100 }}
              />
            </div>
            <div className="card-input-group">
              <div className="card-flag-wrap">
                <span className="mark-text">Select Marker</span>
                <span className="card-flag" style={{ backgroundColor: mark }} onClick={this.showColorPicker}></span>
              </div>
              {showColorPicker && <TwitterPicker triangle="top-right" color={mark} onChangeComplete={this.handleChangeComplete} />}
            </div>
          </form>
        </div>
      </Drawer >
    );
  }
}

CardDrawer.propTypes = {
  onClickMask: PropTypes.func,
  onChange: PropTypes.func,
  currentCateId: PropTypes.string,
  cardId: PropTypes.string,
  action: PropTypes.oneOf(['add', 'edit', ''])
}

CardDrawer.defaultProps = {
  onChange: () => null
}

export default CardDrawer;