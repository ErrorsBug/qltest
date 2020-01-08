import lo from 'lodash';

var recommendApi = require('../../api/wechat/recommend');
var liveApi = require('../../api/wechat/live');
// actions
import {
    initCourseList,
    initBannerList,
    initCategoryList,
    changeCategory,
    initShowFlag,

    initIconList,
    initCapsuleIcon,
    // initMineNew,
    initPeriodCourseList,
    initPeriodCourseInfo,
    initPeriodShareCard,
    initPeriodTagSelect,
    initTwoLevelTag,
    initHotLives,

    updateArticleList,
    updateHotTags,
    updateHotTagCourse,
    showHotTagSection,
    setCourseOffset,

    //夜答
    initNightAnswerInfo,
    nightAnswerIfRequest,
    initIsEven,
    initIndexData,
} from '../../../site/wechat-react/other-pages/actions/recommend';
import { initCourseList as chargeInitCourseList } from '../../../site/wechat-react/other-pages/actions/charge-recommend';
import { initCourseList as freeInitCourseList } from '../../../site/wechat-react/other-pages/actions/free-recommend';
import { initCourseList as lowPriceInitCourseList } from '../../../site/wechat-react/other-pages/actions/low-price-recommend';

const StaticHtml = require('../../components/static-html').default;
const staticHtml = StaticHtml.getInstance();

const proxy = require('../../components/proxy/proxy');
const conf = require('../../conf');

export async function recommendHandle(req, res, store, options) {
    const state = store.getState();
    const userId = lo.get(req, 'rSession.user.userId','');
    const userTag = lo.get(req, 'query.twUserTag') || lo.get(req, 'rSession.user.userTag','default') || 'default';
    const lastNum = String(userId).split("")[userId.length -1];
    let flag = Number(lastNum) % 2 == 0 
    let {
        recommend: {
            courseOffset: offset,
            coursePageSize: pageSize,
            categoryId: tagId,
        }
    } = state;

    let params = {
        isMore: "N",
        tagId : 0,
        offset,
        pageSize,
        userId,
        userTag,
    };

    if (req.query.tagId) {
        params.tagId = req.query.tagId;
    }else{
        // 将该页面标记为静态化页面处理
        req.isStaticHtml = true;
        // 注入静态化页面的前缀
        req.staticHtmlPrefix = `recommend-${userTag}`;
        // 注入静态化页面的标识id
        req.staticHtmlId = params.tagId;
        // 注入静态化页面的过期时间5分钟
        req.staticHtmlExpires = 5 * 60;

        // 获取本次请求的静态化页面缓存
        const htmlText = await new Promise(function(resolve, reject){
            staticHtml.getHtmlCache(req.staticHtmlPrefix, req.staticHtmlId, (err, htmlText) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(htmlText)
                }
            });
        });
        if(htmlText){
            res.status(200).send(htmlText);
            return null;
        }

    }

    try {
        const result = await recommendApi.getRecommendCourseInitData(params, req);

        const courseList = lo.get(result, 'courseList.data.dataList', []) || [];
        // 修正courseList数据
        courseList.forEach(function (item) {
            if (item.type === 'topic') {
                item.chargeType = item.businessType;
                item.businessType = 'topic';
            } else if (item.type === 'channel') {
                item.businessType = 'channel';
            }
        });

        if (req.query.tagId) {
            let categorys = lo.get(result, 'categoryList.data.dataList') || [];
            let isTagIdOk = false;

            categorys.map((item) => {
                if (('' + item.id) === ('' + req.query.tagId)) {
                    isTagIdOk = true;
                }
            });

            if (isTagIdOk) {
                store.dispatch(changeCategory(req.query.tagId));
            }
        }

        store.dispatch(initIndexData(lo.get(result, 'initData.data.regions', []) || []));
        store.dispatch(initIsEven(flag));
        store.dispatch(initCourseList(params.tagId, lo.get(result, 'courseList.data.dataList', [])));
        store.dispatch(setCourseOffset(offset + lo.get(result, 'courseList.data.dataList', []).length));
        store.dispatch(initBannerList(lo.get(result, 'banners.data.banners', [])));
        store.dispatch(initCategoryList(lo.get(result, 'categoryList.data.dataList', [])));
        store.dispatch(initShowFlag(lo.get(result, 'showFlag.data', {})));
        // store.dispatch(initMineNew(lo.get(result, 'isMineNew.data', {})));
        // store.dispatch(initHotLives(lo.get(result, 'hotLives.data.lives', {})));

        store.dispatch(initIconList(lo.get(result, 'iconList.data.zoneList', []) || []));
        store.dispatch(initCapsuleIcon(lo.get(result, 'iconList.data.capsuleIcon', {}) || {}));


    } catch(err) {
        console.error(err);
    }

    return store;
};

