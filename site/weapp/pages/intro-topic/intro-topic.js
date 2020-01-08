const app = getApp();

import log from '../../comp/log';
import { getVal, imgUrlFormat, getUserInfo} from '../../comp/util';
import order from '../../comp/order';
import { api } from '../../config';
import { validator } from '../../comp/validator';
import request from '../../comp/request';
import { parse } from '../../comp/we-rich/we-rich';
import * as regeneratorRuntime from '../../comp/runtime'
import paymentDetailsHelper from '../payment-details/components/payment-details-helper/help-handle'

const config = {
    data: {
        /* 密码输入框的值 */
        input: '',
        /* 显示页面主体 */
        showMain: false,
        /* 背景图 */
        bgUrl: '',

        /* 状态栏显示条件 */
        goldbar:{ },

        /* 滚动距离 */
        scrollTop: 0,

        /* shareKey */
        shareKey: '',
        /* 链接上带进来的别人的lsharekey */
        lshareKeyOfThire: '',
        /* 请求自己的分销关系自己的lsharekey */
        lshareKeyOfMine: '',

        /* 推荐的课程列表 */
        recommendCourse: [],

        /* 留言列表modal的 */
        showMessageModalMask:false,
        /* 留言列表 */
        messageList: [],

        /* 留言列表弹窗动画 */
        messageModalAnimation: {},

        /* tab栏 */
        tabs: [
            {
                key: 'introduce',
                text:'课程介绍',
            },
            {
                key: 'message',
                text: '精选留言',
            },
            {
                key: 'recommend',
                text: '推荐课程',
            },
        ],
        activeTab: 'introduce',
        showTab: false,
        scrollIntoView: '',

        /* 分销入口相关 */
        shareModel: false,
        isDistribution: false,
        shareCard: false,
        /* 分享弹窗动画 */
        userName: '',
        codeUrl: '',
        shareLink: '',
        /**分销比例 */
        shareRatio: '',
        special: false,
        /**分享来源 */
        fromButton: true,
        headImage: '',
        switch: '',

        /*ios的判断，支付按钮隐藏*/
        system: app.globalData.system,
        // 是否富文本
        notSummary:true,
        summary:{}
    },

    // 渠道,支付用
    _ch: '',

    /**
     * 页面加载时的钩子函数
     *
     * @param { Object } options - 页面的url的query
     */
    async onLoad(options) {
        app.login().then(async() => {
            //解析小程序码
            if(options.scene){
                options = await global.commonService.analysisCode(options)
            }
            global.loggerService.pv()

            this.query = options;
            const { ch, wcl, lshareKey, shareKey, topicId, activityCode } = options 
            this._ch = options.ch || options.wcl;

            this.setData({
                lshareKeyOfThire: lshareKey || '',
                shareKey: shareKey || '',
                topicId: topicId,
            });
            /**判断是否是特定直播间（展示特殊画卡） */
            if(topicId === '2000000072602516')
            {
                // this.setData({special: true})
            }
            this.getInitData()
                // 获取分销关系
                .then(() => { this.fetchShareQualify() })
                // 绑定分销关系
                .then(() => { this.bindShare() })
                .then(async () => {
                    // 获取推荐课程列表和留言列表
                    await Promise.all([
                        this.fetchMessageList(),
                        this.fetchrecommendCourse(),
                    ]) 
                }).then(() => {
                    this.calcScrollHeight()
                })

            paymentDetailsHelper.bind(this);
            /* 有活动券就自动绑定活动券 */
            if (activityCode) {
                global.commonService.bindActivityCode('topic', topicId, activityCode)
            }

            /* 微信统计 */
            global.commonService.wxReport('view_intro', {
                lesson_type: '话题',
                lesson_id: topicId,
            })
            
            // 页面pv日志
            log.pv({
                page: '课程介绍页',
                url: this.getPageUrl(options)
            });
            this.getSummary();
        }).catch(err => console.error(err));
    },

    /**判断是否分销 */
    async isShare(){
        let params = {
            liveId: this.data.liveId,
            businessId: this.data.topicId,
            userId: (wx.getStorageSync('userId')).value,
            type: 'topic',
        };
        const isShareData = await request({
            url: api.isShare,
            data: params,
            method: 'POST',
        })
        const result = getVal(isShareData, 'data.data', {});
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

    /* 显示分享弹窗 */
    showShareModel() {
        this.setData({shareModel:true})
    },

    /* 隐藏分享弹窗 */
    hideShareModal() {
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
            position: 'topicIdId=' + this.data.topicId + '&userId=' + (wx.getStorageSync('userId')).value + '&type=share',
            path: 'pages/intro-topic/intro-topic',
            userId: (wx.getStorageSync('userId')).value,
        };
        const result = await request({
            url: api.getwxcode,
            data: paramsObj,
            method: 'POST',
        })
        this.setData({
            shareCard: true,
            shareModel: false,
            userName: name,
            codeUrl: getVal(result, 'data.data.url', {}),
        })
    },
    onHideShareCard(){
        this.setData({shareCard: false})
    },

    getPageUrl(options) {
        return this.__route__ + '?topicId=' + options.topicId;
    },

    /**
     * 获取页面初始数据
     *
     * @param {any} id
     */
    async getInitData() {
        app.showLoading()
        const { topicId } = this.data

        const result = await request({
            url: api.introTopicInit,
            data: { topicId },
        })
        app.hideLoading()

        /* 检查课程是否被删除 */
        if (getVal(result, 'data.state.code') === 10001) {
            wx.showModal({
                content: getVal(result, 'data.state.msg'),
                success: () => { wx.navigateBack() }
            })
            return
        }

        const liveId = getVal(result, 'data.topicView.topicPo.liveId')
        const channelId = getVal(result, 'data.topicView.topicPo.channelId', '')
        this.setData({ liveId, channelId })

        /* 检查课程是否被下架 */
        const displayStatus = getVal(result, 'data.topicView.topicPo.displayStatus')
        const isAuth = getVal(result,'data.isAuth.isAuth')
        if (displayStatus === 'N' && !isAuth) {
            wx.showModal({
                content: '该课程已下架',
                confirmText: '返回',
                showCancel: false,
                success: function () {
                    const liveId = getVal(result, 'data.topicView.topicPo.liveId');
                    wx.redirectTo({
                        url: `/pages/live-index/live-index?liveId=${liveId}`
                    });
                }
            });
            return;
        }

        /* 检查是否黑名单 */
        const blackType = getVal(result, 'data.blackInfo.type')
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
        const isCustomVip = getVal(result, 'data.vipInfo.isCustomVip')
        /** 如果是定制会员，则直接跳转到详情页 */
        if (isCustomVip === 'Y') {
            wx.redirectTo({
                url: '/pages/thousand-live/thousand-live?topicId=' + result.data.topicView.topicPo.id
            })
        }
        this.setData({...result.data})
        this.updateBg()
        this.updateGoldBar()
        this.setData({showMain: true})

        this.updateTitle()
        /**判断是否分销 */
        this.isShare();
    },

    updateBg() {
        const bgUrl = imgUrlFormat(getVal(this.data, 'topicView.topicPo.backgroundUrl'), "?x-oss-process=image/resize,m_fill,limit_0,h_469,w_750")
        this.setData({ bgUrl })
    },

    updateGoldBar() {
        const { serverTime, topicView, vipInfo } = this.data
        const { startTime, endTime ,type} = topicView.topicPo
        const { isSingleBuy } = topicView.topicExtendPo

        let { showReplay, showDiscount, showVip, showLive, liveStatus } = this.data.goldbar
        
        showReplay = true
        showDiscount = isSingleBuy === 'Y' || type === 'charge'
        showVip = vipInfo.isOpenVip === 'Y' && type === 'charge'
        showLive = type === 'public' || type === 'encrypt'

        if (showLive) {
            /* 课程状态 */
            const timeGap = startTime - serverTime
            if (timeGap > 0) {
                liveStatus = '课程未开始'
            }
            if (timeGap <= 0) {
                liveStatus = endTime ? '课程已结束' : '课程进行中'
            }
        }
      
        this.setData({ goldbar: { showReplay, showDiscount, showVip, showLive, liveStatus } })
    },

    /* 更新页面标题 */
    updateTitle() {
        let title = this.data.topicView.topicPo.topic
        if (typeof title != 'string') {
            title = '课程介绍';
        }

        wx.setNavigationBarTitle({ title });
    },

    /* 获取直播间分销shareKey */
    fetchShareQualify() {
        request({
            url: api.liveShareQualify,
            data: {
                caller: 'weapp',
                liveId: this.data.topicView.topicPo.liveId,
            }
        }).then(result => {
            if (getVal(result, 'data.state.code') == 0 && getVal(result, 'data.data.shareQualify') != null) {
                this.setData({
                    lshareKeyOfMine: getVal(result, 'data.data.shareQualify.shareKey')
                });
            }
        });
    },

    /* 绑定分销关系 */
    bindShare() {
        if (this.data.lshareKeyOfThire && this.data.lshareKeyOfThire != 'null') {
            request({
                url: api.bindLiveShare,
                method: 'POST',
                data: {
                    liveId: this.data.topicView.topicPo.liveId,
                    shareKey: this.data.lshareKeyOfThire
                }
            }).then(resp => {
                if (getVal(resp, 'data.data.bind') === 'Y') {
                    // eventLog({
                    //     category: 'shareBind',
                    //     action:'success',
                    //     business_id: this.data.channelId,
                    //     business_type: 'channel',
                    // });
                }
            })
        }
    },

    /* 显示留言弹窗 */
    showMessageModal() {
        let { messageModalAnimation } = this.data
        this.setData({showMessageModalMask:true})
        messageModalAnimation = wx.createAnimation({
            duration: 800,
            timingFunction: 'ease',
        }).translateY(0).step().export()
        this.setData({ messageModalAnimation })
    },

    /* 隐藏留言弹窗 */
    hideMessageModal() {
        let { messageModalAnimation } = this.data
        this.setData({ showMessageModalMask: false })
        messageModalAnimation = wx.createAnimation({
            duration: 800,
            timingFunction: 'ease',
        }).translateY('110%').step().export()
        this.setData({ messageModalAnimation })
    },

    /* 获取留言列表 */
    async fetchMessageList() {
        let { topicId, messageList } = this.data
        const result = await request({
            url: '/api/weapp/live/consult/collection',
            data: {
                topicId,
                type: 'topic',
            },
        })

        messageList = getVal(result, 'data.data.consultList', [])
        this.setData({ messageList })
    },

    /* 留言点赞 */
    async onPraiseClick(e) {
        const { id } = e.detail
        const { messageList } = this.data

        const result = await request({
            url: '/api/weapp/live/consult/praise',
            method: 'POST',
            data: { id },
        })

        if (getVal(result, 'data.state.code') === 0) {
            messageList.find(item => {
                if (item.id === id) {
                    item.isLike = 'Y'
                    item.praise++
                    return true
                }
                return false
            })
            this.setData({ messageList })
        }

        wx.showToast({ title: getVal(result, 'data.state.msg') })
    },

    /* 获取推荐课程列表 */
    async fetchrecommendCourse() {
        const { liveId,topicId } = this.data
        const result = await request({
            url: '/api/weapp/live/topic-list',
            data: {
                liveId,
                page: 1,
                size: 6,
            },
        })
        let course = getVal(result, 'data.data.liveTopics', [])
        course = course.filter(item => item.id !== topicId).slice(0, 5)
        
        this.setData({
            recommendCourse: course,
        })
    },

    /* 页面滚动事件 */
    onPageScroll(e) {
        this.pageScrollTop = e.detail.scrollTop

        let { tabs, activeTab, showTab } = this.data
        let sortTabs = tabs.map(item=>item).sort((a, b) => b.rect.top - a.rect.top)
        showTab = e.detail.scrollTop - sortTabs[sortTabs.length - 1].rect.top > 0
        let curTab = sortTabs.find(item => e.detail.scrollTop > item.rect.top)

        if (curTab && activeTab !== curTab.key) {
            this.setData({activeTab:curTab.key})
        }
        this.setData({ showTab })
    },

    onTabTap(e) {
        const key = e.detail.key
        const { tabs } = this.data
        const tab = tabs.find(item=>item.key === key)
        console.log(tab)

        this.setData({
            activeTab: key,
            scrollTop: tab.rect.top + 10,
        })
    },

    /* 计算tab区域的滚动高度 */
    calcScrollHeight() {
        let { tabs,recommendCourse,messageList } = this.data
        /* 先过滤掉不显示的tab */
        tabs = tabs.filter(item=>{
            if (item.key == 'recommend' && !recommendCourse.length) {
                return false
            }
            if (item.key == 'message' && !messageList.length) {
                return false
            }
            return true
        })
        tabs.forEach(item => {
            let query = wx.createSelectorQuery()
            query.select(`#${item.key}`).boundingClientRect( (rect)=> {
                rect.top = rect.top + (this.pageScrollTop || 0)
                item.rect = rect
            }).exec()    
        })
        
        this.setData({ tabs })
        // console.log(this.data)
    },

    /* 链到详情页*/
    linkToTopic() {
        wx.redirectTo({
            url: '/pages/thousand-live/thousand-live?topicId=' + this.data.topicView.topicPo.id
        })
    },

    /* 去系列课购买*/
    buyChannel() {
        const { channelId, liveId, id } = this.data.topicView.topicPo

        wx.redirectTo({
            url: `/pages/channel-index/channel-index?channelId=${channelId}&liveId=${liveId}&topicId=${id}`,
        })
    },

    /*公开课程报名*/
    async enterPublic() {
        const result = await request({
            url: '/api/weapp/topic/enterPublic',
            data: {
                topicId: this.data.topicView.topicPo.id,
            }
        })
        if (getVal(result, 'data.state.code') === 0) {
            global.loggerService.event({
                category: 'jointopic',
                action: 'success',
            })
            this.linkToTopic()
        } else {
            wx.showToast({ title: '报名失败' })
            global.loggerService.event({
                category: 'jointopic',
                action: 'failed',
            })
        }
    },

    /* 加密课程报名*/
    async enterEncrypt() {
        let password = this.data.input;
        let legal = validator('text', '密码', password, 12);

        if (legal) {
            const result = await request({
                url: '/api/weapp/topic/enterEncrypt',
                data: {
                    topicId: this.data.topicView.topicPo.id,
                    password,
                },
            })
            if (result.data.state.code == 0) {
                global.loggerService.event({
                    category: 'jointopic',
                    action: 'success',
                })
                this.linkToTopic()
            }
            if (result.data.state.code == 10001) {
                wx.showToast({
                    title: '密码错误',
                })
            }
        }
    },

    /* 密码输入事件*/
    passwordInput(e) {
        this.setData({
            input: e.detail.value,
        });
    },

    /* 下订单*/
    doOrder(e) {
        const { shareKey, topicView } = this.data
        const { createBy, id, money } = topicView.topicPo

        return this.PDH_goToPaymentDetails({
            ...this.query,
            type: 'topic',
            topicId: id,
        })

        order({
            data: {
                toUserId: createBy,
                source: 'wxapp',
                topicId: id,
                total_fee: money,
                shareKey: shareKey || '',
                type: 'COURSE_FEE',
                ifboth: 'Y',
                ch: this._ch || '',
            },
            success: res => {
                this.linkToTopic()
            },
            fail: res => {
                wx.showToast({ title: '支付失败' })
            }
        });
    },

    /* 倒计时结束事件，说不定以后要做点儿事情 */
    onCountDownEnd() {

    },

    /* 阻止下拉刷新 */
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },

    /* 分享函数*/
    onShareAppMessage(e) {
        if (!this.data.topicView) {
            return {}
        }
        // 判断是否是底部分享栏分享
        if (e.from === 'button'){
            this.setData({fromButton: true})
        }else {
            this.setData({fromButton: false})
        }
        let { lshareKeyOfMine, topicView, fromButton, shareKey, isDistribution } = this.data
        let { backgroundUrl, topic, id } = topicView.topicPo

        backgroundUrl = backgroundUrl || '//img.qlchat.com/qlLive/topicHeaderPic/thp-4.jpg'
        return {
            title: topic,
            imageUrl: backgroundUrl,
            desc: `${topic}，值得我的推荐和你的参与`,
            path: `/pages/intro-topic/intro-topic?topicId=${id}${lshareKeyOfMine ? '&lshareKey=' + lshareKeyOfMine : ''}${shareKey ? '&shareKey=' + shareKey : ''}${fromButton ? '&ch=button_share' : '&ch=menu'}`,
            success: (res)=>{
                global.loggerService.event({
                    category: 'share',
                    action: 'success',
                });
                //分享成功隐藏分享栏
                this.setData({shareModel: false});
                if(this.data.fromButton){
                    console.log({                        lesson_type: '话题',
                    lesson_id: id,
                    share_word: isDistribution ? 'shareAndEarn' : 'onlyShare',
                    share_success_if: 'true',})
                    /**微信统计 */
                    global.commonService.wxReport('share_people_success', {
                        lesson_type: '话题',
                        lesson_id: id,
                    })
                }
            },
            fail: (err)=>{
                if(this.data.fromButton){
                    /**微信统计 */
                    global.commonService.wxReport('share_people_fail', {
                        lesson_type: '话题',
                        lesson_id: id,
                    })
                }
            }
        }
    },
    onFeedbackClick() {
        const systemInfo = wx.getSystemInfoSync()
        const {userInfo }= this.data

        const data = {
            userInfo,
            systemInfo,
            weappVersion: global.weappVersion,
        }

        request({
            url: '/api/weapp/mine/feedback-info',
            method: 'POST',
            data,
        })
    },
    /* 获取富文本 */
    async getSummary() {
        const { topicId } = this.data
        const result = await request({
            url: '/api/wechat/ueditor/getSummary',
            method: 'POST',
            data: {
                businessId:topicId,
                type:"topic",
            },
        })
        if (getVal(result, 'data.state.code', 1) == 0) {
            let summary = parse(result.data.data.content);
            this.setData({
                summary,
                notSummary:false
            })
        } else {
            this.setData({
                notSummary:true
            })
        }
        
    },
}

Page(config);