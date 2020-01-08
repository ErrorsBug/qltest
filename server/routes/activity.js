
var path = require('path'),
    _ = require('underscore'),
    async = require('async'),
    lo = require('lodash'),
    uuid = require('uuid'),

    weiboAuth = require('../middleware/auth/1.0.0/weibo-auth'),
    clientParams = require('../middleware/client-params/client-params'),
    appAuth = require('../middleware/auth/1.0.0/app-auth'),
    wxAppAuth = require('../middleware/auth/1.0.0/wx-app-auth'),

    proxy = require('../components/proxy/proxy'),
    resProcessor = require('../components/res-processor/res-processor'),
    htmlProcessor = require('../components/html-processor/html-processor'),
    conf = require('../conf'),

    server = require('../server'),

    mockData = require('./activity.mock.json').woman,

    IMAGE_VIEW_REDIS_KEY = 'H5_ACTIVITY_IMAGE_VIEW_KEY';

var wxAuth = require('../middleware/auth/1.0.0/wx-auth');
var querystring = require('querystring');

var activityApi = require('../api/activity');

var ninthFestivalJson = require('./ninth-festival.json');

var redis = server.getRedisCluster();

function pageWoman(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/womman/womman.html'),
        options = {
            filePath: filePath,
            fillVars: {

            }
        };
    var userData = req.rSession.user;
    options.fillVars.TABTYPE = mockData.tabType;
    options.fillVars.TOPIC = mockData.topic;
    options.fillVars.CHANNEL = mockData.channel;
    htmlProcessor(req, res, next, options);
}

function imageView(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/image-view/image-view.html'),
        options = {
            filePath: filePath,
            renderData: {
                title: '清华大咖重塑孩子专注力'
            }
        };

    var redisCluster = server.getRedisCluster();

    if (req.query.url) {
        var decodedUrl = '';
        try {
            decodedUrl = decodeURIComponent(req.query.url);
        } catch (error) {
            decodedUrl = req.query.url;
        }

        redisCluster.set(IMAGE_VIEW_REDIS_KEY, decodedUrl, function (err, re) {
            if (err) {
                // throw Error(err);
                console.error('redis set image-view url error:', err);
                resProcessor.error500(req, res);
                return;
            }

            options.renderData.imageUrl = decodedUrl;

            htmlProcessor(req, res, next, options);
        });
    } else {
        redisCluster.get(IMAGE_VIEW_REDIS_KEY, function (err, re) {
            if (err) {
                // throw Error(err);
                console.error('redis get image-view url error:', err);
                resProcessor.error500(req, res);
                return;
            }

            if (!re) {
                resProcessor.error500(req, res, null, '还没有设置过图片地址，请添加url参数设置图片地址！');
                return;
            }

            options.renderData.imageUrl = re;

            htmlProcessor(req, res, next, options);
        });
    }
};

function image(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/image-view/image-view.html'),
        options = {
            filePath: filePath,
            renderData: {

            }
        };

    var params = {
        imgId: req.query.imgId,
    };

    if (!params.imgId) {
        res.render('404');
        return;
    }

    proxy.apiProxy(conf.baseApi.imageGet, params, function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        options.renderData.imageUrl = lo.get(body, 'data.imageUrl');
        options.renderData.title = lo.get(body, 'data.title');

        htmlProcessor(req, res, next, options);

    }, conf.baseApi.secret, req);
};

function activityStorage(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/storage-channel/index.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
            renderData: {

            },
        };

    proxy.apiProxy(conf.baseApi.activity.storage.count + '?channelId=230000493021827',
        { channelId: '230000493021827' },
        function (err, body) {
            if (err) {
                resProcessor.error500(req, res, err);
                return;
            }
            options.renderData.count = lo.get(body, 'data.count')
            htmlProcessor(req, res, next, options);
        },
        conf.baseApi.secret, req);
}

/**
 * 开学季页面路由方法
 *
 */
function endlessEight(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/activity/page/endless-eight/courses/index.html')
    htmlProcessor(req, res, next, { filePath })
}

/**
 * 开学季评论页面路由方法
 *
 */
function endlessEightComment(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/activity/page/endless-eight/comments/index.html')
    htmlProcessor(req, res, next, { filePath })
}

