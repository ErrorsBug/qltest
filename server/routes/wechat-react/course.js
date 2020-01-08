import lo from 'lodash';

const timelineApi = require('../../api/wechat/timeline');

import {
    initCurrentLive,
} from '../../../site/wechat-react/other-pages/actions/timeline'

export async function coursePushHandle(req,res,store){
    try{
        const userId = lo.get(req, 'rSession.user.userId');
        const currentLive = await timelineApi.getMyLive({userId}, req)
        const myCurrentLiveId = lo.get(currentLive, 'myLive.data.entityPo.id')

        store.dispatch(initCurrentLive({myCurrentLiveId, userId}));
    } catch(err){
        console.error(err)
    }

    return store
}
