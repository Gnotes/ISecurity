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
          <p>Some privacies will be show here.</p>
        </div>
        <Footer />
      </div>
    );
  }
}