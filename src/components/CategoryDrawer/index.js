import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Backup from '@material-ui/icons/Backup';
import Drawer from '../Drawer';
import './index.scss';

class CategoryDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      categoryName: '',
      comments: '',
    }
  }

  handleChange = (field, event) => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const { open, onClickMask } = this.props;
    const { categoryName, comments, } = this.state;
    return (
      <Drawer width={300} open={open} onClickMask={onClickMask}>
        <div className="drawer-cate-action">
          <Backup className="action-item" />
        </div>
        <div className="cate-card-form">
          <form onSubmit={this.handleLogin}>
            <div className="card-input-group">
              <Input
                className="card-input"
                placeholder="Category Name"
                type="text"
                value={categoryName}
                onChange={this.handleChange.bind(this, 'categoryName')}
                inputProps={{ maxLength: 10 }}
              />
            </div>
            <div className="card-input-group">
              <Input
                className="card-input"
                placeholder="Comments"
                type="text"
                multiline
                rows={1}
                rowsMax={3}
                value={comments}
                onChange={this.handleChange.bind(this, 'comments')}
                inputProps={{ maxLength: 20 }}
              />
            </div>
          </form>
        </div>
      </Drawer >
    );
  }
}

CategoryDrawer.propTypes = {
  onClickMask: PropTypes.func
}

CategoryDrawer.defaultProps = {
}

export default CategoryDrawer;