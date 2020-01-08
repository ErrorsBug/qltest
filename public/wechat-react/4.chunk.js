(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "../node_modules/empty-module sync js$":
/*!**********************************************************!*\
  !*** ../node_modules/empty-module sync nonrecursive js$ ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./index.js": "../node_modules/empty-module/index.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../node_modules/empty-module sync js$";

/***/ }),

/***/ "./wechat-react/mine/containers/takeincome-record/components/guest-profit/index.js":
/*!*****************************************************************************************!*\
  !*** ./wechat-react/mine/containers/takeincome-record/components/guest-profit/index.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GuestItem = exports.GuestProfitTabItem = exports.GuestProfitTab = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "../node_modules/moment/moment.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var GuestItem = function GuestItem(_ref) {
  var record = _ref.record;
  return _react.default.createElement("li", {
    className: "record-item"
  }, _react.default.createElement("p", null, _react.default.createElement("span", {
    className: "title"
  }, "\u63D0\u73B0\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
    className: "desc"
  }, (0, _moment.default)(record.createTime).format('YYYY-MM-DD HH:mm:ss') + "")), _react.default.createElement("p", null, _react.default.createElement("span", {
    className: "title"
  }, "\u63D0\u73B0\u91D1\u989D\uFF1A"), _react.default.createElement("span", {
    className: "desc money"
  }, record.money, "\u5143")), _react.default.createElement("p", null, _react.default.createElement("span", {
    className: "title"
  }, "\u63D0\u73B0\u72B6\u6001\uFF1A"), _react.default.createElement("span", {
    className: "desc withdraw-status"
  }, record.transferWay === "guestAccount" ? "\u5DF2\u6C47\u5165\u5609\u5BBE(".concat(record.guestName, ")\u7684\u5343\u804A\u94B1\u5305\uFF0C\u8BF7\u5609\u5BBE\u524D\u5F80\u201C\u4E2A\u4EBA\u4E2D\u5FC3\u201D\u67E5\u770B") : "\u5DF2\u6C47\u5165\u5609\u5BBE(".concat(record.guestName, ")\u7684\u5FAE\u4FE1\u94B1\u5305"))), _react.default.createElement("p", null, _react.default.createElement("span", {
    className: "title"
  }, "\u9884\u8BA1\u5230\u8D26\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
    className: "desc"
  }, record.transferWay === "guestAccount" ? "\u5DF2\u5230\u8D26" : "1\u5929\u540E")));
};

exports.GuestItem = GuestItem;

var GuestProfitTabItem = function GuestProfitTabItem(_ref2) {
  var children = _ref2.children;
  return children;
};

exports.GuestProfitTabItem = GuestProfitTabItem;

var GuestProfitTab = function GuestProfitTab(_ref3) {
  var defaultTabKey = _ref3.defaultTabKey,
      onSwitch = _ref3.onSwitch,
      children = _ref3.children;

  var _useState = (0, _react.useState)(defaultTabKey || null),
      _useState2 = _slicedToArray(_useState, 2),
      curIndex = _useState2[0],
      setcurIndex = _useState2[1];

  var onSwitchTab = function onSwitchTab(index) {
    setcurIndex(index);
    onSwitch && onSwitch(index);
  };

  return _react.default.createElement("div", {
    className: "guest-profit-container"
  }, _react.default.createElement("div", {
    className: "guest-tab-bar"
  }, _react.default.Children.map(children, function (child) {
    return _react.default.createElement("div", {
      key: child.props.tabKey,
      className: "guest-tab ".concat(curIndex === child.props.tabKey ? "active" : ""),
      onClick: function onClick() {
        return onSwitchTab(child.props.tabKey);
      }
    }, child.props.title);
  })), _react.default.Children.map(children, function (child) {
    return _react.default.createElement("div", {
      className: "scroller-wrap",
      hidden: child.props.tabKey !== curIndex
    }, child);
  }));
};

exports.GuestProfitTab = GuestProfitTab;

/***/ }),

