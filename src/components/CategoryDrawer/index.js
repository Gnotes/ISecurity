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

  loadCate = (cateId) => {
    nedb.category.find({ _id: cateId }, (err, docs) => {
      if (err || docs.length === 0) return;
      const { categoryName, comments } = docs[0];
      this.setState({ categoryName, comments })
    })
  }

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    const { open, currentCateId, action } = nextProps;
    if (open && currentCateId) {
      if (action === 'edit') this.loadCate(currentCateId);
      else this.clearState();
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

  updateCategory = () => {
    const { categoryName, comments } = this.state;
    const { onChange, currentCateId } = this.props;
    this.setState({ loading: true })
    nedb.category.update({ _id: currentCateId }, { $set: { categoryName: categoryName, comments: comments, updateAt: Date.now() } }, {}, (err, numAffected, affectedDocuments, upsert) => {
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
    const { action } = this.props;
    if (!action) return;
    if (!categoryName || !categoryName.trim()) return this.showErrorNotify();
    if (action === 'add') this.createCategory();
    else this.updateCategory();
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
  currentCateId: PropTypes.string,
  onChange: PropTypes.func,
  action: PropTypes.oneOf(['add', 'edit', ''])
}

CategoryDrawer.defaultProps = {
  onChange: () => null
}

export default CategoryDrawer;