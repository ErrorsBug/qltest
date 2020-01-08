import App from '../../app.js';

import { AudioGraphic,AudioGraphicEdit } from './audio-graphic';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        //音频图文详情页
        AudioGraphic,
        AudioGraphicEdit,
    ]
};

export default rootRoute;
