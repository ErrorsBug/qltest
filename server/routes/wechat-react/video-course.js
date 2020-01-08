import lo from "lodash";
import moment from "moment";
import { stringify } from "querystring";
import { getKickOutState } from "../../api/wechat/live";
const conf = require('../../conf');

var topicApi = require("../../api/wechat/topic");
var resProcessor = require("../../components/res-processor/res-processor");

import {
    initTopicInfo,
    addForumSpeakList,
    initPageData,
    setLshareKey,
    addDelSpeakIdList
} from "../../../site/wechat-react/video-course/actions/video";
import {
    setIsLiveAdmin,
    initUserInfo,
    initIsSubscribe
} from "../../../site/wechat-react/video-course/actions/common";
import proxy from "../../components/proxy/proxy";

async function getIsSubscribe(req) {
    let userId = lo.get(req, "rSession.user.userId");
    let topicId = req.query.topicId;

    let topicInfo = await proxy.apiProxyPromise(
        conf.baseApi.topic.topicInfo,
        { userId, topicId },
        conf.baseApi.secret);
    let liveId = lo.get(topicInfo, "data.topicPo.liveId");
    let isSubscribe = await proxy.apiProxyPromise(
        conf.baseApi.user.isSubscribe,
        { userId, topicId, liveId },
        conf.baseApi.secret
    );
    return isSubscribe.data;
}

const addTimestamp = function(list) {
    if (!list || !Array.isArray(list)) {
        return [];
    }
    // 跟踪到最近的拥有createBy字段的数据的距离
    let count = 1;
    return list.map((data, idx, list) => {
        if (idx === 0) {
            return Object.assign({}, data, { showTime: false });
        }
        if (!data.createTime) {
            count++;
            return Object.assign({}, data, { showTime: false });
        }
        const currentTime =
            typeof data.createTime === "object"
                ? data.createTime.time
                : data.createTime;
        const lastTime =
            typeof list[idx - count].createTime === "object"
                ? list[idx - count].createTime.time
                : list[idx - count].createTime;
        const timeDiff = moment(Number(currentTime)).diff(
            moment(Number(lastTime)),
            "second"
        );
        if (Math.abs(timeDiff) >= 61) {
            count = 1;
            return Object.assign({}, data, { showTime: true });
        }
        return Object.assign({}, data, { showTime: false });
    });
};

