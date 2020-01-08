import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as common from './common';
import * as topicIntro from './topic-intro';
import * as channel from './channel';
import * as channelIntro from './channel-intro';
import * as splicingAll from './splicing-all';
import * as topicIntroEdit from './topic-intro-edit';
import * as evaluation from './evaluation';
import * as channelDistribution from './channel-distribution';
import * as memberInfo from './member';
import * as campInfo from './training';

import live from './live';

export default _ => combineReducers({
    ...common,
    ...topicIntro,
    ...channel,
    ...channelIntro,
    ...topicIntroEdit,
    ...evaluation,
    ...channelDistribution,
    ...splicingAll,
    ...memberInfo,
    ...campInfo,
    live,
    routing: routerReducer,
})
