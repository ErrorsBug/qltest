(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./wechat-react/components/dialog/bottom-dialog.js":
/*!*********************************************************!*\
  !*** ./wechat-react/components/dialog/bottom-dialog.js ***!
  \*********************************************************/
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

var _switch = _interopRequireDefault(__webpack_require__(/*! ../switch */ "./wechat-react/components/switch/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var dangerHtml = function dangerHtml(content) {
  return {
    __html: content
  };
};

BottomDialog.propTypes = {
  // 是否显示组件
  show: _propTypes.default.bool.isRequired,
  // 是否点击背景关闭弹框
  bghide: _propTypes.default.bool,
  // 标题
  title: _propTypes.default.string,
  // 标题的标签
  titleLabel: _propTypes.default.string,
  className: _propTypes.default.string,
  // 弹框内容类型
  // list: 弹出一个类似action sheet的列表
  // empty: 一个空弹框，自由发挥
  theme: _propTypes.default.oneOf(['list', 'empty', 'scroll']),
  // 项目列表
  items: _propTypes.default.arrayOf(_propTypes.default.shape({
    // 列表项的键，用于识别点击事件
    key: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
    // 图标，请用本项目自带的字体图标库中的图标，这里是传递一个class name而已
    icon: _propTypes.default.string,
    // 内容，本内容将以html形式插入item内容位置，意味着你可以自定义item里面的内容，包括样式，别乱来
    content: _propTypes.default.string,
    // 是否显示
    show: _propTypes.default.bool,
    // switch的状态，不传就不显示switch
    switchStatus: _propTypes.default.bool,
    // 主题样式
    // normal: 黑色的字体
    // danger: 红色的样式
    theme: _propTypes.default.oneOf(['normal', 'danger'])
  })),
  // 是否显示关闭按钮,这个关闭按钮是底部的那个取消按钮
  close: _propTypes.default.bool,
  // 是否不显示埋点 false 要有埋点 true不用埋点
  notShowPoint: _propTypes.default.bool,
  // 关闭按钮内容
  closeText: _propTypes.default.string,
  // 关闭弹框事件(点击背景的时候，并且设置bghide=true时触发)
  onClose: _propTypes.default.func,
  // 列表项点击事件,
  onItemClick: _propTypes.default.func,
  // 表示是否选中
  activeString: _propTypes.default.string,
  // 是否展示确定按钮
  showSure: _propTypes.default.bool
};
/**
 * 底部弹框组件
 */

function BottomDialog(props) {
  var show = props.show,
      _props$bghide = props.bghide,
      bghide = _props$bghide === void 0 ? true : _props$bghide,
      title = props.title,
      titleLabel = props.titleLabel,
      className = props.className,
      theme = props.theme,
      items = props.items,
      onClose = props.onClose,
      _props$close = props.close,
      close = _props$close === void 0 ? false : _props$close,
      onItemClick = props.onItemClick,
      children = props.children,
      notShowPoint = props.notShowPoint;

  if (!show) {
    return null;
  }

  var contentNode;

  if (theme === 'list') {
    contentNode = genList(props);
  } else if (theme === 'empty') {
    contentNode = children;
  } else if (theme === 'scroll') {
    contentNode = genScrollList(props);
  }

  return _react.default.createElement("div", {
    className: "co-dialog-container ".concat(className)
  }, _react.default.createElement("div", {
    className: "co-dialog-bg",
    onClick: function onClick() {
      return bghide && onClose && onClose();
    }
  }), _react.default.createElement("div", {
    className: "co-dialog-bottom"
  }, contentNode));
}
/**
 * 生成列表样式的action sheet
 */


function genList(_ref) {
  var title = _ref.title,
      titleLabel = _ref.titleLabel,
      items = _ref.items,
      close = _ref.close,
      onItemClick = _ref.onItemClick,
      props = _objectWithoutProperties(_ref, ["title", "titleLabel", "items", "close", "onItemClick"]);

  return _react.default.createElement("ul", {
    className: "co-dialog-bottom-list"
  }, (title || titleLabel) && _react.default.createElement("li", {
    className: "co-dialog-bottom-title"
  }, titleLabel ? _react.default.createElement("span", {
    className: "co-dialog-bottom-title-label"
  }, titleLabel) : null, _react.default.createElement("span", {
    className: "co-dialog-bottom-title-content",
    dangerouslySetInnerHTML: dangerHtml(title)
  }), props.showSure ? _react.default.createElement("span", {
    className: "dialog-sure on-log",
    "data-log-region": props.logSure && props.logSure.region,
    "data-log-pos": props.logSure && props.logSure.pos,
    onClick: props.onSure
  }, props.sure || '确定') : null), items.map(function (item, index) {
    if (item.show === true) {
      if (item.switchStatus === true || item.switchStatus === false) {
        return _react.default.createElement("li", {
          key: "co-dialog-bottom-item".concat(index),
          hidden: !item.show,
          className: (0, _classnames.default)('co-dialog-bottom-item', item.icon, item.theme)
        }, item.content, _react.default.createElement(_switch.default, {
          className: "co-dialog-bottom-item-switch",
          active: item.switchStatus,
          onChange: function onChange() {
            onItemClick && onItemClick(item.key, item.switchStatus);
          }
        }));
      } else {
        return _react.default.createElement("li", {
          key: "co-dialog-bottom-item".concat(index),
          hidden: !item.show,
          className: (0, _classnames.default)('co-dialog-bottom-item', item.icon, item.theme, item.topictype, item.region && !props.notShowPoint ? 'on-log on-visible' : '', props.activeString == item.key ? 'co-dialog-bottom-item-active' : ''),
          "data-log-region": item.region,
          "data-log-pos": item.pos,
          onClick: function onClick() {
            return onItemClick && onItemClick(item.key, "", item.topictype);
          },
          type: item.topicType,
          dangerouslySetInnerHTML: dangerHtml(item.content)
        });
      }
    }
  }), close && genClose(_objectSpread({}, props)));
}
/**
 * 生成可以滚动的列表样式的action sheet
 */


function genScrollList(_ref2) {
  var title = _ref2.title,
      titleLabel = _ref2.titleLabel,
      items = _ref2.items,
      close = _ref2.close,
      onItemClick = _ref2.onItemClick,
      _ref2$scrollHeight = _ref2.scrollHeight,
      scrollHeight = _ref2$scrollHeight === void 0 ? 400 : _ref2$scrollHeight,
      props = _objectWithoutProperties(_ref2, ["title", "titleLabel", "items", "close", "onItemClick", "scrollHeight"]);

  return _react.default.createElement("ul", {
    className: "co-dialog-bottom-list"
  }, (title || titleLabel) && _react.default.createElement("li", {
    className: "co-dialog-bottom-title"
  }, titleLabel ? _react.default.createElement("span", {
    className: "co-dialog-bottom-title-label"
  }, titleLabel) : null, _react.default.createElement("span", {
    className: "co-dialog-bottom-title-content",
    dangerouslySetInnerHTML: dangerHtml(title)
  })), _react.default.createElement("div", {
    className: "scroll-warp",
    style: {
      "height": scrollHeight
    }
  }, items.map(function (item, index) {
    if (item.show === true) {
      if (item.switchStatus === true || item.switchStatus === false) {
        return _react.default.createElement("li", {
          key: "co-dialog-bottom-item".concat(index),
          hidden: !item.show,
          className: (0, _classnames.default)('co-dialog-bottom-item', item.icon, item.theme)
        }, item.content, _react.default.createElement(_switch.default, {
          className: "co-dialog-bottom-item-switch",
          active: item.switchStatus,
          onChange: function onChange() {
            onItemClick && onItemClick(item.key, item.switchStatus);
          }
        }));
      } else {
        return _react.default.createElement("li", {
          key: "co-dialog-bottom-item".concat(index),
          hidden: !item.show,
          className: (0, _classnames.default)('co-dialog-bottom-item', item.icon, item.theme, item.topictype),
          onClick: function onClick() {
            return onItemClick && onItemClick(item.key, "", item.topictype);
          },
          type: item.topicType,
          dangerouslySetInnerHTML: dangerHtml(item.content)
        });
      }
    }
  })), close && genClose(_objectSpread({}, props)));
}
/**
 * 底部取消按钮
 */


function genClose(_ref3) {
  var closeText = _ref3.closeText,
      onClose = _ref3.onClose,
      onDelete = _ref3.onDelete;
  return _react.default.createElement("li", {
    className: "co-dialog-bottom-close",
    onClick: function onClick() {
      onDelete ? onDelete() : onClose();
    }
  }, closeText || '取消');
}

var _default = BottomDialog;
exports.default = _default;

/***/ }),

