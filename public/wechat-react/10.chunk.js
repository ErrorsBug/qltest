(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10],{

/***/ "./wechat-react/mine/containers/business-payment-takeincome/components/form-item/index.js":
/*!************************************************************************************************!*\
  !*** ./wechat-react/mine/containers/business-payment-takeincome/components/form-item/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(props) {
  return _react.default.createElement("div", {
    className: "form-item"
  }, _react.default.createElement("div", {
    className: "title"
  }, props.title, "\uFF1A"), _react.default.createElement("div", {
    className: "input"
  }, _react.default.createElement("input", {
    type: "text",
    disabled: props.disabled,
    placeholder: props.placeholder,
    value: props.value,
    onChange: props.onChange
  })));
}

/***/ }),

/***/ "./wechat-react/mine/containers/business-payment-takeincome/index.js":
/*!***************************************************************************!*\
  !*** ./wechat-react/mine/containers/business-payment-takeincome/index.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _coreDecorators = __webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js");

var _page = _interopRequireDefault(__webpack_require__(/*! components/page */ "./wechat-react/components/page/index.js"));

var _formItem = _interopRequireDefault(__webpack_require__(/*! ./components/form-item */ "./wechat-react/mine/containers/business-payment-takeincome/components/form-item/index.js"));

var _dialog = __webpack_require__(/*! components/dialog */ "./wechat-react/components/dialog/index.js");

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _common = __webpack_require__(/*! ../../../actions/common */ "./wechat-react/actions/common.js");

var _businessPaymentTakeincome = __webpack_require__(/*! ../../actions/business-payment-takeincome */ "./wechat-react/mine/actions/business-payment-takeincome.js");

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

