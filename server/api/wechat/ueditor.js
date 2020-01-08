const lo = require('lodash');

const proxy = require('../../components/proxy/proxy')
const conf = require('../../conf')

const clientParams = require('../../middleware/client-params/client-params')
const wxAuth = require('../../middleware/auth/1.0.0/wx-auth')
const appAuth = require('../../middleware/auth/1.0.0/app-auth')
const resProcessor = require('../../components/res-processor/res-processor')
const requestProcess = require('../../middleware/request-process/request-process')

module.exports = [
    ['POST', '/api/wechat/ueditor/getSummary', requestProcess(conf.baseApi.ueditor.getSummary, conf.baseApi.secret)],
    ['POST', '/api/wechat/ueditor/addSummary', requestProcess(conf.baseApi.ueditor.addSummary, conf.baseApi.secret)],
]