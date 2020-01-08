import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import StudentTask from '../components/student-task'
import Calendar from './components/calendar'
import LearnMode from '../components/learn-mode'
import ScrollToLoad from 'components/scrollToLoad';
import { get, minBy } from 'lodash';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import JobListDialog from 'components/dialogs-colorful/job-list-dialog'
import { MiddleDialog, Confirm } from 'components/dialog';
import CashBackRuleDialog from '../components/cash-back-rule';
import RewardListDialog from './components/reward-list-dialog';
import ShareCard from './components/share-card';

import { locationTo, formatDate, getCookie, isFromLiveCenter, formatMoney } from "components/util";
import Page from 'components/page';
import { setAlert, fetchAnswerCountByCamp, fetchCampAnswerByTopicList, fetchCampAffairStatus, fetchCampAffair, liveCouponDetail, fetchAchievementCardInfo, getLiveInfo, getIsQlLive, getSchoolCardData, getSchoolCardQrCode } from '../../../actions/training'
import { campAnswerlikes, setCertificateName, getUserQualification,getIntentionCamp,getDistributePermission,getDistributeConfig } from '../../../actions/channel-intro'
import { getQr } from '../../../actions/common';
import { share } from 'components/wx-utils';
import { apiService } from "components/api-service";
import { isBindLiveCoupon } from '../../../actions/coupon'

import Swiper from 'react-id-swiper';
import {
	userBindKaiFang,
} from 'actions/recommend';
import CollectVisible from 'components/collect-visible';
import drawEnterCard from './components/enter-card/drawCard'
import { getUrlParams, fillParams } from 'components/url-utils';
import RightBottomIcon from '../../../components/right-bottom-icon';
import QRImg from 'components/qr-img';
import CampGiftEntry from '../../../../female-university/components/camp-gift-entry'
import '../../../../female-university/components/camp-gift-entry/style.scss'


@autobind
class TrainingLearn extends Component {
    data = {
        currentCommentAnswerId: '',
        allDateTempData: {
            affairStatusMap: {}
        }, // 缓存所有日期下面的数据
    };
    state = {
        title: '',
        isOpenType: false, // 是否开营
        learnList: [], // 任务列表
        affairEndTime: '', // 作业截至时间
        isOpenInputText: '',
        commentInputVal: '',
        isOnlyMine: 'N', // 只看精华
        orderBy: 'ASC', // 排序
        periodChannel: {
            periodPo: {}
        }, // 期数信息
        tagList: {
            dataList: {
                list: [],
                page: 1,
                pageSize: 20,
                isNoMore: false,
                isEnd: false,
            },
            // 缓存不同数据列表对象
            cacheDataList: {
                // 排序
                'ASC': {
                    // 是否只看我的
                    'Y': {
                        list: [],
                        page: 1,
                        pageSize: 20,
                        isNoMore: false,
                        isEnd: false,
                    },
                    'N': {
                        list: [],
                        page: 1,
                        pageSize: 20,
                        isNoMore: false,
                        isEnd: false,
                    }
                },
                'DESC': {
                    'Y': {
                        list: [],
                        page: 1,
                        pageSize: 20,
                        isNoMore: false,
                        isEnd: false,
                    },
                    'N': {
                        list: [],
                        page: 1,
                        pageSize: 20,
                        isNoMore: false,
                        isEnd: false,
                    }
                }
            }
        },
        showJobListDialog: false,
        jobList: [],
        qrcode: '',  // 用于动态生成二维码
        followDialogOption: {
            title: '',
            desc: '',
            qrUrl: '',
        },
        currentDay: '', // 当前的日期
        classQr: '', // 加入班群二维码
        alertQr: '', // 作业提醒二维码
        startTime: '', // 开营时间
        hasCourse: [], // 日历展示哪天有课
        hasAffair: [], // 日历展示哪天打卡
        hasSupplement: [], // 日历展示哪天补卡
        isShowReword: false, // 是否展示打卡奖励弹框
        affairStatus: '', // 打卡状态
        rewordInfo: {}, // 优惠券信息
        calendarToggle: false, // 日历打开控制不滑动
        startSlide: 0,
        currentIndicator: 0,
        nameStr: '', // 毕业证书名称
        hasQualification: 'N', // 是否完成
        nickName: '', // 证书名称

        isShowShareCard: false, // 分享海报
        haveReward: '', // 是否达成奖励

		isShowEnterCard: false,	// 展示入学通知书
		enterCardUrl: '', // 入学通知书
    }
    // 阻止查看我的和排序同时点击
    toggleing = false

    sliderParams = {
        slidesPerView: 'auto',
        slideClass: 'learn-li',
        on: {
            init: function () {
                typeof _qla !== 'undefined' && _qla.collectVisible();
            },
            transitionEnd: function () {
                typeof _qla !== 'undefined' && _qla.collectVisible();
            },
        }
       
    }

    get channelId() {
        return this.props.location.query.channelId || '';
    }

    get liveId() {
		let {periodInfo = {}} = this.props
		let liveId = periodInfo.liveId || ''
		return liveId
	}

	get campId() {
    	let {periodInfo = {}} = this.props
		let campId = periodInfo.campId || ''
		return campId
	}
 
	get experienceId() {
    	return this.props.location.query.experienceId || '';
	}
	get campType() {
    	return this.props.location.query.campType || '';
	}
	get urlDate() {
		let urlDate = this.props.location.query.targetDate || ''
		if(urlDate) {
			return new Date(urlDate).getTime()
		} else {
			return this.props.sysTime
		}
	}

	get urlAfterExerciseShow() {
		return this.props.location.query.afterExerciseShow || ''
	}

