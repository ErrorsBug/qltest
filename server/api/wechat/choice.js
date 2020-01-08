var lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');


module.exports = [
    ['POST', '/api/wechat/liveCenter/freePublicCourses', clientParams(), appAuth(), wxAuth(), requestProcess(conf.choiceApi.getPublicCourse,conf.choiceApi.secret)],
];
