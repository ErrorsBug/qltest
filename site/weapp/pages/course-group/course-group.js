import log from '../../comp/log';
import { linkTo, getVal, digitFormat, timeAfter } from '../../comp/util';
import order from '../../comp/order';
import { dateFormat } from '../../comp/filter';

import {
    LIVE_SERVICE,
    CHANNEL_SERVICE,
    COURSEGROUP_SERVICE,
} from '../../service/index'
import { Provider } from '../../service/index'
import * as regeneratorRuntime from '../../comp/runtime'
const app = getApp();

/**
 * 需要注入的服务
 * 由于小程序方法的限制以及没有配置ts，因此这里不能实现真实的依赖注入，看方法名
 * 是服务注入，其实只是将指定的服务new一个实例，定义到对象的属性
 */
const serviceInNeed = [
    LIVE_SERVICE,
    CHANNEL_SERVICE,
    COURSEGROUP_SERVICE,
]

const config = {
    onLoad(options) {
        app.login().then(() => {
            global.loggerService.pv()

            this.setData({
                groupId: options.groupId,
                channelId: options.channelId,
            });

            this.fetchData()
            // 页面pv日志
            log.pv({
                page: '拼团页面',
                url: this.getPageUrl(options)
            });
        });
    },

    data: {
        /* 显示页面内容 */
        showContent: false,

        /* 页面参数 */
        channelId: '',
        groupId: '',
        liveId: '',

        /* 获取的数据 */
        serverTime: null,
        channelInfo: null,
        channelChargeStatus: null,

        groupInfo: null,
        joinList: null,

        vipInfo: null,
        blackInfo: null,
    },

    /** 
     * 获取页面数据 
     * 
     * 这里的流程稍长一些，简单注释一下
     * 
     * 1. 首先请求拼团和系列课相关信息
     * 2. 请求回来后更新这一部分数据，随即查看用户对当前系列课的购买状态，
     *    如果已经购买，又不是参团者，重定向到系列课主页，否则获取下一步的信息
     * 3. 然后根据第一步请求拿到的liveId请求vip和黑名单信息
     * 4. 查看是否vip或黑名单，vip同样跳转系列课主页，黑名单则回到小程序首页，
     *    如果都不是，进行下一步更新数据
     * 5. 更新第二次请求的信息并设置showContent为true显示视图，并更新分享信息和页面标题
     * 
     * */
    async fetchData() {
        app.showLoading()
        const { channelId, groupId } = this.data
        /* 第一步把能请求的接口都请求了 */
        const res = await Promise.all([
            this[COURSEGROUP_SERVICE].fetchGroupInfo(groupId),
            this[COURSEGROUP_SERVICE].fetchJoinList(groupId),

            this[CHANNEL_SERVICE].fetchChannelInfo(channelId),
            this[CHANNEL_SERVICE].fetchChannelChargeStatus(channelId),
        ])
        this.updateMainData(res)
        const chargeAndNotGroup = this.tellCharge()

        if (!chargeAndNotGroup) {
            /* 拿到liveId之后做第二步请求 */
            const liveRes = await Promise.all([
                this[LIVE_SERVICE].fetchVipInfo(this.data.liveId),
                this[LIVE_SERVICE].fetchBlackInfo(this.data.liveId, channelId),
            ])
            const [
                vipInfo,
                blackInfo,
            ] = liveRes

            const needsRedirect = this.tellVip(vipInfo) || this.tellBlack(blackInfo)
            if (!needsRedirect) {
                this.updateSecondData({ vipInfo, blackInfo })
                this.updateSharePage()
                this.updatePageTitle()
            }
        }
    },

    /* 更新主要视图数据 */
    updateMainData(data) {
        let [
            groupInfo, joinList,
            channelInfo, channelChargeStatus,
        ] = data

        const liveId = getVal(channelInfo, 'channel.liveId')
        const serverTime = groupInfo.currentServerTime
        const charged = Boolean(channelChargeStatus.chargePos)
        const userId = (wx.getStorageSync('userId')).value
        const isHaruhi = userId === getVal(groupInfo, 'channelGroupPo.userId')
        const isMember = Boolean(joinList.find(member => member.userId === userId))

        groupInfo = groupInfo.channelGroupPo

        this.setData({
            liveId, serverTime, charged, isHaruhi, isMember,
            groupInfo, joinList, channelInfo, channelChargeStatus,
        })
    },

    /* 更新非视图数据，vip信息，黑名单信息等 */
    updateSecondData(data) {
        this.setData({
            ...data,
            showContent: true,
        }, () => { app.hideLoading() })
    },

    /* 更新页面标题 */
    updatePageTitle() {
        const { channelInfo } = this.data
        wx.setNavigationBarTitle({
            title: getVal(channelInfo, 'channel.name', '拼课')
        })
    },

    /** 
     * 查看当前用户是否已经购买系列课 
     * 如果已经购买系列课且不是团员或团长detached
     * */
    tellCharge(data) {
        const { charged, isHaruhi, isMember, channelId } = this.data

        const chargeAndNotGroup = charged && !isHaruhi && !isMember
        if (chargeAndNotGroup) {
            wx.redirectTo({
                url: `/pages/channel-index/channel-index?channelId=${this.data.channelId}`
            })
        }
        return charged && !isHaruhi && !isMember
    },

    /* 查看当前用户是否直播间vip */
    tellVip(vipInfo) {
        if (vipInfo.isVip === 'Y') {
            wx.redirectTo({
                url: `/pages/channel-index/channel-index?channelId=${this.data.channelId}`
            })
            return true
        }
        return false
    },

    /* 查看当前用户的黑名单信息 */
    tellBlack(blackInfo) {
        if (!blackInfo.type) {
            return false
        }
        wx.redirectTo({ url: `/pages/index/index` })
        return true
    },

    /* 拼课区倒计时结束 */
    onCountDownEnd() {
        this.fetchData()
    },

    /************** 按钮相关方法 - start **************/
    async onBtnEnterTap() {
        const topicId = await this[COURSEGROUP_SERVICE].fetchAndRedirectToCourse(this.data.channelId)
        if (topicId) {
            wx.redirectTo({ url: `/pages/thousand-live/thousand-live?topicId=${topicId}` })
        } else {
            this.linkToChannel()
        }
    },

    onBtnJoinTap() {
        const { liveId, groupId, channelInfo } = this.data
        const chargeConfigId = getVal(channelInfo, 'chargeConfigs.0.id')
        const discountAmount = getVal(channelInfo, 'chargeConfigs.0.discount')

        /* 支付前保存formId，支付后保存prepay_id */
        order({
            data: {
                type: 'CHANNEL',
                total_fee: discountAmount,
                source: 'wxapp',

                liveId,
                groupId,
                chargeConfigId,

                ifboth: 'Y',
                shareKey: this.data.shareKey || '',
                ch: this._ch || '',
            },

            success: (payRes, info) => {
                this.fetchData()
                global.loggerService.event({
                    category: 'pay',
                    action: 'success',
                    payType: 'START_GROUP',
                    money: discountAmount,
                })
            },
        });
    },

    async onBtnStartTap() {
        const { groupInfo, channelId, liveId, channelInfo } = this.data
        const chargeConfigId = getVal(channelInfo, 'chargeConfigs.0.id')
        const discountStatus = getVal(channelInfo, 'chargeConfigs.0.discountStatus')
        const discountAmount = getVal(channelInfo, 'chargeConfigs.0.discount')

        global.commonService.updateFormId(this.data.formId, 'form')

        if (discountStatus === 'P') {

            /* 发起免费拼课 */
            const queryResult = await this[COURSEGROUP_SERVICE].createFreeAndQuery(channelId)
            if (typeof queryResult === 'string') {
                wx.showModal({
                    title: "开团失败",
                    content: queryResult,
                    showCancel: false,
                })
                return
            }
            if (typeof queryResult === 'object') {
                const groupId = getVal(queryResult, 'data.channelGroupPo.id')
                wx.redirectTo({
                    url: `/pages/course-group/course-group?channelId=${channelId}&groupId=${groupId}`,
                })
            }
        }
        if (discountStatus === 'GP') {
            /* 发起付费拼课 */
            order({
                data: {
                    type: 'CHANNEL',
                    total_fee: discountAmount,
                    source: 'wxapp',
                    liveId: liveId,
                    ifboth: 'Y',
                    shareKey: this.data.shareKey || '',
                    chargeConfigId,
                    ch: this._ch || '',
                    payType: 'group_leader',
                },

                success: async (payRes, info) => {
                    global.loggerService.event({
                        category: 'pay',
                        action: 'success',
                        payType: 'JOIN_GROUP',
                        money: discountAmount,
                    })
                    try {
                        const chargeResult = await this[COURSEGROUP_SERVICE].fetchChargeGroupResult(channelId)
                        const groupId = getVal(chargeResult, 'data.channelGroupPo.id')
                        wx.redirectTo({
                            url: `/pages/course-group/course-group?channelId=${channelId}&groupId=${groupId}`,
                        })
                    } catch (error) {
                        console.error('查询拼课结果失败:', err)
                        this.fetchData();
                    }
                },
            });
        }

    },
    /* 更新formId */
    updateFormId(e) {
        const { formId } = e.detail
        global.commonService.updateFormId(formId)
        this.setData({ formId })
    },
    /************** 按钮相关方法 - end **************/

    /* 分享返回数据，通过修改此数据修改分享方法 */
    shareData: null,
    updateSharePage() {
        const { name, headImage } = this.data.channelInfo.channel
        const { amount, groupDiscount, groupNum, joinNum } = this.data.groupInfo

        this.shareData = {
            title: `原价￥${amount}，拼课价￥${groupDiscount}【拼课仅剩${groupNum - joinNum}个名额】`,
            imageUrl: headImage,
            path: `/pages/course-group/course-group?channelId=${this.data.channelId}&groupId=${this.data.groupId}`,
            success: () => {
                // this.onShareSuccess()
            },
        };
    },

    onShareSuccess() {
        this[COURSEGROUP_SERVICE].countShareCache(this.data.groupId)
    },

    onShareAppMessage() {
        return this.shareData
    },

    linkToChannel() {
        wx.redirectTo({
            url: `/pages/channel-index/channel-index?channelId=${this.data.channelId}&groupId=${this.data.groupId}`
        })
    },

    /* 更新页面标题 */
    updateTitle() {
        wx.setNavigationBarTitle({ title: this.data.channelInfo.name })
    },

    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },

    getPageUrl() {
        return this.__route__ + '?groupId=' + this.data.groupId
    },
}

Page(Provider.inject(config, serviceInNeed))