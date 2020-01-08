export const Mine = {
    path: 'coral/mine',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/mine'));
        });
    }
};

export const BoughtCourse = {
    path: 'coral/bought-course',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/bought-course'));
        });
    }
}