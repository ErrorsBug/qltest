const wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
const appAuth = require('../../middleware/auth/1.0.0/app-auth');
const clientParams = require('../../middleware/client-params/client-params');
const conf = require('../../conf');
const requestProcess = require('../../middleware/request-process/request-process');


module.exports = [
    ['POST', '/api/wechat/complain/saveComplain', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.complain.saveComplain, conf.baseApi.secret)],
    ['GET', '/api/wechat/complain/getReasonType', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.complain.getResonTypes, conf.baseApi.secret)],
];
