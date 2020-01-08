(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "../node_modules/@ql-feat/error-boundary/dist/index.js":
/*!*************************************************************!*\
  !*** ../node_modules/@ql-feat/error-boundary/dist/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){if(true)module.exports=t();else { var n, r; }}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},u=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(1),f=(n=i)&&n.__esModule?n:{default:n};function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=function(e){function t(e){c(this,t);var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.state={hasError:!1},r}return l(t,f.default.Component),u(t,[{key:"componentDidCatch",value:function(e,t){console.error("---- component error did catch!!! fix it immediately!!! ----"),console.error(t),console.error(e),this.setState({hasError:!0},function(){setTimeout(function(){throw new Error(e)},50)})}},{key:"render",value:function(){return this.state.hasError?this.props.errMsg?f.default.createElement("h1",{style:{color:"red",textAlign:"center",padding:"40px"}},this.props.errMsg):null:this.props.children}}]),t}();function p(e,t){return function(r){function n(){return c(this,n),a(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return l(n,f.default.Component),u(n,[{key:"getWrappedInstance",value:function(){return this.instance}},{key:"render",value:function(){var r=this;return f.default.createElement(s,{errMsg:t||""},f.default.createElement(e,o({ref:function(e){return r.instance=e}},this.props)))}}]),n}()}t.default=function(e){return void 0!==e&&0===e.length?p(e):function(t){return p(t,e)}}},function(e,t){e.exports=__webpack_require__(/*! react */ "../node_modules/react/index.js")}])});

/***/ }),

/***/ "../node_modules/core-decorators/lib/autobind.js":
/*!*******************************************************!*\
  !*** ../node_modules/core-decorators/lib/autobind.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = autobind;

var _utils = __webpack_require__(/*! ./private/utils */ "../node_modules/core-decorators/lib/private/utils.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defineProperty = Object.defineProperty,
    getPrototypeOf = Object.getPrototypeOf;


var mapStore = void 0;

function getBoundSuper(obj, fn) {
  if (typeof WeakMap === 'undefined') {
    throw new Error('Using @autobind on ' + fn.name + '() requires WeakMap support due to its use of super.' + fn.name + '()\n      See https://github.com/jayphelps/core-decorators.js/issues/20');
  }

  if (!mapStore) {
    mapStore = new WeakMap();
  }

  if (mapStore.has(obj) === false) {
    mapStore.set(obj, new WeakMap());
  }

  var superStore = mapStore.get(obj);

  if (superStore.has(fn) === false) {
    superStore.set(fn, (0, _utils.bind)(fn, obj));
  }

  return superStore.get(fn);
}

function autobindClass(klass) {
  var descs = (0, _utils.getOwnPropertyDescriptors)(klass.prototype);
  var keys = (0, _utils.getOwnKeys)(descs);

  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    var desc = descs[key];

    if (typeof desc.value !== 'function' || key === 'constructor') {
      continue;
    }

    defineProperty(klass.prototype, key, autobindMethod(klass.prototype, key, desc));
  }
}

function autobindMethod(target, key, _ref) {
  var fn = _ref.value,
      configurable = _ref.configurable,
      enumerable = _ref.enumerable;

  if (typeof fn !== 'function') {
    throw new SyntaxError('@autobind can only be used on functions, not: ' + fn);
  }

  var constructor = target.constructor;


  return {
    configurable: configurable,
    enumerable: enumerable,

    get: function get() {
      // Class.prototype.key lookup
      // Someone accesses the property directly on the prototype on which it is
      // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
      if (this === target) {
        return fn;
      }

      // Class.prototype.key lookup
      // Someone accesses the property directly on a prototype but it was found
      // up the chain, not defined directly on it
      // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
      if (this.constructor !== constructor && getPrototypeOf(this).constructor === constructor) {
        return fn;
      }

      // Autobound method calling super.sameMethod() which is also autobound and so on.
      if (this.constructor !== constructor && key in this.constructor.prototype) {
        return getBoundSuper(this, fn);
      }

      var boundFn = (0, _utils.bind)(fn, this);

      defineProperty(this, key, {
        configurable: true,
        writable: true,
        // NOT enumerable when it's a bound method
        enumerable: false,
        value: boundFn
      });

      return boundFn;
    },

    set: (0, _utils.createDefaultSetter)(key)
  };
}

