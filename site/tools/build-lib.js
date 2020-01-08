const readline = require('readline')
const fs = require('fs')
const path = require('path')
const request = require('request')
const util = require('util')
const crypto = require('crypto')

const publicPath = '//res.dev1.qlchat.com/rs/wechat-react/';
const workdir = path.resolve(path.join(__dirname, '../wechat-react'))

/**
 * 上传库文件到CDN
 */
async function uploadLibrary (env = 'dev1') {
    let uploadServer;

    switch (env) {
        case 'dev1':
        case 'dev2':
        case 'test1':
        case 'test2':
        case 'test3':
        case 'test4':
        case 'huidu':
        case 'prod':
            uploadServer = 'http://receiver.dev1.qlchat.com/receiver'
            break;
    
        default:
            uploadServer = 'http://receiver.dev1.qlchat.com/receiver'
            break;
    }

    console.log('target serve: ' + uploadServer);

    let libs = [
        'react.min.js',
        'react-dom.min.js',
    ]

    const urls = await Promise.all(libs.map(item => {
        if (item === '.DS_Store') {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            let hash = calcFileHash(`./libs/${item}`)
            let filename = item.replace(/(\.js$)/, `.${hash.slice(0, 8)}$1`);

            request.post({
                url: uploadServer,
                formData: {
                    to: `/data/nodeapp/resources/rs/wechat-react/${filename}`,
                    file: fs.createReadStream(`./libs/${item}`)
                }
            }, (err, httpResponse, body) => {
                if (err) {
                    console.error(`[${new Date().toLocaleTimeString()}] put error -- `, err);
                    reject();
                } else {
                    console.log(`[${new Date().toLocaleTimeString()}] put success -- ${filename}`);
                    resolve(publicPath + filename);
                }
            })
        })
    }));

    try {
        let htmlContent = fs.readFileSync(path.join(workdir, 'index.html'), 'utf8')
        let scripts = urls.map(item => `<script type="text/javascript" src="${item}"></script>`).join('')

        htmlContent = htmlContent.replace(/(<!-- __lib_scripts_start__ -->).*(<!-- __lib_scripts_end__ -->)/, `$1${scripts}$2`)

        fs.writeFileSync(path.join(workdir, 'index.html'), htmlContent, 'utf8')
    } catch (error) {
        console.error(error);
    }
}

/**
 * 计算文件hash
 * @param {*} filePath 文件路径
 */
function calcFileHash (filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    let fsHash = crypto.createHash('md5')
    fsHash.update(fileContent)
    return fsHash.digest('hex')
}

module.exports = uploadLibrary;

if (require.main === module) {
    (async () => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const question = (msg) => {
            return new Promise(resolve => {
                rl.question(msg, resolve)
            })
        }

        env = await question('输入环境(one of dev1,dev2,tes1,test2,test3,test4,prod,huidu): \n');

        await uploadLibrary(env);

        console.log(`[${new Date().toLocaleTimeString()}] 更新lib完成`);

        process.exit();
    })();
}
