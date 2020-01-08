var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    clientParams = require('../../middleware/client-params/client-params'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    conf = require('../../conf');


var getChargeRecommendCourseList = (params, req) => {
    // let params = {
    //     page: {
    //         page: req.query.page,
    //         size: req.query.size
    //     }
    // };

    return proxy.parallelPromise([
        ['courseList', conf.baseApi.hotCharge, params, conf.baseApi.secret]
    ], req);
}

/**
 * 付费精品课程推荐列表分页接口
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var chargeCourseList = function(req, res, next) {
    var params = {
        page: {
            page: req.query.page,
            size: req.query.size
        }
    };

    getChargeRecommendCourseList(params, req).then(data => {
        resProcessor.jsonp(req, res, data.courseList);
    }).catch(err => {
        console.error(err);
        resProcessor.error500(req, res, err);
    });

    // proxy.apiProxy(conf.baseApi.hotCharge, params, function(err, body) {
    //     if (err) {
    //         resProcessor.error500(req, res, err);
    //         return;
    //     }
    //
    //     resProcessor.jsonp(req, res, body);
    // }, conf.baseApi.secret);
};

module.exports = [
    ['GET', '/api/app/recommend/charge/course-list', clientParams(), appAuth(), chargeCourseList]
];

module.exports.getChargeRecommendCourseList = getChargeRecommendCourseList;
