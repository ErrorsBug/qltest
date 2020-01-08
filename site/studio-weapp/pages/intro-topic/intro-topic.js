var app = getApp();

import log from '../../comp/log';
import { pay, share, playVoice, linkTo, timeAfter, getVal, digitFormat, fillParams, orderInAnotherWeapp,deckUrl } from '../../comp/util';
import order from '../../comp/order';
import { conditions } from './conditions';
import { api } from '../../config';
import { validator } from '../../comp/validator';
import { AudioPlayer } from '../../comp/player'
import request from '../../comp/request';
import * as regeneratorRuntime from '../../comp/runtime'
import { parse } from '../../comp/we-rich/we-rich';

const config = {
    data: {
        info: {},
        conditions: {},
        processings: {},
        input: '',
        showMain: false,
        audioStatus: 'stopped',
        audioSrc: '',
        hideAuthModal: true,
        timeAfter: '',
        isShowDetail: false,
        shareKey: '',
        // 链接上带进来的别人的lsharekey
        lshareKeyOfThire: '',
        // 请求自己的分销关系自己的lsharekey
        lshareKeyOfMine: '',

        /* 支付方式相关 */
        payType: 'official',
        payTipsContent: '',
        contactModalVisible: false,

        system: app.globalData.system,//ios,安卓客户端
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
    onLoad(options) {
        app.login().then(() => {
            app.showLoading();

            this.setData({ topicId: options.topicId})
            this._ch = options.ch || options.wcl;

            this.setData({
                lshareKeyOfThire: options.lshareKey,
                shareKey: options.shareKey
            });

            this.getInitData(options.topicId)
                // 获取分销关系
                .then(() => {this.fetchShareQualify()})
                // 绑定分销关系
                .then(() => {this.bindShare()});

            // 获取三方小程序支付方式
            this.getOpsPayType()
            
            // 页面pv日志
            log.pv({
                page: '话题介绍页',
                url: this.getPageUrl(options)
            });
            this.getSummary();
        }).catch(err => console.error(err));
    },

    getPageUrl(options) {
        return this.__route__ + '?topicId=' + options.topicId;
    },

    /**
     * 获取页面初始数据
     *
     * @param {any} id
     */
    getInitData(id) {
        return request({
            url: api.introTopicInit,
            data: {
                topicId: id,
            }
        }).then(res => {
            app.hideLoading();
            if(getVal(res, 'data.data.state.code') == 10001){

                wx.showModal({
                    title: '提示',
                    content: res.data.data.state.msg,
                    showCancel: false,
                    success: () => {
                        wx.navigateBack();
                    }
                });
            } else {
                if (getVal(res, 'data.topicView.topicPo.displayStatus', 'Y') == 'N') {
                    wx.showModal({
                        title: '提示',
                        content: '该话题已下架',
                        confirmText: '返回',
                        showCancel: false,
                        success: function () {
                            const liveId = getVal(res, 'data.topicView.topicPo.liveId');
                            wx.redirectTo({
                                url: `/pages/index/index?liveId=${liveId}`
                            });
                        }
                    });
    
                    return;
                }
    
                // 显示页面
                this.setData({
                    showMain: true,
                });
                let chargeConfigs = getVal(res, 'data.channel.chargeConfigs',[]);
                let isFreeChannel = chargeConfigs.length ? chargeConfigs[0].amount == 0 : false;
                this.getConditions({...res.data,isFreeChannel}, true);
                this.getOtherInfo();

                let title = getVal(res, 'data.topicView.topicPo.topic', '');
                if (typeof title != 'string') {
                    title = '话题介绍';
                }

                let startTime = getVal(res, 'data.topicView.topicPo.startTime');
                if (startTime > Date.now()) {
                    this.setData({
                        timeAfter: timeAfter(startTime)
                    });
                }

                wx.setNavigationBarTitle({
                    title: title,
                });

            }
        });
    },

    /* 隐藏支付提示弹窗 */
    hidePayContactModal() {
        this.setData({ contactModalVisible: false })
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
                    payCourseType: 'topic',
                    businessId: this.data.topicId,
                },
            })
            console.log('pay type---------------', result)
            const { payType, replyContent } = result.data.data
            this.setData({ payType, payTipsContent: replyContent })
        } catch (error) {
            console.error('获取三方小程序支付方式失败: ', error)
        }
    },

    // 获取直播间分销shareKey
    fetchShareQualify() {
        request({
            url: api.liveShareQualify,
            data: {
                caller: 'studio-weapp',
                liveId: this.data.info.topicView.topicPo.liveId,
            }
        }).then(result => {
            if (getVal(result, 'data.state.code') == 0 && getVal(result, 'data.data.shareQualify') != null) {
                this.setData({
                    lshareKeyOfMine: getVal(result, 'data.data.shareQualify.shareKey')
                });
            }
        });
    },

    // 绑定分销关系
    bindShare() {
        if (this.data.lshareKeyOfThire && this.data.lshareKeyOfThire != 'null') {
            request({
                url: api.bindLiveShare,
                method: 'POST',
                data: {
                    liveId: this.data.info.topicView.topicPo.liveId,
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

    toggleDetailShow() {
        this.setData({
            isShowDetail: !this.data.isShowDetail
        });
    },
    /**
     * 获取剩余介绍页数据
     */
    getOtherInfo() {
        const that = this;
        request({
            url: api.introTopicSecond,
            data: {
                liveId: this.data.info.topicView.topicPo.liveId,
                topicId: this.data.info.topicView.topicPo.id,
                channelId: this.data.info.topicView.topicPo.channelId,
                pageNum: 1,
                pageSize: 20,
            }
        }).then(res => {
            that.getConditions(res.data, false);
            that.initPlayer();
        });
    },

    /* 初始化音频播放器*/
    initPlayer() {
        const that = this;
        let audioList = [];
        if (typeof this.data.processings.audio == 'array') {
            this.data.processings.audio.forEach(val => {
                audioList.push(val.url);
            });
        }

        this.audio = new AudioPlayer({
            id: 'audio-player',
            list: audioList,
            autoPlay: false,
            system: app.globalData.system,
            ori: that,
            onPlay: function (e) { that.setData({ audioStatus: 'playing' }); },
            onPause: function (e) { that.setData({ audioStatus: 'paused' }); },
            onEnded: function (e) { that.setData({ audioStatus: 'ended' }); },
        });
    },

    // audioError(e) {
    //     this.audio.onError(e);
    // },

    // audioPlay(e) {
    //     this.audio.onPlay(e);
    // },

    // audioPause(e) {
    //     this.audio.onPause(e);
    // },

    // audioTimeupdate(e) {
    //     this.audio.onTimeupdate(e);
    // },

    // audioEnded(e) {
    //     this.audio.onEnded(e);
    // },

    /* 点击audio的事件*/
    onAudioTap(e) {
        // console.log('click:', e, this.audio);
        this.audio.action();
    },

    /**
     * 获取或更新conditions和processings
     *
     * @param {Object} data - 数据
     * @param {boolean} isFirst - 是否为初始化
     */
    getConditions(data, isFirst) {
        try {
            isFirst ? conditions.initData(data) : conditions.secondData(data);
        } catch (error) {
            console.error(error);
        }

        let _info = {};
        let _conditions = {};
        let _processings = {};

        console.log(isFirst);

        _info = Object.assign(this.data.info, conditions._info);
        _conditions = Object.assign(this.data.conditions, conditions._conditions);
        _processings = Object.assign(this.data.processings, conditions._processings);

        this.setData({
            info: _info,
            conditions: _conditions,
            processings: _processings,
            authNum: digitFormat(_info.topicView.topicPo.authNum),
            browseNum: digitFormat(_info.topicView.topicPo.browseNum),
        });
    },

    /* 链到详情页*/
    linkToTopic() {
        wx.redirectTo({
            url: '/pages/thousand-live/thousand-live?topicId=' + this.data.info.topicView.topicPo.id
        })
    },

    /* 链到直播间*/
    linkToLive() {
        wx.redirectTo({
            url: '/pages/index/index?liveId=' + this.data.info.topicView.topicPo.liveId,
        })
    },

    /* 链到频道*/
    linkToChannel() {
        wx.redirectTo({
            url: `/pages/channel-index/channel-index?channelId=${this.data.info.topicView.topicPo.channelId}`,
        })
    },

    /* 去频道购买*/
    buyChannel() {
        let channelId = this.data.info.topicView.topicPo.channelId;
        let liveId = this.data.info.topicView.topicPo.liveId;
        let id = this.data.info.topicView.topicPo.id;

        wx.redirectTo({
            url: `/pages/channel-index/channel-index?channelId=${channelId}&liveId=${liveId}&topicId=${id}`,
        })
    },

    /* 关注取关*/
    doFocus() {
        const that = this;
        request({
            url: '/api/studio-weapp/live/focus',
            data: {
                topicId: this.data.info.topicView.topicPo.id,
                liveId: this.data.info.topicView.topicPo.liveId,
                status: this.data.conditions.focused ? 'N' : 'Y',
            },
        }).then(res => {
            if (res.data.state.code == 0) {

                let _conditions = that.data.conditions;
                _conditions.focused = !_conditions.focused;
                let msg = _conditions.focused ? '关注成功' : '已取消关注';
                wx.showToast({
                    title: msg,
                    icon: 'success',
                })
                // console.log(that.data);
                let _info = that.data.info;
                _info.isFollow.isFollow = !_info.isFollow.isFollow
                _info.followNum.follwerNum = _conditions.focused
                    ? _info.followNum.follwerNum + 1
                    : _info.followNum.follwerNum - 1;


                that.setData({
                    info: _info,
                    conditions: _conditions,
                });
            }
        })
    },

    /*公开话题报名*/
    enterPublic() {
        const that = this;
        request({
            url: '/api/studio-weapp/topic/enterPublic',
            data: {
                topicId: that.data.info.topicView.topicPo.id,
            },
        }).then(res => {
            // 报名成功，进行跳转
            if (res.data.state.code == 0) {
                that.linkToTopic();
            }
        })
    },

    /* 加密话题报名*/
    enterEncrypt() {
        const that = this;
        let psw = this.data.input;
        let legal = validator('text', '密码', psw, 12);
        if (legal) {
            request({
                url: '/api/studio-weapp/topic/enterEncrypt',
                data: {
                    topicId: that.data.info.topicView.topicPo.id,
                    password: psw,
                },
            }).then(res => {
                if (res.data.state.code == 0) {
                    that.linkToTopic();
                    return;
                }
                if (res.data.state.code == 10001) {
                    wx.showToast({
                        title: '密码错误',
                    })
                }
            });
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
        if (this.data.payType === 'customer') {
            this.setData({ contactModalVisible: true })
            return 
        }
        const params = {
            toUserId: this.data.info.topicView.topicPo.createBy,
            source: 'web',
            topicId: this.data.info.topicView.topicPo.id,
            total_fee: this.data.conditions.topicCharge*100,
            shareKey: this.data.shareKey || '',
            type: 'COURSE_FEE',
            ifboth: 'Y',
            ch: this._ch || '',
            selfTopicId:this.data.info.topicView.topicPo.id,
        }

        orderInAnotherWeapp(params, '/pages/thousand-live/thousand-live?topicId=' + params.selfTopicId)
        return;
    },

    doPay(data) {
        // pay({
        //     timeStamp: Date.now(),
        //     nonceStr: data.nonceStr,
        //     package: data.packageValue,
        //     signType: data.signType,
        //     paySign: data.paySign,
        // }).then(res => {
        //     console.log(res);
        // }).catch(res => {
        //     console.log(res);
        // })

        wx.requestPayment({
            timeStamp: String(Date.now()),
            nonceStr: data.nonceStr,
            package: data.packageValue,
            signType: data.signType,
            paySign: data.paySign,
            shareKey: this.data.shareKey,
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.log(res);
            },
        })
    },

    /* 隐藏认证modal*/
    hideAuthModal() {
        this.setData({
            hideAuthModal: true,
        });
    },

    /* 显示认证modal*/
    showAuthModal() {
        this.setData({
            hideAuthModal: false,
        });
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
    
    /* 分享函数*/
    onShareAppMessage() {
        const imageUrl = getVal(this.data, 'info.topicView.topicPo.backgroundUrl', 'https://img.qlchat.com/qlLive/topicHeaderPic/thp-4.jpg');
        const topicName = getVal(this.data, 'info.topicView.topicPo.topic', '');

        return {
            title: topicName,
            imageUrl: imageUrl,
            desc: `${topicName}，值得我的推荐和你的参与`,
            path: `/pages/intro-topic/intro-topic?topicId=${getVal(this.data, 'info.topicView.topicPo.id', '')}&lshareKey=${this.data.lshareKeyOfMine}`
        }
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
    // 免费系列课报名
    onCheckInFree() {
        const that = this;

        const { channelId } = this.data.info.topicView.topicPo;
        const { chargeConfigs } = this.data.info.channel;
        const userId = wx.getStorageSync('userId');

        const orderData = {
            toUserId: userId,
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
            that.linkToTopic();
        }

        order({
            data: orderData,
            payFree: successFn
        })
    },
}

Page(config);
