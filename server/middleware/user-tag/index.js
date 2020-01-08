/**
 *
 * @author Dylan
 * @date 2018/8/6
 */
const lo = require('lodash');
const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

module.exports = (flag) => {

	return async (req, res, next) => {
		const userId = lo.get(req, 'rSession.user.userId', '');
		const userTag = lo.get(req, 'rSession.user.userTag', '');
		if(!userId || (!flag && userTag)){
			next();
			return;
		}
		const result = await proxy.apiProxyPromise(conf.baseApi.userTag, { userId }, conf.baseApi.secret, req);
		req.rSession.user.userTag = lo.get(result, 'data.twUserTag', '');
		next();
	}
};