/***/ "./wechat-react/components/dialog/confirm.js":
/*!***************************************************!*\
  !*** ./wechat-react/components/dialog/confirm.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _middleDialog = _interopRequireDefault(__webpack_require__(/*! ./middle-dialog */ "./wechat-react/components/dialog/middle-dialog.js"));

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _class;

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

/**
 * 确认框，按钮可配置，状态自管理
 */
var Confirm = (0, _coreDecorators.autobind)(_class =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Confirm, _PureComponent);

  function Confirm(props) {
    var _this;

    _classCallCheck(this, Confirm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Confirm).call(this, props));
    _this.state = {
      show: false
    };
    return _this;
  }

  _createClass(Confirm, [{
    key: "show",
    value: function show() {
      this.setState({
        show: true
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      this.setState({
        show: false
      });
    }
  }, {
    key: "onClose",
    value: function onClose(e) {
      this.props.onClose && this.props.onClose(e);
      this.hide();
    }
  }, {
    key: "onBtnClick",
    value: function onBtnClick(tag) {
      if (tag === 'cancel') {
        this.props.onClose && this.props.onClose();
        this.hide();
      }

      this.props.onBtnClick && this.props.onBtnClick(tag);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$buttons = _this$props.buttons,
          buttons = _this$props$buttons === void 0 ? 'cancel-confirm' : _this$props$buttons,
          title = _this$props.title,
          children = _this$props.children,
          _this$props$buttonThe = _this$props.buttonTheme,
          buttonTheme = _this$props$buttonThe === void 0 ? 'line' : _this$props$buttonThe,
          _this$props$titleThem = _this$props.titleTheme,
          titleTheme = _this$props$titleThem === void 0 ? 'white' : _this$props$titleThem,
          className = _this$props.className,
          _this$props$cancelTex = _this$props.cancelText,
          cancelText = _this$props$cancelTex === void 0 ? this.props.cancelText || "取消" : _this$props$cancelTex,
          _this$props$confirmTe = _this$props.confirmText,
          confirmText = _this$props$confirmTe === void 0 ? this.props.confirmText || "确定" : _this$props$confirmTe,
          _this$props$close = _this$props.close,
          close = _this$props$close === void 0 ? false : _this$props$close,
          _this$props$bghide = _this$props.bghide,
          bghide = _this$props$bghide === void 0 ? true : _this$props$bghide,
          confirmDisabled = _this$props.confirmDisabled;
      var show = this.state.show;
      return _react.default.createElement(_middleDialog.default, {
        title: title,
        titleTheme: titleTheme,
        show: show,
        theme: "empty",
        close: close,
        onClose: this.onClose,
        buttons: buttons,
        cancelText: cancelText,
        confirmText: confirmText,
        buttonTheme: buttonTheme,
        onBtnClick: this.onBtnClick,
        className: className,
        bghide: bghide,
        confirmDisabled: confirmDisabled
      }, _react.default.createElement("div", {
        className: "co-dialog-confirm"
      }, children));
    }
  }]);

  return Confirm;
}(_react.PureComponent)) || _class;

