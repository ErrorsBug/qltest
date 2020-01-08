// 测评
export const CourseExam = {
    path: 'university/course-exam',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/course-exam'))
        })
    }
};
// 测评列表
export const CourseExamList = {
    path: 'university/course-exam-list',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/course-exam-list'))
        })
    }
};
// 学习建议
export const StudyAdvice = {
    path: 'university-study-advice',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/study-advice'))
        })
    }
};
