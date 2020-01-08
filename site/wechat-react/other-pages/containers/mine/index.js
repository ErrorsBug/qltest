import React, {Component} from 'react';
import { connect } from 'react-redux';
import TabBar from 'components/tabbar';
import Redpoint from 'components/redpoint';
import {
    locationTo,
	imgUrlFormat,
	getCookie
} from 'components/util';
import {
	fillParams,
} from 'components/url-utils'
import NewUserGift, { getNewUserGiftData } from 'components/new-user-gift';

import { request, unbindPhone, isFunctionWhite } from 'common_actions/common';
import { userCenterAd } from '../../actions/recommend';

// actions
import { getUserInfo, getQlchatSubscribeStatus, getQlchatQrcode } from '../../actions/common';
import { getMyLive, getMySubscribe, getMyCenter, getCoralAccess, getNotCheckinCount } from '../../actions/mine';

import Page from 'components/page';
import {getLearnEverydayNewData, getRealStatus, getCheckUser} from '../../actions/live';

import { judgeShowPhoneAuthGuide, showPhonAuthGuide } from 'components/phone-auth';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import Dialog from './components/dialog'
import QfuEnter from './components/qfu-enter-module'
import CampAd from 'components/camp-ad'

class Mine extends Component {

    state = {
	    isShowQuestionNav: false,
		isMineNewSession:"N",
		isMineNew:{},
	    centerData: {
			waitEvalCount:0,
		},

		showFromLive: false,
		fromLiveId: "",
		showCoralEnter: false,
		
		showCouponCenterRedPoint: false,
		showQlchatAds: false,
		isFocusThree: false,
		isFocusQlchat: false,
		threeQrcode: '', // 三方二维码
		qlchatQrcode: '', // 官方二维码

		todayNotCheckinCount: 0,

		memberInfo: {}, // 千聊会员信息
		pointInfo: {}, // 积分信息

		isShowNewUserGift: false,
		
		newRealStatus: 'no',
		realStatus: 'unwrite',
		isShowReal: false,
		isNotBtn: false,

		isHaveNewDataInLearnEveryday: 'N' , //每天学是否有最新信息
		isShowIdx: 0,
		isWhite: false,
		newDynamicImg: "", // 最新动态信息
		campAdObj: {},
		isShowCampAd: false
	};

	componentWillMount () {
		
        // 积分体系提示
        if(typeof localStorage !== "undefined" && !localStorage.getItem("pointSystemTips")) {
			localStorage.setItem("pointSystemTips", this.props.sysTime)
		}
		this.isHaveNewDataInLearnEveryday()
	}

	isHaveNewDataInLearnEveryday = async() => {
        let isHaveNewDataInLearnEveryday = await getLearnEverydayNewData()
        this.setState({isHaveNewDataInLearnEveryday})
    }

	async componentDidMount() {
		this.getCampAd();
		if(this.props.location.query.fromLive) {
			this.setState({
				showFromLive: true,
				fromLiveId: this.props.location.query.fromLive
			})
		}
		await this.hadnleWhiteList();
		await this.props.getUserInfo(undefined, undefined, {_: Math.random()}); // random避免从二级页面返回读缓存
		let myCenter = await this.props.getMyCenter(this.props.userInfo.user.userId);
		if (myCenter.state.code == 0) {
			this.setState({
				centerData: myCenter.data
			});
		}
		this.initDataReal();
		this.getMineSubscribe();
		this.getNewPointList();
		this.initCouponCenterRedPoint()
		this.initCoralEnter();

		this.setTraceSession();
		// this.initFocusAds();
		
		this.initNotCheckinCount();

		this.getPointInfo();
		this.getMemberInfo();

		getNewUserGiftData().then(res => this.setState(res));

		this.initShowYin();
		this.getDynamicInfo();

	    setTimeout(() => {
		    typeof _qla != 'undefined' && _qla.bindVisibleScroll('personal-center-wrapper');
	    }, 1000);
	}

	// 获取个人中心体验营广告位
	async getCampAd() {
		const { dataList } = await userCenterAd()
		const obj = (dataList && dataList[0]) || {}
		this.setState({
			campAdObj: obj.detail || {},
			isShowCampAd: Object.is(obj.isAuth, 'Y')
		})
	}


