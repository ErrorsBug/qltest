(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./wechat-react/components/page/index.js":
/*!***********************************************!*\
  !*** ./wechat-react/components/page/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordRouteHistory = recordRouteHistory;
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _detect = _interopRequireDefault(__webpack_require__(/*! ../detect */ "./wechat-react/components/detect.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 用于修改网页标题和 body class 等
 */
var Page =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Page, _PureComponent);

  function Page() {
    _classCallCheck(this, Page);

    return _possibleConstructorReturn(this, _getPrototypeOf(Page).apply(this, arguments));
  }

  _createClass(Page, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      // this.reconfigWx();
      recordRouteHistory();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;

      var _this$props = this.props,
          title = _this$props.title,
          cs = _this$props.cs,
          _this$props$banpv = _this$props.banpv,
          banpv = _this$props$banpv === void 0 ? false : _this$props$banpv,
          description = _this$props.description,
          keyword = _this$props.keyword;
      console.log(this.props);
      this.setClass(cs);
      this.setTitle(title);
      this.setMeta('description', description);
      this.setMeta('keyword', keyword);
      if (!banpv) setTimeout(function () {
        _this.pvLog();
      }, 0);
    }
  }, {
    key: "pvLog",
    value: function pvLog() {
      // let router = getRouter();
      // if (router && router.location && router.location.action === 'PUSH') {
      typeof _qla != 'undefined' && _qla('pv', {}); // }
    }
  }, {
    key: "reconfigWx",
    value: function reconfigWx() {
      var wxConfig = document.querySelector('#wxConfig');

      if (wxConfig) {
        wxConfig.parentNode.removeChild(wxConfig);
      }

      var script = document.createElement('script');
      script.id = 'wxConfig';
      script.src = "/api/js-sdk/wx?actions=hide_all&".concat(Date.now());
      document.body.appendChild(script);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this$props2 = this.props,
          title = _this$props2.title,
          cs = _this$props2.cs,
          description = _this$props2.description,
          keyword = _this$props2.keyword;

      if (nextProps.title !== title) {
        this.setTitle(nextProps.title);
      }

      if (nextProps.cs !== cs) {
        this.setClass(nextProps.cs);
      }

      if (nextProps.description !== description) {
        this.setMeta('description', nextProps.description);
      }

      if (nextProps.keyword !== keyword) {
        this.setMeta('keyword', nextProps.keyword);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props3 = this.props,
          title = _this$props3.title,
          cs = _this$props3.cs;
      this.removeClass(cs);
    }
  }, {
    key: "setTitle",
    value: function setTitle(title) {
      if (title) {
        document.title = title;
      } // Magic iPhone 微信需要通过加载 iframe 来刷新 title


      if (_detect.default.os.ios && _detect.default.os.weixin) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "/favicon.ico");
        iframe.style.display = 'none';
        iframe.addEventListener('load', function () {
          setTimeout(function () {
            //iframe.removeEventListener('load');
            document.body.removeChild(iframe);
          }, 0);
        });
        document.body.appendChild(iframe);
      }
    }
  }, {
    key: "setMeta",
    value: function setMeta(name, content) {
      if (!name || !content) return;
      var meta = document.querySelector("meta[name='".concat(name, "']"));

      if (!meta) {
        meta = document.createElement('meta');
        document.getElementsByTagName('head')[0].appendChild(meta);
      }

      meta.content = content;
      meta.name = name;
    }
  }, {
    key: "setClass",
    value: function setClass(cs) {
      if (cs) {
        document.body.classList.add(cs);
      }
    }
  }, {
    key: "removeClass",
    value: function removeClass(cs) {
      if (cs) {
        document.body.classList.remove(cs);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          Component = _this$props4.component,
          cs = _this$props4.cs,
          title = _this$props4.title,
          props = _objectWithoutProperties(_this$props4, ["component", "cs", "title"]);

      return _react.default.createElement(_react.Fragment, null, _react.default.createElement(Component, _extends({}, props, {
        ref: function ref(el) {
          return _this2.containerRef = el;
        }
      }), this.props.children), _react.default.createElement("div", {
        className: "co-win-course-eval-container"
      }));
    }
  }]);

  return Page;
}(_react.PureComponent);

