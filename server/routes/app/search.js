let path = require('path');
let _ = require('underscore');
let lo = require('lodash');
let async = require('async');
let clientParams = require('../../middleware/client-params/client-params');
let proxy = require('../../components/proxy/proxy');
let resProcessor = require('../../components/res-processor/res-processor');
let htmlProcessor = require('../../components/html-processor/html-processor');
let conf = require('../../conf');
let appAuth = require('../../middleware/auth/1.0.0/app-auth');


function authorMap(list, authorList){
    return list.map(function(item){
        item.isAuthor = authorList.indexOf(item.id) > -1;
        return item;
    })
}

/**
 * 对图片地址做默认图和裁剪处理
 *
 * @param {any} list - 数据
 * @param {any} attr - 图片属性名
 * @param {any} defaultUrl - 默认地址
 * @param {any} suffix - 裁剪后缀
 */
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

/**
 * 搜索主页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageSearchIndex(req, res, next) {
    const filePath = path.resolve(__dirname, '../../../public/app/page/search/search.html');
    let options = {
        filePath,
        fillVars: {},
        renderData: {},
    };
    options.fillVars.NOWTIME = new Date().getTime();

    htmlProcessor(req, res, next, options);
}

function pageSearchAll(req, res, next) {
    const filePath = path.resolve(__dirname, '../../../public/app/page/search-all/search-all.html')
    let options = {
        filePath,
        fillVars: {},
        renderData: {},
    }
    const keyword = lo.get(req, 'query.keyword')

    options.fillVars.KEYWORD = keyword
    options.fillVars.NOWTIME = new Date().getTime()

    const params = {
        keyword,
        page: {
            page: 1,
            size: 3,
        },
    }

    const tasks = [
        ['topic', conf.baseApi.searchTopic, params, conf.baseApi.secret],
        ['live', conf.baseApi.searchLive, params, conf.baseApi.secret],
        ['channel', conf.baseApi.searchChannel, params, conf.baseApi.secret],
        ['authList', conf.baseApi.live.authorities, {}, conf.baseApi.secret],
    ]

    proxy.parallelPromise(tasks, req).then(function (results) {
        let topics = lo.get(results, 'topic.data.topics', []);
        let channels = lo.get(results, 'channel.data.channels', []);
        let lives = lo.get(results, 'live.data.entities', []);
        let authList = lo.get(results, 'authList.data.dataList', []);

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
        lives = authorMap(lives, authList)
        if (Array.isArray(channels)) {
            imageFactory(channels, 'headImage',
                '//img.qlchat.com/qlLive/liveCommon/normalLogo.png',
                '@120h_120w_1e_1c_2o');
        }

        if (!topicsPage || topicsPage.page === topicsPage.totalPage) { topicEnd = true; }
        if (!channelsPage || channelsPage.page === channelsPage.totalPage) { channelEnd = true }
        if (!livesPage || livesPage.page === livesPage.totalPage) { liveEnd = true; }

        let hasContent = false
        if (topics.length || lives.length || channels.length) {
            hasContent = true
        }
        options.fillVars.AUTHORITY_LIST = authList;
        options.renderData = { topics, channels, lives, topicEnd, channelEnd, liveEnd, hasContent, keyword }

        htmlProcessor(req, res, next, options);
    }).catch(function (err) {
        res.render('500');
        console.error(err);
    });

}

function pageSearchTopic(req, res, next) {
    const filePath = path.resolve(__dirname, '../../../public/app/page/search-topic/search-topic.html')
    let options = {
        filePath,
        fillVars: {},
        renderData: {},
    }
    const keyword = lo.get(req, 'query.keyword')

    options.fillVars.KEYWORD = keyword
    options.fillVars.NOWTIME = new Date().getTime()

    const params = {
        keyword,
        page: {
            page: 1,
            size: 20,
        },
    }

    proxy.apiProxy(conf.baseApi.searchTopic, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        if (body.state && body.state.code === 0) {
            let topics = lo.get(body, 'data.topics', []);
            let page = lo.get(body, 'data.page');
            let minimumShouldMatch = lo.get(body, 'data.minimumShouldMatch')

            let topicEnd = false;

            if (Array.isArray(topics)) {
                imageFactory(topics, 'backgroundUrl',
                    'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg',
                    '@120h_120w_1e_1c_2o');
            }
            if (page && page.page === page.totalPage) {
                topicEnd = true;
            }

            options.fillVars.TOPICEND = topicEnd
            options.fillVars.minimumShouldMatch = minimumShouldMatch
            options.renderData = { topics, topicEnd, keyword }

            htmlProcessor(req, res, next, options);
        }
    }, conf.baseApi.secret, req);
}

function pageSearchLive(req, res, next) {
    const filePath = path.resolve(__dirname, '../../../public/app/page/search-live/search-live.html')
    let options = {
        filePath,
        fillVars: {},
        renderData: {},
    }
    const keyword = lo.get(req, 'query.keyword')

    options.fillVars.KEYWORD = keyword
    options.fillVars.NOWTIME = new Date().getTime()

    const params = {
        keyword,
        page: {
            page: 1,
            size: 20,
        },
    }

    const tasks = [
        ['live', conf.baseApi.searchLive, params, conf.baseApi.secret],
        ['authList', conf.baseApi.live.authorities, {}, conf.baseApi.secret],
    ]

    proxy.parallelPromise(tasks, req).then(function(results){
        let lives = lo.get(results, 'live.data.entities', []);
        let page = lo.get(results, 'live.data.page');
        let minimumShouldMatch = lo.get(results, 'live.data.minimumShouldMatch')
        let authList = lo.get(results, 'authList.data.dataList');

        lives = authorMap(lives, authList)
        let liveEnd = false;

        if (Array.isArray(lives)) {
            imageFactory(lives, 'logo',
                '//img.qlchat.com/qlLive/liveCommon/liveHead.png',
                '@120h_120w_1e_1c_2o');
        }
        if (page && page.page === page.totalPage) {
            liveEnd = true;
        }

        options.fillVars.LIVEEND = liveEnd;
        options.fillVars.minimumShouldMatch = minimumShouldMatch
        options.fillVars.AUTHORITY_LIST = authList;
        options.renderData = { lives, liveEnd, keyword };

        htmlProcessor(req, res, next, options);
    })
}

function pageSearchChannel(req, res, next) {
    const filePath = path.resolve(__dirname, '../../../public/app/page/search-channel/search-channel.html')
    let options = {
        filePath,
        fillVars: {},
        renderData: {},
    }
    const keyword = lo.get(req, 'query.keyword')

    options.fillVars.KEYWORD = keyword
    options.fillVars.NOWTIME = new Date().getTime()

    const params = {
        keyword,
        page: {
            page: 1,
            size: 20,
        },
    }

    proxy.apiProxy(conf.baseApi.searchChannel, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        if (body.state && body.state.code === 0) {
            let channels = lo.get(body, 'data.channels', []);
            let minimumShouldMatch = lo.get(body, 'data.minimumShouldMatch')
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

            options.fillVars.CHANNELEND = channelEnd
            options.fillVars.minimumShouldMatch = minimumShouldMatch
            options.renderData = { channels, channelEnd, keyword }

            htmlProcessor(req, res, next, options);
        }
    }, conf.baseApi.secret, req);
}

module.exports = [
    /* 搜索页带搜索栏*/
    ['GET', '/app/page/search/index', clientParams(), appAuth(), pageSearchIndex],
    /* 全部搜索结果*/
    ['GET', '/app/page/search/result', clientParams(), appAuth(), pageSearchAll],
    /* 话题搜索结果*/
    ['GET', '/app/page/search/topic', clientParams(), appAuth(), pageSearchTopic],
    /* 频道搜索结果*/
    ['GET', '/app/page/search/channel', clientParams(), appAuth(), pageSearchChannel],
    /* 直播间搜索结果*/
    ['GET', '/app/page/search/live', clientParams(), appAuth(), pageSearchLive],
];
