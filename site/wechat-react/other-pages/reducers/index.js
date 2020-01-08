import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as recommend from './recommend';
import * as chargeRecommend from './charge-recommend';
import * as freeRecommend from './free-recommend';
import * as myShares from './my-shares';
import * as nightAnswer from './night-answer';
import * as channel from './channel';
import * as topicInfo from './topic';
import * as live from './live';
import * as shareCard from './share-card';
import * as shareIncome from './share-income-flow';
import * as channelListSort from './channel-list-sort';
import * as topicListSort from './topic-list-sort';
import * as channelIntro from './channel-intro';
import * as channelDistribution from './channel-distribution';
import * as coupon from './coupon';
import * as channelGroup from './channel-group';
import * as finishPay from './finish-pay';
import * as periodCourse from './period-course';
import * as complain from './complain';
import * as channelGroupList from './channel-group-list';
import * as mine from './mine';
import * as profit from './profit'
import * as lowPriceRecommend from './low-price-recommend';
import * as evaluation from './evaluation';
import * as channelEdit from './channel-edit';
import * as channelStatistics from './channel-statistics'
import * as homework from './homework';
import * as joinList from './join-list';
import * as guestSeparate from './guest-separate';
import * as timeline from './timeline'
import * as activity from './activity.js'
import * as fansActive from './fans-active';
import * as giftPackage from './exclusive-gift-package';
import * as excellentCourse from './excellent-course';
import * as distribution from './distribution';
import * as vip from './vip.js';
import * as messages from './messages';
import * as choice from './choice';
import * as memberInfo from './member';
import * as books from './books'
import * as noticeCenter from './notice-center';

const routers = {
    ...common,
    ...excellentCourse,
    ...recommend,
    ...chargeRecommend,
    ...freeRecommend,
    ...lowPriceRecommend,
    ...myShares,
    ...nightAnswer,
    ...activity,
    ...channel,
    ...channelStatistics,
    ...channelEdit,
    ...channelDistribution,
    ...topicInfo,
    ...live,
    ...shareCard,
    ...shareIncome,
    ...channelListSort,
    ...topicListSort,
    ...channelIntro,
    ...periodCourse,
    ...coupon,
    ...channelGroup,
    ...finishPay,
    ...complain,
    ...channelGroupList,
    ...mine,
    ...profit,
    ...evaluation,
    ...homework,
    ...guestSeparate,
    ...joinList,
    ...timeline,
    ...fansActive,
    ...giftPackage,
    ...distribution,
    ...vip,
    ...messages,
    ...choice,
    ...memberInfo,
    ...books,
    ...noticeCenter,
    routing: routerReducer
}

export default client => {
    if (client && typeof client.reducer === 'function') {
        routers.apollo = client.reducer();
    }

    return combineReducers(routers);
}
