
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Picture from 'ql-react-picture';
import ScrollToLoad from 'components/scrollToLoad';
import { fillParams } from 'components/url-utils';
import { share } from 'components/wx-utils';

import Page from 'components/page';

import {
	getTrialCards
} from '../../actions/master'

function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime'),
		//会员信息
		memberId: get(state, 'member.info.id'),
		giftNum: get(state, 'member.info.giftNum'),
	}
}

const mapActionToProps = {
	getTrialCards
};

class ExperienceInvitation extends Component {

	state = {
		friends: null,
		isLayerShow: false
	}
	
	componentWillMount () {
		this.initFriends()
		this.initShare()
	}

	initShare() {
		share({
			title: "千聊会员体验卡免费领取",
			desc: "点击进入即可免费领取，享受精品好课随意学、海量课程八折优惠、会员专属优惠券等多种会员权益！",
			imgUrl: window.location.protocol + require("./img/share-logo.png"),
			shareUrl: `${window.location.origin}/wechat/page/membership/invitation/card/` + this.props.memberId,
		});
	}

	async initFriends () {
		const friends = await this.props.getTrialCards()

		this.setState({
			friends
		})
	}

	toggleLayer () {
		this.setState({
			isLayerShow: !this.state.isLayerShow
		})
	}

	renderFriends () {
		const { friends } = this.state
		return friends && friends.length > 0 ? (
			<div className="friends-list">
				{
					friends.map( (f, index) => (
						<div
							key={`friends-item-${index}`}
							className="friends-item"
							>
							<div className="f-poster">
								<Picture src={f.headImgUrl} />
							</div>
							<p className="f-name sing-line">{f.userName}</p>
							<p className="f-status">已领取</p>
						</div>
					))
				}
			</div>
		) : (
			<div className="not-friends-list">暂无邀请</div>
		)
	}

	render() {
		
		return (
			<Page title="亲友共读" className='experience-invitation-page'>
				<div className="experience-header">
					<div className="bg"></div>
					<div className="rule">
						<p className="title">邀请规则</p>
						<p>
							1. 点击【送好友】按钮，发送给好友领取即可<br />
							2. 会员体验卡有效期为7天，激活后开始计算<br />
							3. 体验会员可畅听【免费听】模块内容，享受买课8折优惠，享受会员优惠券福利<br />
						</p>
					</div>
				</div>
				<div className="invitation-card">
					<p className="title">我的体验卡</p>
					<div className="container">
						<div className="experience-invitation">
							<span className="icon-experience"></span>
							<p className="tile-experience">千聊会员体验卡</p>
							<p className="count-experience">x{this.props.giftNum}</p>

							{
								this.props.giftNum > 0 ? (
									<div className="invitation-btn">
										<span 
											className="on-log"
											data-log-name="开通会员"
											data-log-region="invitation-btn"
											onClick={this.toggleLayer.bind(this)}>送好友</span>
									</div>
								) : (
									<div className="invitation-btn disable">
										<span>已送完</span>
									</div>
								)
							}
						</div>
						{
							this.renderFriends()
						}
					</div>
				</div>

				{
					this.state.isLayerShow && (
						<div className="layer" onClick={this.toggleLayer.bind(this)}>
							<div className="layer-container">点击右上角，立即发送给亲友体验<br />【千聊会员】吧</div>
						</div>
					)
				}
			</Page>
		);
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceInvitation);