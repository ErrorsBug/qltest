var proxy = require('../../components/proxy/proxy'),
	conf = require('../../conf');

import lo from 'lodash';

// var separateApi = require('../../api/wechat/guest-separate');
// var resProcessor = require('../../components/res-processor/res-processor');

import {
    initGuestSeparateInfo,
	initInvitationInfo,
	initPercentAcceptStatus,
    initAssignedPercent,
    initSumShareMoney,
} from '../../../site/wechat-react/other-pages/actions/guest-separate';

import {
	updateUserPower,
	initUserInfo,
	initSubscribeInfo,
} from '../../../site/wechat-react/other-pages/actions/common';

import separateApi from '../../api/wechat/guest-separate';

/**
 * 系列课store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function separateIncomeDetailHandle(req, res, store) {
    let mtype=lo.get(req, 'params.mtype');
    let userId=lo.get(req, 'rSession.user.userId');
    let params = {
        userId: userId,
        guestId: lo.get(req, 'query.guestId'),
        channelId: lo.get(req, 'query.channelId'),
		topicId: lo.get(req, 'query.topicId'),
		campId: lo.get(req,'query.campId',''),
    };

    try {
		store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {})));
        let initData = await separateApi.guestSeparateInitData(params, req);
        let power = lo.get(initData, 'power.data.powerEntity',{});
        let guestInfo=lo.get(initData, 'getGuestInfo.data.guestInfo',{});
        let assignedPercent= lo.get(initData, 'getAssignedPercent.data.assignedPercent','');
        let sumShareMoney= lo.get(initData, 'sumShareMoney.data.accountDto','');
        if(mtype=="manage"){

            if(power.allowMGLive){
                store.dispatch(updateUserPower(power));
                store.dispatch(initGuestSeparateInfo(guestInfo));
                store.dispatch(initAssignedPercent(assignedPercent));
                store.dispatch(initSumShareMoney(sumShareMoney));
            }else{
                console.error("无权限访问");
                res.render('500', {
                    msg: '无权限访问'
                });
                return false;
            }
        }else{
            store.dispatch(updateUserPower(power));
            store.dispatch(initGuestSeparateInfo(guestInfo));
			store.dispatch(initSumShareMoney(sumShareMoney));
        }

        // store.dispatch(initGuestSeparateIncome(channelInfo));


    } catch(err) {
        console.error(err);
    }

    return store;
};


export async function initInvitation(req, res, store) {
	try{
		store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {})));

		const userId = lo.get(req, 'rSession.user.userId', '');
		const channelId = lo.get(req, 'query.channelId', '');
		const topicId = lo.get(req, 'query.topicId', '');
		const campId = lo.get(req, 'query.campId', '');
		const id = lo.get(req, 'query.id', '');

		if(id){
			let reuslt = await separateApi.getInvitationInfo({
				guestId: id,
				channelId,
				topicId,
				campId,
			}, req);
			store.dispatch(initInvitationInfo(lo.get(reuslt, 'invitationInfo.data.guestInfo', {})));

			let isSubscribeResult = await proxy.parallelPromise([
				['subscribeInfo', conf.baseApi.user.isSubscribe, {
					userId,
					liveId: lo.get(reuslt, 'invitationInfo.data.guestInfo.liveId', '')
				}, conf.baseApi.secret]
			]);
			store.dispatch(initSubscribeInfo(lo.get(isSubscribeResult, 'subscribeInfo.data', {})))

		}


	} catch(err) {
		console.error(err);
	}

	return store;
}

export async function initPercentPlease(req, res, store){
	try{
		store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {})));

		const userId = lo.get(req, 'rSession.user.userId', '');
		const channelId = lo.get(req, 'query.channelId', '');
		const topicId = lo.get(req, 'query.topicId', '');
		const campId = lo.get(req, 'query.campId', '');
		const id = lo.get(req, 'query.id', '');
		const sharePercent=lo.get(req,'query.newPercent','');
		const timeStamp=lo.get(req,'query.time','');

		if(id){
			let reuslt = await separateApi.getPercentPleaseInfo({
				guestId: id,
				channelId,
				topicId,
				campId,
				type:channelId?"channel":(campId?"camp":"topic"),
				sharePercent,
				timeStamp,
			}, req);
			store.dispatch(initInvitationInfo(lo.get(reuslt, 'invitationInfo.data.guestInfo', {})));
			store.dispatch(initPercentAcceptStatus(lo.get(reuslt, 'getPercentPleaseInfo.data.status', {})));

			let isSubscribeResult = await proxy.parallelPromise([
				['subscribeInfo', conf.baseApi.user.isSubscribe, {
					userId,
					liveId: lo.get(reuslt, 'invitationInfo.data.guestInfo.liveId', '')
				}, conf.baseApi.secret]
			]);
			store.dispatch(initSubscribeInfo(lo.get(isSubscribeResult, 'subscribeInfo.data', {})))

		}


	} catch(err) {
		console.error(err);
	}

	return store;
}

export async function powerCheck(req, res, store){
	try{

		const userId = lo.get(req, 'rSession.user.userId', '');
		const channelId = lo.get(req, 'query.channelId', '');
		const liveId = lo.get(req, 'query.liveId', '');

		if(channelId || liveId){
			let result = await proxy.parallelPromise([
				['power', conf.baseApi.user.power, {
					liveId,
					channelId,
					userId
				}, conf.baseApi.secret],
			], req);
			let power = lo.get(result, 'power.data.powerEntity',{});
			if(!power.allowMGLive){
				res.render('500', {
					msg: '无权限访问'
				});
				return false;
			}
		}


	} catch(err) {
		console.error(err);
	}

	return store;
}
