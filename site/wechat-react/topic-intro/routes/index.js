import App from '../../app.js';

import { TopicIntro, TopicIntroEdit, TopicDistributionSet, TopicInvite, FriendInvite } from './topic-intro';

import { ChannelIntro, ChannelSplicingAll, TrainingCampDetails, TrainingCampCertificate } from './channel-intro';

import { NewFinishPay, PaySuccess } from './finish-pay';

import { TrainingIntro, TrainingStudentInfo, TrainingLearn, LearnRecord, TrainingClass, TrainingDetails, TrainingCheckin, TrainingCard, TrainingHomework, TrainingClassService } from './training-intro';

import { FissionFinishPay } from './fission-finish-pay';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        //话题介绍页
        TopicIntro,
        //编辑介绍页
        TopicIntroEdit,
        // 邀请好友学习
        TopicInvite,
        FriendInvite,
	    // 系列课介绍页统一入口
	    ChannelIntro,
        // 话题分销设置
        TopicDistributionSet,
        // 新版支付成功页面
        NewFinishPay,
        PaySuccess,
        // 管理员创建者查看拼课汇总
        ChannelSplicingAll,
        // 训练营详情
        TrainingCampDetails,
        //训练营证书页面
        TrainingCampCertificate,
        // 训练营介绍页
        TrainingIntro,
        // 训练营完善信息
        TrainingStudentInfo,
        // 训练营学习页面
        TrainingLearn,
        // 训练营班级服务
        TrainingClassService,
        // 训练营学习记录
        LearnRecord,
        // 训练营全部课程
        TrainingClass,
        // 训练营详情
        TrainingDetails,
        // 训练营打卡页面
        TrainingCheckin,
        TrainingCard,
        // 训练营作业列表
        TrainingHomework,
        // 裂变课(一元购)支付成功
        FissionFinishPay
    ]
};

export default rootRoute;