    async componentWillMount() {
        console.log('state....', this.props.training)
        let periodChannel = get(this.props.training, 'periodChannel') || { periodPo: {} }
        let startTime = get(periodChannel, 'periodPo.startTime') || ''
        let endTime = get(periodChannel, 'periodPo.endTime') || ''
        let needSignIn = get(periodChannel, 'periodPo.needSignIn') || 'N'
        let canSupplement = get(periodChannel, 'periodPo.canSupplement') || 'N'
        let affairMap = get(this.props.training, 'affairMap')
        let openType = 'Y' //W未开营 N结营 Y进行中 
        // 设置打卡数据
        let hasCourse = []
        let hasAffair = []
        let hasSupplement = []
        for (let i in affairMap) {
            if (affairMap[i].hasCourse == 'Y') {
                hasCourse.push(i)
            }
            if (needSignIn == 'Y' && affairMap[i].hasAffair == 'Y') {
                hasAffair.push(i)
            }
            if (canSupplement == 'Y' && affairMap[i].hasSupplement == 'Y') {
                hasSupplement.push(i)
            }
        }

        this.setState({
            periodChannel,
            title: periodChannel.periodPo.name || '训练营学习',
            startTime,
            hasCourse,
            hasAffair,
            hasSupplement,
        })

        // 判断是否开营 结营
        if (endTime < this.props.sysTime) {
            openType = 'N' // 结营
        } else if (startTime < this.props.sysTime) {
            openType = 'Y' // 进行中
        } else {
            openType = 'W' // 未开营
        }

        this.setState({
            isOpenType: openType
        })

        // 请求初始化数据
        this.changeLearnList()

        //获取体验营
        this.getCamp()
        // 已结营 请求证书数据
        if (openType == 'N') {
            this.initIsCertificate()
        }

        this.initShare()

        this.userBindKaiFang();

        this.initLiveInfo(periodChannel.periodPo.liveId)

		this.initEnterCard()

		this.judgeCardAfterExercise()

		// 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
	}

    async initLiveInfo (liveId) {
        const qlLive = await this.props.getIsQlLive(liveId)
        const isQlLive = get(qlLive, 'data.isQlLive')
        const state = {isQlLive}

        if (isQlLive === 'N') {
            const liveInfo = await getLiveInfo(liveId)
            state.liveInfo = liveInfo
        }
        this.setState(state)
    }

    // 自定义分享
	initShare() {
        let periodChannel = get(this.props.training, 'periodChannel') || { periodPo: {} }
        let { periodPo } = periodChannel
		let { campName, headImage } = periodPo
		let wxqltitle = `我推荐-【${campName}】`;
		let shareUrl = window.location.origin + this.props.location.pathname + `?channelId=${this.channelId}&shareUserId=${getCookie('userId')}`;

		share({
			title: wxqltitle,
			timelineTitle: wxqltitle,
			desc: '点击看好课>>>',
			timelineDesc: wxqltitle, // 分享到朋友圈单独定制
			imgUrl: headImage,
			shareUrl,
		});
	}

    async initIsCertificate(){
        let result = await this.props.getUserQualification({
            channelId: this.channelId,
		});
		if(result.data && result.data.cardPo){
			this.setState({
				hasQualification: result.data.cardPo.hasQualification,
				nickName: result.data.cardPo.userName||'',
			})
		}
    }

    // 初始化绑定三方
	async userBindKaiFang() {
		const kfAppId = this.props.location.query.kfAppId;
		const kfOpenId = this.props.location.query.kfOpenId;
		if (kfAppId && kfOpenId) {
			// 绑定分销关系
			this.props.userBindKaiFang(kfAppId, kfOpenId);
		} 
	}

    // 初始化数据
    changeLearnList(dateNow = formatDate(this.urlDate || this.props.sysTime)) {
        // 没有开营不给请求
        // if (this.state.startTime > this.props.sysTime) return

        let topicMap = this.props.training.topicMap
        console.log('获取话题作业列表：', topicMap)

        let maxTime = minBy(topicMap[dateNow], 'affairEndTime') || minBy(topicMap[dateNow], 'homeworkEndTime') || {}
        this.setState({
            learnList: topicMap[dateNow] || [],
            affairEndTime: maxTime.affairEndTime || maxTime.homeworkEndTime,
            currentDay: dateNow
        }, () => {
            // 需打卡才请求
            if (this.state.periodChannel.periodPo.needSignIn == 'Y') {
                this.handleFetchCampAffairStatus()
            }
            // 请求话题集合的答案列表
            if (topicMap[dateNow] && topicMap[dateNow].length > 0) {
                // 重置数据
                this.clearTabList(this.loadMore)
            }
        })

    }
    // 获取体验营详细
    getCamp = async () => { 
        if(this.experienceId){ 
            const { camp } = await getIntentionCamp({
                campId: this.experienceId,
            }) 
            if(camp.shareType=='INTENTION_SHARE'){
                this.getShareJob()
                return
            } 
            await this.setState({
                campObj: camp || {} 
            })
        } 
    }
    //获取分销权限
    async getShareJob(){ 
        if(this.experienceId&&this.campType){ 
            //分销权类型:INTENTION_UFW=女大体验营;INTENTION_FINANCING=理财体验营;FINANCIAL=理财训练营
            const {permission} = await getDistributePermission({
                type:this.campType=='ufw_camp'?'INTENTION_UFW':this.campType=='financing'?'INTENTION_FINANCING':'FINANCIAL'
            })
            //分销配置类型 INTENTION=体验营;FINANCIAL=理财训练营
            const { config } = await getDistributeConfig({
                campId: this.experienceId,
                type:(this.campType=='ufw_camp'||this.campType=='financing')?'INTENTION':'FINANCIAL'
            })  
            this.setState({ 
                permission,
                campConfig:config
            })
        }
    }
    renderTypeNameByBtn (couponType) {
        let name = '优惠券'
        switch (couponType) {
            case 'live':
                name = '直播间通用券'
                break;
            case 'topic':
                name = '话题优惠券'
                break;
            case 'channel':
                name = '系列课优惠券'
                break;
            case 'global_vip':
                name = '通用vip券'
                break;
            case 'custom_vip':
                name = '定制vip券'
                break;
        }
        return name
    }

