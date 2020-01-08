/**
 * Created by dylanssg on 2017/5/5.
 */
import lo from 'lodash';

var mineApi = require('../../api/wechat/mine');

// actions
import {
	initMyLive,
	initMyWallet,
} from '../../../site/wechat-react/other-pages/actions/mine';
import {
	initUserInfo
} from '../../../site/wechat-react/other-pages/actions/common'


export async function mineHandle(req, res, store) {
	try {
		var result = await mineApi.getMyLive({
			userId: lo.get(req, 'rSession.user.userId')
		}, req);

		store.dispatch(initMyLive(lo.get(result, 'myLive.data.entityPo', {})));

	} catch (err) {
		console.error(err);
	}

	return store;

}

export async function myWalletHandle(req, res, store) {

	let params = {
		userId: lo.get(req, 'rSession.user.userId')
	}

	try {
		var result = await mineApi.getMyWallet(params, req);
		store.dispatch(initMyWallet(lo.get(result, 'myWallet.data', {}) || {}));
	} catch (err) {
		console.error(err);
	}
	return store;
}

export async function joinedTopicHandle(req, res, store) {
	try {
		store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {})));
	} catch (err) {
		console.error(err);
	}
	return store;
}
