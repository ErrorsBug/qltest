var resProcessor = require('../../components/res-processor/res-processor'),
wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
appAuth = require('../../middleware/auth/1.0.0/app-auth'),
clientParams = require('../../middleware/client-params/client-params'),
requestProcess = require('../../middleware/request-process/request-process'),
conf = require('../../conf');
const proxy = require('../../components/proxy/proxy');
const lo = require('lodash')


const getGiftDetail = async (req, res, next) => {
    let params = {
        type: lo.get(req, 'body.type'),
        giftId: lo.get(req, 'body.giftId'),
        giftRecordId: lo.get(req, 'body.giftRecordId'),
    };
    params.userId = lo.get(req, 'rSession.user.userId');
    let result ;
    try {
        result = await proxy.apiProxyPromise(conf.baseApi.gift.giftDetail, params, conf.baseApi.secret,req);
        result.data.userId = params.userId;
    } catch (err) {
        resProcessor.error500(req, res, err);
        return;
    }
    
    resProcessor.jsonp(req, res, result);
}

module.exports = [
    ['POST', '/api/wechat/giftDetail', clientParams(), appAuth(), wxAuth(), getGiftDetail],
    ['POST', '/api/wechat/giftAcceptList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.gift.giftList, conf.baseApi.secret)],
    ['POST', '/api/wechat/getMoreGift', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.gift.giftGroupGet, conf.baseApi.secret)],
    ['POST', '/api/wechat/getOneGift', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.gift.giftget, conf.baseApi.secret)],
]
