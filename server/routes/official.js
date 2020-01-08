var path = require('path'),
    htmlProcessor = require('../components/html-processor/html-processor');

function isPc(req) {
    var ua = req.headers['user-agent'] || '';

    // 拿不到ua时，默认为非pc环境
    if (!ua) {
        return false;
    }
    return !/(Mobile|iPhone|Android|iPod|ios|iPad|Tablet|Windows Phone)/i.test(ua);
}

function officialIndex(req, res, next) {
    if (isPc(req)) {
        var filePath = path.resolve(__dirname, '../../public/official/page/index/index.html'),
        options = {
            filePath: filePath,
            fillVars: {

            }
        };
        // var userData = req.rSession.user;
        htmlProcessor(req, res, next, options);
    } else {
        var filePath = path.resolve(__dirname, '../../public/official/page/index/index-phone.html'),
        options = {
            filePath: filePath,
            fillVars: {

            }
        };
        // var userData = req.rSession.user;
        htmlProcessor(req, res, next, options);
    }
}

function officialStudio (req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/official/page/live-studio/index.html'),
    options = {
        filePath: filePath,
        fillVars: {

        }
    };
    // var userData = req.rSession.user;
    htmlProcessor(req, res, next, options);
}

function officialRecruit (req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/official/page/live-studio/recruit.html'),
    options = {
        filePath: filePath,
        fillVars: {

        }
    };
    // var userData = req.rSession.user;
    htmlProcessor(req, res, next, options);
}

async function officialIntroduction(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/official/page/introduction/index.html');

	// const result = await proxy.parallelPromise([
	// 	[conf.activityApi.activityInfo, {code: 'yearRank'}, conf.baseApi.secret],
	// ], req).catch(err => {
	// 	res.render('500');
	// 	console.error(err);
	// });

	// const info = lo.get(result, '0.data.activityDto', {});
	const now = Date.now();

    const options = {
        filePath,
	    fillVars: {
		    // 在默认模板中，默认使用这个字段当初始化参数
		    INIT_DATA: {
                timestamp: now
		    }
	    },
        renderData: {
            isVconsole: false
        }
    }
    if (req.query._vcdebug) {
		options.renderData.isVconsole = true;
	}
    htmlProcessor(req, res, next, options)
}

async function officialPrice(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/official/page/price/index.html');

	// const result = await proxy.parallelPromise([
	// 	[conf.activityApi.activityInfo, {code: 'yearRank'}, conf.baseApi.secret],
	// ], req).catch(err => {
	// 	res.render('500');
	// 	console.error(err);
	// });

	// const info = lo.get(result, '0.data.activityDto', {});
	const now = Date.now();

    const options = {
        filePath,
	    fillVars: {
		    // 在默认模板中，默认使用这个字段当初始化参数
		    INIT_DATA: {
                timestamp: now
		    }
	    },
        renderData: {
            isVconsole: false
        }
    }
    if (req.query._vcdebug) {
		options.renderData.isVconsole = true;
	}
    htmlProcessor(req, res, next, options)
}

async function student(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/official/page/student/index.html');

	// const result = await proxy.parallelPromise([
	// 	[conf.activityApi.activityInfo, {code: 'yearRank'}, conf.baseApi.secret],
	// ], req).catch(err => {
	// 	res.render('500');
	// 	console.error(err);
	// });

	// const info = lo.get(result, '0.data.activityDto', {});
	const now = Date.now();

    const options = {
        filePath,
	    fillVars: {
		    // 在默认模板中，默认使用这个字段当初始化参数
		    INIT_DATA: {
                timestamp: now
		    }
	    },
        renderData: {
            isVconsole: false
        }
    }
    if (req.query._vcdebug) {
		options.renderData.isVconsole = true;
	}
    htmlProcessor(req, res, next, options)
}

async function about(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/official/page/about/index.html');

	// const result = await proxy.parallelPromise([
	// 	[conf.activityApi.activityInfo, {code: 'yearRank'}, conf.baseApi.secret],
	// ], req).catch(err => {
	// 	res.render('500');
	// 	console.error(err);
	// });

	// const info = lo.get(result, '0.data.activityDto', {});
	const now = Date.now();

    const options = {
        filePath,
	    fillVars: {
		    // 在默认模板中，默认使用这个字段当初始化参数
		    INIT_DATA: {
                timestamp: now
		    }
	    },
        renderData: {
            isVconsole: false
        }
    }
    if (req.query._vcdebug) {
		options.renderData.isVconsole = true;
	}
    htmlProcessor(req, res, next, options)
}

module.exports = [
    ['GET', '/', officialIndex],
    ['GET', '/official/index', officialIndex],
    ['GET', '/official/studio', officialStudio],
    ['GET', '/official/studio/recruit', officialRecruit],
    ['GET', '/official/introduction', officialIntroduction],
    ['GET', '/official/price', officialPrice],
    ['GET', '/official/student', student],
    ['GET', '/official/about', about],
];
