import { RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import React from 'react'

const routerMatch = require('../../components/isomorphic-router-match').routerMatch;
const htmlProcessor = require('../../components/html-processor/html-processor');

// function endTime (startTime, msg) {
//     var _serverRequestEndTime = process.hrtime(),
//         ms = (_serverRequestEndTime[0] - startTime[0]) * 1e3 +
//     (_serverRequestEndTime[1] - startTime[1]) * 1e-6;
//
//     console.log(`[stress test]: ${msg};耗时 ${ms} ms`);
// }



export default function reduxHandler ({ htmlPath, routers, reducers, defaultHandlers }) {

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

            try {

                const reducersResult = reducers();

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

                // 需要服务端渲染
                if (!isNoSSr) {
                    // 需要服务端渲染才去匹配routers
	                const renderProps = await routerMatch(req, res, routers);
	                const css = new Set();
	                const context = { insertCss: (...styles) => styles.forEach(style => {
                        if(style._getCss){
	                        css.add(style._getCss());
                        }
                    }) };
	                let htmlDom = (
                        <Provider store={store}>
                            <RouterContext
                                {...renderProps}
                                createElement={(Component, props) => <Component {...props} context={context} />}
                            />
                        </Provider>
                    );
                    let content = await renderToString(htmlDom);
                    options.renderData.css = [...css].join('');
                    options.renderData.html = content;
                }

                let state = store.getState();

                options.fillVars.__INIT_STATE__ = state;
                htmlProcessor(req, res, next, options);

            } catch (error) {
                console.error(error);
                res.render('500');
            }
        }
    }
}
