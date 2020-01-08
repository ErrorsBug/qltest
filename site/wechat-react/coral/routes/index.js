import App from '../../app.js';

import { PageNotFound,LinkNotFound } from './page-not-found';
import { Mine, BoughtCourse } from './mine';
import { Shop, PushList, RankList, PushOrder, ThemeList, ThemeCard, FocusMiddle } from './shop';
import { CoralIndex, Intro, CoralShare, CoralShareCard, CoralFocusPage } from './gift';
import { Profit, Withdraw } from './profit';
import { Performance, History, PerformanceDetails } from './performance';
import { Association, Potential, AssociationList } from './association';
import { OrderDetails, OrderConfirm } from './order';
import { Cut } from './cut';
import { Author } from './author';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    indexRoute: { component: PageNotFound },
    childRoutes: [

        //我的已购
        BoughtCourse,
        //我的分销
        Mine,
        //分销商城
        Shop,
        PushList,
        RankList,
        PushOrder,
        ThemeList,
        ThemeCard,
        FocusMiddle,

	    Profit,
	    Withdraw,
	    Performance,
	    History,
	    PerformanceDetails,
	    Association,
	    Potential,
	    AssociationList,
	    OrderDetails,
	    OrderConfirm,

        //99礼包
        CoralIndex,
        Intro,
        CoralShare,
        CoralShareCard,
        CoralFocusPage,

        //砍价
        Cut,

        //珊瑚计划授权
        Author,

        //  链接失效
        LinkNotFound,
    ]
};

export default rootRoute;
