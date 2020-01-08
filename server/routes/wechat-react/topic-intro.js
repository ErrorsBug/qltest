import lo from 'lodash';
import { stringify } from 'querystring';
import { getKickOutState } from '../../api/wechat/live';

var topicApi = require('../../api/wechat/topic');
var resProcessor = require('../../components/res-processor/res-processor');
var wxUtils = require('../../components/wx-utils/wx-utils');

const channelApi = require('../../api/wechat/channel');
const liveApi = require('../../api/wechat/live');
const trainingApi = require('../../api/wechat/training');

import {
	initPageData,
} from '../../../site/wechat-react/topic-intro/actions/topic-intro';

import {
	initChannelPageData,
	getCurrentPeriod,
} from '../../../site/wechat-react/topic-intro/actions/channel-intro';

import {
	initCampPageData,
	initCampTopicMap,
	initPeriodChannel,
	initCampUserInfo,
	initAffairMap,
	initUserAffair,
	initUserReward,
} from '../../../site/wechat-react/topic-intro/actions/training';


/**
 * 话题详情页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function topicIntroHandle(req, res, store) {
	try {
		let params = {
			topicId: lo.get(req, 'query.topicId'),
		};

		// 检测是否有多个topicId
		const topicIdIsArr = checkTopicIdIsArray(req, res, params.topicId);
		if (topicIdIsArr) { return false; }

		let topicData = await topicApi.getTopicIntroInfo(params, req)
		let topicPo = { ...lo.get(topicData, 'topicInfo.data.topicPo', {}), ...lo.get(topicData, 'topicInfo.data.topicExtendPo', {}) };
		let profile = lo.get(topicData, 'profile.data.TopicProfileList', {});
        
        // 判断是否存在话题
		const isNotTopic = judgeIsNotTopic(req, res, topicPo);
		if (isNotTopic) { return false; }

		// 判断是否视频类型
		const isGraphicLive = judgeIdGraphicLive(req, res, topicPo);
		if (isGraphicLive) { return false; }
		
		//if (topicPo.channelId) {
        //    let smoothHearingOrBuyOriginParams = {
        //        userId: params.userId,
        //        liveId: topicPo.liveId,
        //        topicId: params.topicId,
        //        channelId: topicPo.channelId
        //    }
        //    let [channelInfo] = await Promise.all([topicApi.getChannelInfo(smoothHearingOrBuyOriginParams, req)]);
        //    // 一元解锁课跳到系列课介绍页
        //    let discountStatus = lo.get(channelInfo, 'channelInfo.data.chargeConfigs[0].discountStatus', 'N');
        //    if(discountStatus == 'UNLOCK') {
        //        res.redirect(`/wechat/page/channel-intro?channelId=${topicPo.channelId}`);
        //        return false
        //    }
        //}

		let initData = {
			topicInfo: topicPo,
			profile,
			topicId: topicPo.id,
			channelId: topicPo.channelId,
			liveId: topicPo.liveId,
		};


		store.dispatch(initPageData(initData));
	} catch (err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}


/**
 * 系列课介绍页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function channelIntroHandle(req, res, store) {
	try {
		let params = {
			channelId: lo.get(req, 'query.channelId'),
		};

		const channelData = await channelApi.getChannelStaticInitData(params, req);
        const channelInfo = lo.get(channelData, 'channelInfo.data.channel', {});
		const desc = lo.get(channelData, 'desc.data.descriptions', {});
		const channelSummary = lo.get(channelData, 'desc.data.richContent', '');
		const chargeConfigs = lo.get(channelData, 'channelInfo.data.chargeConfigs', []);
		const autoShareInfo = lo.get(channelData, 'channelAutoShare.data', {});
		const marketingInfo = lo.get(channelData, 'checkIsSetMarket.data', {});
        const unlockCourseInfo = lo.get(channelData, 'channelInfo.data.unlockCourseInfo', {});


		// 处理是否已被删除系列课或直播间
		const isDelete = judgeIsDeleteChannel(req, res, channelInfo);
		if (isDelete) { return false; }


		let initData = {
			channelInfo,
			desc,
			channelSummary,
			chargeConfigs,
			autoShareInfo,
			marketingInfo,
			channelId: channelInfo.channelId,
			liveId: channelInfo.liveId,
            unlockCourseInfo
		};

		store.dispatch(initChannelPageData(initData));
	} catch (err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

/**
 * 系列课训练营进入权限判断
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function TrainingCampHandle(req, res, store) {
	try {
		let params = {
			userId: lo.get(req, 'rSession.user.userId', ''),
			channelId: lo.get(req, 'query.channelId'),
		};

		const channel = await channelApi.getChannelInfo(params, req);
		const channelInfo = lo.get(channel, 'channelInfo.data.channel', {});

		params.liveId = channelInfo.liveId
		params.businessId = params.channelId
		params.type = 'channel'

		const channelData = await channelApi.getChannelAllPower(params, req);
		const isKickedOut = lo.get(channelData, 'kickOutRes.data.status', false);
		const isBlack = lo.get(channelData, 'blackInfo.data.type', null);

		if (isKickedOut) {
			res.redirect(`/wechat/page/link-not-found?type=channelOut&channelId=${params.channelId}`);
			return false;
		}

		if (isBlack) {
			res.redirect('/black.html?code=inactived');
			return false;
		}

		const isAuthChannel = lo.get(channelData, 'isAuthChannel.data.status') === 'Y'
		const isRelay = channelInfo.isRelay === 'Y'
		const vipInfo = lo.get(channelData, 'vipInfo.data')

		if (channelInfo.displayStatus === 'N' && !isAuthChannel) {
			// 如果系列课隐藏，且没有访问权限，则跳出页面；
			res.redirect(`/wechat/page/topic-hide?liveId=${channelInfo.liveId}`);
			return false;
		}
		if (channelInfo.status !== 'Y') {
			// 如果系列课被删除了，就回到直播间主页
			if (channelInfo.liveId) {
				res.redirect('/wechat/page/live/' + channelInfo.liveId);
			} else {
				res.redirect('/wechat/page/mine');
			}
			return false;
		}
		if (!isAuthChannel && isRelay && channelInfo.upOrDown === 'down') {
			// 如果转载系列课下架了，且没有访问权限，则跳出页面；
			res.redirect(`/wechat/page/topic-hide?liveId=${channelInfo.liveId}`);
			return false;
		}

		const isBought = isAuthChannel || (vipInfo && (vipInfo.isVip === 'Y' || vipInfo.isCustomVip === 'Y'))
		if (!isBought) {
			res.redirect(`/wechat/page/channel-intro?channelId=${params.channelId}`);
			return false;
		}


	} catch (err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

/**
 * 新系列课训练营进入权限判断
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function TrainingAuthorHandle(req, res, store) {
	try {
		let params = {
			userId: lo.get(req, 'rSession.user.userId', ''),
			channelId: lo.get(req, 'query.channelId'),
		};

		const channel = await channelApi.getChannelInfo(params, req);
		const channelInfo = lo.get(channel, 'channelInfo.data.channel', {});

		params.liveId = channelInfo.liveId
		params.businessId = params.channelId
		params.type = 'channel'

		const channelData = await channelApi.getChannelAllPower(params, req);
		const isKickedOut = lo.get(channelData, 'kickOutRes.data.status', false);
		const isBlack = lo.get(channelData, 'blackInfo.data.type', null);

		if (isKickedOut) {
			res.redirect(`/wechat/page/link-not-found?type=channelOut&channelId=${params.channelId}`);
			return false;
		}

		if (isBlack) {
			res.redirect('/black.html?code=inactived');
			return false;
		}

		const isAuthChannel = lo.get(channelData, 'isAuthChannel.data.status') === 'Y'
		const isRelay = channelInfo.isRelay === 'Y'
		const vipInfo = lo.get(channelData, 'vipInfo.data')

		if (channelInfo.displayStatus === 'N' && !isAuthChannel) {
			// 如果系列课隐藏，且没有访问权限，则跳出页面；
			res.redirect(`/wechat/page/topic-hide?liveId=${channelInfo.liveId}`);
			return false;
		}
		if (channelInfo.status !== 'Y') {
			// 如果系列课被删除了，就回到直播间主页
			if (channelInfo.liveId) {
				res.redirect('/wechat/page/live/' + channelInfo.liveId);
			} else {
				res.redirect('/wechat/page/mine');
			}
			return false;
		}
		if (!isAuthChannel && isRelay && channelInfo.upOrDown === 'down') {
			// 如果转载系列课下架了，且没有访问权限，则跳出页面；
			res.redirect(`/wechat/page/topic-hide?liveId=${channelInfo.liveId}`);
			return false;
		}

		const isBought = isAuthChannel || (vipInfo && (vipInfo.isVip === 'Y' || vipInfo.isCustomVip === 'Y'))
		if (!isBought) {
			const periodChannel = await trainingApi.getPeriodByChannel(params, req);
			let campId = lo.get(periodChannel, 'periodChannel.data.periodPo.campId')
			let shareUserId = lo.get(req, 'query.shareUserId')
			// 如果有训练营ID 跳转到介绍页
			if (campId) {
				// 增加shareUserId
				if(shareUserId) {
					res.redirect(`/wechat/page/training-intro?campId=${campId}&shareUserId=${shareUserId}`);
				} else {
					res.redirect(`/wechat/page/training-intro?campId=${campId}`);
				}
			} else {
				res.redirect('/wechat/page/mine');
			}
			return false;
		}


	} catch (err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

/**
 * 训练营介绍页
 * @param {*} req
 * @param {*} res
 * @param {*} store
 */
