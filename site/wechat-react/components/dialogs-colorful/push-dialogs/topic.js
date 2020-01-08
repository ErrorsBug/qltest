/**
 * Created by dodomon on 2017/11/06.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTopicPushInfo } from 'thousand_live_actions/thousand-live-common';
import { autobind } from 'core-decorators';

@autobind
class PushTopicDialog extends PureComponent {

	state = {
		/* 是否同步到动态 */
		timelineChecked: false,

		pushQl:false,
		pushSelf: false,
		

		// 千聊公众号信息
		qlchatInfo: {
			dayPushedSum:0,
			daySum:0,
			lastPushTime:"",
			pushedNum:0,
			totalNum:0,
		},
		// 千聊公众号信息
		kaifangInfo:{
			isBindKaifang:false,
			lastPushTime:"",
			pushedNum7:0,
			
		},

		
		
	};

	data = {
		inited: false
	};

	componentDidMount(){
		this.getTopicPushInfo();
	}

	componentDidUpdate(){
	}


	componentWillReceiveProps(nextProps) {
        if (this.props.topicId != nextProps.topicId) {
			this.getTopicPushInfo(nextProps.topicId);
        }
	}
	
	/**
	 * 多选框事件
	 * 
	 * @param {any} key 
	 * @memberof PushTopicDialog
	 */
	changeCheckbox(key) {
		this.setState({
			[key]:!this.state[key]
		})
	}

	/**
	 * 
	 * 获取话题推送信息
	 * @memberof PushTopicDialog
	 */
	async getTopicPushInfo(topicId = this.props.topicId ) {
		if (topicId){
			let result = await this.props.getTopicPushInfo({ topicId: topicId });
			if (result.state && result.state.code == 0) {
				this.setState({
					qlchatInfo:result.data.qlchatInfo,
					kaifangInfo:result.data.kaifangInfo,
				})
			}
		}
		
	}

	async push() {
		
		if (!this.state.timelineChecked && !this.state.pushQl && !this.state.pushSelf){
			window.toast('请勾选推送选项');
			return false;
		}
		this.props.hide();

		setTimeout(() => {
			location.href = `/wechat/page/course/push/topic/${this.props.topicId}?sync=${this.state.timelineChecked ? 'Y' : 'N'}&pushQl=${this.state.pushQl ? 'Y' : 'N'}&pushSelf=${this.state.pushSelf ? 'Y' : 'N'}&liveId=${this.props.liveId}`
		}, 50);
	}

	close(e) {
		if (e.target.className === "push-course-dialog" ||
			e.target.className === "cancel-btn" 
			) {
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
			<div className="push-course-dialog" onClick={this.close}>
				<div className="container">
					<div className='main'>
						<header>选择推送渠道</header>
						<ul className='select_ul'>
							{
								(this.state.qlchatInfo.lastPushTime  || (this.state.qlchatInfo.dayPushedSum !=0 && this.state.qlchatInfo.dayPushedSum >= this.state.qlchatInfo.daySum )) ? 
								<li className='disable'>
									<span className={`checkbox`}></span>
									千聊live服务号<i>（该话题共{this.state.qlchatInfo.totalNum}次推送机会，已推送{this.state.qlchatInfo.pushedNum}次，还剩{this.state.qlchatInfo.totalNum - this.state.qlchatInfo.pushedNum}次）</i>
									{	
										(this.state.qlchatInfo.pushedNum >= this.state.qlchatInfo.totalNum && this.state.qlchatInfo.pushedNum != 0) ?
										<var className='tips'>次数已满</var>	
										:this.state.qlchatInfo.lastPushTime ?
										<var className='tips'>24小时内只能推1次</var>
										:(this.state.qlchatInfo.dayPushedSum !=0 && this.state.qlchatInfo.dayPushedSum >= this.state.qlchatInfo.daySum )?
										<var className='tips'>直播间所有话题1天只能推送{this.state.qlchatInfo.daySum}次！</var>
										:null	
									}
								</li>
								:	
								<li onClick={()=>{this.changeCheckbox('pushQl')}}>
									<span className={`checkbox ${this.state.pushQl?'icon_checked':''}`}></span>
									千聊live服务号<i>（该话题共{this.state.qlchatInfo.totalNum}次推送机会，已推送{this.state.qlchatInfo.pushedNum}次，还剩{this.state.qlchatInfo.totalNum - this.state.qlchatInfo.pushedNum}次）</i>
								</li>
							}
						</ul>
						<ul className='select_ul'>
							{
								(this.state.kaifangInfo && this.state.kaifangInfo.isBindKaifang) ?
								<li  className={this.state.kaifangInfo.lastPushTime ? 'disable':''} onClick={()=>{ if(!this.state.kaifangInfo.lastPushTime){this.changeCheckbox('pushSelf')}}}>
									<span className={`checkbox ${this.state.pushSelf?'icon_checked':''}`}></span>
									自己的服务号<i>（近7天您已经推送{this.state.kaifangInfo.pushedNum7}次，请注意推送频率，否则需自我承担风险）</i>
									{
										this.state.kaifangInfo.lastPushTime?
										<var className='tips'>24小时内只能推1次</var>
										:null	
									}
								</li>
								:
								<li className='disable'>
									<span className="checkbox"></span>
									自己的服务号<i>（您尚未对接服务号）</i>
								</li>

							}
						</ul>
						<ul className='select_ul'>
							<li onClick={()=>{this.changeCheckbox('timelineChecked')}}>
								<span className={`checkbox ${this.state.timelineChecked?'icon_checked':''}`}></span>
								发布到直播间动态<i className='new'></i>
								<a className="goto-tuto icon_enter" href='https://mp.weixin.qq.com/s/nQWzLse4FITW91B_wpDYDQ'></a>
							</li>
						</ul>
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

PushTopicDialog.defaultProps = {
	isShow: false
};

PushTopicDialog.propTypes = {
	isShow: PropTypes.bool,
	liveId: PropTypes.string,
	topicId: PropTypes.string
};


function mapStateToProps(state) {
	return {
		
	}
}

const mapActionToProps = {
	getTopicPushInfo,
};

export default connect(mapStateToProps, mapActionToProps)(PushTopicDialog);

// export default PushTopicDialog
