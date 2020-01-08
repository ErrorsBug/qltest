/**
 * Created by dylanssg on 2017/5/5.
 */
const server = require('../../server');
const redis = server.getRedisCluster();


export async function searchHandle(req, res, store) {

	try {

		const redisRes = await new Promise(resolve => {
			redis.get(`SEARCH_HIDE_FLAG`, function(err, data){
				resolve(data);
			});
		});
		if(redisRes === 'Y'){
			res.redirect(`/wechat/page/search/updating`);
			return false;
		}


	} catch(err) {
		console.error(err);
	}

	return store;

}
