import '@babel/polyfill';
import 'isomorphic-fetch';

import React from 'react';
import {render,hydrate} from 'react-dom';
import {browserHistory, Router, useRouterHistory, match } from 'react-router';
import {createHistory} from 'history';
import thunkMiddleware from 'redux-thunk';

import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import {syncHistoryWithStore, routerReducer, routerMiddleware} from 'react-router-redux';
import rootRoute from './routes/';
import rootReducers from './reducers';

let history = useRouterHistory(createHistory)();

const router = routerMiddleware(history);

const mode = 'dev';

const middlewares = [router, thunkMiddleware];
    
const store = compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
)(createStore)(rootReducers(null), window.__INIT_STATE__);

history = syncHistoryWithStore(history, store);
// render((
//     <Provider store={store}>
//         <Router history={history} routes={rootRoute}/>
//     </Provider>
// ), document.getElementById('app'));
match({ history, routes: rootRoute }, (error, redirectLocation, renderProps) => {
    hydrate((
        <Provider store={store} key="provider">
            <Router history={history} routes={rootRoute} {...renderProps}>

            </Router>
        </Provider>
    ), document.getElementById('app'));
});