Confirm.propTypes = {
  // 标题
  title: _propTypes.default.string,
  // buttons
  // cancel: 取消按钮
  // confirm: 确认按钮
  // cancel-confirm: 左取消右确认按钮 (默认)
  //confirm-cancel:右取消左确认确认按钮
  buttons: _propTypes.default.oneOf(['cancel', 'confirm', 'cancel-confirm', 'confirm-cancel', 'none', '']),
  // 按钮点击事件
  // 回调参数: (tag: ['cancel' | 'confirm']) => null
  onBtnClick: _propTypes.default.func,
  // 按钮样式
  buttonTheme: _propTypes.default.oneOf(['line', 'block']),
  // 确认按钮文案
  confirmText: _propTypes.default.string,
  // 取消按钮文案
  cancelText: _propTypes.default.string,
  // 标题的样式
  // white: 白色的头部
  // blue: 蓝色的头部
  titleTheme: _propTypes.default.oneOf(['white', 'blue', 'red']),
  // 自定义样式
  className: _propTypes.default.string
};
var _default = Confirm;
exports.default = _default;

/***/ }),

/***/ "./wechat-react/components/dialog/index.js":
/*!*************************************************!*\
  !*** ./wechat-react/components/dialog/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MiddleDialog", {
  enumerable: true,
  get: function get() {
    return _middleDialog.default;
  }
});
Object.defineProperty(exports, "BottomDialog", {
  enumerable: true,
  get: function get() {
    return _bottomDialog.default;
  }
});
Object.defineProperty(exports, "Confirm", {
  enumerable: true,
  get: function get() {
    return _confirm.default;
  }
});
Object.defineProperty(exports, "ListDialog", {
  enumerable: true,
  get: function get() {
    return _listDialog.default;
  }
});
Object.defineProperty(exports, "IsBuyDialog", {
  enumerable: true,
  get: function get() {
    return _isBuyDialog.default;
  }
});

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _middleDialog = _interopRequireDefault(__webpack_require__(/*! ./middle-dialog */ "./wechat-react/components/dialog/middle-dialog.js"));

