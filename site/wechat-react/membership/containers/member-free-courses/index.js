/**
 *
 * @author Dylan
 * @date 2018/10/12
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Picture from 'ql-react-picture';
import { autobind } from 'core-decorators';

import { request, doPay } from 'common_actions/common';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';

import BuyBtn from '../member-center/components/buy-btn';

import { share } from 'components/wx-utils';
import {
	formatMoney,
	imgUrlFormat,
	locationTo,
	digitFormat,
} from 'components/util'

function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime'),
		memberInfo: get(state, 'member.info', {}),
		centerInitData: get(state, 'member.centerInitData', {}),
	}
}

const mapActionToProps = {
	doPay
};

@autobind
class MemberFreeCourses extends Component {

	state = {
		courseList: []
	};

	data = {
		page: 1,
		size: 20
	};

	componentDidMount(){
		this.getData(this.data.page);

		share({
			title: '千聊会员-一张通往终身成长大学的门票',
			timelineTitle: '千聊会员-一张通往终身成长大学的门票',
			desc: '千聊会员，尊享口碑大课免费学、精品好课免费学、海量课程八折优惠、会员专属优惠券、大咖社群陪你学等多种会员权益！',
			timelineDesc: '千聊会员-一张通往终身成长大学的门票', // 分享到朋友圈单独定制
			imgUrl: window.location.protocol + require('../experience-invitation/img/share-logo.png'),
			shareUrl: `${window.origin}/wechat/page/membership-center`,
		});
	}

	async getData(page){
		const res = await request({
			url: '/api/wechat/member/freeCourse',
			method: 'POST',
			body: {
				pageNum: page,
				pageSize: this.data.size
			}
		});
		if(res.state.code === 0){
			if(res.data.freeCourseList && res.data.freeCourseList.length){
				this.setState({
					courseList: [...this.state.courseList, ...res.data.freeCourseList]
				})
			}else if(page === 1 && (!res.data.freeCourseList || res.data.freeCourseList.length === 0)){
				this.setState({
					noData: true
				})
			}
			if(res.data.freeCourseList && res.data.freeCourseList.length < this.data.size){
				this.setState({
					noMore: true
				})
			}
		}
	}

	async loadNext(next){
		this.data.page += 1;

		await this.getData(this.data.page);

		next && next();
	}

	enterCourse({ businessId, businessType }){
		if(businessType === 'channel'){
			locationTo(`/wechat/page/channel-intro?channelId=${businessId}`);
		}else if(businessType === 'topic'){
			locationTo(`/wechat/page/topic-intro?topicId=${businessId}`);
		}else{
			window.toast('unknown businessType');
		}
	}

	joinMembership(){
		this.props.doPay({
			type: 'MEMBER',
			total_fee: formatMoney(this.props.centerInitData.totalFee),
			callback: res => {
				window.sessionStorage.setItem('showJoinedDialog', 'Y');
				window.location.reload();
			}
		});
	}

	render() {
		return (
			<Page title={`会员免费专区`} className='member-free-courses-page'>
				<ScrollToLoad
					loadNext={this.loadNext}
					noMore={this.state.noMore}
					noneOne={this.state.noData}
				>
					<div className="courses-list">
						{
							this.state.courseList.map((item, i) => (
								<div className="course-item" key={i} onClick={e => this.enterCourse(item)}>
									<div className="sub-info">
										<div className="poster">
											<Picture src={imgUrlFormat(item.logo, '?x-oss-process=image/resize,w_240,h_148')}/>
										</div>
										<div className="study-count">{digitFormat(item.learningNum)}次学习</div>
									</div>
									<div className="main-info">
										<div className="content-wrap">
											<div className="name">{item.businessName}</div>
											<div className="teacher">{item.teacherName}：{item.teacherIntro}</div>
										</div>
										<div className="tip">
											<div className="course-num">
												{
													item.businessType === 'topic' ?
														'单课'
														:
														`${item.topicCount}课`
												}
											</div>
											<div className="price">
												<del className="origin">￥{formatMoney(item.amount)}</del>
												<span className="now">
													{
														this.props.memberInfo.isMember === 'Y' &&
															'会员'
													}
													免费
												</span>
											</div>
										</div>
									</div>
								</div>
							))
						}
					</div>
				</ScrollToLoad>
				{
					this.props.memberInfo.level < 2 &&
					<BuyBtn
						price={this.props.centerInitData.totalFee}
						memberInfo={this.props.memberInfo}
						joinMembership={this.joinMembership}
					/>
				}
			</Page>
		);
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(MemberFreeCourses);