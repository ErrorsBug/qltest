/**
 *
 * @author Dylan
 * @date 2018/11/12
 */
const webpack = require("webpack");
const os = require('os');
const px2rem = require("postcss-px2rem");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BellOnBundlerErrorPlugin = require("bell-on-bundler-error-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackIsomorphicToolsConfig = require('./webpack_isomorphic_tools_config');
const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
const webpack_isomorphic_tools_plugin = new Webpack_isomorphic_tools_plugin(webpackIsomorphicToolsConfig).development();
const path = require("path");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const buildCss = require('../tools/build-css');
buildCss();

// chunk排序方法
const chunkSortFun = sortChunksKeys => {
	if (!sortChunksKeys || !sortChunksKeys.length) {
		return "dependency";
	}

	return (chunk1, chunk2) => {
		let orders = sortChunksKeys;
		let order1 = orders.indexOf(chunk1.names[0]);
		let order2 = orders.indexOf(chunk2.names[0]);

		if (order1 > order2) {
			return 1;
		} else if (order1 < order2) {
			return -1;
		} else {
			return 0;
		}
	};
};
// 创建html-webpack-plugin实例方法
const newHtmlWebpackPlugin = config => {
	// let chunks = ['manifest', 'wechat_react_common', 'wechat_react_vendor', 'common', config.bundle];
	const chunks = ['runtime', 'vendors', 'common', config.bundle];
	return new HtmlWebpackPlugin({
		filename: `${config.page}.html`,
		template: path.resolve(__dirname, './index.html'),
		chunks: chunks,
		chunksSortMode: chunkSortFun(chunks),
		inject: false,
		showErrors: true
	});
};

module.exports = {
	context: path.resolve(__dirname, '../'),
	entry: {
		feedback_bundle: path.join(__dirname, './feedback/index.js'),
		other_pages_bundle: path.join(__dirname, './other-pages/index.js'),
		coral_bundle: path.join(__dirname, './coral/index.js'),
		backstage_bundle: path.join(__dirname, './backstage/index.js'),
		thousand_live_bundle: path.join(__dirname, './thousand-live/index.js'),
		topic_intro_bundle: path.join(__dirname, './topic-intro/index.js'),
		live_studio_bundle: path.join(__dirname, './live-studio/index.js'),
		audio_graphic_bundle: path.join(__dirname, './audio-graphic/index.js'),
		training_camp_bundle: path.join(__dirname, './training-camp/index.js'),
		check_in_camp_bundle: path.join(__dirname, './check-in-camp/index.js'),
		video_course_bundle: path.join(__dirname, './video-course/index.js'),
		coupon_bundle: path.join(__dirname, './coupon/index.js'),
		comment_bundle: path.join(__dirname, './comment/index.js'),
		membership_bundle: path.join(__dirname, './membership/index.js'),
		short_knowledge_bundle: path.join(__dirname, './short-knowledge/index.js'),
		point_bundle: path.join(__dirname, './point/index.js'),
		mine_bundle: path.join(__dirname, './mine/index.js'),
		female_university_bundle: path.join(__dirname, './female-university/index.js'),
		community_bundle: path.join(__dirname, './community/index.js'),
		home_work_bundle: path.join(__dirname, './home-work/index.js'),
		live_center_bundle: path.join(__dirname, './live-center/index.js'),
		common_page_bundle: path.join(__dirname, './common-page/index.js'),
		vendors: ['@babel/polyfill', 'core-decorators', 'dayjs', 'react', 'react-dom', 'redux', 'react-router', 'react-redux', 'redux-thunk'],
	},
	output: {
		path: path.join(__dirname, '../../public/wechat-react'),
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
		publicPath: '/wechat-react/',
		crossOriginLoading:'anonymous',
	},
	performance: { hints: false },
	module: {
		rules: [
			{
				test: /^((?!css\-module).)+\.(css|scss)$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					'happypack/loader?id=css'
				],
			},
			{
				test: /module\.(css|scss)$/,
				exclude: /node_modules/,
				use: [
					'happypack/loader?id=mcss',
				],
			},
		]
	},

	resolve: {
		extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.js', '.jsx', '.ts', '.tsx'], // require 无需后缀
		modules: ['node_modules', path.resolve(__dirname, 'components')],
		alias: webpackIsomorphicToolsConfig.alias,
	},

	plugins: [
		new webpack.optimize.SplitChunksPlugin({
			chunks: "async",
			// maxSize: 30000000,
			minChunks: 1,
			maxAsyncRequests: 3,
			maxInitialRequests: 5,
			name: true,
			cacheGroups: {
				vendors: {
					name: 'vendors',
					chunks: "all",
					priority: 20,
					test: 'vendors',
					enforce: true,
				},
				common: {
					chunks: "initial",
					name: "common",
					minChunks: 3,
					priority: 10,
					reuseExistingChunk: true,
					enforce: true,
				},
				styles: {
					name: "common",
					minChunks: 1,
					test: /assets\/(styles|ql-fonts)/,
					chunks: "all",
				},
			}
		}),
		new HappyPack({
			id: 'css',
			loaders: [
				"css-loader",
				'postcss-loader',
				'sass-loader?outputStyle=expanded',
			],
			threadPool: happyThreadPool,
			// cache: true,
		}),
		new HappyPack({
			id: 'mcss',
			loaders: [
				'isomorphic-style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: true,
						localIdentName: '[local]--[hash:8]',
					}
				},
				'postcss-loader',
				'sass-loader?outputStyle=expanded',
			],
			threadPool: happyThreadPool,
			// cache: true,
		}),
		// new webpack.HashedModuleIdsPlugin(),//用于固定模块id 防止调整顺序对于id进行重新打包
		new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),// 去掉moment的locale
		// new ExtractTextPlugin("[name].[hash].css"),
		new CleanWebpackPlugin(path.resolve(__dirname, '../../public/wechat-react'), {
			root: path.resolve(__dirname, '../../')
		}),
		// new MiniCssExtractPlugin({ filename: `[name].[hash].css` }),
		// new ExtractTextPlugin('[name].css'),
		new BellOnBundlerErrorPlugin(),
		// 比对id的使用频率和分布来得出最短的id分配给使用频率高的模块
		new webpack.optimize.OccurrenceOrderPlugin(),
		// 允许错误不打断程序
		new webpack.NoEmitOnErrorsPlugin(),

		webpack_isomorphic_tools_plugin,
		// new BundleAnalyzerPlugin
	]
};
module.exports.newHtmlWebpackPlugin = newHtmlWebpackPlugin;