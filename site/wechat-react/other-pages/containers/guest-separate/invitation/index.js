/**
 * Created by dylanssg on 2017/8/2.
 */
import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { share } from 'components/wx-utils';
import { locationTo } from 'components/util';
import { request } from 'common_actions/common';
import {
	acceptInvitation,
	getQrCode,
} from '../../../actions/guest-separate'
import {  getRealStatus, getCheckUser } from "../../../actions/live";
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import MiddleDialog from 'components/dialog/middle-dialog';


@autobind
class Invitation extends Component{
	state = {
		accepterId: this.props.invitationInfo.userId,
		accepter: this.props.invitationInfo.userName,
		date: '',
		showFollowTip: false,
		showQrCodeDialog: false,
		qrUrl: '',
		newRealStatus: 'no',
		realStatus: 'unwrite',
		isShowReal: false,
		isNotBtn: false,
		busynessType:this.props.location.query.channelId?"channel":(this.props.location.query.campId?"camp":"topic"),
		showInviteDialog: false
	};
	get liveId () {
		return this.props.location.query.liveId;
	}
	componentDidMount(){
		this.initDataReal();
		if((!this.props.location.query.channelId && !this.props.location.query.topicId && !this.props.location.query.campId) || !this.props.location.query.id){
			setTimeout(()=>{
				toast('缺少参数')
			},3000)
		}else{
			share({
				title: `分成嘉宾邀请`,
				timelineTitle: `${this.props.invitationInfo.createByName}向你发出嘉宾邀请，你将获得本课程入场券净收入${this.props.invitationInfo.sharePercent}%`,
				desc: `${this.props.invitationInfo.createByName}向你发出嘉宾邀请，你将获得本课程入场券净收入${this.props.invitationInfo.sharePercent}%`,
				timelineDesc: `${this.props.invitationInfo.createByName}向你发出嘉宾邀请，你将获得本课程入场券净收入${this.props.invitationInfo.sharePercent}%`, // 分享到朋友圈单独定制
				imgUrl: this.props.userInfo.headImgUrl,
				shareUrl: location.href
			});
		}
	}
	
	async initDataReal(){
		if (this.props.invitationInfo.createBy != this.props.userInfo.userId) {
			try {
				const myLiveRes = await request({
					url: '/api/wechat/transfer/h5/live/myLiveEntity',
					method: 'POST',
					body: {}
				});
				const myLiveId = myLiveRes.data.entityPo && myLiveRes.data.entityPo.id;
				const reqsArr = [this.props.getCheckUser()];
				if (myLiveId) {
					reqsArr.push(this.props.getRealStatus(myLiveId, 'live'));
				}
				const [verifyRes, realNameRes] = await Promise.all(reqsArr);
				let data = {};
				if (realNameRes) {
					data = realNameRes.data;
				}
				const newReal = (verifyRes.data && verifyRes.data.status) || 'no';
				const oldReal = data.status || 'unwrite';
				const flag = Object.is(newReal, 'pass');
				this.setState({
					newRealStatus: newReal,
					realStatus: oldReal,
					isShowReal: flag,
					isNotBtn: !flag,
				});
			} catch (err) {
				console.error(err);
			}
		}
	}
	
