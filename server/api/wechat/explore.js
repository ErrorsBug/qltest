let _ = require('underscore');
let resProcessor = require('../../components/res-processor/res-processor');
let proxy = require('../../components/proxy/proxy');
let clientParams = require('../../middleware/client-params/client-params');
let appAuth = require('../../middleware/auth/1.0.0/app-auth');
let wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
let conf = require('../../conf');
let lo = require('lodash');
/**
 * 获取发现主页剩余列表数据
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
const getExploreList = function (req, res, next) {
    let params = _.pick(req.body, 'tagId');
    params.userId = lo.get(req, 'rSession.user.userId');

    // proxy.apiProxy(
    //     conf.appApi.explore.getExploreList,
    //     params,
    //     function (err, body) {
    //         if (err) {
    //             resProcessor.error500(req, res, err);
    //             return;
    //         }
    //         resProcessor.jsonp(req, res, body);
    //     },
    //     conf.appApi.secret);
    const mockData = require('./explore-list.mock.json');

    resProcessor.jsonp(req, res,
        {
            data: mockData,
            state: {
                code: 0,
                msg: '请求成功',
            },
        });
};

const getSpeciesList = function (req, res, next) {

    let params = {
        page: {
            page: lo.get(req, 'body.pageNum'),
            size: lo.get(req, 'body.pageSize'),
        },
        tagId: lo.get(req, 'body.tagId'),
    }

    proxy.parallelPromise([
        [conf.baseApi.rank.getTopicRank, params, conf.baseApi.secret],
    ], req).then(result => {
        let topics = lo.get(result, '0.data.topics', []);
        topics.forEach((value, index) => {
            if (!value['backgroundUrl']) {
                value['backgroundUrl'] = 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
            }
        });
        resProcessor.jsonp(req, res,
            {
                data: topics,
                state: {
                    code: 0,
                    msg: '请求成功 '
                }
            })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

const getLiveList = function (req, res, next) {
    let params = {
        page: {
            page: lo.get(req, 'body.pageNum'),
            size: lo.get(req, 'body.pageSize'),
        },
        isMore: 'Y',
        tagId: lo.get(req, 'body.tagId'),
        userId: lo.get(req, 'rSession.user.userId'),
        sid: lo.get(req, 'rSession.sessionId'),
    };

    proxy.parallelPromise([
        [conf.baseApi.explore.getLiveByTagId, params, conf.baseApi.secret],
    ], req).then(result => {
        let lives = lo.get(result, '0.data.lives', []);
        // 没有图则使用默认图
        lives.forEach((value, index) => {
            if (!value['logo']) {
                value['logo'] = '//img.qlchat.com/qlLive/liveCommon/liveHead.png';
            }
        });

        resProcessor.jsonp(req, res,
            {
                data: lives,
                state: {
                    code: 0,
                    msg: '请求成功',
                },
            });
    }).catch(err => {
        res.render('500');
        console.error(err);
    });

};

const getRankTopicList = function (req, res, next) {
    let params = {
        type: lo.get(req, 'body.type'),
        date: lo.get(req, 'body.date'),
        page: {
            page: lo.get(req, 'body.pageNum'),
            size: lo.get(req, 'body.pageSize'),
        }
    };
    params.userId = lo.get(req, 'rSession.user.userId');
    proxy.parallelPromise([
        [conf.baseApi.topicRank.getTopicRank, params, conf.baseApi.secret],
    ], req).then(result => {
        let topics = lo.get(result, '0.data.dataList', []);
        topics.forEach((value, index) => {
            if (!value['headImage']) {
                value['headImage'] = 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
            }
            if (!value['money']) {
                value['money'] = 0;
            }
        });
        resProcessor.jsonp(req, res,
            {
                data: topics,
                state: {
                    code: 0,
                    msg: '请求成功 '
                },
            })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

const getPeriodAndList = function(req, res, next){
    let params = {
        type: lo.get(req, 'body.type'),
        page: {
            page: 1,
            size: 20
        }
    };
    params.userId = lo.get(req, 'rSession.user.userId');
    proxy.parallelPromise([
        [conf.baseApi.topicRank.getTopicRank, params, conf.baseApi.secret],
        [conf.baseApi.topicRank.getPeriod, params, conf.baseApi.secret]
    ], req).then(result => {
        let topics = lo.get(result, '0.data.dataList', []);
        let period = lo.get(result, '1.data.dataList', []);
        topics.forEach((value, index) => {
            if (!value['headImage']) {
                value['headImage'] = 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
            }
            if (!value['money']) {
                value['money'] = 0;
            }
        });
        if (params.type === 'week') {
            period.forEach((value,index) => {
                if(value['dateEnd']){
                    var time = new Date(value['dateEnd']);
                    // var year = time.getFullYear();
                    var month = time.getMonth() + 1;
                    var date = time.getDate();
                    month = month < 10 ? '0' + month : month;
                    date = date < 10 ? '0' + date : date;
                    value['dateEnd'] = month + '-' + date;
                }
            })
        }
        resProcessor.jsonp(req, res,
            {
                data: topics,
                period: period,
                state: {
                    code: 0,
                    msg: '请求成功 '
                },
            })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

module.exports = [
    ['POST', '/api/wechat/explore/getExploreList', clientParams(), appAuth(), wxAuth(), getExploreList],
    // 加载小分类页列表数据
    ['POST', '/api/wechat/explore/getSpeciesList', clientParams(), appAuth(), wxAuth(), getSpeciesList],
    // 加载直播间列表数据
    ['POST', '/api/wechat/explore/getLiveList', clientParams(), appAuth(), wxAuth(), getLiveList],
    // 话题排行榜列表数据
    ['POST', '/api/wechat/explore/getRankTopicList', clientParams(), appAuth(), wxAuth(), getRankTopicList],
    ['POST', '/api/wechat/explore/getPeriodAndList', clientParams(), appAuth(), wxAuth(), getPeriodAndList]
    
];


