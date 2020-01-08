import React, { Component } from 'react';
import { connect } from 'react-redux'

import Page from 'components/page';
import { Confirm } from '@ql-feat/react-dialog';
import detect from 'components/detect';
import { request, insertOssSdk, uploadImage, unbindPhone, updateUserInfo, getUserInfoP } from 'common_actions/common';
import { imgUrlFormat, locationTo } from 'components/util';


class PageContainer extends Component {
  state = {
    _name: '',
    _headImgUrl: '',
  }

  componentDidMount() {
    this.props.getUserInfoP();
  }

  render() {
    const { userInfo } = this.props;
    if (!userInfo) return false;

    return <Page title="编辑个人信息" className="p-ls-mine-info">
      <div className="row-group">
        <div className="row subfield" onClick={() => this.refAvatarModal.show()}>
          头像
          <div className="right">
            {
              !!userInfo.headImgUrl &&
              <img className="avatar" src={imgUrlFormat(userInfo.headImgUrl, '?x-oss-process=image/resize,m_fill,limit_0,h_180,w_180')} alt=""/>
            }
          </div>
        </div>

        <div className="row subfield" onClick={this.onClickEditName}>
          名称
          <div className="right">
            {userInfo.name}
            <i className="icon_enter"></i>
          </div>
        </div>

        <div className="row subfield">
          ID
          <div className="right">
            {userInfo.userId}
          </div>
        </div>

        <div className="row subfield" onClick={this.onClickBindPhone}>
          绑定手机号
          <div className="right">
            {
              userInfo.isBind === 'Y'
                ?
                userInfo.mobile
                :
                <span style={{color: '#F73657'}}>未绑定</span>
            }
            <i className="icon_enter"></i>
          </div>
        </div>

      </div>
      <div className="row-group">
        <div className="row logout" onClick={this.onClickLogout}>
            退出登录
        </div>
      </div>

      <Confirm
        className="username-modal"
        title="名称"
        ref={r => this.refUsernameModal = r}
        onBtnClick={this.onClickUsernameConfirm}
      >
        <input type="text" placeholder="请输入名称,最多输入14个字" ref={r => this.refUsername = r} value={this.state._name} onChange={this.onChangeName}/>
      </Confirm>

      <Confirm
        className="avatar-modal"
        title="头像"
        ref={r => this.refAvatarModal = r}
        onBtnClick={this.onClickAvatarConfirm}
        onClose={() => this.setState({_headImgUrl: ''})}
      >
        <div className="upload-avatar-wrap">
          <img src={imgUrlFormat(this.state._headImgUrl || userInfo.headImgUrl, '?x-oss-process=image/resize,m_fill,limit_0,h_180,w_180')}/>
          <div className="btn-upload-avatar">点击上传图片</div>
          <input
            type="file"
            ref={r => this.refInputAvatar = r}
            accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"
            onChange={this.onChangeInputAvatar}
          />
        </div>
      </Confirm>
    </Page>
  }

  onClickBindPhone = () => {
		if (this.props.userInfo.isBind === 'Y') {
			window.simpleDialog({
				msg: `已经绑定手机号码${this.props.userInfo.mobile}，是否确认解除绑定?`,
				onConfirm: async () => {
					if (await this.props.unbindPhone()) {
						window.toast('解绑成功');
					}
				}
			})
		} else {
			locationTo('/wechat/page/phone-auth');
		}
  }

  onClickEditName = () => {
    this.setState({
      _name: this.props.userInfo.name
    })
    this.refUsernameModal.show();
  }
  
  onChangeName = e => {
    this.setState({
      _name: e.target.value.trim()
    })
  }

  onChangeInputAvatar = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    e.target.value = '';

    window.loading(true);
    insertOssSdk()
      .then(() => this.props.uploadImage(file))
      .then(_headImgUrl => {
        if (!_headImgUrl) throw Error('上传图片失败');
        this.setState({
          _headImgUrl
        })
      })
      .catch(err => {
        window.toast(err.message);
      })
      .then(() => {
        window.loading(false);
      })
  }

  onClickAvatarConfirm = type => {
    if (type === 'confirm') {
      if (!this.state._headImgUrl) {
        this.refAvatarModal.hide();
        return;
      }

      window.loading(true);
      request({
        method: 'GET',
        url: '/api/wechat/transfer/h5/user/updateInfo',
        body: {
          name: this.props.userInfo.name,
          headImgUrl: this.state._headImgUrl, 
        }
      }).then(res => {

        window.toast(res.state.msg);
        if (res.state.code == 0) {
          this.props.updateUserInfo({
            headImgUrl: this.state._headImgUrl,
          })
        }
      }).catch(err => {
        window.toast(err.message, 2000);
        this.setState({
          _headImgUrl: '',
        })
      }).then(() => {
        window.loading(false);
        this.refAvatarModal.hide();
      })
    } else {
      this.setState({
        _headImgUrl: '',
      })
    }
  }

  onClickUsernameConfirm = type => {
    if (type === 'confirm') {
      let name = this.refUsername.value.trim();
      if (!name) return window.toast('请输入有效名称');
      if (name.length > 14) return window.toast('名称不能超过14个字');

      window.loading(true);
      request({
        method: 'POST',
        url: '/api/wechat/transfer/h5/user/updateInfo',
        body: {
          name,
          headImgUrl: this.props.userInfo.headImgUrl,
        }
      }).then(res => {
        window.toast(res.state.msg);
        if (res.state.code == 0) {
          sessionStorage.removeItem(this.props.userInfo.userId);
          this.props.updateUserInfo({
            name
          })
        }
      }).catch(err => {
        window.toast(err.state.msg, 2000);
      }).then(() => {
        window.loading(false);
        this.refUsernameModal.hide();
      })
    }
  }

  onClickLogout = () => {
    simpleDialog({
      msg: "是否确定要退出当前帐号？",
      onConfirm: () => {
        if (!detect.os.android && !detect.os.ios) {
          locationTo('/loginOut.htm');
        } else {
          locationTo('/loginOut.htm?url='+ window.location.origin + encodeURIComponent('/wechat/page/wx-login/'));
        }
      }
    })
  }
}



export default connect(state => {
  return {
    userInfo: state.common.userInfo.user || {},
  }
}, {
  getUserInfoP,
  uploadImage,
  unbindPhone,
  updateUserInfo,
})(PageContainer);