export async function chargeRecommendHandle(req, res, store) {
    const state = store.getState();
    let {
        chargeRecommend: {
            coursePageNum: page,
            coursePageSize: size
        }
    } = state;

    let params = {
        page: {
            page: page,
            size: size
        }
    };

    try {
        var result = await recommendApi.getChargeRecommendCourseList(params, req);

        store.dispatch(chargeInitCourseList(lo.get(result, 'courseList.data.dataList', [])));

    } catch(err) {
        console.error(err);
    }

    return store;
};

export async function freeRecommendHandle(req, res, store) {
    const state = store.getState();

    var menuParams = {
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'free'
    };
    var allTags;

    let {
        freeRecommend: {
            coursePageNum: page,
            coursePageSize: size
        }
    } = state;
    let courseParams = {
        page: {
            page: page,
            size: size
        }
    };

    try {
        // var result = await recommendApi.getFreeRecommendCourseList(params);
        // store.dispatch(freeInitCourseList(lo.get(result, 'courseList.data.dataList', [])));
        let tagResult = await recommendApi.initTwoLevelTag(menuParams, req),
            courseResult;
        allTags = lo.get(tagResult, 'initTwoLevelTag.data.dataList', []);
        store.dispatch(initTwoLevelTag(allTags));

        if (req.query.tagId) {
            courseParams.tagId = req.query.tagId;
        } else {
            allTags.some((item, index) => {
                if (item.parentId == 0) {
                    //获取数组中第一个大分类的id
                    courseParams.tagId = item.id;

                    return true;
                }
            });
        }

        courseResult = await recommendApi.getFreeRecommendCourseList(courseParams, req);

        store.dispatch(freeInitCourseList(lo.get(courseResult, 'courseList.data.dataList', [])));

    } catch(err) {
        console.error(err);
    }

    return store;
};

export async function lowPriceRecommendHandle(req, res, store) {
    const state = store.getState();
    var menuParams = {
        userId: lo.get(req, 'rSession.user.userId'),
        type: 'low'
    };
    var allTags;

    let {
        lowPriceRecommend: {
            coursePageNum: page,
            coursePageSize: size
        }
    } = state;
    let courseParams = {
        page: {
            page: page,
            size: size
        }
    };

    try {
        let tagResult = await recommendApi.initTwoLevelTag(menuParams, req),
            courseResult;
        allTags = lo.get(tagResult, 'initTwoLevelTag.data.dataList', []);
        store.dispatch(initTwoLevelTag(allTags));

        if (req.query.tagId) {
            courseParams.tagId = req.query.tagId;
        } else {
            allTags.some((item, index) => {
                if (item.parentId == 0) {
                    //获取数组中第一个大分类的id
                    courseParams.tagId = item.id;

                    return true;
                }
            });
        }

        courseResult = await recommendApi.getLowPriceRecommendCourseList(courseParams, req);
        store.dispatch(lowPriceInitCourseList(lo.get(courseResult, 'courseList.data.dataList', [])));

    } catch(err) {
        console.error(err);
    }

    return store;
};

