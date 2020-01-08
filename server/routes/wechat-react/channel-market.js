import lo from 'lodash';
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

import apis from '../../api/wechat/channel-group';

import {
    initChannelMarket,
} from '../../../site/wechat-react/other-pages/actions/channel-market'

/**
 * 营销推广设置
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} store
 * @returns
 */
export async function channelMarket(req, res, store) {
    const {
        channelId,
    } = req.query;

    const userId = lo.get(req, 'rSession.user.userId');
    let MarketInfo={};

    // 系列课营销推广设置信息
    const channelInfoData = await proxy.parallelPromise([
        ['channelInfo', conf.baseApi.channel.info, { channelId }, conf.baseApi.secret],
        ['power', conf.baseApi.user.power, { channelId, userId }, conf.baseApi.secret],
        ['marketInfo', conf.baseApi.channel.getMarket, { channelId, userId }, conf.baseApi.secret],
    ], req);
    const channelData = lo.get(channelInfoData, 'channelInfo.data.channel');
    const power = lo.get(channelInfoData, 'power.data.powerEntity', {});
    const marketInfo = lo.get(channelInfoData, 'marketInfo.data', null);

    // 页面进入逻辑判断

    // 不是管理员查看  直接跳转到系列课主页
    if (!power.allowMGLive||channelData.chargeType!="absolutely") {
        res.redirect(`/live/channel/channelPage/${channelId}.htm`);
        return false;
    }

    // 设置到store
    store.dispatch(initChannelMarket({
        ...marketInfo,
    }))

    return store;
}
