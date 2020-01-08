
var lo = require('lodash'),
    _ = require('underscore'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    requestProcess = require('../../middleware/request-process/request-process'),
    conf = require('../../conf');

/**
 * 获取系列课页面初始化数据
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getChannelInitData = (params, req) => {

    var apiList = [
        ['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret],

        ['desc', conf.baseApi.channel.getDesc, params, conf.baseApi.secret],
        ['checkIsHasGroup',conf.baseApi.channel.checkIsHasGroup, params, conf.baseApi.secret],
        ['checkIsSetMarket',conf.baseApi.channel.getMarket, params, conf.baseApi.secret],
		    //获取自动分销信息
		    ['channelAutoShare', conf.baseApi.share.getChannelAutoShare, params, conf.baseApi.secret],
	        //获取shareKey
		    ['channelAutoQualify', conf.baseApi.share.getMyChannelShareQualify, params, conf.baseApi.secret],
		    // 获取系列课下话题数
		    ['channelTopicTotal', conf.baseApi.channel.getChannelTopicTotal, {channelId: params.channelId}, conf.baseApi.secret]
    ];


		if (params.code) {
			apiList.push(['bindCode', conf.baseApi.inboundBindCode, params, conf.baseApi.secret]);
		}

    return proxy.parallelPromise(apiList, req);
};

/**
 * 获取系列课页面静态信息初始化数据
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getChannelStaticInitData = (params, req) => {

	const task = [
		['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret],

		['desc', conf.baseApi.channel.getDesc, params, conf.baseApi.secret],
		// ['channelSummary', conf.baseApi.ueditor.getSummary, params, conf.baseApi.secret],
        ['checkIsSetMarket',conf.baseApi.channel.getMarket, params, conf.baseApi.secret],
		//获取自动分销信息
		['channelAutoShare', conf.baseApi.share.getChannelAutoShare, params, conf.baseApi.secret],
	];


	return proxy.parallelPromise(task, req);
};


/**
 * 系列课信息获取
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getChannelInfo = (params, req) => {

	const task = [
        ['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret],
	];

	return proxy.parallelPromise(task, req);
};

/**
 * 系列课权限获取
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getChannelAllPower = (params, req) => {

	const task = [
        ['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret],
        ['blackInfo', conf.baseApi.channel.isBlack, params, conf.baseApi.secret],
        ['kickOutRes', conf.baseApi.isKickOut, params, conf.baseApi.secret],
        ['vipInfo', conf.baseApi.vip.vipInfo, Object.assign({businessId: params.channelId}, params), conf.baseApi.secret],
        ['isAuthChannel', conf.baseApi.channel.channelAuth, params, conf.baseApi.secret],
	];

	return proxy.parallelPromise(task, req);
};

/**
 * 免费购买系列课
 * @param {*} params
 */
var freeBuy = (params, req) => {
    return proxy.parallelPromise([
        ['freeBuy', conf.baseApi.channel.freeBuy, params, conf.baseApi.secret]
    ], req);
}

/**
 * 根据直播间id和系列课id获取系列课初始化信息
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getChannelSecondData = (params, req) => {
    const userId = lo.get(req, 'rSession.user.userId','');
    const isCoral = params.isCoral;//珊瑚来源不绑定自动分销
    let requestList = [
        ['chargeStatus', conf.baseApi.channel.chargeStatus, params, conf.baseApi.secret],
        ['isLiveAdmin', conf.adminApi.adminFlag, params, conf.adminApi.secret],
        ['isSubscribe', conf.baseApi.channel.isSubscribe, params, conf.baseApi.secret],
        ['liveRole', conf.baseApi.channel.liveRole, params, conf.baseApi.secret],
        ['blackInfo', conf.baseApi.channel.isBlack, params, conf.baseApi.secret],
        ['vipInfo', conf.baseApi.vip.vipInfo, Object.assign({businessId: params.channelId}, params), conf.baseApi.secret],
        ['isLiveFocus', conf.baseApi.live.isFollow, params, conf.baseApi.secret],
        ['pushNum', conf.baseApi.channel.pushNum, params, conf.baseApi.secret],
        ['myShareQualify', conf.baseApi.share.getMyQualify, Object.assign({businessId: params.channelId, businessType:'channel', userId: userId, isAutoApply:(isCoral?'N':'Y')}, params), conf.baseApi.secret],
		['coralIdentity', conf.baseApi.coral.getPersonCourseInfo, Object.assign({businessId: params.channelId, businessType:'channel', userId: userId}, params), conf.baseApi.secret], // 请求是否珊瑚计划课程且是否是珊瑚课代表
        ['autoShare', conf.baseApi.share.getChannelAutoShare, params, conf.baseApi.secret],
        ['groupingList',conf.baseApi.channel.getChannelGroupingList, params, conf.baseApi.secret],
        ['isCouponSet',conf.baseApi.coupon.getCouponStatus, params, conf.baseApi.secret],
    ];

    if(params.groupId){
	    requestList.push(['groupInfo',conf.baseApi.channel.getChannelGroupInfo, params, conf.baseApi.secret]);
    }

    // 不在此处绑定，改为放在前端绑定
    // 绑定分销关系
    // if (params.shareKey) {
    //     requestList.push(['bindShareKey', conf.baseApi.channel.bindLiveShare, params, conf.baseApi.secret]);
    // }
    return proxy.parallelPromise(requestList, req);
}



var getChannelDiscountCode = (params, req) => {
    return proxy.parallelPromise([
        ['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret],
        ['chargeStatus', conf.baseApi.channel.chargeStatus, params, conf.baseApi.secret],
        ['batchCodeIn', conf.baseApi.coupon.batchCodeIn, params, conf.baseApi.secret],
        ['isOrNotBind', conf.couponApi.coupon.isOrNotBind, params, conf.couponApi.secret],
        ['queryCouponDetail', conf.couponApi.coupon.queryCouponDetail, params, conf.couponApi.secret],

    ], req);
};

var getGroupLists = (liveId, userId, req) => {
    var openedGroupParams = {
        isGroup: 'Y',
        liveId: liveId,
    }

    var unopenedGroupParams = {
        isGroup: 'N',
        liveId: liveId,
    }

    var userPowerParams = {
        liveId: liveId,
        userId: userId,
    }

    return proxy.parallelPromise([
        ['openedGroups', conf.baseApi.channel.getGroupList, openedGroupParams, conf.baseApi.secret],
        ['unopenedGroups', conf.baseApi.channel.getGroupList, unopenedGroupParams, conf.baseApi.secret],
        ['userPower', conf.baseApi.user.power, userPowerParams, conf.baseApi.secret]
    ], req)
}

const channelCount = function (req, res, next) {
    let params = {
        channelId: lo.get(req, 'body.channelId'),
        lshareKey: lo.get(req, 'body.lshareKey'),
        sId: lo.get(req, 'rSession.sessionId'),
        shareKey: lo.get(req, 'body.shareKey'),
        sourceNo: lo.get(req, 'body.sourceNo'),
    };


    proxy.apiProxy(conf.baseApi.channel.channelCount, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

// 单发领取优惠券
async function bindCouponByCode (params, req) {
    const userId = lo.get(req, 'rSession.user.userId');
    const channelId = params.channelId;
    const couponCode = params.couponCode;

    try {
        const result = await proxy.apiProxyPromise(conf.couponApi.coupon.bindCouponByCode, {userId, businessId: channelId, couponCode}, conf.couponApi.secret);
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

// 静态化系列课介绍页的浏览器端初始化数据
async function initChannelIntroData (req, res, next) {
	const user = lo.get(req, 'rSession.user',{});
	const userId = lo.get(user, 'userId','');
	// const userId = '';
	const channelId = req.body.channelId;
	const isCoral = req.body.isCoral;//珊瑚来源不绑定自动分销
	const discountStatus = req.body.discountStatus;

	let params = {
		type: 'channel',
		channelId,
        businessId: channelId,
        businessType:'channel',
		liveId: req.body.liveId,
		campId: req.body.campId,
		groupId: req.body.groupId,
		// 是否为训练营 Y/N
		isCamp: req.body.isCamp,
	};
	let tasks = [
		['liveInfo', conf.baseApi.live.get, params, conf.baseApi.secret],
		['channelNumAndTopicNum', conf.baseApi.live.getChannelNumAndTopicNum, params, conf.baseApi.secret],
		['followNum', conf.baseApi.live.followNum, params, conf.baseApi.secret],
		['evaluation', conf.baseApi.channel.getEvaluation, params, conf.baseApi.secret],
		// ['channelSummary', conf.baseApi.ueditor.getSummary, params, conf.baseApi.secret],
		// ['consultNum', conf.baseApi.consult.count, params, conf.baseApi.secret],
	];

	if(discountStatus === 'K'){
		// 如果分销类型是砍价
		tasks.push(['shareCutCourseInfo', conf.baseApi.coral.getShareCutCourseInfo, {businessId: params.channelId}, conf.baseApi.secret]);
	}

	if(params.groupId){
		tasks.push(['currentGroupInfo',conf.baseApi.channel.getChannelGroupInfo, params, conf.baseApi.secret]);
	}else if(discountStatus === 'P' || discountStatus === 'GP'){
		tasks.push(['groupingList',conf.baseApi.channel.getChannelGroupingList, params, conf.baseApi.secret]);
	}

	if(params.isCamp === 'Y'){
		console.log(params)
		// 新训练营信息
		tasks.push(['currentPeriod', conf.baseApi.channel.currentPeriod, {
			userId,
			channelId: params.channelId
		}, conf.baseApi.secret]);
	}

	// 如果是登录状态
	if (userId) {
		params.userId = userId;

		tasks.push(['power', conf.baseApi.user.power, params, conf.baseApi.secret]);
		tasks.push(['checkIsHasGroup',conf.baseApi.channel.checkIsHasGroup, params, conf.baseApi.secret]);
		tasks.push(['isFollow', conf.baseApi.live.isFollow, params, conf.baseApi.secret]);
		tasks.push(['isLiveAdmin', conf.adminApi.adminFlag, params, conf.adminApi.secret]);
		tasks.push(['isAuthChannel', conf.baseApi.channel.channelAuth, params, conf.baseApi.secret]);
        tasks.push(['blackInfo', conf.baseApi.channel.isBlack, params, conf.baseApi.secret]);
		tasks.push(['myShareQualify', conf.baseApi.share.getMyQualify, {businessId: params.channelId, businessType:'channel', userId: userId, isAutoApply:(isCoral?'N':'Y')}, conf.baseApi.secret]);
		// 已合并到getMyQualify
		// tasks.push(['coralIdentity', conf.baseApi.coral.getPersonCourseInfo, params, conf.baseApi.secret]); // 请求是否珊瑚计划课程且是否是珊瑚课代表
		// tasks.push(['liveRole', conf.baseApi.live.role, params, conf.baseApi.secret]);
		tasks.push(['vipInfo', conf.baseApi.vip.vipInfo, Object.assign({businessId: params.channelId}, params), conf.baseApi.secret]);//用户的VIP信息
		// 检查是不是已经买过相同转载的系列课
		tasks.push(['checkDuplicateBuy', conf.baseApi.channel.checkDuplicateBuy, params, conf.baseApi.secret]);
        tasks.push(['relayInfo', conf.baseApi.channel.getRelayInfo, params, conf.baseApi.secret]);
        tasks.push(['isSubscribe', conf.baseApi.channel.isSubscribe, params, conf.baseApi.secret]);
		tasks.push(['userTag', conf.baseApi.userTag, params, conf.baseApi.secret]);
		tasks.push(['memberInfo', conf.wechatApi.membership.memberInfo, params, conf.wechatApi.secret]);
		if(params.isCamp === 'Y'){
			tasks.push(['joinCampInfo', conf.baseApi.channel.joinCampInfo, {
				userId: params.userId,
				channelId: params.channelId
			}, conf.baseApi.secret]);
		}
	}


	try {
		const result = await proxy.parallelPromise(tasks, req);

		result.userId = userId;
		result.user = user;
		result.isLogined = !!userId;
        result.sysTimestamp = Date.now();

		const info = lo.get(result, 'memberInfo.data', {});
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

function isAuth (params, req) {
	return proxy.apiProxyPromise(conf.baseApi.channel.channelAuth, params, conf.baseApi.secret, req);
}

function getBlackInfo (params, req) {
	return proxy.apiProxyPromise(conf.baseApi.channel.isBlack, params, conf.baseApi.secret, req);
}

function taskCardAuth (params, req) {
	if(params.s && params.t && params.sign){
		return proxy.apiProxyPromise(conf.baseApi.channel.channelTaskCardAuth, params, conf.baseApi.secret, req);
	}else{
		return null;
	}
}

function getCampUserInfo(params, req) {
    return proxy.apiProxyPromise(conf.wechatApi.training.getUserInfo, params, conf.wechatApi.secret, req);
}


module.exports = [
    ['POST', '/api/wechat/channel/listTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.listTopic, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/sortList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.sortList, conf.baseApi.secret)],
    ['GET', '/api/wechat/topic/topicSortList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.sortTopicList, conf.baseApi.secret)],

    ['GET', '/api/wechat/channel/get-channel-intro', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getChannelIntro, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/save-channel-intro', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.saveChannelIntro, conf.baseApi.secret)],

    ['POST', '/api/wechat/channel/doSetChannelSort', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.doSetChannelSort, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/liveRole', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.liveRole, conf.baseApi.secret)],
    ['POST', '/api/wechat/topic/doSetTopicSort', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.doSetTopicSort, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/pay-user', clientParams(), appAuth(), requestProcess(conf.baseApi.channel.payUser, conf.baseApi.secret)],

    ['GET', '/api/wechat/channel/is-live-focus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.isFollow, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/live-focus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.liveFocus, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/push', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.channelPush, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/appPushInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.appPushInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/getPushInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getPushInfo, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/topic-list', clientParams(), appAuth(), requestProcess(conf.baseApi.channel.topicList, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/switch-free', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.switchFree, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/remove-topic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.removeTopic, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/delete-topic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.deleteTopic, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/single-buy', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.singleBuy, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/free-buy', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.freeBuy, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/end-topic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.endTopic, conf.baseApi.secret)],

    ['GET', '/api/wechat/channel/getChannelInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.info, conf.baseApi.secret)],

    ['POST', '/api/wechat/consult/send', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.consult.send, conf.baseApi.secret)],
    ['GET', '/api/wechat/consult/selected', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.consult.selected, conf.baseApi.secret)],
    ['POST', '/api/wechat/consult/praise', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.consult.praise, conf.baseApi.secret)],
    ['GET', '/api/wechat/getGiftId', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.common.getGiftId, conf.baseApi.secret)],

    // 获取拼课信息
    ['GET', '/api/weapp/channel/groupInfo',clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getChannelGroupInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/createGroup', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.createGroup, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/getGroupResult', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getGroupResult, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/checkIsHasGroup', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.checkIsHasGroup, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/getChannelGroupingList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getChannelGroupingList, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/getGroupListByChannelId', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getGroupListByChannelId, conf.baseApi.secret)],
    ['GET', '/api/wechat/channel/channel-qrcode', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.channelQrCode, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/getGroupList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getByliveIdAndIsGroup, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/openGroup', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.openGroup, conf.baseApi.secret)],

    ['GET','/api/wechat/channel/getChannelMarket', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getMarket, conf.baseApi.secret)],
    ['POST','/api/wechat/channel/setChannelMarket', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.setMarket, conf.baseApi.secret)],
    ['GET','/api/wechat/channel/getCouponSettings', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getCouponSetting, conf.baseApi.secret)],
	['POST','/api/wechat/channel/getChannelIdList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getChannelIdList, conf.baseApi.secret)],

    ['POST','/api/wechat/channel/changeSorceName', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.changeSorceName, conf.baseApi.secret)],
    ['POST','/api/wechat/channel/addSource', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.addSource, conf.baseApi.secret)],
    ['POST','/api/wechat/channel/getAllInviteDate', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getAllInviteDate, conf.baseApi.secret)],

    ['POST','/api/wechat/channel/channelCount', clientParams(), appAuth(), wxAuth(), channelCount],
    ['POST','/api/wechat/channel/bind-live-share', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.bindLiveShare, conf.baseApi.secret)],
    ['POST','/api/wechat/channel/channel-status', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.channelSatus, conf.baseApi.secret)],
    ['POST','/api/wechat/channel/list', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.list, conf.baseApi.secret)],

    ['POST','/api/wechat/channel/changeDisplay', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.changeDisplay, conf.baseApi.secret)],
    ['POST','/api/wechat/channel/delete', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.delete, conf.baseApi.secret)],
	['POST','/api/wechat/channel/getOpenPayGroupResult', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getOpenPayGroupResult, conf.baseApi.secret)],
    ['GET','/api/wechat/channel/getSimple', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.getSimpleChannel, conf.baseApi.secret)],

    // 活动定制券
    ['GET','/api/wechat/channel/activityCode/exists', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.activityCodeExist, conf.baseApi.secret)],
    ['GET','/api/wechat/channel/activityCode/bind', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.activityCodeBind, conf.baseApi.secret)],

    // 保存系列课购买须知
    ['POST','/api/wechat/channel/saveChannelPurcaseNote', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.saveChannelPurcaseNote, conf.baseApi.secret)],

    // 频道内即将开播的话题
    ['GET','/api/wechat/channel/newBeginTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.newBeginTopic, conf.baseApi.secret)],

    // 是否转播
    ['GET','/api/wechat/channel/isRelay', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.mediaMarket.isRelay, conf.baseApi.secret)],
    // 系列课是否有权限观看
    ['GET','/api/wechat/channel/channelAuth', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.channelAuth, conf.baseApi.secret)],

    // 获取优惠券详细信息
    ['POST','/api/wechat/channel/getCouponDetail', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getCouponDetail, conf.baseApi.secret)],
    // 是否已经领取过某一批次的优惠券
    ['POST','/api/wechat/channel/isReceivedCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.isReceivedCoupon, conf.baseApi.secret)],
    // 领取自媒体转载系列课优惠券
    ['POST','/api/wechat/channel/receiveMediaCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.receiveMediaCoupon, conf.baseApi.secret)],
    // 获取自媒体转载系列课的优惠券列表
    ['POST','/api/wechat/channel/getMediaCouponList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getMediaCouponList, conf.baseApi.secret)],
    // 查询定制券实体
    ['POST','/api/wechat/channel/getPromotion', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.coupon.activityCouponObj, conf.baseApi.secret)],
    // 获取关注信息
    ['GET', '/api/wechat/common/isSubscribe', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.isSubscribe, conf.baseApi.secret)],
    // 检查是否购买过和转载系列课相同的课程
    ['POST', '/api/wechat/channel/checkDuplicateBuy', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.checkDuplicateBuy, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/tryListen', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.tryListen, conf.baseApi.secret)],
    // 转载系列课收益
    ['POST', '/api/wechat/channel/relayChannelProfit', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.relayChannelProfit, conf.baseApi.secret)],
	// 获取系列课购买信息
    ['POST', '/api/wechat/channel/chargeStatus', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.chargeStatus, conf.baseApi.secret)],

    //分享得券，开箱活动
    ['GET','/api/wechat/channel/getCouponBoxCourseInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getCouponBoxCourseInfo, conf.shareFrontApi.secret)],
    ['GET','/api/wechat/channel/getApplyRecord', clientParams(), appAuth(), wxAuth(), requestProcess(conf.shareFrontApi.getApplyRecord, conf.shareFrontApi.secret)],


    // 获取系列课信息
    ['GET', '/api/wechat/channel/info', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.info, conf.baseApi.secret)],
    // 获取系列课简介
    ['GET', '/api/wechat/channel/profile', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getDesc, conf.baseApi.secret)],
    // 获取直播概要
    ['POST', '/api/wechat/topic/profileList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.topic.profile, conf.baseApi.secret)],
	// 获取系列课介绍页信息
	['POST', '/api/wechat/channel/initIntro', clientParams(), appAuth(), initChannelIntroData],
    // 获取直播间列表
    ['GET', '/api/wechat/channel/getLiveList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.live.my, conf.baseApi.secret)],

    // 获取是否显示拼课信息
    ['GET', '/api/wechat/channel/getIfHideGroupInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getIfHideGroupInfo, conf.baseApi.secret)],
    // 系列课任务邀请卡鉴权
    ['POST', '/api/wechat/channel/channelTaskCardAuth', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.channelTaskCardAuth, conf.baseApi.secret)],
    // 是否报名该系列课
    ['POST', '/api/wechat/channel/isAuthChannel', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.isAuthChannel, conf.baseApi.secret)],

    // 系列课（训练营）
    ['POST', '/api/wechat/channel/camp/listTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channelCamp.listTopic, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/camp/currentTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channelCamp.currentTopic, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/camp/getUserPeriod', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channelCamp.getUserPeriod, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/camp/answer/listByChannel', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channelCamp.listByChannel, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/camp/answer/likes', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.like, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/camp/answer/getMine', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.homework.myAnswer, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/camp/answer/setPrime', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channelCamp.setPrime, conf.baseApi.secret)],

    //当前最近训练营期数
    ['POST', '/api/wechat/channel/currentPeriod', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.currentPeriod, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/joinCampInfo', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.joinCampInfo, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/joinPeriod', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.joinPeriod, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/setUserName', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.setUserName, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/getUserCard', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getUserCard, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/getUserQualification', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.getUserQualification, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/unlockProgress', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.unlockProgress, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/bindUserRef', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.bindUserRef, conf.baseApi.secret)],
    ['POST', '/api/wechat/channel/isSubscribeAppId', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.user.isSubscribeAppId, conf.baseApi.secret)],
];

module.exports.getChannelInitData = getChannelInitData;
module.exports.getChannelSecondData = getChannelSecondData;
module.exports.getChannelDiscountCode = getChannelDiscountCode;
module.exports.getGroupLists = getGroupLists;
module.exports.freeBuy = freeBuy;
module.exports.bindCouponByCode = bindCouponByCode;
module.exports.bindCoupon = bindCoupon;
module.exports.isAuth = isAuth;
module.exports.getChannelStaticInitData = getChannelStaticInitData;
module.exports.getBlackInfo = getBlackInfo;
module.exports.taskCardAuth = taskCardAuth;
module.exports.getChannelAllPower = getChannelAllPower;
module.exports.getChannelInfo = getChannelInfo;
module.exports.getCampUserInfo = getCampUserInfo;


