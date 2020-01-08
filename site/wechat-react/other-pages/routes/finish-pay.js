export const finishPay = {
    path: 'finish-pay',
    getComponent: function(nextState, callback){
        require.ensure([], (require) => {
            callback(null, require('../containers/finish-pay'));
        });
    }
};

export const finishPayPasterPreview = {
	path: 'finish-pay-paster-preview',
	getComponent: function(nextState, callback){
		require.ensure([], (require) => {
			callback(null, require('../containers/finish-pay/preview'));
		});
	}
};

