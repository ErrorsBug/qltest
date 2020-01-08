let path = require('path');
let _ = require('underscore');
let async = require('async');
let wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
let appAuth = require('../../middleware/auth/1.0.0/app-auth');
let proxy = require('../../components/proxy/proxy');
let resProcessor = require('../../components/res-processor/res-processor');
let htmlProcessor = require('../../components/html-processor/html-processor');
let conf = require('../../conf');
let lo = require('lodash');
let clientParams = require('../../middleware/client-params/client-params');

const pageExploreRankTopic = function (req, res, next) {
    let filePath = path.resolve(__dirname, '../../../public/wechat/page/explore-rank-topic/explore-rank-topic.html');
    let options = {
        filePath: filePath,
        fillVars: {},
        renderData: {
            list: [],
        },
    };
    let $type = req.query.type?req.query.type:'new';
    let $period;
    if(req.query.period){
        if($type === 'week'){
            $period = req.query.period.split('to')[0];
        }else{
            $period = req.query.period;
        }
    }else{
        $period = ''
    }
    let params = {
        type: $type,
        date: $period,
        page: {
            page: 1,
            size: 20,
        },
        userId: lo.get(req, 'rSession.user.userId'),
        sid: lo.get(req, 'rSession.sessionId'),
    };
    proxy.parallelPromise([
        [conf.baseApi.topicRank.getTopicRank, params, conf.baseApi.secret],
        [conf.baseApi.topicRank.getPeriod, params, conf.baseApi.secret],
    ], req).then(result => {
        let topics = lo.get(result, '0.data.dataList');
        let period = lo.get(result, '1.data.dataList');
        // 没有图则使用默认图
        if (typeof topics == 'array') {
            topics.forEach((value, index) => {
                if (!value['headImage']) {
                    value['headImage'] = 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
                }
                if (!value['money']) {
                    value['money'] = 0;
                }
            });
        }
        //格式化周榜的结束时间
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
        let type = params.type;
        options.fillVars.INITDATES = period;
        options.renderData.dates = period;
        options.fillVars.INITDATA = topics;
        options.renderData.topics = topics;
        options.fillVars.INITTYPE= type;
        options.renderData.type = type;
        options.fillVars.NOWTIME = new Date().getTime();
        htmlProcessor(req, res, next, options);
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

module.exports = [
    // 热门话题排行榜页
    ['GET', '/wechat/page/rank/topic', clientParams(), appAuth(), wxAuth(), pageExploreRankTopic]
];
