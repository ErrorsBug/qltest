var _ = require('underscore'),

    resProcessor = require('../components/res-processor/res-processor'),
    proxy = require('../components/proxy/proxy'),
    wxAuth = require('../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../middleware/client-params/client-params'),
    conf = require('../conf');

const requestProcess = require('../middleware/request-process/request-process');

import lo from 'lodash'

var fs = require('fs');
var path = require('path');

var mkdirp = require('mkdirp')

/* 打日志 */
var increase = function(req, res, next) {
    const type = lo.get(req,'body.type')
    const channelId = lo.get(req,'body.channelId') || '230000493021827'
    const userId = lo.get(req,'rSession.user.userId')

    proxy.apiProxy(conf.baseApi.activity.storage.log+`?type=${type}&channelId=${channelId}&userId=${userId}`,
        {channelId, type, userId},
        function(err,body){
            if (err) {
                resProcessor.error500(req, res, err);
                return;
            }

            resProcessor.jsonp(req, res, {
                state: {
                    code: 0
                },
                data: {
                    sysTime: new Date().getTime()
                }
            });
        },
        conf.baseApi.secret, req);
};

var getConfig = function(req, res, next) {

    // const url = req.protocol + '://' + req.get('host') + '/wechat/page/activity/storage';
    const url = decodeURIComponent(req.query.url);
    proxy.apiProxy(conf.baseApi.activity.config + '?url='+encodeURIComponent(url), { },
        function(err,body){
            if (err) {
                resProcessor.error500(req, res, err);
                return;
            }

            resProcessor.jsonp(req, res, {
                state: {
                    code: 0
                },
                data: {
                    config: body,
                }
            });
        },
        conf.baseApi.secret, req);

};

function lotteryAddress(req, res, next) {

    req.rSession.addressRequestNum = req.rSession.addressRequestNum || 0
    req.rSession.addressRequestNum = req.rSession.addressRequestNum + 1
    var userId = lo.get(req, 'rSession.user.userId')

    if(req.rSession.addressRequestNum > 3) {
        console.warn('write user address fail ,userId:' + userId + ' ,request num:' + req.rSession.addressRequestNum);
        resProcessor.jsonp(req, res, {
            state: {
                code: -1,
                msg: "提交次数超过限制！"
            },
            data: {}
        });
    } else {
        if(req.query.name && req.query.mobile && req.query.address){
            resProcessor.jsonp(req, res, {
                state: {
                    code: 0
                },
                data: {
                    msg: "操作成功",
                }
            });
            //文件地址
            var addressPath = path.resolve('/data/logs/nodejs/doubleElevenAddress.txt');
            try {
                if (!fs.existsSync(path.dirname(addressPath))) {
                    mkdirp.sync(path.dirname(addressPath), 755);
                }

                fs.appendFile(addressPath,
                    "userId=" + userId + "&name=" + decodeURIComponent(req.query.name) + "&mobile=" + req.query.mobile + "&address=" + decodeURIComponent(req.query.address) + '&time=' + new Date().getTime() + "\n",
                    function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log('write user address success,userId:' + userId + ' request num:' + req.rSession.addressRequestNum);
                        }
                });

            } catch(err) {
                console.error(err);
            }



        } else {
            resProcessor.jsonp(req, res, {
                state: {
                    code: -1,
                    msg: "请输入完整的信息"
                },
                data: {}
            });
        }
    }

}

