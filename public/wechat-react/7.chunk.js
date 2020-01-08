(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

/***/ "./wechat-react/components/books-item/index.jsx":
/*!******************************************************!*\
  !*** ./wechat-react/components/books-item/index.jsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _qlReactPicture = _interopRequireDefault(__webpack_require__(/*! ql-react-picture */ "../node_modules/ql-react-picture/dist/index.js"));

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "../node_modules/classnames/index.js"));

var _util = __webpack_require__(/*! components/util */ "./wechat-react/components/util.js");

var _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Index = (0, _coreDecorators.autobind)(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(Index, _Component);

  function Index() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Index)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {});

    return _this;
  }

  _createClass(Index, [{
    key: "goTopic",
    value: function goTopic(e) {
      e.stopPropagation();
      (0, _util.locationTo)("/wechat/page/topic-intro?topicId=".concat(this.props.id));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$flag = _this$props.flag,
          flag = _this$props$flag === void 0 ? true : _this$props$flag,
          name = _this$props.name,
          description = _this$props.description,
          iconUrl = _this$props.iconUrl,
          duration = _this$props.duration,
          learningNum = _this$props.learningNum;
      var cls = (0, _classnames.default)({
        'books-name': !flag
      });
      return _react.default.createElement("div", {
        className: "books-topic-item",
        onClick: this.goTopic
      }, _react.default.createElement("div", {
        className: "books-img"
      }, _react.default.createElement(_qlReactPicture.default, {
        className: "books-pic",
        src: iconUrl,
        placeholder: true,
        resize: {
          w: '162',
          h: "207"
        }
      })), _react.default.createElement("div", {
        className: "books-intro"
      }, _react.default.createElement("div", null, _react.default.createElement("h3", {
        className: cls
      }, name), flag && _react.default.createElement("p", null, description), _react.default.createElement("div", {
        className: "books-decs"
      }, (0, _util.digitFormat)(learningNum), "\u6B21\u5B66\u4E60 | \u65F6\u957F", (0, _util.getAudioTimeShow)(duration)))));
    }
  }]);

  return Index;
}(_react.Component)) || _class;

exports.default = Index;

/***/ }),

/***/ "./wechat-react/mine/containers/buy-history/components/tab/index.jsx":
/*!***************************************************************************!*\
  !*** ./wechat-react/mine/containers/buy-history/components/tab/index.jsx ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "../node_modules/classnames/index.js"));

var _reactDom = __webpack_require__(/*! react-dom */ "../node_modules/react-dom/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TabLabel =
/*#__PURE__*/
function (_Component) {
  _inherits(TabLabel, _Component);

  function TabLabel() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TabLabel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TabLabel)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "data", {
      menuScrollLeftTimer: null,
      firstScrollCenter: true,
      // 第一次
      didMount: false
    });

    return _this;
  }

  _createClass(TabLabel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.data.didMount = true;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.data.didMount && this.data.firstScrollCenter && this.props.useAutoCenter) {
        if (this.refs.categorys.children.length > 0) {
          this.data.firstScrollCenter = false;
          this.activeItemScrollToCenter(nextProps.activeLabelSign);
        }
      }
    }
  }, {
    key: "switchLabel",
    value: function switchLabel(e, sign, belongParentIndex) {
      e.preventDefault();
      e.stopPropagation();

      if (this.props.useAutoCenter) {
        this.handelItemClick(sign, e);
      } // 处理父级函数


      this.props.labelClickFunc(sign, belongParentIndex);
    }
  }, {
    key: "handelItemClick",
    value: function handelItemClick(sign, e) {
      if (sign === this.props.activeLabelSign) {
        return;
      }

      this.activeItemScrollToCenter(sign);
    } // 滑动激活元素到中间位置

  }, {
    key: "activeItemScrollToCenter",
    value: function activeItemScrollToCenter(activeSign) {
      var menuDom = (0, _reactDom.findDOMNode)(this.refs.categorys);
      var disToLeft = 0;

      for (var i = 0, len = menuDom.children.length; i < len; i++) {
        var itemDom = menuDom.children[i];
        disToLeft += itemDom.offsetWidth || 0;

        if ('' + itemDom.getAttribute('data-sign') === '' + activeSign) {
          disToLeft -= itemDom.offsetWidth / 2;
          break;
        }
      }

      disToLeft = disToLeft - (0, _reactDom.findDOMNode)(this.refs.categoryMenu).offsetWidth / 2;
      this.menuScrollTo(disToLeft);
    } // 将menu滑动一段距离

  }, {
    key: "menuScrollTo",
    value: function menuScrollTo(dis) {
      var _this2 = this;

      var menuDom = (0, _reactDom.findDOMNode)(this.refs.categorys);
      var scrollLeft = menuDom.scrollLeft; // 设置计时器

      this.data.menuScrollLeftTimer && clearInterval(this.data.menuScrollLeftTimer);
      this.data.menuScrollLeftTimer = setInterval(function () {
        // 设置速度，用等式而不用具体数值是为了产生缓动效果；
        scrollLeft = scrollLeft + Math.ceil((dis - scrollLeft) / 3); // 作差，产生缓动效果；

        menuDom.scrollLeft = scrollLeft; // 判断是否抵达顶部，若是，停止计时器；

        if (Math.abs(dis - scrollLeft) <= 4) {
          menuDom.scrollLeft = dis;
          clearInterval(_this2.data.menuScrollLeftTimer);
        }
      }, 60);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var liDOM = null;

      if (this.props.listInfo instanceof Array) {
        liDOM = this.props.listInfo.map(function (item, index) {
          return _react.default.createElement("li", {
            className: (0, _classnames.default)('on-log', _this3.props.liClassName, 'label-item', {
              active: _this3.props.activeLabelSign == item.sign
            }),
            key: "olabel".concat(index),
            "data-sign": item.sign,
            onClick: function onClick(e) {
              _this3.switchLabel(e, item.sign, item.belongParentIndex);
            },
            "data-id": item.sign,
            "data-log-region": _this3.props.region,
            "data-log-tag_id": item.sign,
            "data-log-tag_name": item.labelName,
            "data-log-business_id": item.sign,
            "data-log-name": item.labelName,
            "data-log-business_type": 'tag'
          }, _react.default.createElement("span", {
            className: "label-item-link"
          }, item.labelName));
        });
      }

      return _react.default.createElement("section", {
        className: (0, _classnames.default)("one-level-label-box", this.props.sectionClassName, {
          'pick-up': this.props.isPickedUp
        }),
        ref: "categoryMenu"
      }, _react.default.createElement("ul", {
        className: (0, _classnames.default)("one-level-label-inner", this.props.ulClassName),
        ref: "categorys"
      }, liDOM));
    }
  }]);

  return TabLabel;
}(_react.Component);

