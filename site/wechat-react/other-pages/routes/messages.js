export const Messages = {
	path: 'messages',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/messages'));
		});
	}
};


export const MessagesCourseEval = {
	path: 'messages/course-eval',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/messages/course-eval'));
		});
	}
};