function handle(args) {
  if (args.length === 1) {
    return autobindClass.apply(undefined, _toConsumableArray(args));
  } else {
    return autobindMethod.apply(undefined, _toConsumableArray(args));
  }
}

function autobind() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) {
    return function () {
      return handle(arguments);
    };
  } else {
    return handle(args);
  }
}

/***/ }),

/***/ "../node_modules/core-decorators/lib/lazy-initialize.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-decorators/lib/lazy-initialize.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lazyInitialize;

var _utils = __webpack_require__(/*! ./private/utils */ "../node_modules/core-decorators/lib/private/utils.js");

var defineProperty = Object.defineProperty;


function handleDescriptor(target, key, descriptor) {
  var configurable = descriptor.configurable,
      enumerable = descriptor.enumerable,
      initializer = descriptor.initializer,
      value = descriptor.value;

  return {
    configurable: configurable,
    enumerable: enumerable,

    get: function get() {
      // This happens if someone accesses the
      // property directly on the prototype
      if (this === target) {
        return;
      }

      var ret = initializer ? initializer.call(this) : value;

      defineProperty(this, key, {
        configurable: configurable,
        enumerable: enumerable,
        writable: true,
        value: ret
      });

      return ret;
    },


    set: (0, _utils.createDefaultSetter)(key)
  };
}

function lazyInitialize() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _utils.decorate)(handleDescriptor, args);
}

/***/ }),

/***/ "../node_modules/core-decorators/lib/private/utils.js":
/*!************************************************************!*\
  !*** ../node_modules/core-decorators/lib/private/utils.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warn = exports.getOwnKeys = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

exports.isDescriptor = isDescriptor;
exports.decorate = decorate;
exports.metaFor = metaFor;
exports.getOwnPropertyDescriptors = getOwnPropertyDescriptors;
exports.createDefaultSetter = createDefaultSetter;
exports.bind = bind;
exports.internalDeprecation = internalDeprecation;

var _lazyInitialize = __webpack_require__(/*! ../lazy-initialize */ "../node_modules/core-decorators/lib/lazy-initialize.js");

var _lazyInitialize2 = _interopRequireDefault(_lazyInitialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defineProperty = Object.defineProperty,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    getOwnPropertyNames = Object.getOwnPropertyNames,
    getOwnPropertySymbols = Object.getOwnPropertySymbols;
function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  var keys = ['value', 'initializer', 'get', 'set'];

  for (var i = 0, l = keys.length; i < l; i++) {
    if (desc.hasOwnProperty(keys[i])) {
      return true;
    }
  }

  return false;
}

function decorate(handleDescriptor, entryArgs) {
  if (isDescriptor(entryArgs[entryArgs.length - 1])) {
    return handleDescriptor.apply(undefined, _toConsumableArray(entryArgs).concat([[]]));
  } else {
    return function () {
      return handleDescriptor.apply(undefined, _toConsumableArray(Array.prototype.slice.call(arguments)).concat([entryArgs]));
    };
  }
}

var Meta = (_class = function Meta() {
  _classCallCheck(this, Meta);

  _initDefineProp(this, 'debounceTimeoutIds', _descriptor, this);

  _initDefineProp(this, 'throttleTimeoutIds', _descriptor2, this);

  _initDefineProp(this, 'throttlePreviousTimestamps', _descriptor3, this);

  _initDefineProp(this, 'throttleTrailingArgs', _descriptor4, this);

  _initDefineProp(this, 'profileLastRan', _descriptor5, this);
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'debounceTimeoutIds', [_lazyInitialize2.default], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'throttleTimeoutIds', [_lazyInitialize2.default], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'throttlePreviousTimestamps', [_lazyInitialize2.default], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'throttleTrailingArgs', [_lazyInitialize2.default], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'profileLastRan', [_lazyInitialize2.default], {
  enumerable: true,
  initializer: function initializer() {
    return null;
  }
})), _class);


var META_KEY = typeof Symbol === 'function' ? Symbol('__core_decorators__') : '__core_decorators__';

function metaFor(obj) {
  if (obj.hasOwnProperty(META_KEY) === false) {
    defineProperty(obj, META_KEY, {
      // Defaults: NOT enumerable, configurable, or writable
      value: new Meta()
    });
  }

  return obj[META_KEY];
}

var getOwnKeys = exports.getOwnKeys = getOwnPropertySymbols ? function (object) {
  return getOwnPropertyNames(object).concat(getOwnPropertySymbols(object));
} : getOwnPropertyNames;

