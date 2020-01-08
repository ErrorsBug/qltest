var deepcopy = require('deepcopy');

var config = {
    baseApi: {
        getWxAppId: '/h5/weixin/getAppId',
        getWxAppIdByDomain: '/h5/weixin/getAppIdByDomain',
        createKnowledgeState: '/h5/weixin/createKnowledgeState',
        isLiveAdmin: '/h5/live/admin/isLiveAdmin',
        knowledgeCodeAuth: '/h5/weixin/knowledgeCodeAuth',
        bindAndGetUserInfo: '/h5/weixin/bindAndGetUserInfo',
        livePrice: '/h5/selfmedia/get-price',
        // 获取直播间等级
        liveLevel: '/h5/live/get-live-level',
        myManageLive: '/h5/agent/myManageLive',
        /* 直播间认证相关*/
        getAuthInfo: '/h5/live/liveAuth',
        getLiveTag: '/h5/tag/allSecondTags',
        saveAuthInfo: '/h5/live/saveLiveAuth',
        sendValidCode: '/h5/validCode/send',
        checkValidCode: '/h5/validCode/check',

        saveProfile: '/h5/live/saveProfiles',
        searchTopic: '/h5/live/topic/search',
        searchLive: '/h5/live/entity/search',
        searchChannel: '/h5/live/channel/search',
        browe: '/h5/topic/browe',
        pageUv: '/h5/live/stat/pageUv',
        shareCardBgList: '/h5/share/getShareCardList',
        customShareBgImg:'/h5/share/getCustomShareBgImg',
        setCustomShareBgImg: '/h5/share/setCustomShareBgImg',
        delCustomShareBgImg: '/h5/share/delCustomShareBgImg',
        isKickOut: '/h5/user/isKickOut',
        createAuthState: '/h5/user/createState',
        getSimpleChannel: '/h5/channel/getSimple',
        getSimpleTopic: '/h5/topic/getSimple',
        auditState: '/h5/common/checkWeApp',
        isBuyCourse: '/h5/activity/seriesclass/isBuyChannel',
        saveGift: '/h5/activity/saveGift',

        vipPurchaseRecord:'/h5/vip/getPurchaseRecord',
        feedbackInfo: '/h5/weapp/saveFeedback',
        getCousePayPaster: '/h5/pay/getCousePayPaster',
        //一级代理代理商公对公打款
        ptpApply: '/h5/agent/ptpApply',

        //是否官方直播间
        isQlLive: '/h5/live/isQlLive',
        getDomainUrl:'/h5/domain/getActivityDomainUrl',
        // 知识通商城课程上架数量
        knowledgeCourseInfo: '/h5/selfMedia/publish/knowledgeCourseInfo',
        getLiveTagOfficialLiveId: '/h5/tag/getLiveTagOfficialLiveId',
        getOfficialLiveId: '/h5/live/getOfficialLiveId',
        // 话题详情页底部判断是否需要弹出引导关注二维码
        checkNeedShowQr: '/h5/topic/checkNeedShowQr',

        // 获取优惠券列表
        getCenterCourse: '/h5/coupon/centerCourse',
        // 获取显示在介绍页的优惠码(新)
        getQueryCouponForIntro: '/h5/coupon/queryCouponForIntro',
        // 新功能白名单
        isFunctionWhite: '/h5/live/isFunctionWhite',
        search: {
            topic: '/h5/live/topic/search',
            channel: '/h5/live/channel/search',
            live:'/h5/live/entity/search',
            hot: '/h5/live/center/search-word',
            course: '/h5/live/center/search',
        },

        authCount:{
            topic:'/h5/topic/authCount',
            channel:'/h5/channel/authCount',
            vip:'/h5/vip/authCount',
            customVip:'/h5/custom/vip/authCount',
        },
        authList:{
            topic:'/h5/topic/authList',
            channel:'/h5/channel/authList',
            vip:'/h5/vip/authList',
        },
        explore: {
            getRecommend: '/h5/live/center/recommend-topics',
            getBannerByTagId: '/h5/live/center/banners',
            getLiveByTagId: '/h5/live/center/hot-lives',
            getChannelByTagId: '/h5/live/center/hot-channels',
        },
        nightAnswer: {
            getTopicList: '/h5/nightchat/topicList',
            getTopicInfo: '/h5/nightchat/topicInfo',
            getAnswerList: '/h5/nightchat/answerList',
            getDiscussList: '/h5/nightchat/discussList',
            addDiscuss: '/h5/nightchat/addDiscuss',
            like: '/h5/nightchat/like',
        },
        rank: {
            getTopicRank: '/h5/live/center/hot-topics',
        },
        topicRank: {
            getTopicRank: '/h5/rankCourse/list',
            getPeriod: '/h5/rankCourse/period',
        },
        editor: {
            upload: '/h5/ueditor/ueditorUpload'
        },
        subscribe: '/h5/live/subscribe',
        guestSeparate:{
            // getGuestInfo: '/h5/guest/getGuestInfo',
            getAssignedPercent: '/h5/guest/getAssignedPercent',
            sumShareMoney:'/h5/guest/sumShareMoney',
            getGuestProfitList:'/h5/guest/getGuestProfitList',
            getTransferList: '/h5/guest/getTransferList',
            countProfitRecord: '/h5/guest/countProfitRecord',
            counTransferRecord: '/h5/guest/counTransferRecord',
            stopShare:'/h5/guest/stopShare',
            updatePercent:'/h5/guest/updateSharePercent',
            updateExpiryTime:'/h5/guest/updateExpiryTime',
            getGuestBalance:'/h5/guest/getGuestBalance',
            clearing:'/h5/guest/transferToGuest',
            acceptInvitation: '/h5/guest/acceptInvite',
	        channelList: '/h5/guest/getChannelData',
            topicList:'/h5/guest/getTopicData',
	        channelAddedSeparateList: '/h5/guest/getGuestData',
	        addSeparate: '/h5/guest/saveGuestInfo',
	        getInvitationInfo: '/h5/guest/getGuestInfo',
	        getChannelGuestData:'/h5/guest/getChannelGuestDetailData',
	        deleteEmptyGuest: '/h5/guest/deleteEmptyInvite',
            cacheAcceptShare:'/h5/guest/cacheAcceptShare',
            cacheUpdateSharePercent:'/h5/guest/cacheUpdateSharePercent',
            getPercentPleaseStatus:'/h5/guest/getUpdatePercentCacheStatus',
            updateIsAutoTransfer:'/h5/guest/updateIsAutoTransfer',
            isExistAuditRecord: '/h5/guest/isExistAuditRecord',
            campList:'/h5/guest/getCampData',
        },
        themeList: '/h5/theme/list',
        themeListHotEntity: '/h5/theme/listHotEntity',
        themeListNewestTopic: '/h5/theme/listNewestTopic',
        liveFocus: '/h5/live/focus',
        isLiveFocus: '/h5/live/isFollow',
        //用户绑定三方平台
        userBindKaiFang:'/h5/user/userBindKaiFang',
        user: {
            info: '/h5/user/get',
            power: '/h5/user/power',
            live_role: '/h5/user/live-role',
            topic_role: '/h5/user/topic-role',
            isSubscribe: '/h5/user/isSubscribe',
            getCreateLiveStatus: '/h5/user/getCreateLiveStatus',
            // 根据业务类型获取公号id
            getAppIdByType: "/h5/live/getAppIdByType",
            isSubscribeAppId: "/h5/user/isSubscribeAppId",
        },
        profit: {
            // 收益统计
            total: '/h5/profitRecord/liveTotalReward',
            // 直播间收益列表
            records: '/h5/profitRecord/liveProfitDetail',
            // 收益列表
            record: {
                channel: '/h5/profitRecord/liveChannelReward',
                topic: '/h5/profitRecord/liveTopicReward',
            },
            // 收益详情
            detail: {
                channel: '/h5/profitRecord/liveChannelRewardDetail',
            },
            withdraw: '/h5/pay/liveWithdraw',
            limitMoney: '/h5/live/getLimitMoney',
            //转载收益明细，知识通系列课列表
            knowledgeProfitList: '/h5/selfmedia/knowledgeProfitList',
            channelDetail: '/h5/selfmedia/channelDetail',
            mediaProfitRecords: '/h5/selfmedia/buyList',
            isHaveMediaProfit: '/h5/profitRecord/isHaveLiveMediaPut',
            updateDisplayStatus: '/h5/profitRecord/updateDisplayStatus',
        },
        live: {
            // 直播间是否配置三方导粉公众号
            getOpsAppIdSwitchConf: '/h5/live/getOpsAppIdSwitchConf',
            // 三方导粉弹码间隔时间
            getOpsAppIdSwitchTimeStep: '/h5/live/getOpsAppIdSwitchTimeStep',
            vipChargeInfo:'/h5/vip/getVipInfo',
            create: '/h5/live/create',
            listNewsTopicsByTagId: '/h5/live/center/list-news-topic-by-tagId',
            listHistTopicByTagId: '/h5/live/center/list-hist-topic-by-tagId',
            listBanner: '/h5/live/center/banners',
            liveRedirect: '/h5/live/center/redirect',
            //获取分类
            typeList: '/h5/channel/getChannelTags',
            // 添加分类
            addOrEditChannelTag: '/h5/channel/addOrEditChannelTag',
            get: '/h5/live/get',
            role: '/h5/user/liveRole',
            profile: '/h5/live/profileList',
            consultList: '/h5/consult/topicList',
            consultMList: '/h5/consult/consultList',
            consultBest: '/h5/consult/perfect',
            consultReply: '/h5/consult/reply',
            getQr: '/h5/live/getQr',
            getTopicQr: '/h5/topic/getTopicQr',
            isFollow: '/h5/live/isFollow',
            banned: '/h5/live/banned',
            shareCardData: '/h5/share/getLiveShareCardData',
            checkRealName:'/h5/live/identityStatus',
            checkUser:'/h5/identity/checkUser',
            getRealNameInfo:'/h5/live/getIdentity',
            getVerifyInfo: '/h5/identity/getUser',
            saveRealName:'/h5/live/saveIdentity',
            saveUser: '/h5/identity/saveUser',
            getLiveSymbol:'/h5/live/getSymbol',
            my: '/h5/live/myLiveEntity',
            black:'/h5/live/addBlack',
            saveBanner: '/h5/liveBanner/save',
            batchSaveBanner: '/h5/liveBanner/batchAdd',
            getBannerList: '/h5/liveBanner/list',
            getEnterprise: '/h5/identity/getEnterprise',
            checkEnterprise: '/h5/identity/checkEnterprise',
            center:{
                popup: '/h5/live/center/popup',
            },
            authorities:'/h5/live/getQlLiveIds',
            getChannelNumAndTopicNum: '/h5/live/getChannelNumAndTopicNum',
            getTopic: '/h5/live/getTopics',
            getChannel: '/h5/channel/getChannels',
            whispers: '/h5/live/whispers',
            purchaseCourse: '/h5/live/purchaseCourse',
            planCourse: '/h5/topic/plan',
            liveIntro: '/h5/live/profileList',
            alert: '/h5/live/updateAlert',
            followNum: '/h5/live/getFollowerNum',
            mvToChannel: '/h5/channel/mvToChannel',
            moveChannelIntoTag: '/h5/channel/moveChannelIntoTag',
            isBlackList: '/h5/live/isBlackList',
            whiteNewLive: '/h5/live/getWhiteForNewLiveIndex',
            pushNum: '/h5/live/getPushNum',
            changeChannelList: '/h5/channel/changeChannelList',
            funcMenuShow: '/h5/live/funcMenuShow',
            funsBusiList: '/h5/live/getExtendFansBusiList',
            funsDetail: '/h5/live/getExtendFansDetail',

            createLiveCoupon: '/h5/universal/insert',
            deleteLiveCoupon: '/h5/universal/deleteUniversalCoupon',
            liveCouponList: '/h5/universal/queryTeacherCouponList',
            liveCouponDetail: '/h5/universal/queryCouponDetail',
            liveCouponApplyList: '/h5/universal/queryCouponUseList',
            isBindLiveCoupon: '/h5/universal/isOrNotBind',
            bindLiveCoupon: '/h5/universal/bindUniversalCoupon',
            vipKick: '/h5/vip/updateKickOut',
            getGuideQrSetting: '/h5/live/getGuideQrSetting',
            isOrNotListen: '/h5/selfmedia/isOrNotListenChannel',
            getListWithoutQlUser: '/h5/shareEarning/getListWithoutQlUser',
            isServiceWhiteLive: '/h5/live/isServiceWhiteLive',
            isliveCenterExist: '/h5/live/center/exist',
            isResetAppGuideRule: '/h5/live/center/isResetAppGuideRule',
            getQlLiveIds: '/h5/live/getQlLiveIds',
            // 新增系列课
            addOrUpdateChannel: '/h5/channel/addOrUpdateChannel',
            getGuestYouLike: '/h5/live/center/favoriteCourse',
            // 获取直播间中间页课程用于导粉
            getLiveMiddlepageCourse: '/h5/live/getLiveMiddlepageCourse',
            // 直播间今日推荐
            todayRecommend: '/h5/live/todayRecommend',
            getVipInfo: '/h5/vip/getVipInfo',
            updateVipStatus: '/h5/vip/updateStatus',
            saveVipCharge: '/h5/vip/saveCharge',
            // 每天学接口
            learnEveryday: {
                getUserLearnInfo: '/h5/live/push/getUserLearnInfo',
                getPushCourseInfo: '/h5/live/push/getPushCourseInfo',
                addPush: '/h5/live/push/addPush',
                getUserFocusInfo: '/h5/live/push/getUserFocusInfo'
            },
            simulateChatGroup: '/h5/simulateChatGroup/getInfo',
            // 数据统计相关
            getLiveData: '/h5/dataStat/getLiveData',
            getAllStatTopicList: '/h5/dataStat/getAllStatTopicList',
            getAllStatChannelList: '/h5/dataStat/getAllStatChannelList',
            getChannelOrTopicOptimize: '/h5/dataStat/getChannelOrTopicOptimize',
            setOptimize: '/h5/dataStat/setOptimize',
            getCourseIndexStatus: '/h5/dataStat/getCourseIndexStatus',
            // 发送直播间邀请
            sendInvite:'/h5/live/mgrInvite',
            // 接受直播间邀请
            getInvite: '/h5/live/mgrGet',
            getAppIdByType: '/h5/live/getAppIdByType',
            getActivityAppId: '/h5/domain/getActivityAppId',
            getCourseTag: '/h5/courseTag/get',
        },
        channel: {
            sceneInfo: '/h5/weapp/sceneInfo',
            isShare: '/h5/share/isShare',
            getweappQr: '/h5/weapp/getWeappQr',
            getChannelIntro: '/h5/channel/getDesc',
            saveChannelIntro: '/h5/channel/saveDesc',
            sortList: '/h5/channel/getChannelForSort',
            sortTopicList: '/h5/channel/getTopicForSort',
            doSetChannelSort: '/h5/channel/saveChannelSort',
            doSetTopicSort: '/h5/channel/saveTopicSort',
            info: '/h5/channel/info',
            isBlack: '/h5/user/isBlack',
            chargeStatus: '/h5/channel/chargeStatus',
            isSubscribe: '/h5/user/isSubscribe',
            liveRole: '/h5/user/liveRole',
            payUser: '/h5/channel/payUser',
            vipInfo: '/h5/vip/get',
            getDesc: '/h5/channel/getDesc',
            pushNum: '/h5/channel/pushNum',
            channelPush: '/h5/channel/push',
            appPushInfo: '/h5/live/push/appPushInfo',
            getPushInfo: '/h5/channel/getPushInfo',
            bindLiveShare: '/h5/share/bindLiveShare',
            topicList: '/h5/topic/list',
            //比上面的接口多了个时长字段
            listTopic: '/h5/topic/listTopic',
            switchFree: '/h5/channel/switchFree',
            removeTopic: '/h5/channel/removeTopic',
            deleteTopic: '/h5/topic/delete',
            singleBuy: '/h5/channel/singleBuy',
            channelSatus: '/h5/coupon/channelSatus',
            freeBuy: '/h5/channel/orderFree',
            listWithTags: '/h5/channel/getChannels',
            createGroup: '/h5/channel/group/createGroup',
            getGroupListByChannelId: '/h5/channel/group/getGroupListByChannelId',
            getChannelGroupingList: '/h5/channel/group/groupingList',
            getChannelGroupInfo: '/h5/channel/group/getGroup',
            getGroupResult: '/h5/channel/group/groupResult',
            checkIsHasGroup: '/h5/channel/group/getNewestGroup',
            channelQrCode: '/h5/channel/getChannelQr',
            getGroupList: '/h5/channel/getByliveIdAndIsGroup',
            openGroup: '/h5/channel/openGroup',
            shareCardData: '/h5/channelShare/getChannelShareCardData',
            setMarket:'/h5/channel/setDiscount',
            getMarket:'/h5/channel/getDiscountType',
            isCouponSet:'/h5/channel/isCouponOpen',
            list: '/h5/channel/list',
            delete: '/h5/channel/delete',
            getEvaluation: '/h5/channel/getEvaluation',
            receiveMediaCoupon: '/h5/relayChannel/coupon/bindRelayChannelCoupon',
            getCouponDetail: '/h5/relayChannel/coupon/queryCouponDetail',
            isReceivedCoupon: '/h5/relayChannel/coupon/isOrNotBind',
            getMediaCouponList: '/h5/relayChannel/coupon/queryRelayChannelCouponList',
            getChannelTopicTotal: '/h5/channel/getChannelTopicTotal',

            //系列课访问统计接口
            channelCount: '/h5/channel/channelCount',

            //获取数据总揽接口  http://showdoc.corp.qlchat.com/web/#/1?page_id=2180
            getAllDataDetail: '/h5/dataStat/getPandectData', // '/h5/channel/getAllDataDetail',

            //获取系列课自定义渠道接口  http://showdoc.corp.qlchat.com/web/#/1?page_id=2164
            getSourceList: '/h5/dataStat/getSourceData', //旧接口 '/h5/channel/getSourceList',

            //新增系列课自定义渠道 http://showdoc.corp.qlchat.com/web/#/1?page_id=2162
            addSource: '/h5/dataStat/addSource', // 旧接口 '/h5/channel/addSource',

            //修改系列课渠道名 http://showdoc.corp.qlchat.com/web/#/1?page_id=2163
            changeSorceName: '/h5/dataStat/changeSorceName',//旧接口 '/h5/channel/changeSorceName',

            //获取邀请数据接口
            getAllInviteDate: '/h5/channel/getAllInviteDate',
            getChannelIdList: '/h5/channel/getChannelIdList',
            changeDisplay: '/h5/channel/changeDisplay',
            //分享统计
            countShareCache: '/h5/channel/group/countShareCache',
            countVisitCache: '/h5/channel/group/countVisitCache',

            // 保存推送码
            savePushInfo: '/h5/weapp/savePushInfo',

            // 最近学习的课程
            lastLearnCourse: '/h5/channel/getLastJoinTopic',

            // 获取团长付费开团结果
            getOpenPayGroupResult: '/h5/channel/group/getOpenPayGroupResult',
            // 支付统计
            countSharePayCache: '/h5/channel/group/countSharePayCache',
            // 系列课任务邀请卡鉴权
            channelTaskCardAuth: '/h5/channel/channelTaskCardAuth',

            // 改用户时候已经绑定活动定制优惠券判断
            activityCodeExist: '/h5/promotion/existsCode',
            // 为用户绑定活动定制优惠券
            activityCodeBind: '/h5/promotion/bindByCourse',
            // 保存系列课购买须知
            saveChannelPurcaseNote: '/h5/channel/savePurchaseNotes',

            // 系列课内即将开播的话题
            newBeginTopic: '/h5/channel/new-begin-topic',
            getPayList: '/h5/channel/group/getPayList',
            // 系列课是否已购买
            channelAuth: '/h5/channel/channelAuth',
            // 是否已经购买过和转载系列课相同的课程
            checkDuplicateBuy: '/h5/channel/checkReBuy',
            tryListen: '/h5/selfmedia/tryListen',
            // 获取转载系列课的单课收益
            relayChannelProfit: '/h5/knowledge/getKnowledgeProfit',
            // 转载信息
            getRelayInfo: '/h5/channel/getRelayInfo',

            getIfHideGroupInfo: '/h5/channel/group/isHideGroupInfo',

            // 是否报名该系列课
            isAuthChannel: '/h5/activity/seriesclass/channelAuth',
            // 当前最近训练营期数
            currentPeriod: '/h5/camp/new/getPeriodByChannel', // '/h5/channel/camp/currentPeriod',
            // 判断用户是否加入训练营，和是否有当前期数
            joinCampInfo:"/h5/channel/camp/joinCampInfo",
            // 关联训练营
            joinPeriod:"/h5/channel/camp/joinPeriod",
            // 设置证书昵称
            setUserName: '/h5/channel/camp/setUserName',
            //  获取证书显示信息
            getUserCard: '/h5/channel/camp/getUserCard',
            getUserQualification: '/h5/channel/camp/getUserQualification',

            // 一元解锁课程进度
            unlockProgress: '/h5/channel/unlockProgress',
            // 一元解锁课程绑定邀请关系
            bindUserRef: '/h5/unlockCourse/bindUserRef'
        },
        // 请好友免费听
        inviteFriendsToListen: {
            checkShareStatus: '/h5/inviteFree/checkShareStatus',
            fetchShareRecord: '/h5/inviteFree/saveShareRecord',
            getReceiveInfo: '/h5/inviteFree/getReceiveInfo',
            checkReceiveStatus: '/h5/inviteFree/checkReceiveStatus',
            receive: '/h5/inviteFree/receive',
            getReceiveTopicList: '/h5/inviteFree/getReceiveTopicList',
        },
        excellentCourse: {
            auditCourse: '/h5/live/center/auditCourse',
            isEnterPage: '/h5/live/center/isEnterPage',
            courseAudit: '/h5/live/center/courseAudit',
            quickAudit: '/h5/live/center/quickAudit',
        },
        topic: {
            enterEncrypt: '/h5/topic/encryptApply',
            getRelayConfig: '/h5/topic/getRelayConfig',
            topicInfo: '/h5/topic/get',
            endTopic: '/h5/topic/endTopic',
            hideTopic: '/h5/topic/changeTopicDisplay',
            getTopicForSort: '/h5/topic/getTopicForSort',
            doSetTopicSort: '/h5/topic/saveTopicSort',
            topicAuth: '/h5/topic/topicAuth',
            channelPayToTopicAuth: '/h5/topic/channelPayToTopicAuth',
            barrageFlag: '/h5/topic/barrageFlag',
            getSpeak: '/h5/speak/get',
            addSpeak: '/h5/speak/add',
            deleteSpeak: '/h5/speak/delete',
            changeSpeaker: '/h5/speak/changeSpeaker',
            addForumSpeak: '/h5/forum/add',
            getForumSpeak: '/h5/forum/get',
            deleteForumSpeak: '/h5/forum/delete',
            setMute: '/h5/topic/banned',
            getMediaUrl: '/h5/media/getPlayUrl',
            inviteList: '/h5/topic/inviteList',
            shareCardData: '/h5/share/getTopicShareCardData',
            shareCompliteData:'/h5/achievementCard/getAchievementData',
            shareComplitePushDate:'/h5/achievementCard/getAchievementCardRecord',
            pushAchievementCardToUser:'/h5/achievementCard/pushAchievementCardToUser',
            clickAchievementCard:'/h5/achievementCard/clickAchievementCard',
            getnowTopicVideoCount:'/h5/topic/getTopicVideoCount',
            getShareTopThree: '/h5/topic/getShareTopThree',
            textOrAudioSwitch: '/h5/speak/textOrAudioSwitch',
            addTopicEndTime:'/h5/topic/addTopicEndTime',
            getLikesSet: '/h5/topic/getLikesSet',
            likesList: '/h5/interact/speak/likesList',
            likes: '/h5/interact/speak/likes',
            docSave: '/h5/doc/save',
            docGet: '/h5/doc/get',
            docAuth: '/h5/doc/auth',
            docAddStat: '/h5/doc/addStat',
            getAssemblyAudio : '/h5/topic/assemblyAudio',
            push: '/h5/topic/push',
            getPushInfo: '/h5/topic/getPushInfo',
            setTitle: '/h5/topic/set-title',
            getDocsData: '/h5/doc/getDocList',
            kick:'/h5/topic/kickOut',
            initWebsocket: '/h5/topic/initWebsocket',
            profile: '/h5/topic/profileList',
            getLastOrNextTopic: '/h5/topic/getLastOrNextTopic',
            update: '/h5/topic/addOrUpdate',
            doMoveToChannel: '/h5/channel/mvToChannel',
            changeAudioGraphicChannel: '/h5/channel/changeAudioGraphicChannel',
            convertTopic: '/h5/topic/convertTopic',
            addDiscuss: '/h5/discuss/addDiscuss',
            discussList: '/h5/discuss/list',
            deleteDiscuss: '/h5/discuss/delete',
            discussLike: '/h5/discuss/likes',
            setAppDownloadOpen: '/h5/topic/openAppDownload',
            myCouponList: '/h5/coupon/myCouponList',
            changeTopicDisplay: '/h5/topic/changeTopicDisplay',
            publicApply: '/h5/topic/publicApply',
            totalSpeakList: '/h5/speak/getTotalList',
            relayStatus: '/h5/live/relayStatus',
            weappCode: '/h5/weapp/getwxacode',
            setShareStatus: '/h5/topic/setShareStatus',
            setIsNeedAuth: '/h5/topic/setIsNeedAuth',
            getEvaluation: '/h5/topic/getEvaluation',
            getGiftId: '/h5/pay/getGiftId',
            getFollowGuideInfo: '/h5/topic/getFollowGuideInfo',
            getTopicBrowsNum: '/h5/topic/getTopicBrowsNum',
            isClientBRelayListen: '/h5/selfmedia/isOrNotListenChannel',
            getRelayDelSpeakIdList: '/h5/speak/getRelayDelSpeakIdList',
            userVipInfo: '/h5/vip/get-user-vip-simple',
            getMediaActualUrl: '/h5/media/getMediaPlayUrl',
            getSpeakNum: '/h5/forum/getSpeakNum',
            getOutlineList: '/h5/topic/getOutLineList',
            addOrUpdateOutLine: '/h5/topic/addOrUpdateOutLine',
            delOutLine: '/h5/topic/delOutLine',
	        commentCount: '/h5/discuss/countDiscuss',
	        getLivePlayUrl: '/h5/topic/getLivePlayUrl',
	        getLiveStatus: '/h5/topic/getLiveStatus',
	        getLiveOnlineNum: '/h5/topic/getLiveOnlineNum',
            commentCount: '/h5/discuss/countDiscuss',
            getUserTopicRole: '/h5/user/topicRole',
            getRoleList: '/h5/topic/managerAndGuest',
            getInviteData: '/h5/topic/getInviteData', //话题邀请数据  http://showdoc.corp.qlchat.com/web/#/1?page_id=2169
            // 获取课堂红包关注公众号
            getRedEnvelopeAppId: '/h5/live/getRedEnvelopeAppId',
            // 是否设置一次性订阅开播提醒，话题详情页调用
            oneTimePushSubcirbeStatus: '/h5/topic/oneTimePush/subcirbeStatus',
            // 话题文稿
            bookProfile: '/h5/book/bookProfile',
            // 发送邀请-话题嘉宾
            topicInvite: "/h5/topic/topicInvite",
            // 接受邀请-话题嘉宾
            getTopicInvite: "/h5/topic/inviteTopicGet",
            // 音频极简页-名师解惑
            getTeacherDisabuseUrl: "/h5/system/getTeacherDisabuseUrl",
        },
        my: {
            myShare: '/h5/share/myShare',
            myShareChannel: '/h5/channelShare/myShare',
            shareCardVip: '/h5/share/shareCardTemplate',
            getShareCard: '/h5/share/getShareCard',
            getChannelShareCard: '/h5/channelShare/getShareCard',

            shareIncomeFlow: '/h5/shareAccount/myFlowingEarningRecordList',

            shareIncomeListDetailTopic: '/h5/shareEarning/topicEarningRecordDetailsList',
            shareIncomeInitDetailTopic: '/h5/shareEarning/topicEarningRecordDetails',
            shareIncomeListTopic: '/h5/shareAccount/myTopicEarningRecordList',

            shareIncomeListDetailChannel: '/h5/shareEarning/channelEarningRecordDetailsList',
            shareIncomeInitDetailChannel: '/h5/shareEarning/channelEarningRecordDetails',
            shareIncomeListChannel: '/h5/shareAccount/myChannelEarningRecordList',

            shareIncomeListDetailVip: '/h5/shareEarning/vipEarningRecordDetailsList',
            shareIncomeInitDetailVip: '/h5/shareEarning/vipEarningRecordDetails',
            shareIncomeListVip: '/h5/shareAccount/myVipEarningRecordList',
            wallet: '/h5/mywallet/index',
        },
        coupon: {

            transformCoupon: '/h5/coupon/transformCoupon',
            bindTransformCoupon: '/h5/coupon/bindTransformCoupon',
            bindCouponCode: '/h5/coupon/bindCouponCode',
            getTransformCoupon: '/h5/coupon/getTransformCoupon',

            actCouponList: '/h5/activity/actCouponList',
            pushToCenter: '/h5/universal/push-coupon-center',
            extractCoupon: '/h5/universal/random',
            commonCoupon: '/h5/universal/coupon-center',
            ifExtract: '/h5/universal/queryUserIdRandomList',

            // 查询活动定制券实体
            activityCouponObj: '/h5/promotion/get',

            setIsShowIntro: '/h5/coupon/setIsShowIntro',
            setSpreadType: '/h5/coupon/setSpreadType',
            getCouponForIntro: '/h5/coupon/getCouponForIntro',
            batchCodeIn: '/h5/universal/batchCodeIn',

            switchChannelCoupon: '/h5/universal/switchChannelCoupon',
            getCouponStatus: '/h5/universal/getCouponStatus',
	        getLiveUniversalCoupon: '/h5/coupon/getLiveUniversalCoupon',
            bindUniversalCoupon: '/h5/universal/bindUniversalCoupon',

        },
        share: {
            // 新增/修改课程自定义邀请卡/课程语录信息
            addOrUpdateCustomShareInfo: '/h5/share/addOrUpdateCustomShareInfo',
            // 获取课程自定义邀请卡/推荐语录信息
            getCustomShareInfo: '/h5/share/getCustomShareInfo',
            // 获取课程分销资格（统一接口）
            getMyQualify: '/h5/share/getMyQualify',
            list: '/h5/share/topQualifyList',
            qualify: '/h5/share/qualify',
	        getQlShareKey: '/h5/share/getQlShareKey',

            // 自动分销
            getChannelAutoShare: '/h5/channelShare/autoShare',
            getTopicAutoShare: '/h5/share/autoShare',

            // 新增分销授权（添加课代表）
            addChannelShareQualify: '/h5/channelShare/batchSaveChannelQualify',
            addLiveShareQualify: '/h5/share/saveShareQualify',
            addTopicShareQualify: '/h5/share/saveShareQualify',
            saveChannelAutoShare: '/h5/channelShare/saveAutoShare',

            shareTopicList: '/h5/topic/shareTopicList',

            channelDistributionIndexList: '/h5/channelShare/channelList',

            /* 课代表列表 */
            // 系列课
            channelDistributionList: '/h5/channelShare/qualifyList',
            // 话题
            topicDistributionList: '/h5/share/qualifyList',

            // 更改分销状态
            changeChannelRepresentStatus: '/h5/channelShare/changeStatus',
            changeLiveTopicRepresentStatus: '/h5/share/changeLock',

            // 课代表分销明细
            channelDistributionDetail: '/h5/channelShare/qualifyInvitationList',
            topicDistributionDetail: '/h5/share/qualifyInvitationList',
            getQualifyPercent: '/h5/channelShare/getQualifyPercent',
            getChannelQualify: '/h5/channelShare/getQualify',
            getChannelAutoQualify: '/h5/channelShare/getAutoQualify',
            getMyChannelShareQualify: '/h5/channelShare/getMyChannelShareQualify',
            // 接受课代表邀请
            sendChannelQualify: '/h5/channelShare/sendChannelQualify',
            sendbatchChannelQualify: '/h5/channelShare/sendbatchChannelQualify',
            acceptLiveTopicShareInvite: '/h5/share/acceptShareInvite',
            acceptBatchLiveTopicShareInvite: '/h5/share/acceptBatchShareInvite',
            setTopicAutoShare: '/h5/share/setAutoShare',
            getTopicAutoQualify: '/h5/share/getAutoQualify',
            setShareTerrace:'/h5/share/setLiveRecommend',
            bindLiveShare: '/h5/share/bindLiveShare',
            topicTaskCardAuth: '/h5/topic/topicTaskCardAuth',
            qlLiveShareQualify: '/h5/share/getQlShareQualify',
            adminFlag: '/h5/live/admin/admin-flag',
            getQlShareQualify: '/h5/share/getQlShareQualify',

            // 直播间分销
            shareUsersLive: "/h5/share/shareUsersLive",
            shareUsersLiveCount: "/h5/share/shareUsersLiveCount",
            shareManage: "/h5/share/shareManage",
            changelock: "/h5/share/changeLock",
            removeShare: "/h5/share/removeShare",
            updateShareStatus: "/h5/share/updateShareStatus",
        },
        ppt: {
            new: '/h5/ppt/upload',
            list: '/h5/ppt/list',
            remove: '/h5/ppt/removePPTFiles',
	        sort: '/h5/ppt/sortAllFile',
	        push: '/h5/ppt/checkPPTFiles',
        },
        comment: {
            delete: '/h5/comment/delete',
            add: '/h5/comment/add',
            get: '/h5/comment/getComment',
            update: '/h5/comment/update',
            getCourseComment: '/h5/comment/commentForTeacher',
            getLiveCourseList: '/h5/comment/liveCommentTopicList',
            getUserCommentList: '/h5/comment/commentForStudent',
            getCommentDetail: '/h5/comment/commentDetail',
            getCommentReplyList: '/h5/comment/commentReplyList',
            getLiveCommentNum: '/h5/comment/getLiveCommentNum',
            cleanCommentRedDot: '/h5/comment/clearRedDot',
        },
        active: {
            getActiveInfo: '/h5/live/active/getActiveInfo',
            getFinishLiveList: '/h5/live/active/getFinishLiveList',
            getRankList: '/h5/live/active/getRankList',
            getLiveAchieveData: '/h5/live/active/getLiveAchieveData',
            gainCourse: 'h5/gainCourse/get',
        },
        gift: {
            giftDetail: '/h5/gift/channelGiftdetail',
            giftget: '/h5/gift/getOneGiftForChannel',
            giftGroupGet: '/h5/gift/getMoreGiftForChannel',
            giftList: '/h5/gift/getChannelGiftAcceptList',
        },
        vip: {
            vipInfo: '/h5/vip/get',
            getPushInfo: '/h5/custom/vip/getPushInfo',
            push: '/h5/custom/vip/push',
            pushNum: '/h5/custom/vip/pushNum',
            getCustomVipList: '/h5/custom/vip/customViplist',
            incomeRecord: '/h5/vip/vipIncomeRecord',
            reward: '/h5/profitRecord/liveVipReward',
            getCustomVipInfo: '/h5/custom/vip/getCustomVipDetail',
            getCustomVipAuthList: '/h5/custom/vip/customVipAuthList',
            getCustomVipCourseList: '/h5/custom/vip/getCustomVipCourseList',
            userIsOrNotCustomVip: '/h5/custom/vip/userIsOrNotCustomVip',
            getUserVipDetail: '/h5/custom/vip/getUserVipDetail',
            saveVipDesc: '/h5/vip/saveVipDesc',
            getVipGiftInfo: '/h5/gift/vip/detail',
            receiveVipGift: '/h5/gift/vip/receive',
            getReceiverList: '/h5/gift/vip/receiverList',
            getGiftId: '/h5/pay/getGiftId',
        },
        weappAuth: '/h5/user/weChatAppAuth',
        getAllTagLives: '/h5/tag/allTagLives',
        getBanners: '/h5/live/center/banners',
        isMineNew: '/h5/course/order/redDot',
        selfCenter: '/h5/user/selfCenter',
        recentLearning: '/h5/topic/learningList',
        // 首页查看更多
        viewMoreCourses: '/h5/indexRegion/courses',
        livecenterTags: '/h5/live/center/livecenterTags',
        saveUserTag: '/h5/live/center/saveUserTag',

        showFlag: '/h5/live/center/showFlag',
        selfSubscribe: '/h5/course/order/sign-in',
        getPeriodCourse: '/h5/course/order/list',
        periodCourseInfo: '/h5/course/order/init',
        periodInviteCard: '/h5/course/order/card',
        getAllPeriodTag: '/h5/course/order/all-tag',
        getMySelectPeriodTag: '/h5/course/order/my-tag',
        getSubscribeStatus: '/h5/course/order/get-status',
        setSubscribeStatus: '/h5/course/order/update-order',
        saveMyPeriodTag: '/h5/course/order/tag-save',

        myJoinTopicData: '/h5/topic/myJoinTopicData',
        findLiveEntity: '/h5/live/findLiveEntity',
        getPurchaseRecord: '/h5/topic/getPurchaseRecord',
        getTagList: '/h5/tag/list',
        getHotTopics: '/h5/live/center/hot-topics',
        getRecommendTopics: '/h5/live/center/recommend-topics',
        getHotLives: '/h5/live/center/hot-lives',
        getHotChannels: '/h5/live/center/hot-channels',
        pay: {
            order: '/h5/pay/weixinOrder',
            result: '/h5/pay/selectResult',
            getLiveTagPaster: '/h5/pay/getLiveTagPaster',

            getFailReason: '/h5/pay/findFailedTypeList',
            saveFailReason: '/h5/pay/saveFailedType',
            getOpsPayType: '/h5/weapp/getOpsPayType',
        },
        indexRecommend: '/h5/live/center/indexRecommend',
        hotCharge: '/h5/live/center/hotCharge',
        hotFree: '/h5/live/center/free-hot',
        ossAuth: '/h5/common/stsAuth',
        'oss': {
            'video': {
                'get': '/h5/common/videoAuth',
                'refresh': '/h5/common/videoRefreshAuth',
            },
        },
        homeTag: '/h5/live/center/home-tag',
        consult: {
            send: '/h5/consult/send',
            praise: '/h5/consult/like',
            selected: '/h5/consult/getPerfect',
            count: '/h5/consult/getPerfectCount',
        },
        complain: {
            getResonTypes: '/h5/complain/reasonTypes',
            saveComplain: '/h5/complain/save',
        },
        recommend: {
            getAllTags: '/h5/tag/all-tag',
            getLowPriceCourse: '/h5/live/center/course-low-price',
            getFreeCourse: '/h5/live/center/course-free',
            hotLives: '/h5/live/center/hotLives',
            articleList: '/h5/starCourse/list',
            hotTagTags: '/h5/hotTagCourse/tags',
            hotTagCourse:'/h5/hotTagCourse/list',
            getCustomCoursePaster: '/h5/courseTagPaster/getByUser',
            iconList: '/h5/live/center/specialZone',
            giftFlag: '/h5/live/center/gift-flag',
            allGift: '/h5/live/center/all-gift',
            newGiftTopic: '/h5/live/center/change-gift-course',
            getGift: '/h5/live/center/get-gift',
            userGift: '/h5/live/center/user-gift',
            initIndexData: '/h5/indexRegion/init',
            initIndexInterest: '/h5/indexRegion/interest',
            authFreeChannel: '/h5/indexRegion/authFreeChannel',
            getGiftBounceConfig: '/h5/live/center/getGiftBounceConfig',
            appGiftFlag: '/h5/live/center/appGiftFlag',
            // 免费专区
            getListTags: '/h5/free/listTag',
            getListBanner: '/h5/free/listBanner',
            getListFreeCourse: '/h5/free/listCourse',
            getListFreeRegion:'/h5/free/listCourseByTag',
            // 知识新闻列表
            getNewsLists: '/h5/news/list',
            // ios端首页免费课程列表
            iosFreeCourses: '/h5/free/listFreeCourse',
            // 听书列表
            booksLists: '/h5/book/bookSubjectList',
            // 知识小课
            bookshelfRecord :'/h5/live/bookshelfRecord',
            // 试听列表
            getCourseAuditionList: "/h5/topic/getCourseAuditionList"
        },
        homework: {
            getTopicListByChannel: '/h5/topic/getTopicNameList',
            isSubscribe: '/h5/user/isSubscribe',
	        save: '/h5/homework/save',
	        getArrangedList: '/h5/homework/assignedList',
	        get: '/h5/homework/get',
            saveAnswer: '/h5/answer/save',
            myAnsweredList: '/h5/homework/answeredList',
            answeredList: '/h5/answer/list',
	        like: '/h5/answer/likes',
	        myAnswer: '/h5/answer/getMine',
	        deleteHomework: '/h5/homework/delete',
	        deleteAnswer: '/h5/answer/delAnswer',
	        deleteComment: '/h5/answer/delRemark',
	        addComment: '/h5/answer/addRemark',
            visitDetailLog: '/h5/homework/visitDetail',
	        getMaxPushCount: '/h5/homework/maxPushCount',
	        pushHomework: '/h5/homework/pushTopicAuth',
            addAnswerAuth: '/h5/answer/addAnswerAuth',
            getVideoPlayInfo: '/h5/answer/getVideoPlayInfo',
        },

        // 系列课训练营
        channelCamp: {
            listTopic: '/h5/camp/new/listTopic', // 话题列表，包括作业
            currentTopic: '/h5/channel/camp/currentTopic', // 当前任务话题
            getUserPeriod: '/h5/channel/camp/getUserPeriod', // 用户加入的期数
            listByChannel: '/h5/answer/listByChannel', // 根据channelId获取答案列表
            setPrime: '/h5/answer/setPrime', // 加精华
        },

        timeline: {
            getNewLikeNum: '/h5/feed/unread',
            getNewLikeList: '/h5/feed/unreadList',
            setNewLikeToRead: '/h5/feed/read',
            getDataForCreateTimeline: '/h5/feed/getDataForFeed',
            like: '/h5/feed/like',
            getTimelineList : '/h5/feed/list',
            creteTimeline: '/h5/feed/save',
            deleteTimeline: '/h5/feed/delete',
            getTopicList: '/h5/topic/getTopicNameList',
            restPushTimes: '/h5/feed/times',
            // 一键屏蔽，一键订阅
            onekeyUpdateAlert: '/h5/live/onekeyUpdateAlert',
        },

        activity:{
            storage:{
                count: '/h5/inbound/channelAuthCount',
                log: '/h5/inbound/incr',
            },
            config: '/wechat/getConfig',

            endlessEight: {
                comment: {
                    get: '/h5/activity/schoolseason/get-comment',
                    add:'/h5/activity/schoolseason/add-comment',
                    count: '/h5/activity/schoolseason/comment-num',
                },
            },
            coupon: {
                getCouponList: '/h5/promotion/promotions',
                getCourse: '/h5/promotion/courses',
                getCouponCode: '/h5/promotion/bind',
                getCouponCodeBatch: '/h5/promotion/batchBind',
                getCourseCoupon: '/h5/promotion/course-promotions',
            },
            getCodes: '/h5/inbound/getCodes',
            rand: '/h5/inbound/rand',
            getExternalSpreadData: '/h5/externalSpread/getExternalSpreadData',
            getCommunity: '/h5/community/get',
            getCommunityQr: '/h5/community/getQr',

            // 叶一茜活动接口
            yeyiqian: {
                topicStatus: '/h5/activity/seriesclass/topic-status',
                taskInfo: '/h5/activity/seriesclass/getTopicTaskInfo',
                listGet: '/h5/activity/seriesclass/assignment-list',
                userGet: '/h5/activity/seriesclass/get-assignment',
                save: '/h5/activity/seriesclass/save-assignment',
                like: '/h5/activity/seriesclass/like',
                isBuy: '/h5/activity/seriesclass/channelAuth',
            },
            gainCourse: '/h5/gainCourse/get',
            // 双十一活动页接口
            doubleEleven: {
                getConfig: '/h5/activity/configs',
                getCourse: '/h5/activity/courses',
                bindByCourse: '/h5/promotion/bindByCourse',
                batchBind: '/h5/promotion/batchBind',
                getCourseMap: '/h5/activity/coursesMap',
                getGiftPermission: '/h5/activity/giftPermission'
            },
            // 各种买课送书的地址
            address: {
                saveAddress: '/act/courseSend/saveAddress',
                addressWriteNum: '/act/courseSend/addressWriteNum',
                getAddressInfo: '/act/courseSend/getAddressInfo',
            },
            //年度口碑榜
            annual: {
                saveLike: '/h5/activity/saveLike'
            },

            //2018年春节前红包奖励活动
            bonuses:{
                courseConfig:'/h5/shareCoupon/courseConfig',
                myShareDetail:'/h5/shareCoupon/myShareDetail',
                doShare:'/h5/shareCoupon/doShare',
                joinShare:'/h5/shareCoupon/joinShare',
                getRecentAcceptList:'/h5/shareCoupon/getRecentAcceptList',
                // 新拆红包活动
                getStateInfo: '/h5/redpackCoupon/getStateInfo',
                getConfAndGroupInfo: '/h5/redpackCoupon/getConfAndGroupInfo',
                getGroupOpenRedpack: '/h5/redpackCoupon/getGroupOpenRedpack',
                openRedpack: '/h5/redpackCoupon/openRedpack',
                getAccountRedpackList: '/h5/redpackCoupon/getAccountRedpackList',
                getMaxCouponInfo: '/h5/redpackCoupon/getMaxCouponInfo',
            }
        },
        ops: {
            liveInfo: '/h5/ops/info',
            livePush: '/h5/ops/push',
            refreshFans: '/h5/ops/refresh',
        },
        inboundBindCode: '/h5/inbound/bindCode',
        imageGet: '/h5/imagePage/get',
        userTag: '/h5/live/center/user-tag',
        studio: {
            pageShare: '/h5/live/admin/page-share',
            savePageShare: '/h5/live/admin/save-page-share',
            moduleInfo: '/h5/live/selfDefine/modules/infoV2',
        },
        mediaMarket: {
            courseTagList: '/h5/selfmedia/course-tag-list',
            courseList: '/h5/selfmedia/courseList',
            upOrDownCourse: '/h5/selfmedia/upOrDown',
            reprintChannel: '/h5/selfmedia/relayChannel',
            deleteReChannel: '/h5/selfmedia/remove',
            isRelay: '/h5/selfmedia/isRelay',
            getReprintChannelList: '/h5/selfmedia/relayChannels',
            hasAdminPower: '/h5/selfmedia/relayAuth',
            agentInfo: '/h5/agent/info',
            applyInfo: '/h5/agent/my-agent-apply',
            applyAgent: '/h5/agent/apply-agent',
            isActive: '/h5/selfmedia/isActive',
            getContactInfo: '/h5/selfMedia/publish/get-info',
            savePhoneNumber: '/h5/selfMedia/publish/save-mobile',
            isAutoPromote: '/h5/selfMedia/publish/is-open-publish',
            saveAutoPromote: '/h5/selfMedia/publish/update-publish-state',
            alternativeChannels: '/h5/selfMedia/publish/alternative-channel-list',
            promotionalChannels: '/h5/selfMedia/publish/publishing-channel',
            savePromote: '/h5/selfMedia/publish/change-channel-state',
            saveTweet: '/h5/selfMedia/publish/save-tweet',
            offshelf: '/h5/selfMedia/publish/sold-out-channel',
            savePercent: '/h5/selfMedia/publish/update-percent',
            getConditions: '/h5/selfMedia/publish/get-conditions',
            getPushStatus: '/h5/selfmedia/getPushStatus',
            myLiveEntity: '/h5/live/myLiveEntity',
            getRelayInfo:'/h5/knowledge/getRelayInfo',
            activityCoursesList: '/h5/selfmedia/activityCourseList',
            knowledgeBannersList: '/h5/knowledge/bannerList',
            hotCourseList: '/h5/knowledge/hotCourseList',
            discountCourseList: '/h5/selfmedia/discountCourseList',
        },
        thirdParty: {
	        isWhite: '/h5/thirdShare/isWhite'
        },
        mine: {
            purchaseCourse: '/h5/live/purchaseCourse',
            // planCourse 即将开课
            planCourse: '/h5/topic/user-plan',
            recentCourse: '/h5/topic/learningList',
            // 最近学习页面的横条，和正在直播页面的列表查询
            liveOnList: '/h5/topic/beginList',
            // 开课
            courseAlert: '/h5/topic/alert-topics',

            //收藏列表
            collectList: '/h5/coll/list',
            //添加收藏
            addCollect: '/h5/coll/add',
            //取消收藏
            cancelCollect: '/h5/coll/cancel',
            //是否收藏
            isCollected:'/h5/coll/isCollected',

            // 足迹列表
            footprintList: '/h5/live/footprint',

            // 相似课程
            similarCourseList: '/h5/live/similarCourse',
            // 我的分销账户信息
	        myDistributionAccount: '/h5/shareAccount/myShareAccount',
            distributionAccountWithdraw: '/h5/shareAccount/withDraw',
            // 参与千聊VIP合作业务
            joinQlchatVip: '/h5/member/live/agreement/updateStatus',

            // 听书购买记录
            purchaseList: '/h5/user/purchaseList'
        },
        coral: {
	        getAccountData: '/h5/personShare/getAccountData',
	        getWithdrawtList: '/h5/personShare/getWithdrawtList',
            getCoursetagList: '/h5/personShare/getCourseTagList',
	        personWithdraw: '/h5/personShare/personWithdraw',
	        personReWithdraw: '/h5/personShare/repay',
            getPersonPartyCourseList:'/h5/personShare/getPersonPartyCourseList',
            joinCollection: '/h5/personShare/joinCollection',
            getMyShareList: '/h5/personShare/getMyShareList',
            getMyProfitRecord: '/h5/personShare/getMyProfitRecord',
            getMyIdentity: '/h5/personShare/getMyIdentity',
	        getMyCommunityList: '/h5/personShare/getMyCommunityList',
	        getMyTemporaryRefCount: '/h5/personShare/getMyTemporaryRefCount',
	        getMyCommunityCount: '/h5/personShare/getMyCommunityCount',
	        getMyTemporaryRefList: '/h5/personShare/getMyTemporaryRefList',
	        getOfficialVipConfig: '/h5/personShare/getOfficialVipConfig',
	        updateOrderData: '/h5/personShare/updateOrderData',
	        getOrderData: '/h5/personShare/getOrderData',
	        // 绑定官方课代表临时关系
	        bindUserRef: '/h5/personShare/bindUserRef',
	        getMonthAchievement: '/h5/personShare/getMonthAchievement',
	        achievementList: '/h5/personShare/achievementList',
	        achievementDetailList: '/h5/personShare/achievementDetailList',
            access: '/h5/personShare/isRight',
	        getMyPersonMonthAchievement: '/h5/personShare/myPersonMonthAchievement',
	        getMyCacheParent: '/h5/personShare/getMyCacheParent',
	        updateCacheParent: '/h5/personShare/updateCacheParent',
            isHideReferrer: '/h5/personShare/isHideRecommender',
            getRankList: '/h5/personShare/getRankList',
            getRecommendList: '/h5/personShare/getRecommendList',
            getBannerList: '/h5/personShare/getBannerList',
	        getExcellentRankList: '/h5/personShare/getExcellentRankList',
			getIndexFloatBox: '/h5/personShare/getIndexFloatBox',
            getCourseMaterial: '/h5/personShare/getCourseMaterial',
            getSubjectList: '/h5/personShare/getSubjectList',
            getSubject:'/h5/personShare/getSubject',
            getSubjectCourseList: '/h5/personShare/getSubjectCourseList',
            getCoralProfitConfig: '/h5/personShare/getShareConfig',
            getIconList: '/h5/personShare/getIconList',
            // 珊瑚计划课程上架数量
            personCourseOnSaleInfo: '/h5/personShare/personCourseOnSaleInfo',
            // 获取配置的弹窗图片和中部横幅图片
            getImgUrlConfig: '/h5/personShare/getImgUrlConfig',
            // 获取珊瑚课程信息
            getPersonCourseInfo: '/h5/personShare/getPersonCourseInfo',

            //砍价
            createShareCutApplyRecord:'/h5/shareCut/createShareCutApplyRecord',
            getLastShareCutApplyRecord:'/h5/shareCut/getLastShareCutApplyRecord',
            getAssistCutList:'/h5/shareCut/getAssistCutList',
            assistCut:'/h5/shareCut/assistCut',
            getShareCutCourseInfo:'/h5/shareCut/getShareCutCourseInfo',
            getLivePersonPartyCourseList: '/h5/personShare/getLivePersonPartyCourseList',//成功投放中
            applyPush: '/h5/personShare/applyPush',
            getReserveCourseList: '/h5/personShare/getReserveCourseList',//备选

            getFocusAppId: '/h5/personShare/getAppId', //获取珊瑚公众号appId和是否关注的状态

            getBackgroundUrlList: '/h5/personShare/getBackgroundUrlList',
        },
        camp: {
            campInfo: '/h5/trainCamp/get',
            campJoinNum: '/h5/trainCamp/authNum',
            campCourseList: '/h5/trainCamp/topics',
            campCourse: '/h5/trainCamp/recentTopics',
            campPrice: '/h5/trainCamp/get-camp-price',
            isBuyCamp: '/h5/trainCamp/isBuyCamp',
            shareCode: '/h5/trainCamp/get-share-rand-code',
            preparations: '/h5/trainCamp/preparations',
            myAnswer: '/h5/trainCamp/myAnswer',
            confirmAnswer: '/h5/trainCamp/answer',
            exceUsers: '/h5/trainCamp/exceUsers',
            preview: '/h5/trainCamp/topic',
            learnTopic: '/h5/trainCamp/learnTopic',
            search: '/h5/live/camp/search',
        },
        checkInCamp: {
            newCamp: '/h5/camp/addOrUpdateCamp',
            campAuthNum: '/h5/camp/campAuthNum',
            campDetail: '/h5/camp/campDetail',
            saveCampIntro: '/h5/camp/saveCampDesc',
            campProfitList: '/h5/camp/campProfitList',
            campBuyersList: '/h5/camp/buyCampUserList',
            campList: '/h5/camp/campList',
            campDisplay: '/h5/camp/display',
            deleteCamp: '/h5/camp/delete',
            notCheckinCount: '/h5/camp/affair/unAffairNum',
            campJoinList: '/h5/camp/joinList',
            checkinProfitList: '/h5/camp/affair/profitDetail',
            checkinTotalProfit: '/h5/camp/affair/totalProfit',
            campBuyRecord: '/h5/camp/buyRecord',
            checkinRanking: '/h5/camp/affair/topList',
            userCheckinInfo: '/h5/camp/affair/topUserInfo',
            checkinCalendar: '/h5/camp/affair/getAffairCalendar',
            userWithCamp: '/h5/camp/campUserInfo',
            checkInList: '/h5/camp/affair/getList',
            deleteCheckInNews: '/h5/camp/affair/delete',
            thumbUp: '/h5/camp/affair/thumbUp',
            unThumb: '/h5/camp/affair/unThumbUp',
            comment: '/h5/camp/affair/comment',
            deleteComment: '/h5/camp/affair/delComment',
            getCommentList: '/h5/camp/affair/commentList',
            getTopicList: '/h5/camp/campTopicList',
            getTodayTopic: '/h5/camp/todayTopicList',
            setTopicDisplay: '/h5/topic/changeTopicDisplay',
            deleteTopic: '/h5/topic/delete',
            addOrUpdate: '/h5/camp/graphic/addOrUpdate',
            contentList: '/h5/camp/graphic/contentList',
            getInfo: '/h5/camp/graphic/getInfo',
            getAuthUserList: '/h5/camp/campAuthList',
            getUserHeadList: '/h5/camp/headList',
            getCheckInHeadList: '/h5/camp/affair/getAffairImages',
            getTopNList: '/h5/camp/affair/topList',
            setUserBlack: '/h5/live/addBlack',
            setUserKickout: '/h5/camp/kickout',
            campUserInfo: '/h5/camp/campUserInfo',
            topUserInfo: '/h5/camp/affair/topUserInfo',
            pushInfo: '/h5/camp/getPushInfo',
            push: '/h5/camp/push',
            checkInPublish: '/h5/camp/affair/publish',
            campInfo: '/h5/camp/campInfo',
            getQrCode: '/h5/live/getQr',
            kickoutStatus: '/h5/camp/kickoutStatus',
            shareData: '/h5/camp/affair/getInviteCardData',
            payStatus: '/h5/camp/checkPayStatus',
            changeJoinStatus: '/h5/camp/updatePushStatus',
        },
        weapp: {
            getWeappQr: '/h5/weapp/getWeappQr',
            getSceneInfo: '/h5/weapp/sceneInfo',
            getParentChargeId: '/h5/weapp/getParentChargeId',
        },
        doc: {
            getTopicDocs: '/h5/doc/topicDocs',
            delete: '/h5/doc/delete',
            modify: '/h5/doc/modify',
            auth: '/h5/doc/auth'
        },
        ueditor: {
            addSummary: '/h5/ueditor/addSummary',
            getSummary: '/h5/ueditor/getSummary',
        },
        bullet: {
            getAudioGraphicBullet: '/h5/discuss/barrageList',
            getAudioBullet: '/h5/forum/barrageList',
            getCommonBullet: '/h5/comment/barrageList',
        },
        guestList: {
            topicGuestList: '/h5/topic/topicGuestList',
            deleteTopicTitle: '/h5/topic/deleteTopicTitle',
            setTopicTitle: '/h5/topic/setTopicTitle',
            historyGuestList: '/h5/topic/historyGuestList',
            deleteHistoryRecord: '/h5/topic/deleteHistoryRecord',
            setHistoryTitle: '/h5/topic/setHistoryTitle'
        },
        platformShare: {
            getShareRate:'/h5/platformShare/getShareRate',
            getPlatformShareQualify: '/h5/platformShare/getQualify',
            addQualify: '/h5/platformShare/addQualify',
            closeQlRecommend: '/h5/platformShare/closeQlRecommend',
            getTotalProfit: '/h5/platformShare/getTotalProfit',
            getProfitList: '/h5/platformShare/getProfitList',
            getProfitDetailList: '/h5/platformShare/getProfitDetailList',
        },
        invite: {
            getInviteReturnConfig: '/h5/invite/return/getInviteReturnConfig',
            saveInviteReturnConfig: '/h5/invite/return/saveInviteReturnConfig',
            missionList: '/h5/invite/return/missionList',
            missionDetailList: '/h5/invite/return/missionDetailList',
            paybackInfo: '/h5/invite/return/paybackInfo',
            paybackInviteList: '/h5/invite/return/inviteList',
            returnInfo: '/h5/invite/return/inviteReturnInfo',
            canSetInviteReturnConfig: '/h5/invite/return/canSetInviteReturnConfig',
        },
        /** ============= 女子大学API ============== **/
        university: {
            listChildren: '/h5/menu/node/listChildren',
            getMenuNode: '/h5/menu/node/get',
            getWithChildren: '/h5/menu/node/getWithChildren',
            shuntAppId: '/h5/university/shuntAppId',
            codeIn: '/h5/university/codeIn',
            batchListChildren: '/h5/menu/node/batchListChildren',
        }
    },
    couponApi: {
        coupon: {
            getCouponList: '/coupon/getCouponList',
            queryCouponDetail: '/coupon/queryCouponDetail',
            queryCouponInfo: '/coupon/queryCouponInfo',
            queryCouponUseList: '/coupon/queryCouponUseList',
            isOrNotBind: '/coupon/isOrNotBind',
            bindCoupon: '/coupon/bindCoupon',
            bindCouponByCode: '/coupon/bindCouponByCode',
            addCouponCode: '/coupon/addCouponCode',
            createCoupon: '/coupon/insert',
            myCouponList: '/coupon/myCouponList',
            setIsShowIntro: '/coupon/setIsShowIntro',
            getIsShowIntro: '/coupon/getIsShowIntro',
            deleteCoupon: '/coupon/deleteCoupon',
            staticCouponOpen: '/coupon/staticCouponStatus',
            addOrUpdateStaticCoupon: '/coupon/addOrUpdateStaticCoupon',
            queryCouponListByType: '/coupon/queryCouponListByType',
            queryCouponCount: '/coupon/queryCouponCount',
            queryCouponUseCount: '/coupon/queryCouponUseCount',
            allCount:'/coupon/getUseableCount',
            isOrNotSharePacket: '/coupon/isOrNotSharePacket',
            setCouponShareStatus: '/coupon/setCouponShareStatus',
            getCouponCount: '/coupon/getCouponCount',
        }
    },
    communityApi: {
        getByBusinessId: '/community/getByBusinessId',
        get: '/community/get',
        getCommunityQrcode: '/community/getQrcode',
        update: '/community/update'
    },
    appApi: {
        checkLogin: '/h5/user/check-login',
        liveFocus: '/h5/user/save-live-focus',
        live: {
            listNewestLives: '/h5/live/entity/list-newest',
            listHotLives: '/h5/live/entity/list-hot',
            listNewestTopic: '/h5/live/theme/list-newest-topic',
            listHotEntity: '/h5/live/theme/list-hot-entity',
        },
    },
    weiboApi: {
        checkLogin: '/h5/user/weiboAuth',
        pay: '/h5/pay/weiboOrder',
        getPayResult: '/h5/pay/selectResult',
        checkLoginFromJSessionId: '/h5/user/cookieLogin',
        browe: '/h5/topic/browe',
        messageValidate: '/h5/weibo/callback',
        common: {
            getPower: '/h5/user/power',
        },
        ppt: {
            new: '/h5/ppt/upload',
            list: '/h5/ppt/list',
        },
        comment: {
            delete: '/h5/comment/delete',
            add: '/h5/comment/add',
            get: '/h5/comment/getComment',

        },
        like: {
            add: '/h5/interact/speak/likes',
            list: '/h5/interact/speak/likesList',
        },
        coupon: {
            topic: '/h5/coupon/topicStatus',
            channel: '/h5/coupon/channelSatus',
        },
        share: {
            list: '/h5/share/topQualifyList',
            qualify: '/h5/share/qualify',
        },
        user: {
            isSub: '/h5/user/is-subscribe',
            info: '/h5/user/get',
            power: '/h5/user/power',
            live_role: '/h5/user/live-role',
            topic_role: '/h5/user/topic-role',
        },
        speak: {
            delete: '/h5/speak/delete',
            status: '/h5/speak/change-speaker',
            add: '/h5/speak/add',
            thank: 'h5/speak/add-action',
            get: '/h5/speak/get',
        },
        live: {
            focus: '/h5/live/focus',
            ref: '/h5/live/userRef',
            get: '/h5/live/get',
            isFocus: '/h5/live/focusStatus',
            ban: '/h5/live/banned',
            pushNum: '/h5/live/getPushNum',
            qrcode: '/h5/live/get-qr',
            my: '/h5/live/myLiveEntity',
            followNum: '/h5/live/getFollowerNum',
            alert: '/h5/live/updateAlert',
            liveInfo: '/h5/live/get',
            isFollow: '/h5/live/is-follow',
            channelCount: '/h5/live/channel-count',
            focusThree: '/h5/live/is-focus-three',
            topicNum: '/h5/live/topicNum',
        },
        whisper: {
            get: '/h5/whisper/get-voice',
            detail: '/h5/whisper/answer-detail',
        },
        topic: {
            enterPublic: '/h5/topic/publicApply',
            enterEncrypt: '/h5/topic/encryptApply',
            setTitle: '/h5/topic/set-title',
            guide: '/h5/topic/save-guide',
            browse: '/h5/topic/brow',
            giftState: '/h5/gift/change',
            profile: '/h5/topic/profileList',
            get: '/h5/topic/get',
            list: '/h5/topic/list',
            delete: '/h5/topic/delete',
            count: '/h5/topic/count',
            authList: '/h5/topic/topicAuthList',
            auth: '/h5/topic/topicAuth',
            ban: '/h5/topic/banned',
            moveIn: '/h5/topic/mvToChannel',
            end: '/h5/topic/endTopic',
            assemble: '/h5/topic/assembly-audio',
            push: '/h5/topic/push',
            relayInfo: '/h5/topic/relayExtend',
            relayCancel: ' /h5/topic/cancelRelay',
            inviteList: '/h5/topic/invite-list',
            config: '/h5/topic/config',
            doSwitchLiveType: '/h5/topic/convertTopic',
            doSetReLive: '/h5/',
            doCancelReLive: '/h5/topic/cancelRelay',
            doFinishTopic: '/h5/topic/endTopic',
            doDeleteTopic: '/h5/topic/delete',
            liveFocus: '/h5/live/focus',
            docGet: '/h5/doc/get',
            docAuth: '/h5/doc/auth',
            getGiftId: '/h5/pay/getGiftId',
            addStat: '/h5/doc/addStat',
            saveGuide: '/h5/topic/saveGuide',
            redirect: '/h5/live/center/redirect',
            setTitle: 'h5/topic/setTitle',
        },
        channel: {
            topicNum: '/h5/channel/topicNum',
            free: '/h5/channel/switchFree',
            single: '/h5/channel/singleBuy',
            associate: '/h5/channel/topicChannel',
            moveOut: '/h5/channel/removeTopic',
            list: '/h5/channel/list',
            info: '/h5/channel/info',
            count: '/h5/channel/count',
            doTopChannel: '/h5/channel/top',
            doDeleteChannel: '/h5/channel/delete',
            doMoveToChannel: '/h5/channel/mvToChannel',
            userList: '/h5/channel/payUser',
            chargeStatus: '/h5/channel/chargeStatus',
            topicCount: '/h5/channel/topicNum',
            orderFree: '/h5/channel/orderFree',
        },
    },
    wechatApi: {
        checkLogin: '/h5/user/wechatAuth',
        wechatAuthByDomain: '/h5/user/wechatAuthByDomain',
        checkLoginFromJSessionId: '/h5/user/cookieLogin',
        oldBeltNewTime: '/h5/live/getActiveTime',
        common: {
            getPayResult: '/h5/pay/selectResult',
            getPower: '/h5/user/power',
            getGiftId: '/h5/pay/getGiftId',
            docSave: '/h5/doc/save',
        },
        ppt: {
            new: '/h5/ppt/upload',
            list: '/h5/ppt/list',
            remove: '/h5/ppt/removePPTFiles',
            sort: '/h5/ppt/sortAllFile'
        },
        comment: {
            delete: '/h5/comment/delete',
            add: '/h5/comment/add',
            get: '/h5/comment/getComment',
        },
        like: {
            add: '/h5/interact/speak/likes',
            list: '/h5/interact/speak/likesList',
        },
        coupon: {
            topic: '/h5/coupon/topicStatus',
            channel: '/h5/coupon/channelSatus',
        },
        share: {
            list: '/h5/share/topQualifyList',
            qualify: '/h5/share/qualify',
        },
        user: {
            isSub: '/h5/user/is-subscribe',
            info: '/h5/user/get',
            power: '/h5/user/power',
            live_role: '/h5/user/live-role',
            topic_role: '/h5/user/topic-role',
            isSubscribe: '/h5/user/isSubscribe',
        },
        speak: {
            delete: '/h5/speak/delete',
            status: '/h5/speak/change-speaker',
            add: '/h5/speak/add',
            thank: 'h5/speak/add-action',
            get: '/h5/speak/get',
        },
        live: {
            focus: '/h5/live/focus',
            ref: '/h5/live/userRef',
            get: '/h5/live/get',
            isFocus: '/h5/live/focusStatus',
            ban: '/h5/live/banned',
            pushNum: '/h5/live/getPushNum',
            qrcode: '/h5/live/get-qr',
            my: '/h5/live/myLiveEntity',
            followNum: '/h5/live/getFollowerNum',
            alert: '/h5/live/updateAlert',
            liveInfo: '/h5/live/get',
            isFollow: '/h5/live/is-follow',
            channelCount: '/h5/live/channel-count',
            focusThree: '/h5/live/is-focus-three',
            topicNum: '/h5/live/topicNum',
            profileList: '/h5/live/profileList',
            messages: '/h5/consult/topicList',
            messagesList: '/h5/consult/consultList',
            unReplayCount: '/h5/consult/unReplayCount',
            liveAdminDate: '/h5/live/addLiveAdminDate'
        },
        whisper: {
            get: '/h5/whisper/get-voice',
            detail: '/h5/whisper/answer-detail',
        },
        topic: {
            update: '/h5/topic/addOrUpdate',
            showAuth: 'h5/topic/set-show-auth',
            shareStatus: ' h5/topic/set-share-status',
            setTitle: '/h5/topic/set-title',
            guide: '/h5/topic/save-guide',
            browse: '/h5/topic/brow',
            giftState: '/h5/gift/change',
            profile: '/h5/topic/profileList',
            get: '/h5/topic/get',
            list: '/h5/topic/list',
            delete: '/h5/topic/delete',
            count: '/h5/topic/count',
            authList: '/h5/topic/topicAuthList',
            auth: '/h5/topic/topicAuth',
            ban: '/h5/topic/banned',
            moveIn: '/h5/topic/mvToChannel',
            end: '/h5/topic/endTopic',
            assemble: '/h5/topic/assembly-audio',
            push: '/h5/topic/push',
            relayInfo: '/h5/topic/relayExtend',
            relayCancel: ' /h5/topic/cancelRelay',
            inviteList: '/h5/topic/invite-list',
            config: '/h5/topic/config',
            doSwitchLiveType: '/h5/topic/convertTopic',
            doSetReLive: '/h5/',
            doCancelReLive: '/h5/topic/cancelRelay',
            doFinishTopic: '/h5/topic/endTopic',
            doDeleteTopic: '/h5/topic/delete',
            liveFocus: '/h5/live/focus',
            getEvaluation: '/h5/topic/getEvaluation',
            getLikesSet: '/h5/topic/getLikesSet',
            likesList: '/h5/interact/speak/likesList',
            likes: '/h5/interact/speak/likes',
            docGet: '/h5/doc/get',
            docAuth: '/h5/doc/auth',
            docAddStat: '/h5/doc/addStat',
            doFocus: '/h5/live/focus',
            getAssemblyAudio : '/h5/topic/assemblyAudio',
        },
        channel: {
            free: '/h5/channel/switchFree',
            single: '/h5/channel/singleBuy',
            associate: '/h5/channel/topicChannel',
            moveOut: '/h5/channel/removeTopic',
            list: '/h5/channel/list',
            info: '/h5/channel/info',
            count: '/h5/channel/count',
            doTopChannel: '/h5/channel/top',
            doDeleteChannel: '/h5/channel/delete',
            doMoveToChannel: '/h5/channel/mvToChannel',
            giftDetail: '/h5/gift/channelGiftdetail',
            giftget: '/h5/gift/getOneGiftForChannel',
            giftGroupGet: '/h5/gift/getMoreGiftForChannel',
            giftList: '/h5/gift/getChannelGiftAcceptList',
            sortList: '/h5/channel/getChannelForSort',
            doSetChannelSort: '/h5/channel/saveChannelSort',
            getPayList: '/h5/channel/group/getPayList',
            getGroup: '/h5/channel/group/getGroup',
            getEvaluation: '/h5/channel/getEvaluation',

        },
        evaluation: {
            getList: '/h5/evaluate/list',
            getLabelList: '/h5/evaluate/getLabelList',
            reply: '/h5/evaluate/reply',
            getStatus: '/h5/evaluate/getStatus',
            add: '/h5/evaluate/add',
            isEvaluable: '/h5/evaluate/getUserIsEvaluate',
            isOpenEvaluate: '/h5/live/entity/getIsOpenEvaluate',
            updateIsOpenEvaluate: '/h5/live/entity/updateIsOpenEvaluate',
            removeReply: '/h5/evaluate/removeReply',
            get: '/h5/evaluate/get',
            getEvalMsgRedDot: '/h5/evaluate/redDot',
            cleanEvalMsgRedDot: '/h5/evaluate/clearRedDot',
        },
        mine: {
            unevaluated: '/h5/evaluate/topicList',
            joinedTopic: '/h5/topic/myJoinTopicData',
        },
        membership: {
            qualityTag: '/h5/memberConfig/qualityTag',
            qualityCourse: '/h5/memberConfig/qualityCourse',
            memberInfo: '/h5/member/memberInfo',
            trialCard: '/h5/memberConfig/trialCard',
            receiveMember: '/h5/member/receiveMember',
            showMemberLine: '/h5/member/showMemberLine',
            selectCourse: '/h5/member/selectCourse',
            memberCenterInitData: '/h5/memberConfig/memberCenter',
	        freeCourse: '/h5/memberConfig/freeCourse',
            freeCourse4Center: '/h5/memberConfig/freeCourse4Center',
	        coupon: '/h5/memberConfig/couponCourse',
            getCoupon: '/h5/promotion/bind',
	        officialCard: '/h5/member/officialCard',
	        receiveOfficialCard: '/h5/member/receiveOfficialCard',
        },
        training: {
            getCamp: '/h5/camp/new/getCamp',
            topicMap: '/h5/camp/new/topicMap',
            listTopic: '/h5/camp/new/listTopic',
            listByCamp: '/h5/answer/listByCamp',
            getUserInfo: '/h5/camp/new/getUserInfo',
            listsByTopic: '/h5/answer/listByTopic', // 根据topicIdList获取答案列表接口
            joinPeriod: '/h5/camp/new/joinPeriod',
            saveUserInfo: '/h5/camp/new/saveUserInfo',
            contract: '/h5/camp/new/contract',
            setAlert: '/h5/camp/new/setAlert',
            loadCamp: '/h5/camp/new/loadCamp',
            countByCamp: '/h5/answer/countAnswer',
            listCamp: '/h5/camp/new/listCamp',
            updateCampStatus: '/h5/camp/new/updateCampStatus',
            deleteCamp: '/h5/camp/new/deleteCamp',
            affairMap: '/h5/camp/new/affairMap',
            affair: '/h5/camp/new/affair',
            getAffairStatus: '/h5/camp/new/getAffairStatus',
            userAffairInfo: '/h5/camp/new/userAffairInfo',
            achievementCardInfo: '/h5/camp/new/achievementCardInfo',
            studyTopic: '/h5/camp/new/studyTopic',
            listReward: '/h5/camp/new/listReward',
            getEvaluation: '/h5/camp/new/getEvaluation',
            evaluateLlist: '/h5/camp/new/evaluateLlist',
            getUserHomeworkCount: '/h5/camp/new/getUserHomeworkCount',
            campPeriodHomework: '/h5/camp/new/campPeriodHomework',
            getCampByTopicId: '/h5/camp/new/getCampByTopicId',
            schoolCardData: '/h5/camp/new/schoolCardData',
            schoolCardQrCode: '/h5/camp/new/getQr',
        }

    },
    adminApi: {
        adminFlag: '/h5/live/admin/admin-flag',
        // 查询四个tab
        functionMenu: '/h5/live/admin/function-menu',
        // 查询动态，系列课。话题菜单
        pageMenu: '/h5/live/admin/page-menu',
        // 保存直播间自定义信息
        userDefined: '/h5/live/admin/user-defined',
        // 学习记录
        learnCourse: '/h5/live/admin/learn-course',
        // 我的待评价
        unevaluated: '/h5/live/admin/unevaluated',
        // 我的提问
        myAsk: '/h5/live/admin/my-ask',
        // 我的推广
        myShare: '/h5/live/admin/my-share',
        // 我的家庭作业
        myHomework: '/h5/live/admin/homework',
        // 查询直播间扩展信息
        extend: '/h5/live/get-extend',
        // 创建默认直播间
        createLiveroom: '/h5/coupon/code/create-live-entity',
        // 获取专业版折扣信息
        couponInfo: '/h5/coupon/code/get-coupon',
        // 输入专业版优惠码绑定
        bindCouponCode: '/h5/coupon/code/bind-code',
        // 查询页面排版信息
        pageConfig: '/h5/live/admin/page-config',
        // 保存页面排版信息
        savePageConfig: '/h5/live/admin/save-page-config',
        // 保存功能模块显示状态
        saveFunction: '/h5/live/admin/save-page-function',
        // 保存页面模块排序
        saveLayout: '/h5/live/admin/save-page-sort',
        // 保存页面信息
        savePageInfo: '/h5/live/admin/save-page-info',
        // 页面pv
        modulePv: '/h5/live/selfDefine/modules/pv',
        // 学员信息采集
        collection: {
            saveStudentInfo: '/h5/live/info/collection/save-info-data',
            checkUser: '/h5/live/info/collection/getBusinessConfig',
            regionSelect: '/h5/live/info/collection/region-select',
            getFormFields: '/h5/live/info/collection/get-form-fields',
            getUserDetail: '/h5/live/info/collection/getUserDetail',
        },
    },
    activityApi: {
        configs:'/act/activity/configs',
        configsByCode:'/act/activity/configsByCode',
        //获取单个活动实体信息
        activityInfo: '/act/activity/get',

        //冬季养生活动页接口
        winterHealth: {
            like: '/act/winterHealth/like',
            addComment: '/act/winterHealth/save-assignment',
            getComment: '/act/winterHealth/find-assignment-list',
            saveTestScore: '/act/winterHealth/save-score',
            getTestResultAndCourse: '/act/winterHealth/find-test',
            getTestResultDetail: '/act/winterHealth/get-test-info',
        },
        // 领书地址的接口
        address: {
            saveAddress: '/act/courseSend/saveAddress',
            addressWriteNum: '/act/courseSend/addressWriteNum',
            getAddressInfo: '/act/courseSend/getAddressInfo',
        },
        // 买赠类的接口
        gift: {
            giftAvailable: '/act/salesPresent/findResult',
            choseGift: '/act/salesPresent/saveResult',
            giftCourseList: '/act/activity/courses',
        },
        //年度口碑榜的接口
        annual: {
            rankList: '/act/activity/rankList',
        },

        template: {
            isStop: '/act/activity/isStop',
            channelShare: '/act/activityShare/shareMainPage',
        }
    },
    shareFrontApi:{
        //分享的券，开箱活动
        getCouponBoxCourseInfo : '/share-front/couponBox/getCouponBoxCourseInfo',
        getApplyRecord : '/share-front/couponBox/getApplyRecord',
        getAchievementCardInfo: '/share-front/achievement/getAchievementCardInfo',
        getInviteRankList: '/share-front/shareInvite/getInviteRankList',
        getExistAchievementCard: '/share-front/achievement/getExistAchievementCard',
        // 领取课堂红包
        receiveRedEnvelope: '/share-front/redEnvelope/receive',
        // 获取课堂红包信息
        getRedEnvelopeRecord: '/share-front/redEnvelope/getRedEnvelopeRecord',
        // 获取红包账户信息
        getRedEnvelopeAccount: '/share-front/redEnvelope/getRedEnvelopeAccount',
        // 课堂红包收益记录列表
        getProfitRecordList: '/share-front/redEnvelope/getProfitRecordList',
        // 我的领取记录详情
        getMyReceiveDetail: '/share-front/redEnvelope/getMyReceiveDetail',
        // 红包领取记录列表
        getReceiveDetailList: '/share-front/redEnvelope/getReceiveDetailList',
        redEnvelopeShare: '/share-front/redEnvelope/share',
    },
    choiceApi:{
        // 公开课数据
        getPublicCourse: '/h5/liveCenter/freePublicCourses'
    },
    // 积分体系相关
    pointApi: {
        getPointUserInfo: '/point/getPointUserInfo',
        giftInfo: '/point/giftInfo',
        doAssignment: '/point/doAssignment',
        exchangeGift: '/point/exchangeGift',
    },
    weappApi: {
        merChantCodeAuth: '/open/weapp/merchantCodeAuth',
        bindUser: '/open/weapp/bindUser',
    },
    speakApi: {
        speak: {
            get:'/speak/getSpeak',
        }
    },
    commentApi: {
        getQuestionList: '/comment/getQuestionList',
        getComment: '/comment/getComment',
        addShareComment: '/comment/addShareComment'
    },
    interactApi: {
        likes: '/interact/likes',
        likesList: '/interact/likesList',
        cancelLikes: '/interact/cancelLikes',
    },
    shortKnowledgeApi:{
        videoList: '/short/knowledge/getKnowledgeListByLiveId',
        delete: '/short/knowledge/deleteShortKnowledge',
        getKnowledgeInfo: '/short/knowledge/getKnowledgeById',
        getKnowledgeComment: '/short/knowledge/getKnowledgeComment',
        addKnowledge: '/short/knowledge/addKnowledge',
        updateKnowledge: '/short/knowledge/updateKnowledge',
        getMusicList: '/short/knowledge/getMusicList',
        addKnowledgeComment: '/short/knowledge/addKnowledgeComment',
        getKnowledgeById: '/short/knowledge/getKnowledgeById',
        statNum: '/short/knowledge/statShortKnowledge',
        setCommentHideStatus: '/short/knowledge/setCommentHideStatus',
        getWatchRecord: "/short/knowledge/getWatchRecord",
        getKnowledgeByBusinessId: '/short/knowledge/geKnowledgeByBusinessId',
        getMark: '/one/time/mark/getMark',
        // 修改打卡推送状态
        updateAttendRemind: "/affair/push/setting/updateSetting",
        // 获取用户打卡配置
        getAttendRemind: "/affair/push/setting/getSetting",
        getListTopic: '/community/listTopic',
        recentLearn: '/woman/university/recentLearn'

    },
    toSourceApi: {
		// 通过UnionID从主站获取用户信息
        getUserInfoByUnionId: '/h5/user/getUserInfoByUnionId',
        //获取主域名
        getDomainUrl:'/h5/domain/getActivityDomainUrl',

        chargeStatusChannel: '/h5/channel/chargeStatus',

        isSubscribe: '/h5/user/isSubscribe',// 是否关注服务号
        chuizhi:'/user/isSubscribe',//垂直号
    },
    spareApi: {
        // 微信授权获取用户信息
        checkLogin: '/user/wechatAuth',
    },
    followApi: {
        bindAndGetOpenId: '/wechat/getOpenId',
    },
    homeworkApi: {
        getExam: '/exam/getExam',
        startExam: '/exam/startExam',
        saveAnswer: '/exam/saveAnswer',
        endExam: '/exam/endExam',
        getUserExamInfo: '/exam/getUserExamInfo',
        showAnalysis: '/exam/showAnalysis',

        // 训练营作业相关
        camp: {
            examQuestionHomework: '/homework/examQuestionHomework',
            startHomework: '/homework/startHomework',
            endHomework: '/homework/endHomework',
            saveAnswer: '/homework/saveAnswer',
            getUserAnswerInfo: '/homework/getUserAnswerInfo',
            showAnalysis: '/homework/showAnalysis',
        },
    }
}

function fillApiPrefix(v, prefix) {
    if ('object' === typeof v) {
        for (var key in v) {
            if (key != 'secret') {
                v[key] = fillApiPrefix(v[key], prefix);
            }
        }
    } else if ('string' === typeof v) {
        v = prefix + v;
    }

    return v;
}

module.exports = config;
module.exports.getConf = function (apiPrefix, secretMap) {
    var copyConf = deepcopy(config);
    for (var key in apiPrefix) {
        copyConf[key] = fillApiPrefix(copyConf[key], apiPrefix[key]);
        copyConf[key] = copyConf[key] || {};
        copyConf[key].secret = secretMap[key];
    }
    return copyConf;
};
