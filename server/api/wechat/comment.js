var wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');




module.exports = [
    // 编辑评论
    ['POST', '/api/wechat/comment/update', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.update, conf.baseApi.secret)],
    //获取课程评论
    ['POST', '/api/wechat/comment/getList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.get, conf.baseApi.secret)],
    // 获取课程下的评论列表
    ['POST', '/api/wechat/comment/getCourseComment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.getCourseComment, conf.baseApi.secret)],
    // b端获取所有被评论的课程列表
    ['POST', '/api/wechat/comment/getLiveCourseList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.getLiveCourseList, conf.baseApi.secret)],
    // c端获取所有被评论的评论列表
    ['POST', '/api/wechat/comment/getUserCommentList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.getUserCommentList, conf.baseApi.secret)],
    // 获取某条评论的详情，包括父评论
    ['POST', '/api/wechat/comment/getCommentDetail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.getCommentDetail, conf.baseApi.secret)],
    // 获取评论的评论列表
    ['POST', '/api/wechat/comment/getCommentReplyList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.getCommentReplyList, conf.baseApi.secret)],
    // 清除消息红点
    ['POST', '/api/wechat/comment/cleanCommentRedDot', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.cleanCommentRedDot, conf.baseApi.secret)],
    // 获取直播间未读评论数
    ['POST', '/api/wechat/comment/getLiveCommentNum', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.getLiveCommentNum, conf.baseApi.secret)],
];