import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Footer from '../../components/Footer';
import './index.scss';
import themes from '../../theme';

const settings = window.require('electron-settings');
const { ipcRenderer } = window.require('electron');
const THEME_CHANGE_CHANNEL = 'asynchronous-theme';

export default class Privacy extends Component {
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

  componentWillUnmount() {
    ipcRenderer.removeListener(THEME_CHANGE_CHANNEL, this.themeChangeListener)
  }

  render() {
    const { themeName } = this.state;
    const theme = themes[themeName];
    return (
      <div className="privacy">
        <div className={`privacy-header privacy-header-theme-${theme.name}`}>
          <Avatar className="avatar-text">S</Avatar>
          <span>The Privacy Agreement</span>
        </div>
        <div className="privacy-text">
          <p>
            iSecurity, a compatible Password Manager for OS X<br />
            Copyright (C) Xing.he
          </p>
          <p>
            This program is free software: you can redistribute it and/or modify
            it under the terms of the GNU General Public License as published by
            the Free Software Foundation, either version 3 of the License, or
            (at your option) any later version.
          </p>
          <p>
            This program is distributed in the hope that it will be useful,
            but WITHOUT ANY WARRANTY; without even the implied warranty of
            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
            GNU General Public License for more details. see <a href="https://github.com/Gnotes/ISecurity">https://github.com/Gnotes/ISecurity</a>.
          </p>
        </div>
        <Footer />
      </div>
    );
  }
}