	// 获取最新动态
	async getDynamicInfo(){
		const old = localStorage.getItem("dynamicInfo");
		const oldArr = old ? JSON.parse(old) : []
		const { data } = await request({
            method: 'POST',
            url: '/api/wechat/comment/getUserCommentList',
            body: {size: 1, page: 1}
        })
		const res = await request({
 			method: 'POST',
            url: '/api/wechat/timeline/getTimelineList',
            body: { page: {size: 1, page: 1 },beforeOrAfter: "before",liveId: this.liveId, time: new Date().getTime()}
		})
		const arr = []
		if(res.data && !!res.data.list && !!res.data.list.length){
			arr.push(res.data.list[0]|| {})
		}
		if(data && !!data.comments && !!data.comments.length){
			arr.push(data.comments[0] || {})
		}
		this.handleDynamicData(oldArr, arr);
	}

	handleDynamicData(oldArr, newArr){
		let img = ''
		if(!oldArr.length && !!newArr.length) {
			img = newArr[0].liveLogo
		} else if(!!oldArr.length && !!newArr.length) {
			const flag = !!newArr[0].id && newArr[0].createTime != oldArr[0].createTime;
			if(flag){
				img = newArr[0].liveLogo
			} else {
				const ad = !!newArr[1].id && newArr[1].replyTime != oldArr[1].replyTime;
				!!ad && (img = newArr[1].createByHeadImgUrl)
			}
		}
		if(img) {
			localStorage.setItem("dynamicInfo",JSON.stringify(newArr))
			this.setState({
				newDynamicImg: img
			})
		}
	}

	// 显示引导
	initShowYin = () => {
		const isOnce = localStorage.getItem('isTi');
		if(!isOnce && this.state.isWhite){
			this.setState({
				isShowIdx: 1
			})
		} else {
			const { mobile } = this.props.userInfo.user || {};
			// 绑定手机号提示（据留资2.0需求更改，条件设为：当用户手机号为空且tab在“我的课程”和“个人中心”之间的总切换次数每满5次之时显示）
			if (!mobile && judgeShowPhoneAuthGuide()) {
				showPhonAuthGuide().then(res => {
					if (res) locationTo('/wechat/page/phone-auth');
				})
			}
		}
	}

	showTi = () => {
		const { isShowIdx } = this.state
		if(isShowIdx == 1){
			this.setState({
				isShowIdx: 2
			})
		} else if(isShowIdx == 2) {
			this.setState({
				isShowIdx: 0
			}, () => {
				// 绑定手机号提示
				if (!this.props.userInfo.user.mobile && judgeShowPhoneAuthGuide()) {
					showPhonAuthGuide().then(res => {
						if (res) locationTo('/wechat/page/phone-auth');
					})
				}
				localStorage.setItem("isTi", 'isTi')
			})
		}
	}

	// 处理白名单
	async hadnleWhiteList() {
        const { isWhite } = await isFunctionWhite(getCookie("userId"), "ufw");
        this.setState({
            isWhite: isWhite && Object.is(isWhite, 'Y')
        })
    }
	async initDataReal(){
		let oldRealRes = {};
		if (this.liveId) {
			oldRealRes = await this.props.getRealStatus(this.liveId, 'live');
		}
        const res = await this.props.getCheckUser();
        const newReal = (res.data && res.data.status) || 'no';
        const oldReal = (oldRealRes.data && oldRealRes.data.status) || 'unwrite';
        const rejectReason = res.data && res.data.rejectReasons
		this.setState({
            newRealStatus: newReal,
			realStatus: oldReal,
			rejectReason
        });
    }

	initNotCheckinCount = async () => {
		const result = await this.props.getNotCheckinCount();
		if (result.state.code === 0) {
			this.setState({
				todayNotCheckinCount: result.data.unAffairNum
			});
		} else {
			window.toast(result.state.msg);
		}
	}

	// /**
	//  * 获取关注状态
	//  * 1.优先关注垂直号
	//  * 2.次关注千聊
	//  * 3.引导下载app
	//  */
	// initFocusAds = async () => {
	// 	// 是否显示顶部广告
	// 	try {
	// 		if (new Date().getTime() < localStorage.getItem('__hideTopBarAds')) {
	// 			return
	// 		}
	// 	} catch (e) {}

