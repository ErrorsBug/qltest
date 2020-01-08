import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import Picture from 'ql-react-picture';
import { getLiveInfo,getQrInfo } from '../../actions/live'

@autobind
class ShareGuide extends Component {
  state = {
    qrUrl: '',
  }

  // 直播间ID
  get liveId () {
    return this.props.location.query.liveId || ''
  }

  get appId(){
    return this.props.location.query.appId || '';
  }

  async componentDidMount(){
    this.props.getLiveInfo(this.liveId);
    const { data } = await getQrInfo({
        liveId: this.liveId,
        appId: this.appId,
        channel: "mgrInvite"
      })
    this.setState({
      qrUrl: data.qrUrl || '',
    })
  }

  render() {
    const { liveInfo } = this.props;

    return (
      <Page title="分享页" className="guide-box">
        <div className="guide-cont">
          <div className="guide-main">
            <div className="guide-head">您已成为{ liveInfo.entity && <strong>【{ liveInfo.entity.name }】</strong>}的管理员</div>
            <div className="guide-er">
              <div className="er-box">
                <Picture src={ this.state.qrUrl } placeholder={true}  resize={{w:'306',h:"306"}} className="er-img" />
              </div>
              <h3>及时查看讲课列表，讲课收入</h3>
              <p>长按识别二维码</p>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    liveInfo: state.live.liveInfo || {}
  }
};

const mapActionToProps = {
  getLiveInfo
};

export default connect(mapStateToProps, mapActionToProps)(ShareGuide);