/***/ "./wechat-react/mine/containers/takeincome-record/components/tab/index.js":
/*!********************************************************************************!*\
  !*** ./wechat-react/mine/containers/takeincome-record/components/tab/index.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabItem = exports.Tab = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

__webpack_require__(/*! ./style.scss */ "./wechat-react/mine/containers/takeincome-record/components/tab/style.scss");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Tab = function Tab(_ref) {
  var children = _ref.children;

  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      curIndex = _useState2[0],
      setCurIndex = _useState2[1]; // 当前tab索引


  return _react.default.createElement("div", {
    className: "takeincome-tab-container"
  }, _react.default.Children.count(children) > 0 && _react.default.createElement("div", {
    className: "tab-bar"
  }, _react.default.Children.map(children, function (child, index) {
    return _react.default.createElement("div", {
      className: "tab ".concat(index === curIndex ? "active" : ""),
      onClick: function onClick() {
        setCurIndex(index);
      }
    }, child.props.title);
  })), _react.default.Children.map(children, function (child, index) {
    return _react.default.createElement("div", {
      className: "tab-item-container",
      hidden: index !== curIndex
    }, child);
  }));
};

exports.Tab = Tab;

var TabItem = function TabItem(_ref2) {
  var children = _ref2.children;
  return children;
};

exports.TabItem = TabItem;

/***/ }),

/***/ "./wechat-react/mine/containers/takeincome-record/index.js":
/*!*****************************************************************!*\
  !*** ./wechat-react/mine/containers/takeincome-record/index.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _reactDom = __webpack_require__(/*! react-dom */ "../node_modules/react-dom/index.js");

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _page = _interopRequireDefault(__webpack_require__(/*! components/page */ "./wechat-react/components/page/index.js"));

var _scrollToLoad = _interopRequireDefault(__webpack_require__(/*! components/scrollToLoad */ "./wechat-react/components/scrollToLoad/index.js"));

var _dialog = __webpack_require__(/*! components/dialog */ "./wechat-react/components/dialog/index.js");

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _common = __webpack_require__(/*! common_actions/common */ "./wechat-react/actions/common.js");

var _takeincomeRecord = __webpack_require__(/*! ../../actions/takeincome-record */ "./wechat-react/mine/actions/takeincome-record.js");

var _tab = __webpack_require__(/*! ./components/tab */ "./wechat-react/mine/containers/takeincome-record/components/tab/index.js");

var _guestProfit = __webpack_require__(/*! ./components/guest-profit */ "./wechat-react/mine/containers/takeincome-record/components/guest-profit/index.js");

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

var PAGE_SIZE = 10;

