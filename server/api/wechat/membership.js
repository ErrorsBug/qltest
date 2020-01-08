var lo = require('lodash'),
    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');

const initMemberInfo = function({ userId, id }, req){
	return proxy.apiProxyPromise(conf.wechatApi.membership.memberInfo, { userId, id }, conf.wechatApi.secret, req).then(result => {
		const info = lo.get(result, 'data', {});
		if(info.level > 0 && info.status === 'Y'){
			info.isMember = 'Y';
		}else{
			info.isMember = 'N';
		}
		return info
	})
};

const getMemberInfo = async function(req, res, next){
	const userId = lo.get(req, 'rSession.user.userId', '');
	const info = await initMemberInfo({ userId }, req).catch(err => {
		resProcessor.error500(req, res, err);
	});
	resProcessor.jsonp(req, res, info);
};

const initMemberCenterData = function(params, req){
	return proxy.apiProxyPromise(conf.wechatApi.membership.memberCenterInitData, params, conf.wechatApi.secret, req).then(result => {
		return lo.get(result, 'data', {}) || {};
	})
};

const getCourseInfo = async function(req, res, next){
	const userId = lo.get(req, 'rSession.user.userId', '');
	const businessId = lo.get(req, 'body.businessId');
	const businessType = lo.get(req, 'body.businessType');

    let params = {
		businessId: businessId,
		type: businessType
	};
    if (userId) {
        params.userId = userId;
	}

	const apiList = [
		['summary', conf.baseApi.ueditor.getSummary, params, conf.baseApi.secret],
	]

	if (businessType === 'channel') {
		params.channelId = businessId
		apiList.push(['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret])
		apiList.push(['desc', conf.baseApi.channel.getDesc, params, conf.baseApi.secret])
		apiList.push(['topicList', conf.baseApi.channel.topicList, { ...params, pageSize: 20, pageNum: 1 }, conf.baseApi.secret])
		apiList.push(['isAuthChannel', conf.baseApi.channel.channelAuth, params, conf.baseApi.secret])
	} else if (businessType === 'topic') {
		params.topicId = businessId
		apiList.push(['topicInfo', conf.baseApi.topic.topicInfo, params, conf.baseApi.secret])
		apiList.push(['profile', conf.baseApi.topic.profile, params, conf.baseApi.secret])
		apiList.push(['isAuthTopic', conf.baseApi.topic.topicAuth, params, conf.baseApi.secret])
	}
	
	try {
		const result = await proxy.parallelPromise(apiList, req);

		let data = {}
		
		if (businessType === 'channel') {
			data = {
				info: lo.get(result, 'channelInfo.data.channel', ''),
				desc: lo.get(result, 'desc.data.descriptions'),
				isAuth: lo.get(result, 'isAuthChannel.data.status', 'N') === "Y",
				topicList: lo.get(result, 'topicList.data.topicList', ''),
				summary: lo.get(result, 'summary.data', ''),
			}
		} else if (businessType === 'topic') {
			data = {
				info: lo.get(result, 'topicInfo.data.topicPo', ''),
				desc: lo.get(result, 'profile.data.TopicProfileList'),
				isAuth: lo.get(result, 'isAuthTopic.data.isAuth', false),
				summary: lo.get(result, 'summary.data', ''),
			}
		}

        resProcessor.jsonp(req, res,
            {
                data,
                state: {
                    code: 0,
                    msg: '请求成功 '
                }
			})
	} catch (error) {
		console.error(error);
		res.render('500');
	}
};

const initOfficialCardInfo = function({ userId, cardId }, req){
	return proxy.apiProxyPromise(conf.wechatApi.membership.officialCard, { userId, officialCardId: cardId }, conf.wechatApi.secret, req).then(result => {
		return lo.get(result, 'data', {});
	})
};

module.exports = [
	// 获取会员信息
	['POST', '/api/wechat/member/memberInfo', clientParams(), appAuth(), wxAuth(), getMemberInfo],
    // 获取大师课标签
	['POST', '/api/wechat/member/qualityTag', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.qualityTag, conf.wechatApi.secret)],
    // 获取大师课列表
	['POST', '/api/wechat/member/qualityCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.qualityCourse, conf.wechatApi.secret)],
    // 领取课程
	['POST', '/api/wechat/member/selectCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.selectCourse, conf.wechatApi.secret)],
    // 领取体验会员
	['POST', '/api/wechat/member/receiveMember', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.receiveMember, conf.wechatApi.secret)],
	// 领取官方体验会员
	['POST', '/api/wechat/member/receiveOfficialCard', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.receiveOfficialCard, conf.wechatApi.secret)],
	// 获取会员体验卡列表
	['POST', '/api/wechat/member/trialCard', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.trialCard, conf.wechatApi.secret)],
    // 是否展示会员栏
	['POST', '/api/wechat/member/showMemberLine', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.showMemberLine, conf.wechatApi.secret)],
    
	// 获取会员中心页面数据
	['POST', '/api/wechat/member/centerInitData', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.memberCenterInitData, conf.wechatApi.secret)],
	// 免费专区列表
	['POST', '/api/wechat/member/freeCourse', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.freeCourse, conf.wechatApi.secret)],
	// 免费专区换一批
	['POST', '/api/wechat/member/freeCourse4Center', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.freeCourse4Center, conf.wechatApi.secret)],
	// 会员优惠券
	['POST', '/api/wechat/member/coupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.coupon, conf.wechatApi.secret)],
	// 领取会员优惠券
	['POST', '/api/wechat/member/getCoupon', clientParams(), appAuth(), wxAuth(), requestProcess(conf.wechatApi.membership.getCoupon, conf.wechatApi.secret)],

	['POST', '/api/wechat/member/getCourseInfo', clientParams(), appAuth(), wxAuth(), getCourseInfo],
	['POST', '/api/wechat/member/getCourseTopicList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.channel.topicList, conf.baseApi.secret)],
];

module.exports.initMemberInfo = initMemberInfo;
module.exports.initMemberCenterData = initMemberCenterData;
module.exports.initOfficialCardInfo = initOfficialCardInfo;

