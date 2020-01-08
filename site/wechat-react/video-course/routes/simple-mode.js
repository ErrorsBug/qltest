export const SimpleMode = {
    path: '/wechat/page/topic-simple-video',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/simple-mode'));
        });
    }
};
