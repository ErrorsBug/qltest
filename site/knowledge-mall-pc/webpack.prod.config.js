const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackUploadPlugin = require('webpack-upload');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');


const config = webpackMerge(baseConfig, {
	mode: "production",
	output: {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].chunk.js',
		publicPath: '//static.qianliaowang.com/frontend/rs/knowledge-mall-pc/',
	},
	module: {
		rules: [
			{
				test: /\.(png|jpg|gif|ico|svg)$/,
				exclude: /node_modules/,
				use: `url-loader?limit=3072&name=img/[name].[hash].[ext]`, // inline base64 URLs for <=3k images
			},
			{
				test: /\.(woff|woff2|eot|ttf)$/,
				exclude: /node_modules/,
				use: `url-loader?limit=3072&name=fonts/[name].[hash].[ext]`,
			},
		]
	},
	optimization: {
		moduleIds: 'hashed',
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
			new OptimizeCSSAssetsPlugin({})
		]
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: `[name].[contenthash:8].css` }),
		// 静态资源实现cdn上传
		new WebpackUploadPlugin({
			receiver: 'http://192.168.2.67:5000/receiver',
			// receiver: 'http://47.96.236.73:5000/receiver',//本地测试使用
			to: '/data/res/frontend/rs/knowledge-mall-pc',
			keepLocal: false,
		}),
	]
});


module.exports = config;
