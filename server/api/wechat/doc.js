var wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');




module.exports = [
    // 获取文件列表
    ['POST', '/api/wechat/doc/getTopicDocs', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.doc.getTopicDocs, conf.baseApi.secret)],
    // 删除文件
    ['POST', '/api/wechat/doc/delete', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.doc.delete, conf.baseApi.secret)],
    // 修改文件配置
    ['POST', '/api/wechat/doc/modify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.doc.modify, conf.baseApi.secret)],
    // 获取文档下载路径
    ['POST', '/api/wechat/doc/auth', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.doc.auth, conf.baseApi.secret)],
];
