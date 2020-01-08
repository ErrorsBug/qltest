/**
 *
 * 
 *
 *
 *
 *
 *
 * 已废弃，暂时保留不删
 */


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPushNum } from '../../../../../actions/thousand-live-normal';
import { pushTopic } from '../../../../../actions/thousand-live-common';
import { fetchTimelineRemainTimes } from '../../../../../actions/live';
import { autobind } from 'core-decorators';

@autobind
class PushLiveDialog extends PureComponent {

	state = {
		/* 是否同步到动态 */
		timelineChecked: false,

		maxPushNum: 0,
		leftPushNum: 0,
		leftFeedPushNum: 0,
		maxFeedPushNum: 0,
	};

	data = {
		inited: false
	};

	componentDidMount(){
		if(this.props.power.allowMGTopic){
			this.initTimelineRemainTimes()
		}
	}

	componentDidUpdate(){

	}

	componentWillReceiveProps(props){

	}

	async initTimelineRemainTimes(){
		try{
			const result = await this.props.fetchTimelineRemainTimes(this.props.topicId, 'topic', this.props.topicId)
			if(result && result.state && result.state.code === 0){
                const {maxPushNum, leftPushNum, leftFeedPushNum, maxFeedPushNum} = result.data
                this.setState({
                    maxPushNum, leftPushNum, leftFeedPushNum, maxFeedPushNum
                })
            }
		}catch(err){
			console.error(err)
		}
	}

	async push(){
		if(this.state.leftPushNum <= 0){
			window.toast('推送次数已达上限');
			return false
		}
		this.props.hide();
		setTimeout(() => {
			location.href = `/wechat/page/course/push/topic/${this.props.topicId}?sync=${(this.state.timelineChecked && this.state.leftFeedPushNum > 0) ? 'Y' : 'N'}&liveId=${this.props.liveId}`
		}, 50);
	}

	close(e) {
		if (e.target.className === "push-live-dialog" ||
			e.target.className === "cancel-btn" ||
			e.target.className === "confirm-btn") {
			this.props.hide();
		}
	}

	/* 切换同步到动态选项 */
	toggleTimelineChecked(){
		const timelineChecked = !this.state.timelineChecked
		this.setState({timelineChecked})
	}

	gotoTimelineTuto(e) {
        e.stopPropagation()
        setTimeout(function() {
            location.href = 'https://mp.weixin.qq.com/s/nQWzLse4FITW91B_wpDYDQ'
        }, 100);
    }

	render() {
		if(!this.props.isShow) return null;

		return (
			<div className="push-live-dialog" onClick={this.close}>
				<div className="container">
					<div className='channel-push-confirm-content'>
                        <header>还剩<var>{this.state.leftPushNum}</var>次推送机会</header>
                        <p>给开启通知的粉丝推送新话题开播通知，该话题总共<var>{this.state.maxPushNum}</var>次推送机会，推送间隔需大于24小时，请谨慎使用!</p>
                        {
                            this.state.leftPushNum > 0 &&
                            this.state.leftFeedPushNum > 0 &&
                            <section
								onClick={this.toggleTimelineChecked}
								className={this.state.timelineChecked ? 'new checked' : 'new'}
							>
								同时发布到直播间动态
								<span className='goto' onClick={this.gotoTimelineTuto}></span>
							</section>
                        }
                        <a href='http://mp.weixin.qq.com/s/Q5eOCFHIrWusXPeOvk3V2w'>
							<span className='how-to-push'></span>
							如何使用自己的服务号推送
						</a>
                    </div>

					<div className="operation">
						<div className="cancel-btn" onClick={this.close}>取消</div>
						<div className="confirm-btn" onClick={this.push}>去推送</div>
					</div>
				</div>
			</div>
		)
	}
}

PushLiveDialog.defaultProps = {
	isShow: false
};

PushLiveDialog.propTypes = {
	isShow: PropTypes.bool,
	liveId: PropTypes.string,
	topicId: PropTypes.string
};


function mapStateToProps (state) {
	return {
		power: state.thousandLive.power,
	}
}

const mapActionToProps = {
	getPushNum,
	pushTopic,
	fetchTimelineRemainTimes,
};

export default connect(mapStateToProps, mapActionToProps)(PushLiveDialog);

// export default PushLiveDialog