var BusinessPaymentTakeIncome = (0, _coreDecorators.autobind)(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(BusinessPaymentTakeIncome, _Component);

  function BusinessPaymentTakeIncome() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BusinessPaymentTakeIncome);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BusinessPaymentTakeIncome)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      applyAmount: "",
      promiseLetterUrl: "",
      isFocus: false
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "refs", {
      promiseDialog: null
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "data", {
      // 水印图片地址
      watermark: "https://img.qlchat.com/qlLive/business/B7BQHAYM-8L97-V664-1554953766693-S2L17XQJJJ7X.png"
    });

    return _this;
  }

  _createClass(BusinessPaymentTakeIncome, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.initStsInfo();
                _context.next = 3;
                return this.props.getUserInfo();

              case 3:
                _context.next = 5;
                return this.props.getPubToPubMessage({
                  liveId: this.props.location.query["liveId"],
                  userId: this.props.userInfo.user.userId
                });

              case 5:
                res = _context.sent;

              case 6:
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
    key: "initStsInfo",
    value: function initStsInfo() {
      var script = document.createElement("script");
      script.src = "//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js";
      document.body.appendChild(script);
    }
  }, {
    key: "changeHandler",
    value: function changeHandler(e, name) {
      var val = e.target.value;
      this.setState(_defineProperty({}, name, val));
    }
  }, {
    key: "showPromiseDialog",
    value: function showPromiseDialog() {
      this.promiseDialog.show();
    }
  }, {
    key: "hidePromiseDialog",
    value: function hidePromiseDialog() {
      this.promiseDialog.hide();
    }
  }, {
    key: "handleAmountChange",
    value: function handleAmountChange(e) {
      var val = e.target.value; // const fee  = this.getFee(val);
      // console.log(';FUCK', fee)

      this.setState({
        applyAmount: val
      });
    }
    /**
     * 计算手续费率
     * @param {string} amount 申请额度
     */

  }, {
    key: "getFeeText",
    value: function getFeeText(amount) {
      if (amount.length <= 0) return;
      var money = Number(amount);

      if (isNaN(money)) {
        return _react.default.createElement("p", {
          className: "text moneyrate"
        }, "\u8BF7\u8F93\u51652~50\u4E07\u8303\u56F4\u7684\u6570\u5B57");
      }

      if (money >= 20000 && money <= 200000) {
        var fee = money - money * 0.05;
        return _react.default.createElement("p", {
          className: "text moneyrate"
        }, "\u672C\u6B21\u63D0\u73B0\u7684\u670D\u52A1\u8D39\u7387\u4E3A", _react.default.createElement("span", null, "5%"), "\uFF0C\u6263\u9664\u540E\u63D0\u73B0\u5230\u8D26\u91D1\u989D\u4E3A", _react.default.createElement("span", null, fee), "\u5143");
      } else if (money > 200000 && money <= 500000) {
        var _fee = money - money * 0.03;

        return _react.default.createElement("p", {
          className: "text moneyrate"
        }, "\u672C\u6B21\u63D0\u73B0\u7684\u670D\u52A1\u8D39\u7387\u4E3A", _react.default.createElement("span", null, "3%"), "\uFF0C\u6263\u9664\u540E\u63D0\u73B0\u5230\u8D26\u91D1\u989D\u4E3A", _react.default.createElement("span", null, _fee), "\u5143");
      } else {
        return _react.default.createElement("p", {
          className: "text moneyrate"
        }, "\u8BF7\u8F93\u51652~50\u4E07\u8303\u56F4\u7684\u6570\u5B57");
      }
    }
  }, {
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var money;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                money = Number(this.state.applyAmount);

                if (!(this.state.applyAmount.length <= 0)) {
                  _context2.next = 4;
                  break;
                }

                window && window.toast("请先输入申请金额", 3000);
                return _context2.abrupt("return");

              case 4:
                if (!(this.state.promiseLetterUrl.length <= 0)) {
                  _context2.next = 7;
                  break;
                }

                window && window.toast("请先上传承诺函", 3000);
                return _context2.abrupt("return");

              case 7:
                if (!(isNaN(money) || money < 20000 || money > 500000)) {
                  _context2.next = 10;
                  break;
                }

                window && window.toast("请输入2~50万范围的提现金额", 3000);
                return _context2.abrupt("return");

              case 10:
                this.props.commitApply({
                  money: this.state.applyAmount,
                  liveId: this.props.location.query["liveId"],
                  userId: this.props.userInfo.user.userId,
                  commitmentLetter: this.state.promiseLetterUrl
                });

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function submit() {
        return _submit.apply(this, arguments);
      }

      return submit;
    }()
  }, {
    key: "uploadImage",
    value: function () {
      var _uploadImage = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(e) {
        var file, backgroundUrl, watermarkFile;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                file = e.target.files[0];
                _context3.prev = 1;
                _context3.next = 4;
                return this.addImageWatermark(file, this.data.watermark);

              case 4:
                watermarkFile = _context3.sent;
                _context3.next = 7;
                return this.props.uploadImage(watermarkFile, "topicBackground");

              case 7:
                backgroundUrl = _context3.sent;

                if (backgroundUrl) {
                  this.setState({
                    promiseLetterUrl: backgroundUrl
                  });
                }

                _context3.next = 13;
                break;

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](1);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 11]]);
      }));

      function uploadImage(_x) {
        return _uploadImage.apply(this, arguments);
      }

      return uploadImage;
    }()
    /**
     * 给图片添加居中的图片水印
     * @param {File} file HTML5 File对象
     * @param {String} watermarkImageUrl 水印图片的地址
     */

  }, {
    key: "addImageWatermark",
    value: function addImageWatermark(file, watermarkImageUrl) {
      var _this2 = this;

      var reader = new FileReader();
      var sourceImage = new Image();
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      return new Promise(function (resolve, reject) {
        try {
          reader.onload = function (event) {
            sourceImage.onload = function () {
              canvas.width = sourceImage.width;
              canvas.height = sourceImage.height;
              ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height);
              var watermarkImage = new Image();
              watermarkImage.crossOrigin = "anonymous";
              watermarkImage.src = "/api/wechat/image-proxy?url=".concat(watermarkImageUrl);

              watermarkImage.onload = function () {
                var watermarkImageWidth = watermarkImage.width;
                var watermarkImageHeight = watermarkImage.height;
                ctx.drawImage(watermarkImage, 0, 0, watermarkImageWidth, watermarkImageHeight, 0, 0, canvas.width, canvas.width * watermarkImageHeight / watermarkImageWidth);

                var blob = _this2.dataURLtoBlob(canvas.toDataURL("image/jpeg"));

                var resultFile = new File([blob], "tmp.jpg", {
                  type: "image/jpeg"
                });
                resolve(resultFile);
              };
            };

            sourceImage.src = event.target.result;
          };

          reader.readAsDataURL(file);
        } catch (err) {
          console.error("图片添加水印失败！");
        }
      });
    }
  }, {
    key: "dataURLtoBlob",
    value: function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], {
        type: mime
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react.default.createElement(_page.default, {
        title: "\u516C\u5BF9\u516C\u6253\u6B3E\u63D0\u73B0",
        className: "business-payment-takeincome"
      }, _react.default.createElement("div", {
        className: "scroll"
      }, _react.default.createElement("form", {
        className: "form"
      }, _react.default.createElement(_formItem.default, {
        title: "\u7533\u8BF7\u91D1\u989D",
        placeholder: "\u8BF7\u8F93\u5165\u91D1\u989D",
        value: this.state.applyAmount,
        onChange: this.handleAmountChange
      }), this.getFeeText(this.state.applyAmount), _react.default.createElement(_formItem.default, {
        title: "\u5F00\u6237\u884C",
        disabled: true,
        placeholder: "\u8BF7\u8F93\u5165\u5F00\u6237\u94F6\u884C",
        value: this.props.openBank,
        onChange: function onChange(e) {
          _this3.changeHandler(e, "accountBank");
        }
      }), _react.default.createElement(_formItem.default, {
        title: "\u6536\u6B3E\u8D26\u53F7",
        disabled: true,
        placeholder: "\u8BF7\u8F93\u5165\u6536\u6B3E\u8D26\u53F7",
        value: this.props.accountNo,
        onChange: function onChange(e) {
          _this3.changeHandler(e, "accountNumber");
        }
      }), _react.default.createElement(_formItem.default, {
        title: "\u6237\u540D",
        disabled: true,
        placeholder: "\u8BF7\u8F93\u5165\u6237\u540D",
        value: this.props.accountName,
        onChange: function onChange(e) {
          _this3.changeHandler(e, "accountName");
        }
      })), _react.default.createElement("div", {
        className: "upload-box"
      }, _react.default.createElement("div", {
        className: "header"
      }, "\u4E0A\u4F20\u627F\u8BFA\u51FD", _react.default.createElement("span", {
        className: "upload-tip",
        onClick: this.showPromiseDialog
      }), _react.default.createElement("a", {
        className: "download-btn",
        href: "https://static.qianliaowang.com/frontend/rs/doc/\u5927\u989D\u63D0\u6B3E\u627F\u8BFA\u4E66-ytxjeyfw.doc",
        download: "\u5927\u989D\u63D0\u6B3E\u627F\u8BFA\u4E66.doc"
      }, "\u4E0B\u8F7D\u6A21\u677F")), _react.default.createElement("div", {
        className: "content"
      }, _react.default.createElement("div", {
        className: "upload-img-wrap",
        style: this.state.promiseLetterUrl.length > 0 ? {
          background: "url(".concat(this.state.promiseLetterUrl, ") 0% 0% / cover no-repeat")
        } : {}
      }, this.state.promiseLetterUrl.length <= 0 && _react.default.createElement("div", {
        className: "upload-empty"
      }, _react.default.createElement("span", {
        className: "icon-upload"
      }), _react.default.createElement("p", {
        className: "upload-title"
      }, "\u4E0A\u4F20\u627F\u8BFA\u51FD\u56FE\u7247"), _react.default.createElement("p", {
        className: "upload-desc"
      }, "\u8BF7\u52A1\u5FC5\u4E0B\u8F7D\u6A21\u677F\u6253\u5370\u540E\uFF0C\u52A0\u76D6\u4F01\u4E1A\u516C\u7AE0\u5E76\u624B\u5199\u7B7E\u5B57\uFF0C \u626B\u63CF\u540E\u4E0A\u4F20(\u652F\u6301jpg\u3001jpeg\u3001bmp\u3001png \u5927\u5C0F\u4E0D\u8D855M)")), _react.default.createElement("input", {
        type: "file",
        className: "file",
        accept: "image/jpg,image/jpeg,image/png,image/gif,image/bmp",
        onChange: this.uploadImage
      })))), _react.default.createElement("div", {
        className: "desc-box"
      }, _react.default.createElement("p", {
        className: "text title"
      }, "\u516C\u5BF9\u516C\u63D0\u73B0\u8BF4\u660E\uFF1A"), _react.default.createElement("p", {
        className: "text"
      }, "1\u3001 \u4ECE2019\u5E747\u67081\u65E5\uFF0C\u5BF9\u516C\u63D0\u73B0\u91D1\u989D\u8303\u56F42~50\u4E07\u3002\u5176\u4E2D", _react.default.createElement("span", null, "2\u4E07~20\u4E07 (\u5305\u542B20\u4E07)"), "\u63D0\u73B0\u670D\u52A1\u8D39", _react.default.createElement("span", null, "5%\uFF0C20\u4E07~50\u4E07(\u5305\u542B50\u4E07)"), "\u63D0\u73B0\u670D\u52A1\u8D39", _react.default.createElement("span", null, "3%")), _react.default.createElement("p", {
        className: "text"
      }, "2\u3001\u5BA1\u6838\u901A\u8FC7\u540E", _react.default.createElement("span", null, "10~15"), "\u4E2A\u5DE5\u4F5C\u65E5\u5185\u53EF\u5230\u8D26\uFF0C\u8282\u5047\u65E5\u987A\u5EF6\uFF0C\u8BF7\u5728\u63D0\u73B0\u660E\u7EC6\u91CC\u67E5\u770B\u8FDB\u5EA6"), _react.default.createElement("p", {
        className: "text"
      }, "3\u3001\u63D0\u73B0\u7533\u8BF7\u9700\u5148\u90AE\u5BC4\u7EB8\u8D28", _react.default.createElement("span", null, "\u3010\u627F\u8BFA\u51FD\u3011"), "\u5230\u5343\u804A\uFF0C\u5426\u5219\u5C06\u5F71\u54CD\u8FDB\u4E00\u6B65\u63D0\u73B0\u3002", _react.default.createElement("span", null, "(\u90AE\u5BC4\u5730\u5740\uFF1A\u5E7F\u4E1C\u7701\u5E7F\u5DDE\u5E02\u5929\u6CB3\u533A\u8FDC\u6D0B\u521B\u610F\u56ED\u68E0\u4E0B\u8857\u9053\u68E0\u4E1C\u4E1C\u8DEF5\u53F7\u6C90\u601D\u79D1\u6280\u6709\u9650\u516C\u53F8(\u5E72\u804A)\u8D22\u52A1\u90E8-\u5BF9\u516C\u6253\u6B3E \u7535\u8BDD\uFF1A020-88525535)")), _react.default.createElement("p", {
        className: "text"
      }, "4\u3001\u5982\u6709\u7591\u95EE\uFF0C\u8BF7\u5173\u6CE8", _react.default.createElement("span", null, "\u3010\u5343\u804A\u77E5\u8BC6\u5E97\u94FA\u3011"), "\u5E76\u56DE\u590D\u5173\u952E\u8BCD\u201C", _react.default.createElement("span", null, "\u4F01\u4E1A\u63D0\u73B0"), "\"\uFF0C\u6211\u4EEC\u5C06\u7B2C\u4E00\u65F6\u95F4\u56DE\u590D\u60A8"), _react.default.createElement("p", {
        className: "text"
      }, "5\u3001", _react.default.createElement("a", {
        className: "link",
        href: "/wechat/page/mine/takeincome-record?liveId=".concat(this.props.location.query["liveId"])
      }, "\u70B9\u51FB\u67E5\u770B\u5BF9\u516C\u63D0\u73B0\u8FDB\u5EA6>>")))), _react.default.createElement("div", {
        className: "bottom-btn-wrap"
      }, _react.default.createElement("div", {
        className: "bottom-btn",
        onClick: this.submit
      }, "\u63D0\u4EA4\u7533\u8BF7")), _react.default.createElement(_dialog.Confirm, {
        className: "promise-dialog",
        title: "\u627F\u8BFA\u51FD\u8BF4\u660E",
        buttons: "cancel",
        cancelText: "\u6211\u77E5\u9053\u4E86",
        ref: function ref(dom) {
          _this3.promiseDialog = dom;
        }
      }, _react.default.createElement("p", {
        className: "content"
      }, _react.default.createElement("p", {
        className: "promise-item"
      }, _react.default.createElement("span", {
        className: "order"
      }, "1\u3001"), _react.default.createElement("span", {
        className: "content-text"
      }, "\u5728\u4F01\u4E1A\u5BF9\u516C\u63D0\u73B0\u65F6\uFF0C\u9700\u63D0\u4EA4\u627F\u8BFA\u51FD;")), _react.default.createElement("p", {
        className: "promise-item"
      }, _react.default.createElement("span", {
        className: "order"
      }, "2\u3001"), _react.default.createElement("span", {
        className: "content-text"
      }, "\u627F\u8BFA\u51FD\u662F\u76F4\u64AD\u95F4\u5BF9\u516C\u63D0\u73B0\u53CA\u5B8C\u7A0E\u8BC1\u660E\u65F6\u9700\u7528\u5230\u7684\u8BC1\u660E\u6750\u6599;")), _react.default.createElement("p", {
        className: "promise-item"
      }, _react.default.createElement("span", {
        className: "order"
      }, "3\u3001"), _react.default.createElement("span", {
        className: "content-text"
      }, "\u6BCF\u6B21\u5BF9\u516C\u63D0\u73B0\uFF0C\u7531\u4E8E\u63D0\u73B0\u91D1\u989D\u53EF\u80FD\u4E0D\u4E00\u81F4\uFF0C\u9700\u6309\u7167\u627F\u8BFA\u51FD\u4E0A\u7684\u8981\u6C42\uFF0C\u6309\u7167\u5B9E\u9645\u63D0\u73B0\u4FE1\u606F\u586B\u5199;")), _react.default.createElement("p", {
        className: "promise-item"
      }, _react.default.createElement("span", {
        className: "order"
      }, "4\u3001"), _react.default.createElement("span", {
        className: "content-text"
      }, "\u8BF7\u5148\u4E0B\u8F7D\u627F\u8BFA\u51FD\u6A21\u677F\uFF0C\u6309\u7167\u6A21\u677F\u8981\u53BB\u586B\u5199\u3002")), _react.default.createElement("p", {
        className: "promise-item"
      }, _react.default.createElement("span", {
        className: "order"
      }, "5\u3001"), _react.default.createElement("span", {
        className: "content-text"
      }, "\u5173\u4E8E\u627F\u8BFA\u51FD\u53CA\u63D0\u73B0\u6D41\u7A0B\u7684\u4F7F\u7528\u8BF4\u660E\uFF0C", " ", _react.default.createElement("a", {
        href: "https://w.url.cn/s/AVMj8DA"
      }, "\u70B9\u51FB\u67E5\u770B\u6559\u7A0B>>"))))));
    }
  }]);

  return BusinessPaymentTakeIncome;
}(_react.Component)) || _class;

var mapStateToProps = function mapStateToProps(state) {
  return {
    userInfo: state.common.userInfo,
    accountName: state.businessPaymentTakeincome.accountName,
    accountNo: state.businessPaymentTakeincome.accountNo,
    openBank: state.businessPaymentTakeincome.openBank
  };
};

var mapDispatchToProps = {
  uploadImage: _common.uploadImage,
  getUserInfo: _common.getUserInfo,
  getPubToPubMessage: _businessPaymentTakeincome.getPubToPubMessage,
  commitApply: _businessPaymentTakeincome.commitApply
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(BusinessPaymentTakeIncome);

exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=10.chunk.js.map