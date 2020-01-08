(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[11],{

/***/ "./wechat-react/mine/containers/verification-code/index.js":
/*!*****************************************************************!*\
  !*** ./wechat-react/mine/containers/verification-code/index.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _page = _interopRequireDefault(__webpack_require__(/*! components/page */ "./wechat-react/components/page/index.js"));

var _util = __webpack_require__(/*! components/util */ "./wechat-react/components/util.js");

var _camp = __webpack_require__(/*! ../../actions/camp */ "./wechat-react/mine/actions/camp.js");

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
      // 手机号码
      phoneNumber: '',
      // 是否获取验证码
      getCaptchaFlag: false,
      // 间隔秒数
      secondsCounter: 60,
      //秒数显示
      timer: false,
      // 验证码
      codeNum: {
        code1: '',
        code2: '',
        code3: '',
        code4: '',
        code5: '',
        code6: ''
      },
      messageId: ''
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "data", {
      // 定时器ID
      intervalTimer: 0
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "componentDidMount",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.getPhone();

              _this.inputRes1.focus();

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "checkPhoneNumber", function () {
      if (_this.state.phoneNumber != '') {
        var phoneNumber = _this.state.phoneNumber;
        return (0, _util.validLegal)('phoneNum', '手机号码', phoneNumber);
      } else {
        return;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getPhone",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var _ref3, user;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _camp.userInfo)();

            case 2:
              _ref3 = _context2.sent;
              user = _ref3.user;

              _this.setState({
                phoneNumber: user.mobile || ''
              }, function () {
                _this.getCaptcha();
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getMassageId", function (val) {
      _this.setState({
        messageId: val
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getCaptcha",
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var _result$state;

      var secondsCounter, intervalTimer, result, _result$state2;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (_this.checkPhoneNumber()) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return", false);

            case 2:
              _this.setState({
                getCaptchaFlag: true
              });

              secondsCounter = _this.state.secondsCounter;
              intervalTimer = _this.data.intervalTimer = setInterval(function () {
                if (secondsCounter > 1) {
                  var timer = true;

                  _this.setState({
                    secondsCounter: --secondsCounter,
                    timer: timer
                  });
                } else {
                  var _timer = false;
                  clearInterval(intervalTimer);

                  _this.setState({
                    getCaptchaFlag: false,
                    secondsCounter: 60,
                    timer: _timer
                  });
                }
              }, 1000);
              _context3.next = 7;
              return (0, _camp.sendValidCode)({
                phoneNum: _this.state.phoneNumber
              });

            case 7:
              result = _context3.sent;

              if ((result === null || result === void 0 ? void 0 : (_result$state = result.state) === null || _result$state === void 0 ? void 0 : _result$state.code) === 0) {
                _this.getMassageId(result.data.messageId);

                _this.data.messageId = result.data.messageId;
              } else {
                // 发送短息验证码失败
                window.toast((result === null || result === void 0 ? void 0 : (_result$state2 = result.state) === null || _result$state2 === void 0 ? void 0 : _result$state2.msg) || "发送短息验证码失败");

                _this.setState({
                  getCaptchaFlag: false,
                  secondsCounter: 60
                });
              }

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "skipToEnterPage", function () {
      (0, _util.locationTo)('/wechat/page/mine/enter-logout');
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "examineInput",
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(index, captchaRes, e) {
        var codeNum, _result$state3, captcha, _this$state, phoneNumber, messageId, result, _result$state4;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                codeNum = captchaRes;

                if (e.target.value == '' && index > 1) {
                  _this["inputRes".concat(index - 1)].focus();
                }

                if (!!codeNum["code".concat(index)] && e.target.value == '') {
                  codeNum["code".concat(index)] = '';

                  _this.setState({
                    codeNum: codeNum
                  });
                } //判断是否在0-9之间


                if (!(/^\+?(0|[1-9][0-9]*)$/.test(e.target.value) == false)) {
                  _context4.next = 7;
                  break;
                }

                codeNum["code".concat(index)] = '';

                _this.setState({
                  codeNum: codeNum
                });

                return _context4.abrupt("return", false);

              case 7:
                if (index < 6 && codeNum["code".concat(index)] == "") {
                  _this["inputRes".concat(index + 1)].focus();
                } else {
                  _this["inputRes".concat(index)].focus();
                }

                codeNum["code".concat(index)] = e.target.value;

                _this.setState({
                  codeNum: codeNum
                });

                if (!(codeNum.code1 && codeNum.code2 && codeNum.code3 && codeNum.code4 && codeNum.code5 && codeNum.code6)) {
                  _context4.next = 19;
                  break;
                }

                captcha = codeNum.code1 + codeNum.code2 + codeNum.code3 + codeNum.code4 + codeNum.code5 + codeNum.code6;
                _this$state = _this.state, phoneNumber = _this$state.phoneNumber, messageId = _this$state.messageId;
                window.loading(true);
                _context4.next = 16;
                return (0, _camp.checkoutCode)({
                  phoneNum: phoneNumber,
                  code: captcha,
                  messageId: messageId
                });

              case 16:
                result = _context4.sent;
                window.loading(false);

                if ((result === null || result === void 0 ? void 0 : (_result$state3 = result.state) === null || _result$state3 === void 0 ? void 0 : _result$state3.code) === 0) {
                  //跳转到确认注销页面
                  _this.skipToEnterPage();
                } else {
                  _this.setState({
                    codeNum: {
                      code1: '',
                      code2: '',
                      code3: '',
                      code4: '',
                      code5: '',
                      code6: ''
                    }
                  });

                  _this["inputRes".concat(1)].focus(); // 验证错误


                  window.toast((result === null || result === void 0 ? void 0 : (_result$state4 = result.state) === null || _result$state4 === void 0 ? void 0 : _result$state4.msg) || '验证错误');
                }

              case 19:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x, _x2, _x3) {
        return _ref5.apply(this, arguments);
      };
    }());

    return _this;
  }

  _createClass(LogOutRule, [{
    key: "render",
    // componentWillUnmount = () => {
    //     // 清除定时器
    //     clearInterval(this.data.intervalTimer);
    // }
    value: function render() {
      var _this2 = this;

      var _this$state2 = this.state,
          secondsCounter = _this$state2.secondsCounter,
          timer = _this$state2.timer,
          codeNum = _this$state2.codeNum,
          phoneNumber = _this$state2.phoneNumber;
      return _react.default.createElement(_page.default, {
        title: "\u8F93\u5165\u9A8C\u8BC1\u7801",
        className: "verification-code"
      }, _react.default.createElement("div", {
        className: "verification-code-box"
      }, _react.default.createElement("div", {
        className: "title"
      }, _react.default.createElement("p", null, "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801")), _react.default.createElement("div", {
        className: "phone-num"
      }, _react.default.createElement("p", null, "\u5DF2\u53D1\u9001\u9A8C\u8BC1\u7801\u81F3", phoneNumber && _react.default.createElement("span", null, phoneNumber)), _react.default.createElement("p", {
        className: timer ? 'regain-color' : 'regain',
        onClick: this.getCaptcha
      }, "\u91CD\u65B0\u83B7\u53D6", _react.default.createElement("span", {
        style: timer ? {
          display: 'block'
        } : {
          display: 'none'
        }
      }, "(", secondsCounter, "s)"))), _react.default.createElement("div", {
        className: "verification-code-input"
      }, _react.default.createElement("input", {
        ref: function ref(ele) {
          return _this2.inputRes1 = ele;
        },
        onChange: this.examineInput.bind(this, 1, codeNum),
        value: codeNum.code1,
        maxLength: "1"
      }), _react.default.createElement("input", {
        ref: function ref(ele) {
          return _this2.inputRes2 = ele;
        },
        onChange: this.examineInput.bind(this, 2, codeNum),
        value: codeNum.code2,
        maxLength: "1"
      }), _react.default.createElement("input", {
        ref: function ref(ele) {
          return _this2.inputRes3 = ele;
        },
        onChange: this.examineInput.bind(this, 3, codeNum),
        value: codeNum.code3,
        maxLength: "1"
      }), _react.default.createElement("input", {
        ref: function ref(ele) {
          return _this2.inputRes4 = ele;
        },
        onChange: this.examineInput.bind(this, 4, codeNum),
        value: codeNum.code4,
        maxLength: "1"
      }), _react.default.createElement("input", {
        ref: function ref(ele) {
          return _this2.inputRes5 = ele;
        },
        onChange: this.examineInput.bind(this, 5, codeNum),
        value: codeNum.code5,
        maxLength: "1"
      }), _react.default.createElement("input", {
        ref: function ref(ele) {
          return _this2.inputRes6 = ele;
        },
        onChange: this.examineInput.bind(this, 6, codeNum),
        value: codeNum.code6,
        maxLength: "1"
      }))));
    }
  }]);

  return LogOutRule;
}(_react.Component)) || _class;

var mapStateToProps = function mapStateToProps(state) {};

var mapActionToProps = {
  sendValidCode: _camp.sendValidCode
};
module.exports = (0, _reactRedux.connect)(mapStateToProps, mapActionToProps)(LogOutRule);

/***/ })

}]);
//# sourceMappingURL=11.chunk.js.map