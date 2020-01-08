import lo from 'lodash';
import { stringify } from 'querystring';
const channelApi = require('../../api/wechat/channel');
const trainingApi = require('../../api/wechat/training');
const liveApi = require('../../api/wechat/live');
const resProcessor = require('../../components/res-processor/res-processor');
import { channelIntroHandle } from './topic-intro';
import {fillParams} from '../../components/url-utils/url-utils';
import StaticHtml from '../../components/static-html';
import { getKickOutState } from '../../api/wechat/live';

import {
    initChannelInfo,
    initIsBlack,
    initChargeStatus,
    initIsSubscribe,
    initIsFocusThree,
    initIsBindThird,
    initIsShowQl,
    initLiveRole,
    initChargeConfigs,
    initVipInfo,
    initIsLiveFocus,
    initDesc,
    initPower,
    initChannelSatus,
    initMyShareQualify,
    initCoralIdentity,
    initIsAutoShare,
    initGroupingList,
    initGroupInfo,
    initIsHasGroup,
    initMarketSet,
    initCouponSet,
    updateOrderNowStatus,
} from '../../../site/wechat-react/other-pages/actions/channel';
import {
    initUserInfo,
    setIsLiveAdmin,
} from '../../../site/wechat-react/other-pages/actions/common';

import {
    APPEND_CHANNEL_DISTRIBUTION_SETINFO,
    APPEND_CHANNEL_DISTRIBUTION_SYSINFO,
} from '../../../site/wechat-react/other-pages/actions/channel-distribution';

const staticHtml = StaticHtml.getInstance();


/**
 * 系列课B/C端统一store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */

export async function channelUniifyHandler(req, res, store) {
    try {
	    const query = lo.get(req, 'query', {}) || {};
	    const tracePage = lo.get(query, 'tracePage');
	    const channelId = lo.get(req, 'query.channelId');
	    const userId = lo.get(req, 'rSession.user.userId', '');
	    const params = {
		    channelId,
		    userId
	    };

	    // if (query.s && query.t && query.sign) {
		//     params.s = query.s;
		//     params.t = query.t;
		//     params.sign = query.sign;
	    // }

	    const powerRes = await liveApi.getUserPower(params, req);
	    const power = lo.get(powerRes, 'data.powerEntity', {}) || {};

	    if(power.allowMGLive || power.allowSpeak){
		    // 老师嘉宾管理员，调用旧的handler
		    const [kickOutRes, blackInfoRes] = await Promise.all([
			    liveApi.getKickOutState({
				    businessId: params.channelId,
				    userId: params.userId,
				    type: 'channel'
			    }, req),
			    channelApi.getBlackInfo(params, req),
		    ]);

		    const isKickedOut = lo.get(kickOutRes, 'data.status', false);
		    const isBlack = lo.get(blackInfoRes, 'data.type', null);

		    if(isKickedOut){
			    res.redirect(`/wechat/page/link-not-found?type=channelOut&channelId=${params.channelId}`);
			    return false;
		    }

		    if(isBlack){
			    res.redirect('/black.html?code=inactived');
			    return false;
		    }

		    store.dispatch(initPower(power));
		    return channelHandle(req, res, store);
	    }else{

            /**
             * 训练营类型且已购，特殊处理
             */
            if (userId && req.query.channelType === 'camp') {
                const periodChannel = lo.get(await trainingApi.getPeriodByChannel(params), 'periodChannel.data');

                // 是否已加入训练营
                if (periodChannel && periodChannel.isJoinCamp === 'Y') {
                    const campUserInfo = lo.get(await channelApi.getCampUserInfo(params), 'data.campUserPo');

                    // 是否已答应公约
                    if (campUserInfo && campUserInfo.contractTime) {
                        res.redirect(fillParams(req.query, `/wechat/page/training-learn`, ['channelIds'])) 
                    } else {
                        res.redirect(fillParams(req.query, `/wechat/page/training-student-info`, ['']));
                    }
                    return;
                }
            }


            const html = await staticHtml.getHtmlCacheAsync({ keyPrefix: 'CCI', id: channelId, req });

		    if(html){
			    res.status(200).send(html);
			    return;
		    }else{
			    return channelIntroHandle(req, res, store);
		    }

        }
    } catch(err) {
	    console.error(err);
	    res.render('500');
	    return false;
    }
}