	goToIntro(){
		if(this.state.busynessType==="channel"){
			locationTo(`/live/channel/channelPage/${this.props.location.query.channelId}.htm`);
		}else if(this.state.busynessType==="camp"){
			locationTo(`/wechat/page/camp-detail?campId=${this.props.location.query.campId}`);
		}else{
			locationTo(`/topic/details?topicId=${this.props.location.query.topicId}`);
		}
	}
	executeBtnClickHandle(){
		if(!this.state.isShowReal){
			this.setState({
				isNotBtn: true,
			})
		} else {
			if(!this.state.accepterId) {
				this.acceptInvitation();
			}else{
				this.goToIntro();
			}
		}
	}
	async acceptInvitation(){
		let result = await this.props.acceptInvitation({
			guestId: this.props.location.query.id,
			channelId: this.props.location.query.channelId || '',
			topicId: this.props.location.query.topicId || '',
			campId: this.props.location.query.campId || '',
			type:this.state.busynessType,
			timeStamp: this.props.location.query.ts
		});
		if(result.state.code === 0){
			// this.getQrCode();
			this.setState({
				accepterId: this.props.userInfo.userId,
				showInviteDialog: true
			})
		}else{
			window.toast(result.state.msg);
		}
	}
	async getQrCode(){
		let showQl;
		// if(this.props.subscribeInfo.isBindThird && !this.props.subscribeInfo.isFocusThree) {
		// 	showQl = 'N';
		// } else if (!this.props.subscribeInfo.isBindThird && !this.props.subscribeInfo.subscribe) {
		// 	showQl = 'Y';
		// }else{
		// 	return;
		// }

		//临时改动只判断是否关注千聊
		if(!this.props.subscribeInfo.subscribe){
			showQl = 'Y';
		}else{
			return;
		}
		this.setState({
			showFollowTip: true
		});
		const result = await this.props.getQrCode(
			{
				liveId: this.props.invitationInfo.liveId,
				channelId: this.props.location.query.channelId,
				topicId: this.props.location.query.topicId || '',
				campId: this.props.location.query.campId || '',
				toUserId: this.props.location.query.id,
				channel: 'guestAccept',
				showQl
			}
		);

		if(result && result.data && result.data.qrUrl) {
			this.setState({
				qrUrl: result.data.qrUrl
			})
		}
	}
	clearRealName(){
        this.setState({
            isNotBtn: false
        })
    }
	render(){
		return (
			<Page title="邀请函" className="guest-separate-invitation">
				<div className="invitation-wrap">
					<div className="invitation-container">
						<div className="title"></div>
						<div className="content">
							<div className="sub-title">Dear</div>
							邀请你成为
							<span className="to-channel-btn" onClick={this.goToIntro}>
								《{
									this.state.busynessType==="channel"?
									this.props.invitationInfo.channelName
									:
									(
										this.state.busynessType==="camp"?
										this.props.invitationInfo.campName
										:
										this.props.invitationInfo.topicName
									)
								}》
							</span>
							收益分成嘉宾！
							<div className="tip">你将获得本课程入场券净收入的<strong>{this.props.invitationInfo.sharePercent}%</strong></div>
						</div>
						<div className="inviter">
							邀请人：
							<div className="avatar">
								<img src={`${this.props.invitationInfo.createByHeadImgUrl}?x-oss-process=image/resize,m_fill,h_40,w_40`} alt=""/>
							</div>
							<div className="name">{this.props.invitationInfo.createByName}</div>
						</div>
						{
							this.props.invitationInfo.createBy == this.props.userInfo.userId ?
								<div className="share-guide"></div>
								:
								<div className="status-box">
									{
										this.state.accepterId &&
										(this.state.accepterId == this.props.userInfo.userId ? '您已接受邀请' : this.props.invitationInfo.userName + '已接受邀请')
									}
									<div className="execute-btn" onClick={this.executeBtnClickHandle}>
										{this.state.accepterId ? '查看课程' : '接受邀请'}
									</div>
									<div className="to-mine-center-btn" onClick={() => locationTo('/wechat/page/mine')}>返回个人中心</div>
								</div>
						}
						{
							this.props.invitationInfo.createBy != this.props.userInfo.userId &&
							<div className="notice">
								可在“个人中心”-“我的钱包”中查看嘉宾分成收益明细
							</div>
						}
					</div>
				</div>
				{
					this.state.showFollowTip &&
					<div className="follow-tip">
						请关注公众号，及时接收结算通知
						<div className="follow-btn" onClick={() => this.setState({showQrCodeDialog: true})}>前往关注</div>
					</div>
				}
				<div className={`qrcode-dialog${this.state.showQrCodeDialog ? ' show' : ''}`}  onClick={() => this.setState({showQrCodeDialog: false})}>
					<div className="container" onClick={(e) => e.stopPropagation()}>
						<div className="header">
							<div className="remove-btn icon_delete"  onClick={() => this.setState({showQrCodeDialog: false})}></div>
						</div>
						<div className="content">
							<div className="tip">请关注公众号，及时接收结算通知</div>
							<div className="fingerprint">
								<div className="qrcode">
									<img src={this.state.qrUrl} alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<NewRealNameDialog 
                    show = { this.state.isNotBtn }
                    onClose = {this.clearRealName.bind(this)}
                    realNameStatus = { this.state.realStatus || 'unwrite'}
                    checkUserStatus = { this.state.newRealStatus || 'no' }
					isClose={true}
				/>
				<MiddleDialog
					show={this.state.showInviteDialog}
					buttons="confirm"
					confirmText="我知道了"
					title="您已接受邀请"
					buttonTheme="line"
					onBtnClick={() => {
						this.setState({
							showInviteDialog: false
						})
					}}
				>
					<div className="invited-dialog-content">
						<p className="attention">注意：嘉宾分成需要嘉宾本人在【个人中心-我的钱包-嘉宾分成】里进行手动提现
						</p>
						<a href="/wechat/page/guest-separate/channel-list-c">点击前往嘉宾提现页>>></a>
						<div className="qrcode-wrap">
							<span className="left-bottom"></span>
							<span className="left-top"></span>
							<span className="right-bottom"></span>
							<span className="right-top"></span>
							<div className="qrcode">
								<img src={require('./img/qlchat-qr.jpg')} alt=""/>
							</div>
						</div>
						<p className="tip">
							关注千聊二维码<br />
							接收嘉宾分成收益提醒
						</p>
					</div>
				</MiddleDialog>
			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {
		userInfo: state.common.userInfo,
		invitationInfo: state.guestSeparate.invitationInfo,
		subscribeInfo: state.common.subscribe
	}
}, {
	acceptInvitation,
	getQrCode,
	getRealStatus,
	getCheckUser
})(Invitation);