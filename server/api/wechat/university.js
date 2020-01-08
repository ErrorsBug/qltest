var lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');


module.exports = [
    ['POST', '/api/wechat/university/listChildren', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.university.listChildren,conf.baseApi.secret)],
    ['POST', '/api/wechat/university/getMenuNode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.university.getMenuNode,conf.baseApi.secret)],
    ['POST', '/api/wechat/university/getWithChildren', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.university.getWithChildren,conf.baseApi.secret)],
    ['POST', '/api/wechat/university/batchListChildren', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.university.batchListChildren,conf.baseApi.secret)],
];
