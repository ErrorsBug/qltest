export const BuyHistory = {
  path: 'test',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/test'))
      })
  }
};

// 社区广场
export const communityCenter = {
  path: 'university/community-center',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/community-center'))
      })
  }
};
// 首页
export const communityHome = {
  path: 'university/community-home',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/community-home'))
      })
  }
};

// 想法详情页
export const communityDetail = {
  path: 'university/community-detail',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/community-detail'))
      })
  }
};
// 想法详情页
export const communityTipic = {
  path: 'university/community-topic',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/community-topic'))
      })
  }
};

// 粉丝列表
export const FanAttention = {
  path: 'university/fan-attention',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/fan-attention'))
      })
  }
};


// 话题列表
export const CommunityListTopic = {
  path: 'university/community-list-topic',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/community-list-topic'))
      })
  }
};

// 优秀校友
export const ExcellentPerson = {
  path: 'community/excellent-person',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/excellent-person'))
      })
  }
};