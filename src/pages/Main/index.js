import React, { Component } from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import CardDrawer from '../../components/CardDrawer';
import CategoryDrawer from '../../components/CategoryDrawer';
import SettingDrawer from '../../components/SettingDrawer';
import Card from '../../components/Card';
import './index.scss';

const nedb = require('../../nedb');
const { shell } = window.require('electron');

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      checked: false,
      open: false,
      cateOpen: false,
      settingOpen: false,
      cateDeleteConfirmOpen: false,
      password: '',
      anchorEl: null,
      categories: [],
      cards: [],
      currentCateId: '',
      currentCardId: '',
      currentPopoverCateId: '',
      cateAction: '',
      cardAction: '',
    }
  }

  componentDidMount() {
    this.loadCategory(true);
  }

  onClickCategory = (cateId) => {
    const { currentCateId } = this.state;
    if (cateId === currentCateId) return;
    this.setState({ currentCateId: cateId }, () => {
      this.loadCard(cateId)
    });
  }

  onClickAddCategory = () => {
    const { cateOpen } = this.state;
    this.setState({ cateOpen: !cateOpen, cateAction: 'add' })
  }

  onClickAddCard = () => {
    const { open } = this.state;
    this.setState({ open: !open, cardAction: 'add', currentCardId: '' })
  }

  onClickEditCard = (cardId) => {
    const { open } = this.state;
    this.setState({ open: !open, cardAction: 'edit', currentCardId: cardId })
  }

  handleClick = (cateId, event) => {
    this.setState({ anchorEl: event.currentTarget, currentPopoverCateId: cateId });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  loadCategory = (reloadCard) => {
    nedb.category.find({}).sort({ createAt: -1 }).exec((err, docs) => {
      if (err) return;
      if (docs.length === 0) {
        this.setState({ categories: docs, cards: [], cateOpen: false, currentCateId: '' })
      } else {
        const { currentCateId } = this.state;
        const _currentCateId = currentCateId || docs[0]._id;
        const state = { categories: docs, cateOpen: false, currentCateId: _currentCateId };
        this.setState(state, () => {
          if (reloadCard) { this.loadCard(this.state.currentCateId) }
        });
      }
    })
  }

  reloadCard = () => {
    const { currentCateId } = this.state;
    this.setState({ open: false })
    this.loadCard(currentCateId);
  }

  loadCard = (cateId) => {
    nedb.card.find({ cateId: cateId }).sort({ createAt: -1 }).exec((err, docs) => {
      if (err) return;
      this.setState({ cards: docs })
    })
  }

  getCateFirstChar = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  onClickDeleteCate = () => {
    this.setState({ cateDeleteConfirmOpen: true });
    this.handleClose();
  }

  onClickEditCate = () => {
    this.setState({ cateOpen: true, cateAction: 'edit' });
    this.handleClose();
  }

  hideConfirmDialog = () => {
    this.setState({ cateDeleteConfirmOpen: false });
  }

  handleDeleteCate = () => {
    this.hideConfirmDialog();
    const { currentPopoverCateId } = this.state;
    if (!currentPopoverCateId) {
      return this.handleClose();
    };
    this.removeCate(currentPopoverCateId);
  }

  resetCurrentCateId = () => {
    this.setState({ currentCateId: '' }, () => {
      this.loadCategory(true);
      this.handleClose();
    })
  }

  removeCate = (cateId) => {
    nedb.category.remove({ _id: cateId }, (err) => {
      if (err) return;
      const { currentCateId } = this.state;
      if (currentCateId === cateId) {
        this.resetCurrentCateId();
      } else {
        this.loadCategory();
        this.handleClose();
      }
    })
  }

  onClickLike = () => {
    shell.openExternal('https://github.com/Gnotes/ISecurity');
  }

  showSetting = () => {
    this.setState({ settingOpen: true });
  }

  onHideSetting = () => {
    this.setState({ settingOpen: false });
  }

  onCleanup = () => {
    this.setState({ settingOpen: false }, () => {
      this.loadCategory(true)
    })
  }

  render() {
    const { open, cateOpen, settingOpen, cateDeleteConfirmOpen, anchorEl, categories, cards, currentCateId, currentCardId, currentPopoverCateId, cateAction, cardAction } = this.state;
    const popopen = Boolean(anchorEl);

    return (
      <div className="main">
        <Menu
          anchorEl={anchorEl}
          open={popopen}
          className="popover-menu"
          onClose={this.handleClose}
          PaperProps={{
            style: {
              width: 100,
              marginLeft: 15
            },
          }}
        >
          <MenuItem onClick={this.onClickEditCate}>
            <Edit className="icon-action" /> Edit
          </MenuItem>
          <MenuItem onClick={this.onClickDeleteCate}>
            <Delete className="icon-action" /> Remove
          </MenuItem>
        </Menu>
        <Dialog
          open={cateDeleteConfirmOpen}
          onClose={this.hideConfirmDialog}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete me? It will not be restored after deletion!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideConfirmDialog} color="primary">
              I’m kidding
            </Button>
            <Button color="primary" onClick={this.handleDeleteCate} >
              Don't wanna see you again
            </Button>
          </DialogActions>
        </Dialog>
        <div className="main-side side-theme-light">
          <div className="side-top">
            <IconButton className="menu-icon" aria-label="Menu" onClick={this.showSetting}>
              <MenuIcon />
            </IconButton>
          </div>
          <div className="side-middle">
            {
              categories.map((item) => {
                return (
                  <div className={classNames("cate-group", {
                    "active": item._id === currentCateId
                  })} key={item._id}>
                    <div className="pop-action">
                      <MoreHoriz onClick={this.handleClick.bind(this, item._id)} />
                    </div>
                    <IconButton className="menu-avatar" aria-label="Menu" onClick={this.onClickCategory.bind(this, item._id)}>
                      <Avatar className="cate-item">{this.getCateFirstChar(item.categoryName)}</Avatar>
                    </IconButton>
                  </div>
                );
              })
            }
            <div className="cate-group">
              <IconButton className="menu-avatar" aria-label="Menu" onClick={this.onClickAddCategory}>
                <svg viewBox="0 0 1024 1024" width="46" height="46" className="cate-item-add">
                  <path d="M736 480l-192 0 0-192C544 268.8 531.2 256 512 256S480 268.8 480 288l0 192-192 0C268.8 480 256 492.8 256 512s12.8 32 32 32l192 0 0 192C480 755.2 492.8 768 512 768s32-12.8 32-32l0-192 192 0C755.2 544 768 531.2 768 512S755.2 480 736 480z"
                    p-id="2085"></path>
                </svg>
              </IconButton>
            </div>
          </div>
          <div className="side-like">
            <span className="seperator left"></span>
            <svg className="side-pulse" t="1539940651071" viewBox="0 0 1024 1024" width="29" height="29">
              <path d="M896 576c-30.536 0-56.058 21.39-62.446 50l-118.008 0-60.362-181.792c-2.21-6.658-8.492-11.086-15.518-10.956-7.016 0.144-13.118 4.844-15.048 11.59L516.134 823.48 399.784 125.37c-1.248-7.48-7.574-13.056-15.152-13.358-7.618-0.278-14.322 4.764-16.156 12.122L243.496 626 64 626l0 32 192 0c7.348 0 13.75-5.004 15.526-12.132l109.37-439.182 115.322 691.946c1.23 7.376 7.406 12.918 14.874 13.344 0.306 0.018 0.614 0.026 0.918 0.026 7.098 0 13.398-4.7 15.374-11.594l113.744-396.992 47.69 143.626c2.174 6.542 8.292 10.958 15.186 10.958l130.584 0c7.78 26.578 32.322 46 61.416 46 35.348 0 64-28.654 64-64S931.348 576 896 576z"
                p-id="7250"></path>
            </svg>
            <span className="seperator right"></span>
            <div className="like-button" onClick={this.onClickLike}>
              <svg viewBox="0 0 1024 1024" width="16" height="16">
                <path d="M42.666667 896h170.666666V384H42.666667v512z m938.666666-469.333333c0-46.933333-38.4-85.333333-85.333333-85.333334h-268.8l42.666667-196.266666v-12.8c0-17.066667-8.533333-34.133333-17.066667-46.933334l-46.933333-42.666666-281.6 281.6c-17.066667 12.8-25.6 34.133333-25.6 59.733333v426.666667c0 46.933333 38.4 85.333333 85.333333 85.333333h384c34.133333 0 64-21.333333 76.8-51.2l128-302.933333c4.266667-8.533333 4.266667-21.333333 4.266667-29.866667v-85.333333h4.266666c0 4.266667 0 0 0 0z"
                  p-id="6768"></path>
              </svg>
              <span>I like it</span>
            </div>
          </div>
        </div>
        <div className="main-center" id="main-center">
          {
            currentCateId ? (
              <Card type="add" onClickAdd={this.onClickAddCard} />
            ) : (
                <div className="empty-tip">You have not added a category, please add it first.</div>
              )
          }
          {
            cards.map((card) => {
              return (<Card key={card._id} onClickIcon={this.onClickEditCard.bind(this, card._id)} data={card} />)
            })
          }
        </div>
        <CardDrawer action={cardAction} cardId={currentCardId} currentCateId={currentCateId} width={300} open={open} mask={false} onClickMask={this.onClickAddCard} onChange={this.reloadCard} />
        <CategoryDrawer action={cateAction} currentCateId={currentPopoverCateId} width={300} open={cateOpen} mask={false} onClickMask={this.onClickAddCategory} onChange={this.loadCategory} />
        <SettingDrawer width={300} open={settingOpen} mask={false} onClickMask={this.onHideSetting} onChange={this.onCleanup} />
      </div>
    );
  }
}