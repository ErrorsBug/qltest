var path = require('path'),
    _ = require('underscore'),
    util = require('util'),
    lo = require('lodash'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),

    proxy = require('../../components/proxy/proxy'),
    conf = require('../../conf'),
    htmlProcessor = require('../../components/html-processor/html-processor');

function officialIndex(req, res, next) {

        var filePath = path.resolve(__dirname, '../../../public/wechat/page/homework-card/homework-card.html'),
        options = {
            filePath: filePath,
            fillVars: {

            }
        };
        // var userData = req.rSession.user;
        htmlProcessor(req, res, next, options);


}

module.exports = [
    ['GET', '/wechat/page/homework-card', clientParams(), wxAuth(), appAuth(), officialIndex],
];
