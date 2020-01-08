import path from 'path';
import lo from 'lodash'

const conf = require('../../conf');
const proxy = require('../../components/proxy/proxy');
const wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
const resProcessor = require('../../components/res-processor/res-processor');
const htmlProcessor = require('../../components/html-processor/html-processor');
const getQRLoginUrl = require('../../components/wx-utils/wx-utils').getQRLoginUrl;

async function index(req, res, next) {
    const filePath = path.resolve(__dirname,'../../../public/knowledge-mall-pc/index.html');

    const reg = /(knowledge-mall\/user-portrait|knowledge-mall\/manage)/;

    if (!lo.get(req, 'rSession.user.userId',null) && reg.test(req.path)) {
        res.redirect('/pc/knowledge-mall/index');
        return;
    }

    // const filePath = path.resolve('./public/index.html');
    // const redirectUrl = req.flash('_loginRedirectUrl')
    const host = lo.get(req, 'headers.host')
    const qrcodeUrl = getQRLoginUrl('http://' + host + '/pc/knowledge-mall/index')
    const options = {
        filePath: filePath,
        renderData: {
            html: '',
        },
        fillVars: {
            __INIT_STATE__: {},
            QRCODE_URL: qrcodeUrl,
        },
    }
    htmlProcessor(req, res, next, options)

    // const options = {
    //     filePath: filePath,
    //     renderData: {
    //         html: '',
    //     },
    //     fillVars: {
    //         __INIT_STATE__: {},
    //     },
    // }
    // htmlProcessor(req, res, next, options);
}

module.exports = [
    ['GET', '/pc/knowledge-mall/index',wxAuth({
        // 允许不登录访问
        allowFree: true
    }), index],
    ['GET', '/pc/knowledge-mall/manage', index],
    ['GET', '/pc/knowledge-mall/user-portrait', index],
];