function getOwnPropertyDescriptors(obj) {
  var descs = {};

  getOwnKeys(obj).forEach(function (key) {
    return descs[key] = getOwnPropertyDescriptor(obj, key);
  });

  return descs;
}

function createDefaultSetter(key) {
  return function set(newValue) {
    Object.defineProperty(this, key, {
      configurable: true,
      writable: true,
      // IS enumerable when reassigned by the outside word
      enumerable: true,
      value: newValue
    });

    return newValue;
  };
}

function bind(fn, context) {
  if (fn.bind) {
    return fn.bind(context);
  } else {
    return function __autobind__() {
      return fn.apply(context, arguments);
    };
  }
}

var warn = exports.warn = function () {
  if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== 'object' || !console || typeof console.warn !== 'function') {
    return function () {};
  } else {
    return bind(console.warn, console);
  }
}();

var seenDeprecations = {};
function internalDeprecation(msg) {
  if (seenDeprecations[msg] !== true) {
    seenDeprecations[msg] = true;
    warn('DEPRECATION: ' + msg);
  }
}

/***/ }),

/***/ "../node_modules/core-decorators/lib/throttle.js":
/*!*******************************************************!*\
  !*** ../node_modules/core-decorators/lib/throttle.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = throttle;

var _utils = __webpack_require__(/*! ./private/utils */ "../node_modules/core-decorators/lib/private/utils.js");

var DEFAULT_TIMEOUT = 300;

function handleDescriptor(target, key, descriptor, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      _ref2$ = _ref2[0],
      wait = _ref2$ === undefined ? DEFAULT_TIMEOUT : _ref2$,
      _ref2$2 = _ref2[1],
      options = _ref2$2 === undefined ? {} : _ref2$2;

  var callback = descriptor.value;

  if (typeof callback !== 'function') {
    throw new SyntaxError('Only functions can be throttled');
  }

  if (options.leading !== false) {
    options.leading = true;
  }

  if (options.trailing !== false) {
    options.trailing = true;
  }

  return _extends({}, descriptor, {
    value: function value() {
      var _this = this;

      var meta = (0, _utils.metaFor)(this);
      var throttleTimeoutIds = meta.throttleTimeoutIds,
          throttlePreviousTimestamps = meta.throttlePreviousTimestamps;

      var timeout = throttleTimeoutIds[key];
      // last execute timestamp
      var previous = throttlePreviousTimestamps[key] || 0;
      var now = Date.now();

      if (options.trailing) {
        meta.throttleTrailingArgs = arguments;
      }

      // if first be called and disable the execution on the leading edge
      // set last execute timestamp to now
      if (!previous && options.leading === false) {
        previous = now;
      }

      var remaining = wait - (now - previous);

      if (remaining <= 0) {
        clearTimeout(timeout);
        delete throttleTimeoutIds[key];
        throttlePreviousTimestamps[key] = now;
        callback.apply(this, arguments);
      } else if (!timeout && options.trailing) {
        throttleTimeoutIds[key] = setTimeout(function () {
          throttlePreviousTimestamps[key] = options.leading === false ? 0 : Date.now();
          delete throttleTimeoutIds[key];
          callback.apply(_this, meta.throttleTrailingArgs);
          // don't leak memory!
          meta.throttleTrailingArgs = null;
        }, remaining);
      }
    }
  });
}

function throttle() {
  (0, _utils.internalDeprecation)('@throttle is deprecated and will be removed shortly. Use @throttle from lodash-decorators.\n\n  https://www.npmjs.com/package/lodash-decorators');

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _utils.decorate)(handleDescriptor, args);
}

/***/ }),

