/**
 * Created by dylanssg on 2017/8/2.
 */
import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { share } from 'components/wx-utils';
import { locationTo } from 'components/util';

import {
	setGuestSeparatePercent,
	getQrCode
} from '../../../actions/guest-separate'

@autobind
class Invitation extends Component{
	state = {
		accepterId: this.props.invitationInfo.userId,
		accepter: this.props.invitationInfo.userName,
		date: '',
		showFollowTip: false,
		showQrCodeDialog: false,
		qrUrl: '',
		percentChangeStatus : this.props.percentAcceptStatus,
		busynessType:this.props.location.query.channelId?"channel":(this.props.location.query.topicId?"topic":(this.props.location.query.campId?"camp":""))
	};
	componentDidMount(){
		if((!this.props.location.query.channelId&&!this.props.location.query.topicId&&!this.props.location.query.campId) || !this.props.location.query.id ){
			setTimeout(()=>{
				toast('缺少参数')
			},3000)
		}else{
			share({
				title: `修改嘉宾分成比例请求`,
				timelineTitle: `${this.props.invitationInfo.createByName}向你发出修改嘉宾分成比例请求，将原分成比例${this.state.percentChangeStatus=="used"?"":this.props.invitationInfo.sharePercent+"%"}修改为${this.props.location.query.newPercent}%`,
				desc: `${this.props.invitationInfo.createByName}向你发出修改嘉宾分成比例请求，将原分成比例${this.state.percentChangeStatus=="used"?"":this.props.invitationInfo.sharePercent+"%"}修改为${this.props.location.query.newPercent}%`,
				timelineDesc: `${this.props.invitationInfo.createByName}向你发出修改嘉宾分成比例请求，将原分成比例${this.state.percentChangeStatus=="used"?"":this.props.invitationInfo.sharePercent+"%"}修改为${this.props.location.query.newPercent}%`, // 分享到朋友圈单独定制
				imgUrl: this.props.userInfo.headImgUrl,
				shareUrl: location.href
			});
		}

	}
	executeBtnClickFunc(){		
		if(this.state.accepterId == this.props.userInfo.userId&&this.state.percentChangeStatus==="valid") {
			this.acceptPlease();
		}		
	}
	gotoCource(){
		if(this.state.busynessType==="channel"){
			locationTo(`/live/channel/channelPage/${this.props.location.query.channelId}.htm`);
		}else if(this.state.busynessType==="topic"){
			locationTo(`/topic/details?topicId=${this.props.location.query.topicId}`);
		}else if(this.state.busynessType==="camp"){
			locationTo("/wechat/page/camp-detail?campId="+this.props.location.query.campId);
		}			
	}

	async acceptPlease(){
		let result= await this.props.setGuestSeparatePercent(this.props.location.query.id,this.props.location.query.channelId,this.props.location.query.topicId,this.props.location.query.campId,this.props.location.query.newPercent); 
		if(result.state.code==0){
			this.setState({
				percentChangeStatus:"used",
			});		
		}else{
			window.toast(result.state.msg);
		}

		// let result = await this.props.acceptInvitation({
		// 	guestId: this.props.location.query.id,
		// 	channelId: this.props.location.query.channelId
		// });
		// if(result.state.code === 0){
		// 	this.getQrCode();
		// 	this.setState({
		// 		accepterId: this.props.userInfo.userId
		// 	})
		// }
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
				topicId:this.props.location.query.topicId,
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
	render(){
		return (
			<Page title="修改嘉宾分成比例" className="precent-change-invitation">
				<div className="invitation-wrap">
					<div className="invitation-container">
						<div className="title"></div>
						<div className="content">
							<div className="sub-title">Dear</div>
							你参与的

							<span className="to-channel-btn" onClick={this.gotoCource.bind(this)}>《{this.state.busynessType==="channel"?this.props.invitationInfo.channelName:(this.state.busynessType==="camp"?this.props.invitationInfo.campName:this.props.invitationInfo.topicName)}》</span>
							收益分成嘉宾！<br/>
							现直播间向你发起分成修改请求。
							{
								this.state.percentChangeStatus=="used"?
								<div className="tip">将原分成比例修改为<strong>{this.props.location.query.newPercent}%</strong></div>
								:<div className="tip">将原分成比例<strong>{this.props.invitationInfo.sharePercent}%</strong>修改为<strong>{this.props.location.query.newPercent}%</strong></div>
							}
							
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
										this.state.accepterId &&this.state.percentChangeStatus=="used"&&
										(this.state.accepterId == this.props.userInfo.userId ? '您已同意修改' : this.props.invitationInfo.userName + '已同意修改')
									}
									
									{
										this.state.accepterId == this.props.userInfo.userId&&this.state.percentChangeStatus=="valid" ? 
										<div className="execute-btn" onClick={this.executeBtnClickFunc.bind(this)} >同意修改</div>
										:
										<div className="execute-btn" onClick={this.gotoCource.bind(this)} >查看{this.state.busynessType==="channel"?'系列课' :(this.state.busynessType==="camp"? '训练营':'课程') }</div> 
									}
									
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
			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {
		userInfo: state.common.userInfo,
		invitationInfo: state.guestSeparate.invitationInfo,
		subscribeInfo: state.common.subscribe,
		percentAcceptStatus:state.guestSeparate.percentAcceptStatus,
	}
}, {
	setGuestSeparatePercent,
	getQrCode
})(Invitation);