var _bottomDialog = _interopRequireDefault(__webpack_require__(/*! ./bottom-dialog */ "./wechat-react/components/dialog/bottom-dialog.js"));

var _confirm = _interopRequireDefault(__webpack_require__(/*! ./confirm */ "./wechat-react/components/dialog/confirm.js"));

var _listDialog = _interopRequireDefault(__webpack_require__(/*! ./list-dialog */ "./wechat-react/components/dialog/list-dialog.js"));

var _isBuyDialog = _interopRequireDefault(__webpack_require__(/*! ./is-buy-dialog */ "./wechat-react/components/dialog/is-buy-dialog.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/***/ }),

/***/ "./wechat-react/components/dialog/is-buy-dialog.js":
/*!*********************************************************!*\
  !*** ./wechat-react/components/dialog/is-buy-dialog.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _class;

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

/**
 * 未购买弹窗
 */
var IsBuyDialog = (0, _coreDecorators.autobind)(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(IsBuyDialog, _Component);

  function IsBuyDialog(props) {
    var _this;

    _classCallCheck(this, IsBuyDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IsBuyDialog).call(this, props));
    _this.state = {
      show: false
    };
    return _this;
  }

  _createClass(IsBuyDialog, [{
    key: "show",
    value: function show() {
      this.setState({
        show: true
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      this.setState({
        show: false
      });
    }
  }, {
    key: "confirm",
    value: function confirm() {
      this.props.onBtnClick({
        type: 'cancel'
      });
      this.hide();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      this.props.onBtnClick({
        type: 'cancel'
      });
      this.hide();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          title = _this$props.title,
          desc = _this$props.desc,
          _this$props$cancelTex = _this$props.cancelText,
          cancelText = _this$props$cancelTex === void 0 ? this.props.cancelText || "取消" : _this$props$cancelTex,
          _this$props$confirmTe = _this$props.confirmText,
          confirmText = _this$props$confirmTe === void 0 ? this.props.confirmText || "确定" : _this$props$confirmTe,
          money = _this$props.money;
      var show = this.state.show;
      return show && _react.default.createElement("div", {
        className: "is-buy-dialog co-dialog-container"
      }, _react.default.createElement("div", {
        className: "co-dialog-bg"
      }, _react.default.createElement("div", {
        className: "co-dialog-content"
      }, _react.default.createElement("p", {
        className: "title"
      }, title), _react.default.createElement("p", {
        className: "desc"
      }, desc), _react.default.createElement("div", {
        className: "btn-group"
      }, _react.default.createElement("div", {
        className: "btn confirm",
        onClick: function onClick() {
          _this2.confirm();
        }
      }, _react.default.createElement("span", null, confirmText))), _react.default.createElement("span", {
        className: "co-dialog-close normal-style",
        onClick: function onClick() {
          _this2.hide();
        }
      }))));
    }
  }]);

  return IsBuyDialog;
}(_react.Component)) || _class;

IsBuyDialog.propTypes = {
  // 标题
  title: _propTypes.default.string,
  // 描述
  desc: _propTypes.default.string,
  // 按钮点击事件
  // 回调参数: (tag: ['cancel' | 'confirm']) => null
  onBtnClick: _propTypes.default.func,
  // 确认按钮文案
  confirmText: _propTypes.default.string,
  // 取消按钮文案
  cancelText: _propTypes.default.string,
  // 价格
  money: _propTypes.default.number
};
var _default = IsBuyDialog;
exports.default = _default;

/***/ }),

