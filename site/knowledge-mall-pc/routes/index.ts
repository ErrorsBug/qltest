import App from '../containers/app';

import PageNotFound from './page-not-found';
import { mallIndex, mallManage, userPortrait } from './mall'

const rootRoute = {
    path: '/pc/knowledge-mall',
    component: App,
    indexRoute: { component: PageNotFound },
    childRoutes: [
        /* 商城首页 */
        mallIndex,
        /* 转载管理 */ 
        mallManage,
        // 用户画像
        userPortrait,
        /* 404 */
        PageNotFound,
    ],
}

export default rootRoute
