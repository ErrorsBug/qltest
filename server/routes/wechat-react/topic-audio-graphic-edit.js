import lo from 'lodash';
import { stringify } from 'querystring';

var audioGraphicApi = require('../../api/wechat/topic-audio-graphic');
var resProcessor = require('../../components/res-processor/res-processor');
var wxUtils = require('../../components/wx-utils/wx-utils');




import {
    getTopicInfo,
    initTopicInfo,
    initPageData,
    setLshareKey,
} from '../../../site/wechat-react/audio-graphic/actions/audio-graphic';


/**
 * 话题详情页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function audioGraphicEditHandle(req, res, store) {
    try {
        let params = {
            userId: lo.get(req, 'rSession.user.userId',null),
            topicId: lo.get(req, 'query.topicId'),
            sessionId: req.rSession.sessionId,
        };

        let topicData = await audioGraphicApi.getAudioGraphicInfo(params, req);
        let topicPo = {...lo.get(topicData, 'topicInfo.data.topicPo', {}),...lo.get(topicData, 'topicInfo.data.topicExtendPo', {})};
        let power = lo.get(topicData, 'power.data.powerEntity', null);
        let liveId = lo.get(topicData, 'topicInfo.data.topicPo.liveId', null);
        let channelId = lo.get(topicData, 'topicInfo.data.topicPo.channelId', null);





        // 处理是否已被删除话题
        const isAuth = judgeAuth(req, res, params.topicId,power);
        if (!isAuth) { return false; }




        store.dispatch(initTopicInfo(topicPo));

    } catch(err) {
        console.error(err);
        res.render('500');
        return false;
    }

    return store;
};





/**
 * 进入话题权限判断
 *
 * @param {any} req
 * @param {any} res
 * @param {any} isAuth
 */
function judgeAuth(req, res, topicId, power) {
    const data = {
        topicId,
        ...req.query,
    }
    const queryResult = stringify(data);

    if (power && (power.allowSpeak || power.allowMGLive)) {
        // 有管理权限或者发言权限可以直接接入
        return true;
    } else {
        res.redirect(`/wechat/page/topic-intro?${queryResult}`);
        return false;
    }
}