/**
 * 视频话题详情页store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function videoCourseSimpleModeHandle(req, res, store) {
    try {
        const isKickOutParams = {
            userId: lo.get(req, "rSession.user.userId", null),
            businessId: lo.get(req, "query.topicId"),
            type: "topic"
        };

        const params = {
            userId: lo.get(req, "rSession.user.userId"),
            topicId: lo.get(req, "query.topicId"),
            sessionId: req.rSession.sessionId
        };

        // 这里对 res.isWeapp和res.weappLinkTo  解释：
        // res.isWeapp是判断是否小程序跳转，小程序跳转的链接后面会带上weapp=Y参数
        // res.weappLinkTo是经过服务端各种判断后，在h5上需要跳转到h5的介绍页、直播间主页之类的，在小程序上就需要跳转到
        // 小程序的页面，而小程序只能在页面内部跳转，所以这个字段只是指明需要跳转的页面地址，真正跳转还是传到页面上，然后
        // 调用小程序的api跳转
        const isWeapp = lo.get(req, "query.weapp") === "Y";
        req.isWeapp = isWeapp;

        const [topicData, kickOutRes] = await Promise.all([
            topicApi.getThousandLiveInfo(params, req),
            getKickOutState(isKickOutParams, req)
        ]);

        const liveId = lo.get(topicData, "topicInfo.data.topicPo.liveId", null);
        const topicPo = lo.get(topicData, "topicInfo.data.topicPo", {});
        const power = lo.get(topicData, "power.data.powerEntity", null);
        const isKickOut = lo.get(kickOutRes, "data.status");
        const topicExtendPo = lo.get(topicData, "topicInfo.data.topicExtendPo");
        const userInfo = lo.get(req, "rSession.user");
        const isSubscribe = await getIsSubscribe(req);

        store.dispatch(initIsSubscribe(isSubscribe));
        store.dispatch(
            initUserInfo({
                user: userInfo
            })
        );

        if (isKickOut === true) {
            res.redirect(
                `/wechat/page/link-not-found?type=topicOut&liveId=${liveId}`
            );
            return false;
        }

        // B端回旧版
        if (power && power.allowMGLive) {
            res.redirect(`/topic/details-video?topicId=${params.topicId}`);
            return false;
        } else {
            // 判断是否视频类型
            const isVideoLive = judgeIdVideoLive(req, res, topicPo);
            if (!isVideoLive) {
                return false;
            }
        }
        const secondParams = {
            sessionId: req.rSession.sessionId,
            userId: params.userId,
            topicId: params.topicId,
            liveId: liveId,
            channelNo:
                lo.get(req, "query.pro_cl") || lo.get(req, "cookies.pro_cl")
        };
        const isFollowParams = {
            liveId: liveId,
            userId: params.userId
        };

        topicPo.currentTimeMillis = Date.now();

        if (topicPo.sourceTopicId) {
            secondParams.sourceTopicId = topicPo.sourceTopicId;
        }

        let smoothHearingOrBuyOriginParams = {
            userId: params.userId,
            liveId,
            topicId: params.topicId,
            channelId: topicPo.channelId
        };

        let [
            secondData,
            requsetIsFollow,
            isOrNotListen,
            channelInfo
        ] = await Promise.all([
            topicApi.getThousandLiveISecondData(secondParams, req),
            topicApi.getIsFollow(isFollowParams, req),
            topicApi.getIsOrNotListen(smoothHearingOrBuyOriginParams, req),
            topicApi.getChannelInfo(smoothHearingOrBuyOriginParams, req)
        ]);

        // 处理是否已被删除话题
        const isDelete = judgeIsDeleteTopic(
            req,
            res,
            topicPo,
            lo.get(secondData, "topicAuth.data.isAuth", null)
        );
        if (isDelete) {
            return false;
        }

        const isSmoothHearing = lo.get(
            isOrNotListen,
            "isOrNotListen.data.isListen"
        );
        const authStatus = lo.get(
            channelInfo,
            "channelInfo.data.channel.authStatus"
        );

        // 处理拉黑
        const isBlack = judgeBlack(
            req,
            res,
            lo.get(secondData, "blackInfo.data.type", null),
            liveId
        );
        if (!isBlack) {
            return false;
        }

        // 处理购买权限
        const isAuth = judgeAuth(
            req,
            res,
            lo.get(secondData, "topicAuth.data.isAuth", null),
            params.topicId,
            power,
            topicPo,
            isSmoothHearing === "N" && authStatus === "N",
            channelInfo
        );
        if (!isAuth) {
            return false;
        }

        // 处理是否已经开始话题
        // const isStart = judgeIsStartTopic(req, res, topicPo);
        // if (!isStart) { return false; }

        const inviteList = await lo.get(
            secondData,
            "inviteList.data.liveTopicInviteJsons"
        );

        let initData = {
            sid: lo.get(req, "rSession.sessionId"),
            power,
            isFollow: lo.get(requsetIsFollow, "isFollow.data.isFollow"),
            liveInfo: lo.get(secondData, "liveInfo.data"),
            fromWhere: "first",
            currentUserId: params.userId,
            browseNum: topicPo.browseNum,
            userId: params.userId,
            isLogin: true,
            weappLinkTo: req.weappLinkTo
        };

        store.dispatch(initTopicInfo({ ...topicPo, ...topicExtendPo }));
        store.dispatch(initPageData(initData));
        store.dispatch(
            setLshareKey(
                lo.get(secondData, "lShareKey.data.shareQualify", {}) || {}
            )
        );
        store.dispatch(
            setIsLiveAdmin(lo.get(secondData, "isLiveAdmin.data", {}) || {})
        );
    } catch (err) {
        console.error(err);
        res.render("500");
        return false;
    }

    return store;
}

/**
 * 检测是否有多个topicId
 *
 * @param {any} topicId
 * @returns
 */
