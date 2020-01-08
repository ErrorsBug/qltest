/**
 *
 * @author Dylan
 * @date 2018/11/12
 */
const fs = require('fs');
const webpack = require("webpack");
const os = require('os');
const px2rem = require("postcss-px2rem");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BellOnBundlerErrorPlugin = require("bell-on-bundler-error-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');
const path = require("path");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const entrys = {};
const htmlPlugins = [];
const pages = fs.readdirSync(path.join(__dirname, './pages'));

// -------------------- 构建页面入口
pages.forEach(item => {
	if (/\.DS_Store/.test(item)) {
		return;
	}

	entrys[item] = path.join(__dirname, `./pages/${item}/index.js`);

	if (!fs.existsSync(entrys[item])) {
		entrys[item] = path.join(__dirname, `./pages/${item}/index.tsx`);
	}

	if (!fs.existsSync(entrys[item])) {
		console.error(`无效页面${item} -- 找不到文件./pages/${item}/index.js 或 ./pages/${item}/index.ts`);
		return;
	}

	// 默认用页面里面的index.html文件但模板，如果没有文件就用template.html
	if (fs.existsSync(path.join(__dirname, `./pages/${item}/index.html`))) {
		htmlPlugins.push(
			new HtmlWebpackPlugin({
				filename: `${item}.html`,
				template: path.join(__dirname, `./pages/${item}/index.html`),
				chunks: ['vendor', item],
				inject: false,
			})
		);
	} else {
		htmlPlugins.push(
			new HtmlWebpackPlugin({
				filename: `${item}.html`,
				template: path.join(__dirname, './template.html'),
				chunks: ['vendor', item],
				inject: false,
			})
		);
	}
})
// vendor配置
entrys.vendor = ['@babel/polyfill', 'react', 'react-dom'];

module.exports = {
	context: path.resolve(__dirname, '../'),
	entry: entrys,
	output: {
		path: path.join(__dirname, '../../public/activity-react'),
		filename: '[name].js',
		publicPath: '/activity-react/',
	},
	performance: { hints: false },
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						}
					}
				]
			},
			{
				test: /\.(css|scss)$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					'happypack/loader?id=css'
				],
			},
		]
	},
	resolve: {
		extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx'], // require 无需后缀
		modules: ['node_modules']
	},
	optimization: {
		namedChunks: true,
		runtimeChunk: 'single'
	},
	plugins: [
		new webpack.optimize.SplitChunksPlugin({
			chunks: "all",
			minSize: 0,
			// maxSize: 30000000,
			minChunks: 1,
			maxAsyncRequests: 3,
			maxInitialRequests: 3,
			name: true,
			cacheGroups: {
				vendor: {
					name: 'vendor',
					chunks: "all",
					priority: 20,
					test: 'vendor',
				},
				styles: {
					name: "common",
					minChunks: 1,
					test: /assets\/(styles|ql-fonts)/,
					chunks: "all",
				},
			}
		}),
		// new webpack.optimize.RuntimeChunkPlugin({
		// 	name: "manifest"
		// }),
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
		...htmlPlugins,
		new CleanWebpackPlugin(path.resolve(__dirname, '../../public/activity-react'), {
			root: path.resolve(__dirname, '../../')
		}),
		new BellOnBundlerErrorPlugin(),
		// 比对id的使用频率和分布来得出最短的id分配给使用频率高的模块
		new webpack.optimize.OccurrenceOrderPlugin(),
		// 允许错误不打断程序
		new webpack.NoEmitOnErrorsPlugin(),
		new InlineManifestPlugin(),

		// new BundleAnalyzerPlugin
	]
};