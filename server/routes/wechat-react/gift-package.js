import lo from 'lodash';
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

import {
    initGiftPackageInfo,
} from '../../../site/wechat-react/other-pages/actions/exclusive-gift-package'

export async function initGiftPackage(req, res, store) {
    let params = {
        userId: lo.get(req, 'rSession.user.userId')
    };
    const flag = await proxy.parallelPromise([
        [conf.baseApi.recommend.giftFlag, params, conf.baseApi.secret],
    ], req);
    let flagData = flag[0];
    if(flagData.state.code === 0){
        if(flagData.data.isUserNew === 'Y' && flagData.data.isGet === 'Y'){
            const state = store.getState();
            try {
                const result = await proxy.parallelPromise([
                    ['info',conf.baseApi.recommend.userGift, params, conf.baseApi.secret],
                ], req);
                const resultInfo = lo.get(result, 'info.data', {});
                store.dispatch(initGiftPackageInfo(resultInfo));
        
            } catch(err) {
                console.error(err);
            }
            return store;
        }else {
            res.redirect('/wechat/page/recommend');
        }
    }
};

export async function getRedEnvelopePower (req, res, store) {
    let params = {
        userId: lo.get(req, 'rSession.user.userId'),
        topicId: req.query.topicId,
    };
    if(!req.query.topicId){
        res.render('404')
        return false
    }
    const result = await proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
    ], req);
    let power = result.power.data.powerEntity
    if(!power.allowSpeak && !power.allowMGLive){
        res.redirect(`/topic/details?topicId=${req.query.topicId}`);
        return false
    }else {
        return store;
    }
}
