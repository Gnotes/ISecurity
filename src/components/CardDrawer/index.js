import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Delete from '@material-ui/icons/Delete';
import Backup from '@material-ui/icons/Backup';
import Link from '@material-ui/icons/Link';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { TwitterPicker } from 'react-color';
import Drawer from '../Drawer';
import './index.scss';

class CardDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showColorPicker: false,
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

  }

  showColorPicker = () => {
    this.setState(state => ({ showColorPicker: !state.showColorPicker }));
  }

  render() {
    const { open, onClickMask } = this.props;
    const { accountType, accoutNumber, password, websiteAddress, email, others, comments, mark, showPassword, showColorPicker } = this.state;
    return (
      <Drawer width={300} open={open} onClickMask={onClickMask}>
        <div className="drawer-action">
          <Backup className="action-item" />
          <Delete className="action-item" />
        </div>
        <div className="card-form">
          <form onSubmit={this.handleLogin}>
            <div className="card-input-group">
              <Input
                id="adornment-password"
                className="card-input"
                placeholder="Account Type"
                type="text"
                value={accountType}
                onChange={this.handleChange.bind(this, 'accountType')}
                inputProps={{ maxLength: 10 }}
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
                inputProps={{ maxLength: 20 }}
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
                inputProps={{ maxLength: 20 }}
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
                inputProps={{ maxLength: 20 }}
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
  onClickMask: PropTypes.func
}

CardDrawer.defaultProps = {
}

export default CardDrawer;