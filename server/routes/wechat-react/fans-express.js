import lo from 'lodash';

const fansActiveApi = require('../../api/wechat/fans-active');
const mineApi = require('../../api/wechat/mine');

// actions
import {
    initOpsLiveInfo,
} from '../../../site/wechat-react/other-pages/actions/fans-active'

export async function fansExpressHandle(req, res, store) {
    const lid = lo.get(req, 'query.lid');
    const userId = lo.get(req, 'rSession.user.userId');
    const result = await mineApi.getMyLive({
		userId
    }, req);

    const entityPo = lo.get(result, 'myLive.data.entityPo', {})

	if (!entityPo) {
		res.redirect(`/wechat/page/create-live`);
		return false;
	}

	const liveId = lid || entityPo.id;

    store.dispatch(initOpsLiveInfo({
        liveId
    }));

    return store;
};
