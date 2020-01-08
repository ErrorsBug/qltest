import App from '../../app.js';

import { BuyHistory } from './community'
import { communityCenter, communityHome, communityDetail, FanAttention, communityTipic, CommunityListTopic, ExcellentPerson } from './community'


const rootRoute = {
  path: '/wechat/page',
  component: App,
  childRoutes: [
    BuyHistory,
    communityCenter,
    communityHome,
    communityDetail, 
    FanAttention,
    communityTipic,
    CommunityListTopic,
    ExcellentPerson,
  ]
};

export default rootRoute;