/***/ "../node_modules/ql-react-picture/dist/index.js":
/*!******************************************************!*\
  !*** ../node_modules/ql-react-picture/dist/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){if(true)module.exports=t();else { var n, r; }}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,o,i,a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},s=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();r(1);var u=r(2),c=v(u),l=v(r(3)),p=v(r(4)),d=v(r(5)),f=v(r(6)),h=v(r(7)),m=v(r(13));function v(e){return e&&e.__esModule?e:{default:e}}function y(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var b=(n=(0,d.default)(200),(0,f.default)(o=(0,p.default)((function(e,t,r,n,o){var i={};Object.keys(n).forEach(function(e){i[e]=n[e]}),i.enumerable=!!i.enumerable,i.configurable=!!i.configurable,("value"in i||i.initializer)&&(i.writable=!0),i=r.slice().reverse().reduce(function(r,n){return n(e,t,r)||r},i),o&&void 0!==i.initializer&&(i.value=i.initializer?i.initializer.call(o):void 0,i.initializer=void 0),void 0===i.initializer&&(Object.defineProperty(e,t,i),i=null)}((i=function(e){function t(){var e,r,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,i=Array(o),a=0;a<o;a++)i[a]=arguments[a];return r=n=y(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(i))),n.state={src:"",webpSrc:"",isLoaded:!1,catchError:!1},n.data={boundingClientRectTop:null},y(n,r)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,u.PureComponent),s(t,[{key:"componentWillReceiveProps",value:function(e){if(e.src&&e.src!==this.props.src){var t=this.parseSrc(e.src),r=this.addFormatWebp(t);this.setState({src:t,webpSrc:r})}}},{key:"componentDidMount",value:function(){var e=function(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){return function n(o,i){try{var a=t[o](i),s=a.value}catch(e){return void r(e)}if(!a.done)return Promise.resolve(s).then(function(e){n("next",e)},function(e){n("throw",e)});e(s)}("next")})}}(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.props.innerRef&&this.props.innerRef(this),this.props.src&&(this.props.placeholder&&this.props.lazyLoad?(window.addEventListener("touchmove",this.lazyload),window.addEventListener("mousewheel",this.lazyload),window.addEventListener("mousedown",this.lazyload),window.addEventListener("mouseup",this.lazyload),this.lazyload()):this.loadImg());case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentWillUnmount",value:function(){window.removeEventListener("touchmove",this.lazyload),window.removeEventListener("mousewheel",this.lazyload),window.removeEventListener("mousedown",this.lazyload),window.removeEventListener("mouseup",this.lazyload)}},{key:"lazyload",value:function(){var e=this;if(this.data.lazyloadRedetect&&clearTimeout(this.data.lazyloadRedetect),this.pictureRef){var t=this.pictureRef.getBoundingClientRect().top;t!==this.data.boundingClientRectTop&&(this.data.boundingClientRectTop=t,this.hasEnteredViewport(t)?(this.loadImg(),this.data.lazyloadRedetect&&clearTimeout(this.data.lazyloadRedetect),window.removeEventListener("touchmove",this.lazyload),window.removeEventListener("mousewheel",this.lazyload),window.removeEventListener("mousedown",this.lazyload),window.removeEventListener("mouseup",this.lazyload)):this.data.lazyloadRedetect=setTimeout(function(){e.data.lazyloadRedetect=null,e.lazyload()},600))}}},{key:"loadImg",value:function(){var e=this.parseSrc(this.props.src),t=this.addFormatWebp(e);this.setState({src:e,webpSrc:t})}},{key:"hasEnteredViewport",value:function(e){return e>-200&&e<window.innerHeight+200}},{key:"onLoad",value:function(e){this.props.onLoad&&this.props.onLoad(e),this.setState({isLoaded:!0})}},{key:"onError",value:function(e){this.props.onError&&this.props.onError(e)}},{key:"pictureClickHandle",value:function(e){this.props.onClick&&this.props.onClick(e)}},{key:"addFormatWebp",value:function(e){try{var t=new URL(e);if(t.protocol=location.protocol,!t.host.includes("img.qlchat.com"))return null;var r=t.searchParams.get("x-oss-process");return r?r.includes("image")&&!r.includes("/format")&&t.searchParams.set("x-oss-process",r+"/format,webp"):t.searchParams.set("x-oss-process","image/format,webp"),t.search=decodeURIComponent(t.search),t.toString()}catch(e){return null}}},{key:"parseOssProcess",value:function(e){if(!e)return"";var t={};return e.split("/").forEach(function(e,r){if(0===r)return!1;var n=e.split(",");t[n[0]]||(t[n[0]]={}),n.forEach(function(e,r){if(0===r)return!1;var o=e.split("_");1===o.length?t[n[0]]=o[0]:t[n[0]][o[0]]=o[1]})}),t}},{key:"stringifyOssProcess",value:function(e){var t=["image"];for(var r in e)if(t.push("/"+r),"[object Object]"===Object.prototype.toString.call(e[r]))for(var n in e[r])t.push(","+n+"_"+e[r][n]);else t.push(","+e[r]);return 1===t.length?"":t.join("")}},{key:"parseSrc",value:function(e){try{var t=new URL(e),r=t.searchParams.get("x-oss-process");if(!t.host.includes("img.qlchat.com"))return e;var n=r?this.parseOssProcess(r):{},o=a({m:"fill",limit:"0"},n.resize,this.props.resize);t.pathname=t.pathname.replace(/\@((.*){0,})/,function(e,t){if(!o.w&&!o.h&&t){var r=t.match(/(\d{0,})w/),n=t.match(/(\d{0,})h/);r=r?r[1]:"",n=n?n[1]:"",o.w=r,o.h=n}return""}),(o.w||o.h)&&(n.resize=o),this.props.crop&&(n.crop=this.props.crop),this.props.circle&&(n.circle=this.props.circle),this.props["rounded-corners"]&&(n["rounded-corners"]=this.props["rounded-corners"]);var i=this.stringifyOssProcess(n);return i&&(t.searchParams.set("x-oss-process",i),t.search=decodeURIComponent(t.search)),t.toString()}catch(t){return e}}},{key:"render",value:function(){var e=this;return c.default.createElement("picture",{className:h.default["ql-feat-picture"]+(this.props.className?" "+this.props.className:"")+(this.props.placeholder&&!this.state.isLoaded?" picture-placeholder":""),onClick:this.pictureClickHandle,ref:function(t){return e.pictureRef=t},"data-log-region":this.props["data-log-region"]||"","data-log-pos":this.props["data-log-pos"]||"","data-log-type":this.props["data-log-type"]||"","data-log-name":this.props["data-log-name"]||""},this.state.webpSrc&&c.default.createElement("source",{type:"image/webp",srcSet:this.state.webpSrc}),this.state.src&&c.default.createElement("img",{ref:function(t){return e.img=t},src:this.state.src,onLoad:this.onLoad,onError:this.onError,style:{display:this.state.isLoaded?"":"none"}}))}}]),t}()).prototype,"lazyload",[n],Object.getOwnPropertyDescriptor(i.prototype,"lazyload"),i.prototype),o=i))||o)||o);b.propTypes={src:l.default.string.isRequired,placeholder:l.default.bool,lazyLoad:l.default.bool,resize:l.default.object,crop:l.default.object,circle:l.default.object,"rounded-corners":l.default.object,innerRef:l.default.func},t.default=(0,m.default)(h.default)(b)},function(e,t){e.exports=__webpack_require__(/*! url-polyfill */ "../node_modules/url-polyfill/url-polyfill.js")},function(e,t){e.exports=__webpack_require__(/*! react */ "../node_modules/react/index.js")},function(e,t){e.exports=__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js")},function(e,t){e.exports=__webpack_require__(/*! core-decorators/lib/autobind */ "../node_modules/core-decorators/lib/autobind.js")},function(e,t){e.exports=__webpack_require__(/*! core-decorators/lib/throttle */ "../node_modules/core-decorators/lib/throttle.js")},function(e,t){e.exports=__webpack_require__(/*! @ql-feat/error-boundary */ "../node_modules/@ql-feat/error-boundary/dist/index.js")},function(e,t,r){var n=r(8),o=r(10);"string"==typeof n&&(n=[[e.i,n,""]]),e.exports=n.locals||{},e.exports._getContent=function(){return n},e.exports._getCss=function(){return n.toString()},e.exports._insertCss=function(e){return o(n,e)}},function(e,t,r){(t=e.exports=r(9)(!1)).push([e.i,".ql-feat-picture--j4r926nfi1 {\n  font-size: 0;\n}\n\n.ql-feat-picture--j4r926nfi1 img {\n  width: 100%;\n  height: 100%;\n}\n\n.picture-placeholder {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: url(//img.qlchat.com/qlLive/liveCommon/picture-loading-icon.png) #efefef no-repeat center/0.746667rem;\n}",""]),t.locals={"ql-feat-picture":"ql-feat-picture--j4r926nfi1"}},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=function(e,t){var r=e[1]||"",n=e[3];if(!n)return r;if(t&&"function"==typeof btoa){var o=function(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}(n),i=n.sources.map(function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"});return[r].concat(i).concat([o]).join("\n")}return[r].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,r){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(n[i]=!0)}for(o=0;o<e.length;o++){var a=e[o];"number"==typeof a[0]&&n[a[0]]||(r&&!a[2]?a[2]=r:r&&(a[2]="("+a[2]+") and ("+r+")"),t.push(a))}},t}},function(e,t,r){"use strict";var n=i(r(11)),o=i(r(12));function i(e){return e&&e.__esModule?e:{default:e}}var a="s",s={};function u(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}))}e.exports=function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.replace,i=void 0!==r&&r,c=t.prepend,l=void 0!==c&&c,p=[],d=0;d<e.length;d++){var f=(0,o.default)(e[d],4),h=f[0],m=f[1],v=f[2],y=f[3],b=h+"-"+d;if(p.push(b),!s[b]||i){s[b]=1;var g=document.getElementById(a+b),w=!1;g||(w=!0,(g=document.createElement("style")).setAttribute("type","text/css"),g.id=a+b,v&&g.setAttribute("media",v));var j=m;y&&"function"==typeof btoa&&(j+="\n/*# sourceMappingURL=data:application/json;base64,"+u((0,n.default)(y))+"*/",j+="\n/*# sourceURL="+y.file+"?"+b+"*/"),"textContent"in g?g.textContent=j:g.styleSheet.cssText=j,w&&(l?document.head.insertBefore(g,document.head.childNodes[0]):document.head.appendChild(g))}else s[b]++}return function(e){e.forEach(function(e){if(--s[e]<=0){var t=document.getElementById(a+e);t&&t.parentNode.removeChild(t)}})}.bind(null,p)}},function(e,t){e.exports=__webpack_require__(/*! babel-runtime/core-js/json/stringify */ "../node_modules/babel-runtime/core-js/json/stringify.js")},function(e,t){e.exports=__webpack_require__(/*! babel-runtime/helpers/slicedToArray */ "../node_modules/babel-runtime/helpers/slicedToArray.js")},function(e,t){e.exports=__webpack_require__(/*! isomorphic-style-loader/lib/withStyles */ "../node_modules/isomorphic-style-loader/lib/withStyles.js")}])});

/***/ }),

/***/ "../node_modules/url-polyfill/url-polyfill.js":
/*!****************************************************!*\
  !*** ../node_modules/url-polyfill/url-polyfill.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function(global) {
  /**
   * Polyfill URLSearchParams
   *
   * Inspired from : https://github.com/WebReflection/url-search-params/blob/master/src/url-search-params.js
   */

  var checkIfIteratorIsSupported = function() {
    try {
      return !!Symbol.iterator;
    } catch (error) {
      return false;
    }
  };


  var iteratorSupported = checkIfIteratorIsSupported();

  var createIterator = function(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return { done: value === void 0, value: value };
      }
    };

    if (iteratorSupported) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }

    return iterator;
  };

  /**
   * Search param name and values should be encoded according to https://url.spec.whatwg.org/#urlencoded-serializing
   * encodeURIComponent() produces the same result except encoding spaces as `%20` instead of `+`.
   */
  var serializeParam = function(value) {
    return encodeURIComponent(value).replace(/%20/g, '+');
  };

  var deserializeParam = function(value) {
    return decodeURIComponent(String(value).replace(/\+/g, ' '));
  };

  var polyfillURLSearchParams = function() {

    var URLSearchParams = function(searchString) {
      Object.defineProperty(this, '_entries', { writable: true, value: {} });
      var typeofSearchString = typeof searchString;

      if (typeofSearchString === 'undefined') {
        // do nothing
      } else if (typeofSearchString === 'string') {
        if (searchString !== '') {
          this._fromString(searchString);
        }
      } else if (searchString instanceof URLSearchParams) {
        var _this = this;
        searchString.forEach(function(value, name) {
          _this.append(name, value);
        });
      } else if ((searchString !== null) && (typeofSearchString === 'object')) {
        if (Object.prototype.toString.call(searchString) === '[object Array]') {
          for (var i = 0; i < searchString.length; i++) {
            var entry = searchString[i];
            if ((Object.prototype.toString.call(entry) === '[object Array]') || (entry.length !== 2)) {
              this.append(entry[0], entry[1]);
            } else {
              throw new TypeError('Expected [string, any] as entry at index ' + i + ' of URLSearchParams\'s input');
            }
          }
        } else {
          for (var key in searchString) {
            if (searchString.hasOwnProperty(key)) {
              this.append(key, searchString[key]);
            }
          }
        }
      } else {
        throw new TypeError('Unsupported input\'s type for URLSearchParams');
      }
    };

    var proto = URLSearchParams.prototype;

    proto.append = function(name, value) {
      if (name in this._entries) {
        this._entries[name].push(String(value));
      } else {
        this._entries[name] = [String(value)];
      }
    };

    proto.delete = function(name) {
      delete this._entries[name];
    };

    proto.get = function(name) {
      return (name in this._entries) ? this._entries[name][0] : null;
    };

    proto.getAll = function(name) {
      return (name in this._entries) ? this._entries[name].slice(0) : [];
    };

    proto.has = function(name) {
      return (name in this._entries);
    };

    proto.set = function(name, value) {
      this._entries[name] = [String(value)];
    };

    proto.forEach = function(callback, thisArg) {
      var entries;
      for (var name in this._entries) {
        if (this._entries.hasOwnProperty(name)) {
          entries = this._entries[name];
          for (var i = 0; i < entries.length; i++) {
            callback.call(thisArg, entries[i], name, this);
          }
        }
      }
    };

    proto.keys = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push(name);
      });
      return createIterator(items);
    };

    proto.values = function() {
      var items = [];
      this.forEach(function(value) {
        items.push(value);
      });
      return createIterator(items);
    };

    proto.entries = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
      });
      return createIterator(items);
    };

    if (iteratorSupported) {
      proto[Symbol.iterator] = proto.entries;
    }

    proto.toString = function() {
      var searchArray = [];
      this.forEach(function(value, name) {
        searchArray.push(serializeParam(name) + '=' + serializeParam(value));
      });
      return searchArray.join('&');
    };


    global.URLSearchParams = URLSearchParams;
  };

  if (!('URLSearchParams' in global) || (new global.URLSearchParams('?a=1').toString() !== 'a=1')) {
    polyfillURLSearchParams();
  }

  var proto = global.URLSearchParams.prototype;

  if (typeof proto.sort !== 'function') {
    proto.sort = function() {
      var _this = this;
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
        if (!_this._entries) {
          _this.delete(name);
        }
      });
      items.sort(function(a, b) {
        if (a[0] < b[0]) {
          return -1;
        } else if (a[0] > b[0]) {
          return +1;
        } else {
          return 0;
        }
      });
      if (_this._entries) { // force reset because IE keeps keys index
        _this._entries = {};
      }
      for (var i = 0; i < items.length; i++) {
        this.append(items[i][0], items[i][1]);
      }
    };
  }

  if (typeof proto._fromString !== 'function') {
    Object.defineProperty(proto, '_fromString', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function(searchString) {
        if (this._entries) {
          this._entries = {};
        } else {
          var keys = [];
          this.forEach(function(value, name) {
            keys.push(name);
          });
          for (var i = 0; i < keys.length; i++) {
            this.delete(keys[i]);
          }
        }

        searchString = searchString.replace(/^\?/, '');
        var attributes = searchString.split('&');
        var attribute;
        for (var i = 0; i < attributes.length; i++) {
          attribute = attributes[i].split('=');
          this.append(
            deserializeParam(attribute[0]),
            (attribute.length > 1) ? deserializeParam(attribute[1]) : ''
          );
        }
      }
    });
  }

  // HTMLAnchorElement

})(
  (typeof global !== 'undefined') ? global
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : this))
);