var TakeincomeRecord = (0, _coreDecorators.autobind)(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(TakeincomeRecord, _Component);

  function TakeincomeRecord() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TakeincomeRecord);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TakeincomeRecord)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      resendName: "",
      takeincomeRecord: [],
      takeincomeRecordNoMore: false,
      takeincomeRecordPage: 1,
      topicIncomeList: [],
      topicIncomeNoMore: false,
      topicIncomePage: 1,
      channelIncomeList: [],
      channelIncomeNoMore: false,
      channelIncomePage: 1,
      liveCampIncomeList: [],
      liveCampIncomeNoMore: false,
      liveCampIncomePage: 1
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "data", {
      tempRecord: null
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "portalBody", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "confirmRef", null);

    return _this;
  }

  _createClass(TakeincomeRecord, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.portalBody = document.querySelector(".portal-low");
                _context.next = 3;
                return this.props.getUserInfo();

              case 3:
                this.getTakeincomeRecord();
                this.getIncomeList("topic", undefined, undefined, true);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "getTakeincomeRecord",
    value: function () {
      var _getTakeincomeRecord = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var page,
            size,
            result,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                page = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 1;
                size = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : PAGE_SIZE;
                _context2.next = 4;
                return _common.request.post({
                  url: "/api/wechat/transfer/h5/live/reward/withdrawRecord",
                  body: {
                    liveId: this.liveId,
                    userId: this.props.userInfo.user.userId,
                    page: {
                      page: page,
                      size: size
                    }
                  }
                });

              case 4:
                result = _context2.sent;

                if (result.state.code === 0) {
                  this.setState({
                    takeincomeRecord: this.state.takeincomeRecord.concat(result.data.list),
                    takeincomeRecordPage: page,
                    takeincomeRecordNoMore: result.data.list.length < PAGE_SIZE ? true : false
                  });
                }

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTakeincomeRecord() {
        return _getTakeincomeRecord.apply(this, arguments);
      }

      return getTakeincomeRecord;
    }()
  }, {
    key: "showModal",
    value: function showModal(record) {
      this.data.tempRecord = record;
      this.confirmRef.show();
    } // confirm 点击事件回调

  }, {
    key: "onClickDialog",
    value: function () {
      var _onClickDialog = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(e) {
        var postData, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(e === "confirm")) {
                  _context3.next = 6;
                  break;
                }

                postData = {
                  liveId: this.props.location.query.liveId,
                  userId: this.props.userInfo.user.userId,
                  name: this.state.resendName,
                  recordId: this.data.tempRecord && this.data.tempRecord.id
                };
                _context3.next = 4;
                return this.props.resendName(postData);

              case 4:
                res = _context3.sent;

                if (res.code === 0) {
                  this.confirmRef.hide();
                }

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function onClickDialog(_x) {
        return _onClickDialog.apply(this, arguments);
      }

      return onClickDialog;
    }()
  }, {
    key: "onNameChange",
    value: function onNameChange(e) {
      console.log(e.target.value);
      this.setState({
        resendName: e.target.value
      });
    }
  }, {
    key: "onModalHide",
    value: function onModalHide() {
      this.data.tempRecord = null;
      this.setState({
        resendName: ""
      });
    }
  }, {
    key: "fetchIncomeList",
    value: function () {
      var _fetchIncomeList = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(type, page, size) {
        var res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _common.request.post({
                  url: "/api/wechat/transfer/h5/guest/liveGuestTransferRecord",
                  body: {
                    liveId: this.liveId,
                    type: type,
                    page: {
                      page: page,
                      size: size
                    }
                  }
                });

              case 2:
                res = _context4.sent;

                if (!(res.state.code === 0)) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", res.data);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetchIncomeList(_x2, _x3, _x4) {
        return _fetchIncomeList.apply(this, arguments);
      }

      return fetchIncomeList;
    }()
    /**
     * 获取类型发放列表
     * @param {string} type 类型：topic 单课，channel 系列课， liveCamp 打卡
     * @param {number} page 当前分页
     * @param {number} size 分页大小
     * @param {boolean} init 是否初始化列表
     */

  }, {
    key: "getIncomeList",
    value: function () {
      var _getIncomeList = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(type) {
        var page,
            size,
            init,
            res,
            _this$setState,
            _args5 = arguments;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                page = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 1;
                size = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : PAGE_SIZE;
                init = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : false;
                _context5.next = 5;
                return this.fetchIncomeList(type, page, size);

              case 5:
                res = _context5.sent;

                if (res) {
                  this.setState((_this$setState = {}, _defineProperty(_this$setState, "".concat(type, "IncomeList"), init ? res.list : this.state["".concat(type, "IncomeList")].concat(res.list)), _defineProperty(_this$setState, "".concat(type, "IncomeNoMore"), res.list.length < size ? true : false), _defineProperty(_this$setState, "".concat(type, "IncomePage"), page), _this$setState));
                }

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getIncomeList(_x5) {
        return _getIncomeList.apply(this, arguments);
      }

      return getIncomeList;
    }() // 嘉宾发放明细切换tab

  }, {
    key: "onGuestSwitchTab",
    value: function onGuestSwitchTab(key) {
      if (this.state["".concat(key, "IncomeList")] && this.state["".concat(key, "IncomeList")].length <= 0) {
        this.getIncomeList(key);
      }
    }
  }, {
    key: "renderItem",
    value: function renderItem(record) {
      if (record.type === "SUCCESS" || record.repayResult === "SUCCESS") {
        return "已汇入直播间创建者的钱包";
      } else if (record.type === "AWAITING") {
        return "已提交微信审批";
      } else if (record.type == "FAIL" && record.errorInfo == "NAME_MATCH") {
        return "再次进行姓名认证，认证通过会立刻到账";
      } else if (record.type == "FAIL" && record.errorInfo == "NAME_MISMATCH") {
        return "姓名校验失败，微信钱包绑定银行卡姓名所有者的真实姓名必须与平台实名认证姓名一致，如未绑定银行卡，请先将微信钱包绑定银行卡";
      } else if (record.type == "NO_PASS") {
        return "因违规提现请求已中止，请联系千聊客服";
      } else {
        return "正在处理中";
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement(_page.default, {
        title: "\u63D0\u73B0\u8BB0\u5F55",
        className: "takeincome-record"
      }, _react.default.createElement(_tab.Tab, null, _react.default.createElement(_tab.TabItem, {
        title: "\u76F4\u64AD\u95F4\u63D0\u73B0\u660E\u7EC6"
      }, _react.default.createElement(_scrollToLoad.default, {
        className: "takeincome-list scroller",
        none: this.state.takeincomeRecord.length <= 0,
        noMore: this.state.takeincomeRecordNoMore,
        loadNext:
        /*#__PURE__*/
        function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee6(done) {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return _this2.getTakeincomeRecord(_this2.state.takeincomeRecordPage + 1);

                  case 2:
                    done();

                  case 3:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, this);
          }));

          return function (_x6) {
            return _ref.apply(this, arguments);
          };
        }()
      }, _react.default.createElement("div", {
        className: "content"
      }, _react.default.createElement("ul", {
        className: "record-list"
      }, this.state.takeincomeRecord && this.state.takeincomeRecord.map(function (record) {
        return _react.default.createElement("li", {
          className: "record-item",
          key: record.id
        }, record.accountType === "PTP" && _react.default.createElement(_react.Fragment, null, _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u7533\u8BF7\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.creatTime)), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u7533\u8BF7\u91D1\u989D\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.withdrawAmount, "\u5143")), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u670D\u52A1\u8D39\u7387\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.withdrawAmount > 200000 ? "3" : "5", "%")), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u9884\u8BA1\u5230\u8D26\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.withdrawAmount >= 20000 && record.withdrawAmount <= 200000 && "提交申请后15天", record.withdrawAmount > 200000 && record.withdrawAmount <= 500000 && "提交申请后10天")), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u7279\u522B\u8BF4\u660E\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, "\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u8054\u7CFB\u5343\u804A\u6728\u6728\uFF1Amumu06131207")), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u7533\u8BF7\u72B6\u6001\uFF1A"), _react.default.createElement("span", {
          className: ["desc", record.type.toLowerCase()].join(" ")
        }, "\u3010\u516C\u5BF9\u516C\u6253\u6B3E\u3011", record.type === "SUCCESS" && "申请成功", record.type === "PWAITING" && "申请中", record.type === "NO_PASS" && "申请失败")), record.type === "NO_PASS" && _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u7533\u8BF7\u4E0D\u901A\u8FC7\u539F\u56E0\uFF1A"), _react.default.createElement("span", {
          className: "desc no_pass"
        }, record.rejectReason))), record.accountType === "GUEST_OP" && _react.default.createElement(_react.Fragment, null, _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.creatTime)), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u91D1\u989D\uFF1A"), _react.default.createElement("span", {
          className: "desc money"
        }, record.withdrawAmount, "\u5143(\u5609\u5BBE\u5206\u6210\u53D1\u653E)")), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u9884\u8BA1\u5230\u8D26\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.transferTime)), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u72B6\u6001\uFF1A"), _react.default.createElement("span", {
          className: ["desc withdraw-status", record.type.toLowerCase()].join(" ")
        }, record.type == "SUCCESS" || record.repayResult == "SUCCESS" ? "\u5DF2\u6C47\u5165\u5609\u5BBE".concat(record.guestName, "\u7684\u5FAE\u4FE1\u94B1\u5305") : "正在处理中"))), record.accountType === "WARES_REFUND" && _react.default.createElement(_react.Fragment, null, _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.creatTime)), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u91D1\u989D\uFF1A"), _react.default.createElement("span", {
          className: "desc money"
        }, record.withdrawAmount, "\u5143(\u9000\u6B3E)")), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u9884\u8BA1\u5230\u8D26\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.transferTime)), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u72B6\u6001\uFF1A"), _react.default.createElement("span", {
          className: ["desc withdraw-status", record.type.toLowerCase()].join(" ")
        }, record.type == "SUCCESS" || record.repayResult == "SUCCESS" ? "\u9000\u6B3E\u5DF2\u6C47\u5165\u7528\u6237".concat(record.guestName, "\u7684\u5FAE\u4FE1\u94B1\u5305") : "［退款］正在处理中"))), !(record.accountType === "PTP" || record.accountType === "GUEST_OP" || record.accountType === "WARES_REFUND") && _react.default.createElement(_react.Fragment, null, _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.creatTime)), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u91D1\u989D\uFF1A"), _react.default.createElement("span", {
          className: "desc money"
        }, record.withdrawAmount, "\u5143")), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u9884\u8BA1\u5230\u8D26\u65F6\u95F4\uFF1A"), _react.default.createElement("span", {
          className: "desc"
        }, record.transferTime)), _react.default.createElement("p", null, _react.default.createElement("span", {
          className: "title"
        }, "\u63D0\u73B0\u72B6\u6001\uFF1A"), _react.default.createElement("span", {
          className: ["desc withdraw-status", record.type.toLowerCase()].join(" ")
        }, _this2.renderItem(record), record.type == "FAIL" && record.errorInfo == "NAME_MISMATCH" && _react.default.createElement("div", {
          className: "btn-wrapper"
        }, _react.default.createElement("a", {
          href: "javascript:;",
          onClick: function onClick() {
            _this2.showModal(record);
          },
          className: "link-btn send-again"
        }, "\u91CD\u65B0\u63D0\u4EA4\u7533\u8BF7"), _react.default.createElement("a", {
          href: "/wechat/page/real-name?reVerify=Y&type=topic",
          className: "link-btn verify-again"
        }, "\u91CD\u65B0\u5B9E\u540D\u8BA4\u8BC1"))))));
      }))))), _react.default.createElement(_tab.TabItem, {
        title: "\u5609\u5BBE\u53D1\u653E\u660E\u7EC6"
      }, _react.default.createElement(_guestProfit.GuestProfitTab, {
        topicIncomeList: this.state.topicIncomeList,
        channelIncomeList: this.state.channelIncomeList,
        liveCampIncomeList: this.state.liveCampIncomeList,
        topicIncomeNoMore: this.state.topicIncomeNoMore,
        channelIncomeNoMore: this.state.channelIncomeNoMore,
        liveCampIncomeNoMore: this.state.liveCampIncomeNoMore,
        topicIncomePage: this.state.topicIncomePage,
        channelIncomePage: this.state.channelIncomePage,
        liveCampIncomePage: this.state.liveCampIncomePage,
        onSwitch: this.onGuestSwitchTab,
        defaultTabKey: "topic"
      }, _react.default.createElement(_guestProfit.GuestProfitTabItem, {
        title: "\u8BDD \u9898",
        tabKey: "topic"
      }, _react.default.createElement(_scrollToLoad.default, {
        className: "guest-profit-scroller scroller",
        none: this.state.topicIncomeList.length <= 0,
        noMore: this.state.topicIncomeNoMore,
        loadNext:
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee7(done) {
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return _this2.getIncomeList("topic", _this2.state.topicIncomePage + 1);

                  case 2:
                    done();

                  case 3:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, this);
          }));

          return function (_x7) {
            return _ref2.apply(this, arguments);
          };
        }()
      }, _react.default.createElement("div", {
        className: "content"
      }, _react.default.createElement("ul", {
        className: "record-list"
      }, this.state.topicIncomeList.map(function (record) {
        return _react.default.createElement(_guestProfit.GuestItem, {
          key: record.id,
          record: record
        });
      }))))), _react.default.createElement(_guestProfit.GuestProfitTabItem, {
        title: "\u7CFB\u5217\u8BFE",
        tabKey: "channel"
      }, _react.default.createElement(_scrollToLoad.default, {
        className: "guest-profit-scroller scroller",
        none: this.state.channelIncomeList.length <= 0,
        noMore: this.state.channelIncomeNoMore,
        loadNext:
        /*#__PURE__*/
        function () {
          var _ref3 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee8(done) {
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return _this2.getIncomeList("channel", _this2.state.channelIncomePage + 1);

                  case 2:
                    done();

                  case 3:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8, this);
          }));

          return function (_x8) {
            return _ref3.apply(this, arguments);
          };
        }()
      }, _react.default.createElement("div", {
        className: "content"
      }, _react.default.createElement("ul", {
        className: "record-list"
      }, this.state.channelIncomeList.map(function (record) {
        return _react.default.createElement(_guestProfit.GuestItem, {
          key: record.id,
          record: record
        });
      }))))), _react.default.createElement(_guestProfit.GuestProfitTabItem, {
        title: "\u6253 \u5361",
        tabKey: "liveCamp"
      }, _react.default.createElement(_scrollToLoad.default, {
        className: "guest-profit-scroller scroller",
        none: this.state.liveCampIncomeList.length <= 0,
        noMore: this.state.liveCampIncomeNoMore,
        loadNext:
        /*#__PURE__*/
        function () {
          var _ref4 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee9(done) {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return _this2.getIncomeList("liveCamp", _this2.state.liveCampIncomePage + 1);

                  case 2:
                    done();

                  case 3:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee9, this);
          }));

          return function (_x9) {
            return _ref4.apply(this, arguments);
          };
        }()
      }, _react.default.createElement("div", {
        className: "content"
      }, _react.default.createElement("ul", {
        className: "record-list"
      }, this.state.liveCampIncomeList.map(function (record) {
        return _react.default.createElement(_guestProfit.GuestItem, {
          key: record.id,
          record: record
        });
      })))))))), this.portalBody && (0, _reactDom.createPortal)(_react.default.createElement(_dialog.Confirm, {
        ref: function ref(_ref5) {
          _this2.confirmRef = _ref5;
        },
        title: "\u91CD\u65B0\u63D0\u4EA4\u7533\u8BF7",
        onBtnClick: this.onClickDialog,
        onClose: this.onModalHide
      }, _react.default.createElement("div", {
        className: "takeincome-record-resend-name"
      }, _react.default.createElement("input", {
        className: "resend-name-input",
        type: "text",
        placeholder: "\u5728\u6B64\u586B\u5199\u59D3\u540D\uFF0C\u5FC5\u987B\u548C\u5B9E\u540D\u8BA4\u8BC1\u65F6\u586B\u5199\u7684\u4E00\u81F4",
        value: this.state.resendName,
        onChange: this.onNameChange
      }))), this.portalBody));
    }
  }, {
    key: "liveId",
    get: function get() {
      return this.props.location.query["liveId"];
    }
  }]);

  return TakeincomeRecord;
}(_react.Component)) || _class;

var mapStateToProps = function mapStateToProps(state) {
  return {
    userInfo: state.common.userInfo
  };
};

var mapDispatchToProps = {
  getUserInfo: _common.getUserInfo,
  resendName: _takeincomeRecord.resendName
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TakeincomeRecord);

exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=4.chunk.js.map