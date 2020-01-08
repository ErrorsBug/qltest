import App from '../../app.js';

const StudentExam = {
    path: 'student-exam',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/student-exam'));
        });
    }
};

const ExamAnalysis = {
    path: 'exam-analysis',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/student-exam/analysis'));
        });
    }
};

const ExamCard = {
    path: 'exam-card',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/exam-card'));
        });
    }
};

const HomeworkExam = {
    path: 'homework-exam',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/student-exam/homework'));
        });
    }
};

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        StudentExam,
        ExamCard,
        ExamAnalysis,
        HomeworkExam
    ]
};

export default rootRoute;