export async function TrainingIntroHandle(req, res, store) {
	try {
		let params = {
			userId: lo.get(req, 'rSession.user.userId', ''),
			campId: lo.get(req, 'query.campId'),
		};

		if (!params.campId) {
			res.redirect('404')
			return
		}

		const initData = await trainingApi.getCampInitData(params)
		const campInfo = lo.get(initData, 'campInfo.data.campPo')
		if (!campInfo) {
			res.redirect('404')
			return
		}

		const powerData = await trainingApi.checkPower({userId: params.userId, liveId: campInfo.liveId})
		const power = lo.get(powerData, 'userPower.data.powerEntity')
		
		// 被隐藏 且 不是管理者或老师
		if (campInfo.status === 'N' && !power.allowMGLive) {
			res.redirect(`/wechat/page/topic-hide?liveId=${campInfo.liveId}`);
			return
		}
		
		store.dispatch(initCampPageData({...campInfo, power}));
	} catch (err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

/**
 * 训练营学习页  训练营没报名的 跳去 training-student-info
 */
export async function TrainingLearnInfoHandle(req, res, store) {

	try {
		let params = {
			userId: lo.get(req, 'rSession.user.userId', ''),
			channelId: lo.get(req, 'query.channelId'),
			studentId: lo.get(req, 'rSession.user.userId', '')
		};

		const periodChannel = await trainingApi.getPeriodByChannel(params)
		let isJoinCamp = lo.get(periodChannel, 'periodChannel.data.isJoinCamp')
		if (isJoinCamp == 'N') {
			res.redirect(`/wechat/page/training-student-info?channelId=${lo.get(req, 'query.channelId')}`)
			return false;
		} else {
			const initData = await trainingApi.getCampLearn(params)
			store.dispatch(initCampTopicMap(lo.get(initData, 'topicMapInfo.data.topicMap')|| {}));
			store.dispatch(initPeriodChannel(lo.get(periodChannel, 'periodChannel.data')|| {}));
			store.dispatch(initAffairMap(lo.get(initData, 'affairMapInfo.data.affairMap')|| {}))
			store.dispatch(initUserAffair(lo.get(initData, 'userAffairInfo.data')|| {}))
			store.dispatch(initUserReward(lo.get(initData, 'listReward.data.dataList')|| {}))
		}

	} catch (err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

/**
 * 系列课介绍页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function TrainingLearnRecordHandle(req, res, store) {
	try {
		let params = {
			userId: lo.get(req, 'rSession.user.userId', ''),
			channelId: lo.get(req, 'query.channelId'),
		};

		const periodData = await trainingApi.getPeriodByChannel(params, req);

		store.dispatch(initPeriodChannel(lo.get(periodData, 'periodChannel.data') || {}));
	} catch (err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

/**
 * 获取用户报名信息
 * @param {*} req
 * @param {*} res
 * @param {*} store
 */
export async function TrainingStudentInfo(req, res, store) {
	try {
		let params = {
			userId: lo.get(req, 'rSession.user.userId', ''),
			channelId: lo.get(req, 'query.channelId'),
		};
		const initData = await trainingApi.getCampUserInfo(params)
		
		store.dispatch(initPeriodChannel(lo.get(initData, 'periodChannel.data') || {})); // 为了拿到某一期开课时间
		store.dispatch(initCampUserInfo(lo.get(initData, 'getUserInfo.data.campUserPo')|| {}))

	} catch (err) {
		console.error(err);
		res.render('500');
		return false;
	}

	return store;
}

/**
 * 检测是否有多个topicId
 *
 * @param {any} topicId
 * @returns
 */
function checkTopicIdIsArray(req, res, topicId) {
	if (Object.prototype.toString.call(topicId) == '[object Array]') {
		const data = {
			...req.query,
			topicId: topicId[0],
		}
		const queryResult = stringify(data);
		res.redirect(`/wechat/page/topic-intro?${queryResult}`);
		return true;
	} else {
		return false;
	}
}


/**
 *
 *
 * @param {any} req
 * @param {any} res
 * @param {any} topicPo
 */
function judgeIdGraphicLive(req, res, topicPo) {
	const data = {
		topicId: topicPo.id,
		...req.query,
	}
	const queryResult = stringify(data);

	if (/^(graphic)$/.test(topicPo.style)) {
		// 小图文类型
		res.redirect(`/wechat/page/detail-little-graphic?${queryResult}`);
		return true;
	} else {
		return false;
	}
}


/**
 * 处理不存在的话题
 *
 * @param {any} req
 * @param {any} res
 */
function judgeIsNotTopic(req, res, topicPo) {
	if (topicPo.status === 'delete') {
		res.redirect(`/wechat/page/link-not-found?type=topic&liveId=${topicPo.liveId}`);
		return true;
	} else if (!topicPo.status) {
		res.redirect(`/wechat/page/link-not-found?type=topic`);
		return true;
	} else {
		return false;
	}
}


/**
 * 处理是否已经删除系列课或直播间
 *
 * @param {any} req
 * @param {any} res
 */
function judgeIsDeleteChannel(req, res, channelInfo) {

	// 如果系列课首页被删除了，就回到直播间主页
	if (typeof channelInfo.liveId == 'undefined') {
		res.redirect(`/wechat/page/link-not-found?type=channel`);
		return true;

	} else if (channelInfo && typeof channelInfo.status != 'undefined' && channelInfo.status != 'Y') {
		if (channelInfo.liveId) {
			res.redirect('/wechat/page/live/' + channelInfo.liveId);
		} else {
			res.redirect('/wechat/page/mine');
		}
		return true;
	} else {
		return false;
	}

}

