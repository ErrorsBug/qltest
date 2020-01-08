export const NightAnswer = {
    path: 'night-answer',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/night-answer'));
        });
    }
};
export const NightAnswerShow = {
    path: 'night-answer-show',
    getComponent: function(nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/night-answer-show'));
        });
    }
};