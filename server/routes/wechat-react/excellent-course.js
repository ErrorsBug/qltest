import lo from 'lodash';
import resProcessor from '../../components/res-processor/res-processor'
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');
const wxAuth = require('../../middleware/auth/1.0.0/wx-auth');
const appAuth = require('../../middleware/auth/1.0.0/app-auth');
const clientParams = require('../../middleware/client-params/client-params');
const requestProcess = require('../../middleware/request-process/request-process');
// actions
import {
    initCourse,
} from '../../../site/wechat-react/other-pages/actions/excellent-course';


export async function excellentCourse(req, res, store) {
    const state = store.getState().excellentCourse;
    var params = {
        userId: lo.get(req, 'rSession.user.userId'),
        liveId: req.query.liveId,
        page: {
            page: state.pageNum,
            size: state.pageSize,
        }
    };
    try {
        const result = await proxy.parallelPromise([
            ['init',conf.baseApi.excellentCourse.auditCourse, params, conf.baseApi.secret],
        ], req);
        // if(result.init.data.isShare === 'Y'){
        //     res.redirect('/wechat/page/live-studio/media-promotion/' + req.query.liveId);
        //     return false;
        // }
        store.dispatch(initCourse( result.init.data));  

    } catch(err) {
        console.error(err);
    }
    return store;
};
