(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

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

/***/ "./wechat-react/mine/containers/user-info/index.js":
/*!*********************************************************!*\
  !*** ./wechat-react/mine/containers/user-info/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _page = _interopRequireDefault(__webpack_require__(/*! components/page */ "./wechat-react/components/page/index.js"));

var _reactDialog = __webpack_require__(/*! @ql-feat/react-dialog */ "../node_modules/@ql-feat/react-dialog/dist/index.js");

var _detect = _interopRequireDefault(__webpack_require__(/*! components/detect */ "./wechat-react/components/detect.js"));

var _common = __webpack_require__(/*! common_actions/common */ "./wechat-react/actions/common.js");

var _util = __webpack_require__(/*! components/util */ "./wechat-react/components/util.js");

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

var PageContainer =
/*#__PURE__*/
function (_Component) {
  _inherits(PageContainer, _Component);

  function PageContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PageContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PageContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      _name: '',
      _headImgUrl: ''
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClickBindPhone", function () {
      if (_this.props.userInfo.isBind === 'Y') {
        window.simpleDialog({
          msg: "\u5DF2\u7ECF\u7ED1\u5B9A\u624B\u673A\u53F7\u7801".concat(_this.props.userInfo.mobile, "\uFF0C\u662F\u5426\u786E\u8BA4\u89E3\u9664\u7ED1\u5B9A?"),
          onConfirm: function () {
            var _onConfirm = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return _this.props.unbindPhone();

                    case 2:
                      if (!_context.sent) {
                        _context.next = 4;
                        break;
                      }

                      window.toast('解绑成功');

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));

            function onConfirm() {
              return _onConfirm.apply(this, arguments);
            }

            return onConfirm;
          }()
        });
      } else {
        (0, _util.locationTo)('/wechat/page/phone-auth');
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClickEditName", function () {
      _this.setState({
        _name: _this.props.userInfo.name
      });

      _this.refUsernameModal.show();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onChangeName", function (e) {
      _this.setState({
        _name: e.target.value.trim()
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onChangeInputAvatar", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      e.target.value = '';
      window.loading(true);
      (0, _common.insertOssSdk)().then(function () {
        return _this.props.uploadImage(file);
      }).then(function (_headImgUrl) {
        if (!_headImgUrl) throw Error('上传图片失败');

        _this.setState({
          _headImgUrl: _headImgUrl
        });
      }).catch(function (err) {
        window.toast(err.message);
      }).then(function () {
        window.loading(false);
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClickAvatarConfirm", function (type) {
      if (type === 'confirm') {
        if (!_this.state._headImgUrl) {
          _this.refAvatarModal.hide();

          return;
        }

        window.loading(true);
        (0, _common.request)({
          method: 'GET',
          url: '/api/wechat/transfer/h5/user/updateInfo',
          body: {
            name: _this.props.userInfo.name,
            headImgUrl: _this.state._headImgUrl
          }
        }).then(function (res) {
          window.toast(res.state.msg);

          if (res.state.code == 0) {
            _this.props.updateUserInfo({
              headImgUrl: _this.state._headImgUrl
            });
          }
        }).catch(function (err) {
          window.toast(err.message, 2000);

          _this.setState({
            _headImgUrl: ''
          });
        }).then(function () {
          window.loading(false);

          _this.refAvatarModal.hide();
        });
      } else {
        _this.setState({
          _headImgUrl: ''
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClickUsernameConfirm", function (type) {
      if (type === 'confirm') {
        var name = _this.refUsername.value.trim();

        if (!name) return window.toast('请输入有效名称');
        if (name.length > 14) return window.toast('名称不能超过14个字');
        window.loading(true);
        (0, _common.request)({
          method: 'POST',
          url: '/api/wechat/transfer/h5/user/updateInfo',
          body: {
            name: name,
            headImgUrl: _this.props.userInfo.headImgUrl
          }
        }).then(function (res) {
          window.toast(res.state.msg);

          if (res.state.code == 0) {
            sessionStorage.removeItem(_this.props.userInfo.userId);

            _this.props.updateUserInfo({
              name: name
            });
          }
        }).catch(function (err) {
          window.toast(err.state.msg, 2000);
        }).then(function () {
          window.loading(false);

          _this.refUsernameModal.hide();
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onClickLogout", function () {
      simpleDialog({
        msg: "是否确定要退出当前帐号？",
        onConfirm: function onConfirm() {
          if (!_detect.default.os.android && !_detect.default.os.ios) {
            (0, _util.locationTo)('/loginOut.htm');
          } else {
            (0, _util.locationTo)('/loginOut.htm?url=' + window.location.origin + encodeURIComponent('/wechat/page/wx-login/'));
          }
        }
      });
    });

    return _this;
  }

  _createClass(PageContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.getUserInfoP();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var userInfo = this.props.userInfo;
      if (!userInfo) return false;
      return _react.default.createElement(_page.default, {
        title: "\u7F16\u8F91\u4E2A\u4EBA\u4FE1\u606F",
        className: "p-ls-mine-info"
      }, _react.default.createElement("div", {
        className: "row-group"
      }, _react.default.createElement("div", {
        className: "row subfield",
        onClick: function onClick() {
          return _this2.refAvatarModal.show();
        }
      }, "\u5934\u50CF", _react.default.createElement("div", {
        className: "right"
      }, !!userInfo.headImgUrl && _react.default.createElement("img", {
        className: "avatar",
        src: (0, _util.imgUrlFormat)(userInfo.headImgUrl, '?x-oss-process=image/resize,m_fill,limit_0,h_180,w_180'),
        alt: ""
      }))), _react.default.createElement("div", {
        className: "row subfield",
        onClick: this.onClickEditName
      }, "\u540D\u79F0", _react.default.createElement("div", {
        className: "right"
      }, userInfo.name, _react.default.createElement("i", {
        className: "icon_enter"
      }))), _react.default.createElement("div", {
        className: "row subfield"
      }, "ID", _react.default.createElement("div", {
        className: "right"
      }, userInfo.userId)), _react.default.createElement("div", {
        className: "row subfield",
        onClick: this.onClickBindPhone
      }, "\u7ED1\u5B9A\u624B\u673A\u53F7", _react.default.createElement("div", {
        className: "right"
      }, userInfo.isBind === 'Y' ? userInfo.mobile : _react.default.createElement("span", {
        style: {
          color: '#F73657'
        }
      }, "\u672A\u7ED1\u5B9A"), _react.default.createElement("i", {
        className: "icon_enter"
      })))), _react.default.createElement("div", {
        className: "row-group"
      }, _react.default.createElement("div", {
        className: "row logout",
        onClick: this.onClickLogout
      }, "\u9000\u51FA\u767B\u5F55")), _react.default.createElement(_reactDialog.Confirm, {
        className: "username-modal",
        title: "\u540D\u79F0",
        ref: function ref(r) {
          return _this2.refUsernameModal = r;
        },
        onBtnClick: this.onClickUsernameConfirm
      }, _react.default.createElement("input", {
        type: "text",
        placeholder: "\u8BF7\u8F93\u5165\u540D\u79F0,\u6700\u591A\u8F93\u516514\u4E2A\u5B57",
        ref: function ref(r) {
          return _this2.refUsername = r;
        },
        value: this.state._name,
        onChange: this.onChangeName
      })), _react.default.createElement(_reactDialog.Confirm, {
        className: "avatar-modal",
        title: "\u5934\u50CF",
        ref: function ref(r) {
          return _this2.refAvatarModal = r;
        },
        onBtnClick: this.onClickAvatarConfirm,
        onClose: function onClose() {
          return _this2.setState({
            _headImgUrl: ''
          });
        }
      }, _react.default.createElement("div", {
        className: "upload-avatar-wrap"
      }, _react.default.createElement("img", {
        src: (0, _util.imgUrlFormat)(this.state._headImgUrl || userInfo.headImgUrl, '?x-oss-process=image/resize,m_fill,limit_0,h_180,w_180')
      }), _react.default.createElement("div", {
        className: "btn-upload-avatar"
      }, "\u70B9\u51FB\u4E0A\u4F20\u56FE\u7247"), _react.default.createElement("input", {
        type: "file",
        ref: function ref(r) {
          return _this2.refInputAvatar = r;
        },
        accept: "image/jpg,image/jpeg,image/png,image/gif,image/bmp",
        onChange: this.onChangeInputAvatar
      }))));
    }
  }]);

  return PageContainer;
}(_react.Component);

var _default = (0, _reactRedux.connect)(function (state) {
  return {
    userInfo: state.common.userInfo.user || {}
  };
}, {
  getUserInfoP: _common.getUserInfoP,
  uploadImage: _common.uploadImage,
  unbindPhone: _common.unbindPhone,
  updateUserInfo: _common.updateUserInfo
})(PageContainer);

exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=8.chunk.js.map