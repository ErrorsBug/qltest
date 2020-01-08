import lo from 'lodash';
import { accessSync } from 'fs';
var _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    clientParams = require('../../middleware/client-params/client-params'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    wxAppAuth = require('../../middleware/auth/1.0.0/wx-app-auth').default,
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');



/*************************************************************     普通话题消息加载和处理  start      *******************************************************************************/


/**
 * 话题获取发言数据的主要调用接口方法
 */
var getTopicSpeakMain = async (params, req) => {
    // 获得参数
    let result = await proxy.parallelPromise([
       ['topicSpeak', conf.speakApi.speak.get, params, conf.speakApi.secret],
    ], req);
    return result;
}
/**
 * 话题前端获取发言数据
 */
var getTopicSpeakFrontend = async (req, res, next) => {
    // 获得参数
    var params = _.pick(req.body, 'topicId','liveId','hideLuckyMoney','pullComment','time','beforeOrAfter');
    var userData = req.rSession.user;
    if (userData && userData.userId) {
        params.userId = userData.userId
    }
    params.pageNum = 1 ;
    params.pageSize = 30 ;

    var body = await getTopicSpeakNode(params, req);
    resProcessor.jsonp(req, res, body.topicSpeak);
}
/**
 * 话题后端获取发言数据
 */
var getTopicSpeakNode = async (params, req) => {

    var result =   await getTopicSpeakMain(params, req);
    var speakList  = lo.get(result, 'topicSpeak.data.liveSpeakViews', []);

    // 隐藏红包消息的处理
    if (params.hideLuckyMoney && speakList && speakList.length) {
        // listBefore 是每次请求数据未经处理的消息列表
        let listBefore = speakList;
        // listAfter 是过滤红包消息后的列表
        let listAfter = await handleLuckyMoney(listBefore);
        // speakList 是每次合并最后要返回的列表
        speakList = [...listAfter];
        // 判断每次请求的数据，如果最终消息不够30条，且本次请求是有30条，说明后面还有数据，继续请求，直到足够30条或者后续没数据。
        while (speakList.length < 30 && listBefore.length == 30)
        {
            // 每次都取上一次返回消息的最后一条消息的时间戳 请求后续数据
            params.time = listBefore.pop().createTime;
            // 新一次请求消息流
            let resultAgain = await getTopicSpeakMain(params);
            // 赋值本次请求结果
            listBefore = [...lo.get(resultAgain, 'topicSpeak.data.liveSpeakViews', [])];
            // 过滤本次请求结果
            listAfter = await handleLuckyMoney(listBefore);
            // 对本次结果排重
            let lastList = messagelistDeDuplicate(speakList, listAfter);
            // 合并过滤后的消息
            speakList = [ ...speakList, ...lastList ];
        }
        // 对后面返回结果赋值
        result.topicSpeak.data.liveSpeakViews = [...speakList];
    }

    speakList && console.log("---- 已经获取消息长度 ---- ",speakList.length);
    return result;


}

/*************************************************************     普通话题消息加载和处理  end      *******************************************************************************/




/*************************************************************     音视频消息加载和处理  start      *******************************************************************************/


/**
 * 音视频话题获取发言数据的主要调用接口方法
 */
var getForumSpeakMain = async (params, req) => {
    // 获得参数
    let result = await proxy.parallelPromise([
       ['forumSpeak', conf.baseApi.topic.getForumSpeak, params, conf.baseApi.secret],
    ], req);
    return result;
}
/**
 * 音视频话题前端获取发言数据
 */
var getForumSpeakFrontend = async (req, res, next) => {
    // 获得参数
    var params = _.pick(req.body, 'topicId','onlyTeacher','time','beforeOrAfter','hideLuckyMoney');
    var userData = req.rSession.user;
    if (userData && userData.userId) {
        params.userId = userData.userId
    }


    var body = await getForumSpeakNode(params, req);
    resProcessor.jsonp(req, res, body.forumSpeak);
}
/**
 * 音视频话题后端获取发言数据
 */
var getForumSpeakNode = async (params, req) => {
    params.page = {
        page: 1,
        size: 30,
    };
    var result =   await getForumSpeakMain(params, req);
    var forumList  = lo.get(result, 'forumSpeak.data.forumList', []);

    // 隐藏红包消息的处理
    if (params.hideLuckyMoney && forumList) {
        // listBefore 是每次请求数据未经处理的消息列表
        let listBefore = forumList;
        // listAfter 是过滤红包消息后的列表
        let listAfter = await handleLuckyMoney(listBefore);
        // forumList 是每次合并最后要返回的列表
        forumList = [...listAfter];
        // 判断当前排除红包消息后消息是否足够30条，且上次请求回来的数据是否足够30条。不够数据则继续加载后续数据
        while (forumList.length < 30 && listBefore.length == 30)
        {
            // 每次都取上一次返回消息的最后一条消息的时间戳 请求后续数据
            params.time = listBefore.pop().createTime;
            // 新一次请求消息流
            let resultAgain = await getForumSpeakMain(params, req);
            // 赋值本次请求结果
            listBefore = [...lo.get(resultAgain, 'forumSpeak.data.forumList', [])];
            // 过滤本次请求结果
            listAfter = await handleLuckyMoney(listBefore);
            // 对本次结果排重
            let lastList = messagelistDeDuplicate(forumList, listAfter);
            // 合并过滤后的消息
            forumList = [...forumList, ...lastList ];
            // 对后面返回结果赋值
            result.forumSpeak.data.forumList = [...forumList];
        }
    }

    return result;


}


/*********************************************************       音视频消息加载和处理  end      ***********************************************************************************/


/**
 * 处理没有红包的消息类型
 */
var handleLuckyMoney = (listBefore) => {
    let listAfter = listBefore.filter((item)=>{
        return item.type !== "redpacket";
    });

    return listAfter;
}


/**
 * 消息流排重
 *
 * @export
 * @param {any} ListA
 * @param {any} ListB
 * @returns
 */
var messagelistDeDuplicate = (listA, listB)  => {;
    const result = [];
    listB.forEach((itemB) => {
        if (itemB.status === 'D') {
            return;
        }
        if (itemB.id) {
            listA.every((itemA) => itemA.id !== itemB.id) && result.push(itemB);
        } else {
            result.push(itemB);
        }
    });
    return result;
}



var getThousandLiveInfo = (params, req) => {

    let infoArr = [
        ['topicInfo', conf.baseApi.topic.topicInfo, params, conf.baseApi.secret],
    ];
    if(params.userId){
        infoArr.push(['power', conf.baseApi.user.power, params, conf.baseApi.secret])
    }

    return proxy.parallelPromise(infoArr, req);
};

var getThousandLiveISecondData = (params, req) => {
    let shareKeyParams = {
        liveId: params.liveId,
        userId: params.userId,
    }

    // 转播换题读取原话题消息流。
    let websocketParams = {
        ...params
    }
    if (websocketParams.sourceTopicId) {
        websocketParams.topicId = websocketParams.sourceTopicId;
    }
    let DataArr = [
        ['initWebsocket', conf.baseApi.topic.initWebsocket, websocketParams, conf.baseApi.secret],
        ['liveInfo', conf.baseApi.live.get, params, conf.baseApi.secret],
    ];

    // 有userId才请求的数据
    let userDataArr = [
        ['blackInfo', conf.baseApi.channel.isBlack, params, conf.baseApi.secret],
        ['topicAuth', conf.baseApi.topic.topicAuth, params, conf.baseApi.secret],
        ['lShareKey', conf.baseApi.share.qualify, shareKeyParams, conf.baseApi.secret],
        ['isLiveAdmin', conf.adminApi.adminFlag, params, conf.adminApi.secret],
    ];


    if(params.userId){
        DataArr = [...DataArr , ...userDataArr];
    }

    return proxy.parallelPromise(DataArr, req);
}

var getIsFollow = (params, req) => {
    return proxy.parallelPromise([
        ['isFollow', conf.baseApi.live.isFollow, params, conf.baseApi.secret],
        ['isSubscribe', conf.baseApi.user.isSubscribe, params, conf.baseApi.secret],
    ], req);
}

// 是否畅听直播间
var getIsOrNotListen = (params, req) => {
    return proxy.parallelPromise([
        ['isOrNotListen', conf.baseApi.live.isOrNotListen, params, conf.baseApi.secret],
    ], req);
}

// 系列课信息
var getChannelInfo = (params, req) => {
    if (!params.channelId) return null
    return proxy.parallelPromise([
        ['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret]
    ], req);
}

// 话题介绍页
var getTopicIntroInfo = (params, req) => {
    
    let infoArr = [
        ['topicInfo', conf.baseApi.topic.topicInfo, params, conf.baseApi.secret],
        ['profile', conf.baseApi.topic.profile, params, conf.baseApi.secret],
    ];
    // if(params.userId){
    //     infoArr.push(['power', conf.baseApi.user.power, params, conf.baseApi.secret]);
    //     infoArr.push(['isAuthTopic', conf.baseApi.topic.topicAuth, params, conf.baseApi.secret]);
    // }

    return proxy.parallelPromise(infoArr, req);
};


var getIspushCompliteCard = (params, req) => {
    const tasks = [
	    ['getnowTopicVideoCount', conf.baseApi.topic.getnowTopicVideoCount, params, conf.baseApi.secret],
    ];
    if(params.userId){
	    tasks.push(['shareComplitePushDate', conf.baseApi.topic.shareComplitePushDate, params, conf.baseApi.secret]);
    }
    return proxy.parallelPromise(tasks, req);
}

// 话题优惠券相关信息
var getTopicDiscountCode = (params, req) => {

    return proxy.parallelPromise([
        ['topicAuth', conf.baseApi.topic.topicAuth, params, conf.baseApi.secret],
        ['getTopicInfo', conf.baseApi.topic.topicInfo, params, conf.baseApi.secret],
        ['batchCodeIn', conf.baseApi.coupon.batchCodeIn, params, conf.baseApi.secret],
        ['isOrNotBind', conf.couponApi.coupon.isOrNotBind, params, conf.couponApi.secret],
        ['queryCouponDetail', conf.couponApi.coupon.queryCouponDetail, params, conf.couponApi.secret],
    ], req);
};


var getQuestionList = (params, req) => {
    return proxy.parallelPromise([
        ['questionList', conf.commentApi.getQuestionList, params, conf.commentApi.secret],
    ], req);
}

var getCommentList = (params, req) => {
    return proxy.parallelPromise([
        ['commentList', conf.commentApi.getComment, params, conf.commentApi.secret],
    ], req);
}

var hideTopic = (params, req) => {
    return proxy.apiProxyPromise(conf.baseApi.topic.hideTopic, params, conf.baseApi.secret, req);
}

async function initTopicInfo (req, res, next) {
    const userId = lo.get(req, 'rSession.user.userId','');
    const channelId = req.body.channelId;
    const sourceKey = req.body.sourceKey;
    const isCoral = req.body.isCoral;//珊瑚来源不绑定自动分销

    let params = {
        type: 'topic',
        topicId: req.body.topicId,
        liveId: req.body.liveId,
        campId: req.body.campId,
    };
    console.log(params);
    let tasks = [
        ['liveInfo', conf.baseApi.live.get, params, conf.baseApi.secret],
        ['channelNumAndTopicNum', conf.baseApi.live.getChannelNumAndTopicNum, params, conf.baseApi.secret],
        ['followNum', conf.baseApi.live.followNum, params, conf.baseApi.secret],
        ['evaluation', conf.baseApi.topic.getEvaluation, params, conf.baseApi.secret],
        ['consultNum', conf.baseApi.consult.count, params, conf.baseApi.secret],
        ['getTopicBrowsNum', conf.baseApi.topic.getTopicBrowsNum, params, conf.baseApi.secret],
	    ['topicSummary', conf.baseApi.ueditor.getSummary, {...params,businessId: req.body.topicId, businessType:'topic'}, conf.baseApi.secret],
    ];
    if (sourceKey) {
        //是否从三方分销进来，是否在三方白名单
        tasks.push(['isWhite', conf.baseApi.thirdParty.isWhite, { sourceKey: sourceKey }, conf.baseApi.secret]);
    }    
    // 如果是登录状态
    if (userId) {
        params.userId = userId

        tasks.push(['power', conf.baseApi.user.power, params, conf.baseApi.secret]);
        tasks.push(['isSubscribe', conf.baseApi.user.isSubscribe, params, conf.baseApi.secret]);
        tasks.push(['isFollow', conf.baseApi.live.isFollow, params, conf.baseApi.secret]);
        tasks.push(['isLiveAdmin', conf.adminApi.adminFlag, params, conf.adminApi.secret]);
        tasks.push(['isAuthTopic', conf.baseApi.topic.topicAuth, params, conf.baseApi.secret]);
        tasks.push(['blackInfo', conf.baseApi.channel.isBlack, params, conf.baseApi.secret]);
        tasks.push(['myShareQualify', conf.baseApi.share.getMyQualify, {businessId: (channelId?channelId:params.topicId), businessType:(channelId?'channel':'topic'), userId:userId,isAutoApply:(isCoral?'N':'Y') }, conf.baseApi.secret]);
        tasks.push(['coralIdentity', conf.baseApi.coral.getPersonCourseInfo, {
            businessId: req.body.topicId,
            businessType:'topic',
            userId:userId
        }, conf.adminApi.secret]); // 请求是否珊瑚计划课程且是否是珊瑚课代表
        tasks.push(['getRelayConfig', conf.baseApi.topic.getRelayConfig, params, conf.baseApi.secret]);
        tasks.push(['liveRole', conf.baseApi.live.role, params, conf.baseApi.secret]);
        tasks.push(['userVipInfo', conf.baseApi.topic.userVipInfo, params, conf.baseApi.secret]); //判断用户的VIP信息
        tasks.push(['userTag', conf.baseApi.userTag, params, conf.baseApi.secret]);
		tasks.push(['memberInfo', conf.wechatApi.membership.memberInfo, params, conf.wechatApi.secret]);
        // 系列课下面的话题不请求话题shareKey接口
        // if(!channelId){
        //     tasks.push(['shareKey', conf.baseApi.share.qualify, {userId:userId, topicId:req.body.topicId}, conf.baseApi.secret],);
        // }
    }

    // 如果是系列课中的话题
    if (channelId) {
        params.channelId = channelId;

        tasks.push(['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret]);
        tasks.push(['chargeStatus', conf.baseApi.channel.chargeStatus, params, conf.baseApi.secret]);
    }

    try {
        const result = await proxy.parallelPromise(tasks, req);

        result.userId = userId || '';
        result.isLogined = !!userId;
        result.sysTimestamp = Date.now();
        const info = lo.get(result, 'memberInfo.data', {});
        console.log(info);
		if(info.level > 0 && info.status === 'Y'){
			info.isMember = 'Y';
		}else{
			info.isMember = 'N';
        }
        result.memberInfo = info

        resProcessor.jsonp(req, res, result)
    } catch (error) {
        console.error('[api error]: initTopicInfo error---', error);
        res.render('500');
    }
}

async function fetchCouponLists (req, res, next) {
    const userId = req.cookies.userId;
    const topicId = req.query.topicId;
    const channelId = req.query.channelId;
    const liveId = req.query.liveId;

    const url = conf.couponApi.coupon.myCouponList;
    
    try {
        const tasks = [];

        if (topicId) {
            tasks.push(['topicCouponList', url, { businessType: 'topic', businessId: topicId, liveId, userId }, conf.couponApi.secret]);
        }
        if (channelId) {
            tasks.push(['channelCouponList', url, { businessType: 'channel', businessId: channelId, liveId, userId }, conf.couponApi.secret])
        }
        const result = await proxy.parallelPromise(tasks, req);

        resProcessor.jsonp(req, res, result);
    } catch (error) {
        console.error(error);
    }
}


// 获取转载话题撤回的语音id
async function getRelayDelSpeakIdList (params, req) {
    const userId = lo.get(req, 'rSession.user.userId');
    const topicId = params.topicId;
    const type = params.type;

    const url = conf.baseApi.topic.getRelayDelSpeakIdList;

    const task = ['getRelayDelSpeakIdList', url, ]

    try {
        const result = await proxy.apiProxyPromise(url, {topicId, type}, conf.baseApi.secret, req);

        return result;
    }
    catch (error) {
        console.error(error);
    }
}

// 单发领取优惠券
async function bindCouponByCode (params, req) {
    const userId = lo.get(req, 'rSession.user.userId');
    const topicId = params.topicId;
    const couponCode = params.couponCode;

    try {
        const result = await proxy.apiProxyPromise(conf.couponApi.coupon.bindCouponByCode, {userId, businessId: topicId, couponCode}, conf.couponApi.secret);
        return result;
    } catch (e) {
        console.error(e)
    }
}

// 群发领取优惠券
async function bindCoupon (params, req) {
    const userId = lo.get(req, 'rSession.user.userId');
    const couponId = params.codeId;

    try {
        const result = await proxy.apiProxyPromise(conf.couponApi.coupon.bindCoupon, {userId, couponId}, conf.couponApi.secret);
        return result;
    } catch (e) {
        console.error(e);
    }
}
function isAuth (params, req) {
	return proxy.apiProxyPromise(conf.baseApi.topic.topicAuth, params, conf.baseApi.secret, req);
}

function getCampByTopicId (params, req) {
	return proxy.apiProxyPromise(conf.wechatApi.training.getCampByTopicId, params, conf.baseApi.secret, req);
}

function getBlackInfo (params, req) {
	return proxy.apiProxyPromise(conf.baseApi.channel.isBlack, params, conf.baseApi.secret, req);
}

function getPower (params, req) {
    return proxy.apiProxyPromise(conf.wechatApi.common.getPower, params, conf.wechatApi.secret, req);
}

function sendLiveInvite(params,req){
    return proxy.apiProxyPromise(conf.baseApi.topic.topicInvite, params, conf.baseApi.secret, req);
}

module.exports = [
    // ['GET', '/api/wechat/topic/getInfo', clientParams(), appAuth(), wxAuth(), getTopicInfo],
    ['GET', '/api/wechat/topic/getInfo', requestProcess(conf.baseApi.topic.topicInfo, conf.baseApi.secret)],
    // 获取话题自动分销邀请码
    ['GET', '/api/wechat/topic/getTopicAutoQualify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getTopicAutoQualify, conf.baseApi.secret)],
    // 话题直播
    ['POST', '/api/wechat/topic/addTopicSpeak', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.addSpeak, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/getTopicSpeak', clientParams(), appAuth(), getTopicSpeakFrontend],
    ['POST', '/api/wechat/topic/revokeTopicSpeak', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.deleteSpeak, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/inviteList', clientParams(), appAuth(), requestProcess(conf.baseApi.topic.inviteList, conf.baseApi.secret)],
    ['GET', '/api/wechat/topic/getShareTopThree', clientParams(), appAuth(),requestProcess(conf.baseApi.topic.getShareTopThree, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/changeSpeaker', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.changeSpeaker, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/publicApply', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.publicApply, conf.baseApi.secret)],
    // 视频话题直播
    ['POST', '/api/wechat/topic/addForumSpeak', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.addForumSpeak, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/getForumSpeak', clientParams(), appAuth(), wxAuth(), getForumSpeakFrontend],
    ['POST', '/api/wechat/topic/revokeForumSpeak', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.deleteForumSpeak, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/setMute', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.setMute, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/setRewordDisplay', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.barrageFlag, conf.baseApi.secret)],
    ['GET', '/api/wechat/topic/media-url', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getMediaUrl, conf.baseApi.secret)],

    ['POST', '/api/wechat/topic/deleteComment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.delete, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/addComment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.comment.add, conf.baseApi.secret)],
    ['GET', '/api/wechat/topic/getComment', clientParams(), appAuth(), requestProcess(conf.commentApi.getComment, conf.commentApi.secret)],
    ['POST', '/api/wechat/topic/addShareComment', clientParams(), appAuth(), requestProcess(conf.commentApi.addShareComment, conf.commentApi.secret)],
    ['GET', '/api/wechat/topic/getQuestionList', clientParams(), appAuth(), requestProcess(conf.commentApi.getQuestionList, conf.commentApi.secret)],

    ['GET','/api/wechat/topic/auth', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.topicAuth, conf.baseApi.secret)],
    ['GET','/api/wechat/topic/end-topic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.endTopic, conf.baseApi.secret)],
    ['POST','/api/wechat/channel/hide-topic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.hideTopic, conf.baseApi.secret)],

    // 新增PPT
    ['POST','/api/wechat/topic/addppt', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ppt.new, conf.baseApi.secret)],
	// PPT列表
	['POST','/api/wechat/topic/pptList', clientParams(), appAuth(), requestProcess(conf.baseApi.ppt.list, conf.baseApi.secret)],
	// 删除ppt
	['POST','/api/wechat/topic/removeppt', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ppt.remove, conf.baseApi.secret)],
	// ppt排序
	['POST','/api/wechat/topic/sortppt', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ppt.sort, conf.baseApi.secret)],
	// ppt上墙
	['POST','/api/wechat/topic/pptPush', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.ppt.push, conf.baseApi.secret)],
    // 文档上传
    ['POST', '/api/wechat/topic/file-upload', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.docSave, conf.baseApi.secret)],
    // 获取点赞数
    ['GET', '/api/wechat/topic/getLikesSet', clientParams(), appAuth(), requestProcess(conf.baseApi.topic.getLikesSet, conf.baseApi.secret)],
    // 获取点赞列表
    ['POST', '/api/wechat/topic/likesList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.interactApi.likesList, conf.interactApi.secret)],
    //取消点赞  
    ['POST', '/api/wechat/topic/cancelLikes', clientParams(), appAuth(), wxAuth(), requestProcess(conf.interactApi.cancelLikes, conf.interactApi.secret)],
    // 点赞
    ['POST', '/api/wechat/topic/likes', clientParams(), appAuth(), wxAuth(), requestProcess(conf.interactApi.likes, conf.interactApi.secret)],
    // 禁言
    ['POST', '/api/wechat/topic/ban', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.banned, conf.baseApi.secret)],
    // 文档获取信息
    ['GET', '/api/wechat/topic/doc-get', clientParams(), appAuth(), requestProcess(conf.baseApi.topic.docGet, conf.baseApi.secret)],
    // 检验是否购买文档
    ['GET', '/api/wechat/topic/doc-auth', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.docAuth, conf.baseApi.secret)],
    // 文档下载统计
    ['GET', '/api/wechat/topic/doc-add-stat', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.docAddStat, conf.baseApi.secret)],
    // 是否关注公众号
    ['GET', '/api/wechat/user/is-subscribe', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.isSubscribe, conf.baseApi.secret)],
	// 推送
	['POST', '/api/wechat/topic/push', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.push, conf.baseApi.secret)],
	// 获取推送信息
	['POST', '/api/wechat/topic/getPushInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getPushInfo, conf.baseApi.secret)],
    //推送成就卡
    ['POST', '/api/wechat/topic/pushAchievementCardToUser', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.pushAchievementCardToUser, conf.baseApi.secret)],
    // 绑定分销关系
    ['POST', '/api/wechat/topic/bind-share-key', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.bindLiveShare, conf.baseApi.secret)],
    // 获取语音导出状态
    ['POST', '/api/wechat/topic/getAssemblyAudio', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getAssemblyAudio, conf.baseApi.secret)],
    // 修改发言人头衔
    ['POST', '/api/wechat/topic/setTitle', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.setTitle, conf.baseApi.secret)],
    // 上麦权限
    ['POST', '/api/wechat/topic/textOrAudioSwitch', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.textOrAudioSwitch, conf.baseApi.secret)],

    ['POST', '/api/wechat/topic/get-doc-data', clientParams(), appAuth(),requestProcess(conf.baseApi.topic.getDocsData, conf.baseApi.secret)],
    // 创建和修改话题
    ['POST', '/api/wechat/topic/update', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.topic.update, conf.baseApi.secret)],
    // 移入系列课
    ['POST', '/api/wechat/topic/doMoveToChannel', clientParams(), appAuth(),wxAuth(),requestProcess(conf.baseApi.topic.doMoveToChannel, conf.baseApi.secret)],
    // 修改图文话题系列课
    ['POST', '/api/wechat/topic/changeAudioGraphicChannel', clientParams(), appAuth(),wxAuth(),requestProcess(conf.baseApi.topic.changeAudioGraphicChannel, conf.baseApi.secret)],

    // 切换直播类型
    ['POST', '/api/wechat/topic/convertTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.convertTopic, conf.baseApi.secret)],
    // 获取话题的基础数据
    ['GET','/api/wechat/topic/getSimple', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getSimpleTopic, conf.baseApi.secret)],
    // 话题统计
    ['POST', '/api/wechat/topic/browe', function(req, res, next) {
        req.body.sessionId = req.rSession.sessionId;
        next();
    }, requestProcess(conf.baseApi.browe, conf.baseApi.secret)],
    // 访问统计
    ['POST', '/api/wechat/topic/pageUv', function(req, res, next) {
        resProcessor.jsonp(req, res, {
            state: {
                code: 0
            }
        });

        req.body.sessionId = req.rSession.sessionId;
        req.body.uid = req.cookies.uid;
        if(req.cookies.userId){
            req.body.userId = req.cookies.userId;
        }
        const statType = req.body.statType ? (Array.isArray(req.body.statType)? [...req.body.statType] : [ req.body.statType ]) : [];
	    statType.forEach((s) => {
	        let params = {...req.body};
		    params.statType = s;
	        proxy.apiProxyPromise(conf.baseApi.pageUv, params, conf.baseApi.secret, req);
        });
    }],
    // 设置是否显示APP推广
    ['POST', '/api/wechat/topic/setAppDownloadOpen', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.setAppDownloadOpen, conf.baseApi.secret)],
    // 获取我的优惠码列表
    ['GET', '/api/wechat/topic/myCouponList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.couponApi.coupon.myCouponList, conf.couponApi.secret)],
    // 隐藏话题
    ['POST', '/api/wechat/topic/changeTopicDisplay', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.changeTopicDisplay, conf.baseApi.secret)],
    // 获取话题简介
    ['POST', '/api/wechat/topic/profile', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.profile, conf.baseApi.secret)],
    // 获取全部发言
    ['POST', '/api/wechat/topic/total-speak-list',  clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.totalSpeakList, conf.baseApi.secret)],
    // 获取小程序码
    ['POST', '/api/wechat/topic/weappcode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.weappCode, conf.baseApi.secret)],

    // 介绍页初始化后的数据接口
    ['POST', '/api/wechat/topic/init-data', initTopicInfo],
    // 获取登录用户的优惠券
    ['GET', '/api/wechat/topic/topic-coupons', clientParams(), appAuth(), wxAuth(), fetchCouponLists],
    // 获取咨询列表
    ['GET', '/api/wechat/topic/consult-list', requestProcess(conf.baseApi.consult.selected, conf.baseApi.secret)],
    // 发送留言
    ['POST', '/api/wechat/topic/post-consult', wxAppAuth(), requestProcess(conf.baseApi.consult.send, conf.baseApi.secret)],
    // 开启话题介绍页开关
    ['POST', '/api/wechat/topic/setIsNeedAuth', wxAppAuth(), requestProcess(conf.baseApi.topic.setIsNeedAuth, conf.baseApi.secret)],
    // 话题设置分享开关
    ['POST', '/api/wechat/topic/setShareStatus', wxAppAuth(), requestProcess(conf.baseApi.topic.setShareStatus, conf.baseApi.secret)],
    // 加密话题报名
    ['POST', '/api/wechat/topic/enterEncrypt', wxAppAuth(), requestProcess(conf.baseApi.topic.enterEncrypt, conf.baseApi.secret)],
    // 获取赠礼id
    ['POST', '/api/wechat/topic/getGiftId', wxAppAuth(), requestProcess(conf.baseApi.topic.getGiftId, conf.baseApi.secret)],
    // 话题邀请卡报名
    ['POST', '/api/wechat/share/topicTaskCardAuth', wxAppAuth(), requestProcess(conf.baseApi.share.topicTaskCardAuth, conf.baseApi.secret)],
    // 获取详情页关注配置
    ['GET', '/api/wechat/topic/getFollowGuideInfo', requestProcess(conf.baseApi.topic.getFollowGuideInfo, conf.baseApi.secret)],
	// 获取话题自动分销信息
    ['GET', '/api/wechat/topic/getTopicAutoShare', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getTopicAutoShare, conf.baseApi.secret)],
    // 获取系列课自动分销信息
    ['GET', '/api/wechat/topic/getChannelAutoShare', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getChannelAutoShare, conf.baseApi.secret)],
    // 设置话题自动分销信息
    ['GET', '/api/wechat/topic/setTopicAutoShare', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.setTopicAutoShare, conf.baseApi.secret)],
    // 转载话题撤回的语音id
    ['POST', '/api/wechat/topic/getRelayDelSpeakIdList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getRelayDelSpeakIdList, conf.baseApi.secret)],
    // 话题详情页底部判断是否需要弹出引导关注二维码
    ['GET', '/api/wechat/checkNeedShowQr', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.checkNeedShowQr, conf.baseApi.secret)],
	// 获取媒体真实链接
	['POST', '/api/wechat/topic/getMediaActualUrl', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getMediaActualUrl, conf.baseApi.secret)],
    // 获取发言数量
    ['GET', '/api/wechat/getSpeakNum', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getSpeakNum, conf.baseApi.secret)],
    // 提纲列表
    ['GET', '/api/wechat/topic/getOutlineList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getOutlineList, conf.baseApi.secret)],
    // 添加修改提纲
    ['POST', '/api/wechat/topic/addOrUpdateOutLine', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.addOrUpdateOutLine, conf.baseApi.secret)],
    // 删除提纲
    ['POST', '/api/wechat/topic/delOutLine', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.delOutLine, conf.baseApi.secret)],
    // 获取成就卡信息（新版）
    ['POST', '/api/wechat/achievement/getAchievementCardInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getAchievementCardInfo, conf.shareFrontApi.secret)],
    ['POST', '/api/wechat/achievement/getExistAchievementCard', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getExistAchievementCard, conf.shareFrontApi.secret)],
    ['POST', '/api/wechat/topic/commentCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.commentCount, conf.baseApi.secret)],
    // 获取课程分销资格（统一接口）
    ['POST', '/api/wechat/topic/getMyQualify', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.share.getMyQualify, conf.baseApi.secret)],
	['POST', '/api/wechat/topic/commentCount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.commentCount, conf.baseApi.secret)],
	['POST', '/api/wechat/topic/getUserTopicRole', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getUserTopicRole, conf.baseApi.secret)],
	['POST', '/api/wechat/topic/getLivePlayUrl', clientParams(), requestProcess(conf.baseApi.topic.getLivePlayUrl, conf.baseApi.secret)],
	['POST', '/api/wechat/topic/getLiveStatus', clientParams(), requestProcess(conf.baseApi.topic.getLiveStatus, conf.baseApi.secret)],
	['POST', '/api/wechat/topic/getLiveOnlineNum', clientParams(), requestProcess(conf.baseApi.topic.getLiveOnlineNum, conf.baseApi.secret)],
	['POST', '/api/wechat/topic/getTopicForSort', clientParams(), requestProcess(conf.baseApi.topic.getTopicForSort, conf.baseApi.secret)],
	['POST', '/api/wechat/topic/doSetTopicsSort', clientParams(), requestProcess(conf.baseApi.topic.doSetTopicSort, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/getRoleList', clientParams(), requestProcess(conf.baseApi.topic.getRoleList, conf.baseApi.secret)],
    // 获取课堂红包关注公众号
    ['POST', '/api/wechat/topic/getRedEnvelopeAppId', clientParams(), requestProcess(conf.baseApi.topic.getRedEnvelopeAppId, conf.baseApi.secret)],
    // 领取课堂红包
    ['POST', '/api/wechat/topic/receiveRedEnvelope', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.receiveRedEnvelope, conf.shareFrontApi.secret)],
    // 课堂红包收益记录
    ['POST', '/api/wechat/topic/getProfitRecordList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getProfitRecordList, conf.shareFrontApi.secret)],
    // 我的领取记录详情
    ['POST', '/api/wechat/topic/getMyReceiveDetail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getMyReceiveDetail, conf.shareFrontApi.secret)],
    // 红包领取记录列表
    ['POST', '/api/wechat/topic/getReceiveDetailList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getReceiveDetailList, conf.shareFrontApi.secret)],
    // 获取红包信息
    ['POST', '/api/wechat/topic/getRedEnvelopeRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getRedEnvelopeRecord, conf.shareFrontApi.secret)],
    // 分享红包邀请卡
    ['POST', '/api/wechat/topic/redEnvelopeShare', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.redEnvelopeShare, conf.shareFrontApi.secret)],
    // 获取红包账户信息
    ['POST', '/api/wechat/topic/getRedEnvelopeAccount', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getRedEnvelopeAccount, conf.shareFrontApi.secret)],
    // 根据业务id过去社群信息
    ['POST', '/api/wechat/community/getByBusiness', clientParams(), appAuth(), requestProcess(conf.communityApi.getByBusinessId, conf.communityApi.secret)],

    ['POST', '/api/wechat/community/get', clientParams(), appAuth(), requestProcess(conf.communityApi.get, conf.communityApi.secret)],

    // 获取社群二维码
    ['POST', '/api/wechat/community/getCommunityQrcode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.communityApi.getCommunityQrcode, conf.communityApi.secret)],
    // 是否设置一次性订阅开播提醒，话题详情页调用
    ['POST', '/api/wechat/topic/oneTimePushSubcirbeStatus', clientParams(), requestProcess(conf.baseApi.topic.oneTimePushSubcirbeStatus, conf.baseApi.secret)],
    // 保存拉人返现配置
    ['POST', '/api/wechat/topic/saveInviteReturnConfig', clientParams(), requestProcess(conf.baseApi.invite.saveInviteReturnConfig, conf.baseApi.secret)],
    // 获取拉人返现
    ['POST', '/api/wechat/topic/getInviteReturnConfig', clientParams(), requestProcess(conf.baseApi.invite.getInviteReturnConfig, conf.baseApi.secret)],
    // 拉人返现列表
    ['POST', '/api/wechat/invite/missionList', clientParams(), requestProcess(conf.baseApi.invite.missionList, conf.baseApi.secret)],
    // 返现任务详情列表
    ['POST', '/api/wechat/invite/missionDetailList', clientParams(), requestProcess(conf.baseApi.invite.missionDetailList, conf.baseApi.secret)],
    // 判断是否能设置拉人返现配置
    ['POST', '/api/wechat/invite/canSetInviteReturnConfig', clientParams(), requestProcess(conf.baseApi.invite.canSetInviteReturnConfig, conf.baseApi.secret)],

    // 话题文稿
    ['POST', '/api/wechat/topic/bookProfile', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.bookProfile, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/topicInvite', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.topicInvite, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/getTopicInvite', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getTopicInvite, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/getTeacherDisabuseUrl', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.getTeacherDisabuseUrl, conf.baseApi.secret)],
];

module.exports.getThousandLiveInfo = getThousandLiveInfo;
module.exports.getThousandLiveISecondData = getThousandLiveISecondData;
module.exports.getTopicSpeakNode = getTopicSpeakNode;
module.exports.getForumSpeakNode = getForumSpeakNode;
module.exports.getTopicDiscountCode = getTopicDiscountCode;
module.exports.getIsFollow = getIsFollow;
module.exports.getCommentList = getCommentList;
module.exports.getQuestionList = getQuestionList;
module.exports.getIspushCompliteCard = getIspushCompliteCard;
module.exports.hideTopic = hideTopic;
module.exports.getTopicIntroInfo = getTopicIntroInfo;
module.exports.getRelayDelSpeakIdList = getRelayDelSpeakIdList;
module.exports.bindCoupon = bindCoupon;
module.exports.bindCouponByCode = bindCouponByCode;
module.exports.isAuth = isAuth;
module.exports.getCampByTopicId = getCampByTopicId;
module.exports.getBlackInfo = getBlackInfo;
module.exports.getPower = getPower;
module.exports.getIsOrNotListen = getIsOrNotListen
module.exports.getChannelInfo = getChannelInfo
module.exports.sendLiveInvite = sendLiveInvite
