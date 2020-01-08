import App from '../../app.js';

const BendManage = {
    path: 'comment/bend-manage',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/bend'));
        });
    }
};

const BendCourseList = {
    path: 'comment/bend-course-list',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/bend/course-list'));
        });
    }
};

const BendCourseDetails = {
    path: 'comment/bend-course-details',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/bend/course-details'));
        });
    }
};

const BendCommentDetails = {
    path: 'comment/cend-comment-details',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/cend/comment-details'));
        });
    }
};


const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        BendManage,
        BendCourseList,
        BendCourseDetails,
        BendCommentDetails,
    ]
};


export default rootRoute;
