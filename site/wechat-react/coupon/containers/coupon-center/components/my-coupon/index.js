/**
 *
 * @author Dylan
 * @date 2018/9/10
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { get } from 'lodash';
import ScrollToLoad from 'components/scrollToLoad';
import { autobind, throttle } from 'core-decorators';
import { locationTo, getBusinessUrl } from 'components/util';
import openApp from 'components/open-app';
import CollectVisible from 'components/collect-visible';
import detect from 'components/detect';
import MyQfuCoupon from './my-qfu-coupon';
import { isQlchat } from 'components/envi'
import { queryCouponListByType } from '../../../../actions/coupon';

function mapStateToProps(state) {
	return {
		sysTime: state.common.sysTime
	}
}

const mapDispatchToProps = {
	queryCouponListByType,
};

@autobind
class MyCoupon extends Component {

	constructor(props){
		super(props);
	}

	state = {
		noMore: false,
		noData: false,
		myCouponList: [],
		invalidCouponList: [],
		type: 'course',
		status: 'bind',
		isHideInvalid: true,

		isLiveAdmin: null,
		mt: 0
	};
	
	data = {
		page: 1,
		invalidPage: 1,
		pageSize: 20,
	};
	
	async componentDidMount(){
		this.getMyCouponList(this.data.page, this.state.type);
	}

	async getMyCouponList(page, type){
		const res = await this.props.queryCouponListByType({
			type,
			page,
			status: 'bind',
			liveId: this.props.isLiveAdmin === 'Y' && this.props.liveId || ''
		});
		if(res.state.code === 0){
			const myCouponList = get(res, 'data.resultList', []);
			if(page === 1 && !myCouponList.length){
				this.setState({
					noData: true
				})
			}else if(myCouponList.length < this.data.pageSize){
				this.setState({
					noMore: true
				})
			}
			if(myCouponList.length){

				this.setState({
					myCouponList: [...this.state.myCouponList, ...myCouponList],
				}, () => {
					setTimeout(() => {
						typeof _qla !== 'undefined' && _qla.collectVisible()
					}, 300)
				});
			}
		}
	}

	async getInvalidCouponList(page, type){
		console.log(type)
		const task = [];
		// 过期券和已使用券都归位失效券，因为后端分开两个表，所以只能两个接口一起请求
		if(!this.data.noMoreUsed){
			task.push(this.props.queryCouponListByType({
				type,
				page,
				size: this.data.pageSize / 2,
				status: 'used',
				liveId: this.props.isLiveAdmin === 'Y' && this.props.liveId || ''
			}))
		}else{
			task.push(Promise.resolve(null))
		}
		if(!this.data.noeMoreOverdue){
			task.push(this.props.queryCouponListByType({
				type,
				page,
				size: this.data.pageSize / 2,
				status: 'overdue',
				liveId: this.props.isLiveAdmin === 'Y' && this.props.liveId || ''
			}))
		}else{
			task.push(Promise.resolve(null))
		}

		const invalidCouponList = await Promise.all(task).then(([usedRes, overdueRes]) => {
			const usedList = get(usedRes, 'data.resultList', []);
			if(usedList.length < this.data.pageSize / 2){
				this.data.noMoreUsed = true;
			}
			const overdueList = get(overdueRes, 'data.resultList', []);
			if(overdueList.length < this.data.pageSize / 2){
				this.data.noeMoreOverdue = true;
			}
			return [...usedList, ...overdueList];
		});

		if(page === 1 && !invalidCouponList.length){
			this.setState({
				noInvalidData: true
			})
		}else if(this.data.noMoreUsed && this.data.noeMoreOverdue){
			this.setState({
				noMoreInvalid: true
			})
		}
		if(invalidCouponList.length){
			this.setState({
				invalidCouponList: [...this.state.invalidCouponList, ...invalidCouponList],
			});
		}
	}

	async loadMoreMyCoupon(next){
		if(!this.state.noMore){
			await this.getMyCouponList(++this.data.page, this.state.type);
		}
		if(!this.state.isHideInvalid){
			await this.getInvalidCouponList(++this.data.invalidPage, this.state.type);
		}
		next && next();
	}

	typeChangeHandle(e){
		const type = e.target.dataset.type;
		if(type === this.state.type){
			return false;
		}
		this.data.page = 1;
		this.data.invalidPage = 1;
		this.data.noMoreUsed = false;
		this.data.noeMoreOverdue = false;
		this.setState({
			type,
			myCouponList: [],
			invalidCouponList: [],
			noMore: false,
			noData: false,
			isHideInvalid: true,
			noInvalidData: false,
			noMoreInvalid: false,
		}, () => {
			this.getMyCouponList(this.data.page, this.state.type);
		})
	}

	getCouponBtnClickHandle(){
		this.props.linkToAwait();
	}

	expireFormat(overTime){
		const now = Date.now();

		// 为空或者大于50年，就显示永久有效
		const isForever = !overTime || (overTime - now > 50 * 365 * 24 * 60 * 60 * 1000) ;
		if(isForever){
			return '永久有效';
		}

		if(overTime <= now){
			return '已过期';
		}

		const leftTime = overTime - now;
		if(leftTime < 60 * 60 * 1000){
			return '即将过期';
		}else if(leftTime < 24 * 60 * 60 * 1000){
			return `还有${Math.floor(leftTime / (60 * 60 * 1000))}小时过期`;
		}else if(leftTime < 30 * 24 * 60 * 60 * 1000){
			return `还有${Math.floor(leftTime / (24 * 60 * 60 * 1000))}天过期`;
		}else if(leftTime < 12 * 30 * 24 * 60 * 60 * 1000){
			return `还有${Math.floor(leftTime / (30 * 24 * 60 * 60 * 1000))}个月过期`;
		}

		const t = new Date(overTime);
		return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' 过期';
	}

	useCoupon(coupon) {
		let { businessId, businessType, couponType, codeId, url } = coupon;

		if(!couponType){
			couponType = this.state.type;
		}

		switch (couponType) {
			case 'topic':
				// pro_cl=coupon 代表的是优惠券渠道进入到话题的，用在数据统计中的渠道统计
				locationTo(`/wechat/page/topic-intro?topicId=${businessId}&pro_cl=coupon&couponId=${codeId}&couponType=${couponType}`);
				break;
			case 'channel':
				locationTo(`/wechat/page/channel-intro?channelId=${businessId}&couponId=${codeId}&couponType=${couponType}&sourceNo=coupon`);
				break;
			case 'vip':
				locationTo(`/wechat/page/live-vip-details?liveId=${businessId}&couponId=${codeId}&pullUpPay=true`);
				break;
			case 'live':
				locationTo(`/wechat/page/live/${businessId}`);
				break;
			case 'ding_zhi':
				locationTo(url);
				break;
			case 'relay_channel':
				locationTo(`/live/channel/channelPage/${businessId}.htm?couponId=${codeId}&couponType=${couponType}&sourceNo=coupon`);
				break;
			case 'discount':
				locationTo(`/wechat/page/recommend`);
				break;
			case 'app':
				const h5 = getBusinessUrl({
					businessType, 
					businessId,
				})

				if (detect.browser.qlchat) {
					locationTo(h5);
				} else {
					openApp({
						h5,
						ct: 'appzhuanshu',
						ckey: 'CK1422980938180',
					});
				}
				
				break;
			default:
				break;
		}
	}

	async checkInvalidBtnClickHandle(){
		await this.getInvalidCouponList(this.data.invalidPage, this.state.type);
		this.setState({
			isHideInvalid: false
		});
	}

	collectVisibleList = () => {
		setTimeout(() => {
			typeof _qla !== 'undefined' && _qla.bindVisibleScroll({wrap: 'my-coupon-scroll-box'})
		}, 200)
	}

	// 滚动隐藏头部优惠券
	@throttle(100)
	scrollToDo(e, distanceScroll, topicPageHight, distanceScrollCount, scrollContainerBoundingRect) {
		let maxMt = distanceScrollCount - topicPageHight;
		if (!this.mqcDom) {
			return;
		}
		let mqcDomH = findDOMNode(this.mqcDom).offsetHeight;
		let scrollTop = distanceScroll;
		if (distanceScroll > mqcDomH) {
			scrollTop = mqcDomH
		}
		if (maxMt > 0 && maxMt-mqcDomH > 0 && Math.abs(this.state.mt) !== scrollTop) {
			this.setState({
				mt:-scrollTop
			})
		}
	}
	
	render(){
		return (
			<div className="my-coupon-container">
				<div className="top-box" ref={(myc)=>{this.mqcDom=myc}}>
					{ !isQlchat() && <MyQfuCoupon show={true} style={{marginTop:`${this.state.mt}px`}} /> }
					<div className="title-bar">课程和直播间优惠券</div>
				</div>
				<div className="my-coupon-type">
					<div className={`type-item${this.state.type === 'course' ? ' current' : ''}`} data-type="course" onClick={this.typeChangeHandle}>课程优惠券</div>
					{/* <div className={`type-item${this.state.type === 'topic' ? ' current' : ''}`} data-type="topic" onClick={this.typeChangeHandle}>话题课优惠券</div> */}
					<div className={`type-item${this.state.type === 'live' ? ' current' : ''}`} data-type="live" onClick={this.typeChangeHandle}>直播间通用券</div>
					{
						// 若为专业版则不显示平台活动券
						this.props.isLiveAdmin === 'N' &&
						<div className={`type-item${this.state.type === 'ding_zhi' ? ' current' : ''}`} data-type="ding_zhi" onClick={this.typeChangeHandle}>平台活动券</div>
					}
					{
						// 从个人中心或自媒体版直播间的学员中心进入“我的优惠券”，需要显示“定制券”
						(!this.props.liveId || this.props.liveLevel === 'selfMedia') &&
						<div className={`type-item${this.state.type === 'relayChannel' ? ' current' : ''}`} data-type="relayChannel" onClick={this.typeChangeHandle}>定制券</div>
					}
					<div className={`type-item${this.state.type === 'vip' ? ' current' : ''}`} data-type="vip" onClick={this.typeChangeHandle}>直播间VIP券</div>
					<div className={`type-item${this.state.type === 'discount' ? ' current' : ''}`} data-type="discount" onClick={this.typeChangeHandle}>手气券</div>
					<div className={`type-item${this.state.type === 'app' ? ' current' : ''}`} data-type="app" onClick={this.typeChangeHandle}>APP专享券</div>
				</div>
				
				{
					this.state.noData ?
						<div className="no-my-coupon-box">
							<div className="no-my-coupon-icon"></div>
							<div className="tip">你还没有可用的券哦</div>
							{
								// 非专业版才显示这按钮
								this.props.isLiveAdmin === 'N' &&
								<div className="get-coupon-btn" onClick={this.getCouponBtnClickHandle}>去领券</div>
							}
						</div>
						:
						<CollectVisible componentDidMount={this.collectVisibleList}>
						<ScrollToLoad
							className={`my-coupon-scroll-box`}
							toBottomHeight={500}
							loadNext={this.loadMoreMyCoupon}
							noMore={this.state.isHideInvalid ? this.state.noMore : this.state.noMoreInvalid}
							noneOne={this.state.noData}
							notShowLoaded={true}
							scrollToDo={this.scrollToDo}
						>
							<div className="my-coupon-list">
								{
									this.state.myCouponList.map((item, i) => (
										<div className={`my-coupon-item on-log on-visible`}
											key={`my-coupon-item-${i}`}
											data-log-region="my-coupon-item"
											data-log-pos={i}
										>
											<div className="coupon-item-wrap">
												<div className="course-info">
													{
														this.state.type === 'vip' &&
														<div className="vip-tip">购买直播间vip专用</div>
													}
													<div className={`title`}>
														{
															(this.state.type === 'live' || this.state.type === 'vip') ? 
															`指定直播间：${item.liveName}` : 
															this.state.type === 'discount' ? 
															`手气折扣券：适用“推荐页”大部分课程` :
															`指定课程：${item.name || item.codeName}`
														}
													</div>
													<div className="tip">
														<span className={`expiration-time${item.overTime && (item.overTime - Date.now() < 3 * 24 * 60 * 60 * 1000) ? ' highlight' : ''}`}>{this.expireFormat(item.overTime)}</span>
														{
															!!item.minMoney &&
															<React.Fragment>
																&nbsp;|&nbsp;
																<span className="conditions">满{item.minMoney}使用</span>
															</React.Fragment>
														}
													</div>
												</div>
												<div className="coupon-info" onClick={this.useCoupon.bind(null, {...item})}>
													<div className="price">
														{
															this.state.type === 'discount' ? 
															`${item.discount / 10}折`
															:[<i className="unit" key='unit'>￥</i>,`${item.money}`]
														}
													</div>
													<div className="tip">立即使用</div>
												</div>
											</div>
										</div>
									))
								}
								{
									this.state.invalidCouponList.map((item, i) => (
										<div className={`my-coupon-item disable`}
										     key={`my-coupon-item-dis-${i}`}
										>
											<div className="coupon-item-wrap">
												<div className="course-info">
													<div className="title">{
														this.state.type === 'discount' ? 
														`手气折扣券：适用“推荐页”大部分课程` :
														`指定课程：${item.name || item.codeName}`
													}</div>
												</div>
												<div className="coupon-info">
													<div className="price">
													{
														this.state.type === 'discount' ? 
														`${item.discount / 10}折`
														:[<i className="unit">￥</i>,`${item.money}`]
													}
													</div>
												</div>
											</div>
										</div>
									))
								}
								{
									this.state.noMore && this.state.isHideInvalid && !!this.state.myCouponList.length &&
									<div className="check-invalid-btn on-log"
									     onClick={this.checkInvalidBtnClickHandle}
									     data-log-region="check-invalid-btn"
									>查看失效优惠券</div>
								}
								{
									this.state.noMore && !this.state.isHideInvalid && this.state.noInvalidData &&
									<div className="check-invalid-btn">没有失效优惠券</div>
								}
							</div>
						</ScrollToLoad>
						</CollectVisible>
				}
			</div>
		)
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(MyCoupon);