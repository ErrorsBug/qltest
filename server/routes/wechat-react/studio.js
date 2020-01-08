/**
 * Created by dylanssg on 2017/5/5.
 */
import lo from 'lodash';

var mineApi = require('../../api/wechat/mine');
var studioApi = require('../../api/wechat/studio');
var liveApi = require('../../api/wechat/live');

// actions
import {
	initLiveInfo,
} from '../../../site/wechat-react/live-studio/actions/live';
import {
	initUserInfo,
	isLogin
} from '../../../site/wechat-react/live-studio/actions/common'


export async function studioMineHandle(req, res, store) {

	if(!req.query.fromLiveId){
		try {
			var result = await mineApi.getMyLive({
				userId: lo.get(req, 'rSession.user.userId')
			}, req);
			const entity = lo.get(result, 'myLive.data.entityPo')
			if(entity){
				store.dispatch(initLiveInfo(lo.get(result, 'myLive.data.entityPo', {})));
			}

		} catch (err) {
			console.error(err);
		}
	}
	return store;

}

export async function introHandle(req, res) {
	const userId = lo.get(req, 'rSession.user.userId');
	const type = lo.get(req, 'query.type');
	var result = await mineApi.getMyLive({
		userId
	}, req);

	const entityPo = lo.get(result, 'myLive.data.entityPo', {})

	if (!entityPo) {
		res.redirect(`/wechat/page/create-live`);
		return false;
	}

	const liveId = entityPo.id;
	
	res.redirect(`/topic/live-studio-intro?liveId=${liveId}`);

	// const adminResult = await studioApi.getIsLiveAdmin({
	// 	liveId,
	// 	userId,
	// }, req)

	// if (adminResult.state.code == 0) {
	// 	if (adminResult.data.isLiveAdmin === 'Y') {
	// 		if (type == 'h5') {
	// 			res.redirect(`/wechat/page/backstage?liveId=${liveId}`);
	// 		} else {
	// 			res.redirect(`/video/admin/live/home?liveId=${liveId}`);
	// 		}
	// 	} else {
	// 		res.redirect(`/topic/live-studio-intro?liveId=${liveId}`);
	// 	}
	// } else {
	// 	res.render('404');
	// }

	return false;
}

/**
 * 非直播间的创建者和管理员，没权限访问直播间的推广投放页面
 * @param {*} req 
 * @param {*} res 
 */
export async function mediaPromotionHandle(req, res, store){
	const userId = lo.get(req, 'rSession.user.userId')
	const liveId = lo.get(req, 'params.liveId');
	const result = await liveApi.getLiveRole({
		userId,
		liveId
	}, req);
	const role = lo.get(result, 'data.role');
	if (!role) {
		res.render('500', {
            msg: '无权限访问'
        });
        return;
	}
	return store;
}

export async function boutiqueCourseHandle(req, res, store) {
	const userId = lo.get(req, 'rSession.user.userId');
	if (userId) {
		store.dispatch(isLogin(userId))
	}
	return store;
}

export async function topTenCourseHandle(req, res, store) {
	const userId = lo.get(req, 'rSession.user.userId');
	if (userId) {
		store.dispatch(isLogin(userId))
	}
	return store;
}

export async function favourableCourseHandle(req, res, store) {
	const userId = lo.get(req, 'rSession.user.userId');
	if (userId) {
		store.dispatch(isLogin(userId))
	}
	return store;
}