    /**
     * 获取当前打卡状态
     */
    async handleFetchCampAffairStatus() {
        if (this.state.learnList.length <= 0) {
            this.setState({
                affairStatus: '',
                affairToast: ''
            })
            return
        }
        // 从缓存数据里面拿到当天打卡状态
        let {status, toast} = this.data.allDateTempData.affairStatusMap[this.state.currentDay] || {}
        if (status) {
            this.setState({
                affairStatus: status,
                affairToast: toast
            })
            return
        }

        let res = await fetchCampAffairStatus({
            channelId: this.channelId,
            topicIdList: this.state.learnList.map(_ => _.id)
        })
        if (res.state.code == 0) {
            let {status, toast} = res.data && res.data || {}
            this.setState({
                affairStatus: status,
                affairToast: toast
            })
            this.data.allDateTempData.affairStatusMap[this.state.currentDay] = {
                status,
                toast
            }
        }
        console.log('this.data.allDateTempData.affairStatusMap:::', this.data.allDateTempData.affairStatusMap)
    }


    clearTabList(cb) {
        this.setState({
            tagList: {
                cacheDataList: {
                    // 排序
                    'ASC': {
                        // 是否只看我的
                        'Y': {
                            list: [],
                            page: 1,
                            pageSize: 20,
                            isNoMore: false,
                            isEnd: false,
                        },
                        'N': {
                            list: [],
                            page: 1,
                            pageSize: 20,
                            isNoMore: false,
                            isEnd: false,
                        }
                    },
                    'DESC': {
                        'Y': {
                            list: [],
                            page: 1,
                            pageSize: 20,
                            isNoMore: false,
                            isEnd: false,
                        },
                        'N': {
                            list: [],
                            page: 1,
                            pageSize: 20,
                            isNoMore: false,
                            isEnd: false,
                        }
                    }
                },
                dataList: {
                    isEnd: false,
                    isNoMore: false,
                    list: [],
                    page: 1,
                    pageSize: 20
                }
            }
        }, () => {
            cb && cb()
        })
    }
    // 列表数据装载
    async fetchDataList(tagList) {
        const tempTagList = tagList
        const data = tagList.dataList
        if (data.isNoMore) return

        const count = data.page * data.pageSize
        // 当存储数据不满足装载量且没到底，请求增加数据
        if (count > data.list.length && !data.isEnd) {
            let _listByChannel = {}
            if (this.state.learnList.length > 0) {
                _listByChannel = await this.props.fetchCampAnswerByTopicList({
                    topicIdList: this.state.learnList.map(_ => _.id),
                    onlyPrime: this.state.isOnlyMine,
                    order: this.state.orderBy,
                    page: {
                        page: data.page,
                        size: data.pageSize
                    }
                })
            }
            // 获取总数
            if (data.answerCount === undefined) {
                let _answerCount = null
                // 如果已经获取过，直接赋值
                for (let k in tagList.cacheDataList) {
                    const obj = tagList.cacheDataList[k]
                    if (obj[this.state.isOnlyMine].answerCount !== undefined) _answerCount = obj[this.state.isOnlyMine].answerCount
                }
                // 否则请求接口
                if (_answerCount === null) {
                    if (this.state.learnList.length > 0) {
                        _answerCount = await this.props.fetchAnswerCountByCamp({
                            topicIdList: this.state.learnList.map(_ => _.id),
                            onlyPrime: this.state.isOnlyMine
                        })
                    }
                }
                data.answerCount = _answerCount
            }

            const listByChannel = get(_listByChannel, 'data.list') || []
            data.list.push(...listByChannel)
            if (listByChannel.length < data.pageSize) data.isEnd = true
        }

        if (count >= data.list.length && data.isEnd) {
            data.isNoMore = true
        }
        data.page += 1
        tagList.dataList = data

        this.setState({
            tagList: tempTagList
        })
    }

    // 点赞
    async toggleFabulous(answer, index) {
        const {
            tagList,
        } = this.state

        const tempTagList = tagList
        const _answer = { ...answer }

        _answer.liked = answer.liked === 'Y' ? 'N' : 'Y'

        const res = await this.props.campAnswerlikes({
            status: _answer.liked,
            answerId: _answer.id
        })

        if (res.state && res.state.code === 0) {
            if (_answer.liked === 'Y') {
                _answer.upvoteCount += 1
            } else {
                _answer.upvoteCount -= 1
            }

            tempTagList.dataList.list[index] = { ..._answer }

            this.setState({
                tagList: tempTagList
            })
        }
    }

    handleShowComment(id) {
        this.setState({
            isOpenInputText: 'show'
        }, () => {
            this.refs['comment-input'].focus();
            this.data.currentCommentAnswerId = id;
            setTimeout(() => {
                this.refs['comment-input'].scrollIntoView();
            }, 300);
        });
    }

    // 隐藏发言框
    hideComment() {
        this.setState({
            isOpenInputText: '',
            commentInputVal: ''
        })
    }

    // 发言
    commentInputChangeHandle(e) {
        this.setState({
            commentInputVal: e.target.value
        })
    }

    // 仅看我的
    toggleOnlyMine() {
        const {
            isOnlyMine,
            orderBy,
            tagList,
        } = this.state

        if (this.toggleing) return
        this.toggleing = true

        const tag = tagList
        tag.cacheDataList[orderBy][isOnlyMine] = { ...tag.dataList, page: 1, isNoMore: false }

        const _isOnlyMine = isOnlyMine === 'Y' ? 'N' : 'Y'

        tag.dataList = { ...tag.cacheDataList[orderBy][_isOnlyMine] }

        this.setState({
            isOnlyMine: _isOnlyMine,
            tagList: tag
        }, async () => {
            await this.loadMore()
            this.toggleing = false
        })
    }

    // 排序切换
    toggleOrderBy() {
        const {
            isOnlyMine,
            orderBy,
            tagList,
        } = this.state

        if (this.toggleing) return
        this.toggleing = true

        const tag = tagList
        tag.cacheDataList[orderBy][isOnlyMine] = { ...tag.dataList, page: 1, isNoMore: false }

        const _orderBy = orderBy === 'ASC' ? 'DESC' : 'ASC'

        tag.dataList = { ...tag.cacheDataList[_orderBy][isOnlyMine] }

        this.setState({
            orderBy: _orderBy,
            tagList: tag
        }, async () => {
            await this.loadMore()
            this.toggleing = false
        })
    }

    showJobListDialog(jobList) {
        this.setState({
            showJobListDialog: true,
            jobList
        })
    }

