import App from '../../app.js';

import { Payment } from './payment'

const Jump = {
  path: 'share-card-subscribe',
  getComponent: function(nextState, callback) {
      require.ensure([], (require) => {
          callback(null, require('../containers/share-card-subscribe'))
      })
  }
};


const rootRoute = {
  path: '/wechat/page',
  component: App,
  childRoutes: [
    Payment,
    Jump
  ]
};

export default rootRoute;
