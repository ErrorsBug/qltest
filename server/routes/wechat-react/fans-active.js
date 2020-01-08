import lo from 'lodash';

var fansActiveApi = require('../../api/wechat/fans-active');

// actions
import {
    initOpsLiveInfo,
} from '../../../site/wechat-react/other-pages/actions/fans-active'

export async function fansActiveHandle(req, res, store) {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        liveId: lo.get(req, 'query.liveId')
    };

    try {
        let result = await fansActiveApi.getOpsLiveInfo(params, req);
        let liveInfo = lo.get(result, 'liveInfo.data.info', {}) || {};



        // code不为0则为不匹配的直播间
        if (lo.get(result, 'liveInfo.state.code') != 0) {
            res.render('404');
            return false;
        }

        store.dispatch(initOpsLiveInfo(liveInfo));

    } catch(err) {
        console.error(err);
    }

    return store;
};
