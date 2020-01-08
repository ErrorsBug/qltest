import App from '../../app.js';

import { BuyHistory } from './buy'
import { LogOutRule } from './logout-rule'
import { EnterLogout } from './enter-logout'
import { VerificationCode } from './verification-code'

const UserInfo = {
  path: 'mine/user-info',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/user-info').default)
      })
  }
};


const BusinessPaymentTakeincome = {
  path: 'mine/business-payment-takeincome',
  getComponent: function(nextState, callback) {
    require.ensure([], (require) => {
      callback(null, require('../containers/business-payment-takeincome').default)
    })
  }
}

const TakeincomeRecord = {
  path: 'mine/takeincome-record',
  getComponent: function(nextState, callback) {
    require.ensure([], (require) => {
      callback(null, require('../containers/takeincome-record').default)
    })
  }
}



const rootRoute = {
  path: '/wechat/page',
  component: App,
  childRoutes: [
    BuyHistory,
    LogOutRule,
    EnterLogout,
    VerificationCode,
    UserInfo,
    BusinessPaymentTakeincome,
    TakeincomeRecord
  ]
};

export default rootRoute;
