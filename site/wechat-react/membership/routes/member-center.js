/**
 *
 * @author Dylan
 * @date 2018/10/12
 */

export const MemberCenter = {
	path: 'membership-center',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/member-center'));
		});
	}
};

export const MasterCourse = {
	path: 'membership-master',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/master-course'));
		});
	}
};

export const ExperienceInvitation = {
	path: 'membership/invitation',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/experience-invitation'));
		});
	}
};

export const ExperienceCard = {
	path: 'membership/invitation/card/:memberId',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/experience-invitation/experience-card'));
		});
	}
};

export const OfficialExperienceCard = {
	path: 'membership/invitation/card',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/experience-invitation/experience-card'));
		});
	}
};

export const ReceiveStatus = {
	path: 'membership/invitation/receive',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/experience-invitation/receive-status'));
		});
	}
};

export const RulesIntro = {
	path: 'membership/rules-intro',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/rules-intro').default);
		});
	}
};