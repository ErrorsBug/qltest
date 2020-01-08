(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ "./wechat-react/components/app-sdk-hoc/index.js":
/*!******************************************************!*\
  !*** ./wechat-react/components/app-sdk-hoc/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _envi = __webpack_require__(/*! components/envi */ "./wechat-react/components/envi.js");

var _appSdk = _interopRequireDefault(__webpack_require__(/*! components/app-sdk */ "./wechat-react/components/app-sdk.js"));

var _util = __webpack_require__(/*! components/util */ "./wechat-react/components/util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 用于调用app(安卓、IOS)相关的方法
 * @param {*} WrappedComponent
 * @returns
 */
var HandleAppFunHoc = function HandleAppFunHoc(WrappedComponent) {
  return (
    /*#__PURE__*/
    function (_Component) {
      _inherits(_class2, _Component);

      function _class2() {
        var _getPrototypeOf2;

        var _this;

        _classCallCheck(this, _class2);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_class2)).call.apply(_getPrototypeOf2, [this].concat(args)));

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleAppSdkFun", function (event) {
          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          if ((0, _envi.isQlchat)()) {
            var data = _objectSpread({}, params);

            if (data.callback) {
              delete data.callback;
              delete data.success;
              delete data.fail;
            }

            if ((0, _envi.isAndroid)()) {
              _appSdk.default[event](data); // 安卓回调兼容


              _appSdk.default.onSuccess('onSuccess', function () {
                params.callback && params.callback();
              });
            }

            if ((0, _envi.isIOS)()) {
              var _window, _window$webkit;

              delete data.callback;
              (_window = window) === null || _window === void 0 ? void 0 : (_window$webkit = _window.webkit) === null || _window$webkit === void 0 ? void 0 : _window$webkit.messageHandlers[event].postMessage(_objectSpread({}, data, {
                callBackEventName: "window.".concat(event, "Call") // 触发函数名称

              })); // IOS调用回调函数,触发函数

              window[event + 'Call'] = function (responseData) {
                params.callback && params.callback(responseData);
              };
            }
          }
        });

        _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleAppSecondary", function (url) {
          var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          if ((0, _envi.isQlchat)()) {
            var _window2, _window2$webkit, _window2$webkit$messa;

            if (!url.includes('https') && !url.includes('http')) {
              url = location.origin + url;
            }

            if ((0, _envi.isIOS)() && !((_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$webkit = _window2.webkit) === null || _window2$webkit === void 0 ? void 0 : (_window2$webkit$messa = _window2$webkit.messageHandlers) === null || _window2$webkit$messa === void 0 ? void 0 : _window2$webkit$messa.pushNativePage) || (0, _envi.isAndroid)() && !_appSdk.default.pushNativePage) {
              (0, _util.locationTo)(url);
            } else {
              var obj = _objectSpread({
                entry: {
                  "target": "webpage",
                  "webUrl": url
                }
              }, params);

              _this.handleAppSdkFun('pushNativePage', _objectSpread({}, obj));
            }
          } else {
            (0, _util.locationTo)(url);
          }
        });

        return _this;
      }

      _createClass(_class2, [{
        key: "onSuccess",
        // 用于安卓回调
        value: function onSuccess(event, cb) {
          var _window3, _window3$WebViewJavas;

          (_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$WebViewJavas = _window3.WebViewJavascriptBridge) === null || _window3$WebViewJavas === void 0 ? void 0 : _window3$WebViewJavas.registerHandler(event, function (data, responseCallback) {
            cb();
          });
        } // 处理app二级跳转

      }, {
        key: "render",
        value: function render() {
          return _react.default.createElement(WrappedComponent, _extends({}, this.props, {
            onSuccess: this.onSuccess,
            handleAppSdkFun: this.handleAppSdkFun,
            handleAppSecondary: this.handleAppSecondary
          }));
        }
      }]);

      return _class2;
    }(_react.Component)
  );
};

var _default = HandleAppFunHoc;
exports.default = _default;

/***/ }),

/***/ "./wechat-react/components/app-sdk.js":
/*!********************************************!*\
  !*** ./wechat-react/components/app-sdk.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var envi = __webpack_require__(/*! ./envi */ "./wechat-react/components/envi.js");

var urlutils = __webpack_require__(/*! ./url-utils */ "./wechat-react/components/url-utils.js");