const getCourseList = function (req, res, next) {
    let params = {
        groupCode: lo.get(req, 'body.groupCode'),
        activityCode: 'SSS20171111',
    };
    params.userId = lo.get(req, 'rSession.user.userId');
    proxy.parallelPromise([
        [conf.baseApi.activity.doubleEleven.getCourse, params, conf.baseApi.secret],
    ], req).then(result => {
        let list = lo.get(result, '0.data.dataList', []);
        resProcessor.jsonp(req, res,
            {
                data: list,
                state: {
                    code: 0,
                    msg: '请求成功 '
                },
            })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

//冬季养生活动点赞
const agree = function (req, res, next) {
    let params = {
        assignmentId: lo.get(req, 'body.assignmentId'),
        activityCode: 'health20171115'
    };
    params.userId = lo.get(req, 'rSession.user.userId');
    proxy.parallelPromise([
        [conf.activityApi.winterHealth.like, params, conf.baseApi.secret],
    ], req).then(result => {
        resProcessor.jsonp(req, res,{
            state: {
                code: 0,
                msg: '请求成功 '
            },
        })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};
//冬季养生获取评论列表
const getCommentList = function (req, res, next) {
    let params = {
        page: lo.get(req, 'body.page')
    };
    params.userId = lo.get(req, 'rSession.user.userId');
    params.activityCode = 'health20171115';
    proxy.parallelPromise([
        [conf.activityApi.winterHealth.getComment, params, conf.baseApi.secret],
    ], req).then(result => {
        let commentList = lo.get(result, '0.data.dataList');
        resProcessor.jsonp(req, res,{
            commentList: commentList,
            state: {
                code: 0,
                msg: '请求成功 '
            },
        })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};
//冬季养生提交评论
const postComment = function (req, res, next) {
    let params = {
        activityCode: 'health20171115',
        userId: lo.get(req, 'rSession.user.userId'),
        content: lo.get(req, 'body.content'),
        userName: lo.get(req, 'body.userName'),
        headImgUrl: lo.get(req, 'body.headImgUrl')
    };
    proxy.parallelPromise([
        [conf.activityApi.winterHealth.addComment, params, conf.baseApi.secret],
    ], req).then(result => {
        let id = lo.get(result, '0.data.id');
        resProcessor.jsonp(req, res,{
            comment: {
                id: id,
                userId: params.userId,
                content: params.content,
                createTime: new Date().getTime(),
                likeNum: 0,
                userName: params.userName,
                headImgUrl: params.headImgUrl,
                isLike: 'N',
                activityCode: params.activityCode
                },
            state: {
                code: 0,
                msg: '请求成功 '
            },
        })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};
async function isTest(req, res, next){
    let activityCode = 'health20171115',
        userId = lo.get(req, 'rSession.user.userId');
    const result = await proxy.parallelPromise([
        [conf.activityApi.winterHealth.getTestResultDetail, {userId,activityCode}, conf.baseApi.secret]
    ]);
    resProcessor.jsonp(req, res,{
        data: {
            score: lo.get(result, '0.data.testInfo.score'),
            remark: lo.get(result, '0.data.testInfo.remark')
        },
        state: {
            code: 0,
            msg: '请求成功 '
        },
    })
}
async function getWinterHealthCoupon(req, res, next){
    let promotionId = '12',
        userId = lo.get(req, 'rSession.user.userId');
    const result = await proxy.parallelPromise([
        [conf.baseApi.activity.coupon.getCouponCode, {promotionId,userId}, conf.baseApi.secret]
    ]);
    resProcessor.jsonp(req, res,{
        state: {
            code: 0,
            msg: '请求成功 '
        },
    });
}
//排行榜
const getRankTopicList = function (req, res, next) {
    let params = {
        page: {
            page: lo.get(req, 'body.pageNum'),
            size: lo.get(req, 'body.pageSize'),
        },
        tagId: lo.get(req, 'body.tagId'),
    }
    params.userId = lo.get(req, 'rSession.user.userId');

    proxy.parallelPromise([
        [conf.baseApi.rank.getTopicRank, params, conf.baseApi.secret],
    ]).then(result => {
        let topics = lo.get(result, '0.data.topics', []);
        topics.forEach((value, index) => {
            if (!value['backgroundUrl']) {
                value['backgroundUrl'] = 'https://img.qlchat.com/qlLive/liveCommon/ticket_header.jpg';
            }
            if (!value['money']) {
                value['money'] = 0;
            }
        });
        resProcessor.jsonp(req, res,
            {
                data: topics,
                state: {
                    code: 0,
                    msg: '请求成功 '
                },
            })
    }).catch(err => {
        res.render('500');
        console.error(err);
    });
};

const getActivityInfo = async function(req, res, next){
	const result = await proxy.parallelPromise([
		[conf.activityApi.activityInfo, {code: lo.get(req, 'body.code')}, conf.baseApi.secret],
	], req).catch(err => {
		res.render('500');
		console.error(err);
	});
    const info = lo.get(result, '0.data.activityDto', {});
    const now = Date.now();
    info.isEnd = !info.code || info.endDate < now;
    resProcessor.jsonp(req, res, {
	    data: info,
	    state: {
		    code: 0,
		    msg: '请求成功 '
	    },
    })
};

const getOldBeltNewTime = async function(req, res, next){
	const result = await proxy.parallelPromise([
		[conf.wechatApi.oldBeltNewTime, {code: lo.get(req, 'body.code')}, conf.baseApi.secret],
	], req).catch(err => {
		res.render('500');
		console.error(err);
	});
    const info = lo.get(result, '0.data', {});
    info.isEnd = true;
    const now = new Date().getTime()
    if (info.endTime && info.endTime > now) {
        info.isEnd = false
    }
    resProcessor.jsonp(req, res, {
	    data: info,
	    state: {
		    code: 0,
		    msg: '请求成功 '
	    },
    })
};

const channelConfig = async function(req, res, next){
  
    let params = {
        channelId: lo.get(req, 'body.channelId'),
    };
    console.log(lo.get(req, 'body.channelId'))

    const channelData = await proxy.parallelPromise([
        ['channelInfo', conf.baseApi.channel.info, params, conf.baseApi.secret],
    ], req);
    
    const chargeConfigs = lo.get(channelData, 'channelInfo.data.chargeConfigs', []);

    resProcessor.jsonp(req, res, {
	    data: {
            chargeConfigs
        },
	    state: {
		    code: 0,
		    msg: '请求成功 '
	    },
    })
};

module.exports = [
    // 活动统计日志
    ['POST', '/api/wechat/activity/log/increase', increase],
    // 获取微信配置
    ['GET', '/api/wechat/activity/config', getConfig],

    // 获取评论
    ['GET', '/api/wechat/activity/endless-eight/comment',clientParams(),appAuth(),wxAuth(), requestProcess(conf.baseApi.activity.endlessEight.comment.get, conf.baseApi.secret)],
    // 添加评论
    ['POST', '/api/wechat/activity/endless-eight/comment', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.activity.endlessEight.comment.add, conf.baseApi.secret)],
    // 获取评论数
    ['GET', '/api/wechat/activity/endless-eight/comment/count', clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.activity.endlessEight.comment.count, conf.baseApi.secret)],
    // 获取抽奖结果
    ['GET', '/api/wechat/activity/lottery/rand', function(req, res, next) {
        // if (!req.rSession.super_mother_key) {
        //     resProcessor.jsonp(req, res, {
        //         state: {
        //             code: 110,
        //             msg: '页面已过期，请刷新页面重试'
        //         }
        //     });
        //     return;
        // }

        // req.rSession.super_mother_times = parseInt(req.rSession.super_mother_times || 0) + 1;
        // // 抽奖次数大于1时，不允许抽奖
        // if (req.rSession.super_mother_times > 3) {
        //     resProcessor.jsonp(req, res, {
        //         state: {
        //             code: 110,
        //             msg: '您已领取优惠券，在『我的优惠券』查看'
        //         }
        //     });
        //     return;
        // }
        next();
    }, requestProcess(conf.baseApi.activity.rand, conf.baseApi.secret)],
    // 抽奖用户信息收集
    // ['GET', '/api/wechat/activity/lottery/address', clientParams(),appAuth(),wxAuth(), lotteryAddress],
    // 获取社群二维码
	['GET', '/api/wechat/activity/getCommunityQr', clientParams(), requestProcess(conf.baseApi.activity.getCommunityQr, conf.baseApi.secret)],

    // 叶一茜任务卡系列接口
	['GET', '/api/wechat/activity/yeyiqian/topic-status', clientParams(),appAuth(),wxAuth(), requestProcess(conf.baseApi.activity.yeyiqian.topicStatus, conf.baseApi.secret)],
	['GET', '/api/wechat/activity/yeyiqian/assignment/list-get', clientParams(),appAuth(),wxAuth(), requestProcess(conf.baseApi.activity.yeyiqian.listGet, conf.baseApi.secret)],
	['GET', '/api/wechat/activity/yeyiqian/assignment/user-get', clientParams(),appAuth(),wxAuth(), requestProcess(conf.baseApi.activity.yeyiqian.userGet, conf.baseApi.secret)],
	['GET', '/api/wechat/activity/yeyiqian/assignment/save', clientParams(),appAuth(),wxAuth(), requestProcess(conf.baseApi.activity.yeyiqian.save, conf.baseApi.secret)],
	['GET', '/api/wechat/activity/yeyiqian/assignment/like', clientParams(),appAuth(),wxAuth(), requestProcess(conf.baseApi.activity.yeyiqian.like, conf.baseApi.secret)],
    //获取优惠码
    //获取优惠码
    ['POST', '/api/wechat/activity/coupon/getCouponCode',clientParams(), appAuth(), wxAuth(),requestProcess(conf.baseApi.activity.coupon.getCouponCode, conf.baseApi.secret)],
    ['POST', '/api/wechat/activity/getQr', clientParams(), requestProcess(conf.baseApi.live.getQr, conf.baseApi.secret)],

    // 双十一活动
    ['POST', '/api/wechat/activity/getcourseList', clientParams(),appAuth(),wxAuth(), getCourseList],
    //  优惠码列表
    ['GET', '/api/wechat/activity/getCouponList', clientParams(), requestProcess(conf.baseApi.activity.coupon.getCouponList, conf.baseApi.secret)],
    //  单张的优惠码领取
    ['POST', '/api/wechat/activity/getCouponSingle', clientParams(), requestProcess(conf.baseApi.activity.coupon.getCouponCode, conf.baseApi.secret)],
    //  领取多张优惠码
    ['POST', '/api/wechat/activity/getCouponBatch', clientParams(), requestProcess(conf.baseApi.activity.coupon.getCouponCodeBatch, conf.baseApi.secret)],
    
    //  送书的地址
    ['GET', '/api/activity/lottery/address', clientParams(),appAuth(),wxAuth(), lotteryAddress],

    //冬季养生活动页
    ['POST', '/api/wechat/activity/winterHealth/agree', clientParams(),appAuth(),wxAuth(), agree],
    ['POST', '/api/wechat/activity/winterHealth/getCommentList', clientParams(),appAuth(),wxAuth(), getCommentList],
    ['POST', '/api/wechat/activity/winterHealth/postComment', clientParams(),appAuth(),wxAuth(), postComment],
    ['POST', '/api/wechat/activity/winterHealth/isTest', clientParams(),appAuth(),wxAuth(), isTest],
    ['POST', '/api/wechat/activity/winterHealth/getCoupon', clientParams(),appAuth(),wxAuth(), getWinterHealthCoupon],
    // 送书地址通用接口
    ['POST', '/api/activity/saveAddress', clientParams(),appAuth(),wxAuth(), requestProcess(conf.activityApi.address.saveAddress, conf.baseApi.secret)],
    ['POST', '/api/activity/addressInfo', clientParams(),appAuth(),wxAuth(), requestProcess(conf.activityApi.address.getAddressInfo, conf.baseApi.secret)],

    //排行榜
    ['POST', '/api/wechat/activity/rank/getRankTopicList', clientParams(), appAuth(), wxAuth(), getRankTopicList],

    ['POST', '/api/activity/giftAvailable', clientParams(),appAuth(),wxAuth(), requestProcess(conf.activityApi.gift.giftAvailable, conf.baseApi.secret)],
    ['POST', '/api/activity/choseGift', clientParams(),appAuth(),wxAuth(), requestProcess(conf.activityApi.gift.choseGift, conf.baseApi.secret)],
    ['POST', '/api/activity/giftCourseList', clientParams(),appAuth(),wxAuth(), requestProcess(conf.activityApi.gift.giftCourseList, conf.baseApi.secret)],
    ['POST', '/api/isBuyCourse', clientParams(),appAuth(),wxAuth(), requestProcess(conf.baseApi.isBuyCourse, conf.baseApi.secret)],
    ['POST', '/api/activity/configsByCode', clientParams(),appAuth(),wxAuth(), requestProcess(conf.activityApi.configsByCode, conf.baseApi.secret)],

    // 训练营参与人数
    ['GET', '/api/wechat/activity/campJoinNum', clientParams(), requestProcess(conf.baseApi.camp.campJoinNum, conf.wechatApi.secret)],
    ['GET', '/api/wechat/activity/shareCode', clientParams(), (req, res, next) => {
        req.rSession.shareCodeCount = req.rSession.shareCodeCount || 0
        req.rSession.shareCodeCount++
        if(req.rSession.shareCodeCount < 9) {
            next && next();
        } else {
            resProcessor.jsonp(req, res,{
                state: {
                    code: 0,
                    msg: '领取次数超过限制'
                },
            });
            return
        }
    }, requestProcess(conf.baseApi.camp.shareCode, conf.wechatApi.secret)],

    //获取榜单列表
    ['POST', '/api/wechat/activity/rankList', clientParams(), appAuth(),wxAuth(),requestProcess(conf.activityApi.annual.rankList, conf.activityApi.secret)],
    //保存口碑榜投票
    ['POST', '/api/wechat/activity/saveLike', clientParams(), appAuth(), wxAuth(), requestProcess(conf.baseApi.activity.annual.saveLike, conf.baseApi.secret)],
	// 获取活动配置
	['POST', '/api/wechat/activity/configs', clientParams(),appAuth(),wxAuth(), requestProcess(conf.activityApi.configs, conf.baseApi.secret)],
	['POST', '/api/wechat/activityInfo', clientParams(),appAuth(),wxAuth(), getActivityInfo],

    // 老用户邀新活动
    ['GET', '/api/wechat/activity/old-belt-new/getActiveTime', clientParams(), wxAuth(), getOldBeltNewTime],

    // 获取系列课购买配置
    ['POST', '/api/wechat/activity/channel/configs', clientParams(), wxAuth(), channelConfig],
];
