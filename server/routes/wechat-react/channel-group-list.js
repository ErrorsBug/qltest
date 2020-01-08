import lo from 'lodash';
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

import apis from '../../api/wechat/channel';

import {
    setUnopenedGroups,
    setOpenedGroups,
    setLiveId,
} from '../../../site/wechat-react/other-pages/actions/channel-group-list'

/**
 * 快捷拼课页
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} store
 * @returns
 */
export async function channelGroupListHandle(req, res, store) {
    let userId = lo.get(req, 'rSession.user.userId');
    let liveId = lo.get(req, 'query.liveId');
        try {
        const result = await apis.getGroupLists(liveId, userId, req);
        const openedGroups = lo.get(result, 'openedGroups.data.list');
        const unopenedGroups = lo.get(result, 'unopenedGroups.data.list');
        const userPower = lo.get(result, 'userPower.data.powerEntity');
        if ( !userPower.allowMGLive) {
            res.redirect('/wechat/page/backstage');
            return false;
        }
        store.dispatch(setOpenedGroups(openedGroups));
        store.dispatch(setUnopenedGroups(unopenedGroups));
        store.dispatch(setLiveId(liveId));

    } catch(err) {
        console.error(err);
    }
    return store;
}
