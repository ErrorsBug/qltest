/**
 * Created by dylanssg on 2017/5/5.
 */
import lo from 'lodash';

var analysisApi = require('../../api/wechat/profit');

// actions
import {
	profitRecordTopicUpdate,
	profitRecordChannelUpdate,
	profitRecordRecommendTotal,
	initAnalysisPageData,
	profitRecommendTopic,
} from '../../../site/wechat-react/other-pages/actions/profit';


export async function profitAnalysisTopicHandle(req, res, store) {
	const state = store.getState();
	let params = {
		liveId : lo.get(req, 'params.liveId'),
		userId : lo.get(req, 'rSession.user.userId'),
		pageNum : state.profit.pageNum,
		pageSize : state.profit.pageSize
	}
	let initData = {
		currentTimeMillis : Date.now()
	}


	try {
		var result = await analysisApi.getTopicAnalysisList(params, req);
		let power = await lo.get(result,'power.data.powerEntity',{});
		let topicList = await lo.get(result,'topicAnalysis.data.topicList',[]);

		if(power&&!power.allowMGLive){
			res.redirect(`/wechat/page/mine`);
			return false;
		}

		store.dispatch(profitRecordTopicUpdate(topicList));
		if(topicList.length > 0){
			initData.pageNum = 2;
		}
		store.dispatch(initAnalysisPageData(initData));

	} catch(err) {
		console.error(err);
	}

	return store;

}


export async function profitAnalysisChannelHandle(req, res, store) {
	const state = store.getState();
	let params = {
		liveId : lo.get(req, 'params.liveId'),
		userId : lo.get(req, 'rSession.user.userId'),
		pageNum : state.profit.pageNum,
		pageSize : state.profit.pageSize
	}
	let initData = {
		currentTimeMillis : Date.now()
	}
	try {
		var result = await analysisApi.getChannelAnalysisList(params, req);
		let power = await lo.get(result,'power.data.powerEntity',{});
		let channelList = await lo.get(result,'channelAnalysis.data.channelList',[]);

		if(power&&!power.allowMGLive){
			res.redirect(`/wechat/page/mine`);
			return false;
		}
		store.dispatch(profitRecordChannelUpdate(channelList));
		if(channelList.length > 0){
			initData.pageNum = 2;
		}
		store.dispatch(initAnalysisPageData(initData));

	} catch(err) {
		console.error(err);
	}

	return store;

}

export async function profitAnalysisRecommendHandle(req, res, store) {
	const state = store.getState();
	let params = {
		liveId: lo.get(req, 'params.liveId'),
		userId: lo.get(req, 'rSession.user.userId'),
		page: {
			page: state.profit.recommendTopicPage,
			size: state.profit.recommendTopicSize
		},
		type: 'topic'
	}
	let initData = {
		currentTimeMillis : Date.now()
	}
	try {
		var result = await analysisApi.getRecommendysisList(params, req);

		let qualify = await lo.get(result,'qualify.data.platformShareQualifyPo');
		// console.log('profitAnalysisRecommendHandle----2=>', result, qualify)

		// 没开启的需要跳去开启
		if (!qualify || JSON.stringify(qualify) == '{}' || qualify.status == 'N') {
			res.redirect(`/wechat/page/distribution/live-center-options?liveId=${lo.get(req, 'params.liveId')}`);
			return false;
		}
		let power = await lo.get(result,'power.data.powerEntity',{});
		let resultList = await lo.get(result,'profitList.data.resultList',[]);
		let totalProfit = await lo.get(result,'totalProfit.data', {});
		if(power && !power.allowMGLive){
			res.redirect(`/wechat/page/mine`);
			return false;
		}
		store.dispatch(profitRecommendTopic(resultList));
		if(resultList.length > 0){
			initData.recommendTopicPage = 2;
		}
		store.dispatch(initAnalysisPageData(initData));
		store.dispatch(profitRecordRecommendTotal(totalProfit));


	} catch(err) {
		console.error(err);
	}

	return store;
}
