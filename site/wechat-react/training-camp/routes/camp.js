export const PayToJoin = {
    path: 'camp-join',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/pay-to-join').default);
        });
    }
};
export const CampIndex = {
    path: 'camp/:campId',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/camp').default);
        });
    }
};
export const FinishPay = {
    path: 'camp-finish-pay',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/pay-finish').default);
        });
    }
};
export const FailPay = {
    path: 'camp-fail-pay',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/pay-fail').default);
        });
    }
};

export const preparationTest = {
    path: 'preparation-test',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/preparation-test').default);
        });
    }
};


export const campAchievementCard = {
    path: 'camp-achievement-card',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/camp-achievement-card').default);
        });
    }
};

export const historyCourse = {
    path: 'camp-history',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/history-course').default);
        });
    }
};

export const preparationTestResult = {
    path: 'camp-preparation-test-result',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/preparation-test-result').default);
        });
    }
};

export const Preview = {
    path: 'camp-preview',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/preview').default);
        });
    }
};
