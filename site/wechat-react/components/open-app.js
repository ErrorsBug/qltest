var yingyongbao = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live';



/**
 * 

调用方法：
openApp({
  h5,                       // app内要打开的页面链接，此处app会解析h5链接
  ct: 'appzhuanshu',        // appStore渠道参数，可选
  ckey: 'CK1422980938180',  // 应用宝渠道参数，可选
})

本质：
跳到https://m.qlchat.com/wechat/page/open-app?[上面的三分参数]


本方法对android微信做了特殊处理，直接跳到应用宝（产品要求），其他情况跳中转页

 *
 */
export default function (options) {
  options || (options = {});
  var ct = options.ct; // appStore渠道参数
  var ckey = options.ckey;  // 应用宝渠道参数
  ckey && (yingyongbao += '&ckey=' + ckey);

  // 更换主域名
  var h5 = options.h5 || '';
  // var match = h5.match(/(https?:)?(\/\/([^:\/?#]*))?(:(\d*))?([^?#]*)?(\?[^#]*)?(#.*)?/);
  // h5 = location.protocol + location.host + (match[6] || '') + (match[7] || '') + (match[8] || '');

  var ua = navigator.userAgent;
  var isAndroid = /android/i.test(ua);
  var isWechat = /MicroMessenger/i.test(ua);
  

  // 带上scheme的应用宝链接
  var yingyongbaoFull = yingyongbao;
  if (isAndroid) yingyongbaoFull += '&android_schema=' + encodeURIComponent('qlchat://?h5=' + encodeURIComponent(h5));


  // 拼装open-app.html的页面参数
  var openAppUrl = 'https://m.qlchat.com/wechat/page/open-app';
  var queryStr = '';
  var query = {h5, ct, ckey};
  for (var i in query) {
    queryStr += (queryStr && '&') + i + '=' + encodeURIComponent(query[i]);
  }
  openAppUrl += (queryStr && '?') + queryStr;

  if (isWechat && isAndroid) {
    location.href = yingyongbaoFull;
  } else {
    location.href = openAppUrl;
  }
}
