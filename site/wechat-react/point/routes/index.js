import App from '../../app.js';


const PointMine = {
    path: 'point/mine',
    component: require('../containers/mine'),
};

const PointGiftDetail = {
    path: 'point/gift-detail',
    component: require('../containers/gift-detail'),
}

const PointReceived = {
    path: 'point/received',
    component: require('../containers/received'),
};

const AttendRemind = {
    path: 'point/attend-remind',
    component: require('../containers/attend-remind'),
}


const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        PointMine,
        PointGiftDetail,
        PointReceived,
        AttendRemind
    ]
};


export default rootRoute;
