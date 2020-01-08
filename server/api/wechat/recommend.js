var _ = require('underscore'),
    lo = require('lodash'),

    resProcessor = require('../../components/res-processor/res-processor'),
    proxy = require('../../components/proxy/proxy'),
    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),
    conf = require('../../conf'),
    requestProcess = require('../../middleware/request-process/request-process');

var LRU = require("lru-cache"), 
    cache = LRU({ maxAge: 1000 * 60 * 60 });

/**
 * 推荐课程列表页初始化接口
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-26T14:08:18+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var getRecommendCourseInitData = async (params, req) => {

    const tasks = {
        // banners: proxy.apiProxyPromise(conf.baseApi.getBanners, {...params, twUserTag: lo.get(req, 'query.twUserTag', '')}, conf.baseApi.secret, req),
        categoryList: proxy.apiProxyPromise(conf.baseApi.homeTag, {}, conf.baseApi.secret, req),
        // showFlag: proxy.apiProxyPromise(conf.baseApi.showFlag, params, conf.baseApi.secret, req),
        // hotLives: proxy.apiProxyPromise(conf.baseApi.recommend.hotLives, { ...params, page: { page: 1, size: 8 } }, conf.baseApi.secret, req),
        // showList: proxy.apiProxyPromise(conf.baseApi.nightAnswer.getTopicList, { page: { page: 1, size: 1 } }, conf.baseApi.secret, req),
        iconList: getIconListCache()
    };

    if(params.tagId){
        tasks.courseList = proxy.apiProxyPromise(conf.baseApi.indexRecommend, params, conf.baseApi.secret, req);
    }else{
        // 经商讨userId可传可不传
        tasks.initData = proxy.apiProxyPromise(conf.baseApi.recommend.initIndexData, {twUserTag: params.userTag, userId: params.userId}, conf.baseApi.secret, req);
    }

    const resArr = await Promise.all(Object.values(tasks)).catch(err => {
        console.error(err)
    });
    return lo.zipObject(Object.keys(tasks), resArr);
};

const getHotTagCourse = (tags, req) => {
    let tasks = []
    tags.forEach(item => {
        const params = {
            page: {
                page: 1,
                size: 10,
            },
            tagId: item.tagId,
        }
        tasks.push([item.tagId,conf.baseApi.recommend.hotTagCourse, params,conf.baseApi.secret ])
    })

    return proxy.parallelPromise(tasks, req)
}

var getChargeRecommendCourseList = (params, req) => {
    // let params = {
    //     page: {
    //         page: req.query.page,
    //         size: req.query.size
    //     }
    // };

    return proxy.parallelPromise([
        ['courseList', conf.baseApi.hotCharge, params, conf.baseApi.secret],
    ], req);
}


var getFreeRecommendCourseList = (params, req) => {
    return proxy.parallelPromise([
        ['courseList', conf.baseApi.recommend.getListFreeCourse, params, conf.baseApi.secret],
    ], req);
};

var getLowPriceRecommendCourseList = (params, req) => {
    return proxy.parallelPromise([
        ['courseList', conf.baseApi.recommend.getLowPriceCourse, params, conf.baseApi.secret],
    ], req);
};

//定制课程页面初始化
var initPeriodCourseData = (params, req) => {
    let tasks = [
        ['initPeriodCourse', conf.baseApi.getPeriodCourse, params, conf.baseApi.secret],
        ['periodCourseInfo', conf.baseApi.periodCourseInfo, params, conf.baseApi.secret],
    ];

    if (params.tdcode) {
        tasks.push(['setSubscribeStatus', conf.baseApi.setSubscribeStatus, { status: 'N', ...params }, conf.baseApi.secret])
    }

    return proxy.parallelPromise(tasks, req);
}


var initPeriodShareCard = (params, req) => {

    return proxy.parallelPromise([
        ['periodInviteCard', conf.baseApi.periodInviteCard, params, conf.baseApi.secret],
    ], req);
}

var checkPeriodQrTo=(params, req)=>{
    return proxy.parallelPromise([
        ['showFlag', conf.baseApi.showFlag, params, conf.baseApi.secret],
    ], req);
};

var initPeriodTabSelectData=(params, req)=>{
    return proxy.parallelPromise([
        ['allPeriodTag', conf.baseApi.getAllPeriodTag, params, conf.baseApi.secret],
        ['myPeriodTag', conf.baseApi.getMySelectPeriodTag, params, conf.baseApi.secret],
        ['getSubscribeStatus',conf.baseApi.getSubscribeStatus, params, conf.baseApi.secret],
    ], req);
};

/**
 * 服务端渲染两级分类的菜单栏
 */
