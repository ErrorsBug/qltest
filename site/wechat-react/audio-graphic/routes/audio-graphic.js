export const AudioGraphic = {
    path: '/topic/details-audio-graphic',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/audio-graphic'));
        });
    }
};
export const AudioGraphicEdit = {
    path: '/wechat/page/audio-graphic-edit',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/audio-graphic-edit'));
        });
    }
};