/***/ "./wechat-react/components/dialog/list-dialog.js":
/*!*******************************************************!*\
  !*** ./wechat-react/components/dialog/list-dialog.js ***!
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

var _confirm = _interopRequireDefault(__webpack_require__(/*! ./confirm */ "./wechat-react/components/dialog/confirm.js"));

var _scrollToLoad = _interopRequireDefault(__webpack_require__(/*! ../scrollToLoad */ "./wechat-react/components/scrollToLoad/index.js"));

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

var ListDialog =
/*#__PURE__*/
function (_Component) {
  _inherits(ListDialog, _Component);

  function ListDialog() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ListDialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ListDialog)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "dangerHtml", function (content) {
      return {
        __html: content
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      list: []
    });

    return _this;
  }

  _createClass(ListDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        list: this.props.items
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        list: nextProps.items
      });
    }
  }, {
    key: "show",
    value: function show() {
      this.refs.dialog.show();
    }
  }, {
    key: "hide",
    value: function hide() {
      this.refs.dialog.hide();
    }
    /**
     * 获取选中的项目
     */

  }, {
    key: "getSelectedItem",
    value: function getSelectedItem() {
      return this.state.list.filter(function (item) {
        return item.checked;
      })[0];
    }
  }, {
    key: "onSelectItem",
    value: function onSelectItem(index) {
      this.setState({
        list: this.state.list.map(function (item, i) {
          if (i === index) {
            item.checked = true;
          } else {
            item.checked = false;
          }

          return item;
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          title = _this$props.title,
          buttons = _this$props.buttons,
          className = _this$props.className,
          _onBtnClick = _this$props.onBtnClick,
          noMore = _this$props.noMore,
          loadNext = _this$props.loadNext;

      if (loadNext == null) {
        loadNext = function loadNext() {};

        noMore = true;
      }

      return _react.default.createElement(_confirm.default, {
        ref: "dialog",
        title: title,
        buttons: buttons,
        className: className + ' co-list-dialog',
        onBtnClick: function onBtnClick(key) {
          return _onBtnClick(key, _this2.getSelectedItem());
        }
      }, _react.default.createElement("div", {
        className: "co-list-container"
      }, _react.default.createElement(_scrollToLoad.default, {
        className: "co-list-wrap",
        loadNext: loadNext,
        noMore: noMore
      }, this.state.list.map(function (item, index) {
        return _react.default.createElement("li", {
          key: "co-list-item-".concat(item.key),
          className: "co-list-dialog-item ".concat(item.checked ? 'icon_checked' : ''),
          onClick: function onClick() {
            return _this2.onSelectItem(index);
          },
          dangerouslySetInnerHTML: _this2.dangerHtml(item.content)
        });
      }))));
    }
  }]);

  return ListDialog;
}(_react.Component);

ListDialog.propTypes = {
  items: _propTypes.default.arrayOf(_propTypes.default.shape({
    // 选中的回调值
    key: _propTypes.default.any,
    // 内容，可以是一个html字符串，将原封不动的放进item中
    content: _propTypes.default.string,
    // 是否选中
    checked: _propTypes.default.bool
  })).isRequired,
  // 列表内部滚动加载的回调方法
  loadNext: _propTypes.default.func,
  // 没有更多了
  noMore: _propTypes.default.bool
};
ListDialog.defaultProps = {
  loadNext: null
};
var _default = ListDialog;
exports.default = _default;

/***/ }),