var initTwoLevelTag = (params, req) => {
    return proxy.parallelPromise([
        ['initTwoLevelTag', conf.baseApi.recommend.getAllTags, params, conf.baseApi.secret],
    ], req);
};

var fectPeriodTabSelectData = (req, res, next)=>{
    var params = {
            periodId:0,
            userId: req.rSession.user.userId,
    };
    proxy.parallelPromise([
        ['allPeriodTag', conf.baseApi.getAllPeriodTag, params, conf.baseApi.secret],
        ['myPeriodTag', conf.baseApi.getMySelectPeriodTag, params, conf.baseApi.secret],
        ['getSubscribeStatus',conf.baseApi.getSubscribeStatus, params, conf.baseApi.secret],
    ], req).then(result => {
        resProcessor.jsonp(req, res, {
            data:result,
            state:{
                code:0,
                msg: '操作成功',
            }
        });
    }).catch(err => {
        resProcessor.error500(req, res, err);
    });

}
//夜答
var fetchNightAnswerInfo = (req, res, next) => {
    
        let params = {
            page: {
                page: 1,
                size: 1
            }
        }
    
        proxy.apiProxy(conf.baseApi.nightAnswer.getTopicList, params, function(err, body) {
            if (err) {
                resProcessor.error500(req, res, err);
                return;
            }
    
            resProcessor.jsonp(req, res, body);
        }, conf.baseApi.secret, req);
    }

/**
 * 获取推荐首页分类列表
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getCategoryList = (req, res, next) => {

    const userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.homeTag, { userId }, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}

/**
 * 推荐课程列表分页接口
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-12-26T14:08:18+0800
 * @param    {[type]}                           req  [description]
 * @param    {[type]}                           res  [description]
 * @param    {Function}                         next [description]
 * @return   {[type]}                                [description]
 */
