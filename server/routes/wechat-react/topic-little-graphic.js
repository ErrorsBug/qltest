import lo from 'lodash';
import { stringify } from 'querystring';

var littleGraphicApi = require('../../api/wechat/topic-little-graphic');
var resProcessor = require('../../components/res-processor/res-processor');
var wxUtils = require('../../components/wx-utils/wx-utils');




import { 
    updateLittleGraphicContentList,
    updateLittleGraphicBaseInfo,
} from '../../../site/wechat-react/check-in-camp/model/little-graphic/actions';
import { 
    fetchAuthInfoSuccess,
} from '../../../site/wechat-react/check-in-camp/model/camp-auth-info/actions';

/**
 * 话题详情页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function littleGraphicHandle(req, res, store) {
    try {
        let params = {
            userId: lo.get(req, 'rSession.user.userId',null),
            topicId: lo.get(req, 'query.topicId'),
            campId: lo.get(req, 'params.campId', ''),
            time:'1120752000000'
        };
        
        // 检测是否有多个topicId
        const topicIdIsArr = checkTopicIdIsArray(req, res, params.topicId);
        if (topicIdIsArr) { return false; }

        
        let topicData = await littleGraphicApi.getLittleGraphicInfo(params, req);
        let topicPo = {...lo.get(topicData, 'topicInfo.data.topicPo', {}),...lo.get(topicData, 'topicInfo.data.topicExtendPo', {})};
        let baseInfo = {...lo.get(topicData, 'getInfo.data.baseInfo', {})};
        let power = lo.get(topicData, 'power.data.powerEntity', {});
        let liveId = lo.get(topicData, 'getInfo.data.baseInfo.liveId', null);
        let channelId = lo.get(topicData, 'getInfo.data.baseInfo.channelId', null);
        let campId = lo.get(topicData, 'getInfo.data.baseInfo.campId', null);
        let contentList = lo.get(topicData, 'contentList.data.contentList', []);
        let kickoutStatus = lo.get(topicData, 'kickoutInfo.data.kickOutStatus', '');
        
        const isKickout = kickoutStatus === 'Y';
        if (isKickout) {
            res.redirect(`/wechat/page/link-not-found?type=campOut&liveId=${params.liveId || campPo.liveId || baseInfo.liveId}`);
            return false;
        }
        
        if(params.topicId && !params.campId){
            // 处理是否已被删除话题
            const isDelete = judgeIsDeleteTopic(req, res, topicPo,power);
            if (isDelete) { return false; }
            
            // 判断是否视频类型
            const isVideoLive = judgeIdVideoLive(req, res, topicPo);
            if (isVideoLive) { return false; }
    
                // 处理拉黑
            const isBlack = judgeBlack(req, res, lo.get(topicData, 'blackInfo.data.type', null), liveId);
            if (!isBlack) { return false; }
            
        }



        // 如果是进入编辑页面的话，地址有campId,要做权限判断。
        if (params.campId) {
            const isAuth = judgeAuth({
                req,
                res,
                campId:params.campId,
                power,
            });
            
            if (!isAuth) { return false; }

        }
        
        


         



        store.dispatch(updateLittleGraphicBaseInfo({baseInfo}));
        store.dispatch(updateLittleGraphicContentList({contentList}));
        store.dispatch(fetchAuthInfoSuccess(power));

    } catch(err) {
        console.error(err);
        res.render('500');
        return false;
    }

    return store;
};


/**
 * 检测是否有多个topicId
 *
 * @param {any} topicId
 * @returns
 */
function checkTopicIdIsArray(req, res, topicId) {
    if (Object.prototype.toString.call(topicId)=='[object Array]') {
        const data = {
            ...req.query,
            topicId: topicId[0],
        }
        const queryResult = stringify(data);
        res.redirect(`/wechat/page/detail-little-graphic?${queryResult}`);
        return true;
    } else {
        return false;
    }
}




/**
 * 拉黑处理
 *
 * @param {any} blackType
 * @returns
 */
function judgeBlack (req, res, blackType, liveId) {
    if (blackType === 'channel') {
        resProcessor.reject(req, res, {
            liveId: liveId
        });
        return false;
    } else if (blackType === 'live') {
        resProcessor.reject(req, res, {
            isLive: true,
            liveId: liveId
        });
        return false;
    } else if (blackType === 'user') {
        res.redirect('/black.html?code=inactived');
        return false;
    } else {
        return true;
    }
}

/**
 *
 *
 * @param {any} req
 * @param {any} res
 * @param {any} topicPo
 */
function judgeIdVideoLive (req, res, topicPo) {
    const data = {
        topicId: topicPo.id,
        ...req.query,
    }
    const queryResult = stringify(data);

    
    if (/^(audioGraphic|videoGraphic)$/.test(topicPo.style)) {
        // 音视频图文
        res.redirect(`/topic/details-audio-graphic?${queryResult}`);
        return true;
    } else if (/^(video|audio)$/.test(topicPo.style)) {
        // 音视频
        res.redirect(`/topic/details-video?${queryResult}`);
        return true;
    } else if (!/^(graphic)$/.test(topicPo.style)) {
        // 普通类型
        res.redirect(`/topic/details?${queryResult}`);
        return true;
    } else {
        return false;
    }
}


/**
 * 进入话题权限判断
 *
 * @param {any} req
 * @param {any} res
 * @param {any} isAuth
 */
function judgeAuth ({req, res, campId ,power}) {

    if (power && (power.allowSpeak || power.allowMGLive)) {
        // 有管理权限或者发言权限可以直接接入
        return true;
    } else {
        res.redirect(`/wechat/page/camp-detail?campId=${campId}`);
        return false;
    }
}


/**
 * 处理是否已经删除话题
 *
 * @param {any} req
 * @param {any} res
 */
function judgeIsDeleteTopic (req, res, topicPo, power) {
    // 话题已被删除
    if (topicPo.status === 'delete') {
        res.redirect(`/wechat/page/link-not-found?type=topic&liveId=${topicPo.liveId}`);
        return true;
    } else if (!power.allowMGLive && topicPo.displayStatus == 'N') {
        // 话题隐藏
        try {
            res.redirect(`/wechat/page/topic-hide?liveId=${topicPo.liveId}`);
        } catch (error) {
            console.error('话题隐藏报错！！');
        }
        return true;
    }else if (!topicPo.status) {
        res.redirect(`/wechat/page/link-not-found?type=topic`);
        return true;
    } else {
        return false;
    }
}