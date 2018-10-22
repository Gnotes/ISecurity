import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Backup from '@material-ui/icons/Backup';
import Drawer from '../Drawer';
import './index.scss';
const nedb = require('../../tools/nedb');

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

  showErrorNotify = (errMsg) => {
    /**
     * 使用 HTML-API Notification 模块
     * https://w3c-html-ig-zh.github.io/notifications/whatwg/
     */
    new Notification('Warm Tips', {
      body: errMsg || 'Please check your form data, categrory name is required !',
      silent: false
    })
  }

  createCategory = () => {
    const { categoryName, comments } = this.state;
    const { onChange } = this.props;
    this.setState({ loading: true })
    nedb.category.insert({ categoryName: categoryName, comments: comments, createAt: Date.now() }, (err, newDoc) => {
      if (err) { return this.showErrorNotify(err.message) };
      this.clearState()
      onChange();
    })
  }

  clearState = () => {
    this.setState({ categoryName: '', comments: '', loading: false })
  }

  onSubmit = (e) => {
    e.preventDefault(); e.stopPropagation();
    const { categoryName } = this.state;
    if (!categoryName || !categoryName.trim()) return this.showErrorNotify();
    this.createCategory();
  }

  render() {
    const { open, onClickMask } = this.props;
    const { categoryName, comments, } = this.state;
    return (
      <Drawer width={300} open={open} onClickMask={onClickMask}>
        <div className="drawer-cate-action">
          <Backup className="action-item" onClick={this.onSubmit} />
        </div>
        <div className="cate-card-form">
          <form onSubmit={this.onSubmit}>
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
  onClickMask: PropTypes.func,
  onChange: PropTypes.func,
}

CategoryDrawer.defaultProps = {
  onChange: () => null
}

export default CategoryDrawer;