const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackUploadPlugin = require('webpack-upload');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const inlineManifestPlugin = require('inline-manifest-webpack-plugin');
const ShakePlugin = require('webpack-common-shake').Plugin;
const webpackIsomorphicToolsConfig = require('./webpack_isomorphic_tools_config');
const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
const webpack_isomorphic_tools_plugin = new Webpack_isomorphic_tools_plugin(webpackIsomorphicToolsConfig).development();

const config = webpackMerge(baseConfig, {
	mode: "production",
	output: {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].chunk.js',
		publicPath: '//static.qianliaowang.com/frontend/rs/wechat-react/',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					},
				]
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
	optimization: {
		moduleIds: 'hashed',
		namedChunks: true,
		runtimeChunk: 'single',
		minimizer: [
			new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                extractComments: true,
				terserOptions: {
					warnings: false,
					compress: {
						pure_funcs: ['console.log']
					},
				}
            }),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: { safe: true, zindex: false, discardComments: { removeAll: true } },
			})
		]
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: `[name].[contenthash:8].css` }),
		// gulp会把js都编译成commonjs，所以需要这个插件做tree-shaking
		new ShakePlugin(),
		// 静态资源实现cdn上传
		new WebpackUploadPlugin({
			receiver: 'http://192.168.2.67:5000/receiver',
			// receiver: 'http://47.96.236.73:5000/receiver',//本地测试使用
			to: '/data/res/frontend/rs/wechat-react',
			keepLocal: false,
		})
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
// 	new inlineManifestPlugin()
// )

delete config.newHtmlWebpackPlugin;

module.exports = config;
