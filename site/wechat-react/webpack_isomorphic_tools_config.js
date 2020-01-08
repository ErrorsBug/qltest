var path = require('path');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports = {
    debug: false,
    assets: {
        images: {
            extensions: ['png', 'jpg', 'gif', 'ico', 'svg'],
        },
        html: {
			extension: 'html',
		},
		fonts: {
			extensions: ['woff', 'woff2', 'eot', 'ttf'],
		},
        styles: {
            extensions: [],
	     //    filter: function(module, regularExpression, options, log)
	     //    {
		 //        if (options.development)
		 //        {
			//         // In development mode there's Webpack "style-loader",
			//         // which outputs `module`s with `module.name == asset_path`,
			//         // but those `module`s do not contain CSS text.
			//         //
			//         // The `module`s containing CSS text are
			//         // the ones loaded with Webpack "css-loader".
			//         // (which have kinda weird `module.name`)
			//         //
			//         // Therefore using a non-default `filter` function here.
			//         //
			//         return WebpackIsomorphicToolsPlugin.styleLoaderFilter(module, regularExpression, options, log)
		 //        }
        //
		 //        // In production mode there will be no CSS text at all
		 //        // because all styles will be extracted by Webpack Extract Text Plugin
		 //        // into a .css file (as per Webpack configuration).
		 //        //
		 //        // Therefore in production mode `filter` function always returns non-`true`.
	     //    },
	     //    path: WebpackIsomorphicToolsPlugin.styleLoaderPathExtractor,
	     //    parser: WebpackIsomorphicToolsPlugin.cssLoaderParser
        },
    },
	webpack_assets_file_path: 'webpack-assets.json',
	webpack_stats_file_path: 'webpack-stats.json',

    // to resolve "TypeError: require.context is not a function" or "TypeError: require.ensure is not a function"
    patch_require: true,

    alias: {
        components: path.resolve(__dirname, './components'),
        assets: path.resolve(__dirname, './assets'),

        common_actions: path.resolve(__dirname, './actions'),

        actions: path.resolve(__dirname, './other-pages/actions'),
        reducers: path.resolve(__dirname, './other-pages/reducers'),
        containers: path.resolve(__dirname, './other-pages/containers'),

	    coral_actions: path.resolve(__dirname, './coral/actions'),
	    coral_reducers: path.resolve(__dirname, './coral/reducers'),
	    coral_containers: path.resolve(__dirname, './coral/containers'),

        thousand_live_actions: path.resolve(__dirname, './thousand-live/actions'),
        thousand_live_reducers: path.resolve(__dirname, './thousand-live/reducers'),
        thousand_live_containers: path.resolve(__dirname, './thousand-live/containers'),
        thousand_live_components: path.resolve(__dirname, './thousand-live/components'),

        studio_actions: path.resolve(__dirname, './live-studio/actions'),
        studio_reducers: path.resolve(__dirname, './live-studio/reducers'),
        studio_containers: path.resolve(__dirname, './live-studio/containers'),
    }
};