/**
 * 抽奖活动页
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function lottery(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/lottery/index.html'),
        options = {
            filePath: filePath,
            renderData: {

            }
        };

    if (req.query.from || req.query.isappinstalled) {
        var query = {...req.query};
        delete query.from;
        delete query.isappinstalled;

        var url = '/wechat/page/activity/lottery';
        var searchUrl = querystring.stringify(query || {});

        if (searchUrl) {
            url += '?' + searchUrl;
        }

        res.redirect(url);
        return;
    }

    proxy.apiProxy(conf.baseApi.activity.storage.count + '?channelId=240000552022354',
        { channelId: '240000552022354' },
        function (err, body) {
            if (err) {
                resProcessor.error500(req, res, err);
                return;
            }
            options.renderData.count = lo.get(body, 'data.count', 0) || 0;
            htmlProcessor(req, res, next, options);
        },
        conf.baseApi.secret, req);

}

/**
 * 抽奖页
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function lotteryDraw(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/lottery/draw.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
            renderData: {

            },
        };

    req.rSession.lottery_draw_key = new Date().getTime();
    req.rSession.expires = 5 * 60;


    // htmlProcessor(req, res, next, options);

    proxy.apiProxy(conf.baseApi.activity.getCodes,
        {},
        function (err, body) {
            if (err) {
                resProcessor.error500(req, res, err);
                return;
            }

            let codes = lo.get(body, 'data.codes', []) || [];
            _.each(codes, function(item) {
                if (item.money === 500) {
                    options.renderData.id5 =  item.id;
                } else if (item.money === 1000) {
                    options.renderData.id10 =  item.id;
                } else if (item.money === 2000) {
                    options.renderData.id20 =  item.id;
                } else if (item.money === 9990) {
                    options.renderData.id99 =  item.id;
                }
            });

            htmlProcessor(req, res, next, options);
        },
        conf.baseApi.secret, req);
}

function lotteryCode(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/lottery/code-list.html'),
        options = {
            filePath: filePath,
        };

    htmlProcessor(req, res, next, options);
}



function lotteryAddress(req, res, next) {

    var endTime = new Date('2017/9/15/2:00').getTime()
    var timeNow = new Date().getTime()

    if(timeNow < endTime) {
        var filePath = path.resolve(__dirname, '../../public/activity/page/lottery/address.html'),
            options = {
                filePath: filePath,
            };
        htmlProcessor(req, res, next, options);
    } else {
        res.render('404');
    }

}


/**
 * 教师节活动-达标活动页
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
async function teacherStandard(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/teachers-day/standard.html');

    const userId = lo.get(req, 'rSession.user.userId');
    const liveId = req.query.liveId

    var params = {
        userId,
        liveId
    }

    if (!liveId) {
        res.redirect("https://m.qlchat.com/wechat/page/recommend");
        return;
    }

    const result = await proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['activeInfo', conf.baseApi.active.getActiveInfo, params, conf.baseApi.secret],
        // ['getFinishLiveList', conf.baseApi.active.getFinishLiveList, params, conf.baseApi.secret],
        // ['getRankList', conf.baseApi.active.getRankList, params, conf.baseApi.secret],
    ], req);


    const allowMGLive = lo.get(result, 'power.data.powerEntity.allowMGLive', false)
    if(!allowMGLive) {
        res.redirect("/wechat/page/live/" + liveId)
        return;
    }

    let reachStandard = false
    let activeValue = lo.get(result, 'activeInfo.data.score', 110)
    let activeValueLeft = 0

    if(activeValue > 100) {
        reachStandard = true
    } else {
        activeValueLeft = 100 - activeValue
    }

    var options = {
        filePath: filePath,
        renderData: {
            reachStandard: reachStandard,
            activeValue: activeValue,
            activeValueLeft: activeValueLeft,
        },
        fillVars: {
            ACTIVE_VALUE: activeValue
        }
    };
    htmlProcessor(req, res, next, options);

}

/**
 * 教师节活动-冲榜活动页
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
async function teacherRank(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/teachers-day/rank.html');
    var sysTime = new Date().getTime();
    const userId = lo.get(req, 'rSession.user.userId');
    const liveId = req.query.liveId

    var params = {
        userId,
        liveId
    }

    if (!liveId) {
        res.redirect("https://m.qlchat.com/wechat/page/recommend");
        return;
    }


    const result = await proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['activeInfo', conf.baseApi.active.getActiveInfo, params, conf.baseApi.secret],
        ['rankList', conf.baseApi.active.getRankList, params, conf.baseApi.secret],
    ], req);

    const power = lo.get(result, 'power.data.powerEntity', {} ) || {}
    const activeInfo = lo.get(result, 'activeInfo.data')


    const rank = lo.get(result, 'rankList.data.myRank.rank', -1)
    const leftActiveValue = lo.get(result, 'activeInfo.data.lastRankScore') - lo.get(result, 'activeInfo.data.score')
    const rankList = lo.get(result, 'rankList.data')
    const tagName = lo.get(result, 'rankList.data.tagName')





    if(!power.allowMGLive) {
        res.redirect("/wechat/page/live/" + liveId)
        return;
    }

    var options = {
        filePath: filePath,
        renderData: {
            reachTop: rank <= 10 || leftActiveValue < 0 ? true : false,
            rank: rank,
            leftActiveValue: parseInt(leftActiveValue),
            tag: tagName || "",
        },
        fillVars: {
            SYSTIME: sysTime,
            RANK_ENTITY: rankList
        }
    };

    htmlProcessor(req, res, next, options);
}


async function teacherReport(req, res, next) {

    var sysTime = new Date().getTime();
    const userId = lo.get(req, 'rSession.user.userId');
    const liveId = req.query.liveId

    var params = {
        userId,
        liveId: liveId,
    }

    const myLive = await proxy.parallelPromise([
        ['myLive', conf.baseApi.live.my, params, conf.baseApi.secret],
        ['userInfo', conf.baseApi.user.info, params, conf.baseApi.secret],
    ]);

    const myLiveEntity = lo.get(myLive, 'myLive.data.entityPo', {}) || {}

    params.liveId = liveId || myLiveEntity.id || 0

    const result = await proxy.parallelPromise([
        ['power', conf.baseApi.user.power, params, conf.baseApi.secret],
        ['getLiveAchieveData', conf.baseApi.active.getLiveAchieveData, params, conf.baseApi.secret],
    ], req);

    const userInfo = lo.get(myLive, 'userInfo.data')

    // const myLiveEntity = lo.get(myLive, 'myLive.data.entityPo', {}) || {}

    const serverData = lo.get(result, 'getLiveAchieveData.data', {}) || {}
    const power = lo.get(result, 'power.data.powerEntity', {} ) || {}

    var isMineLive = false
    if(power.allowMGLive) {
        isMineLive = true
    }



    var filePath = path.resolve(__dirname, '../../public/activity/page/teachers-day/report.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                SERVER_DATA: lo.get(result, 'getLiveAchieveData.data'),
                MY_LIVE_ENTITY: myLiveEntity,
                MY_USER_INFO: userInfo
            },
            renderData: {
                audioSeconds: serverData.audioSeconds,
                hotCourseId: serverData.hotCourseId,
                hotCourseName: serverData.hotCourseName,
                liveCreateTime: serverData.liveCreateTime,
                liveName: serverData.liveName,
                logoUrl: serverData.logoUrl,
                rewardNo: serverData.rewardNo,
                rewardTopicId: serverData.rewardTopicId,
                rewardTopicName: serverData.rewardTopicName,
                studentNo: serverData.studentNo,
                teacherNo: serverData.teacherNo,
                isMineLive: isMineLive,
            },
        };

    htmlProcessor(req, res, next, options);

}
function activityCard(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/activityCard/activityCard.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
            shareData:{}
        };
    var userId = lo.get(req, 'rSession.user.userId');
    var num = lo.get(req, 'query.num');
    var list = [
         {
            template:"TEACHER",
            shareCard:'https://img.qlchat.com/qlLive/activity/teacher-card-bg_1.png',
            minShareCard:'https://img.qlchat.com/qlLive/activity/teacher-card-bg_1.png'
        },
        {
            template:"AUTUNM",
            shareCard:'https://img.qlchat.com/qlLive/activity/autumn-day-bgpic.jpg',
            minShareCard:'https://img.qlchat.com/qlLive/activity/autumn-day-bgpic.jpg'
        },
        {
            template:"CHRISTMAS",
            shareCard:'https://img.qlchat.com/qlLive/liveCommon/Christmas-day.jpg',
            minShareCard:'https://img.qlchat.com/qlLive/liveCommon/Christmas-day.jpg'
        }
    ];
    const tasks = [];

   proxy.apiProxy(conf.baseApi.live.my,
    {userId},
    function (err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        let thisLiveId=lo.get(body, 'data.entityPo.id', "") || "";
        options.fillVars.LIVE = lo.get(body, 'data.entityPo', {}) || {};
        options.fillVars.TYPE = 'live';
        options.fillVars.SHARECARD_BG  = list[num];
        if(thisLiveId!=""){
            tasks.push(['shareCardData', conf.baseApi.live.shareCardData, { liveId: thisLiveId, userId }, conf.baseApi.secret]);
            proxy.parallelPromise(tasks, req)
            .then(result => {
                let shareData = lo.get(result, 'shareCardData.data', {});
                shareData = JSON.stringify(shareData);
                shareData = shareData.replace(/\\/g, '\\\\');
                shareData = shareData.replace(/\'/g, '\\\'');

                options.fillVars.SHARE_DATA = shareData;
                // options.renderData.shareData = shareData;

                htmlProcessor(req, res, next, options);
            })
            .catch(err => {
                console.error(err);
                res.render('500', {
                    msg: JSON.stringify(err)
                });
            })
        }else{
            res.redirect('/wechat/page/live-auth');
                return false;
        }

    },
    conf.baseApi.secret);
}


/**
 * 第三方分销渠道模板页面路由方法
 *
 */
