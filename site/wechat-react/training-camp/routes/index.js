import App from '../../app.js';

import { 
    PayToJoin,
    CampIndex, 
    FinishPay, 
    FailPay, 
    preparationTest,
    campAchievementCard,
    historyCourse,
    preparationTestResult,
    Preview,
} from './camp';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        //话题详情页
        PayToJoin,
        CampIndex, 
        FinishPay, 
        FailPay,
        preparationTest,
        campAchievementCard,
        historyCourse,
        preparationTestResult,
        Preview,
    ]
};

export default rootRoute;
