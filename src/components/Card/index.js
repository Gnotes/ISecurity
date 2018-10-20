import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/icons/Link';
import './index.scss';

class Card extends PureComponent {
  render() {
    const { shadow, type, onClickAdd, className } = this.props;
    return (
      <div className={classNames('card', {
        [className]: className,
        [`card-${type}`]: type,
        'shadow': shadow,
      })}>
        <div className="card-left">
          {
            type === 'password' ? (
              <Avatar className="card-logo">W</Avatar>
            ) : (<IconButton className="menu-avatar" aria-label="Menu" onClick={onClickAdd}>
              <svg viewBox="0 0 1024 1024" width="40" height="40" className="cate-item-add">
                <path d="M736 480l-192 0 0-192C544 268.8 531.2 256 512 256S480 268.8 480 288l0 192-192 0C268.8 480 256 492.8 256 512s12.8 32 32 32l192 0 0 192C480 755.2 492.8 768 512 768s32-12.8 32-32l0-192 192 0C755.2 544 768 531.2 768 512S755.2 480 736 480z"
                  p-id="2085"></path>
              </svg>
            </IconButton>)
          }
        </div>
        {
          type === 'password' ? (
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
          ) : null
        }
      </div>
    );
  }
}

Card.propTypes = {
  className: PropTypes.string,
  onClickAdd: PropTypes.func,
  type: PropTypes.oneOf(['password', 'add']),
}

Card.defaultProps = {
  onClickAdd: () => null,
  type: 'password'
}

export default Card;