
var lo = require('lodash'),
    proxy = require('../../components/proxy/proxy'),
    resProcessor = require('../../components/res-processor/res-processor'),
    conf = require('../../conf');

/**
 * 用来判断是否管理员，是否允许放行
 * @Author   dodomon<dodomon@126.com>
 * @DateTime 2018-09-12 13:47:50+0800
 * @DateTime 2018-09-12 13:47:50+0800
 */
module.exports = ({failHandle} = {}) => {
    return async (req, res, next) => {
        let result,
            params = {};
        let liveId = req.query.liveId||req.params.liveId;
        let topicId = req.query.topicId || req.params.topicId;
        let channelId = req.query.channelId || req.params.channelId;
        let campId = req.query.campId || req.params.campId;

        if (topicId) {
            params.topicId = topicId;
        } else if (channelId){
            params.channelId = channelId;
        } else if (campId){
            params.campId = campId;
        } else if (liveId){
            params.liveId = liveId;
        } else {
            // 如果没有参数需要请求则去下一个路由中间件
            next();
            return;
        }

        // 如果有用户信息，添加用户id
        let userId = lo.get(req, 'rSession.user.userId');
        if (userId) {
            params.userId = userId;
        }


        try {
            result = await proxy.apiProxyPromise(conf.baseApi.user.power, params, conf.baseApi.secret, req);
            const power = lo.get(result, 'data.powerEntity');
            if (!power.allowMGLive) {
                if (typeof failHandle == 'function') {
                    failHandle(req, res, next);
                    return false;
                }
                res.redirect('/wechat/page/link-not-found?type=notMg')
                return false;
            }

        } catch (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        next();
    };
};

// 过滤管理员和创建者的b端页面
const managePassForConsult = async (req, res, next) => {
    var params = {};
    let type = req.query.type;
    let businessId = req.params.topicId;
    if (type == 'channel') {
        params.channelId = businessId;
    } else {
        params.topicId = businessId;
    }

    // 如果有用户信息，添加用户id
    var userId = lo.get(req, 'rSession.user.userId');
    if (userId) {
        params.userId = userId;
    }


    try {
        const result = await proxy.apiProxyPromise(conf.baseApi.user.power, params, conf.baseApi.secret, req);
        const power = lo.get(result, 'data.powerEntity');
        if (!power.allowMGLive) {
            res.redirect('/wechat/page/link-not-found?type=notMg')
            return false;
        }

    } catch (err) {
        resProcessor.error500(req, res, err);
        return;
    }

    next();
};

module.exports.managePassForConsult = managePassForConsult;
