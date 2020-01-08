var path = require('path'),
    _ = require('underscore'),
    util = require('util'),
    lo = require('lodash'),
    {stringify} = require('querystring'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    proxy = require('../../components/proxy/proxy'),
    // resProcessor = require('../../components/res-processor/res-processor'),
    conf = require('../../conf'),
    envi = require('../../components/envi/envi'),
    htmlProcessor = require('../../components/html-processor/html-processor'),
    requestProcess = require('../../middleware/request-process/request-process');




/**
 * 认证页面需要添加支付功能。
 * 所以添加重定向
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 * @returns 
 */
function redirectLiveAuth(req, res, next) {
    let liveId = lo.get(req, 'params.liveId', '');
    const data = {
        ...req.query,
    }
    if (liveId) {
        data.liveId = liveId;
    }
    const queryResult = stringify(data);
    res.redirect(`/wechat/page/live-auth?${queryResult}`);
    return false;

}


function pageLiveIntroEdit(req, res, next) {
    const liveId = lo.get(req, 'params.liveId', '');

    const filePath = path.resolve(__dirname, '../../../public/wechat/page/live-intro-edit/live-intro-edit.html');
    let options = {
        filePath: filePath,
        fillVars: {
            LIVE_ID: liveId,
            NOWTIME: Date.now(),
        },
        renderData: {},
    };

    let params = {
        liveId: liveId,
        clientType: 'wechat',
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    var tasks = [
        ['liveInfo', conf.baseApi.live.role, params, conf.baseApi.secret],
        ['profileList', conf.baseApi.live.profile, params, conf.baseApi.secret],
    ];

    proxy.parallelPromise(tasks, req).then(function (results) {
        let role = lo.get(results, 'liveInfo.data.role');
        let introduce = lo.get(results, 'profileList.data.introduce');
        let profile = lo.get(results, 'profileList.data.profileList', []);
        if (!role) {
            res.redirect('/wechat/page/live/' + liveId );
            return;
        }
        options.fillVars.PROFILE = profile;
        options.renderData = { introduce, profile };

        htmlProcessor(req, res, next, options);
    }).catch(function (err) {
        res.render('500');
        console.error(err);
    });


}

function pageMessageManage(req, res, next) {
    const topicId = lo.get(req, 'params.topicId', '');
    const type = lo.get(req, 'query.type', '');

    const filePath = path.resolve(__dirname, '../../../public/wechat/page/message-list/message-list.html');
    let options = {
        filePath: filePath,
        fillVars: {
            TOPIC_ID: topicId,
        },
        renderData: {},
    };

    let params = {
        topicId: topicId,
        type: type === 'topic' ? 'topic' : 'channel',
        page: {
            page: 1,
            size: 20,
        },
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    var tasks = [
        ['messagesList', conf.wechatApi.live.messagesList, params, conf.wechatApi.secret],

    ];

    proxy.parallelPromise(tasks, req).then(function (results) {
        let messages = lo.get(results, 'messagesList.data.consultList', []);
        options.fillVars.MESSAGES = messages;
        htmlProcessor(req, res, next, options);
    }).catch(function (err) {
        res.render('500');
        console.error(err);
    });


}
function pageMessage(req, res, next) {
    const liveId = lo.get(req, 'params.liveId', '');

    const filePath = path.resolve(__dirname, '../../../public/wechat/page/message/message.html');
    let options = {
        filePath: filePath,
        fillVars: {
            LIVE_ID: liveId,
        },
        renderData: {},
    };

    let params = {
        liveId: liveId,
        clientType: 'wechat',
        type: 'topic',
        page: {
            page: 1,
            size: 20,
        },
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    var tasks = [
        ['topicMessages', conf.wechatApi.live.messages, Object.assign({}, params, {type: 'topic'}), conf.wechatApi.secret],
        ['channelMessages', conf.wechatApi.live.messages, Object.assign({}, params, {type: 'channel'}), conf.wechatApi.secret],
        ['tabNumbers', conf.wechatApi.live.unReplayCount, params, conf.wechatApi.secret],
    ];

    proxy.parallelPromise(tasks, req).then(function (results) {
        let topics = lo.get(results, 'topicMessages.data.topicList', []);
        let channels = lo.get(results, 'channelMessages.data.topicList', []);
        let tabNumbers = lo.get(results, 'tabNumbers.data', []);

        options.fillVars.TOPICS = topics;
        options.fillVars.CHANNELS = channels;
        options.fillVars.TAB_NUMBERS = tabNumbers;
        htmlProcessor(req, res, next, options);
    }).catch(function (err) {
        res.render('500');
        console.error(err);
    });
}

function shareCard (req, res, next) {
    const filePath = path.resolve(__dirname, '../../../public/wechat/page/sharecard/sharecard.html');
    let options = {
        filePath: filePath,
        fillVars: {
        },
        renderData: {
            isVconsole: req.query._vcdebug || false
        },
    };
    const type = req.query.type;
    options.fillVars.TYPE = type;
    options.renderData.type = type;
    // 课堂红包相关
    options.fillVars.wcl = req.query.wcl || '';
    options.fillVars.CHANNEL = lo.get(req, 'query.channel', '');
    options.fillVars.redEnvelopeId = req.query.redEnvelopeId || ''; 
    options.fillVars.userId = lo.get(req, 'rSession.user.userId'); 

    const liveId = req.query.liveId;

    const userId = lo.get(req, 'rSession.user.userId');
    const source_type = lo.get(req, 'query.sourceNo');

    const tasks = [];

    tasks.push(['shareCardBgList', conf.baseApi.shareCardBgList, {type:type}, conf.baseApi.secret]);//customShareBgImg
    tasks.push(['isLiveAdmin', conf.baseApi.isLiveAdmin, { liveId }, conf.baseApi.secret]); // 是否专业版直播间
    tasks.push(['isWhiteListLive', conf.baseApi.live.isServiceWhiteLive, { liveId }, conf.baseApi.secret]); // 是否白名单直播间
    tasks.push(['isQlchatLive', conf.baseApi.isQlLive, { liveId }, conf.baseApi.secret]); // 是否千聊官方直播间
    

    let psKey = lo.get(req, 'query.psKey','');
    if (type === 'topic') {
        const topicId = req.query.topicId;
        const liveId = req.query.liveId;
        options.fillVars.liveId = liveId;
        if (!topicId) {
            res.render('500', { msg: '无效的话题ID' });
            return;
        }
        let topicShareCardParams = { 
            topicId: topicId, 
            userId: userId, 
            showQl: (source_type=="livecenter"?"Y":"N"),
            channel: req.query.channel || ''
        }
        if (psKey) {
            topicShareCardParams.psKey = userId;
        }
        // 课堂红包
        if(req.query.redEnvelopeId){
            topicShareCardParams.redEnvelopeId = req.query.redEnvelopeId
            topicShareCardParams.channel = 'redEnvelopeShareCard'
        }
        if(req.query.missionId){
            topicShareCardParams.channel = 'inviteReturnMission'
        }
        if(req.query.isCenter){
            topicShareCardParams.isCenter = true
        }
	    tasks.push(['power', conf.wechatApi.common.getPower,{topicId,userId}, conf.wechatApi.secret]);
        tasks.push(['shareCardData', conf.baseApi.topic.shareCardData, topicShareCardParams, conf.baseApi.secret]);
        tasks.push(['customShareInfo', conf.baseApi.share.getCustomShareInfo, { businessId: topicId, userId: userId ,type:"topic" }, conf.baseApi.secret]);
        tasks.push(['courseIndexStatus', conf.baseApi.live.getCourseIndexStatus, {businessId: topicId, userId: userId, type: 'topic'}, conf.baseApi.secret]);
        tasks.push(['getKnowledgeId', conf.shortKnowledgeApi.getKnowledgeByBusinessId, {businessId:  topicId}, conf.shortKnowledgeApi.secret])
        // 获取邀请卡三方公众号关注配置
        tasks.push(['getThirdConf', conf.baseApi.live.getOpsAppIdSwitchConf, {channel:  '201', liveId: liveId}, conf.baseApi.secret])
    } else if (type === 'channel') {
        const channelId = req.query.channelId;
        const liveId = req.query.liveId;
        options.fillVars.liveId = liveId;
        if (!channelId) {
            res.render('500', { msg: '无效的系列课ID' });
            return;
        }
        let channelShareCardParams = { 
            channelId: channelId, 
            userId, 
            showQl: (source_type=="livecenter"?"Y":"N"),
            channel: req.query.channel || ''
        }
        if (psKey) {
            channelShareCardParams.psKey = userId;
        }
        // 课堂红包
        if(req.query.redEnvelopeId){
            channelShareCardParams.redEnvelopeId = req.query.redEnvelopeId
            channelShareCardParams.channel = 'redEnvelopeShareCard'
        }
        if(req.query.missionId){
            channelShareCardParams.missionId = req.query.missionId
            channelShareCardParams.channel = 'inviteReturnMission'
        }
        if(req.query.isCenter){
            channelShareCardParams.isCenter = true
        }
	    tasks.push(['power', conf.wechatApi.common.getPower,{channelId,userId}, conf.wechatApi.secret]);
	    tasks.push(['shareCardData', conf.baseApi.channel.shareCardData, channelShareCardParams, conf.baseApi.secret]);
        tasks.push(['customShareInfo', conf.baseApi.share.getCustomShareInfo, { businessId: channelId, userId: userId , type: 'channel'}, conf.baseApi.secret]);
        tasks.push(['courseIndexStatus', conf.baseApi.live.getCourseIndexStatus, {businessId: channelId, userId: userId, type: 'channel'}, conf.baseApi.secret]);
        tasks.push(['getKnowledgeId', conf.shortKnowledgeApi.getKnowledgeByBusinessId, {businessId:  channelId}, conf.shortKnowledgeApi.secret])
        // 获取邀请卡三方公众号关注配置
        tasks.push(['getThirdConf', conf.baseApi.live.getOpsAppIdSwitchConf, {channel:  '201', liveId: liveId}, conf.baseApi.secret])
    } else if (type === 'live') {
        const liveId = req.query.liveId;
        if (!liveId) {
            res.render('500', { msg: '无效的直播间ID' });
            return;
        }
	    options.fillVars.liveId = liveId;
        tasks.push(['power', conf.wechatApi.common.getPower,{liveId, userId}, conf.wechatApi.secret]);
        tasks.push(['shareCardData', conf.baseApi.live.shareCardData, { liveId, userId, shareKey: lo.get(req, 'query.lshareKey', ''), channel: lo.get(req, 'query.channel', '') }, conf.baseApi.secret]);
        tasks.push(['customShareInfo', conf.baseApi.share.getCustomShareInfo, { businessId: liveId, userId: userId , type: 'live'}, conf.baseApi.secret]);

    } else if (type === 'camp') {
        const campId = req.query.campId;
        if (!campId) {
            res.render('500', { msg: '无效的训练营ID' });
            return;
        }
        let campShareCardParams = { campId, userId, shareKey: lo.get(req, 'query.lshareKey', ''), channel: lo.get(req, 'query.channel', '') };
        options.fillVars.campId = campId;
        if(req.query.isCenter){
            campShareCardParams.isCenter = true
        }
        tasks.push(['power', conf.wechatApi.common.getPower,{campId, userId}, conf.wechatApi.secret]);
        tasks.push(['shareCardData', conf.baseApi.checkInCamp.shareData,campShareCardParams , conf.baseApi.secret]);
        tasks.push(['customShareInfo', conf.baseApi.share.getCustomShareInfo, { businessId: campId, userId: userId , type: 'camp'}, conf.baseApi.secret]);
        // 获取邀请卡三方公众号关注配置
        tasks.push(['getThirdConf', conf.baseApi.live.getOpsAppIdSwitchConf, {channel:  '201', liveId: liveId}, conf.baseApi.secret])

    }
    

    proxy.parallelPromise(tasks, req)
        .then(async result => {
            options.renderData.shareMoney = lo.get(result, 'shareCardData.data.shareMoney', '');
            options.renderData.percent = lo.get(result, 'shareCardData.data.shareEarningPercent', '');
            let list = lo.get(result, 'shareCardBgList.data.list', '[]');
            let power =  lo.get(result, 'power.data.powerEntity', '{}');
            let customBg =  lo.get(result, 'customShareInfo.data.bgUrl', '');
            let recommendWord = lo.get(result, 'customShareInfo.data.recommendWord', '');
            let isLiveAdmin = lo.get(result, 'isLiveAdmin.data.isLiveAdmin', false);
            let isWhiteListLive = lo.get(result, 'isWhiteListLive.data.isWhite', 'N') === 'Y';
            let isQlchatLive = lo.get(result, 'isQlchatLive.data.isQlLive', 'N') === 'Y';
            let courseIndexStatus = lo.get(result, 'courseIndexStatus.data', '{}');
            let knowledgeId = lo.get(result, 'getKnowledgeId.data.dto.id', '')
            let auditPass = lo.get(result, 'getKnowledgeId.data.dto.auditStatus', 'nopass') == 'pass';

            try {
                if(type==="live" && !power.allowMGLive && !options.renderData.percent){
                    res.render('500');
                    return false;
                }
                list = JSON.parse(list);
            } catch (error) {
                console.error(error);
            }

            let shareData = lo.get(result, 'shareCardData.data', {});
            if (type == 'topic' || type == 'channel') {
                shareData.missionId = req.query.missionId;
            }
            const isDirectVisitCard = shareData.isDirectVisitCard;
            options.renderData.coral = (shareData.shareType === 'person' ? true : false);

            let isThirdConf = lo.get(result, 'getThirdConf.data', {});  

            shareData = JSON.stringify(shareData);
            shareData = shareData.replace(/\\/g, '\\\\');
            shareData = shareData.replace(/\'/g, '\\\'');

            options.fillVars.SHARE_DATA = shareData;
            options.fillVars.CUSTOM_BG = customBg;
            options.fillVars.POWER = power;
            options.fillVars.cardList = list;
            options.fillVars.LSHARE_KEY = lo.get(req, 'query.lshareKey', '');
            options.fillVars.IS_LIVE_ADMIN = isLiveAdmin;
            options.fillVars.IS_WHITE_LIST_LIVE = isWhiteListLive;
            options.fillVars.IS_QLCHAT_LIVE = isQlchatLive;
            options.fillVars.THIRD_APP_CONF = isThirdConf;
            options.fillVars.courseIndexStatus = courseIndexStatus;
            options.fillVars.knowledgeId = knowledgeId;
            options.renderData.shareKnowledge = lo.get(courseIndexStatus, 'knowledgeStatus', 'N') == 'Y'
            options.renderData.auditPass = auditPass;
	        options.renderData.power = power;
            options.renderData.customBg = customBg;
            options.renderData.recommendWord = recommendWord;
            options.renderData.notCamp = type != 'camp';
            options.renderData.shareData = shareData;
            options.renderData.cardList = list;
            options.renderData.notLive = type != 'live';

            if (options.renderData.percent && shareData.shareType !== 'person' || psKey) {
                options.renderData.showCourseTips = true
            }

            // 拉人返学费或手机app的时候不显示分销信息
            if(req.query.isBackTuition == 'Y' || envi.isQlApp(req)){
                options.renderData.shareMoney = ''
                options.renderData.showCourseTips = false
            }

	        if(isDirectVisitCard === 'Y'){
                const activityDomain = await proxy.apiProxyPromise(conf.baseApi.getDomainUrl, {type: 'activityAutoShare'}, conf.baseApi.secret, req).then(res => {
                    return lo.get(res, 'data.domainUrl', '') || ''
                });
		        options.fillVars.ACTIVITY_DOMAIN = activityDomain;
	        }else{
		        options.fillVars.ACTIVITY_DOMAIN = '';
            }

            htmlProcessor(req, res, next, options);
        })
        .catch(err => {
            console.error(err);
            res.render('500', {
                msg: JSON.stringify(err)
            });
        })
}

/**
 * 提供服务给node task生成图片
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function simpleShareCard(req, res, next) {
    const filePath = path.resolve(__dirname, '../../../public/wechat/page/sharecard/sharecard.html');
    let options = {
        filePath: filePath,
        fillVars: {
        },
        renderData: {},
    };
    const type = req.query.type;
    options.fillVars.TYPE = type;

    const tasks = [];

    tasks.push(['shareCardBgList', conf.baseApi.shareCardBgList, {}, conf.baseApi.secret]);
    proxy.parallelPromise(tasks, req)
        .then(result => {
            let list = lo.get(result, 'shareCardBgList.data.list', '{}');
            try {
                list = JSON.parse(list);
            } catch (error) {
                console.error(error);
            }


            options.renderData.thumbList = list.map(item => item.minShareCard);
            options.fillVars.BG_LIST = list.map(item => item.shareCard);
            options.fillVars.SHARE_DATA = null;

            htmlProcessor(req, res, next, options);
        })
        .catch(err => {
            console.error(err);
            res.render('500', {
                msg: JSON.stringify(err)
            });
        });
}

function teacherComplitedTopic(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/teacherComplitedTopic/teacherCard.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
            shareData:{}
        };
    var userId = lo.get(req, 'rSession.user.userId');
    var topicId = lo.get(req, 'query.topicId');
    var list = [
        {
            template:"TEACHER_1",
            shareCard:'https://img.qlchat.com/qlLive/activity/teacher-card-bg_1.png',
            minShareCard:'https://img.qlchat.com/qlLive/activity/teacher-card-bg_1.png'
        }
    ];
    const tasks = [];

    options.fillVars.TYPE = 'live';
    options.fillVars.SHARECARD_BG  = list[0];

    tasks.push(['shareCardData', conf.baseApi.topic.shareCardData, { topicId: topicId || "", userId }, conf.baseApi.secret]);
    tasks.push(['shareCompliteData', conf.baseApi.topic.shareCompliteData, { topicId: topicId || "", userId }, conf.baseApi.secret]);
    tasks.push(['clickAchievementCard', conf.baseApi.topic.clickAchievementCard, { topicId: topicId || "", userId ,client:"B" }, conf.baseApi.secret]);
    tasks.push(['achievementCardQr', conf.baseApi.live.getQr, { topicId: topicId || "", userId , channel :"achievementCard" ,showQl :"Y" }, conf.baseApi.secret]);
    tasks.push(['power', conf.wechatApi.common.getPower, { topicId: topicId || "", userId }, conf.wechatApi.secret]);

    proxy.parallelPromise(tasks, req)
    .then(result => {
        let shareData = lo.get(result, 'shareCardData.data', {});
        shareData = JSON.stringify(shareData);
        shareData = shareData.replace(/\\/g, '\\\\');
        shareData = shareData.replace(/\'/g, '\\\'');
        shareData = shareData.replace(/\"/g, '\\\"');


        let shareCompliteData = lo.get(result, 'shareCompliteData.data', {});
        shareCompliteData = JSON.stringify(shareCompliteData);
        shareCompliteData = shareCompliteData.replace(/\\/g, '\\\\');
        shareCompliteData = shareCompliteData.replace(/\'/g, '\\\'');
        shareCompliteData = shareCompliteData.replace(/\"/g, '\\\"');

        options.fillVars.SHARE_DATA = shareData;
        options.fillVars.SHARE_PUSH_DATA = shareCompliteData;
        options.fillVars.SHARE_COMPLITE_QR = lo.get(result, 'achievementCardQr.data.qrUrl', {});


        // browseNum		浏览人数
        // rewardCount		赞赏笔数
        // startTime		实得金额
        // endTime

        if(!(lo.get(result, 'power.data.powerEntity.allowSpeak', "")||lo.get(result, 'power.data.powerEntity.allowMGTopic', ""))){
           res.redirect('/wechat/page/mine');
            return;
        }
            htmlProcessor(req, res, next, options);

    })
    .catch(err => {
        console.error(err);
        res.render('500', {
            msg: JSON.stringify(err)
        });
    })
}

function studentComplitedTopic(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/studentComplitedTopic/studentCard.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
            shareData:{}
        };
    var userId = lo.get(req, 'rSession.user.userId');
    var topicId = lo.get(req, 'query.topicId');
    // var liveId = lo.get(req, 'query.liveId');
    var list = [
        {
            template:"TEACHER_1",
            shareCard:'https://img.qlchat.com/qlLive/shareCard/share-complete-card-bg4.png',
            minShareCard:'https://img.qlchat.com/qlLive/shareCard/share-complete-card-bg4.png'
        }
    ];
    const tasks = [];

    options.fillVars.TYPE = 'live';
    options.fillVars.SHARECARD_BG  = list[0];

    tasks.push(['shareCardData', conf.baseApi.topic.shareCardData, { topicId: topicId || "", userId }, conf.baseApi.secret]);
    tasks.push(['shareComplitePushDate', conf.baseApi.topic.shareComplitePushDate, { topicId: topicId || "", userId }, conf.baseApi.secret]);
    tasks.push(['clickAchievementCard', conf.baseApi.topic.clickAchievementCard, { topicId: topicId || "", userId ,client:"C"}, conf.baseApi.secret]);
    tasks.push(['achievementCardQr', conf.baseApi.live.getQr, { topicId: topicId || "", userId , channel :"achievementCard" }, conf.baseApi.secret]);
    // tasks.push(['subscribeData', conf.baseApi.user.isSubscribe, { liveId: liveId || "", userId}, conf.baseApi.secret]);
    // tasks.push(['adminFlag', conf.adminApi.adminFlag, { liveId: liveId || "", userId}, conf.baseApi.secret]);
    // tasks.push(['topicInfo', conf.baseApi.topic.topicInfo, { topicId: topicId || "", userId}, conf.baseApi.secret]);
    //conf.baseApi.live.getQr

    proxy.parallelPromise(tasks, req)
    .then(result => {
        let shareData = lo.get(result, 'shareCardData.data', {});
        let shareComplitePush = lo.get(result, 'shareComplitePushDate.data', "");

        // let subscribeData = lo.get(result, 'subscribeData.data', "");
        // let adminFlagData = lo.get(result, 'adminFlag.data', "" )
        // console.log('------------------------------------------------------------');
        // console.log(subscribeData);
        // console.log(adminFlagData);
        // console.log(shareComplitePush);
        // console.log(req.path)
        // console.log(adminFlagData)
        // console.log(subscribeData.isBindThird)

        // if (adminFlagData.isLiveAdmin === 'Y' && !subscribeData.isBindThird) {
        //     shareData.shareUrl = `https://pan.baidu.com/share/qrcode?w=300&h=300&url=http://${req.hostname}/wechat/page/live/${liveId}`;
        // }
        // shareComplitePush = {
        //     achievementCardRecord: {
        //         createTime: Date.now(),
        //         status:	'Y',
        //         num: 99999
        //     },
        //     seriesDay: 1265,
        //     totalHours: 1315.5,
        //     finishTopic: 325,
        //     defeatPercent: 98,
        // }
        shareComplitePush = JSON.stringify(shareComplitePush);
        shareComplitePush = shareComplitePush.replace(/\\/g, '\\\\');
        shareComplitePush = shareComplitePush.replace(/\'/g, '\\\'');
        shareComplitePush = shareComplitePush.replace(/\"/g, '\\\"');

        shareData = JSON.stringify(shareData);
        shareData = shareData.replace(/\\/g, '\\\\');
        shareData = shareData.replace(/\'/g, '\\\'');
        shareData = shareData.replace(/\"/g, '\\\"');

        options.fillVars.SHARE_DATA = shareData;
        options.fillVars.SHARE_STUDENT = shareComplitePush;
        options.fillVars.SHARE_COMPLITE_QR = lo.get(result, 'achievementCardQr.data.qrUrl', {});


        // options.renderData.shareData = shareData;
        // createTime		推送时间
        // status		状态 Y:已推送 C:已查看
        // num
        if(options.fillVars.SHARE_STUDENT===""){
            res.redirect('/wechat/page/mine');
            return;
        }

        htmlProcessor(req, res, next, options);
    })
    .catch(err => {
        console.error(err);
        res.render('500', {
            msg: JSON.stringify(err)
        });
    })

}

module.exports = [

    /* 直播间认证页*/
    // 这2个是旧地址，不能删除，后端有跳过来，会跳到新地址
    ['GET', '/wechat/page/live/auth/:liveId', clientParams(), wxAuth(), appAuth(), redirectLiveAuth],
    ['GET', '/wechat/page/live/auth/', clientParams(), wxAuth(), appAuth(), redirectLiveAuth],


    // 直播间介绍图文编辑页
    ['GET', '/wechat/page/live/intro/edit/:liveId', clientParams(), wxAuth(), appAuth(), pageLiveIntroEdit],

    // 咨询留言列表
    // ['GET', '/wechat/page/live/message/:liveId', clientParams(), wxAuth(), appAuth(), pageMessage],
    // ['GET', '/wechat/page/live/messageManage/:topicId', clientParams(), wxAuth(), appAuth(), pageMessageManage],
    // 邀请卡
    ['GET', '/wechat/page/sharecard', clientParams(), wxAuth(), appAuth(), shareCard],
    ['GET', '/wechat/page/simple-sharecard', simpleShareCard],
    ['GET', '/wechat/page/teacherComplitedTopic', clientParams(), wxAuth(), appAuth(), teacherComplitedTopic],
    ['GET', '/wechat/page/studentComplitedTopic', clientParams(), wxAuth(), appAuth(), studentComplitedTopic],
	// 设置邀请卡
    ['POST','/api/wechat/sharecard/setCustomShareBgImg', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.setCustomShareBgImg, conf.baseApi.secret)],
	// 删除邀请卡
	['POST','/api/wechat/sharecard/delCustomShareBgImg', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.delCustomShareBgImg, conf.baseApi.secret)],

];