function thirdPartyDistributionTemp(req, res, next) {
	const filePath = path.resolve(__dirname, '../../public/activity/page/thirdPartyDistributionTemp/index.html');
	const id = lo.get(req,'query.id','');
	// test id: 110000015000003

	if(!id){
		res.render('500');
		return;
    }

	let options = {
		filePath,
		renderData: {}
    };

	redis.get(`LIVE_EXTERNAL_SPREAD_${id}`, async function(err, data){
		if(err || data == null){
			const result = await proxy.parallelPromise([
				['spreadData', conf.baseApi.activity.getExternalSpreadData, { id }, conf.baseApi.secret]
			]);
			data = lo.get(result, 'spreadData.data.json', {});
		}

		if(data == '0' || data == null){
			res.status(404).render('404');
			return;
        }

        try {
            data = JSON.parse(data);
        } catch(error) {
            data = {};
            console.error('parse LIVE_EXTERNAL_SPREAD error:', error);
        }

        if (!data) {
            data = {};
        }
        options.renderData = {...data};

		htmlProcessor(req, res, next, options)

	});

}


// 精选拼课活动
function groupActivity(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/activity/page/group-activity/index.html');

    const sysTime = new Date().getTime();

    // 11月1日结束活动
    if(sysTime > 1509465600000) {
        res.render('404');
        return
    }

    if (req.query.from || req.query.isappinstalled) {
        var query = {...req.query};
        delete query.from;
        delete query.isappinstalled;

        var url = '/wechat/page/activity/group';
        var searchUrl = querystring.stringify(query || {});

        if (searchUrl) {
            url += '?' + searchUrl;
        }

        res.redirect(url);
        return;
    }

	let options = {
		filePath,
        renderData: {},
        fillVars: {
            SYS_TIME: sysTime
        }
    };

    htmlProcessor(req, res, next, options);
}

function groupActivityComment(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/activity/page/group-activity/comments/index.html')
    htmlProcessor(req, res, next, { filePath })

}

