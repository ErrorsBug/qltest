import { api } from '../../config';
import request from '../../comp/request';
import { getUserInfo,getStorageSync, setStorageSync, getVal } from '../../comp/util';
import { useCoupon } from '../../comp/coupon-util';
import * as regeneratorRuntime from '../../comp/runtime';

import {
    BonusesService,
} from '../../service/bonuses.service';
import {
    ChannelService,
} from '../../service/channel.service';
import { routeService } from '../../service/route.service';

const app = getApp();


/**
 * type为live|ding_zhi时，id是couponRefId
 * couponRefId用于 通用券 和 平台券 唯一标识，用作这两种券的couponId
 */

Page({
    data: {
        // 当前登录用户ID
        currentUserId: '',
        // 是否发起者
        isSponser: false,
        // 活动配置id
        confId: '',
        // 活动id
        groupId: '',
        // 活动发起者id
        uid: '',
        // 业务页面类型 channel, topic
        businessType: '',
        // 业务页面id
        businessId: '',
        // 状态，ing-进行中，pass-完成拼团，over-时间结束
        status: '',
        // 当前用户是否已经参与过该活动
        alreadyJoined: false,
        // 当前红包打开情况
        redpackList: new Array(4),
        // 拼团人数门槛，默认为4
        groupNum: 4,
        // 已拼团人数
        joinNum: 1,
        // 当前用户获得的红包
        myRedpack: null,

        // 当前播报的信息
        notice1: '',
        // 下一条信息
        notice2: '',
        // 当前播报位置
        currentNoticeIndex: 0,
        // 播报列表
        noticeList: [],
        // 是否已经支付过系列课，或者是vip
        hadPaidChannel: null,

        // 分享数据
        shareData: {
            shareImg: '',
            shareContent: '',
        },

        // 红包总金额
        totalMoney: 0,

        serverTime: new Date().getTime(),
        endTime: '',//3600000*24
        leastShare: 0,
        shareCount: 0,
        couponAmount: 0,
        status: 'ing',
        isFinish: false,
        ruleIntroVisible: false,
        envelopeOpened:"N",
        recentAcceptList:[],
        showAcceptObj: {},
        animationData1: {},//弹幕动画
        animationData2: {},
        congratulationText: [
            '祝你，步步高升',
            '祝你，五福临门',
            '祝你，一帆风顺',
            '祝你，身体健康'
        ],
        system: app.globalData.system,

    },

    /**
     * id
     * type
     * from 分享者id
     */
    query: {
    },

    async onLoad(options) {
        await app.login()
        global.loggerService.pv()

        this.setData({
            share: options.share || 'N',
            confId: options.confId || '',
            groupId: options.groupId || '',

            envelopeOpened: getStorageSync("redEnvelopeOpened"+options.channelId),
        })

        wx.showShareMenu({
            withShareTicket: true
        });
        this.bonusesService = new BonusesService();
        this.channelService = new ChannelService();
        
        // this.initUserInfo();
        this.initBonusesData(options.groupId, options.confId);
        // this.initBonusesMyShareDetail(options.channelId);
        // this.initChannelInfo(options.channelId);
        // this.initRecentAcceptList(options.channelId);

        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#e3232b',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        });
    
    },

    /**
     * 生成假数据
     */
    initFakeList() {
        const fakeNames = [
            '浅沫',
            '歡顏か',
            '余温',
            '独活',
            '扮乖',
            '放逐',
            '听风',
            '躲不过心动',
            '写尽青山，落笔是你',
            '温柔少女心',
            '蜜桃',
            '仙女味的草莓酱',
            '陌若浮生',
            '暖茶',
            '在劫难逃',
            '妄想症',
            '浅浅一笑',
            '绝种好男人',
            '滥情空心',
            '嘦怹',
            '残心↘誰懂',
            '梦里梦到他梦她',
            '納痛.依然猶存',
            '心棘',
            '心已碎',
            '凉了時光傷了心',
            '往事随风散',
            '人去楼空',
        ];
        const fakeList = fakeNames.map(_ => {
            let randomIndex = Math.floor(Math.random() * 20)
            let randomMoney = Math.floor(Math.random() * this.data.totalMoney)
            return {
                userName: fakeNames[randomIndex],
                couponMoney: randomMoney,
            }
        });

        this.setData({
            noticeList: fakeList
        })
    },

    /**
     * 根据类型跳转到对应页面
     * @param {string} businessType 目标页面类型 channel、topic
     * @param {string} businessId 业务id
     */
    navigateToBusinessPage() {
        if (!this.data.businessId) {
            console.error('缺少businessId，无法跳转');
            return;
        }

        if (this.data.businessType === 'channel') {
            routeService.navigateTo({ url: `/pages/channel-index/channel-index?channelId=${this.data.businessId}`});
        } else {
            routeService.navigateTo({ url: `/pages/intro-topic/intro-topic?topic=${this.data.businessId}`});
        }
    },

    /**
     * 初始化页面信息
     * @param {string} groupId 当前拼团组的id
     * @param {string} confId 活动配置的id
     */
    async initBonusesData(groupId, confId) {
        try {
            app.showLoading();

            const result = await this.bonusesService.getConfAndGroupInfo(groupId, confId);
            const userInfoRes = await getUserInfo()
            const businessType = getVal(result, 'confInfo.businessType', '');
            const businessId = getVal(result, 'confInfo.businessId', '');
            const currentUserId = (wx.getStorageSync('userId')).value;

            this.setData({
                businessType,
                businessId,
                currentUserId,
                confId: getVal(result, 'confInfo.id', ''),
                serverTime: getVal(result, 'serverTime'),
                endTime: getVal(result, 'groupInfo.endTime'),
                shareData: {
                    shareImg: getVal(result, 'confInfo.shareImg', ''),
                    shareContent: getVal(result, 'confInfo.shareContent', ''),
                },
                totalMoney: getVal(result, 'confInfo.totalMoney', 0),
                validDay: getVal(result, 'confInfo.validDay'),
                groupId: getVal(result, 'groupInfo.id'),
                isSponser: getVal(result, 'groupInfo.userId', '') == currentUserId,
                // isSponser: false,
                status: getVal(result, 'groupInfo.status', 'over'),
                // status: 'pass',
                groupNum: getVal(result, 'groupInfo.groupNum', 4),
                joinNum: getVal(result, 'groupInfo.joinNum', 1),
            });

            app.hideLoading();

            // 如果活动下架，那么跳回到 系列课/话题页
            if (getVal(result, 'confInfo.status') != 'Y') {
                wx.showModal({
                    title: '提示',
                    content: '该活动已下架',
                    showCancel: false,
                    confirmText: '我知道了',
                    confirmColor: '#f73657',
                    success: () => {
                        this.navigateToBusinessPage();
                    }
                })
                return;
            }

            if (result.groupInfo == null) {
                wx.showModal({
                    title: '提示',
                    content: '创建活动失败',
                    showCancel: false,
                    confirmText: '我知道了',
                    confirmColor: '#f73657',
                    success: () => {
                        this.navigateToBusinessPage();
                    }
                })
                return;
            }

            // 该拼团已过期
            if (getVal(result, 'groupInfo.status', 'over') === 'over') {
                this.startNewGroup();
                return;
            }

            if (businessType === 'channel') {
                this.initChannelInfo(getVal(result, 'confInfo.businessId'));
                this.initChannelChargeInfo(getVal(result, 'confInfo.businessId'));
            } else {
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!暂时不支持话题类型活动');
            }

            // 生成假的数据
            this.initFakeList();

            // 获取红包列表
            this.initRedpackList();
            // 获取播报列表
            this.initNotice();
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * 当前红包列表，3s更新一次列表
     */
    async initRedpackList() {
        this.updateRedpackList();

        if (this.data.status === 'ing') {
            this.timer = setInterval(() => {
                this.updateRedpackList();
            }, 3000);
        }
    },

    /**
     * 更新红包列表
     */
    async updateRedpackList() {
        try {
            const result = await this.bonusesService.getGroupOpenRedpack(this.data.groupId);
            if (result.length === this.data.redpackList.filter(item => !!item).length) {
                return;
            }

            let bestIndex = 0;
            let bestMoney = -1;
            let list = this.data.redpackList.map((_, index) => {

                if (result[index]) {
                    if (result[index].couponMoney > bestMoney) {
                        bestIndex = index;
                        bestMoney = result[index].couponMoney;
                    }

                    return {
                        ...result[index],
                        congratulationText: this.data.congratulationText[index].replace(/，/g, '\n')
                    }
                }
            });

            list[bestIndex].isBest = true;

            let myRedpack = list.filter(item => !!item).find(item => item.userId == this.data.currentUserId)

            let status = this.data.status;
            let joinNum = this.data.joinNum;
            if (result.length === 4) {
                status = 'pass';
                joinNum = result.length;
            }

            this.setData({
                alreadyJoined: !!myRedpack,
                myRedpack: myRedpack || null,
                redpackList: list,
                status,
                joinNum,
            })
        } catch (error) {
            console.error(error);
        }
    },

    /**
     * 点邀
     * @param {any} e 小程序的事件
     */
    doInvite(e) {
        global.loggerService.click(e);
    },

    /**
     * 点赞
     * @param {any} e 小程序的事件
     */
    async doCongratulate(e) {
        global.loggerService.click(e);

        try {
            if (this.doingCon) {
                return;
            }

            this.doingCon = true;

            app.showLoading();

            const result = await this.bonusesService.openRedpack(this.data.groupId);
            let isOpen = getVal(result, 'isOpen');
            let status = getVal(result, 'status');

            app.hideLoading();

            this.doingCon = false;

            if (isOpen === 'Y') {
                wx.redirectTo({
                    url: `/pages/channel-bonuses/channel-bonuses?groupId=${this.data.groupId}&uid=${this.data.uid}`
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: getVal(result, 'msg'),
                    showCancel: false,
                    confirmText: '我知道了',
                    confirmColor: '#f73657',
                    success: () => {
                        if (status === 'pass') {
                            // 如果该活动已完成
                            wx.redirectTo({
                                url: `/pages/channel-bonuses/channel-bonuses?groupId=${this.data.groupId}&uid=${this.data.uid}`
                            })
                        } else if (status === 'over') {
                            // 如果该活动已结束
                            this.navigateToBusinessPage();
                        }
                        
                    }
                })
            }
            // console.log('--------------', result);
        } catch (error) {
            wx.showModal({
                title: '提示',
                content: '网络繁忙，请稍后再试！',
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#f73657',
            });
            console.error(error);
        }
    },

    //   initUserInfo(){
    //     getUserInfo().then((userInfoRes) => {
    //         this.setData({
    //             userInfo: userInfoRes.userInfo
    //         });
    //     }).catch((err)=>{
    //         console.error("请先登陆",err);
    //     });
    //   },

    // 获取近期获奖用户
    // async initRecentAcceptList(channelId){
    //     let acceptresult = await this.bonusesService.fetchRecentAcceptList(channelId);
    //     if(acceptresult.list&&acceptresult.list.length>0){
    //         this.setData({
    //             recentAcceptList:acceptresult.list,
    //         });
    //         this.acceptIndex=0;
    //         let that = this;
    //         this.setData({isAnimate:true});
    //         this.initNotice();
    //     }

    //     this.initNotice();
    // },

    /**
     * 初始化左上角notice
     */
    async initNotice() {
        this.animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease-out',
        });

        try {
            const result = await this.bonusesService.getAccountRedpackList(this.data.confId);

            let newList = this.data.noticeList;
            if (result.length !== 0) {
                newList = this.data.noticeList.concat(result);
            }

            this.setData({
                noticeList: newList,
                notice1: this.getRandomNotice(newList),
                notice2: this.getRandomNotice(newList),
            })
        } catch (error) {
            console.error(error);
        }

        this.updateNotice();
    },

    onUnload() {
        clearInterval(this.timer);
    },

    updateNotice() {
        this.animation.translateY('-100%').opacity(0).step();
        let animationData1 = this.animation.export();
        this.animation.translateY('0').opacity(1).step();
        let animationData2 = this.animation.export();

        this.setData({
            animationData1,
            animationData2,
            notice2: this.getRandomNotice(),
        })

        setTimeout(() => {
            this.resetNotice();
        }, 1000);

        setTimeout(() => {
            this.updateNotice();
        }, 2000);
    },

    /**
     * 获取随机的notice
     */
    getRandomNotice(list) {
        try {
            let tmpList = this.data.noticeList.length > 0 ? this.data.noticeList : list;
            let idx = Math.floor(Math.random() * tmpList.length);
            let obj = tmpList[idx] || {};

            return `${obj.userName}\n已成功领取${obj.couponMoney / 100}`;
        } catch (error) {
            console.error('error -- ', error);
            return '';
        }
        
    },

    resetNotice() {
        let animReset = wx.createAnimation({
            duration: 0,
            timingFunction: 'step-start'
        });
        animReset.translateY('0').opacity(1).step();
        let animationData1 = animReset.export();
        animReset.translateY('100%').opacity(0).step();
        let animationData2 = animReset.export();
        
        this.setData({
            animationData1,
            animationData2,
            notice1: this.data.notice2,
            notice2: this.data.notice1,
        })
    },

    // barrage(){
    //     let that = this;
    //         //var animation = wx.createAnimation({
    //             //duration: 1800,
    //             //timingFunction: 'ease',
    //         //});
    //         //animation.translate(100).step().opacity(0.1).step().translate(0).step({duration:50}).opacity(1).step();
            
    //         this.setData({
    //         //   animationData:animation.export(),
    //             acceptIndex:this.acceptIndex,
    //             isAnimate:true,
    //             showAcceptObj: this.data.recentAcceptList[this.acceptIndex]
    //         },()=>{
    //             //that.setData({});
    //             setTimeout(function() {
    //                 that.setData({
    //                 isAnimate:false,
    //                 });
    //                 that.barrage();
    //             }, 2000);
                
    //         });
            
    //         this.acceptIndex++;
    //         if(this.acceptIndex>=this.data.recentAcceptList.length){
    //             this.acceptIndex=0;
    //         }
        
    // },
    
    async initChannelInfo(channelId){
        let channelInfoResult = await this.channelService.fetchChannelInfo(channelId);
        this.setData({
            channel:channelInfoResult.channel,
            chargeConfig:channelInfoResult.chargeConfigs[0],
        });
    },

    async initChannelChargeInfo(channelId) {
        let chargeInfo = await this.channelService.fetchChannelChargeStatus(channelId, this.data.currentUserId);
        let vipInfo = await this.bonusesService.fetchUserVipInfo(this.data.channel.liveId);

        let hadPaidChannel = this.data.hadPaidChannel;

        if (getVal(chargeInfo, 'chargePos', null) || getVal(vipInfo, 'data.isVip', 'N') === 'Y') {
            hadPaidChannel = 'Y';
        } else {
            hadPaidChannel = 'N';
        }

        this.setData({ hadPaidChannel });
    },
    // async initBonusesMyShareDetail(channelId){
    //     let detailResult = await this.bonusesService.fetchMyShareDetail(channelId);
    //     if(detailResult&&detailResult.status === "ing" || detailResult.status === "accept"){
    //         this.setData({
    //             ...detailResult,
    //             currentServerTime:Date.now()
    //         });
    //     }else{
    //         wx.redirectTo({
    //             url: `/pages/channel-index/channel-index?channelId=${channelId}`
    //         });
    //     }
    //     /* 
    //         leastShare	int	转发门槛
    //         shareCount	int	已转发数
    //         expiryTime	int	过期时间
    //         couponAmount	int	优惠券金额 单位分
    //         status	String	accept:已领取，expiry:已过期 ，ing:进行中 ，unJoin:未参加
    //     */
    // },
    onShareAppMessage() {
        return {
            title: this.data.shareData.shareContent,
            imageUrl: this.data.shareData.shareImg,
            desc: this.data.shareData.shareContent,
            path: `/pages/channel-bonuses/channel-bonuses?groupId=${this.data.groupId}&uid=${this.data.uid}&share=Y`,
            success: (res) => {
                // 转发成功
                // this.ticketLen = res.shareTickets.length;
                // this.thisNum = 0;
                // this.shareTickets = res.shareTickets;
                // this.groupDataList = [];
                // this.ticketFunc(()=>{
                //     this.doShare();
                // });
                wx.showModal({
                    content: '分享3个群成功率98%以上!',
                    showCancel: false,
                    confirmText: '我知道了',
                    confirmColor: '#f73657'
                })
            },
            fail: function(res) {
            // 转发失败
            }
        };
    },

    startNewGroup() {
        wx.redirectTo({
            url: `/pages/channel-bonuses/channel-bonuses?confId=${this.data.confId}`
        });
    },

    // async doShare(){
    //     let miniSessionKey=getStorageSync("miniSessionKey");
    //     let doshareresult=await this.bonusesService.fetchDoShare(this.data.channelId,miniSessionKey,this.groupDataList);
    //     this.setData({
    //         shareCount: doshareresult.shareCount,
    //         envelopeOpened:'Y',//分享成功，自动关闭红包窗口
    //     })
    //     setStorageSync("redEnvelopeOpened"+this.data.channelId,"Y");//分享成功，自动关闭红包窗口，缓存关闭
    //     if(doshareresult.shareCount >=this.data.leastShare){
    //         wx.showToast({
    //             title: '恭喜获得红包',
    //             icon: 'success',
    //             duration: 2000
    //         })
    //     }else{
    //         wx.showToast({
    //             title: '恭喜分享成功',
    //             icon: 'success',
    //             duration: 2000
    //         })
    //     }
    // },
    // ticketFunc(cb){
    //     let that = this;
    //     wx.getShareInfo({
    //         shareTicket:this.shareTickets[this.thisNum],
    //         success(CALLBACK ) {
    //             that.groupDataList = [...that.groupDataList,CALLBACK];
    //             if(that.thisNum+1 < that.ticketLen){
    //                 that.thisNum++;
    //                 that.ticketFunc(that.doShare);
    //             }else{
    //                 cb&&cb();
    //             }
    //         }
    //     });
    // },

    // onTimerFinish(){
    //     this.onBackCoursePage();
    // },

    // onBackCoursePage(){
    //     wx.redirectTo({
    //         url: `/pages/channel-index/channel-index?channelId=${this.data.channelId}`
    //     });
    // },
    onBackBuyPage(){
        // 如果是社交渠道进入系列课，或者是vip，或者已经支付过，则进去系列课主页，否则直接去到支付页
        if (this.data.share === 'Y' || this.data.hadPaidChannel === 'Y') {
            wx.redirectTo({
                url: `/pages/channel-index/channel-index?channelId=${this.data.businessId}`
            });
        } else {
            wx.redirectTo({
                url: `/pages/payment-details/payment-details?channelId=${this.data.businessId}&type=${this.data.businessType}&couponId=${this.data.myRedpack.couponId}`
            });
        }
    },

	onRuleBtnTap(){
        this.setData({
            ruleIntroVisible: true
        })
    },
	onRuleIntroWrapperTap(){
		this.setData({
			ruleIntroVisible: false
		})
    },
    
    /* 更新formId */
    updateFormId(e) {
        const { formId } = e.detail
        global.commonService.updateFormId(formId)
        this.setData({ formId })
    },


})