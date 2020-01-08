export const homeworkManage = {
    path: 'homework/manage',
    getComponent: (nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/homework/manage'));
        });
    }
};


export const homeworkCreate = {
    path: 'homework/create',
    getComponent: (nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/homework/create'));
        });
    }
};

export const homeworkSetContent = {
    path: 'homework/set-homework-content',
    getComponent: (nextState, callback) => {
        require.ensure([], (require) => {
            callback(null, require('../containers/homework/create/components/set-homework-content'));
        });
    }
};

export const HandIn = {
	path: 'homework/hand-in',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/homework/hand-in'));
		});
	}

};

export const RelateCourse = {
	path: 'homework/relate-course',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/homework/create/components/relate-course'));
		});
	}
};

export const Details = {
	path: 'homework/details',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/homework/details'));
		});
	}
};

export const MyHomework = {
	path: 'homework/mine',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/homework/mine'));
		});
	}
};

export const Card = {
	path: 'homework/card',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/homework/card'));
		});
	}
};

export const Error = {
	path: 'homework/error',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/homework/error'));
		});
	}
};

