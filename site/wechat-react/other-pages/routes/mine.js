export const Mine = {
    path: 'mine',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/mine'));
        });
    }
};

export const MineQuestion = {
	path: 'mine-question',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine-question'));
		});
	}
};

export const MineProfit = {
	path: 'mine-profit',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine-profit'));
		});
	}
};

export const MyPromoProfit = {
	path: 'mine-profit/promo-profit',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine-profit/promo-profit'));
		});
	}
};
export const MyPromoWithdraw = {
	path: 'mine-profit/promo-withdraw',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine-profit/promo-withdraw'));
		});
	}
}
export const RewardProfit = {
	path: 'mine-profit/reward-profit',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine-profit/reward-profit'));
		});
	}
};


export const Unevaluated = {
	path: 'mine/unevaluated',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine/unevaluated'));
		});
	}
};

export const JoinedTopic = {
	path: 'mine/joined-topic',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine/joined-topic'));
		});
	}
};



export const MineCourse = {
	path: 'mine/course',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine-course-v2'));
		});
	}
};

export const MineFootPrint = {
	path: 'mine/foot-print',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine-foot-print'));
		});
	}
};

export const MineCollect = {
	path: 'mine/collect',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/mine-collect'));
		});
	}
};

export const SimilarCourse = {
	path: 'similarity-course',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/similarity'));
		});
	}
};

export const qlchatVip = {
	path: 'qlchat-vip-cooperation',
	getComponent: function(nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/qlchat-vip').default);
		})
	}
};

export const PhoneAuth = {
	path: 'phone-auth',
	getComponent: function(nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/phone-auth'));
		})
	}
};

export const LookStudio = {
	path: 'mine/look-studio',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/look-studio'));
		});
	}
};

export const MyStudent = {
	path: 'my-student',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/my-student').default);
		});
	}
}