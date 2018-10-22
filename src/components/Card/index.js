import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/icons/Link';
import './index.scss';
const { shell } = window.require('electron');

class Card extends PureComponent {

  getCateFirstChar = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  render() {
    const { shadow, type, data, onClickAdd, onClickIcon, className } = this.props;
    return (
      <div className={classNames('card', {
        [className]: className,
        [`card-${type}`]: type,
        'shadow': shadow,
      })}>
        <div className="card-left">
          {
            type === 'password' ? (
              <Avatar className="card-logo" onClick={onClickIcon}>{this.getCateFirstChar(data.accountType)}</Avatar>
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
                {
                  data.websiteAddress && <Link className="card-icon icon-link" onClick={() => {
                    shell.openExternal(data.websiteAddress);
                  }} />
                }
                <svg className="card-icon icon-copy" viewBox="0 0 1024 1024" >
                  <path d="M528.732326 478.113741C528.732326 478.113741 934.735282 341.128788 888.603736 204.128972 850.812643 91.898304 631.985101 178.24591 631.985101 178.24591 631.985101 178.24591 525.377132-33.368359 407.474919 38.463035 289.572712 110.294433 528.732326 478.113741 528.732326 478.113741ZM545.715934 428.789761C545.715934 428.789761 877.118918 308.016642 850.219613 216.775652 827.015197 138.067515 615.02863 227.491076 615.02863 227.491076 615.02863 227.491076 526.328363 26.948327 437.33547 66.386597 348.342575 105.824866 545.715934 428.789761 545.715934 428.789761ZM502.499403 554.51124C502.499403 554.51124 737.769635 913.636948 616.871099 993.706855 517.830659 1059.300375 398.749475 855.822909 398.749475 855.822909 398.749475 855.822909 184.158168 957.681559 135.619093 827.998501 87.080022 698.315441 502.499403 554.51124 502.499403 554.51124ZM486.019963 598.069644C486.019963 598.069644 669.580503 901.738365 591.915535 958.922316 524.918622 1008.251484 415.060813 804.14998 415.060813 804.14998 415.060813 804.14998 221.279542 911.464731 176.339653 824.245002 131.399763 737.025273 486.019963 598.069644 486.019963 598.069644ZM552.468639 530.201287C552.468639 530.201287 689.453592 936.20424 826.453407 890.072697 938.684075 852.281604 852.336467 633.454061 852.336467 633.454061 852.336467 633.454061 1063.95074 526.84609 992.119345 408.943879 920.287946 291.041672 552.468639 530.201287 552.468639 530.201287ZM597.321242 542.666587C597.321242 542.666587 718.094362 874.069567 809.335353 847.170266 888.043489 823.96585 798.619929 611.979284 798.619929 611.979284 798.619929 611.979284 999.162679 523.279013 959.724407 434.286121 920.286139 345.293227 597.321242 542.666587 597.321242 542.666587ZM478.049236 504.285328C478.049236 504.285328 341.064282 98.282374 204.064466 144.41392 91.833799 182.205011 178.181405 401.032556 178.181405 401.032556 178.181405 401.032556-33.432865 507.640525 38.39853 625.542736 110.229928 743.444943 478.049236 504.285328 478.049236 504.285328ZM433.196629 491.82003C433.196629 491.82003 312.423511 160.417047 221.182521 187.316351 142.474383 210.520767 231.897944 422.507334 231.897944 422.507334 231.897944 422.507334 31.355196 511.207602 70.793466 600.200495 110.231735 689.193388 433.196629 491.82003 433.196629 491.82003Z"
                    p-id="1945"></path>
                </svg>
              </div>
              <div className="card-content">
                <div className="card-title">{data.accoutNumber}</div>
                <div className="card-password">**********</div>
              </div>
              <div className="card-bottom"><span className="card-flag card-flag-outter"><span className=" card-flag card-flag-inner" style={{ backgroundColor: data.mark }}></span></span></div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

Card.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  onClickIcon: PropTypes.func,
  onClickAdd: PropTypes.func,
  type: PropTypes.oneOf(['password', 'add']),
}

Card.defaultProps = {
  data: {},
  onClickIcon: () => null,
  onClickAdd: () => null,
  type: 'password'
}

export default Card;