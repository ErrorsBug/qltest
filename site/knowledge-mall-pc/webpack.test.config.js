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
		publicPath: '//res.dev1.qlchat.com/rs/knowledge-mall-pc/',
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
                sourceMap: true,
                extractComments: true
            }),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: `[name].[contenthash:8].css` }),
		// 静态资源实现cdn上传
		new WebpackUploadPlugin({
			// dev1的外网域名
			// receiver: 'http://receiver.dev1.qlchat.com/receiver',
			// dev1的内网ip
			receiver: 'http://10.105.47.220:8102/receiver',
			to: '/data/nodeapp/resources/rs/knowledge-mall-pc',
			keepLocal: true,
		}),
	]
});


module.exports = config;
