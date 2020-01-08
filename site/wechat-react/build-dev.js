/**
 *
 * @author Dylan
 * @date 2018/11/19
 */
const webpack = require('webpack');
const LiveReloadPlugin = require("webpack-livereload-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const inlineManifestPlugin = require('inline-manifest-webpack-plugin');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const readline = require('readline');
const colors = require('colors');
const os = require('os');
const webpackIsomorphicToolsConfig = require('./webpack_isomorphic_tools_config');
const Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
const webpack_isomorphic_tools_plugin = new Webpack_isomorphic_tools_plugin(webpackIsomorphicToolsConfig).development();

const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const question = (msg) => {
	return new Promise(resolve => {
		rl.question(msg, resolve)
	})
};


const config = webpackMerge(baseConfig, {
	mode: "development",
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
				use: `url-loader?limit=3072&name=fonts/[name].[ext]`,
			},
		],
	},
	optimization: {
		namedChunks: true,
		runtimeChunk: 'single'
	},
	devtool: "cheap-module-source-map",
	devServer: {
		historyApiFallback: true
	},
	plugins: [
		new HappyPack({
			id: 'js',
			threadPool: happyThreadPool,
			loaders: ['babel-loader?cacheDirectory']
		}),
		new MiniCssExtractPlugin({ filename: `[name].css` }),
		new LiveReloadPlugin({
			appendScriptTag: true,
			ignore: /\.(css|js|map|ttf|eot|woff|woff2|png|jpg|gif|svg)$/
		})
	]
});

const entrys = Object.keys(config.entry);

const startBuilding = async function(){
	entrys.forEach(entry => {
		if(entry === 'vendors') return false;
		console.log(entry.replace('_bundle', '').replace(/_/g, '-'))
	});
	const input = await question('输入需要编译的站点(a,b,... or all): \n');

	if(input === 'all' ){
		entrys.forEach(entry => {
			if(entry === 'vendors') return false;
			config.plugins.push(
				config.newHtmlWebpackPlugin({
					page: entry.replace('_bundle', ''),
					bundle: entry,
				})
			)
		})
	}else{
		const originEntry = config.entry;
		config.entry = {};
		const sites = input.split(',');
		const isAllSiteCorrect = sites.every(item => {
			const site = item.replace(/-/g, '_');
			const bundle = `${site}_bundle`;
			if(entrys.indexOf(bundle) > -1){
				config.entry[bundle] = originEntry[bundle];
				config.plugins.push(
					config.newHtmlWebpackPlugin({
						page: site,
						bundle,
					})
				);
				return true;
			}else{
				return false;
			}
		});
		if(!isAllSiteCorrect){
			console.error('you input a wrong site!!! you idiot!!!'.red);
			process.exit();
		}
		config.entry.vendors = originEntry.vendors;
	}
	delete config.newHtmlWebpackPlugin;

	// config.plugins.push(
	// 	new inlineManifestPlugin()
	// )

	const compiler = webpack(config);

	compiler.apply(new webpack.ProgressPlugin());

	compiler.watch({}, (err, stats) => {
		if (err || stats.hasErrors()) {
			console.error(err);
		}
	});
};

startBuilding();
