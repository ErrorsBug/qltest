import App from '../../app.js';

import { ThousandLive , GuideLiveShare ,InvitationLive, ThousandLiveVideo, TheLive, TopicListening, TopicDocs, GuestList, TabletAudio, TopicManuscript, CourseDataCard } from './thousand-live';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        //话题详情页
        ThousandLive,
        //话题视频详情页
        ThousandLiveVideo,
        //话题直播详情页
        TheLive,
        // 话题极简模式
        TopicListening,
        // 话题共享文件列表
        TopicDocs,
        // 嘉宾列表
        GuestList,
        // 微信PC端 引导下载音频
        TabletAudio,
        // 听书文稿
        TopicManuscript,
        // 关注
        GuideLiveShare,
        // 邀请
        InvitationLive,
        // 课程数据卡
        CourseDataCard,
    ]
};

export default rootRoute;
