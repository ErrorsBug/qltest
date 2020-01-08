import App from '../../app.js';
import { PageNotFound } from './page-not-found';
import { CourseConsult, ConsultManage } from "./course-consult";


const HelpCenter = {
    path: 'help-center',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/help-center').default);
        });
    }
};

const HelpCenterCate = {
    path: 'help-center/cate/:category',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/help-center/cate').default);
        });
    }
};

const HelpCenterFaq = {
    path: 'help-center/faq/:id',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/help-center/faq').default);
        });
    }
};

const FeedbackCreate = {
    path: "feedback",
    getComponent: function(nextState, callback) {
        require.ensure([], require => {
            callback(null, require("../containers/feedback").default);
        });
    }
};

const Feedback = {
    path: "feedback/:id",
    getComponent: function(nextState, callback) {
        require.ensure([], require => {
            callback(null, require("../containers/feedback").default);
        });
    }
};

const MyFeedback = {
    path: "my-feedback",
    getComponent: function(nextState, callback) {
        require.ensure([], require => {
            callback(null, require("../containers/my-feedback").default);
        });
    }
};



const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        CourseConsult,
        ConsultManage,

        HelpCenter,
        HelpCenterCate,
        HelpCenterFaq,
        FeedbackCreate,
        Feedback,
        MyFeedback,

        PageNotFound,
    ]
};

export default rootRoute;