/***/ "./wechat-react/components/dialog/middle-dialog.js":
/*!*********************************************************!*\
  !*** ./wechat-react/components/dialog/middle-dialog.js ***!
  \*********************************************************/
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

MiddleDialog.propTypes = {
  // 是否显示弹框
  show: _propTypes.default.bool.isRequired,
  // 设置是否点击背景关闭弹框
  bghide: _propTypes.default.bool,
  // theme
  // empty: 一个空白弹框，啥都没有
  // primary: 一个蓝色背景的头部
  theme: _propTypes.default.oneOf(['empty', 'primary']),
  // 标题
  title: _propTypes.default.string,
  // 标题的样式
  // white: 白色的头部
  // blue: 蓝色的头部
  titleTheme: _propTypes.default.oneOf(['white', 'blue']),
  // buttons
  // none(default): 隐藏按钮栏
  // cancel: 取消按钮
  // confirm: 确认按钮
  // cancel-confirm: 左取消右确认按钮
  // confirm-cancel: 右取消左确认按钮
  buttons: _propTypes.default.oneOf(['none', 'cancel', 'confirm', 'cancel-confirm', 'confirm-cancel']),
  // 取消按钮文案
  cancelText: _propTypes.default.string,
  // 确认按钮文案
  confirmText: _propTypes.default.string,
  // buttonTheme
  // line: 线条隔开形式的按钮
  // block: 方块形式的按钮
  buttonTheme: _propTypes.default.oneOf(['line', 'block']),
  // 按钮点击事件
  // 回调参数: (tag: string) => null
  onBtnClick: _propTypes.default.func,
  // 是否显示关闭按钮
  close: _propTypes.default.bool,
  // 关闭事件(关闭按钮触发或者点击背景触发)
  onClose: _propTypes.default.func,
  closeStyle: _propTypes.default.string,
  className: _propTypes.default.string,
  contentClassName: _propTypes.default.string,
  confirmDisabled: _propTypes.default.bool,
  // confirm按钮是否无效
  // 关闭按钮埋点
  trackCloseBtnModel: _propTypes.default.objectOf(_propTypes.default.string)
};
MiddleDialog.defaultProps = {
  onClose: function onClose() {}
};
/**
 * 中间弹框组件
 */

