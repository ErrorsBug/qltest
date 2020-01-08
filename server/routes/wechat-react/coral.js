/**
 * Created by dylanssg on 2017/10/26.
 */

import lo from 'lodash';
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

import {
	INIT_ACCOUNT_DATA,
} from '../../../site/wechat-react/coral/actions/account';
import {
	initMyIndentity,
} from '../../../site/wechat-react/coral/actions/mine';
import {
	initSubscribeInfo,
	initUserInfo
} from '../../../site/wechat-react/coral/actions/common';
import {
	initTagList,
} from '../../../site/wechat-react/coral/actions/shop';
import {
	initCutData,
	initShareCutCourseInfo,
} from '../../../site/wechat-react/coral/actions/cut';
import {
	INIT_GIFT_BAG_DATA,
	INIT_ORDER_DETAILS
} from '../../../site/wechat-react/coral/actions/gift';
import {
	INIT_THIS_MONTH,
} from '../../../site/wechat-react/coral/actions/performance';

import { getMyLive } from '../../api/wechat/mine';


export async function initAccountData(req, res, store) {
	try{
		const userId = lo.get(req, 'rSession.user.userId');
		const data = await proxy.parallelPromise([
			['accountData', conf.baseApi.coral.getAccountData, { userId }, conf.baseApi.secret],
		], req);

		store.dispatch({
			type: INIT_ACCOUNT_DATA,
			accountData: lo.get(data, 'accountData.data', {}),
		});
	} catch(err) {
		console.error(err);
	}

	return store;
}

export async function initShopTagList(req, res, store) {
	try{
		const userId = lo.get(req, 'rSession.user.userId');
		const tagId = lo.get(req, 'query.tagId','');
		console.log(tagId);
		const data = await proxy.parallelPromise([
			// ['courseList', conf.baseApi.coral.getPersonPartyCourseList, { userId }, conf.baseApi.secret],
			['tagList', conf.baseApi.coral.getCoursetagList, { userId }, conf.baseApi.secret],
		], req);

		store.dispatch(initTagList(lo.get(data, 'tagList.data.list', []),tagId));
	} catch(err) {
		console.error(err);
	}

	return store;
}

export async function initMyIdentity(req, res, store) {
	const userId = lo.get(req, 'rSession.user.userId');
	const officialKey = lo.get(req, 'query.officialKey');
	const data = await proxy.parallelPromise([
		// ['courseList', conf.baseApi.coral.getPersonPartyCourseList, { userId }, conf.baseApi.secret],
		['getMyIdentity', conf.baseApi.coral.getMyIdentity, { userId }, conf.baseApi.secret],
	], req);
	if(lo.get(data, 'getMyIdentity.data.identity','')){
		store.dispatch(initMyIndentity(lo.get(data, 'getMyIdentity.data', {})));
		return store;
	}else{

		if(/.*(intro|coral\-index|shop).*/.test(lo.get(req, 'originalUrl'))){
			store.dispatch(initMyIndentity(lo.get(data, 'getMyIdentity.data', {})));
			return store;
		}else{
			if(officialKey){
				res.redirect('/wechat/page/coral/intro?officialKey='+officialKey);
			}else{
				res.redirect('/wechat/page/coral/intro');
			}
			return false;
		}


	}

}

// 礼包信息
export async function initGiftBagData(req, res, store) {
	try{
		const userId = lo.get(req, 'rSession.user.userId');
		const data = await proxy.parallelPromise([
			['giftBagData', conf.baseApi.coral.getOfficialVipConfig, { userId }, conf.baseApi.secret],
		], req);

		store.dispatch({
			type: INIT_GIFT_BAG_DATA,
			giftBagData: lo.get(data, 'giftBagData.data', {}),
		});
	} catch(err) {
		console.error(err);
	}


	return store;
}

//订单详情
export async function initOrderDetails(req, res, store) {
	try{
		const userId = lo.get(req, 'rSession.user.userId');
		const orderId = lo.get(req, 'query.orderId', '');
		const data = await proxy.parallelPromise([
			['orderData', conf.baseApi.coral.getOrderData, { orderId, userId }, conf.baseApi.secret],
		], req);

		store.dispatch({
			type: INIT_ORDER_DETAILS,
			orderDetails: lo.get(data, 'orderData.data', {}),
		});
	} catch(err) {
		console.error(err);
	}

	return store;
}

