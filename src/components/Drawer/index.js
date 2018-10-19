import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

class Drawer extends PureComponent {
  render() {
    const { mask, shadow, open, width, height, wrapCls, className, onClickMask, children } = this.props;
    return (
      <div className={classNames('drawer', {
        'drawer-mask': mask,
        'open': open,
        [className]: className
      })}
        onClick={onClickMask}>
        <div
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className={classNames('drawer-wrap', {
            'shadow': shadow,
            [wrapCls]: wrapCls,
          })}
          style={{ width: width, height: height }}>
          {children}
        </div>
      </div>
    );
  }
}

Drawer.propTypes = {
  open: PropTypes.bool,
  mask: PropTypes.bool,
  shadow: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  wrapCls: PropTypes.string,
  className: PropTypes.string,
  onClickMask: PropTypes.func
}

Drawer.defaultProps = {
  open: false,
  mask: true,
  shadow: true,
  width: '100%',
  height: '100%',
  onClickMask: () => null,
}

export default Drawer;