var appSdk = {
  /**
   * 跳转到原生页面
   * version: 2.0.0
   * @Author   fisher<wangjiang.fly.1989@163.com>
   * @DateTime 2016-11-16T11:25:57+0800
   * @param    {[type]}                           url [description]
   * @return   {[type]}                               [description]
   */
  linkTo: function linkTo(url, oriUrl) {
    var protocol = 'qlchat://';
    var link = protocol + url;

    if (oriUrl) {
      var search = new URL(oriUrl).search;
      var shareKey = urlutils.getUrlParams('shareKey', search);
      var lshareKey = urlutils.getUrlParams('lshareKey', search);
      var newSearch = '';
      shareKey && (newSearch += '&shareKey=' + shareKey);
      lshareKey && (newSearch += '&lshareKey=' + lshareKey);

      if (newSearch && /\?.*(?=\b|#)/.test(link)) {
        newSearch && (link += newSearch);
      } else {
        newSearch && (link += '?' + newSearch.splice(1));
      }
    }

    window.location.href = link;
  },

  /**
   * 新webview打开页面
   * @Author   fisher<wangjiang.fly.1989@163.com>
   * @DateTime 2016-12-29T17:34:10+0800
   * @param    {[type]}                           url [description]
   * @return   {[type]}                               [description]
   */
  goWebPage: function goWebPage(url) {
    var ver = envi.getQlchatVersion();

    if (ver && ver >= 210) {
      if (url.indexOf('http') < 0) {
        url = window.location.protocol + window.location.host + url;
      }

      this.linkTo('dl/webpage?url=' + encodeURIComponent(url));
    } else {
      window.location.href = url;
    }
  },

  /**
   * app开启分享
   * @Author   fisher<wangjiang.fly.1989@163.com>
   * @DateTime 2017-02-27T17:22:19+0800
   * @param    {[type]}                           opts [description]
   * @return   {[type]}                                [description]
   */
  share: function share(opts) {
    opts = opts || {};
    this.linkTo('dl/share/link?' + 'title=' + encodeURIComponent(opts.wxqltitle || '') + '&content=' + encodeURIComponent(opts.descript || '') + '&shareUrl=' + encodeURIComponent(opts.shareUrl || '') + '&thumbImageUrl=' + encodeURIComponent(opts.wxqlimgurl || ''));
  },
  ready: function ready() {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function') {
      qlchat.ready(function () {});
    }
  },

  /**
   * 支持回调的分享调起协议
   * 支持版本：>= 3.6
   * @param  {[type]} opts 分享的参数配置
   *  opts: {
   *  	type: 'link' 或 'image'    表示分享的类型为链接或图片，默认为'link'
   *  	content:   ''    要分享的链接或图片（可传base64), 在type为'link'时，默认取当前页地址。其它type时，该参数必传
   *  	title: 分享标题，不传默认为页面标题
   *  	desc: 分享描述
   *  	thumbImage： 缩略图链接或者base64
   *
   *  }
   * @return {[type]}      [description]
   */
  shareAndCallback: function shareAndCallback(opts) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && opts) {
      opts = opts || {}; // 默认分享页面

      opts.type = opts.type || 'link'; // 默认使用当前页面链接

      if (!opts.content && opts.type === 'link') {
        opts.content = window.location.href;
      } // 必要参数校验


      if (!opts.content) {
        throw Error('缺少分享配置参数: content');
        return;
      }

      opts.title = opts.title || document.title;
      console.log('share config:', opts);
      qlchat.ready(function () {
        qlchat.share({
          type: opts.type,
          // "link" "image"
          content: opts.content,
          // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
          title: opts.title,
          desc: opts.desc || '',
          thumbImage: opts.thumbImage || '',
          // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
          success: opts.success || function (res) {},
          // 成功回调
          fail: opts.fail || function (err) {
            console.error(err);
          } // 失败回调

        });
      });
    }
  },

  /**
   * 分享配置，用于app三个点调起的分享初始化
   * 支持版本：>= 3.6
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  shareConfig: function shareConfig(opts) {
    if (typeof qlchat != 'undefined' && opts) {
      opts = opts || {}; // 默认分享页面

      opts.type = opts.type || 'link'; // 默认使用当前页面链接

      if (!opts.content && opts.type === 'link') {
        opts.content = window.location.href;
      } // 必要参数校验


      if (!opts.content) {
        throw Error('缺少分享配置参数: content');
        return;
      }

      opts.title = opts.title || document.title;
      console.log('share config:', opts);
      var shareConfig = {
        type: opts.type,
        // "link" "image"
        content: opts.content,
        // 根据 type 区别，如果是image可以传图片的链接或者 base64EncodedString，都需要进行 URLDecode
        title: opts.title,
        desc: opts.desc || '',
        thumbImage: opts.thumbImage || '',
        // 缩略图，可以是图片的链接或者 base64EncodedString，都需要进行 URLDecode
        success: opts.success || function (res) {},
        // 成功回调
        fail: opts.fail || function (err) {
          console.error(err);
        } // 失败回调

      };
      qlchat.ready(function () {
        // Todo 还没有支持分享到哪里的定制，默认全部配置
        if (qlchat.onMenuShareWeChatTimeline) {
          qlchat.onMenuShareWeChatTimeline(shareConfig);
        }

        if (qlchat.onMenuShareWeChatFriends) {
          qlchat.onMenuShareWeChatFriends(shareConfig);
        }

        if (qlchat.onMenuShareWeibo) {
          qlchat.onMenuShareWeibo(shareConfig);
        }
      });
    }
  },

  /**
   * app支付封装
   * 支持版本：>= 3.6
   * @param  {[type]} params 支付传参。具体参数参考app支付接口文档
   * @return {[type]}        [description]
   */
  pay: function pay(params) {
    // console.log('pay params: ', params);
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.pay(params || {});
      });
    }
  },

  /**
   * 用于页面加载完成，  获取整个页面HTML
   */
  onLoadedHtml: function onLoadedHtml(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function') {
      qlchat.ready(function () {
        qlchat.onLoadedHtml(params || '');
      });
    }
  },

  /**
   * 保存图片
   * @param {*} url 
   */
  saveImage: function saveImage(params) {
    // alert(JSON.stringify(params))
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.saveImage(params);
      });
    }
  },

  /**
   * 分享图片到微信
   * @param {*} params 
   */
  shareImageToWeChat: function shareImageToWeChat(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function') {
      qlchat.ready(function () {
        qlchat.shareImageToWeChat(params || '');
      });
    }
  },

  /**
   * 分享图片到微信朋友圈
   * @param {*} params 
   */
  shareImageToWeChatCircle: function shareImageToWeChatCircle(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function') {
      qlchat.ready(function () {
        qlchat.shareImageToWeChatCircle(params || '');
      });
    }
  },

  /**
   * 一次性订阅
   * @param {*} params 
   */
  sendSubscribeMessage: function sendSubscribeMessage(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.sendSubscribeMessage(params || '');
      });
    }
  },

  /**
   * 跳转app原生页面
   * @param {*} params 
   */
  callNativeView: function callNativeView(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.callNativeView(params || '');
      });
    }
  },

  /**
   * 女子大学补卡支付调用 安卓
   * @param {*} params 
   */
  resign: function resign(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.resign(params || '');
      });
    }
  },

  /**
   * 体验营支付 app
   * @param {*} params 
   */
  commonOrder: function commonOrder(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.commonOrder(params || '');
      });
    }
  },

  /**
   * 体验营支付后一次性订阅 app
   * @param {*} params 
   */
  commonSubscribeMessage: function commonSubscribeMessage(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.commonSubscribeMessage(params || '');
      });
    }
  },

  /**
   * 表单采集提交
   * @param {*} params 
   */
  checkFormAction: function checkFormAction(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.checkFormAction(params || '');
      });
    }
  },

  /**
   * 全新app跳转方式（开启APP二级页面）
   * @param {*} params 
   */
  pushNativePage: function pushNativePage(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.pushNativePage(params || '');
      });
    }
  },

  /**
   * 退出当前页面
   * @param {*} params 
   */
  popPage: function popPage(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.popPage(params || '');
      });
    }
  },

  /**
   * 退出登录
   * @param {*} params 
   */
  logoutAction: function logoutAction(params) {
    if (typeof qlchat != 'undefined' && typeof qlchat.ready === 'function' && params) {
      qlchat.ready(function () {
        qlchat.logoutAction(params || '');
      });
    }
  }
};
var _default = appSdk;
exports.default = _default;

