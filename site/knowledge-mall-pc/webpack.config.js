const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const clientPath = path.resolve(__dirname, '../')
const bundlePath = path.join(__dirname, './index.js')
const htmlPath = path.resolve(__dirname, './index.html')
const outputPath = path.join(__dirname, '../../public/knowledge-mall-pc')
const themePath = path.join(__dirname,'theme.js')

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const WebpackUploadPlugin = require('webpack-upload');
const BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin');
const tsImportPluginFactory = require('ts-import-plugin')
const theme = require(themePath)

const modeFlagPlugin = new webpack.DefinePlugin({
    __MODE__: JSON.stringify('dev'),
});

// chunk排序方法
const chunkSortFun = (sortChunksKeys) => {
    if (!sortChunksKeys || !sortChunksKeys.length) {
        return 'dependency';
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
const newHtmlWebpackPlugin = (config) => {
    let chunks = ['manifest', 'common', 'vendor', config.bundle];
    return new HtmlWebpackPlugin({
        filename: `${config.page}.html`,
        template: path.resolve(__dirname, './index.html'),
        chunks: chunks,
        chunksSortMode: chunkSortFun(chunks),
        inject: false,
    });
};


module.exports = {
    context: clientPath,
    entry: {
        bundle: bundlePath,
        common: ['babel-polyfill', 'moment', 'core-decorators'],
        vendor: ['react', 'react-dom', 'redux', 'react-router', 'react-redux', 'redux-thunk'],
    },
    output: {
        path: outputPath,
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        publicPath: '/knowledge-mall-pc/',
    },
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
                use: 'babel-loader?cacheDirectory'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader',
                        // 'less-loader',
                        `less-loader?{"modifyVars":${JSON.stringify(theme)}}`
                    ]
                }),
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        { // pass object instead of array, omiting the `style-loader` part but why? 
                            loader: "typings-for-css-modules-loader",
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
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    autoprefixer({
                                        browsers: ['> 1%', 'Android >= 2.1', 'ios 7', 'firefox >= 15'],
                                    }),
                                ]
                            }
                        },
                        'sass-loader?outputStyle=expanded',
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                exclude: /node_modules/,
                use: 'url-loader?limit=8192&name=img/[name].[hash].[ext]', // inline base64 URLs for <=8k images
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                exclude: /node_modules/,
                use: 'url-loader?limit=1024&name=fonts/[name].[hash].[ext]',
            },
            {
                test: /\.json$/,
                use: 'json-loader',
            }
        ],
    },

    devtool: 'cheap-module-source-map',

    devServer: {
        historyApiFallback: true,
    },

    resolve: {
        extensions: [ '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx','.ts', '.js', '.jsx'], // require 无需后缀
        modules: ['node_modules', 'components'],
        alias: {}
    },

    plugins: [
        new ExtractTextPlugin('[name].[contenthash].css'),
        // new webpack.optimize.ModuleConcatenationPlugin(),
        new BellOnBundlerErrorPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: path.resolve(__dirname, '../'),
                postcss: function () {
                    return [
                        autoprefixer({
                            browsers: ['> 1%', 'Android >= 2.1', 'ios 7', 'firefox >= 15'],
                        })
                    ];
                }
            }
        }),
        new webpack.DefinePlugin({
            // 定义生产环境
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),

        // 公共库会被抽离到vendor.js里
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'common', 'manifest'],
            // filename: '[name].[hash].js',
        }),

        // 比对id的使用频率和分布来得出最短的id分配给使用频率高的模块
        new webpack.optimize.OccurrenceOrderPlugin(),

        // 允许错误不打断程序
        new webpack.NoEmitOnErrorsPlugin(),

        // 实现 css 和 js 动态插入加 Hash
        newHtmlWebpackPlugin({
            page: 'index',
            bundle: 'bundle',
        }),

        new LiveReloadPlugin({
            appendScriptTag: true,
        }),
        modeFlagPlugin,
    ],
};