	// 	let subscribeStatus = await this.props.getQlchatSubscribeStatus()

	// 	let isFocusThree = subscribeStatus.isFocusThree,
	// 		isFocusQlchat = subscribeStatus.subscribe || !subscribeStatus.isShowQl;

	// 	this.setState({
	// 		isFocusThree,
	// 		isFocusQlchat
	// 	})

	// 	// 获取三方二维码
	// 	if (!isFocusThree) {
	// 		let threeQrcode = await this.props.getQlchatQrcode({ liveId: '2000000645972374', showQl: 'N' });
	// 		threeQrcode && this.setState({
	// 			threeQrcode
	// 		})
	// 	}

	// 	// 获取官方二维码
	// 	if (!isFocusQlchat) {
	// 		let qlchatQrcode = await this.props.getQlchatQrcode({ liveId: '2000000645972374'});
	// 		qlchatQrcode && this.setState({
	// 			qlchatQrcode
	// 		})
	// 	}

	// 	this.setState({
	// 		showQlchatAds: true
	// 	})
  	// }
	

	setTraceSession() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', "mine-center");
    }

    async initCoralEnter(){
    	const res = await this.props.getCoralAccess();
    	if(res.state.code === 0 && res.data.flag === 'Y'){
    		this.setState({
			    showCoralEnter: true
		    })
	    }
    }

	// 前端渲染初始化
	initMyLive(){
		if(!this.props.liveData){
			this.props.getMyLive();
		}
	}

	async getNewPointList(){
		//定制红点
		if (localStorage.getItem('newPointList')) {
			let newPointList = JSON.parse(localStorage.getItem('newPointList'));
            if(newPointList && newPointList["个人中心_课程定制"]&&newPointList["个人中心_课程定制"].length<=0){
                this.setState({
                    isMineNewSession:"Y",
                });
            }
		}else{
            this.setState({
                isMineNewSession:"Y",
            });
        };
	}

	initCouponCenterRedPoint = () => {
		const lastVisitedTime = parseInt(window.localStorage.getItem("couponCenter-lastVisitedTime") || 0)
		if (this.props.sysTime - lastVisitedTime > 1000 * 3600 * 24) {
			this.setState({
				showCouponCenterRedPoint: true
			})
		}
	}

	async getMineSubscribe(){
		let result = await this.props.getMySubscribe();
		if(result.state.code===0){
			this.setState({
				isMineNew: result.data,
			})
		}
	}

	locationToCreateLive() {
		const qlform = this.props.router.location.query.qlfrom ? 'qledu' : ''
		const liveId = this.props.liveData && this.props.liveData.id || ''
		const resTime = Date.now()
		const fromLiveId = this.state.fromLiveId || ''
		const ch = 'center'

		const url = fillParams({ qlform, liveId, resTime, fromLiveId, ch }, '/wechat/page/backstage')

		locationTo(url) 
	}
	
	locationCreateLive() {
		locationTo('/wechat/page/create-live?ch=create-live_mine') 
	}

	backToLive(){
		locationTo("/live/"+this.state.fromLiveId+".htm");
	}

	get liveId(){
        return this.props.location.query.fromLiveId || (this.props.liveData && this.props.liveData.id || '')
	}
	
	// closeQlchatAds = () => {
	// 	// session内不再显示
	// 	try {
	// 		const maxAge = new Date(dayjs().format('YYYY/MM/DD 23:59:59')).getTime();
	// 		localStorage.setItem('__hideTopBarAds', maxAge)
	// 	} catch (e) {}

	// 	this.setState({
	// 		showQlchatAds: false
	// 	})
	// }

	// ABtest
	get testAB () {
        let userId = Number(this.props.userId)
        return userId % 2 !== 0
	}

	async getMemberInfo(){
		const memberInfo = await request({
			url: '/api/wechat/member/memberInfo',
			method: 'POST'
		});
		if(memberInfo.name){
			this.setState({
				memberInfo
			});
		}
	}

	async getPointInfo () {
		const res = await request({
			url: '/api/wechat/point/getPointUserInfo',
			method: 'POST'
		});
		if(res.state && res.state.code == 0){
			this.setState({
				pointInfo: res.data
			});
		}
	}

	onClickBindPhone = () => {
		const { userInfo: { user: { mobile, isBind } } } = this.props;
		if (mobile && isBind === 'Y') {
			window.simpleDialog({
				className: 'zindex-300',
				msg: `已经绑定手机号码${mobile}，是否确认解除绑定?`,
				onConfirm: async () => {
					if (await this.props.unbindPhone()) {
						window.toast('解绑成功');
					}
				}
			})
		} else {
			locationTo('/wechat/page/phone-auth');
		}
	}

	executeBtnClickHandle(e){
		e.stopPropagation();
		e.preventDefault();
		this.setState({
			isNotBtn: true,
		})
	}
	clearRealName(){
		this.setState({
			isNotBtn: false,
		})
	}


    render() {
		const { isShowIdx, isShowCampAd, campAdObj } = this.state;
        return (
            <Page title="个人中心" className='personal-center-pgae'>
				{/* {this.state.showQlchatAds ? 
                        <QlchatFocusAds onClose={this.closeQlchatAds} qrcode={this.state.threeQrcode||this.state.qlchatQrcode} />
						: null
				} */}
				{/*<QlchatFocusAds />*/}
	            <div className={ `personal-center-wrapper ${ !!isShowIdx ? 'personal-center-overlfow' : '' }` }>
		            <div className="personal-center-container">
			            <div className="personal-center-header">
				            <div className="user-info on-log"
				                 onClick={() => location.href = `/wechat/page/mine/user-info`}
				                 data-log-name="用户信息"
				                 data-log-region="user-info"
				            >
					            <div className="avatar">
						            <img src={imgUrlFormat(this.props.userInfo.user.headImgUrl,"@132w_132h_1e_1c_2o","/132")} alt={this.props.userInfo.user.name}/>
					            </div>
								<div className="name-box">
									<div className="name verified not-certified flex flex-row flex-vcenter">
										<p>{this.props.userInfo.user.name}</p>
										<i onClick={ this.executeBtnClickHandle.bind(this) } className={ this.state.newRealStatus == 'pass' ? 'real-name-y' : 'real-name-n' }></i>
									</div>
									<div className="point-count" onClick={ (e) => {e.stopPropagation(); locationTo('/wechat/page/point/mine')} }>
										{/* 学分 {this.state.pointInfo.residuePoint || 0} */}
										<span>
										{this.state.pointInfo.waitPoint && this.state.pointInfo.waitPoint > 0 ? `待领学分+${this.state.pointInfo.waitPoint}` : '做任务得学分'}
										</span> 
										<i className="icon_enter"></i>
									</div>
								</div>
								<div 
									className={ `btn-member-center on-log ${ this.state.memberInfo.isMember === 'Y' ? 'center-bar' : '' }` } 
									data-log-region={this.state.memberInfo.isMember === 'Y' ? 'center-bar' : 'member-bar'}
									onClick={ (e) => {e.stopPropagation(); locationTo('/wechat/page/membership-center')} }
								>
									<span>{ this.state.memberInfo.isMember === 'Y' ? '会员中心' : '千聊会员'}</span>
								</div>
				            </div>

							<QfuEnter/>
							{ isShowCampAd && <CampAd { ...campAdObj } /> }
							{/* 快捷导航入口 */}
							<div className="quick-nav">
								<div 
									className="item quick-icon01 on-log" 
									onClick={() =>  locationTo(this.state.isHaveNewDataInLearnEveryday == 'Y' ? '/wechat/page/learn-everyday?wcl=lc_focus_dailylearning&f=focus' : '/wechat/page/timeline/mine-focus')}
									data-log-name="关注的直播间"
									data-log-region="personal-center-nav"
									data-log-pos="followed_live"
									>
									<div className="nav-icon">
										{this.state.isHaveNewDataInLearnEveryday === 'Y' && <Redpoint pointWrapStyle="" pointStyle="" />}
									</div>
									<div className="nav-title">我的关注</div>
								</div>
								<div 
									className="item quick-icon02 on-log"
									onClick={() => locationTo('/wechat/page/coupon-center')}
									data-log-name="我的优惠券"
									data-log-region="personal-center-nav"
									data-log-pos="my-coupon"
									>
									<div className="nav-icon">
										{this.state.showCouponCenterRedPoint && <Redpoint pointWrapStyle="" pointStyle="" />}
									</div>
									<div className="nav-title">我的优惠券</div>
								</div>
								<div 
									className="item quick-icon03 on-log"
									onClick={() => {
										removeFromLiveCenter();
										locationTo('/live/entity/myPurchaseRecord.htm')}
									}
									data-log-name="购买记录"
									data-log-region="personal-center-nav"
									data-log-pos="perchase_record"
									>
									<div className="nav-icon">
									</div>
									<div className="nav-title">购买记录</div>
								</div>
								{/* show-foot */}
								<div 
									className={ `item quick-icon04 on-log ${ isShowIdx === 1 ? 'show-foot' : '' }` }
									onClick={() => {
										if(!isShowIdx){
											locationTo('/wechat/page/mine/foot-print')
										}
									}}
									data-log-name="我的足迹"
									data-log-region="personal-center-nav"
									data-log-pos="mine-foot-print"
									>
									<div className="nav-icon">
										{this.state.isHaveNewDataInLearnEveryday === 'Y' && <Redpoint pointWrapStyle="" pointStyle="" />}
									</div>
									<div className="nav-title">我的足迹</div>
								</div>
							</div>
							{
								(!this.props.liveData || !this.props.liveData.id) && 
						            // <div
							        //     className="create-live-btn on-log"
							        //     onClick={(e) => { e.stopPropagation(); this.locationCreateLive() }}
							        //     data-log-name="创建直播间"
							        //     data-log-region="button"
							        //     data-log-pos="create"
						            // >一键创建直播间</div>
								<div className="room-nav">
									<div className="item create on-log"
											onClick={(e) => { e.stopPropagation(); this.locationCreateLive() }}
											data-log-name="创建直播间"
											data-log-region="button"
											data-log-pos="create"
									>创建直播间</div>
									<div className="split"></div>
									<div className="item live-change on-log"
											onClick={(e) => { e.stopPropagation(); locationTo('/wechat/page/live-change') }}
											data-log-region="button"
											data-log-pos="live-change"
									>管理直播间</div>
								</div>
							}
                            {
                                this.props.liveData && this.props.liveData.id &&
                                    <div className="room-nav">
            					        <div className="item live-room on-log"
					                         onClick={() => location.href = `/wechat/page/live/${this.props.liveData.id}`}
					                         data-log-name="直播间主页"
					                         data-log-region="live-room"
					                    >直播间主页</div>
        					            <div className="split"></div>
        					            <div className="item manage on-log"
					                         onClick={() => {this.locationToCreateLive()}}
					                         data-log-name="直播间后台"
					                         data-log-region="manage"
					                    >直播间后台</div>
        				            </div>
                            }
			            </div>
			            <div className="personal-center-nav">
						{/* show-news */}
							{ this.state.isWhite && (
								<div
									className={ `item icon24 on-log ${ isShowIdx == 2 ? 'show-news' : '' }` }
									onClick={() => {
										if(!isShowIdx){
											locationTo('/wechat/page/messages')
										}
									}}
									data-log-name="最新动态"
									data-log-region="personal-center-nav"
									data-log-pos="dynamic_record"
								>
									<div className="text">最新动态</div>
									{ !!this.state.newDynamicImg && <div className={ `dynamic_pic red` }><img src={ this.state.newDynamicImg } /></div>}
									<div className="enter-arrow"></div>
								</div>
							) }

							<div
								className="item icon18 on-log"
								onClick={() => locationTo('/wechat/page/mine/collect')}
								data-log-name="我的收藏"
								data-log-region="personal-center-nav"
								data-log-pos="mine-collect"
							>
								<div className="text">我的收藏</div>
								<div className="enter-arrow"></div>
							</div>
							{/* <div 
								className="item icon03 on-log" 
								onClick={() =>  locationTo('/wechat/page/dingzhi')}
								data-log-name="我的定制课程"
								data-log-region="personal-center-nav"
								data-log-pos="custom_course"
								>
					            <div className="text">我的定制课程</div>
					            {
						            this.state.isMineNewSession=="Y" ?
							            <Redpoint pointContent="" pointWrapStyle="point-wrap" pointStyle="point_subscribe" pointBtnStyle="" pointNpval={`个人中心_课程定制`} isNotLocalstorage="N" />
							            :
							            (
								            this.state.isMineNew&&this.state.isMineNew.isPushNew=="Y"?
									            <Redpoint pointContent="" pointWrapStyle="point-wrap" pointStyle="point_subscribe" pointBtnStyle="" pointNpval={`我的个人中心-定制`} isNotLocalstorage="Y" />
									            :
									            null
							            )
					            }
					            <div className="enter-arrow"></div>
							</div> */}
							
							{/* <div
								className="item icon16 on-log"
								onClick={() => locationTo('/wechat/page/camp/2000000501045371?actId=beautiful&ch=live')}
								data-log-name="训练营"
								data-log-region="personal-center-nav"
								data-log-pos="camp"
							>
								<div className="text">180天美丽变形记</div>
								<div className="enter-arrow"></div>
							</div> */}
							<div
								className="item icon17 on-log"
								onClick={() => {locationTo('/wechat/page/check-in-camp/join-list')}}
								data-log-name="我的打卡"
								data-log-region="personal-center-nav"
								data-log-pos="check-in-camp"
							>
								<div className="text">我的打卡</div>
								{this.state.todayNotCheckinCount > 0 && <div className="unopen">{this.state.todayNotCheckinCount}</div>}
								<div className="enter-arrow"></div>
							</div>

			            </div>
			            {/* {
			            	this.state.showCoralEnter &&
				            <div className="personal-center-nav">
					            <div
						            className="item icon15 on-log"
						            onClick={() => locationTo('/wechat/page/coral/shop')}
						            data-log-name="分享赚钱"
						            data-log-region="personal-center-nav"
						            data-log-pos="study_record"
					            >
						            <div className="text">分享赚钱</div>
						            <div className="unopen">成为官方课代表</div>
						            <div className="enter-arrow"></div>
					            </div>
				            </div>
			            } */}
			            <div className="personal-center-nav">
							{/* <div
								className="item icon05 on-log"
								onClick={() => locationTo('/live/entity/lastBrowseList.htm')}
								data-log-name="看过的直播间"
								data-log-region="personal-center-nav"
								data-log-pos="visited_live"
							>
								<div className="text">看过的直播间</div>
								<div className="enter-arrow"></div>
							</div> */}
							<div 
								className="item icon13 on-log" 
								onClick={() => locationTo('/wechat/page/homework/mine')}
								data-log-name="已完成的作业"
								data-log-region="personal-center-nav"
								data-log-pos="homework"
								>
					            <div className="text">已完成的作业</div>
					            <div className="enter-arrow"></div>
				            </div>
							<div 
								className="item icon12 on-log" 
								onClick={() => locationTo('/wechat/page/mine/unevaluated')}
								data-log-name="我的评价"
								data-log-region="personal-center-nav"
								data-log-pos="to_comment"
								>
					            <div className="text">我的评价</div>
					            {/* {
					            	this.state.centerData.waitEvalCount > 0 &&
						            <div className="unread-num">{this.state.centerData.waitEvalCount > 999 ? '999+' : this.state.centerData.waitEvalCount}</div>
					            } */}
					            <div className="enter-arrow"></div>
				            </div>
							<div 
								className="item icon21 on-log on-visible" 
								onClick={() => locationTo('/wechat/page/recommend/user-like')}
								data-log-name='设置学习偏好'
								data-log-region="user-like-tag"
								data-log-status='A'
								>
					            <div className="text">设置学习偏好</div>
					            <div className="enter-arrow"></div>
				            </div>
			            </div>
			            <div className="personal-center-nav">
							<div 
								className="item icon06 on-log" 
								onClick={() => locationTo(`/wechat/page/mine-profit?liveId=${this.liveId}`)}
								data-log-name="我的钱包"
								data-log-region="personal-center-nav"
								data-log-pos="my-wallet"
								>
					            <div className="text">我的钱包</div>
					            <div className="enter-arrow"></div>
				            </div>
							<div 
								className="item icon07 on-log" 
								onClick={() => locationTo('/wechat/page/mine-question')}
								data-log-name="私问"
								data-log-region="personal-center-nav"
								data-log-pos="whisper"
								>
					            <div className="text">私问</div>
					            {this.state.centerData.isWhisperOpen == 'N' && <div className="unopen">未开启</div>}
					            <div className="enter-arrow"></div>
							</div>
				            <div 
								className="item icon08 on-log" 
								onClick={() => locationTo('/wechat/page/my-shares')}
								data-log-name="分销推广"
								data-log-region="personal-center-nav"
								data-log-pos="distribution"
								>
					            <div className="text">分销推广</div>
					            <div className="enter-arrow"></div>
				            </div>
							<div 
								className="item icon23 on-log" 
								onClick={this.onClickBindPhone}
								data-log-name="绑定手机号"
								data-log-region="personal-center-nav"
								data-log-pos="bind-phone"
								>
					            <div className="text">绑定手机号</div>
								{
									this.props.userInfo.user.mobile
										? 
										<div className="unopen">已绑定</div>
										:
										<div className="unopen" style={{color: '#F73657'}}>未绑定</div>
								}
					            <div className="enter-arrow"></div>
				            </div>
			            </div>

						<div className="personal-center-nav">
							<div 
								className="item icon20 on-log" 
								onClick={() => locationTo('/wechat/page/help-center')}
								data-log-region="personal-center-nav"
								data-log-pos="help-center"
								>
					            <div className="text">帮助中心</div>
					            <div className="enter-arrow"></div>
				            </div>
						</div>

			            {/*{typeof window !== 'undefined' && !Detect.os.phone && !Detect.os.weixin && <div className="logout-btn" onClick={() => this.refs.logoutComfirmDialog.show()}>退出登录</div>}*/}

			            {/*<Confirm ref='logoutComfirmDialog' onBtnClick={(tag) => tag == 'confirm' ? location.href = '/loginOut.htm' : ''}>
				            <span className='co-dialog-main-content'><p>确定退出登录？</p></span>
			            </Confirm>*/}

		            </div>
	            </div>

				{
					this.state.showFromLive ?
						<div className="from-live" onClick={this.backToLive}>
							<span className="back-to-live"></span> 返回直播间
						</div> : ""
				}
				
                {
                    this.state.isShowNewUserGift &&
                    <NewUserGift
                        courseList={this.state.newUserGiftCourseList}
                        onClose={() => this.setState({isShowNewUserGift: false})}
                        expiresDay={this.state.newUserGiftExpiresDay}
                    />
                }

	            <TabBar
					activeTab={"mine"}
                    isMineNew={false}
                    isMineNewSession={''}
				/>

				<NewRealNameDialog 
                    show = { this.state.isNotBtn }
                    onClose = {this.clearRealName.bind(this)}
                    realNameStatus = { this.state.realStatus || 'unwrite'}
					checkUserStatus = { this.state.newRealStatus || 'no' }
					rejectReason={this.state.rejectReason}
					isClose = {true}
                    liveId = {this.liveId}
				/>
				{ !!isShowIdx && <Dialog showTi={ this.showTi } /> }
            </Page>
        );
    }
}

function removeFromLiveCenter () {
    typeof window.sessionStorage != 'undefined' && sessionStorage.removeItem('trace_page');
}

function mapStateToProps (state) {
    return {
		sysTime: state.common.sysTime,
	    userInfo: state.common.userInfo,
		liveData: state.mine.liveData,
        userId: state.common.cookies.userId
    }
}

const mapActionToProps = {
	getUserInfo,
	getMyLive,
	getMySubscribe,
	getMyCenter,
	getCoralAccess,
	getQlchatSubscribeStatus,
	getQlchatQrcode,
	getNotCheckinCount,
	unbindPhone,
	getRealStatus,
	getCheckUser
}

module.exports = connect(mapStateToProps, mapActionToProps)(Mine);