Page.propTypes = {
  component: _propTypes.default.any,
  title: _propTypes.default.string,
  description: _propTypes.default.string,
  keyword: _propTypes.default.string,
  cs: _propTypes.default.string
};
Page.defaultProps = {
  component: 'div',
  title: '',
  description: '',
  keyword: '',
  cs: ''
};
var _default = Page;
/**
 * 记录页面路由到sessionStorage
 * 相同url只记录一次，最大记录长度为2
 * 
 * ！！！切记获取上一页url时要用相对index，避免以后修改最大长度
 */

exports.default = _default;

function recordRouteHistory() {
  if (typeof location !== 'undefined' && typeof sessionStorage !== 'undefined') {
    try {
      var key = 'ROUTE_HISTORY';
      var routes = JSON.parse(sessionStorage.getItem(key));
      routes instanceof Array || (routes = []);

      if (routes[routes.length - 1] != location.href) {
        routes.push(location.href);
        if (routes.length > 2) routes.shift();
        sessionStorage.setItem(key, JSON.stringify(routes));
      }
    } catch (e) {}
  }
}

/***/ }),

/***/ "./wechat-react/mine/actions/camp.js":
/*!*******************************************!*\
  !*** ./wechat-react/mine/actions/camp.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userInfo = exports.cancelId = exports.checkoutCode = exports.sendValidCode = void 0;

var _common = __webpack_require__(/*! common_actions/common */ "./wechat-react/actions/common.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//请求验证码
var sendValidCode =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(params) {
    var res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _common.request.post({
              url: '/api/wechat/sendValidCode',
              showLoading: false,
              body: _objectSpread({}, params)
            }).then(function (res) {
              if (res.state && res.state.code !== 0) {
                throw new Error(res.state.msg);
              }

              return res;
            }).catch(function (err) {
              window.toast(err.message);
            });

          case 2:
            res = _context.sent;
            return _context.abrupt("return", res);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function sendValidCode(_x) {
    return _ref.apply(this, arguments);
  };
}(); //校验验证码


exports.sendValidCode = sendValidCode;

var checkoutCode =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(params) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _common.request.post({
              url: '/api/wechat/transfer/baseApi/h5/validCode/check',
              body: _objectSpread({}, params)
            }).then(function (res) {
              if (res.state && res.state.code !== 0) {
                throw new Error(res.state.msg);
              }

              return res;
            }).catch(function (err) {
              window.toast(err.message);
            });

          case 2:
            res = _context2.sent;
            return _context2.abrupt("return", res);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function checkoutCode(_x2) {
    return _ref2.apply(this, arguments);
  };
}(); //注销账号


exports.checkoutCode = checkoutCode;

var cancelId =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(params) {
    var res;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _common.request.post({
              url: '/api/wechat/transfer/baseApi/h5/user/invalidUser',
              body: _objectSpread({}, params)
            }).then(function (res) {
              if (res.state && res.state.code !== 0) {
                throw new Error(res.state.msg);
              }

              return res;
            }).catch(function (err) {
              window.toast(err.message);
            });

          case 2:
            res = _context3.sent;
            return _context3.abrupt("return", res);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function cancelId(_x3) {
    return _ref3.apply(this, arguments);
  };
}(); //获取用户信息


exports.cancelId = cancelId;

var userInfo =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(params) {
    var res;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _common.request.post({
              url: '/api/wechat/transfer/baseApi/h5/user/get',
              body: _objectSpread({}, params)
            }).then(function (res) {
              if (res.state && res.state.code !== 0) {
                throw new Error(res.state.msg);
              }

              return res;
            }).catch(function (err) {
              window.toast(err.message);
            });

          case 2:
            res = _context4.sent;
            return _context4.abrupt("return", res && res.data || {});

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function userInfo(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.userInfo = userInfo;

/***/ })

}]);
//# sourceMappingURL=1.chunk.js.map