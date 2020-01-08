export const ExcellentCourse = {
    path: 'excellent-course',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/excellent-course'));
        });
    }
};