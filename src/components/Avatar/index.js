import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

class Avatar extends PureComponent {
  render() {
    const { size, src, text, children } = this.props;
    return (
      <div className={classNames('avatar', `avatar-${size}`)}>
        {src && (typeof src === 'string') && <img alt={text} src={src} />}
        {!src && text && <span className="avatar-text">{text}</span>}
        {children}
      </div>
    );
  }
}

Avatar.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  src: PropTypes.string,
  text: PropTypes.string
}

Avatar.defaultProps = {
  size: 'default'
}

export default Avatar;