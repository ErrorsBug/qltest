
export const Timeline = {
    path: 'timeline',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/timeline'));
        });
    }
};
export const ChooseTimelineType = {
    path: 'timeline/choose-type',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/timeline/choose-timeline-type').default);
        });
    }
};
export const CreateTimeline = {
    path: 'timeline/create',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/timeline/create-timeline').default);
        });
    }
};
export const MineFocus = {
    path: 'timeline/mine-focus',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/timeline/mine-focus').default);
        });
    }
};
export const NewLike = {
    path: 'timeline/new-like',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/timeline/new-like').default);
        });
    }
};
