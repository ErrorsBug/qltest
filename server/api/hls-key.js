/**
 *
 * @author Dylan
 * @date 2019/3/1
 */
const request = require('request');
const fs = require('fs');
const lo = require('lodash');
const clientParams = require('../middleware/client-params/client-params');

const getKey = async (req, res, next) => {
	const userId = lo.get(req, 'rSession.user.userId');
	res.send('not yet')
	// request('http://122.112.213.227:8000/enc.key').pipe(res);
};

module.exports = [
	['GET', '/api/wechat/**.key', clientParams(), getKey],
];