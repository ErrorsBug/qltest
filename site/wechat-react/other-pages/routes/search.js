import searchHot from '../containers/search/hot-search'

export const searchAll = {
    path: 'all',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/search/search-all').default);
        });
    }
}

export const searchOne = {
    path: ':type',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/search/search-one').default);
        });
    }
}

export const searchIndex = {
    path: 'search',
    component: require('../containers/search').default,
    indexRoute: {
        component: searchHot,
    },
    childRoutes: [
        searchAll,
        searchOne,
    ],
};


export const searchUpdating = {
	path: 'search/updating',
	getComponent: function (nextState, callback) {
		require.ensure([], (require) => {
			callback(null, require('../containers/search/updating').default);
		});
	}
}
