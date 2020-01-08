/**
 *
 * @author Dylan
 * @date 2018/10/12
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';

import Page from 'components/page';
import { share } from 'components/wx-utils';
import {
	locationTo,
	formatMoney,
	getChannelFromTypeOfBusiness
} from 'components/util';

import MemberCard from './components/member-card';
import MemberRights from './components/member-rights';
import MasterCourse from './components/master-course';
import FreeCourse from './components/free-course';
import CoursesCarousel from './components/courses-carousel';
import MemberCoupon from './components/member-coupon';
import Invitation from './components/invitation';
import BuyBtn from './components/buy-btn';
import DefaultModule from './components/default-module';
import RightsDialog from './components/rights-dialog';
import JoinedDialog from './components/joined-dialog';

import { doPay } from 'common_actions/common';
import { logMemberTrace } from 'components/log-util';
import { memberCenterConfigure } from '../../config';
import { request } from 'common_actions/common';
import QfuEnter from './components/qfu-enter-module'
import CampAd from 'components/camp-ad'

function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime', ''),
		memberInfo: get(state, 'member.info', {}),
		centerInitData: get(state, 'member.centerInitData', {}),
	}
}

const mapActionToProps = {
	doPay
};

// window.onerror = function(msg, url, line, col, error) {
// 	// 直接将错误打印到控制台
// 	console.log(arguments)

// };

@autobind
class MemberCenter extends Component {

	state = {
		showJoinedDialog: false,

		inviterName: '',
		inviteMemberId: '',
		redpacketMoney: undefined,

		invitePageDomain: '',
	};

	componentDidMount(){
		if(window.sessionStorage.getItem('showJoinedDialog') === 'Y'){
			this.setState({
				showJoinedDialog: true
			});
			window.sessionStorage.removeItem('showJoinedDialog');
		}

		this.initRedpacket();

		// 正式会员的操作
		if (this.props.memberInfo.level == 2) {
			// 获取邀请页域名
			request.post({
				url: '/api/wechat/transfer/h5/domain/getActivityDomainUrl',
				body: {
					type: 'activityMemberInvite',
				},
				sessionCache: true,
			}).then(res => {
				this.setState({
					invitePageDomain: res.data.domainUrl,
				}, () => {
					typeof _qla !== 'undefined' && _qla.collectVisible({wrap: 'member-center-wrapper'});
				})
			}).catch(err => {
			})
		}

		typeof _qla !== 'undefined' && _qla.bindVisibleScroll({wrap: 'member-center-wrapper'});

		const shareUrl = location.origin + location.pathname + '?wcl=member_share'
		share({
			title: '千聊会员-一张通往终身成长大学的门票',
			timelineTitle: '千聊会员-一张通往终身成长大学的门票',
			desc: '千聊会员，尊享口碑大课免费学、精品好课免费学、海量课程八折优惠、会员专属优惠券、大咖社群陪你学等多种会员权益！',
			timelineDesc: '千聊会员-一张通往终身成长大学的门票', // 分享到朋友圈单独定制
			imgUrl: window.location.protocol + require('../experience-invitation/img/share-logo.png'),
			shareUrl,
		});

	}

	initRedpacket = async () => {
		await Promise.resolve();

		if (this.props.memberInfo.isMember === 'Y') {
			return;
		}

		// 判断已领取邀请红包
		request.post({
			url: '/api/wechat/transfer/h5/member/invite/getRedPackInfo',
		}).then(res => {
			if (res.data.redpackInfo) {
				const redpackInfo = res.data.redpackInfo;
				const expire = Math.round((redpackInfo.expireTime - res.data.currentTime) / 1000);
				if (expire > 0 && redpackInfo.money) {
					this.setState({
						redpacketMoney: redpackInfo.money,
						inviteMemberId: redpackInfo.inviterUserId,
					})
					this.refBuyBtn && this.refBuyBtn.countRedpacketExpire(expire);
				}
			}
		}).catch(err => {
			console.error(err)
		})
	}

	showRightsDialog(index){
		this.rightsDialogRef.show(index);
	}

	joinMembership(){
		let currentPrice = this.props.centerInitData.totalFee;

		if (this.state.redpacketMoney) {
			currentPrice = Math.round(currentPrice - this.state.redpacketMoney);
			currentPrice < 0 && (currentPrice = 0);
		}

		this.props.doPay({
			type: 'MEMBER',
			total_fee: formatMoney(currentPrice),
			inviteMemberId: this.state.inviteMemberId,
			callback: res => {
				logMemberTrace({
					wcl: getChannelFromTypeOfBusiness('member', memberCenterConfigure),
					business: currentPrice
				})
				window.sessionStorage.setItem('showJoinedDialog', 'Y');
				window.location.reload();
			}
		});
	}

	render() {
		return (
			<Page title={`会员中心`} className='member-center-page'>
				<div className="member-center-wrapper">
					<div className="member-center-container">
						<MemberCard
							showRightsDialog={this.showRightsDialog}
							memberInfo={this.props.memberInfo}
							privilegeList={this.props.centerInitData.privilegeList}
							bannerUrl={this.props.centerInitData.bannerUrl}
							sysTime={this.props.sysTime}
						/>
						<QfuEnter/>
						{
							// 体验会员在这个位置显示升级按钮
							this.props.memberInfo.level === 1 && this.props.memberInfo.status === 'Y' &&
							<React.Fragment>
								<div className="but-btn-placeholder"></div>
								<BuyBtn
									price={this.props.centerInitData.totalFee}
									memberInfo={this.props.memberInfo}
									joinMembership={this.joinMembership}
								/>
								<div className="but-btn-placeholder"></div>
							</React.Fragment>
						}
						{
							this.props.memberInfo.isMember !== 'Y' &&
							<MemberRights
								showRightsDialog={this.showRightsDialog}
								privilegeList={this.props.centerInitData.privilegeList}
							/>
						}
						{
							<ul className="member-center__banner-list">
							{
								this.props.memberInfo.level == 2 &&
								<li className="banner-group on-log on-visible"
									data-log-region="wechat-group"
									onClick={() => locationTo(this.props.centerInitData.wechatGroup)}></li>
							}
							{
								// 只对「正式会员」（有效期内）开启，「个人邀请页」使用「千聊公开课」服务号所生成的域名
								!!this.state.invitePageDomain &&
								<li className="banner-red-packet on-log on-visible"
									data-log-region="banner-member-invite"
									onClick={() => locationTo(`${this.state.invitePageDomain}activity/page/membership-invite`)}></li>
							}
							</ul>
						}
						{
							this.props.centerInitData.moduleList && !!this.props.centerInitData.moduleList.length &&
							this.props.centerInitData.moduleList.map((m, i) => {
								switch(m.moduleType){
									case 'friend':
										return (
											<Invitation
												key={i}
												moduleData={m}
												memberInfo={this.props.memberInfo}
												joinMembership={this.joinMembership}
											/>
										);
										break;
									case 'quality':
										return (
											<MasterCourse
												key={i}
												location={this.props.location}
												moduleData={m}
												courseList={this.props.centerInitData.qualityCoursePoList}
												isSelected={this.props.centerInitData.isSelected}
											/>
										);
										break;
									case 'free':
										return (
											<FreeCourse
												key={i}
												moduleData={m}
											/>
										);
										break;
									case 'coupon':
										return (
											<MemberCoupon
												key={i}
												moduleData={m}
												isMember={this.props.memberInfo.isMember === 'Y'}
												joinMembership={this.joinMembership}
											/>
										);
										break;
									case 'discount':
										return (
											<CoursesCarousel
												key={i}
												moduleData={m}
											/>
										);
										break;
									default:
										return (
											<DefaultModule
												key={i}
												moduleData={m}
											/>
										)
								}
							})
						}
					</div>
				</div>
				{
					this.props.memberInfo.isMember !== 'Y' &&
					<BuyBtn
						price={this.props.centerInitData.totalFee}
						ref={r => this.refBuyBtn = r}
						redpacketMoney={this.state.redpacketMoney}
						onRedpacketExpire={() => this.setState({redpacketMoney: undefined})}
						memberInfo={this.props.memberInfo}
						joinMembership={this.joinMembership}
					/>
				}
				{/* {
					(this.props.centerInitData.wechatGroup && this.props.memberInfo.isMember === 'Y') &&
					<div className="wechat-group on-log"
					     onClick={e => locationTo(this.props.centerInitData.wechatGroup)}
					     data-log-region="wechat-group"
					>
						<div className="span-01">点击进群</div>
						<div className="span-02">大咖陪你学习</div>
					</div>
				} */}
				<RightsDialog
					ref={r => this.rightsDialogRef = r}
					privilegeList={this.props.centerInitData.privilegeList}
				/>
				{
					this.state.showJoinedDialog &&
					<JoinedDialog
						memberAppId={this.props.centerInitData.memberAppId}
					/>
				}
			</Page>
		);
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(MemberCenter);