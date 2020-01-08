//99礼包
export const CoralIndex = {
    path: 'coral/coral-index',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/coral-index'));
        });
    }
};

export const Intro = {
    path: 'coral/intro',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/intro'));
        });
    }
};

export const CoralShare = {
    path: 'coral/share',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/intro/share'));
        });
    }
};

export const CoralShareCard = {
    path: 'coral/gift-share-card',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/intro/gift-share-card'));
        });
    }
};

export const CoralFocusPage = {
    path: 'coral/focus',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/intro/focus-page'));
        });
    }
};