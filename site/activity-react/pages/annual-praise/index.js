import * as React from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
import Page from '../../components/page';
import api from '../../utils/api';
import { formatMoney, locationTo } from '../../utils/util';
import * as ui from '../../utils/ui';
import './style.scss';
import * as envi from '../../utils/envi';
import { share } from '../../utils/wx-utils';

@autobind
class AnnualPraise extends React.Component {
	/** 页面初始化数据 */
	initData = {actId: 'yearRank'};
	state = {
		activityInfo: {},
		rankList: [],
		newYearLectureList: [],
		feedbackType: 'sendBook',
		feedbackGiftList: [],
		couponList: [],
		recommendNavList: [],
		recommendNavCurrentIndex: 0,
		recommendCourseList: []
	};
	data = {};
	cache = {};

	componentDidMount(){
		this.getActivityInfo();
		this.getRankList();
		this.getNewYearLecture();
		setTimeout(() => {
			this.getCouponList();
			['sendBook', 'sendGift'].forEach(item => {
				this.getFeedbackGift(item);
			});
			this.getRecommendNavList();
		},2000);

		this.initShare();
		this.appShare();

	}

	async getActivityInfo(){
		const res = await api('/api/wechat/activityInfo',{
			method: 'POST',
			body: {
				code: 'yearRank'
			}
		});
		if(res.state.code === 0){
			this.data.activityInfo = res.data;
		}
	}

	initShare() {
		const actId = this.initData.actId;
		console.log(actId)
        const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/activity/annualPraise?actId=${actId}`
        share({
            title: '千聊2017年度口碑榜，不容错过的大咖精粹演讲',
            desc: '25位口碑老师跨年演讲，36节口碑课程推荐，给你一份不一样的知识大餐。',
            shareUrl,
            imgUrl: 'https://img.qlchat.com/qlLive/adminImg/1CNP8V5F-ET4H-VPOW-1514453115542-KM4UZQK32QMW.jpg'
        });
	}
	
	appShare() {
		const actId = this.initData.actId;
        const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/activity/annualPraise?actId=${actId}`
		var ver = envi.getQlchatVersion();
        var that = this;
        if (ver && ver >= 360) {
            window.qlchat.ready(function () {
                window.qlchat.onMenuShareWeChatTimeline({
                    type: "link", 
                    content: shareUrl, 
                    title: '千聊2017年度口碑榜，不容错过的大咖精粹演讲',
                    desc: '25位口碑老师跨年演讲，36节口碑课程推荐，给你一份不一样的知识大餐。',
                    thumbImage: 'https://img.qlchat.com/qlLive/adminImg/1CNP8V5F-ET4H-VPOW-1514453115542-KM4UZQK32QMW.jpg', 
                    // success: that.getShareCode.bind(that)
                });
                window.qlchat.onMenuShareWeChatFriends({
                    type: "link", 
                    content: shareUrl,
                    title: '千聊2017年度口碑榜，不容错过的大咖精粹演讲',
                    desc: '25位口碑老师跨年演讲，36节口碑课程推荐，给你一份不一样的知识大餐。',
                    thumbImage: 'https://img.qlchat.com/qlLive/adminImg/1CNP8V5F-ET4H-VPOW-1514453115542-KM4UZQK32QMW.jpg'
                });
            })
        }
	}

	async getRankList(){
		const res = await api('/api/wechat/activity/rankList',{
			method: 'POST',
			body: {
				activityCode: 'yearRank',
				page: {
					page: 1,
					size: 4
				}
			}
		});
		if(res.state.code === 0 && res.data.dataList && res.data.dataList.length){
			this.setState({
				rankList: res.data.dataList
			});
		}
	}

	async getNewYearLecture(){
		const res = await api('/api/wechat/activity/configs',{
			method: 'POST',
			body: {
				activityCode: 'yearRank',
				type: 'TweetImg'
			}
		});
		if(res.state.code === 0 && res.data.dataList && res.data.dataList.length){
			this.setState({
				newYearLectureList: res.data.dataList
			});
		}
	}