var courseList = function(req, res, next) {
    var params = {
        tagId: req.query.tagId,
        offset: req.query.offset,
        pageSize: req.query.pageSize,
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.indexRecommend, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

/**
 * 付费精品课程推荐列表分页接口
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var chargeCourseList = function(req, res, next) {
    var params = {
        page: {
            page: req.query.page,
            size: req.query.size,
        },
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    getChargeRecommendCourseList(params, req).then((data) => {
        resProcessor.jsonp(req, res, data.courseList);
    }).catch((err) => {
        console.error(err);
        resProcessor.error500(req, res, err);
    });

    // proxy.apiProxy(conf.baseApi.hotCharge, params, function(err, body) {
    //     if (err) {
    //         resProcessor.error500(req, res, err);
    //         return;
    //     }
    //     resProcessor.jsonp(req, res, body);
    // }, conf.baseApi.secret);
};
// 无分类
var FreeCourseList = function(req, res, next) {
    var params = {
        page: {
            page: req.query.page,
            size: req.query.size,
        },
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.hotFree, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

// 有分类
var FreeCourseListWithClass = function(req, res, next) {
    var params = {
        page: {
            page:req.query.page,
            size:req.query.size
        },
        tagId: req.query.tagId
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.getFreeCourse, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
// 有分类
var lowPriceCourseListWithClass = function(req, res, next) {
    var params = {
        page: {
            page:req.query.page,
            size:req.query.size
        },
        tagId: req.query.tagId
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.getLowPriceCourse, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
var towLevelAlltags = function(req, res, next) {
    var params = {
        type: req.query.type
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.getAllTags, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var getHotLives = function (req, res, next) {
    var params = {
        isMore: "N",
        tagId: req.body.tagId,
        userId:req.rSession.user.userId,
        page: {
            page: 1,
            size: 8,
        }
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.hotLives, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }
        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
}


const iconList = async (req, res, next) => {
    let iconList = cache.get("iconList")
    if(iconList) {
        if(req){
            resProcessor.jsonp(req, res, iconList)
        }
        return iconList;
    } else {
        const body = await proxy.apiProxyPromise(conf.baseApi.recommend.iconList,{
            platform: 'h5'
        }, conf.baseApi.secret, req).catch(err => {
            resProcessor.error500(req, res, err);
        });
        if (body && body.state && body.state.code === 0) {
            cache.set("iconList", body)
        }
        if(req){
            resProcessor.jsonp(req, res, body);
        }
        return body
    }
}

const getIconListCache = async () => {
    return await iconList();
}

const newUserGift = async (req, res, next) => {
    try {
        let params = {
            userId: req.rSession.user.userId,
        }

        const result = await proxy.parallelPromise([
            ['getGiftBounceConfig', conf.baseApi.recommend.getGiftBounceConfig, params, conf.baseApi.secret],
            ['appGiftFlag', conf.baseApi.recommend.appGiftFlag, params, conf.baseApi.secret],
        ], req);

        resProcessor.jsonp(req, res, {
            state: {
                code: 0
            },
            data: result
        });
    } catch (error) {
        console.error(error);
    }
}

// 获取免费专区的tags
var getFreeListTags = function(req, res, next) {
    var params = {
        type: req.query.type
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.getListTags, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

// 获取免费专区banner
var getFreeBanner = function(req, res, next) {
    var params = {
        type: req.query.type
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.getListBanner, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};
// 获取免费精选课程
var getFreeChoiceCourse = function(req, res, next) {
    var params = {
        page: {
            page: req.query.page,
            size: req.query.size,
        },
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.getListFreeCourse, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};

var getFreeOtherCourse = function(req, res, next) {
    console.log(req.query.order)
    var params = {
        page: {
            page:req.query.page,
            size:req.query.size
        },
        tagId: req.query.tagId,
        order: req.query.order
    };

    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.apiProxy(conf.baseApi.recommend.getListFreeRegion, params, function(err, body) {
        if (err) {
            resProcessor.error500(req, res, err);
            return;
        }

        resProcessor.jsonp(req, res, body);
    }, conf.baseApi.secret, req);
};


module.exports = [
    ['GET', '/api/wechat/recommend/charge/course-list', clientParams(), appAuth(), wxAuth(), chargeCourseList],

    //免费专区(无分类)
    ['GET', '/api/wechat/recommend/free/course-list', clientParams(), appAuth(), wxAuth(), FreeCourseList],

    ['GET', '/api/wechat/recommend/course-list', clientParams(), appAuth(), wxAuth(), courseList],

    ['GET', '/api/wechat/recommend/cagegory-list', clientParams(), appAuth(), wxAuth(), getCategoryList],

    //夜答
    ['POST', '/api/wechat/recommend/night-answer', clientParams(), appAuth(), wxAuth(), fetchNightAnswerInfo],
    

    ['GET', '/api/wechat/recommend/isflag', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.showFlag, conf.baseApi.secret)],

    //定制课程
    //打卡
    ['POST', '/api/wechat/recommend/self-course-subscribe', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.selfSubscribe, conf.baseApi.secret)],
    //定制课程列表
    ['GET', '/api/wechat/recommend/get-period-course', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.getPeriodCourse, conf.baseApi.secret)],
    ['GET', '/api/wechat/recommend/get-period-info', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.periodCourseInfo, conf.baseApi.secret)],

    //课程定制邀请卡页面
    ['GET','/api/wechat/recommend/get-period-share-card', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.periodInviteCard, conf.baseApi.secret)],
    //获取所有课程定制标签
    //保存选择的定制课程标签
    ['POST', '/api/wechat/recommend/save-period-tag', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.saveMyPeriodTag, conf.baseApi.secret)],
    ['GET', '/api/wechat/recommend/init-period-tag', clientParams(), appAuth(), wxAuth(),fectPeriodTabSelectData],

    ['POST','/api/wechat/recommend/set-subscribe-status', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.setSubscribeStatus, conf.baseApi.secret)],

    //获取用户定制课程贴片
	['POST','/api/wechat/recommend/getCustomCoursePaster', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.recommend.getCustomCoursePaster, conf.baseApi.secret)],

	// 获取分类标签
    ['GET', '/api/wechat/recommend/class/all-tags', clientParams(), appAuth(), wxAuth(), towLevelAlltags],
    // 获取免费课程列表(分类)
    ['GET', '/api/wechat/recommend/free/course-list-with-class', clientParams(), appAuth(), wxAuth(), FreeCourseListWithClass],
    // 获取低价课程列表(分类)
    ['GET', '/api/wechat/recommend/low-price/course-list-with-class', clientParams(), appAuth(), wxAuth(), lowPriceCourseListWithClass],

    // 获取个人中心小红点信息（历史原因在这里添加路由）
    ['GET', '/api/wechat/recommend/is-mine-new',  clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.isMineNew, conf.baseApi.secret)],


    // 获取热门直播间
    ['POST','/api/wechat/recommend/hotLives', clientParams(), appAuth(), wxAuth(),getHotLives],

    ['GET', '/api/wechat/recommend/article/list', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.articleList, conf.baseApi.secret)],
    ['GET', '/api/wechat/recommend/hot-tag/tags', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.hotTagTags, conf.baseApi.secret)],
    ['GET', '/api/wechat/recommend/hot-tag/course', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.hotTagCourse, conf.baseApi.secret)],
    
    // 推荐页的四个icon
    ['GET', '/api/wechat/recommend/iconList', clientParams(), appAuth(), wxAuth(), iconList],

    // 查询用户领新人礼包标识
    ['POST', '/api/wechat/recommend/giftFlag', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.giftFlag, conf.baseApi.secret)],    
    ['POST', '/api/wechat/recommend/allGift', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.allGift, conf.baseApi.secret)],    
    ['POST', '/api/wechat/recommend/newGiftTopic', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.newGiftTopic, conf.baseApi.secret)],    
    ['POST', '/api/wechat/recommend/getGift', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.getGift, conf.baseApi.secret)],
	// 首页初始化数据
	['GET', '/api/wechat/recommend/init-index-data', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.initIndexData, conf.baseApi.secret)],
	// 首页兴趣相投
	['GET', '/api/wechat/recommend/init-interest', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.initIndexInterest, conf.baseApi.secret)],
	// 首页点击查看更多
    ['POST', '/api/wechat/recommend/view-more', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.viewMoreCourses, conf.baseApi.secret)],
    // 首页用户偏好标签
    ['POST', '/api/live/center/livecenterTags', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.livecenterTags, conf.baseApi.secret)],
    // 保存用户偏好
	['POST', '/api/live/center/saveUserTag', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.saveUserTag, conf.baseApi.secret)],

    ['GET', '/api/wechat/recommend/getGiftBounceConfig', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.getGiftBounceConfig, conf.baseApi.secret)],
    ['GET', '/api/wechat/recommend/appGiftFlag', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.appGiftFlag, conf.baseApi.secret)],
    // 组合上面这两个接口
    ['GET', '/api/wechat/recommend/newUserGift', clientParams(), appAuth(), wxAuth(), newUserGift],

    // 免费专区接口
    ['GET', '/api/wechat/free-recommend/list-tags', clientParams(), appAuth(), wxAuth(), getFreeListTags],
    ['GET', '/api/wechat/free-recommend/list-banner', clientParams(), appAuth(), wxAuth(), getFreeBanner],
    ['GET', '/api/wechat/free-recommend/choice-course', clientParams(), appAuth(), wxAuth(), getFreeChoiceCourse],
    ['GET', '/api/wechat/free-recommend/other-course', clientParams(), appAuth(), wxAuth(), getFreeOtherCourse],
    // 知识新闻
    ['GET', '/api/wechat/news/list', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.getNewsLists, conf.baseApi.secret)],
    // 听书列表
    ['GET', '/api/wechat/books/lists', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.booksLists, conf.baseApi.secret)],
    // 知识小课
    ['POST', '/api/wechat/know/book', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.bookshelfRecord, conf.baseApi.secret)],
    ['POST', '/api/wechat/getCourseAuditionList', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.recommend.getCourseAuditionList, conf.baseApi.secret)],

];

module.exports.getRecommendCourseInitData = getRecommendCourseInitData;
module.exports.getHotTagCourse = getHotTagCourse;
module.exports.getChargeRecommendCourseList = getChargeRecommendCourseList;
module.exports.getFreeRecommendCourseList = getFreeRecommendCourseList;
module.exports.getPeriodCourseInitData = initPeriodCourseData;
module.exports.initPeriodShareCard = initPeriodShareCard;
module.exports.checkPeriodQrTo=checkPeriodQrTo;
module.exports.initPeriodTabSelectData=initPeriodTabSelectData;
module.exports.initTwoLevelTag = initTwoLevelTag;
module.exports.getLowPriceRecommendCourseList = getLowPriceRecommendCourseList;
module.exports.getHotLives = getHotLives;
module.exports.getIconListCache = getIconListCache;
