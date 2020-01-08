
import log from '../../comp/log';
import { linkTo, getVal, digitFormat, timeAfter, fillParams, orderInAnotherWeapp, deckUrl } from '../../comp/util';
import order from '../../comp/order';
import { api } from '../../config';
import { dateFormat } from '../../comp/filter';
import request from '../../comp/request';
import * as regeneratorRuntime from '../../comp/runtime'
import { parse } from '../../comp/we-rich/we-rich';

const app = getApp();

Page({

    data: {
        activeTab: 'intro',
        topicId: '',
        channelId: '',
        liveId: '',
        scrollTop: '',
        // 链接上带进来的别人的lsharekey
        lshareKeyOfThire: '',
        // 请求自己的分销关系自己的lsharekey
        lshareKeyOfMine: '',
        shareKey: '',

        topic: {
            list: [],
            page: 1,
            size: 10,
            nomore: false,
            loading: false,
        },

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

        canFixedBar: false,

        // 权限
        power: {},

        expiryTimeStr: '',
        expiryTimeParsed: '',
        showExpiryDialog: false,

        // 频道信息
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

        // 是否有没有topic
        isEmpty: false,

        // 固定收费显示的价格
        ticketMoney: '',

        // 按时收费显示的价格
        chargeConfigsStr: '',

        // 显示action sheet
        showActionSheet: false,

        // 当前时间
        now: Date.now(),

        liveName: '',

        // 显示“已经购买”的提示dialog
        showAlreadyBuyDialog: false,

        // 已经购买过的相同系列课的channelId
        alreadyBuyChannelId: '',

        /* 支付方式相关 */
        payType: 'official',
        payTipsContent: '',
        contactModalVisible: false,

        system: app.globalData.system,
        // 是否富文本
        notSummary:true,
        summary:{}
    },

    // 渠道,支付用
    _ch: '',

    onLoad(options) {
        app.login().then(() => {
            this._ch = options.ch || options.wcl;
            this.setData({
                channelId: options.channelId,
                topicId: options.topicId,
                lshareKeyOfThire: options.lshareKey,
                shareKey: options.shareKey
            });

            // 设置窗体高度
            this.adjustScrollHeight();

            // 初始化频道信息
            this.fetchChannelInfo()
                // 获取频道话题列表
                // .then(() => {this.fetchTopicList(true)})
                // 获取分销信息
                .then(() => {this.fetchShareQualify()})
                // 绑定分销关系
                .then(() => {this.bindShare()})
                .catch(err => {
                    console.error(err);
                });

            // 获取频道话题列表
            // this.fetchTopicList(true);

            // 计算顶部高度
            this.calcHeaderHeight();

            // 检查是否已经购买过相同的课程
            this.checkDuplicateBuyStatus();

            // 获取三方小程序支付方式
            this.getOpsPayType()

            // 页面pv日志
            log.pv({
                page: '系列课主页',
                url: this.getPageUrl()
            });
            this.getSummary();
        });
    },

    /* 隐藏支付提示弹窗 */
    hidePayContactModal() {
        this.setData({ contactModalVisible: false })
    },

    onLoadData() {
        this.fetchTopicList(false);
    },

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

    adjustScrollHeight() {
        const systemInfo = wx.getSystemInfoSync();
        const pixelRatio = systemInfo.pixelRatio;
        const windowWidth = systemInfo.windowWidth;
        const windowHeight = systemInfo.windowHeight;
        const scrollHeight = windowHeight;
        this.setData({
            scrollHeight: scrollHeight + 'px'
        });
    },

    async getOpsPayType() {
        try {
            const userId = wx.getStorageSync('userId')
            const result = await request({
                url: '/api/studio-weapp/getOpsPayType',
                data: {
                    liveId: global.liveId,
                    merchantAppId: global.appId,
                    userId,
                    payCourseType: 'channel',
                    businessId: this.data.channelId,
                },
            })
            console.log('pay type---------------', result)
            const { payType, replyContent } = result.data.data
            this.setData({ payType, payTipsContent: replyContent })
        } catch (error) {
            console.error('获取三方小程序支付方式失败: ', error)
        }
    },

    bindShare() {
        if (this.data.lshareKeyOfThire && this.data.lshareKeyOfThire != 'null') {
            request({
                url: api.bindLiveShare,
                method: 'POST',
                data: {
                    liveId: this.data.liveId,
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

    onPageScroll(e) {
        if (!this.headerHeight) {
            return;
        }

        if (e && e.detail && e.detail.scrollTop >= this.headerHeight && !this.data.canFixedBar) {
            this.setData({
                canFixedBar: true
            });
        } else if (e && e.detail && e.detail.scrollTop < this.headerHeight && this.data.canFixedBar) {
            this.setData({
                canFixedBar: false
            });
        }
    },

    onTabClick(e) {
        let key = e.detail.key;
        this.changeTab(key);
    },

    changeTab(key) {
        this.setData({
            tabItems: this.data.tabItems.map(item => {
                item.active = key == item.key
                return item;
            }),
            activeTab: key,
            scrollTop: 0,
        });
    },

    fetchChannelInfo() {
        app.showLoading();

        return request({
            url: api.getChannelIndex,
            data: {
                channelId: this.data.channelId,
            }
        }).then(result => {
            app.hideLoading();
            try {

                let desc = result.data.desc || {};
                let descArr = [];
                if (desc.desc) {
                    descArr.push({
                        title: '简介',
                        dataset: desc.desc
                    });
                }
                if (desc.lectuerInfo) {
                    descArr.push({
                        title: '关于讲师',
                        dataset: desc.lectuerInfo
                    });
                }
                if (desc.suitable) {
                    descArr.push({
                        title: '适合人群',
                        dataset: desc.suitable
                    });
                }
                if (desc.gain) {
                    descArr.push({
                        title: '你将获得',
                        dataset: desc.gain
                    });
                }

                const nomore = result.data.topicList.length === 0;
                console.log('channelInfo',result.data.channelInfo.channel)
                this.setData({
                    channelInfo: result.data.channelInfo.channel,
                    chargeConfigs: result.data.channelInfo.chargeConfigs.map((item, index) => {
                        item.active = index === 0;
                        return item;
                    }),
                    createUser: result.data.channelInfo.createUser,
                    chargePos: result.data.chargePos || false,
                    userCount: digitFormat(result.data.userCount),
                    userList: result.data.userList.slice(0, 5),
                    ticketMoney: result.data.ticketMoney,
                    chargeConfigsStr: result.data.chargeConfigsStr,
                    liveId: result.data.channelInfo.channel.liveId,
                    power: result.data.power,
                    vipInfo: result.data.vipInfo,
                    descArr,
                    topic: {
                        ...this.data.topic,
                        ...{
                            list: result.data.topicList,
                            page: 1,
                            nomore,
                        }
                    },
                    isEmpty: result.data.topicList.length == 0,
                });

                if (descArr.length > 0) {
                    this.changeTab('intro')
                } else if (result.data.topicList.length > 0) {
                    this.changeTab('topic')
                } else {
                    this.changeTab('intro')
                }

                if (!!this.data.topicId) {
                    if (this.data.channelInfo.chargeType == 'flexible') {
                        this.setData({
                            showActionSheet: true
                        });
                    } else if (this.data.channelInfo.chargeType == 'absolutely') {
                        this.onBuy()
                    }
                }

                if (result.data.chargePos) {
                    const lastTime = result.data.chargePos.expiryTime - this.data.now;
                    let expiryTimeStr = '';

                    if (lastTime > 86400000) {
                        expiryTimeStr = (~~((lastTime/86400000 + 1))) + '天'
                    } else if (lastTime > 3600000) {
                        expiryTimeStr = (~~((lastTime/3600000 + 1))) + '小时'
                    } else {
                        expiryTimeStr = (~~((lastTime/60000 + 1))) + '分钟'
                    }
                    this.setData({
                        expiryTimeStr,
                        expiryTimeParsed: dateFormat(getVal(result, 'data.chargePos.expiryTime'))
                    });
                }


                wx.setNavigationBarTitle({
                    title: this.data.channelInfo.name,
                });

                return Promise.resolve();
            } catch (error) {
                console.error(error);
                return Promise.reject('服务请求出错 - ', error);
            }
        }).catch(err => {
            console.error(err);
            app.hideLoading();
        });
    },

    fetchTopicList(empty) {
        if (this.data.topic.nomore || this.__loadingTopic) {
            return;
        }

        this.__loadingTopic = true;

        this.setData({
            topic: {
                ...this.data.topic,
                loading: true
            }
        });

        request({
            url: api.getTopicList,
            data: {
                liveId: this.data.liveId,
                channelId: this.data.channelId,
                page: empty ? 1 : this.data.topic.page + 1,
                size: this.data.topic.size
            }
        }).then(result => {
            this.__loadingTopic = false;
            if (result.data.state.code == 0) {
                let topicList = getVal(result, 'data.data.topicList', []);
                const nomore = topicList.length === 0;

                topicList = topicList.map(item => {
                    if (item.displayStatus == 'Y') {
                        item.browseNumStr = item.browseNum > 10000 ? (item.browseNum/10000).toFixed(2) + '万' : item.browseNum;
                        item.timeStr = timeAfter(item.startTime);
                        return item;
                    }
                })

                if (empty) {
                    this.setData({
                        topic: {
                            ...this.data.topic,
                            ...{
                                list: topicList,
                                page: 1,
                                nomore,
                                loading: !nomore || false
                            }
                        },
                        isEmpty: topicList.length == 0
                    });
                } else {
                    this.setData({
                        topic: {
                            ...this.data.topic,
                            ...{
                                list: this.data.topic.list.concat(topicList),
                                page: this.data.topic.page + 1,
                                nomore,
                                loading: !nomore || false
                            }
                        },
                        isEmpty: false
                    });
                }
            }
        }).catch(err => {
            this.__loadingTopic = false;
            this.setData({
                topic: {
                    ...this.data.topic,
                    ...{
                        loading: false
                    }
                }
            });
        });
    },

    onSelectCharge(e, ind) {
        const index = e ? e.currentTarget.dataset.index : ind;

        this.setData({
            chargeConfigs: this.data.chargeConfigs.map((item, id) => {
                if (id == index) {
                    item.active = true;
                    this.setData({
                        chargeConfigsStr: `￥${item.amount}/${item.chargeMonths}个月`
                    });
                } else {
                    item.active = false;
                }

                return item;
            })
        });
    },

    // 获取直播间分销shareKey
    fetchShareQualify() {
        request({
            url: api.liveShareQualify,
            data: {
                caller: 'studio-weapp',
                liveId: this.data.liveId
            }
        }).then(result => {
            if (getVal(result, 'data.state.code') == 0 && getVal(result, 'data.data.shareQualify') != null) {
                this.setData({
                    lshareKeyOfMine: getVal(result, 'data.data.shareQualify.shareKey')
                });
            }
        });
    },

    // 支付
    onBuy() {
        console.log('-------------------------',this.data)
        if (this.data.payType === 'customer') {
            this.setData({ contactModalVisible: true })
            return 
        }

        // app.showLoading();
        // 如果已经购买过相同课程，弹出已经购买的提示信息
        if (this.data.alreadyBuyChannelId) {
            this.setData({
                showAlreadyBuyDialog: true
            });
            return;
        }

        let url = '__H5_PREFIX/wechat/page/studio-weapp-pay';
        let params = ''

        if (this.data.channelInfo.chargeType === 'absolutely') {

            params = {
                type: 'CHANNEL',
                total_fee: 0,
                source: 'web',
                liveId: this.data.liveId,
                ifboth: 'Y',
                shareKey: this.data.shareKey || '',
                chargeConfigId: this.data.chargeConfigs[0].id,
                ch: this._ch || '',
                selfTopicId: this.data.topicId,
                selfChannelId: this.data.channelId,
            }

        } else if (this.data.channelInfo.chargeType === 'flexible') {
            const buyConfig = this.data.chargeConfigs.filter(item => item.active)[0];
            params = {
                type: 'CHANNEL',
                total_fee: 0,
                source: 'web',
                liveId: this.data.liveId,
                ifboth: 'Y',
                chargeConfigId: buyConfig.id,
                topicId: 0,
                selfTopicId: this.data.topicId,
                selfChannelId: this.data.channelId,
            }
            
        }
        
        const redirectUrl = params.selfTopicId
            ? `/pages/intro-topic/intro-topic?topicId=${params.selfTopicId}`
            : `/pages/channel-index/channel-index?channelId=${params.selfChannelId}&topicId=${params.selfTopicId || ''}`
        
        orderInAnotherWeapp(params,redirectUrl)
    },

    // 免费报名
    onCheckInFree() {
        console.log('免费报名')

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


        const successFn = () => {
            console.log('下单成功')
            wx.redirectTo({url: deckUrl('/pages/channel-index/channel-index', this.options)})
        }

        order({
            data: orderData,
            payFree: successFn
        })
    },

    payResult() {
        if (this.data.topicId) {
            wx.redirectTo({
                url: `/pages/intro-topic/intro-topic?topicId=${this.data.topicId}`
            });
        } else {
            wx.redirectTo({
                url: `/pages/channel-index/channel-index?channelId=${this.data.channelId}&topicId=${this.data.topicId || ''}`
            });
        }
    },

    calcHeaderHeight() {
        try {
            const res = wx.getSystemInfoSync();

            let rate = res.windowWidth / 750;

            this.headerHeight = 390 * rate;
        } catch (error) {
            console.error(error);
        }
    },

    getPageUrl() {
        return this.__route__ + '?channelId=' + this.data.channelId + '&topicId=' + this.data.topicId;
    },

    onOpenCharge() {
        // 如果已经购买过相同课程，弹出已经购买的提示信息
        if (this.data.alreadyBuyChannelId) {
            this.setData({
                showAlreadyBuyDialog: true
            });
            return;
        }
        this.onSelectCharge(null, 0);
        this.setData({
            showActionSheet: true
        });
    },

    onCloseCharge() {
        this.setData({
            showActionSheet: false
        });
    },

    onLink(e) {
        wx.redirectTo({
            url: '/pages/intro-topic/intro-topic?topicId=' + e.currentTarget.dataset.id
        })
    },

    onLinkToLiveIndex() {
        wx.redirectTo({
            url: '/pages/index/index?liveId=' + this.data.liveId
        })
    },

    onShareAppMessage() {
        return {
            title: this.data.channelInfo.name,
            imageUrl: getVal(this.data, 'channelInfo.headImage', 'https://img.qlchat.com/qlLive/liveCommon/default-bg-cover-1908080' + (~~(Math.random() * 3 + 1)) + '.png'),
            desc: `${this.data.channelInfo.name}，值得我的推荐和你的关注`,
            path: `/pages/channel-index/channel-index?channelId=${this.data.channelId}&lshareKey=${this.data.lshareKeyOfMine}`
        };
    },

    openDialog() {
        this.setData({
            showExpiryDialog: true
        });
    },

    closeDialog() {
        this.setData({
            showExpiryDialog: false,
            showActionSheet: true
        });
    },

    closeDialogOnly() {
        this.setData({
            showExpiryDialog: false
        });
    },
    
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },

    // 查看已经购买的课程列表
    viewBoughtList(){
        wx.navigateToMiniProgram({
            appId: 'wx984d6990d313afd4',
            path: '/pages/mine-buy/mine-buy',
            envVersion: '__WEAPP_ENV_VERSION',
        }) 
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
                summary,
                notSummary:false
            })
        } else {
            this.setData({
                notSummary:true
            })
        }
    },
})