/***/ }),

/***/ "./wechat-react/mine/containers/enter-logout/index.js":
/*!************************************************************!*\
  !*** ./wechat-react/mine/containers/enter-logout/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _camp = __webpack_require__(/*! ../../actions/camp */ "./wechat-react/mine/actions/camp.js");

var _appSdkHoc = _interopRequireDefault(__webpack_require__(/*! components/app-sdk-hoc */ "./wechat-react/components/app-sdk-hoc/index.js"));

var _page = _interopRequireDefault(__webpack_require__(/*! components/page */ "./wechat-react/components/page/index.js"));

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EnterLogout = (0, _appSdkHoc.default)(_class = (0, _coreDecorators.autobind)(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(EnterLogout, _Component);

  function EnterLogout() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, EnterLogout);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EnterLogout)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      enterBox: false //确认注销和取消按钮

    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "enterLogoutBtn", function (val) {
      var enterBox = val;

      _this.setState({
        enterBox: enterBox
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "giveUp", function () {
      _this.props.handleAppSdkFun('popPage', {});
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "enter",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _camp.cancelId)();

            case 2:
              res = _context.sent;

              if (res.state.code == 0) {
                _this.props.handleAppSdkFun('logoutAction', {});
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));

    return _this;
  }

  _createClass(EnterLogout, [{
    key: "render",
    value: function render() {
      var enterBox = this.state.enterBox;
      return _react.default.createElement(_page.default, {
        title: "\u786E\u8BA4\u6CE8\u9500",
        className: "enter-logout"
      }, _react.default.createElement("div", {
        className: "enter-logout-box"
      }, _react.default.createElement("div", {
        className: "title"
      }, _react.default.createElement("p", null, "\u786E\u8BA4\u6CE8\u9500")), _react.default.createElement("div", {
        className: "enter-logout-content"
      }, _react.default.createElement("p", null, "\u4E3A\u9632\u6B62\u8BEF\u64CD\u4F5C\uFF0C\u5E7F\u5DDE\u6C90\u601D\u4FE1\u606F\u79D1\u6280\u6709\u9650\u516C\u53F8\u53CA\u5173\u8054\u516C\u53F8\uFF08\u4EE5\u4E0B\u7B80\u79F0\u201C\u6211\u4EEC\u201D\uFF09\u6DF1\u77E5\u4E2A\u4EBA\u4FE1\u606F\u5BF9\u60A8\u7684\u91CD\u8981\u6027\uFF0C\u6211\u4EEC\u5C06\u6309\u6CD5\u5F8B\u6CD5\u89C4\u548C\u4E1A\u754C\u6210\u719F\u7684\u5B89\u5168\u6807\u51C6\uFF0C\u91C7\u53D6\u76F8\u5E94\u7684\u5B89\u5168\u4FDD\u62A4\u63AA\u65BD\uFF0C")), _react.default.createElement("div", {
        className: "buttom"
      }, _react.default.createElement("div", {
        className: "enter-logout-bottom"
      }, _react.default.createElement("p", {
        onClick: this.enterLogoutBtn.bind(this, true)
      }, "\u786E\u8BA4\u6CE8\u9500")), _react.default.createElement("div", {
        className: "give-up"
      }, _react.default.createElement("p", {
        onClick: this.giveUp
      }, "\u653E\u5F03"))), enterBox && _react.default.createElement("div", {
        className: "logout-pop-up"
      }, _react.default.createElement("div", {
        className: "pop-up"
      }, _react.default.createElement("p", {
        className: "pop-up-title"
      }, "\u6CE8\u9500\u8D26\u53F7"), _react.default.createElement("p", {
        className: "enter-title"
      }, "\u786E\u8BA4\u6CE8\u9500\u5417\uFF1F"), _react.default.createElement("button", {
        className: "cancel",
        onClick: this.enterLogoutBtn.bind(this, false)
      }, "\u53D6\u6D88"), _react.default.createElement("button", {
        className: "enter",
        onClick: this.enter
      }, "\u786E\u8BA4")))));
    }
  }]);

  return EnterLogout;
}(_react.Component)) || _class) || _class;

var mapStateToProps = function mapStateToProps(state) {};

var mapActionToProps = {};
module.exports = (0, _reactRedux.connect)(mapStateToProps, mapActionToProps)(EnterLogout);

/***/ })

}]);
//# sourceMappingURL=6.chunk.js.map