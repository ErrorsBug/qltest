import App from '../../app.js';

import { Create, Publish, PPTEdit, videoList, videoShow, recommend, sort, hotRecommend } from './short-knowledge';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        videoList,
        Create,
        Publish, 
        PPTEdit,
        videoShow,
        recommend,
        sort,
        hotRecommend,
    ]
};

export default rootRoute;
