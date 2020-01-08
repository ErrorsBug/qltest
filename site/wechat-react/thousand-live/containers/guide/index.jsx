import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import Picture from 'ql-react-picture';
import { apiService } from "components/api-service";
import { getQrInfo } from '../../actions/live';

@autobind
class ShareGuide extends Component {
  state = { 
    topicInfo: {},
    qrUrl: '',
  }

  get topicId () {
    return this.props.location.query.topicId
  }

  get liveId () {
    return this.props.location.query.liveId
  }

  get appId(){
    return this.props.location.query.appId
  }

  async componentDidMount(){
    this.getTopicInfo();
    const { data } = await getQrInfo({
      liveId: this.liveId,
      appId: this.appId,
      channel: "topicInvite"
    })
    this.setState({
      qrUrl: data.qrUrl || '',
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
        });
      }
    })
  }

  render() {
    const { topicInfo, qrUrl } = this.state;

    return (
      <Page title="分享页" className="guide-box">
        <div className="guide-cont">
          <div className="guide-main">
            <div className="guide-head">您已成为<strong>【{ topicInfo.topic }】</strong>的嘉宾</div>
            <div className="guide-er">
              <div className="er-box">
                <Picture src={ qrUrl } resize={{w:"306", h:"306"}} className="er-img" />
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
  return {}
};

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(ShareGuide);