export const mallManage = {
    path: 'manage',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/mall-manage').default)
        })
    },
}

export const userPortrait = {
    path: 'user-portrait',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/user-portrait').default)
        })
    },
}


export const mallIndex = {
    path: 'index',
    getComponent: function (nextState, callback) {
        require.ensure([], (require) => {
            callback(null, require('../containers/mall-index').default);
        });
    },
}

// export const LiveTable = {
//     path: 'table',
//     getComponent: function (nextState, callback) {
//         require.ensure([], (require) => {
//             callback(null, require('../containers/live-table'))
//         })
//     },
// }

// export const LiveOverview = {
//     getComponent: function (nextState, callback) {
//         require.ensure([], (require) => {
//             callback(null, require('../containers/live-overview'))
//         })
//     },
// }


// export const LiveManage = {
//     path: 'manage',
//     childRoutes: [
//         AddFunctionModule,
//         FunctionModuleList,
//         liveHomeSetting,
//         shareTemplate,
//         drainageControl
//     ],
    
//     getComponent: function (nextState, callback) {
//         require.ensure([], (require) => {
//             callback(null, require('../containers/live-manage'))
//         })
//     },
//     // getComponent: function (nextState, callback) {
//     //     require.ensure([], (require) => {
//     //         callback(null, require('../containers/live-home'))
//     //     })
//     // },

//     getIndexRoute: function(location,cb) {
//         cb(null, liveHomeSetting);
//     }
// }