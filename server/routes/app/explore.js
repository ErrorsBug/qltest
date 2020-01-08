let path = require('path');
let _ = require('underscore');
let async = require('async');
let appAuth = require('../../middleware/auth/1.0.0/app-auth');
let clientParams = require('../../middleware/client-params/client-params');
let proxy = require('../../components/proxy/proxy');
let resProcessor = require('../../components/res-processor/res-processor');
let htmlProcessor = require('../../components/html-processor/html-processor');
let conf = require('../../conf');
let lo = require('lodash');

/**
 * 发现首页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageExploreIndex(req, res, next) {
    let filePath = path.resolve(__dirname, '../../../public/app/page/explore-index/explore-index.html');
    let options = {
        filePath: filePath,
        fillVars: {},
        renderData: {
            sorts: [],
            ranks: [],
            recommonds: [],
        },
    };

    // let params = {};

    // proxy.parallelPromise([
    //     [conf.appApi.explore.someApi, params, conf.appApi.secret],
    // ]).then((res) => {

    // }).then(() => {

    // }).catch((err) => {
    //     res.render('500');
    //     console.error(err);
    // });

    const mockData = require('./explore-index.mock.json');
    options.renderData.sorts = lo.get(mockData, 'sorts');
    options.renderData.ranks = lo.get(mockData, 'ranks');
    options.renderData.recommonds = lo.get(mockData, 'recommonds');

    options.fillVars.INITDATA = options.renderData;
    options.fillVars.NOWTIME = new Date().getTime();

    htmlProcessor(req, res, next, options);
}

const pageExploreRankTopic = function (req, res, next) {
    let filePath = path.resolve(__dirname, '../../../public/app/page/explore-rank-topic/explore-rank-topic.html');
    let options = {
        filePath: filePath,
        fillVars: {},
        renderData: {
            list: [],
        },
    };

    let params = {
        page: {
            page: 1,
            size: 20,
        },
        tagId: 0,
        userId: lo.get(req, 'rSession.user.userId'),
        sid: lo.get(req, 'rSession.sessionId'),
    };

    proxy.parallelPromise([
        [conf.baseApi.rank.getTopicRank, params, conf.baseApi.secret],
    ], req).then(result => {
        let topics = lo.get(result, '0.data.topics');
        // 没有图则使用默认图
        if (typeof topics == 'array') {
            topics.forEach((value, index) => {
                if (!value['backgroundUrl']) {
                    value['backgroundUrl'] = 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
                }
            });
        }

        options.fillVars.INITDATA = topics;
        options.renderData.topics = topics;
        options.fillVars.NOWTIME = new Date().getTime();

        htmlProcessor(req, res, next, options);
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

const pageExploreAssort = function (req, res, next) {
    let filePath = path.resolve(__dirname, '../../../public/app/page/explore-assort/explore-assort.html');
    let options = {
        filePath: filePath,
        fillVars: {},
        renderData: {
            list: [],
        },
    };

    let params = {
        page: {
            page: 1,
            size: 10,
        },
        isMore: 'N',
        tagId: lo.get(req, 'params.tagId'),
        userId: lo.get(req, 'rSession.user.userId'),
    };

    options.renderData.tagId = params.tagId;

    proxy.parallelPromise([
        [conf.baseApi.explore.getBannerByTagId, {...params, twUserTag: lo.get(req, 'query.twUserTag', '')}, conf.baseApi.secret],
        [conf.baseApi.explore.getRecommend, params, conf.baseApi.secret],
        [conf.baseApi.explore.getLiveByTagId, params, conf.baseApi.secret],
        [conf.baseApi.explore.getChannelByTagId, params, conf.baseApi.secret],
    ], req).then(result => {
        let banners = lo.get(result, '0.data.banners', []);
        let topics = lo.get(result, '1.data.topics', []);
        let lives = lo.get(result, '2.data.lives', []);
        let channels = lo.get(result, '3.data.channels', []);

        if (Array.isArray(topics)) {
            topics.forEach(defaultImg('https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg', 'backgroundUrl'));
        }
        if (Array.isArray(lives)) {
            lives.forEach(defaultImg('//img.qlchat.com/qlLive/liveCommon/liveHead.png', 'logo'));
            lives=lives.splice(0, 5);
        }
        if (Array.isArray(channels)) {
            channels.forEach(defaultImg('https://img.qlchat.com/qlLive/liveCommon/normalLogo.png', 'headImage'));
        }

        options.renderData.banners = banners;
        options.renderData.topics = topics;
        options.renderData.lives = lives
        options.renderData.channels = channels;

        options.fillVars.INITDATA = {
            banners: banners,
            topics: topics,
            lives: lives,
            channels: channels,
        }
        options.fillVars.NOWTIME = new Date().getTime();
        htmlProcessor(req, res, next, options);
    }).catch(err => {
        res.render('500');
        console.error(err);
    });

    // const mockData = require('./explore-assort.mock.json');
    // options.renderData = mockData;
    // /* 将每个列表放到renderData中*/
    // options.renderData.topics = lo.get(mockData, 'topics').slice(0, 5);
    // options.renderData.lives = lo.get(mockData, 'lives').slice(0, 4);
    // options.renderData.channels = lo.get(mockData, 'channels').slice(0, 3);
    // options.renderData.banners = lo.get(mockData, 'banners');
    // /* 对每个列表的图片进行默认值处理*/

    function defaultImg(src, key) {
        /* 返回一个foreach函数设置默认值*/
        return function (value, index) {
            if (!value[key]) {
                value[key] = src;
            }
        };
    }

    // options.fillVars.NOWTIME = new Date().getTime();

    // htmlProcessor(req, res, next, options);
};

