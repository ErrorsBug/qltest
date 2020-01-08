import { getVal, timeAfterMixWeek, getUserInfo,formatDate } from '../../comp/util';
import paymentDetailsHelper from '../payment-details/components/payment-details-helper/help-handle';
import * as regeneratorRuntime from '../../comp/runtime';

import { ChannelService } from '../../service/channel.service';
import { BonusesService } from '../../service/bonuses.service';
import {decode} from '../../comp/querystring';

import request from '../../comp/request';
import { api } from '../../config';
import { parse } from '../../comp/we-rich/we-rich';

const app = getApp();

Page({

    data: {
        activeTab: 'intro',

        topicId: '',
        channelId: '',
        liveId: '',

        scrollTop: '',
        
        lshareKeyOfThire: '', // 链接上带进来的别人的lsharekey
        lshareKeyOfMine: '', // 请求自己的分销关系自己的lsharekey
        shareKey: '',

        /* 课程列表 */
        course: {
            list: [],
            page: 1,
            size: 10,
            noMore: false,
            noneOne: false,
            loading: false,
        },

        /* 状态栏中的更新显示 */
        showDiscount: false,
        showRebate: false,
        showUpdateStatus: false,
        updateStatusText:'',

        /* 返现时间 */
        rebateDate: '',

        /* tab */
        tabItems: [
            {
                key: 'intro',
                name: '详情',
                active: true
            },
            {
                key: 'topic',
                name: '课程',
            }
        ],

        /* tabbar是否固定在顶部 */
        canFixedBar: false,

        // 权限
        power: {},

        // 系列课信息
        channelInfo: {},

        // 付费类型列表
        chargeConfigs: [],

        // 付款信息
        chargePos: null,

        // 付款用户数
        userCount: 0,

        // 付款用户头像
        userList: [],

        // 滚动高度
        scrollHeight: 0,

        /* 系列课优惠信息 */
        getMarket: null,

        /* 展示底部按钮 */
        showBtns: false,
        btnStatus: {
            showCoursePlay: false,
            showCheckInFree: false,
            showPurchase: false,
            showBeginGroup: false,
            showJoinGroup: false,
            showViewGroup: false,
            showEnterCourse: false,
        },
        bonusesVisible: false,

        /* 拼课相关 */
        discountGroup: false,
        ownChannel: false,
        freeChannel: false,
        queryGroupId: null,
        queryGroupInfo: null,
        selfGroupInfo: null,
        groupList: null,

        /* 服务器事件 */
        currentServerTime: null,

        /* 分销入口相关 */
        shareModel: false,
        isDistribution: false,
        shareCard: false,
        /* 分享弹窗动画 */
        shareModalAnimation: {},
        userName: '',
        codeUrl: '',
        shareLink: '',
        /**分销比例 */
        shareRatio: '',
        /**是否为指定直播间 */
        special: false,
        /**用户头像 */
        headImage: '',
        /**分享来源 */
        fromButton: true,
        /**回滚机制开关 */
        switch: '',
        // 显示“已经购买”的提示dialog
        showAlreadyBuyDialog: false,
        // 已经购买过的相同系列课的channelId
        alreadyBuyChannelId: '',
        // 显示是否有现金券可以用的弹框
        showCashCouponDialog: false,

        // 拆红包相关
        // 用户是否已发起过红包团，Y-已发起，N-未发起
        isCreateGroup: 'N',
        // 课程是否参与活动，Y-是，N-否
        isActCourse: 'N',
        // 当前课程活动配置id
        confId: '',
        // 领到的券信息
        redpackCouponId: 0,
        redpackCouponMoney: 0,
        system: app.globalData.system,
        // 是否富文本
        notSummary: true,
        summary:{},
    },

    // 渠道,支付用
    _ch: '',

    async onLoad(options) {
        try {
            await app.login()
            //解析小程序码
            if(options.scene){
                options = await global.commonService.analysisCode(options)
            }
            global.loggerService.pv()
            this._ch = options.ch || options.wcl;
            this.query = options;
            console.log("global.system:");
            console.log(app.globalData.system);

            let {
                channelId,
                topicId = '',
                groupId = '',
                lshareKey = '',
                shareKey = '',
                activityCode = '',
            } = options

            /* 要判断字符串null是因为真的有时会有字符串null过来 (￣▽￣)" */
            let queryGroupId = groupId === 'null' ? null : groupId
            lshareKey = lshareKey === 'null' ? null : lshareKey

            /**判断是否是特定直播间（展示特殊画卡） */
            if(channelId === '2000000734172562')
            {
                this.setData({special: true})
            }

            this.setData({ channelId, topicId, queryGroupId, lshareKeyOfThire: lshareKey, shareKey})
        
            /* 微信统计 */
            global.commonService.wxReport('view_intro', {
                lesson_type: '系列课',
                lesson_id: channelId,
            })

            /** 
             * 初始化服务方法，不涉及到页面状态改变的接口请求等方法抽出到了单独的
             * 一个js中，并没有放到service文件夹下是考虑到这些方法复用性可能会比
             * 较低
             *  */
            this.channelService = new ChannelService()

            /* 系列课基础信息 */
            await this.initChannelInfo()

            paymentDetailsHelper.bind(this);
            
            /* 更新页面title */
            const { name } = this.data.channelInfo
            wx.setNavigationBarTitle({ title: name })

            /* 确定初始显示哪个tab */
            this.firstTab()

            /* 计算底部内容高度 */
            this.calcContentTop();

            /* 拼课信息 */
            await this.initGroupInfo()

            /* 初始化按钮 */
            this.initBtns()

            /* 初始化课程更新状态信息 */
            this.initGoldBarStatus()

            /* 分销信息 */
            this.initShareInfo()

            /* 有活动券就自动绑定活动券 */
            if (activityCode) {
                global.commonService.bindActivityCode('channel', channelId, activityCode)
            }
            
            /* 判断是否分销 */
            this.isShare()

            // 检查是否已经购买过相同的课程
            this.checkDuplicateBuyStatus();

            this.getSummary();

            // this.openCashCouponDialog();
        } catch (error) {
            console.error('系列课初始化失败：', error)
        }
    },

    // 拆红包的信息初始化
    async initBonusInfo() {
        try {
            let bonusesService = new BonusesService();
            let result = await bonusesService.getStateInfo(this.data.channelId, 'channel');
            let confId = getVal(result, 'confId');

            this.setData({
                isCreateGroup: getVal(result, 'isCreateGroup'),
                isActCourse: getVal(result, 'isActCourse'),
                confId,
            });

            this.getCouponInfo(confId);
        } catch (error) {
            console.error(error);
        }
    },

    async getCouponInfo(confId) {
        try {
            let bonusesService = new BonusesService();
            const result = await bonusesService.getMaxCouponInfo(confId);

            if (result.couponId) {
                this.setData({
                    redpackCouponId: result.couponId,
                    redpackCouponMoney: result.couponMoney,
                });
                
                this.openCashCouponDialog()
            }
        } catch (error) {
            console.error(error);
        }
    },

    // 开启现金券可以用的弹框
    openCashCouponDialog() {
        this.setData({
            showCashCouponDialog: true
        })
    },

    // 关闭现金券可以用的弹框
    closeCashCouponDialog() {
        this.setData({
            showCashCouponDialog: false
        })
    },

    // 使用优惠券
    useCoupon() {
        wx.redirectTo({
            url: `/pages/payment-details/payment-details?channelId=${this.data.channelId}&type=channel&couponId=${this.data.redpackCouponId}`
        });
    },

    // 检查是否已经购买过相同的课程
    checkDuplicateBuyStatus(){
        request({
            url: api.checkDuplicateBuy,
            method: 'POST',
            data: {
                channelId: this.data.channelId
            }
        }).then((response) => {
            if (response.data.state.code === 0) {
                this.setData({
                    alreadyBuyChannelId: response.data.data.alreadyBuyChannelId
                });
            }
        });
    },

    /**判断是否分销 */
    async isShare(){
        let params = {
            liveId: this.data.liveId,
            businessId: this.data.channelId,
            userId: (wx.getStorageSync('userId')).value,
            type: 'channel',
        };
        const result = await this.channelService.isShare(params);
        /**增加开关 */
        this.setData({switch: result.switch ? result.switch : 'Y' });
        if(result.isShare === 'N'){
            this.setData({isDistribution: false})
        }
        if(result.isShare === 'Y'){
            this.setData({
                isDistribution: true,
                shareRatio: result.shareRatio,
            })
            if(result.shareType === 'live'){
                this.setData({
                    shareLink: 'lshareKey=' + result.shareKey,
                    lshareKeyOfMine: result.shareKey,
                })
            }else {
                this.setData({
                    shareLink: 'shareKey=' + result.shareKey,
                    shareKey: result.shareKey
                })
            }
        }
    },

    navToShareCard() {
        wx.redirectTo({
            url: `/pages/share-card/share-card?businessId=${this.data.channelId}&businessType=channel&liveId=${this.data.liveId}`
        });
    },

    /* 显示分享弹窗 */
    showMessageModal(e) {
        let { shareModalAnimation } = this.data
        this.setData({shareModel:true})
        shareModalAnimation = wx.createAnimation({
            duration: 800,
            timingFunction: 'ease',
        }).translateY(0).step().export()
        this.setData({ shareModalAnimation })
    },

    /* 隐藏分享弹窗 */
    hideMessageModal() {
        let { shareModalAnimation } = this.data
        this.setData({ shareModel: false })
        shareModalAnimation = wx.createAnimation({
            duration: 800,
            timingFunction: 'ease',
        }).translateY('110%').step().export()
        this.setData({ shareModalAnimation })
    },
    /**获取小程序带参二维码 */
    async onShowShareCard(){
        let that = this;
        await getUserInfo().then((userInfoRes) => {
            this.setData({headImage: userInfoRes.userInfo.avatarUrl})
            that.getCode(userInfoRes.userInfo.nickName);
        })
    },
    async getCode(name){
        let queryString='',querySearch='';
        for ( let i in this.query){
            queryString += i + '=' + this.query[i] + '&'
        }
        queryString = queryString.substring(0,queryString.length-1);
        if(this.data.isDistribution){
            if(queryString){
                querySearch = queryString + '&' + this.data.shareLink
            }else {
                querySearch = this.data.shareLink
            }
        }else{
            querySearch = queryString
        }
        /**增加分享来源 */
        querySearch = querySearch ? querySearch + '&ch=button_card' : 'ch=button_card';
        let paramsObj = {
            params: querySearch,
            position: 'channelId=' + this.data.channelId + '&userId=' + (wx.getStorageSync('userId')).value + '&type=share',
            path: 'pages/channel-index/channel-index',
            userId: (wx.getStorageSync('userId')).value,
        };
        const result = await this.channelService.getShareCode(paramsObj);
        this.setData({
            shareCard: true,
            shareModel: false,
            userName: name,
            codeUrl: result,
        })
    },
    onHideShareCard(){
        this.setData({shareCard: false})
    },
    /* 初始化拼课信息 */
    async initGroupInfo() {
        let {
            channelId, queryGroupId, groupList, selfGroupInfo, queryGroupInfo,
            getMarket, chargeConfigs,chargePos, vipInfo, discountGroup,ownChannel,freeChannel,currentServerTime,
         } = this.data
        
        discountGroup = getMarket.discountStatus === 'P' || getMarket.discountStatus === 'GP'
        
        try {
            /* 获取用户是否有拼课 */
            let res = await this.channelService.fetchLastGroup(channelId)
            selfGroupInfo = res.channelGroupPo
            currentServerTime = res.currentServerTime

            /* 有拼课则获取用户拼课成员信息 */
            if (selfGroupInfo) {
                selfGroupInfo.members = await this.channelService.fetchGroupMembers(selfGroupInfo.id)
            }

            /* 有带来的groupId则获取对应拼课信息 */
            if (queryGroupId) {
                const result = await this.channelService.fetchGroupInfo(queryGroupId)
                queryGroupInfo = result.channelGroupPo
                currentServerTime = result.currentServerTime

                /* 获取成员信息 */
                if (queryGroupInfo) {
                    queryGroupInfo.members = await this.channelService.fetchGroupMembers(queryGroupInfo.id)
                }
            }

            /* 没有带来的groupId且用户没有购买系列课则显示拼课列表 */
            if (!queryGroupId && !selfGroupInfo && !ownChannel) {
                groupList = await this.channelService.fetchGroupList(channelId)
            }
            
            this.setData({ selfGroupInfo, queryGroupInfo, groupList, discountGroup, ownChannel, freeChannel },
                /* 渲染完毕之后需要再执行一次计算内容top的操作，因为拼课区域和拼课列表的插入会改变内容区的top */
                () => { this.calcContentTop()})

        } catch (error) {
            console.error('初始化拼课信息失败：', error)
        }
    },

    initBtns() {
        const {
            channelId, queryGroupId, groupList, selfGroupInfo, queryGroupInfo,
            discountGroup, ownChannel,freeChannel,vipInfo,
        } = this.data

        let showCoursePlay = false
        let showCheckInFree = false
        let showPurchase = false
        let showBeginGroup = false
        let showJoinGroup = false
        let showViewGroup = false
        let showEnterCourse = false

        const checkBtns = () => {

            /** 如果是定制VIP，显示进入课程按钮 */
            if(vipInfo.isCustomVip === 'Y'){
                showEnterCourse = true
                return
            }
            /** 
             * 如果已经购买系列课，则显示听课按钮
             * 
             * 这种已经购买有几种情况：
             *  1. 购买了vip
             *  2. 购买了系列课
             *  3. 拼课团员
             *  4. 付费拼课团长
             *  
             * */
            if (ownChannel) {
                showCoursePlay = true
                return
            }
            /* 如果是免费话题，显示报名按钮就好了 */
            if (freeChannel) {
                showCheckInFree = true
                return                
            } else {
                showPurchase = true
                return   
            }

            
        }

        checkBtns()

        this.setData({
            showBtns: true,
            btnStatus: {
                showCoursePlay,
                showCheckInFree,
                showPurchase,
                showBeginGroup,
                showJoinGroup,
                showViewGroup,
                showEnterCourse,
            },
        })
    },

    /**
     * 初始化状态栏状态显示
     * 
     * 【永久回听】 一直显示
     * 【支持优惠券】 付费系列课显示
     * 【更新状态】 接口有返回最近更新课程或课程列表有课
     * 
     *  更新状态显示文字：
     *  [xxxx更新]: 根据接口返回的课程的开始事件进行计算
     *  [等待更新]: 接口没返回数据，系列课已开课程数小于计划开课数
     *  [更新完结]: 接口没返回数据，系列课已开课程数大于等于计划开课数
     */  
    initGoldBarStatus() {
        let { lastestUpdateCourse,course,channelInfo,freeChannel } = this.data 

        let showDiscount = false
        let showUpdateStatus = false
        let updateStatusText = ''
        let startTime = getVal(lastestUpdateCourse,'topic.startTime')
        let showRebate = channelInfo.isRebate === 'Y'
        let rebateDate = ''

        if (showRebate) {
            rebateDate = formatDate(channelInfo.rebateStartTime, 'yyyy年MM月dd日——') + formatDate(channelInfo.rebateEndTime, 'yyyy年MM月dd日')
        }

        showDiscount = !freeChannel
        if (startTime) {
            updateStatusText = timeAfterMixWeek(startTime) + "更新"
            showUpdateStatus = true
        } else if (course.list.length) {
            showUpdateStatus = true
            updateStatusText = channelInfo.topicCount < channelInfo.planCount ? '等待更新' :'更新完结'
        }

        this.setData({ showDiscount, showUpdateStatus, updateStatusText, showRebate, rebateDate })
    },

    /* 初始化分销信息 */
    async initShareInfo() {
        const { liveId, lshareKeyOfThire } = this.data

        /* 有三方shareKey则做一个绑定 */
        if (lshareKeyOfThire) {
            this.channelService.bindLiveShare(liveId, lshareKeyOfThire)
        }

        /* 获取直播间分销shareKey */
        const result = await this.channelService.fetchLiveShareKey(liveId)
        if(result.state.code === 0 && result.data.shareQualify){
            this.setData({ lshareKeyOfMine: result.data.shareQualify.shareKey })
        }
    },

    /* 页面滚动过程判断滚动高度决定是否固定tabbar */
    onPageScroll(e) {
        if (!this.contentTop) { return }
        const { scrollTop } = e.detail 
        const canFixedBar = scrollTop >= this.contentTop ? true : false
        
        if (canFixedBar !== this.data.canFixedBar) {
            this.setData({ canFixedBar })
        }
    },

    onTabClick(e) {
        let key = e.detail.key;
        this.switchTab(key);
    },

    /* 切换tab */
    switchTab(key) {
        this.setData({
            tabItems: this.data.tabItems.map(item => {
                item.active = key == item.key
                return item;
            }),
            activeTab: key,
            scrollTop: this.contentTop || 0,
        });
    },

    /* 点击听课按钮 */
    onCoursePlay() {
        const { ownChannel, freeChannel } = this.data
        
        if (ownChannel) {
            this.onGoListen()
        } else {
            if (freeChannel) {
                this.onCheckInFree()
                return
            }
            this.onPurchase()
        }
    },

    /* 免费报名，就在当前页进行，不跳转页面 */
    onCheckInFree() {
        const { chargeConfigs, liveId, channelId, createUser } = this.data

        const orderData = {
            toUserId: createUser.userId,
            source: 'wxapp',
            channelId,
            total_fee: 0,
            type: 'CHANNEL',
            chargeConfigId: chargeConfigs[0].id,
            ifboth: 'Y',
            ch: this._ch || '',
        }

        const successFn = async () => {
            await this.initChannelInfo()
            this.initBtns()
            this.onGoListen()
            global.loggerService.event({
                category: 'joinchannel',
                action: 'success',
            })
        }

        this.channelService.checkInFreeChannel(orderData, successFn)
    },
    
    /* 点击购买 */
    onPurchase() {
        // 如果已经购买过相同课程，弹出已经购买的提示信息
        if (this.data.alreadyBuyChannelId) {
            this.setData({
                showAlreadyBuyDialog: true
            });
            return;
        }
        return this.PDH_goToPaymentDetails({
            ...this.query,
            type: 'channel',
        })
    },

    /* 用户点击开团 */
    onBeginGroup() {
        const { channelId, getMarket } = this.data

        try {
            /* 免费开团 */
            if (getMarket.discountStatus === 'P') {
                this.channelService.startFreeGroup(channelId)
                return
            }

            /* 付费开团 */
            if (getMarket.discountStatus === 'GP') {
                const { liveId, shareKey, chargeConfigs } = this.data

                /* 下单数据 */
                const orderData = {
                    type: 'CHANNEL',
                    total_fee: getMarket.discount,
                    source: 'wxapp',
                    liveId: liveId,
                    ifboth: 'Y',
                    shareKey: shareKey || '',
                    chargeConfigId: chargeConfigs[0].id,
                    ch: this._ch || '',
                    payType: 'group_leader',
                }

                this.channelService.startChargeGroup(orderData, channelId)
            }    
        } catch (error) {
            console.error('开团失败: ', error)
        }
    },
    
    /* 用户参团 */
    onJoinGroup(e) {
        try {
            const { channelId, queryGroupId, liveId, shareKey, chargeConfigs,getMarket } = this.data

            const groupId = getVal(e, 'detail.groupId') || queryGroupId
            const orderData = {
                type: 'CHANNEL',
                total_fee: getMarket.discount,
                source: 'wxapp',
                liveId: liveId,
                ifboth: 'Y',
                shareKey: shareKey || '',
                chargeConfigId: chargeConfigs[0].id,
                ch: this._ch || '',
                groupId,
            }
            this.channelService.joinGroup(orderData, channelId, groupId)    
        } catch (error) {
            console.error('参团失败：',error)
        }
    },

    /* 点击查看拼课按钮 */
    onViewGroup() {
        const { selfGroupInfo, channelId } = this.data
        wx.redirectTo({
            url: `/pages/course-group/course-group?groupId=${selfGroupInfo.id}&channelId=${channelId}`
        })
    },

/* 打开红包，参加群分享红包*/
    async joinShare(){
        const { channelId } = this.data
        await this.bonusesService.fetchJoinShare(channelId);
        wx.redirectTo({
            url: `pages/channel-bonuses/channel-bonuses?channel=&channelId=${channelId}`
        });
    },
    
    /** 打开分享模块 */
    onShowShareModel(){
        this.setData({shareModel: true})
    },
    /** 隐藏分享模块 */
    onHideShareModel(){
        this.setData({shareModel: false})
    },
    /* 获取千聊小程序码*/
    async onShareCode(){
        this.setData({shareModel: true})
    },
    /* 初始化系列课信息 */
    async initChannelInfo() {
        try {
            app.showLoading();

            let { channelId, ownChannel, freeChannel} = this.data
            const result = await this.channelService.fetchChannelIndex(channelId)

            const liveId = getVal(result, 'data.channelInfo.channel.liveId')
            const channelInfo = getVal(result,'data.channelInfo.channel')
            const chargeConfigs = getVal(result,'data.channelInfo.chargeConfigs')
            const createUser = getVal(result,'data.channelInfo.createUser')
            const courseList = getVal(result,'data.topicList')
            const chargePos = getVal(result,'data.chargePos')
            const vipInfo = getVal(result,'data.vipInfo')

            ownChannel = chargePos || vipInfo.isVip === 'Y' || vipInfo.isCustomVip === 'Y'
            freeChannel = chargeConfigs[0].amount === 0
            
            /** 
             * 系列课下架检查 
             * 
             * 用户已报名系列课，系列课隐藏了，还是可以正常访问系列课，未报名则提示已下架并返回
             * */
            if (channelInfo.displayStatus !== 'Y' && !chargePos) {
                wx.showModal({
                    content: '该系列课已下架',
                    success: () => {
                        wx.redirectTo({ url: `/pages/live-index/live-index?liveId=${liveId}` })
                    },
                })
            }

            /* 拉黑检查 */
            const blackType = getVal(result, 'data.isBlack.type')
            if (blackType) {
                switch (blackType) {
                    case 'channel':
                    case 'topic':
                        wx.redirectTo({ url: `/pages/live-index/live-index?liveId=${liveId}` })
                        break;
                    case 'live':
                    case 'user':
                        wx.redirectTo({ url: `/pages/index/index` })
                        break;
                }
            }

            this.setData({
                ...result.data,
                liveId, channelInfo, chargeConfigs, createUser, ownChannel, freeChannel
            })

            /* 更新课程列表 */
            this.updateCourseList(courseList);

            // 初始化完毕系列课信息后，初始化优惠信息
            if (!ownChannel) {
                this.initBonusInfo();
            }

        } catch (error) {
            console.error('初始化系列课信息失败', error);
        } finally {
            app.hideLoading();
        }
    },

    /* 页面滚动到底部事件 */
    onscrollToLower() {
        if (this.data.activeTab === 'topic') {
            this.fetchCourseList()
        }
    },


    /* 正在加载课程列表 */
    courseLoading: false,
    async fetchCourseList() {
        if (this.data.course.noMore || this.courseLoading) {
            return
        }  

        this.courseLoading = true        
        this.setData({ 'course.loading': true })

        try {
            const { channelId, liveId, course } = this.data
            const { page, size } = course
            
            const params = { liveId, channelId, page, size }
            const courseList = await this.channelService.fetchCourseList(params)

            this.updateCourseList(courseList)
        } catch (error) {
            console.error('获取课程列表失败：', error)
        } finally {
            this.courseLoading = false        
            this.setData({ 'course.loading': false })
        }
    },

    /* 更新课程列表 */
    updateCourseList(newList = []) {
        let { list, page, size, noMore, noneOne } = this.data.course

        const now = this.data.currentServerTime || Date.now()
        newList = newList.map(item => {
            if (item.status === 'beginning') {
                const deffTimeStamp = item.startTime - now;
                if (deffTimeStamp > 86400000) {
                    item.timeStr = (~~((deffTimeStamp / 86400000))) + '天后'
                } else if (deffTimeStamp > 3600000) {
                    item.timeStr = (~~((deffTimeStamp / 3600000))) + '小时后'
                } else {
                    item.timeStr = (~~((deffTimeStamp / 60000))) + '分钟后'
                }

                return item;
            }
            return item;
        });
        
        list = list.concat(newList)
        noMore = newList.length < size
        noneOne = list.length === 0
        page++

        this.setData({
            course: { list, page, size, noMore, noneOne },
        })
    },

    /* 确定初始显示的tab */
    firstTab() {
        const { topicList, introduce } = this.data
        console.log('introduce', introduce)
        let tab = 'intro'
        if (!Object.keys(introduce).length && topicList.length) {
            tab = 'topic'
        }
        this.switchTab(tab)
    },

    /* 计算下方内容区距离顶部高度，便于之后再滚动事件中判断是否需要固定tabbar在顶部 */
    calcContentTop() {
        try {
            const query = wx.createSelectorQuery()
            query.select('#main-content').boundingClientRect(res => {
                console.log('res',res)
                this.contentTop = res.top
            }).exec()
        } catch (error) {
            console.error('获取内容区高度失败: ',error);
        }
    },

    getPageUrl() {
        return this.__route__ + '?channelId=' + this.data.channelId + '&topicId=' + this.data.topicId;
    },

    /* 点击立即听课按钮跳转到用户最近学习的课程，没有学习记录则跳转到第一节课，没有课程则tab切换到课程列表并提示 */
    async onGoListen() {
        const { course, channelId } = this.data
        
        const lastLearn = await this.channelService.fetchLastLearnCourse(channelId)
        const lastTopic = lastLearn.data.data.topic
        const list = course.list || []
        let topicId

        if(lastTopic){
            topicId = lastTopic.topicId
        } else {
            if (list.length) {
                topicId = list[0].id
            }
        }
        if (topicId) {
            wx.redirectTo({
                url: '/pages/thousand-live/thousand-live?topicId=' + topicId
            })
        } else {
            this.switchTab('topic')
            wx.showToast({ title: '暂无可听课程' })
        }
    },
    
    /* 页面分享 */
    onShareAppMessage(e) {
        // 判断是否是底部分享栏
        if (e.from === 'button'){
            this.setData({fromButton: true})
        }else {
            this.setData({fromButton: false})
        }
        const { channelInfo, channelId, lshareKeyOfMine, shareLink, shareKey, fromButton ,isDistribution} = this.data
        let shareImageUrl = channelInfo.headImage || 'https://img.qlchat.com/qlLive/liveCommon/default-bg-cover-1908080' + (~~(Math.random() * 3 + 1)) + '.png'
        return {
            title: channelInfo.name,
            imageUrl: shareImageUrl,
            desc: `${channelInfo.name}，值得我的推荐和你的关注`,
            path: `/pages/channel-index/channel-index?channelId=${channelId}${lshareKeyOfMine ? '&lshareKey=' + lshareKeyOfMine : ''}${shareKey ? '&shareKey=' + shareKey : ''}${fromButton ? '&ch=button_share' : '&ch=menu'}`,
            success: (res)=>{
                global.loggerService.event({
                    category: 'share',
                    action: 'success',
                });
                //分享成功隐藏分享栏
                this.setData({shareModel: false});
                if(this.data.fromButton){
                    /* 微信统计分享成功 */
                    global.commonService.wxReport('share_people_success', {
                        lesson_type: '系列课',
                        lesson_id: channelId,
                    })
                }
            },
            fail: (res)=>{
                if(this.data.fromButton){
                    /* 微信统计取消分享 */
                    global.commonService.wxReport('share_people_fail', {
                        lesson_type: '系列课',
                        lesson_id: channelId,
                    })
                }
            }
        };
    },

    /* 禁止下拉刷新 */
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
    /* 更新formId */
    updateFormId(e) {
        const { formId } = e.detail
        global.commonService.updateFormId(formId)
        this.setData({ formId })
    },

    // 查看已经购买的课程列表
    viewBoughtList(){
        wx.redirectTo({
            url: '/pages/mine-buy/mine-buy'
        });
    },

    closeAlreadyBuyDialog(){
        this.setData({
            showAlreadyBuyDialog: false
        });
    },

    viewTutorial(){
        wx.redirectTo({
            url: '/pages/web-page/web-page?url=https://mp.weixin.qq.com/s/dFD7VarahfEbm9A8sfo-Aw'
        });
    },
    /* 获取富文本 */
    async getSummary() {
        const result = await request({
            url: '/api/wechat/ueditor/getSummary',
            method: 'POST',
            data: {
                businessId:this.data.channelId,
                type:"channel",
            },
        })
        if (getVal(result, 'data.state.code', 1) == 0) {
            let summary = parse(result.data.data.content);
            this.setData({
                notSummary: false,
                summary,
            })
        } else {
            this.setData({
                notSummary:true
            })
        }
    },

})