    onViewJob () {
        locationTo(`/wechat/page/training-homework?channelId=${this.channelId}`)
    }

    closeJobListDialog() {
        this.setState({
            showJobListDialog: false
        })
    }

    async sendCommentHandle() {
        if (!this.state.commentInputVal) {
            window.toast('请输入内容');
            return false;
        }
        console.log(22222, this.data.currentCommentAnswerId, this.state.commentInputVal)
        // let result = await this.props.putComment({
        //     answerId: this.data.currentCommentAnswerId,
        //     content: this.state.commentInputVal
        // })
        this.hideComment();
    }

    isLock = false

    async loadMore(next) {
        const {
            tagList
        } = this.state
        console.log('loadMore::---->', this.isLock)
        if (!this.isLock) {
            this.isLock = true
            await this.fetchDataList(tagList)
            this.isLock = false
        }

        next && next()
    }

    // 话题Map
    handleFetchTopicMap(day) {
        this.setState({
            learnList: []
        }, () => {
            this.changeLearnList(day)
        })
    }

    goClassService () {
        this.props.router.push(`/wechat/page/training/class-service?channelId=${this.channelId}`)
    }

    goMyHomeWork () {
        this.props.router.push(`/wechat/page/training-homework?channelId=${this.channelId}`)
    }

    // 关闭奖励
    toggleRewordDialog() {
        this.setState({
            isShowReword: !this.state.isShowReword
        })
    }

    // 关闭海报
    closeShareCardDialog () {
        const state = {
            isShowShareCard: false,
            isClock: false
        }

        this.setState(state)
    }

    // 关闭获得
    closeHaveRewardDialog () {
        this.setState({
            haveReward: ''
        })
    }

    // 打卡接口
    async handleAffair() {
        if (this.state.affairStatus === 'C') return

        let res = await fetchCampAffair({
            channelId: this.channelId,
            topicIdList: this.state.learnList.map(_ => _.id)
        })
        if (res.state.code == 0) {
            window.toast('打卡成功')
            await this.props.fetchAchievementCardInfo({
                channelId: this.channelId
            })

            const state = {
                affairStatus: 'C',
                isShowShareCard: true,
                isClock: true
            }

            if (this.rewardType === 'prize') {
                // 达成打卡有奖条件， 获取是否领取奖励成功
                const { affairNum } = this.props.userAffairInfo
                let haveReward = this.props.userReword.find(item => item.affairNum == affairNum)
                
                if (haveReward) {
                    let res = await this.props.isBindLiveCoupon({
                        couponId: haveReward.businessId
                    })
                    // 判断用户是否自动领过  isBinded = N 未领取不弹
                    if (get(res, 'data.isBinded') == 'Y') {
                        state.haveReward = haveReward
                    }
                }
            }

            this.setState(state)
            // locationTo(`/wechat/page/training-checkin?channelId=${this.channelId}&showReword=Y`)
        } else {
            window.toast('打卡异常，请稍候尝试')
        }
    }

    disableAffair() {
        this.state.affairToast && window.toast(this.state.affairToast) || window.toast('按时完成任务后才能打卡')
		// 在打卡有效期
		// if(this.props.sysTime <= this.props.periodInfo.endTime ) {
		// 	window.toast('学完课程并且提交了作业，才能打卡哦')
		// }
		// // 不在打卡有效期
		// else {
		// 	window.toast('很遗憾，已经错过了打卡时间～')
		// }
    }

    handleShare () {
        let periodChannel = get(this.props.training, 'periodChannel') || { periodPo: {} }
        let { periodPo } = periodChannel
		let { name, headImage, channelName } = periodPo
		let wxqltitle = `${name} | ${channelName}`;
		let shareUrl = window.location.origin + '/wechat/page/training-card' + `?channelId=${this.channelId}&periodId=${periodPo.id}&ref=${getCookie('userId')}`;

		share({
			title: wxqltitle,
			timelineTitle: wxqltitle,
			// desc: '',
			timelineDesc: wxqltitle, // 分享到朋友圈单独定制
			imgUrl: headImage,
            shareUrl,
            successFn: () => {
                if(window._qla){
                    setTimeout(function(){
                        typeof _qla != 'undefined' && _qla('event', {
                            category: 'wechat-share',
                            action: 'success',
                        });
                    }, 300);
                }
                window.toast('打卡成功')
                this.setState({
                    isShowShareGuide: false
                })
                if (!this.data.isShare) {
                    this.data.isShare = true;
                    this.handleAffair()
                }
            }
        });
        this.setState({
            isShowShareGuide: true
        }, () => {
            setTimeout(() => {
                if (!this.data.isShare) {
                    this.data.isShare = true;
                    this.handleAffair()
                }
            },2000)
        })
    }

    // 	奖励类型 prize=奖励 refund=打卡返
    get rewardType () {
        return this.props.periodInfo.rewardType
    }

    get nextReward () {
        const {userReword = [], userAffairInfo} = this.props
        const affairNum = userAffairInfo.affairNum // 当前打卡数

        let nextRewardCount = 0
        
        for (let i = 0; i < userReword.length; i++) {
            if (affairNum < userReword[i].affairNum) {
                nextRewardCount = userReword[i].affairNum - affairNum
                break
            }
        }
        
        return nextRewardCount
    }

    // 去完善介绍页
    handleGoToIntro() {
    	locationTo('/wechat/page/training-student-info?channelId=' + this.channelId)
	}