export async function periodCourseHandle(req, res, store) {
    let params = {
        inviteKey:req.query.inviteKey||"",
        userId:lo.get(req, 'rSession.user.userId'),
    };

    const tdcode = req.query.tdcode;
    if (params.userId == tdcode) {
        params.tdcode = tdcode;
    }

    let redirectUrl='';
    try {
        var result = await recommendApi.checkPeriodQrTo(params, req);
        if(result.showFlag&&result.showFlag.data&&result.showFlag.data.isOrder == "Y"){
            params.periodId= 0;
            try {
                var result = await recommendApi.getPeriodCourseInitData(params, req);
                store.dispatch(initPeriodCourseList(lo.get(result, 'initPeriodCourse.data', {})));
                let infoData = lo.get(result, 'periodCourseInfo.data', {});
                infoData.canceledCustom = !!params.tdcode;
                store.dispatch(initPeriodCourseInfo(infoData));
            } catch(err) {
                console.error(err);
            }
        }else{
            params.inviteKey!=""?
            (
                req.query.kfAppId&&req.query.kfOpenId?
                redirectUrl='/wechat/page/subscribe-custom-made?inviteKey='+ params.inviteKey+"&kfAppId="+req.query.kfAppId+"&kfOpenId="+req.query.kfOpenId
                :
                redirectUrl='/wechat/page/subscribe-custom-made?inviteKey='+ params.inviteKey
            )
            :
            (
                req.query.kfAppId&&req.query.kfOpenId?
                redirectUrl='/wechat/page/subscribe-custom-made?kfAppId='+req.query.kfAppId+"&kfOpenId="+req.query.kfOpenId
                :
                redirectUrl='/wechat/page/subscribe-custom-made'
            );

            res.redirect(redirectUrl);
            return false;
        }


    } catch(err) {
        console.error(err);
    }



    return store;
};



export async function periodCardHandle(req, res, store) {
    let params = {
        inviteKey:req.query.inviteKey||"",
    };
    try {
        var result = await recommendApi.initPeriodShareCard(params, req);
        store.dispatch(initPeriodShareCard(lo.get(result, 'periodInviteCard.data', {})));
    } catch(err) {
        console.error(err);
    }

    return store;
};

export async function periodTabSelectHandle(req, res, store) {
    let params = {
        periodId: 0,
        userId:lo.get(req, 'rSession.user.userId'),
    };
    try {
        var result = await recommendApi.initPeriodTabSelectData(params, req);
        store.dispatch(initPeriodTagSelect(lo.get(result, 'allPeriodTag.data.dataList', []),lo.get(result, 'myPeriodTag.data.dataList', []),lo.get(result, 'getSubscribeStatus.data.status', [])));
    } catch(err) {
        console.error(err);
    }

    return store;
};


export async function channelHandle(req, res, store) {
    return store;
};

// 直播间管理页
export async function userManagerHandle(req, res, store) {
    let params = {
        userId: lo.get(req, 'rSession.user.userId', ''),
        liveId: lo.get(req, 'params.liveId', ''),
    };
    if(/\.htm|\.html/gi.test(params.liveId)) {
        params.liveId = params.liveId.replace(/\.htm|\.html/gi, '')
    }
    let roleRes = await liveApi.getLiveRole(params, req)
    let role = lo.get(roleRes, 'data.role', '')
    if(role == 'creater' || role == 'manager') {
        return store;
    } else {
        res.render('404')
        return false
    }
};

// 回收站页
export async function recycleHandle(req, res, store) {
    let params = {
        userId: lo.get(req, 'rSession.user.userId', ''),
        liveId: lo.get(req, 'query.liveId', ''),
    };
    let roleRes = await liveApi.getLiveRole(params, req)
    let role = lo.get(roleRes, 'data.role', '')
    if(role == 'creater' || role == 'manager') {
        return store;
    } else {
        res.render('404')
        return false
    }


};