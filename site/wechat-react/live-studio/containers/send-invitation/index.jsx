import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { sendLiveShare, getLiveShare, getLiveInfo, getUserInfo, getAppIdByType } from '../../actions/live'
import { locationTo, getVal } from 'components/util';
import { getUserInfoP, isServiceWhiteLive } from '../../../actions/common';
import { showWinPhoneAuth } from 'components/phone-auth';
import { request } from 'common_actions/common';
import Curtain from 'components/curtain/index';
import WechatPhoneBinding from 'components/wechat-phone-binding/index';

@autobind
class Index extends Component {
  state = { 
    code: '',
    isSubscribe: false,
    name: '',
    showModalMoreInfo: false,
    acceptStatus: '',
    userInfo: {}
   }
  // 话题id
  get topicId () {
    return this.props.location.query.topicId || ''
  }
  // 直播间ID
  get liveId () {
    return this.props.location.query.liveId || ''
  }
  get code(){
    return this.props.location.query.code || ''
  }

  componentDidMount(){
    this.init();
  }

  async init(){
    await this.props.getLiveInfo(this.liveId);
    if(this.props.liveInfo && this.props.liveInfo.entity){
      const result = await this.props.getUserInfo("",this.props.liveInfo.entity.createBy);
      this.setState({
        name: result.user.name
      })
    }

    if (!this.code) {
      // const { data } = await sendLiveShare({
      //   liveId: this.liveId
      // });
      // this.setState({
      //   code: data.code,
      // })
    } else {
      this.setState({
        code: this.code
      })
    }
  }

  sendInvit(){
    if (this.state.acceptStatus === 'pending') return;
    this.setState({
      acceptStatus: 'pending',
    })

    this.doInvit()
      .catch(err => {
        window.toast(err.message);
        
        locationTo(`/wechat/page/live/${this.liveId}`);
      })
      .then(() => {
        this.setState({
          acceptStatus: '',
        })
        window.loading(false);
      })
  }

  async doInvit() {
    // B端沉淀调整
    // const result = await this.props.getUserInfo();
    // if (!result.user.mobile) {
    //   await showWinPhoneAuth({close: false});
    // }

    if (!this.state.code) throw Error('邀请链接已失效，请联系邀请人重新发送新的邀请链接');

    window.loading(true);

    const res = await request.post({
      url: '/api/wechat/live/getInvite',
      body: {liveId: this.liveId, code: this.state.code}
    })

    if (res.state.code) {
      throw Error(res.state.msg);
    } else {
      const res = await this.props.isServiceWhiteLive(this.liveId);
      if (getVal(res, 'data.isWhite') === 'N') {
        const res = await getAppIdByType({ type:"ql_market" });
        if (getVal(res, 'data.isSubscribe') === 'N') {
          locationTo(`/wechat/page/share-guide?liveId=${this.liveId}&appId=${ getVal(res, 'data.appId') }`)
          return;
        }
      }
    }

    locationTo(`/wechat/page/live/${this.liveId}`);    
  }

  handleInfoBindingSuccess = () => {
    window.toast('提交成功！');
    this.setState({
        showModalMoreInfo: false,
    });
    setTimeout(() => {
      this.sendInvit();
    }, 800);
  }

  handleAccept = async () => {
    const { getUserInfoP } = this.props;
    const userInfo = await getUserInfoP();
    const showModalMoreInfo = !(userInfo && userInfo.wechatAccount && userInfo.mobile);
    if (!showModalMoreInfo) {
      this.sendInvit();
      return;
    }
    this.setState({
       // 用户未绑定微信号和手机号时显示弹窗要求其完善信息
       showModalMoreInfo,
       userInfo
    })
  }

  render() {
    const { liveInfo } = this.props
    const { userInfo: { headImgUrl, mobile, wechatAccount } = {}, showModalMoreInfo } = this.state;

    return (
      <Page title="管理直播间邀请" className="send-box">
        <header>
          <img src="//img.qlchat.com/qlLive/liveComment/JFTMF6D3-MMZI-IOEM-1548661231317-W8PMC7LL2UDH.png" alt=""/>
        </header>
        <main>
          <div className="content">
            <div className="title">{ this.state.name }的直播间</div>
            <div className="desc">{ liveInfo.entity && <span className="gold">【{ liveInfo.entity.name }】</span>}<br/>邀请您成为直播间管理员</div>
          </div>
          <div className="footer">
            <button className="send-btn" onClick={this.handleAccept}>接受邀请</button>
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
            onClose={()=>this.setState({ showModalMoreInfo: false })}
        >
            <img className='user-avatar' src={`${headImgUrl || '//img.qlchat.com/qlLive/liveCommon/normalLogo.png'}?x-oss-process=image/resize,w_75,h_75,m_fill,limit_0`} />
            <div className="display-text">
                <p className="title">恭喜你成为{ liveInfo.entity && <strong>【{ liveInfo.entity.name }】</strong>}的管理员!</p>
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
    targetUserInfo: state.live.userInfo || {},
    liveInfo: state.live.liveInfo || {}
  }
};

const mapActionToProps = {
  getLiveInfo,
  getUserInfo,
  getUserInfoP,
  isServiceWhiteLive,
};

export default connect(mapStateToProps, mapActionToProps)(Index);