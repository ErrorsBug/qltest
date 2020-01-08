import lo from 'lodash';
var nightAnswerApi = require('../../api/wechat/night-answer');
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

import {
    initNightAnswer,
    nightAnswerShowList,
    getAnswerList,
} from '../../../site/wechat-react/other-pages/actions/night-answer'

/**
 * 营销推广设置
 * 
 * @export
 * @param {any} req 
 * @param {any} res 
 * @param {any} store 
 * @returns 
 */
export async function nightAnswer(req, res, store) {
    const params = {
        topicId: req.query.topicId
    };
    if(req.query.from){
        params.from = req.query.from
    }
    try{
        const result = await nightAnswerApi.getTopicInfo(params,req);
        const audioInfo = lo.get(result, 'topicInfo.data.topic', {});
        // 设置到store
        store.dispatch(initNightAnswer({
            ...audioInfo,
        }))
    }catch(err) {
        console.error(err);
    }

    return store;
};
export async function nightAnswerShow(req, res, store) {
    const state = store.getState();
    let {
        nightAnswer: {
            pageNum: page,
            pageSize: size
        }
    } = state;

    let params = {
        page: {
            page: page,
            size: size
        }
    };
    try {
        const result = await nightAnswerApi.getNightAnswerShow(params, req);
        const resultInfo = lo.get(result, 'showList.data.list', []);
        store.dispatch(nightAnswerShowList(resultInfo));

    } catch(err) {
        console.error(err);
    }
    return store;
};
export async function nightAnswerList(req, res, store) {
    var params = {
        userId: lo.get(req, 'rSession.user.userId'),
        topicId: req.query.topicId,
        page: {
            page: 1,
            size: 50
        }
    };
    if(req.query.from){
        params.from = req.query.from
    }
    try {
        const result = await nightAnswerApi.getAnswerList(params, req);
        store.dispatch(getAnswerList(result[0].data.list));

    } catch(err) {
        console.error(err);
    }
    return store;
};
