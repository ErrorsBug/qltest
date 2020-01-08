const readline = require('readline')
const fs = require('fs')
const path = require('path')
const request = require('request')
const util = require('util')
const webpack = require('webpack');

// build tools
const buildLib = require('./build-lib')
const buildCss = require('./build-css')

// webpack config
const webpackConfig = require('../wechat-react/webpack.config')

const workdir = path.resolve(path.join(__dirname, '../wechat-react'))
const sites = listSites();
console.log(sites);

(async () => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    try {
        
        const question = (msg) => {
            return new Promise(resolve => {
                rl.question(msg, resolve)
            })
        }
  
        const site = await question('输入需要编译的站点(a,b,... or all): \n');
        const env = 'dev1'
        // const env = await question('输入环境(one of dev1,dev2,tes1,test2,test3,test4,prod,huidu): \n');
        // const updateLib = await question('是否更新库文件到cdn(Y/N) \n')

        // if (updateLib === 'Y' || updateLib === 'y') {
        //     buildLib(env)
        // }

        buildCss();

        buildWebpack(site, env);
    } catch (error) {
        console.error(error);
    } finally {
        rl.close();
    }
    
})();

/**
 * 获取当前的所有站点
 */
function listSites () {
    const exclude = [
        'actions',
        'components',
        'assets',
    ]
    
    let ls = fs.readdirSync(workdir)

    return ls.filter(item => (
        fs.statSync(path.join(workdir, item)).isDirectory() && !exclude.find(_item => _item === item)
    ));
}

/**
 * webpack 编译
 * @param {*} site 
 * @param {*} env 
 */
function buildWebpack (site, env) {
    const entrys = webpackConfig.entry;
    webpackConfig.entry = {};

    if (site === 'all') {
        webpackConfig.entry = entrys;

        // 添加全部bundle对应的html plugin
        for (const key in entrys) {
            if (entrys.hasOwnProperty(key) && key !== 'wechat_react_common' && key !== 'wechat_react_vendor') {

                webpackConfig.plugins.push(
                    webpackConfig.newHtmlWebpackPlugin({
                        page: key.replace('_bundle', ''),
                        bundle: key,
                    })
                )
            }
        }
    } else {
        site.split(',')
            .forEach(item => {
                let key = item.replace(/-/g, '_')
                webpackConfig.entry[key + '_bundle'] = entrys[key + '_bundle']
                // 有多少bundle就添加多少html plugin
                webpackConfig.plugins.push(
                    webpackConfig.newHtmlWebpackPlugin({
                        page: key,
                        bundle: key + '_bundle',
                    })
                )
                
            });

        webpackConfig.entry.wechat_react_common = entrys.wechat_react_common;
        webpackConfig.entry.wechat_react_vendor = entrys.wechat_react_vendor;
    }


    delete webpackConfig.newHtmlWebpackPlugin;
    const compiler = webpack(webpackConfig)

    compiler.apply(new webpack.ProgressPlugin())


    compiler.watch({}, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.error(err);
        }
    })
}