/**
 * 系列课B端store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function channelHandle(req, res, store) {
    let orderNow = lo.get(req, 'query.orderNow')
    if (orderNow) {
        req.flash('channelOrderNow', orderNow)
        res.redirect(fillParams({}, req.originalUrl, ['orderNow']))
        return false
    } else {
        if (req.flash('channelOrderNow')) {
            store.dispatch(updateOrderNowStatus(true))
        }
    }

    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        channelId: lo.get(req, 'query.channelId'),
        businessId: lo.get(req, 'query.channelId'),
        type: 'channel',
        isCoral: (!!lo.get(req, 'query.officialKey')||lo.get(req, 'query.source')==='coral'),
    };

    //  // 绑定优惠券
    //  let { couponCode, codeId } = req.query;
    //  if (codeId) {
    //      channelApi.bindCoupon({codeId}, req)
    //  }  else if (couponCode) {
    //      channelApi.bindCouponByCode({businessId: params.channelId, couponCode}, req)
    //  }


    let isKickOutParams = {
        userId: lo.get(req, 'rSession.user.userId',null),
        businessId: lo.get(req, 'query.channelId'),
        type: 'channel',
    }

    if (req.query.discode) {
        params.code = req.query.discode;
    }

    try {
        let initData = await channelApi.getChannelInitData(params, req);

		    let liveId = lo.get(initData, 'channelInfo.data.channel.liveId');
		    let channelTopicTotal = lo.get(initData, 'channelTopicTotal.data.channelTopicTotal');

		    params.liveId = liveId;

        //拼课单个团的信息，注入请求参数
        if (req.query.groupId) {
            params.groupId = req.query.groupId;
        }


        // let secondData = await channelApi.getChannelSecondData(params);
        let [secondData] = await Promise.all([channelApi.getChannelSecondData(params, req)]);
        // 被拉黑或被踢出，去到提示页
        let blackType = lo.get(secondData, 'blackInfo.data.type');

        if (blackType === 'channel') {
            resProcessor.reject(req, res, {
                isLive: false,
                liveId: params.liveId
            });
            return false;
        } else if (blackType === 'live') {
            resProcessor.reject(req, res, {
                isLive: true,
                liveId: params.liveId
            });
            return false;
        } else if (blackType === 'user') {
            res.redirect('/black.html?code=inactived');
            return false;
        }

        let channelInfo = lo.get(initData, 'channelInfo.data.channel', {});
		    channelInfo.topicNum = channelTopicTotal

        // 处理是否已被删除系列课或直播间
        const isDelete = judgeIsDeleteChannel(req, res, channelInfo);
        if (isDelete) {
            return false;
        }

        let chargeConfigs = lo.get(initData, 'channelInfo.data.chargeConfigs', []);
        let displayStatus = lo.get(initData, 'channelInfo.data.channel.displayStatus', 'Y');
        // let channelStatus = lo.get(secondData, 'channelSatus.data', {}) || {};
        let chargeStatus = lo.get(secondData, 'chargeStatus.data.chargePos', null);
        // let marketSeting=lo.get(initData, 'checkIsSetMarket.data', {}) || {};
        // let couponSeting=lo.get(initData, 'isCouponSet.data', {}) || {};
        // let vipInfo = lo.get(secondData, 'vipInfo.data', {}) || {};
        let power = lo.get(store.getState(), 'channel.power', {}) || {};
        let liveRole = lo.get(secondData, 'liveRole.data.role', false);


        // 隐藏状态且非购买、非管理权限的用户禁止访问
        // vip用户也不能访问（产品定的规则）
        if (!(chargeStatus || power.allowMGLive) && displayStatus === 'N') {
            res.render('channel-hide', {
                liveId: params.liveId
            });
            return false;
        }

        // 如果是转载系列课且该系列课已经被下架
        // 且如果当前用户未购买且不是该直播间的创建者或管理员
        // 那么跳转到提示页
        if (!liveRole && !chargeStatus && channelInfo.isRelay === 'Y' && channelInfo.upOrDown === 'down') {
            res.redirect(`/wechat/page/topic-hide?liveId=${channelInfo.liveId}`);
            return false;
        }

        // 未支付并且有优惠码，判断需不需要自动购买
        // if (
        //     !liveRole &&
        //     !chargeStatus &&
        //     chargeConfigs.length > 0 &&
        //     channelInfo.chargeType === 'absolutely' &&
        //     channelStatus.isHaveCoupon
        // ) {
        //     if ((chargeConfigs[0].discountStatus == 'Y' && chargeConfigs[0].discount - channelStatus.qlCouponMoney <= 0)
        //         ||
        //         (chargeConfigs[0].discountStatus == 'N' && chargeConfigs[0].amount - channelStatus.qlCouponMoney <= 0)
        //         ||
        //         (chargeConfigs[0].discountStatus == 'P' && chargeConfigs[0].amount - channelStatus.qlCouponMoney <= 0)) {

        //         let buyFreeResult = await channelApi.freeBuy({
        //             sourceNo: req.query.sourceNo || "qldefault",
        //             chargeConfigId: chargeConfigs[0].id,
        //             couponId: channelStatus.codeId,
        //             couponType: channelStatus.codeType,
        //             userId: lo.get(req, 'rSession.user.userId'),
        //         }, req);

        //         console.log('免费购买成功 ----', buyFreeResult);
        //         if (buyFreeResult.freeBuy.state.code == 0) {
        //             return channelHandle(req, res, store);
        //         }
        //     }
        // }

        store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {}) || {}));
        store.dispatch(initChannelInfo(channelInfo));
        store.dispatch(initChargeConfigs(chargeConfigs));
        store.dispatch(initChargeStatus(chargeStatus));
        store.dispatch(initDesc(lo.get(initData, 'desc.data.descriptions', {})));
        // store.dispatch(initChannelSatus(channelStatus));
        store.dispatch(initIsHasGroup(lo.get(initData, 'checkIsHasGroup.data', '')));

        store.dispatch(initIsBlack(lo.get(secondData, 'blackInfo.data.type', '')));
        store.dispatch(initIsSubscribe(lo.get(secondData, 'isSubscribe.data.subscribe', false)));
        store.dispatch(initIsFocusThree(lo.get(secondData, 'isSubscribe.data.isFocusThree', false)));
        store.dispatch(initIsBindThird(lo.get(secondData, 'isSubscribe.data.isBindThird', false)));
        store.dispatch(initIsShowQl(lo.get(secondData, 'isSubscribe.data.isShowQl', false)));
        store.dispatch(initLiveRole(lo.get(secondData, 'liveRole.data.role', false)));
        store.dispatch(initVipInfo(lo.get(secondData, 'vipInfo.data', {}) || {}));
        store.dispatch(initIsLiveFocus(lo.get(secondData, 'isLiveFocus.data.isFollow', false)));
        store.dispatch(initMyShareQualify(lo.get(secondData, 'myShareQualify.data.shareQualifyInfo', false)));
        store.dispatch(initCoralIdentity(lo.get(secondData, 'coralIdentity.data', '')));
        store.dispatch(initIsAutoShare(lo.get(secondData, 'autoShare.data.isOpenShare', '')));
        //课代表取课代表，否则再自动分销取自动分销，都没有即为空
        store.dispatch({
            type: APPEND_CHANNEL_DISTRIBUTION_SYSINFO,
            shareSysInfo: lo.get(initData, 'channelAutoQualify.data', ''),
        });
        store.dispatch(initGroupingList(lo.get(secondData, 'groupingList.data', {})));

        store.dispatch(initGroupInfo(lo.get(secondData, 'groupInfo.data', '')));

        store.dispatch(initMarketSet(lo.get(initData, 'checkIsSetMarket.data', {}) || {}));
        store.dispatch(initCouponSet(lo.get(secondData, 'isCouponSet.data', {}) || {}));
        store.dispatch(setIsLiveAdmin(lo.get(secondData, 'isLiveAdmin.data', {}) || {}));

        store.dispatch({
            type: APPEND_CHANNEL_DISTRIBUTION_SETINFO,
            distributionInfo: lo.get(initData, 'channelAutoShare', {}),
        });



    } catch(err) {
        console.error(err);
    }

    return store;
};



/**
 * 处理是否已经删除系列课或直播间
 *
 * @param {any} req
 * @param {any} res
 */
function judgeIsDeleteChannel(req, res, channelInfo) {

    // 如果系列课首页被删除了，就回到直播间主页
    if (typeof channelInfo.liveId == 'undefined') {
        res.redirect(`/wechat/page/link-not-found?type=channel`);
        return true;

    } else if (channelInfo && typeof channelInfo.status != 'undefined' && channelInfo.status != 'Y') {
        if (channelInfo.liveId) {
            res.redirect('/wechat/page/live/' + channelInfo.liveId);
        } else {
            res.redirect('/wechat/page/mine');
        }
        return true;
    } else {
        return false;
    }

}
