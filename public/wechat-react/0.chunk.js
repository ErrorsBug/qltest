(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./wechat-react/components/empty-page/index.js":
/*!*****************************************************!*\
  !*** ./wechat-react/components/empty-page/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _classnames = _interopRequireDefault(__webpack_require__(/*! classnames */ "../node_modules/classnames/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 20181226重构 jiajun.li
 * 
 * 之前是用emptyPicIndex（number）指定图片的，0时无效的
 * 
 * 现增加语义化名称指定图片，参数为imgKey（string）
 */
var emptyImgMap = {
  1: 'https://img.qlchat.com/qlLive/liveCommon/empty-pic-1-1.png',
  //珊瑚计划数据的空页面icon
  2: 'https://img.qlchat.com/qlLive/liveCommon/empty-pic-2.png',
  //珊瑚计划收益相关列表空页面icon  
  3: 'https://img.qlchat.com/qlLive/media-market/no-content.png',
  // 媒体商城空列表图标
  default: '//img.qlchat.com/qlLive/liveCommon/empty-page-empty.png',
  noCourse: '//img.qlchat.com/qlLive/liveCommon/empty-page-no-course.png',
  noContent: '//img.qlchat.com/qlLive/liveCommon/empty-page-no-content.png',
  noCoupon: '//img.qlchat.com/qlLive/liveCommon/empty-page-no-coupon.png'
};

var Empty =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Empty, _React$PureComponent);

  function Empty() {
    _classCallCheck(this, Empty);

    return _possibleConstructorReturn(this, _getPrototypeOf(Empty).apply(this, arguments));
  }

  _createClass(Empty, [{
    key: "render",
    value: function render() {
      var props = this.props;
      var cln = (0, _classnames.default)(props.mini ? 'common-empty-m' : 'common-empty', this.props.className);
      var imgSrc = props.emptyPic || emptyImgMap[props.emptyPicIndex] || emptyImgMap[props.imgKey] || emptyImgMap.default;
      return _react.default.createElement("div", {
        className: cln
      }, !props.hideNoMorePic && _react.default.createElement("div", {
        className: "co-empty-box"
      }, _react.default.createElement("img", {
        className: "co-empty-img",
        src: imgSrc
      })), _react.default.createElement("div", {
        className: "co-empty-desc"
      }, props.emptyMessage || '没有任何内容哦'), typeof props.footer === 'function' ? props.footer() : props.footer);
    }
  }]);

  return Empty;
}(_react.default.PureComponent);

Empty.propTypes = {
  //空页面icon自定义参数，
  emptyPicIndex: _propTypes.default.number,
  //空页面自定义文案 
  emptyMessage: _propTypes.default.string,
  hideNoMorePic: _propTypes.default.bool,
  mini: _propTypes.default.bool,
  // 小型空样式，static定位
  imgKey: _propTypes.default.string // 指定图片

};
var _default = Empty;
exports.default = _default;

/***/ }),

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

/***/ "./wechat-react/components/scrollToLoad/index.js":
/*!*******************************************************!*\
  !*** ./wechat-react/components/scrollToLoad/index.js ***!
  \*******************************************************/
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

var _emptyPage = _interopRequireDefault(__webpack_require__(/*! ../empty-page */ "./wechat-react/components/empty-page/index.js"));

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

