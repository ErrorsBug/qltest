var path = require('path'),
    _ = require('underscore'),
    async = require('async'),


    wxAuth = require('../../middleware/auth/1.0.0/wx-auth'),
    appAuth = require('../../middleware/auth/1.0.0/app-auth'),
    clientParams = require('../../middleware/client-params/client-params'),

    proxy = require('../../components/proxy/proxy'),
    resProcessor = require('../../components/res-processor/res-processor'),
    htmlProcessor = require('../../components/html-processor/html-processor'),
    conf = require('../../conf'),
    lo = require('lodash');

/**
 * 系列课主页
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function pageChannelIndex (req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/channel-index/channel-index.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
        };

    var channelId = req.params.channelId;

    var params = {
        channelId: channelId,
    };

    var tasks = [
        ['channelInfo', conf.wechatApi.channel.info, params, conf.wechatApi.secret],
    ];

    proxy.parallelPromise(tasks, req);

    htmlProcessor(req, res, next, options)
}

function pageLiveIntro(req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/live-intro/live-intro.html'),
        options = {
            filePath: filePath,
            fileVars: {},
            renderData: {

            },
        };


    htmlProcessor(req, res, next, options)
}

function pageChannelGift (req, res, next) {
        var filePath = path.resolve(__dirname, '../../../public/wechat/page/channel-gift-detail/channel-gift-detail.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
        };
    var userData = req.rSession.user;
    // var channelId = req.params.channelId;
     options.fillVars.USER_ID = userData.userId;
    var giftId=req.params.giftId;
    var params = {
        giftId: giftId,
        userId: userData.userId,
    };


    var tasks = [
        ['channelGift', conf.wechatApi.channel.giftDetail, params, conf.wechatApi.secret],
        ['channelGiftList', conf.wechatApi.channel.giftList, params, conf.wechatApi.secret],
    ];


    proxy.parallelPromise(tasks, req)
    .then(function (result) {
        // options.fillVars.LIVE_ID = result.channelInfo.data.channel.liveId;
        // options.fillVars.CHANNEL = result.channelInfo.data.channel;
        options.fillVars.GIFT_DETAIL = lo.get(result, 'channelGift.data'); 
        options.fillVars.GIFT_LIST = lo.get(result, 'channelGiftList.data.acceptList');

        var channelId=lo.get(result, 'channelGift.data.channelId');

        getOther(channelId, function(result) {
            options.fillVars.CHANNEL = lo.get(result, 'channelInfo.data.channel');
            htmlProcessor(req, res, next, options)
        });


    }).catch(function (err) {
        console.error(err);
    });

    function getOther(channelId, callback) {
        // 如果登入
        if (userData && userData.userId) {
            params.userId = userData.userId;
            params.channelId= channelId;
            tasks = [
                ['channelInfo', conf.wechatApi.channel.info, params, conf.wechatApi.secret],
            ];
            proxy.parallelPromise(tasks, req)
            .then(function (result) {
                if(typeof callback=='function') {
                    callback(result);
                };
            }).catch(function (err) {
                console.error(err);
            });
        }else{
            if(typeof callback=='function') {
                callback(result);
            };
        }
    };
};

function pageChannelGiftSend (req, res, next) {
        var filePath = path.resolve(__dirname, '../../../public/wechat/page/channel-gift-send/channel-gift-send.html'),
        options = {
            filePath: filePath,
            fillVars: {

            },
        };
    var userData = req.rSession.user;
    var giftRecordId=req.params.giftRecordId;
    var giftid=req.params.giftId;
    var params = {
        type:'channel',
        userId: userData.userId,
    };
    
    if(giftid!=null) {// 获取群发的赠礼
        params.giftId=giftid;
        options.fillVars.SHARE_LINK='/wechat/page/channel/giftGroupget/'+ giftid;
    } else {
        params.giftRecordId=giftRecordId;
        options.fillVars.SHARE_LINK = '/wechat/page/channel/giftget/' + giftRecordId;
        
    }

    var tasks = [
        ['channelGiftDetail', conf.wechatApi.channel.giftDetail, params, conf.wechatApi.secret],
    ];

    proxy.parallelPromise(tasks, req)
        .then(function (result) {

                var giftId=lo.get(result, 'channelGiftDetail.data.giftId');
                var channelId=lo.get(result, 'channelGiftDetail.data.channelId');

               getinfo(giftId, channelId, function(iResult) {
                   options.fillVars.GIFT = lo.get(iResult, 'channelGift.data');
                    options.fillVars.CHANNEL = iResult.channelInfo.data.channel;
                    options.fillVars.USERINFO = iResult.userInfo.data.user;
                    htmlProcessor(req, res, next, options)
                });
        }).catch(function (err) {
            console.error(err);
        });


    function getinfo(giftId, channelId, callback) {
        params.giftId= giftId;
        params.channelId= channelId;
        tasks = [
            ['channelGift', conf.wechatApi.channel.giftDetail, params, conf.wechatApi.secret],
            ['channelInfo', conf.wechatApi.channel.info, params, conf.wechatApi.secret],
            ['userInfo', conf.wechatApi.user.info, params, conf.wechatApi.secret],
        ];
        proxy.parallelPromise(tasks, req)
        .then(function (result) {
            console.log(result);
            if(typeof callback=='function') {
                    callback(result);
                };
        }).catch(function (err) {
            console.error(err);
        });
    };
};

async function pageChannelGiftGet (req, res, next) {
    var filePath = path.resolve(__dirname, '../../../public/wechat/page/channel-gift-get/channel-gift-get.html'),
    options = {
        filePath: filePath,
        fillVars: {

        },
    };

    var userData = req.rSession.user;
    options.fillVars.USER_ID = userData.userId;
    var giftRecordId=req.params.giftRecordId;
    var giftId=req.params.giftId;
    var useByMe=req.query.useByMe;
    var params = {
        giftRecordId: giftRecordId,
        userId: userData.userId,
        giftId: giftId
    };

    let giftDetail; //赠礼详情
    try {
        //首先请求系列课详情接口获得是否是自己进来的判断
        giftDetail = await proxy.apiProxyPromise(conf.wechatApi.channel.giftDetail, params,  conf.wechatApi.secret, req);
        if (!useByMe && giftDetail.data.buynerId === userData.userId) {
            res.redirect('/wechat/page/channel/gift/' + giftDetail.data.giftId);
            return 
        }
    } catch (e) {
        console.error(e)
    }

    var tasks = [
        ['channelGiftGet', conf.wechatApi.channel.giftget, params, conf.wechatApi.secret],
        // ['channelGift', conf.wechatApi.channel.giftDetail, params, conf.wechatApi.secret],
    ];
    if(giftId!=null) {// 获取群发的赠礼
        params.giftId=giftId;
        tasks = [
            ['channelGiftGet', conf.wechatApi.channel.giftGroupGet, params, conf.wechatApi.secret],
        ];
    };


    proxy.parallelPromise(tasks, req)
    .then(function (result) {
        giftDetail.data.remaindNum -= 1; //请求成功就将原来的剩余份数减一；
        options.fillVars.GIFT_GET = lo.get(result, 'channelGiftGet.data') || {};

        var giftId=lo.get(result, 'channelGiftGet.data.giftId');
        var channelId=lo.get(result, 'channelGiftGet.data.channelId');

        if (!giftId) {
            res.render('500');
            return;
        }

        getGiftFunc(giftId, channelId)
            .then(function(result) {

                options.fillVars.GIFT_DETAIL = giftDetail.data;
                options.fillVars.GIFT_LIST = lo.get(result, 'channelGiftList.data.acceptList');
                options.fillVars.CHANNEL = lo.get(result, 'channelInfo.data.channel');
                isIntoFunc(options.fillVars.CHANNEL, options.fillVars.GIFT_GET.getResultCode, () => {
                    htmlProcessor(req, res, next, options);
                });
            })
            .catch(function (err) {
                console.error(err);
                res.render('500');
            });

        function isIntoFunc (channel, getResultCode, callback) {
            var notGet=false;
            switch(getResultCode) {
                case 'manager':notGet=true; break;
                case 'VipUser':notGet=true; break;
                case 'alreadyBuy':
                    if(channel.chargeType=='absolutely') {
                        notGet=true;
                    };break;

            // selfDo:发起者本人领取； overTime:超时；giftEmpty:已被领取完；alreadyGetGift：该用户领取过该礼品； getByOthers:该礼品（该记录）已被他人领取;success：领取成功
            // manager：管理员不能领取；VipUser：vip不能领取；alreadyBuy：该用户购买过该系列课（固定收费）
            }
            if(notGet) {
                // window.location.href = '/live/channel/channelPage/'+channel.channelId+'.htm';
                res.redirect('/live/channel/channelPage/'+channel.channelId+'.htm');
            }else if(typeof callback==='function') {
                callback();
            };
        }

        function getGiftFunc (giftId, channelId) {
            params.giftId= giftId;
            params.channelId= channelId;
            tasks = [
                // ['channelGift', conf.wechatApi.channel.giftDetail, params, conf.wechatApi.secret],
                ['channelGiftList', conf.wechatApi.channel.giftList, params, conf.wechatApi.secret],
                ['channelInfo', conf.wechatApi.channel.info, params, conf.wechatApi.secret],
            ];
            return proxy.parallelPromise(tasks, req);
        };
    });


};


module.exports = [
    // 直播间主页
    // ['GET', '/wechat/page/channel/index', pageChannelIndex],
    // ['GET', '/live/channel/channelPage/:channelId.htm', pageChannelIndex],
    // 话题介绍页
    // ['GET', '/wechat/page/live/intro', pageLiveIntro],
    // 赠礼
    ['GET', '/wechat/page/channel/gift/:giftId', clientParams(), wxAuth(), appAuth(), pageChannelGift],
    // 单发
    ['GET', '/wechat/page/channel/giftsend/:giftRecordId', clientParams(), wxAuth(), appAuth(), pageChannelGiftSend],
    ['GET', '/wechat/page/channel/giftget/:giftRecordId', clientParams(), wxAuth(), appAuth(), pageChannelGiftGet],
    // 群发
    ['GET', '/wechat/page/channel/giftGroupsend/:giftId', clientParams(), wxAuth(), appAuth(), pageChannelGiftSend],
    ['GET', '/wechat/page/channel/giftGroupget/:giftId', clientParams(), wxAuth(), appAuth(), pageChannelGiftGet],
]
