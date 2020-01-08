/**
 * Created by qingxia on 20181221.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import Clipboard from 'clipboard';

import Page from 'components/page';
import { getVal, formatDate , locationTo, getCookie } from 'components/util';

import { apiService } from "components/api-service";

import QuickEnterBar from "./components/quick-enter-bar";
import MainEnterBar from "./components/main-enter-bar";
import BackstageBottomTab from "./components/bottom-tab";
import StudioIndexBar from "components/studio-index";
import FunctionSquare from "./components/function-square";

import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import CompanyDialog from 'components/dialogs-colorful/company'
import GuideVideo from 'components/guide-video'
import {MiddleDialog} from 'components/dialog'

import { getRealStatus, getLiveCommentNum, checkEnterprise,getCheckUser } from "../../actions/live-back";

import RidingLantern from 'components/riding-latern';
import FocusLive from './components/focus-live';
import TeacherGroup from './components/teacher-group';
import ConsultDialog from './components/consult-dialog';
import DialogList, { NewRule, QlRecommend, FloatBox } from './components/dialog-list';
import BaseInfo from './components/base-info';

import ConfirmDialog from './components/pc-back-link-dialog';

import { getDomainUrl } from "../../../actions/common";
import { getUnreadCount } from "common_actions/notice-center";

class LiveBack extends Component {

	state = {
		liveId: (this.props.liveInfo && this.props.liveInfo.id)||'',
		qrUrl: false,
		liveInfo: this.props.liveInfo||{},
		liveBaseInfo: {},
		squareInfos: [],
		liveTagId: undefined,
		realNameInfo:{},
		isRealName: false,
		isShowRealName:false,
		subscribe: false,
		showConsult: false,
		dialogList: [],
		showPcBackLink: false,
		showPcBackLinkDialog: false,
		ridingLantern: undefined,
		isShowfocusGuid:'Y',
		isShowCompany: false,
		enterprisePo: {},
		checkUserStatus: '',

		showPcManageBox: false,
		// 进入直播间后台必然有管理员权限，不请求power接口
		power: {
			allowMGLive: true
		},
		step: 1,
		showLiveCateUpdateModal: false,
		showLiveCateSetModal: false,
		hasShowCallbackModal: true // 本次是否显示召回弹窗
	};

	data = {
		
	};

	componentDidMount(){
		if (window.sessionStorage) {
			// 处理问题： 当本页面为first 跳转外部链接时再返回后 ios11会出现返回栏遮住浏览器，且无法隐藏
			// 处理方法： 在跳转前插入空历史调整，可使返回栏固定不隐藏 (暂时未发现更好的处理方式)
            let routes = typeof sessionStorage !== 'undefined' && JSON.parse(sessionStorage.getItem('ROUTE_HISTORY'));
            routes instanceof Array || (routes = []);
			const reg = /wechat\/page\/backstage/;
            if (routes.length == 1 && routes[0] && reg.test(routes[0])) {
				const url = window.location.href
				window.history.replaceState(null, null, `/wechat/page/live/${this.state.liveId}`)
				window.history.pushState(null, null, url)
            }
		}
		this.data.userId = getCookie('userId');
		if (this.props.createBy) {
			this.setState({
				isLiveCreator: this.props.createBy == this.data.userId
			});
		}
		this.initData();
		
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
	}

	ajaxGetQl = async () => {
		if (!this.liveId) return ;
		try {
			let result = await apiService.post({
				url: '/h5/live/getQr',
				body: {
					showQl: 'Y',
					liveId: this.liveId,
					channel: 'qrOnly'
				}
			})
			if (result.state.code == 0) {
				this.setState({
					qrUrl: result.data.qrUrl
				})
			} else {

			}
		} catch (error) {
			console.error(error);
		}
	}

	get liveId () {
		return this.state.liveId
	}

	getRidingLantern = async () => {
		if (!this.liveId) return ;
		try {
			let result = await apiService.post({
				url: '/h5/live/entity/getHorseRaceLamp',
				body: {
					liveId: this.liveId
				}
			})
			if (result.state.code == 0) {
				this.setState({
					ridingLantern: result.data.marquee
				})
			} else {

			}
		} catch (error) {
			console.error(error);
		}
	}


	initData(){
		this.getSquareList(); //获取直播间后台的九宫格列表
		this.getLiveBaseInfo(); //获取直播间相关状态

		this.getRealStatus(); //获取实名认证的状态
		this.getRidingLantern();
		this.liveCommentNum();
		this.getLiveFloatBox();
		this.getCompany();
		this.getDomainUrl();
		this.getLiveToDoTips();
		this.isSubscribeKnowledge();
		this.getBanner();

		this.initCopy();
		this.getUnreadCount();
	}

	async getBanner () {
		const res =	await apiService.post({
			url: "/h5/live/message/list",
			body: {
				liveId: this.liveId,
				type: 4,
				page: {
					page: 1,
					size: 20
				}
			}
		})
		if (res && res.data && res.data.messageList && res.data.messageList.length > 0) {
			this.setState({
				bannerMessage: res.data.messageList[0]
			})
		}
	}

	async isSubscribeKnowledge () {
		const res =	await apiService.get({
			url: '/h5/live/revonsitution/isSubscribeKnowledge',
			body: {}
		})

		if (res && res.data && res.data.appId) {
			let revonsitutionQrcode = ''
			let groupQrcode = ''
			let isRevonsitution = ''
			if (!res.data.subscribe) {
				const qr = await apiService.get({
					url: '/h5/live/getQr',
					body: {
						channel: 'adminBottom',
						liveId: this.liveId,
						appId: res.data.appId,
						showQl: 'N'
					}
				})
				revonsitutionQrcode = qr && qr.data && qr.data.qrUrl || ''
				isRevonsitution = 'N'
				const qrGroup = await apiService.get({
					url: '/h5/live/getQr',
					body: {
						channel: 'adminGroup',
						liveId: this.liveId,
						appId: res.data.appId,
						showQl: 'N'
					}
				})
				groupQrcode = qrGroup && qrGroup.data && qrGroup.data.qrUrl || ''
			}
			this.setState({
				revonsitutionQrcode,
				groupQrcode,
				isRevonsitution
			})
		}
	}

	initCopy(){
		let that = this;
		//复制链接
		var clipboard = new Clipboard(".fuzhi");
		clipboard.on('success', function(e) {
			that.hidePcManageBox();
			window.toast('复制成功！');
		});
		clipboard.on('error', function(e) {
			that.hidePcManageBox();
			window.toast('复制失败！请手动复制');
		});
	}

	async getLiveToDoTips () {
		const res =	await apiService.get({
			url: '/h5/live/revonsitution/manage',
			body: {
				liveId: this.state.liveId,
			}
		})
		if (res && res.data) {
			const {
				liveEntityView,
				isLiveNameDefault,
				recommendTagids,
				liveUserRefViews,
				enterpriseIdentityStatus,
				userIdentityStatus,
				tagId
			} = res.data
			let liveToDoTips = 0

			// 直播间名称是否默认
			if (isLiveNameDefault === 'Y') liveToDoTips++
			// 是否简介为空
			if (!liveEntityView || !liveEntityView.introduce) liveToDoTips++
			// 是否分类为空
			if (!recommendTagids) liveToDoTips++
			const userRef = liveUserRefViews && liveUserRefViews.length > 0 && liveUserRefViews.find(item => item.userId == this.data.userId)
			// 创建者专属
			if (userRef && userRef.role === 'creater') {
				// 手机号为空
				if (!liveEntityView || !liveEntityView.phoneNum) liveToDoTips++
				// 微信号为空
				if (!liveEntityView || !liveEntityView.wechatAccount) liveToDoTips++
				// 企业未认证
				if (!enterpriseIdentityStatus || !/awaiting|pass/.test(enterpriseIdentityStatus)) liveToDoTips++
				// 个人未认证
				if (!userIdentityStatus || !/awaiting|pass/.test(userIdentityStatus)) liveToDoTips++
			}

			this.setState({
				liveTagId: tagId		
			}, () => {
				this.showCallbackModal();
			});
			
			if (liveToDoTips > 0) {
				this.setState({
					liveToDoTips
				})
			}
		}
	}

	// 直播间分类召回弹窗
	// 一个月后下线
	showCallbackModal() {
		if(!this.state.liveTagId && !window.localStorage.getItem('SHOW_NEVER_LIVE_CATE_DIALOG')) { // 未选择分类弹窗
			this.setState({
				showLiveCateSetModal: true,
			});
			return ;
		} else if(!window.localStorage.getItem('SHOW_NEVER_LIVE_CATE_DIALOG') && !window.localStorage.getItem('SHOW_NEW_LIVE_CATE_DIALOG')) { // 未更新分类弹窗
			this.setState({
				showLiveCateUpdateModal: true,
			});
			return ;
		}
		// 如果不显示任何一个弹窗，hasSHowcallbackModal设置为false, 让配置弹窗弹出 
		this.setState({
			hasShowCallbackModal: false
		});
	}

	async getCompany(){
		const { data = {} } = await checkEnterprise({liveId: this.state.liveId,});
		this.setState({
			enterprisePo: data
		});
	}

	async getDomainUrl(){
		try{
			let result = await this.props.getDomainUrl({
				type: 'shortKnowledge'
			});
			if(result.state.code === 0 ){
				this.setState({
					shortDomainUrl: result.data.domainUrl,
				});
			}
		}catch(err){
			console.log(err)
		}
		
		
	}
	
	async getSquareList(){
		const result = await apiService.get({
            url: '/h5/live/entity/getLiveSoduko',
            body: {
                liveId: this.state.liveId,
            }
		})
		if (result.state.code === 0) {
			let sodukoMap = getVal(result, 'data.sodukoMap', {});
			let squareInfos=[
				{
					type:'manage',
					name:'经营管理',
					list: sodukoMap.manage,
				},
				{
					type:'sell',
					name:'营销推广',
					list: sodukoMap.sell,
				},
				{
					type:'service',
					name:'平台服务',
					list: sodukoMap.service,
				}
			]
			this.setState({ squareInfos })
		}
        
	}

	getLiveFloatBox = async () => {
		try {
			let result = await apiService.post({
				url: '/h5/live/entity/getLiveFloatBox',
				body: {
					liveId: this.state.liveId
				}
			})
			if (result.state.code == 0) {
				if (result.data.floatBox.id !== undefined) {
					let lastId = localStorage.getItem('readpic');
					if (lastId == result.data.floatBox.id) {
						return 
					}
					this.setState({
						dialogList: [
							...this.state.dialogList,
							{
								name: 'floatBox',
								floatBox: result.data.floatBox,
								priority: 99
							}
						].sort((a,b) => {
							return b.priority - a.priority
						})
					})
				} 
			}
		} catch (error) {
			console.error(error)
		}
	}

	async getLiveBaseInfo(){
		const [liveEntityInfo, liveState] = await Promise.all([
			apiService.get({
				url: '/h5/live/entity/getLiveEntityInfo',
				body: {
					liveId: this.state.liveId,
				}
			}),
			apiService.get({
				url: '/h5/live/revonsitution/getLiveState',
				body: {
					liveId: this.state.liveId,
				}
			})
		]);
		if (liveEntityInfo.state.code === 0) {
			const liveBaseInfo = Object.assign({}, liveEntityInfo.data, liveState && liveState.data || {})
			this.setState({ liveBaseInfo })
			if (liveEntityInfo.data.subscribe == '0') {
				this.ajaxGetQl();
			}
			// 下架千聊帮你推（直通车新规和推荐弹窗）
			// if (result.data.isPlatformShareOpen) {
			// 	let isPlatformShareOpen = localStorage.getItem('isPlatformShareOpen');
			// 	if (isPlatformShareOpen != 'close') {
			// 		this.setState({
			// 			dialogList: [
			// 				...this.state.dialogList,
			// 				{
			// 					priority: 100,
			// 					isPlatformShareOpen: result.data.isPlatformShareOpen,
			// 					name: 'isPlatformShareOpen'
			// 				}
			// 			].sort((a,b) => {
			// 				b.priority - a.priority
			// 			})
			// 		})
			// 	}
			// }
        }
	}

	async getRealStatus(){
		if (this.props.createBy == this.data.userId) {
			let realNameResult = await this.props.getRealStatus(this.state.liveId,'live');
			let { data } = await this.props.getCheckUser();
			const newReal = (data && data.status) || 'no';
			const oldReal = realNameResult.data && realNameResult.data.status || 'unwrite'
			this.setState({
				realNameInfo: realNameResult.data,
				checkUserStatus: newReal,
				isRealName: Object.is(newReal, 'pass'),
			});
		}
	}

	showRealNameDialog(){
		this.setState({
			isShowRealName: true,
		});
	}
	closeRealName(){
		this.setState({
			isShowRealName: false,
		});
	}

	// b端评论未读消息数  
	async liveCommentNum(){
		let commentNumResult = await this.props.getLiveCommentNum();
		this.setState({
			commentNum: commentNumResult.data.num,
		});
	}

	// 关闭弹框之后的操作
	onCloseDialogList = () => {
		let { dialogList } = this.state;
		let current = dialogList[0];
		if (current.name == 'isPlatformShareOpen') {
			localStorage.setItem('isPlatformShareOpen', 'close')
		}
		if (current.name == 'floatBox') {
			localStorage.setItem('readpic', current.floatBox.id)
		}
		dialogList.shift();
		this.setState({
			dialogList: [...dialogList]
		})
	}

	// 更换弹框内容在这里弹框
	getDialog = () => {
		let { dialogList } = this.state;
		if (!dialogList.length) return null;
		let current = dialogList[0];
		// 下架直通车新规和推荐弹窗
		// if (current.name == 'isPlatformShareOpen') {
			// if (current.isPlatformShareOpen == 'N') {
			// 	return <QlRecommend liveId={this.state.liveId} onClose={this.onCloseDialogList}/>
			// }
			// if (current.isPlatformShareOpen == 'Y') {
			// 	return <NewRule onClose={this.onCloseDialogList} />
			// }
		// }
		if (current.name = 'floatBox') {
			return <FloatBox onClose={this.onCloseDialogList} {...current.floatBox}/>
		}
	}
	closeCompany(){
		this.setState({
			isShowCompany: false
		})
	}
	showCompany(){
		this.setState({
			isShowCompany: true
		})
	}

	scrollTimeoutId = undefined;


	onScroll = () => {
		this.scrolling = true;
		this.setState({
			opacity: 0.5
		})
		if (this.scrollTimeoutId) {
			clearTimeout(this.scrollTimeoutId);
		}
		this.scrollTimeoutId = setTimeout(() => {
			this.scrolling = false;
			this.setState({
				opacity: 1
			})
			this.scrollTimeoutId = undefined;
		}, 100)
	}

	showPcManageBox(){
		this.setState({
			showPcManageBox: true,
		});
	}
	hidePcManageBox(){
		this.setState({
			showPcManageBox: false,
		});
	}

	toggleDialogShow = (key, isShow = true) => {
		this.setState({
			[key]: isShow
		})
	}

	getUnreadCount() {
		this.props.getUnreadCount(this.state.liveId)
	}

	onJump = (url) => {
		locationTo(url)
	}

	render(){
		const { 
			liveInfo, 
			liveId, 
			liveBaseInfo, 
			squareInfos, 
			isRealName, 
			realNameInfo, 
			commentNum, 
			liveToDoTips,
			bannerMessage
		} = this.state;
		return (
			<Page title="工作台" className='page-live-back'>
				<img style={{
					opacity: this.state.opacity,
				}} className="consultation on-log on-visible" data-log-region="feedback" src={require('./img/consultation.png')} onClick={() => {
					this.setState({
						showConsult: true
					})
				}} />
				{
					this.state.showPcBackLink?
					<div className="pc-back-tip">
						<div className="text elli">登录电脑端千聊Live管理后台体验更多功能</div>
						<div className="btn-check " onClick={() => { this.setState({
								showPcBackLinkDialog: true
							})}}>查看</div>
					</div>
					:
					(
						this.state.ridingLantern ? <RidingLantern content={this.state.ridingLantern.content} link={this.state.ridingLantern.link} /> : null
					)
				}
				<div className="backstage-main" onScroll={this.onScroll}>
					<BaseInfo
						liveId={liveId}
						liveInfo={liveInfo}
						liveBaseInfo={liveBaseInfo}
						toDoTips={liveToDoTips}
						/>
					{
						this.state.isRevonsitution === 'N' && this.state.isShowfocusGuid =='Y' ? 
						<TeacherGroup onClose={() => {
							this.setState({
								isShowfocusGuid: 'N'
							})
						}} onJoin={() => this.toggleDialogShow('showTeacherCodeDialog', true)} /> : null
					}

					{
						bannerMessage ?
						<div className="banner-message">
							<div className="banner-bg-box on-log on-visible" data-log-region="ad" onClick={() => {
								this.onJump(bannerMessage.url)
							}}><img src={bannerMessage.imageUrl} alt=""/></div>
							<span className="close-btn" onClick={() => {this.setState({bannerMessage: null})}}></span>
						</div> : null 
					}


					<div className="function-square border-bottom">
						<div className="function-type">新建</div>
						<QuickEnterBar  
							liveId = {liveId} 
							beginCountGt = {liveInfo.beginCountGt10} 
							isRealName = {isRealName}
							isPop = {realNameInfo.isPop}
							showRealNameDialog = {this.showRealNameDialog.bind(this)}
							shortDomainUrl = {this.state.shortDomainUrl}
							showPcManageBox = {this.showPcManageBox.bind(this)}
						/>
					</div>
						
					{
						squareInfos && squareInfos.map((squareInfo,index)=>{
							if(squareInfo.list){
								return <FunctionSquare squareInfo = {squareInfo} 
									key = {`squareInfo-${index}`}
									hasBottomBorder={index !== squareInfos.length - 1}
									commentNum={commentNum} 
									toGuestShare={liveBaseInfo.toGuestShare}
									isQlchat = {liveBaseInfo.isQlchat}
									pushStatus ={liveBaseInfo.pushStatus}
									// 一个月后下线
									liveTagId={this.state.liveTagId}
									toggleDialogShow={this.toggleDialogShow}
									showPcManageBox = {this.showPcManageBox.bind(this)} />
							}else
							return null
						})
					}	
					{
						this.state.isRevonsitution === 'N' && this.state.revonsitutionQrcode ? <FocusLive qrUrl={this.state.revonsitutionQrcode} onClose={() => {
							this.setState({
								revonsitutionQrcode: false,
							})
						}}/> : null
					}			
				</div>
				<StudioIndexBar liveId={liveId} activeIndex={"admin"} power={this.state.power} newMessageCount={this.props.newMessageCount} />

				{/* 实名认证弹框  */}
				<NewRealNameDialog
					show={this.state.isShowRealName}
					onClose={this.closeRealName.bind(this)}
					realNameStatus={realNameInfo.status || 'unwrite'}
					checkUserStatus={this.state.checkUserStatus}
					isClose={true}
					liveId={liveId}
					isLiveCreator={this.state.isLiveCreator}
				/>

				{/* 企业弹窗 */}
				<CompanyDialog 
					show = {this.state.isShowCompany}
					enterprisePo={this.state.enterprisePo}
					onClose = {this.closeCompany.bind(this)}/>
				{
					this.state.showConsult ? <ConsultDialog onClose={() => {
						this.setState({
							showConsult: false
						})
					}}></ConsultDialog> : null
				}
				{
					this.state.dialogList.length > 0 && !this.state.hasShowCallbackModal
					? 	
					<DialogList>
						{
							this.getDialog()
						}
					</DialogList> : null
				}
				{
                    this.state.showPcBackLinkDialog ? 
                    <ConfirmDialog
                        onClose={() => { this.setState({
							showPcBackLinkDialog: false,
							showPcBackLink: false,
                        })}}
                    ></ConfirmDialog> : null
				}
				
				{
					this.state.showPcManageBox &&
					<div className="copy-pc-manage-url" onClick={()=>{
						this.setState({
							showPcManageBox: false,
						});
					}}>
						<div className="fuzhi" data-clipboard-text="http://v.qianliao.tv/" >
							如何登录“电脑端-千聊讲师管理后台”？ <br /> 
							方式一：打开浏览器搜索“千聊管理后台” <br /> 
							方式二：在PC浏览器输入以下网址 <br />
							<span className="link"> v.qianliao.tv </span> (点击复制)
						</div>
					</div>
				}
				{
					this.state.showTeacherCodeDialog ?
					<PrivateDialog
						className="teacher-code-dialog"
						title="扫码加入讲师交流群"
						onClose={() => this.toggleDialogShow('showTeacherCodeDialog' , false)}>
						<p className="text">长按识别二维码</p>
						<div className="qr-code">
							<img src={this.state.groupQrcode} alt=""/>
						</div>
					</PrivateDialog> : null
				}
				
				{
					this.state.showCoursePromotionDialog ?
					<PrivateDialog
						className="course-promotion-dialog"
						title="设置课程促销"
						onClose={() => this.toggleDialogShow('showCoursePromotionDialog', false)}>
						<p className="desc txtCenter">付费系列课可以设置促销，有<br/>限时特惠、拼课和砍价三种模式</p>
						<p className="text">限时特惠</p>
						<img src={require('./img/pic_suc.png')} alt="" className="example"/>
						<p className="text">拼课</p>
						<img src={require('./img/pic_spelling.png')} alt="" className="example"/>
						<p className="text">砍价</p>
						<img src={require('./img/pic_bargain.png')} alt="" className="example"/>
						<p className="tip">如何设置</p>
						<GuideVideo 
							className="promote"	
							poster="https://img.qlchat.com/qlLive/liveCommon/video-normal-poster.png"
							src="https://media.qlchat.com/qlLive/activity/video/SSBQ1OIG-9EX5-FDYK-1574216020371-GZ2DT8BBQCU4.mp4"
						/>
					</PrivateDialog> : null
				}
				
				{
					this.state.showCourseCouponDialog ?
					<PrivateDialog
						className="course-promotion-dialog"
						title="设置课程优惠券"
						onClose={() => this.toggleDialogShow('showCourseCouponDialog', false)}>
						<p className="desc txtCenter">系列课、单课、打卡课、训练营<br/>都可以设置优惠券</p>
						<GuideVideo 
							className="promote"
							poster="https://img.qlchat.com/qlLive/liveCommon/video-normal-poster.png"
							src="https://media.qlchat.com/qlLive/activity/video/PF1KZJPW-VQ61-9FUM-1574216016072-GQUSADEBAQUI.mp4"
						/>
					</PrivateDialog> : null
				}
				<MiddleDialog
					className="live-cate-never-update-dialog live-cate-dialog"
					show={this.state.showLiveCateUpdateModal}
				>
					<div className="content">
						<div className="dog">
							<img src={require('./img/dog.png')} alt=""/>
						</div>
						<div 
							className="close" 
							onClick={() => {
								if(!window.localStorage.getItem("SHOW_NEW_LIVE_CATE_DIALOG")) {
									window.localStorage.setItem("SHOW_NEW_LIVE_CATE_DIALOG", "Y");
								};
								this.setState({showLiveCateUpdateModal: false})
							}}
							
						></div>
						<p className="title">直播间分类更新啦</p>
						<p className="sub-title">更新内容：</p>
						<p className="text">1、平台已更新到直播间分类，请前往修改。</p>
						<p className="text">2、精准的分类，有利于平台把课程分发给感兴趣的用户，提升课程销量。</p>
						<div className="btn-wrap">
							<div 
								className="btn" 
								onClick={() => {
									if(!window.localStorage.getItem("SHOW_NEW_LIVE_CATE_DIALOG")) {
										window.localStorage.setItem("SHOW_NEW_LIVE_CATE_DIALOG", "Y");
									};
									locationTo(`/wechat/page/live-setting?liveId=${this.state.liveId}&autoLive=Y`)}}
								>前往设置</div>
						</div>
					</div>
				</MiddleDialog>

				<MiddleDialog
					className="live-cate-never-set-dialog live-cate-dialog"
					show={this.state.showLiveCateSetModal}
				>
					<div className="content">
						<div className="close" onClick={() => {this.setState({showLiveCateSetModal: false})}}>
						</div>
						<p className="title">你的直播间还没有设置分类</p>
						<p className="text">选择精准的分类，有利于平台把课程分发给感兴趣的用户，提升课程销量</p>
						<div className="btn-wrap">
							<div className="btn" onClick={() => {locationTo(`/wechat/page/live-setting?liveId=${this.state.liveId}&autoLive=Y`)}}>前往设置</div>
						</div>
						<p className="tip" onClick={() => {
							window.localStorage.setItem("SHOW_NEVER_LIVE_CATE_DIALOG", "Y");
							this.setState({
								showLiveCateSetModal: false
							});
						}}>不再提醒</p>
					</div>
				</MiddleDialog>
			</Page>
		)
	}
}

const PrivateDialog = ({
	children,
	title = '',
	className,
	onClose = () => {}
}) => (
	<div className={`private-dialog${className ? ' ' + className : ''}`}>
		<div className="_layer" onClick={onClose}></div>
		<div className="_container">
			<span className="close-btn" onClick={onClose}></span>
			{title ? <h3 className="title">{title}</h3> : null}
			<div className="content">
				{children}
			</div>
		</div>
	</div>
)

function mapStateToProps (state) {
	return {
		liveInfo: state.liveBack.liveInfo || {},
		createBy: state.liveBack.liveInfo.createBy,
		bannerMessage: getVal(state, 'noticeCenter.topMessage') || null,
		unreadMap: state.noticeCenter.unreadMap,
		newMessageCount: calUnreadNum(state.noticeCenter.unreadMap)

	}
}

const mapActionToProps = {
	getRealStatus,
	getCheckUser,
	getLiveCommentNum,
	getDomainUrl,
	getUnreadCount
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveBack);
// 计算未读数量
function calUnreadNum(unreadMap) {
    if(!unreadMap) return;
    let sum = 0;
    Object.keys(unreadMap).forEach(key  => {
        sum += unreadMap[key];
    });
    return sum;
}