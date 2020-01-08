module.exports = {
    // API地址配置
    api: {
        listNewsTopicsByTagId: '/api/app/live/list-news-topic-by-tagid',
        listHistTopicByTagId: '/api/app/live/list-hist-topic-by-tagid',
        listHotTopic: '/api/app/live/list-hot-topic',
        listNewestTopic: '/api/app/live/list-newest-topic',
        listHotLive: '/api/app/live/list-hot-live',
        listNewestLive: '/api/app/live/list-newest-live',
        liveFocus: '/api/app/live/focus',
        liveRedirect: '/api/app/live/redirect',
        getExploreSpeciesList: '/api/app/explore/getSpeciesList',
        getExploreLiveList: '/api/app/explore/getLiveList',
        getExploreList: '/api/app/explore/getExploreList',
        getRankTopicList: '/api/app/explore/getRankTopicList',
        doAttention: '/api/app/live/doAttention',

        themeList: '/api/app/theme/list',
        themeListHotEntity: '/api/app/theme/list-hot-entity',
        themeListNewestTopic: '/api/app/theme/list-newest-topic',

        recommendChargeCourseList: '/api/app/recommend/charge/course-list',
         /* 搜索相关api*/
        searchTopic: '/api/app/search/topic',
        searchChannel: '/api/app/search/channel',
        searchLive: '/api/app/search/live',
        searchAll: '/api/app/search/all',
    },

    // ajax设置
    ajaxSetting: {
        timeout: 30 * 1000,
    },
};