(function(global) {
  /**
   * Polyfill URL
   *
   * Inspired from : https://github.com/arv/DOM-URL-Polyfill/blob/master/src/url.js
   */

  var checkIfURLIsSupported = function() {
    try {
      var u = new global.URL('b', 'http://a');
      u.pathname = 'c%20d';
      return (u.href === 'http://a/c%20d') && u.searchParams;
    } catch (e) {
      return false;
    }
  };


  var polyfillURL = function() {
    var _URL = global.URL;

    var URL = function(url, base) {
      if (typeof url !== 'string') url = String(url);

      // Only create another document if the base is different from current location.
      var doc = document, baseElement;
      if (base && (global.location === void 0 || base !== global.location.href)) {
        doc = document.implementation.createHTMLDocument('');
        baseElement = doc.createElement('base');
        baseElement.href = base;
        doc.head.appendChild(baseElement);
        try {
          if (baseElement.href.indexOf(base) !== 0) throw new Error(baseElement.href);
        } catch (err) {
          throw new Error('URL unable to set base ' + base + ' due to ' + err);
        }
      }

      var anchorElement = doc.createElement('a');
      anchorElement.href = url;
      if (baseElement) {
        doc.body.appendChild(anchorElement);
        anchorElement.href = anchorElement.href; // force href to refresh
      }

      if (anchorElement.protocol === ':' || !/:/.test(anchorElement.href)) {
        throw new TypeError('Invalid URL');
      }

      Object.defineProperty(this, '_anchorElement', {
        value: anchorElement
      });


      // create a linked searchParams which reflect its changes on URL
      var searchParams = new global.URLSearchParams(this.search);
      var enableSearchUpdate = true;
      var enableSearchParamsUpdate = true;
      var _this = this;
      ['append', 'delete', 'set'].forEach(function(methodName) {
        var method = searchParams[methodName];
        searchParams[methodName] = function() {
          method.apply(searchParams, arguments);
          if (enableSearchUpdate) {
            enableSearchParamsUpdate = false;
            _this.search = searchParams.toString();
            enableSearchParamsUpdate = true;
          }
        };
      });

      Object.defineProperty(this, 'searchParams', {
        value: searchParams,
        enumerable: true
      });

      var search = void 0;
      Object.defineProperty(this, '_updateSearchParams', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function() {
          if (this.search !== search) {
            search = this.search;
            if (enableSearchParamsUpdate) {
              enableSearchUpdate = false;
              this.searchParams._fromString(this.search);
              enableSearchUpdate = true;
            }
          }
        }
      });
    };

    var proto = URL.prototype;

    var linkURLWithAnchorAttribute = function(attributeName) {
      Object.defineProperty(proto, attributeName, {
        get: function() {
          return this._anchorElement[attributeName];
        },
        set: function(value) {
          this._anchorElement[attributeName] = value;
        },
        enumerable: true
      });
    };

    ['hash', 'host', 'hostname', 'port', 'protocol']
      .forEach(function(attributeName) {
        linkURLWithAnchorAttribute(attributeName);
      });

    Object.defineProperty(proto, 'search', {
      get: function() {
        return this._anchorElement['search'];
      },
      set: function(value) {
        this._anchorElement['search'] = value;
        this._updateSearchParams();
      },
      enumerable: true
    });

    Object.defineProperties(proto, {

      'toString': {
        get: function() {
          var _this = this;
          return function() {
            return _this.href;
          };
        }
      },

      'href': {
        get: function() {
          return this._anchorElement.href.replace(/\?$/, '');
        },
        set: function(value) {
          this._anchorElement.href = value;
          this._updateSearchParams();
        },
        enumerable: true
      },

      'pathname': {
        get: function() {
          return this._anchorElement.pathname.replace(/(^\/?)/, '/');
        },
        set: function(value) {
          this._anchorElement.pathname = value;
        },
        enumerable: true
      },

      'origin': {
        get: function() {
          // get expected port from protocol
          var expectedPort = { 'http:': 80, 'https:': 443, 'ftp:': 21 }[this._anchorElement.protocol];
          // add port to origin if, expected port is different than actual port
          // and it is not empty f.e http://foo:8080
          // 8080 != 80 && 8080 != ''
          var addPortToOrigin = this._anchorElement.port != expectedPort &&
            this._anchorElement.port !== '';

          return this._anchorElement.protocol +
            '//' +
            this._anchorElement.hostname +
            (addPortToOrigin ? (':' + this._anchorElement.port) : '');
        },
        enumerable: true
      },

      'password': { // TODO
        get: function() {
          return '';
        },
        set: function(value) {
        },
        enumerable: true
      },

      'username': { // TODO
        get: function() {
          return '';
        },
        set: function(value) {
        },
        enumerable: true
      },
    });

    URL.createObjectURL = function(blob) {
      return _URL.createObjectURL.apply(_URL, arguments);
    };

    URL.revokeObjectURL = function(url) {
      return _URL.revokeObjectURL.apply(_URL, arguments);
    };

    global.URL = URL;

  };

  if (!checkIfURLIsSupported()) {
    polyfillURL();
  }

  if ((global.location !== void 0) && !('origin' in global.location)) {
    var getOrigin = function() {
      return global.location.protocol + '//' + global.location.hostname + (global.location.port ? (':' + global.location.port) : '');
    };

    try {
      Object.defineProperty(global.location, 'origin', {
        get: getOrigin,
        enumerable: true
      });
    } catch (e) {
      setInterval(function() {
        global.location.origin = getOrigin();
      }, 100);
    }
  }

})(
  (typeof global !== 'undefined') ? global
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : this))
);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "../node_modules/webpack/buildin/global.js")))

/***/ })

}]);
//# sourceMappingURL=3.chunk.js.map