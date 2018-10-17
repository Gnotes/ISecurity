import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Footer from '../../components/Footer';
import './index.scss';

export default class Main extends Component {
  render() {
    return (
      <div className="privacy">
        <div className="privacy-header">
          <Avatar className="avatar-text">S</Avatar>
          <span>The Main Window</span>
        </div>
        <div className="privacy-text">
          <p>Main window will be show here.</p>
        </div>
        <Footer />
      </div>
    );
  }
}