exports.default = TabLabel;

_defineProperty(TabLabel, "propTypes", {
  // 数组中的元素为{labelName: '', sign: '一个标识的内容', belongParentIndex: 上级标签的位置(子集标签才有)}
  listInfo: _propTypes.default.array,
  // li节点类名
  liClassName: _propTypes.default.string,
  // section节点类
  sectionClassName: _propTypes.default.string,
  // ul节点类
  ulClassName: _propTypes.default.string,
  // 点击处理
  labelClickFunc: _propTypes.default.func,
  // 是否收起
  isPickedUp: _propTypes.default.bool,
  // activeLabelSign: 当前激活标签的对应标记
  // 是否要点击标签自动移动到中间
  useAutoCenter: _propTypes.default.bool
});

_defineProperty(TabLabel, "defaultProps", {
  listInfo: [],
  liClassName: '',
  sectionClassName: '',
  ulClassName: '',
  isPickedUp: false,
  useAutoCenter: true
});

/***/ }),

/***/ "./wechat-react/mine/containers/buy-history/index.jsx":
/*!************************************************************!*\
  !*** ./wechat-react/mine/containers/buy-history/index.jsx ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _page = _interopRequireDefault(__webpack_require__(/*! components/page */ "./wechat-react/components/page/index.js"));

var _tab = _interopRequireDefault(__webpack_require__(/*! ./components/tab */ "./wechat-react/mine/containers/buy-history/components/tab/index.jsx"));

var _scrollToLoad = _interopRequireDefault(__webpack_require__(/*! components/scrollToLoad */ "./wechat-react/components/scrollToLoad/index.js"));

var _booksItem = _interopRequireDefault(__webpack_require__(/*! components/books-item */ "./wechat-react/components/books-item/index.jsx"));

var _util = __webpack_require__(/*! components/util */ "./wechat-react/components/util.js");

var _buy = __webpack_require__(/*! ../../actions/buy */ "./wechat-react/mine/actions/buy.js");

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

var firstTag = [{
  sign: '1',
  labelName: '系列课',
  type: 'channel'
}, {
  sign: '2',
  labelName: '话题',
  type: 'topic'
}, {
  sign: '3',
  labelName: '听书',
  type: 'book'
}, {
  sign: '4',
  labelName: '会员',
  type: "live"
}, {
  sign: '5',
  labelName: '打卡',
  type: "checkin"
}, {
  sign: '6',
  labelName: '赠礼',
  type: "gift"
}, {
  sign: '7',
  labelName: '文件',
  type: "doc"
}];