function MiddleDialog(_ref) {
  var show = _ref.show,
      theme = _ref.theme,
      _ref$titleTheme = _ref.titleTheme,
      titleTheme = _ref$titleTheme === void 0 ? 'white' : _ref$titleTheme,
      buttons = _ref.buttons,
      buttonTheme = _ref.buttonTheme,
      close = _ref.close,
      _ref$closeStyle = _ref.closeStyle,
      closeStyle = _ref$closeStyle === void 0 ? "normal-style" : _ref$closeStyle,
      closeProps = _ref.closeProps,
      onClose = _ref.onClose,
      children = _ref.children,
      title = _ref.title,
      onBtnClick = _ref.onBtnClick,
      className = _ref.className,
      contentClassName = _ref.contentClassName,
      _ref$cancelText = _ref.cancelText,
      cancelText = _ref$cancelText === void 0 ? "取消" : _ref$cancelText,
      _ref$confirmText = _ref.confirmText,
      confirmText = _ref$confirmText === void 0 ? "确定" : _ref$confirmText,
      _ref$bghide = _ref.bghide,
      bghide = _ref$bghide === void 0 ? true : _ref$bghide,
      _ref$confirmDisabled = _ref.confirmDisabled,
      confirmDisabled = _ref$confirmDisabled === void 0 ? false : _ref$confirmDisabled,
      _ref$trackCloseBtnMod = _ref.trackCloseBtnModel,
      trackCloseBtnModel = _ref$trackCloseBtnMod === void 0 ? {} : _ref$trackCloseBtnMod;

  if (!show) {
    return null;
  }

  var titleNode;

  if (title) {
    titleNode = genTitle(title, titleTheme);
  }

  var buttonNode;

  if (buttonTheme === 'line') {
    buttonNode = genLineButton(buttons, cancelText, confirmText, onBtnClick, confirmDisabled);
  } else if (buttonTheme === 'block') {
    buttonNode = genBlockButton(buttons, cancelText, confirmText, onBtnClick);
  }

  var closeNode;

  if (close) {
    closeNode = genClose(onClose, closeStyle, closeProps, trackCloseBtnModel);
  }

  return _react.default.createElement("div", {
    className: 'co-dialog-container ' + className
  }, _react.default.createElement("div", {
    className: "co-dialog-bg",
    onClick: function onClick(e) {
      e.nativeEvent.stopImmediatePropagation();
      bghide && onClose(e);
    }
  }), _react.default.createElement("div", {
    className: "co-dialog-content"
  }, closeNode, titleNode, _react.default.createElement("main", {
    className: contentClassName
  }, children), buttonNode));
}

var _default = MiddleDialog;
exports.default = _default;

var dangerHtml = function dangerHtml(content) {
  return {
    __html: content
  };
};
/**
 * 生成头部标题
 */


function genTitle(title, titleTheme) {
  return _react.default.createElement("div", {
    className: (0, _classnames.default)('co-dialog-title', titleTheme),
    dangerouslySetInnerHTML: dangerHtml(title)
  });
}
/**
 * 生成线条隔开的按钮
 */


function genLineButton(buttons, cancelText, confirmText, _onClick, confirmDisabled) {
  if (buttons === 'none') {
    return '';
  } else if (buttons === 'cancel') {
    return _react.default.createElement("div", {
      className: "co-dialog-btn-line"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-line-cancel",
      onClick: function onClick(e) {
        e.nativeEvent.stopImmediatePropagation();

        _onClick('cancel');
      }
    }, cancelText));
  } else if (buttons === 'confirm') {
    return _react.default.createElement("div", {
      className: "co-dialog-btn-line"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-line-confirm",
      onClick: function onClick() {
        return _onClick('confirm');
      }
    }, confirmText));
  } else if (buttons === 'cancel-confirm') {
    return _react.default.createElement("div", {
      className: "co-dialog-btn-line"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-line-cancel",
      onClick: function onClick(e) {
        e.nativeEvent.stopImmediatePropagation();

        _onClick('cancel');
      }
    }, cancelText), confirmDisabled ? _react.default.createElement("span", {
      className: "co-dialog-btn-line-confirm disabled"
    }, confirmText) : _react.default.createElement("span", {
      className: "co-dialog-btn-line-confirm",
      onClick: function onClick() {
        return _onClick('confirm');
      }
    }, confirmText));
  } else if (buttons === 'confirm-cancel') {
    return _react.default.createElement("div", {
      className: "co-dialog-btn-line"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-line-confirm",
      onClick: function onClick() {
        return _onClick('confirm');
      }
    }, confirmText), _react.default.createElement("span", {
      className: "co-dialog-btn-line-cancel",
      onClick: function onClick(e) {
        e.nativeEvent.stopImmediatePropagation();

        _onClick('cancel');
      }
    }, cancelText));
  }
}
/**
 * 生成方块状的按钮
 */


