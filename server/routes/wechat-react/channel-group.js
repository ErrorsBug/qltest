import lo from 'lodash';
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

import apis from '../../api/wechat/channel-group';

import {
	initUserInfo,
    setIsLiveAdmin,
    setIsQlLive,
    setIsServiceWhiteLive,
    getOfficialLiveId,
} from '../../../site/wechat-react/other-pages/actions/common';

import {
    initChannelGroup,
    setGroupPayList,
} from '../../../site/wechat-react/other-pages/actions/channel-group';

import {
	initIsSubscribe,
	initIsFocusThree,
	initIsBindThird,
    initIsShowQl,
    initLiveRole
} from '../../../site/wechat-react/other-pages/actions/channel';

import {
	APPEND_CHANNEL_DISTRIBUTION_SETINFO,
    APPEND_CHANNEL_DISTRIBUTION_SYSINFO,
} from '../../../site/wechat-react/other-pages/actions/channel-distribution'

/**
 * 拼课详情页
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} store
 * @returns
 */
export async function channelGroup(req, res, store) {
    const {
        groupId,
        type,
    } = req.query;
    let pageType = type;

	store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {})));
    const userId = lo.get(req, 'rSession.user.userId');

    // 获取初始化数据
    const result = await apis.getGroup({ groupId }, req);
    // 拼课基本数据
    const groupInfo = lo.get(result, 'groupInfo.data.channelGroupPo', {});
    // 根据拼课信息请求系列课信息
    const channelInfoData = await proxy.parallelPromise([
        ['channelInfo', conf.baseApi.channel.info, { channelId: groupInfo.channelId }, conf.baseApi.secret],
        // 获取当前拼团的拼团信息  需要传groupId
        ['groupResult', conf.baseApi.channel.getGroupResult, { channelId: groupInfo.channelId, groupId, userId }, conf.baseApi.secret],
        // 获取当前拼团的拼团信息  不需要传groupId
        ['groupOtherResult', conf.baseApi.channel.getGroupResult, { channelId: groupInfo.channelId, userId }, conf.baseApi.secret],
	    //获取自动分销信息
	    ['channelAutoShare', conf.baseApi.share.getChannelAutoShare, { channelId: groupInfo.channelId, userId }, conf.baseApi.secret],
        //获取shareKey
	    ['channelAutoQualify', conf.baseApi.share.getMyChannelShareQualify, { channelId: groupInfo.channelId, userId }, conf.baseApi.secret],
    ], req);

	store.dispatch({
		type: APPEND_CHANNEL_DISTRIBUTION_SETINFO,
		distributionInfo: lo.get(channelInfoData, 'channelAutoShare.data', {}),
	});

	//课代表取课代表，否则再自动分销取自动分销，都没有即为空
	store.dispatch({
		type: APPEND_CHANNEL_DISTRIBUTION_SYSINFO,
		shareSysInfo: lo.get(channelInfoData, 'channelAutoQualify.data', ''),
	});

    const officialLiveId = await proxy.apiProxyPromise(conf.baseApi.getOfficialLiveId, {type:'group',userId}, conf.baseApi.secret);
    const channelData = lo.get(channelInfoData, 'channelInfo.data.channel', {});

    const powerResult = await proxy.parallelPromise([
        ['liveRole', conf.baseApi.channel.liveRole, { liveId: channelData.liveId, userId }, conf.baseApi.secret],
        ['power', conf.baseApi.user.power, { liveId: channelData.liveId, channelId: groupInfo.channelId, userId }, conf.baseApi.secret],
        ['chargeStatus', conf.baseApi.channel.chargeStatus, { channelId: groupInfo.channelId, userId }, conf.baseApi.secret],
        ['vipInfo', conf.baseApi.vip.vipInfo, { liveId: channelData.liveId, userId }, conf.baseApi.secret],
        ['blackInfo', conf.baseApi.channel.isBlack, { liveId: channelData.liveId, channelId: groupInfo.channelId, userId }, conf.baseApi.secret],
	    ['isSubscribe', conf.baseApi.channel.isSubscribe, { liveId: lo.get(officialLiveId, 'data.liveId'), userId }, conf.baseApi.secret],//'2000000648729685'
        ['isLiveAdmin', conf.adminApi.adminFlag, { liveId: channelData.liveId }, conf.adminApi.secret],
        ['isQlLive', conf.baseApi.isQlLive, { liveId: channelData.liveId }, conf.baseApi.secret],
        ['isServiceWhiteLive', conf.baseApi.live.isServiceWhiteLive, { liveId: channelData.liveId }, conf.baseApi.secret],
        ['desc', conf.baseApi.channel.getDesc, {channelId: groupInfo.channelId}, conf.baseApi.secret],
    ], req);

    const power = lo.get(powerResult, 'power.data.powerEntity', {});
    const chargeStatus = lo.get(powerResult, 'chargeStatus.data.chargePos', null);
    const vipInfo = lo.get(powerResult, 'vipInfo.data');
    let blackType = lo.get(powerResult, 'blackInfo.data.type');
    let desc = lo.get(powerResult, 'desc.data.descriptions')
    let groupPayList = lo.get(result, 'groupPayList.data.payList')
    // 系列课价格
    groupInfo.chargeConfigs = lo.get(channelInfoData, 'channelInfo.data.chargeConfigs');
    // 系列课基本信息
    groupInfo.channel = channelData;
    // 拼团结果（如果有进入团的话）
    groupInfo.groupResult = lo.get(channelInfoData, 'groupResult.data');
    groupInfo.groupOtherResult = lo.get(channelInfoData, 'groupOtherResult.data');
    // 服务端时间
    groupInfo.currentServerTime = lo.get(result, 'groupInfo.data.currentServerTime');
    // 系列课简介
    groupInfo.desc = desc
    // 判断是不是团员
    let isGroupMember = groupInfo.groupResult.isPayGroupLeader == 'N' && groupInfo.groupResult.isGroupMember == 'Y'
    // 异常跳转
    if (!groupInfo.chargeConfigs || groupInfo.chargeConfigs.length === 0) {
        res.render('500', {
            msg: '该系列课没有付费信息'
        });
        return;
    }
    if (groupInfo.channel.chargeType !== 'absolutely') {
        res.render('500', {
            msg: '该系列课不是固定收费系列课'
        });
        return;
    }
    // 拉黑处理
    if (blackType === 'channel') {
        resProcessor.reject(req, res, {
            isLive: false,
            liveId: channelData.liveId
        });
        return false;
    } else if (blackType === 'live') {
        resProcessor.reject(req, res, {
            isLive: true,
            liveId: channelData.liveId
        });
        return false;
    } else if (blackType === 'user') {
        res.redirect('/black.html?code=inactived');
        return false;
    }

    // 页面进入逻辑判断
    // VIP并且不是管理员查看  直接跳转到系列课主页
    if (vipInfo.isVip === 'Y' && !power.allowMGLive) {
        res.redirect(`/wechat/page/channel-intro?channelId=${groupInfo.channelId}`);
        return;
    }
    // 团长/有管理权限/VIP 这三个角色查看
    if (groupInfo.userId == userId || power.allowMGLive) {
        // console.log('----------groupInfo.userId:',groupInfo.userId == userId, groupInfo.currentServerTime > groupInfo.endTime, groupInfo.groupResult, 'power.allowMGLive::',power.allowMGLive)
        if (groupInfo.currentServerTime > groupInfo.endTime) {
            // 时间结束了 成功了 (模拟拼课 或者 真的成功了)
            if (groupInfo.groupResult.result === 'SUCCESS') {
                pageType = 'complete';
            // 增加拼课结算
            } else if (groupInfo.groupResult.result === 'ING'){
                pageType = 'counting'
            // 最后还是失败  或者 人数不等
            } else if (groupInfo.groupResult.result === 'FAIL' || groupInfo.groupNum > groupInfo.joinNum) {
                pageType = 'fail';
            }
        }
        // 满人了，就是拼课成功了 :)
        else if (groupInfo.groupNum == groupInfo.joinNum) {
            pageType = 'complete';
        }
        else if (type != 'sponser') {
            pageType = 'sponser';
        }
    }
    // 非团长查看
    else {
        // console.log('--------------->groupInfo:', groupId, 'groupPayList::',groupPayList, groupInfo, 'chargeStatus::',chargeStatus, groupInfo.currentServerTime > groupInfo.endTime)
	    // 不属于任何团，但是又有付费信息，那么这逼就是根据其他途径购买的这个系列课
	    // if (groupInfo.groupResult.result === 'FAIL' && chargeStatus) {
		//     res.redirect(`/wechat/page/channel-intro?channelId=${groupInfo.channelId}`);
		//     return;
	    // }

	    // 如果这逼已经开过付费团，就直接跳系列课主页
	    if(groupInfo.groupResult.result === 'OTHERS' && groupInfo.groupResult.isPayGroupLeader === 'Y'){
		    res.redirect(`/wechat/page/channel-intro?channelId=${groupInfo.channelId}`);
		    return;
        }

        // 如果拼课已结束
        if (groupInfo.currentServerTime > groupInfo.endTime || groupInfo.groupStatus === 'OVER') {
            // 新加一个5分钟结算状态  时间结束 但是 还在ing
            if (groupInfo.groupResult.result === 'ING' && isGroupMember) {
                pageType = 'counting'
            } else if (groupInfo.groupResult.result === 'SUCCESS' && isGroupMember) { // || groupInfo.groupResult.result === 'OTHERS'
                pageType = 'complete'//'endcharge';
            } else if (groupInfo.groupResult.result === 'FAIL' && isGroupMember) { // 结束后 人数不对等
                // 判断时候人数不等 并且是这个团的团员
                pageType = 'fail'
            } else {
	            pageType = 'end';
            }
        }
        // 如果已经购买过这个团了 团成功了
        else if (groupInfo.groupResult.result === 'SUCCESS') {
            // 已拼满  判断是不是团员
            if (!isGroupMember) {
                pageType = 'end'
            } else if (groupInfo.groupNum == groupInfo.joinNum) {
                pageType = 'complete' // 'endcharge';
            } else {
                pageType = 'sponser' //'success'; 团员
            }
            
        }
        // 如果已经购买过这个团了 团员
        else if (groupInfo.groupResult.result === 'ING') {
            if (!isGroupMember) {
                // 不是会员进来发现 人数满了
                if (groupInfo.groupNum == groupInfo.joinNum) {
                    pageType = 'end';
                } else {
                    pageType = 'invited' // 别的团 
                }
            } else {
                pageType = 'sponser' //'success'; 团员
            }
        }
        
        // 被邀请者进入界面时发现人数满了
        else if (groupInfo.groupNum == groupInfo.joinNum && type != 'full') {
            pageType = 'full';
        }
        // 如果连接没有任何标志 且拼团还没有结束 就当做是邀请者 标志为没参团的人
        else if (groupInfo.groupStatus === 'ING' && type != 'invited') {
            pageType = 'invited'
        }
        
    }

    // 页面显示类型
    groupInfo.pageType = pageType;

    // 设置到store
    store.dispatch(initChannelGroup({
        ...groupInfo,
    }))
    store.dispatch(setGroupPayList(lo.get(result, 'groupPayList.data.payList')));
    store.dispatch(initIsSubscribe(lo.get(powerResult, 'isSubscribe.data.subscribe', false)));
	store.dispatch(initIsFocusThree(lo.get(powerResult, 'isSubscribe.data.isFocusThree', false)));
	store.dispatch(initIsBindThird(lo.get(powerResult, 'isSubscribe.data.isBindThird', false)));
	store.dispatch(initIsShowQl(lo.get(powerResult, 'isSubscribe.data.isShowQl', false)));
	store.dispatch(initLiveRole(lo.get(powerResult, 'liveRole.data.role', false)));
	store.dispatch(setIsLiveAdmin(lo.get(powerResult, 'isLiveAdmin.data', {}) || {}));
	store.dispatch(setIsQlLive(lo.get(powerResult, 'isQlLive.data', {}) || {}));
	store.dispatch(setIsServiceWhiteLive(lo.get(powerResult, 'isServiceWhiteLive.data', {}) || {}));
	store.dispatch(getOfficialLiveId(lo.get(officialLiveId, 'data.liveId',{})));
    return store;
}
