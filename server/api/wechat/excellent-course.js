const wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
const appAuth = require('../../middleware/auth/1.0.0/app-auth');
const clientParams = require('../../middleware/client-params/client-params');
const conf = require('../../conf');
const requestProcess = require('../../middleware/request-process/request-process');


module.exports = [
    ['POST', '/api/wechat/excellentCourse/auditCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.excellentCourse.auditCourse, conf.baseApi.secret)],
    ['POST', '/api/wechat/excellentCourse/courseAudit', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.excellentCourse.courseAudit, conf.baseApi.secret)],
    ['POST', '/api/wechat/excellentCourse/quickAudit', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.excellentCourse.quickAudit, conf.baseApi.secret)],
];
    