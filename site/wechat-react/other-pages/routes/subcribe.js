export const subcribeCustomMade = {
    path: 'subscribe-custom-made',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/subscribe-custom-made'));
        });
    }
};

export const subcribeLesson = {
    path: 'dingzhi',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/subscribe-lesson'));
        });
    }
};

export const subcribeQRcode = {
    path: 'subscribe-qrcode',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/subscribe-qrcode'));
        });
    }
};

export const subcribeCard = {
    path: 'subscribe-card',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/subscribe-card'));
        });
    }
};

export const subcribeLive = {
    path: 'subscribe-live',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/subscribe-live'));
        });
    }
};