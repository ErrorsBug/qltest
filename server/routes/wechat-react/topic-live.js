import lo from 'lodash';
import { stringify } from 'querystring';
import { getKickOutState } from '../../api/wechat/live';
import { judgeOtherTopicStyle,checkTopicIdIsArray,judgeIsDeleteTopic } from './topic';

var topicApi = require('../../api/wechat/topic');
var resProcessor = require('../../components/res-processor/res-processor');
var wxUtils = require('../../components/wx-utils/wx-utils');

import {
    initTopicInfo,
    initPageData,
    addTimestamp,
    setLshareKey,
    initSubscribe,
} from '../../../site/wechat-react/thousand-live/actions/thousand-live-common';



import {
    setIsLiveAdmin,
} from '../../../site/wechat-react/thousand-live/actions/common';


/**
 * 话题详情页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function topicLiveHandle(req, res, store) {
    try {

        let isKickOutParams = {
            userId: lo.get(req, 'rSession.user.userId',null),
            businessId: lo.get(req, 'query.topicId'),
            type: 'topic',
        }

        let params = {
            userId: lo.get(req, 'rSession.user.userId',null),
            topicId: lo.get(req, 'query.topicId'),
            sessionId: req.rSession.sessionId,
        };

        // 检测是否有多个topicId
        const topicIdIsArr = checkTopicIdIsArray(req, res, params.topicId);
        if (topicIdIsArr) { return false; }

        // 历史访问记录
        let lastVisit = {};
        // 访问话题的时间戳
        let currentTimeMillis = Date.now();

        let [topicData, kickOutRes] = await Promise.all([topicApi.getThousandLiveInfo(params, req), getKickOutState(isKickOutParams, req)]);

        let topicPo = {...lo.get(topicData, 'topicInfo.data.topicPo', {}),...lo.get(topicData, 'topicInfo.data.topicExtendPo', {}),createUser:lo.get(topicData, 'topicInfo.data.createUser', {})};
        let power = lo.get(topicData, 'power.data.powerEntity', null);
        let liveId = lo.get(topicData, 'topicInfo.data.topicPo.liveId', null);
        let channelId = lo.get(topicData, 'topicInfo.data.topicPo.channelId', null);
        let isKickOut = lo.get(kickOutRes, 'data.status');

        if (isKickOut === true) {
            res.redirect(`/wechat/page/link-not-found?type=topicOut&liveId=${liveId}`);
            return false;
        }




        // 获取第二批数据的参数
        let secondParams = {
            sessionId: req.rSession.sessionId,
            userId: params.userId,
            topicId: params.topicId,
            liveId: liveId,
            channelNo: lo.get(req, 'query.pro_cl')||lo.get(req, 'cookies.pro_cl'),
        };
        // 获取关注信息的参数
        let isFollowParams = {
            liveId: liveId,
            userId: params.userId,
            topicId: params.topicId,
        }

        let smoothHearingOrBuyOriginParams = {
            userId: params.userId,
            liveId,
            topicId: params.topicId,
            channelId
        }

        topicPo.currentTimeMillis = currentTimeMillis;
        
        if (topicPo.sourceTopicId) {
            secondParams.sourceTopicId = topicPo.sourceTopicId;
        }

        // 第二次要请求的数据
        let getDataArr = [
            topicApi.getThousandLiveISecondData(secondParams, req),
        ];

        // 有登录才请求是否关注信息
        if (params.userId){
            getDataArr.push(topicApi.getIsFollow(isFollowParams, req))
            getDataArr.push(topicApi.getIsOrNotListen(smoothHearingOrBuyOriginParams, req))
            getDataArr.push(topicApi.getChannelInfo(smoothHearingOrBuyOriginParams, req))
        }

        let [ secondData, requsetIsFollow, isOrNotListen, channelInfo] = await Promise.all(getDataArr);

        const isSmoothHearing = lo.get(isOrNotListen, 'isOrNotListen.data.isListen');
        const authStatus = lo.get(channelInfo, 'channelInfo.data.channel.authStatus');

        if (params.userId){
            // 处理拉黑
            const isBlack = judgeBlack(req, res, lo.get(secondData, 'blackInfo.data.type', null), liveId);
            if (!isBlack) { return false; }
        }

        // 处理购买权限
        const isAuth = judgeAuth({
            req,
            res,
            isAuth: lo.get(secondData, 'topicAuth.data.isAuth', null),
            topicId: params.topicId,
            topicPo,
            power,
            userId: params.userId,
            isSmoothHearingOrBuyOrigin: isSmoothHearing === 'N' && authStatus === 'N'
        });
        
        if (!isAuth) { return false; }
        
        // 处理是否已被删除话题
        const isDelete = judgeIsDeleteTopic(req, res, topicPo,isAuth);
        if (isDelete) { return false; }

        // 判断是否其他类型
        const isVideoLive = judgeOtherTopicStyle(req, res, topicPo.style == 'audioLive'?'audioLive':'videoLive', topicPo );
        if (isVideoLive) { return false; }




        // 首屏需要注入的数据
        let initData = {
            sid: lo.get(req, 'rSession.sessionId'),
            liveInfo: lo.get(secondData, 'liveInfo.data'),
            currentUserId: params.userId,
            browseNum: topicPo.browseNum,
            currentTimeMillis: Date.now(),
        };

        // 有登录才插入数据
        if (params.userId){

            let hasData = {
                power,
                isLogin:true,
                isAlert: lo.get(requsetIsFollow, 'isFollow.data.isAlert',false),
                isFollow: lo.get(requsetIsFollow, 'isFollow.data.isFollow',false),
                userId:params.userId,
            }

            initData = { ...initData,...hasData};

            // 这里特殊处理，因为后台可能返回null;
            let isSubscribe = lo.get(requsetIsFollow, 'isSubscribe.data',{})||{};

            // 针对大j小d课程特殊处理
            if(params.topicId === '2000000401408228'){
                isSubscribe.subscribe = true;
                isSubscribe.isFocusThree = true;
            }
            store.dispatch(initSubscribe(isSubscribe));
        }
        store.dispatch(initTopicInfo(topicPo));
        store.dispatch(initPageData(initData));
        store.dispatch(setLshareKey(lo.get(secondData, 'lShareKey.data.shareQualify', {}) || {}));
        store.dispatch(setIsLiveAdmin(lo.get(secondData, 'isLiveAdmin.data', {}) || {}));
    } catch(err) {
        console.error(err);
        res.render('500');
        return false;
    }

    return store;
};



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
 * 进入话题权限判断
 *
 * @param {any} req
 * @param {any} res
 * @param {any} isAuth
 */
