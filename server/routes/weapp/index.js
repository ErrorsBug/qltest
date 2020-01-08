import path from 'path';
import async from 'async';
import lo from 'lodash'

// middlewares
const wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
const weappStudioAuth = require('../../middleware/auth/1.0.0/weapp-studio-auth');
const knowledgeCodeAuth = require('../../middleware/knowledge-code-auth');
const wxAppAuth = require('../../middleware/auth/1.0.0/wx-app-auth').default;
const wxUtils = require('../../components/wx-utils/wx-utils');


// const thousandLivePage = reduxHander(thousandLiveConfigs);
// =========

function weappStudioAuthHandler(req, res, next) {
    // 若已授权知识店铺则 _klca = true 否则为 false
    // Disable caching for content files
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", 0);
    res.render("silence-auth");
    return;
}

function weappStudioPayHandler(req, res, next) {
    // 若已授权知识店铺则 _klca = true 否则为 false
    // Disable caching for content files
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", 0);
    res.render("studio-weapp-pay");
    return;
}

module.exports = [

    //小程序H5授权页面
    ['GET', '/wechat/page/weapp/studio/auth', (req, res, next) => {
        // console.log(res.cookie());
        let clear = false
        // let clear = true;
        if (clear) {
            req.rSession.expire = 1;
            res.clearCookie('rsessionid');
            res.clearCookie('uid');
            res.clearCookie('userId');
            res.clearCookie('JSESSIONID');
            res.render("silence-auth");
            return;
        }
        next();
    } ,knowledgeCodeAuth(), weappStudioAuth({ ignoreSession: true }), weappStudioAuthHandler],

    ['GET', '/wechat/page/studio-weapp-pay',knowledgeCodeAuth(), wxAppAuth(), weappStudioPayHandler],

];

// module.exports = [

//     //小程序H5授权页面
//     ['GET', '/wechat/page/weapp/studio/auth',  weappStudioAuthHandler],

// ];
