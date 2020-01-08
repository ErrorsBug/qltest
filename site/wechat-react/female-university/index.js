import "@babel/polyfill";
import 'isomorphic-fetch';

// import './assets/styles/reset.css';
// import './components/dialog/styles.css';
import './styles.js';

import React from 'react';
import {render, hydrate} from 'react-dom';
import {browserHistory, Router, useRouterHistory, match } from 'react-router';
import {createHistory} from 'history';
import thunkMiddleware from 'redux-thunk';

import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import {syncHistoryWithStore, routerReducer, routerMiddleware} from 'react-router-redux';

import rootRoute from './routes';
import rootReducers from './reducers';

let history = useRouterHistory(createHistory)();

const router = routerMiddleware(history);

const middlewares = [router, thunkMiddleware];

const store = compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(rootReducers(null), window.__INIT_STATE__ || {});

history = syncHistoryWithStore(history, store);

// match 解决router的异步组件请求还未成功时，导致react渲染空组件，从而与服务端渲染代码对不上的问题
match({ history, routes: rootRoute }, (error, redirectLocation, renderProps) => {
    const { location } = renderProps;
    hydrate((
        <Provider store={store} key="provider">
          <Router history={history} routes={rootRoute} {...renderProps}>

          </Router>
        </Provider>
    ), document.getElementById('app'));
});