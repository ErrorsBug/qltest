import lo from 'lodash';

var timelineApi = require('../../api/wechat/timeline');

// actions
import {
    INIT_TIMELINE_LIST,
    INIT_LIVE_LIST,

    INIT_NEW_LIKE_NUM,
    INIT_NEW_LIKE_LIST,
    LIKE_ACTION,

    INIT_TIMELINE_CHANCE,
    INIT_CHOOSE_TIMELINE_TYPE,

    CREATE_TIMELINE,
    DELETE_TIMELINE,


    initLiveList,
    initCurrentLive,
    initChooseTimelineTypes,
    initPower,
    initTimelineList,
    initNewLikeNum,
} from '../../../site/wechat-react/other-pages/actions/timeline'

export async function timelineHandle(req, res, store) {
    const state = store.getState();

    var userId = lo.get(req, 'rSession.user.userId');
    var currentLive = await timelineApi.getMyLive({userId}, req)
    var liveList = await timelineApi.getLiveList({userId, page: {page: 1, size: 30}}, req);


    var myAdminLives = lo.get(currentLive, 'myLive.data.entityPo')
    var myFocusLives = lo.get(liveList, 'focusLiveList.data.liveEntityPos')
    var myCurrentLiveId = lo.get(currentLive, 'myLive.data.entityPo.id')

    var power = await timelineApi.getPower({
        liveId: myCurrentLiveId,
        userId: userId,
    }, req)

    power = lo.get(power, "power.data.powerEntity")

    var timelineList = await timelineApi.getTimelineList({
        beforeOrAfter: "before",
        page: {
            size: 20,
            page: 1
        },
        time: 0,
        userId: userId
    }, req)

    if (power && power.allowMGLive) {
        var timelineTypes = await timelineApi.getTimelineTypes({
            page: {
                page: 1,
                size: 20
            },
            userId: userId,
            liveId: myCurrentLiveId,
        }, req);
        var homeworkList = lo.get(timelineTypes, 'homeworkList.data.list')
        var topicList = lo.get(timelineTypes, 'topicList.data.topicList')
        var channelList = lo.get(timelineTypes, 'channelList.data.courseList')

        var newLikeNumData = await timelineApi.getNewLikeNum({
            liveId: myCurrentLiveId,
            userId: userId,
        }, req)

        var newLikeNum = lo.get(newLikeNumData, 'newLikeNum.data.likeNum')

        store.dispatch(initNewLikeNum({newLikeNum}));
        store.dispatch(initChooseTimelineTypes({ homeworkList, topicList, channelList }));
    }


    store.dispatch(initPower({power}))
    store.dispatch(initTimelineList({timelineList: lo.get(timelineList, 'timeline.data.list')}))
    store.dispatch(initLiveList({myAdminLives: [myAdminLives], myFocusLives}));
    store.dispatch(initCurrentLive({myCurrentLiveId, userId}));

    return store;
};
