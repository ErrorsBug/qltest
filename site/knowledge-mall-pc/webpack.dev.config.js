const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");

const config = webpackMerge(baseConfig, {
	mode: "development",
	module: {
		rules: [
			{
				test: /\.(png|jpg|gif|ico|svg)$/,
				exclude: /node_modules/,
				use: `url-loader?limit=3072&name=img/[name].[ext]`, // inline base64 URLs for <=3k images
			},
			{
				test: /\.(woff|woff2|eot|ttf)$/,
				exclude: /node_modules/,
				use: `url-loader?limit=3072&name=fonts/[name].[ext]`,
			},
		]
	},
	devtool: "cheap-module-source-map",
	devServer: {
		historyApiFallback: true
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: `[name].css`, chunkFilename: "[id].css" }),
		new LiveReloadPlugin({
			appendScriptTag: true
		})
	]
});

module.exports = config;