//超级妈妈活动
function superMother(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/super-mother/new-main.html'),
        options = {
            filePath: filePath,
        };

    req.rSession.super_mother_key = new Date().getTime();
    req.rSession.expires = 5 * 60;

    if (req.query.from || req.query.isappinstalled) {
        var query = {...req.query};
        delete query.from;
        delete query.isappinstalled;

        var url = '/wechat/page/activity/super-mother';
        var searchUrl = querystring.stringify(query || {});

        if (searchUrl) {
            url += '?' + searchUrl;
        }

        res.redirect(url);
        return;
    }

    htmlProcessor(req, res, next, options);
}
// 超级妈妈优惠券
function superMotherCoupon(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/super-mother/code-list.html'),
        options = {
            filePath: filePath,
        };

    htmlProcessor(req, res, next, options);
}
// 超级妈妈微博页面
function superMotherWeibo(req, res, next) {

    req.rSession.super_mother_key = new Date().getTime();
    req.rSession.expires = 5 * 60;

    if (req.query.from || req.query.isappinstalled) {
        var query = {...req.query};
        delete query.from;
        delete query.isappinstalled;

        var url = '/wechat/page/activity/super-mother/weibo';
        var searchUrl = querystring.stringify(query || {});

        if (searchUrl) {
            url += '?' + searchUrl;
        }

        res.redirect(url);
        return;
    }

    var filePath = path.resolve(__dirname, '../../public/activity/page/super-mother/weibo.html'),
        options = {
            filePath: filePath,
        };

    htmlProcessor(req, res, next, options);
}
// 超级妈妈活动卡
async function superMotherCardMenu(req, res, next) {
    // 从朋友圈点进去的链接无法继续分享的兼容代码
    if (req.query.from || req.query.isappinstalled) {
        var query = { ...req.query };
        delete query.from;
        delete query.isappinstalled;

        var url = '/wechat/page/activity/super-mother/card-menu';
        var searchUrl = querystring.stringify(query || {});

        if (searchUrl) {
            url += '?' + searchUrl;
        }

        res.redirect(url);
        return;
    }

    const userId = lo.get(req, 'rSession.user.userId');
    const result = await proxy.parallelPromise([
        ['statues', conf.baseApi.activity.yeyiqian.topicStatus, {
            userId,
            channelId: "2000000091042251" //线上
            // channelId: "2000000181026604" //灰度
            // channelId: "2000000017700418" //test 2
            // channelId: "2000000024800312" //test 1
        }, conf.baseApi.secret],
    ]);
    const topicList = lo.get(result, 'statues.data.dataList', []) || []
    const topicListData = lo.get(result, 'statues.data.isBuy', 0) || 0
    var sysTime = new Date().getTime();

    var filePath = path.resolve(__dirname, '../../public/activity/page/super-mother/card-menu.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                TOPIC_LIST: topicList,
                IS_BUY: topicListData,
            },
            renderData: {
                renderData: "fromServer: renderData"
            },
        };

    htmlProcessor(req, res, next, options);
}
// 超级妈妈活动卡详情
async function superMotherCardList(req, res, next) {
    // 从朋友圈点进去的链接无法继续分享的兼容代码
    if (req.query.from || req.query.isappinstalled) {
        var query = { ...req.query };
        delete query.from;
        delete query.isappinstalled;
        var url = '/wechat/page/activity/super-mother/card-list';
        var searchUrl = querystring.stringify(query || {});
        if (searchUrl) {
            url += '?' + searchUrl;
        }
        res.redirect(url);
        return;
    }

    const userId = lo.get(req, 'rSession.user.userId');
    const result = await proxy.parallelPromise([
        ['statues', conf.baseApi.activity.yeyiqian.topicStatus, {
            userId,
            channelId: "2000000091042251" //线上
            // channelId: "2000000181026604" //灰度
            // channelId: "2000000017700418" //test 2
            // channelId: "2000000024800312" //test 1
        }, conf.baseApi.secret],

    ]);

    const topicList = lo.get(result, 'statues.data', []) || []
    var sysTime = new Date().getTime();

    var filePath = path.resolve(__dirname, '../../public/activity/page/super-mother/card-list.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                TOPIC_LIST: topicList,
            },
            renderData: {},
        };

    htmlProcessor(req, res, next, options);
}
// 超级妈妈活动任务详情
async function superMotherTask(req, res, next) {
    // 从朋友圈点进去的链接无法继续分享的兼容代码
    if (req.query.from || req.query.isappinstalled) {
        var query = { ...req.query };
        delete query.from;
        delete query.isappinstalled;
        var url = '/wechat/page/activity/super-mother/task';
        var searchUrl = querystring.stringify(query || {});
        if (searchUrl) {
            url += '?' + searchUrl;
        }
        res.redirect(url);
        return;
    }

    const userId = lo.get(req, 'rSession.user.userId');
    const fromUserId = req.query.formUserId || lo.get(req, 'rSession.user.userId')
    const topicId = req.query.topicId

    const result = await proxy.parallelPromise([
        ['listGet', conf.baseApi.activity.yeyiqian.listGet, {
            userId,
            topicId: topicId,
            page: {
                page: 1,
                size: 10
            }
        }, conf.baseApi.secret],
        ['userGet', conf.baseApi.activity.yeyiqian.userGet, {
            userId: fromUserId,
            topicId: topicId,
        }, conf.baseApi.secret],
        ['taskInfo', conf.baseApi.activity.yeyiqian.taskInfo, {
            userId: fromUserId,
            topicId: topicId,
        }, conf.baseApi.secret],

        ['isBuy', conf.baseApi.activity.yeyiqian.isBuy, {
            userId: userId,
            channelId: "2000000091042251" //线上
            // channelId: "2000000181026604" //灰度
            // channelId: "2000000017700418" //test 2
            // channelId: "2000000024800312" //test 1
        }, conf.baseApi.secret],


    ], req);

    const listGet = lo.get(result, 'listGet.data.dataList', []) || []
    const userGet = lo.get(result, 'userGet.data', []) || []
    const taskInfo = lo.get(result, 'taskInfo.data', {}) || []
    const isBuy = lo.get(result, 'isBuy.data.status', "N") || []

    var sysTime = new Date().getTime();

    var filePath = path.resolve(__dirname, '../../public/activity/page/super-mother/task.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                COMMENT_LIST: listGet,
                USER_COMMENT: userGet,
                TASK_INFO: taskInfo,
                USER_ID: userId,
                IS_BUY: isBuy,
            },
            renderData: {
                renderData: "fromServer: renderData"
            },
        };

    htmlProcessor(req, res, next, options);
}
//双十一活动页
async function doubleEleven(req, res, next){

    // 从朋友圈点进去的链接无法继续分享的兼容代码
    if (req.query.from || req.query.isappinstalled) {
        var query = { ...req.query };
        delete query.from;
        delete query.isappinstalled;
        var url = '/wechat/page/activity/double-eleven';
        var searchUrl = querystring.stringify(query || {});
        if (searchUrl) { url += '?' + searchUrl;}
        res.redirect(url);
        return;
    }

    let filePath = path.resolve(__dirname, '../../public/activity/page/doubleEleven/double-eleven.html'),
        options = {
            filePath: filePath,
            fillVars:{},
            renderData: {},
        },
        activityCode = 'SSS20171111',
        userId = lo.get(req, 'rSession.user.userId');
    const result = await proxy.parallelPromise([
        [conf.baseApi.activity.doubleEleven.getConfig, {activityCode,type:'group'}, conf.baseApi.secret],
        [conf.baseApi.activity.doubleEleven.getConfig, {activityCode,type:'menu'}, conf.baseApi.secret],
        [conf.baseApi.activity.doubleEleven.getGiftPermission, {activityCode,userId}, conf.baseApi.secret],
        // [conf.baseApi.activity.doubleEleven.getConfig, {activityCode,code: 'CX01'}, conf.baseApi.secret],
        [conf.baseApi.activity.doubleEleven.getCourse, {activityCode,groupCode:'CX01'}, conf.baseApi.secret],
        [conf.baseApi.activity.doubleEleven.getCourse, {activityCode,groupCode:'TC02'}, conf.baseApi.secret],
        [conf.baseApi.activity.doubleEleven.getCourse, {activityCode,groupCode:'TC01'}, conf.baseApi.secret],
    ], req);
    let group = lo.get(result, '0.data.dataList') || [],
        menu = lo.get(result, '1.data.dataList'),
        permission = lo.get(result, '2.data.giftPermission'),
        // promotion = lo.get(result,'3.data'),
        panicBuy = lo.get(result,'3.data.dataList'),
        gift = lo.get(result,'4.data.dataList'),
        giftCourseList = lo.get(result,'5.data.dataList'),
        codeList = [];
    group.forEach(function(item,index){
        codeList[index] = item.code;
    });
    options.fillVars = {
        codeList: codeList,
    };

    options.renderData = {
        group: group,
        permission:permission,
        menu: menu,
        codeList: codeList,
        // promotion: promotion,
        panicBuy: panicBuy,
        gift: gift,
        giftCourseList: giftCourseList,
    };
    htmlProcessor(req, res, next, options);
}
// 双十一领书页面
function doubleElevenAddress(req, res, next) {
        var timeNow = new Date().getTime()
        if(timeNow < 1512057540000) {
            var filePath = path.resolve(__dirname, '../../public/activity/page/doubleEleven/address.html'),
                options = {
                    filePath: filePath,
                };
            htmlProcessor(req, res, next, options);
        } else {
            res.render('404');
        }

    }
