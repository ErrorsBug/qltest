const resProcessor = require('../../components/res-processor/res-processor');
const proxy = require('../../components/proxy/proxy');
const wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
const appAuth = require('../../middleware/auth/1.0.0/app-auth');
const clientParams = require('../../middleware/client-params/client-params');
const requestProcess = require('../../middleware/request-process/request-process');
const conf = require('../../conf');

/**
 * 获取拼课详情内容
 * @param { {id: number, groupId: string} } params
 */
const getGroup = (params, req) => {
    return proxy.parallelPromise([
        ['groupInfo', conf.wechatApi.channel.getGroup, params, conf.wechatApi.secret],
        ['groupPayList', conf.wechatApi.channel.getPayList, params, conf.wechatApi.secret],
    ], req);
}

async function initChannelGroup (req, res, next) {
    const {
        groupId
    } = req.query;

    try {
        const result = await getGroup({
            id: groupId,
            groupId: groupId,
        }, req);
        resProcessor.jsonp(req, res, result)

    } catch (error) {
        console.error(error);
        resProcessor.error500(req, res, error, '获取初始化信息失败');
    }
}

module.exports = [
    // 拼课用户列表
    ['GET', '/api/wechat/channel/group/getPayList', clientParams(), appAuth(),  wxAuth(), requestProcess(conf.wechatApi.channel.getPayList, conf.wechatApi.secret)],
    // 获取拼课详情信息
    ['GET', '/api/wechat/channel/group/init', clientParams(), appAuth(),  wxAuth(), initChannelGroup],
	['GET', '/api/wechat/channel/group/countShareCache', clientParams(), appAuth(),  wxAuth(), requestProcess(conf.baseApi.channel.countShareCache, conf.baseApi.secret)],
	['GET', '/api/wechat/channel/group/countVisitCache', clientParams(), appAuth(),  wxAuth(), requestProcess(conf.baseApi.channel.countVisitCache, conf.baseApi.secret)],
	['GET', '/api/wechat/channel/group/countSharePayCache', clientParams(), appAuth(),  wxAuth(), requestProcess(conf.baseApi.channel.countSharePayCache, conf.baseApi.secret)],
]

module.exports.getGroup = getGroup;
