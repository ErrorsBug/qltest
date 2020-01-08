var _ = require('underscore'),
    request = require('request'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf'),
    header = require('../../components/header/header'),
    lo = require('lodash');


module.exports = [
    /* 直播间主页用到的接口 */
    ['GET', '/api/wechat/editor/upload', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.editor.upload, conf.baseApi.secret)],
];