function genBlockButton(buttons, cancelText, confirmText, _onClick2) {
  if (buttons === 'none') {
    return '';
  } else if (buttons === 'cancel') {
    return _react.default.createElement("div", {
      className: "co-dialog-btn-block"
    }, _react.default.createElement("div", {
      className: "co-dialog-btn-block-wrap"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-block-cancel",
      onClick: function onClick(e) {
        e.nativeEvent.stopImmediatePropagation();

        _onClick2('cancel');
      }
    }, cancelText)));
  } else if (buttons === 'confirm') {
    return _react.default.createElement("div", {
      className: "co-dialog-btn-block"
    }, _react.default.createElement("div", {
      className: "co-dialog-btn-block-wrap"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-block-confirm",
      onClick: function onClick() {
        return _onClick2('confirm');
      }
    }, confirmText)));
  } else if (buttons === 'cancel-confirm') {
    return _react.default.createElement("div", {
      className: "co-dialog-btn-block"
    }, _react.default.createElement("div", {
      className: "co-dialog-btn-block-wrap"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-block-cancel",
      onClick: function onClick(e) {
        e.nativeEvent.stopImmediatePropagation();

        _onClick2('cancel');
      }
    }, cancelText)), _react.default.createElement("div", {
      className: "co-dialog-btn-block-wrap"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-block-confirm",
      onClick: function onClick() {
        return _onClick2('confirm');
      }
    }, confirmText)));
  } else if (buttons === 'confirm-cancel') {
    return _react.default.createElement("div", {
      className: "co-dialog-btn-block"
    }, _react.default.createElement("div", {
      className: "co-dialog-btn-block-wrap"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-block-confirm",
      onClick: function onClick() {
        return _onClick2('confirm');
      }
    }, confirmText)), _react.default.createElement("div", {
      className: "co-dialog-btn-block-wrap"
    }, _react.default.createElement("span", {
      className: "co-dialog-btn-block-cancel",
      onClick: function onClick(e) {
        e.nativeEvent.stopImmediatePropagation();

        _onClick2('cancel');
      }
    }, cancelText)));
  }
}
/**
 * 生成关闭按钮
 */


function genClose(onClose, closeStyle, closeProps, trackCloseBtnModel) {
  return _react.default.createElement("div", _extends({
    className: "co-dialog-close ".concat(closeStyle),
    "data-log-name": trackCloseBtnModel.name,
    "data-log-region": trackCloseBtnModel.region,
    "data-log-pos": trackCloseBtnModel.pos,
    onClick: function onClick(e) {
      return onClose(e);
    }
  }, closeProps));
}

/***/ }),

/***/ "./wechat-react/components/switch/index.js":
/*!*************************************************!*\
  !*** ./wechat-react/components/switch/index.js ***!
  \*************************************************/
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

// Switch 组件
var Switch = function Switch(_ref) {
  var active = _ref.active,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'lg' : _ref$size,
      preChange = _ref.preChange,
      onChange = _ref.onChange,
      className = _ref.className,
      dataLog = _ref.dataLog;
  return _react.default.createElement("div", {
    className: (0, _classnames.default)('co-switch', className, size, {
      'active': active
    }),
    "data-log-region": dataLog && dataLog.region,
    "data-log-pos": dataLog && dataLog.pos,
    onClick: onChange
  });
};

Switch.propTypes = {
  // Switch是开关状态
  active: _propTypes.default.bool.isRequired,
  // switch的大小
  size: _propTypes.default.oneOf(['lg', 'md', 'sm']),
  // 改变状态时调用
  onChange: _propTypes.default.func,
  // 自定义样式
  className: _propTypes.default.string
};
var _default = Switch;
exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=2.chunk.js.map