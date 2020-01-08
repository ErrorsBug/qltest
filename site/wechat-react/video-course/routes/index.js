import App from '../../app.js';

import { SimpleMode } from './simple-mode';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        //音频图文详情页
	    SimpleMode,
    ]
};

export default rootRoute;
