export const ChoiceCourse = {
	path: 'choice-course',
	getComponent: function (nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/choice-course'));
		});
	}
}