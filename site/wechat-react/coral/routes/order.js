/**
 * Created by dylanssg on 2017/10/25.
 */
export const OrderDetails = {
	path: 'coral/order/details',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/order/details'));
		});
	}
};

export const OrderConfirm = {
	path: 'coralOrderConfirm',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/order/confirm'));
		});
	}
};