    // 打卡按钮
    renderBtn() {
        let status = this.state.affairStatus
        if (!status) return null
        let statusDom = null
        const {userAffairInfo} = this.props
        switch (status) {
            case 'N': // 禁止打卡
                statusDom = <div className="btn checkin-btn disable on-log on-visible"
                    data-log-region="clock_in"
                    data-log-pos="unable"
                    onClick={this.disableAffair}>点我去打卡</div>
                break;
            case 'Y': // 允许打卡
                if (this.rewardType === 'refund') { // 打卡返
                    statusDom = <div className="btn checkin-btn on-log on-visible"
                        data-log-region="clock_in"
                        data-log-pos="able"
                        onClick={this.handleShare}>点我去打卡</div>
                } else {
                    statusDom = <div className="btn checkin-btn on-log on-visible"
                        data-log-region="clock_in"
                        data-log-pos="able"
                        onClick={this.handleAffair}>点我去打卡</div>
                }
                break;
            case 'C': // 完成
                statusDom = <div className="btn checkin-btn achive-btn on-log on-visible"
                    data-log-region="clock_in"
                    data-log-pos="complete"
                    onClick={() => this.setState({isShowShareCard: true})}>今天已打卡</div>
                break;
            case 'S': // 补卡
                if (this.rewardType === 'refund') { // 打卡返
                    statusDom = <div className="btn checkin-btn on-log on-visible"
                        data-log-region="clock_in"
                        data-log-pos="repair"
                        onClick={this.handleShare}>点我去补卡</div>
                } else {
                    statusDom = <div className="btn checkin-btn on-log on-visible"
                        data-log-region="clock_in"
                        data-log-pos="repair"
                        onClick={this.handleAffair}>点我去补卡</div>
                }
                break;
        }
        return (
            <div className="clock-block">
                {
                    statusDom &&
                    <CollectVisible>
                        {statusDom}
                    </CollectVisible>
                }
                {
                    this.rewardType === 'refund' ? (
                        this.props.sysTime > this.props.periodInfo.endTime ?
                            (userAffairInfo.affairNum - userAffairInfo.supplementNum >= this.props.periodInfo.refundAffairNum ? <p className="tips"><sapn className="rule-btn" onClick={() => locationTo(this.props.periodInfo.refundUrl)}>申请学费退款</sapn></p> : null)
                            :
                            <p className="tips">
                                {
                                    userAffairInfo.affairNum == 0 ? 
                                    `累计打卡${this.props.periodInfo.refundAffairNum}天学费全返 `
                                    :
                                    userAffairInfo.affairNum - userAffairInfo.supplementNum >= this.props.periodInfo.refundAffairNum ?
                                    `已累计打卡${userAffairInfo.affairNum - userAffairInfo.supplementNum}天，可待结营后申请学费全返 `
                                    :
                                    `已打卡${userAffairInfo.affairNum - userAffairInfo.supplementNum}天，再坚持${this.props.periodInfo.refundAffairNum - userAffairInfo.affairNum - userAffairInfo.supplementNum}天就能学费全返 `
                                }
                                <sapn className="rule-btn" onClick={() => { this.setState({isShowCashBackTips: true}) }}>规则说明</sapn>
                            </p>
                    ) : this.props.userReword.length > 0 ? (
                        <p className="tips">
                            {
                                userAffairInfo.affairNum == 0 ?
                                <React.Fragment>
                                    {`坚持${this.nextReward}天就能领奖励 `}
                                    <sapn className="rule-btn" onClick={() => { this.setState({isShowRewardListDialog: true}) }}>打卡有奖</sapn>
                                </React.Fragment>
                                :
                                this.nextReward > 0 ? 
                                <React.Fragment>
                                    {`已打卡${userAffairInfo.affairNum}天，再坚持${this.nextReward}天就能领奖励 `}
                                    <sapn className="rule-btn" onClick={() => { this.setState({isShowRewardListDialog: true}) }}>打卡有奖</sapn>
                                </React.Fragment>
                                : null
                            }
                        </p>
                    ) : null
                }
            </div>
        )
    }

    // 打开奖励的弹框
    async handleFetchReword(data) {
        let res = await liveCouponDetail({
            couponId: data.businessId
        })
        if (res.state.code == 0) {
            this.setState({
                rewordInfo: { ...res.data.CouponInfoDto, day: data.affairNum }
            }, () => {
                this.toggleRewordDialog()
            })
        } else {
            window.toast(res.state.msg)
        }
    }

    /**
     * 渲染打卡按钮
     */
    renderTypeName() {
        let name = '优惠券'
        switch (this.state.rewordInfo.businessType) {
            case 'live':
                name = '直播间通用券'
                break;
            case 'topic':
                name = '话题优惠券'
                break;
            case 'channel':
                name = '系列课优惠券'
                break;
            case 'global_vip':
                name = '通用vip券'
                break;
            case 'custom_vip':
                name = '定制vip券'
                break;
        }
        return name
    }

    changeCalendarToggle() {
        this.setState({
            calendarToggle: !this.state.calendarToggle
        })
    }

    onSwiped(index) {
        this.setState({
            currentIndicator: index
        })
    }

    // 绘制文案
    renderTask() {
        let { isOpenType, learnList, periodChannel, affairEndTime } = this.state
        let { periodPo } = periodChannel
        let taskName = ''
        if (isOpenType == 'Y') {
            taskName = '当前任务'
        } else if (isOpenType == 'N') {
            taskName = '已结营'
        } else {
            taskName = '待开营'
        }

        return (
            <React.Fragment>
                <div className="task-type">{taskName}</div>
                {
                    isOpenType == 'Y' ?
                        <div className="task-list">
                            {
                                learnList.length > 0 ?
                                    affairEndTime &&
                                    <div className="">最晚完成：{formatDate(affairEndTime, 'MM-dd hh:mm')}</div>
                                    :
                                    <div className="task-none">
                                        今天没有学习任务哦
                                        <div className="task-mt-10">会休息的人才会工作——列宁</div>
                                    </div>
                            }
                        </div>
                        :
                        isOpenType == 'N' ?
                            <div className="task-red">
                                训练营已结束
                                <div className="task-mt-10">课程内容可以重复学习哦~</div>
                            </div>
                            :
                            <div className="task-unstart">
                                开营时间: {formatDate(periodPo.startTime, 'yyyy-MM-dd hh:mm')}
                                {/*<div className="task-mt-10">请在开营前加入班群和同学一起学，班主任全程督学</div>*/}
                                <div className="task-mt-10">请务必在开营前加入班群，否则影响上课，<a className="red" onClick={this.handleGoToIntro}>点击这里加入</a></div>
                            </div>
                }
            </React.Fragment>
        )
    }

    /************************* 视频地址转换 *****************************/
    // 待加载视频列表
    lazyVideos = [];