export async function initSubscribe(req, res, store) {
	try{
		const userId = lo.get(req, 'rSession.user.userId', '');
		const channelId = lo.get(req, 'query.channelId', '');
		const topicId = lo.get(req, 'query.topicId', '');

		let reuslt = await getMyLive({
			channelId,
			topicId,
			userId
		}, req);

		let isSubscribeResult = await proxy.parallelPromise([
			['subscribeInfo', conf.baseApi.user.isSubscribe, {
				userId,
				liveId: lo.get(reuslt, 'data.entityPo.liveId', '')
			}, conf.baseApi.secret]
		], req);
		store.dispatch(initSubscribeInfo(lo.get(isSubscribeResult, 'subscribeInfo.data', {})))



	} catch(err) {
		console.error(err);
	}

	return store;
}


export async function initPerformanceThisMonth(req, res, store) {
	try{
		const userId = lo.get(req, 'rSession.user.userId');
		const date = new Date();
		const data = await proxy.parallelPromise([
			['performance', conf.baseApi.coral.getMonthAchievement, { userId, year: date.getFullYear(), month: date.getMonth() + 1 }, conf.baseApi.secret],
		], req);

		store.dispatch({
			type: INIT_THIS_MONTH,
			thisMonth: lo.get(data, 'performance.data', {}),
		});
	} catch(err) {
		console.error(err);
	}

	return store;
}

export async function coralShopHandle(req, res, store){
	try{
		const userInfo = lo.get(req, 'rSession.user');
		const userId = userInfo.userId;
		const initData = await proxy.parallelPromise([
			['getMyIdentity', conf.baseApi.coral.getMyIdentity, { userId }, conf.baseApi.secret],
			['tagList', conf.baseApi.coral.getCoursetagList, { userId }, conf.baseApi.secret],
			['subscribeInfo', conf.baseApi.user.isSubscribe, { userId }, conf.baseApi.secret],
		], req);

		store.dispatch(initUserInfo(userInfo));
		store.dispatch(initMyIndentity(lo.get(initData, 'getMyIdentity.data', {})));
		store.dispatch(initTagList(lo.get(initData, 'tagList.data.list', [])));
		store.dispatch(initSubscribeInfo(lo.get(initData, 'subscribeInfo.data', '')))

	}catch(err) {
		console.error(err);
	}

	return store;
}

export async function initCutInfo(req, res, store){
	try{
		const userInfo = lo.get(req, 'rSession.user');
		const userId = userInfo.userId;
		const businessType = lo.get(req, 'query.businessType','');
		const businessId = lo.get(req, 'query.businessId','');
		const publicLink = lo.get(req, 'query.publicLink','');
		const applyUserId = publicLink==='Y'? userId : lo.get(req, 'query.applyUserId','');
		

		const initData = await proxy.parallelPromise([
			['getShareCutCourseInfo', conf.baseApi.coral.getShareCutCourseInfo, { userId, businessId }, conf.baseApi.secret],
			['getLastShareCutApplyRecord', conf.baseApi.coral.getLastShareCutApplyRecord, { userId, applyUserId, businessId }, conf.baseApi.secret],
			['chargechannelStatus',conf.baseApi.channel.chargeStatus, { userId ,channelId:businessId }, conf.baseApi.secret],
		], req);

		store.dispatch(initUserInfo(userInfo));
		if(lo.get(initData, 'getShareCutCourseInfo.data.info', {})){
			if(applyUserId === userId && lo.get(initData,'chargechannelStatus.data.chargePos','')){
				if(businessType=='TOPIC'){
					res.redirect('/topic/details?topicId=' + businessId);
				}else{
					res.redirect('/live/channel/channelPage/'+ businessId +'.htm');
				}
				return false;
			}else{
				store.dispatch(initShareCutCourseInfo(lo.get(initData, 'getShareCutCourseInfo.data', {})));			
				store.dispatch(initCutData(lo.get(initData, 'getLastShareCutApplyRecord.data.applyRecordDto', {})));
			}
			
		}else{//留意域名问题
			
			if(businessType=='TOPIC'){
				res.redirect('/topic/details?topicId=' + businessId);
			}else{
				res.redirect('/live/channel/channelPage/'+ businessId +'.htm');
			}
			return false;
			
		}

	}catch(err) {
		console.error(err);
	}

	return store;
}