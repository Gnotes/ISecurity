import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Switch from '@material-ui/core/Switch';
import './index.scss';

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
  };

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
              <p>Read the <a href="/">《Privacy agreement》</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
