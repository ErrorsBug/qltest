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
const tsImportPluginFactory = require('ts-import-plugin');
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');
const path = require("path");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });


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
	const chunks = ['styles', 'vendors', 'common', config.bundle];
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
		bundle: path.join(__dirname, './index.js'),
		vendors: ['@babel/polyfill', 'core-decorators', 'react', 'react-dom', 'redux', 'react-router', 'react-redux', 'redux-thunk'],
	},
	output: {
		path: path.join(__dirname, '../../public/knowledge-mall-pc'),
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
		publicPath: '/knowledge-mall-pc/'
	},
	optimization: {
		runtimeChunk: 'single',
		moduleIds: 'hashed',
		namedChunks: true,
		splitChunks: {
			cacheGroups: {
				styles: {
					name: 'styles',
					test: /\.(s?css|less)$/,
					chunks: 'all',
					enforce: true,
				},
				// chunk: {
				// 	name: 'async',
				// 	chunks: 'async',
				// 	enforce: true,
				// }
			},
		},
	},
	performance: { hints: false },
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
					getCustomTransformers: () => ({
						before: [tsImportPluginFactory({
							libraryName: 'antd',
							libraryDirectory: 'es',
							style: true
						})]
					}),
					compilerOptions: {
						module: 'es2015',
					},
				},
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'happypack/loader?id=js'
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'less-loader',
						options: require(path.join(__dirname,'theme.js'))
					}
				],
			},
			{
				test: /\.(css|scss)$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					'happypack/loader?id=css'
				],
			},
			{
				test: /\.(png|jpg|gif|ico|svg)$/,
				exclude: /node_modules/,
				use: `url-loader?limit=3072&name=img/[name]${process.env.NODE_ENV === 'production' ? '.[hash]' : ''}.[ext]`, // inline base64 URLs for <=3k images
			},
			{
				test: /\.(woff|woff2|eot|ttf)$/,
				exclude: /node_modules/,
				use: `url-loader?limit=3072&name=fonts/[name]${process.env.NODE_ENV === 'production' ? '.[hash]' : ''}.[ext]`,
			},
		]
	},

	resolve: {
		extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx'], // require 无需后缀
		modules: ['node_modules', 'components'],
		alias: {},
	},
	plugins: [
		new HappyPack({
			id: 'js',
			threadPool: happyThreadPool,
			loaders: ['babel-loader?cacheDirectory']
		}),
		new HappyPack({
			id: 'css',
			loaders: [
				{ // pass object instead of array, omiting the `style-loader` part but why?
					loader: "css-loader",
					options: {
						modules: true,
						importLoaders: 2,
						localIdentName: "[name]_[local]_[hash:base64]",
						namedExport: true,
						camelCase: true,
						// minimize: true,
						sourceMap: true
					}
				},
				'postcss-loader',
				'sass-loader?outputStyle=expanded',
			],
			threadPool: happyThreadPool,
			// cache: true,
		}),
		new CleanWebpackPlugin(path.resolve(__dirname, '../../public/knowledge-mall-pc'), {
			root: path.resolve(__dirname, '../../')
		}),
		new BellOnBundlerErrorPlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// 允许错误不打断程序
		new webpack.NoEmitOnErrorsPlugin(),

		newHtmlWebpackPlugin({
			page: 'index',
			bundle: 'bundle',
		}),

		new InlineManifestPlugin()

		// new BundleAnalyzerPlugin
	]
};