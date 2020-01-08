
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Picture from 'ql-react-picture';
import { request } from 'common_actions/common';

import Page from 'components/page';

import {
	receiveMember
} from '../../../actions/master'


function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime'),
		sourceUserInfo: get(state, 'member.sourceUserInfo') || {},
		//会员信息
		memberLevel: get(state, 'member.info.level'),
		memberStatus: get(state, 'member.info.status'),
	}
}

const mapActionToProps = {
	receiveMember,
};

class ExperienceCard extends Component {


	async receiveMember () {

		if (this.props.sourceUserInfo.isSelf === 'Y') {
			window.toast("自己不能领取体验卡哦")
			return
		}

		if (this.props.memberLevel === 2 && this.props.status === 'Y') {
			window.toast("您已是正式会员，无需领取哦！")
			setTimeout(() => {
				window.location.href = '/wechat/page/membership-center'
			}, 300);
			return
		}

		if (this.props.memberLevel === 1 && this.props.status === 'Y') {
			window.toast("您已用过体验卡，不如送给其他人吧！")
			setTimeout(() => {
				window.location.href = '/wechat/page/membership/invitation/receive?repeat=Y'
			}, 300);
			return
		}

		if (this.props.sourceUserInfo.isMember === "N") {
			window.toast("晚了一步，链接已过期.")
			setTimeout(() => {
				window.location.href = '/wechat/page/membership-center'
			}, 300);
			return
		}

		if (this.props.sourceUserInfo.giftNum == 0) {
			window.toast("来晚一步，体验卡已被抢空了！")
			setTimeout(() => {
				window.location.href = '/wechat/page/membership-center'
			}, 300);
			return
		}
		
		const res = this.props.router.params.memberId ?
						await this.props.receiveMember(this.props.router.params.memberId)
						:
						await this.receiveMemberFromOfficialCard();
	
		if (res.state.code === 0) {
			switch (res.data.status) {
				case 0:
					window.toast("领取成功")
					if (typeof window.sessionStorage != 'undefined'  && this.props.sourceUserInfo.day > 0) {
						sessionStorage.setItem('member_experience_day', this.props.sourceUserInfo.day);
					}
					setTimeout(() => {
						window.location.href = '/wechat/page/membership/invitation/receive'
					}, 300);
					break
				case -4:
					window.toast(res.data.msg)
					setTimeout(() => {
						window.location.href = '/wechat/page/membership/invitation/receive?repeat=Y'
					}, 300);
					break
				default:
					window.toast(res.data.msg)
					setTimeout(() => {
						window.location.href = '/wechat/page/membership-center'
					}, 300);
					break
			}
		} else {
			window.toast(res.state.msg)
		}
	}

	async receiveMemberFromOfficialCard(){
		return await request({
			url: '/api/wechat/member/receiveOfficialCard',
			method: 'POST',
			body: {
				officialCardId: this.props.location.query.id
			}
		});
	}

	render() {
		
		return (
			<Page title="送你会员卡" className='experience-card-page'>
				<div className="experience-card">
					<div className="experience-container">
						<div className="user-poster">
							<Picture src={this.props.sourceUserInfo.headImgUrl}/>
						</div>
						<p className="user-name">{this.props.sourceUserInfo.name}</p>
						<p className="desc">送你{this.props.sourceUserInfo.day || 7}天千聊会员卡</p>
						<div className="experience-info">
							<div className="title">
								<span>{this.props.sourceUserInfo.day || 7}天会员体验卡</span>
							</div>
							<Picture src={require('../img/invitecard-pic-card.png')} />
						</div>
						<div className="receive-btn" onClick={this.receiveMember.bind(this)}>点击免费领取</div>
						<div className="copy-right">
							<span className="icon-ql-logo"></span>
							<p>2亿人在用的知识学习平台</p>
						</div>
					</div>
				</div>
			</Page>
		);
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceCard);