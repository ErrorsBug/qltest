/**
 * Created by dylanssg on 2017/5/5.
 */
import lo from 'lodash';

import evaluationApi from '../../api/wechat/evaluation';
import channelApi from '../../api/wechat/channel';

// actions
import {
	initEvaluationData,
	initUserPower,
	initLabelList,
	initStatus,
	initIsOpenEvaluate,
} from '../../../site/wechat-react/other-pages/actions/evaluation';


export async function evaluationListHandle(req, res, store) {

	try {
		let [userPowerResult, evaluationResult, labelList] = await Promise.all([
			evaluationApi.getUserPower({
				...lo.get(req, 'params'),
				userId: lo.get(req, 'rSession.user.userId')
			}, req),
			evaluationApi.getEvaluationData(lo.get(req, 'params'), req),
			evaluationApi.getLabelList({}, req)
		]);

		let status;
		if(lo.get(req, 'params', {}).topicId){
			status = await evaluationApi.getStatus({
				...lo.get(req, 'params'),
				userId: lo.get(req, 'rSession.user.userId')
			}, req);
		}

		store.dispatch(initEvaluationData(lo.get(evaluationResult,'evaluationData.data',{}) || {}));
		store.dispatch(initUserPower(lo.get(userPowerResult,'userPower.data.powerEntity',{}) || {}));
		store.dispatch(initLabelList(lo.get(labelList,'labelList.data',{}) || {}));
		store.dispatch(initStatus(lo.get(status,'status.data.evaluateStatus','N')));


	} catch(err) {
		console.error(err);
	}

	return store;

}

export async function evaluationCreateHandle(req, res, store) {

	try {
		let [userPowerResult, evaluationResult, labelList, status] = await Promise.all([
			evaluationApi.getUserPower({
				...lo.get(req, 'params'),
				userId: lo.get(req, 'rSession.user.userId')
			}, req),
			evaluationApi.getEvaluationData(lo.get(req, 'params'), req),
			evaluationApi.getLabelList({}, req),
			evaluationApi.getStatus({
				...lo.get(req, 'params'),
				userId: lo.get(req, 'rSession.user.userId')
			}, req)
		]);

		console.log('==============================================================================')
		console.log(evaluationResult)
		console.log('==============================================================================')
		store.dispatch(initEvaluationData(lo.get(evaluationResult,'evaluationData.data',{}) || {}));
		store.dispatch(initUserPower(lo.get(userPowerResult,'userPower.data.powerEntity',{}) || {}));
		store.dispatch(initLabelList(lo.get(labelList,'labelList.data',{}) || {}));
		store.dispatch(initStatus(lo.get(status,'status.data.evaluateStatus',{}) || {}));


	} catch(err) {
		console.error(err);
	}

	return store;

};

export async function isOpenEvaluateHandle(req, res, store) {
	var params = {};
	var flag = false;
	var channelParams = {
		userId: lo.get(req, 'rSession.user.userId'),
	};
	if (lo.get(req, 'params.channelId')) {
		channelParams.channelId = lo.get(req, 'params.channelId');
		flag = true;
	} else if (req.query.liveId) {
		params.liveId = req.query.liveId;
	}
	try {
		// 拿topicId
		if (flag) {
			let channelData = await channelApi.getChannelInitData(channelParams, req);
			let liveId = lo.get(channelData, 'channelInfo.data.channel.liveId');

			params.liveId = liveId;
		}

		let result = await evaluationApi.isOpen(params, req);
		store.dispatch(initIsOpenEvaluate(lo.get(result, 'isOpen.data.isOpenEvaluate')));
	} catch(err) {
		console.error(err);
	}

	return store;
}
