import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import Link from '@material-ui/icons/Link';
import './index.scss';

class Drawer extends PureComponent {
  render() {
    const { shadow, className } = this.props;
    return (
      <div className={classNames('card', {
        [className]: className,
        'shadow': shadow,
      })}>
        <div className="card-left">
          <Avatar className="card-logo">W</Avatar>
        </div>
        <div className="card-right">
          <div className="card-action">
            <Link className="card-icon icon-copy" />
            <RemoveRedEye className="card-icon icon-check" />
          </div>
          <div className="card-content">
            <div className="card-title">Ti少时诵诗书tle是是是 账号</div>
            <div className="card-password">**********</div>
          </div>
          <div className="card-bottom"><span className="card-flag card-flag-outter"><span className=" card-flag card-flag-inner"></span></span></div>
        </div>
      </div>
    );
  }
}

Drawer.propTypes = {
  className: PropTypes.string,
  onClickMask: PropTypes.func
}

Drawer.defaultProps = {
  onClickMask: () => null,
}

export default Drawer;