const pageExploreSpecies = function (req, res, next) {
    let filePath = path.resolve(__dirname, '../../../public/app/page/explore-species/explore-species.html');
    let options = {
        filePath: filePath,
        fillVars: {},
        renderData: {
            list: [],
        },
    };

    let params = {
        page: {
            page: 1,
            size: 20,
        },
        tagId: lo.get(req, 'params.tagId'),
        userId: lo.get(req, 'rSession.user.userId'),
        sid: lo.get(req, 'rSession.sessionId'),
    };

    proxy.parallelPromise([
        [conf.baseApi.rank.getTopicRank, params, conf.baseApi.secret],
    ], req).then(result => {
        let topics = lo.get(result, '0.data.topics');
        // 没有图则使用默认图
        if (typeof topics == 'array') {
            topics.forEach((value, index) => {
                if (!value['backgroundUrl']) {
                    value['backgroundUrl'] = 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
                }
            });
        }

        options.fillVars.INITDATA = topics;
        options.renderData.topics = topics;
        options.fillVars.NOWTIME = new Date().getTime();

        htmlProcessor(req, res, next, options);
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

const pageExploreLive = function (req, res, next) {
    let filePath = path.resolve(__dirname, '../../../public/app/page/explore-live/explore-live.html');
    let options = {
        filePath: filePath,
        fillVars: {},
        renderData: {
            list: [],
        },
    };

    let params = {
        page: {
            page: 1,
            size: 20,
        },
        isMore: 'Y',
        tagId: lo.get(req, 'params.tagId'),
        userId: lo.get(req, 'rSession.user.userId'),
    }

    proxy.parallelPromise([
        [conf.baseApi.explore.getLiveByTagId, params, conf.baseApi.secret],
    ], req).then(result => {
        let lives = lo.get(result, '0.data.lives', []);
        // 没有图则使用默认图
        if (typeof lives == 'array') {
            lives.forEach((value, index) => {
                if (!value['logo']) {
                    value['logo'] = '//img.qlchat.com/qlLive/liveCommon/liveHead.png';
                }
            });
        }

        options.fillVars.INITDATA = lives;
        options.renderData.lives = lives;
        options.fillVars.NOWTIME = new Date().getTime();

        htmlProcessor(req, res, next, options);
    }).catch(err => {
        res.render('500');
        console.error(err);
    });

};

module.exports = [
    // 发现首页
    ['GET', '/app/page/explore/index', clientParams(), appAuth(), pageExploreIndex],
    // 热门话题排行榜页
    ['GET', '/app/page/rank/topic', clientParams(), appAuth(), pageExploreRankTopic],
    // 发现，大分类页
    ['GET', '/app/page/explore/assort/:tagId', clientParams(),  appAuth(),  pageExploreAssort],
    // 发现，小分类页
    ['GET', '/app/page/explore/species/:tagId', clientParams(), appAuth(), pageExploreSpecies],
    // 发现，直播间页
    ['GET', '/app/page/explore/live/:tagId', clientParams(), appAuth(), pageExploreLive],
];
