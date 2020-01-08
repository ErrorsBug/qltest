import { RouterContext } from 'react-router';
import { ApolloClient, ApolloProvider, renderToStringWithData } from 'react-apollo';
import { createStore } from 'redux';
import React from 'react'

const Graphql = require('graphql')
const {createLocalInterface} = require('apollo-local-query')
const routerMatch = require('../../components/isomorphic-router-match').routerMatch;
const htmlProcessor = require('../../components/html-processor/html-processor');

import schema from '../../graphql';

// function endTime (startTime, msg) {
//     var _serverRequestEndTime = process.hrtime(),
//         ms = (_serverRequestEndTime[0] - startTime[0]) * 1e3 +
//     (_serverRequestEndTime[1] - startTime[1]) * 1e-6;
//
//     console.log(`[stress test]: ${msg};耗时 ${ms} ms`);
// }

export default function apolloHandler ({ htmlPath, routers, reducers, defaultHandlers }) {

    return (handlers, isNoSSr) => {
        let handlerResult = [];
        if (handlers instanceof Array) {
            handlerResult = [...defaultHandlers, ...handlers]
        } else if (typeof handlers === 'function') {
            handlerResult = [...defaultHandlers, handlers]
        } else {
            isNoSSr = true;
            handlerResult = [...defaultHandlers]
        }

        return async (req, res, next) => {
            // var startTime = process.hrtime();
            const options = {
                filePath: htmlPath,
                renderData: {
                    html: '',
                    aliVideoPlayerjs: false
                },
                fillVars: {
                    __INIT_STATE__: null
                }
            }

            const networkInterface = createLocalInterface(
                Graphql,
                schema,
                {
                    rootValue: { req, res },
                }
            );

            const client = new ApolloClient({
                ssrMode: true,
                networkInterface,
            });

            try {
                const renderProps = await routerMatch(req, res, routers);

                const reducersResult = reducers(client);

                // 构建store
                let store = createStore(reducersResult);

                for (let h of handlerResult) {
                    const result = h(req, res, store, options);
                    if (result instanceof Promise) {
                        store = await result;
                    } else {
                        store = result;
                    }

                    if (!store) {
                        return;
                    }
                }

                // 开启服务端渲染
                if (!isNoSSr) {
	                const css = new Set();
	                const context = { insertCss: (...styles) => styles.forEach(style => {
		                css.add(style._getCss());
	                }) };
                    let htmlDom = (
                        <ApolloProvider store={store} client={client}>
                            <RouterContext
                                {...renderProps}
                                createElement={(Component, props) => <Component {...props} context={context} />}
                            />
                        </ApolloProvider>
                    );

                    let content = await renderToStringWithData(htmlDom);

	                options.renderData.css = [...css].join('');
                    options.renderData.html = content;
                }

                let state = null;
                if (client.store && typeof client.store.getState === 'function') {
                    state = {...store.getState(), ...client.store.getState()};
                } else {
                    state = store.getState();
                }


                options.fillVars.__INIT_STATE__ = state;

                htmlProcessor(req, res, next, options);
            } catch (error) {
                console.error(error);
                res.render('500');
            }
        }
    }
}
