const uas = {
    'win10': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',

    'win7': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',

    'mac': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',

    'ipad': 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',

    'iphone': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',

    'iphone 6s wechat': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16B92 MicroMessenger/6.7.4(0x1607042c) NetType/WIFI Language/zh_CN',

    's8 wechat': 'Mozilla/5.0 (Linux; Android 8.0; SM-G9500 Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044406 Mobile Safari/537.36 MMWEBID/3504 MicroMessenger/6.7.3.1360(0x2607033C) NetType/WIFI Language/zh_CN Process/tools',

    's8 chrome': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G9500) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.80 Mobile Safari/537.36',

    'vivo wechat': 'Mozilla/5.0 (Linux; Android 5.0.2; vivo X5Pro D Build/LRX21M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044405 Mobile Safari/537.36 MicroMessenger/6.6.7.1321(0x26060739) NetType/WIFI Language/zh_CN',

    'Honor wechat': 'Mozilla/5.0 (Linux; Android 4.4.2; CHM-UL00 Build/HonorCHM-UL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044403 Mobile Safari/537.36 MicroMessenger/6.6.6.1300(0x26060638) NetType/WIFI Language/zh_CN',

    'xiaomi mix2 wechat': 'Mozilla/5.0 (Linux; Android 8.0; MIX 2 Build/OPR1.170623.027; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044405 Mobile Safari/537.36 MMWEBID/7542 MicroMessenger/6.7.3.1360(0x2607033C) NetType/WIFI Language/zh_CN Process/tools',
}


const analyseUa = require('./analyse-ua');

for (let k in uas) {
    let ua = uas[k];

    let ana = analyseUa(ua);

    console.log(ana)
    console.log('------')
}


