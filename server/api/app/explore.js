let _ = require('underscore');
let resProcessor = require('../../components/res-processor/res-processor');
let proxy = require('../../components/proxy/proxy');
let clientParams = require('../../middleware/client-params/client-params');
let appAuth = require('../../middleware/auth/1.0.0/app-auth');
let conf = require('../../conf');
let lo = require('lodash');

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
        page: {
            page: lo.get(req, 'body.pageNum'),
            size: lo.get(req, 'body.pageSize'),
        },
        tagId: lo.get(req, 'body.tagId'),
    }
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.parallelPromise([
        [conf.baseApi.rank.getTopicRank, params, conf.baseApi.secret],
    ],req).then(result => {
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
                },
            })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

module.exports = [
    // 加载小分类页列表数据
    ['POST', '/api/app/explore/getSpeciesList', clientParams(), appAuth(), getSpeciesList],
    // 加载直播间列表数据
    ['POST', '/api/app/explore/getLiveList', clientParams(), appAuth(), getLiveList],
    // 话题排行榜列表数据
    ['POST', '/api/app/explore/getRankTopicList', clientParams(), appAuth(), getRankTopicList],
];
