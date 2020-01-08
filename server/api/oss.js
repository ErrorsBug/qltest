var _ = require('underscore'),

    resProcessor = require('../components/res-processor/res-processor'),
    proxy = require('../components/proxy/proxy'),
    wxAuth = require('../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../middleware/client-params/client-params'),
    conf = require('../conf'),
    lo = require('lodash');


/**
 *
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
var ossAuth = function (req, res, next) {
    var params = _.pick(req.query, 'fuck');
    var userData = req.rSession.user;
    if (userData && userData.userId) {
        params.userId = userData.userId;
    }
    proxy.apiProxy(conf.baseApi.ossAuth, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


module.exports = [
    ['POST', '/api/baseApi/ossAuth', clientParams(), appAuth(), wxAuth(), ossAuth],
];
