import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';
import { userInfo } from '../../actions/camp'
import Page from 'components/page';
import PortalCom from '../../components/portal-com'

@autobind
class LogOutRule extends Component {
  state = {
    mobile: ''
  }
  componentDidMount() {
    this.getUserInfo()
  }
  // 获取用户信息
  async getUserInfo(){
    const { user } = await userInfo();
    this.setState({
      mobile: user?.mobile || ''
    })
  }
  agreeLogout = () => {
    if(this.state.mobile){
      locationTo('/wechat/page/mine/verification-vode')
    } else {
      window.toast('尚未绑定手机！')
    }
  }
  render() {
    return (
        <Page title="注销账号" className="logout-rule">
          <div className="logout-rule-box">
            <div className="notice">
              <div className="importance">
                <img src="https://img.qlchat.com/qlLive/activity/image/KTT7AMFI-Z8Q5-QANP-1577949308250-GMYX6S5N3JCO.png" />
                <p>重要</p>
              </div>
              <div className="notice-content">
                <p>注销账号为不可恢复操作，注销 账号后您将无法找回本账号，及本账号相关 的内容与信息；</p>
              </div>
            </div>
            <div className="earnest-read">
              <p>在您注销千聊账号之前，请您认真阅读，理解并<br />同意一下内容：</p>
            </div>
            <div className="condition">
              <p className="title">一、注销账号需要满足以下条件</p>
              <p>1、该账号必须要先绑定手机号码；</p>
              <p>2、没有资产、欠款、未结清的资金和虚拟权益；</p>
              <p>3、账号状态异常；</p>
            </div>
            <div className="condition">
              <p className="title">二、注销账号后您将无法找回本账号，及账号相关 的任何内容与倌息，包括但不限于</p>
              <p>1、该账号必须要先绑定手机号码；</p>
              <p>2、没有资产、欠款、未结清的资金和虚拟权益；</p>
            </div>
          </div>
          <PortalCom className="agree-bottom"  onClick={this.agreeLogout}>我理解并同意，仍要注销</PortalCom>
        </Page>
    );
  }
}

const mapStateToProps = function(state) {

};

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(LogOutRule);