    getChildContext() {
        return {
            lazyVideo: {
                push: this.pushVideoToLazyVideos,
                remove: this.removeVideoToLazyVideos,
            }
        }
    }

    pushVideoToLazyVideos(item) {
        if (!this.refs.detailsScroll) {
            this.lazyVideos.push(item);
            return;
        }

        if (!this.isVideoFetch(findDOMNode(this.refs.detailsScroll), item)) {
            this.lazyVideos.push(item);
        }
    }

    removeVideoToLazyVideos(id) {
        this.lazyVideos = this.lazyVideos.filter(item => item.id != id);
    }

    @throttle(300)
    initLazyVideoLinstener() {
        if (!this.refs.detailsScroll) {
            return;
        }
        const target = findDOMNode(this.refs.detailsScroll)
        const st = target.scrollTop;
        const height = target.clientHeight;

        this.lazyVideos.forEach(item => {
            const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;
            if (pos < height + st) {
                item.init()
            }
        });
    }

    isVideoFetch(target, item) {
        const st = target.scrollTop;
        const height = target.clientHeight;
        const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;

        if (pos < height + st) {
            item.init()
            return true;
        } else {
            return false;
        }
    }


    // 打开证书弹框
    openFinishCard() {
        if(this.state.nickName){
			locationTo(`/wechat/page/certificate?channelId=${this.channelId}`)
		} else {
            this.cardNameSettingDialog.show();
        }
    }

    changeName (e) {
		const value = e.target.value;
		if(value.length>=10){
			window.toast('昵称不能大于10个字');
			return false;
		}
		this.setState({
			nameStr: value,
		});
    }

    async cardNameSetting (type) {
		this.cardNameSettingDialog.hide();
		if(type === 'confirm'){
			if(this.state.nameStr){
				await setCertificateName({
					channelId: this.channelId,
					name: this.state.nameStr,
				});
			}
			
			locationTo(`/wechat/page/certificate?channelId=${this.channelId}`)
		}
	}
    /************************* 视频地址转换 *****************************/

    scrollToDo() {
        this.initLazyVideoLinstener()
    }

    async initEnterCard() {
    	// 判断有没有展示过
		let curChannelIds = window.localStorage.getItem('trainingEnterCardIds') || ''
		let hasBeenShow = curChannelIds.indexOf(this.channelId) >= 0

		let res = await getSchoolCardData({
			periodId: this.props.periodInfo.id
		})
		let qrCode = await getSchoolCardQrCode({
			liveId: this.liveId,
			channel: 'campSchoolCard',
			showQl: 'N',
			pubBusinessId: this.campId,
			isCenter: isFromLiveCenter() ? 'Y' : 'N',
			toUserId: getCookie('userId')
		})

		if(res && qrCode) {
			let enterCardUrl = await drawEnterCard({
				background: 'https://img.qlchat.com/qlLive/liveCommon/training-learn/enter-card-bg.png',
				backgroundShort: 'https://img.qlchat.com/qlLive/liveCommon/training-learn/enter-card-bg-short.png',
				nickName: res.userName || '',
				campName: res.campName || '',
				campStartTime: res.startTime || '',
				liveName: res.liveName || res.periodName || '',
				courseList: res.courseNameList || [],
				qrCode: qrCode.qrUrl,
			})
			this.setState({
                enterCardUrl: enterCardUrl,
                enterCardAppId: qrCode.appId,
				isShowEnterCard: !hasBeenShow
			})
		}
	}

	closeEnterCard() {
    	this.setState({
			isShowEnterCard: false
		}, () => {
			let curChannelIds = window.localStorage.getItem('trainingEnterCardIds') || ''
			if(curChannelIds.indexOf(this.channelId) > -1) {
				return
			}
			if(!curChannelIds) {
				window.localStorage.setItem('trainingEnterCardIds', this.channelId)
			} else {
				let arr = curChannelIds.split(',')
				arr.push(this.channelId)
				window.localStorage.setItem('trainingEnterCardIds', arr.join())
			}
		})
	}

	// 判断是否有来自url上的做完作业要立即打卡的参数
	judgeCardAfterExercise() {
		if(this.urlAfterExerciseShow === 'card') {
			setTimeout(() => {
				this.setState({isShowShareCard: true})
			}, 1000)
		} else if(this.urlAfterExerciseShow === 'guide') {
			this.setState({isShowShareGuide: true})
		}
	}

