export const Shop = {
    path: 'coral/shop',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/shop'));
        });
    }
};

export const PushList = {
    path: 'coral/shop/push-list',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/shop/push-list'));
        });
    }
};

export const RankList = {
    path: 'coral/shop/rank-list',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/shop/rank-list'));
        });
    }
};

export const PushOrder = {
    path: 'coral/push-order',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/push-order'));
        });
    }
};

export const ThemeList = {
    path: 'coral/shop/theme',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/shop/theme'));
        });
    }
};

export const ThemeCard = {
    path: 'coral/shop/theme-card',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/shop/theme-card'));
        });
    }
};


export const FocusMiddle = {
    path: 'coral/focus-middle',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/shop/focus-middle'));
        });
    }
};