function judgeAuth ({req, res, isAuth, topicId, topicPo, power, userId, isSmoothHearingOrBuyOrigin}) {
    const data = {
        topicId,
        ...req.query,
    }
    const queryResult = stringify(data);

    if (power && (power.allowSpeak || power.allowMGLive)) {
        // 不是畅听 & 没有购买原课 & 是转载
        if (isSmoothHearingOrBuyOrigin && topicPo.isRelay === 'Y') {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false
        }
        // 有管理权限或者发言权限可以直接接入
        return true;
    } else if (
        topicPo &&
        topicPo.isNeedAuth == 'N' &&
        topicPo.type == 'public' &&
        topicPo.displayStatus == 'Y' &&
        !(topicPo.channelId && topicPo.isAuditionOpen != 'Y')
    ) {
        // 如果非频道话题是免费的，且没有开启介绍页，可以直接进入
        // 如果频道话题开启了免费试听的，可以直接进入
        return true;
    } else if (!userId) {
        // 如果没有登录，就跳到登录页
        var pageUrl = req.protocol + '://' + req.get('Host') + req.originalUrl;
        // res.redirect(`/api/wx/login?redirect_url=${encodeURIComponent(pageUrl)}`);
        // 去到登录页（或手动授权）
        wxUtils.goWxAuth(req, res, pageUrl);
        return false;
    } else if (!isAuth) {
        // 没有报名（包含没有支付和没有输入过密码），跳转到介绍页
        res.redirect(`/wechat/page/topic-intro?${queryResult}`);
        return false;
    } else {
        return true;
    }
}



