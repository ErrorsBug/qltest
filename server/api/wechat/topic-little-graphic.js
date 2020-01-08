import lo from 'lodash';
var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    clientParams = require('../../middleware/client-params/client-params'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');



/*************************************************************           *******************************************************************************/


/**
 * 小图文获取主要信息
 */
var getLittleGraphicInfo = async (params, req) => {
    // 获得参数
    let infoArr = [
        ['topicInfo', conf.baseApi.topic.topicInfo, params, conf.baseApi.secret],
        ['getInfo', conf.baseApi.checkInCamp.getInfo, params, conf.baseApi.secret],
        ['contentList', conf.baseApi.checkInCamp.contentList, params, conf.baseApi.secret],
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['topicAuth', conf.baseApi.topic.topicAuth, params, conf.baseApi.secret],
        ['blackInfo', conf.baseApi.channel.isBlack, params, conf.baseApi.secret],
        ['kickoutInfo', conf.baseApi.checkInCamp.kickoutStatus, params, conf.baseApi.secret],
    ];

    return proxy.parallelPromise(infoArr, req);
}


module.exports = [
];

module.exports.getLittleGraphicInfo = getLittleGraphicInfo;