var BuyHistory = (0, _coreDecorators.autobind)(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(BuyHistory, _Component);

  function BuyHistory() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BuyHistory);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BuyHistory)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      nowFirstTagId: "3",
      // 当前选中标签id
      type: _this.props.location.query.type || 'book'
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "data", {
      page: 1,
      size: 20,
      flag: false
    });

    return _this;
  }

  _createClass(BuyHistory, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadMoreCourse();
    }
  }, {
    key: "loadMoreCourse",
    value: function () {
      var _loadMoreCourse = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _this$props, noneData, isNoMoreCourse, type, params;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$props = this.props, noneData = _this$props.noneData, isNoMoreCourse = _this$props.isNoMoreCourse;

                if (!(this.data.flag || noneData || isNoMoreCourse)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", false);

              case 3:
                this.data.flag = true;
                type = this.state.type;
                params = Object.assign(this.data, {
                  purchaseType: type
                });
                _context.next = 8;
                return this.props.getBuyLists(params);

              case 8:
                this.data.page += 1;
                this.data.flag = false;

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadMoreCourse() {
        return _loadMoreCourse.apply(this, arguments);
      }

      return loadMoreCourse;
    }()
  }, {
    key: "switchFirstTag",
    value: function switchFirstTag(tagId) {
      if (tagId == this.state.nowFirstTagId) return false;
      var type = firstTag.filter(function (item) {
        return item.sign === tagId;
      })[0].type;
      this.setState({
        type: type
      });
      (0, _util.locationTo)("/live/entity/myPurchaseRecord.htm?type=".concat(type)); // this.setState({
      //   isNoMoreCourse: false,
      //   nowFirstTagId:tagId,
      //   noneData: false,
      // }, () => {
      // });
    }
  }, {
    key: "goTopic",
    value: function goTopic(id) {
      console.log("/wechat/page/topic-intro?topicId=".concat(id));
      (0, _util.locationTo)("/wechat/page/topic-intro?topicId=".concat(id));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          noneData = _this$props2.noneData,
          isNoMoreCourse = _this$props2.isNoMoreCourse,
          buyLists = _this$props2.buyLists;
      var nowFirstTagId = this.state.nowFirstTagId;
      return _react.default.createElement(_page.default, {
        title: "\u6211\u7684\u8D2D\u4E70\u8BB0\u5F55",
        className: "buy-history-box"
      }, _react.default.createElement("div", {
        className: "buy-menu"
      }, _react.default.createElement("ul", null, firstTag.map(function (item, index) {
        return _react.default.createElement("li", {
          onClick: function onClick() {
            return _this2.switchFirstTag(item.sign);
          },
          className: nowFirstTagId === item.sign ? 'select' : ''
        }, item.labelName);
      }))), _react.default.createElement(_scrollToLoad.default, {
        className: "buy-scroll",
        toBottomHeight: 500,
        noneOne: noneData,
        loadNext: this.loadMoreCourse,
        noMore: isNoMoreCourse
      }, buyLists.map(function (item, index) {
        return _react.default.createElement("div", {
          key: index,
          className: "buy-books-item",
          onClick: function onClick() {
            return _this2.goTopic(item.businessId);
          }
        }, _react.default.createElement(_booksItem.default, {
          name: item.name,
          description: item.description,
          iconUrl: item.iconUrl,
          learningNum: item.learningNum,
          duration: item.duration,
          id: item.businessId,
          key: index
        }), _react.default.createElement("div", {
          className: "buy-books-info"
        }, _react.default.createElement("h3", null, "\u5B9E\u4ED8\u6B3E\uFF1A", _react.default.createElement("span", null, "\uFFE5", (Number(item.amount) / 100).toFixed(2)), !!item.benifit && "\uFF08\u5DF2\u4F18\u60E0\u62B5\u6263\uFFE5".concat((Number(item.benifit) / 100).toFixed(2), "\uFF09")), _react.default.createElement("p", null, "\u8D2D\u4E70\u65F6\u95F4\uFF1A", (0, _util.formatDate)(item.payTime, 'yyyy-MM-dd hh:mm:ss'))));
      })));
    }
  }]);

  return BuyHistory;
}(_react.Component)) || _class;

var mapStateToProps = function mapStateToProps(state) {
  return {
    buyLists: state.buy.buyLists || [],
    noneData: state.buy.noneData || false,
    isNoMoreCourse: state.buy.isNoMoreCourse || false
  };
};

var mapActionToProps = {
  getBuyLists: _buy.getBuyLists
};
module.exports = (0, _reactRedux.connect)(mapStateToProps, mapActionToProps)(BuyHistory);

/***/ })

}]);
//# sourceMappingURL=7.chunk.js.map