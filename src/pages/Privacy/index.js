import React, { PureComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Footer from '../../components/Footer';
import './index.scss';

export default class Privacy extends PureComponent {
  render() {
    return (
      <div className="privacy">
        <div class="privacy-hader">
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