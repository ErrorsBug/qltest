/**
 * Created by dodomon on 2017/11/06.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPushInfo } from 'actions/vip';
import { autobind } from 'core-decorators';

@autobind
class PushVipDialog extends PureComponent {

	state = {
		/* 是否同步到动态 */
		timelineChecked: false,

		pushQl:false,
		pushSelf: false,
		

		// 千聊公众号信息
		qlchatInfo: {
			lastPushTime: "",
			oneInterval:24,
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
		this.getPushInfo();
	}

	componentDidUpdate(){
	}

	componentWillReceiveProps(props){

	}


	/**
	 * 多选框事件
	 * 
	 * @param {any} key 
	 * @memberof PushChannelDialog
	 */
	changeCheckbox(key) {
		this.setState({
			[key]:!this.state[key]
		})
	}

	/**
	 * 
	 * 获取话题推送信息
	 * @memberof PushChannelDialog
	 */
	async getPushInfo() {
			let result = await this.props.getPushInfo(this.props.cVipId, this.props.liveId);
			if (result.state && result.state.code == 0) {
				this.setState({
					qlchatInfo:result.data.qlchatInfo,
					kaifangInfo:result.data.kaifangInfo,
				})
			}
		
	}

	async push() {
		
		if (!this.state.timelineChecked && !this.state.pushQl && !this.state.pushSelf){
			window.toast('请勾选推送选项');
			return false;
		}
		
		this.props.hide();

		setTimeout(() => {
			location.href = `/wechat/page/course/push/vip/${this.props.cVipId || this.props.liveId}?sync=${this.state.timelineChecked ? 'Y' : 'N'}&pushQl=${this.state.pushQl ? 'Y' : 'N'}&pushSelf=${this.state.pushSelf ? 'Y' : 'N'}&liveId=${this.props.liveId}`
		}, 50);
	}

	close(e) {
		if (e.target.className === "push-course-dialog" ||
			e.target.className === "cancel-btn" ) {
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
						{/* <ul className='select_ul'>
							{
								(this.state.qlchatInfo.lastPushTime || (this.state.qlchatInfo.dayPushed >= this.state.qlchatInfo.daySum && this.state.qlchatInfo.dayPushed != 0) )?
								<li  className='disable'>
									<span className={`checkbox`}></span>
									千聊live服务号<i>（每月{this.state.qlchatInfo.totalNum}次，本月还剩{this.state.qlchatInfo.totalNum - this.state.qlchatInfo.pushedNum}次）</i>
									{
										this.state.qlchatInfo.pushedNum >= this.state.qlchatInfo.totalNum?
										<var className='tips'>次数已满</var>
										:this.state.qlchatInfo.lastPushTime?
										<var className='tips'>{this.state.qlchatInfo.oneInterval}小时内只能推1次</var>
										:null	
									}
								</li>
								:
								<li onClick={() => { this.changeCheckbox('pushQl') }}>
									<span className={`checkbox ${this.state.pushQl?'icon_checked':''}`}></span>
									千聊live服务号<i>（每月{this.state.qlchatInfo.totalNum}次机会，本月还剩{this.state.qlchatInfo.totalNum - this.state.qlchatInfo.pushedNum}次）</i>
								</li>	

							}
						</ul> */}
						<ul className='select_ul'>
							{
								(this.state.kaifangInfo && this.state.kaifangInfo.isBindKaifang) ?
									<li className={this.state.kaifangInfo.lastPushTime ? 'disable':''} onClick={() => { if (!this.state.kaifangInfo.lastPushTime) { this.changeCheckbox('pushSelf') } }}>
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

PushVipDialog.defaultProps = {
	isShow: false
};

PushVipDialog.propTypes = {
	isShow: PropTypes.bool,
	liveId: PropTypes.string,
};


function mapStateToProps(state) {
	return {
		
	}
}

const mapActionToProps = {
	getPushInfo,
};

export default connect(mapStateToProps, mapActionToProps)(PushVipDialog);

