export const DocList = {
    path: '/wechat/page/doc-list/:topicId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/doc-list'));
        });
    }
};