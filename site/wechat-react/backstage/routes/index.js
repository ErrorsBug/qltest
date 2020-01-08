import App from '../../app.js';

import { PageNotFound, LinkNotFound } from './page-not-found';
import { LiveBack, LiveChange, AuthDistribute } from './live-back';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    indexRoute: { component: PageNotFound },
    childRoutes: [
        LiveBack,
        LiveChange,
        AuthDistribute,

        //  链接失效
        LinkNotFound,
    ]
};

export default rootRoute;