	async getFeedbackGift(type){
		// if(this.state.feedbackType === type){
		// 	return false;
		// }
		
		const res = await api('/api/wechat/activity/configs',{
			method: 'POST',
			body: {
				activityCode: 'yearRank',
				type: type
			}
		});
		if(res.state.code === 0 && res.data.dataList){
			this.cache[type] = res.data.dataList;
			this.getFeedbackGiftIsBought(res.data.dataList, type);
		}
	}
	// 获取课程是否被购买了
	async getFeedbackGiftIsBought(list, type){
		if(!list.length){
			return false;
		}
		const courseList = list.map(item => {
			return {
				businessId: item.remark,
				businessType: 'channel'
			}
		});
		const res = await api('/api/isBuyCourse',{
			method: 'POST',
			body: {
				courseList
			}
		});
		if(res.state.code === 0 && res.data.dataList && res.data.dataList.length){
			let resCourseList = res.data.dataList;
			let feedbackGiftList = list.map(giftCourse => {
				resCourseList.forEach(resCourse => {
					if(giftCourse.remark == resCourse.id){
						giftCourse.isBought = resCourse.available === 'Y';
					}
				})
				return giftCourse
			});
			// this.setState({
			// 	feedbackGiftList
			// })
			this.cache[type] = feedbackGiftList;
			if (this.state.feedbackType === type) {
				this.setState({
					feedbackType: type,
					feedbackGiftList: this.cache[type]
				});
			}
		}
	}

	async getCouponList(){
		const res = await api('/api/wechat/activity/getCouponList',{
			method: 'GET',
			body: {
				activityCode: 'yearRank',
			}
		});
		if(res.state.code === 0 && res.data.dataList){
			this.setState({
				couponList: res.data.dataList
			});
		}
	}
	// 领取优惠券
	async bindCoupon(id, index){
		if(this.state.couponList[index].status !== 'none'){
			return false;
		}
		const res = await api('/api/wechat/activity/getCouponSingle',{
			method: 'POST',
			body: {
				promotionId: id
			}
		});
		if(res.state.code === 0){
			ui.toast('领取成功');
			let couponList = [...this.state.couponList];
			couponList[index].status = 'bind';
			this.setState({
				couponList
			});
		}
	}

	async getRecommendNavList(){
		const res = await api('/api/wechat/activity/configs',{
			method: 'POST',
			body: {
				activityCode: 'yearRank',
				type: 'bottomTab'
			}
		});
		if(res.state.code === 0 && res.data.dataList){
			this.setState({
				recommendNavList: res.data.dataList
			});
			res.data.dataList.forEach((item, idx) => {
				this.getRecommendCourseList(item.code, idx);
			})
		}
	}

	async getRecommendCourseList(code, index){
		
		const res = await api('/api/activity/giftCourseList',{
			method: 'POST',
			body: {
				activityCode: 'yearRank',
				groupCode: code
			}
		});
		if(res.state.code === 0 && res.data.dataList){
			this.cache['courseList'+code] = res.data.dataList
			if (index === 0) {
				this.setState({
					recommendCourseList: res.data.dataList
				})
			}
		}
	}

	//切换推荐列表
	switchCourseList(code ,index) {
		this.setState({
			recommendNavCurrentIndex: index,
			recommendCourseList: this.cache['courseList'+code]
		});
	}

	sendBook = () => {
		this.setState({
			feedbackType: 'sendBook',
			feedbackGiftList: this.cache['sendBook']
		})
	}

	sendGift = () => {
		this.setState({
			feedbackType: 'sendGift',
			feedbackGiftList: this.cache['sendGift']
		})
	};

	rankMoreBtnClickHandle(){
		if(this.data.activityInfo.isEnd){
			ui.toast('活动已结束');
		}else{
			locationTo('/wechat/page/activity/annualRank');
		}
	}

