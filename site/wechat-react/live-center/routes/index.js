import App from '../../app.js';

export const FreeColumn = {
	path: 'live-center/free-column',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/free-column').default);
		});
	}
};

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
		FreeColumn
    ]
};

export default rootRoute;
