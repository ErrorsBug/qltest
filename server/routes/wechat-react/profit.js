/*
 * @Author: shuwen.wang
 * @Date: 2017-05-16 17:39:47
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-06-16 14:12:36
 */
import lo from 'lodash'
import {
    fetchProfitOverview,
    fetchProfitChecklist,
    fetchProfitDetailChannel,
} from '../../api/wechat/profit'
import {
    updateProfitOverview,
    updateProfitRecords,
    updateProfitDetailChannel,
} from '../../../site/wechat-react/other-pages/actions/profit';
import {
    setIsLiveAdmin,
} from '../../../site/wechat-react/other-pages/actions/common'


export async function overview(req, res, store) {
    const userId = lo.get(req, 'rSession.user.userId')
    try {
        const result = await fetchProfitOverview(req.params.liveId, userId, req)
        const allowMGLive = lo.get(result, 'power.data.powerEntity.allowMGLive')

        // todo: 去掉调试用代码
        if (allowMGLive) {
            store.dispatch(updateProfitOverview(lo.get(result, 'overview.data', {})))
            store.dispatch(setIsLiveAdmin(lo.get(result, 'isLiveAdmin.data', {})))
        } else {
            res.redirect('/wechat/page/mine')
            return false
        }
    } catch (error) {
        console.error(error)
    }
    return store;
}

export async function checklist(req, res, store) {
    const userId = lo.get(req, 'rSession.user.userId')
    try {
        const type = req.query.type
        const time = req.query.time
        const result = await fetchProfitChecklist(
            req.params.liveId,
            userId,
            { page: 1, size: 20 },
            type,
            time,
            req
        )
        const allowMGLive = lo.get(result, 'power.data.powerEntity.allowMGLive')
        // todo: 去掉调试用代码
        if (allowMGLive) {
            const overview = lo.get(result, 'overview.data', {})
            const checklist = lo.get(result, 'checklist.data', {})

            store.dispatch(updateProfitOverview(overview))
            store.dispatch(updateProfitRecords(checklist))
        } else {
            res.redirect('/wechat/page/mine')
            return false
        }
    } catch (error) {
        console.error(error)
    }
    return store;
}

export async function detailChannel(req, res, store) {
    const userId = lo.get(req, 'rSession.user.userId')
    try {
        const result = await fetchProfitDetailChannel(
            req.params.channelId,
            'course',
            1,
            20,
            userId,
            req,
        )
        const allowMGLive = lo.get(result, 'power.data.powerEntity.allowMGLive')
        if (allowMGLive) {
            const list = lo.get(result, 'list.data', {})

            store.dispatch(updateProfitDetailChannel(list))
        } else {
            res.redirect('/wechat/page/mine')
            return false
        }
    } catch (error) {
        console.error(error)
    }
    return store;

}
