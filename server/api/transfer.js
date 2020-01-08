const wxAuth = require('../middleware/auth/1.0.0/wx-auth');
const clientParams = require('../middleware/client-params/client-params');
const appAuth = require('../middleware/auth/1.0.0/app-auth');
import { requestTransfer, groupRequestTransfer} from '../middleware/request-transfer'

const allowFreeList = [
    // 无需登录验证的接口
    '/h5/channel/getDiscountExtend',
    '/h5/dataStat/getCourseIndexStatus',
    '/short/knowledge/geKnowledgeByBusinessId',
    '/h5/knowledge/bannerList',
    '/h5/knowledge/moduleList',
    '/h5/selfmedia/activityCourseList',
    '/h5/selfmedia/courseList',
    '/h5/selfmedia/courseTagList',
    '/h5/channel/getChannelTags',
    '/h5/knowledge/hotCourseList',
    '/h5/knowledge/moduleCourseList',
];

module.exports = [
    ['ALL', '/api/wechat/transfer/:apiHost/*', clientParams(), appAuth(), wxAuth({
        allowFree: req => allowFreeList.some(path => {
            return req._parsedUrl.pathname.includes(path);
        })
    }), requestTransfer],
    ['ALL', '/api/wechat/group-transfer', groupRequestTransfer],
    // 本地调试登录用，上线前干掉
    ['ALL', '/local/login', wxAuth()]
];
