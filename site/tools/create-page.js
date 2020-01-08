const fs = require('fs')
const path = require('path')
const request = require('request')
const util = require('util')

const workdir = path.resolve(path.join(__dirname, '../wechat-react'))

async function createPage () {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (msg) => {
        return new Promise(resolve => {
            rl.question(msg, resolve)
        })
    }

    const siteName = await question('输入站点名: \n');
    
    
}


if (require.main === module) {
    createPage();
}
