const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackUploadPlugin = require('webpack-upload');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const os = require('os');
const webpackIsomorphicToolsConfig = require('./webpack_isomorphic_tools_config');
const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
const webpack_isomorphic_tools_plugin = new Webpack_isomorphic_tools_plugin(webpackIsomorphicToolsConfig).development();
const TerserPlugin = require('terser-webpack-plugin');

const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');

const config = webpackMerge(baseConfig, {
	mode: "production",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: 'happypack/loader?id=js'
			},
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						}
					}
				]
			},
			{
				test: webpack_isomorphic_tools_plugin.regular_expression('images'),
				exclude: /node_modules/,
				use: `url-loader?limit=3072&name=img/[name].[hash].[ext]`, // inline base64 URLs for <=8k images
			},
			{
				test: webpack_isomorphic_tools_plugin.regular_expression('fonts'),
				exclude: /node_modules/,
				use: `url-loader?limit=3072&name=fonts/[name].[hash].[ext]`,
			},
		],
	},
	output: {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].chunk.js',
		publicPath: '//res.dev1.qlchat.com/rs/wechat-react/',
	},
	optimization: {
		runtimeChunk: 'single',
		moduleIds: 'hashed',
		namedChunks: true,
		minimizer: [
			new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                extractComments: true
            }),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: { safe: true, zindex: false, discardComments: { removeAll: true } },
			})
		]
	},
	plugins: [
		new HappyPack({
			id: 'js',
			threadPool: happyThreadPool,
			loaders: ['babel-loader?cacheDirectory']
		}),
		new MiniCssExtractPlugin({ filename: `[name].[contenthash:8].css` }),
		// 静态资源实现cdn上传
		new WebpackUploadPlugin({
			// dev1的外网域名
			// receiver: 'http://receiver.dev1.qlchat.com/receiver',
			// dev1的内网ip
			receiver: 'http://10.105.47.220:8102/receiver',
			to: '/data/nodeapp/resources/rs/wechat-react',
			keepLocal: true,
		}),
		// new WebpackUploadPlugin({
		// 	receiver: 'http://localhost:5001/receiver',
		// 	to: '/Users/dylanssg/project/qlchat/cdn-test',
		// 	keepLocal: true,
		// }),
	]
});

Object.keys(config.entry).forEach(entry => {
	if(entry === 'vendors') return false;
	config.plugins.push(
		config.newHtmlWebpackPlugin({
			page: entry.replace('_bundle', ''),
			bundle: entry,
		})
	)
});

// config.plugins.push(
// 	new InlineManifestPlugin()
// )

delete config.newHtmlWebpackPlugin;

module.exports = config;