function checkTopicIdIsArray(req, res, topicId) {
    if (Object.prototype.toString.call(topicId) == "[object Array]") {
        const data = {
            ...req.query,
            topicId: topicId[0]
        };
        const queryResult = stringify(data);
        res.redirect(`/topic/details-video?${queryResult}`);
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
function judgeBlack(req, res, blackType, liveId) {
    if (blackType === "channel") {
        resProcessor.reject(req, res, {
            isLive: false,
            liveId: liveId
        });
        return false;
    } else if (blackType === "live") {
        resProcessor.reject(req, res, {
            isLive: true,
            liveId: liveId
        });
        return false;
    } else if (blackType === "user") {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/live-index/live-index?liveId=${liveId}`;
            return true;
        } else {
            res.redirect("/black.html?code=inactived");
            return false;
        }
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
function judgeIdVideoLive(req, res, topicPo) {
    const data = {
        topicId: topicPo.id,
        ...req.query
    };
    const queryResult = stringify(data);
    if (/audio/.test(topicPo.style)) {
        res.redirect(`/topic/details-listening?${queryResult}`);
        return false;
        // return true;
    } else if (/^(graphic)$/.test(topicPo.style)) {
        // 小图文类型
        res.redirect(`/wechat/page/detail-little-graphic?${queryResult}`);
        return false;
    }else if(/ppt|normal/.test(topicPo.style)){
        res.redirect(`/topic/details?${queryResult}`);
        return false;
    } else if (!/video/.test(topicPo.style)) {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/intro-topic/intro-topic?topicId=${
                topicPo.id
            }`;
            return false;
        } else {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false;
        }
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
function judgeAuth(
    req,
    res,
    isAuth,
    topicId,
    power,
    topicPo,
    isSmoothHearingOrBuyOrigin,
    channelInfo
) {
    if (topicPo && topicPo.isFreePublicCourse == "Y") return true;
    const data = {
        ...req.query
    };
    const queryResult = stringify(data);
    if (power && (power.allowSpeak || power.allowMGLive)) {
        // 不是畅听 & 没有购买原课 & 是转载
        if (isSmoothHearingOrBuyOrigin && topicPo.isRelay === "Y") {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false;
        }
        return true;
    } else if (!isAuth) {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/intro-topic/intro-topic?topicId=${topicId}`;
            return true;
        } else {
            // 一元解锁课跳到系列课介绍页
            const discountStatus = lo.get(channelInfo, 'channelInfo.data.chargeConfigs[0].discountStatus', 'normal')
            if(discountStatus == 'UNLOCK') {
                res.redirect(`/wechat/page/channel-intro?channelId=${topicPo.channelId}`);
                return false
            }
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false;
        }
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
function judgeIsStartTopic(req, res, topicPo) {
    const data = {
        ...req.query
    };
    const queryResult = stringify(data);
    // 话题正在进行中
    if (
        topicPo.status === "beginning" &&
        topicPo.startTime < topicPo.currentTimeMillis
    ) {
        return true;
    } else if (topicPo.status === "delete") {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/live-index/live-index?liveId=${
                topicPo.liveId
            }`;
            return true;
        } else {
            res.redirect(`/live/${topicPo.liveId}.htm`);
            return false;
        }
    } else if (topicPo.style !== "video" && topicPo.style !== "audio") {
        if (req.isWeapp) {
            req.weappLinkTo = `/pages/intro-topic/intro-topic?topicId=${
                topicPo.id
            }&${queryResult}`;
            return true;
        } else {
            res.redirect(`/wechat/page/topic-intro?${queryResult}`);
            return false;
        }
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
function judgeIsDeleteTopic(req, res, topicPo, isAuth) {
    // 话题已被删除
    if (topicPo.status === "delete") {
        res.redirect(
            `/wechat/page/link-not-found?type=topic&liveId=${topicPo.liveId}`
        );
        return true;
    } else if (!topicPo.status) {
        res.redirect(`/wechat/page/link-not-found?type=topic`);
        return true;
    } else if (!isAuth && topicPo.displayStatus == "N") {
        // 话题隐藏
        res.redirect(`/wechat/page/topic-hide?liveId=${topicPo.liveId}`);
        return true;
    } else {
        return false;
    }
}
