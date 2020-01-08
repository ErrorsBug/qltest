import lo from 'lodash';
import { stringify } from 'querystring';
import { getKickOutState } from '../../api/wechat/live';

var topicApi = require('../../api/wechat/topic');
var resProcessor = require('../../components/res-processor/res-processor');
var wxUtils = require('../../components/wx-utils/wx-utils');

import {
    initTopicInfo,
    // addForumSpeakList,
    initPageData,
    // addTimestamp,
    setLshareKey,
    // setCanAddSpeak,
    initSubscribe,
    initPushComplite,
    // addDelSpeakIdList
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
export async function topicHandle(req, res, store) {
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
        // 获取发言的时间戳
        let getMsgTime = '1120752000000';
        // 获取发言的方向
        // let beforeOrAfter = 'after';
        // 访问话题的时间戳
        let currentTimeMillis = Date.now();
        // // 是否能插入数据
        // let canAddSpeak = false;

        if (req.cookies && req.cookies.lastVisit) {
            // cookies格式可能不正确
            try{
                lastVisit =  JSON.parse(req.cookies.lastVisit);
            } catch(err) {
                console.error(err,'cookies-value:',req.cookies.lastVisit);
            }
        }

        // let topicData = await topicApi.getThousandLiveInfo(params);
        let [topicData, kickOutRes] = await Promise.all([topicApi.getThousandLiveInfo(params, req), getKickOutState(isKickOutParams, req)]);

        let topicPo = {...lo.get(topicData, 'topicInfo.data.topicPo', {}),...lo.get(topicData, 'topicInfo.data.topicExtendPo', {})};
        let power = lo.get(topicData, 'power.data.powerEntity', null);
        let liveId = lo.get(topicData, 'topicInfo.data.topicPo.liveId', null);
        let channelId = lo.get(topicData, 'topicInfo.data.topicPo.channelId', null);
        let isKickOut = lo.get(kickOutRes, 'data.status');

        if (isKickOut === true) {
            res.redirect(`/wechat/page/link-not-found?type=topicOut&liveId=${liveId}`);
            return false;
        }

        // 判断加载消息流位置
        // 该课程未开播
        // if(currentTimeMillis < topicPo.startTime && power && !power.allowSpeak){
        //     beforeOrAfter = 'after'
        // // 该课程已开播且开播小于两小时
        // }else if (topicPo && topicPo.status != "ended" && (currentTimeMillis <= (topicPo.startTime + 7200000)|| (power && power.allowSpeak))) {
        //     getMsgTime = (currentTimeMillis > topicPo.startTime) ? (currentTimeMillis + 3600000) : topicPo.startTime ;
        //     beforeOrAfter = 'before' ;
        //     canAddSpeak = true;

        // } else if (lastVisit[params.topicId]) {
        //     getMsgTime = lastVisit[params.topicId].speakTime;
        // }

        // 获取发言的参数
        // let getMsgParams = {
        //     topicId: params.topicId,
        //     time:parseInt(getMsgTime),
        //     beforeOrAfter:beforeOrAfter,
        //     hideLuckyMoney:false,
        //     liveId: liveId,
        //     pageNum:1,
        //     pageSize:30,
        //     pullComment:'Y',
        //     userId: lo.get(req, 'rSession.user.userId'),
        // }
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

        let pushCompliteParams = {
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
        // getMsgParams.hideLuckyMoney = topicPo.barrageFlag == 'N' ? false : true;
        
        if (topicPo.sourceTopicId) {
            secondParams.sourceTopicId = topicPo.sourceTopicId;
        }

        // 第二次要请求的数据
        let getDataArr = [
            // topicApi.getRelayDelSpeakIdList({
            //     type: 'speak',
            //     topicId: params.topicId
            // }, req),
            // topicApi.getTopicSpeakNode(getMsgParams, req),
            topicApi.getThousandLiveISecondData(secondParams, req),
            //请求是否推送成就卡
            topicApi.getIspushCompliteCard(pushCompliteParams, req)
        ];

        // 有登录才请求是否关注信息
        if (params.userId){
            getDataArr.push(topicApi.getIsFollow(isFollowParams, req))
            getDataArr.push(topicApi.getIsOrNotListen(smoothHearingOrBuyOriginParams, req))
            getDataArr.push(topicApi.getChannelInfo(smoothHearingOrBuyOriginParams, req))
        }

        // let [delSpeakIdList, forumSpeak, secondData, pushCompliteInfo, requsetIsFollow, isOrNotListen, channelInfo] = await Promise.all(getDataArr);
        let [secondData, pushCompliteInfo, requsetIsFollow, isOrNotListen, channelInfo] = await Promise.all(getDataArr);

        // 获取音频数量，小于20不跳转上课模式
        const topicVideoCount = lo.get(pushCompliteInfo, 'getnowTopicVideoCount.data.topicVideoCount', 0)
        const isSmoothHearing = lo.get(isOrNotListen, 'isOrNotListen.data.isListen');
        const authStatus = lo.get(channelInfo, 'channelInfo.data.channel.authStatus');

        if (params.userId){
            // 处理拉黑
            const isBlack = judgeBlack(req, res, lo.get(secondData, 'blackInfo.data.type', null), liveId);
            if (!isBlack) { return false; }
        }

        // 处理购买权限
        const isAuth = await judgeAuth({
            req,
            res,
            isAuth: lo.get(secondData, 'topicAuth.data.isAuth', null),
            topicId: params.topicId,
            topicPo,
            power,
            userId: params.userId,
            isSmoothHearingOrBuyOrigin: isSmoothHearing === 'N' && authStatus === 'N',
            channelInfo
        });
        
        if (!isAuth) { return false; }
        
        // 处理是否已被删除话题
        const isDelete = judgeIsDeleteTopic(req, res, topicPo,isAuth);
        if (isDelete) { return false; }

        // 判断是否视频类型
        const isVideoLive = judgeIdVideoLive(req, res, topicPo, power, topicVideoCount);
        if (isVideoLive) { return false; }


        // let forumList = lo.get(forumSpeak, 'topicSpeak.data.liveSpeakViews', []);
        // delSpeakIdList = lo.get(delSpeakIdList, 'data.delSpeakIdList', []);

        // // 记录上次播放，但该条音频被撤回，导致拿回的数据为0时处理
        // if (lastVisit[params.topicId] && forumList.length < 1) {
        //     getMsgTime = '1120752000000';
        //     beforeOrAfter = 'after';
        //     getMsgParams.time = getMsgTime;
        //     getMsgParams.beforeOrAfter = beforeOrAfter;
        //     forumSpeak = await topicApi.getTopicSpeakNode(getMsgParams, req);
        //     forumList = lo.get(forumSpeak, 'topicSpeak.data.liveSpeakViews', []);
        // }
        // 判断拿的数据是头还是尾，start是否在第一条，修正位置
        // if (beforeOrAfter == 'before') {
        //     if (forumList.length > 2 &&
        //         forumList[forumList.length - 2].type == 'start'){
        //             const temp = forumList[forumList.length - 1];
        //             forumList[forumList.length - 1] = forumList[forumList.length - 2];
        //             forumList[forumList.length - 2] = temp;
        //     }

        //     forumList = forumList.reverse();
        // }

        // if (beforeOrAfter == 'after') {

        //     if (forumList.length > 2 &&
        //         forumList[1].type == 'start'){
        //             const temp = forumList[1];
        //             forumList[1] = forumList[0];
        //             forumList[0] = temp;
        //     }
        // }

        // 首屏需要注入的数据
        let initData = {
            sid: lo.get(req, 'rSession.sessionId'),
            liveInfo: lo.get(secondData, 'liveInfo.data'),
            // 原本预留做服务端渲染或者react单页面跳转时前端渲染判断使用，后一直没有用到，做优化可去除。
            fromWhere: 'first',
            currentUserId: params.userId,
            browseNum: topicPo.browseNum,
            // beforeOrAfter,
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
        // store.dispatch(setCanAddSpeak(canAddSpeak));
        // store.dispatch(addForumSpeakList(addTimestamp(forumList)));
        // store.dispatch(addDelSpeakIdList(delSpeakIdList));
        store.dispatch(initPageData(initData));
        store.dispatch(setLshareKey(lo.get(secondData, 'lShareKey.data.shareQualify', {}) || {}));
        // 获取是否推送过成就卡，并非首屏需要的数据，需要找时间迁移。
        store.dispatch(initPushComplite(lo.get(pushCompliteInfo, 'shareComplitePushDate.data', {}) || {},lo.get(pushCompliteInfo, 'getnowTopicVideoCount.data', {}) || {}));
        store.dispatch(setIsLiveAdmin(lo.get(secondData, 'isLiveAdmin.data', {}) || {}));
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
export function checkTopicIdIsArray(req, res, topicId) {
    if (Object.prototype.toString.call(topicId)=='[object Array]') {
        const data = {
            ...req.query,
            topicId: topicId[0],
        }
        const queryResult = stringify(data);
        res.redirect(`/topic/details?${queryResult}`);
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
function judgeIdVideoLive (req, res, topicPo, power, topicVideoCount) {
    let data = {
        topicId: topicPo.id,
        ...req.query,
    }
    delete data.minimal;
    const queryResult = stringify(data);

    /**
     * 若现在时间-开课时间>2小时后，默认进极简模式；
     * 若现在时间-开课时间<=2小时，默认进上课模式；
     * 已结束，默认进上课模式；
     */
    if ( power && !power.allowSpeak && /^(normal|ppt|audio)$/.test(topicPo.style) &&  lo.get(req, 'query.tracePage','') === 'liveCenter'  && (topicPo.status == 'ended' || topicPo.currentTimeMillis > (topicPo.startTime + 7200000)) && topicVideoCount >= 20) {
        res.redirect(`/topic/details-listening?${queryResult}`);
        return true;
    }

    return judgeOtherTopicStyle(req, res, topicPo.style=='normal'?'normal':'ppt', topicPo);
    
}

/**
 *judgeOtherTopicStyle
 *
 * @param {any} req
 * @param {any} res
 * @param {any} topicPo
 */
export function judgeOtherTopicStyle (req, res, style, topicPo) {
    let data = {
        topicId: topicPo.id,
        ...req.query,
    }
    const queryResult = stringify(data);

    if (topicPo.style == style) {
        return false;
    }

    if (/^(normal|ppt)$/.test(topicPo.style)) {
        res.redirect(`/topic/details?${queryResult}`);
        return true;
    } else if (/^(audioGraphic|videoGraphic)$/.test(topicPo.style)) {
        // 如果话题类型是音视频，就跳到音视频
        res.redirect(`/topic/details-audio-graphic?${queryResult}`);
        return true;
    } else if (/^(audioLive|videoLive)$/.test(topicPo.style)) {
        // 如果话题类型是音视频直播
        res.redirect(`/topic/details-live?${queryResult}`);
        return true;
    } else if (/^(video|audio)$/.test(topicPo.style)) {
        res.redirect(`/topic/details-video?${queryResult}`);
        return true;
    } else if (/^(graphic)$/.test(topicPo.style)) {
        // 小图文类型
        res.redirect(`/wechat/page/detail-little-graphic?${queryResult}`);
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
async function judgeAuth ({req, res, isAuth, topicId, topicPo, power, userId, isSmoothHearingOrBuyOrigin, channelInfo}) {
    const data = {
        topicId,
        ...req.query,
    }
    const queryResult = stringify(data);

    // 课程数据邀请卡跳转逻辑
    if (req.query.wcl === 'courseDataCard') {
        if (!isAuth) {
            const {
                campId,     // 打卡
                channelId   // 系列课
            } = topicPo;

            let url = '';

            // 打卡话题
            if (campId) {
                url = `/wechat/page/camp-detail?campId=${campId}`;
            }
            else if (channelId) {
                // 由于话题所属的系列课和训练营都具有channelId，可先判断是否为训练营课程
                const camp = await topicApi.getCampByTopicId({
                    topicId,
                    userId
                }, req);
                const trainingId = lo.get(camp, 'data.campPeriod.campId');
                // 训练营话题
                if (trainingId) {
                    url = `/wechat/page/training-intro?campId=${trainingId}`;
                }
                // 系列课话题
                else {
                    url = `/wechat/page/channel-intro?channelId=${channelId}`;
                }
            }
            // 无关联类型的话题（单课）
            else {
                url = `/wechat/page/topic-intro?topicId=${topicId}`
            }

            url && res.redirect(url);

            return false;
        }
    }

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
        // 一元解锁课跳到系列课介绍页
        const discountStatus = lo.get(channelInfo, 'channelInfo.data.chargeConfigs[0].discountStatus', 'normal')
        if(discountStatus == 'UNLOCK') {
            res.redirect(`/wechat/page/channel-intro?channelId=${topicPo.channelId}`);
            return false
        }
        // 没有报名（包含没有支付和没有输入过密码），跳转到介绍页
        res.redirect(`/wechat/page/topic-intro?${queryResult}`);
        return false;
    } else {
        return true;
    }
}

/**
 * 处理是否已经开始话题
 *
 * @param {any} req
 * @param {any} res
 */
function judgeIsStartTopic (req, res, topicPo) {
    let data = {
        ...req.query,
    }
    delete data.minimal;
    const queryResult = stringify(data);
    // 话题正在进行中
    if (topicPo.status === 'beginning' && topicPo.startTime < topicPo.currentTimeMillis) {
        return true;
    } else if(topicPo.style !== 'video' && topicPo.style !== 'audio') {
        try {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
        } catch (error) {
            console.error(error);
        }
        return false;
    } else {
        return true;
    }
}


/**
 * 处理是否已经删除话题
 *
 * @param {any} req
 * @param {any} res
 */
export function judgeIsDeleteTopic (req, res, topicPo, isAuth) {
    // 话题已被删除
    if (topicPo.status === 'delete') {
        res.redirect(`/wechat/page/link-not-found?type=topic&liveId=${topicPo.liveId}`);
        return true;
    } else if (!isAuth && topicPo.displayStatus == 'N') {
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
