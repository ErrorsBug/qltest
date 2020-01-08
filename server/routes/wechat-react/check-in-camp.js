import lo from 'lodash';
import { stringify } from 'querystring';

var checkInCampApi = require('../../api/wechat/checkin-camp');
var resProcessor = require('../../components/res-processor/res-processor');
var wxUtils = require('../../components/wx-utils/wx-utils');




import {
    updateLittleGraphicContentList,
    updateLittleGraphicBaseInfo,
} from '../../../site/wechat-react/check-in-camp/model/little-graphic/actions';
import {
    fetchAuthInfoSuccess,
} from '../../../site/wechat-react/check-in-camp/model/camp-auth-info/actions';

import { fetchLshareKey } from '../../../site/wechat-react/check-in-camp/model/camp-basic-info/actions';

/**
 * 训练营页面的权限判断
 * @param {boolean} authCheck 是否验证B端操作权限
 */
export function checkInCampHandle(authCheck = false) {
    return async function(req, res, store){
        try {
            let params = {
                userId: lo.get(req, 'rSession.user.userId', null),
                liveId: lo.get(req, 'params.liveId', ''),
                campId: lo.get(req, 'params.campId', '') || lo.get(req, 'query.campId', ''),
                time: '1120752000000',
            };



            let checkInCampData = await checkInCampApi.getCheckInCampInfo(params, req);
            let campPo = lo.get(checkInCampData, 'campDetail.data.liveCamp', {});
            let campPayStatus = lo.get(checkInCampData, 'campPayStatus.data.payStatus', 'N');
            let baseInfo = {...lo.get(checkInCampData, 'getInfo.data.baseInfo', {})};
            let power = lo.get(checkInCampData, 'power.data.powerEntity', {});
            let liveId = lo.get(checkInCampData, 'getInfo.data.baseInfo.liveId', null);
            let channelId = lo.get(checkInCampData, 'getInfo.data.baseInfo.channelId', null);
            let campId = lo.get(checkInCampData, 'getInfo.data.baseInfo.campId', null);
            let kickoutStatus = lo.get(checkInCampData, 'kickoutInfo.data.kickOutStatus', '');

            //获取直播间的lshareKey
            let lshareKey
            if (params.liveId || campPo && campPo.liveId) {
                
                let campSecondData = await checkInCampApi.getCampSecondData({
                    liveId: params.liveId || campPo && campPo.liveId,
                    userId: lo.get(req, 'rSession.user.userId', null),
                },req);
                lshareKey = lo.get(campSecondData, 'lShareKey.data.shareQualify', {});
            }



            /*----- 通用权限验证 ------*/
            // 被直播间拉黑
            const isBlack = judgeBlack(req, res, lo.get(checkInCampData, 'blackInfo.data.type', null), liveId);
            if (isBlack) {
                // res.forbidden(req, res, '您已被拉黑')
                return false;
            }
            // 被训练营踢出
            const isKickout = kickoutStatus === 'Y';
            if (isKickout) {
                res.redirect(`/wechat/page/link-not-found?type=campOut&liveId=${params.liveId || campPo.liveId || baseInfo.liveId}`);
                return false;
            }
            // 训练营是否被删除或隐藏
            if (params.campId) {
                const isCampDeleted = judgeIsDeleteCamp(req, res, campPo, power, campPayStatus);
                if (isCampDeleted) {
                    return false;
                }
            }

            /*----- B端操作权限验证 -----*/
            if (authCheck) {
                const isAuthed = judgeAuth(req, res, power, params.campId);
                if (!isAuthed) {
                    return false;
                }
            }

            if (lshareKey && lshareKey.length) {
                store.dispatch(fetchLshareKey({lshareKey:lshareKey||{}}));
            }

        } catch(err) {
            console.error(err);
            res.render('500');
            return false;
        }
        return store;
    }
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
        return true;
    } else if (blackType === 'live') {
        resProcessor.reject(req, res, {
            isLive: true,
            liveId: liveId
        });
        return true;
    } else if (blackType === 'user') {
        res.redirect('/black.html?code=inactived');
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
function judgeAuth (req, res, power, campId) {
    if (power && (power.allowSpeak || power.allowMGLive)) {
        // 有管理权限或者发言权限可以直接接入
        return true;
    } else {
        resProcessor.forbidden(req, res, '无权限');
        return false;
    }
}




/**
 * 处理是否已经删除或隐藏训练营
 * @param {object} req
 * @param {object} res
 * @param {object} campPo
 * @param {object} power
 */
function judgeIsDeleteCamp (req, res, campPo, power, campPayStatus) {
    // 训练营已被删除
    if (campPo.status === 'N') {
        res.redirect(`/wechat/page/link-not-found?type=camp`);
        return true;
    } else if (!power.allowMGLive && campPayStatus === 'N' && campPo.displayStatus == 'N') {
        // 训练营已经被隐藏
        try {
            res.redirect(`/wechat/page/topic-hide?liveId=${campPo.liveId}`);
        } catch (error) {
            console.error('训练营隐藏报错！！');
        }
        return true;
    } else if (!campPo.status) {
        res.redirect(`/wechat/page/link-not-found?type=camp`);
        return true;
    } else {
        return false;
    }
}
