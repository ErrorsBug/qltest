// const _ = require('underscore');
const resProcessor = require('../../components/res-processor/res-processor');
const proxy = require('../../components/proxy/proxy');
const clientParams = require('../../middleware/client-params/client-params');
const lo = require('lodash');
const conf = require('../../conf');
const appAuth = require('../../middleware/auth/1.0.0/app-auth');


function imageFactory(list, attr, defaultUrl, suffix) {
    if (Array.isArray(list) && list.length) {
        list.forEach((val, index) => {
            if (!val[attr]) {
                val[attr] = defaultUrl;
            }
        });
        list.map((val) => {
            return val += suffix;
        });
    }
}

function topicSearch(req, res, next) {

    let params = lo.get(req, 'query');

    params.page = {
        page: req.query.page,
        size: req.query.size
    };

    proxy.apiProxy(conf.baseApi.searchTopic, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        if (body.state && body.state.code === 0) {
            let topics = lo.get(body, 'data.topics', []);
            let page = lo.get(body, 'data.page');
            let topicEnd = false;

            if (Array.isArray(topics)) {
                imageFactory(topics, 'backgroundUrl',
                    'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg',
                    '@120h_120w_1e_1c_2o');
            }
            if (page && page.page === page.totalPage) {
                topicEnd = true;
            }
            resProcessor.jsonp(req, res, {
                data: { topics, topicEnd },
                state: {
                    code: 0,
                    msg: '请求成功 ',
                },
            });
        }
    }, conf.baseApi.secret, req);
}

function liveSearch(req, res, next) {

    let params = lo.get(req, 'query');

    params.page = {
        page: req.query.page,
        size: req.query.size
    };

    proxy.apiProxy(conf.baseApi.searchLive, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        if (body.state && body.state.code === 0) {
            let lives = lo.get(body, 'data.entities');
            let page = lo.get(body, 'data.page');
            let liveEnd = false;

            if (Array.isArray(lives)) {
                imageFactory(lives, 'logo',
                    '//img.qlchat.com/qlLive/liveCommon/liveHead.png',
                    '@120h_120w_1e_1c_2o');
            }
            if (page && page.page === page.totalPage) {
                liveEnd = true;
            }
            resProcessor.jsonp(req, res, {
                data: { lives, liveEnd },
                state: {
                    code: 0,
                    msg: '请求成功 ',
                },
            });
        }
    }, conf.baseApi.secret, req);
}

function channelSearch(req, res, next) {

    let params = lo.get(req, 'query');

    params.page = {
        page: req.query.page,
        size: req.query.size
    };

    proxy.apiProxy(conf.baseApi.searchChannel, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        if (body.state && body.state.code === 0) {
            let channels = lo.get(body, 'data.channels');
            let page = lo.get(body, 'data.page');
            let channelEnd = false;

            if (Array.isArray(channels)) {
                imageFactory(channels, 'headImage',
                    '//img.qlchat.com/qlLive/liveCommon/normalLogo.png',
                    '@120h_120w_1e_1c_2o');
            }
            if (page && page.page === page.totalPage) {
                channelEnd = true;
            }
            resProcessor.jsonp(req, res, {
                data: { channels, channelEnd },
                state: {
                    code: 0,
                    msg: '请求成功 ',
                },
            });
        }
    }, conf.baseApi.secret, req);
}

function allSearch(req, res, next) {
    const params = lo.get(req, 'query');

    const tasks = [
        ['topic', conf.baseApi.searchTopic, params, conf.baseApi.secret],
        ['channel', conf.baseApi.searchChannel, params, conf.baseApi.secret],
        ['live', conf.baseApi.searchLive, params, conf.baseApi.secret],
    ];

    proxy.parallelPromise(tasks, req).then(function (results) {
        let topics = lo.get(results, 'topic.data.topics', []);
        let channels = lo.get(results, 'channel.data.channels', []);
        let lives = lo.get(results, 'live.data.entities', []);

        let topicsPage = lo.get(results, 'topic.data.page');
        let channelsPage = lo.get(results, 'channel.data.page');
        let livesPage = lo.get(results, 'live.data.page');

        let topicEnd = false;
        let channelEnd = false;
        let liveEnd = false;

        if (Array.isArray(topics)) {
            imageFactory(topics, 'backgroundUrl',
                'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg',
                '@120h_120w_1e_1c_2o');
        }
        if (Array.isArray(lives)) {
            imageFactory(lives, 'logo',
                '//img.qlchat.com/qlLive/liveCommon/liveHead.png',
                '@120h_120w_1e_1c_2o');
        }
        if (Array.isArray(channels)) {
            imageFactory(channels, 'headImage',
                '//img.qlchat.com/qlLive/liveCommon/normalLogo.png',
                '@120h_120w_1e_1c_2o');
        }

        if (!topicsPage || topicsPage.page === topicsPage.totalPage) { topicEnd = true; }
        if (!channelsPage || channelsPage.page === channelsPage.totalPage) { channelEnd = true }
        if (!livesPage || livesPage.page === livesPage.totalPage) { liveEnd = true; }

        resProcessor.jsonp(req, res, {
            data: { topics, lives, channels, channelEnd, topicEnd, liveEnd },
            state: {
                code: 0,
                msg: '请求成功 ',
            },

        });
    }).catch(function (err) {
        res.render('500');
        console.error(err);
    });
}

module.exports = [

    ['GET', '/api/app/search/topic', clientParams(), appAuth(), topicSearch],
    ['GET', '/api/app/search/channel', clientParams(), appAuth(), channelSearch],
    ['GET', '/api/app/search/live', clientParams(), appAuth(), liveSearch],
    ['GET', '/api/app/search/all', clientParams(), appAuth(), allSearch],
];
