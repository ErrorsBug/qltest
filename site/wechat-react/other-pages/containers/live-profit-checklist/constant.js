/*
 * @Author: shuwen.wang 
 * @Date: 2017-05-17 10:14:50 
 * @Last Modified by: piaorong.zeng
 * @Last Modified time: 2018-12-18 15:26:18
 */

/* 时间筛选条件*/
export const timeFilter = [
    { text: '全部', value: 'ALL' },
    { text: '近七日', value: 'WEEK' },
    { text: '昨日', value: 'YESTERDAY' },
    { text: '自定义', value: 'CUSTOM' },
]

/* 类型筛选条件*/
export const typeFilter = [
    { text: '全部', value: 'ALL' },
    { text: '话题', value: 'COURSE_FEE' },
    { text: '系列课', value: 'CHANNEL' },
    { text: '赞赏', value: 'REWARD' },
    { text: '直播间VIP', value: 'LIVEVIP' },
    { text: '转播', value: 'RELAY' },
    { text: '私问', value: 'QUESTION' },
    { text: '文件', value: 'DOC' },
    { text: '赠礼', value: 'GIFT' },
    { text: '嘉宾分成', value: 'GUEST_SEPARATE' },
    { text: '知识通', value: 'KNOWLEDGE' },
    { text: '媒体投放', value: 'MEIDA_PUT' },
    { text: '打卡', value: 'LIVECAMP' },
    { text: '退款', value: 'CAMP_REFUND' },
]

export const profitMap = {
    "REWARD": {
        icon: require('./img/icon-profit-reward.png'),
        prefix: '赞赏分成'
    },
    "COURSE_FEE": {
        icon: require('./img/icon-profit-ticket.png'),
        prefix: '付费话题'
    },
    "CHANNEL": {
        icon: require('./img/icon-profit-ticket.png'),
        prefix: '付费系列课'
    },
    "GIFT": {
        icon: require('./img/icon-profit-gift.png'),
        prefix: '话题赠礼'
    },
    "GIFT_CHANNEL": {
        icon: require('./img/icon-profit-gift.png'),
        prefix: '系列课赠礼'
    },
    "VIP_GIFT": {
        icon: require('./img/icon-profit-gift.png'),
        prefix: '直播间VIP会员赠礼'
    },
    "QUESTION": {
        icon: require('./img/icon-profit-question.png'),
        prefix: '私问提问分成'
    },
    "LISTEN": {
        icon: require('./img/icon-profit-question.png'),
        prefix: '私问旁听分成'
    },
    "DOC": {
        icon: require('./img/icon-profit-doc.png'),
        prefix: '付费文件'
    },
    "RELAY": {
        icon: require('./img/icon-profit-ticket.png'),
        prefix: '被转播门票收益'
    },
    "LIVEVIP": {
        icon: require('./img/icon-profit-vip.png'),
        prefix: '直播间VIP会员'
    },
    "GUEST_SEPARATE":{
        icon: require('./img/icon-guest-separa.png'),
        prefix: "嘉宾分成",
    },
    "KNOWLEDGE_GIFT":{
        icon: require('./img/icon-techno.png'),
        prefix: "知识通",
    },
    "MEIDA_PUT_GIFT":{
        icon: require('./img/icon-mediatou.png'),
        prefix: "媒体投放",
    },
    "KNOWLEDGE":{
        icon: require('./img/icon-techno.png'),
        prefix: "知识通",
    },
    "MEIDA_PUT":{
        icon: require('./img/icon-mediatou.png'),
        prefix: "媒体投放",
    },
    "LIVECAMP": {
        icon: require('./img/icon-checkin.png'),
        prefix: "付费打卡",
    },
    "CAMP_REFUND": {
        icon: require('./img/icon_refund.png'),
        prefix: "训练营全额退款",
    },
}