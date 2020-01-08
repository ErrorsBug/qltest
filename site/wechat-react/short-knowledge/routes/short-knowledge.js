export const Create = {
    path: 'short-knowledge/create',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/create').default);
        });
    }
};

export const Publish = {
    path: 'short-knowledge/publish',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/publish').default);
        });
    }
};

export const PPTEdit = {
    path: 'short-knowledge/ppt-edit',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/ppt-edit').default);
        });
    }
};

export const videoList = {
    path: 'short-knowledge/video-list',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/video-list').default);
        });
    }
};

export const videoShow = {
    path: 'short-knowledge/video-show',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/video-show').default);
        });
    }
};


export const recommend = {
    path: 'short-knowledge/recommend',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/recommend').default);
        });
    }
};

export const sort = {
    path: 'short-knowledge/sort',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/sort').default);
        });
    }
};

export const hotRecommend = {
    path: 'short-knowledge/hot-recommend',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/hot-recommend').default);
        });
    }
};