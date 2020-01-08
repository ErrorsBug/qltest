var _ = require('underscore'),
    request = require('request'),

    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    conf = require('../../conf'),
    lo = require('lodash');



const getGeneralVipInfo = function (req, res, next) {

    let params = lo.get(req,'body');
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.parallelPromise([
        ['vipInfo', conf.baseApi.vip.vipInfo, params, conf.baseApi.secret],
        ['vipChargeInfo', conf.baseApi.live.vipChargeInfo, params, conf.baseApi.secret],
    ], req)
        .then(function (results) {

            resProcessor.jsonp(req, res, {
                data: Object.assign({},
                    lo.get(results, 'vipInfo.data', {}), 
                    lo.get(results, 'vipChargeInfo.data', {})
                ),
                state: {
                    code: 0,
                    msg: '请求成功'
                }
            });
            
        }).catch(function (err) {
            console.error(err);
            resProcessor.error500(req, res, err);
        })
}



module.exports = [
   
    ['POST', '/api/wechat/vip/getPushInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getPushInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/vip/push', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.push, conf.baseApi.secret)],
    ['POST', '/api/wechat/vip/pushNum', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.pushNum, conf.baseApi.secret)],
    ['POST', '/api/wechat/vip/incomeRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.incomeRecord, conf.baseApi.secret)],
    ['POST', '/api/wechat/vip/reward', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.reward, conf.baseApi.secret)],
    ['POST', '/api/wechat/vip/vipInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.vipInfo, conf.baseApi.secret)],

    // 获取通用vip信息
    ['POST', '/api/wechat/vip/getGeneralVipInfo', clientParams(), appAuth(), wxAuth(), getGeneralVipInfo],
    // 获取定制vip收费配置
    ['POST', '/api/wechat/vip/vipChargeInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.vipChargeInfo, conf.baseApi.secret)],
    // 获取定制vip列表
    ['POST', '/api/wechat/vip/getCustomVipList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getCustomVipList, conf.baseApi.secret)],
    // 获取定制vip详情
    ['POST', '/api/wechat/vip/getCustomVipInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getCustomVipInfo, conf.baseApi.secret)],
    // 获取定制vip报名用户
    ['POST', '/api/wechat/vip/getCustomVipAuthList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getCustomVipAuthList, conf.baseApi.secret)],
    // 获取定制vip下课程列表
    ['POST', '/api/wechat/vip/getCustomVipCourseList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getCustomVipCourseList, conf.baseApi.secret)],
    // 获取是否定制vip会员
    ['POST', '/api/wechat/vip/userIsOrNotCustomVip', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.userIsOrNotCustomVip, conf.baseApi.secret)],
    // 获取是否定制vip会员
    ['POST', '/api/wechat/vip/getUserVipDetail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getUserVipDetail, conf.baseApi.secret)],

    // 保存vip描述
    ['POST', '/api/wechat/vip/saveVipDesc', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.saveVipDesc, conf.baseApi.secret)],

    // 获取VIP赠礼信息
    ['POST', '/api/wechat/vip/getVipGiftInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getVipGiftInfo, conf.baseApi.secret)],
    // 领取VIP赠礼
    ['POST', '/api/wechat/vip/receiveVipGift', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.receiveVipGift, conf.baseApi.secret)],
    // 获取领取了VIP赠礼的用户列表
    ['POST', '/api/wechat/vip/getReceiverList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getReceiverList, conf.baseApi.secret)],
    // 根据订单获取赠礼ID
    ['POST', '/api/wechat/vip/getGiftId', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.vip.getGiftId, conf.baseApi.secret)],
];

/**
 * 统一返回格式
 *
 * @param {any} code
 * @param {any} msg
 * @param {any} data
 * @returns
 */
function result (code, msg, data) {
    return {
        state: {
            code: code,
            msg: msg,
        },
         data: data,
    };
}