//活动优惠券
function activityCoupon(req, res, next) {
    let filePath = path.resolve(__dirname, '../../public/activity/page/activityCoupon/activitycoupon.html');
    let userId = lo.get(req, 'rSession.user.userId');
    let activityCode = 'HDONE';
    let options = {
        filePath: filePath,
        renderData: {},
        fillVars: {}
    };
    proxy.parallelPromise([
        [conf.baseApi.activity.coupon.getCouponList, {userId,activityCode}, conf.baseApi.secret],
        [conf.baseApi.activity.coupon.getCourse, {activityCode}, conf.baseApi.secret],
    ], req).then(result => {
        let couponList = lo.get(result, '0.data.dataList'),
            courseList = lo.get(result, '1.data.map'),
            list = [],
            i = 0;
        for(var key in courseList){
            list[i++] = {
                key: key,
                value: courseList[key]
            }
        }
        options.renderData.couponList = couponList;
        options.renderData.courseList = list;
        options.fillVars.COURSE = list;
        htmlProcessor(req, res, next, options);
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
}
//冬季养生活动页面
async function winterHealth(req, res, next) {
    // 从朋友圈点进去的链接无法继续分享的兼容代码
    if (req.query.from || req.query.isappinstalled) {
        var query = { ...req.query };
        delete query.from;
        delete query.isappinstalled;
        var url = '/wechat/page/activity/winter-health';
        var searchUrl = querystring.stringify(query || {});
        if (searchUrl) { url += '?' + searchUrl;}
        res.redirect(url);
        return;
    }

    let filePath = path.resolve(__dirname, '../../public/activity/page/winter-health/index/index.html'),
        options = {
            filePath: filePath,
            fillVars: {},
            renderData: {},
        },
        userId = lo.get(req, 'rSession.user.userId'),
        activityCode = 'health20171115';

    const result = await proxy.parallelPromise([
        [conf.activityApi.winterHealth.getTestResultAndCourse, {userId,activityCode,groupCode: 'ZQ01,ZQ02'}, conf.baseApi.secret]
    ], req);
    let isTest = lo.get(result, '0.data.isTest'),
        recuperateCourse = lo.get(result, '0.data.ZQ01'),
        healthCourse = lo.get(result, '0.data.ZQ02');
    options.renderData = {
        isTest: isTest,
        recuperateCourse: recuperateCourse,
        healthCourse: healthCourse
    };
    options.fillVars.isTest = isTest;
    htmlProcessor(req, res, next, options);
}
// 冬季养生测试题封面
function winterHealthTestCover(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/winter-health/cover/cover.html'),
        options = {
            filePath: filePath,
        };
    htmlProcessor(req, res, next, options);
}
// 冬季养生测试题页面
function winterHealthTest(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/winter-health/test/test.html'),
        options = {
            filePath: filePath,
        };
    htmlProcessor(req, res, next, options);
}
// 冬季养生测试题结果页面
async function winterHealthTestResult(req, res, next) {
    let filePath = path.resolve(__dirname, '../../public/activity/page/winter-health/result/result.html'),
        options = {
            filePath: filePath,
            fillVars: {},
            renderData: {}
        },
        score = Number(req.query.score),
        recommend = req.query.remark,
        userId = lo.get(req, 'rSession.user.userId'),
        activityCode = 'health20171115',
        isTest = req.query.isTest,
        fromUser = req.query.fromUser;
    if(!isTest){
        const result = await proxy.parallelPromise([
            [conf.activityApi.winterHealth.saveTestScore, {userId,activityCode,score,recommend}, conf.baseApi.secret],
        ], req);
        let testResult = lo.get(result, '0.data');
        options.fillVars.score = testResult.score;
        options.fillVars.recommend = testResult.recommend;
    }else{
        options.fillVars.score = score;
        options.fillVars.recommend = recommend;
    }
    htmlProcessor(req, res, next, options);
}
//冬季养生评论页面
async function winterHealthComment(req, res, next) {
    var filePath = path.resolve(__dirname, '../../public/activity/page/winter-health/comment/comment.html'),
        options = {
            filePath: filePath,
            fillVars: {},
            renderData: {}
        };
    let userId = lo.get(req, 'rSession.user.userId');
    const result = await proxy.parallelPromise([
        [conf.baseApi.user.info, {userId}, conf.baseApi.secret],
    ]);
    options.fillVars.userMessage = lo.get(result, '0.data.user');
    htmlProcessor(req, res, next, options);
}

//排行榜
const pageExploreRankTopic = function (req, res, next) {
    let filePath = path.resolve(__dirname, '../../public/activity/page/rank/rank.html');
    let options = {
        filePath: filePath,
        fillVars: {},
        renderData: {
            list: [],
        },
    };

    let params = {
        page: {
            page: 1,
            size: 20,
        },
        tagId: 0,
        userId: lo.get(req, 'rSession.user.userId'),
        sid: lo.get(req, 'rSession.sessionId'),
    };

    proxy.parallelPromise([
        [conf.baseApi.rank.getTopicRank, params, conf.baseApi.secret],
    ], req).then(result => {
        let topics = lo.get(result, '0.data.topics');
        // 没有图则使用默认图
        if (typeof topics == 'array') {
            topics.forEach((value, index) => {
                if (!value['backgroundUrl']) {
                    value['backgroundUrl'] = 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
                }
                if (!value['money']) {
                    value['money'] = 0;
                }
            });
        }

        options.fillVars.INITDATA = topics;
        options.renderData.topics = topics;
        options.fillVars.NOWTIME = new Date().getTime();

        htmlProcessor(req, res, next, options);
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};
/**
 * 微信群活动路由方法
 *
 */
async function wechatGroup(req, res, next){
	const filePath = path.resolve(__dirname, '../../public/activity/page/wechatGroup/index.html');
	const id = lo.get(req,'query.id','');

	if(!id){
		res.render('500');
		return;
	}
    let tempId = (Math.random() * 1000000000).toFixed(0);
	const options = {
		filePath,
		renderData: {
            id,
            tempId
        }
	};

	const result = await proxy.parallelPromise([
		['communityData', conf.baseApi.activity.getCommunity, { cId: id }, conf.baseApi.secret]
	], req);
	const communityData = lo.get(result, 'communityData.data', {});

	options.renderData = {...options.renderData, ...communityData};

	htmlProcessor(req, res, next, options)
}

async function wechatGroupQr(req, res, next){
	const filePath = path.resolve(__dirname, '../../public/activity-react/wechat-group-qr.html');
	const id = lo.get(req,'query.id','');

	if(!id){
		res.render('500');
		return;
	}

	const options = {
		filePath,
		fillVars: {
			INIT_DATA: {},
		},
		renderData: {},
	};

	htmlProcessor(req, res, next, options)
}

async function ninthFestival(req, res, next) {

    if (req.query.from || req.query.isappinstalled) {
        var query = {...req.query};
        delete query.from;
        delete query.isappinstalled;

        var url = '/wechat/page/activity/ninth-festival';
        var searchUrl = querystring.stringify(query || {});

        if (searchUrl) {
            url += '?' + searchUrl;
        }

        res.redirect(url);
        return;
    }

    const filePath = path.resolve(__dirname, '../../public/activity/page/ninth-festival/index.html');
	const options = {
		filePath,
		renderData: ninthFestivalJson
	};

	htmlProcessor(req, res, next, options)
}

function increaseFansRedirect (req, res, next) {
    const random1 = uuid.v4();
    const random2 = uuid.v4();
    let queryStr = querystring.stringify(req.query || {});
    
    res.redirect(`/wechat/page/activity/${random1}/gift-course?${queryStr}&${random2}`);
}

async function increaseFans(req, res, next){
	const filePath = path.resolve(__dirname, '../../public/activity/page/increase-fans/index.hd-domin.html');
	const id = lo.get(req,'query.id','');

	if(!id){
		res.render('500');
		return;
    }

    // const url = 'https://img.qlchat.com/qlLive/channelLogo/TBL1C7V5-QODR-ZGA8-1505997543328-UDKNCGU94OVI.jpg@750w_1e_1c_2o';


	const result = await proxy.parallelPromise([
        ['gainCourse', conf.baseApi.activity.gainCourse, { id: id }, conf.baseApi.secret]
    ], req);

    const renderData = lo.get(result, 'gainCourse.data');
    const state = lo.get(result, 'gainCourse.state');
    // const communityData = lo.get(result, 'communityData.data', {});
    if (state.code !== 0) {
        res.status(500).send('接口请求错误');
        return;
    }

    const options = {
        filePath,
        fillVars: {
            INITDATA: renderData,
        },
        renderData,
    };

	// options.renderData = {...options.renderData, ...communityData};

	htmlProcessor(req, res, next, options)
}


// 领书页面
async function address(req, res, next) {

    const userId = lo.get(req, 'rSession.user.userId');
    const activityCode = req.query.activityCode;

    const params = {
        userId,
        activityCode,
    }
    const result = await proxy.parallelPromise([
        ['addressWriteNum', conf.activityApi.address.addressWriteNum, params, conf.activityApi.secret],
        ['myAddress', conf.activityApi.address.getAddressInfo, params, conf.activityApi.secret],
        ['configs', conf.activityApi.configs, {...params, type: "sendBook"}, conf.activityApi.secret],
    ], req);

    const addressWriteNum = lo.get(result, 'addressWriteNum.data.num', 1001) || 1001
    const isHaveWrite = lo.get(result, 'myAddress.data.isHaveWrite', 'N') || 'N'
    const myAddress = lo.get(result, 'myAddress.data.addressPo', {name: "", phone: "", address: ""}) || {name: "", phone: "", address: ""}
    const defaultFontObject = {
        topFont: "",
        bottomFont: "",
        blankFont: "",
        maxGiveNum: 0,
    }
    const configList = lo.get(result, 'configs.data.dataList', []) || []
    let fontObject = {}
    configList.forEach((item) => {
        switch (item.code) {
            case "topFont":
                fontObject.topFont = item.remark || ""
                break;
            case "bottomFont":
                fontObject.bottomFont = item.remark || ""
                break;
            case "blankFont":
                fontObject.blankFont = item.remark || ""
                break;
            case "maxGiveNum":
                fontObject.maxGiveNum = item.remark || "0"
                break;
            default:
                break;
        }
    })


    if(addressWriteNum >= parseInt(fontObject.maxGiveNum) && isHaveWrite === 'N') {
        var filePath = path.resolve(__dirname, '../../public/activity/page/address/full.html'),
        options = {
            filePath: filePath,
            fillVars: {},
            renderData: { blankFont: fontObject.blankFont},
        };
    } else {
        var filePath = path.resolve(__dirname, '../../public/activity/page/address/address.html'),
        options = {
            filePath: filePath,
            fillVars: {
                ...myAddress,
                bottomFont: fontObject.bottomFont,
            },
            renderData: {
                topFont: fontObject.topFont,
                // bottomFont: fontObject.bottomFont.replace("\n", "</br>"),
            },
        };
    }
    htmlProcessor(req, res, next, options);
}

async function tuiwenCommon(req, res, next) {
    // 从朋友圈点进去的链接无法继续分享的兼容代码
    if (req.query.from || req.query.isappinstalled) {
        var query = { ...req.query };
        delete query.from;
        delete query.isappinstalled;
        var url = '/wechat/page/activity/tuiwen';
        var searchUrl = querystring.stringify(query || {});
        if (searchUrl) { url += '?' + searchUrl;}
        res.redirect(url);
        return;
    }

    const userId = lo.get(req, 'rSession.user.userId');
    const activityCode = lo.get(req, 'query.actId') || ""

    const params = {
        userId, activityCode
    }

    const result = await proxy.parallelPromise([
        ['configs', conf.activityApi.configs, {...params, type: "TweetImg"}, conf.baseApi.secret],
        ['configsByCode', conf.activityApi.configsByCode, {
            ...params,
            codeList: ["HTMLTitle", "headImg", "giftImg", "giftUrl", "videoUrl", "shareTitle", "shareDesc", "shareImg", "channelUrl", "originPrice", "discountPrice"]
        }, conf.baseApi.secret],
    ], req);


    const tuiwenList = lo.get(result, 'configs.data.dataList', []) || [];
    const configsByCode = lo.get(result, 'configsByCode.data.dataList', []) || [];

    let [HTMLTitle, headImg, giftImg, giftUrl, videoUrl, shareTitle, shareDesc, shareImg, channelUrl, originPrice, discountPrice] = ["title", "headImg", "giftImg", "giftUrl", "videoUrl", "shareTitle", "shareDesc", "shareImg", "channelUrl", "originPrice", "discountPrice"]

    if(tuiwenList && tuiwenList.length == 0) {
        res.redirect('/wechat/page/activity/over')
        return
    }

    configsByCode.map((item) => {
            switch(item.code) {
                case "headImg":
                    headImg = item.icon
                    break
                case "videoUrl":
                    videoUrl = item.url
                    break
                case "giftImg":
                    giftImg = item.icon
                    giftUrl = item.url
                    break
                case "shareTitle":
                    shareTitle = item.content
                    break
                case "shareDesc":
                    shareDesc = item.content
                    break
                case "shareImg":
                    shareImg = item.icon
                    break
                case "HTMLTitle":
                    HTMLTitle = item.content
                    break
                case "channelUrl":
                    channelUrl = item.url
                    break
                case "originPrice":
                    originPrice = item.content
                    break
                case "discountPrice":
                    discountPrice = item.content
                    break
                default:
                    break
            }
        })


    var sysTime = new Date().getTime();
    var filePath = path.resolve(__dirname, '../../public/activity/page/tuiwen-common/index.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                serverData: result,
                tuiwenList: tuiwenList,
                shareData: {
                    shareTitle: shareTitle,
                    shareDesc: shareDesc,
                    shareImg: shareImg,
                },
            },
            renderData: {
                HTMLTitle: HTMLTitle,
                headImg: headImg,
                giftImg: giftImg,
                giftUrl: giftUrl,
                videoUrl: videoUrl,
                channelUrl: channelUrl,
                originPrice: originPrice,
                discountPrice: discountPrice,
            },
        };

    htmlProcessor(req, res, next, options);
}

function tuiwenCommonHDRedirect (req, res, next) {
    const random1 = uuid.v4();
    const random2 = uuid.v4();
    let queryStr = querystring.stringify(req.query || {});
    
    res.redirect(`/wechat/page/activity/${random1}/tuiwen-hd?${queryStr}&${random2}`);
}

async function tuiwenCommonHD(req, res, next) {
    // 从朋友圈点进去的链接无法继续分享的兼容代码
    if (req.query.from || req.query.isappinstalled) {
        var query = { ...req.query };
        delete query.from;
        delete query.isappinstalled;
        var url = '/wechat/page/activity/tuiwen-hd';
        var searchUrl = querystring.stringify(query || {});
        if (searchUrl) { url += '?' + searchUrl;}
        res.redirect(url);
        return;
    }

    var sysTime = new Date().getTime();
    const userId = lo.get(req, 'rSession.user.userId');
    const activityCode = lo.get(req, 'query.actId') || ""

    const params = {
        userId, activityCode
    }

    const result = await proxy.parallelPromise([
        ['configs', conf.activityApi.configs, {...params, type: "TweetImg"}, conf.baseApi.secret],
        ['configsByCode', conf.activityApi.configsByCode, {
            ...params,
            codeList: ["HTMLTitle", "headImg", "giftImg", "giftUrl", "videoUrl", "shareTitle", "shareDesc", "shareImg", "channelUrl", "originPrice", "discountPrice"]
        }, conf.baseApi.secret],
    ], req);



    const tuiwenList = lo.get(result, 'configs.data.dataList', []) || [];
    const configsByCode = lo.get(result, 'configsByCode.data.dataList', []) || [];



    let [HTMLTitle, headImg, giftImg, giftUrl, videoUrl, shareTitle, shareDesc, shareImg, channelUrl, originPrice, discountPrice] = ["", "", "", "", "", "", "", "", "", "", ""]

    configsByCode.map((item) => {
            switch(item.code) {
                case "headImg":
                    headImg = item.icon
                    break
                case "videoUrl":
                    videoUrl = item.url
                    break
                case "giftImg":
                    giftImg = item.icon
                    giftUrl = item.url
                    break
                case "shareTitle":
                    shareTitle = item.content
                    break
                case "shareDesc":
                    shareDesc = item.content
                    break
                case "shareImg":
                    shareImg = item.icon
                    break
                case "HTMLTitle":
                    HTMLTitle = item.content
                    break
                case "channelUrl":
                    channelUrl = item.url
                    break
                case "originPrice":
                    originPrice = item.content
                    break
                case "discountPrice":
                    discountPrice = item.content
                    break
                default:
                    break
            }
        })



    var filePath = path.resolve(__dirname, '../../public/activity/page/tuiwen-common/index-hd.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                serverData: result,
                tuiwenList: tuiwenList,
                shareData: {
                    shareTitle: shareTitle,
                    shareDesc: shareDesc,
                    shareImg: shareImg,
                },
            },
            renderData: {
                HTMLTitle: HTMLTitle,
                headImg: headImg,
                giftImg: giftImg,
                giftUrl: giftUrl,
                videoUrl: videoUrl,
                channelUrl: channelUrl,
                originPrice: originPrice,
                discountPrice: discountPrice,
            },
        };

    htmlProcessor(req, res, next, options);
}


async function campMDomain(req, res, next) {

    var sysTime = new Date().getTime();
    const userId = lo.get(req, 'rSession.user.userId');
    const activityCode = lo.get(req, 'query.actId') || ""

    const params = {
        userId, activityCode
    }

    const result = await proxy.parallelPromise([
        ['configs', conf.activityApi.configs, {...params, type: "TweetImg"}, conf.baseApi.secret],
        ['configsByCode', conf.activityApi.configsByCode, {
            ...params,
            codeList: ["HTMLTitle", "headImg", "giftImg", "giftUrl", "videoUrl", "shareTitle", "shareDesc", "shareImg", "channelUrl", "originPrice", "discountPrice"]
        }, conf.baseApi.secret],
    ], req);

    const tuiwenList = lo.get(result, 'configs.data.dataList', []) || [];
    const configsByCode = lo.get(result, 'configsByCode.data.dataList', []) || [];

    let [HTMLTitle, headImg, giftImg, giftUrl, videoUrl, shareTitle, shareDesc, shareImg, channelUrl, originPrice, discountPrice] = ["", "", "", "", "", "", "", "", "", "", ""]
    configsByCode.map((item) => {
        switch (item.code) {
            case "headImg":
                headImg = item.icon
                break
            case "videoUrl":
                videoUrl = item.url
                break
            case "giftImg":
                giftImg = item.icon
                giftUrl = item.url
                break
            case "shareTitle":
                shareTitle = item.content
                break
            case "shareDesc":
                shareDesc = item.content
                break
            case "shareImg":
                shareImg = item.icon
                break
            case "HTMLTitle":
                HTMLTitle = item.content
                break
            case "channelUrl":
                channelUrl = item.url
                break
            case "originPrice":
                originPrice = item.content
                break
            case "discountPrice":
                discountPrice = item.content
                break
            default:
                break
        }
    })

    var filePath = path.resolve(__dirname, '../../public/activity/page/camp/camp-m.html'),
        options = {
            filePath: filePath,
            fillVars: {
                SYSTIME: sysTime,
                serverData: result,
                tuiwenList: tuiwenList,
                shareData: {
                    shareTitle: shareTitle,
                    shareDesc: shareDesc,
                    shareImg: shareImg,
                },
            },
            renderData: {
                HTMLTitle: HTMLTitle,
                headImg: headImg,
                giftImg: giftImg,
                giftUrl: giftUrl,
                videoUrl: videoUrl,
                channelUrl: channelUrl,
                originPrice: originPrice,
                discountPrice: discountPrice,
            },
        };

    htmlProcessor(req, res, next, options);
}





function campQA(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/activity/page/camp/qa.html')
    htmlProcessor(req, res, next, { filePath })
}
function tuiwenOver(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/activity/page/tuiwen-common/over.html')
    htmlProcessor(req, res, next, { filePath })
}

function annualPraise(req, res, next){
	const filePath = path.resolve(__dirname, '../../public/activity-react/annual-praise.html');

	const options = {
		filePath,
		fillVars: {
			// 在默认模板中，默认使用这个字段当初始化参数
			INIT_DATA: {

			}
		},
		renderData: {},
	};

	// 如果页面存在vc参数，则注入vconsole功能
	if (req.query._vcdebug) {
		options.renderData.isVconsole = true;
	}

	htmlProcessor(req, res, next, options);

}

async function annualRank(req, res, next) {
    const filePath = path.resolve(__dirname, '../../public/activity-react/annual-rank.html');

	const result = await proxy.parallelPromise([
		[conf.activityApi.activityInfo, {code: 'yearRank'}, conf.baseApi.secret],
	], req).catch(err => {
		res.render('500');
		console.error(err);
	});

	const info = lo.get(result, '0.data.activityDto', {});
	const now = Date.now();

	if(!info.code || info.endDate < now){
	    //如果活动已结束
        res.redirect('/wechat/page/activity/annualPraise');
        return;
    }

    const options = {
        filePath,
	    fillVars: {
		    // 在默认模板中，默认使用这个字段当初始化参数
		    INIT_DATA: {

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

async function receiveGift (req, res, next) {
    const redirectUrl = req.query.url;
    const giftId = req.query.giftId;
    const nickName = lo.get(req, 'rSession.user.name');
    const verifyCode = req.query.verifyCode;
    const activityCode = req.query.activityCode;
    const userId = lo.get(req, 'rSession.user.userId')

    const result = await proxy.apiProxyPromise(conf.baseApi.saveGift, {
        activityCode,
        userId,
        giftId,
        nickName,
        verifyCode,
    }, conf.baseApi.secret);

    if (result.state.code == 0) {
        res.redirect(redirectUrl);
    } else {
        res.render('500');
    }
}


async function openApp(req, res, next) {
    htmlProcessor(req, res, next, {
        filePath: path.resolve(__dirname, '../../public/activity/page/open-app/open-app.html')
    });
    return;
}


module.exports = [
    //38妇女节
    // 注：这里使用/wechat/page的路由，是因为nginx只分配了/wechat/page访问到Node
    ['GET', '/wechat/page/activity/woman', clientParams(), appAuth({
        failureRedirect: pageWoman
    }), pageWoman],

    ['GET', '/wechat/page/activity/image-view', imageView],
    ['GET', '/wechat/page/activity/image', image],

    ['GET', '/wechat/page/activity/storage', activityStorage],
    ['GET', '/wechat/page/activity/endless-eight', clientParams(), appAuth(), wxAuth(), endlessEight],
    ['GET', '/wechat/page/activity/endless-eight/comment', clientParams(), appAuth(), wxAuth(), endlessEightComment],

    // 抽奖活动
    ['GET', '/wechat/page/activity/lottery', lottery],
    // 抽奖页
    ['GET', '/wechat/page/activity/lottery-draw', lotteryDraw],
    // 中奖信息收集
    // ['GET', '/wechat/page/activity/lottery-address', clientParams(), appAuth(), wxAuth(), lotteryAddress],
    ['GET', '/activity/page/lottery-address', clientParams(), appAuth(), wxAuth(), lotteryAddress],
    // 抽奖优惠券列表页
    ['GET', '/wechat/page/activity/lottery-code', lotteryCode],

    //教师节活动
    ['GET', '/wechat/page/activity/teachers-day/rank',clientParams(), appAuth(), wxAuth(), teacherRank],
    ['GET', '/wechat/page/activity/teachers-day/standard',clientParams(), appAuth(), wxAuth(), teacherStandard],
    ['GET', '/wechat/page/activity/teachers-day/report',clientParams(), appAuth(), wxAuth(), teacherReport],

    //节日邀请卡
    ['GET', '/wechat/page/activity/activityCard', clientParams(), appAuth(), wxAuth(), activityCard],

    // 拼课活动
    ['GET', '/wechat/page/activity/group', clientParams(), appAuth(), wxAuth(), groupActivity],
    // 拼课活动留言
    ['GET', '/wechat/page/activity/group/comment', clientParams(), appAuth(), wxAuth(), groupActivityComment],

	// 外部渠道分销模板
    ['GET', '/wechat/page/activity/thirdPartyTemp', clientParams(), thirdPartyDistributionTemp],

    //超级妈妈活动
    ['GET', '/wechat/page/activity/super-mother', clientParams(), superMother],
    ['GET', '/wechat/page/activity/super-mother/coupon', clientParams(), superMotherCoupon],
    ['GET', '/wechat/page/activity/super-mother/card-menu', clientParams(), appAuth(), wxAuth(), superMotherCardMenu],
    ['GET', '/wechat/page/activity/super-mother/card-list', clientParams(), appAuth(), wxAuth(), superMotherCardList],
    ['GET', '/wechat/page/activity/super-mother/task', clientParams(), appAuth(), wxAuth(), superMotherTask],
    ['GET', '/wechat/page/activity/super-mother/weibo', clientParams(), superMotherWeibo],
    // ['GET', '/wechat/page/activity/super-mother/card-menu', clientParams(), appAuth(), wxAuth(), superMotherCardMenu],

    //活动优惠券
    ['GET', '/wechat/page/activity/coupon', clientParams(), appAuth(), wxAuth(), activityCoupon],

    // 进微信群活动
	['GET', '/wechat/page/activity/wcGroup', clientParams(), wechatGroup],
    ['GET', '/wechat/page/activity/wcGroup/qr', clientParams(), wechatGroupQr],
    ['GET', '/wechat/page/activity/wcGroup/qrCode', clientParams(), wechatGroupQr], 
    ['GET', '/wechat/page/activity/wcGroup/:tempId/qrCode', clientParams(), wechatGroupQr], // 添加新路由
    ['GET', '/wechat/page/activity/wcGroup/qr_auth', clientParams(), wxAuth(), wechatGroupQr],
    // 裂变增粉
    ['GET', '/wechat/page/activity/gift-course', clientParams(), increaseFansRedirect],
    ['GET', '/wechat/page/activity/:ramdom/gift-course', clientParams(), increaseFans],
    // 重阳节活动
    ['GET', '/wechat/page/activity/ninth-festival', /* wxAppAuth(),*/ ninthFestival],
    // 双十一活动
    ['GET', '/wechat/page/activity/double-eleven', clientParams(), appAuth(), wxAuth(), doubleEleven],
    ['GET', '/wechat/page/activity/double-eleven/address', clientParams(), appAuth(), wxAuth(), doubleElevenAddress],
    // 冬季养生活动
    ['GET', '/wechat/page/activity/winter-health', clientParams(), appAuth(), wxAuth(), winterHealth],
    ['GET', '/wechat/page/activity/winter-health/cover', clientParams(), appAuth(), wxAuth(), winterHealthTestCover],
    ['GET', '/wechat/page/activity/winter-health/test', clientParams(), appAuth(), wxAuth(), winterHealthTest],
    ['GET', '/wechat/page/activity/winter-health/result', clientParams(), appAuth(), wxAuth(), winterHealthTestResult],
    ['GET', '/wechat/page/activity/winter-health/comment', clientParams(), appAuth(), wxAuth(), winterHealthComment],


    // 活动通用领书页面
    ['GET', '/wechat/page/activity/address', clientParams(), appAuth(), wxAuth(), address],
    //排行榜
    ['GET', '/wechat/page/activity/rank', clientParams(), appAuth(), wxAuth(), pageExploreRankTopic],

    // 活动通用推文页  同刘媛媛
    ['GET', '/wechat/page/activity/tuiwen', clientParams(), appAuth(), wxAuth(), tuiwenCommon],
    // 活动推文过期页
    ['GET', '/wechat/page/activity/over', clientParams(), appAuth(), wxAuth(), tuiwenOver],

    ['GET', '/wechat/page/activity/:ramdom/tuiwen-hd', clientParams(), tuiwenCommonHD],
    // 训练营专用推文页
    ['GET', '/wechat/page/activity/tuiwen-hd', clientParams(), tuiwenCommonHDRedirect],
    // 训练营 m域名 推广用页面
    ['GET', '/wechat/page/activity/camp-m', clientParams(),  appAuth(), wxAuth(), campMDomain],

    ['GET', '/wechat/page/activity/qa', clientParams(), campQA],
    // 年度口碑榜
	['GET', '/wechat/page/activity/annualPraise', clientParams(), appAuth(), wxAuth(), annualPraise],
    // 年度排行榜
    ['GET', '/wechat/page/activity/annualRank', clientParams(), appAuth(), wxAuth(), annualRank],

    ['GET', '/wechat/page/act-receiveGift', clientParams(), appAuth(), wxAuth(), receiveGift],

    // 打开app，中转页
    ['GET', '/wechat/page/open-app', clientParams(), openApp],
];