var ScrollToLoad =
/*#__PURE__*/
function (_Component) {
  _inherits(ScrollToLoad, _Component);

  function ScrollToLoad() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ScrollToLoad);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScrollToLoad)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      loading: false,
      noMore: _this.props.noMore
    });

    return _this;
  }

  _createClass(ScrollToLoad, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        noMore: nextProps.noMore
      });
    }
  }, {
    key: "onScroll",
    value: function onScroll(e) {
      var _this2 = this;

      if (this.props.disable) return;
      var _this$props = this.props,
          toBottomHeight = _this$props.toBottomHeight,
          className = _this$props.className,
          _this$props$loadNext = _this$props.loadNext,
          loadNext = _this$props$loadNext === void 0 ? function () {} : _this$props$loadNext;
      var event = e || window.event;
      var el = event.target;
      var distanceScrollCount = el.scrollHeight,
          distanceScroll = el.scrollTop,
          topicPageHight = el.clientHeight,
          ddt = distanceScrollCount - distanceScroll - topicPageHight,
          defaultToBottomHeight = 3;
      var scrollContainerBoundingRect = this.scrollContainer.getBoundingClientRect(); //在滚动的时候自定义操作

      /**
       * @param e 事件对象
       * @param distanceScroll 滚动的距离
       * @param distanceScrollCount 总高度
       * @param scrollHeight 节点的滚动高度
       * 在判断是否正在加载和是否无更多数据之前执行的原因是
       * 在无更多数据不做加载操作还能做自定义的操作
       */

      if (this.props.scrollToDo) {
        this.props.scrollToDo(e, distanceScroll, topicPageHight, distanceScrollCount, scrollContainerBoundingRect);
      } // 添加noneOne的判断


      if (this.state.loading || this.state.noMore || this.props.noneOne) {
        return;
      } // 防止事件冒泡（子元素横向滚动也会触发onscroll事件）


      if (Array.prototype.join.call(el.classList, ',').indexOf('co-scroll-to-load') < 0) {
        return;
      }

      if (toBottomHeight) {
        defaultToBottomHeight = toBottomHeight;
      }

      if (ddt < defaultToBottomHeight) {
        this.setState({
          loading: true
        });
        loadNext(function () {
          _this2.setState({
            loading: false
          });
        });
      }
    }
  }, {
    key: "disableScroll",
    value: function disableScroll(e) {
      if (this.props.disableScroll) {
        e.preventDefault();
      }

      if (this.props.onTouchMove) {
        this.props.onTouchMove(e);
      }
    }
  }, {
    key: "getBoundingClientRect",
    value: function getBoundingClientRect() {
      return this.scrollContainer.getBoundingClientRect();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var emptyDiv = '';
      return _react.default.createElement("div", {
        id: this.props.id || '',
        className: (0, _classnames.default)('co-scroll-to-load', this.props.className),
        style: this.props.style || {},
        onScroll: this.onScroll.bind(this),
        onTouchMove: this.disableScroll.bind(this),
        onWheel: this.disableScroll.bind(this),
        ref: function ref(el) {
          return _this3.scrollContainer = el;
        }
      }, _react.default.createElement("main", null, this.props.children), !this.props.disable && this.state.loading && _react.default.createElement("div", {
        className: "list-loading"
      }, "\u62FC\u547D\u52A0\u8F7D\u4E2D.", _react.default.createElement("div", {
        className: "dynamic-ellipsis"
      }, "..")), !this.props.disable && this.state.noMore && !this.props.notShowLoaded && !this.props.noneOne && _react.default.createElement("div", {
        className: "list-nomore"
      }, "\u6CA1\u6709\u66F4\u591A\u4E86"), !this.props.disable && this.state.noMore && !this.props.notShowLoaded && this.props.bottomText !== null && _react.default.createElement("div", {
        className: "list-nomore"
      }, this.props.bottomText), !this.props.disable && this.props.noneOne && !this.props.notShowLoaded && _react.default.createElement("div", {
        className: "list-nomore"
      }, _react.default.createElement(_emptyPage.default, {
        show: true,
        emptyPic: this.props.emptyPic || '',
        emptyPicIndex: this.props.emptyPicIndex || 0,
        emptyMessage: this.props.emptyMessage || '',
        hideNoMorePic: this.props.hideNoMorePic
      })), !(!this.props.disable && this.state.loading) && !(!this.props.disable && this.state.noMore && !this.props.notShowLoaded) && this.props.footer && _react.default.createElement("div", {
        className: "need-space"
      }), this.props.footer && this.props.footer);
    }
  }, {
    key: "scrollHeight",
    get: function get() {
      return this.scrollContainer.scrollHeight;
    }
  }, {
    key: "scrollTop",
    get: function get() {
      return this.scrollContainer.scrollTop;
    },
    set: function set(value) {
      this.scrollContainer.scrollTop = value;
    }
  }]);

  return ScrollToLoad;
}(_react.Component);

ScrollToLoad.propTypes = {
  // 滚动触发者，默认是id为app的元素
  // trigger: PropTypes.string,
  disable: _propTypes.default.bool,
  // 滚动到底部时调用
  loadNext: _propTypes.default.func,
  // 距离底部多少时触发
  toBottomHeight: _propTypes.default.number,
  // 是否还有更多
  noMore: _propTypes.default.bool,
  //第几页
  page: _propTypes.default.number,
  //是否暂无数据
  noneOne: _propTypes.default.bool,
  //空页面icon
  emptyPic: _propTypes.default.string,
  //空页面icon自定义参数，
  emptyPicIndex: _propTypes.default.number,
  //空页面自定义文案 
  emptyMessage: _propTypes.default.string,
  hideNoMorePic: _propTypes.default.bool,
  className: _propTypes.default.string,
  notShowLoaded: _propTypes.default.bool,
  // 滚动事件自定义操作函数
  scrollToDo: _propTypes.default.func,
  // 是否禁用滚动
  disableScroll: _propTypes.default.bool,
  // 底部自定义文案
  bottomText: _propTypes.default.string
};
ScrollToLoad.defaultProps = {
  disable: false,
  disableScroll: false,
  bottomText: null
};
var _default = ScrollToLoad;
exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=0.chunk.js.map