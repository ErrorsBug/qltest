import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { digitFormat, getVal} from 'components/util'
import {
	fetchPayUser
} from '../../actions/channel-intro';

@autobind
class CourseDetail extends Component {
  state = {
    audienceCount: 0
  }
  componentDidMount(){
		if(this.props.channelId){
			this.initChannelIntroHeader();
		}
	}
	async initChannelIntroHeader(){
		const res = await this.props.fetchPayUser({
			channelId: this.props.channelId,
		});
		if(res.state.code === 0){
			this.setState({
				audienceCount: res.data.payUserCount
			});
		}
	}
	get browsNum () {
		if(this.props.channelId){
			return this.state.audienceCount
		}else{
			return this.props.browsNum || this.props.topicInfo.browseNum || 0
		}
	}
  render() {
		const { isTopic = false } = this.props;
    return (
      <div className="detail-course-box">
        <div className="icon-one">
					{ isTopic ? '单课' : (`已开${this.props.channelInfo.topicCount || 0 }课 | 共${this.props.channelInfo.planCount > this.props.channelInfo.topicNum ? this.props.channelInfo.planCount : this.props.channelInfo.topicNum}课`) }
					</div>
        <div className="icon-two">{digitFormat(this.browsNum)}次学习</div>
        <div className="icon-three">支持回听</div>
      </div>
    )
  }
}

function mapStateToProps (state) {
	return {
		channelInfo: state.channelIntro.channelInfo,
		topicInfo: state.topicIntro.topicInfo,
		channelId: state.channelIntro.channelId,
		sysTime: state.common.sysTime,
		browsNum: getVal(state, 'topicIntro.browsNum', 0),
	}
}

const mapActionToProps = {
	fetchPayUser
};

export default connect(mapStateToProps, mapActionToProps)(CourseDetail);