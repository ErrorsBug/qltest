(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

/***/ "./wechat-react/mine/components/portal-com/index.js":
/*!**********************************************************!*\
  !*** ./wechat-react/mine/components/portal-com/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _reactDom = __webpack_require__(/*! react-dom */ "../node_modules/react-dom/index.js");

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "../node_modules/classnames/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _default =
/*#__PURE__*/
function (_Component) {
  _inherits(_default, _Component);

  function _default() {
    _classCallCheck(this, _default);

    return _possibleConstructorReturn(this, _getPrototypeOf(_default).apply(this, arguments));
  }

  _createClass(_default, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          parentNode = _this$props.parentNode,
          _onClick = _this$props.onClick;
      var cls = (0, _classnames.default)('protal-box', className);
      var node = document.querySelector("".concat(parentNode || '.portal-high'));
      if (!node) return null;
      return (0, _reactDom.createPortal)(_react.default.createElement("div", {
        className: cls,
        onClick: function onClick(e) {
          _onClick && _onClick(e);
        }
      }, children), node);
    }
  }]);

  return _default;
}(_react.Component);

exports.default = _default;

/***/ }),

/***/ "./wechat-react/mine/containers/logout-rule/index.js":
/*!***********************************************************!*\
  !*** ./wechat-react/mine/containers/logout-rule/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _util = __webpack_require__(/*! components/util */ "./wechat-react/components/util.js");

var _camp = __webpack_require__(/*! ../../actions/camp */ "./wechat-react/mine/actions/camp.js");

var _page = _interopRequireDefault(__webpack_require__(/*! components/page */ "./wechat-react/components/page/index.js"));

var _portalCom = _interopRequireDefault(__webpack_require__(/*! ../../components/portal-com */ "./wechat-react/mine/components/portal-com/index.js"));

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

var LogOutRule = (0, _coreDecorators.autobind)(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(LogOutRule, _Component);

  function LogOutRule() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, LogOutRule);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(LogOutRule)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      mobile: ''
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "agreeLogout", function () {
      if (_this.state.mobile) {
        (0, _util.locationTo)('/wechat/page/mine/verification-vode');
      } else {
        window.toast('尚未绑定手机！');
      }
    });

    return _this;
  }

  _createClass(LogOutRule, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getUserInfo();
    } // 获取用户信息

  }, {
    key: "getUserInfo",
    value: function () {
      var _getUserInfo = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _ref, user;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _camp.userInfo)();

              case 2:
                _ref = _context.sent;
                user = _ref.user;
                this.setState({
                  mobile: (user === null || user === void 0 ? void 0 : user.mobile) || ''
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getUserInfo() {
        return _getUserInfo.apply(this, arguments);
      }

      return getUserInfo;
    }()
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(_page.default, {
        title: "\u6CE8\u9500\u8D26\u53F7",
        className: "logout-rule"
      }, _react.default.createElement("div", {
        className: "logout-rule-box"
      }, _react.default.createElement("div", {
        className: "notice"
      }, _react.default.createElement("div", {
        className: "importance"
      }, _react.default.createElement("img", {
        src: "https://img.qlchat.com/qlLive/activity/image/KTT7AMFI-Z8Q5-QANP-1577949308250-GMYX6S5N3JCO.png"
      }), _react.default.createElement("p", null, "\u91CD\u8981")), _react.default.createElement("div", {
        className: "notice-content"
      }, _react.default.createElement("p", null, "\u6CE8\u9500\u8D26\u53F7\u4E3A\u4E0D\u53EF\u6062\u590D\u64CD\u4F5C\uFF0C\u6CE8\u9500 \u8D26\u53F7\u540E\u60A8\u5C06\u65E0\u6CD5\u627E\u56DE\u672C\u8D26\u53F7\uFF0C\u53CA\u672C\u8D26\u53F7\u76F8\u5173 \u7684\u5185\u5BB9\u4E0E\u4FE1\u606F\uFF1B"))), _react.default.createElement("div", {
        className: "earnest-read"
      }, _react.default.createElement("p", null, "\u5728\u60A8\u6CE8\u9500\u5343\u804A\u8D26\u53F7\u4E4B\u524D\uFF0C\u8BF7\u60A8\u8BA4\u771F\u9605\u8BFB\uFF0C\u7406\u89E3\u5E76", _react.default.createElement("br", null), "\u540C\u610F\u4E00\u4E0B\u5185\u5BB9\uFF1A")), _react.default.createElement("div", {
        className: "condition"
      }, _react.default.createElement("p", {
        className: "title"
      }, "\u4E00\u3001\u6CE8\u9500\u8D26\u53F7\u9700\u8981\u6EE1\u8DB3\u4EE5\u4E0B\u6761\u4EF6"), _react.default.createElement("p", null, "1\u3001\u8BE5\u8D26\u53F7\u5FC5\u987B\u8981\u5148\u7ED1\u5B9A\u624B\u673A\u53F7\u7801\uFF1B"), _react.default.createElement("p", null, "2\u3001\u6CA1\u6709\u8D44\u4EA7\u3001\u6B20\u6B3E\u3001\u672A\u7ED3\u6E05\u7684\u8D44\u91D1\u548C\u865A\u62DF\u6743\u76CA\uFF1B"), _react.default.createElement("p", null, "3\u3001\u8D26\u53F7\u72B6\u6001\u5F02\u5E38\uFF1B")), _react.default.createElement("div", {
        className: "condition"
      }, _react.default.createElement("p", {
        className: "title"
      }, "\u4E8C\u3001\u6CE8\u9500\u8D26\u53F7\u540E\u60A8\u5C06\u65E0\u6CD5\u627E\u56DE\u672C\u8D26\u53F7\uFF0C\u53CA\u8D26\u53F7\u76F8\u5173 \u7684\u4EFB\u4F55\u5185\u5BB9\u4E0E\u500C\u606F\uFF0C\u5305\u62EC\u4F46\u4E0D\u9650\u4E8E"), _react.default.createElement("p", null, "1\u3001\u8BE5\u8D26\u53F7\u5FC5\u987B\u8981\u5148\u7ED1\u5B9A\u624B\u673A\u53F7\u7801\uFF1B"), _react.default.createElement("p", null, "2\u3001\u6CA1\u6709\u8D44\u4EA7\u3001\u6B20\u6B3E\u3001\u672A\u7ED3\u6E05\u7684\u8D44\u91D1\u548C\u865A\u62DF\u6743\u76CA\uFF1B"))), _react.default.createElement(_portalCom.default, {
        className: "agree-bottom",
        onClick: this.agreeLogout
      }, "\u6211\u7406\u89E3\u5E76\u540C\u610F\uFF0C\u4ECD\u8981\u6CE8\u9500"));
    }
  }]);

  return LogOutRule;
}(_react.Component)) || _class;

var mapStateToProps = function mapStateToProps(state) {};

var mapActionToProps = {};
module.exports = (0, _reactRedux.connect)(mapStateToProps, mapActionToProps)(LogOutRule);

/***/ })

}]);
//# sourceMappingURL=9.chunk.js.map