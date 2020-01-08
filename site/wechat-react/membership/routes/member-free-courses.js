/**
 *
 * @author Dylan
 * @date 2018/10/12
 */

export const MemberFreeCourses = {
	path: 'membership-free-courses',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/member-free-courses'));
		});
	}
};

