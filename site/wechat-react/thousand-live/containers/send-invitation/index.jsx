import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { locationTo, getVal } from 'components/util';
import { getTopicInvite, topicInvite, getAppIdByType } from '../../actions/live';
import { getUserInfo } from '../../actions/common'
import { apiService } from "components/api-service";
import { isServiceWhiteLive } from '../../../actions/common';
import { share } from 'components/wx-utils';
import Curtain from 'components/curtain/index';
import WechatPhoneBinding from 'components/wechat-phone-binding/index';

@autobind
class index extends Component {
  state = { 
    topicInfo: {},
    createUser: {},
    code: '',
    isSubscribe: false,
    isWhite: false,
    appId: '',
    isShow: false,
    isStatus: false,
    showModalMoreInfo: false,
  }
  // 是否为分享
  get isShare (){
    return this.props.location.query.isShare === "Y"
  }
  // 话题id
  get topicId () {
    return this.props.location.query.topicId
  }
  // 直播间ID
  get liveId () {
    return this.props.location.query.liveId
  }
  get code(){
    return this.props.location.query.c || ''
  }

  async componentDidMount(){
    await this.props.getUserInfo();
    if(!this.code){
      await topicInvite({
        topicId: this.topicId,
        userId: this.props.userInfo.userId,
      }).then(res => {
        this.setState({
          code: res.data.code || '',
        })
      })
    } else {
      this.setState({
        code: this.code
      })
    }

    await this.getTopicInfo();

    this.initShare();
    this.setState({
      isShow: true,
    })
  }

  getTopicInfo() {
    return apiService.get({
      url: '/h5/topic/get',
      body: {
          topicId: this.topicId
      }
    }).then(res => {
      if (res.state.code == 0) {
        this.setState({
          topicInfo: res.data.topicPo,
          createUser: res.data.createUser
        });
      }
    })
  }
  // 分享
  initShare(){
    const { topicInfo,createUser,code } = this.state;
    const origin = window.location.origin;
    const c = this.code || code;
    const url = `${origin}/wechat/page/live-invitation?liveId=${this.liveId}&topicId=${this.topicId}&c=${c}&isShare=Y`
    console.log(url, '======')
    share({
      title: topicInfo.topic,
      timelineTitle: topicInfo.topic,
      desc: `${createUser.name}向您发出嘉宾邀请，点击同意。`,
      timelineDesc: `${createUser.name}向您发出嘉宾邀请，点击同意。`, // 分享到朋友圈单独定制
      imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/invite_share.png',
      shareUrl: url
    })
  }

  handleInfoBindingSuccess = () => {
    window.toast('提交成功！');
    this.setState({
        showModalMoreInfo: false,
    });
    setTimeout(() => {
      this.sendInv();
    }, 800);
  }

  async sendInv(){
    // B端沉淀调整
    // if (!this.props.userInfo.mobile) {
    //   await showWinPhoneAuth({close: false});
    // }

    window.loading(true);

    if (this.state.code) {
      const { data, state } = await getTopicInvite({ topicId: this.topicId,code: this.state.code  });
      if (data && data.status === -1) {
        window.toast('邀请资格已被使用');
      }
      else {
        if (state.code != 0) {
          window.toast(state.msg);
        } else {
          const res = await this.props.isServiceWhiteLive(this.liveId);
          if (getVal(res, 'data.isWhite') === 'N') {
            const res = await getAppIdByType({ type:"ql_market" });
            if (getVal(res, 'data.isSubscribe') === 'N') {
              return locationTo(`/wechat/page/live-share?liveId=${this.liveId}&topicId=${this.topicId}&appId=${getVal(res, 'data.appId')}`)
            }
          }
        }
      }
    }

    setTimeout(() => {
      locationTo(`/topic/details?topicId=${this.topicId}`);
    }, 800);
    
    window.loading(false);
  }

  handleAccept = () => {
    const { userInfo } = this.props;
    const showModalMoreInfo = !(userInfo && userInfo.wechatAccount && userInfo.mobile);
    if (!showModalMoreInfo) {
      this.sendInv();
      return;
    }
    this.setState({
       // 用户未绑定微信号和手机号时显示弹窗要求其完善信息
       showModalMoreInfo,
    })
  }
  
  render() {
    const { topicInfo, createUser, isShow, isStatus, showModalMoreInfo } = this.state;
    const { userInfo: { name, headImgUrl, mobile, wechatAccount } = {} } = this.props;

    return (
      <Page title="嘉宾邀请链接" className="send-box">
        <header>
          <img src="//img.qlchat.com/qlLive/liveComment/JFTMF6D3-MMZI-IOEM-1548661231317-W8PMC7LL2UDH.png" alt=""/>
        </header>
        <main>
          <div className="content">
            <div className="title">亲爱的{createUser.name}</div>
            <div className="desc">邀请您成为<span className="gold">【{topicInfo.topic}】</span>的嘉宾</div>
            <div className="from">
              <div className="avatar" style={{backgroundImage: `url(${headImgUrl})`}}></div>
              {name}
            </div>
          </div>
          <div className="footer">
          { 
            isShow && this.isShare &&
            <button className="send-btn" onClick={this.handleAccept}>接受邀请</button>
          }
          {
            isShow && !this.isShare &&
            <ul className="c-mt-20">
              <li data-idx={ 1 }>点击页面右上角<img src={ require("./img/btn_gd.png") } alt=""/>选择发送给<img src={ require("./img/btn_share.png") } alt=""/>好友或<img src={ require("./img/btn_cf.png") } alt=""/>朋友</li>
              <li data-idx={ 2 }>一条链接只能邀请一个用户</li>
            </ul>
          }
          </div>
        </main>
        <footer>
          <img src="//img.qlchat.com/qlLive/liveComment/LACV5N44-JCPX-2W8R-1548661244700-3LLX64WF4I2S.png" alt=""/>
        </footer>
        <Curtain
            className="modal-user-info"
            isOpen={showModalMoreInfo}
            maskClosable={false}
            showCloseBtn
            onClose={() => this.setState({ showModalMoreInfo: false })}
            on
        >
            <img className='user-avatar' src={`${headImgUrl || '//img.qlchat.com/qlLive/liveCommon/normalLogo.png'}?x-oss-process=image/resize,w_75,h_75,m_fill,limit_0`} />
            <div className="display-text">
                <p className="title">恭喜你成为<strong>【{ topicInfo.topic }】</strong>的嘉宾!</p>
                <p className="desc">根据<span className="c-color-main">《中华人民共和国互联网安全法》</span>要求，在互联网发布信息、直播等，需进行身份信息验证。请填写你的真实信息，感谢理解和支持。</p>
            </div>
            <WechatPhoneBinding wechat={wechatAccount} phone={mobile} onSuccess={this.handleInfoBindingSuccess} onFail={({ msg }) => window.toast(msg || '提交信息失败')} />
        </Curtain>
      </Page>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    userInfo: state.common.userInfo.user,
  }
};

const mapActionToProps = {
  getUserInfo,
  isServiceWhiteLive,
};

module.exports = connect(mapStateToProps, mapActionToProps)(index);