	render(){
		return (
			<Page title='年度口碑榜' className='annual-praise-page'>
				<div className="header">
					<img src={require('./img/header.png')} alt=""/>
				</div>
				{
					!!this.state.rankList.length &&
					<div className="hot-teacher">
						<div className="sub-title">
							<img src={require('./img/title01.png')} alt=""/>
						</div>
						<div className="teacher-list">
							{
								this.state.rankList.map((item, i) => (
									<div className="item" key={i}>
										<div className="avatar-wrap">
											<div className="avatar">
												<img src={item.headImg + '?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100'} alt=""/>
											</div>
										</div>
										<div className="order">{i + 1}</div>
										{/* <div className="name">{item.name}</div> */}
									</div>
								))
							}
							<div className="item" onClick={this.rankMoreBtnClickHandle}>
								<div className="more-btn"></div>
								<div className="name">更多</div>
							</div>
						</div>
					</div>
				}
				{
					!!this.state.newYearLectureList.length &&
					<div className="new-year-lecture">
						<div className="sub-title">
							<img src={require('./img/title02.png')} alt=""/>
						</div>
						<div className="teacher-list">
							<div className="list-wrap">
								{
									this.state.newYearLectureList.map((item, i) => (
										<div className="item" key={i} onClick={e => {if(item.url) window.location.href = item.url}}>
											<img src={item.icon} alt=""/>
										</div>
									))
								}
							</div>
						</div>
					</div>
				}
				{
					!!this.state.feedbackGiftList &&
					<div className="feedback-gift">
						<div className="sub-title">
							<img src={require('./img/title03.png')} alt=""/>
						</div>
						<div className="steps"></div>
						<div className="gift-nav">
							<div className={`item${this.state.feedbackType === 'sendBook' ? ' current' : ''}`} onClick={this.sendBook}>购课赠好书</div>
							<div className={`item${this.state.feedbackType === 'sendGift' ? ' current' : ''}`} onClick={this.sendGift}>购课赠好礼</div>
						</div>
						<div className="gift-course-list">
							{
								this.state.feedbackGiftList.map((item, i) => (
									<div className="item" key={i}  onClick={e => {
										item.isBought ?
										window.location.href = `/wechat/page/activity-address?activityCode=${item.code}` :
										window.location.href = item.url
									}}>
										<div className="poster">
											<img src={item.icon} alt=""/>
										</div>
										<div className="title">{item.content}</div>
										<div className="bottom-row">
											<div className="price">惊喜价：
												<span className="num">{item.name}</span>
											</div>
											{
												item.isBought ?
													<div className="act-btn" >填写地址</div>
													:
													<div className="act-btn" >立即购买</div>
											}
										</div>
									</div>
								))
							}
						</div>
					</div>
				}
				<div className="recommend">
					<div className="sub-title">
						<img src={require('./img/title04.png')} alt=""/>
					</div>
					<div className="coupon-list">
						{
							this.state.couponList.map((item, i) => (
								<div className={`item${item.status !== 'none' ? ' got' : ''}`} key={i} onClick={this.bindCoupon.bind(this,item.id,i)}>
									<div className="price">￥<span className="num">{formatMoney(item.money, 1)}</span></div>
									<div className="tip">满{formatMoney(item.limitMoney)}减{formatMoney(item.money, 1)}</div>
								</div>
							))
						}
						{/*<div className="item">*/}
							{/*<div className="price">￥<span className="num">10</span></div>*/}
							{/*<div className="tip">满39减10</div>*/}
						{/*</div>*/}
						{/*<div className="item">*/}
							{/*<div className="price">￥<span className="num">20</span></div>*/}
							{/*<div className="tip">满69减20</div>*/}
						{/*</div>*/}
						{/*<div className="item">*/}
							{/*<div className="price">￥<span className="num">30</span></div>*/}
							{/*<div className="tip">满99减30</div>*/}
						{/*</div>*/}
					</div>
					<div className="use-tip">用券规则：限本活动精品类课程，有效期至2018.1.8</div>
					<div className="type-nav">
						{
							this.state.recommendNavList.map((item, i) => (
								<div className={`item${this.state.recommendNavCurrentIndex === i ? ' current' : ''}`} key={i} onClick={this.switchCourseList.bind(this,item.code,i)}>{item.name}</div>
							))
						}
					</div>
					<div className="course-list">
						{
							this.state.recommendCourseList.map((item, i) => (
								<div className="item" key={i} onClick={e => locationTo(item.url)}>
									<div className="poster">
										<img src={item.headImage + '?x-oss-process=image/resize,m_fill,limit_0,h_150,w_240'} alt=""/>
									</div>
									<div className="info">
										<div className="title">{item.name}</div>
										<div className="bottom-row">
											<div className="price">￥{formatMoney(item.discount, 1)} <span className="origin">￥{formatMoney(item.money, 1)}</span></div>
											<div className="buy-btn">购买</div>
										</div>
									</div>
								</div>
							))
						}
						<div className="use-tip">没有更多</div>
					</div>
				</div>
			</Page>
		)
	}
}
render(<AnnualPraise />, document.getElementById('app'));