import lo from 'lodash';

var distributionApi = require('../../api/wechat/distribution');
var resProcessor = require('../../components/res-processor/res-processor');

import {
    initUserInfo,
} from '../../../site/wechat-react/other-pages/actions/channel-distribution';

import {
    initChannelInfo,
} from '../../../site/wechat-react/other-pages/actions/channel';

import { initLiveInfo } from '../../../site/wechat-react/other-pages/actions/live';

import { initTopicInfo } from '../../../site/wechat-react/other-pages/actions/topic';

import {
    initQlLiveShareQualify,
    initAdminFlag,
    initDistribution,
} from '../../../site/wechat-react/other-pages/actions/distribution';

const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');
const querystring = require('querystring');

/**
 * 系列课store处理及前置判断路由处理
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
async function getQualify(req, params, type){
    switch (type) {
        case 'channel':
            return await (params.shareQualifyChannelId ? distributionApi.sendChannelQualify(params, req) : distributionApi.sendbatchChannelQualify(params, req));  
        default:
            return await (params.shareId ? distributionApi.acceptLiveTopicShareInvite(params, req, type) : distributionApi.acceptBatchLiveTopicShareInvite(params, req));
    }
}

// 处理获取直播间和话题分销逻辑
export async function getLiveTopicShareHandle(req, res, store) {
    const { liveId, topicId, shareId } = lo.get(req, 'query', {});
    const businessType = liveId ? 'live' : 'topic';
    const businessId = liveId ? liveId: topicId;

    // 格式化参数
    const params = {
        userId: lo.get(req, 'rSession.user.userId'),
        liveId,
        topicId,
        // 判断接受分销资格是否为群发和业务类型
        ...shareId ? { shareId } : { businessId, businessType },
    };

    try {
       let initData = await getQualify(req, params, businessType);
        //冻结或删除
        let initDistributionObj = lo.get(initData, `${businessType}Qualify.data`);
        if(initDistributionObj){
            // 存储课代表分销信息
            store.dispatch(initDistribution(initDistributionObj, businessType));
            if (initDistributionObj.shareQualifyPo && initDistributionObj.shareQualifyPo.status) {
                if(initDistributionObj.shareQualifyPo.status === "Y"){
                    // 存储用户信息
                    store.dispatch(initUserInfo(lo.get(initData, 'userInfo.data', {})));
                    if (liveId) {
                        store.dispatch(initLiveInfo(lo.get(initData, 'liveInfo.data.entity', {})));
                    }
                    else {
                        store.dispatch(initTopicInfo(lo.get(initData, 'topicInfo.data.topicPo', {})));
                    }
                    
                }else if(initDistributionObj.shareQualifyPo.status === "N"){
                    // 推广资格已经被课程创建者冻结
                    res.redirect(`/wechat/page/distribution/present-exception/frozen?type=${businessType}&id=${businessId}`);
                    return false;
                }else {
                    // 推广资格已经被课程创建者删除
                    res.redirect(`/wechat/page/distribution/present-exception/deleted?type=${businessType}&id=${businessId}`);
                    return false;
                }
            } else if (initDistributionObj.haveShareQualify === 'Y') {
                // 你已领取过推广资格
                res.redirect(`/wechat/page/distribution/present-exception/got?type=${businessType}&id=${businessId}`);
                return false;
            } else if (initDistributionObj.beReceived === 'Y') {
                if(shareId){
                    // 本次链接的推广资格已经分配给用户
                    res.redirect(`/wechat/page/distribution/represent-nomore/${initDistributionObj.userId}?type=${businessType}&id=${businessId}`);
                }else{
                    // 推广资格已经被领取完
                    res.redirect(`/wechat/page/distribution/present-exception/received?type=${businessType}&id=${businessId}`);
                }
                return false;
            }else if(initDistributionObj.isDelete === "Y"){
                res.redirect(`/wechat/page/distribution/present-exception/deleted?type=${businessType}&id=${businessId}`);
                return false;
            }
        }else{
            resProcessor.errorPage(req, res, {});
            return false;
        }
    } catch(err) {
        console.error(err);
    }

    return store;
};

// 处理获取系列课分销逻辑
export async function getChannelShareHandle(req, res, store) {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        channelId: lo.get(req, 'query.channelId'),
        shareQualifyChannelId: lo.get(req, 'query.shareId'),
    };

    try {
       let initData = await getQualify(req, params, 'channel');
        //冻结或删除
        let initDistributionObj = lo.get(initData, 'channelQualify.data');
         if(initDistributionObj){
            // 存储课代表分销信息
            store.dispatch(initDistribution(initDistributionObj, 'channel'));
            if (initDistributionObj.shareQualifyChannelPo && initDistributionObj.shareQualifyChannelPo.status) {
                if(initDistributionObj.shareQualifyChannelPo.status === "Y"){
                    // 存储分销信息
                    store.dispatch(initUserInfo(lo.get(initData, 'userInfo.data', {})));
                    store.dispatch(initChannelInfo(lo.get(initData, 'channelInfo.data.channel', {})));
                }else if(initDistributionObj.shareQualifyChannelPo.status == "N"){
                    // 推广资格已经被课程创建者冻结
                    res.redirect('/wechat/page/channel-distribution-none/freeze/'+ params.channelId);
                    return false;
                }else {
                    // 推广资格已经被课程创建者删除
                    res.redirect('/wechat/page/channel-distribution-none/del/'+ params.channelId);
                    return false;
                }
            } else if (initDistributionObj.haveShareQualify === 'Y') {
                // 你已领取过推广资格
                res.redirect('/wechat/page/channel-distribution-none/geted/'+ params.channelId);
                return false;
            } else if (initDistributionObj.beReceived === 'Y') {
                if(params.shareQualifyChannelId){
                    // 本次链接的推广资格已经分配给用户
                    res.redirect('/wechat/page/channel-distribution-nomore-represent/'+ params.channelId+'/' + initDistributionObj.userId);
                }else{
                    // 推广资格已经被领取完
                    res.redirect('/wechat/page/channel-distribution-none/zero/'+ params.channelId);
                }
                return false;
            }else if(initDistributionObj.isDelete === "Y"){
                res.redirect('/wechat/page/channel-distribution-none/del/'+ params.channelId);
                return false;
            }
        }else{
            resProcessor.errorPage(req, res, {});
            return false;
        }

    } catch(err) {
        console.error(err);
    }

    return store;
};

export async function getShareHandle(req, res, store) {
    const { liveId, topicId } = lo.get(req, 'query', {});

    const resGetShareHandle = await ((liveId || topicId) ? getLiveTopicShareHandle(req, res, store) : getChannelShareHandle(req, res, store))

    if (!resGetShareHandle) {
        return false;
    }

    return store;
};

export async function representAuthHandle(req, res, store) {
    const userId = lo.get(req, 'rSession.user.userId');

    try {
        const initData = await proxy.parallelPromise([
            ['userInfo', conf.baseApi.user.info, {userId}, conf.baseApi.secret],
        ], req);

        store.dispatch(initUserInfo(lo.get(initData, 'userInfo.data', {})));

        return await getShareHandle(req, res, store);
    } catch (e) {
        console.error(e);
    }

    return store;
}

// checkDistributionPower
export async function checkDistributionPower(req, res, store) {
    const { businessId } = lo.get(req, 'params', {});
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        // 新增分销的通用页面则要取businessId
        ...businessId ? {
            [`${lo.get(req, 'query.type', 'live')}Id`]: businessId
        } : {
            channelId: lo.get(req, 'params.channelId',""),
            liveId: lo.get(req, 'params.liveId',"")
        }
    };
    try {
        let initData = await distributionApi.checkPower(params, req);
        let initDistributionObj = lo.get(initData, 'userPower.data');
        if(!(initDistributionObj&&initDistributionObj.powerEntity&&initDistributionObj.powerEntity.allowMGLive)){
            resProcessor.reject(req, res, {isLive:true});
            return false;
        }

    } catch(err) {
        console.error(err);
    }
    return store;
};

// /checkDistributionDetail
export async function checkDistributionDetail(req, res, store) {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        businessId: lo.get(req, 'params.businessId', ''),
        businessType: lo.get(req, 'query.businessType', 'channel'),
    };
    try {
        let initData = await distributionApi.checkDetailPower(params, req);
        let initDistributionObj = lo.get(initData, 'userPower.data');
        let shareIdPower=lo.get(initData, 'getQualify.data.shareQualifyInfo.shareId',"");
        if(!(initDistributionObj&&initDistributionObj.powerEntity&&initDistributionObj.powerEntity.allowMGLive)&&shareIdPower!=lo.get(req, 'query.shareId',"")){
            resProcessor.reject(req, res, {isLive:true});
            return false;
        }
    } catch(err) {
        console.error(err);
    }

    return store;
};

export async function promoRankPageHandle(req, res, store){
    try{
	    store.dispatch(initUserInfo(lo.get(req, 'rSession.user', {})));
    } catch(err) {
	    console.error(err);
    }
	return store;
}

export async function shareQualifyPo(req, res, store) {
    let params = {
        liveId: req.query.liveId,
        userId:lo.get(req, 'rSession.user.userId'),
    };
    try {
        let res = await distributionApi.shareQualifyPo(params, req)
        console.log('shareQualifyPo---->', res)
        store.dispatch(initQlLiveShareQualify(lo.get(res, 'qualify.data.platformShareQualifyPo', {})))
    } catch(err) {
        console.error(err);
    }

    return store;
};
