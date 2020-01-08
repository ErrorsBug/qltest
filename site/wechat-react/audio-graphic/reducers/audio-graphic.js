import {
    INIT_THOUSAND_LIVE_TOPIC_INFO,
    INIT_PAGE_DATA,
    INIT_CHANNEL_INFO,
    INIT_CHANNEL_STATUS,
    APPEND_DISCUSS,
    SET_DISCUSS_LIST,
    SET_DEL_DISCUSS_LIST,
    DELETE_DISCUSS,
    THOUSAND_LIVE_SET_LSHARE_KEY,
    INIT_PUSH_COMPLITE,
	CHANNEL_QL_SHARE_KEY,
	CHANNEL_CORAL_IDENTITY,
    THOUSAND_LIVE_LIVE_ROLE,
    CLIENT_B_LISTEN,
    GET_SHARE_COMMENT_CONFIG
} from '../actions/audio-graphic';

// 话题详情页使用

var initState = {
    // sessionId
    sid: '',
    // 话题基本数据
    topicInfo: {},
    // 是否报名
    isAuth:false,
    shareRankCardItems: [],
    // 当前发言列表的头部在总发言列表的下标，0开始
    curSpeakIndex: 0,
    //最近一条被老师回复消息
    currentReplySpeak: '',
    // 评论列表数据
    discussList: [],
    // b端转载系列课删除
    delSpeakIdList: [],
    // 问题列表数据
    questionList: [],
    // 弹幕列表
    barrageList: [],
    // 判断是否禁言
    mute: false,
    // 是否显示打赏
    showReword: true,
    // 是否只看讲师
    teacherOnly: false,
    // 是否设置了开课提醒
    isAlert: false,
    // 是否关注话题
    isFollow: false,
    // 直播声音控制（【0.0~1.0】）
    liveVolume: 1,

    isShowBullet:false,//弹幕显示
    isShootBullet:false,//弹幕发射
    // 弹幕红包
    rewardBulletList:[],
    // 是否可以从socket读取发言加入信息流
    canAddSpeak: false,
    // 是否有新消息插入了
    insertNewMsg: 1,
    // 消息流从哪里开始播放
    fromWhere: 'first',
    // 当前用户的userId
    currentUserId: null,
    // 当前浏览人数
    browseNum: 0,
    // 嘉宾列表
    inviteListArr:{},
    // 正在输入
    whoTyping: '',
    // 成为金句的点赞数
    likesSet: 50,
	// 素材库列表
    materialList: [],
	// PPT列表
    pptList: [],
    // 服务端渲染加载方式
    beforeOrAfter : 'after',
    // 用户分销关系
    lshareKey: {},
    // 是否开始文字上麦
    isTextOpen: 'N',
    // 是否开始音频上麦
    isAudioOpen: 'N',
    // 加载前50个speak item用到
    noMoreSpeakList: false,
    // 被删除的消息
    delMsg:null,
    // 是否登录
    isLogin: false,
    // 用户权限
    power: {
        allowSpeak:false,
        allowMGLive :false,
        allowDelComment:false,
    },
    // 是否关注
    isSubscribe: {
        isFocusThree:false,
        isShowQl :false,
        subscribe:false,
        isBindThird:false,
    },
	// 千聊直通车shareKey
	qlshareKey: '',
	// 官方课代表分成比例
	coralPercent: '',
	// 直播间身份
    liveRole: '',
    clientBListen: null,
    shareCommentConfigFlag: 'N'
};

export function thousandLive(state = initState, action) {
    switch (action.type) {
        case INIT_THOUSAND_LIVE_TOPIC_INFO:
            return {
                ...state,
                topicInfo: action.topicInfo
            }
        case INIT_PAGE_DATA:
            return {
                ...state,
                ...action.pageData,
            }
        case INIT_CHANNEL_INFO:
            return { ...state, channelInfo: action.channelInfo};
        case INIT_CHANNEL_STATUS:
            return { ...state, channelStatus: action.channelStatus};
        case APPEND_DISCUSS:
            return {
                ...state,
                discussList: [action.discussItem, ...state.discussList],
            }
        case SET_DISCUSS_LIST:
            return {
                ...state,
                discussList: [...action.discussList],
            }
        case DELETE_DISCUSS:
            return {
                ...state,
                discussList: state.discussList.filter(item => item.id != action.id),
            }
        case THOUSAND_LIVE_SET_LSHARE_KEY:
            return {
                ...state,
                lshareKey: action.lshareKey,
            }
        case INIT_PUSH_COMPLITE:
            return {
                ...state,
                pushCompliteInfo: action.pushCompliteInfo,
                getnowTopicVideoCount: action.getnowTopicVideoCount,
            }
	    case CHANNEL_QL_SHARE_KEY:
		    return {...state, qlshareKey: action.qlshareKey};
	    case CHANNEL_CORAL_IDENTITY:
		    return { ...state, coralPercent: action.percent, isPersonCourse: action.isPersonCourse };
	    case THOUSAND_LIVE_LIVE_ROLE:
            return {...state, liveRole: action.liveRole};
        case SET_DEL_DISCUSS_LIST:
            return {...state, delSpeakIdList: action.delSpeakIdList};
        case CLIENT_B_LISTEN:
            return {...state, clientBListen: action.clientBListen};
        case GET_SHARE_COMMENT_CONFIG:
            return {
                ...state,
                shareCommentConfigFlag: action.flag
            }
        default:
            return state;
    }
};

/**
 * 兼容一个后端问题，就是speak列表的头部可能还会有其他发言，真恶心
 * @param {Array} speakList 发言列表
 */
function fixStartSpeak(speakList) {
    if (speakList.length > 2 && 
        speakList[speakList.length - 2].type == 'start'
    ) {
            const temp = speakList[speakList.length - 1];
            speakList[speakList.length - 1] = speakList[speakList.length - 2];
            speakList[speakList.length - 2] = temp;
    }

    return speakList;
}