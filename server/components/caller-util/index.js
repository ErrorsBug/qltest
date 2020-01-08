var envi = require('../envi/envi')

module.exports = function (userId, req) {
	var suffix = ''
	if((envi.isIOS(req) || envi.isAndroid(req)) && envi.isWeixin(req)) {
		suffix = 'h5-wx'
	}
	else if(envi.isPc(req) && envi.isWeixin(req)) {
		suffix = 'pc-wx'
	}
	// else if(envi.isQlApp(req)) {
	// 	suffix = 'app'
	// }
	else {
		suffix = 'pc'
	}
	return 'QL_U_SID_' + userId + '_' + suffix
}