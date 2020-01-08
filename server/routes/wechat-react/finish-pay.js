import lo from 'lodash';
const finishPayApi = require('../../api/wechat/finish-pay');
import {finishPayData} from '../../../site/wechat-react/other-pages/actions/finish-pay';

export async function finishPayHandle(req, res, store) {
    var getFinishPayData;
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        liveId: lo.get(req, 'query.liveId'),
    };

    //store的值
    let type = lo.get(req, 'query.type'),
        id = lo.get(req, 'query.id'),
        shareKey = null,
        isOpenShare;

    if(!id){
        return store;
    }

    try {
        // 拼接参数
        if (type === 'channel') {
            params.channelId = id;
            getFinishPayData = finishPayApi.getChannelFinishPayData;
        } else if (type === 'topic') {
            params.topicId = id;
            getFinishPayData = finishPayApi.getTopicFinishPayData;
        } else if (type === 'vip') {
            getFinishPayData = finishPayApi.getVIPFinishPayData;
        }
        // console.error(getFinishPayData);
        let [initData, pasterData] = await Promise.all([
            getFinishPayData(params, req),
            finishPayApi.getLiveTagPaster({
	            businessId: id,
                type
            }, req)
        ]);
        // let initData = await getFinishPayData(params, params2);

        let lShareKey, tShareKey, cShareKey, paster, courseName, payAmount, pasterUrl;

        // 判断并获取shareKey
        lShareKey = lo.get(initData, 'lShareKey.data.shareQualify');
        if (!(lShareKey && lShareKey.status === 'Y')) {
            lShareKey = null;
        }

        if (type === 'channel') {
            cShareKey = lo.get(initData, 'cShareKey.data.channelQualify');
            isOpenShare = lo.get(initData, 'autoShare.data.isOpenShare');
            if (cShareKey && cShareKey.status === 'Y') {
                shareKey = cShareKey;
            } else if (lShareKey) {
                shareKey = null;
                lShareKey = lShareKey;
            }
        } else if (type === 'topic') {
            tShareKey = lo.get(initData, 'tShareKey.data.shareQualify');
            isOpenShare = lo.get(initData, 'autoShare.data.isAutoshareOpen');
            if (tShareKey && tShareKey.status === 'Y') {
                shareKey = tShareKey;
            } else if (lShareKey) {
                shareKey = null;
                lShareKey = lShareKey;
            }
        } else if (type === 'vip') {
            if (lShareKey) {
                shareKey = null;
                lShareKey = lShareKey;
            }
        }

        paster = lo.get(pasterData, 'paster.data.pasterImage', '');
        pasterUrl = lo.get(pasterData, 'paster.data.pasterUrl', '');

        store.dispatch(finishPayData({
            type,
            id,
            shareKey,
            lShareKey,
            isOpenShare,
            paster,
            pasterUrl,
        }));
    } catch(err) {
        console.log(err);
    }
    return store;
}