    render() {
        let {
            title,
            tagList,
            isOnlyMine,
            learnList,
            orderBy,
            showJobListDialog,
            jobList,
            affairEndTime,
            periodChannel,
            followDialogOption,
            hasCourse,
            hasAffair,
            hasSupplement,
            rewordInfo,
            calendarToggle,
            haveReward,
            isOpenType,
            permission,
            campConfig={},
            campObj
        } = this.state
        let { periodPo } = periodChannel
        let data = tagList.dataList
        let { userReword, userAffairInfo } = this.props.training
        const list = data.list.slice(0, data.page * data.pageSize)

        return (
            <Page title={title} className='training-learn-wrap'>
                <ScrollToLoad
                    id="scrolling-box"
                    ref="detailsScroll"
                    className={calendarToggle ? 'over-hidden' : ''}
                    loadNext={this.loadMore}
                    disable={!data || data.isDisable}
                    noMore={data && data.isNoMore}
                    notShowLoaded={list.length === 0 && data.isEnd}
                    scrollToDo={this.scrollToDo}
                >

                    <div className="training-calendar-box">
                        <Calendar
                            fetchTopicMap={this.handleFetchTopicMap}
                            sysTime={this.urlDate || this.props.sysTime}
                            hasCourse={hasCourse}
                            hasAffair={hasAffair}
                            hasSupplement={hasSupplement}
                            userReword={userReword}
                            userAffairInfo={userAffairInfo}
                            fetchRewordDetail={this.handleFetchReword}
                            periodPo={periodPo}
                            calendarToggle={this.changeCalendarToggle}
                        />
                    </div>

                    <div className="learn-tab">
                        <div className="learn-tab-item on-log" data-log-region="join_group" onClick={this.goClassService}>
                            <div className="icon">
                                <img src={require('./img/icon_join.png')}></img>
                            </div>
                            <div className="title">加入班群</div>
                        </div>
                        <div className="learn-tab-item on-log" data-log-region="homework_alarm" onClick={this.goMyHomeWork}>
                            <div className="icon">
                                <img src={require('./img/icon_homework.png')}></img>
                            </div>
                            <div className="title">我的作业</div>
                        </div>
                        <div className="learn-tab-item on-log" data-log-region="learn_record" onClick={() => locationTo(`/wechat/page/learn-record?channelId=${this.channelId}`)}>
                            <div className="icon">
                                <img src={require('./img/icon_record.png')}></img>
                            </div>
                            <div className="title">学习记录</div>
                        </div>
                        <div className="learn-tab-item on-log" data-log-region="training_class" onClick={() => locationTo(`/wechat/page/training-class?channelId=${this.channelId}`)}>
                            <div className="icon">
                                <img src={require('./img/icon_course.png')}></img>
                            </div>
                            <div className="title">全部课程</div>
                        </div>
                    </div>

                    <div className={`learn-task ${learnList.length == 0 && 'pb40'}`}>
                        <div className="learn-left">
                            {
                                this.renderTask()
                            }
                        </div>
                        <div className="learn-right">
                        </div>
                    </div>

                    <div className="learn-ul">
                        {
                            learnList.length > 0 &&
                            <Swiper className="book-swiper" {...this.sliderParams}>
                                {
                                    learnList.map((item, index) => {
                                        return (
                                            <LearnMode
                                                index={index}
                                                data={item}
                                                key={`learn-${index}`}
                                                onShowJobDialog={this.showJobListDialog}
                                                onViewJob={this.onViewJob}
                                                sysTime={this.props.sysTime}
                                            />
                                        )
                                    })
                                }
                            </Swiper>
                        }
                    </div>
                    
                    {
                        periodPo.needSignIn == 'Y' && this.renderBtn()
                    }

                    {
                        this.state.isOpenType == 'N' && (
                            <div className="finish-school-btn">
                            {
                                this.state.hasQualification === 'Y' ?
                                <CollectVisible>
                                    <span className="btn on-log on-visible" data-log-region="receive_certificates" onClick={this.openFinishCard}>领取证书啦</span>
                                </CollectVisible>
                                :
                                <span>未完成训练任务，没办法领取证书哦！</span>
                            }
                            </div>
                        )
                    }

                    {/* 训练营未开营时,不展示作业圈子,展示入学通知书 */}
					{
						isOpenType !== 'W' ?
							<div className="homework-wrap">
								<div className="homework-title">作业圈子</div>
								{
									learnList.length > 0 ?
										<React.Fragment>
											<div className="homework-tip">共{data.answerCount}份作业</div>
											<div className="operation-block">
												<p className={`only-mine ${isOnlyMine === 'Y' ? 'select' : ''}`} onClick={this.toggleOnlyMine}>
													只看精华
												</p>
												<p className={`order-by ${orderBy}`} onClick={this.toggleOrderBy}>{orderBy === 'ASC' ? '正序' : '倒序'}</p>
											</div>
											{
												list.length > 0 || !data.isEnd ? (
													<StudentTask
														data={data.list}
														toggleFabulous={this.toggleFabulous}
														showComment={this.handleShowComment}
													/>
												) : <div className="list-empty list-two">暂无内容~</div>
											}

										</React.Fragment>
										:
										<div className="none-homework">
											交作业就有机会收获点评和点赞
											<div className="list-empty list-two">暂无内容~</div>
										</div>
								}
							</div>
							:
							<div className="enter-card-wrap">
								<div className="card-title">入学通知书</div>
								<div className="card-box">
                                    <QRImg 
                                        src={this.state.enterCardUrl}
                                        traceData="enter-card-wrap"
                                        channel="campSchoolCard"
                                        appId={this.state.enterCardAppId}
                                        />
								</div>
								<div className="card-text">
									<p>可以长按保存你的入学通知书</p>
									<p className="red">(开营后，入学通知书将会隐藏，请及时保存)</p>
								</div>
							</div>
					}
                </ScrollToLoad>
                {
                    getUrlParams('source')!='finance'&&
                    <div className="footer">
                        <div className="btn-return-intro" onClick={() => locationTo(`/wechat/page/channel-intro?channelId=${this.channelId}`)}>返回课程介绍页</div>
                    </div>
                }
                
                {/* 评论框 */}
                <div className={`comment-wrapper ${this.state.isOpenInputText}`} onClick={this.hideComment}>
                    <div className="comment-container" onClick={(e) => e.stopPropagation()}>
                        <div className={`comment-box`}>
                            <div className="input-wrap">
                                <input type="text" ref="comment-input" placeholder="输入评论内容"
                                    value={this.state.commentInputVal}
                                    onFocus={this.commentInputFocusHandle}
                                    onChange={this.commentInputChangeHandle} />
                            </div>
                            <div className="send-btn" onClick={this.sendCommentHandle}>发送</div>
                        </div>
                    </div>
                </div>

                {/* 查看作业 */}
                <JobListDialog
                    isShow={showJobListDialog}
                    onClose={this.closeJobListDialog}
                    data={jobList}
                    liveId={this.state.liveId}
                    newInteraction={true}
                />

                {/* 展示优惠券 */}
                <MiddleDialog
                    show={this.state.isShowReword}
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="reword-dialog"
                    onClose={this.toggleRewordDialog}
                >
                    <div className="check-in-reword">
                        <div className="check-in-main">
                            <div className="title">打卡奖励</div>

                            <div className="reword">
                                <div className="reword-top">
                                    <div className="money">
                                        <span className="num">{rewordInfo.money}</span>￥
                                    </div>
                                    <div className="desc">
                                        <div className="desc-name">{this.renderTypeName()}</div>
                                        <div className="desc-tip">{rewordInfo.minMoney == 0 ? '无门槛使用' : `满${rewordInfo.minMoney}使用`}</div>
                                    </div>
                                </div>

                                <div className="reword-bottom">
                                    <div className="reword-label">
                                        <div className="label">使用范围：</div>
                                        <div className="value">{rewordInfo.businessName}</div>
                                    </div>
                                    <div className="flex-label">
                                        {
                                            rewordInfo.codeNum &&
                                            <div className="reword-label">
                                                <div className="label">剩余数量：</div>
                                                <div className="value">{rewordInfo.codeNum - rewordInfo.useNum}</div>
                                            </div>
                                        }
                                        <div className="reword-label">
                                            <div className="label">过期时间：</div>
                                            <div className="value">{rewordInfo.overTime ? formatDate(rewordInfo.overTime) : '永久有效'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="desc-bg"></div>
                            </div>
                            <div className="tip">
                                获得要求：已打卡数量达到<span className="red">{rewordInfo.day}</span>次(达成后奖励后自动发放到你的个人中心)
                            </div>
                        </div>
                        <div className="btn submit-btn" onClick={this.toggleRewordDialog}>
                            我知道了
                        </div>
                    </div>
                </MiddleDialog>

                <Confirm ref={ dom => dom && (this.cardNameSettingDialog = dom) }
					title="请填写姓名"
					buttons = "cancel-confirm"
					className="card-name-dialog"
					onBtnClick = {this.cardNameSetting}
				>
					<div className="set-name-input">
						<input value={this.state.nameStr} placeholder="不填写证书上将显示你的微信昵称" onChange={this.changeName}/>
					</div>
                </Confirm>
                
                {
                    this.state.isShowShareGuide && <div className="share-guide" onClick={() => {this.setState({isShowShareGuide: false})}}></div>
                }
                
				<CashBackRuleDialog 
                    show={this.state.isShowCashBackTips} 
                    refundAffairNum={this.props.periodInfo && this.props.periodInfo.refundAffairNum || 0}
                    onClose={() => {this.setState({isShowCashBackTips: false})}} 
                    />

                <ShareCard
                    affairStatus={this.state.affairStatus}
                    show={this.state.isShowShareCard}
                    liveInfo={this.state.liveInfo}
                    isQlLive={this.state.isQlLive}
                    onClose={this.closeShareCardDialog}
                    isClock={this.state.isClock} // 是否打卡
                    />

                <RewardListDialog 
                    show={this.state.isShowRewardListDialog}
                    onClose={() => {this.setState({isShowRewardListDialog: false})}} 
                    />
                    
                {
                    haveReward && !this.state.isShowShareCard && (
                        <MiddleDialog 
                            show={true}
                            theme='empty'
                            bghide
                            titleTheme={'white'}
                            className="have-reward-dialog"
                            onClose={this.closeHaveRewardDialog}>
                                <div className="reward-title">
                                    <img src={require('./img/btn.png')}></img>
                                    太棒了
                                </div>
                                <main className="reward-content">
                                    你已经坚持打卡了<span className="red">{this.props.userAffairInfo.affairNum}</span>次，
                                    奖励：<span className="red">【{this.renderTypeNameByBtn(haveReward.couponType)} ￥{formatMoney(haveReward.money, 1)}】</span> 已经发放到你的个人中心
                                </main>
                                <div className="btn bottom" onClick={this.closeHaveRewardDialog}>我知道了</div>
                        </MiddleDialog>
                    )
                }

				{/* 入学通知书 */}
				<MiddleDialog
					show={this.state.isShowEnterCard}
					theme='empty'
					bghide
					className="enter-card-dialog"
					onClose={this.closeEnterCard}
				>
					<div className="enter-card">
						<img src={this.state.enterCardUrl}/>
						<p className="more-top">这是一张值得收藏的入学通知书</p>
						<p>请长按保存或发送给朋友</p>
					</div>
				</MiddleDialog>
                {/* 奖学金入口 */}
                {
                    permission?.distributePermission=='Y'&&campConfig?.distributionStatus=='Y'&&(
                        campConfig?.entranceStatus=='Y'?
                        <RightBottomIcon className="cl-teacher-dialog" initClick={()=>{locationTo(`/wechat/page/experience-camp-activity?campId=${this.experienceId}`)}}>
                            <div className="cl-td-icon on-visible on-log" 
                                data-log-name="奖学金活动"
                                data-log-region="training-learn-camp-activity"
                                data-log-pos={0}>
                                <img src="https://img.qlchat.com/qlLive/business/JR87T9K9-U9XZ-B695-1574163331907-WCSW4UXHYURP.png" /> 
                            </div>
                        </RightBottomIcon>
                        :
                        <RightBottomIcon className="cl-teacher-dialog" initClick={()=>{locationTo(fillParams({type:this.campType=='ufw_camp'?'intention':'financial'}, `/wechat/page/experience-camp-scholarship`))}}>
                            <div className="cl-td-icon on-visible on-log" 
                                data-log-name="我的奖学金"
                                data-log-region="training-learn-camp-scholarship"
                                data-log-pos={0}>
                                <img src="https://img.qlchat.com/qlLive/business/RLFAVMGK-7O7A-HIU1-1574158926659-5VDSUF2XMJJ8.png" /> 
                            </div>
                        </RightBottomIcon>
                    )
                }
                {/* 理财邀请有礼活动 */} 
                {
                    campObj?.shareType=='INVITE_EVENT'&&campObj?.inviteEventCode&&
                    <CampGiftEntry region="experience-camp-train-gift-entry"  className="experience-camp-train-entry" nodeCode={campObj.inviteEventCode} campId={this.experienceId}/>
                }
            </Page> 
        )
    }
}
TrainingLearn.childContextTypes = {
    lazyVideo: PropTypes.object
};

const mapStateToProps = function (state) {

    return {
        training: get(state, 'training') || {},
        sysTime: get(state, 'common.sysTime'),
        periodInfo: get(state, 'training.periodChannel.periodPo') || {},
        userReword: get(state, 'training.userReword') || [],
        userAffairInfo: get(state, 'training.userAffairInfo') || {},
    }
};

const mapActionToProps = {
    fetchCampAnswerByTopicList,
    campAnswerlikes,
    getQr,
    fetchAnswerCountByCamp,
    getUserQualification,
    userBindKaiFang,
    fetchAchievementCardInfo,
    isBindLiveCoupon,
    getIsQlLive
};

module.exports = connect(mapStateToProps, mapActionToProps)(TrainingLearn);