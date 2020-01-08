import lo from 'lodash';
import {
    stringify
} from 'querystring';
import {
    getKickOutState
} from '../../api/wechat/live';

var mineApi = require('../../api/wechat/mine');


/**
 * 销售人员分享专业版购买页面的中间跳转判断。
 * @param  {[type]} req   [description]
 * @param  {[type]} store [description]
 * @return {[type]}       [description]
 */
export async function liveStudioSalesHandle(req, res) {
    try {

        let params = {
            userId: lo.get(req, 'rSession.user.userId', null),
        };
        // let salerId = lo.get(req, 'query.salerId', '');

        let myLiveData = await mineApi.getMyLive(params);
        let liveId = lo.get(myLiveData, 'myLive.data.entityPo.id', null);

        if (liveId) {
            // res.redirect(`/topic/live-studio-intro?liveId=${liveId}&salerId=${salerId}`);
            res.redirect(`/wechat/page/live/${liveId}`)
        } else {
            res.redirect(`/wechat/page/backstage?ch=live`);

        }
    } catch (err) {
        console.error(err);
        res.render('500');
        return false;
    }

    return false;
};