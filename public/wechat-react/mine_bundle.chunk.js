(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["mine_bundle"],{

/***/ "../node_modules/@ql-feat/detect/public/detect.js":
/*!********************************************************!*\
  !*** ../node_modules/@ql-feat/detect/public/detect.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){if(true)module.exports=t();else { var i, o; }}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function o(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=t,o.d=function(e,t,i){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(i,r,function(t){return e[t]}.bind(null,r));return i},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";o.r(t);var i={};(function(e,t){var o=this.os={},i=this.browser={},r=e.match(/Web[kK]it[\/]{0,1}([\d.]+)/),n=e.match(/(Android);?[\s\/]+([\d.]+)?/),a=!!e.match(/\(Macintosh\; Intel /),c=e.match(/MicroMessenger/i),d=e.match(/(iPad).*OS\s([\d_]+)/),s=e.match(/(iPod)(.*OS\s([\d_]+))?/),l=!d&&e.match(/(iPhone\sOS)\s([\d_]+)/),f=e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),u=/Win\d{2}|Windows/.test(t),h=e.match(/Windows Phone ([\d.]+)/),m=f&&e.match(/TouchPad/),p=e.match(/Kindle\/([\d.]+)/),b=e.match(/Silk\/([\d._]+)/),v=e.match(/(BlackBerry).*Version\/([\d.]+)/),y=e.match(/(BB10).*Version\/([\d.]+)/),S=e.match(/(RIM\sTablet\sOS)\s([\d.]+)/),w=e.match(/PlayBook/),x=e.match(/Chrome\/([\d.]+)/)||e.match(/CriOS\/([\d.]+)/),O=e.match(/Firefox\/([\d.]+)/),P=e.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),M=e.match(/MSIE\s([\d.]+)/)||e.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),g=!x&&e.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),_=g||e.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);(i.webkit=!!r)&&(i.version=r[1]),c&&(o.weixin=!0),n&&(o.android=!0,o.version=n[2]),l&&!s&&(o.ios=o.iphone=!0,o.version=l[2].replace(/_/g,".")),d&&(o.ios=o.ipad=!0,o.version=d[2].replace(/_/g,".")),s&&(o.ios=o.ipod=!0,o.version=s[3]?s[3].replace(/_/g,"."):null),c&&(o.weixin=!0),h&&(o.wp=!0,o.version=h[1]),f&&(o.webos=!0,o.version=f[2]),m&&(o.touchpad=!0),v&&(o.blackberry=!0,o.version=v[2]),y&&(o.bb10=!0,o.version=y[2]),S&&(o.rimtabletos=!0,o.version=S[2]),w&&(i.playbook=!0),p&&(o.kindle=!0,o.version=p[1]),b&&(i.silk=!0,i.version=b[1]),!b&&o.android&&e.match(/Kindle Fire/)&&(i.silk=!0),x&&(i.chrome=!0,i.version=x[1]),O&&(i.firefox=!0,i.version=O[1]),P&&(o.firefoxos=!0,o.version=P[1]),M&&(i.ie=!0,i.version=M[1]),_&&(a||o.ios||u)&&(i.safari=!0,o.ios||(i.version=_[1])),g&&(i.webview=!0),o.tablet=!!(d||w||n&&!e.match(/Mobile/)||O&&e.match(/Tablet/)||M&&!e.match(/Phone/)&&e.match(/Touch/)),o.phone=!(o.tablet||o.ipod||!(n||l||f||v||y||x&&e.match(/Android/)||x&&e.match(/CriOS\/([\d.]+)/)||O&&e.match(/Mobile/)||M&&e.match(/Touch/)))}).call(i,"undefined"==typeof window?"":navigator.userAgent||"","undefined"==typeof window?"":navigator.platform||""),t.default=i}])});

/***/ }),

/***/ "../node_modules/@ql-feat/empty/dist/index.js":
/*!****************************************************!*\
  !*** ../node_modules/@ql-feat/empty/dist/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function (e, t) {
	if (true) module.exports = t(); else { var n, r; }
}("undefined" != typeof self ? self : this, function () {
	return function (e) {
		var t = {};

		function r(n) {
			if (t[n])return t[n].exports;
			var o = t[n] = {i: n, l: !1, exports: {}};
			return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports
		}

		return r.m = e, r.c = t, r.d = function (e, t, n) {
			r.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: n})
		}, r.r = function (e) {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
		}, r.t = function (e, t) {
			if (1 & t && (e = r(e)), 8 & t)return e;
			if (4 & t && "object" == typeof e && e && e.__esModule)return e;
			var n = Object.create(null);
			if (r.r(n), Object.defineProperty(n, "default", {
					enumerable: !0,
					value: e
				}), 2 & t && "string" != typeof e)for (var o in e)r.d(n, o, function (t) {
				return e[t]
			}.bind(null, o));
			return n
		}, r.n = function (e) {
			var t = e && e.__esModule ? function () {
				return e.default
			} : function () {
				return e
			};
			return r.d(t, "a", t), t
		}, r.o = function (e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}, r.p = "", r(r.s = 0)
	}([function (e, t, r) {
		"use strict";
		Object.defineProperty(t, "__esModule", {value: !0});
		var n = u(r(1)), o = u(r(2)), s = u(r(3)), i = u(r(9));

		function u(e) {
			return e && e.__esModule ? e : {default: e}
		}

		var c = function (e) {
			return n.default.createElement("div", {
				className: s.default["co-empty"] + " " + e.className,
				hidden: !e.show
			}, !e.hideNoMorePic && n.default.createElement("div", {className: s.default["co-empty-box"]}, e.emptyPic ? n.default.createElement("img", {src: e.emptyPic}) : n.default.createElement("img", {src: e.emptyPicIndex ? ["./img/emptyPage.png", "https://img.qlchat.com/qlLive/liveCommon/empty-pic-1-1.png", "https://img.qlchat.com/qlLive/liveCommon/empty-pic-2.png", "https://img.qlchat.com/qlLive/media-market/no-content.png"][e.emptyPicIndex] : r(10)})), e.emptyMessage || "暂无数据")
		};
		c.propTypes = {
			show: o.default.bool.isRequired,
			emptyPicIndex: o.default.number,
			emptyMessage: o.default.string,
			hideNoMorePic: o.default.bool
		}, t.default = (0, i.default)(s.default)(c)
	}, function (e, t) {
		e.exports = __webpack_require__(/*! react */ "../node_modules/react/index.js")
	}, function (e, t) {
		e.exports = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js")
	}, function (e, t, r) {
		var n = r(4), o = r(6);
		"string" == typeof n && (n = [[e.i, n, ""]]), e.exports = n.locals || {}, e.exports._getContent = function () {
			return n
		}, e.exports._getCss = function () {
			return n.toString()
		}, e.exports._insertCss = function (e) {
			return o(n, e)
		}
	}, function (e, t, r) {
		(t = e.exports = r(5)(!1)).push([e.i, '.co-empty--rg8dq7xhti8 {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n     -moz-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  width: 5.333333rem;\n  text-align: center;\n  color: #cccccc;\n}\n\n[data-dpr="1"] .co-empty--rg8dq7xhti8 {\n  font-size: 14px;\n}\n\n[data-dpr="2"] .co-empty--rg8dq7xhti8 {\n  font-size: 28px;\n}\n\n[data-dpr="3"] .co-empty--rg8dq7xhti8 {\n  font-size: 42px;\n}\n\n.co-empty--rg8dq7xhti8 .co-empty-box--9opx9qo96c5 {\n  padding: 0 0 0.666667rem;\n}\n\n.co-empty--rg8dq7xhti8 img {\n  display: block;\n  width: 100%;\n}', ""]), t.locals = {
			"co-empty": "co-empty--rg8dq7xhti8",
			"co-empty-box": "co-empty-box--9opx9qo96c5"
		}
	}, function (e, t) {
		e.exports = function (e) {
			var t = [];
			return t.toString = function () {
				return this.map(function (t) {
					var r = function (e, t) {
						var r = e[1] || "", n = e[3];
						if (!n)return r;
						if (t && "function" == typeof btoa) {
							var o = function (e) {
								return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(e)))) + " */"
							}(n), s = n.sources.map(function (e) {
								return "/*# sourceURL=" + n.sourceRoot + e + " */"
							});
							return [r].concat(s).concat([o]).join("\n")
						}
						return [r].join("\n")
					}(t, e);
					return t[2] ? "@media " + t[2] + "{" + r + "}" : r
				}).join("")
			}, t.i = function (e, r) {
				"string" == typeof e && (e = [[null, e, ""]]);
				for (var n = {}, o = 0; o < this.length; o++) {
					var s = this[o][0];
					"number" == typeof s && (n[s] = !0)
				}
				for (o = 0; o < e.length; o++) {
					var i = e[o];
					"number" == typeof i[0] && n[i[0]] || (r && !i[2] ? i[2] = r : r && (i[2] = "(" + i[2] + ") and (" + r + ")"), t.push(i))
				}
			}, t
		}
	}, function (e, t, r) {
		"use strict";
		var n = s(r(7)), o = s(r(8));

		function s(e) {
			return e && e.__esModule ? e : {default: e}
		}

		var i = "s", u = {};

		function c(e) {
			return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function (e, t) {
				return String.fromCharCode("0x" + t)
			}))
		}

		e.exports = function (e) {
			for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r = t.replace,
				     s = void 0 !== r && r, a = t.prepend, f = void 0 !== a && a, p = [], l = 0; l < e.length; l++) {
				var d = (0, o.default)(e[l], 4), m = d[0], O = d[1], b = d[2], g = d[3], z = m + "-" + l;
				if (p.push(z), !u[z] || s) {
					u[z] = 1;
					var x = document.getElementById(i + z), y = !1;
					x || (y = !0, (x = document.createElement("style")).setAttribute("type", "text/css"), x.id = i + z, b && x.setAttribute("media", b));
					var W = O;
					g && "function" == typeof btoa && (W += "\n/*# sourceMappingURL=data:application/json;base64," + c((0, n.default)(g)) + "*/", W += "\n/*# sourceURL=" + g.file + "?" + z + "*/"), "textContent" in x ? x.textContent = W : x.styleSheet.cssText = W, y && (f ? document.head.insertBefore(x, document.head.childNodes[0]) : document.head.appendChild(x))
				} else u[z]++
			}
			return function (e) {
				e.forEach(function (e) {
					if (--u[e] <= 0) {
						var t = document.getElementById(i + e);
						t && t.parentNode.removeChild(t)
					}
				})
			}.bind(null, p)
		}
	}, function (e, t) {
		e.exports = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "../node_modules/babel-runtime/core-js/json/stringify.js")
	}, function (e, t) {
		e.exports = __webpack_require__(/*! babel-runtime/helpers/slicedToArray */ "../node_modules/babel-runtime/helpers/slicedToArray.js")
	}, function (e, t) {
		e.exports = __webpack_require__(/*! isomorphic-style-loader/lib/withStyles */ "../node_modules/isomorphic-style-loader/lib/withStyles.js")
	}, function (e, t) {
		e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPcAAADSCAMAAAChM6bkAAABjFBMVEUAAADoS2WzsrO2ra+zsrOzsrO1tLWzsrOzsrOzsrOzsrOzsrOzsrO1tLW1tLWzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrPoS2WzsrO3trezsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrOzsrPoS2WzsrPoS2WzsrOzsrO0s7SzsrOzsrPoS2XoS2XoS2XoS2XoS2XoS2XoS2XoS2XoS2XoS2XoS2XoS2XoS2XoS2WzsrPoS2X19PX///+6ubr////////////////FxMX9/f339/f////S0tL+/v7Av8D////39/ezsrP////29fa3t7e1tLX09PTx8fHAv8D9/f3s7Oy6ubro6OjIyMi+vb7i4uLQ0ND4+Pju7u7b29vY2NjS0tLq6ur7+/vd3N3Kycrf39+8u7y5uLnOzc7FxMXU09TDwsPm5ebk5OTh4OHW1dbMy8zCwcLHxsf6+vrX19fa2trPk6oKAAAAWXRSTlMAgBkD+PwG7A3y5uKaChUjCKJbKRPFwLWTbmJ5UEI4iYBWS7Day3hoD9fPqo4+My+7HkxGRNOEG950YTUtJB4UBnFpWg1UPD8ROulv75I58OPc1tPS0J1TIBCSGE4AABU1SURBVHja5Np5TxpBGMfxyXKD4EE9saLWpvVAbYw93kHTO73nu5xFpApeWBCsvd94WZa2VhbdVViT9vOfRkmeDPP8Zp5d8Y9SFgJ4FoLi/xKKOtEMi//JRL8TIA9cFZfKfXVsqjfo9bpF192JzKLZSKl7EBWXyHHDAzA0oShXRFcFB5bRJOtVq2oW+sXlWbyOzhNTlJuiaxxX+31oMnvfVE0OFsRl8Y64gNrWdgJW7yiK6JKlqB9NuZpWm7ZhQFySKT+w9l5KmV6DKUXpyha/c28VTbKUe6f+8i2BKyQuRe8wwHZKaoqwoCh9otP6mpuag6Nv6jFVmBeXwR1xAl92pC4Hw4riFZ212ONDk/8RV/+yA64lcQmuzgKJYlw2pWGuw43Ne2OuuakL6gmp8uV0tVA/QCkt/0ji6WiShUd8aLRNfVJqDa67he0akf3hUB6XgbDSsU6zMowmX9xUW+WAwB1ht6VBIPkpLv+yDlc7FGSOqTmA5Ocd1cC7PcDTK2wWjLqAg6w8YQPGFMXRgarHZgDWtjZVI6kDgGlhs/EAUN6XLX7AZCcCfHwWIPPxnWpks4pmTtjr1jX9ViBbvYf+iwf4xCBALacakp+SYP9yO+75gExOGsnC8kUD3NsDkDGu+t1OCcDls/vEMrEKJH7EpaEUzFwwwGMBYO3onWHR22UA17W7MHNF2Od+D8B6WrZTxnmxAI+4gO3d1poLe+tJNL6RcT94wsI+A43Ifi/b+wKLFwhwRz+Qz7bu6a9JGlzDY96IC/xLwjbhISBZTclTlGBcUS5UdmVXbVFE47s2FhKxVWD1lrBL320nUMvKU1Vh9PwBfhsoqgbSjwLz9ybqHzsxDDDSJ+yyMgMk9uQZ9iB67gCPAfuqkWdBUeeeGgKYWRF2UeYBKml5lkOYV5SgOJPD7e4L3uxdXJmeCNU7YeM/VuG7auihEI7YggfAE3ELmzhGfUA+J89WgEHjAHc0Kg31TkwPjE6O9F8bWg34aPDf7q1X7hAr8MX4gPbyzlSPB43TvoG5PjVMbsWlCXHwN4JMr7SvXmk4Nj527/ZI//DgrN+JodlFRbkveiCnttjN7m/40S1PzeAS9tCnhl8L0pwPsDSxMnUjEu2ZX74+43HSVrKcr61XKhlgpr7i7uvQstyHeX4ZHL0lQi4CwgZ/poYmVTlNci1zsF7Z3tp7f5hNp2TTYQJ66l8SPwn1pAwNsz1TIVEXtWte3t+cGpqzn+CExIfMQWmjWq80l03HpbEcuMKK4uRDa3An859fTStCN+WCJWGDoD41NGfnA7paaeNTcV+v1JR1LQXCUDO8irwVTaMumx4LuR9+yhTj0pR0jcaQsQSfpEWH4LwzDhXVwGOhWxwC5h2i+54835QmxUs0D7E7UI5LizJwexL21FZPQ/oTIv2g1vWyx669eb0rzdJHAZ8bTb8G+9KiPfAMQsH4yOK+Gg0A+MdFl4UHIW96sY8SALWd5k+QkRbFE+AiYXAjeTA+OexD45n0iu7Sp4YbltrZn9tpfA1y0qIqQGXzeDvLvv+xcZCg6foNr+iyaX1qaKmdHe9+W1CSFqWTQE4eO7dU+M01FAmLbtOnhhVzkR3/DJD8O+BTSShIiz5DWcpv6m81veTZ+UgsKLpvUZ8aWmlnpULrFH1bWrQDibjc/LPg6erWUZllYZNR01cQ+V5vZzmjqWoiJS3SY2D3xJTFrrqfvPhcSZtboDxth21foSgt0mPgeGfL2TQjjy3dfLxrMrzSB5wyT/4IeWmNHgPHF/wwacslJLwMDzal1XZmLA8fpUV6DGz+irEqMNQnuqxv0onp2N36087aKMKBtEiPgWaUNXbRta43cn1quG+xnbWXSkBWWqLHgB5lha+A67ZDnNvNsd5OTQ11Wb2dHcnTbUNFWtSMgd2PBwCrMXF+3jkCZ79rqE8NLbSzs4OuAEmLUabHQG6jDOAfbbvYt6YHBqbD4jTuZQiYmhp+NxPZ8UqznZm7qmxJiz7SFIgEhbHeaIAGT/9K+5WcB+eEOI13QZ8amm9n6wUTLSADsBaXFuX10/h4u7UOjrj4Y3BRGOsB54qJqeGRqXZWBvhiYjvkauiOpEVFcE4uhkQboTnANTgSiSwMOQHnjXZlMyBOoQwDbKQ61M50O1/RVPbhi+UoS8B428dM7uvgjCq/3msLAKOiVVT/fXuhmcbUsJPtTGZLaEqp813Dt2Gu7fPzSfAs/v1ehCtmWHZEnGbebGTr7Wzj7JxLV9B8bfzlp3NcwwvAUpvnqUEfxE5+oVd/MnOuTUlFURhmEiSQLlqgYBIlTll2cZrK/kHT9KWP5+FyOHICTIEQ8AKBpn88OWTS4SD7LGKm50PTNE25Z+G71rv2u51xfexNyOZS2ljO+3KWH3/qShbgZPfPKiGb01yyD4sjgiIPsN+NzSaHjEuIsavmR1BJpRTkTM2Q650MgFEd/Jgcae6wrhA2nQv+DmL25afNuczOM37D/sTa235TkDOzPr61n2ewxzbzkJFslDecL1Tnh9/Q3If1we+ERWB5bDYOOtefWz9VlLN0zQRo2sz4IdQ0l9TpRXtvO7enIRUL4h1oT2uWko8jDt2LyP61PgFQkLNSEccwRAkMiQ2POUb/Hjp05S24SszOgfeRghux7qO+j5whVOWsbQBkyw5naEBLc0kHko6tbAGWhusd+LMFDkBAKQHixRx57rYJYLTGC9Fhf2Z3bgVQkGyUXzjNLpvDXuPpn5DqzDtgS23bvAXbqW1HOTMU5SxfoMdBetT8JdgoH0DEsZWtga2ejy/1/PZrIKyYm4tA2jq3s5yd6WOnjC49Cvp189eOwIb77ji1sihEhqQuZp3fDyzNqt/p76a2xXKW28kCHF73F3clG+VDCDm1spt+W8FvBvBeCMHTEBBY8KjyENpDg8teRk3O9CPr1EZ+7I3+ueaSEgRuOIUel2Fr0Jh/gNULvQsCa7a1ksvBpaUoZ/pZBqBYVbjRb6TdtrIGfHAKwd1dh+cD5Q7Ci3gE8CVm3Nz/wdFf597ty1ktff2XlS91mgBmS23+KmkuOYc5x9kl7oP52YHBNbgIEHaXeXkF+wODi14AyHT00VX+WqsUGvRp/lC90T+W2PDHjjb8CfB2xWNxz4tFMOZxx304uWrgFUYvVdO7pfLBcYYByi5u9KuCjfKasw2P+oCt0HL0Q2iOfmzTNtq5G1xq1qFOh1RKr9aPCsUsg2QME7oubvS7Eht+z9mVrawzwDNRGmDdGlyu5Kz91//dvogbmAySbRzu/ND7ipvVFBDb8IIV73U806z1cNJiKe4R8Rr01PZvOWvW0pcl/tHZN+wlLpS/Diquiy1xVxrsGpnfv/04tgQseYSEIJ/6WQDI9uQs19rbObWV2Dw+qOecFp9NTQ15sOuaPPf9JITFeewElDr93dDeWdfIMEimWOi00iMVV/XCUx7ssmy4M7fCEHwvz6iNiAmfHNTGuYmKsrWWB7sWLBs+4hooMEFOdWkoRHtaKenKiqumVvJg1/qIjfLsqnUfImd5QLe653mXiqturctCGx63WpnTsX0TJRefAs3TjlViweITNbWSB7teO9hwa3noW/BMRMSaVLc1CYZaWEse7HLeKN8Pg1dybJuBJd2zJgLqkFFeJWS7Vc0tx042fHMdvJPHczfgqDeqCkg3XbQnyXfSDwjYW9nLIARWPBNzBzLfhQXvQEMTod4Gon+3sgfef/UydBVqsoJbipvXpkgZ5v5qZYl/9zJ0BRoX3kRU8K6bsFb1bFcS7Fq5suE3V4HFf5XGfgZfhQWvArqmiImhCWx4uPegzuJVEtiwybucGJxKW9mxi7BWEVqSjfKlDY95bf1LyN147MNy7J7nrh9yEmVzacP3oKAJgl3zViu7Ow9sTaxorxJhLxaROwnYERY83VDKHcsTjO1LG74MrH6csHcl1rnC/8ZL9puw4GUwNQWkVydaERI9Gx7FG/VMwuxCBItm97zULpvgfQvnQmXTM0pOS351sgdBa3ZZuTPR8/V3fnoYe7mUhWbQw9wWFnwHDBcOriwOdk3Cy3kvQLOTG3hdXaFHW1jwvJINl1+daBV4a80uUmYeROhxaP+ZR1b26kRF2eQ2XH51krsMdsnYXJ77nUFLDfOtCXl74kO9iNm0+s5sX5MGuwTMRNfoYfZ/fptev7Ce6d4vl9SgKy14UT2slTbY04TBLqHZBA5b1gf8ZweOt2tZjIvfl/SU9WdZuQ2vubDh6ZxsvxGVKZsXime5/ke6nAHmPgPHqbyJ2XvB0joBOvJWRkmbInUIy87th0764ny5+j49ggBfPp0BZq7dz/fLbfgRFLUpks7guyc6dwIgy2+8AMnHD5JcsfUW6v+rDS/AikjQZ0L8zVwi+ow/+BYfzbyBolTZ9uHQhU6VBXGX+H2hD9kIB7Hz9sWD0Orzh4+sf3MdqsJW9hXQXRwi7/rzFLDKLeTuQmgxsroR9WORjM3YggQFacFPYGdq7kQ//kevJW+/W0uGN1bs23g/6EJl+wEZbUruJGdAYNMzPR5CRWrDTahNx51UTbWrMDnvfWR/Cgt+BqY2DXfSzoA/7pkqz2FPOrtkoToFd1IDknc80yUODakNPxjzZkoW7DoCwr+YOxflpIEwCu9waZWqVauI2na0lWlFW9tx1OFVziwkGMJluDjcoSAw9MVdksBKgSSbliXfA3QmbHr+/PufPbv5tNA4cMNK2abbcNoC/rg9Y/5FQpDiS6DjtZR1gKHAfGnoqn7JCqGKACUvC74JY1cpD4TPiBTeA22vC94EJg9o7PrTAkInRA6vQmzRPCpbGUg9nLGrkAYil0QWT4CKjDY8AzQcfkR8vibS+Aa0vJayqts2nA56ADL2fwrRcyKRK2DgccFLcOXdUSdZAHbRITQHbjKXxAmQ2eSOstZOg5EdAzm7fK8PRC7BTwJtuKixixZ6mDIa0PXnq0pNIPyOyObtxoxdSqVpXcthZ+zSU/zQnxy4sUvZgLGLveDWiMo2sWuQBva8TLl9aeyihQ6mZBr0fzUorxorI+HFZuxHY5dy27SuGFrorJfbcFoEcOXFt+NDY5dWTIGR6qpL8yX+ncOPMz0Jki1xYbTh3pRteLe17o+t2wDpqja8c3cjDe+JB/xm7FLKeUzJ6S78LlqT25W2wzug8wDGrlLVfMGrpfW7Ke3F+nVBtslO5AGMXTc56+YwxWaiz9vwxrR+HZDtck9j1y1/wW+c5kuT+X4s4gGyZZ7dw9h1C7T4C26PDmTpLN3sjQ/udX5xvzacv+DO86WGlS4QC5Ltc+nN2MWzF8d9t/OlkVm/ksQXRIGClwVXhmB0NJH5UtYIXfEHh8LGLh4WkNeE5kuM3QviE4J7HoxdtMpvd3ED7bdbMENXfENS3NilZXjegzPKoG4pYNxHj03ORc9XUSNzsupusdXyOA2LyP4r4iNiYsauUo/HXDigVUYwSI9rdSDJXPU+QqwNb6TMSEVH9G4eBqn6QDGGLJcBP1Ruzhv3xi61DiA1cNaxYhYG2WKfWlvPn5i33Fe4Mnbx5K6O6lbH8l2dj0XwhDlu/cVnQHdRypQigHTZpY6NKtrijvtLdhzQX3Bjl2PYf0ZzqWPqXQNmaN9n/97E1fkq+heMLnWpY8v9WDTgqypm8NOxDddGAJq6Ox1bpgt88FcVczR28QDGtuKsY+vnK0fMZ+w77I1das4KDl1GrS3r2DKqcUSKbI91inpstuE2jXZOXaVjvZmOlVWHsdIXduZVGs/3A4s2ptCPpzbGrpULrrQBpGvL8r6gY/YMgbOAtN2li6swsBvjj34SBg7WBij3Viqb3uTxzyt0rNVmOuZIC+EDaVUsCQOekXAUWn9x+s7eSmMXrYIxoYs6NpzpWFV3O2NISPtIPQYQeRMPAY9/zR/7asfB2OXUaKu13EzHJprAkdqv0l7zF+bOZSAKfJ3lRLx+amfsAjd28TR0FClvQec61imrYi6BE2k9SRx4RRjXZn72WRiIn9sbuyYzZeOB/9n+Ch1rKKLHzvbkfaNGgWvraNUu2YkBiNp+MB0ALd6GLzba9EZAxzh8MHQWJLKIWfng59M8kCiA0x0BY5dSn19ipBRmOtas6qIPrTY6AE6JPI6AyCNz5mlcvv1BwNjFG22uYxmmY0JQrTxsAtIHQwng9JFxHwLj8aGAsYsajfatsI5xqD4Zp2Cy+1Zu/3k8LWHRhPmL/xIwdpmN9qCb8aZjaqE6SsMknIgdSt9t+BiCSeJQwNj1uwJGZq5jBSqys15r52ERiv78fk62wcFpCMDVkYixi3bA8KBjVK/kWrCInCaPg2Rr7P9j74xXGoSiMC40c82RzJBotZzCWNGyRkQ9Qs/wsbnNVqw1KOoP3WpEb56CTYNKD2t4U39vIFzO75zPw70i0Ih/zto8zC5Ar2O9F8c24XNYrkpcokii1zGQFrt8CHXs/vluAJ+Cou4lHxbvC4AoEfMmwLyNW8c6D5OnIXyE7d1jJgJTrUD97IMSMJ114h3t2XxhKlxWmluMhKXrLXjTH7XFe7PG8UyFwFTaBccMmwr94rYTHui/R5rKbcJ8Nk7rZ4yFpCqAOvHoKYBjRZiquzDV0Y7ByNEOI0PQ6cuLwx+fDO6NnGnIVLLEMYpEbZWuBGD0+L2pQk2Yours/fdYcm61rXGUqRjM/pfDCIpaYCo7bCqWllMIkIpa/zVowvhGS0t8oZQMvahdT76YqsbANunKKArefXT/wlR/igYMbubBTHVelttcBpCBUFygs7aIsjKKJXgIblyQOlP9ilRRytV0mionJycnq6wZmlxL16wZh6YIFzFbGv98v4mvcdnio517W4kYBsIAnFIFQRFvBBURQYiueMAQRJLM5JzSV+j7P4i1yooXy6LYJrD5rnPzMwRmGJKPhrWg106LOT8cU988k91z/FLE1qOqqqqqqmrt6fz1uty15lwuV8Pk/mKnBq+HYW21Q6PX1f4w+fXfA8YErREB1EjKPqWOT9gnPulSSlLK8QgAotYhGFKGx7fhy9HBlqQaQfaceeEsbf6OWid8ZJ1UqAPJ5uT2dG+s9dnGYgdUiXlHm1lYwToJuiUZtHcbNrxaMkGbRbjYYxF3oIVIm2VRIbNHN67JgWqSl6FNFkgy0yxDcg8kvxZTtM1SqOCQ/XZ/M6h4FHPGtyJyCYGUKaCSHYvC2f+prhOe8V6BLqjGW5igEUDJxBlj3gvhnLV08jPbxFrnhPA+Msa7XipAPWez+g4MlQM/Qg3MtwAAAABJRU5ErkJggg=="
	}])
});

/***/ }),

/***/ "../node_modules/@ql-feat/loading/dist/index.js":
/*!******************************************************!*\
  !*** ../node_modules/@ql-feat/loading/dist/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,n){if(true)module.exports=n();else { var r, t; }}("undefined"!=typeof self?self:this,function(){return function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),o=t(1),a=u(o),i=u(t(2)),s=u(t(3)),l=u(t(9));function u(e){return e&&e.__esModule?e:{default:e}}var f=function(e){function n(){return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),function(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}(n,o.Component),r(n,[{key:"render",value:function(){return a.default.createElement("div",{className:s.default.loading+(this.props.show?"":" "+s.default.hide)+" "+(this.props.className?this.props.className:"")},a.default.createElement("div",{className:s.default.logo},a.default.createElement("img",{src:this.props.show?"//img.qlchat.com/qlLive/liveCommon/page-loading-m.png":""}),a.default.createElement("p",null,"加载中...")))}}]),n}();f.propTypes={show:i.default.bool.isRequired,className:i.default.string},f.contextProps={router:i.default.object},n.default=(0,l.default)(s.default)(f)},function(e,n){e.exports=__webpack_require__(/*! react */ "../node_modules/react/index.js")},function(e,n){e.exports=__webpack_require__(/*! prop-types */ "../node_modules/@ql-feat/loading/node_modules/prop-types/index.js")},function(e,n,t){var r=t(4),o=t(6);"string"==typeof r&&(r=[[e.i,r,""]]),e.exports=r.locals||{},e.exports._getContent=function(){return r},e.exports._getCss=function(){return r.toString()},e.exports._insertCss=function(e){return o(r,e)}},function(e,n,t){(n=e.exports=t(5)(!1)).push([e.i,'.loading--gu77hb51s25 {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0);\n  z-index: 9999;\n}\n\n.loading--gu77hb51s25.hide--tt7urdgprz {\n  display: none;\n}\n\n.loading--gu77hb51s25 .logo--l7281gtbwzl {\n  position: absolute;\n  width: 3.733333rem;\n  height: 3.733333rem;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translateX(-50%) translateY(-50%);\n     -moz-transform: translateX(-50%) translateY(-50%);\n          transform: translateX(-50%) translateY(-50%);\n  -webkit-border-radius: 0.373333rem;\n          border-radius: 0.373333rem;\n  background-color: #fff;\n  padding: 0.533333rem;\n  -webkit-box-sizing: border-box;\n     -moz-box-sizing: border-box;\n          box-sizing: border-box;\n  -webkit-box-shadow: 0 0 0.533333rem 0 rgba(0, 0, 0, 0.05);\n          box-shadow: 0 0 0.533333rem 0 rgba(0, 0, 0, 0.05);\n  text-align: center;\n}\n\n.loading--gu77hb51s25 .logo--l7281gtbwzl img {\n  height: 1.893333rem;\n  -webkit-animation: pageLoadingImgAnimation--xabytdflzks 1.6s infinite ease;\n     -moz-animation: pageLoadingImgAnimation--xabytdflzks 1.6s infinite ease;\n          animation: pageLoadingImgAnimation--xabytdflzks 1.6s infinite ease;\n}\n\n.loading--gu77hb51s25 .logo--l7281gtbwzl p {\n  position: absolute;\n  left: 0;\n  bottom: 0.533333rem;\n  width: 100%;\n  color: #999;\n  line-height: 1.4;\n  text-align: center;\n  white-space: nowrap;\n}\n\n[data-dpr="1"] .loading--gu77hb51s25 .logo--l7281gtbwzl p {\n  font-size: 12px;\n}\n\n[data-dpr="2"] .loading--gu77hb51s25 .logo--l7281gtbwzl p {\n  font-size: 24px;\n}\n\n[data-dpr="3"] .loading--gu77hb51s25 .logo--l7281gtbwzl p {\n  font-size: 36px;\n}\n\n@-webkit-keyframes pageLoadingImgAnimation--xabytdflzks {\n  0% {\n    -webkit-transform: translate3d(-0.053333rem, 0.146667rem, 0);\n            transform: translate3d(-0.053333rem, 0.146667rem, 0);\n  }\n\n  30% {\n    -webkit-transform: translate3d(0.053333rem, -0.146667rem, 0);\n            transform: translate3d(0.053333rem, -0.146667rem, 0);\n  }\n\n  100% {\n    -webkit-transform: translate3d(-0.053333rem, 0.146667rem, 0);\n            transform: translate3d(-0.053333rem, 0.146667rem, 0);\n  }\n}\n\n@-moz-keyframes pageLoadingImgAnimation--xabytdflzks {\n  0% {\n    -moz-transform: translate3d(-0.053333rem, 0.146667rem, 0);\n         transform: translate3d(-0.053333rem, 0.146667rem, 0);\n  }\n\n  30% {\n    -moz-transform: translate3d(0.053333rem, -0.146667rem, 0);\n         transform: translate3d(0.053333rem, -0.146667rem, 0);\n  }\n\n  100% {\n    -moz-transform: translate3d(-0.053333rem, 0.146667rem, 0);\n         transform: translate3d(-0.053333rem, 0.146667rem, 0);\n  }\n}\n\n@keyframes pageLoadingImgAnimation--xabytdflzks {\n  0% {\n    -webkit-transform: translate3d(-0.053333rem, 0.146667rem, 0);\n       -moz-transform: translate3d(-0.053333rem, 0.146667rem, 0);\n            transform: translate3d(-0.053333rem, 0.146667rem, 0);\n  }\n\n  30% {\n    -webkit-transform: translate3d(0.053333rem, -0.146667rem, 0);\n       -moz-transform: translate3d(0.053333rem, -0.146667rem, 0);\n            transform: translate3d(0.053333rem, -0.146667rem, 0);\n  }\n\n  100% {\n    -webkit-transform: translate3d(-0.053333rem, 0.146667rem, 0);\n       -moz-transform: translate3d(-0.053333rem, 0.146667rem, 0);\n            transform: translate3d(-0.053333rem, 0.146667rem, 0);\n  }\n}',""]),n.locals={loading:"loading--gu77hb51s25",hide:"hide--tt7urdgprz",logo:"logo--l7281gtbwzl",pageLoadingImgAnimation:"pageLoadingImgAnimation--xabytdflzks"}},function(e,n){e.exports=function(e){var n=[];return n.toString=function(){return this.map(function(n){var t=function(e,n){var t=e[1]||"",r=e[3];if(!r)return t;if(n&&"function"==typeof btoa){var o=function(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}(r),a=r.sources.map(function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"});return[t].concat(a).concat([o]).join("\n")}return[t].join("\n")}(n,e);return n[2]?"@media "+n[2]+"{"+t+"}":t}).join("")},n.i=function(e,t){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},o=0;o<this.length;o++){var a=this[o][0];"number"==typeof a&&(r[a]=!0)}for(o=0;o<e.length;o++){var i=e[o];"number"==typeof i[0]&&r[i[0]]||(t&&!i[2]?i[2]=t:t&&(i[2]="("+i[2]+") and ("+t+")"),n.push(i))}},n}},function(e,n,t){"use strict";var r=a(t(7)),o=a(t(8));function a(e){return e&&e.__esModule?e:{default:e}}var i="s",s={};function l(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,n){return String.fromCharCode("0x"+n)}))}e.exports=function(e){for(var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=n.replace,a=void 0!==t&&t,u=n.prepend,f=void 0!==u&&u,d=[],m=0;m<e.length;m++){var c=(0,o.default)(e[m],4),p=c[0],g=c[1],b=c[2],h=c[3],y=p+"-"+m;if(d.push(y),!s[y]||a){s[y]=1;var x=document.getElementById(i+y),v=!1;x||(v=!0,(x=document.createElement("style")).setAttribute("type","text/css"),x.id=i+y,b&&x.setAttribute("media",b));var w=g;h&&"function"==typeof btoa&&(w+="\n/*# sourceMappingURL=data:application/json;base64,"+l((0,r.default)(h))+"*/",w+="\n/*# sourceURL="+h.file+"?"+y+"*/"),"textContent"in x?x.textContent=w:x.styleSheet.cssText=w,v&&(f?document.head.insertBefore(x,document.head.childNodes[0]):document.head.appendChild(x))}else s[y]++}return function(e){e.forEach(function(e){if(--s[e]<=0){var n=document.getElementById(i+e);n&&n.parentNode.removeChild(n)}})}.bind(null,d)}},function(e,n){e.exports=__webpack_require__(/*! babel-runtime/core-js/json/stringify */ "../node_modules/babel-runtime/core-js/json/stringify.js")},function(e,n){e.exports=__webpack_require__(/*! babel-runtime/helpers/slicedToArray */ "../node_modules/babel-runtime/helpers/slicedToArray.js")},function(e,n){e.exports=__webpack_require__(/*! isomorphic-style-loader/lib/withStyles */ "../node_modules/isomorphic-style-loader/lib/withStyles.js")}])});

/***/ }),

/***/ "../node_modules/@ql-feat/loading/node_modules/prop-types/checkPropTypes.js":
/*!**********************************************************************************!*\
  !*** ../node_modules/@ql-feat/loading/node_modules/prop-types/checkPropTypes.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/@ql-feat/loading/node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          )

        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "../node_modules/@ql-feat/loading/node_modules/prop-types/factoryWithTypeCheckers.js":
/*!*******************************************************************************************!*\
  !*** ../node_modules/@ql-feat/loading/node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var assign = __webpack_require__(/*! object-assign */ "../node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/@ql-feat/loading/node_modules/prop-types/lib/ReactPropTypesSecret.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "../node_modules/@ql-feat/loading/node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
       true ? printWarning('Invalid argument supplied to oneOf, expected an instance of array.') : undefined;
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : undefined;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "../node_modules/@ql-feat/loading/node_modules/prop-types/index.js":
/*!*************************************************************************!*\
  !*** ../node_modules/@ql-feat/loading/node_modules/prop-types/index.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "../node_modules/@ql-feat/loading/node_modules/prop-types/factoryWithTypeCheckers.js")(isValidElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "../node_modules/@ql-feat/loading/node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!********************************************************************************************!*\
  !*** ../node_modules/@ql-feat/loading/node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "../node_modules/@ql-feat/react-dialog/dist/index.js":
/*!***********************************************************!*\
  !*** ../node_modules/@ql-feat/react-dialog/dist/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){if(true)module.exports=t();else { var o, n; }}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var l=t[o]={i:o,l:!1,exports:{}};return e[o].call(l.exports,l,l.exports,n),l.l=!0,l.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)n.d(o,l,function(t){return e[t]}.bind(null,l));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=7)}([function(e,t){e.exports=__webpack_require__(/*! react */ "../node_modules/react/index.js")},function(e,t){e.exports=__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js")},function(e,t){e.exports=__webpack_require__(/*! classnames */ "../node_modules/classnames/index.js")},function(e,t){e.exports=__webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js")},function(e,t){e.exports=__webpack_require__(/*! @ql-feat/scroll-to-load */ "../node_modules/@ql-feat/scroll-to-load/dist/index.js")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},l=c(n(0)),a=c(n(1)),i=c(n(2));function c(e){return e&&e.__esModule?e:{default:e}}function r(e){var t=e.show,n=(e.theme,e.titleTheme),a=void 0===n?"white":n,c=e.buttons,r=e.buttonTheme,u=e.close,f=e.closeStyle,d=void 0===f?"normal-style":f,m=e.closeProps,p=e.onClose,b=e.children,g=e.title,h=e.onBtnClick,v=e.className,y=e.contentClassName,k=e.cancelText,E=void 0===k?"取消":k,N=e.confirmText,w=void 0===N?"确定":N,C=e.bghide,_=void 0===C||C,O=e.confirmDisabled,T=void 0!==O&&O,S=e.trackCloseBtnModel,x=void 0===S?{}:S;if(!t)return null;var j=void 0;g&&(j=function(e,t){return l.default.createElement("div",{className:(0,i.default)("co-dialog-title",t),dangerouslySetInnerHTML:s(e)})}(g,a));var P=void 0;"line"===r?P=function(e,t,n,o,a){if("none"===e)return"";if("cancel"===e)return l.default.createElement("div",{className:"co-dialog-btn-line"},l.default.createElement("span",{className:"co-dialog-btn-line-cancel",onClick:function(e){e.nativeEvent.stopImmediatePropagation(),o("cancel")}},t));if("confirm"===e)return l.default.createElement("div",{className:"co-dialog-btn-line"},l.default.createElement("span",{className:"co-dialog-btn-line-confirm",onClick:function(){return o("confirm")}},n));if("cancel-confirm"===e)return l.default.createElement("div",{className:"co-dialog-btn-line"},l.default.createElement("span",{className:"co-dialog-btn-line-cancel",onClick:function(e){e.nativeEvent.stopImmediatePropagation(),o("cancel")}},t),a?l.default.createElement("span",{className:"co-dialog-btn-line-confirm disabled"},n):l.default.createElement("span",{className:"co-dialog-btn-line-confirm",onClick:function(){return o("confirm")}},n));if("confirm-cancel"===e)return l.default.createElement("div",{className:"co-dialog-btn-line"},l.default.createElement("span",{className:"co-dialog-btn-line-confirm",onClick:function(){return o("confirm")}},n),l.default.createElement("span",{className:"co-dialog-btn-line-cancel",onClick:function(e){e.nativeEvent.stopImmediatePropagation(),o("cancel")}},t))}(c,E,w,h,T):"block"===r&&(P=function(e,t,n,o){if("none"===e)return"";if("cancel"===e)return l.default.createElement("div",{className:"co-dialog-btn-block"},l.default.createElement("div",{className:"co-dialog-btn-block-wrap"},l.default.createElement("span",{className:"co-dialog-btn-block-cancel",onClick:function(e){e.nativeEvent.stopImmediatePropagation(),o("cancel")}},t)));if("confirm"===e)return l.default.createElement("div",{className:"co-dialog-btn-block"},l.default.createElement("div",{className:"co-dialog-btn-block-wrap"},l.default.createElement("span",{className:"co-dialog-btn-block-confirm",onClick:function(){return o("confirm")}},n)));if("cancel-confirm"===e)return l.default.createElement("div",{className:"co-dialog-btn-block"},l.default.createElement("div",{className:"co-dialog-btn-block-wrap"},l.default.createElement("span",{className:"co-dialog-btn-block-cancel",onClick:function(e){e.nativeEvent.stopImmediatePropagation(),o("cancel")}},t)),l.default.createElement("div",{className:"co-dialog-btn-block-wrap"},l.default.createElement("span",{className:"co-dialog-btn-block-confirm",onClick:function(){return o("confirm")}},n)));if("confirm-cancel"===e)return l.default.createElement("div",{className:"co-dialog-btn-block"},l.default.createElement("div",{className:"co-dialog-btn-block-wrap"},l.default.createElement("span",{className:"co-dialog-btn-block-confirm",onClick:function(){return o("confirm")}},n)),l.default.createElement("div",{className:"co-dialog-btn-block-wrap"},l.default.createElement("span",{className:"co-dialog-btn-block-cancel",onClick:function(e){e.nativeEvent.stopImmediatePropagation(),o("cancel")}},t)))}(c,E,w,h));var M=void 0;return u&&(M=function(e,t,n,a){return l.default.createElement("div",o({className:"co-dialog-close "+t,"data-log-name":a.name,"data-log-region":a.region,"data-log-pos":a.pos,onClick:function(t){return e(t)}},n))}(p,d,m,x)),l.default.createElement("div",{className:"co-dialog-container "+v},l.default.createElement("div",{className:"co-dialog-bg",onClick:function(e){e.nativeEvent.stopImmediatePropagation(),_&&p(e)}}),l.default.createElement("div",{className:"co-dialog-content"},M,j,l.default.createElement("main",{className:y},b),P))}r.propTypes={show:a.default.bool.isRequired,bghide:a.default.bool,theme:a.default.oneOf(["empty","primary"]),title:a.default.string,titleTheme:a.default.oneOf(["white","blue"]),buttons:a.default.oneOf(["none","cancel","confirm","cancel-confirm","confirm-cancel"]),cancelText:a.default.string,confirmText:a.default.string,buttonTheme:a.default.oneOf(["line","block"]),onBtnClick:a.default.func,close:a.default.bool,onClose:a.default.func,closeStyle:a.default.string,className:a.default.string,contentClassName:a.default.string,confirmDisabled:a.default.bool,trackCloseBtnModel:a.default.objectOf(a.default.string)},t.default=r;var s=function(e){return{__html:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,l=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(0),i=s(a),c=s(n(1)),r=s(n(5));function s(e){return e&&e.__esModule?e:{default:e}}var u=(0,n(3).autobind)(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={show:!1},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.PureComponent),l(t,[{key:"show",value:function(){this.setState({show:!0})}},{key:"hide",value:function(){this.setState({show:!1})}},{key:"onClose",value:function(e){this.props.onClose&&this.props.onClose(e),this.hide()}},{key:"onBtnClick",value:function(e){"cancel"===e&&(this.props.onClose&&this.props.onClose(),this.hide()),this.props.onBtnClick&&this.props.onBtnClick(e)}},{key:"render",value:function(){var e=this.props,t=e.buttons,n=void 0===t?"cancel-confirm":t,o=e.title,l=e.children,a=e.buttonTheme,c=void 0===a?"line":a,s=e.titleTheme,u=void 0===s?"white":s,f=e.className,d=e.cancelText,m=void 0===d?this.props.cancelText||"取消":d,p=e.confirmText,b=void 0===p?this.props.confirmText||"确定":p,g=e.close,h=void 0!==g&&g,v=e.bghide,y=void 0===v||v,k=e.confirmDisabled,E=this.state.show;return i.default.createElement(r.default,{title:o,titleTheme:u,show:E,theme:"empty",close:h,onClose:this.onClose,buttons:n,cancelText:m,confirmText:b,buttonTheme:c,onBtnClick:this.onBtnClick,className:f,bghide:y,confirmDisabled:k},i.default.createElement("div",{className:"co-dialog-confirm"},l))}}]),t}())||o;u.propTypes={title:c.default.string,buttons:c.default.oneOf(["cancel","confirm","cancel-confirm","confirm-cancel","none",""]),onBtnClick:c.default.func,buttonTheme:c.default.oneOf(["line","block"]),confirmText:c.default.string,cancelText:c.default.string,titleTheme:c.default.oneOf(["white","blue","red"]),className:c.default.string},t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.IsBuyDialog=t.ListDialog=t.Confirm=t.BottomDialog=t.MiddleDialog=void 0;r(n(0)),r(n(1));var o=r(n(5)),l=r(n(8)),a=r(n(6)),i=r(n(9)),c=r(n(10));function r(e){return e&&e.__esModule?e:{default:e}}t.MiddleDialog=o.default,t.BottomDialog=l.default,t.Confirm=a.default,t.ListDialog=i.default,t.IsBuyDialog=c.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},l=c(n(0)),a=c(n(1)),i=c(n(2));function c(e){return e&&e.__esModule?e:{default:e}}function r(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}var s=function(e){return{__html:e}};function u(e){var t=e.show,n=e.bghide,a=void 0===n||n,c=(e.title,e.titleLabel,e.className),u=e.theme,d=(e.items,e.onClose),m=(e.close,e.onItemClick,e.children);e.notShowPoint;if(!t)return null;var p=void 0;return"list"===u?p=function(e){var t=e.title,n=e.titleLabel,a=e.items,c=e.close,u=e.onItemClick,d=r(e,["title","titleLabel","items","close","onItemClick"]);return l.default.createElement("ul",{className:"co-dialog-bottom-list"},(t||n)&&l.default.createElement("li",{className:"co-dialog-bottom-title"},n?l.default.createElement("span",{className:"co-dialog-bottom-title-label"},n):null,l.default.createElement("span",{className:"co-dialog-bottom-title-content",dangerouslySetInnerHTML:s(t)}),d.showSure?l.default.createElement("span",{className:"dialog-sure on-log","data-log-region":d.logSure&&d.logSure.region,"data-log-pos":d.logSure&&d.logSure.pos,onClick:d.onSure},d.sure||"确定"):null),a.map(function(e,t){if(!0===e.show)return!0===e.switchStatus||!1===e.switchStatus?l.default.createElement("li",{key:"co-dialog-bottom-item"+t,hidden:!e.show,className:(0,i.default)("co-dialog-bottom-item",e.icon,e.theme)},e.content):l.default.createElement("li",{key:"co-dialog-bottom-item"+t,hidden:!e.show,className:(0,i.default)("co-dialog-bottom-item",e.icon,e.theme,e.topictype,e.region&&!d.notShowPoint?"on-log":"",d.activeString==e.key?"co-dialog-bottom-item-active":""),"data-log-region":e.region,"data-log-pos":e.pos,onClick:function(){return u&&u(e.key,"",e.topictype)},type:e.topicType,dangerouslySetInnerHTML:s(e.content)})}),c&&f(o({},d)))}(e):"empty"===u?p=m:"scroll"===u&&(p=function(e){var t=e.title,n=e.titleLabel,a=e.items,c=e.close,u=e.onItemClick,d=e.scrollHeight,m=void 0===d?400:d,p=r(e,["title","titleLabel","items","close","onItemClick","scrollHeight"]);return l.default.createElement("ul",{className:"co-dialog-bottom-list"},(t||n)&&l.default.createElement("li",{className:"co-dialog-bottom-title"},n?l.default.createElement("span",{className:"co-dialog-bottom-title-label"},n):null,l.default.createElement("span",{className:"co-dialog-bottom-title-content",dangerouslySetInnerHTML:s(t)})),l.default.createElement("div",{className:"scroll-warp",style:{height:m}},a.map(function(e,t){if(!0===e.show)return!0===e.switchStatus||!1===e.switchStatus?l.default.createElement("li",{key:"co-dialog-bottom-item"+t,hidden:!e.show,className:(0,i.default)("co-dialog-bottom-item",e.icon,e.theme)},e.content):l.default.createElement("li",{key:"co-dialog-bottom-item"+t,hidden:!e.show,className:(0,i.default)("co-dialog-bottom-item",e.icon,e.theme,e.topictype),onClick:function(){return u&&u(e.key,"",e.topictype)},type:e.topicType,dangerouslySetInnerHTML:s(e.content)})})),c&&f(o({},p)))}(e)),l.default.createElement("div",{className:"co-dialog-container "+c},l.default.createElement("div",{className:"co-dialog-bg",onClick:function(){return a&&d&&d()}}),l.default.createElement("div",{className:"co-dialog-bottom"},p))}function f(e){var t=e.closeText,n=e.onClose,o=e.onDelete;return l.default.createElement("li",{className:"co-dialog-bottom-close",onClick:function(){o?o():n()}},t||"取消")}u.propTypes={show:a.default.bool.isRequired,bghide:a.default.bool,title:a.default.string,titleLabel:a.default.string,className:a.default.string,theme:a.default.oneOf(["list","empty","scroll"]),items:a.default.arrayOf(a.default.shape({key:a.default.oneOfType([a.default.string,a.default.number]).isRequired,icon:a.default.string,content:a.default.string,show:a.default.bool,switchStatus:a.default.bool,theme:a.default.oneOf(["normal","danger"])})),close:a.default.bool,notShowPoint:a.default.bool,closeText:a.default.string,onClose:a.default.func,onItemClick:a.default.func,activeString:a.default.string,showSure:a.default.bool},t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),l=n(0),a=s(l),i=s(n(1)),c=s(n(6)),r=s(n(4));function s(e){return e&&e.__esModule?e:{default:e}}var u=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={list:[]},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.Component),o(t,[{key:"dangerHtml",value:function(e){return{__html:e}}},{key:"componentDidMount",value:function(){this.setState({list:this.props.items})}},{key:"componentWillReceiveProps",value:function(e){this.setState({list:e.items})}},{key:"show",value:function(){this.refs.dialog.show()}},{key:"hide",value:function(){this.refs.dialog.hide()}},{key:"getSelectedItem",value:function(){return this.state.list.filter(function(e){return e.checked})[0]}},{key:"onSelectItem",value:function(e){this.setState({list:this.state.list.map(function(t,n){return t.checked=n===e,t})})}},{key:"render",value:function(){var e=this,t=this.props,n=t.title,o=t.buttons,l=t.className,i=t.onBtnClick,s=t.noMore,u=t.loadNext;return null==u&&(u=function(){},s=!0),a.default.createElement(c.default,{ref:"dialog",title:n,buttons:o,className:l+" co-list-dialog",onBtnClick:function(t){return i(t,e.getSelectedItem())}},a.default.createElement("div",{className:"co-list-container"},a.default.createElement(r.default,{className:"co-list-wrap",loadNext:u,noMore:s},this.state.list.map(function(t,n){return a.default.createElement("li",{key:"co-list-item-"+t.key,className:"co-list-dialog-item "+(t.checked?"icon_checked":""),onClick:function(){return e.onSelectItem(n)},dangerouslySetInnerHTML:e.dangerHtml(t.content)})}))))}}]),t}();u.propTypes={items:i.default.arrayOf(i.default.shape({key:i.default.any,content:i.default.string,checked:i.default.bool})).isRequired,loadNext:i.default.func,noMore:i.default.bool},u.defaultProps={loadNext:null},t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,l=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(0),i=r(a),c=r(n(1));function r(e){return e&&e.__esModule?e:{default:e}}var s=(0,n(3).autobind)(o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={show:!1},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.Component),l(t,[{key:"show",value:function(){this.setState({show:!0})}},{key:"hide",value:function(){this.setState({show:!1})}},{key:"confirm",value:function(){this.props.onBtnClick({type:"cancel"}),this.hide()}},{key:"cancel",value:function(){this.props.onBtnClick({type:"cancel"}),this.hide()}},{key:"render",value:function(){var e=this,t=this.props,n=t.title,o=t.desc,l=t.cancelText,a=(void 0===l&&this.props.cancelText,t.confirmText),c=void 0===a?this.props.confirmText||"确定":a;t.money;return this.state.show&&i.default.createElement("div",{className:"is-buy-dialog co-dialog-container"},i.default.createElement("div",{className:"co-dialog-bg"},i.default.createElement("div",{className:"co-dialog-content"},i.default.createElement("p",{className:"title"},n),i.default.createElement("p",{className:"desc"},o),i.default.createElement("div",{className:"btn-group"},i.default.createElement("div",{className:"btn confirm",onClick:function(){e.confirm()}},i.default.createElement("span",null,c))),i.default.createElement("span",{className:"co-dialog-close normal-style",onClick:function(){e.hide()}}))))}}]),t}())||o;s.propTypes={title:c.default.string,desc:c.default.string,onBtnClick:c.default.func,confirmText:c.default.string,cancelText:c.default.string,money:c.default.number},t.default=s}])});

/***/ }),

/***/ "../node_modules/@ql-feat/react-image-viewer/dist/index.js":
/*!*****************************************************************!*\
  !*** ../node_modules/@ql-feat/react-image-viewer/dist/index.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){if(true)module.exports=t();else { var n, i; }}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function i(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,i),a.l=!0,a.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(n,a,function(t){return e[t]}.bind(null,a));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=0)}([function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,a=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),o=i(1),r=c(o),s=i(2),u=i(3),l=c(i(4));function c(e){return e&&e.__esModule?e:{default:e}}var d=(0,u.autobind)(n=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.state={isImageViewerActive:!1,imgUrl:"",imgWidth:0,imgHeight:0,marginLeft:"auto",marginTop:"auto"},i.data={imgWidth:0,imgHeight:0,minScaleWidth:0,maxScaleWidth:0,isScaling:!1,isMouseMoving:!1},i.bg=null,i.closeBtn=null,i.image=null,i.imageViewer=null,i}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.PureComponent),a(t,[{key:"componentDidMount",value:function(){}},{key:"show",value:function(e,t){var i=this;e&&(!l.default.os.phone||!l.default.os.weixin||e.indexOf("data:image")>=0&&!l.default.os.ios?(this.setState({imgWidth:0,imgHeight:0}),this.initScaleLimit(),this.setState({isImageViewerActive:!0,imgUrl:e}),setTimeout(function(){i.initImageSizeIfComplete(),i.initImageEvts()},0)):"undefined"!=typeof wx&&wx.previewImage({current:e,urls:t||[]}))}},{key:"close",value:function(){this.handleCloseImageViewer()}},{key:"handleCloseImageViewer",value:function(e){this.setState({isImageViewerActive:!1})}},{key:"initScaleLimit",value:function(){var e=this.imageViewer.offsetWidth||document.getElementById("app").offsetWidth;this.data.minScaleWidth=e/5,this.data.maxScaleWidth=3*e}},{key:"initImageSizeIfComplete",value:function(){this.state.isImageViewerActive&&((0,s.findDOMNode)(this.image).complete&&this.initImageSize())}},{key:"initImageSize",value:function(){var e=this.image,t=e.width,i=e.height,n=t*window.dpr,a=window.dpr;this.data.imgWidth=t,this.data.imgHeight=i;var o=this.imageViewer.offsetWidth-60*window.dpr;n>o&&(n=o),a=i*n/t,this.setState({imgWidth:n,imgHeight:a,marginLeft:n/2,marginTop:a/2})}},{key:"handleImageLoad",value:function(e){this.initImageSize()}},{key:"updateImageSize",value:function(e){e<this.data.minScaleWidth&&(e=this.data.minScaleWidth),e>this.data.maxScaleWidth&&(e=this.data.maxScaleWidth);var t=this.data.imgHeight*e/this.data.imgWidth;this.setState({imgWidth:e,imgHeight:t,marginLeft:e/2,marginTop:t/2})}},{key:"updateImageMargin",value:function(e,t){this.setState({marginLeft:e,marginTop:t})}},{key:"initImageEvts",value:function(){var e=this;this.bindMouseScrollEvts(),this.bindScaleEvts(),setTimeout(function(){e.bindMouseMoveEvts()},0)}},{key:"bindScaleEvts",value:function(){var e=this,t=void 0,i=void 0,n=void 0;this.data.isScaling=!1;var a=function(e){var t=e.touches[0].pageX-e.touches[1].pageX,i=e.touches[0].pageY-e.touches[1].pageY;return Math.sqrt(t*t+i*i)};this.bindEvt(this.imageViewer,"touchstart",function(o){e.state.isImageViewerActive&&(1===o.touches.length&&function(e){e.stopPropagation(),t=Date.now(),i=e.target}(o),2===o.touches.length&&function(t){n=a(t),e.data.isScaling=!0}(o))}),this.bindEvt(this.imageViewer,"touchend",function(a){a.preventDefault(),a.stopPropagation(),Date.now()-t<200&&(e.bg===i||e.closeBtn===i)&&e.handleCloseImageViewer(),e.data.isScaling=!1,n=0}),this.bindEvt(this.imageViewer,"touchmove",function(t){if(e.data.isScaling){var i=a(t),o=i-n,r=e.state.imgWidth+o;e.updateImageSize(r),n=i}})}},{key:"bindMouseScrollEvts",value:function(){var e=this,t=function(t){if(t.preventDefault(),t.stopPropagation(),e.state.isImageViewerActive){var i=t.wheelDelta&&(t.wheelDelta>0?1:-1)||t.originalEvent&&t.originalEvent.detail&&(t.originalEvent.detail>0?-1:1),n=void 0;i>0?n=e.state.imgWidth+50:i<0&&(n=e.state.imgWidth-50),e.updateImageSize(n)}};this.bindEvt(this.imageViewer,"mousewheel",t),this.bindEvt(this.imageViewer,"DOMMouseScroll",t)}},{key:"bindMouseMoveEvts",value:function(){var e=this,t=void 0,i=void 0,n=function(n){t=n.clientX||n.touches[0].clientX,i=n.clientY||n.touches[0].clientY,e.data.isMouseMoving=!0,e.data.mousemovingStartMarginLeft=e.state.marginLeft,e.data.mousemovingStartMarginTop=e.state.marginTop},a=function(n){if(e.data.isMouseMoving){n.preventDefault();var a=n.clientX||n.touches[0].clientX,o=n.clientY||n.touches[0].clientY;e.updateImageMargin(e.data.mousemovingStartMarginLeft-(a-t),e.data.mousemovingStartMarginTop-(o-i))}},o=function(t){e.data.isMouseMoving=!1};this.image&&(this.bindEvt(this.image,"mousedown",n),this.bindEvt(this.imageViewer,"mousemove",a),this.bindEvt(this.imageViewer,"mouseup",o),this.bindEvt(this.image,"touchstart",n),this.bindEvt(this.imageViewer,"touchmove",a),this.bindEvt(this.imageViewer,"touchend",o))}},{key:"bindEvt",value:function(e,t,i){e&&i&&t&&(e.removeEventListener(t,i,!1),e.addEventListener(t,i,!1))}},{key:"render",value:function(){var e=this;return r.default.createElement("div",{ref:function(t){return e.imageViewer=t},className:"co-image-viewer "+(this.state.isImageViewerActive?"":"hidden")},this.state.isImageViewerActive?r.default.createElement("div",null,r.default.createElement("div",{ref:function(t){return e.bg=t},className:"bg",onClick:this.handleCloseImageViewer}),r.default.createElement("div",{ref:function(t){return e.closeBtn=t},className:"icon_cross close-btn",onClick:this.handleCloseImageViewer}),r.default.createElement("img",{ref:function(t){return e.image=t},src:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"?x-oss-process=image/resize,m_fill,limit_0,h_64,w_64",i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"/64";return/(img\.qlchat\.com)/.test(e)?e=e.replace(/@.*/,"")+t:/(wx\.qlogo\.cn\/mmopen)/.test(e)&&(e=e.replace(/(\/(0|132|64|96)$)/,i)),e}(this.state.imgUrl,""),style:{width:this.state.imgWidth?this.state.imgWidth+"px":"auto",height:this.state.imgHeight?this.state.imgHeight+"px":"auto",marginLeft:"auto"===this.state.marginLeft?"auto":"-"+this.state.marginLeft+"px",marginTop:"auto"===this.state.marginTop?"auto":"-"+this.state.marginTop+"px"},onLoad:this.handleImageLoad})):null)}}]),t}())||n;d.propTypes={},t.default=d},function(e,t){e.exports=__webpack_require__(/*! react */ "../node_modules/react/index.js")},function(e,t){e.exports=__webpack_require__(/*! react-dom */ "../node_modules/react-dom/index.js")},function(e,t){e.exports=__webpack_require__(/*! core-decorators */ "../node_modules/core-decorators/es/core-decorators.js")},function(e,t){e.exports=__webpack_require__(/*! @ql-feat/detect */ "../node_modules/@ql-feat/detect/public/detect.js")}])});

/***/ }),

/***/ "../node_modules/@ql-feat/scroll-to-load/dist/index.js":
/*!*************************************************************!*\
  !*** ../node_modules/@ql-feat/scroll-to-load/dist/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){if(true)module.exports=t();else { var o, n; }}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(1),r=u(i),l=u(n(2)),s=u(n(3)),a=u(n(4)),c=u(n(5)),d=u(n(11));function u(e){return e&&e.__esModule?e:{default:e}}var p=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={loading:!1,noMore:e.noMore},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.Component),o(t,[{key:"componentWillReceiveProps",value:function(e){this.setState({noMore:e.noMore})}},{key:"onScroll",value:function(e){var t=this;if(!this.props.disable){var n=this.props,o=n.toBottomHeight,i=(n.className,n.loadNext),r=void 0===i?function(){}:i,l=(e||window.event).target,s=l.scrollHeight,a=l.scrollTop,c=l.clientHeight,d=s-a-c,u=3,p=this.scrollContainer.getBoundingClientRect();this.props.scrollToDo&&this.props.scrollToDo(e,a,c,s,p),this.state.loading||this.state.noMore||this.props.noneOne||Array.prototype.join.call(l.classList,",").indexOf("co-scroll-to-load")<0||(o&&(u=o),d<u&&(this.setState({loading:!0}),r(function(){t.setState({loading:!1})})))}}},{key:"disableScroll",value:function(e){this.props.disableScroll&&e.preventDefault(),this.props.onTouchMove&&this.props.onTouchMove(e)}},{key:"getBoundingClientRect",value:function(){return this.scrollContainer.getBoundingClientRect()}},{key:"render",value:function(){var e=this;return r.default.createElement("div",{id:this.props.id||"",className:(0,s.default)(c.default["co-scroll-to-load"],"co-scroll-to-load",this.props.className),onScroll:this.onScroll.bind(this),onTouchMove:this.disableScroll.bind(this),onWheel:this.disableScroll.bind(this),ref:function(t){return e.scrollContainer=t}},r.default.createElement("main",null,this.props.children),!this.props.disable&&this.state.loading&&r.default.createElement("div",{className:c.default["list-loading"]+" list-loading"},"拼命加载中.",r.default.createElement("div",{className:c.default["dynamic-ellipsis"]},"..")),!this.props.disable&&this.state.noMore&&!this.props.notShowLoaded&&r.default.createElement("div",{className:c.default["list-nomore"]+" list-nomore"},"没有更多了"),!this.props.disable&&this.state.noMore&&!this.props.notShowLoaded&&null!==this.props.bottomText&&r.default.createElement("div",{className:c.default["list-nomore"]+" list-nomore"},this.props.bottomText),!this.props.disable&&this.props.noneOne&&!this.props.notShowLoaded&&r.default.createElement("div",{className:c.default["list-nomore"]+" list-nomore"},r.default.createElement(a.default,{show:!0,emptyPic:this.props.emptyPic||"",emptyPicIndex:this.props.emptyPicIndex||0,emptyMessage:this.props.emptyMessage||"",hideNoMorePic:this.props.hideNoMorePic,className:"scroll-page-empty"})),!(!this.props.disable&&this.state.loading)&&!(!this.props.disable&&this.state.noMore&&!this.props.notShowLoaded)&&this.props.footer&&r.default.createElement("div",{className:c.default["need-space"]}),this.props.footer&&this.props.footer)}},{key:"scrollHeight",get:function(){return this.scrollContainer.scrollHeight}},{key:"scrollTop",get:function(){return this.scrollContainer.scrollTop},set:function(e){this.scrollContainer.scrollTop=e}}]),t}();p.propTypes={disable:l.default.bool,loadNext:l.default.func,toBottomHeight:l.default.number,noMore:l.default.bool,page:l.default.number,noneOne:l.default.bool,emptyPic:l.default.string,emptyPicIndex:l.default.number,emptyMessage:l.default.string,hideNoMorePic:l.default.bool,className:l.default.string,notShowLoaded:l.default.bool,scrollToDo:l.default.func,disableScroll:l.default.bool,bottomText:l.default.string},p.defaultProps={disable:!1,disableScroll:!1,bottomText:null},t.default=(0,d.default)(c.default)(p)},function(e,t){e.exports=__webpack_require__(/*! react */ "../node_modules/react/index.js")},function(e,t){e.exports=__webpack_require__(/*! prop-types */ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/index.js")},function(e,t){e.exports=__webpack_require__(/*! classnames */ "../node_modules/@ql-feat/scroll-to-load/node_modules/classnames/index.js")},function(e,t){e.exports=__webpack_require__(/*! @ql-feat/empty */ "../node_modules/@ql-feat/empty/dist/index.js")},function(e,t,n){var o=n(6),i=n(8);"string"==typeof o&&(o=[[e.i,o,""]]),e.exports=o.locals||{},e.exports._getContent=function(){return o},e.exports._getCss=function(){return o.toString()},e.exports._insertCss=function(e){return i(o,e)}},function(e,t,n){(t=e.exports=n(7)(!1)).push([e.i,'.co-scroll-to-load--8dxniql3h4f {\n  position: absolute;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  width: 100%;\n  top: 0;\n  bottom: 0;\n  -webkit-overflow-scrolling: touch;\n  padding-bottom: 1.6rem;\n}\n\n.co-scroll-to-load--8dxniql3h4f .list-loading--w8fl4pap0cf,\n.co-scroll-to-load--8dxniql3h4f .list-nomore--6rbwe4r2wap {\n  padding: 0.4rem 0.2rem;\n  text-align: center;\n  color: #999999;\n}\n\n[data-dpr="1"] .co-scroll-to-load--8dxniql3h4f .list-loading--w8fl4pap0cf,\n[data-dpr="1"] .co-scroll-to-load--8dxniql3h4f .list-nomore--6rbwe4r2wap {\n  font-size: 12px;\n}\n\n[data-dpr="2"] .co-scroll-to-load--8dxniql3h4f .list-loading--w8fl4pap0cf,\n[data-dpr="2"] .co-scroll-to-load--8dxniql3h4f .list-nomore--6rbwe4r2wap {\n  font-size: 24px;\n}\n\n[data-dpr="3"] .co-scroll-to-load--8dxniql3h4f .list-loading--w8fl4pap0cf,\n[data-dpr="3"] .co-scroll-to-load--8dxniql3h4f .list-nomore--6rbwe4r2wap {\n  font-size: 36px;\n}\n\n.co-scroll-to-load--8dxniql3h4f .list-loading--w8fl4pap0cf {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: flex;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n     -moz-box-pack: center;\n          justify-content: center;\n}\n\n.co-scroll-to-load--8dxniql3h4f .list-loading--w8fl4pap0cf .dynamic-ellipsis--v5z1suyze68 {\n  position: relative;\n}\n\n.co-scroll-to-load--8dxniql3h4f .list-loading--w8fl4pap0cf .dynamic-ellipsis--v5z1suyze68:after {\n  position: absolute;\n  right: 0;\n  top: 0;\n  height: 100%;\n  width: 100%;\n  background: #fff;\n  content: \'\';\n  display: block;\n  -webkit-animation: dynamic-ellipsis--v5z1suyze68 1s infinite linear;\n     -moz-animation: dynamic-ellipsis--v5z1suyze68 1s infinite linear;\n          animation: dynamic-ellipsis--v5z1suyze68 1s infinite linear;\n}\n\n@-webkit-keyframes dynamic-ellipsis--v5z1suyze68 {\n  0% {\n    width: 100%;\n  }\n\n  1% {\n    width: 50%;\n  }\n\n  33% {\n    width: 50%;\n  }\n\n  34% {\n    width: 0;\n  }\n\n  66% {\n    width: 0;\n  }\n\n  67% {\n    width: 100%;\n  }\n\n  100% {\n    width: 100%;\n  }\n}\n\n@-moz-keyframes dynamic-ellipsis--v5z1suyze68 {\n  0% {\n    width: 100%;\n  }\n\n  1% {\n    width: 50%;\n  }\n\n  33% {\n    width: 50%;\n  }\n\n  34% {\n    width: 0;\n  }\n\n  66% {\n    width: 0;\n  }\n\n  67% {\n    width: 100%;\n  }\n\n  100% {\n    width: 100%;\n  }\n}\n\n@keyframes dynamic-ellipsis--v5z1suyze68 {\n  0% {\n    width: 100%;\n  }\n\n  1% {\n    width: 50%;\n  }\n\n  33% {\n    width: 50%;\n  }\n\n  34% {\n    width: 0;\n  }\n\n  66% {\n    width: 0;\n  }\n\n  67% {\n    width: 100%;\n  }\n\n  100% {\n    width: 100%;\n  }\n}\n\n.co-scroll-to-load--8dxniql3h4f .need-space--dt99y91p07t {\n  height: 0.666667rem;\n}',""]),t.locals={"co-scroll-to-load":"co-scroll-to-load--8dxniql3h4f","list-loading":"list-loading--w8fl4pap0cf","list-nomore":"list-nomore--6rbwe4r2wap","dynamic-ellipsis":"dynamic-ellipsis--v5z1suyze68","need-space":"need-space--dt99y91p07t"}},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n=function(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var i=function(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}(o),r=o.sources.map(function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"});return[n].concat(r).concat([i]).join("\n")}return[n].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+n+"}":n}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},i=0;i<this.length;i++){var r=this[i][0];"number"==typeof r&&(o[r]=!0)}for(i=0;i<e.length;i++){var l=e[i];"number"==typeof l[0]&&o[l[0]]||(n&&!l[2]?l[2]=n:n&&(l[2]="("+l[2]+") and ("+n+")"),t.push(l))}},t}},function(e,t,n){"use strict";var o=r(n(9)),i=r(n(10));function r(e){return e&&e.__esModule?e:{default:e}}var l="s",s={};function a(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,t){return String.fromCharCode("0x"+t)}))}e.exports=function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.replace,r=void 0!==n&&n,c=t.prepend,d=void 0!==c&&c,u=[],p=0;p<e.length;p++){var f=(0,i.default)(e[p],4),h=f[0],m=f[1],y=f[2],b=f[3],g=h+"-"+p;if(u.push(g),!s[g]||r){s[g]=1;var v=document.getElementById(l+g),w=!1;v||(w=!0,(v=document.createElement("style")).setAttribute("type","text/css"),v.id=l+g,y&&v.setAttribute("media",y));var x=m;b&&"function"==typeof btoa&&(x+="\n/*# sourceMappingURL=data:application/json;base64,"+a((0,o.default)(b))+"*/",x+="\n/*# sourceURL="+b.file+"?"+g+"*/"),"textContent"in v?v.textContent=x:v.styleSheet.cssText=x,w&&(d?document.head.insertBefore(v,document.head.childNodes[0]):document.head.appendChild(v))}else s[g]++}return function(e){e.forEach(function(e){if(--s[e]<=0){var t=document.getElementById(l+e);t&&t.parentNode.removeChild(t)}})}.bind(null,u)}},function(e,t){e.exports=__webpack_require__(/*! babel-runtime/core-js/json/stringify */ "../node_modules/babel-runtime/core-js/json/stringify.js")},function(e,t){e.exports=__webpack_require__(/*! babel-runtime/helpers/slicedToArray */ "../node_modules/babel-runtime/helpers/slicedToArray.js")},function(e,t){e.exports=__webpack_require__(/*! isomorphic-style-loader/lib/withStyles */ "../node_modules/isomorphic-style-loader/lib/withStyles.js")}])});

/***/ }),

/***/ "../node_modules/@ql-feat/scroll-to-load/node_modules/classnames/index.js":
/*!********************************************************************************!*\
  !*** ../node_modules/@ql-feat/scroll-to-load/node_modules/classnames/index.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/checkPropTypes.js":
/*!*****************************************************************************************!*\
  !*** ../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/checkPropTypes.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/factoryWithTypeCheckers.js":
/*!**************************************************************************************************!*\
  !*** ../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "../node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "../node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/lib/ReactPropTypesSecret.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/checkPropTypes.js");

var has = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : undefined;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/index.js":
/*!********************************************************************************!*\
  !*** ../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/index.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "../node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!***************************************************************************************************!*\
  !*** ../node_modules/@ql-feat/scroll-to-load/node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "../node_modules/@ql-feat/toast/dist/index.js":
/*!****************************************************!*\
  !*** ../node_modules/@ql-feat/toast/dist/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,n){if(true)module.exports=n();else { var o, t; }}("undefined"!=typeof self?self:this,function(){return function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),r=t(1),i=f(r),a=f(t(2)),u=f(t(3)),s=f(t(12));function f(e){return e&&e.__esModule?e:{default:e}}var c=function(e){function n(){return function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,n),function(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}(n,r.Component),o(n,[{key:"render",value:function(){var e=this.props,n=e.content,t=e.className,o=e.isOpen,r=e.type,a="";return"del"===r?a=u.default.del:"unlike"===r&&(a=u.default.unlike),i.default.createElement("div",{className:u.default.toast+(o?"":" "+u.default.hide)+" "+(t||"")},i.default.createElement("div",{className:u.default.bd+" "+(r?u.default.big:"")},i.default.createElement("div",{className:a}),i.default.createElement("p",{className:u.default.cnt},n)))}}]),n}();c.propTypes={isOpen:a.default.bool,content:a.default.string.isRequired,callback:a.default.func},c.defaultProps={isOpen:!1,content:"",className:"",type:""},n.default=(0,s.default)(u.default)(c)},function(e,n){e.exports=__webpack_require__(/*! react */ "../node_modules/react/index.js")},function(e,n){e.exports=__webpack_require__(/*! prop-types */ "../node_modules/@ql-feat/toast/node_modules/prop-types/index.js")},function(e,n,t){var o=t(4),r=t(9);"string"==typeof o&&(o=[[e.i,o,""]]),e.exports=o.locals||{},e.exports._getContent=function(){return o},e.exports._getCss=function(){return o.toString()},e.exports._insertCss=function(e){return r(o,e)}},function(e,n,t){var o=t(5);(n=e.exports=t(6)(!1)).push([e.i,".toast--w4tm25hiwjs {\n  position: fixed;\n  z-index: 9999;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n     -moz-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  background: transparent;\n  pointer-events: none;\n}\n\n.toast--w4tm25hiwjs.hide--ms4t5aqbagh {\n  display: none;\n}\n\n.del--7w9fvfc4q95 {\n  width: 0.866667rem;\n  height: 1.133333rem;\n  background: url("+o(t(7))+");\n  -webkit-background-size: 100% 100%;\n          background-size: 100%;\n  background-repeat: no-repeat;\n  margin: auto;\n}\n\n.unlike--pjquuhgiq3 {\n  width: 1.133333rem;\n  height: 1.066667rem;\n  background: url("+o(t(8))+');\n  -webkit-background-size: 100% 100%;\n          background-size: 100%;\n  background-repeat: no-repeat;\n  margin: auto;\n}\n\n.bd--q64uhsid4yg {\n  line-height: 1.5;\n  -webkit-box-sizing: border-box;\n     -moz-box-sizing: border-box;\n          box-sizing: border-box;\n  padding: .266667rem;\n  -webkit-transition: opacity .6s linear;\n  -moz-transition: opacity .6s linear;\n  transition: opacity .6s linear;\n  text-align: center;\n  opacity: 1;\n  color: #fff;\n  -webkit-border-radius: .066667rem;\n          border-radius: .066667rem;\n  background-color: rgba(0, 0, 0, 0.8);\n}\n\n.bd--q64uhsid4yg.big--wmfyn4x9f5o {\n  width: 2.666667rem;\n  height: 2.666667rem;\n  padding-top: 0.4rem;\n}\n\n.bd--q64uhsid4yg.big--wmfyn4x9f5o .cnt--fp5fuwozu89 {\n  position: absolute;\n  bottom: 0.266667rem;\n  left: 0;\n  right: 0;\n  margin: auto;\n}\n\n.bd--q64uhsid4yg.is-closing--ijovzdna6r {\n  opacity: 0;\n}\n\n.cnt--fp5fuwozu89 {\n  text-align: center;\n}\n\n[data-dpr="1"] .cnt--fp5fuwozu89 {\n  font-size: 14px;\n}\n\n[data-dpr="2"] .cnt--fp5fuwozu89 {\n  font-size: 28px;\n}\n\n[data-dpr="3"] .cnt--fp5fuwozu89 {\n  font-size: 42px;\n}',""]),n.locals={toast:"toast--w4tm25hiwjs",hide:"hide--ms4t5aqbagh",del:"del--7w9fvfc4q95",unlike:"unlike--pjquuhgiq3",bd:"bd--q64uhsid4yg",big:"big--wmfyn4x9f5o",cnt:"cnt--fp5fuwozu89","is-closing":"is-closing--ijovzdna6r"}},function(e,n){e.exports=function(e){return"string"!=typeof e?e:(/^['"].*['"]$/.test(e)&&(e=e.slice(1,-1)),/["'() \t\n]/.test(e)?'"'+e.replace(/"/g,'\\"').replace(/\n/g,"\\n")+'"':e)}},function(e,n){e.exports=function(e){var n=[];return n.toString=function(){return this.map(function(n){var t=function(e,n){var t=e[1]||"",o=e[3];if(!o)return t;if(n&&"function"==typeof btoa){var r=function(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}(o),i=o.sources.map(function(e){return"/*# sourceURL="+o.sourceRoot+e+" */"});return[t].concat(i).concat([r]).join("\n")}return[t].join("\n")}(n,e);return n[2]?"@media "+n[2]+"{"+t+"}":t}).join("")},n.i=function(e,t){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},r=0;r<this.length;r++){var i=this[r][0];"number"==typeof i&&(o[i]=!0)}for(r=0;r<e.length;r++){var a=e[r];"number"==typeof a[0]&&o[a[0]]||(t&&!a[2]?a[2]=t:t&&(a[2]="("+a[2]+") and ("+t+")"),n.push(a))}},n}},function(e,n){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABVCAMAAAAhbnn6AAAAYFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////98JRy6AAAAH3RSTlMAEDwg8RwK+t2VYgPQxaiNF+KsN/Pty8C8s31bRy0ofADdfgAAARZJREFUWMPt2MlugzAUheHjEk+YMITM033/t6xrFKmJHHnatJH/FTqSvxUsMH7VKopLtfDWUnx+YkoQJh8gKCXhEViSwN4KDQvVBASGUOwzBX7arZYopdXS7sSxprLWoNKgCgGFeSoCphkwvHk0f8U1N4+4Qe0PNfZqwyM2vlH96N2ORLTHcwf3vj/lvp/Dy7a32xGeb1q4TQQ35jafwN5vVahCFapQhSpUoQpVqEIV/pFgpJ3ky9+B20ykAG0nDd8WK5h2aA28W1gI5xd4lsAXYUu2a5ZwJdt2uQPps4R+uQM500+XDODiTp7BpXvQN5bWTbtzkgMDlTQAEF0B0AnYxi4fGOESOhPQAo/uQycpLdkNd3f2G/F07dCTDiblAAAAAElFTkSuQmCC"},function(e,n){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABQCAMAAABf5snbAAAAilBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2N2iNAAAALXRSTlMA6y3xN5dZ9Qn6qzQeD97OxbwVavxeSUTIh3snGe5w5NWwnoyAYjwGs6GgTCU4FCTNAAACoklEQVRYw7WW6XbiMAyF5QLOvhMgECgtW7e8/+vNQSZ4ggzDHKn3T3JylS+2ItkGl6LNZ668rgtUFi7n/o3rz5dhpoKu81T+uYngKc2+Rt1A3of2LVJ/eEN79DX7F9Kv0s6hdVOiXTZrl51W/iPoQXV35O198PfePVsd7jJXi+6B0k36yF6s3ND6OpJptquPcZnEkW6KgACCotFRnJTxsd5l0+tsahd00ttZVQ5SrYsBs9CDJJZV1jsTwjyFFyufO1KDJip0THSe9+bpxrm8pzQ4ddyivT26ba0uWOf0i/ZuyZ0jJncLqC0cSajJM6qoom1Ex1XbJz/m7zfAUWMq4Qd6LexIGTKjXQznXwBXxd858F/x77dsaouV8Gp+aYWf0MCXRlKF9ykWP0gI2yHFzsAPzEWolvWOvQ8ywjXhHQDWNhd8VbjGA7zg0lcKUUtcGF9gY0uXKdtQG5PWnRh1ZxKbk2Lll2wO2FiRGDXC9gLc/GMxaoxHBMC6TcSoCfJ+iYoFVopRSyx/UKZspYRNpUznfotRv82q8na+LMWoyzPuDfbmIiUc5B5mWGAnIegJy38GSWCuMsIxBsllZwyFqGG/Wx8QH8v0K078AACJR44YvIOGl1xvpy8SLTC1A4wDqa07t8nEwYp0wnJwXEsUfmPGrSqcs0qGJxlvzIKOPaTo2/P7aMyBjsgZvk0tlgVN20H5WiwLetNMK3XBcqBqRSq4xzKgtpMINvpvaESgBEtNquffozYfSgP4UBrCgfKxNJ6PpdF8LIllhtJIISyN42NpFB9LY/hYGsHHUl8GS10+lnp8LHX4WPqci+VDKYAFpdi1RfChdPekO7EUlkL5WAKVwRKoCFYTKBuLolA+lkL5WHkoYuWhiEWosKJtt43gSf0BxEO6C3W/NakAAAAASUVORK5CYII="},function(e,n,t){"use strict";var o=i(t(10)),r=i(t(11));function i(e){return e&&e.__esModule?e:{default:e}}var a="s",u={};function s(e){return btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,function(e,n){return String.fromCharCode("0x"+n)}))}e.exports=function(e){for(var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=n.replace,i=void 0!==t&&t,f=n.prepend,c=void 0!==f&&f,l=[],p=0;p<e.length;p++){var d=(0,r.default)(e[p],4),g=d[0],b=d[1],y=d[2],A=d[3],h=g+"-"+p;if(l.push(h),!u[h]||i){u[h]=1;var m=document.getElementById(a+h),x=!1;m||(x=!0,(m=document.createElement("style")).setAttribute("type","text/css"),m.id=a+h,y&&m.setAttribute("media",y));var v=b;A&&"function"==typeof btoa&&(v+="\n/*# sourceMappingURL=data:application/json;base64,"+s((0,o.default)(A))+"*/",v+="\n/*# sourceURL="+A.file+"?"+h+"*/"),"textContent"in m?m.textContent=v:m.styleSheet.cssText=v,x&&(c?document.head.insertBefore(m,document.head.childNodes[0]):document.head.appendChild(m))}else u[h]++}return function(e){e.forEach(function(e){if(--u[e]<=0){var n=document.getElementById(a+e);n&&n.parentNode.removeChild(n)}})}.bind(null,l)}},function(e,n){e.exports=__webpack_require__(/*! babel-runtime/core-js/json/stringify */ "../node_modules/babel-runtime/core-js/json/stringify.js")},function(e,n){e.exports=__webpack_require__(/*! babel-runtime/helpers/slicedToArray */ "../node_modules/babel-runtime/helpers/slicedToArray.js")},function(e,n){e.exports=__webpack_require__(/*! isomorphic-style-loader/lib/withStyles */ "../node_modules/isomorphic-style-loader/lib/withStyles.js")}])});

/***/ }),

/***/ "../node_modules/@ql-feat/toast/node_modules/prop-types/checkPropTypes.js":
/*!********************************************************************************!*\
  !*** ../node_modules/@ql-feat/toast/node_modules/prop-types/checkPropTypes.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/@ql-feat/toast/node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          )

        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "../node_modules/@ql-feat/toast/node_modules/prop-types/factoryWithTypeCheckers.js":
/*!*****************************************************************************************!*\
  !*** ../node_modules/@ql-feat/toast/node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var assign = __webpack_require__(/*! object-assign */ "../node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/@ql-feat/toast/node_modules/prop-types/lib/ReactPropTypesSecret.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "../node_modules/@ql-feat/toast/node_modules/prop-types/checkPropTypes.js");

var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
       true ? printWarning('Invalid argument supplied to oneOf, expected an instance of array.') : undefined;
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : undefined;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "../node_modules/@ql-feat/toast/node_modules/prop-types/index.js":
/*!***********************************************************************!*\
  !*** ../node_modules/@ql-feat/toast/node_modules/prop-types/index.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "../node_modules/@ql-feat/toast/node_modules/prop-types/factoryWithTypeCheckers.js")(isValidElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "../node_modules/@ql-feat/toast/node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!******************************************************************************************!*\
  !*** ../node_modules/@ql-feat/toast/node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "../node_modules/babel-runtime/core-js/get-iterator.js":
/*!*************************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/get-iterator.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/get-iterator */ "../node_modules/core-js/library/fn/get-iterator.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/core-js/is-iterable.js":
/*!************************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/is-iterable.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/is-iterable */ "../node_modules/core-js/library/fn/is-iterable.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/core-js/json/stringify.js":
/*!***************************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/json/stringify.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/json/stringify */ "../node_modules/core-js/library/fn/json/stringify.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/core-js/object/create.js":
/*!**************************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/object/create.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/create */ "../node_modules/core-js/library/fn/object/create.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/core-js/object/define-property.js":
/*!***********************************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/object/define-property.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ "../node_modules/core-js/library/fn/object/define-property.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/core-js/object/get-prototype-of.js":
/*!************************************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/object/get-prototype-of.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/get-prototype-of */ "../node_modules/core-js/library/fn/object/get-prototype-of.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/core-js/object/set-prototype-of.js":
/*!************************************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/object/set-prototype-of.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/set-prototype-of */ "../node_modules/core-js/library/fn/object/set-prototype-of.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/core-js/symbol.js":
/*!*******************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/symbol.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ "../node_modules/core-js/library/fn/symbol/index.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/core-js/symbol/iterator.js":
/*!****************************************************************!*\
  !*** ../node_modules/babel-runtime/core-js/symbol/iterator.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ "../node_modules/core-js/library/fn/symbol/iterator.js"), __esModule: true };

/***/ }),

/***/ "../node_modules/babel-runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ../node_modules/babel-runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),

/***/ "../node_modules/babel-runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ../node_modules/babel-runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(/*! ../core-js/object/define-property */ "../node_modules/babel-runtime/core-js/object/define-property.js");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),

/***/ "../node_modules/babel-runtime/helpers/inherits.js":
/*!*********************************************************!*\
  !*** ../node_modules/babel-runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(/*! ../core-js/object/set-prototype-of */ "../node_modules/babel-runtime/core-js/object/set-prototype-of.js");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(/*! ../core-js/object/create */ "../node_modules/babel-runtime/core-js/object/create.js");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ "../node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),

/***/ "../node_modules/babel-runtime/helpers/possibleConstructorReturn.js":
/*!**************************************************************************!*\
  !*** ../node_modules/babel-runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(/*! ../helpers/typeof */ "../node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),

/***/ "../node_modules/babel-runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ../node_modules/babel-runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(/*! ../core-js/is-iterable */ "../node_modules/babel-runtime/core-js/is-iterable.js");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(/*! ../core-js/get-iterator */ "../node_modules/babel-runtime/core-js/get-iterator.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/***/ }),

/***/ "../node_modules/babel-runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ../node_modules/babel-runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ "../node_modules/babel-runtime/core-js/symbol/iterator.js");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(/*! ../core-js/symbol */ "../node_modules/babel-runtime/core-js/symbol.js");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),

/***/ "../node_modules/classnames/index.js":
/*!*******************************************!*\
  !*** ../node_modules/classnames/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "../node_modules/core-js/library/fn/get-iterator.js":
/*!**********************************************************!*\
  !*** ../node_modules/core-js/library/fn/get-iterator.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../modules/web.dom.iterable */ "../node_modules/core-js/library/modules/web.dom.iterable.js");
__webpack_require__(/*! ../modules/es6.string.iterator */ "../node_modules/core-js/library/modules/es6.string.iterator.js");
module.exports = __webpack_require__(/*! ../modules/core.get-iterator */ "../node_modules/core-js/library/modules/core.get-iterator.js");


/***/ }),

/***/ "../node_modules/core-js/library/fn/is-iterable.js":
/*!*********************************************************!*\
  !*** ../node_modules/core-js/library/fn/is-iterable.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../modules/web.dom.iterable */ "../node_modules/core-js/library/modules/web.dom.iterable.js");
__webpack_require__(/*! ../modules/es6.string.iterator */ "../node_modules/core-js/library/modules/es6.string.iterator.js");
module.exports = __webpack_require__(/*! ../modules/core.is-iterable */ "../node_modules/core-js/library/modules/core.is-iterable.js");


/***/ }),

/***/ "../node_modules/core-js/library/fn/json/stringify.js":
/*!************************************************************!*\
  !*** ../node_modules/core-js/library/fn/json/stringify.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(/*! ../../modules/_core */ "../node_modules/core-js/library/modules/_core.js");
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),

/***/ "../node_modules/core-js/library/fn/object/create.js":
/*!***********************************************************!*\
  !*** ../node_modules/core-js/library/fn/object/create.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.create */ "../node_modules/core-js/library/modules/es6.object.create.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "../node_modules/core-js/library/modules/_core.js").Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),

/***/ "../node_modules/core-js/library/fn/object/define-property.js":
/*!********************************************************************!*\
  !*** ../node_modules/core-js/library/fn/object/define-property.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.define-property */ "../node_modules/core-js/library/modules/es6.object.define-property.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "../node_modules/core-js/library/modules/_core.js").Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ "../node_modules/core-js/library/fn/object/get-prototype-of.js":
/*!*********************************************************************!*\
  !*** ../node_modules/core-js/library/fn/object/get-prototype-of.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.get-prototype-of */ "../node_modules/core-js/library/modules/es6.object.get-prototype-of.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "../node_modules/core-js/library/modules/_core.js").Object.getPrototypeOf;


/***/ }),

/***/ "../node_modules/core-js/library/fn/object/set-prototype-of.js":
/*!*********************************************************************!*\
  !*** ../node_modules/core-js/library/fn/object/set-prototype-of.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.set-prototype-of */ "../node_modules/core-js/library/modules/es6.object.set-prototype-of.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "../node_modules/core-js/library/modules/_core.js").Object.setPrototypeOf;


/***/ }),

/***/ "../node_modules/core-js/library/fn/symbol/index.js":
/*!**********************************************************!*\
  !*** ../node_modules/core-js/library/fn/symbol/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.symbol */ "../node_modules/core-js/library/modules/es6.symbol.js");
__webpack_require__(/*! ../../modules/es6.object.to-string */ "../node_modules/core-js/library/modules/es6.object.to-string.js");
__webpack_require__(/*! ../../modules/es7.symbol.async-iterator */ "../node_modules/core-js/library/modules/es7.symbol.async-iterator.js");
__webpack_require__(/*! ../../modules/es7.symbol.observable */ "../node_modules/core-js/library/modules/es7.symbol.observable.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "../node_modules/core-js/library/modules/_core.js").Symbol;


/***/ }),

/***/ "../node_modules/core-js/library/fn/symbol/iterator.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/fn/symbol/iterator.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.string.iterator */ "../node_modules/core-js/library/modules/es6.string.iterator.js");
__webpack_require__(/*! ../../modules/web.dom.iterable */ "../node_modules/core-js/library/modules/web.dom.iterable.js");
module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ "../node_modules/core-js/library/modules/_wks-ext.js").f('iterator');


/***/ }),

/***/ "../node_modules/core-js/library/modules/_a-function.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_a-function.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_add-to-unscopables.js":
/*!**********************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_add-to-unscopables.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),

/***/ "../node_modules/core-js/library/modules/_an-object.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_an-object.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "../node_modules/core-js/library/modules/_is-object.js");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_array-includes.js":
/*!******************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_array-includes.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ "../node_modules/core-js/library/modules/_to-iobject.js");
var toLength = __webpack_require__(/*! ./_to-length */ "../node_modules/core-js/library/modules/_to-length.js");
var toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ "../node_modules/core-js/library/modules/_to-absolute-index.js");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_classof.js":
/*!***********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_classof.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(/*! ./_cof */ "../node_modules/core-js/library/modules/_cof.js");
var TAG = __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_cof.js":
/*!*******************************************************!*\
  !*** ../node_modules/core-js/library/modules/_cof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_core.js":
/*!********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_core.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "../node_modules/core-js/library/modules/_ctx.js":
/*!*******************************************************!*\
  !*** ../node_modules/core-js/library/modules/_ctx.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "../node_modules/core-js/library/modules/_a-function.js");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_defined.js":
/*!***********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_defined.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_descriptors.js":
/*!***************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_descriptors.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "../node_modules/core-js/library/modules/_fails.js")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "../node_modules/core-js/library/modules/_dom-create.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_dom-create.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "../node_modules/core-js/library/modules/_is-object.js");
var document = __webpack_require__(/*! ./_global */ "../node_modules/core-js/library/modules/_global.js").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_enum-bug-keys.js":
/*!*****************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_enum-bug-keys.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "../node_modules/core-js/library/modules/_enum-keys.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_enum-keys.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(/*! ./_object-keys */ "../node_modules/core-js/library/modules/_object-keys.js");
var gOPS = __webpack_require__(/*! ./_object-gops */ "../node_modules/core-js/library/modules/_object-gops.js");
var pIE = __webpack_require__(/*! ./_object-pie */ "../node_modules/core-js/library/modules/_object-pie.js");
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_export.js":
/*!**********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_export.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "../node_modules/core-js/library/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "../node_modules/core-js/library/modules/_core.js");
var ctx = __webpack_require__(/*! ./_ctx */ "../node_modules/core-js/library/modules/_ctx.js");
var hide = __webpack_require__(/*! ./_hide */ "../node_modules/core-js/library/modules/_hide.js");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "../node_modules/core-js/library/modules/_fails.js":
/*!*********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_fails.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_global.js":
/*!**********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_global.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "../node_modules/core-js/library/modules/_has.js":
/*!*******************************************************!*\
  !*** ../node_modules/core-js/library/modules/_has.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_hide.js":
/*!********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_hide.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "../node_modules/core-js/library/modules/_object-dp.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "../node_modules/core-js/library/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "../node_modules/core-js/library/modules/_descriptors.js") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_html.js":
/*!********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_html.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(/*! ./_global */ "../node_modules/core-js/library/modules/_global.js").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "../node_modules/core-js/library/modules/_ie8-dom-define.js":
/*!******************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_ie8-dom-define.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ "../node_modules/core-js/library/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "../node_modules/core-js/library/modules/_fails.js")(function () {
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "../node_modules/core-js/library/modules/_dom-create.js")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "../node_modules/core-js/library/modules/_iobject.js":
/*!***********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_iobject.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ "../node_modules/core-js/library/modules/_cof.js");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_is-array.js":
/*!************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_is-array.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(/*! ./_cof */ "../node_modules/core-js/library/modules/_cof.js");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_is-object.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_is-object.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_iter-create.js":
/*!***************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_iter-create.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(/*! ./_object-create */ "../node_modules/core-js/library/modules/_object-create.js");
var descriptor = __webpack_require__(/*! ./_property-desc */ "../node_modules/core-js/library/modules/_property-desc.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "../node_modules/core-js/library/modules/_set-to-string-tag.js");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ "../node_modules/core-js/library/modules/_hide.js")(IteratorPrototype, __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_iter-define.js":
/*!***************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_iter-define.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(/*! ./_library */ "../node_modules/core-js/library/modules/_library.js");
var $export = __webpack_require__(/*! ./_export */ "../node_modules/core-js/library/modules/_export.js");
var redefine = __webpack_require__(/*! ./_redefine */ "../node_modules/core-js/library/modules/_redefine.js");
var hide = __webpack_require__(/*! ./_hide */ "../node_modules/core-js/library/modules/_hide.js");
var has = __webpack_require__(/*! ./_has */ "../node_modules/core-js/library/modules/_has.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "../node_modules/core-js/library/modules/_iterators.js");
var $iterCreate = __webpack_require__(/*! ./_iter-create */ "../node_modules/core-js/library/modules/_iter-create.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "../node_modules/core-js/library/modules/_set-to-string-tag.js");
var getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "../node_modules/core-js/library/modules/_object-gpo.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_iter-step.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_iter-step.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_iterators.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_iterators.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_library.js":
/*!***********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_library.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),

/***/ "../node_modules/core-js/library/modules/_meta.js":
/*!********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_meta.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(/*! ./_uid */ "../node_modules/core-js/library/modules/_uid.js")('meta');
var isObject = __webpack_require__(/*! ./_is-object */ "../node_modules/core-js/library/modules/_is-object.js");
var has = __webpack_require__(/*! ./_has */ "../node_modules/core-js/library/modules/_has.js");
var setDesc = __webpack_require__(/*! ./_object-dp */ "../node_modules/core-js/library/modules/_object-dp.js").f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(/*! ./_fails */ "../node_modules/core-js/library/modules/_fails.js")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-create.js":
/*!*****************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-create.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(/*! ./_an-object */ "../node_modules/core-js/library/modules/_an-object.js");
var dPs = __webpack_require__(/*! ./_object-dps */ "../node_modules/core-js/library/modules/_object-dps.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "../node_modules/core-js/library/modules/_enum-bug-keys.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "../node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ "../node_modules/core-js/library/modules/_dom-create.js")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(/*! ./_html */ "../node_modules/core-js/library/modules/_html.js").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-dp.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-dp.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "../node_modules/core-js/library/modules/_an-object.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "../node_modules/core-js/library/modules/_ie8-dom-define.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "../node_modules/core-js/library/modules/_to-primitive.js");
var dP = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "../node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-dps.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-dps.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "../node_modules/core-js/library/modules/_object-dp.js");
var anObject = __webpack_require__(/*! ./_an-object */ "../node_modules/core-js/library/modules/_an-object.js");
var getKeys = __webpack_require__(/*! ./_object-keys */ "../node_modules/core-js/library/modules/_object-keys.js");

module.exports = __webpack_require__(/*! ./_descriptors */ "../node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-gopd.js":
/*!***************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-gopd.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(/*! ./_object-pie */ "../node_modules/core-js/library/modules/_object-pie.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "../node_modules/core-js/library/modules/_property-desc.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "../node_modules/core-js/library/modules/_to-iobject.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "../node_modules/core-js/library/modules/_to-primitive.js");
var has = __webpack_require__(/*! ./_has */ "../node_modules/core-js/library/modules/_has.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "../node_modules/core-js/library/modules/_ie8-dom-define.js");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(/*! ./_descriptors */ "../node_modules/core-js/library/modules/_descriptors.js") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-gopn-ext.js":
/*!*******************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-gopn-ext.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(/*! ./_to-iobject */ "../node_modules/core-js/library/modules/_to-iobject.js");
var gOPN = __webpack_require__(/*! ./_object-gopn */ "../node_modules/core-js/library/modules/_object-gopn.js").f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-gopn.js":
/*!***************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-gopn.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "../node_modules/core-js/library/modules/_object-keys-internal.js");
var hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ "../node_modules/core-js/library/modules/_enum-bug-keys.js").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-gops.js":
/*!***************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-gops.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-gpo.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-gpo.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(/*! ./_has */ "../node_modules/core-js/library/modules/_has.js");
var toObject = __webpack_require__(/*! ./_to-object */ "../node_modules/core-js/library/modules/_to-object.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "../node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-keys-internal.js":
/*!************************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-keys-internal.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! ./_has */ "../node_modules/core-js/library/modules/_has.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "../node_modules/core-js/library/modules/_to-iobject.js");
var arrayIndexOf = __webpack_require__(/*! ./_array-includes */ "../node_modules/core-js/library/modules/_array-includes.js")(false);
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "../node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-keys.js":
/*!***************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-keys.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "../node_modules/core-js/library/modules/_object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "../node_modules/core-js/library/modules/_enum-bug-keys.js");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-pie.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-pie.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "../node_modules/core-js/library/modules/_object-sap.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_object-sap.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(/*! ./_export */ "../node_modules/core-js/library/modules/_export.js");
var core = __webpack_require__(/*! ./_core */ "../node_modules/core-js/library/modules/_core.js");
var fails = __webpack_require__(/*! ./_fails */ "../node_modules/core-js/library/modules/_fails.js");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_property-desc.js":
/*!*****************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_property-desc.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_redefine.js":
/*!************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_redefine.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_hide */ "../node_modules/core-js/library/modules/_hide.js");


/***/ }),

/***/ "../node_modules/core-js/library/modules/_set-proto.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_set-proto.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(/*! ./_is-object */ "../node_modules/core-js/library/modules/_is-object.js");
var anObject = __webpack_require__(/*! ./_an-object */ "../node_modules/core-js/library/modules/_an-object.js");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(/*! ./_ctx */ "../node_modules/core-js/library/modules/_ctx.js")(Function.call, __webpack_require__(/*! ./_object-gopd */ "../node_modules/core-js/library/modules/_object-gopd.js").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_set-to-string-tag.js":
/*!*********************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_set-to-string-tag.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(/*! ./_object-dp */ "../node_modules/core-js/library/modules/_object-dp.js").f;
var has = __webpack_require__(/*! ./_has */ "../node_modules/core-js/library/modules/_has.js");
var TAG = __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_shared-key.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_shared-key.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ "../node_modules/core-js/library/modules/_shared.js")('keys');
var uid = __webpack_require__(/*! ./_uid */ "../node_modules/core-js/library/modules/_uid.js");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_shared.js":
/*!**********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_shared.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "../node_modules/core-js/library/modules/_global.js");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_string-at.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_string-at.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "../node_modules/core-js/library/modules/_to-integer.js");
var defined = __webpack_require__(/*! ./_defined */ "../node_modules/core-js/library/modules/_defined.js");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_to-absolute-index.js":
/*!*********************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_to-absolute-index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "../node_modules/core-js/library/modules/_to-integer.js");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_to-integer.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_to-integer.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_to-iobject.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_to-iobject.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ "../node_modules/core-js/library/modules/_iobject.js");
var defined = __webpack_require__(/*! ./_defined */ "../node_modules/core-js/library/modules/_defined.js");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_to-length.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_to-length.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "../node_modules/core-js/library/modules/_to-integer.js");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_to-object.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_to-object.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "../node_modules/core-js/library/modules/_defined.js");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_to-primitive.js":
/*!****************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_to-primitive.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "../node_modules/core-js/library/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_uid.js":
/*!*******************************************************!*\
  !*** ../node_modules/core-js/library/modules/_uid.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_wks-define.js":
/*!**************************************************************!*\
  !*** ../node_modules/core-js/library/modules/_wks-define.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "../node_modules/core-js/library/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "../node_modules/core-js/library/modules/_core.js");
var LIBRARY = __webpack_require__(/*! ./_library */ "../node_modules/core-js/library/modules/_library.js");
var wksExt = __webpack_require__(/*! ./_wks-ext */ "../node_modules/core-js/library/modules/_wks-ext.js");
var defineProperty = __webpack_require__(/*! ./_object-dp */ "../node_modules/core-js/library/modules/_object-dp.js").f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/_wks-ext.js":
/*!***********************************************************!*\
  !*** ../node_modules/core-js/library/modules/_wks-ext.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js");


/***/ }),

/***/ "../node_modules/core-js/library/modules/_wks.js":
/*!*******************************************************!*\
  !*** ../node_modules/core-js/library/modules/_wks.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(/*! ./_shared */ "../node_modules/core-js/library/modules/_shared.js")('wks');
var uid = __webpack_require__(/*! ./_uid */ "../node_modules/core-js/library/modules/_uid.js");
var Symbol = __webpack_require__(/*! ./_global */ "../node_modules/core-js/library/modules/_global.js").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "../node_modules/core-js/library/modules/core.get-iterator-method.js":
/*!***************************************************************************!*\
  !*** ../node_modules/core-js/library/modules/core.get-iterator-method.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ./_classof */ "../node_modules/core-js/library/modules/_classof.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js")('iterator');
var Iterators = __webpack_require__(/*! ./_iterators */ "../node_modules/core-js/library/modules/_iterators.js");
module.exports = __webpack_require__(/*! ./_core */ "../node_modules/core-js/library/modules/_core.js").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/core.get-iterator.js":
/*!********************************************************************!*\
  !*** ../node_modules/core-js/library/modules/core.get-iterator.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "../node_modules/core-js/library/modules/_an-object.js");
var get = __webpack_require__(/*! ./core.get-iterator-method */ "../node_modules/core-js/library/modules/core.get-iterator-method.js");
module.exports = __webpack_require__(/*! ./_core */ "../node_modules/core-js/library/modules/_core.js").getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/core.is-iterable.js":
/*!*******************************************************************!*\
  !*** ../node_modules/core-js/library/modules/core.is-iterable.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ./_classof */ "../node_modules/core-js/library/modules/_classof.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js")('iterator');
var Iterators = __webpack_require__(/*! ./_iterators */ "../node_modules/core-js/library/modules/_iterators.js");
module.exports = __webpack_require__(/*! ./_core */ "../node_modules/core-js/library/modules/_core.js").isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};


/***/ }),

/***/ "../node_modules/core-js/library/modules/es6.array.iterator.js":
/*!*********************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es6.array.iterator.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ "../node_modules/core-js/library/modules/_add-to-unscopables.js");
var step = __webpack_require__(/*! ./_iter-step */ "../node_modules/core-js/library/modules/_iter-step.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "../node_modules/core-js/library/modules/_iterators.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "../node_modules/core-js/library/modules/_to-iobject.js");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ "../node_modules/core-js/library/modules/_iter-define.js")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "../node_modules/core-js/library/modules/es6.object.create.js":
/*!********************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es6.object.create.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "../node_modules/core-js/library/modules/_export.js");
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(/*! ./_object-create */ "../node_modules/core-js/library/modules/_object-create.js") });


/***/ }),

/***/ "../node_modules/core-js/library/modules/es6.object.define-property.js":
/*!*****************************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es6.object.define-property.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "../node_modules/core-js/library/modules/_export.js");
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ "../node_modules/core-js/library/modules/_descriptors.js"), 'Object', { defineProperty: __webpack_require__(/*! ./_object-dp */ "../node_modules/core-js/library/modules/_object-dp.js").f });


/***/ }),

/***/ "../node_modules/core-js/library/modules/es6.object.get-prototype-of.js":
/*!******************************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es6.object.get-prototype-of.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(/*! ./_to-object */ "../node_modules/core-js/library/modules/_to-object.js");
var $getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "../node_modules/core-js/library/modules/_object-gpo.js");

__webpack_require__(/*! ./_object-sap */ "../node_modules/core-js/library/modules/_object-sap.js")('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),

/***/ "../node_modules/core-js/library/modules/es6.object.set-prototype-of.js":
/*!******************************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es6.object.set-prototype-of.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(/*! ./_export */ "../node_modules/core-js/library/modules/_export.js");
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(/*! ./_set-proto */ "../node_modules/core-js/library/modules/_set-proto.js").set });


/***/ }),

/***/ "../node_modules/core-js/library/modules/es6.object.to-string.js":
/*!***********************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es6.object.to-string.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "../node_modules/core-js/library/modules/es6.string.iterator.js":
/*!**********************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es6.string.iterator.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(/*! ./_string-at */ "../node_modules/core-js/library/modules/_string-at.js")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ "../node_modules/core-js/library/modules/_iter-define.js")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "../node_modules/core-js/library/modules/es6.symbol.js":
/*!*************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es6.symbol.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(/*! ./_global */ "../node_modules/core-js/library/modules/_global.js");
var has = __webpack_require__(/*! ./_has */ "../node_modules/core-js/library/modules/_has.js");
var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ "../node_modules/core-js/library/modules/_descriptors.js");
var $export = __webpack_require__(/*! ./_export */ "../node_modules/core-js/library/modules/_export.js");
var redefine = __webpack_require__(/*! ./_redefine */ "../node_modules/core-js/library/modules/_redefine.js");
var META = __webpack_require__(/*! ./_meta */ "../node_modules/core-js/library/modules/_meta.js").KEY;
var $fails = __webpack_require__(/*! ./_fails */ "../node_modules/core-js/library/modules/_fails.js");
var shared = __webpack_require__(/*! ./_shared */ "../node_modules/core-js/library/modules/_shared.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "../node_modules/core-js/library/modules/_set-to-string-tag.js");
var uid = __webpack_require__(/*! ./_uid */ "../node_modules/core-js/library/modules/_uid.js");
var wks = __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js");
var wksExt = __webpack_require__(/*! ./_wks-ext */ "../node_modules/core-js/library/modules/_wks-ext.js");
var wksDefine = __webpack_require__(/*! ./_wks-define */ "../node_modules/core-js/library/modules/_wks-define.js");
var enumKeys = __webpack_require__(/*! ./_enum-keys */ "../node_modules/core-js/library/modules/_enum-keys.js");
var isArray = __webpack_require__(/*! ./_is-array */ "../node_modules/core-js/library/modules/_is-array.js");
var anObject = __webpack_require__(/*! ./_an-object */ "../node_modules/core-js/library/modules/_an-object.js");
var isObject = __webpack_require__(/*! ./_is-object */ "../node_modules/core-js/library/modules/_is-object.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "../node_modules/core-js/library/modules/_to-iobject.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "../node_modules/core-js/library/modules/_to-primitive.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "../node_modules/core-js/library/modules/_property-desc.js");
var _create = __webpack_require__(/*! ./_object-create */ "../node_modules/core-js/library/modules/_object-create.js");
var gOPNExt = __webpack_require__(/*! ./_object-gopn-ext */ "../node_modules/core-js/library/modules/_object-gopn-ext.js");
var $GOPD = __webpack_require__(/*! ./_object-gopd */ "../node_modules/core-js/library/modules/_object-gopd.js");
var $DP = __webpack_require__(/*! ./_object-dp */ "../node_modules/core-js/library/modules/_object-dp.js");
var $keys = __webpack_require__(/*! ./_object-keys */ "../node_modules/core-js/library/modules/_object-keys.js");
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(/*! ./_object-gopn */ "../node_modules/core-js/library/modules/_object-gopn.js").f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(/*! ./_object-pie */ "../node_modules/core-js/library/modules/_object-pie.js").f = $propertyIsEnumerable;
  __webpack_require__(/*! ./_object-gops */ "../node_modules/core-js/library/modules/_object-gops.js").f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(/*! ./_library */ "../node_modules/core-js/library/modules/_library.js")) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ "../node_modules/core-js/library/modules/_hide.js")($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ "../node_modules/core-js/library/modules/es7.symbol.async-iterator.js":
/*!****************************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es7.symbol.async-iterator.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ "../node_modules/core-js/library/modules/_wks-define.js")('asyncIterator');


/***/ }),

/***/ "../node_modules/core-js/library/modules/es7.symbol.observable.js":
/*!************************************************************************!*\
  !*** ../node_modules/core-js/library/modules/es7.symbol.observable.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./_wks-define */ "../node_modules/core-js/library/modules/_wks-define.js")('observable');


/***/ }),

/***/ "../node_modules/core-js/library/modules/web.dom.iterable.js":
/*!*******************************************************************!*\
  !*** ../node_modules/core-js/library/modules/web.dom.iterable.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./es6.array.iterator */ "../node_modules/core-js/library/modules/es6.array.iterator.js");
var global = __webpack_require__(/*! ./_global */ "../node_modules/core-js/library/modules/_global.js");
var hide = __webpack_require__(/*! ./_hide */ "../node_modules/core-js/library/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "../node_modules/core-js/library/modules/_iterators.js");
var TO_STRING_TAG = __webpack_require__(/*! ./_wks */ "../node_modules/core-js/library/modules/_wks.js")('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),

/***/ "../node_modules/fastclick/lib/fastclick.js":
/*!**************************************************!*\
  !*** ../node_modules/fastclick/lib/fastclick.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (true) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return FastClick;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "../node_modules/history/lib/index.js":
/*!********************************************!*\
  !*** ../node_modules/history/lib/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.locationsAreEqual = exports.Actions = exports.useQueries = exports.useBeforeUnload = exports.useBasename = exports.createMemoryHistory = exports.createHashHistory = exports.createHistory = undefined;

var _LocationUtils = __webpack_require__(/*! ./LocationUtils */ "../node_modules/history/lib/LocationUtils.js");

Object.defineProperty(exports, 'locationsAreEqual', {
  enumerable: true,
  get: function get() {
    return _LocationUtils.locationsAreEqual;
  }
});

var _createBrowserHistory = __webpack_require__(/*! ./createBrowserHistory */ "../node_modules/history/lib/createBrowserHistory.js");

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createHashHistory2 = __webpack_require__(/*! ./createHashHistory */ "../node_modules/history/lib/createHashHistory.js");

var _createHashHistory3 = _interopRequireDefault(_createHashHistory2);

var _createMemoryHistory2 = __webpack_require__(/*! ./createMemoryHistory */ "../node_modules/history/lib/createMemoryHistory.js");

var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

var _useBasename2 = __webpack_require__(/*! ./useBasename */ "../node_modules/history/lib/useBasename.js");

var _useBasename3 = _interopRequireDefault(_useBasename2);

var _useBeforeUnload2 = __webpack_require__(/*! ./useBeforeUnload */ "../node_modules/history/lib/useBeforeUnload.js");

var _useBeforeUnload3 = _interopRequireDefault(_useBeforeUnload2);

var _useQueries2 = __webpack_require__(/*! ./useQueries */ "../node_modules/history/lib/useQueries.js");

var _useQueries3 = _interopRequireDefault(_useQueries2);

var _Actions2 = __webpack_require__(/*! ./Actions */ "../node_modules/history/lib/Actions.js");

var _Actions = _interopRequireWildcard(_Actions2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createHistory = _createBrowserHistory2.default;
exports.createHashHistory = _createHashHistory3.default;
exports.createMemoryHistory = _createMemoryHistory3.default;
exports.useBasename = _useBasename3.default;
exports.useBeforeUnload = _useBeforeUnload3.default;
exports.useQueries = _useQueries3.default;
exports.Actions = _Actions;

/***/ }),

/***/ "../node_modules/history/lib/useBeforeUnload.js":
/*!******************************************************!*\
  !*** ../node_modules/history/lib/useBeforeUnload.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = __webpack_require__(/*! invariant */ "../node_modules/invariant/browser.js");

var _invariant2 = _interopRequireDefault(_invariant);

var _DOMUtils = __webpack_require__(/*! ./DOMUtils */ "../node_modules/history/lib/DOMUtils.js");

var _ExecutionEnvironment = __webpack_require__(/*! ./ExecutionEnvironment */ "../node_modules/history/lib/ExecutionEnvironment.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startListener = function startListener(getPromptMessage) {
  var handleBeforeUnload = function handleBeforeUnload(event) {
    var message = getPromptMessage();

    if (typeof message === 'string') {
      (event || window.event).returnValue = message;
      return message;
    }

    return undefined;
  };

  (0, _DOMUtils.addEventListener)(window, 'beforeunload', handleBeforeUnload);

  return function () {
    return (0, _DOMUtils.removeEventListener)(window, 'beforeunload', handleBeforeUnload);
  };
};

/**
 * Returns a new createHistory function that can be used to create
 * history objects that know how to use the beforeunload event in web
 * browsers to cancel navigation.
 */
var useBeforeUnload = function useBeforeUnload(createHistory) {
  !_ExecutionEnvironment.canUseDOM ?  true ? (0, _invariant2.default)(false, 'useBeforeUnload only works in DOM environments') : undefined : void 0;

  return function (options) {
    var history = createHistory(options);

    var listeners = [];
    var stopListener = void 0;

    var getPromptMessage = function getPromptMessage() {
      var message = void 0;
      for (var i = 0, len = listeners.length; message == null && i < len; ++i) {
        message = listeners[i].call();
      }return message;
    };

    var listenBeforeUnload = function listenBeforeUnload(listener) {
      if (listeners.push(listener) === 1) stopListener = startListener(getPromptMessage);

      return function () {
        listeners = listeners.filter(function (item) {
          return item !== listener;
        });

        if (listeners.length === 0 && stopListener) {
          stopListener();
          stopListener = null;
        }
      };
    };

    return _extends({}, history, {
      listenBeforeUnload: listenBeforeUnload
    });
  };
};

exports.default = useBeforeUnload;

/***/ }),

/***/ "../node_modules/intersection-observer/intersection-observer.js":
/*!**********************************************************************!*\
  !*** ../node_modules/intersection-observer/intersection-observer.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
(function() {
'use strict';

// Exit early if we're not running in a browser.
if (typeof window !== 'object') {
  return;
}

// Exit early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

  // Minimal polyfill for Edge 15's lack of `isIntersecting`
  // See: https://github.com/w3c/IntersectionObserver/issues/211
  if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
    Object.defineProperty(window.IntersectionObserverEntry.prototype,
      'isIntersecting', {
      get: function () {
        return this.intersectionRatio > 0;
      }
    });
  }
  return;
}


/**
 * A local reference to the document.
 */
var document = window.document;


/**
 * An IntersectionObserver registry. This registry exists to hold a strong
 * reference to IntersectionObserver instances currently observing a target
 * element. Without this registry, instances without another reference may be
 * garbage collected.
 */
var registry = [];


/**
 * Creates the global IntersectionObserverEntry constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
 * @param {Object} entry A dictionary of instance properties.
 * @constructor
 */
function IntersectionObserverEntry(entry) {
  this.time = entry.time;
  this.target = entry.target;
  this.rootBounds = entry.rootBounds;
  this.boundingClientRect = entry.boundingClientRect;
  this.intersectionRect = entry.intersectionRect || getEmptyRect();
  this.isIntersecting = !!entry.intersectionRect;

  // Calculates the intersection ratio.
  var targetRect = this.boundingClientRect;
  var targetArea = targetRect.width * targetRect.height;
  var intersectionRect = this.intersectionRect;
  var intersectionArea = intersectionRect.width * intersectionRect.height;

  // Sets intersection ratio.
  if (targetArea) {
    // Round the intersection ratio to avoid floating point math issues:
    // https://github.com/w3c/IntersectionObserver/issues/324
    this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
  } else {
    // If area is zero and is intersecting, sets to 1, otherwise to 0
    this.intersectionRatio = this.isIntersecting ? 1 : 0;
  }
}


/**
 * Creates the global IntersectionObserver constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
 * @param {Function} callback The function to be invoked after intersection
 *     changes have queued. The function is not invoked if the queue has
 *     been emptied by calling the `takeRecords` method.
 * @param {Object=} opt_options Optional configuration options.
 * @constructor
 */
function IntersectionObserver(callback, opt_options) {

  var options = opt_options || {};

  if (typeof callback != 'function') {
    throw new Error('callback must be a function');
  }

  if (options.root && options.root.nodeType != 1) {
    throw new Error('root must be an Element');
  }

  // Binds and throttles `this._checkForIntersections`.
  this._checkForIntersections = throttle(
      this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

  // Private properties.
  this._callback = callback;
  this._observationTargets = [];
  this._queuedEntries = [];
  this._rootMarginValues = this._parseRootMargin(options.rootMargin);

  // Public properties.
  this.thresholds = this._initThresholds(options.threshold);
  this.root = options.root || null;
  this.rootMargin = this._rootMarginValues.map(function(margin) {
    return margin.value + margin.unit;
  }).join(' ');
}


/**
 * The minimum interval within which the document will be checked for
 * intersection changes.
 */
IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


/**
 * The frequency in which the polyfill polls for intersection changes.
 * this can be updated on a per instance basis and must be set prior to
 * calling `observe` on the first target.
 */
IntersectionObserver.prototype.POLL_INTERVAL = null;

/**
 * Use a mutation observer on the root element
 * to detect intersection changes.
 */
IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


/**
 * Starts observing a target element for intersection changes based on
 * the thresholds values.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.observe = function(target) {
  var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
    return item.element == target;
  });

  if (isTargetAlreadyObserved) {
    return;
  }

  if (!(target && target.nodeType == 1)) {
    throw new Error('target must be an Element');
  }

  this._registerInstance();
  this._observationTargets.push({element: target, entry: null});
  this._monitorIntersections();
  this._checkForIntersections();
};


/**
 * Stops observing a target element for intersection changes.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.unobserve = function(target) {
  this._observationTargets =
      this._observationTargets.filter(function(item) {

    return item.element != target;
  });
  if (!this._observationTargets.length) {
    this._unmonitorIntersections();
    this._unregisterInstance();
  }
};


/**
 * Stops observing all target elements for intersection changes.
 */
IntersectionObserver.prototype.disconnect = function() {
  this._observationTargets = [];
  this._unmonitorIntersections();
  this._unregisterInstance();
};


/**
 * Returns any queue entries that have not yet been reported to the
 * callback and clears the queue. This can be used in conjunction with the
 * callback to obtain the absolute most up-to-date intersection information.
 * @return {Array} The currently queued entries.
 */
IntersectionObserver.prototype.takeRecords = function() {
  var records = this._queuedEntries.slice();
  this._queuedEntries = [];
  return records;
};


/**
 * Accepts the threshold value from the user configuration object and
 * returns a sorted array of unique threshold values. If a value is not
 * between 0 and 1 and error is thrown.
 * @private
 * @param {Array|number=} opt_threshold An optional threshold value or
 *     a list of threshold values, defaulting to [0].
 * @return {Array} A sorted list of unique and valid threshold values.
 */
IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
  var threshold = opt_threshold || [0];
  if (!Array.isArray(threshold)) threshold = [threshold];

  return threshold.sort().filter(function(t, i, a) {
    if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
      throw new Error('threshold must be a number between 0 and 1 inclusively');
    }
    return t !== a[i - 1];
  });
};


/**
 * Accepts the rootMargin value from the user configuration object
 * and returns an array of the four margin values as an object containing
 * the value and unit properties. If any of the values are not properly
 * formatted or use a unit other than px or %, and error is thrown.
 * @private
 * @param {string=} opt_rootMargin An optional rootMargin value,
 *     defaulting to '0px'.
 * @return {Array<Object>} An array of margin objects with the keys
 *     value and unit.
 */
IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
  var marginString = opt_rootMargin || '0px';
  var margins = marginString.split(/\s+/).map(function(margin) {
    var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
    if (!parts) {
      throw new Error('rootMargin must be specified in pixels or percent');
    }
    return {value: parseFloat(parts[1]), unit: parts[2]};
  });

  // Handles shorthand.
  margins[1] = margins[1] || margins[0];
  margins[2] = margins[2] || margins[0];
  margins[3] = margins[3] || margins[1];

  return margins;
};


/**
 * Starts polling for intersection changes if the polling is not already
 * happening, and if the page's visibility state is visible.
 * @private
 */
IntersectionObserver.prototype._monitorIntersections = function() {
  if (!this._monitoringIntersections) {
    this._monitoringIntersections = true;

    // If a poll interval is set, use polling instead of listening to
    // resize and scroll events or DOM mutations.
    if (this.POLL_INTERVAL) {
      this._monitoringInterval = setInterval(
          this._checkForIntersections, this.POLL_INTERVAL);
    }
    else {
      addEvent(window, 'resize', this._checkForIntersections, true);
      addEvent(document, 'scroll', this._checkForIntersections, true);

      if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in window) {
        this._domObserver = new MutationObserver(this._checkForIntersections);
        this._domObserver.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @private
 */
IntersectionObserver.prototype._unmonitorIntersections = function() {
  if (this._monitoringIntersections) {
    this._monitoringIntersections = false;

    clearInterval(this._monitoringInterval);
    this._monitoringInterval = null;

    removeEvent(window, 'resize', this._checkForIntersections, true);
    removeEvent(document, 'scroll', this._checkForIntersections, true);

    if (this._domObserver) {
      this._domObserver.disconnect();
      this._domObserver = null;
    }
  }
};


/**
 * Scans each observation target for intersection changes and adds them
 * to the internal entries queue. If new entries are found, it
 * schedules the callback to be invoked.
 * @private
 */
IntersectionObserver.prototype._checkForIntersections = function() {
  var rootIsInDom = this._rootIsInDom();
  var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

  this._observationTargets.forEach(function(item) {
    var target = item.element;
    var targetRect = getBoundingClientRect(target);
    var rootContainsTarget = this._rootContainsTarget(target);
    var oldEntry = item.entry;
    var intersectionRect = rootIsInDom && rootContainsTarget &&
        this._computeTargetAndRootIntersection(target, rootRect);

    var newEntry = item.entry = new IntersectionObserverEntry({
      time: now(),
      target: target,
      boundingClientRect: targetRect,
      rootBounds: rootRect,
      intersectionRect: intersectionRect
    });

    if (!oldEntry) {
      this._queuedEntries.push(newEntry);
    } else if (rootIsInDom && rootContainsTarget) {
      // If the new entry intersection ratio has crossed any of the
      // thresholds, add a new entry.
      if (this._hasCrossedThreshold(oldEntry, newEntry)) {
        this._queuedEntries.push(newEntry);
      }
    } else {
      // If the root is not in the DOM or target is not contained within
      // root but the previous entry for this target had an intersection,
      // add a new record indicating removal.
      if (oldEntry && oldEntry.isIntersecting) {
        this._queuedEntries.push(newEntry);
      }
    }
  }, this);

  if (this._queuedEntries.length) {
    this._callback(this.takeRecords(), this);
  }
};


/**
 * Accepts a target and root rect computes the intersection between then
 * following the algorithm in the spec.
 * TODO(philipwalton): at this time clip-path is not considered.
 * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
 * @param {Element} target The target DOM element
 * @param {Object} rootRect The bounding rect of the root after being
 *     expanded by the rootMargin value.
 * @return {?Object} The final intersection rect object or undefined if no
 *     intersection is found.
 * @private
 */
IntersectionObserver.prototype._computeTargetAndRootIntersection =
    function(target, rootRect) {

  // If the element isn't displayed, an intersection can't happen.
  if (window.getComputedStyle(target).display == 'none') return;

  var targetRect = getBoundingClientRect(target);
  var intersectionRect = targetRect;
  var parent = getParentNode(target);
  var atRoot = false;

  while (!atRoot) {
    var parentRect = null;
    var parentComputedStyle = parent.nodeType == 1 ?
        window.getComputedStyle(parent) : {};

    // If the parent isn't displayed, an intersection can't happen.
    if (parentComputedStyle.display == 'none') return;

    if (parent == this.root || parent == document) {
      atRoot = true;
      parentRect = rootRect;
    } else {
      // If the element has a non-visible overflow, and it's not the <body>
      // or <html> element, update the intersection rect.
      // Note: <body> and <html> cannot be clipped to a rect that's not also
      // the document rect, so no need to compute a new intersection.
      if (parent != document.body &&
          parent != document.documentElement &&
          parentComputedStyle.overflow != 'visible') {
        parentRect = getBoundingClientRect(parent);
      }
    }

    // If either of the above conditionals set a new parentRect,
    // calculate new intersection data.
    if (parentRect) {
      intersectionRect = computeRectIntersection(parentRect, intersectionRect);

      if (!intersectionRect) break;
    }
    parent = getParentNode(parent);
  }
  return intersectionRect;
};


/**
 * Returns the root rect after being expanded by the rootMargin value.
 * @return {Object} The expanded root rect.
 * @private
 */
IntersectionObserver.prototype._getRootRect = function() {
  var rootRect;
  if (this.root) {
    rootRect = getBoundingClientRect(this.root);
  } else {
    // Use <html>/<body> instead of window since scroll bars affect size.
    var html = document.documentElement;
    var body = document.body;
    rootRect = {
      top: 0,
      left: 0,
      right: html.clientWidth || body.clientWidth,
      width: html.clientWidth || body.clientWidth,
      bottom: html.clientHeight || body.clientHeight,
      height: html.clientHeight || body.clientHeight
    };
  }
  return this._expandRectByRootMargin(rootRect);
};


/**
 * Accepts a rect and expands it by the rootMargin value.
 * @param {Object} rect The rect object to expand.
 * @return {Object} The expanded rect.
 * @private
 */
IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
  var margins = this._rootMarginValues.map(function(margin, i) {
    return margin.unit == 'px' ? margin.value :
        margin.value * (i % 2 ? rect.width : rect.height) / 100;
  });
  var newRect = {
    top: rect.top - margins[0],
    right: rect.right + margins[1],
    bottom: rect.bottom + margins[2],
    left: rect.left - margins[3]
  };
  newRect.width = newRect.right - newRect.left;
  newRect.height = newRect.bottom - newRect.top;

  return newRect;
};


/**
 * Accepts an old and new entry and returns true if at least one of the
 * threshold values has been crossed.
 * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
 *    particular target element or null if no previous entry exists.
 * @param {IntersectionObserverEntry} newEntry The current entry for a
 *    particular target element.
 * @return {boolean} Returns true if a any threshold has been crossed.
 * @private
 */
IntersectionObserver.prototype._hasCrossedThreshold =
    function(oldEntry, newEntry) {

  // To make comparing easier, an entry that has a ratio of 0
  // but does not actually intersect is given a value of -1
  var oldRatio = oldEntry && oldEntry.isIntersecting ?
      oldEntry.intersectionRatio || 0 : -1;
  var newRatio = newEntry.isIntersecting ?
      newEntry.intersectionRatio || 0 : -1;

  // Ignore unchanged ratios
  if (oldRatio === newRatio) return;

  for (var i = 0; i < this.thresholds.length; i++) {
    var threshold = this.thresholds[i];

    // Return true if an entry matches a threshold or if the new ratio
    // and the old ratio are on the opposite sides of a threshold.
    if (threshold == oldRatio || threshold == newRatio ||
        threshold < oldRatio !== threshold < newRatio) {
      return true;
    }
  }
};


/**
 * Returns whether or not the root element is an element and is in the DOM.
 * @return {boolean} True if the root element is an element and is in the DOM.
 * @private
 */
IntersectionObserver.prototype._rootIsInDom = function() {
  return !this.root || containsDeep(document, this.root);
};


/**
 * Returns whether or not the target element is a child of root.
 * @param {Element} target The target element to check.
 * @return {boolean} True if the target element is a child of root.
 * @private
 */
IntersectionObserver.prototype._rootContainsTarget = function(target) {
  return containsDeep(this.root || document, target);
};


/**
 * Adds the instance to the global IntersectionObserver registry if it isn't
 * already present.
 * @private
 */
IntersectionObserver.prototype._registerInstance = function() {
  if (registry.indexOf(this) < 0) {
    registry.push(this);
  }
};


/**
 * Removes the instance from the global IntersectionObserver registry.
 * @private
 */
IntersectionObserver.prototype._unregisterInstance = function() {
  var index = registry.indexOf(this);
  if (index != -1) registry.splice(index, 1);
};


/**
 * Returns the result of the performance.now() method or null in browsers
 * that don't support the API.
 * @return {number} The elapsed time since the page was requested.
 */
function now() {
  return window.performance && performance.now && performance.now();
}


/**
 * Throttles a function and delays its execution, so it's only called at most
 * once within a given time period.
 * @param {Function} fn The function to throttle.
 * @param {number} timeout The amount of time that must pass before the
 *     function can be called again.
 * @return {Function} The throttled function.
 */
function throttle(fn, timeout) {
  var timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(function() {
        fn();
        timer = null;
      }, timeout);
    }
  };
}


/**
 * Adds an event handler to a DOM node ensuring cross-browser compatibility.
 * @param {Node} node The DOM node to add the event handler to.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to add.
 * @param {boolean} opt_useCapture Optionally adds the even to the capture
 *     phase. Note: this only works in modern browsers.
 */
function addEvent(node, event, fn, opt_useCapture) {
  if (typeof node.addEventListener == 'function') {
    node.addEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.attachEvent == 'function') {
    node.attachEvent('on' + event, fn);
  }
}


/**
 * Removes a previously added event handler from a DOM node.
 * @param {Node} node The DOM node to remove the event handler from.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to remove.
 * @param {boolean} opt_useCapture If the event handler was added with this
 *     flag set to true, it should be set to true here in order to remove it.
 */
function removeEvent(node, event, fn, opt_useCapture) {
  if (typeof node.removeEventListener == 'function') {
    node.removeEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.detatchEvent == 'function') {
    node.detatchEvent('on' + event, fn);
  }
}


/**
 * Returns the intersection between two rect objects.
 * @param {Object} rect1 The first rect.
 * @param {Object} rect2 The second rect.
 * @return {?Object} The intersection rect or undefined if no intersection
 *     is found.
 */
function computeRectIntersection(rect1, rect2) {
  var top = Math.max(rect1.top, rect2.top);
  var bottom = Math.min(rect1.bottom, rect2.bottom);
  var left = Math.max(rect1.left, rect2.left);
  var right = Math.min(rect1.right, rect2.right);
  var width = right - left;
  var height = bottom - top;

  return (width >= 0 && height >= 0) && {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
    width: width,
    height: height
  };
}


/**
 * Shims the native getBoundingClientRect for compatibility with older IE.
 * @param {Element} el The element whose bounding rect to get.
 * @return {Object} The (possibly shimmed) rect of the element.
 */
function getBoundingClientRect(el) {
  var rect;

  try {
    rect = el.getBoundingClientRect();
  } catch (err) {
    // Ignore Windows 7 IE11 "Unspecified error"
    // https://github.com/w3c/IntersectionObserver/pull/205
  }

  if (!rect) return getEmptyRect();

  // Older IE
  if (!(rect.width && rect.height)) {
    rect = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };
  }
  return rect;
}


/**
 * Returns an empty rect object. An empty rect is returned when an element
 * is not in the DOM.
 * @return {Object} The empty rect.
 */
function getEmptyRect() {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0
  };
}

/**
 * Checks to see if a parent element contains a child element (including inside
 * shadow DOM).
 * @param {Node} parent The parent element.
 * @param {Node} child The child element.
 * @return {boolean} True if the parent node contains the child node.
 */
function containsDeep(parent, child) {
  var node = child;
  while (node) {
    if (node == parent) return true;

    node = getParentNode(node);
  }
  return false;
}


/**
 * Gets the parent node of an element or its host element if the parent node
 * is a shadow root.
 * @param {Node} node The node whose parent to get.
 * @return {Node|null} The parent node or null if no parent exists.
 */
function getParentNode(node) {
  var parent = node.parentNode;

  if (parent && parent.nodeType == 11 && parent.host) {
    // If the parent is a shadow root, return the host element.
    return parent.host;
  }

  if (parent && parent.assignedSlot) {
    // If the parent is distributed in a <slot>, return the parent of a slot.
    return parent.assignedSlot.parentNode;
  }

  return parent;
}


// Exposes the constructors globally.
window.IntersectionObserver = IntersectionObserver;
window.IntersectionObserverEntry = IntersectionObserverEntry;

}());


/***/ }),

/***/ "../node_modules/isomorphic-fetch/fetch-npm-browserify.js":
/*!****************************************************************!*\
  !*** ../node_modules/isomorphic-fetch/fetch-npm-browserify.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
__webpack_require__(/*! whatwg-fetch */ "../node_modules/whatwg-fetch/fetch.js");
module.exports = self.fetch.bind(self);


/***/ }),

/***/ "../node_modules/isomorphic-style-loader/lib/withStyles.js":
/*!*****************************************************************!*\
  !*** ../node_modules/isomorphic-style-loader/lib/withStyles.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ "../node_modules/babel-runtime/core-js/object/get-prototype-of.js");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "../node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "../node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "../node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(/*! react */ "../node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _hoistNonReactStatics = __webpack_require__(/*! hoist-non-react-statics */ "../node_modules/hoist-non-react-statics/index.js");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contextTypes = {
  insertCss: _propTypes2.default.func
}; /**
    * Isomorphic CSS style loader for Webpack
    *
    * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE.txt file in the root directory of this source tree.
    */

function withStyles() {
  for (var _len = arguments.length, styles = Array(_len), _key = 0; _key < _len; _key++) {
    styles[_key] = arguments[_key];
  }

  return function wrapWithStyles(ComposedComponent) {
    var WithStyles = function (_Component) {
      (0, _inherits3.default)(WithStyles, _Component);

      function WithStyles() {
        (0, _classCallCheck3.default)(this, WithStyles);
        return (0, _possibleConstructorReturn3.default)(this, (WithStyles.__proto__ || (0, _getPrototypeOf2.default)(WithStyles)).apply(this, arguments));
      }

      (0, _createClass3.default)(WithStyles, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _context;

          this.removeCss = (_context = this.context).insertCss.apply(_context, styles);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (this.removeCss) {
            setTimeout(this.removeCss, 0);
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(ComposedComponent, this.props);
        }
      }]);
      return WithStyles;
    }(_react.Component);

    var displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component';

    WithStyles.displayName = 'WithStyles(' + displayName + ')';
    WithStyles.contextTypes = contextTypes;
    WithStyles.ComposedComponent = ComposedComponent;

    return (0, _hoistNonReactStatics2.default)(WithStyles, ComposedComponent);
  };
}

exports.default = withStyles;

/***/ }),

/***/ "../node_modules/path-browserify/index.js":
/*!************************************************!*\
  !*** ../node_modules/path-browserify/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "../node_modules/process/browser.js")))

/***/ }),

/***/ "../node_modules/process/browser.js":
/*!******************************************!*\
  !*** ../node_modules/process/browser.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "../node_modules/qr.js/lib/8BitByte.js":
/*!*********************************************!*\
  !*** ../node_modules/qr.js/lib/8BitByte.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mode = __webpack_require__(/*! ./mode */ "../node_modules/qr.js/lib/mode.js");

function QR8bitByte(data) {
	this.mode = mode.MODE_8BIT_BYTE;
	this.data = data;
}

QR8bitByte.prototype = {

	getLength : function(buffer) {
		return this.data.length;
	},
	
	write : function(buffer) {
		for (var i = 0; i < this.data.length; i++) {
			// not JIS ...
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};

module.exports = QR8bitByte;



/***/ }),

/***/ "../node_modules/qr.js/lib/BitBuffer.js":
/*!**********************************************!*\
  !*** ../node_modules/qr.js/lib/BitBuffer.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function QRBitBuffer() {
	this.buffer = new Array();
	this.length = 0;
}

QRBitBuffer.prototype = {

	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},
	
	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},
	
	getLengthInBits : function() {
		return this.length;
	},
	
	putBit : function(bit) {
	
		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}
	
		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}
	
		this.length++;
	}
};

module.exports = QRBitBuffer;


/***/ }),

/***/ "../node_modules/qr.js/lib/ErrorCorrectLevel.js":
/*!******************************************************!*\
  !*** ../node_modules/qr.js/lib/ErrorCorrectLevel.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
	L : 1,
	M : 0,
	Q : 3,
	H : 2
};



/***/ }),

/***/ "../node_modules/qr.js/lib/Polynomial.js":
/*!***********************************************!*\
  !*** ../node_modules/qr.js/lib/Polynomial.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var math = __webpack_require__(/*! ./math */ "../node_modules/qr.js/lib/math.js");

function QRPolynomial(num, shift) {

	if (num.length == undefined) {
		throw new Error(num.length + "/" + shift);
	}

	var offset = 0;

	while (offset < num.length && num[offset] == 0) {
		offset++;
	}

	this.num = new Array(num.length - offset + shift);
	for (var i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}

QRPolynomial.prototype = {

	get : function(index) {
		return this.num[index];
	},
	
	getLength : function() {
		return this.num.length;
	},
	
	multiply : function(e) {
	
		var num = new Array(this.getLength() + e.getLength() - 1);
	
		for (var i = 0; i < this.getLength(); i++) {
			for (var j = 0; j < e.getLength(); j++) {
				num[i + j] ^= math.gexp(math.glog(this.get(i) ) + math.glog(e.get(j) ) );
			}
		}
	
		return new QRPolynomial(num, 0);
	},
	
	mod : function(e) {
	
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}
	
		var ratio = math.glog(this.get(0) ) - math.glog(e.get(0) );
	
		var num = new Array(this.getLength() );
		
		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}
		
		for (var i = 0; i < e.getLength(); i++) {
			num[i] ^= math.gexp(math.glog(e.get(i) ) + ratio);
		}
	
		// recursive call
		return new QRPolynomial(num, 0).mod(e);
	}
};

module.exports = QRPolynomial;


/***/ }),

/***/ "../node_modules/qr.js/lib/QRCode.js":
/*!*******************************************!*\
  !*** ../node_modules/qr.js/lib/QRCode.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var BitByte = __webpack_require__(/*! ./8BitByte */ "../node_modules/qr.js/lib/8BitByte.js");
var RSBlock = __webpack_require__(/*! ./RSBlock */ "../node_modules/qr.js/lib/RSBlock.js");
var BitBuffer = __webpack_require__(/*! ./BitBuffer */ "../node_modules/qr.js/lib/BitBuffer.js");
var util = __webpack_require__(/*! ./util */ "../node_modules/qr.js/lib/util.js");
var Polynomial = __webpack_require__(/*! ./Polynomial */ "../node_modules/qr.js/lib/Polynomial.js");

function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = [];
}

// for client side minification
var proto = QRCode.prototype;

proto.addData = function(data) {
	var newData = new BitByte(data);
	this.dataList.push(newData);
	this.dataCache = null;
};

proto.isDark = function(row, col) {
	if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
		throw new Error(row + "," + col);
	}
	return this.modules[row][col];
};

proto.getModuleCount = function() {
	return this.moduleCount;
};

proto.make = function() {
	// Calculate automatically typeNumber if provided is < 1
	if (this.typeNumber < 1 ){
		var typeNumber = 1;
		for (typeNumber = 1; typeNumber < 40; typeNumber++) {
			var rsBlocks = RSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

			var buffer = new BitBuffer();
			var totalDataCount = 0;
			for (var i = 0; i < rsBlocks.length; i++) {
				totalDataCount += rsBlocks[i].dataCount;
			}

			for (var i = 0; i < this.dataList.length; i++) {
				var data = this.dataList[i];
				buffer.put(data.mode, 4);
				buffer.put(data.getLength(), util.getLengthInBits(data.mode, typeNumber) );
				data.write(buffer);
			}
			if (buffer.getLengthInBits() <= totalDataCount * 8)
				break;
		}
		this.typeNumber = typeNumber;
	}
	this.makeImpl(false, this.getBestMaskPattern() );
};

proto.makeImpl = function(test, maskPattern) {
	
	this.moduleCount = this.typeNumber * 4 + 17;
	this.modules = new Array(this.moduleCount);
	
	for (var row = 0; row < this.moduleCount; row++) {
		
		this.modules[row] = new Array(this.moduleCount);
		
		for (var col = 0; col < this.moduleCount; col++) {
			this.modules[row][col] = null;//(col + row) % 3;
		}
	}

	this.setupPositionProbePattern(0, 0);
	this.setupPositionProbePattern(this.moduleCount - 7, 0);
	this.setupPositionProbePattern(0, this.moduleCount - 7);
	this.setupPositionAdjustPattern();
	this.setupTimingPattern();
	this.setupTypeInfo(test, maskPattern);
	
	if (this.typeNumber >= 7) {
		this.setupTypeNumber(test);
	}

	if (this.dataCache == null) {
		this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
	}

	this.mapData(this.dataCache, maskPattern);
};

proto.setupPositionProbePattern = function(row, col)  {
	
	for (var r = -1; r <= 7; r++) {
		
		if (row + r <= -1 || this.moduleCount <= row + r) continue;
		
		for (var c = -1; c <= 7; c++) {
			
			if (col + c <= -1 || this.moduleCount <= col + c) continue;
			
			if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
					|| (0 <= c && c <= 6 && (r == 0 || r == 6) )
					|| (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
				this.modules[row + r][col + c] = true;
			} else {
				this.modules[row + r][col + c] = false;
			}
		}		
	}		
};

proto.getBestMaskPattern = function() {

	var minLostPoint = 0;
	var pattern = 0;

	for (var i = 0; i < 8; i++) {
		
		this.makeImpl(true, i);

		var lostPoint = util.getLostPoint(this);

		if (i == 0 || minLostPoint >  lostPoint) {
			minLostPoint = lostPoint;
			pattern = i;
		}
	}

	return pattern;
};

proto.createMovieClip = function(target_mc, instance_name, depth) {

	var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
	var cs = 1;

	this.make();

	for (var row = 0; row < this.modules.length; row++) {
		
		var y = row * cs;
		
		for (var col = 0; col < this.modules[row].length; col++) {

			var x = col * cs;
			var dark = this.modules[row][col];
		
			if (dark) {
				qr_mc.beginFill(0, 100);
				qr_mc.moveTo(x, y);
				qr_mc.lineTo(x + cs, y);
				qr_mc.lineTo(x + cs, y + cs);
				qr_mc.lineTo(x, y + cs);
				qr_mc.endFill();
			}
		}
	}
	
	return qr_mc;
};

proto.setupTimingPattern = function() {
	
	for (var r = 8; r < this.moduleCount - 8; r++) {
		if (this.modules[r][6] != null) {
			continue;
		}
		this.modules[r][6] = (r % 2 == 0);
	}

	for (var c = 8; c < this.moduleCount - 8; c++) {
		if (this.modules[6][c] != null) {
			continue;
		}
		this.modules[6][c] = (c % 2 == 0);
	}
};

proto.setupPositionAdjustPattern = function() {

	var pos = util.getPatternPosition(this.typeNumber);
	
	for (var i = 0; i < pos.length; i++) {
	
		for (var j = 0; j < pos.length; j++) {
		
			var row = pos[i];
			var col = pos[j];
			
			if (this.modules[row][col] != null) {
				continue;
			}
			
			for (var r = -2; r <= 2; r++) {
			
				for (var c = -2; c <= 2; c++) {
				
					if (r == -2 || r == 2 || c == -2 || c == 2
							|| (r == 0 && c == 0) ) {
						this.modules[row + r][col + c] = true;
					} else {
						this.modules[row + r][col + c] = false;
					}
				}
			}
		}
	}
};

proto.setupTypeNumber = function(test) {

	var bits = util.getBCHTypeNumber(this.typeNumber);

	for (var i = 0; i < 18; i++) {
		var mod = (!test && ( (bits >> i) & 1) == 1);
		this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
	}

	for (var i = 0; i < 18; i++) {
		var mod = (!test && ( (bits >> i) & 1) == 1);
		this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
	}
};

proto.setupTypeInfo = function(test, maskPattern) {

	var data = (this.errorCorrectLevel << 3) | maskPattern;
	var bits = util.getBCHTypeInfo(data);

	// vertical		
	for (var i = 0; i < 15; i++) {

		var mod = (!test && ( (bits >> i) & 1) == 1);

		if (i < 6) {
			this.modules[i][8] = mod;
		} else if (i < 8) {
			this.modules[i + 1][8] = mod;
		} else {
			this.modules[this.moduleCount - 15 + i][8] = mod;
		}
	}

	// horizontal
	for (var i = 0; i < 15; i++) {

		var mod = (!test && ( (bits >> i) & 1) == 1);
		
		if (i < 8) {
			this.modules[8][this.moduleCount - i - 1] = mod;
		} else if (i < 9) {
			this.modules[8][15 - i - 1 + 1] = mod;
		} else {
			this.modules[8][15 - i - 1] = mod;
		}
	}

	// fixed module
	this.modules[this.moduleCount - 8][8] = (!test);
};

proto.mapData = function(data, maskPattern) {
	
	var inc = -1;
	var row = this.moduleCount - 1;
	var bitIndex = 7;
	var byteIndex = 0;
	
	for (var col = this.moduleCount - 1; col > 0; col -= 2) {

		if (col == 6) col--;

		while (true) {

			for (var c = 0; c < 2; c++) {
				
				if (this.modules[row][col - c] == null) {
					
					var dark = false;

					if (byteIndex < data.length) {
						dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
					}

					var mask = util.getMask(maskPattern, row, col - c);

					if (mask) {
						dark = !dark;
					}
					
					this.modules[row][col - c] = dark;
					bitIndex--;

					if (bitIndex == -1) {
						byteIndex++;
						bitIndex = 7;
					}
				}
			}
							
			row += inc;

			if (row < 0 || this.moduleCount <= row) {
				row -= inc;
				inc = -inc;
				break;
			}
		}
	}
};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
	
	var rsBlocks = RSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
	
	var buffer = new BitBuffer();
	
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), util.getLengthInBits(data.mode, typeNumber) );
		data.write(buffer);
	}

	// calc num max data.
	var totalDataCount = 0;
	for (var i = 0; i < rsBlocks.length; i++) {
		totalDataCount += rsBlocks[i].dataCount;
	}

	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error("code length overflow. ("
			+ buffer.getLengthInBits()
			+ ">"
			+  totalDataCount * 8
			+ ")");
	}

	// end code
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}

	// padding
	while (buffer.getLengthInBits() % 8 != 0) {
		buffer.putBit(false);
	}

	// padding
	while (true) {
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}

	return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {

	var offset = 0;
	
	var maxDcCount = 0;
	var maxEcCount = 0;
	
	var dcdata = new Array(rsBlocks.length);
	var ecdata = new Array(rsBlocks.length);
	
	for (var r = 0; r < rsBlocks.length; r++) {

		var dcCount = rsBlocks[r].dataCount;
		var ecCount = rsBlocks[r].totalCount - dcCount;

		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);
		
		dcdata[r] = new Array(dcCount);
		
		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;
		
		var rsPoly = util.getErrorCorrectPolynomial(ecCount);
		var rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1);

		var modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new Array(rsPoly.getLength() - 1);
		for (var i = 0; i < ecdata[r].length; i++) {
            var modIndex = i + modPoly.getLength() - ecdata[r].length;
			ecdata[r][i] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
		}

	}
	
	var totalCodeCount = 0;
	for (var i = 0; i < rsBlocks.length; i++) {
		totalCodeCount += rsBlocks[i].totalCount;
	}

	var data = new Array(totalCodeCount);
	var index = 0;

	for (var i = 0; i < maxDcCount; i++) {
		for (var r = 0; r < rsBlocks.length; r++) {
			if (i < dcdata[r].length) {
				data[index++] = dcdata[r][i];
			}
		}
	}

	for (var i = 0; i < maxEcCount; i++) {
		for (var r = 0; r < rsBlocks.length; r++) {
			if (i < ecdata[r].length) {
				data[index++] = ecdata[r][i];
			}
		}
	}

	return data;
};

module.exports = QRCode;



/***/ }),

/***/ "../node_modules/qr.js/lib/RSBlock.js":
/*!********************************************!*\
  !*** ../node_modules/qr.js/lib/RSBlock.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// ErrorCorrectLevel
var ECL = __webpack_require__(/*! ./ErrorCorrectLevel */ "../node_modules/qr.js/lib/ErrorCorrectLevel.js");

function QRRSBlock(totalCount, dataCount) {
	this.totalCount = totalCount;
	this.dataCount  = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [

	// L
	// M
	// Q
	// H

	// 1
	[1, 26, 19],
	[1, 26, 16],
	[1, 26, 13],
	[1, 26, 9],
	
	// 2
	[1, 44, 34],
	[1, 44, 28],
	[1, 44, 22],
	[1, 44, 16],

	// 3
	[1, 70, 55],
	[1, 70, 44],
	[2, 35, 17],
	[2, 35, 13],

	// 4		
	[1, 100, 80],
	[2, 50, 32],
	[2, 50, 24],
	[4, 25, 9],
	
	// 5
	[1, 134, 108],
	[2, 67, 43],
	[2, 33, 15, 2, 34, 16],
	[2, 33, 11, 2, 34, 12],
	
	// 6
	[2, 86, 68],
	[4, 43, 27],
	[4, 43, 19],
	[4, 43, 15],
	
	// 7		
	[2, 98, 78],
	[4, 49, 31],
	[2, 32, 14, 4, 33, 15],
	[4, 39, 13, 1, 40, 14],
	
	// 8
	[2, 121, 97],
	[2, 60, 38, 2, 61, 39],
	[4, 40, 18, 2, 41, 19],
	[4, 40, 14, 2, 41, 15],
	
	// 9
	[2, 146, 116],
	[3, 58, 36, 2, 59, 37],
	[4, 36, 16, 4, 37, 17],
	[4, 36, 12, 4, 37, 13],
	
	// 10		
	[2, 86, 68, 2, 87, 69],
	[4, 69, 43, 1, 70, 44],
	[6, 43, 19, 2, 44, 20],
	[6, 43, 15, 2, 44, 16],

	// 11
	[4, 101, 81],
	[1, 80, 50, 4, 81, 51],
	[4, 50, 22, 4, 51, 23],
	[3, 36, 12, 8, 37, 13],

	// 12
	[2, 116, 92, 2, 117, 93],
	[6, 58, 36, 2, 59, 37],
	[4, 46, 20, 6, 47, 21],
	[7, 42, 14, 4, 43, 15],

	// 13
	[4, 133, 107],
	[8, 59, 37, 1, 60, 38],
	[8, 44, 20, 4, 45, 21],
	[12, 33, 11, 4, 34, 12],

	// 14
	[3, 145, 115, 1, 146, 116],
	[4, 64, 40, 5, 65, 41],
	[11, 36, 16, 5, 37, 17],
	[11, 36, 12, 5, 37, 13],

	// 15
	[5, 109, 87, 1, 110, 88],
	[5, 65, 41, 5, 66, 42],
	[5, 54, 24, 7, 55, 25],
	[11, 36, 12],

	// 16
	[5, 122, 98, 1, 123, 99],
	[7, 73, 45, 3, 74, 46],
	[15, 43, 19, 2, 44, 20],
	[3, 45, 15, 13, 46, 16],

	// 17
	[1, 135, 107, 5, 136, 108],
	[10, 74, 46, 1, 75, 47],
	[1, 50, 22, 15, 51, 23],
	[2, 42, 14, 17, 43, 15],

	// 18
	[5, 150, 120, 1, 151, 121],
	[9, 69, 43, 4, 70, 44],
	[17, 50, 22, 1, 51, 23],
	[2, 42, 14, 19, 43, 15],

	// 19
	[3, 141, 113, 4, 142, 114],
	[3, 70, 44, 11, 71, 45],
	[17, 47, 21, 4, 48, 22],
	[9, 39, 13, 16, 40, 14],

	// 20
	[3, 135, 107, 5, 136, 108],
	[3, 67, 41, 13, 68, 42],
	[15, 54, 24, 5, 55, 25],
	[15, 43, 15, 10, 44, 16],

	// 21
	[4, 144, 116, 4, 145, 117],
	[17, 68, 42],
	[17, 50, 22, 6, 51, 23],
	[19, 46, 16, 6, 47, 17],

	// 22
	[2, 139, 111, 7, 140, 112],
	[17, 74, 46],
	[7, 54, 24, 16, 55, 25],
	[34, 37, 13],

	// 23
	[4, 151, 121, 5, 152, 122],
	[4, 75, 47, 14, 76, 48],
	[11, 54, 24, 14, 55, 25],
	[16, 45, 15, 14, 46, 16],

	// 24
	[6, 147, 117, 4, 148, 118],
	[6, 73, 45, 14, 74, 46],
	[11, 54, 24, 16, 55, 25],
	[30, 46, 16, 2, 47, 17],

	// 25
	[8, 132, 106, 4, 133, 107],
	[8, 75, 47, 13, 76, 48],
	[7, 54, 24, 22, 55, 25],
	[22, 45, 15, 13, 46, 16],

	// 26
	[10, 142, 114, 2, 143, 115],
	[19, 74, 46, 4, 75, 47],
	[28, 50, 22, 6, 51, 23],
	[33, 46, 16, 4, 47, 17],

	// 27
	[8, 152, 122, 4, 153, 123],
	[22, 73, 45, 3, 74, 46],
	[8, 53, 23, 26, 54, 24],
	[12, 45, 15, 28, 46, 16],

	// 28
	[3, 147, 117, 10, 148, 118],
	[3, 73, 45, 23, 74, 46],
	[4, 54, 24, 31, 55, 25],
	[11, 45, 15, 31, 46, 16],

	// 29
	[7, 146, 116, 7, 147, 117],
	[21, 73, 45, 7, 74, 46],
	[1, 53, 23, 37, 54, 24],
	[19, 45, 15, 26, 46, 16],

	// 30
	[5, 145, 115, 10, 146, 116],
	[19, 75, 47, 10, 76, 48],
	[15, 54, 24, 25, 55, 25],
	[23, 45, 15, 25, 46, 16],

	// 31
	[13, 145, 115, 3, 146, 116],
	[2, 74, 46, 29, 75, 47],
	[42, 54, 24, 1, 55, 25],
	[23, 45, 15, 28, 46, 16],

	// 32
	[17, 145, 115],
	[10, 74, 46, 23, 75, 47],
	[10, 54, 24, 35, 55, 25],
	[19, 45, 15, 35, 46, 16],

	// 33
	[17, 145, 115, 1, 146, 116],
	[14, 74, 46, 21, 75, 47],
	[29, 54, 24, 19, 55, 25],
	[11, 45, 15, 46, 46, 16],

	// 34
	[13, 145, 115, 6, 146, 116],
	[14, 74, 46, 23, 75, 47],
	[44, 54, 24, 7, 55, 25],
	[59, 46, 16, 1, 47, 17],

	// 35
	[12, 151, 121, 7, 152, 122],
	[12, 75, 47, 26, 76, 48],
	[39, 54, 24, 14, 55, 25],
	[22, 45, 15, 41, 46, 16],

	// 36
	[6, 151, 121, 14, 152, 122],
	[6, 75, 47, 34, 76, 48],
	[46, 54, 24, 10, 55, 25],
	[2, 45, 15, 64, 46, 16],

	// 37
	[17, 152, 122, 4, 153, 123],
	[29, 74, 46, 14, 75, 47],
	[49, 54, 24, 10, 55, 25],
	[24, 45, 15, 46, 46, 16],

	// 38
	[4, 152, 122, 18, 153, 123],
	[13, 74, 46, 32, 75, 47],
	[48, 54, 24, 14, 55, 25],
	[42, 45, 15, 32, 46, 16],

	// 39
	[20, 147, 117, 4, 148, 118],
	[40, 75, 47, 7, 76, 48],
	[43, 54, 24, 22, 55, 25],
	[10, 45, 15, 67, 46, 16],

	// 40
	[19, 148, 118, 6, 149, 119],
	[18, 75, 47, 31, 76, 48],
	[34, 54, 24, 34, 55, 25],
	[20, 45, 15, 61, 46, 16]
];

QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
	
	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
	
	if (rsBlock == undefined) {
		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
	}

	var length = rsBlock.length / 3;
	
	var list = new Array();
	
	for (var i = 0; i < length; i++) {

		var count = rsBlock[i * 3 + 0];
		var totalCount = rsBlock[i * 3 + 1];
		var dataCount  = rsBlock[i * 3 + 2];

		for (var j = 0; j < count; j++) {
			list.push(new QRRSBlock(totalCount, dataCount) );	
		}
	}
	
	return list;
}

QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

	switch(errorCorrectLevel) {
	case ECL.L :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	case ECL.M :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	case ECL.Q :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	case ECL.H :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	default :
		return undefined;
	}
}

module.exports = QRRSBlock;


/***/ }),

/***/ "../node_modules/qr.js/lib/math.js":
/*!*****************************************!*\
  !*** ../node_modules/qr.js/lib/math.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var QRMath = {

	glog : function(n) {
	
		if (n < 1) {
			throw new Error("glog(" + n + ")");
		}
		
		return QRMath.LOG_TABLE[n];
	},
	
	gexp : function(n) {
	
		while (n < 0) {
			n += 255;
		}
	
		while (n >= 256) {
			n -= 255;
		}
	
		return QRMath.EXP_TABLE[n];
	},
	
	EXP_TABLE : new Array(256),
	
	LOG_TABLE : new Array(256)

};
	
for (var i = 0; i < 8; i++) {
	QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
		^ QRMath.EXP_TABLE[i - 5]
		^ QRMath.EXP_TABLE[i - 6]
		^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
}

module.exports = QRMath;


/***/ }),

/***/ "../node_modules/qr.js/lib/mode.js":
/*!*****************************************!*\
  !*** ../node_modules/qr.js/lib/mode.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
	MODE_NUMBER :		1 << 0,
	MODE_ALPHA_NUM : 	1 << 1,
	MODE_8BIT_BYTE : 	1 << 2,
	MODE_KANJI :		1 << 3
};


/***/ }),

/***/ "../node_modules/qr.js/lib/util.js":
/*!*****************************************!*\
  !*** ../node_modules/qr.js/lib/util.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Mode = __webpack_require__(/*! ./mode */ "../node_modules/qr.js/lib/mode.js");
var Polynomial = __webpack_require__(/*! ./Polynomial */ "../node_modules/qr.js/lib/Polynomial.js");
var math = __webpack_require__(/*! ./math */ "../node_modules/qr.js/lib/math.js");

var QRMaskPattern = {
	PATTERN000 : 0,
	PATTERN001 : 1,
	PATTERN010 : 2,
	PATTERN011 : 3,
	PATTERN100 : 4,
	PATTERN101 : 5,
	PATTERN110 : 6,
	PATTERN111 : 7
};

var QRUtil = {

    PATTERN_POSITION_TABLE : [
	    [],
	    [6, 18],
	    [6, 22],
	    [6, 26],
	    [6, 30],
	    [6, 34],
	    [6, 22, 38],
	    [6, 24, 42],
	    [6, 26, 46],
	    [6, 28, 50],
	    [6, 30, 54],		
	    [6, 32, 58],
	    [6, 34, 62],
	    [6, 26, 46, 66],
	    [6, 26, 48, 70],
	    [6, 26, 50, 74],
	    [6, 30, 54, 78],
	    [6, 30, 56, 82],
	    [6, 30, 58, 86],
	    [6, 34, 62, 90],
	    [6, 28, 50, 72, 94],
	    [6, 26, 50, 74, 98],
	    [6, 30, 54, 78, 102],
	    [6, 28, 54, 80, 106],
	    [6, 32, 58, 84, 110],
	    [6, 30, 58, 86, 114],
	    [6, 34, 62, 90, 118],
	    [6, 26, 50, 74, 98, 122],
	    [6, 30, 54, 78, 102, 126],
	    [6, 26, 52, 78, 104, 130],
	    [6, 30, 56, 82, 108, 134],
	    [6, 34, 60, 86, 112, 138],
	    [6, 30, 58, 86, 114, 142],
	    [6, 34, 62, 90, 118, 146],
	    [6, 30, 54, 78, 102, 126, 150],
	    [6, 24, 50, 76, 102, 128, 154],
	    [6, 28, 54, 80, 106, 132, 158],
	    [6, 32, 58, 84, 110, 136, 162],
	    [6, 26, 54, 82, 110, 138, 166],
	    [6, 30, 58, 86, 114, 142, 170]
    ],

    G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)	| (1 << 4) | (1 << 1),

    getBCHTypeInfo : function(data) {
	    var d = data << 10;
	    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
		    d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) ); 	
	    }
	    return ( (data << 10) | d) ^ QRUtil.G15_MASK;
    },

    getBCHTypeNumber : function(data) {
	    var d = data << 12;
	    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
		    d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) ); 	
	    }
	    return (data << 12) | d;
    },

    getBCHDigit : function(data) {

	    var digit = 0;

	    while (data != 0) {
		    digit++;
		    data >>>= 1;
	    }

	    return digit;
    },

    getPatternPosition : function(typeNumber) {
	    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },

    getMask : function(maskPattern, i, j) {
	    
	    switch (maskPattern) {
		    
	    case QRMaskPattern.PATTERN000 : return (i + j) % 2 == 0;
	    case QRMaskPattern.PATTERN001 : return i % 2 == 0;
	    case QRMaskPattern.PATTERN010 : return j % 3 == 0;
	    case QRMaskPattern.PATTERN011 : return (i + j) % 3 == 0;
	    case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0;
	    case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 == 0;
	    case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 == 0;
	    case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 == 0;

	    default :
		    throw new Error("bad maskPattern:" + maskPattern);
	    }
    },

    getErrorCorrectPolynomial : function(errorCorrectLength) {

	    var a = new Polynomial([1], 0);

	    for (var i = 0; i < errorCorrectLength; i++) {
		    a = a.multiply(new Polynomial([1, math.gexp(i)], 0) );
	    }

	    return a;
    },

    getLengthInBits : function(mode, type) {

	    if (1 <= type && type < 10) {

		    // 1 - 9

		    switch(mode) {
		    case Mode.MODE_NUMBER 	: return 10;
		    case Mode.MODE_ALPHA_NUM 	: return 9;
		    case Mode.MODE_8BIT_BYTE	: return 8;
		    case Mode.MODE_KANJI  	: return 8;
		    default :
			    throw new Error("mode:" + mode);
		    }

	    } else if (type < 27) {

		    // 10 - 26

		    switch(mode) {
		    case Mode.MODE_NUMBER 	: return 12;
		    case Mode.MODE_ALPHA_NUM 	: return 11;
		    case Mode.MODE_8BIT_BYTE	: return 16;
		    case Mode.MODE_KANJI  	: return 10;
		    default :
			    throw new Error("mode:" + mode);
		    }

	    } else if (type < 41) {

		    // 27 - 40

		    switch(mode) {
		    case Mode.MODE_NUMBER 	: return 14;
		    case Mode.MODE_ALPHA_NUM	: return 13;
		    case Mode.MODE_8BIT_BYTE	: return 16;
		    case Mode.MODE_KANJI  	: return 12;
		    default :
			    throw new Error("mode:" + mode);
		    }

	    } else {
		    throw new Error("type:" + type);
	    }
    },

    getLostPoint : function(qrCode) {
	    
	    var moduleCount = qrCode.getModuleCount();
	    
	    var lostPoint = 0;
	    
	    // LEVEL1
	    
	    for (var row = 0; row < moduleCount; row++) {

		    for (var col = 0; col < moduleCount; col++) {

			    var sameCount = 0;
			    var dark = qrCode.isDark(row, col);

				for (var r = -1; r <= 1; r++) {

				    if (row + r < 0 || moduleCount <= row + r) {
					    continue;
				    }

				    for (var c = -1; c <= 1; c++) {

					    if (col + c < 0 || moduleCount <= col + c) {
						    continue;
					    }

					    if (r == 0 && c == 0) {
						    continue;
					    }

					    if (dark == qrCode.isDark(row + r, col + c) ) {
						    sameCount++;
					    }
				    }
			    }

			    if (sameCount > 5) {
				    lostPoint += (3 + sameCount - 5);
			    }
		    }
	    }

	    // LEVEL2

	    for (var row = 0; row < moduleCount - 1; row++) {
		    for (var col = 0; col < moduleCount - 1; col++) {
			    var count = 0;
			    if (qrCode.isDark(row,     col    ) ) count++;
			    if (qrCode.isDark(row + 1, col    ) ) count++;
			    if (qrCode.isDark(row,     col + 1) ) count++;
			    if (qrCode.isDark(row + 1, col + 1) ) count++;
			    if (count == 0 || count == 4) {
				    lostPoint += 3;
			    }
		    }
	    }

	    // LEVEL3

	    for (var row = 0; row < moduleCount; row++) {
		    for (var col = 0; col < moduleCount - 6; col++) {
			    if (qrCode.isDark(row, col)
					    && !qrCode.isDark(row, col + 1)
					    &&  qrCode.isDark(row, col + 2)
					    &&  qrCode.isDark(row, col + 3)
					    &&  qrCode.isDark(row, col + 4)
					    && !qrCode.isDark(row, col + 5)
					    &&  qrCode.isDark(row, col + 6) ) {
				    lostPoint += 40;
			    }
		    }
	    }

	    for (var col = 0; col < moduleCount; col++) {
		    for (var row = 0; row < moduleCount - 6; row++) {
			    if (qrCode.isDark(row, col)
					    && !qrCode.isDark(row + 1, col)
					    &&  qrCode.isDark(row + 2, col)
					    &&  qrCode.isDark(row + 3, col)
					    &&  qrCode.isDark(row + 4, col)
					    && !qrCode.isDark(row + 5, col)
					    &&  qrCode.isDark(row + 6, col) ) {
				    lostPoint += 40;
			    }
		    }
	    }

	    // LEVEL4
	    
	    var darkCount = 0;

	    for (var col = 0; col < moduleCount; col++) {
		    for (var row = 0; row < moduleCount; row++) {
			    if (qrCode.isDark(row, col) ) {
				    darkCount++;
			    }
		    }
	    }
	    
	    var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
	    lostPoint += ratio * 10;

	    return lostPoint;		
    }
};

module.exports = QRUtil;


/***/ }),

/***/ "../node_modules/qrcode.react/lib/index.js":
/*!*************************************************!*\
  !*** ../node_modules/qrcode.react/lib/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var React = __webpack_require__(/*! react */ "../node_modules/react/index.js");

var PropTypes = __webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"); // qr.js doesn't handle error level of zero (M) so we need to do it right,
// thus the deep require.


var QRCodeImpl = __webpack_require__(/*! qr.js/lib/QRCode */ "../node_modules/qr.js/lib/QRCode.js");

var ErrorCorrectLevel = __webpack_require__(/*! qr.js/lib/ErrorCorrectLevel */ "../node_modules/qr.js/lib/ErrorCorrectLevel.js");

function getBackingStorePixelRatio(ctx) {
  return (// $FlowFixMe
    ctx.webkitBackingStorePixelRatio || // $FlowFixMe
    ctx.mozBackingStorePixelRatio || // $FlowFixMe
    ctx.msBackingStorePixelRatio || // $FlowFixMe
    ctx.oBackingStorePixelRatio || // $FlowFixMe
    ctx.backingStorePixelRatio || 1
  );
} // Convert from UTF-16, forcing the use of byte-mode encoding in our QR Code.
// This allows us to encode Hanji, Kanji, emoji, etc. Ideally we'd do more
// detection and not resort to byte-mode if possible, but we're trading off
// a smaller library for a smaller amount of data we can potentially encode.
// Based on http://jonisalonen.com/2012/from-utf-16-to-utf-8-in-javascript/


function convertStr(str) {
  var out = '';

  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);

    if (charcode < 0x0080) {
      out += String.fromCharCode(charcode);
    } else if (charcode < 0x0800) {
      out += String.fromCharCode(0xc0 | charcode >> 6);
      out += String.fromCharCode(0x80 | charcode & 0x3f);
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      out += String.fromCharCode(0xe0 | charcode >> 12);
      out += String.fromCharCode(0x80 | charcode >> 6 & 0x3f);
      out += String.fromCharCode(0x80 | charcode & 0x3f);
    } else {
      // This is a surrogate pair, so we'll reconsitute the pieces and work
      // from that
      i++;
      charcode = 0x10000 + ((charcode & 0x3ff) << 10 | str.charCodeAt(i) & 0x3ff);
      out += String.fromCharCode(0xf0 | charcode >> 18);
      out += String.fromCharCode(0x80 | charcode >> 12 & 0x3f);
      out += String.fromCharCode(0x80 | charcode >> 6 & 0x3f);
      out += String.fromCharCode(0x80 | charcode & 0x3f);
    }
  }

  return out;
}

var DEFAULT_PROPS = {
  size: 128,
  level: 'L',
  bgColor: '#FFFFFF',
  fgColor: '#000000'
};
var PROP_TYPES = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number,
  level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
  bgColor: PropTypes.string,
  fgColor: PropTypes.string
};

var QRCodeCanvas =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QRCodeCanvas, _React$Component);

  function QRCodeCanvas() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, QRCodeCanvas);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = QRCodeCanvas.__proto__ || Object.getPrototypeOf(QRCodeCanvas)).call.apply(_ref, [this].concat(args))), Object.defineProperty(_assertThisInitialized(_this), "_canvas", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: void 0
    }), _temp));
  }

  _createClass(QRCodeCanvas, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      return Object.keys(QRCodeCanvas.propTypes).some(function (k) {
        return _this2.props[k] !== nextProps[k];
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.update();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.update();
    }
  }, {
    key: "update",
    value: function update() {
      var _props = this.props,
          value = _props.value,
          size = _props.size,
          level = _props.level,
          bgColor = _props.bgColor,
          fgColor = _props.fgColor; // We'll use type===-1 to force QRCode to automatically pick the best type

      var qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
      qrcode.addData(convertStr(value));
      qrcode.make();

      if (this._canvas != null) {
        var canvas = this._canvas;
        var ctx = canvas.getContext('2d');

        if (!ctx) {
          return;
        }

        var cells = qrcode.modules;

        if (cells === null) {
          return;
        }

        var tileW = size / cells.length;
        var tileH = size / cells.length;
        var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
        canvas.height = canvas.width = size * scale;
        ctx.scale(scale, scale);
        cells.forEach(function (row, rdx) {
          row.forEach(function (cell, cdx) {
            ctx && (ctx.fillStyle = cell ? fgColor : bgColor);
            var w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
            var h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
            ctx && ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          value = _props2.value,
          size = _props2.size,
          level = _props2.level,
          bgColor = _props2.bgColor,
          fgColor = _props2.fgColor,
          style = _props2.style,
          otherProps = _objectWithoutProperties(_props2, ["value", "size", "level", "bgColor", "fgColor", "style"]);

      var canvasStyle = _extends({
        height: size,
        width: size
      }, style);

      return React.createElement("canvas", _extends({
        style: canvasStyle,
        height: size,
        width: size,
        ref: function ref(_ref2) {
          return _this3._canvas = _ref2;
        }
      }, otherProps));
    }
  }]);

  return QRCodeCanvas;
}(React.Component);

Object.defineProperty(QRCodeCanvas, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DEFAULT_PROPS
});
Object.defineProperty(QRCodeCanvas, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: PROP_TYPES
});

var QRCodeSVG =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(QRCodeSVG, _React$Component2);

  function QRCodeSVG() {
    _classCallCheck(this, QRCodeSVG);

    return _possibleConstructorReturn(this, (QRCodeSVG.__proto__ || Object.getPrototypeOf(QRCodeSVG)).apply(this, arguments));
  }

  _createClass(QRCodeSVG, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this4 = this;

      return Object.keys(QRCodeCanvas.propTypes).some(function (k) {
        return _this4.props[k] !== nextProps[k];
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _props3 = this.props,
          value = _props3.value,
          size = _props3.size,
          level = _props3.level,
          bgColor = _props3.bgColor,
          fgColor = _props3.fgColor,
          otherProps = _objectWithoutProperties(_props3, ["value", "size", "level", "bgColor", "fgColor"]); // We'll use type===-1 to force QRCode to automatically pick the best type


      var qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
      qrcode.addData(convertStr(value));
      qrcode.make();
      var cells = qrcode.modules;

      if (cells === null) {
        return;
      } // Drawing strategy: instead of a rect per module, we're going to create a
      // single path for the dark modules and layer that on top of a light rect,
      // for a total of 2 DOM nodes. We pay a bit more in string concat but that's
      // way faster than DOM ops.
      // For level 1, 441 nodes -> 2
      // For level 40, 31329 -> 2


      var ops = [];
      cells.forEach(function (row, y) {
        var lastIsDark = false;
        var start = null;
        row.forEach(function (cell, x) {
          if (!cell && start !== null) {
            // M0 0h7v1H0z injects the space with the move and dropd the comma,
            // saving a char per operation
            ops.push("M".concat(start, " ").concat(y, "h").concat(x - start, "v1H").concat(start, "z"));
            start = null;
            return;
          } // end of row, clean up or skip


          if (x === row.length - 1) {
            if (!cell) {
              // We would have closed the op above already so this can only mean
              // 2+ light modules in a row.
              return;
            }

            if (start === null) {
              // Just a single dark module.
              ops.push("M".concat(x, ",").concat(y, " h1v1H").concat(x, "z"));
            } else {
              // Otherwise finish the current line.
              ops.push("M".concat(start, ",").concat(y, " h").concat(x + 1 - start, "v1H").concat(start, "z"));
            }

            return;
          }

          if (cell && start === null) {
            start = x;
          }
        });
      });
      return React.createElement("svg", _extends({
        shapeRendering: "crispEdges",
        height: size,
        width: size,
        viewBox: "0 0 ".concat(cells.length, " ").concat(cells.length)
      }, otherProps), React.createElement("path", {
        fill: bgColor,
        d: "M0,0 h".concat(cells.length, "v").concat(cells.length, "H0z")
      }), React.createElement("path", {
        fill: fgColor,
        d: ops.join('')
      }));
    }
  }]);

  return QRCodeSVG;
}(React.Component);

Object.defineProperty(QRCodeSVG, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DEFAULT_PROPS
});
Object.defineProperty(QRCodeSVG, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: PROP_TYPES
});

var QRCode = function QRCode(props) {
  var renderAs = props.renderAs,
      otherProps = _objectWithoutProperties(props, ["renderAs"]);

  var Component = renderAs === 'svg' ? QRCodeSVG : QRCodeCanvas;
  return React.createElement(Component, otherProps);
};

QRCode.defaultProps = _extends({
  renderAs: 'canvas'
}, DEFAULT_PROPS);
module.exports = QRCode;

/***/ }),

/***/ "../node_modules/querystring-es3/decode.js":
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/decode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "../node_modules/querystring-es3/encode.js":
/*!*************************************************!*\
  !*** ../node_modules/querystring-es3/encode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ "../node_modules/querystring-es3/index.js":
/*!************************************************!*\
  !*** ../node_modules/querystring-es3/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ "../node_modules/querystring-es3/decode.js");
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "../node_modules/querystring-es3/encode.js");


/***/ }),

/***/ "../node_modules/react-is/cjs/react-is.development.js":
/*!************************************************************!*\
  !*** ../node_modules/react-is/cjs/react-is.development.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.8.2
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' ||
  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
}

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;
    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;
          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;
              default:
                return $$typeof;
            }
        }
      case REACT_LAZY_TYPE:
      case REACT_MEMO_TYPE:
      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
}

// AsyncMode is deprecated along with isAsyncMode
var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;

var hasWarnedAboutDeprecatedIsAsyncMode = false;

// AsyncMode should be deprecated
function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true;
      lowPriorityWarning$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }
  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.typeOf = typeOf;
exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isValidElementType = isValidElementType;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
  })();
}


/***/ }),

/***/ "../node_modules/react-is/index.js":
/*!*****************************************!*\
  !*** ../node_modules/react-is/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "../node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "../node_modules/react-router-redux/lib/actions.js":
/*!*********************************************************!*\
  !*** ../node_modules/react-router-redux/lib/actions.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */
var CALL_HISTORY_METHOD = exports.CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';

function updateLocation(method) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return {
      type: CALL_HISTORY_METHOD,
      payload: { method: method, args: args }
    };
  };
}

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
var push = exports.push = updateLocation('push');
var replace = exports.replace = updateLocation('replace');
var go = exports.go = updateLocation('go');
var goBack = exports.goBack = updateLocation('goBack');
var goForward = exports.goForward = updateLocation('goForward');

var routerActions = exports.routerActions = { push: push, replace: replace, go: go, goBack: goBack, goForward: goForward };

/***/ }),

/***/ "../node_modules/react-router-redux/lib/index.js":
/*!*******************************************************!*\
  !*** ../node_modules/react-router-redux/lib/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routerMiddleware = exports.routerActions = exports.goForward = exports.goBack = exports.go = exports.replace = exports.push = exports.CALL_HISTORY_METHOD = exports.routerReducer = exports.LOCATION_CHANGE = exports.syncHistoryWithStore = undefined;

var _reducer = __webpack_require__(/*! ./reducer */ "../node_modules/react-router-redux/lib/reducer.js");

Object.defineProperty(exports, 'LOCATION_CHANGE', {
  enumerable: true,
  get: function get() {
    return _reducer.LOCATION_CHANGE;
  }
});
Object.defineProperty(exports, 'routerReducer', {
  enumerable: true,
  get: function get() {
    return _reducer.routerReducer;
  }
});

var _actions = __webpack_require__(/*! ./actions */ "../node_modules/react-router-redux/lib/actions.js");

Object.defineProperty(exports, 'CALL_HISTORY_METHOD', {
  enumerable: true,
  get: function get() {
    return _actions.CALL_HISTORY_METHOD;
  }
});
Object.defineProperty(exports, 'push', {
  enumerable: true,
  get: function get() {
    return _actions.push;
  }
});
Object.defineProperty(exports, 'replace', {
  enumerable: true,
  get: function get() {
    return _actions.replace;
  }
});
Object.defineProperty(exports, 'go', {
  enumerable: true,
  get: function get() {
    return _actions.go;
  }
});
Object.defineProperty(exports, 'goBack', {
  enumerable: true,
  get: function get() {
    return _actions.goBack;
  }
});
Object.defineProperty(exports, 'goForward', {
  enumerable: true,
  get: function get() {
    return _actions.goForward;
  }
});
Object.defineProperty(exports, 'routerActions', {
  enumerable: true,
  get: function get() {
    return _actions.routerActions;
  }
});

var _sync = __webpack_require__(/*! ./sync */ "../node_modules/react-router-redux/lib/sync.js");

var _sync2 = _interopRequireDefault(_sync);

var _middleware = __webpack_require__(/*! ./middleware */ "../node_modules/react-router-redux/lib/middleware.js");

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports.syncHistoryWithStore = _sync2['default'];
exports.routerMiddleware = _middleware2['default'];

/***/ }),

/***/ "../node_modules/react-router-redux/lib/middleware.js":
/*!************************************************************!*\
  !*** ../node_modules/react-router-redux/lib/middleware.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = routerMiddleware;

var _actions = __webpack_require__(/*! ./actions */ "../node_modules/react-router-redux/lib/actions.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
function routerMiddleware(history) {
  return function () {
    return function (next) {
      return function (action) {
        if (action.type !== _actions.CALL_HISTORY_METHOD) {
          return next(action);
        }

        var _action$payload = action.payload,
            method = _action$payload.method,
            args = _action$payload.args;

        history[method].apply(history, _toConsumableArray(args));
      };
    };
  };
}

/***/ }),

/***/ "../node_modules/react-router-redux/lib/reducer.js":
/*!*********************************************************!*\
  !*** ../node_modules/react-router-redux/lib/reducer.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.routerReducer = routerReducer;
/**
 * This action type will be dispatched when your history
 * receives a location change.
 */
var LOCATION_CHANGE = exports.LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

var initialState = {
  locationBeforeTransitions: null
};

/**
 * This reducer will update the state with the most recent location history
 * has transitioned to. This may not be in sync with the router, particularly
 * if you have asynchronously-loaded routes, so reading from and relying on
 * this state is discouraged.
 */
function routerReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      type = _ref.type,
      payload = _ref.payload;

  if (type === LOCATION_CHANGE) {
    return _extends({}, state, { locationBeforeTransitions: payload });
  }

  return state;
}

/***/ }),

/***/ "../node_modules/react-router-redux/lib/sync.js":
/*!******************************************************!*\
  !*** ../node_modules/react-router-redux/lib/sync.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = syncHistoryWithStore;

var _reducer = __webpack_require__(/*! ./reducer */ "../node_modules/react-router-redux/lib/reducer.js");

var defaultSelectLocationState = function defaultSelectLocationState(state) {
  return state.routing;
};

/**
 * This function synchronizes your history state with the Redux store.
 * Location changes flow from history to the store. An enhanced history is
 * returned with a listen method that responds to store updates for location.
 *
 * When this history is provided to the router, this means the location data
 * will flow like this:
 * history.push -> store.dispatch -> enhancedHistory.listen -> router
 * This ensures that when the store state changes due to a replay or other
 * event, the router will be updated appropriately and can transition to the
 * correct router state.
 */
function syncHistoryWithStore(history, store) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$selectLocationSt = _ref.selectLocationState,
      selectLocationState = _ref$selectLocationSt === undefined ? defaultSelectLocationState : _ref$selectLocationSt,
      _ref$adjustUrlOnRepla = _ref.adjustUrlOnReplay,
      adjustUrlOnReplay = _ref$adjustUrlOnRepla === undefined ? true : _ref$adjustUrlOnRepla;

  // Ensure that the reducer is mounted on the store and functioning properly.
  if (typeof selectLocationState(store.getState()) === 'undefined') {
    throw new Error('Expected the routing state to be available either as `state.routing` ' + 'or as the custom expression you can specify as `selectLocationState` ' + 'in the `syncHistoryWithStore()` options. ' + 'Ensure you have added the `routerReducer` to your store\'s ' + 'reducers via `combineReducers` or whatever method you use to isolate ' + 'your reducers.');
  }

  var initialLocation = void 0;
  var isTimeTraveling = void 0;
  var unsubscribeFromStore = void 0;
  var unsubscribeFromHistory = void 0;
  var currentLocation = void 0;

  // What does the store say about current location?
  var getLocationInStore = function getLocationInStore(useInitialIfEmpty) {
    var locationState = selectLocationState(store.getState());
    return locationState.locationBeforeTransitions || (useInitialIfEmpty ? initialLocation : undefined);
  };

  // Init initialLocation with potential location in store
  initialLocation = getLocationInStore();

  // If the store is replayed, update the URL in the browser to match.
  if (adjustUrlOnReplay) {
    var handleStoreChange = function handleStoreChange() {
      var locationInStore = getLocationInStore(true);
      if (currentLocation === locationInStore || initialLocation === locationInStore) {
        return;
      }

      // Update address bar to reflect store state
      isTimeTraveling = true;
      currentLocation = locationInStore;
      history.transitionTo(_extends({}, locationInStore, {
        action: 'PUSH'
      }));
      isTimeTraveling = false;
    };

    unsubscribeFromStore = store.subscribe(handleStoreChange);
    handleStoreChange();
  }

  // Whenever location changes, dispatch an action to get it in the store
  var handleLocationChange = function handleLocationChange(location) {
    // ... unless we just caused that location change
    if (isTimeTraveling) {
      return;
    }

    // Remember where we are
    currentLocation = location;

    // Are we being called for the first time?
    if (!initialLocation) {
      // Remember as a fallback in case state is reset
      initialLocation = location;

      // Respect persisted location, if any
      if (getLocationInStore()) {
        return;
      }
    }

    // Tell the store to update by dispatching an action
    store.dispatch({
      type: _reducer.LOCATION_CHANGE,
      payload: location
    });
  };
  unsubscribeFromHistory = history.listen(handleLocationChange);

  // History 3.x doesn't call listen synchronously, so fire the initial location change ourselves
  if (history.getCurrentLocation) {
    handleLocationChange(history.getCurrentLocation());
  }

  // The enhanced history uses store as source of truth
  return _extends({}, history, {
    // The listeners are subscribed to the store instead of history
    listen: function listen(listener) {
      // Copy of last location.
      var lastPublishedLocation = getLocationInStore(true);

      // Keep track of whether we unsubscribed, as Redux store
      // only applies changes in subscriptions on next dispatch
      var unsubscribed = false;
      var unsubscribeFromStore = store.subscribe(function () {
        var currentLocation = getLocationInStore(true);
        if (currentLocation === lastPublishedLocation) {
          return;
        }
        lastPublishedLocation = currentLocation;
        if (!unsubscribed) {
          listener(lastPublishedLocation);
        }
      });

      // History 2.x listeners expect a synchronous call. Make the first call to the
      // listener after subscribing to the store, in case the listener causes a
      // location change (e.g. when it redirects)
      if (!history.getCurrentLocation) {
        listener(lastPublishedLocation);
      }

      // Let user unsubscribe later
      return function () {
        unsubscribed = true;
        unsubscribeFromStore();
      };
    },


    // It also provides a way to destroy internal listeners
    unsubscribe: function unsubscribe() {
      if (adjustUrlOnReplay) {
        unsubscribeFromStore();
      }
      unsubscribeFromHistory();
    }
  });
}

/***/ }),

/***/ "../node_modules/redux-act/lib/asError.js":
/*!************************************************!*\
  !*** ../node_modules/redux-act/lib/asError.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = asError;
function asError(action) {
  if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object' && action !== null) {
    action.error = true;
  }
  return action;
};

/***/ }),

/***/ "../node_modules/redux-act/lib/assignAll.js":
/*!**************************************************!*\
  !*** ../node_modules/redux-act/lib/assignAll.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = assignAll;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function assignAll(actions, stores) {
  if (Array.isArray(actions)) {
    return actions.map(function (action) {
      return action.assignTo(stores);
    });
  }
  return Object.keys(actions).reduce(function (assigns, action) {
    return _extends(assigns, _defineProperty({}, action, actions[action].assignTo(stores)));
  }, {});
};

/***/ }),

/***/ "../node_modules/redux-act/lib/batch.js":
/*!**********************************************!*\
  !*** ../node_modules/redux-act/lib/batch.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createAction = __webpack_require__(/*! ./createAction */ "../node_modules/redux-act/lib/createAction.js");

var _createAction2 = _interopRequireDefault(_createAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createAction2.default)('Batch', function () {
  for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
    actions[_key] = arguments[_key];
  }

  if (actions.length === 1 && Array.isArray(actions[0])) {
    return actions[0];
  }
  return actions;
});

/***/ }),

/***/ "../node_modules/redux-act/lib/bindAll.js":
/*!************************************************!*\
  !*** ../node_modules/redux-act/lib/bindAll.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = bindAll;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function bindAll(actions, stores) {
  if (Array.isArray(actions)) {
    return actions.map(function (action) {
      return action.bindTo(stores);
    });
  }
  return Object.keys(actions).reduce(function (binds, action) {
    return _extends(binds, _defineProperty({}, action, actions[action].bindTo(stores)));
  }, {});
};

/***/ }),

/***/ "../node_modules/redux-act/lib/createAction.js":
/*!*****************************************************!*\
  !*** ../node_modules/redux-act/lib/createAction.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAction;

var _types = __webpack_require__(/*! ./types */ "../node_modules/redux-act/lib/types.js");

var id = 0;

var identity = function identity(arg) {
  return arg;
};

var normalize = function normalize(dispatchOrStore) {
  if (dispatchOrStore && typeof dispatchOrStore.dispatch === 'function') {
    return dispatchOrStore.dispatch;
  } else {
    return dispatchOrStore;
  }
};

var normalizeAll = function normalizeAll(dispatchOrStores) {
  if (Array.isArray(dispatchOrStores)) {
    return dispatchOrStores.map(normalize);
  } else {
    return normalize(dispatchOrStores);
  }
};

function createAction(description, payloadReducer, metaReducer) {
  if (typeof description === 'function') {
    metaReducer = payloadReducer;
    payloadReducer = description;
    description = undefined;
  }

  if (typeof payloadReducer !== 'function') {
    payloadReducer = identity;
  }

  if (typeof metaReducer !== 'function') {
    metaReducer = undefined;
  }

  var isSerializable = typeof description === 'string' && /^[0-9A-Z_]+$/.test(description);

  if (isSerializable) {
    (0, _types.check)(description);
    (0, _types.add)(description);
  } else {
    ++id;
  }

  var type = isSerializable ? description : '[' + id + ']' + (description ? ' ' + description : '');

  var dispatchFunctions = undefined;

  function makeAction() {
    var payload = payloadReducer.apply(undefined, arguments);

    if (metaReducer) {
      return {
        type: type,
        payload: payload,
        error: payload instanceof Error,
        meta: metaReducer.apply(undefined, arguments)
      };
    }

    return {
      type: type,
      payload: payload,
      error: payload instanceof Error
    };
  }

  var makeAndDispatch = function makeAndDispatch(dispatchs, isError) {
    return function () {
      var payloadedAction = makeAction.apply(undefined, arguments);
      if (!payloadedAction.error) {
        payloadedAction.error = isError;
      }

      if (Array.isArray(dispatchs)) {
        return dispatchs.map(function (dispatch) {
          return dispatch(payloadedAction);
        });
      } else if (dispatchs) {
        return dispatchs(payloadedAction);
      } else {
        return payloadedAction;
      }
    };
  };

  function actionCreator() {
    return makeAndDispatch(dispatchFunctions, false).apply(undefined, arguments);
  }

  actionCreator.asError = function () {
    return makeAndDispatch(dispatchFunctions, true).apply(undefined, arguments);
  };

  actionCreator.getType = function () {
    return type;
  };
  actionCreator.toString = function () {
    return type;
  };

  actionCreator.raw = makeAction;

  actionCreator.assignTo = function (dispatchOrStores) {
    dispatchFunctions = normalizeAll(dispatchOrStores);
    return actionCreator;
  };

  actionCreator.assigned = function () {
    return !!dispatchFunctions;
  };
  actionCreator.bound = function () {
    return false;
  };
  actionCreator.dispatched = actionCreator.assigned;

  actionCreator.bindTo = function (dispatchOrStores) {
    var boundActionCreator = makeAndDispatch(normalizeAll(dispatchOrStores, false));
    boundActionCreator.asError = makeAndDispatch(normalizeAll(dispatchOrStores, true));
    boundActionCreator.raw = makeAction;
    boundActionCreator.getType = actionCreator.getType;
    boundActionCreator.toString = actionCreator.toString;
    boundActionCreator.assignTo = function () {
      return boundActionCreator;
    };
    boundActionCreator.bindTo = function () {
      return boundActionCreator;
    };
    boundActionCreator.assigned = function () {
      return false;
    };
    boundActionCreator.bound = function () {
      return true;
    };
    boundActionCreator.dispatched = boundActionCreator.bound;
    return boundActionCreator;
  };

  return actionCreator;
};

/***/ }),

/***/ "../node_modules/redux-act/lib/createReducer.js":
/*!******************************************************!*\
  !*** ../node_modules/redux-act/lib/createReducer.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createReducer;

var _batch = __webpack_require__(/*! ./batch */ "../node_modules/redux-act/lib/batch.js");

var _batch2 = _interopRequireDefault(_batch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizeType(typeOrActionCreator) {
  if (typeOrActionCreator && typeOrActionCreator.getType) {
    return typeOrActionCreator.toString();
  }
  return typeOrActionCreator;
}

function createReducer() {
  var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultState = arguments[1];

  var opts = {
    payload: true,
    fallback: null
  };

  var reducer = _extends(reduce, {
    has: has, on: on, off: off, options: options
  });

  function has(typeOrActionCreator) {
    return !!handlers[normalizeType(typeOrActionCreator)];
  }

  function on(typeOrActionCreator, handler) {
    if (Array.isArray(typeOrActionCreator)) {
      typeOrActionCreator.forEach(function (action) {
        on(action, handler);
      });
    } else {
      handlers[normalizeType(typeOrActionCreator)] = handler;
    }

    return reducer;
  }

  function off(typeOrActionCreator) {
    if (Array.isArray(typeOrActionCreator)) {
      typeOrActionCreator.forEach(off);
    } else {
      delete handlers[normalizeType(typeOrActionCreator)];
    }
    return reducer;
  }

  function options(newOpts) {
    Object.keys(newOpts).forEach(function (name) {
      return opts[name] = newOpts[name];
    });
    return reducer;
  }

  if (typeof handlers === 'function') {
    var factory = handlers;
    handlers = {};
    factory(on, off);
  }

  if (!has(_batch2.default)) {
    on(_batch2.default, function (state, payload) {
      if (opts.payload) {
        return payload.reduce(reduce, state);
      } else {
        return payload.payload.reduce(reduce, state);
      }
    });
  }

  function reduce() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments[1];

    if (!action || typeof action.type !== 'string') {
      return state;
    }
    if (action.type.startsWith('@@redux/')) {
      return state;
    }

    var handler = handlers[action.type] || opts.fallback;
    if (handler) {
      if (opts.payload) {
        return handler(state, action.payload, action.meta);
      } else {
        return handler(state, action);
      }
    }

    return state;
  };

  return reducer;
};

/***/ }),

/***/ "../node_modules/redux-act/lib/disbatch.js":
/*!*************************************************!*\
  !*** ../node_modules/redux-act/lib/disbatch.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = disbatch;

var _batch = __webpack_require__(/*! ./batch */ "../node_modules/redux-act/lib/batch.js");

var _batch2 = _interopRequireDefault(_batch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function disbatch(store) {
  for (var _len = arguments.length, actions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    actions[_key - 1] = arguments[_key];
  }

  if (actions && actions.length > 0) {
    if (!store || typeof store !== 'function' && typeof store.dispatch !== 'function') {
      throw new TypeError('disbatch must take either a valid Redux store or a dispatch function as first parameter');
    }

    if (typeof store.dispatch === 'function') {
      store = store.dispatch;
    }

    // store is actually the dispatch function here
    return store(_batch2.default.apply(undefined, actions));
  } else {
    if (!store || typeof store.dispatch !== 'function') {
      throw new TypeError('disbatch must take a valid Redux store with a dispatch function as first parameter');
    }

    return _extends(store, {
      disbatch: disbatch.bind(undefined, store)
    });
  }
}

/***/ }),

/***/ "../node_modules/redux-act/lib/index.js":
/*!**********************************************!*\
  !*** ../node_modules/redux-act/lib/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.asError = exports.loggers = exports.disbatch = exports.batch = exports.bindAll = exports.assignAll = exports.createReducer = exports.createAction = undefined;

var _createAction = __webpack_require__(/*! ./createAction */ "../node_modules/redux-act/lib/createAction.js");

Object.defineProperty(exports, 'createAction', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createAction).default;
  }
});

var _createReducer = __webpack_require__(/*! ./createReducer */ "../node_modules/redux-act/lib/createReducer.js");

Object.defineProperty(exports, 'createReducer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createReducer).default;
  }
});

var _assignAll = __webpack_require__(/*! ./assignAll */ "../node_modules/redux-act/lib/assignAll.js");

Object.defineProperty(exports, 'assignAll', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_assignAll).default;
  }
});

var _bindAll = __webpack_require__(/*! ./bindAll */ "../node_modules/redux-act/lib/bindAll.js");

Object.defineProperty(exports, 'bindAll', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_bindAll).default;
  }
});

var _batch = __webpack_require__(/*! ./batch */ "../node_modules/redux-act/lib/batch.js");

Object.defineProperty(exports, 'batch', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_batch).default;
  }
});

var _disbatch = __webpack_require__(/*! ./disbatch */ "../node_modules/redux-act/lib/disbatch.js");

Object.defineProperty(exports, 'disbatch', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_disbatch).default;
  }
});

var _loggers = __webpack_require__(/*! ./loggers */ "../node_modules/redux-act/lib/loggers/index.js");

Object.defineProperty(exports, 'loggers', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_loggers).default;
  }
});

var _asError = __webpack_require__(/*! ./asError */ "../node_modules/redux-act/lib/asError.js");

Object.defineProperty(exports, 'asError', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_asError).default;
  }
});

var _types2 = __webpack_require__(/*! ./types */ "../node_modules/redux-act/lib/types.js");

var _types = _interopRequireWildcard(_types2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var types = exports.types = _types;

/***/ }),

/***/ "../node_modules/redux-act/lib/loggers/index.js":
/*!******************************************************!*\
  !*** ../node_modules/redux-act/lib/loggers/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxLogger = __webpack_require__(/*! ./reduxLogger */ "../node_modules/redux-act/lib/loggers/reduxLogger.js");

var reduxLogger = _interopRequireWildcard(_reduxLogger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  reduxLogger: reduxLogger
};

/***/ }),

/***/ "../node_modules/redux-act/lib/loggers/reduxLogger.js":
/*!************************************************************!*\
  !*** ../node_modules/redux-act/lib/loggers/reduxLogger.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;
exports.actionTransformer = actionTransformer;

var _batch = __webpack_require__(/*! ../batch */ "../node_modules/redux-act/lib/batch.js");

var _batch2 = _interopRequireDefault(_batch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var batchType = _batch2.default.getType();

function actionTransformer(action) {
  if (action && action.type === batchType) {
    action.payload.type = batchType;
    return action.payload;
  }
  return action;
}

var logger = exports.logger = {};

var _loop = function _loop(level) {
  if (typeof console[level] === 'function') {
    logger[level] = function levelFn() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var lastArg = args.pop();

      if (Array.isArray(lastArg) && lastArg.type === batchType) {
        lastArg.forEach(function (action) {
          console[level].apply(console, [].concat(args, [action]));
        });
      } else {
        args.push(lastArg);
        console[level].apply(console, args);
      }
    };
  }
};

for (var level in console) {
  _loop(level);
}

/***/ }),

/***/ "../node_modules/redux-act/lib/types.js":
/*!**********************************************!*\
  !*** ../node_modules/redux-act/lib/types.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.remove = remove;
exports.has = has;
exports.check = check;
exports.all = all;
exports.clear = clear;
exports.enableChecking = enableChecking;
exports.disableChecking = disableChecking;
var types = {};
var config = {
  checkExisting: true
};

function add(name) {
  types[name] = true;
}

function remove(name) {
  types[name] = false;
}

function has(name) {
  return !!types[name];
}

function check(name) {
  if (config.checkExisting && has(name)) {
    throw new TypeError("Duplicate action type: " + name);
  }
}

function all() {
  return Object.keys(types).filter(has);
}

function clear() {
  all().forEach(remove);
}

function enableChecking() {
  config.checkExisting = true;
}

function disableChecking() {
  config.checkExisting = false;
}

/***/ }),

/***/ "../node_modules/whatwg-fetch/fetch.js":
/*!*********************************************!*\
  !*** ../node_modules/whatwg-fetch/fetch.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),

/***/ "./wechat-react/actions/common.js":
/*!****************************************!*\
  !*** ./wechat-react/actions/common.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loading = loading;
exports.setIsLiveAdmin = setIsLiveAdmin;
exports.fetchSuccess = fetchSuccess;
exports.updateSysTime = updateSysTime;
exports.toast = toast;
exports.uploadAudio = uploadAudio;
exports.uploadDoc = uploadDoc;
exports.uploadRec = uploadRec;
exports.insertOssSdk = insertOssSdk;
exports.uploadImage = uploadImage;
exports.getStsAuth = getStsAuth;
exports.initUserInfo = initUserInfo;
exports.getUserInfo = getUserInfo;
exports.getUserInfoP = getUserInfoP;
exports.getFollowQr = getFollowQr;
exports.getQr = getQr;
exports.getTopicQr = getTopicQr;
exports.doPay = doPay;
exports.selectPayResult = selectPayResult;
exports.togglePayDialog = togglePayDialog;
exports.cancelPayDialog = cancelPayDialog;
exports.getSysTime = getSysTime;
exports.getServerTime = getServerTime;
exports.fetchAndUpdateSysTime = fetchAndUpdateSysTime;
exports.api = api;
exports.getCreateLiveStatus = getCreateLiveStatus;
exports.isLiveAdmin = isLiveAdmin;
exports.isThirdPartyWhite = isThirdPartyWhite;
exports.bindOfficialKey = bindOfficialKey;
exports.bindLiveShare = bindLiveShare;
exports.getMyCoralIdentity = getMyCoralIdentity;
exports.getCousePayPaster = getCousePayPaster;
exports.getOfficialLiveIds = getOfficialLiveIds;
exports.request = request;
exports.userBindKaiFang = userBindKaiFang;
exports.getDomainUrl = getDomainUrl;
exports.isServiceWhiteLive = isServiceWhiteLive;
exports.getQlLiveIds = getQlLiveIds;
exports.initAppOpenId = initAppOpenId;
exports.userIsOrNotCustomVip = userIsOrNotCustomVip;
exports.subscribeStatus = subscribeStatus;
exports.isFollow = isFollow;
exports.ifGetCousePayPasterLink = ifGetCousePayPasterLink;
exports.subAterSign = subAterSign;
exports.getIsQlCourseFocus = getIsQlCourseFocus;
exports.tripartiteLeadPowder = tripartiteLeadPowder;
exports.whatQrcodeShouldIGet = whatQrcodeShouldIGet;
exports.getAllConfig = getAllConfig;
exports.getLiveStudioTypes = getLiveStudioTypes;
exports.getIsQlCourseUser = getIsQlCourseUser;
exports.fetchSubscribeStatus = fetchSubscribeStatus;
exports.isServerWhite = isServerWhite;
exports.getIsSubscribe = getIsSubscribe;
exports.getFocusLiveId = getFocusLiveId;
exports.bindShareKey = bindShareKey;
exports.getActiveTime = getActiveTime;
exports.getTopicInfo = getTopicInfo;
exports.getUserTopicRole = getUserTopicRole;
exports.getTopicRoleList = getTopicRoleList;
exports.checkShareStatus = checkShareStatus;
exports.fetchShareRecord = fetchShareRecord;
exports.getReceiveInfo = getReceiveInfo;
exports.getMyQualify = getMyQualify;
exports.isAuthChannel = isAuthChannel;
exports.isAuthTopic = isAuthTopic;
exports.isAuthCourse = isAuthCourse;
exports.authFreeCourse = authFreeCourse;
exports.getFirstTopicInChannel = getFirstTopicInChannel;
exports.uploadTaskPoint = uploadTaskPoint;
exports.topicJodLists = topicJodLists;
exports.getCommunity = getCommunity;
exports.assignAgreement = assignAgreement;
exports.getAgreementStatus = getAgreementStatus;
exports.getAgreementVersion = getAgreementVersion;
exports.unbindPhone = unbindPhone;
exports.updateUserInfo = updateUserInfo;
exports.isFunctionWhite = isFunctionWhite;
exports.getWxConfig = getWxConfig;
exports.checkEnterprise = checkEnterprise;
exports.getExamQrCode = getExamQrCode;
exports.fetchRelationInfo = fetchRelationInfo;
exports.dispatchFetchRelationInfo = dispatchFetchRelationInfo;
exports.getThirdConf = getThirdConf;
exports.isQlLive = exports.getAdSpace = exports.getWechatNickName = exports.getAppGoUrl = exports.getNodeInfo = exports.GET_THRID_CONF = exports.GET_RELATIONINFO = exports.UPDATE_USERINFO = exports.INIT_APP_OPENID = exports.GET_OFFICIAL_LIVE_IDS = exports.SET_IS_LIVE_ADMIN = exports.SET_STS_AUTH = exports.TOGGLE_PAYMENT_DIALOG = exports.FIRST_MSG_CODE = exports.SYSTIME = exports.TOAST = exports.COMPLETE = exports.ERROR = exports.SUCCESS = exports.LOADING = exports.USERINFO = void 0;

var _apiService = __webpack_require__(/*! components/api-service */ "./wechat-react/components/api-service/index.js");

var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "../node_modules/isomorphic-fetch/fetch-npm-browserify.js"));

var _path = __webpack_require__(/*! path */ "../node_modules/path-browserify/index.js");

var _querystring = __webpack_require__(/*! querystring */ "../node_modules/querystring-es3/index.js");

var _detect = _interopRequireDefault(__webpack_require__(/*! ../components/detect */ "./wechat-react/components/detect.js"));

var _util = __webpack_require__(/*! ../components/util */ "./wechat-react/components/util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import OSS from 'ali-oss'
//获取用户信息
var USERINFO = "USERINFO"; // 处理中

exports.USERINFO = USERINFO;
var LOADING = "LOADING"; // 处理成功

exports.LOADING = LOADING;
var SUCCESS = "SUCCESS"; // 处理失败

exports.SUCCESS = SUCCESS;
var ERROR = "ERROR"; // 处理完成

exports.ERROR = ERROR;
var COMPLETE = "COMPLETE"; // 显示toast

exports.COMPLETE = COMPLETE;
var TOAST = "TOAST";
exports.TOAST = TOAST;
var SYSTIME = "SYSTIME";
exports.SYSTIME = SYSTIME;
var FIRST_MSG_CODE = "FIRST_MSG_CODE"; // 关闭支付弹框

exports.FIRST_MSG_CODE = FIRST_MSG_CODE;
var TOGGLE_PAYMENT_DIALOG = "TOGGLE_PAYMENT_DIALOG"; // 设置sts上传信息

exports.TOGGLE_PAYMENT_DIALOG = TOGGLE_PAYMENT_DIALOG;
var SET_STS_AUTH = "SET_STS_AUTH";
exports.SET_STS_AUTH = SET_STS_AUTH;
var SET_IS_LIVE_ADMIN = "SET_IS_LIVE_ADMIN";
exports.SET_IS_LIVE_ADMIN = SET_IS_LIVE_ADMIN;
var GET_OFFICIAL_LIVE_IDS = "GET_OFFICIAL_LIVE_IDS"; // 初始化appOpenId

exports.GET_OFFICIAL_LIVE_IDS = GET_OFFICIAL_LIVE_IDS;
var INIT_APP_OPENID = "INIT_APP_OPENID";
exports.INIT_APP_OPENID = INIT_APP_OPENID;
var UPDATE_USERINFO = "UPDATE_USERINFO"; // 获取好友关系

exports.UPDATE_USERINFO = UPDATE_USERINFO;
var GET_RELATIONINFO = 'GET_RELATIONINFO';
exports.GET_RELATIONINFO = GET_RELATIONINFO;
var GET_THRID_CONF = 'GET_THRID_CONF';
exports.GET_THRID_CONF = GET_THRID_CONF;

function loading(status) {
  return {
    type: LOADING,
    status: status
  };
}

var uploadClient = null;
var uploadClientDoc = null;
var inPay = false;

function setIsLiveAdmin(data) {
  return {
    type: SET_IS_LIVE_ADMIN,
    data: data
  };
}

function fetchSuccess() {
  return {
    type: SUCCESS
  };
}

function updateSysTime(sysTime) {
  return {
    type: SYSTIME,
    sysTime: sysTime
  };
}

function toast(msg, timeout) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(dispatch, getStore) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dispatch({
                  type: TOAST,
                  payload: {
                    show: true,
                    msg: msg,
                    timeout: timeout
                  }
                });
                setTimeout(function () {
                  dispatch({
                    type: TOAST,
                    payload: {
                      show: false
                    }
                  });
                }, timeout || 1000);

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
} // 上传文件命名


function reName() {
  var chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  var res = "";

  for (var i = 0; i < 8; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }

  res += "-";

  for (var i = 0; i < 4; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }

  res += "-";

  for (var i = 0; i < 4; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }

  res += "-" + new Date().getTime() + "-";

  for (var i = 0; i < 12; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }

  return res;
}

function dataURLtoBlob(dataurl) {
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
/**
 * 图片压缩
 * @param {File} file 文件
 * @returns Promise<File>
 */


function imageCompress(file) {
  var reader = new FileReader();
  var sourceImage = new Image();
  var filename = file.name;
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  reader.readAsDataURL(file);
  return new Promise(function (resolve, reject) {
    reader.onload = function (event) {
      sourceImage.src = event.target.result;

      sourceImage.onload = function () {
        canvas.width = sourceImage.width;
        canvas.height = sourceImage.height;
        ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height); // setTimeout(() => {

        var resultFile = dataURLtoBlob(canvas.toDataURL("image/jpeg", 0.5));
        resultFile = new File([resultFile], "temp.jpg", {
          type: "image/jpeg"
        });
        resolve(resultFile); // }, 1000);
      };
    };
  });
}
/**
 * 上传音频文件（mp3）
 *
 * @export
 * @param {any} file
 * @param {string} [folder='temp']
 * @param {string} [fileType='.mp3']
 * @param {number} [duration=0]
 * @returns
 */


function uploadAudio(file) {
  var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "audio";
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".mp3";
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    // 是否显示loading遮罩
    showLoading: true,
    // 开始回调
    startUpload: function startUpload() {},
    // 进度回调
    onProgress: function onProgress(progress) {},
    // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
    interruptUpload: function interruptUpload() {
      return false;
    },
    // 上传失败
    onError: function onError() {
      return null;
    }
  };
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(dispatch, getStore) {
        var url, mp3, duration, hasDuration, client, key, checkpoint, fileName, uploadId, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (/(mp3|MP3)$/i.test(file.name)) {
                  _context3.next = 4;
                  break;
                }

                window.toast("只支持MP3文件上传，请重新选择！", 2000);
                options.onError();
                return _context3.abrupt("return");

              case 4:
                if (!(file.size > 31457280)) {
                  _context3.next = 8;
                  break;
                }

                window.toast("请选择小于30M的音频文件！", 2000);
                options.onError();
                return _context3.abrupt("return");

              case 8:
                url = URL.createObjectURL(file);
                mp3 = new Audio(url);
                duration = 0;

                hasDuration = function hasDuration() {
                  return !(duration === 0 || duration === 1);
                };

                mp3.volume = 0;

                mp3.onloadedmetadata = function (data) {
                  duration = hasDuration() ? duration : mp3.duration;
                };

                mp3.ondurationchange = function (data) {
                  duration = hasDuration() ? duration : mp3.duration;
                }; //  先播放 700ms， 确保触发 onloadedmetadata || onloadedmetadata;


                mp3.play();
                _context3.next = 18;
                return new Promise(function (resolve, reject) {
                  setTimeout(function () {
                    mp3.pause();
                    resolve();
                  }, 700);
                });

              case 18:
                client = null;
                _context3.prev = 19;
                _context3.next = 22;
                return getOssClient(getStore, dispatch);

              case 22:
                client = _context3.sent;
                _context3.next = 28;
                break;

              case 25:
                _context3.prev = 25;
                _context3.t0 = _context3["catch"](19);
                console.log("get oss client error: ", _context3.t0);

              case 28:
                key = "qlLive/".concat(folder, "/").concat(reName()).concat(fileType);
                options.showLoading && window.loading(true);
                options.startUpload();
                _context3.next = 33;
                return client.multipartUpload(key, file, {
                  checkpoint: checkpoint,
                  progress: function () {
                    var _progress = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee2(p, cpt) {
                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              if (!options.interruptUpload()) {
                                _context2.next = 4;
                                break;
                              }

                              return _context2.abrupt("return", client.abortMultipartUpload(cpt.name, cpt.uploadId));

                            case 4:
                              options.onProgress(p);

                              if (cpt !== undefined) {
                                checkpoint = cpt;
                                fileName = cpt.name;
                                uploadId = cpt.uploadId;
                              }

                              return _context2.abrupt("return", Promise.resolve());

                            case 7:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2, this);
                    }));

                    function progress(_x5, _x6) {
                      return _progress.apply(this, arguments);
                    }

                    return progress;
                  }()
                });

              case 33:
                result = _context3.sent;
                file = null;
                options.showLoading && window.loading(false);

                if (!(result.res.status == 200)) {
                  _context3.next = 41;
                  break;
                }

                window.toast("上传成功");
                return _context3.abrupt("return", {
                  url: "https://media.qianliaowang.com/".concat(key),
                  duration: duration
                });

              case 41:
                throw new Error("上传失败 ->" + JSON.stringify(result));

              case 42:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[19, 25]]);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
}
/**
 * 文档上传
 *
 * @export
 * @param {any} file
 * @param {string} [folder='document']
 * @param {string} [fileType='.pdf']
 * @returns
 */


function uploadDoc(file) {
  var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "document";
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".pdf";
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    // 是否显示loading遮罩
    showLoading: false,
    // 进度回调
    onProgress: function onProgress(progress) {},
    // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
    interruptUpload: function interruptUpload() {
      return false;
    },
    // 错误回调
    onError: function onError() {
      return null;
    },
    // 最大值开关
    maxSizeSwitch: false
  };
  return (
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(dispatch, getStore) {
        var maxSize, client, key, checkpoint, fileName, uploadId, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                maxSize = options.maxSizeSwitch ? 63000000 : 20480000;

                if (/(doc|xls|pdf|docx|xlsx|ppt|pptx)$/.test(file.name)) {
                  _context5.next = 5;
                  break;
                }

                window.toast("只支持doc,pdf,xls,ppt文件上传，请重新选择！", 2000);
                options.onError();
                throw new Error("只支持doc,pdf,xls,ppt文件上传，请重新选择!");

              case 5:
                if (!(file.size > maxSize)) {
                  _context5.next = 9;
                  break;
                }

                window.toast("\u6700\u5927\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC7".concat(options.maxSizeSwitch ? "60" : "20", "M!"), 2000);
                options.onError();
                throw new Error("\u6700\u5927\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC7".concat(options.maxSizeSwitch ? "60" : "20", "M!"));

              case 9:
                // 获取文件类型
                if (file.name) {
                  fileType = (0, _path.extname)(file.name);
                }

                _context5.next = 12;
                return getOssClient(getStore, dispatch, "doc");

              case 12:
                client = _context5.sent;
                key = "qlLive/".concat(folder, "/").concat(reName()).concat(fileType);
                _context5.next = 16;
                return client.multipartUpload(key, file, {
                  checkpoint: checkpoint,
                  progress: function () {
                    var _progress2 = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee4(p, cpt) {
                      return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              if (!options.interruptUpload()) {
                                _context4.next = 4;
                                break;
                              }

                              return _context4.abrupt("return", client.abortMultipartUpload(cpt.name, cpt.uploadId));

                            case 4:
                              options.onProgress(p);
                              return _context4.abrupt("return", function (done) {
                                if (cpt !== undefined) {
                                  checkpoint = cpt;
                                  fileName = cpt.name;
                                  uploadId = cpt.uploadId;
                                  done();
                                }
                              });

                            case 6:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee4, this);
                    }));

                    function progress(_x9, _x10) {
                      return _progress2.apply(this, arguments);
                    }

                    return progress;
                  }()
                });

              case 16:
                result = _context5.sent;
                file = null;
                window.loading(false);

                if (!(result.res.status == 200)) {
                  _context5.next = 24;
                  break;
                }

                window.toast("上传成功");
                return _context5.abrupt("return", "https://docs.qianliaowang.com/".concat(key));

              case 24:
                throw new Error("上传失败 ->" + JSON.stringify(result));

              case 25:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x7, _x8) {
        return _ref3.apply(this, arguments);
      };
    }()
  );
}

function uploadRec(file) {
  var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "temp";
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "wav";
  return (
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(dispatch, getStore) {
        var client, key, checkpoint, fileName, uploadId, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return getOssClient(getStore, dispatch);

              case 2:
                client = _context6.sent;
                key = "qlLive/".concat(folder, "/").concat(reName(), ".").concat(fileType);
                window.loading(true);
                _context6.next = 7;
                return client.multipartUpload(key, file, {
                  checkpoint: checkpoint,
                  progress: function progress(p, cpt) {
                    return function (done) {
                      if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                      }

                      done();
                    };
                  }
                });

              case 7:
                result = _context6.sent;
                file = null;
                window.loading(false);

                if (!(result.res.status == 200)) {
                  _context6.next = 15;
                  break;
                }

                window.toast("上传成功");
                return _context6.abrupt("return", "https://media.qlchat.com/".concat(key));

              case 15:
                throw new Error("上传失败 ->" + JSON.stringify(result));

              case 16:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x11, _x12) {
        return _ref4.apply(this, arguments);
      };
    }()
  );
}
/**
 * 加载oss-sdk.js，不会重复加载
 */


function insertOssSdk() {
  insertOssSdk.promise = insertOssSdk.promise || new Promise(function (resolve, reject) {
    if (window.OSS) return resolve();
    var script = document.createElement("script");
    script.src = "//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js";
    script.onload = resolve;

    script.onerror = function () {
      insertOssSdk.promise = null;
      script.remove();
      reject(Error("加载oss.sdk失败"));
    };

    document.body.appendChild(script);
  });
  return insertOssSdk.promise;
}
/**
 * 上传图片
 */


function uploadImage(file) {
  var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "temp";
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".jpg";
  return (
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(dispatch, getStore) {
        var isImage, resultFile, client, key, checkpoint, fileName, uploadId, result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (/(jpg|JPG|png|PNG|gif|GIF|bmp|BMP|jpeg|JPEG)$/i.test(file.name)) {
                  _context7.next = 5;
                  break;
                }

                window.toast("图片格式只支持jpg|JPG|png|PNG|gif|GIF|bmp，请重新选择！", 2000);
                return _context7.abrupt("return");

              case 5:
                isImage = true;

              case 6:
                if (!(file.size > 5242880)) {
                  _context7.next = 9;
                  break;
                }

                window.toast("请选择小于5M的图片文件！", 2000);
                return _context7.abrupt("return");

              case 9:
                // 获取文件类型
                if (file.name) {
                  fileType = (0, _path.extname)(file.name);
                }

                resultFile = file;

                if (!(file.size > 3145728)) {
                  _context7.next = 15;
                  break;
                }

                _context7.next = 14;
                return imageCompress(file);

              case 14:
                resultFile = _context7.sent;

              case 15:
                _context7.next = 17;
                return getOssClient(getStore, dispatch);

              case 17:
                client = _context7.sent;
                key = "qlLive/".concat(folder, "/").concat(reName()).concat(fileType);
                window.loading(true);
                _context7.next = 22;
                return client.multipartUpload(key, resultFile, {
                  checkpoint: checkpoint,
                  progress: function progress(p, cpt) {
                    return function (done) {
                      if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                      }

                      done();
                    };
                  }
                });

              case 22:
                result = _context7.sent;
                file = null;
                window.loading(false);

                if (!(result.res.status == 200)) {
                  _context7.next = 30;
                  break;
                }

                if (isImage) {
                  window.toast("图片上传成功");
                } else {
                  window.toast("上传成功");
                }

                return _context7.abrupt("return", "https://img.qlchat.com/".concat(key));

              case 30:
                throw new Error("文件上传失败 ->" + JSON.stringify(result));

              case 31:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x13, _x14) {
        return _ref5.apply(this, arguments);
      };
    }()
  );
}
/**
 * 获取上传组件
 */


function getOssClient(_x15, _x16) {
  return _getOssClient.apply(this, arguments);
}

function _getOssClient() {
  _getOssClient = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee42(getStore, dispatch) {
    var type,
        OSSW,
        STS,
        secure,
        bucket,
        region,
        stsAuth,
        result,
        stsResult,
        client,
        _args42 = arguments;
    return regeneratorRuntime.wrap(function _callee42$(_context42) {
      while (1) {
        switch (_context42.prev = _context42.next) {
          case 0:
            type = _args42.length > 2 && _args42[2] !== undefined ? _args42[2] : "common";

            if (!(type === "common" && uploadClient)) {
              _context42.next = 5;
              break;
            }

            return _context42.abrupt("return", uploadClient);

          case 5:
            if (!(type === "doc" && uploadClientDoc)) {
              _context42.next = 7;
              break;
            }

            return _context42.abrupt("return", uploadClientDoc);

          case 7:
            if (window.OSS && (!OSSW || !STS)) {
              OSSW = OSS.Wrapper;
              STS = OSS.STS;
            }

            secure = false;

            if (/(https)/.test(window.location.href)) {
              secure = true;
            }

            bucket = "ql-res";
            region = "oss-cn-hangzhou";
            stsAuth = getStore().common.stsAuth;

            if (stsAuth) {
              _context42.next = 19;
              break;
            }

            _context42.next = 16;
            return api({
              dispatch: dispatch,
              getStore: getStore,
              showLoading: false,
              url: "/api/wechat/common/getStsAuth"
            });

          case 16:
            result = _context42.sent;
            dispatch({
              type: SET_STS_AUTH,
              stsAuth: result.data
            });
            stsAuth = getStore().common.stsAuth;

          case 19:
            if (!(type == "doc")) {
              _context42.next = 25;
              break;
            }

            bucket = "qianliao-doc-download-402-301";
            _context42.next = 23;
            return (0, _isomorphicFetch.default)("/api/wechat/common/getStsAuth?bucketName=" + bucket, {
              method: "GET",
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              },
              credentials: "include"
            }).then(function (res) {
              return res.json();
            });

          case 23:
            stsResult = _context42.sent;

            if (stsResult.state.code == 0) {
              stsAuth = stsResult.data;
            } else {
              console.error("获取sts auth失败！");
            }

          case 25:
            client = new OSSW({
              region: region,
              accessKeyId: stsAuth.accessKeyId,
              secure: secure,
              accessKeySecret: stsAuth.accessKeySecret,
              stsToken: stsAuth.securityToken,
              bucket: bucket
            });

            if (type === "common") {
              uploadClient = client;
            } else {
              uploadClientDoc = client;
            }

            return _context42.abrupt("return", client);

          case 28:
          case "end":
            return _context42.stop();
        }
      }
    }, _callee42, this);
  }));
  return _getOssClient.apply(this, arguments);
}

function getStsAuth() {
  return (
    /*#__PURE__*/
    function () {
      var _ref6 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: "/api/wechat/common/getStsAuth"
                });

              case 2:
                result = _context8.sent;
                dispatch({
                  type: SET_STS_AUTH,
                  stsAuth: result.data
                });

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x17, _x18) {
        return _ref6.apply(this, arguments);
      };
    }()
  );
}

function initUserInfo(userInfo) {
  return {
    type: USERINFO,
    userInfo: userInfo
  };
}

function getUserInfo(userId, topicId) {
  var params = {
    topicId: topicId
  };

  if (userId) {
    params.userId = userId;
  }

  return (
    /*#__PURE__*/
    function () {
      var _ref7 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: "/api/wechat/user/info",
                  body: params
                });

              case 2:
                result = _context9.sent;
                dispatch({
                  type: USERINFO,
                  userInfo: result.data
                });
                return _context9.abrupt("return", result);

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function (_x19, _x20) {
        return _ref7.apply(this, arguments);
      };
    }()
  );
}
/**
 * 20190311
 * post方法getUser，避免缓存
 */


function getUserInfoP() {
  return function (dispatch, getStore) {
    return request.post({
      url: "/api/wechat/transfer/h5/user/get"
    }).then(function (res) {
      var userInfo = res.data.user;
      dispatch({
        type: UPDATE_USERINFO,
        userInfo: userInfo
      });
      return userInfo;
    }).catch(function (err) {});
  };
}
/**
 * 获取关注二维码(基础版)
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */


function getFollowQr(_ref8) {
  var _ref8$channelCode = _ref8.channelCode,
      channelCode = _ref8$channelCode === void 0 ? 204 : _ref8$channelCode,
      _ref8$channelId = _ref8.channelId,
      channelId = _ref8$channelId === void 0 ? "" : _ref8$channelId,
      liveId = _ref8.liveId,
      _ref8$topicId = _ref8.topicId,
      topicId = _ref8$topicId === void 0 ? "" : _ref8$topicId,
      isBindThird = _ref8.isBindThird,
      isFocusThree = _ref8.isFocusThree,
      subscribe = _ref8.subscribe,
      _ref8$isShowQl = _ref8.isShowQl,
      isShowQl = _ref8$isShowQl === void 0 ? true : _ref8$isShowQl,
      _ref8$showLoading = _ref8.showLoading,
      showLoading = _ref8$showLoading === void 0 ? false : _ref8$showLoading,
      _ref8$isFirstMsg = _ref8.isFirstMsg,
      isFirstMsg = _ref8$isFirstMsg === void 0 ? false : _ref8$isFirstMsg,
      _ref8$isLiveAdmin = _ref8.isLiveAdmin,
      isLiveAdmin = _ref8$isLiveAdmin === void 0 ? "Y" : _ref8$isLiveAdmin,
      _ref8$isWhite = _ref8.isWhite,
      isWhite = _ref8$isWhite === void 0 ? "N" : _ref8$isWhite;
  return (
    /*#__PURE__*/
    function () {
      var _ref9 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(dispatch, getStore) {
        var showQl, channel, isRecommend, result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (!(isWhite === "Y")) {
                  _context10.next = 2;
                  break;
                }

                return _context10.abrupt("return", false);

              case 2:
                showQl = "N";
                channel = "101"; // 是否首页和推荐页进来

                isRecommend = /.*(recommend|subscribe\-period\-time).*/.test(sessionStorage.getItem("trace_page")); // 先判断是否关注千聊

                if (!subscribe && isShowQl) {
                  showQl = "Y";
                  channel = channelCode;
                } // 在判断是否关注第三方，优先第三方


                if (isBindThird && !isFocusThree) {
                  showQl = "N";
                  channel = 101;
                } // 从首页和推荐页或者三方进来，只获取千聊


                if (isRecommend) {
                  channel = channelCode;
                  showQl = "Y";
                } // 如果是专业版并且不是从三方进来


                if (!(isLiveAdmin === "Y")) {
                  _context10.next = 16;
                  break;
                }

                if (!(isBindThird && !isFocusThree)) {
                  _context10.next = 13;
                  break;
                }

                showQl = "N";
                _context10.next = 14;
                break;

              case 13:
                return _context10.abrupt("return", false);

              case 14:
                _context10.next = 23;
                break;

              case 16:
                if (!isRecommend) {
                  _context10.next = 21;
                  break;
                }

                if (!subscribe) {
                  _context10.next = 19;
                  break;
                }

                return _context10.abrupt("return", false);

              case 19:
                _context10.next = 23;
                break;

              case 21:
                if (!(subscribe && !isBindThird || subscribe && isBindThird && isFocusThree && isShowQl || isBindThird && isFocusThree && !isShowQl)) {
                  _context10.next = 23;
                  break;
                }

                return _context10.abrupt("return", false);

              case 23:
                _context10.next = 25;
                return dispatch(getQr({
                  channel: channel,
                  channelId: channelId,
                  liveId: liveId,
                  topicId: topicId,
                  showQl: showQl,
                  showLoading: showLoading
                }));

              case 25:
                result = _context10.sent;

                if (isFirstMsg && result && result.state.code == 0) {
                  dispatch({
                    type: FIRST_MSG_CODE,
                    url: result.data.qrUrl
                  });
                }

                return _context10.abrupt("return", result);

              case 28:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x21, _x22) {
        return _ref9.apply(this, arguments);
      };
    }()
  );
}
/**
 * 获取二维码
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */


function getQr(_ref10) {
  var channel = _ref10.channel,
      channelId = _ref10.channelId,
      liveId = _ref10.liveId,
      _ref10$toUserId = _ref10.toUserId,
      toUserId = _ref10$toUserId === void 0 ? "" : _ref10$toUserId,
      topicId = _ref10.topicId,
      showQl = _ref10.showQl,
      _ref10$showLoading = _ref10.showLoading,
      showLoading = _ref10$showLoading === void 0 ? false : _ref10$showLoading,
      others = _objectWithoutProperties(_ref10, ["channel", "channelId", "liveId", "toUserId", "topicId", "showQl", "showLoading"]);

  return function (dispatch, getStore) {
    return api({
      dispatch: dispatch,
      getStore: getStore,
      showLoading: showLoading,
      url: "/api/wechat/get-qrcode",
      body: _objectSpread({
        channel: channel,
        channelId: channelId,
        liveId: liveId,
        toUserId: toUserId,
        topicId: topicId,
        showQl: showQl
      }, others)
    });
  };
}
/**
 * 根据话题获取千聊二维码
 *
 * @param {string} topicId
 * @returns
 */


function getTopicQr(topicId, showQl) {
  return function (dispatch, getStore) {
    return api({
      dispatch: dispatch,
      getStore: getStore,
      showLoading: false,
      url: "/api/wechat/get-topic-qrcode",
      body: {
        topicId: topicId,
        showQl: showQl
      }
    });
  };
}
/**
 *  优化支付接口调用
 *  
 *  下单接口包含的参数：
 *  missionId,liveId,channelId,campId,topicId,userId,toUserId,
 *  channelNo,total_fee,totalCount,type,payType,chargeConfigId,
 *  docId,giftCount,ifboth,isWall,questionId,questionPerson,
 *  relayInviteId,shareKey,groupId,source,toRelayLiveId,couponId,
 *  couponType,ch,isFromWechatCouponPage,officialKey,description,
 *  redEnvelopeId,psKey,psCh,inviteMemberId
 * 
 */


function doPay(params) {
  return (
    /*#__PURE__*/
    function () {
      var _ref11 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11(dispatch, getStore) {
        var _params$total_fee, total_fee, _params$channelNo, channelNo, _params$ifboth, ifboth, _params$source, source, _params$url, url, _params$callback, callback, _params$onPayFree, onPayFree, _params$onCancel, onCancel, bodys, res, order, onBridgeReady;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _params$total_fee = params.total_fee, total_fee = _params$total_fee === void 0 ? 0 : _params$total_fee, _params$channelNo = params.channelNo, channelNo = _params$channelNo === void 0 ? "qldefault" : _params$channelNo, _params$ifboth = params.ifboth, ifboth = _params$ifboth === void 0 ? _detect.default.os.weixin && (_detect.default.os.android || _detect.default.os.ios) ? "Y" : "N" : _params$ifboth, _params$source = params.source, source = _params$source === void 0 ? "web" : _params$source, _params$url = params.url, url = _params$url === void 0 ? "/api/wechat/make-order" : _params$url, _params$callback = params.callback, callback = _params$callback === void 0 ? function () {} : _params$callback, _params$onPayFree = params.onPayFree, onPayFree = _params$onPayFree === void 0 ? function () {} : _params$onPayFree, _params$onCancel = params.onCancel, onCancel = _params$onCancel === void 0 ? function () {} : _params$onCancel; // 删除不用传递的参数

                bodys = params;
                delete bodys.url;
                delete bodys.callback;
                delete bodys.onPayFree;
                delete bodys.onCancel;
                bodys = _objectSpread({
                  channelNo: channelNo
                }, bodys, {
                  total_fee: (total_fee * 100).toFixed(0),
                  source: source,
                  ifboth: ifboth // 判断知否支付中

                });

                if (!inPay) {
                  _context11.next = 9;
                  break;
                }

                return _context11.abrupt("return", false);

              case 9:
                inPay = true;
                console.log("开始支付啦！！！！！！！");
                _context11.next = 13;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showWarningTips: false,
                  method: "POST",
                  url: url,
                  body: bodys,
                  errorResolve: true
                });

              case 13:
                res = _context11.sent;
                // 恢复可支付状态
                inPay = false;

                if (!(res.state.code == 0)) {
                  _context11.next = 22;
                  break;
                }

                window._qla && _qla('event', {
                  category: 'wechatPay',
                  action: 'start'
                });
                order = res.data.orderResult; // 只有在安卓和ios下才能吊起微信支付

                console.log(order, "order=======");

                if (!(_detect.default.os.weixin && (_detect.default.os.android || _detect.default.os.ios))) {
                  dispatch(togglePayDialog(true, order.qcodeId, order.qcodeUrl));
                  selectPayResult(order.qcodeId, function () {
                    typeof callback == "function" && callback(order.qcodeId);
                    dispatch(togglePayDialog(false));
                  });
                } else {
                  onBridgeReady = function onBridgeReady(data) {
                    console.log(data, 'data');
                    WeixinJSBridge.invoke("getBrandWCPayRequest", {
                      appId: data.appId,
                      timeStamp: data.timeStamp,
                      nonceStr: data.nonceStr,
                      package: data.packageValue,
                      signType: data.signType,
                      paySign: data.paySign
                    }, function (result) {
                      console.log("调起支付支付回调 == ", JSON.stringify(result));

                      if (result.err_msg == "get_brand_wcpay_request:ok") {
                        selectPayResult(order.orderId, function () {
                          typeof callback == "function" && callback(order.orderId);
                        });
                      } else if (result.err_msg == "get_brand_wcpay_request:fail") {
                        dispatch(togglePayDialog(true, order.qcodeId, order.qcodeUrl));
                        selectPayResult(order.qcodeId, function () {
                          dispatch(togglePayDialog(false));
                          typeof callback == "function" && callback(order.qcodeId);
                        });
                      } else if (result.err_msg == "get_brand_wcpay_request:cancel") {
                        window.toast("已取消付费");
                        onCancel && onCancel();
                        window._qla && _qla('event', {
                          category: 'wechatPay',
                          action: 'fail'
                        });
                      }
                    });
                  }; // 监听付款回调


                  if (typeof window.WeixinJSBridge === "undefined") {
                    console.log('回调1');
                    document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
                  } else {
                    console.log('回调2');
                    onBridgeReady(order);
                  }
                }

                _context11.next = 28;
                break;

              case 22:
                if (!(res.state.code == 20012)) {
                  _context11.next = 26;
                  break;
                }

                onPayFree && onPayFree(res);
                _context11.next = 28;
                break;

              case 26:
                if (res.state && res.state.msg) {
                  window.toast(res.state.msg);
                }

                return _context11.abrupt("return", res);

              case 28:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x23, _x24) {
        return _ref11.apply(this, arguments);
      };
    }()
  );
}

function selectPayResult(orderId, done) {
  if (!window.selectPayResultCount) {
    window.selectPayResultCount = 1;
  }

  console.log("支付回调次数 ==== ", window.selectPayResultCount);
  (0, _isomorphicFetch.default)("/api/wechat/selectResult?orderId=" + orderId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    credentials: "include"
  }).then(function (res) {
    return res.json();
  }).then(function (json) {
    console.log("支付回调 == ", JSON.stringify(json));

    if (json.state.code == 0) {
      window.selectPayResultCount = 1;
      done();
      window._qla && _qla('event', {
        category: 'commonWechatPay',
        action: 'success'
      });
    } else {
      window.payDialogTimer = setTimeout(function () {
        if (window.selectPayResultCount < 40) {
          window.selectPayResultCount += 1;
          selectPayResult(orderId, done);
        } else {
          window.selectPayResultCount = 1;
        }
      }, 3000);
    }
  });
} // 开关二维码弹框


function togglePayDialog(show, qcodeId, qcodeUrl) {
  return {
    type: TOGGLE_PAYMENT_DIALOG,
    show: show,
    qcodeId: qcodeId,
    qcodeUrl: qcodeUrl
  };
} // 手动关闭支付二维码弹框


function cancelPayDialog() {
  if (window.payDialogTimer) {
    clearTimeout(window.payDialogTimer);
  }

  window.selectPayResultCount = 1;
  window._qla && _qla('event', {
    category: 'wechatPay',
    action: 'fail'
  });
  return (
    /*#__PURE__*/
    function () {
      var _ref12 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12(dispatch, getStore) {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                dispatch(togglePayDialog(false));

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function (_x25, _x26) {
        return _ref12.apply(this, arguments);
      };
    }()
  );
} // 获取系统时间


function getSysTime() {
  return (
    /*#__PURE__*/
    function () {
      var _ref13 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee13(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  url: "/api/base/sys-time",
                  method: "GET",
                  showLoading: false,
                  body: {}
                });

              case 2:
                result = _context13.sent;
                return _context13.abrupt("return", result);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function (_x27, _x28) {
        return _ref13.apply(this, arguments);
      };
    }()
  );
}

function getServerTime() {
  return request({
    url: "/api/base/sys-time"
  }).then(function (res) {
    if (res.state.code) throw Error(res.state.msg);
    return res.data.sysTime;
  }).catch(function (err) {
    return Date.now();
  });
}

function fetchAndUpdateSysTime() {
  return (
    /*#__PURE__*/
    function () {
      var _ref14 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee14(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  url: "/api/base/sys-time",
                  method: "GET",
                  showLoading: false,
                  body: {}
                });

              case 2:
                result = _context14.sent;
                dispatch({
                  type: SYSTIME,
                  sysTime: result.data.sysTime
                });
                return _context14.abrupt("return", result);

              case 5:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function (_x29, _x30) {
        return _ref14.apply(this, arguments);
      };
    }()
  );
} // 请求封装


function api(_ref15) {
  var _ref15$dispatch = _ref15.dispatch,
      dispatch = _ref15$dispatch === void 0 ? function () {} : _ref15$dispatch,
      _ref15$getStore = _ref15.getStore,
      getStore = _ref15$getStore === void 0 ? function () {} : _ref15$getStore,
      url = _ref15.url,
      _ref15$method = _ref15.method,
      method = _ref15$method === void 0 ? "GET" : _ref15$method,
      _ref15$body = _ref15.body,
      body = _ref15$body === void 0 ? {} : _ref15$body,
      _ref15$showWarningTip = _ref15.showWarningTips,
      showWarningTips = _ref15$showWarningTip === void 0 ? true : _ref15$showWarningTip,
      _ref15$showLoading = _ref15.showLoading,
      showLoading = _ref15$showLoading === void 0 ? true : _ref15$showLoading,
      _ref15$errorResolve = _ref15.errorResolve,
      errorResolve = _ref15$errorResolve === void 0 ? false : _ref15$errorResolve;
  return new Promise(function (resolve, reject) {
    !!showLoading && dispatch(loading(true));
    url = method === "GET" ? "".concat(url, "?").concat((0, _querystring.encode)(body)) : url;
    (0, _isomorphicFetch.default)(url, {
      method: method,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      credentials: "include",
      body: method === "POST" ? JSON.stringify(body) : null
    }).then(function (res) {
      return res.json();
    }).then(function (json) {
      !!showLoading && dispatch(loading(false)); // console.log(json);

      if (!json.state || !json.state.code && json.state.code != 0) {
        console.error("错误的返回格式");
      }

      switch (json.state.code) {
        case 0:
          resolve(json);
          break;

        case 110:
          if (json.data && json.data.url) {
            var redirect_url = window.location.href;
            window.location.replace("/api/wx/login?redirect_url=" + encodeURIComponent(redirect_url));
          }

          break;

        case 20001:
          reject(json);
          break;

        case 10001:
          resolve(json);
          break;

        case 20005:
          // 未登录
          break;

        case 50004:
          // 该CODE已被使用
          resolve(json);
          break;

        case 20012:
          // 免费支付
          resolve(json);
          break;

        case 50005:
          // 已经是管理员
          resolve(json);
          break;

        default:
          if (errorResolve) {
            resolve(json);
          }

          showWarningTips && window.toast(json.state.msg);
          break;
      }
    }).catch(function (err) {
      console.error(err);

      if (errorResolve) {
        resolve(err);
      }

      !!showLoading && dispatch(loading(false));
    });
  });
}

function getCreateLiveStatus(topicId) {
  return (
    /*#__PURE__*/
    function () {
      var _ref16 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee15(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: "POST",
                  showLoading: false,
                  url: "/api/wechat/user/getCreateLiveStatus",
                  body: {
                    topicId: topicId
                  }
                });

              case 2:
                result = _context15.sent;
                return _context15.abrupt("return", result);

              case 4:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      return function (_x31, _x32) {
        return _ref16.apply(this, arguments);
      };
    }()
  );
}

function isLiveAdmin(liveId) {
  return (
    /*#__PURE__*/
    function () {
      var _ref17 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee16(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: "/api/wechat/studio/is-live-admin",
                  body: {
                    liveId: liveId
                  }
                });

              case 2:
                result = _context16.sent;
                return _context16.abrupt("return", result);

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      return function (_x33, _x34) {
        return _ref17.apply(this, arguments);
      };
    }()
  );
}
/* 获取是否三方白名单 */


function isThirdPartyWhite(params) {
  return (
    /*#__PURE__*/
    function () {
      var _ref18 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee17(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: "POST",
                  showLoading: false,
                  url: "/api/wechat/thirdParty/isWhite",
                  body: params
                });

              case 2:
                result = _context17.sent;
                return _context17.abrupt("return", result);

              case 4:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      return function (_x35, _x36) {
        return _ref18.apply(this, arguments);
      };
    }()
  );
}
/* 官方课代表绑定临时关系 */


function bindOfficialKey(params) {
  return (
    /*#__PURE__*/
    function () {
      var _ref19 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee18(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: "POST",
                  showLoading: false,
                  url: "/api/wechat/coral/bindUserRef",
                  body: params
                });

              case 2:
                result = _context18.sent;
                return _context18.abrupt("return", result);

              case 4:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      return function (_x37, _x38) {
        return _ref19.apply(this, arguments);
      };
    }()
  );
}
/**
 * 绑定直播间分销关系
 * @return {[type]} [description]
 */


function bindLiveShare(liveId, shareKey) {
  return (
    /*#__PURE__*/
    function () {
      var _ref20 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee19(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: "POST",
                  showLoading: false,
                  url: "/api/wechat/channel/bind-live-share",
                  body: {
                    liveId: liveId,
                    shareKey: shareKey
                  }
                });

              case 2:
                result = _context19.sent;
                return _context19.abrupt("return", result);

              case 4:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      return function (_x39, _x40) {
        return _ref20.apply(this, arguments);
      };
    }()
  );
}
/* 获取官方课代表身份 */


function getMyCoralIdentity(params) {
  return (
    /*#__PURE__*/
    function () {
      var _ref21 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee20(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: "/api/wechat/coral/getMyIdentity",
                  body: params
                });

              case 2:
                result = _context20.sent;
                return _context20.abrupt("return", result);

              case 4:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      return function (_x41, _x42) {
        return _ref21.apply(this, arguments);
      };
    }()
  );
}
/**
 * 获取课程支付后跳转链接
 * @param {*} param0 {
 *  businessId: 系列课/话题Id
 *  type: channel/topic
 * }
 */


function getCousePayPaster(_ref22) {
  var businessId = _ref22.businessId,
      type = _ref22.type;
  return function (dispatch, getStore) {
    return api({
      dispatch: dispatch,
      getStore: getStore,
      showLoading: false,
      url: "/api/wechat/getCousePayPaster",
      body: {
        businessId: businessId,
        type: type
      }
    });
  };
}
/**
 * 获取官方直播间列表
 */


function getOfficialLiveIds() {
  return (
    /*#__PURE__*/
    function () {
      var _ref23 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee21(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: "/api/wechat/live/authorities",
                  body: {}
                });

              case 2:
                result = _context21.sent;

                if (!(result.state.code == 0)) {
                  _context21.next = 6;
                  break;
                }

                dispatch({
                  type: GET_OFFICIAL_LIVE_IDS,
                  data: result.data
                });
                return _context21.abrupt("return", result);

              case 6:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      return function (_x43, _x44) {
        return _ref23.apply(this, arguments);
      };
    }()
  );
}
/**
 * 根据接口地址及参数构造本地缓存唯一健值
 * @param  {Object} opt                 request请求的option对象
 *   opt.cacheWithoutKeys    不作缓存健值生成策略参考的参数key的列表
 * @return {String}             请求的唯一标识字符串
 */


function getCacheKeyString(opt) {
  var cacheWithoutKeys = opt.cacheWithoutKeys || [],
      pairs = [];

  for (var key in opt.body) {
    var value = opt.body[key];

    if (cacheWithoutKeys.indexOf(key) < 0) {
      pairs.push(key + "=" + JSON.stringify(value));
    }
  }

  return "_request_data_".concat(opt.url, "?").concat(pairs.join("&"), "&").concat((opt.method || "").toLowerCase());
}

function request(_ref24) {
  var url = _ref24.url,
      _ref24$method = _ref24.method,
      method = _ref24$method === void 0 ? "GET" : _ref24$method,
      _ref24$body = _ref24.body,
      body = _ref24$body === void 0 ? {} : _ref24$body,
      _ref24$throwWhenInval = _ref24.throwWhenInvalid,
      throwWhenInvalid = _ref24$throwWhenInval === void 0 ? false : _ref24$throwWhenInval,
      _ref24$memoryCache = _ref24.memoryCache,
      memoryCache = _ref24$memoryCache === void 0 ? false : _ref24$memoryCache,
      _ref24$sessionCache = _ref24.sessionCache,
      sessionCache = _ref24$sessionCache === void 0 ? false : _ref24$sessionCache,
      _ref24$localCache = _ref24.localCache,
      localCache = _ref24$localCache === void 0 ? false : _ref24$localCache,
      _ref24$refreshCache = _ref24.refreshCache,
      refreshCache = _ref24$refreshCache === void 0 ? false : _ref24$refreshCache,
      _ref24$signal = _ref24.signal,
      signal = _ref24$signal === void 0 ? undefined : _ref24$signal;
  var cacheKey = getCacheKeyString({
    url: url,
    method: method,
    body: body
  });

  if (refreshCache) {// 暂时没有清空的需要，以后有再加
  } else {
    if (memoryCache) {
      if (request.memoryCache[cacheKey]) {
        return request.memoryCache[cacheKey];
      }
    } else if (sessionCache) {
      try {
        var data = JSON.parse(sessionStorage.getItem(cacheKey));

        if (data) {
          return Promise.resolve(data);
        }
      } catch (e) {}
    } else if (localCache) {
      var _data = (0, _util.getLocalStorage)(cacheKey);

      if (_data) {
        return Promise.resolve(_data);
      }
    }
  }

  url = method === "GET" ? "".concat(url, "?").concat((0, _querystring.encode)(body)) : url;
  var fetchRes = (0, _isomorphicFetch.default)(url, {
    method: method,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    credentials: "include",
    body: method === "POST" ? JSON.stringify(body) : null,
    signal: signal
  }).then(
  /*#__PURE__*/
  function () {
    var _ref25 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee22(res) {
      var resultText, resultJson, redirect_url;
      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return res.text();

            case 2:
              resultText = _context22.sent;
              resultJson = null;
              _context22.prev = 4;
              resultJson = JSON.parse(resultText);
              _context22.next = 14;
              break;

            case 8:
              _context22.prev = 8;
              _context22.t0 = _context22["catch"](4);
              console.warn("返回的格式不是json格式 --- ", resultText);

              if (!throwWhenInvalid) {
                _context22.next = 13;
                break;
              }

              throw new Error("服务器返回错误");

            case 13:
              return _context22.abrupt("return", resultText);

            case 14:
              _context22.t1 = (0, _util.getVal)(resultJson, "state.code");
              _context22.next = _context22.t1 === 0 ? 17 : _context22.t1 === 110 ? 19 : 21;
              break;

            case 17:
              // code等于0时保存缓存
              if (sessionCache) {
                try {
                  sessionStorage.setItem(cacheKey, JSON.stringify(resultJson));
                } catch (e) {}
              } else if (localCache && isResponseCanCache(resultJson)) {
                (0, _util.setLocalStorage)(cacheKey, resultJson, typeof localCache === "number" ? localCache : false);
              }

              return _context22.abrupt("break", 23);

            case 19:
              if (resultJson.data && resultJson.data.url) {
                redirect_url = window.location.href;
                window.location.replace("/api/wx/login?redirect_url=" + encodeURIComponent(redirect_url));
              }

              return _context22.abrupt("return", false);

            case 21:
              if (!throwWhenInvalid) {
                _context22.next = 23;
                break;
              }

              throw new Error(typeof resultJson === "string" ? "服务器返回错误" : resultJson.state.msg);

            case 23:
              return _context22.abrupt("return", resultJson);

            case 24:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22, this, [[4, 8]]);
    }));

    return function (_x45) {
      return _ref25.apply(this, arguments);
    };
  }());

  if (memoryCache) {
    // 如果使用内存缓存，把fetch返回的Promise存起来
    request.memoryCache[cacheKey] = fetchRes;
  }

  return fetchRes;
}

request.memoryCache = {};

request.post = function (options) {
  return request(_objectSpread({
    method: "POST",
    throwWhenInvalid: true
  }, options));
};

request.get = function (options) {
  return request(_objectSpread({
    method: "GET",
    throwWhenInvalid: true
  }, options));
};

function isResponseCanCache(json) {
  // 状态异常不缓存
  if (!json || !json.state || json.state.code != 0) {
    return false;
  }

  var data = json.data;

  if ("object" === _typeof(data)) {
    if (!Object.keys(data).length) {
      return false;
    }
  }

  return true;
}
/**
 * 开放平台用户绑定
 *
 * @export
 * @param {any} params
 * @returns
 */


function userBindKaiFang(params) {
  return (
    /*#__PURE__*/
    function () {
      var _ref26 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee23(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return request({
                  url: "/api/wechat/live/userBindKaiFang",
                  body: params,
                  method: "POST"
                });

              case 2:
                result = _context23.sent;
                return _context23.abrupt("return", result);

              case 4:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      return function (_x46, _x47) {
        return _ref26.apply(this, arguments);
      };
    }()
  );
}
/* 获取独立域名 */


function getDomainUrl(params) {
  return (
    /*#__PURE__*/
    function () {
      var _ref27 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee24(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: "POST",
                  showLoading: false,
                  url: "/api/wechat/getDomainUrl",
                  body: params
                });

              case 2:
                result = _context24.sent;
                return _context24.abrupt("return", result);

              case 4:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      return function (_x48, _x49) {
        return _ref27.apply(this, arguments);
      };
    }()
  );
}
/**
 * 获取是否服务号白名单
 * @param {string} liveId 直播间ID
 */


function isServiceWhiteLive(liveId) {
  return function (dispatch, getStore) {
    return api({
      dispatch: dispatch,
      getStore: getStore,
      method: "GET",
      showLoading: false,
      url: "/api/wechat/live/isServiceWhiteLive",
      body: {
        liveId: liveId
      }
    });
  };
}
/**
 * 获取官方直播间列表
 * @param {string} liveId 直播间ID
 */


function getQlLiveIds() {
  return function (dispatch, getStore) {
    return api({
      dispatch: dispatch,
      getStore: getStore,
      method: "GET",
      showLoading: false,
      url: "/api/wechat/live/getQlLiveIds",
      body: {}
    });
  };
}
/**
 * 初始化AppopenId
 * @param {string} appOpenId
 */


function initAppOpenId(appOpenId) {
  return {
    type: INIT_APP_OPENID,
    appOpenId: appOpenId
  };
}
/**
 * 获取是否购买了vip会员可以访问该课程
 * @param type topic | channel
 */


function userIsOrNotCustomVip(liveId, businessId) {
  return (
    /*#__PURE__*/
    function () {
      var _ref28 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee25(dispatch, getStore) {
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                return _context25.abrupt("return", api({
                  dispatch: dispatch,
                  getStore: getStore,
                  url: "/api/wechat/vip/userIsOrNotCustomVip",
                  method: "POST",
                  showLoading: false,
                  isErrorReject: true,
                  body: {
                    liveId: liveId,
                    businessId: businessId
                  }
                }));

              case 1:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      return function (_x50, _x51) {
        return _ref28.apply(this, arguments);
      };
    }()
  );
}
/**
 * 初始化订阅状态
 * @param {string} liveId 直播间ID
 * @param {string} auditStatus 第三方带过来的参数
 */


function subscribeStatus(liveId, auditStatus) {
  return (
    /*#__PURE__*/
    function () {
      var _ref29 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee26(dispatch, getStore) {
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                return _context26.abrupt("return", api({
                  dispatch: dispatch,
                  getStore: getStore,
                  url: "/api/wechat/channel/live-focus",
                  method: "GET",
                  showLoading: false,
                  body: {
                    status: "Y",
                    liveId: liveId,
                    auditStatus: auditStatus
                  }
                }));

              case 1:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      return function (_x52, _x53) {
        return _ref29.apply(this, arguments);
      };
    }()
  );
} // 是否关注直播间


function isFollow(liveId) {
  return (
    /*#__PURE__*/
    function () {
      var _ref30 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee27(dispatch, getStore) {
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                return _context27.abrupt("return", api({
                  dispatch: dispatch,
                  getStore: getStore,
                  url: "/api/wechat/live/is-follow",
                  method: "POST",
                  showLoading: false,
                  body: {
                    liveId: liveId
                  }
                }));

              case 1:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      return function (_x54, _x55) {
        return _ref30.apply(this, arguments);
      };
    }()
  );
}
/**
 * 获取课程支付后跳转链接
 * @param {*} param0 {
 *  businessId: 系列课/话题Id
 *  type: channel/topic
 * }
 */


function ifGetCousePayPasterLink(_ref31) {
  var businessId = _ref31.businessId,
      type = _ref31.type;
  return (
    /*#__PURE__*/
    function () {
      var _ref32 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee28(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: "/api/wechat/getCousePayPaster",
                  body: {
                    businessId: businessId,
                    type: type
                  }
                });

              case 2:
                result = _context28.sent;

                if (!(result.state.code === 0 && result.data && result.data.link)) {
                  _context28.next = 7;
                  break;
                }

                return _context28.abrupt("return", result.data.link);

              case 7:
                return _context28.abrupt("return", false);

              case 8:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      return function (_x56, _x57) {
        return _ref32.apply(this, arguments);
      };
    }()
  );
}

function handleBackgroundConf(_x58, _x59, _x60) {
  return _handleBackgroundConf.apply(this, arguments);
}
/**
 * 支付报名成功后引导关注千聊
 * 1、首先判断是否为白名单，是白名单的再判断是否绑定三方，没绑定就不弹任何公众号，绑定的话就只弹三方。
 * 2、不是白名单的去判断是否是（千聊课程&&直播中心来源），是的话只弹千聊，不是的话先弹千聊，再去查配置。
 * 3、查配置的话判断配置的公众号是否已经关注，全都关注的话不走后面流程，有未关注的直接引导关注当前第一个未关注的配置公众号。
 * 4、必传参数为channel和liveId
 */


function _handleBackgroundConf() {
  _handleBackgroundConf = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee43(channel, liveId, options) {
    var result, resultData, qlLiveId, appIdList, liveIdList, appId, res, liveIdListResult, liveIdObj, qrObj;
    return regeneratorRuntime.wrap(function _callee43$(_context43) {
      while (1) {
        switch (_context43.prev = _context43.next) {
          case 0:
            _context43.next = 2;
            return api({
              url: "/api/wechat/live/getOpsAppIdSwitchConf",
              method: "GET",
              body: {
                channel: channel,
                liveId: liveId
              }
            });

          case 2:
            result = _context43.sent;
            resultData = result.data || {};

            if (!(resultData.isHasConf === "Y")) {
              _context43.next = 21;
              break;
            }

            qlLiveId = ""; // 获取appId列表

            appIdList = []; // 获取liveid列表

            liveIdList = [];
            resultData.appBindLiveInfo.forEach(function (item) {
              if (item.isQlAppId == "Y") {
                qlLiveId = item.bindLiveId;
              }

              appIdList.push(item.appId);
              liveIdList.push(item.bindLiveId);
            });
            appId = "";
            _context43.next = 12;
            return getIsSubscribe(liveIdList);

          case 12:
            res = _context43.sent;
            liveIdListResult = res.data.liveIdListResult;
            liveIdObj = liveIdListResult.find(function (item, index) {
              if (item.liveId == qlLiveId) {
                if (!item.isShowQl && !item.subscribe) {
                  appId = appIdList[index];
                  return true;
                }
              } else if (!item.isFocusThree) {
                appId = appIdList[index];
                return true;
              }
            }); // 如果有未关注的三方导粉公众号

            if (!(liveIdObj != undefined)) {
              _context43.next = 21;
              break;
            }

            _context43.next = 18;
            return api({
              url: "/api/wechat/live/get-qr",
              method: "GET",
              body: _objectSpread({}, options, {
                liveId: liveId,
                appId: appId,
                channel: channel,
                showQl: "N"
              })
            });

          case 18:
            qrObj = _context43.sent;

            if (!(qrObj && qrObj.state.code === 0)) {
              _context43.next = 21;
              break;
            }

            return _context43.abrupt("return", qrObj.data);

          case 21:
            return _context43.abrupt("return", false);

          case 22:
          case "end":
            return _context43.stop();
        }
      }
    }, _callee43, this);
  }));
  return _handleBackgroundConf.apply(this, arguments);
}

function subAterSign(_x61, _x62) {
  return _subAterSign.apply(this, arguments);
}
/**
 * 判断是否关注训练营公众号且返回二维码
 * 训练营公众号固定为某个直播间的三方公众号，所以通过三方公众号接口判断是否关注和请求二维码
 * 
 * @param {*} options
 * @returns
 */


function _subAterSign() {
  _subAterSign = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee44(channel, liveId) {
    var options,
        isWhite,
        subscribeData,
        isBindThird,
        isFocusThree,
        isSubscribe,
        qr,
        isLiveAdmin,
        _qr,
        qurl,
        backgroundConf,
        _qr2,
        _args44 = arguments;

    return regeneratorRuntime.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            options = _args44.length > 2 && _args44[2] !== undefined ? _args44[2] : {
              channelId: undefined,
              topicId: undefined,
              toUserId: "",
              campId: "",
              communityCode: "",
              isCampAndHasPeriod: false,
              campLiveId: ""
            };
            console.log("开始subater"); // 是否配置链接，有就直接跳走

            _context44.next = 4;
            return ifGetCousePayPasterLink({
              businessId: options.channelId ? options.channelId : options.topicId,
              type: options.channelId ? "channel" : "topic"
            });

          case 4:
            // 如果是训练营，则推送的channel为campAuth;
            if (options.isNewCamp) {
              channel = 'campAuth';
              options.pubBusinessId = options.channelId;
            } // 新训练营(如果是直播中心来源或者官方直播间)优先逻辑


            if (!(options.isNewCamp && (options.isOfficialLive || (0, _util.isFromLiveCenter)()))) {
              _context44.next = 7;
              break;
            }

            return _context44.abrupt("return", getCampQrcode(options));

          case 7:
            if (!(0, _util.isFromLiveCenter)()) {
              _context44.next = 11;
              break;
            }

            _context44.next = 10;
            return handleBackgroundConf(channel, liveId, options);

          case 10:
            return _context44.abrupt("return", _context44.sent);

          case 11:
            _context44.next = 13;
            return isServerWhite({
              liveId: liveId
            });

          case 13:
            isWhite = _context44.sent;
            _context44.next = 16;
            return fetchSubscribeStatus({
              liveId: liveId
            });

          case 16:
            subscribeData = _context44.sent;
            isBindThird = convertType((0, _util.getVal)(subscribeData, "data.isBindThird", "N"));
            isFocusThree = convertType((0, _util.getVal)(subscribeData, "data.isFocusThree", "N"));
            isSubscribe = (0, _util.getVal)(subscribeData, "data.subscribe", false);
            console.log("\n        \u767D\u540D\u5355\uFF1A".concat(isWhite && isWhite.data.isWhite === "Y", "\n        \u5BF9\u63A5\u4E09\u65B9: ").concat(isBindThird, "\n        \u5173\u6CE8\u4E09\u65B9: ").concat(isFocusThree, "\n        \u5173\u6CE8\u5927\u53F7: ").concat(isSubscribe, "\n    ")); // 首先判断是否是白名单，是白名单的话只弹出三方的码

            if (!(isWhite && isWhite.data.isWhite === "Y")) {
              _context44.next = 38;
              break;
            }

            if (!(isBindThird == "Y")) {
              _context44.next = 33;
              break;
            }

            if (!(isFocusThree == "N")) {
              _context44.next = 30;
              break;
            }

            _context44.next = 26;
            return onlyThird(isFocusThree, _objectSpread({}, options, {
              liveId: liveId,
              channel: channel,
              subscribe: isSubscribe
            }));

          case 26:
            qr = _context44.sent;
            return _context44.abrupt("return", {
              qrUrl: qr && qr.url,
              appId: qr && qr.appId
            });

          case 30:
            return _context44.abrupt("return", false);

          case 31:
            _context44.next = 38;
            break;

          case 33:
            if (!options.isNewCamp) {
              _context44.next = 37;
              break;
            }

            return _context44.abrupt("return", getCampQrcode(options));

          case 37:
            return _context44.abrupt("return", false);

          case 38:
            _context44.next = 40;
            return getLiveAdmin(liveId);

          case 40:
            isLiveAdmin = _context44.sent;

            if (!(isLiveAdmin == "Y" && options.isNewCamp)) {
              _context44.next = 61;
              break;
            }

            if (!(isBindThird == "Y")) {
              _context44.next = 54;
              break;
            }

            if (!(isFocusThree == "N")) {
              _context44.next = 50;
              break;
            }

            _context44.next = 46;
            return onlyThird(isFocusThree, _objectSpread({}, options, {
              liveId: liveId,
              channel: channel,
              subscribe: isSubscribe
            }));

          case 46:
            _qr = _context44.sent;
            return _context44.abrupt("return", {
              qrUrl: _qr && _qr.url,
              appId: _qr && _qr.appId
            });

          case 50:
            if (!options.isNewCamp) {
              _context44.next = 52;
              break;
            }

            return _context44.abrupt("return", getCampQrcode(options));

          case 52:
            _context44.next = 56;
            break;

          case 54:
            if (!options.isNewCamp) {
              _context44.next = 56;
              break;
            }

            return _context44.abrupt("return", getCampQrcode(options));

          case 56:
            _context44.next = 58;
            return handleBackgroundConf(channel, liveId, options);

          case 58:
            return _context44.abrupt("return", _context44.sent);

          case 61:
            if (!options.isNewCamp) {
              _context44.next = 67;
              break;
            }

            _context44.next = 64;
            return getCampQrcode(options);

          case 64:
            qurl = _context44.sent;

            if (!qurl) {
              _context44.next = 67;
              break;
            }

            return _context44.abrupt("return", qurl);

          case 67:
            _context44.next = 69;
            return handleBackgroundConf(channel, liveId, options);

          case 69:
            backgroundConf = _context44.sent;

            if (!backgroundConf) {
              _context44.next = 72;
              break;
            }

            return _context44.abrupt("return", backgroundConf);

          case 72:
            if (!(isBindThird == "Y")) {
              _context44.next = 79;
              break;
            }

            if (!(isFocusThree == "N")) {
              _context44.next = 78;
              break;
            }

            _context44.next = 76;
            return onlyThird(isFocusThree, _objectSpread({}, options, {
              liveId: liveId,
              channel: channel,
              subscribe: isSubscribe
            }));

          case 76:
            _qr2 = _context44.sent;
            return _context44.abrupt("return", {
              qrUrl: _qr2 && _qr2.url,
              appId: _qr2 && _qr2.appId
            });

          case 78:
            return _context44.abrupt("return", false);

          case 79:
          case "end":
            return _context44.stop();
        }
      }
    }, _callee44, this);
  }));
  return _subAterSign.apply(this, arguments);
}

function getCampQrcode(_x63) {
  return _getCampQrcode.apply(this, arguments);
}

function _getCampQrcode() {
  _getCampQrcode = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee45(options) {
    var campSubscribeData, campIsFocusThree, qrUrl;
    return regeneratorRuntime.wrap(function _callee45$(_context45) {
      while (1) {
        switch (_context45.prev = _context45.next) {
          case 0:
            _context45.next = 2;
            return fetchSubscribeStatus({
              liveId: options.campLiveId
            });

          case 2:
            campSubscribeData = _context45.sent;
            campIsFocusThree = convertType((0, _util.getVal)(campSubscribeData, "data.isFocusThree", "N"));

            if (!(campIsFocusThree === "N")) {
              _context45.next = 13;
              break;
            }

            console.log("新训练营，没有关注三方号");
            _context45.next = 8;
            return api({
              url: "/api/wechat/live/get-qr",
              method: "GET",
              body: {
                pubBusinessId: options.channelId,
                liveId: options.campLiveId,
                channel: "campAuth",
                showQl: "N"
              }
            });

          case 8:
            qrUrl = _context45.sent;

            if (!(qrUrl && qrUrl.state.code === 0)) {
              _context45.next = 11;
              break;
            }

            return _context45.abrupt("return", qrUrl.data);

          case 11:
            _context45.next = 14;
            break;

          case 13:
            return _context45.abrupt("return", false);

          case 14:
          case "end":
            return _context45.stop();
        }
      }
    }, _callee45, this);
  }));
  return _getCampQrcode.apply(this, arguments);
}

function getLiveAdmin(_x64) {
  return _getLiveAdmin.apply(this, arguments);
}

function _getLiveAdmin() {
  _getLiveAdmin = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee46(liveId) {
    var result;
    return regeneratorRuntime.wrap(function _callee46$(_context46) {
      while (1) {
        switch (_context46.prev = _context46.next) {
          case 0:
            _context46.next = 2;
            return _apiService.apiService.post({
              url: "/h5/live/admin/admin-flag",
              body: {
                liveId: liveId
              }
            });

          case 2:
            result = _context46.sent;

            if (!(result.state.code == 0)) {
              _context46.next = 7;
              break;
            }

            return _context46.abrupt("return", result.data && result.data.isLiveAdmin);

          case 7:
            return _context46.abrupt("return", "N");

          case 8:
          case "end":
            return _context46.stop();
        }
      }
    }, _callee46, this);
  }));
  return _getLiveAdmin.apply(this, arguments);
}

function getIsQlCourseFocus() {
  return _getIsQlCourseFocus.apply(this, arguments);
}
/**
 * 三方导粉公众号获取二维码
 * @param {object} 参数对象（包括liveId, channel, subscribe等参数）
 * @param {boolean} isIrregular (是否是非常规流程，常规流程在查了配置之后需要判断时候关注千聊，未关注的话需要弹千聊的二维码)
 */


function _getIsQlCourseFocus() {
  _getIsQlCourseFocus = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee47() {
    var result;
    return regeneratorRuntime.wrap(function _callee47$(_context47) {
      while (1) {
        switch (_context47.prev = _context47.next) {
          case 0:
            _context47.prev = 0;
            _context47.next = 3;
            return api({
              url: "/api/wechat/h5/live/getAppIdByType",
              method: "POST",
              body: {
                type: "ql_course"
              }
            });

          case 3:
            result = _context47.sent;

            if (!(result.state.code == 0)) {
              _context47.next = 6;
              break;
            }

            return _context47.abrupt("return", result.data);

          case 6:
            return _context47.abrupt("return");

          case 9:
            _context47.prev = 9;
            _context47.t0 = _context47["catch"](0);
            console.error(_context47.t0);
            return _context47.abrupt("return");

          case 13:
          case "end":
            return _context47.stop();
        }
      }
    }, _callee47, this, [[0, 9]]);
  }));
  return _getIsQlCourseFocus.apply(this, arguments);
}

function tripartiteLeadPowder(_x65) {
  return _tripartiteLeadPowder.apply(this, arguments);
}

function _tripartiteLeadPowder() {
  _tripartiteLeadPowder = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee48(options) {
    var settings, result, resultData, expireTime, nowTime, qlLiveId, appIdList, liveIdList, appId, res, liveIdListResult, liveIdObj, _local, qrObj, local, _qrObj;

    return regeneratorRuntime.wrap(function _callee48$(_context48) {
      while (1) {
        switch (_context48.prev = _context48.next) {
          case 0:
            settings = _objectSpread({
              localStrogeName: "__TRIPARTITE_LEAD_POWER"
            }, options);
            _context48.next = 3;
            return api({
              url: "/api/wechat/live/getOpsAppIdSwitchConf",
              method: "GET",
              body: {
                channel: options.channel,
                liveId: options.liveId
              }
            });

          case 3:
            result = _context48.sent;
            resultData = result.data; // 关注后再次弹码的间隔时间(毫秒)

            _context48.next = 7;
            return getOpsAppIdSwitchTimeStep();

          case 7:
            expireTime = _context48.sent;
            nowTime = new Date().getTime(); // 如果有配置三方导粉公众号

            if (!(resultData.isHasConf === "Y")) {
              _context48.next = 28;
              break;
            }

            qlLiveId = ""; // 获取appId列表

            appIdList = []; // 获取liveid列表

            liveIdList = [];
            resultData.appBindLiveInfo.forEach(function (item) {
              if (item.isQlAppId == "Y") {
                qlLiveId = item.bindLiveId;
              }

              appIdList.push(item.appId);
              liveIdList.push(item.bindLiveId);
            }); // resultData.appBindLiveInfo.map((item)=>{liveIdList.push(item.bindLiveId)})

            appId = "";
            _context48.next = 17;
            return getIsSubscribe(liveIdList);

          case 17:
            res = _context48.sent;
            liveIdListResult = res.data.liveIdListResult;
            liveIdObj = liveIdListResult.find(function (item, index) {
              if (item.liveId == qlLiveId) {
                if (!item.isShowQl && !item.subscribe) {
                  appId = appIdList[index];
                  return true;
                }
              } else if (!item.isFocusThree) {
                appId = appIdList[index];
                return true;
              }
            }); // 如果有未关注的三方导粉公众号

            if (!(liveIdObj != undefined)) {
              _context48.next = 28;
              break;
            }

            _local = JSON.parse(localStorage.getItem(settings.localStrogeName)); // 有三方导粉公众号绑定的liveId二维码弹出条件
            // 1、从未关注过有三方导粉公众号绑定的liveId二维码
            // 2、同一个二维码未被关注
            // 3、不同二维码需在前一个二维码被关注起指定时间后才弹出（具体时间由后台配置返回）

            if (!(_local === null || _local && _local.liveId === liveIdObj.liveId || _local && nowTime - _local.lastTime > expireTime && _local.liveId !== liveIdObj.liveId)) {
              _context48.next = 28;
              break;
            }

            localStorage.setItem(settings.localStrogeName, JSON.stringify({
              liveId: liveIdObj.liveId,
              lastTime: nowTime
            }));
            _context48.next = 26;
            return api({
              url: "/api/wechat/live/get-qr",
              method: "GET",
              body: _objectSpread({}, settings, {
                liveId: options.liveId,
                appId: appId,
                channel: options.channel,
                showQl: "N"
              })
            });

          case 26:
            qrObj = _context48.sent;
            return _context48.abrupt("return", {
              appId: appId || (0, _util.getVal)(qrObj, "data.appId") || '',
              url: (0, _util.getVal)(qrObj, "data.qrUrl")
            });

          case 28:
            // 有配置则优先读取配置，没配置或者配置的都关注完了,并且未关注千聊的则弹千聊二维码
            local = JSON.parse(localStorage.getItem(settings.localStrogeName)); // 不同二维码需在前一个二维码被关注起指定时间后才弹出（具体时间由后台配置返回）

            if (!(local === null || local && nowTime - local.lastTime > expireTime)) {
              _context48.next = 35;
              break;
            }

            if (!(options.subscribe == "N")) {
              _context48.next = 35;
              break;
            }

            _context48.next = 33;
            return api({
              url: "/api/wechat/live/get-qr",
              method: "GET",
              body: _objectSpread({}, settings, {
                liveId: options.liveId,
                channel: options.channel,
                showQl: "Y"
              })
            });

          case 33:
            _qrObj = _context48.sent;
            return _context48.abrupt("return", {
              appId: "wx6b010e5ae2edae95",
              url: (0, _util.getVal)(_qrObj, "data.qrUrl")
            });

          case 35:
          case "end":
            return _context48.stop();
        }
      }
    }, _callee48, this);
  }));
  return _tripartiteLeadPowder.apply(this, arguments);
}

function convertType(param) {
  if (typeof param === "boolean") {
    param = param ? "Y" : "N";
  }

  return param;
}

;
/**
 * 传入用户和直播间状态，获取应该显示的二维码，如果获取到的是false，那么就不用显示二维码
 * @param {*} 参数对象
 *
 */

function whatQrcodeShouldIGet(_x66) {
  return _whatQrcodeShouldIGet.apply(this, arguments);
}

function _whatQrcodeShouldIGet() {
  _whatQrcodeShouldIGet = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee49(_ref33) {
    var isWhite, isLiveAdmin, isOfficialLive, isBindThird, isFocusThree, _ref33$isQlCourseUser, isQlCourseUser, isRecommend, _ref33$options, options, config, existData, _isLiveAdmin, backgroundConf;

    return regeneratorRuntime.wrap(function _callee49$(_context49) {
      while (1) {
        switch (_context49.prev = _context49.next) {
          case 0:
            isWhite = _ref33.isWhite, isLiveAdmin = _ref33.isLiveAdmin, isOfficialLive = _ref33.isOfficialLive, isBindThird = _ref33.isBindThird, isFocusThree = _ref33.isFocusThree, _ref33$isQlCourseUser = _ref33.isQlCourseUser, isQlCourseUser = _ref33$isQlCourseUser === void 0 ? "N" : _ref33$isQlCourseUser, isRecommend = _ref33.isRecommend, _ref33$options = _ref33.options, options = _ref33$options === void 0 ? {
              liveId: liveId,
              topicId: topicId,
              channelId: channelId,
              subscribe: subscribe,
              channel: channel //options中的liveId, subscribe, channel也是必传的

            } : _ref33$options;

            if (!(0, _util.isFromLiveCenter)()) {
              _context49.next = 5;
              break;
            }

            _context49.next = 4;
            return tripartiteLeadPowder(options);

          case 4:
            return _context49.abrupt("return", _context49.sent);

          case 5:
            if (!(isWhite === undefined || isLiveAdmin === undefined || isOfficialLive === undefined)) {
              _context49.next = 12;
              break;
            }

            _context49.next = 8;
            return getAllConfig({
              liveId: options.liveId
            });

          case 8:
            config = _context49.sent;
            isWhite = config.data.isWhite;
            isLiveAdmin = config.data.isLiveAdmin;
            isOfficialLive = config.data.isOfficialLive;

          case 12:
            if (!(options.topicId || options.channelId)) {
              _context49.next = 17;
              break;
            }

            _context49.next = 15;
            return getIsQlCourseUser({
              businessId: options.topicId || options.channelId,
              businessType: options.topicId ? "TOPIC" : "CHANNEL"
            });

          case 15:
            existData = _context49.sent;
            isQlCourseUser = existData.data.status;

          case 17:
            isWhite = convertType(isWhite);
            isLiveAdmin = convertType(isLiveAdmin);
            isOfficialLive = convertType(isOfficialLive);
            isBindThird = convertType(isBindThird);
            isFocusThree = convertType(isFocusThree);
            isRecommend = convertType(isRecommend);
            isQlCourseUser = convertType(isQlCourseUser);
            options.subscribe = convertType(options.subscribe);
            console.log("\n        isWhite: ".concat(isWhite, ",\n        isLiveAdmin: ").concat(isLiveAdmin, ",\n        isOfficialLive: ").concat(isOfficialLive, ",\n        isBindThird: ").concat(isBindThird, ",\n        isFocusThree: ").concat(isFocusThree, ",\n        isRecommend: ").concat(isRecommend, ",\n        subscribe: ").concat(options.subscribe, ",\n        isQlCourseUser: ").concat(isQlCourseUser, "\n    "));

            if (!(isWhite == "Y")) {
              _context49.next = 40;
              break;
            }

            if (!(isBindThird == "Y")) {
              _context49.next = 37;
              break;
            }

            if (!(isFocusThree == "N")) {
              _context49.next = 34;
              break;
            }

            _context49.next = 31;
            return onlyThird(isFocusThree, options);

          case 31:
            return _context49.abrupt("return", _context49.sent);

          case 34:
            return _context49.abrupt("return", false);

          case 35:
            _context49.next = 38;
            break;

          case 37:
            return _context49.abrupt("return", false);

          case 38:
            _context49.next = 96;
            break;

          case 40:
            _context49.next = 42;
            return getLiveAdmin(options.liveId);

          case 42:
            _isLiveAdmin = _context49.sent;

            if (!(_isLiveAdmin == "Y")) {
              _context49.next = 71;
              break;
            }

            if (!(isBindThird == "Y")) {
              _context49.next = 66;
              break;
            }

            if (!/101|202|204|209|210/.test(options.channel)) {
              _context49.next = 56;
              break;
            }

            _context49.next = 48;
            return thirdFirst(isFocusThree, options);

          case 48:
            _context49.t0 = _context49.sent;

            if (_context49.t0) {
              _context49.next = 53;
              break;
            }

            _context49.next = 52;
            return tripartiteLeadPowder(options);

          case 52:
            _context49.t0 = _context49.sent;

          case 53:
            return _context49.abrupt("return", _context49.t0);

          case 56:
            _context49.next = 58;
            return tripartiteLeadPowder(options);

          case 58:
            _context49.t1 = _context49.sent;

            if (_context49.t1) {
              _context49.next = 63;
              break;
            }

            _context49.next = 62;
            return thirdFirst(isFocusThree, options);

          case 62:
            _context49.t1 = _context49.sent;

          case 63:
            return _context49.abrupt("return", _context49.t1);

          case 64:
            _context49.next = 69;
            break;

          case 66:
            _context49.next = 68;
            return tripartiteLeadPowder(options);

          case 68:
            return _context49.abrupt("return", _context49.sent);

          case 69:
            _context49.next = 96;
            break;

          case 71:
            if (!/101|202|204|209|210/.test(options.channel)) {
              _context49.next = 86;
              break;
            }

            if (!(isBindThird == "Y")) {
              _context49.next = 83;
              break;
            }

            _context49.next = 75;
            return thirdFirst(isFocusThree, options);

          case 75:
            _context49.t2 = _context49.sent;

            if (_context49.t2) {
              _context49.next = 80;
              break;
            }

            _context49.next = 79;
            return tripartiteLeadPowder(options);

          case 79:
            _context49.t2 = _context49.sent;

          case 80:
            return _context49.abrupt("return", _context49.t2);

          case 83:
            _context49.next = 85;
            return tripartiteLeadPowder(options);

          case 85:
            return _context49.abrupt("return", _context49.sent);

          case 86:
            _context49.next = 88;
            return tripartiteLeadPowder(options);

          case 88:
            backgroundConf = _context49.sent;

            if (!backgroundConf) {
              _context49.next = 91;
              break;
            }

            return _context49.abrupt("return", backgroundConf);

          case 91:
            if (!(isBindThird == "Y")) {
              _context49.next = 95;
              break;
            }

            _context49.next = 94;
            return thirdFirst(isFocusThree, options);

          case 94:
            return _context49.abrupt("return", _context49.sent);

          case 95:
            return _context49.abrupt("return", false);

          case 96:
          case "end":
            return _context49.stop();
        }
      }
    }, _callee49, this);
  }));
  return _whatQrcodeShouldIGet.apply(this, arguments);
}

function thirdFirst(_x67, _x68) {
  return _thirdFirst.apply(this, arguments);
}
/**
 * @param {boolean} save 是否需要存缓存做标记
 */


function _thirdFirst() {
  _thirdFirst = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee50(isFocusThree, options) {
    return regeneratorRuntime.wrap(function _callee50$(_context50) {
      while (1) {
        switch (_context50.prev = _context50.next) {
          case 0:
            if (!(isFocusThree == "Y")) {
              _context50.next = 6;
              break;
            }

            _context50.next = 3;
            return tripartiteLeadPowder(options);

          case 3:
            return _context50.abrupt("return", _context50.sent);

          case 6:
            _context50.next = 8;
            return onlyThird("N", options);

          case 8:
            return _context50.abrupt("return", _context50.sent);

          case 9:
          case "end":
            return _context50.stop();
        }
      }
    }, _callee50, this);
  }));
  return _thirdFirst.apply(this, arguments);
}

function onlyThird(_x69, _x70) {
  return _onlyThird.apply(this, arguments);
} // 获取三方导粉间隔时间


function _onlyThird() {
  _onlyThird = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee51(isFocusThree, options) {
    var qrObj, nowTime;
    return regeneratorRuntime.wrap(function _callee51$(_context51) {
      while (1) {
        switch (_context51.prev = _context51.next) {
          case 0:
            if (!(isFocusThree == "N")) {
              _context51.next = 11;
              break;
            }

            _context51.next = 3;
            return api({
              url: "/api/wechat/live/get-qr",
              method: "GET",
              body: _objectSpread({
                showQl: "N"
              }, options)
            });

          case 3:
            qrObj = _context51.sent;

            if (!((0, _util.getVal)(qrObj, "state.code") == 0)) {
              _context51.next = 10;
              break;
            }

            // 需要存缓存
            nowTime = new Date().getTime(); // const expireTime = await getOpsAppIdSwitchTimeStep();
            // const local = JSON.parse(localStorage.getItem('_TRIPARTITE_LEAD_POWER'))
            // if((local === null) || (local && local.liveId === options.liveId) || (local && nowTime - local.lastTime > expireTime && local.liveId !== options.liveId)){
            // 每次请求都存储当前时间作为是否关注公众号的标志

            localStorage.setItem("__TRIPARTITE_LEAD_POWER", JSON.stringify({
              liveId: options.liveId,
              lastTime: nowTime
            }));
            return _context51.abrupt("return", {
              appId: (0, _util.getVal)(qrObj, "data.appId") || '',
              url: (0, _util.getVal)(qrObj, "data.qrUrl")
            });

          case 10:
            return _context51.abrupt("return", false);

          case 11:
          case "end":
            return _context51.stop();
        }
      }
    }, _callee51, this);
  }));
  return _onlyThird.apply(this, arguments);
}

function getOpsAppIdSwitchTimeStep() {
  return _getOpsAppIdSwitchTimeStep.apply(this, arguments);
}
/**
 * 增加配置（isWhite, isLiveAdmin, isOfficialLive 三个参数有些页面不一定有，可以统一获取）
 * @param object params 目前传liveId就可以
 */


function _getOpsAppIdSwitchTimeStep() {
  _getOpsAppIdSwitchTimeStep = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee52() {
    var result;
    return regeneratorRuntime.wrap(function _callee52$(_context52) {
      while (1) {
        switch (_context52.prev = _context52.next) {
          case 0:
            _context52.next = 2;
            return api({
              showLoading: false,
              url: "/api/wechat/live/getOpsAppIdSwitchTimeStep",
              body: {}
            });

          case 2:
            result = _context52.sent;
            return _context52.abrupt("return", result.data.subTimeStep);

          case 4:
          case "end":
            return _context52.stop();
        }
      }
    }, _callee52, this);
  }));
  return _getOpsAppIdSwitchTimeStep.apply(this, arguments);
}

function getAllConfig(params) {
  return request({
    url: '/api/wechat/getLiveStudioTypes',
    memoryCache: true,
    method: 'GET',
    body: params
  });
}

function getLiveStudioTypes(params) {
  return getAllConfig(params);
}
/**
 * 是否千聊课程用户
 * @param object params 目前传liveId就可以
 */


function getIsQlCourseUser(params) {
  return api({
    url: "/api/wechat/live/center/exist",
    method: "POST",
    body: params
  });
}
/**
 * 判断是否关注
 * isShowQl, subscribe, isFocusThree, isBindThird
 * @param {*} param0
 */


function fetchSubscribeStatus(_ref34) {
  var liveId = _ref34.liveId;
  return api({
    url: "/api/wechat/common/isSubscribe",
    method: "GET",
    body: {
      liveId: liveId
    }
  });
}
/**
 * 是否是服务号白名单
 */


function isServerWhite(params) {
  return api({
    url: "/api/wechat/live/isServiceWhiteLive",
    method: "GET",
    body: params
  });
}
/**
 * 获取一批直播间ID列表的关注状态
 * @param {Array<Number>} liveIdList 直播间ID列表
 */


function getIsSubscribe(liveIdList) {
  var body = {}; // 列表的时候就传liveidList

  if (Array.isArray(liveIdList)) {
    body.liveIdList = liveIdList.join(","); // 字符串的时候传单个liveId
  } else if (typeof liveIdList === "string") {
    body.liveId = liveIdList;
  }

  return api({
    url: "/api/wechat/user/is-subscribe",
    method: "GET",
    body: body
  });
}
/** 获取标签对应的直播间id，嘛 反正就是获取到这个直播间ID然后就当千聊福利社的ID用了 */


function getFocusLiveId(liveId) {
  return api({
    url: "/api/wechat/getLiveTagOfficialLiveId",
    method: "GET",
    body: {
      liveId: liveId
    }
  });
}
/**
 * 绑定直播间分销关系
 * @param  {[type]} liveId    [description]
 * @param  {[type]} lshareKey [description]
 * @return {[type]}           [description]
 */


function bindShareKey(liveId, lshareKey) {
  return function (dispatch, getStore) {
    return api({
      dispatch: dispatch,
      getStore: getStore,
      showLoading: false,
      method: "POST",
      url: "/api/wechat/topic/bind-share-key",
      body: {
        liveId: liveId,
        shareKey: lshareKey
      }
    });
  };
} // 老用户迎新活动时间获取


function getActiveTime() {
  return (
    /*#__PURE__*/
    function () {
      var _ref35 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee29(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: "/api/wechat/activity/old-belt-new/getActiveTime",
                  body: {}
                });

              case 2:
                result = _context29.sent;
                return _context29.abrupt("return", result);

              case 4:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      return function (_x71, _x72) {
        return _ref35.apply(this, arguments);
      };
    }()
  );
} // 获取话题信息


function getTopicInfo(topicId) {
  return (
    /*#__PURE__*/
    function () {
      var _ref36 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee30(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  url: '/api/wechat/topic/getInfo',
                  method: 'GET',
                  showLoading: true,
                  body: {
                    topicId: topicId
                  }
                });

              case 2:
                result = _context30.sent;
                return _context30.abrupt("return", result);

              case 4:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      return function (_x73, _x74) {
        return _ref36.apply(this, arguments);
      };
    }()
  );
}

;

function getUserTopicRole(topicId) {
  return (
    /*#__PURE__*/
    function () {
      var _ref37 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee31(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  method: "POST",
                  url: "/api/wechat/topic/getUserTopicRole",
                  body: {
                    topicId: topicId
                  }
                });

              case 2:
                result = _context31.sent;
                return _context31.abrupt("return", result);

              case 4:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      return function (_x75, _x76) {
        return _ref37.apply(this, arguments);
      };
    }()
  );
}

function getTopicRoleList(liveId, topicId) {
  return request({
    url: "/api/wechat/topic/getRoleList",
    method: "POST",
    body: {
      liveId: liveId,
      topicId: topicId
    }
  });
} // 请好友免费听检验分享状态


function checkShareStatus(_x77) {
  return _checkShareStatus.apply(this, arguments);
} // 获取当前请好友免费听的分享id


function _checkShareStatus() {
  _checkShareStatus = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee53(params) {
    return regeneratorRuntime.wrap(function _callee53$(_context53) {
      while (1) {
        switch (_context53.prev = _context53.next) {
          case 0:
            _context53.next = 2;
            return api({
              url: "/api/wechat/inviteFriendsToListen/checkShareStatus",
              method: "POST",
              body: params,
              showWarningTips: false,
              errorResolve: true
            });

          case 2:
            return _context53.abrupt("return", _context53.sent);

          case 3:
          case "end":
            return _context53.stop();
        }
      }
    }, _callee53, this);
  }));
  return _checkShareStatus.apply(this, arguments);
}

function fetchShareRecord(_x78) {
  return _fetchShareRecord.apply(this, arguments);
} // 获取当前请好友免费听的已领信息


function _fetchShareRecord() {
  _fetchShareRecord = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee54(params) {
    return regeneratorRuntime.wrap(function _callee54$(_context54) {
      while (1) {
        switch (_context54.prev = _context54.next) {
          case 0:
            _context54.next = 2;
            return api({
              url: "/api/wechat/inviteFriendsToListen/fetchShareRecord",
              method: "POST",
              body: params
            });

          case 2:
            return _context54.abrupt("return", _context54.sent);

          case 3:
          case "end":
            return _context54.stop();
        }
      }
    }, _callee54, this);
  }));
  return _fetchShareRecord.apply(this, arguments);
}

function getReceiveInfo(_x79) {
  return _getReceiveInfo.apply(this, arguments);
}
/**
 * 获取课程分销资格（统一接口）
 */


function _getReceiveInfo() {
  _getReceiveInfo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee55(params) {
    return regeneratorRuntime.wrap(function _callee55$(_context55) {
      while (1) {
        switch (_context55.prev = _context55.next) {
          case 0:
            _context55.next = 2;
            return api({
              url: "/api/wechat/inviteFriendsToListen/getReceiveInfo",
              method: "POST",
              body: params
            });

          case 2:
            return _context55.abrupt("return", _context55.sent);

          case 3:
          case "end":
            return _context55.stop();
        }
      }
    }, _callee55, this);
  }));
  return _getReceiveInfo.apply(this, arguments);
}

function getMyQualify(_x80, _x81) {
  return _getMyQualify.apply(this, arguments);
} // 是否报名该系列课


function _getMyQualify() {
  _getMyQualify = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee56(businessId, businessType) {
    var isAutoApply,
        shareUserId,
        _args56 = arguments;
    return regeneratorRuntime.wrap(function _callee56$(_context56) {
      while (1) {
        switch (_context56.prev = _context56.next) {
          case 0:
            isAutoApply = _args56.length > 2 && _args56[2] !== undefined ? _args56[2] : "N";
            shareUserId = _args56.length > 3 && _args56[3] !== undefined ? _args56[3] : "";
            _context56.next = 4;
            return api({
              showLoading: false,
              url: "/api/wechat/topic/getMyQualify",
              method: "POST",
              body: {
                businessId: businessId,
                businessType: businessType,
                isAutoApply: isAutoApply,
                shareUserId: shareUserId
              }
            });

          case 4:
            return _context56.abrupt("return", _context56.sent);

          case 5:
          case "end":
            return _context56.stop();
        }
      }
    }, _callee56, this);
  }));
  return _getMyQualify.apply(this, arguments);
}

function isAuthChannel(_x82) {
  return _isAuthChannel.apply(this, arguments);
} // 是否报名该话题


function _isAuthChannel() {
  _isAuthChannel = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee57(channelId) {
    var result;
    return regeneratorRuntime.wrap(function _callee57$(_context57) {
      while (1) {
        switch (_context57.prev = _context57.next) {
          case 0:
            _context57.prev = 0;
            _context57.next = 3;
            return api({
              showLoading: false,
              url: "/api/wechat/channel/isAuthChannel",
              method: "POST",
              body: {
                channelId: channelId
              }
            });

          case 3:
            result = _context57.sent;

            if (!(result.state.code === 0)) {
              _context57.next = 6;
              break;
            }

            return _context57.abrupt("return", result.data && result.data.status);

          case 6:
            _context57.next = 12;
            break;

          case 8:
            _context57.prev = 8;
            _context57.t0 = _context57["catch"](0);
            console.error(_context57.t0);
            return _context57.abrupt("return", "N");

          case 12:
          case "end":
            return _context57.stop();
        }
      }
    }, _callee57, this, [[0, 8]]);
  }));
  return _isAuthChannel.apply(this, arguments);
}

function isAuthTopic(_x83) {
  return _isAuthTopic.apply(this, arguments);
} // 统一查看是否报名课程


function _isAuthTopic() {
  _isAuthTopic = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee58(topicId) {
    var _result$data, result;

    return regeneratorRuntime.wrap(function _callee58$(_context58) {
      while (1) {
        switch (_context58.prev = _context58.next) {
          case 0:
            _context58.prev = 0;
            _context58.next = 3;
            return api({
              showLoading: false,
              url: "/api/wechat/transfer/h5/topic/topicAuth",
              method: "POST",
              body: {
                topicId: topicId
              }
            });

          case 3:
            result = _context58.sent;
            return _context58.abrupt("return", (result === null || result === void 0 ? void 0 : (_result$data = result.data) === null || _result$data === void 0 ? void 0 : _result$data.isAuth) ? 'Y' : 'N');

          case 7:
            _context58.prev = 7;
            _context58.t0 = _context58["catch"](0);
            console.error(_context58.t0);
            return _context58.abrupt("return", "N");

          case 11:
          case "end":
            return _context58.stop();
        }
      }
    }, _callee58, this, [[0, 7]]);
  }));
  return _isAuthTopic.apply(this, arguments);
}

function isAuthCourse(_x84) {
  return _isAuthCourse.apply(this, arguments);
} // 统一报名免费课程，包括系列课话题


function _isAuthCourse() {
  _isAuthCourse = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee59(_ref38) {
    var businessId, businessType;
    return regeneratorRuntime.wrap(function _callee59$(_context59) {
      while (1) {
        switch (_context59.prev = _context59.next) {
          case 0:
            businessId = _ref38.businessId, businessType = _ref38.businessType;

            if (!(businessType === 'topic')) {
              _context59.next = 7;
              break;
            }

            _context59.next = 4;
            return isAuthTopic(businessId);

          case 4:
            return _context59.abrupt("return", _context59.sent);

          case 7:
            if (!(businessType === 'channel')) {
              _context59.next = 13;
              break;
            }

            _context59.next = 10;
            return isAuthChannel(businessId);

          case 10:
            return _context59.abrupt("return", _context59.sent);

          case 13:
            console.error('wrong businessType');

          case 14:
          case "end":
            return _context59.stop();
        }
      }
    }, _callee59, this);
  }));
  return _isAuthCourse.apply(this, arguments);
}

function authFreeCourse(_x85) {
  return _authFreeCourse.apply(this, arguments);
} // 获取系列课第一节课程


function _authFreeCourse() {
  _authFreeCourse = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee60(_ref39) {
    var businessId, businessType, result;
    return regeneratorRuntime.wrap(function _callee60$(_context60) {
      while (1) {
        switch (_context60.prev = _context60.next) {
          case 0:
            businessId = _ref39.businessId, businessType = _ref39.businessType;
            _context60.prev = 1;
            _context60.next = 4;
            return api({
              showLoading: false,
              url: "/api/wechat/transfer/h5/topic/joinFreeCourse",
              method: "POST",
              body: {
                businessId: businessId,
                businessType: businessType
              }
            });

          case 4:
            result = _context60.sent;
            return _context60.abrupt("return", result.state.code === 0 ? 'success' : 'fail');

          case 8:
            _context60.prev = 8;
            _context60.t0 = _context60["catch"](1);
            console.error(_context60.t0);
            return _context60.abrupt("return", "fail");

          case 12:
          case "end":
            return _context60.stop();
        }
      }
    }, _callee60, this, [[1, 8]]);
  }));
  return _authFreeCourse.apply(this, arguments);
}

function getFirstTopicInChannel(_x86) {
  return _getFirstTopicInChannel.apply(this, arguments);
} // 学分任务达成触发


function _getFirstTopicInChannel() {
  _getFirstTopicInChannel = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee61(channelId) {
    var _result$data2;

    var result, topicList;
    return regeneratorRuntime.wrap(function _callee61$(_context61) {
      while (1) {
        switch (_context61.prev = _context61.next) {
          case 0:
            _context61.next = 2;
            return api({
              showLoading: false,
              url: "/api/wechat/transfer/h5/topic/list",
              method: "POST",
              body: {
                channelId: channelId,
                pageNum: 1,
                pageSize: 1
              }
            }).catch(function (e) {
              console.error(e);
            });

          case 2:
            result = _context61.sent;
            topicList = ((_result$data2 = result.data) === null || _result$data2 === void 0 ? void 0 : _result$data2.topicList) || [];
            return _context61.abrupt("return", topicList[0]);

          case 5:
          case "end":
            return _context61.stop();
        }
      }
    }, _callee61, this);
  }));
  return _getFirstTopicInChannel.apply(this, arguments);
}

function uploadTaskPoint(_x87) {
  return _uploadTaskPoint.apply(this, arguments);
} // 获取系列课单个单个话题作业数据


function _uploadTaskPoint() {
  _uploadTaskPoint = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee62(params) {
    var result;
    return regeneratorRuntime.wrap(function _callee62$(_context62) {
      while (1) {
        switch (_context62.prev = _context62.next) {
          case 0:
            _context62.next = 2;
            return api({
              url: "/api/wechat/point/doAssignment",
              method: "POST",
              body: params
            });

          case 2:
            result = _context62.sent;
            return _context62.abrupt("return", result);

          case 4:
          case "end":
            return _context62.stop();
        }
      }
    }, _callee62, this);
  }));
  return _uploadTaskPoint.apply(this, arguments);
}

function topicJodLists(_x88) {
  return _topicJodLists.apply(this, arguments);
} // 获取社群信息


function _topicJodLists() {
  _topicJodLists = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee63(params) {
    var result;
    return regeneratorRuntime.wrap(function _callee63$(_context63) {
      while (1) {
        switch (_context63.prev = _context63.next) {
          case 0:
            _context63.next = 2;
            return api({
              url: "/api/wechat/channel/camp/listTopic",
              method: "POST",
              body: params
            });

          case 2:
            result = _context63.sent;
            console.log("==========");
            return _context63.abrupt("return", result);

          case 5:
          case "end":
            return _context63.stop();
        }
      }
    }, _callee63, this);
  }));
  return _topicJodLists.apply(this, arguments);
}

function getCommunity(_x89, _x90, _x91) {
  return _getCommunity.apply(this, arguments);
} // 同意讲师协议


function _getCommunity() {
  _getCommunity = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee64(liveId, type, businessId) {
    var res;
    return regeneratorRuntime.wrap(function _callee64$(_context64) {
      while (1) {
        switch (_context64.prev = _context64.next) {
          case 0:
            _context64.prev = 0;
            _context64.next = 3;
            return request({
              url: "/api/wechat/community/getByBusiness",
              method: "POST",
              body: {
                liveId: liveId,
                type: type,
                businessId: businessId
              }
            });

          case 3:
            res = _context64.sent;

            if (!(res.state.code === 0)) {
              _context64.next = 8;
              break;
            }

            return _context64.abrupt("return", res.data);

          case 8:
            window.toast(res.state.msg);

          case 9:
            _context64.next = 14;
            break;

          case 11:
            _context64.prev = 11;
            _context64.t0 = _context64["catch"](0);
            console.error(_context64.t0);

          case 14:
          case "end":
            return _context64.stop();
        }
      }
    }, _callee64, this, [[0, 11]]);
  }));
  return _getCommunity.apply(this, arguments);
}

function assignAgreement(_x92) {
  return _assignAgreement.apply(this, arguments);
} // 讲师协议同意状态


function _assignAgreement() {
  _assignAgreement = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee65(_ref40) {
    var liveId, version, _ref40$type, type;

    return regeneratorRuntime.wrap(function _callee65$(_context65) {
      while (1) {
        switch (_context65.prev = _context65.next) {
          case 0:
            liveId = _ref40.liveId, version = _ref40.version, _ref40$type = _ref40.type, type = _ref40$type === void 0 ? "live" : _ref40$type;
            _context65.next = 3;
            return request({
              url: "/api/wechat/transfer/h5/live/assignAgreement",
              method: "POST",
              body: {
                liveId: liveId,
                version: version,
                type: type
              }
            });

          case 3:
            return _context65.abrupt("return", _context65.sent);

          case 4:
          case "end":
            return _context65.stop();
        }
      }
    }, _callee65, this);
  }));
  return _assignAgreement.apply(this, arguments);
}

function getAgreementStatus(_x93) {
  return _getAgreementStatus.apply(this, arguments);
} // 获取讲师协议版本


function _getAgreementStatus() {
  _getAgreementStatus = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee66(_ref41) {
    var liveId, version, _ref41$type, type;

    return regeneratorRuntime.wrap(function _callee66$(_context66) {
      while (1) {
        switch (_context66.prev = _context66.next) {
          case 0:
            liveId = _ref41.liveId, version = _ref41.version, _ref41$type = _ref41.type, type = _ref41$type === void 0 ? "live" : _ref41$type;
            _context66.next = 3;
            return request({
              url: "/api/wechat/transfer/h5/live/agreementStatus",
              method: "POST",
              body: {
                liveId: liveId,
                version: version,
                type: type
              }
            });

          case 3:
            return _context66.abrupt("return", _context66.sent);

          case 4:
          case "end":
            return _context66.stop();
        }
      }
    }, _callee66, this);
  }));
  return _getAgreementStatus.apply(this, arguments);
}

function getAgreementVersion() {
  return _getAgreementVersion.apply(this, arguments);
} // 解绑手机号


function _getAgreementVersion() {
  _getAgreementVersion = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee68() {
    return regeneratorRuntime.wrap(function _callee68$(_context68) {
      while (1) {
        switch (_context68.prev = _context68.next) {
          case 0:
            return _context68.abrupt("return", new Promise(
            /*#__PURE__*/
            function () {
              var _ref55 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee67(resolve, reject) {
                var res;
                return regeneratorRuntime.wrap(function _callee67$(_context67) {
                  while (1) {
                    switch (_context67.prev = _context67.next) {
                      case 0:
                        _context67.prev = 0;
                        _context67.next = 3;
                        return request({
                          url: "/api/wechat/transfer/h5/live/agreementVersion",
                          method: "POST",
                          body: {}
                        });

                      case 3:
                        res = _context67.sent;

                        if (res.state.code === 0) {
                          resolve(res.data && res.data.liveAgreementVersion);
                        } else {
                          reject(res.state, msg);
                        }

                        _context67.next = 10;
                        break;

                      case 7:
                        _context67.prev = 7;
                        _context67.t0 = _context67["catch"](0);
                        reject(_context67.t0);

                      case 10:
                      case "end":
                        return _context67.stop();
                    }
                  }
                }, _callee67, this, [[0, 7]]);
              }));

              return function (_x113, _x114) {
                return _ref55.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context68.stop();
        }
      }
    }, _callee68, this);
  }));
  return _getAgreementVersion.apply(this, arguments);
}

function unbindPhone() {
  return (
    /*#__PURE__*/
    function () {
      var _ref42 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee32(dispatch, getStore) {
        return regeneratorRuntime.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                return _context32.abrupt("return", api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: "POST",
                  url: "/api/wechat/transfer/h5/user/mobileUnbind",
                  errorResolve: true
                }).then(function (res) {
                  if (!res.state.code) {
                    dispatch({
                      type: UPDATE_USERINFO,
                      userInfo: {
                        mobile: undefined,
                        isBind: "N"
                      }
                    });
                    return true;
                  }
                }));

              case 1:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      return function (_x94, _x95) {
        return _ref42.apply(this, arguments);
      };
    }()
  );
}

function updateUserInfo(userInfo) {
  return (
    /*#__PURE__*/
    function () {
      var _ref43 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee33(dispatch, getStore) {
        return regeneratorRuntime.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                dispatch({
                  type: UPDATE_USERINFO,
                  userInfo: userInfo
                });

              case 1:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      return function (_x96, _x97) {
        return _ref43.apply(this, arguments);
      };
    }()
  );
} // 获取功能白名单


function isFunctionWhite(_x98, _x99) {
  return _isFunctionWhite.apply(this, arguments);
} //获取微信config


function _isFunctionWhite() {
  _isFunctionWhite = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee69(liveId, functionType) {
    var res;
    return regeneratorRuntime.wrap(function _callee69$(_context69) {
      while (1) {
        switch (_context69.prev = _context69.next) {
          case 0:
            _context69.prev = 0;
            _context69.next = 3;
            return request({
              url: "/api/wechat/isFunctionWhite",
              method: "POST",
              body: {
                liveId: liveId,
                function: functionType
              }
            });

          case 3:
            res = _context69.sent;

            if (!(res.state.code === 0)) {
              _context69.next = 8;
              break;
            }

            return _context69.abrupt("return", res.data);

          case 8:
            window.toast(res.state.msg);

          case 9:
            _context69.next = 14;
            break;

          case 11:
            _context69.prev = 11;
            _context69.t0 = _context69["catch"](0);
            console.error(_context69.t0);

          case 14:
          case "end":
            return _context69.stop();
        }
      }
    }, _callee69, this, [[0, 11]]);
  }));
  return _isFunctionWhite.apply(this, arguments);
}

function getWxConfig() {
  return (
    /*#__PURE__*/
    function () {
      var _ref44 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee34(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                dispatch(loading(true));
                _context34.next = 3;
                return (0, _isomorphicFetch.default)('/api/js-sdk/wx/config', {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                  },
                  credentials: 'include'
                }).then(function (res) {
                  return res.json();
                });

              case 3:
                result = _context34.sent;
                dispatch(loading(false));
                return _context34.abrupt("return", result);

              case 6:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      return function (_x100, _x101) {
        return _ref44.apply(this, arguments);
      };
    }()
  );
} // 获取企业信息


function checkEnterprise(_x102) {
  return _checkEnterprise.apply(this, arguments);
} // 获取考试成绩海报二维码


function _checkEnterprise() {
  _checkEnterprise = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee70(params) {
    return regeneratorRuntime.wrap(function _callee70$(_context70) {
      while (1) {
        switch (_context70.prev = _context70.next) {
          case 0:
            _context70.next = 2;
            return api({
              url: '/api/wechat/live/checkEnterprise',
              body: params
            });

          case 2:
            return _context70.abrupt("return", _context70.sent);

          case 3:
          case "end":
            return _context70.stop();
        }
      }
    }, _callee70, this);
  }));
  return _checkEnterprise.apply(this, arguments);
}

function getExamQrCode(_x103) {
  return _getExamQrCode.apply(this, arguments);
} // 获取用户的好友关系


function _getExamQrCode() {
  _getExamQrCode = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee71(_ref45) {
    var channel, liveId, pubBusinessId, subscribeData, isBindThird, isFocusThree, qr, qlCourse, qlCourseObj, qlObj;
    return regeneratorRuntime.wrap(function _callee71$(_context71) {
      while (1) {
        switch (_context71.prev = _context71.next) {
          case 0:
            channel = _ref45.channel, liveId = _ref45.liveId, pubBusinessId = _ref45.pubBusinessId;
            _context71.next = 3;
            return fetchSubscribeStatus({
              liveId: liveId
            });

          case 3:
            subscribeData = _context71.sent;
            isBindThird = convertType((0, _util.getVal)(subscribeData, "data.isBindThird", "N"));
            isFocusThree = convertType((0, _util.getVal)(subscribeData, "data.isFocusThree", "N")); // 对接三方服务号 并且 已关注 弹三方

            if (!(isBindThird == "Y" && isFocusThree == "Y")) {
              _context71.next = 11;
              break;
            }

            _context71.next = 9;
            return api({
              url: "/api/wechat/live/get-qr",
              method: "GET",
              body: {
                showQl: "N",
                pubBusinessId: pubBusinessId,
                liveId: liveId,
                channel: channel // subscribe: isSubscribe

              }
            });

          case 9:
            qr = _context71.sent;
            return _context71.abrupt("return", {
              url: (0, _util.getVal)(qr, "data.qrUrl")
            });

          case 11:
            _context71.next = 13;
            return getIsQlCourseFocus();

          case 13:
            qlCourse = _context71.sent;

            if (!((0, _util.getVal)(qlCourse, "isSubscribe", "N") === 'Y')) {
              _context71.next = 19;
              break;
            }

            _context71.next = 17;
            return api({
              url: "/api/wechat/live/get-qr",
              method: "GET",
              body: {
                showQl: "N",
                pubBusinessId: pubBusinessId,
                // liveId,
                appId: qlCourse.appId,
                channel: channel
              }
            });

          case 17:
            qlCourseObj = _context71.sent;
            return _context71.abrupt("return", {
              appId: "",
              url: (0, _util.getVal)(qlCourseObj, "data.qrUrl")
            });

          case 19:
            _context71.next = 21;
            return api({
              url: "/api/wechat/live/get-qr",
              method: "GET",
              body: {
                pubBusinessId: pubBusinessId,
                liveId: liveId,
                channel: channel,
                showQl: "Y"
              }
            });

          case 21:
            qlObj = _context71.sent;
            return _context71.abrupt("return", {
              appId: "wx6b010e5ae2edae95",
              url: (0, _util.getVal)(qlObj, "data.qrUrl")
            });

          case 23:
          case "end":
            return _context71.stop();
        }
      }
    }, _callee71, this);
  }));
  return _getExamQrCode.apply(this, arguments);
}

function fetchRelationInfo(_ref46) {
  var userId = _ref46.userId;
  return api({
    url: "/api/wechat/transfer/h5/user/relation/relationInfo",
    method: "POST",
    body: {
      userId: userId
    }
  });
} // 获取用户的好友关系


function dispatchFetchRelationInfo(_ref47) {
  var userId = _ref47.userId;
  return (
    /*#__PURE__*/
    function () {
      var _ref48 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee35(dispatch, getStore) {
        var res;
        return regeneratorRuntime.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                _context35.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: '/api/wechat/transfer/h5/user/relation/relationInfo',
                  body: {
                    userId: userId
                  },
                  method: 'POST'
                });

              case 2:
                res = _context35.sent;

                if (res.state.code === 0) {
                  dispatch({
                    type: GET_RELATIONINFO,
                    payload: res.data
                  });
                }

                return _context35.abrupt("return", res);

              case 5:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      return function (_x104, _x105) {
        return _ref48.apply(this, arguments);
      };
    }()
  );
}
/**
 * 三方导粉公众号获取二维码
 * @param {object} 参数对象（包括liveId, channel, subscribe等参数）
 */


function getThirdConf(options) {
  return (
    /*#__PURE__*/
    function () {
      var _ref49 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee36(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                _context36.next = 2;
                return api({
                  url: "/api/wechat/transfer/h5/live/getOpsAppIdSwitchConf",
                  method: "POST",
                  body: {
                    channel: '201',
                    liveId: options.liveId
                  }
                });

              case 2:
                result = _context36.sent;
                dispatch({
                  type: GET_THRID_CONF,
                  payload: _objectSpread({}, result.data)
                });
                return _context36.abrupt("return", result.data || []);

              case 5:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));

      return function (_x106, _x107) {
        return _ref49.apply(this, arguments);
      };
    }()
  );
}
/**
 * 获取节点信息
 * @param {object} 参数对象（包括liveId, channel, subscribe等参数）
 */


var getNodeInfo =
/*#__PURE__*/
function () {
  var _ref50 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee37(params) {
    var res;
    return regeneratorRuntime.wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            _context37.next = 2;
            return request.post({
              url: '/api/wechat/transfer/h5/menu/node/get',
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
            res = _context37.sent;
            return _context37.abrupt("return", res && res.data || {});

          case 4:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37, this);
  }));

  return function getNodeInfo(_x108) {
    return _ref50.apply(this, arguments);
  };
}(); // 获取APP跳转路由


exports.getNodeInfo = getNodeInfo;

var getAppGoUrl =
/*#__PURE__*/
function () {
  var _ref51 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee38(params) {
    var res;
    return regeneratorRuntime.wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.next = 2;
            return request.post({
              url: '/api/wechat/transfer/baseApi/h5/common/parseUrl',
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
            res = _context38.sent;
            return _context38.abrupt("return", res && res.data || {});

          case 4:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38, this);
  }));

  return function getAppGoUrl(_x109) {
    return _ref51.apply(this, arguments);
  };
}(); // 获取目标用户微信昵称


exports.getAppGoUrl = getAppGoUrl;

var getWechatNickName =
/*#__PURE__*/
function () {
  var _ref52 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee39(findNameUserId) {
    var res;
    return regeneratorRuntime.wrap(function _callee39$(_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            _context39.next = 2;
            return request.post({
              url: '/api/wechat/transfer/h5/user/getWechatUserName',
              body: {
                findNameUserId: findNameUserId
              }
            }).then(function (res) {
              if (res.state && res.state.code !== 0) {
                throw new Error(res.state.msg);
              }

              return res;
            }).catch(function (err) {});

          case 2:
            res = _context39.sent;
            return _context39.abrupt("return", res && res.data || {});

          case 4:
          case "end":
            return _context39.stop();
        }
      }
    }, _callee39, this);
  }));

  return function getWechatNickName(_x110) {
    return _ref52.apply(this, arguments);
  };
}(); // 通用广告位


exports.getWechatNickName = getWechatNickName;

var getAdSpace =
/*#__PURE__*/
function () {
  var _ref53 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee40(params) {
    var res;
    return regeneratorRuntime.wrap(function _callee40$(_context40) {
      while (1) {
        switch (_context40.prev = _context40.next) {
          case 0:
            _context40.next = 2;
            return request.post({
              url: '/api/wechat/transfer/baseApi/h5/ad/myCourse',
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
            res = _context40.sent;
            return _context40.abrupt("return", res && res.data || null);

          case 4:
          case "end":
            return _context40.stop();
        }
      }
    }, _callee40, this);
  }));

  return function getAdSpace(_x111) {
    return _ref53.apply(this, arguments);
  };
}(); // 是否为官方直播间


exports.getAdSpace = getAdSpace;

var isQlLive =
/*#__PURE__*/
function () {
  var _ref54 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee41(params) {
    var res;
    return regeneratorRuntime.wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            _context41.next = 2;
            return request.post({
              url: '/api/wechat/transfer/baseApi/h5/live/isQlLive',
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
            res = _context41.sent;
            return _context41.abrupt("return", res && res.data || null);

          case 4:
          case "end":
            return _context41.stop();
        }
      }
    }, _callee41, this);
  }));

  return function isQlLive(_x112) {
    return _ref54.apply(this, arguments);
  };
}();

exports.isQlLive = isQlLive;

/***/ }),

/***/ "./wechat-react/app.js":
/*!*****************************!*\
  !*** ./wechat-react/app.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRouter = getRouter;
exports.default = void 0;

var React = _interopRequireWildcard(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _toast = _interopRequireDefault(__webpack_require__(/*! @ql-feat/toast */ "../node_modules/@ql-feat/toast/dist/index.js"));

var _loading = _interopRequireDefault(__webpack_require__(/*! @ql-feat/loading */ "../node_modules/@ql-feat/loading/dist/index.js"));

var _detect = _interopRequireDefault(__webpack_require__(/*! @ql-feat/detect */ "../node_modules/@ql-feat/detect/public/detect.js"));

var _qrcode = _interopRequireDefault(__webpack_require__(/*! qrcode.react */ "../node_modules/qrcode.react/lib/index.js"));

var _common = __webpack_require__(/*! ./actions/common */ "./wechat-react/actions/common.js");

var _util = __webpack_require__(/*! ./components/util */ "./wechat-react/components/util.js");

var _reactDialog = __webpack_require__(/*! @ql-feat/react-dialog */ "../node_modules/@ql-feat/react-dialog/dist/index.js");

var _reactImageViewer = _interopRequireDefault(__webpack_require__(/*! @ql-feat/react-image-viewer */ "../node_modules/@ql-feat/react-image-viewer/dist/index.js"));

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

var isNode = typeof window == 'undefined';

__webpack_require__(/*! intersection-observer */ "../node_modules/intersection-observer/intersection-observer.js");

// import FastClick from 'fastclick';
var FastClick = !isNode && __webpack_require__(/*! fastclick */ "../node_modules/fastclick/lib/fastclick.js");

if (!!FastClick) {
  FastClick.prototype.focus = function (targetElement) {
    var length;

    if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
      length = targetElement.value.length;
      targetElement.focus && targetElement.focus();
      targetElement.setSelectionRange(length, length);
    } else {
      targetElement.focus && targetElement.focus();
    }
  };
} // import Perf from 'react-addons-perf';
// Perf.start();


var dangerHtml = function dangerHtml(content) {
  return {
    __html: content
  };
};

var _router;

var styleList = [];

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(App)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      confirmClassName: '',
      confirmContent: '',
      confirmTop: '',
      qrcodeUrl: '',
      qrCodeBase64: '',
      buttons: 'none',
      confirmText: '确认',
      cancelText: '取消',
      titleTheme: 'blue'
    });

    return _this;
  }

  _createClass(App, [{
    key: "getChildContext",
    value: function getChildContext() {
      return this.props.context;
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      _router = this.context.router;
      (0, _util.recordBrowseHistoryToStorage)(_router.location);

      _router.listen(_util.recordBrowseHistoryToStorage); // 注入C端来源


      (0, _util.initCEndSourseInject)();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // window.Perf = Perf;
      FastClick && FastClick.attach(document.body); // 将toast注入window对象

      window.toast = this.props.toastAction; // 将loading注入window对象

      window.loading = this.props.loadingAction;

      window.confirmDialog = function (msg, success, cancel) {
        var topmsg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
        var buttons = arguments.length > 4 ? arguments[4] : undefined;
        var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
          confirmText: '确认',
          cancelText: '取消',
          titleTheme: 'blue'
        };

        _this2.refs.dialogConfirm.show();

        _this2.setState({
          confirmContent: msg,
          confirmTop: topmsg,
          buttons: buttons,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          titleTheme: options.titleTheme,
          confirmClassName: options.className
        });

        _this2.successDialog = success;
        _this2.cancelDialog = cancel;
      }; // 都别争了，用这个吧


      window.simpleDialog = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          title: null,
          msg: '',
          buttons: 'cancel-confirm',
          confirmText: '确认',
          cancelText: '取消',
          onConfirm: null,
          onCancel: null,
          titleTheme: 'blue'
        };
        var _options$title = options.title,
            title = _options$title === void 0 ? null : _options$title,
            _options$msg = options.msg,
            msg = _options$msg === void 0 ? '' : _options$msg,
            _options$buttons = options.buttons,
            buttons = _options$buttons === void 0 ? 'cancel-confirm' : _options$buttons,
            _options$confirmText = options.confirmText,
            confirmText = _options$confirmText === void 0 ? '确认' : _options$confirmText,
            _options$cancelText = options.cancelText,
            cancelText = _options$cancelText === void 0 ? '取消' : _options$cancelText,
            _options$onConfirm = options.onConfirm,
            onConfirm = _options$onConfirm === void 0 ? null : _options$onConfirm,
            _options$onCancel = options.onCancel,
            onCancel = _options$onCancel === void 0 ? null : _options$onCancel,
            _options$titleTheme = options.titleTheme,
            titleTheme = _options$titleTheme === void 0 ? 'blue' : _options$titleTheme,
            className = options.className;

        if (onConfirm || onCancel) {
          window.confirmDialog(msg, onConfirm, onCancel, title, buttons, {
            confirmText: confirmText,
            cancelText: cancelText,
            titleTheme: titleTheme,
            className: className
          });
        } else {
          return new Promise(function (resolve, reject) {
            window.confirmDialog(msg, resolve, reject, title, buttons, {
              confirmText: confirmText,
              cancelText: cancelText,
              titleTheme: titleTheme,
              className: className
            });
          });
        }
      }; // 封装一下confirmDialog，让我可以写成同步执行，显得优雅一些


      window.confirmDialogPromise = function (msg, topmsg, buttons) {
        return new Promise(function (resolve, reject) {
          window.confirmDialog(msg, function () {
            resolve(true);
          }, function () {
            resolve(false);
          }, topmsg, buttons);
        });
      }; // 图片预览器
      // 提供show(url, urls)方法开启预览
      // 提供close()方法关闭预览


      window.showImageViewer = function (url, urls) {
        _this2.refs.imageViewer.show(url, urls);
      };
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (nextProps.payment && nextProps.payment.qcodeUrl) {
        this.setState({
          qrcodeUrl: nextProps.payment.qcodeUrl
        }, function () {
          var canvas = _this3.refs['qr-canvas'].getElementsByTagName('canvas')[0];

          var qrCodeBase64 = canvas.toDataURL('image/png');

          _this3.setState({
            qrCodeBase64: qrCodeBase64
          });
        });
      }
    }
  }, {
    key: "onConfirmDialog",
    value: function onConfirmDialog(tag) {
      if (tag == 'confirm') {
        this.successDialog && this.successDialog();
        this.refs.dialogConfirm.hide();
      } else {
        this.cancelDialog && this.cancelDialog();
      }

      this.successDialog = null;
      this.cancelDialog = null;
    }
  }, {
    key: "onClosePayment",
    value: function onClosePayment() {
      this.props.cancelPayDialog();
    }
    /**
     * 二维码弹框点击判断
     * @param {Event} e
     */

  }, {
    key: "onQrCodeTouch",
    value: function onQrCodeTouch(e) {
      var event = e.nativeEvent;
      var appDom = document.querySelector('#app');
      var qrConfirm = document.querySelector('.qrcode-wrap');
      var qrHeight = qrConfirm.clientHeight;
      var qrWidth = qrConfirm.clientWidth;
      var appHeight = appDom.clientHeight;
      var appWidth = appDom.clientWidth;
      var pointX = event.changedTouches[0].clientX;
      var pointY = event.changedTouches[0].clientY;
      var top = (appHeight - qrHeight) / 2;
      var bottom = (appHeight - qrHeight) / 2 + qrHeight;
      var left = (appWidth - qrWidth) / 2;
      var right = (appWidth - qrWidth) / 2 + qrWidth;

      if (pointX > right || pointX < left || pointY > bottom || pointY < top) {
        this.onClosePayment();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "".concat(this.props.showPaymentDialog ? 'main-f-box' : '')
      }, this.props.children, React.createElement("span", {
        className: "portal-container",
        style: {
          zIndex: 15
        }
      }, React.createElement("span", {
        className: "portal-high",
        style: {
          zIndex: 3
        }
      }), React.createElement("span", {
        className: "portal-middle",
        style: {
          zIndex: 2
        }
      }), React.createElement("span", {
        className: "portal-low",
        style: {
          zIndex: 1
        }
      })), React.createElement(_toast.default, {
        isOpen: this.props.toast.show,
        content: this.props.toast.msg,
        duration: this.props.toast.timeout,
        type: this.props.toast.type
      }), React.createElement(_reactDialog.Confirm, {
        ref: "dialogConfirm",
        onBtnClick: this.onConfirmDialog.bind(this),
        buttons: this.state.buttons || 'cancel-confirm',
        confirmText: this.state.confirmText,
        cancelText: this.state.cancelText,
        titleTheme: this.state.titleTheme,
        className: this.state.confirmClassName
      }, React.createElement("main", {
        className: "dialog-main"
      }, React.createElement("div", {
        className: "confirm-top"
      }, this.state.confirmTop), _typeof(this.state.confirmContent) === 'object' ? React.createElement("div", {
        className: "confirm-content"
      }, this.state.confirmContent) : React.createElement("div", {
        className: "confirm-content",
        dangerouslySetInnerHTML: dangerHtml(this.state.confirmContent)
      }))), React.createElement(_loading.default, {
        show: this.props.loading
      }), React.createElement(_reactDialog.MiddleDialog, {
        show: this.props.showPaymentDialog,
        buttons: "none",
        theme: "empty",
        bghide: true,
        titleTheme: 'white',
        className: "ql-pay-dialog",
        title: "\u4F7F\u7528\u5FAE\u4FE1\u626B\u7801\u652F\u4ED8",
        onClose: this.onClosePayment.bind(this)
      }, React.createElement("div", {
        className: "qrcode-wrap",
        ref: "qr-canvas"
      }, React.createElement("img", {
        style: {
          pointerEvents: !_detect.default.os.phone && 'none'
        },
        className: "qrcode-image",
        onTouchStart: this.onQrCodeTouch.bind(this),
        src: this.state.qrCodeBase64
      }), React.createElement(_qrcode.default, {
        style: {
          display: 'none'
        },
        value: this.state.qrcodeUrl
      }), React.createElement("p", {
        className: "qrcode-tip"
      }, "\u626B\u63CF\u4E8C\u7EF4\u7801\uFF0C\u8BC6\u522B\u56FE\u4E2D\u4E8C\u7EF4\u7801"))), React.createElement(_reactImageViewer.default, {
        ref: "imageViewer"
      }), !!this.props.virtualQrcodeUrl && React.createElement("div", {
        className: "virtual-qrcode"
      }, React.createElement("img", {
        src: this.props.virtualQrcodeUrl,
        alt: ""
      })));
    }
  }]);

  return App;
}(React.Component);

_defineProperty(App, "contextTypes", {
  router: _propTypes.default.object
});

_defineProperty(App, "propTypes", {
  context: _propTypes.default.object
});

_defineProperty(App, "defaultProps", {
  context: {
    insertCss: function insertCss() {
      for (var _len2 = arguments.length, styles = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        styles[_key2] = arguments[_key2];
      }

      styles.forEach(function (style) {
        var css = style._getCss();

        if (styleList.indexOf(css) < 0) {
          styleList.push(css);
          var styleDom = document.createElement('style');
          styleDom.type = 'text/css';
          style._getCss && (styleDom.innerHTML = style._getCss());
          document.querySelector('head').appendChild(styleDom);
        }
      });
    }
  }
});

_defineProperty(App, "childContextTypes", {
  insertCss: _propTypes.default.func.isRequired
});

;

function mapStateToProps(state) {
  return {
    toast: state.common.toast,
    loading: state.common.loading,
    payment: state.common.payment,
    showPaymentDialog: state.common.payment.showDialog,
    virtualQrcodeUrl: state.common.virtualQrcodeUrl
  };
}

var mapActionToProps = {
  toastAction: _common.toast,
  loadingAction: _common.loading,
  togglePayDialog: _common.togglePayDialog,
  cancelPayDialog: _common.cancelPayDialog
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapActionToProps)(App);

exports.default = _default;

function getRouter() {
  return _router;
}

;

/***/ }),

/***/ "./wechat-react/assets/ql-fonts/style.scss":
/*!*************************************************!*\
  !*** ./wechat-react/assets/ql-fonts/style.scss ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/base-definition.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/assets/styles/base-definition.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/common.scss":
/*!************************************************!*\
  !*** ./wechat-react/assets/styles/common.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/flex.scss":
/*!**********************************************!*\
  !*** ./wechat-react/assets/styles/flex.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/fonts/source-han-sans.scss":
/*!***************************************************************!*\
  !*** ./wechat-react/assets/styles/fonts/source-han-sans.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/icon.scss":
/*!**********************************************!*\
  !*** ./wechat-react/assets/styles/icon.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/mixins.scss":
/*!************************************************!*\
  !*** ./wechat-react/assets/styles/mixins.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/page-common.scss":
/*!*****************************************************!*\
  !*** ./wechat-react/assets/styles/page-common.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/reset.scss":
/*!***********************************************!*\
  !*** ./wechat-react/assets/styles/reset.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/rmc-datepicker-popup.scss":
/*!**************************************************************!*\
  !*** ./wechat-react/assets/styles/rmc-datepicker-popup.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/assets/styles/rmc-datepicker.scss":
/*!********************************************************!*\
  !*** ./wechat-react/assets/styles/rmc-datepicker.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/action-sheet/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/action-sheet/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/address-select/style.scss":
/*!***********************************************************!*\
  !*** ./wechat-react/components/address-select/style.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/api-service/api.js":
/*!****************************************************!*\
  !*** ./wechat-react/components/api-service/api.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiService = exports.ApiService = void 0;

var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "../node_modules/isomorphic-fetch/fetch-npm-browserify.js"));

var _buildQuery = __webpack_require__(/*! ./build-query */ "./wechat-react/components/api-service/build-query.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ApiService =
/*#__PURE__*/
function () {
  function ApiService() {
    _classCallCheck(this, ApiService);

    _defineProperty(this, "options", {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
      /**
       * ajax请求host
       *
       * @
       *
       * @memberOf ApiService
       */

    });

    _defineProperty(this, "baseApiHost", "/api/wechat/transfer");

    _defineProperty(this, "weappApiHost", "/api/wechat/transfer");

    _defineProperty(this, "wechatApiHost", "/api/wechat/transfer");
  }

  _createClass(ApiService, [{
    key: "get",

    /**
     * get请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */
    value: function get(opt) {
      opt.url = (0, _buildQuery.buildquery)(opt.url, opt.body);
      return this.buildMethod('GET')(opt);
    }
    /**
     * post请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */

  }, {
    key: "post",
    value: function post(opt) {
      return this.buildMethod('POST')(opt);
    }
    /**
     * put请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */

  }, {
    key: "put",
    value: function put(opt) {
      return this.buildMethod('PUT')(opt);
    }
    /**
     * patch请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */

  }, {
    key: "patch",
    value: function patch(opt) {
      return this.buildMethod('PATCH')(opt);
    }
    /**
     * delete请求方法
     *
     * @template T
     * @param {IRequestOptions} opt 请求参数
     * @returns
     *
     * @memberOf ApiService
     */

  }, {
    key: "delete",
    value: function _delete(opt) {
      return this.buildMethod('DELETE')(opt);
    }
    /**
     * 创建一种类型的请求方法
     *
     * @
     * @template T
     * @param {HttpTypes} method 请求方法类型
     * @returns {(opt: IRequestOptions) =>  Promise <any>} 请求方法
     *
     * @memberOf ApiService
     */

  }, {
    key: "buildMethod",
    value: function buildMethod(method) {
      var _this = this;

      return function (opt) {
        return new Promise(function (resolve, reject) {
          var url = opt.url,
              body = opt.body; // url = opt.noTransfer ? url : this.apiHost + url

          if (!opt.noTransfer) {
            var site = opt.transferApiSite || 'baseApi';

            switch (site) {
              case 'baseApi':
                url = _this.baseApiHost + url;
                break;

              case 'wechatApi':
                url = _this.wechatApiHost + url;
                break;

              case 'weappApi':
                url = _this.weappApiHost + url;
                break;
            }
          }

          if (body) {
            body = method !== 'GET' ? JSON.stringify(body) : null;
          }

          var obj = {
            method: method,
            body: body,
            // headers: [
            //     ['Content-Type', 'application/json;charset=UTF-8'],
            // ],
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: 'include'
          };
          (0, _isomorphicFetch.default)(url, obj).then(function (res) {
            return res.json();
          }).then(function (json) {
            if (!json.state || json.state.code == undefined) {
              throw new Error('返回格式错误');
            }

            resolve(json);

            if (json.state.code !== 0 && json.state.msg && opt.showError && window.message) {
              window.message.warning(json.state.msg);
            }
          }).catch(function (err) {
            console.error(err);

            if (opt.useReject) {
              reject(err);
            }

            if (opt.fixFetchError) {
              var result = {
                state: {
                  code: 444444,
                  msg: '请求接口失败'
                },
                data: {}
              };
              resolve(result);
            }
          });
        });
      };
    }
  }]);

  return ApiService;
}();

exports.ApiService = ApiService;
var apiService = new ApiService();
exports.apiService = apiService;

/***/ }),

/***/ "./wechat-react/components/api-service/build-query.js":
/*!************************************************************!*\
  !*** ./wechat-react/components/api-service/build-query.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

exports.__esModule = true;
/**
 * 将对象以search语句的形式放入url中
 *
 * @export
 * @param {string} url 请求地址
 * @param {*} query search语句对象
 * @returns {string} 构建好的url
 */

function buildquery(url, query) {
  if (!query || _typeof(query) !== 'object') {
    return url;
  }

  var result = [];

  var _loop_1 = function _loop_1(key) {
    if (query.hasOwnProperty(key)) {
      var val_1 = query[key]; // 如果是数组则将每一项都push进result

      if (Array.isArray(val_1)) {
        val_1.forEach(function (item) {
          result.push(key + "=" + val_1);
        });
      } else {
        result.push(key + "=" + val_1);
      }
    }
  };

  for (var key in query) {
    _loop_1(key);
  }

  var querysymbol = url.indexOf('?') > -1 ? '&' : '?';
  return url + querysymbol + result.join('&');
}

exports.buildquery = buildquery;

/***/ }),

/***/ "./wechat-react/components/api-service/index.js":
/*!******************************************************!*\
  !*** ./wechat-react/components/api-service/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var api_1 = __webpack_require__(/*! ./api */ "./wechat-react/components/api-service/api.js");

exports.ApiService = api_1.ApiService; // var api_mock_1 = require("./api.mock");
// exports.ApiMockService = api_mock_1.ApiMockService;

var api_2 = __webpack_require__(/*! ./api */ "./wechat-react/components/api-service/api.js");

exports.apiService = new api_2.ApiService();

/***/ }),

/***/ "./wechat-react/components/app-download-bar/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/app-download-bar/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/app-download-confirm/style.scss":
/*!*****************************************************************!*\
  !*** ./wechat-react/components/app-download-confirm/style.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/archivement-card/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/archivement-card/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/auto-fixed-nav/style.scss":
/*!***********************************************************!*\
  !*** ./wechat-react/components/auto-fixed-nav/style.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/back-tuition-dialog/style.scss":
/*!****************************************************************!*\
  !*** ./wechat-react/components/back-tuition-dialog/style.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/books-item/style.scss":
/*!*******************************************************!*\
  !*** ./wechat-react/components/books-item/style.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/bottom-brand/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/bottom-brand/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/bullet-screen/style.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/bullet-screen/style.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/calendar-card/style/index.scss":
/*!****************************************************************!*\
  !*** ./wechat-react/components/calendar-card/style/index.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/camp-ad/style.scss":
/*!****************************************************!*\
  !*** ./wechat-react/components/camp-ad/style.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/canvas-video-player/style.scss":
/*!****************************************************************!*\
  !*** ./wechat-react/components/canvas-video-player/style.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/carousel/style.scss":
/*!*****************************************************!*\
  !*** ./wechat-react/components/carousel/style.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/category-menu/style.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/category-menu/style.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/channel-list-item/style.scss":
/*!**************************************************************!*\
  !*** ./wechat-react/components/channel-list-item/style.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/common-course-item/style.scss":
/*!***************************************************************!*\
  !*** ./wechat-react/components/common-course-item/style.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/common-input/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/common-input/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/common-textarea/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/common-textarea/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/community-guide-modal/style.scss":
/*!******************************************************************!*\
  !*** ./wechat-react/components/community-guide-modal/style.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/community-suspension/style.scss":
/*!*****************************************************************!*\
  !*** ./wechat-react/components/community-suspension/style.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/confirm-dialog/style.scss":
/*!***********************************************************!*\
  !*** ./wechat-react/components/confirm-dialog/style.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/coral-focus-top/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/coral-focus-top/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/coral-tabbar/styles.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/coral-tabbar/styles.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/coupon-dialog/style.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/coupon-dialog/style.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/coupon-in-detail/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/coupon-in-detail/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/coupon-item/style.scss":
/*!********************************************************!*\
  !*** ./wechat-react/components/coupon-item/style.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/course-purchase/components/coupon-btn/style.scss":
/*!**********************************************************************************!*\
  !*** ./wechat-react/components/course-purchase/components/coupon-btn/style.scss ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/course-purchase/components/coupon-lists/style.scss":
/*!************************************************************************************!*\
  !*** ./wechat-react/components/course-purchase/components/coupon-lists/style.scss ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/course-purchase/components/payment-details-dialog/style.scss":
/*!**********************************************************************************************!*\
  !*** ./wechat-react/components/course-purchase/components/payment-details-dialog/style.scss ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/course-purchase/components/try-listen-btn/style.scss":
/*!**************************************************************************************!*\
  !*** ./wechat-react/components/course-purchase/components/try-listen-btn/style.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/course-purchase/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/course-purchase/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/create-live-helper/style.scss":
/*!***************************************************************!*\
  !*** ./wechat-react/components/create-live-helper/style.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/curtain/index.scss":
/*!****************************************************!*\
  !*** ./wechat-react/components/curtain/index.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/date-picker/style.scss":
/*!********************************************************!*\
  !*** ./wechat-react/components/date-picker/style.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/detect.js":
/*!*******************************************!*\
  !*** ./wechat-react/components/detect.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var detectObj = {};

function detect(ua, platform) {
  var os = this.os = {},
      browser = this.browser = {},
      webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
      android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
      osx = !!ua.match(/\(Macintosh\; Intel /),
      weixin = ua.match(/MicroMessenger/i),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      win = /Win\d{2}|Windows/.test(platform),
      wp = ua.match(/Windows Phone ([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/),
      firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
      ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
      webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
      safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/); // Todo: clean this up with a better OS/browser seperation:
  // - discern (more) between multiple browsers on android
  // - decide if kindle fire in silk mode is android or not
  // - Firefox on Android doesn't specify the Android version
  // - possibly devide in os, device and browser hashes

  if (browser.webkit = !!webkit) browser.version = webkit[1];
  if (weixin) os.weixin = true;
  if (android) os.android = true, os.version = android[2];
  if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
  if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
  if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
  if (weixin) os.weixin = true;
  if (wp) os.wp = true, os.version = wp[1];
  if (webos) os.webos = true, os.version = webos[2];
  if (touchpad) os.touchpad = true;
  if (blackberry) os.blackberry = true, os.version = blackberry[2];
  if (bb10) os.bb10 = true, os.version = bb10[2];
  if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
  if (playbook) browser.playbook = true;
  if (kindle) os.kindle = true, os.version = kindle[1];
  if (silk) browser.silk = true, browser.version = silk[1];
  if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
  if (chrome) browser.chrome = true, browser.version = chrome[1];
  if (firefox) browser.firefox = true, browser.version = firefox[1];
  if (firefoxos) os.firefoxos = true, os.version = firefoxos[1];
  if (ie) browser.ie = true, browser.version = ie[1];

  if (safari && (osx || os.ios || win)) {
    browser.safari = true;
    if (!os.ios) browser.version = safari[1];
  }

  if (webview) browser.webview = true;
  os.tablet = !!(ipad || playbook || android && !ua.match(/Mobile/) || firefox && ua.match(/Tablet/) || ie && !ua.match(/Phone/) && ua.match(/Touch/));
  os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 || chrome && ua.match(/Android/) || chrome && ua.match(/CriOS\/([\d.]+)/) || firefox && ua.match(/Mobile/) || ie && ua.match(/Touch/)));
  browser.qlchat = /qlchat/i.test(ua);
}

detect.call(detectObj, typeof window == 'undefined' ? '' : navigator.userAgent || '', typeof window == 'undefined' ? '' : navigator.platform || '');
var _default = detectObj;
exports.default = _default;

/***/ }),

/***/ "./wechat-react/components/dialog/styles.scss":
/*!****************************************************!*\
  !*** ./wechat-react/components/dialog/styles.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/company/style.scss":
/*!*********************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/company/style.scss ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/coral-join/style.scss":
/*!************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/coral-join/style.scss ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/coral-promo-dialog/components/tutorial/styles.scss":
/*!*****************************************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/coral-promo-dialog/components/tutorial/styles.scss ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/coral-promo-dialog/style.scss":
/*!********************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/coral-promo-dialog/style.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/coral-push-box/styles.scss":
/*!*****************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/coral-push-box/styles.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/doctor/style.scss":
/*!********************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/doctor/style.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/focus-qrcode/style.scss":
/*!**************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/focus-qrcode/style.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/focusql-guide/style.scss":
/*!***************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/focusql-guide/style.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/hot-heart/style.scss":
/*!***********************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/hot-heart/style.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/job-list-dialog/style.scss":
/*!*****************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/job-list-dialog/style.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/live-v/style.scss":
/*!********************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/live-v/style.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/more-user-info/index.scss":
/*!****************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/more-user-info/index.scss ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/new-real-name/style.scss":
/*!***************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/new-real-name/style.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/push-dialogs/style.scss":
/*!**************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/push-dialogs/style.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/pyramid/style.scss":
/*!*********************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/pyramid/style.scss ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/real-name/style.scss":
/*!***********************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/real-name/style.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/reprint-push-box/styles.scss":
/*!*******************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/reprint-push-box/styles.scss ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/share-success/style.scss":
/*!***************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/share-success/style.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/spokesperson/style.scss":
/*!**************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/spokesperson/style.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/symbol-list/style.scss":
/*!*************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/symbol-list/style.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/dialogs-colorful/teacher-cup/style.scss":
/*!*************************************************************************!*\
  !*** ./wechat-react/components/dialogs-colorful/teacher-cup/style.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/down-card/style.scss":
/*!******************************************************!*\
  !*** ./wechat-react/components/down-card/style.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/empty-page/style.scss":
/*!*******************************************************!*\
  !*** ./wechat-react/components/empty-page/style.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/envi.js":
/*!*****************************************!*\
  !*** ./wechat-react/components/envi.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAndroid = isAndroid;
exports.isIOS = isIOS;
exports.isWeixin = isWeixin;
exports.isWeibo = isWeibo;
exports.isChrome = isChrome;
exports.isFireFox = isFireFox;
exports.isPc = isPc;
exports.isQlchat = isQlchat;
exports.getQlchatVersion = getQlchatVersion;

var _util = __webpack_require__(/*! ./util */ "./wechat-react/components/util.js");

var ua = typeof window == 'undefined' ? '' : window.navigator.userAgent || '';

function isAndroid() {
  return ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1;
}

function isIOS() {
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
}

function isWeixin() {
  return ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
}

function isWeibo() {
  return ua.toLowerCase().match(/WeiBo/i) == "weibo";
}

function isChrome() {
  return !!(typeof window != 'undefined' && window.chrome);
}

function isFireFox() {
  return /firefox/i.test(ua.toLowerCase());
}

function isPc() {
  return !isAndroid() && !isIOS();
}

function isQlchat() {
  return ua.toLowerCase().match(/qlchat/i) == "qlchat" || (0, _util.getCookie)('QLCHAT-APP') == 'qlchat';
}

function getQlchatVersion() {
  var qlver = ua.toLowerCase().match(/qlchat[a-zA-Z]*?\/([\d.]+)/);

  if (qlver && qlver.length) {
    return parseInt(qlver[1]);
  }

  return;
}

/***/ }),

/***/ "./wechat-react/components/flag-ui/style.scss":
/*!****************************************************!*\
  !*** ./wechat-react/components/flag-ui/style.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/fold-view/style.scss":
/*!******************************************************!*\
  !*** ./wechat-react/components/fold-view/style.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/follow-dialog/style.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/follow-dialog/style.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/full-width-btn/style.scss":
/*!***********************************************************!*\
  !*** ./wechat-react/components/full-width-btn/style.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/graphic-course-comment-dialog/style.scss":
/*!**************************************************************************!*\
  !*** ./wechat-react/components/graphic-course-comment-dialog/style.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/group-entrance-bar/style.scss":
/*!***************************************************************!*\
  !*** ./wechat-react/components/group-entrance-bar/style.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/guest-you-like/style.scss":
/*!***********************************************************!*\
  !*** ./wechat-react/components/guest-you-like/style.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/guide-video/style.scss":
/*!********************************************************!*\
  !*** ./wechat-react/components/guide-video/style.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/home-float-button/style.scss":
/*!**************************************************************!*\
  !*** ./wechat-react/components/home-float-button/style.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/horizontal-marquee/style.scss":
/*!***************************************************************!*\
  !*** ./wechat-react/components/horizontal-marquee/style.scss ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/horizontal-scrolling/style.scss":
/*!*****************************************************************!*\
  !*** ./wechat-react/components/horizontal-scrolling/style.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/image-viewer/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/image-viewer/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/indep-render/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/indep-render/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/intro-group-bar/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/intro-group-bar/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/intro-qrCode-dialog/style.scss":
/*!****************************************************************!*\
  !*** ./wechat-react/components/intro-qrCode-dialog/style.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/invite-friends-to-listen/style.scss":
/*!*********************************************************************!*\
  !*** ./wechat-react/components/invite-friends-to-listen/style.scss ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/job-reminder/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/job-reminder/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/learn-everyday-top-tab-bar/style.scss":
/*!***********************************************************************!*\
  !*** ./wechat-react/components/learn-everyday-top-tab-bar/style.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/live-category-picker/style.scss":
/*!*****************************************************************!*\
  !*** ./wechat-react/components/live-category-picker/style.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/live-follow-info/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/live-follow-info/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/live-info/style.scss":
/*!******************************************************!*\
  !*** ./wechat-react/components/live-info/style.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/live-profit-list/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/live-profit-list/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/new-user-gift/style.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/new-user-gift/style.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/novice-guide-step/live-index-bar/style.scss":
/*!*****************************************************************************!*\
  !*** ./wechat-react/components/novice-guide-step/live-index-bar/style.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/novice-guide-step/live-index/style.scss":
/*!*************************************************************************!*\
  !*** ./wechat-react/components/novice-guide-step/live-index/style.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/novice-guide-step/live-workbench/style.scss":
/*!*****************************************************************************!*\
  !*** ./wechat-react/components/novice-guide-step/live-workbench/style.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/novice-guide-step/style.scss":
/*!**************************************************************!*\
  !*** ./wechat-react/components/novice-guide-step/style.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/operate-menu/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/operate-menu/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/optimize-dialog/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/optimize-dialog/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/phone-auth/style.scss":
/*!*******************************************************!*\
  !*** ./wechat-react/components/phone-auth/style.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/phone-code/index.scss":
/*!*******************************************************!*\
  !*** ./wechat-react/components/phone-code/index.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/picker-view/style/index.scss":
/*!**************************************************************!*\
  !*** ./wechat-react/components/picker-view/style/index.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/picker/style/index.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/picker/style/index.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/playing-animate/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/playing-animate/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/protocol-live-studio-page/style.scss":
/*!**********************************************************************!*\
  !*** ./wechat-react/components/protocol-live-studio-page/style.scss ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/protocol-page/style.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/protocol-page/style.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/qfu-enter-bar/style.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/qfu-enter-bar/style.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/qlchat-focus-ads/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/qlchat-focus-ads/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/qrcode/style.scss":
/*!***************************************************!*\
  !*** ./wechat-react/components/qrcode/style.scss ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/react-mobile-datepicker/index.scss":
/*!********************************************************************!*\
  !*** ./wechat-react/components/react-mobile-datepicker/index.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/redpoint/style.scss":
/*!*****************************************************!*\
  !*** ./wechat-react/components/redpoint/style.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/riding-latern/style.scss":
/*!**********************************************************!*\
  !*** ./wechat-react/components/riding-latern/style.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/rolling-down-nav/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/rolling-down-nav/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/scholarship-menu/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/scholarship-menu/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/score-star/style.scss":
/*!*******************************************************!*\
  !*** ./wechat-react/components/score-star/style.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/scroll-view/style.scss":
/*!********************************************************!*\
  !*** ./wechat-react/components/scroll-view/style.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/scrollToLoad/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/scrollToLoad/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/search-bar/style.scss":
/*!*******************************************************!*\
  !*** ./wechat-react/components/search-bar/style.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/share-user-app/style.scss":
/*!***********************************************************!*\
  !*** ./wechat-react/components/share-user-app/style.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/short-knowledge-tip/style.scss":
/*!****************************************************************!*\
  !*** ./wechat-react/components/short-knowledge-tip/style.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/simple-control-dialog/style.scss":
/*!******************************************************************!*\
  !*** ./wechat-react/components/simple-control-dialog/style.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/sms-protocol-page/style.scss":
/*!**************************************************************!*\
  !*** ./wechat-react/components/sms-protocol-page/style.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/studio-index/components/function-menu/animation.scss":
/*!**************************************************************************************!*\
  !*** ./wechat-react/components/studio-index/components/function-menu/animation.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/studio-index/components/function-menu/style.scss":
/*!**********************************************************************************!*\
  !*** ./wechat-react/components/studio-index/components/function-menu/style.scss ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/studio-index/style.scss":
/*!*********************************************************!*\
  !*** ./wechat-react/components/studio-index/style.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/subscription-bar/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/subscription-bar/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/swiper/3.4.2/animate.css":
/*!**********************************************************!*\
  !*** ./wechat-react/components/swiper/3.4.2/animate.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/swiper/3.4.2/swiper.min.css":
/*!*************************************************************!*\
  !*** ./wechat-react/components/swiper/3.4.2/swiper.min.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/switch/style.scss":
/*!***************************************************!*\
  !*** ./wechat-react/components/switch/style.scss ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/tab-view/style.scss":
/*!*****************************************************!*\
  !*** ./wechat-react/components/tab-view/style.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/tabbar/styles.scss":
/*!****************************************************!*\
  !*** ./wechat-react/components/tabbar/styles.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/thousand-live-app-download-bar/style.scss":
/*!***************************************************************************!*\
  !*** ./wechat-react/components/thousand-live-app-download-bar/style.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/tips-card/style.scss":
/*!******************************************************!*\
  !*** ./wechat-react/components/tips-card/style.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/top-optimize-bar/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/top-optimize-bar/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/topic-assemble-content/style.scss":
/*!*******************************************************************!*\
  !*** ./wechat-react/components/topic-assemble-content/style.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/topic-list-item/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/topic-list-item/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/try-listen-share-mask/style.scss":
/*!******************************************************************!*\
  !*** ./wechat-react/components/try-listen-share-mask/style.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/try-listen-status-bar/style.scss":
/*!******************************************************************!*\
  !*** ./wechat-react/components/try-listen-status-bar/style.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/update-tips/audio-speed/style.scss":
/*!********************************************************************!*\
  !*** ./wechat-react/components/update-tips/audio-speed/style.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/url-utils.js":
/*!**********************************************!*\
  !*** ./wechat-react/components/url-utils.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query2string = exports.fillParams = exports.getUrlParams = void 0;

/**
 * 获取query参数
 * @param  {string} name 需要获取的参数key值
 * @return {[type]}      [description]
 */
var getUrlParams = function getUrlParams(name, search) {
  var search = (search || window.location.search).match(/\?.*(?=\b|#)/);
  search && (search = search[0].replace(/^\?/, ''));
  if (!search) return name ? '' : {};
  var queries = {},
      params = search.split('&');

  for (var i in params) {
    var param = params[i].split('=');
    queries[param[0]] = param[1] ? decodeURIComponent(param[1]) : '';
  }

  return name ? queries[name] : queries;
};
/**
 * 给url注入参数，注入的参数会覆盖旧参数
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-06-25T09:37:04+0800
 * @param    {Object}                           params  要注入的参数
 * @param    {String}                           url     要注入参数的url, 为空时取当前页面url
 * @param    {Array}                           withouts url中需要排除的参数key数组
 * 例：
 * fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d?aa=1&bb=2&cc=3&b=4#a=0&b=6', ['aa', 'a', 'b', 'c', 'bb', 'cc'])
 *   =》"http://a.b.c.d#a=0&b=6"
 *
 * fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d?aa=1&bb=2&cc=3&b=4#a=0&b=6', ['aa', 'a', 'b', 'c', 'bb'])
 *   =》"http://a.b.c.d?cc=3#a=0&b=6"
 *
 *  fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d?aa=1&bb=2&cc=3&b=4#a=0&b=6', ['aa'])
 *   =》"http://a.b.c.d?bb=2&cc=3&a=1&b=2&c=3#a=0&b=6"
 *
 *  fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d?aa=1&bb=2&cc=3&b=4#a=0&b=6')
 *   =》"http://a.b.c.d?aa=1&bb=2&cc=3&a=1&b=2&c=3#a=0&b=6"
 *
 *  fillParams({a: 1, b: 2, c: 3}, 'http://a.b.c.d')
 *   =》"http://a.b.c.d?a=1&b=2&c=3"
 *
 * @return   {String}                          注入参数后的url
 */


exports.getUrlParams = getUrlParams;

var fillParams = function fillParams(params, url, withouts) {
  url = url || window.location.href;
  var urlPairs = url.split('#'),
      fullUrl = urlPairs[0],
      hashUrl = urlPairs.length > 1 && '#' + urlPairs[1] || '',
      baseUrl = fullUrl.split('?')[0],
      originParams = getUrlParams(null, fullUrl),
      paramsList = [],
      re = '';

  for (var key in originParams) {
    if (undefined === params[key] && indexOfArray(withouts, key) === -1) {
      paramsList.push(key + '=' + originParams[key]);
    }
  }

  for (var key1 in params) {
    if (indexOfArray(withouts, key1) === -1) {
      if (params[key1] !== undefined) {
        paramsList.push(key1 + '=' + params[key1]);
      }
    }
  }

  re += baseUrl;
  re += paramsList.length && '?' + paramsList.join('&') || '';
  re += hashUrl;
  return re;
};
/**
 * 判断key是否在数组中
 * @Author   fisher<wangjiang.fly.1989@163.com>
 * @DateTime 2016-06-25T09:26:51+0800
 * @param    {[type]}                           arr [description]
 * @param    {[type]}                           key [description]
 * @return   {[type]}                               [description]
 */


exports.fillParams = fillParams;

var indexOfArray = function indexOfArray(arr, key) {
  arr = arr || [];

  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === key) {
      return i;
    }
  }

  return -1;
};
/**
 * 将 URL 参数转换为字符串
 * @param {Mix} query1[, query2][, withouts]  处理参数
 *        @param {Array} withouts 要排除的字段
 * @return {String} 最后格式化完后的字符串
 * .eg
 *     query2string({'pf':'145','ss':'320x240'});
 *     query2string({'pf':'145','ss':'320x240'},['pf']);
 *     query2string({'pf':'145','ss':'320x240'},{'fr':'android'});
 *     query2string({'pf':'145','ss':'320x240'},{'fr':'android'},['fr']);
 */


var query2string = function query2string() {
  var args = Array.prototype.slice.apply(arguments),
      string = '',
      withouts,
      lastIndex = args.length - 1,
      fields = []; // 检测是否有排除参数

  if (Array.isArray(args[lastIndex])) {
    withouts = args[lastIndex];
    args.pop();
  } // 需要生成的参数对象


  var qsObj = {};
  args.forEach(function (item) {
    Object.keys(item).forEach(function (key) {
      // 原有的逻辑不是相同的key替换，而是后面的key跟现有的有冲突时会被忽略掉
      if (!qsObj[key] && (!withouts || withouts.indexOf(key) === -1)) {
        qsObj[key] = item[key];
      }
    });
  });
  var pairs = [];

  for (var i = 0; i < args.length; i++) {
    for (var key in args[i]) {
      pairs.push(key + '=' + args[i][key]);
    }
  }

  return pairs.join('&');
};

exports.query2string = query2string;

/***/ }),

/***/ "./wechat-react/components/util.js":
/*!*****************************************!*\
  !*** ./wechat-react/components/util.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatMoney = formatMoney;
exports.formatNumber = formatNumber;
exports.addPlus = addPlus;
exports.formatDate = formatDate;
exports.dongbaDistrict = dongbaDistrict;
exports.formatCountdown = formatCountdown;
exports.checkID = checkID;
exports.mixId = mixId;
exports.dayLeft = dayLeft;
exports.locationTo = locationTo;
exports.digitFormat = digitFormat;
exports.digitFloor2 = digitFloor2;
exports.accAdd = accAdd;
exports.stringLengthValid = stringLengthValid;
exports.getVal = getVal;
exports.sortBy = sortBy;
exports.updateUrl = updateUrl;
exports.reloadPage = reloadPage;
exports.saveLocalStorageArray = saveLocalStorageArray;
exports.setLocalStorageArrayItem = setLocalStorageArrayItem;
exports.localStorageSPListAdd = localStorageSPListAdd;
exports.localStorageSPListDel = localStorageSPListDel;
exports.isFromLiveCenter = isFromLiveCenter;
exports.filterOrderChannel = filterOrderChannel;
exports.getAudioTimeShow = getAudioTimeShow;
exports.createAsyncAction = createAsyncAction;
exports.checkTime = checkTime;
exports.sleep = sleep;
exports.updatePercentageComplete = updatePercentageComplete;
exports.updateLearningTime = updateLearningTime;
exports.updateTopicInChannelVisit = updateTopicInChannelVisit;
exports.initCEndSourseInject = initCEndSourseInject;
exports.addPv = addPv;
exports.isNextDay = isNextDay;
exports.executeFunAccordingToStorage = executeFunAccordingToStorage;
exports.recordBrowseHistoryToStorage = recordBrowseHistoryToStorage;
exports.getChannelFromTypeOfBusiness = getChannelFromTypeOfBusiness;
exports.parseURL = parseURL;
exports.getBusinessUrl = getBusinessUrl;
exports.genUniqStr = genUniqStr;
exports.randomShareText = randomShareText;
exports.fomatFloat = fomatFloat;
exports.numberFormat = numberFormat;
exports.formatRichText = formatRichText;
exports.baiduAutoPush = baiduAutoPush;
exports.getCourseHtmlInfo = exports.isCompetitorLink = exports.getDateDiff = exports.paymentPrice = exports.isLogined = exports.businessTypeCNMap = exports.miniprogramReady = exports.setLocalStorage = exports.getLocalStorage = exports.handleAjaxResult = exports.wait = exports.delCookie = exports.setCookie = exports.getCookie = exports.mul = exports.onQrCodeTouch = exports.imgUrlFormat = exports.validLegal = exports.isNumberValid = exports.refreshPageData = exports.updatePageData = exports.timeAfterMixWeek = exports.dateJudge = exports.formateToDay = exports.htmlTransferGlobal = exports.htmlTransfer = exports.simpleFilter = exports.normalFilter = exports.noShifterParseDangerHtml = exports.parseDangerHtml = exports.dangerHtml = exports.replaceWrapWord = exports.getVieoSrcFromIframe = exports.isBeginning = exports.timeBefore = exports.timeAfterFix = exports.timeAfter = void 0;

var _reduxAct = __webpack_require__(/*! redux-act */ "../node_modules/redux-act/lib/index.js");

var _urlUtils = __webpack_require__(/*! ./url-utils */ "./wechat-react/components/url-utils.js");

var _envi = __webpack_require__(/*! ./envi */ "./wechat-react/components/envi.js");

var _common = __webpack_require__(/*! common_actions/common */ "./wechat-react/actions/common.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 格式化钱
 * @param amount {Number/String}   要格式化的数字
 * @param base   {Number}          格式化基数,默认为100
 * @returns {number}
 * 
 */
function formatMoney(amount) {
  var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  if (base === 1) {
    return amount;
  } // 解决类似amount=1990时的精数不准问题


  if (parseInt(amount) === Number(amount)) {
    return Number(amount || 0) / base;
  } // 解决类似 11.11/100 的精数不准问题


  var money = (Math.floor(Number(amount || 0) / base * base) / base).toFixed(2);
  return money;
}

;
/**
 * 数值计算精度问题
 * @param num {Number/String}   要格式化的数值
 * @param decimal   {Number}    需要保留几位小数
 * @returns {number}
 * 
 */

function formatNumber(num) {
  var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var _num = num;

  for (var i = 0; i < decimal; i++) {
    _num *= 10;
  }

  _num = _num.toFixed(1);
  return Number(Math.ceil(_num) / 100);
}
/**
 * 自动为数字添加加号(负数不加)
 * @param num
 * @return  String
 */


function addPlus(num) {
  num = Number(num || 0);

  if (num > 0) {
    return '+' + num;
  }

  return String(num);
}

;
/**
 * 格格式输出日期串
 * @param date      {Number/Date}   要格式化的日期
 * @param formatStr {String}        格式串(yMdHmsqS)
 * @returns {*|string}
 */

function formatDate(date, formatStr) {
  if (!date) {
    return '';
  }

  var format = formatStr || 'yyyy-MM-dd';

  if ('number' === typeof date || 'string' === typeof date) {
    date = new Date(+date);
  }

  date = dongbaDistrict(date);
  var map = {
    "M": date.getMonth() + 1,
    //月份
    "d": date.getDate(),
    //日
    "h": date.getHours(),
    //小时
    "m": date.getMinutes(),
    //分
    "s": date.getSeconds(),
    //秒
    "q": Math.floor((date.getMonth() + 3) / 3),
    //季度
    "S": date.getMilliseconds() //毫秒

  };
  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    var v = map[t];

    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }

      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }

    return all;
  });
  return format;
}

;
/**
 *
 *
 * @export
 * @param {*} params
 */

function dongbaDistrict(date) {
  var timezone = 8;
  var offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟

  var nowDate = new Date(date).getTime();
  var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
  return targetDate;
}
/**
 * 格式化倒计时时间显示
 *
 * @export
 * @param {*} second
 * @param {*} formatStr
 * @param {boolean} flag
 * @returns
 */


function formatCountdown(second, formatStr) {
  var flag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!second && !Object.is(second, 0)) {
    return '';
  }

  var format = formatStr || 'd';
  second = Number(second);
  var map = {
    "d": ~~(second / (3600 * 24)),
    //日
    "h": ~~(second % (3600 * 24) / 3600),
    //小时
    "m": ~~(second % 3600 / 60),
    //分
    "s": second % 60 //秒

  };

  if (flag) {
    return map;
  } else {
    format = format.replace(/([dhms])+/g, function (all, t) {
      var v = map[t];

      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }

        return v;
      } else if (t === 'd') {
        return v;
      }

      return all;
    });
    return format;
  }
}

;
/**
 * 身份证号码校验
 * @param    {[type]}                cardNo [description]
 * @return   {[type]}                [description]
 * @datetime 2016-09-20T00:04:34+080
 * @author wangxiao<i@muyao.me>
 */

function checkID(cardNo) {
  var info = {
    isTrue: false,
    // 身份证号是否有效。默认为 false
    year: null,
    // 出生年。默认为null
    month: null,
    // 出生月。默认为null
    day: null,
    // 出生日。默认为null
    isMale: false,
    // 是否为男性。默认false
    isFemale: false // 是否为女性。默认false

  };

  if (!cardNo || 18 != cardNo.length) {
    info.isTrue = false;
    return false;
  }

  var year = cardNo.substring(6, 10);
  var month = cardNo.substring(10, 12);
  var day = cardNo.substring(12, 14);
  var p = cardNo.substring(14, 17);
  var birthday = new Date(year, parseFloat(month) - 1, parseFloat(day)); // 这里用getFullYear()获取年份，避免千年虫问题

  if (birthday.getFullYear() != parseFloat(year) || birthday.getMonth() != parseFloat(month) - 1 || birthday.getDate() != parseFloat(day)) {
    info.isTrue = false;
    return false;
  }

  var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子

  var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
  // 验证校验位

  var sum = 0; // 声明加权求和变量

  var _cardNo = cardNo.split("");

  if (_cardNo[17].toLowerCase() == 'x') {
    _cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
  }

  for (var i = 0; i < 17; i++) {
    sum += Wi[i] * _cardNo[i]; // 加权求和
  }

  var i = sum % 11; // 得到验证码所位置

  if (_cardNo[17] != Y[i]) {
    return false;
  }

  info.isTrue = true;
  info.year = birthday.getFullYear();
  info.month = birthday.getMonth() + 1;
  info.day = birthday.getDate();

  if (p % 2 == 0) {
    info.isFemale = true;
    info.isMale = false;
  } else {
    info.isFemale = false;
    info.isMale = true;
  }

  return true;
}
/**
 * 从右至左混淆number的指定len位数(以*填充)
 * @param   {Number/String}   id
 * @param   {Number}          len 混淆的数字长度
 * @return  {string}
 */


function mixId(id, len) {
  if (!id) {
    return '';
  }

  var idStr = String(id);
  len = len || 0;
  return idStr.substring(0, idStr.length - len) + ''.padStart(len, '*');
}
/**
 * 计算剩余天数
 * @param {Number/Date}   date      起始时间
 * @param {Number}        period    总天数
 * @returns {Number} 剩余天数
 */


function dayLeft(date, period) {
  var timeNow = parseInt(new Date().getTime()),
      beginDate = 'object' === _typeof(date) ? date : new Date(date),
      d = (timeNow - parseInt(beginDate.getTime())) / 1000,
      diff_days = Math.ceil(d / 86400);
  return period > diff_days ? period - diff_days : 0;
}
/**
 * 页面url跳转，延时150毫秒
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */


function locationTo(url, weappUrl, isNavigate) {
  if (url && /\s*javascript:/i.test(url)) return;
  setTimeout(function () {
    if (weappUrl && typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram') {
      isNavigate ? wx.miniProgram.navigateTo({
        url: weappUrl
      }) : wx.miniProgram.redirectTo({
        url: weappUrl
      });
    } else {
      if (isFromLiveCenter() && /topic\/\d{1,}\.htm|topic-simple-video|details-video|details-listenling|topic\/details|details-audio-graphic/.test(url) && !/forbidLiveCenter/.test(url)) {
        // 如果目标页面是系列课话题介绍页和各种话题详情页时，带上C端来源(直播中心)标识，并且没有forbidLiveCenter标识
        url = (0, _urlUtils.fillParams)({
          tracePage: 'liveCenter'
        }, url);
      } // window.location.assign(url);


      if ((0, _envi.isQlchat)() && (0, _envi.isIOS)()) {
        window.location.assign(url); // 兼容IOS 嵌套h5返回bug;
      } else {
        window.location.href = url;
      }
    }
  }, 150);
}
/**
 * 数字格式化成万或千
 * @param  {[type]} digit [description]
 * @param  {[type]} block [description]
 * @return {[type]}       [description]
 */


function digitFormat(digit, block) {
  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['千', '万'];
  if (digit === undefined || digit === '') return 0;
  var format = parseInt(block) || 10000;
  digit = parseInt(digit);

  if (digit >= 1000 && digit < 10000 && format <= 1000) {
    digit = digit / 1000;
    digit = digit.toFixed(1) + unit[0];
  } else if (digit > 10000 && digit >= format) {
    digit = digit / 10000;
    digit = digit.toFixed(1) + unit[1];
  }

  return digit;
}
/**
 * 数字保留两位小数（只舍不入）
 * @param  {[type]} digit [description]
 * @return {[type]}       [description]
 */


function digitFloor2(digit) {
  return Math.floor(digit * 100) / 100;
}
/**
 * 根据时间戳显示几天后开始的字符串
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */


var timeAfter = function timeAfter(startTime, nowTime, endTime) {
  var timeNow = parseInt(new Date().getTime()),
      d = (parseInt(startTime) - (nowTime || timeNow)) / 1000,
      d_days = Math.floor(d / 86400),
      d_hours = Math.floor(d / 3600),
      d_minutes = Math.floor(d / 60);

  if (d_days > 0
  /*&& d_days < 15*/
  ) {
      return d_days + "天后";
    } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + "小时后";
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + "分钟后";
  } else if (endTime && (nowTime || timeNow) > endTime) {
    return '已结束';
  } else {
    return '进行中';
  }
};
/**
 * 根据时间戳显示几天后开始的字符串
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */


exports.timeAfter = timeAfter;

var timeAfterFix = function timeAfterFix(startTime, nowTime) {
  var dateNow = new Date(),
      timeNow = Number(dateNow.getTime()),
      hoursNow = dateNow.getHours(),
      minutesNow = dateNow.getMinutes(),
      c = (23 - hoursNow) * 3600 + (60 - minutesNow) * 60,
      d = (Number(startTime) - (nowTime || timeNow)) / 1000,
      d_days = Number(d / 86400),
      d_hours = Number(d / 3600),
      d_minutes = Number(d / 60),
      c_days = Number((d - c) / 86400);

  if (c_days < 0) {
    return "今天";
  } else {
    if (c_days < 1) {
      return "明天";
    } else if (c_days > 1 && c_days < 2) {
      return "后天";
    } else {
      return ~~c_days + 1 + "天后";
    }
  }
};
/**
 * 根据时间戳显示多久前的字符串
 * @param  {[type]} pushTime [description]
 * @return {[type]}           [description]
 */


exports.timeAfterFix = timeAfterFix;

var timeBefore = function timeBefore(pushTime, nowTime) {
  var timeNow = parseInt(new Date().getTime()),
      d = ((nowTime || timeNow) - parseInt(pushTime)) / 1000,
      d_days = Math.floor(d / 86400),
      d_hours = Math.floor(d / 3600),
      d_minutes = Math.floor(d / 60);

  if (d_days > 7) {
    return formatDate(pushTime);
  } else if (d_days > 0 && d_days <= 7) {
    return d_days + "天前";
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + "小时前";
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + "分钟前";
  } else {
    return '刚刚';
  }
};

exports.timeBefore = timeBefore;

var isBeginning = function isBeginning(startTime, nowTime) {
  var timeNow = parseInt(new Date().getTime()),
      d = (parseInt(startTime) - (nowTime || timeNow)) / 1000,
      d_days = parseInt(d / 86400),
      d_hours = parseInt(d / 3600),
      d_minutes = parseInt(d / 60);

  if (d_days > 0 || d_hours > 0 || d_minutes > 0) {
    return false;
  } else {
    return true;
  }
}; // 从iframe截取src值


exports.isBeginning = isBeginning;

var getVieoSrcFromIframe = function getVieoSrcFromIframe(iframeStr) {
  var reg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;

  if (!iframeStr) {
    return '';
  }

  var matchs = iframeStr.match(reg);

  if (matchs && matchs.length > 1) {
    return matchs[1];
  }

  return '';
}; // 换行符处理


exports.getVieoSrcFromIframe = getVieoSrcFromIframe;

var replaceWrapWord = function replaceWrapWord(str) {
  str = str || '';
  str = str.replace(/\</g, function (m) {
    return "&lt;";
  });
  str = str.replace(/\>/g, function (m) {
    return "&gt;";
  });
  return str.replace(/\n/g, function (m) {
    return '</br>';
  });
};

exports.replaceWrapWord = replaceWrapWord;

var dangerHtml = function dangerHtml(content) {
  return {
    __html: content
  };
};

exports.dangerHtml = dangerHtml;

var parseDangerHtml = function parseDangerHtml(content) {
  content = content || '';

  if (typeof document != "undefined") {
    var output,
        elem = document.createElement('div');
    elem.innerHTML = content;
    output = elem.innerText || elem.textContent;
    return {
      __html: output.replace(/\n/g, function (m) {
        return '</br>';
      })
    };
  } else {
    content = content.replace(/\&amp;/g, function (m) {
      return "&";
    });
    return {
      __html: content.replace(/\n/g, function (m) {
        return '</br>';
      })
    };
  }
};

exports.parseDangerHtml = parseDangerHtml;

var noShifterParseDangerHtml = function noShifterParseDangerHtml(content) {
  content = content || '';

  if (typeof document != "undefined") {
    var output,
        elem = document.createElement('div');
    elem.innerHTML = content;
    output = elem.innerText || elem.textContent;
    return {
      __html: output
    };
  } else {
    content = content.replace(/\&amp;/g, function (m) {
      return "&";
    });
    return {
      __html: content
    };
  }
};
/**
 * 过滤主要特殊字符
 * 注意：此方法的使用场景--过滤后的数据只在node或app展示，不在wt展示
 * @author dodomon
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */


exports.noShifterParseDangerHtml = noShifterParseDangerHtml;

var normalFilter = function normalFilter(sf) {
  var sfData = sf || '';
  sfData = sfData.replace(/\</g, function (m) {
    return "&lt;";
  });
  sfData = sfData.replace(/\>/g, function (m) {
    return "&gt;";
  });
  sfData = sfData.replace(/\"/g, function (m) {
    return "&quot;";
  });
  sfData = sfData.replace(/\'/g, function (m) {
    return "&#39;";
  });
  sfData = sfData.replace(/(\u0085)|(\u2028)|(\u2029)/g, function (m) {
    return "";
  });
  sfData = sfData.replace(/\%/g, function (m) {
    return "%25";
  });
  sfData = sfData.replace(/\+/g, function (m) {
    return "%2B";
  });
  sfData = sfData.replace(/\#/g, function (m) {
    return "%23";
  });
  sfData = sfData.replace(/\//g, function (m) {
    return "%2F";
  });
  sfData = sfData.replace(/\?/g, function (m) {
    return "%3F";
  });
  sfData = sfData.replace(/\=/g, function (m) {
    return "%3D";
  });
  sfData = sfData.replace(/\&/g, function (m) {
    return "%26";
  });
  return sfData;
};

exports.normalFilter = normalFilter;

var simpleFilter = function simpleFilter(sf) {
  var sfData = sf || '';
  sfData = sfData.replace(/(\u0085)|(\u2028)|(\u2029)/g, function (m) {
    return "";
  });
  sfData = sfData.replace(/\%/g, function (m) {
    return "%25";
  });
  sfData = sfData.replace(/\+/g, function (m) {
    return "%2B";
  });
  sfData = sfData.replace(/\#/g, function (m) {
    return "%23";
  });
  sfData = sfData.replace(/\//g, function (m) {
    return "%2F";
  });
  sfData = sfData.replace(/\?/g, function (m) {
    return "%3F";
  });
  sfData = sfData.replace(/\=/g, function (m) {
    return "%3D";
  });
  return sfData;
};

exports.simpleFilter = simpleFilter;

var htmlTransfer = function htmlTransfer(sf) {
  var sfData = sf || '';
  sfData = sfData.replace("&lt;", function (m) {
    return "<";
  });
  sfData = sfData.replace("&gt;", function (m) {
    return ">";
  });
  return sfData;
};

exports.htmlTransfer = htmlTransfer;

var htmlTransferGlobal = function htmlTransferGlobal(sf) {
  var sfData = sf || '';
  sfData = sfData.replace(/&lt;/g, function (m) {
    return "<";
  });
  sfData = sfData.replace(/&gt;/g, function (m) {
    return ">";
  });
  sfData = sfData.replace(/(\&quot\;)/g, function (m) {
    return "\"";
  });
  sfData = sfData.replace(/(\&\#39\;)/g, function (m) {
    return "\'";
  });
  return sfData;
};
/**
 * 根据时间戳显示周几的字符串
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */


exports.htmlTransferGlobal = htmlTransferGlobal;

var formateToDay = function formateToDay(startTime, nowTime) {
  var showToday = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var timeNow = nowTime || parseInt(new Date().getTime()),
      d_days = Math.abs((startTime - timeNow) / 1000);
  var timeDay = new Date(startTime).getDay();

  if (!showToday && d_days >= 0 && d_days <= 86400 && timeDay === new Date().getDay()) {
    return "今天";
  } else {
    switch (timeDay) {
      case 1:
        return "周一";
        break;

      case 2:
        return "周二";
        break;

      case 3:
        return "周三";
        break;

      case 4:
        return "周四";
        break;

      case 5:
        return "周五";
        break;

      case 6:
        return "周六";
        break;

      case 0:
        return "周日";
        break;

      default:
        ;
        break;
    }
  }

  ;
};
/**
 * 判断是今天、明天、或者后天
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */


exports.formateToDay = formateToDay;

var dateJudge = function dateJudge(judgeTime, nowTime) {
  var todayTimeStamp = 0;

  if (nowTime) {
    todayTimeStamp = parseInt(new Date(new Date(nowTime).setHours(0, 0, 0, 0)).getTime());
  } else {
    todayTimeStamp = parseInt(new Date(new Date().setHours(0, 0, 0, 0)).getTime());
  }

  var timeStamp1 = todayTimeStamp + 86400000;
  var timeStamp2 = timeStamp1 + 86400000;
  var timeStamp3 = timeStamp2 + 86400000;
  var timeBeJudge = parseInt(judgeTime);

  if (timeBeJudge < todayTimeStamp) {
    return "今天以前";
  } else if (timeBeJudge >= todayTimeStamp && timeBeJudge < timeStamp1) {
    return "今天";
  } else if (timeBeJudge >= timeStamp1 && timeBeJudge < timeStamp2) {
    return "明天";
  } else if (timeBeJudge >= timeStamp2 && timeBeJudge < timeStamp3) {
    return "后天";
  } else {
    return "后天以后";
  }
};
/**
 * 跟星期配合在一起的一个非常复杂的根据时间戳显示几天后开始的字符串
 * 这周到下周之内  显示本周几或下周几更新
 * 超过一周显示X天后更新
 * 其余时间保持原有逻辑不变
 * @param  {[type]} startTime [description]
 * @return {[type]}           [description]
 */


exports.dateJudge = dateJudge;

var timeAfterMixWeek = function timeAfterMixWeek(startTime, nowTime) {
  var localTime = parseInt(new Date().getTime()),
      d = (parseInt(startTime) - (nowTime || localTime)) / 1000,
      d_days = Math.floor(d / 86400),
      d_hours = Math.floor(d / 3600),
      d_minutes = Math.floor(d / 60);
  var startTimeDay = new Date(startTime).getDay();
  var nowDay = new Date(nowTime || localTime).getDay();
  startTimeDay = startTimeDay == 0 ? 7 : startTimeDay;
  nowDay = nowDay == 0 ? 7 : nowDay;
  var leftDay = 14 - nowDay;
  var isCurrentWeek = d / 86400 <= leftDay - 7;
  var startTimeDayStr = "";

  switch (startTimeDay) {
    case 1:
      startTimeDayStr = "一";
      break;

    case 2:
      startTimeDayStr = "二";
      break;

    case 3:
      startTimeDayStr = "三";
      break;

    case 4:
      startTimeDayStr = "四";
      break;

    case 5:
      startTimeDayStr = "五";
      break;

    case 6:
      startTimeDayStr = "六";
      break;

    case 7:
      startTimeDayStr = "日";
      break;

    default:
      ;
      break;
  }

  if (d_days >= leftDay) {
    return d_days + "天后";
  } else if (d_days <= leftDay && d_days > 0) {
    return isCurrentWeek ? "本周" + startTimeDayStr : "下周" + startTimeDayStr;
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + "小时后";
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + "分钟后";
  } else {
    return '进行中';
  }
};

exports.timeAfterMixWeek = timeAfterMixWeek;

var updatePageData = function updatePageData() {
  try {
    if (sessionStorage.getItem("isDataChange_B")) {
      var isDataChange_B = sessionStorage.getItem("isDataChange_B");
      sessionStorage.setItem("isDataChange_B", ++isDataChange_B);
    }
  } catch (e) {}

  return;
};

exports.updatePageData = updatePageData;

var refreshPageData = function refreshPageData() {
  try {
    if (sessionStorage.getItem("isDataChange_A")) {
      var isDataChange_A = sessionStorage.getItem("isDataChange_A");
      var isDataChange_B = sessionStorage.getItem("isDataChange_B");

      if (isDataChange_A != isDataChange_B) {
        sessionStorage.setItem("isDataChange_A", isDataChange_B);
        window.location.reload(true);
      }

      ;
    } else {
      sessionStorage.setItem("isDataChange_A", 1);
      sessionStorage.setItem("isDataChange_B", 1);
    }

    ;
  } catch (e) {//TODO handle the exception
  }

  ;
  return;
};
/**
 * 验证数值的为空，整数，小于大于某个区域值
 * @param {number|string} inputNumber 待验证的数值 （如果要通过0的验证，请输入string类型的'0'）
 * @param {number}} minNum 最小值
 * @param {number} maxNum 最大值
 * @param {string} name 数值的名字，值为空或为假则不予toast提示
 */


exports.refreshPageData = refreshPageData;

var isNumberValid = function isNumberValid(inputNumber, minNum, maxNum) {
  var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  // 提示的信息
  var validMsg = {
    // 输入为空
    voidString: '输入不能为空',
    // 输入非正整数
    notAPositiveNumber: '请输入正整数',
    //输入正数（取到2位小数）
    notDecimal: '请输入两位小数的非负数',
    // 小于最小值
    lessOrMoreThanNum: '请输入' + minNum + '-' + maxNum + '的数',
    lessThanNum: '请输入小于等于' + maxNum + '的数',
    moreThanNum: '请输入大于等于' + minNum + '的数'
  };

  if (inputNumber === '') {
    name && window.toast(name + ': ' + validMsg.voidString);
    return false;
  } else if (!/^[1-9]+[0-9]*]*$/.test(inputNumber) && inputNumber !== '0') {
    name && window.toast(name + ': ' + validMsg.notAPositiveNumber);
    return false;
  } else if (minNum && maxNum && (Number(inputNumber) < minNum || Number(inputNumber) > maxNum)) {
    name && window.toast(name + ': ' + validMsg.lessOrMoreThanNum);
    return false;
  } else if (minNum && Number(inputNumber) < minNum) {
    name && window.toast(name + ': ' + validMsg.moreThanNum);
    return false;
  } else if (maxNum && Number(inputNumber) > maxNum) {
    name && window.toast(name + ': ' + validMsg.lessThanNum);
    return false;
  } else {
    return true;
  }
};
/************************ 验证输入类型是否符合格式 - start ******************/

/**
 * @param {Object} validType-检验类型(text\money\name\password)
 * @param {Object} typeName-提示标题
 * @param {Object} inputVal-检验值
 * @param {Object} maxNum-最大值
 * @param {Object} minNum-最小值
 */


exports.isNumberValid = isNumberValid;

var validLegal = function validLegal(validType, typeName, inputVal, maxNum, minNum, spec_tips) {
  var inputVal = typeof inputVal === 'string' ? inputVal.trim() : inputVal;
  var isPass = true;

  if (inputVal == "") {
    window.toast(typeName + "不能为空");
    return false;
  }

  ;

  switch (validType) {
    case "text":
      isPass = checkText();
      break;

    case "money":
      isPass = checkMoney();
      break;

    case "name":
      isPass = checkName();
      break;

    case "password":
      isPass = checkPassword();
      break;

    case "wxAccount":
      isPass = checkWxAccount();
      break;

    case "phoneNum":
      isPass = checkPhoneNum();
      break;

    case "email":
      isPass = checkEmail();
      break;
  }

  ;

  function checkText() {
    if (maxNum && inputVal.length > maxNum) {
      window.toast(typeName + "不能超过" + maxNum + "个字");
      return false;
    } else {
      return true;
    }

    ;
  }

  ;

  function checkMoney() {
    var tips = "";

    if (!/(^[0-9]*[\.]?[0-9]{0,2}$)/.test(inputVal)) {
      window.toast(typeName + "必须为非负数字,最多2位小数");
      return false;
    } else if (maxNum && Number(inputVal) > maxNum) {
      if (spec_tips && spec_tips != "") {
        tips += "，" + spec_tips;
      }

      ;
      window.toast(typeName + "不能超过" + maxNum + "元" + tips);
      return false;
    } else if (minNum && Number(inputVal) < minNum) {
      if (spec_tips && spec_tips != "") {
        tips += "，" + spec_tips;
      }

      ;
      window.toast(typeName + "不能小于" + minNum + "元" + tips);
      return false;
    } else if (/^(89|8\.9|0\.89|64|6\.4|0\.64|89\.64|64\.89|1989\.64|8964)$/.test(Number(inputVal))) {
      // 永久防止敏感信息
      window.toast('金额错误，请输入其他金额');
      return false;
    } else {
      return true;
    }

    ;
  }

  ;

  function checkName() {
    if (!/(^[a-zA-Z]+$)|(^[\u4e00-\u9fa5]+$)/.test(inputVal)) {
      window.toast("请输入真实姓名");
      return false;
    } else if (maxNum && inputVal.length > maxNum) {
      window.toast(typeName + "不能超过" + maxNum + "个字");
      return false;
    } else {
      return true;
    }

    ;
  }

  ;

  function checkPassword() {
    if (!/^[0-9a-zA-Z]+$/.test(inputVal)) {
      window.toast(typeName + "只能是数字与字母组成");
      return false;
    } else if (maxNum && inputVal.length > maxNum) {
      window.toast(typeName + "最长为" + maxNum + "位");
      return false;
    } else {
      return true;
    }

    ;
  }

  ;

  function checkWxAccount() {
    if (!/^[0-9a-zA-Z\-\_]{5,30}$/.test(inputVal)) {
      window.toast("微信号仅6~30个字母，数字，下划线或减号组成");
      return false;
    } else {
      return true;
    }

    ;
  }

  ;

  function checkPhoneNum() {
    if (!/^1\d{10}$/.test(inputVal)) {
      window.toast("请输入正确的手机号");
      return false;
    } else {
      return true;
    }

    ;
  }

  ;

  function checkEmail() {
    if (!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(inputVal)) {
      window.toast("请输入正确的邮箱");
      return false;
    } else {
      return true;
    }

    ;
  }

  ;
  return isPass;
};
/**
 * 图片格式化
 * @param {String} formatStrQ  阿里云的裁剪规格  例如："@96h_96w_1e_1c_2o"
 * @param {String} formatStrW  微信的裁剪规格 例如："/96"
 *
 * 默认裁剪尺寸是64
 */


exports.validLegal = validLegal;

var imgUrlFormat = function imgUrlFormat(url) {
  var formatStrQ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "?x-oss-process=image/resize,m_fill,limit_0,h_64,w_64";
  var formatStrW = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "/64";

  if (/(img\.qlchat\.com)/.test(url)) {
    url = url.replace(/@.*/, "") + formatStrQ;
  } else if (/(wx\.qlogo\.cn\/mmopen)/.test(url)) {
    url = url.replace(/(\/(0|132|64|96)$)/, formatStrW);
  }

  ;
  return url;
};
/**
 * 二维码弹框点击判断
 * @param {Event} e
 */


exports.imgUrlFormat = imgUrlFormat;

var onQrCodeTouch = function onQrCodeTouch(e, selector, callback) {
  var event = e.nativeEvent;
  var appDom = document.querySelector('#app');
  var qrConfirm = document.querySelector(selector);
  var qrHeight = qrConfirm.clientHeight;
  var qrWidth = qrConfirm.clientWidth;
  var appHeight = appDom.clientHeight;
  var appWidth = appDom.clientWidth;
  var pointX = event.changedTouches[0].clientX;
  var pointY = event.changedTouches[0].clientY;
  var top = (appHeight - qrHeight) / 2;
  var bottom = (appHeight - qrHeight) / 2 + qrHeight;
  var left = (appWidth - qrWidth) / 2;
  var right = (appWidth - qrWidth) / 2 + qrWidth;

  if (pointX > right || pointX < left || pointY > bottom || pointY < top) {
    callback();
  }
};
/**
 ** 加法函数，用来得到精确的加法结果
 **/


exports.onQrCodeTouch = onQrCodeTouch;

function accAdd(arg1, arg2) {
  var r1, r2, m, c;

  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }

  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }

  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));

  if (c > 0) {
    var cm = Math.pow(10, c);

    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }

  return (arg1 + arg2) / m;
} // 乘法


var mul = function mul(arg1, arg2) {
  var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();

  try {
    m += s1.split(".")[1].length;
  } catch (e) {}

  try {
    m += s2.split(".")[1].length;
  } catch (e) {}

  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};
/**
 *
 * 获取cookie
 * @param {any} c_name
 * @returns
 */


exports.mul = mul;

var getCookie = function getCookie(c_name) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(c_name + "=");

    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      var c_end = document.cookie.indexOf(";", c_start);

      if (c_end == -1) {
        c_end = document.cookie.length;
      }

      return decodeURIComponent(document.cookie.substring(c_start, c_end));
    }

    ;
  }

  ;
  return "";
};
/**
* 添加cookie
*
* @param {any} c_name
* @param {any} value
* @param {any} expiredays
*/


exports.getCookie = getCookie;

var setCookie = function setCookie(c_name, value, expiredays) {
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + encodeURIComponent(value) + (expiredays == null ? "" : ";expires=" + exdate.toGMTString()) + ";path=" + path;
};
/**
* 删除cookie
*
* @param {any} name
*/


exports.setCookie = setCookie;

var delCookie = function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);

  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + 999 + "; path=/";
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/";
  }

  ;
};
/**
 * 一个简单的字符串长度验证
 * 
 * @export
 * @param {string} val 字符串 
 * @param {number} [maxLength=10] 最大长度 
 * @param {number} [minLength=0] 最小长度
 * @returns 
 */


exports.delCookie = delCookie;

function stringLengthValid(val) {
  var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var minLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  if (!val.length || val.length < minLength) {
    window.toast("".concat(name, "\u5B57\u6570\u4E0D\u591F\u54E6\uFF0C\u6700\u5C11").concat(minLength, "\u4E2A\u5B57"), 1500);
    return false;
  }

  if (val.length > maxLength) {
    window.toast("".concat(name, "\u6700\u591A").concat(maxLength, "\u4E2A\u5B57, \u4E0D\u53EF\u4EE5\u518D\u591A\u4E86"), 1500);
    return false;
  }

  return true;
}
/**
 * 让代码停下来等一等
 *
 * @param {Number} time
 */


var wait = function wait(time) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, time);
  });
};
/**
 * 获取对象的指定key值
 * eg: 
 *  var obj = {
 *      a:1,
 *      b:2,
 *      c:{
 *          d:3,
 *          e:[
 *              1,2,3
 *          ],
 *          f:[
 *              {
 *                  1:2
 *              }
 *          ]
 *      }
 *  };
 * 
 *  console.log(
 *      getVal(obj, 'a'),
 *      getVal(obj, 'c.d'),
 *      getVal(obj, 'c.e.1'),
 *      getVal(obj, 'c.f.0.1'),
 *      getVal(obj, 'c.f.f', 'haha'),
 *      obj
 *  )
 * @param {Object|Array} target 
 * @param {string} query 
 * @param {any} defaultValue 
 */


exports.wait = wait;

function getVal(target, query, defaultValue) {
  if (target == null || _typeof(target) !== 'object' && !target instanceof Array) {
    // console.warn('[getProperty]: target必须是Array或者Object，但是当前是' + target);
    return defaultValue;
  }

  if (typeof query !== 'string') {
    throw new Error('[getProperty]: query必须是string。');
  }

  var keys = query.split('.');
  var index = 0;
  var keysLen = keys.length;

  while (target != null && index < keysLen) {
    target = target[keys[index++]];
  }

  if (target == null) {
    return defaultValue;
  }

  return target;
}
/**
 * 
 * 排序
 * @param {any} attr 
 * @param {any} rev 
 * @returns 
 * @memberof StudioLiveMain
 */


function sortBy(attr, rev) {
  //第二个参数没有传递 默认升序排列
  if (rev == undefined) {
    rev = 1;
  } else {
    rev = rev ? 1 : -1;
  }

  return function (a, b) {
    a = a[attr];
    b = b[attr];

    if (a < b) {
      return rev * -1;
    }

    if (a > b) {
      return rev * 1;
    }

    return 0;
  };
} // 为解决再安卓微信浏览器中window.location.reload(true);不触发刷新的问题写的兼容方法


function updateUrl(url, key) {
  var key = (key || 't') + '='; //默认是"t"

  var reg = new RegExp(key + '\\d+'); //正则：t=1472286066028

  var timestamp = +new Date();

  if (url.indexOf(key) > -1) {
    //有时间戳，直接更新
    return url.replace(reg, key + timestamp);
  } else {
    //没有时间戳，加上时间戳
    if (url.indexOf('\?') > -1) {
      var urlArr = url.split('\?');

      if (urlArr[1]) {
        return urlArr[0] + '?' + key + timestamp + '&' + urlArr[1];
      } else {
        return urlArr[0] + '?' + key + timestamp;
      }
    } else {
      if (url.indexOf('#') > -1) {
        return url.split('#')[0] + '?' + key + timestamp + location.hash;
      } else {
        return url + '?' + key + timestamp;
      }
    }
  }
}
/**
 * 刷新本页面，加上t参数
 */


function reloadPage() {
  location.replace(updateUrl(location.href));
}
/**
 * 将一个数组存储到localStorage中
 * key 为 localStorage的key
 * item 塞入数组的对象
 * maxLength 为存储的数组的最大长度 如果不传则对长度不做限制
 * 超出最大长度的从头开始丢失数据，若原有长度超出最大长度，持续丢失数据到最大长度为止
 * @param {string} key 
 * @param {any} item 
 * @param {number} maxLength 
 */


function saveLocalStorageArray(key, item, maxLength) {
  if (typeof key != "string" || maxLength && typeof maxLength != "number") {
    console.error("saveLocalStorageArray 无效参数");
    return;
  }

  if (!window || !window.localStorage || !JSON) {
    console.error("saveLocalStorageArray 无效的执行环境");
    return;
  }

  var dataList = JSON.parse(window.localStorage.getItem(key)) || [];

  while (dataList.length > 0 && dataList.length >= maxLength) {
    dataList.shift();
  }

  dataList.push(item);
  window.localStorage.setItem(key, JSON.stringify(dataList));
  return dataList;
}
/**
 * 替换上面个LocalStorageArray中的某一条数据
 * 如果查不到这条数据，根据ifAdd为true是否就添加这条数据
 * maxLength控制数组长度
 * @param {string} localstorage 的key
 * @param {string} item 的key
 * @param {string} itemContent 的内容
 * @param {any} item 
 * 
 */


function setLocalStorageArrayItem(localStorageKey, itemKey, itemContent, item, ifAdd, maxLength) {
  if (typeof localStorageKey != "string" || typeof itemKey != "string" || maxLength && typeof maxLength != "number") {
    console.error("setLocalStorageArrayItem 无效参数");
    return;
  }

  if (!window || !window.localStorage || !JSON) {
    console.error("setLocalStorageArrayItem 无效的执行环境");
    return;
  }

  var dataList = JSON.parse(window.localStorage.getItem(localStorageKey)) || [];
  var i = 0;
  var findData = false;

  for (i; i < dataList.length; i++) {
    if (dataList[i][itemKey] == itemContent) {
      dataList[i] = item;
      findData = true;
    }
  }

  if (!findData && ifAdd === true) {
    while (dataList.length > 0 && dataList.length >= maxLength) {
      dataList.shift();
    }

    dataList.push(item);
  }

  window.localStorage.setItem(localStorageKey, JSON.stringify(dataList));
  return dataList;
}
/**
 * 这个操作针对用idlist来存储足迹数据
 * 如果要插入列表的数据已经存在，则插入到最前面
 * @param {string} localstorage 的key
 * @param {any} item 要插入这个数组的内容，只要不是引用对象，啥都行
 * @param {number} 这个数组的最大长度
 */


function localStorageSPListAdd(localStorageKey, id, type, maxLength) {
  if (!window || !window.localStorage || !JSON) {
    console.error("localStorageSPListAdd 无效的执行环境");
    return;
  }

  var dataList = JSON.parse(window.localStorage.getItem(localStorageKey)) || [];
  var i = 0;
  var findData = false;
  var findIndex = -1;

  for (i; i < dataList.length; i++) {
    if (dataList[i].id == id && dataList[i].type == type) {
      findData = true;
      findIndex = i;
    }
  }

  if (findData) {
    dataList.unshift(dataList.splice(findIndex, 1)[0]);

    while (dataList.length > 0 && dataList.length > maxLength) {
      dataList.pop();
    }
  } else {
    while (dataList.length > 0 && dataList.length >= maxLength) {
      dataList.pop();
    }

    dataList.unshift({
      id: id,
      type: type
    });
  }

  window.localStorage.setItem(localStorageKey, JSON.stringify(dataList));
  return dataList;
}
/**
 * 这个操作针对用idlist来存储足迹数据
 * 删除值为id的列表项
 * @param {string} localstorage 的key
 * @param {any} item 要插入这个数组的内容，只要不是引用对象，啥都行
 * @param {number} 这个数组的最大长度
 */


function localStorageSPListDel(localStorageKey, id, type) {
  if (!window || !window.localStorage || !JSON) {
    console.error("setLocalStorageArrayItem 无效的执行环境");
    return;
  }

  var dataList = JSON.parse(window.localStorage.getItem(localStorageKey)) || [];
  var i = 0;
  var findData = false;
  var findIndex = -1;

  for (i; i < dataList.length; i++) {
    if (dataList[i].id == id && dataList[i].type === type) {
      findData = true;
      findIndex = i;
    }
  }

  if (findData) {
    dataList.splice(findIndex, 1);
  }

  window.localStorage.setItem(localStorageKey, JSON.stringify(dataList));
  return dataList;
}
/* 是否来自直播中心的判断 */


function isFromLiveCenter() {
  if (typeof sessionStorage != 'undefined') {
    return /recommend|subscribe-period-time|timeline|mine|charge-recommend|rank-topic|livecenter|search/.test(window.sessionStorage.getItem('trace_page'));
  } else {
    return false;
  }
}
/* 判断千聊推荐的下单位置 需求链接 http://www.pmdaniu.com/cloud/33673/2b0f524719e451542e20afa22486de7b-35265/start.html#g=1&p=直播间收益-千聊推荐
   下单位置：千聊-推荐页，千聊-发现页，千聊-我的课程，千聊-个人中心，千聊-搜索，千聊公众号推文，千聊公众号菜单，千聊用户分享，千聊-猜你喜欢
*/


function filterOrderChannel() {
  var place = 'recommend'; //'千聊-推荐页'

  if ((0, _urlUtils.getUrlParams)('psKey')) {
    place = 'share'; //'千聊用户分享'
  } else if ((0, _urlUtils.getUrlParams)('wcl') == 'tweet') {
    place = 'tweet'; // '千聊公众号推文'
  } else if ((0, _urlUtils.getUrlParams)('wcl') == 'tab') {
    place = 'menu'; // '千聊公众号菜单'
  } else if (/promotion_details-listening|promotion_topic-simple-video|promotion_channel-intro|promotion_topic-intro|promotion_channel-intro-bought|promotion_topic-intro-bought|promotion_recent|promotion_purchased|promotion_recent-null|promotion_purchased-null|promotionnNEW_details-listening|promotionNEW_topic-simple-video|promotionNEW_channel-intro|promotionNEW_topic-intro|promotionNEW_channel-intro-bought|promotionNEW_topic-intro-bought|promotionNEW_recent|promotionNEW_purchased|promotionNEW_recent-null|promotionNEW_purchased-null/.test((0, _urlUtils.getUrlParams)('wcl'))) {
    place = 'guess'; //'千聊-猜你喜欢'
  } else if (/timeline|messages/.test(document.referrer)) {
    place = 'discovery'; // '千聊-发现页'
  } else if (/course/.test(document.referrer)) {
    place = 'mine-course'; //'千聊-我的课程'
  } else if (/collect|foot-print|joined-topic|myPurchaseRecord|point/.test(document.referrer)) {
    place = 'mine-center'; //'千聊-个人中心'
  } else if (/search/.test(document.referrer)) {
    place = 'search'; // '千聊-搜索'
  } else if (/recommend|coupon-center|album|membership-center/.test(document.referrer)) {
    place = 'recommend'; // '千聊-推荐页'
  }

  return place;
} // 获取媒体时间格式化字符串


function getAudioTimeShow(secs) {
  var hasHour = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  //小时
  var hours = parseInt(secs / 3600);

  if (hours < 10) {
    hours = "0" + hours;
  } //分钟


  var minutes = parseInt(secs / 60);

  if (minutes < 10) {
    minutes = "0" + minutes;
  } //秒


  var seconds = Math.round(secs % 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (hasHour) {
    minutes = parseInt(secs % 3600 / 60);

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return "".concat(hours, ":").concat(minutes, ":").concat(seconds);
  } else {
    return "".concat(minutes, ":").concat(seconds);
  }
}

function createAsyncAction(prefix) {
  var REQUEST = 'REQUEST';
  var SUCCESS = 'SUCCESS';
  var ERROR = 'ERROR';
  return [REQUEST, SUCCESS, ERROR].reduce(function (acc, type) {
    acc[type] = (0, _reduxAct.createAction)(prefix + "_" + type);
    return acc;
  }, {});
} //检查时间小于2位数


function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }

  return i;
}

var handleAjaxResult = function handleAjaxResult(result, cb) {
  if (result && result.state) {
    if (result.state.code == 0) {
      cb(result.data);
    } else {
      window.toast(result.state.msg);
    }
  }
};
/**
 * 本地存储获取方法，若过期则返回空
 * @type {[type]}
 */


exports.handleAjaxResult = handleAjaxResult;

var getLocalStorage = function getLocalStorage(key) {
  var data;

  try {
    data = JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.error('get localStorage failed! ' + JSON.stringify(e));
    return;
  }

  if (data && 'object' === _typeof(data) && data._expires) {
    var nowDate = new Date().getTime(); // 已过期

    if (+data._expires < nowDate) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Do something when catch error
        console.error('remove storage sync failed! ' + JSON.stringify(e));
      }

      console.info('缓存已过期！', key);
      return;
    }

    return data.value;
  }

  return data;
};
/**
 * 本地存储方法，可设置过期时间
 *
 *	 setLocalStorage('test', 1, 10);
 *
 * @param  {String} key    存储的数据的key
 * @param  {Object/String} value 存储的内容
 * @param  {[type]} expires 过期时间（单位：秒(s)）
 * @return {[type]}        [description]
 */


exports.getLocalStorage = getLocalStorage;

var setLocalStorage = function setLocalStorage(key, value, expires) {
  var nowDate = new Date(),
      data;

  if (expires) {
    expires = nowDate.getTime() + +expires * 1000;
    data = {
      _expires: expires,
      value: value
    };
  } else {
    data = value;
  }

  if (_typeof(data) === 'object') {
    data = JSON.stringify(data);
  }

  try {
    localStorage.setItem(key, data);
  } catch (e) {
    console.error('set storage sync failed! ' + JSON.stringify(e));
  }
}; // 睡觉函数


exports.setLocalStorage = setLocalStorage;

function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
/**
 * 初始化小程序sdk
 * @returns {Promise<boolean>} true: 是小程序环境并且准备完毕， false: 不是小程序环境
 */


var miniprogramReady = function miniprogramReady() {
  return new Promise(function (resolve) {
    var timer;

    var ready = function ready() {
      timer && clearTimeout(timer);

      if (window.__wxjs_environment === 'miniprogram') {
        resolve(true);
      } else {
        resolve(false);
      }
    };

    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
      document.addEventListener('WeixinJSBridgeReady', ready, false);
      timer = setTimeout(function () {
        ready();
      }, 2000);
    } else {
      ready();
    }
  });
}; // 课程完成度记录


exports.miniprogramReady = miniprogramReady;
var updatePercentageCompleteTimestamp;

function updatePercentageComplete(_ref) {
  var topicId = _ref.topicId,
      finished = _ref.finished,
      total = _ref.total,
      rate = _ref.rate;

  if (!rate) {
    if (!total || total <= 0) {
      return false;
    }

    rate = finished / total;
  }

  if (rate < 1) {
    // 防止记录过于频繁，执行间隔设定为300ms，除非rate为1
    var previousTimestamp = updatePercentageCompleteTimestamp;
    var now = Date.now();

    if (previousTimestamp && now - previousTimestamp <= 300) {
      return false;
    } else {
      updatePercentageCompleteTimestamp = now;
    }
  }

  if (typeof localStorage !== 'undefined') {
    var coursePercentageCompleteRecord = JSON.parse(localStorage.getItem('coursePercentageCompleteRecord') || '{}');

    if (!coursePercentageCompleteRecord[topicId] || coursePercentageCompleteRecord[topicId] < rate) {
      coursePercentageCompleteRecord[topicId] = rate;
      localStorage.setItem('coursePercentageCompleteRecord', JSON.stringify(coursePercentageCompleteRecord));
    }
  }
}

;
var taskExecutionInterval;
var taskTopicId;
var taskLastCurrentTime;
var taskTimeLength;
var isTodayFirstPlay; // 记录学习时长

function updateLearningTime(_ref2) {
  var topicId = _ref2.topicId,
      playStatus = _ref2.playStatus,
      _ref2$currentTime = _ref2.currentTime,
      currentTime = _ref2$currentTime === void 0 ? 0 : _ref2$currentTime,
      setTime = _ref2.setTime;

  if (typeof setTime === 'undefined') {
    if (taskTopicId !== topicId) {
      taskTimeLength = 0;
      taskLastCurrentTime = 0;
      taskTopicId = topicId;
    } // 记录间隔时间内播放总时长


    var temp = currentTime - taskLastCurrentTime;
    taskLastCurrentTime = currentTime;

    if (temp > 2 || temp < 0) {
      // 允许2秒内的拖拽
      return false;
    }

    taskTimeLength += temp;

    if (playStatus !== 'end') {
      // 执行间隔设定为30s
      var previousTimestamp = taskExecutionInterval;
      var now = Date.now();

      if (previousTimestamp && now - previousTimestamp <= 5000) {
        return false;
      } else {
        taskExecutionInterval = now;
      }
    } else {
      taskLastCurrentTime = 0;
    }
  } else {
    taskTimeLength = setTime;
  }

  if (typeof localStorage !== 'undefined') {
    // 一天内首次播放通知
    if (!isTodayFirstPlay) {
      var sysTime = window.__INIT_STATE__.common.sysTime;
      var t = parseInt(localStorage.getItem('todayFirstPlay') || 0);
      var todayTimeStamp = parseInt(new Date(new Date(sysTime).setHours(0, 0, 0, 0)).getTime());
      isTodayFirstPlay = true;

      if (t && t >= todayTimeStamp) {
        return false;
      }

      localStorage.setItem('todayFirstPlay', sysTime);
      (0, _common.request)({
        url: '/api/wechat/point/doAssignment',
        method: 'POST',
        body: {
          assignmentPoint: 'grow_learn_course_time',
          learnTime: 1
        }
      });
    }

    var learnTime = parseInt(localStorage.getItem('courseLearningTime') || 0);
    learnTime += parseInt(taskTimeLength);

    if (learnTime >= 600) {
      // 大于10分钟
      (0, _common.request)({
        url: '/api/wechat/point/doAssignment',
        method: 'POST',
        body: {
          assignmentPoint: 'grow_learn_course_time',
          learnTime: learnTime
        }
      });
      learnTime = 0;
    }

    localStorage.setItem('courseLearningTime', learnTime);
    taskTimeLength = 0;
  }
}

; // 上一次课程访问记录

function updateTopicInChannelVisit(_ref3) {
  var channelId = _ref3.channelId,
      topicId = _ref3.topicId,
      id = _ref3.id,
      startTime = _ref3.startTime,
      style = _ref3.style;

  if (typeof localStorage !== 'undefined') {
    var lastRecord = JSON.parse(localStorage.getItem('lastTopicInChannelVisitRecord') || '{}');
    lastRecord[channelId] = {
      topicId: topicId || id,
      startTime: startTime,
      style: style
    };
    localStorage.setItem('lastTopicInChannelVisitRecord', JSON.stringify(lastRecord));
  }
}
/**
 * 初始化C端来源注入
 *
 */


function initCEndSourseInject() {
  if (typeof sessionStorage !== 'undefined') {
    // 以下两个判断条件见需求链接 http://jira.corp.qlchat.com/browse/QLCHAT-13595
    // wcl是这几个的值的属于c端来源；
    if (['promotion_recent', 'promotion_purchased', 'promotion_recent-null', 'promotion_purchased-null'].includes((0, _urlUtils.getUrlParams)('wcl'))) {
      sessionStorage.setItem('trace_page', "livecenter");
      return;
    } // 个人中心和我的课程不属于c端来源


    if (/(joined-topic|myPurchaseRecord|mine\/collect|mine\/foot-print|mine\/course)/.test(location.pathname)) {
      sessionStorage.removeItem('trace_page');
      return;
    }

    if ((/tweet|tab/.test((0, _urlUtils.getUrlParams)('wcl')) || (0, _urlUtils.getUrlParams)('psKey')) && !isFromLiveCenter()) {
      sessionStorage.setItem('trace_page', 'livecenter');
    } else if (!(/tweet|tab/.test((0, _urlUtils.getUrlParams)('wcl')) || (0, _urlUtils.getUrlParams)('psKey')) && (0, _urlUtils.getUrlParams)('clearTrace') === 'Y' && isFromLiveCenter()) {
      // 链接带clearTrace=Y强行去掉C端标识
      sessionStorage.removeItem('trace_page');
    }
  }
}
/**
 * 因为page父组件加了pv，导致单页应用的首次手动触发pv是错误的，此处忽略首次加载的pv
 */


function addPv() {
  setTimeout(function () {
    if (window._hasFirstPv) {
      window._qla && window._qla('pv', {});
    } else {
      window._hasFirstPv = true;
    }
  }, 10);
}

var businessTypeCNMap = {
  topic: '话题',
  channel: '系列课',
  vip: '直播间vip',
  doc: '文件',
  gift: '赠礼'
  /**
   * 判断是否隔天
   * @param {*} param 时间戳 | 存在localStroge的key值
   */

};
exports.businessTypeCNMap = businessTypeCNMap;

function isNextDay(param) {
  if (!param) return false;
  var dateTime = null;

  if (typeof param === 'number') {
    dateTime = new Date(param);
  } else if (typeof param === 'string') {
    var timeStamp = getLocalStorage(param);
    timeStamp && (dateTime = new Date(timeStamp));
  }

  if (dateTime) {
    return new Date().getDate() !== dateTime.getDate();
  }

  return true;
}
/* 根据缓存的存在与否判断是否要执行某些方法
 *
 * @export
 * @param {*} storageName 缓存名字
 * @param {*} storageValue 缓存的值
 * @param {*} cb 要执行的函数名称
 * @param {*} time 多少时间后执行该函数
 */


function executeFunAccordingToStorage(storageName, storageValue, cb) {
  var time = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var timeOut = setTimeout(function (_) {
    if (localStorage.getItem(storageName) == storageValue) {
      localStorage.removeItem(storageName);
      cb && cb();
    }

    clearTimeout(timeOut);
  }, time);
}

var QL_BROWSE_HISTORY_SESSION = 'QL_BROWSE_HISTORY_SESSION';
/**
 * 记录用户浏览历史
 * @param {*} router 地址对象
 */

function recordBrowseHistoryToStorage(router) {
  if (!router || typeof location === 'undefined' || typeof sessionStorage === 'undefined') return;
  var origin = location.origin;
  var pathname = router.pathname,
      search = router.search;
  var url = origin + pathname + search;

  var _sHistory = JSON.parse(sessionStorage.getItem(QL_BROWSE_HISTORY_SESSION));

  _sHistory instanceof Array || (_sHistory = []);

  if (_sHistory[_sHistory.length - 1] != url) {
    _sHistory.push(url);

    sessionStorage.setItem(QL_BROWSE_HISTORY_SESSION, JSON.stringify(_sHistory));
  }
}
/**
 * 根据对应业务做相关逻辑处理，获取渠道来源
 * @param {*} type wcl配置，用于匹配入口页是否满足统计规则
 * @param {configure} configure 来源规则配置
 */


function getChannelFromTypeOfBusiness(type, configure) {
  if (!configure || typeof location === 'undefined' || typeof sessionStorage === 'undefined') return;

  var _sHistory = JSON.parse(sessionStorage.getItem(QL_BROWSE_HISTORY_SESSION));

  _sHistory instanceof Array || (_sHistory = []);

  for (var index = 0; index < _sHistory.length; index++) {
    var urlObj = parseURL(_sHistory[index]);
    var wcl = urlObj.params.wcl; // 用户入口页面， 如果携带相关wcl则判定为符合渠道规则来源

    if (type && index === 0 && wcl && wcl.indexOf(type) > -1) {
      return wcl;
    } // 规则解析


    wcl = distinguishChannelFromConfigure(urlObj, configure);
    if (wcl) return wcl;
  }

  return '';
}
/**
 * 根据当前地址信息，匹配出首次符合条件的渠道来源
 * @param {*} urlObj url 解析后的对象
 * @param {*} configure 配置的来源渠道列表
 */


function distinguishChannelFromConfigure(urlObj, configure) {
  // 一次筛选 匹配路径
  var _search = configure.filter(function (item) {
    return item.page === urlObj.path;
  });

  if (_search.length > 0 && _search[0].params) {
    // 二次筛选 匹配必要参数是否相等
    _search = _search.filter(function (s) {
      if (s.params) {
        var isMatch = true;

        for (var key in s.params) {
          if (s.params[key] !== urlObj.params[key]) isMatch = false;
        }

        return isMatch;
      }

      return false;
    });
  }

  if (_search.length > 0) return _search[0].wcl;
}
/**
 * 解析URL
 * @param {*} url 
 */


function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: function () {
      var ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s;

      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }

        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }

      return ret;
    }(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
}
/**
 * 根据businessType生成url
 */


function getBusinessUrl(_ref4) {
  var businessType = _ref4.businessType,
      businessId = _ref4.businessId;
  var url = '';

  switch (businessType) {
    case 'live':
      url = "/wechat/page/live/".concat(businessId);
      break;

    case 'channel':
      url = "/wechat/page/channel-intro?channelId=".concat(businessId);
      break;

    case 'topic':
      url = "/wechat/page/topic-intro?topicId=".concat(businessId);
  }

  url = location.origin + url;
  return url;
}
/**
 * 生成唯一的字符串
 */


function genUniqStr() {
  return Math.random().toString(36).substring(7) + Date.now().toString(16);
}
/**
 * 随机分享描述
 */


function randomShareText(shareObj, userName) {
  var randomPool = [{
    desc: '听完觉得确实不错，忍不住要推荐！'
  }, {
    desc: '天啦噜！上了这门课我才发现……'
  }, {
    desc: '朋友圈里优秀的人都在学，你要落后吗？'
  }, {
    desc: "\u5C31\u5DEE\u4F60\u4E86\uFF01\u6709".concat(Math.floor(Math.random() * (12 - 4 + 1)) + 4, "\u4F4D\u670B\u53CB\u5DF2\u7ECF\u52A0\u5165\u6211\u7684\u5B66\u4E60\u5708")
  }, {
    desc: '正在直播，老师讲得特别好，再不学就晚了！'
  }];
  var idx = Math.floor(Math.random() * randomPool.length);
  var r = randomPool[idx];

  if (shareObj.shareUrl) {
    // 重写ch
    if (shareObj.shareUrl.indexOf('shareKey=') == -1) {
      shareObj.timelineTitle = "\u6211\u53D1\u73B0\u4E86\u4E00\u95E8\u597D\u8BFE\u300A".concat(shareObj.title, "\u300B");
    }

    shareObj.shareUrl = (0, _urlUtils.fillParams)({
      ch_r: "shareR".concat(idx + 1)
    }, shareObj.shareUrl);
  }

  return _objectSpread({}, shareObj, r);
}
/**
 *
 * 是否登录
 * @return {boolean}
 */


var isLogined = function isLogined() {
  return !!getCookie('userId');
};
/**
 * 实际支付价
 * @param {*} price 支付价(分)
 * @param {*} isQlMemberPrice 是否会员价
 * @param {*} couponPrice 优惠券金额(分)
 */


exports.isLogined = isLogined;

var paymentPrice = function paymentPrice(price) {
  var isQlMemberPrice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var couponPrice = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var hasSub = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  if (price == 0) {
    return null;
  }

  var _price = price - couponPrice;

  if (isQlMemberPrice) {
    _price *= 0.8;
  }

  var str = '';

  if (isQlMemberPrice && couponPrice > 0) {
    str = '会员券后价';
  } else if (couponPrice > 0) {
    str = '券后价';
  } else if (isQlMemberPrice) {
    str = '会员价';
  }

  return "".concat(hasSub ? str + '￥' : '').concat(_price > 0 ? formatNumber(_price / 100) : 0);
};
/**
 * 评论时间
 */


exports.paymentPrice = paymentPrice;

var getDateDiff = function getDateDiff(dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24; // var halfamonth = day * 15;

  var month = day * 30;
  var year = month * 12;
  var now = new Date().getTime();
  var diffValue = now - new Date(Number(dateTimeStamp)).getTime();

  if (diffValue < 0) {
    return;
  }

  var yearC = diffValue / year;
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  var result;

  if (dayC > 3) {
    result = formatDate(dateTimeStamp, 'yyyy-MM-dd hh:mm:ss');
  } else if (dayC >= 1) {
    result = "".concat(parseInt(dayC), "\u5929\u524D");
  } else if (hourC >= 1) {
    result = "".concat(parseInt(hourC), "\u5C0F\u65F6\u524D");
  } else if (minC >= 1) {
    result = "".concat(parseInt(minC), "\u5206\u949F\u524D");
  } else result = "\u521A\u521A";

  return result;
};
/**
 * 四舍五入
 * @export
 * @param {*} number
 * @param {number} [precision=2]
 * @returns
 */


exports.getDateDiff = getDateDiff;

function fomatFloat(number) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var enlargeDigits = function enlargeDigits(times) {
    return function (number) {
      return +(String(number) + "e" + String(times));
    };
  };

  var toFixed = function toFixed(precision) {
    return function (number) {
      return number.toFixed(precision);
    };
  };

  var compose = function compose() {
    for (var _len = arguments.length, functions = Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key];
    }

    var nonFunctionTypeLength = functions.filter(function (item) {
      return typeof item !== 'function';
    }).length;

    if (nonFunctionTypeLength > 0) {
      throw new Error("compose's params must be functions");
    }

    if (functions.length === 0) {
      return function (arg) {
        return arg;
      };
    }

    if (functions.length === 1) {
      return functions[0];
    }

    return functions.reduce(function (a, b) {
      return function () {
        return a(b.apply(undefined, arguments));
      };
    });
  };

  precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  if (Number.isNaN(+number)) {
    throw new Error("number's type must be Number");
  }

  if (Number.isNaN(+precision)) {
    throw new Error("precision's type must be Number");
  }

  return compose(toFixed(precision), enlargeDigits(-precision), Math.round, enlargeDigits(precision))(number);
}
/**
 * 数字格式化为金额
 * @param {*} c 小数点后面有几位 (四舍五入到指定的位数)
 * @param {*} d 小数点 符号 (.) , 把它作为参数，是因为你可以自己制定你所需要的符号
 * @param {*} t 千分位的符号 (,)
 */


function numberFormat(number) {
  var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  var t = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ',';
  var n = number,
      s = n < 0 ? "-" : "",
      i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
      j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

;
/**
 * 字符串匹配超链接，空格格式化
 * @param {*} text 字符串的超链接以http://或者https://开头，匹配非中文
 */

function formatRichText(text) {
  var reg = /([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)([A-Za-z0-9\-\~\.\/\?\=\&\%\_\#\+\*\(\)\@\!\$\^\:]+)/g;
  var result = text === null || text === void 0 ? void 0 : text.replace(reg, "<a href=\"$&\">$&</a>").replace(/\n/g, '<br/>');
  return result || text;
}
/**
 * 百度自动推送代码
 */


function baiduAutoPush() {
  var bp = document.createElement('script');
  var curProtocol = window.location.protocol.split(':')[0];

  if (curProtocol === 'https') {
    bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
  } else {
    bp.src = 'http://push.zhanzhang.baidu.com/push.js';
  }

  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(bp, s);
}

var isCompetitorLink =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(url) {
    var competitorLink, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(url)) {
              _context.next = 3;
              break;
            }

            window.toast('链接格式不正确');
            return _context.abrupt("return", true);

          case 3:
            competitorLink = window.competitorLink; // 竞品链接

            if (competitorLink) {
              _context.next = 10;
              break;
            }

            _context.next = 7;
            return (0, _common.request)({
              url: '/api/wechat/transfer/h5/domain/competitorDomain',
              method: 'POST',
              body: {}
            });

          case 7:
            res = _context.sent;
            competitorLink = res && res.data && res.data.domainList || [];
            window.competitorLink = competitorLink;

          case 10:
            if (!(competitorLink && competitorLink.length > 0 && competitorLink.some(function (item) {
              return new RegExp(item, 'i').test(url);
            }))) {
              _context.next = 13;
              break;
            }

            window.toast('暂不支持输入该链接～');
            return _context.abrupt("return", true);

          case 13:
            return _context.abrupt("return", false);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function isCompetitorLink(_x) {
    return _ref5.apply(this, arguments);
  };
}(); // 获取课程 title keyword description


exports.isCompetitorLink = isCompetitorLink;

var getCourseHtmlInfo = function getCourseHtmlInfo(_ref6) {
  var _ref6$businessName = _ref6.businessName,
      businessName = _ref6$businessName === void 0 ? '' : _ref6$businessName,
      _ref6$liveName = _ref6.liveName,
      liveName = _ref6$liveName === void 0 ? '' : _ref6$liveName,
      _ref6$intro = _ref6.intro,
      intro = _ref6$intro === void 0 ? '' : _ref6$intro,
      _ref6$firstName = _ref6.firstName,
      firstName = _ref6$firstName === void 0 ? '' : _ref6$firstName,
      _ref6$secondName = _ref6.secondName,
      secondName = _ref6$secondName === void 0 ? '' : _ref6$secondName;
  if (!businessName || !liveName) return false;
  return {
    htmlTitle: "".concat(businessName, "_").concat(!firstName ? '' : firstName + '_').concat(liveName, "_\u5343\u804A"),
    htmlKeywords: "".concat(!intro ? '' : intro + ',').concat(!firstName ? '' : firstName + ',').concat(!secondName ? '' : secondName + ',').concat(liveName),
    htmlDescription: "\u6B22\u8FCE\u6536\u542C\u300A".concat(businessName, "\u300B\uFF0C\u66F4\u591A\u4F18\u8D28\u7CBE\u54C1\u5185\u5BB9\uFF0C\u5C3D\u5728\u5343\u804A\u3002\u5343\u804A\uFF0C2\u4EBF\u4EBA\u90FD\u5728\u7528\u7684\u77E5\u8BC6\u5B66\u4E60\u5E73\u53F0\uFF01\u6DB5\u76D6\u804C\u573A\u3001\u60C5\u611F\u3001\u6559\u80B2\u3001\u53D8\u7F8E\u7B49\u5404\u751F\u6D3B\u9886\u57DF\u7684\u5404\u7C7B\u4E13\u5BB6\uFF0C\u7AED\u8BDA\u4E3A\u4F60\u63D0\u4F9B\u9AD8\u8D28\u91CF\u7684\u77E5\u8BC6\u5E93\uFF01\u5343\u804A,\u817E\u8BAF\u6295\u8D44\u7684\u5FAE\u4FE1\u76F4\u64AD/\u79C1\u57DF\u6D41\u91CF\u7BA1\u7406/\u6DA8\u7C89\u5F15\u6D41\u5DE5\u5177,\u514D\u8D39\u4F7F\u7528,\u4E0D\u62BD\u4F63\u4E0D\u62BD\u6210\u3002")
  };
};

exports.getCourseHtmlInfo = getCourseHtmlInfo;

/***/ }),

/***/ "./wechat-react/components/verticle-marquee/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/components/verticle-marquee/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/wechat-phone-binding/index.scss":
/*!*****************************************************************!*\
  !*** ./wechat-react/components/wechat-phone-binding/index.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/win-course-eval/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/win-course-eval/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/components/xiumi-editor-h5/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/components/xiumi-editor-h5/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/actions/business-payment-takeincome.js":
/*!******************************************************************!*\
  !*** ./wechat-react/mine/actions/business-payment-takeincome.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPubToPubMessage = exports.commitApply = exports.GET_PUBTOPUB_MESSAGE = void 0;

var _common = __webpack_require__(/*! ./common */ "./wechat-react/mine/actions/common.js");

var _util = __webpack_require__(/*! components/util */ "./wechat-react/components/util.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var GET_PUBTOPUB_MESSAGE = "GET_PUBTOPUB_MESSAGE"; // 提交公对公打款申请

exports.GET_PUBTOPUB_MESSAGE = GET_PUBTOPUB_MESSAGE;

var commitApply = function commitApply() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _common.api)({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: true,
                  url: "/api/wechat/transfer/h5/live/reward/ptpApply",
                  method: "POST",
                  body: {
                    liveId: params.liveId,
                    money: (Number(params.money) * 100).toString(),
                    // 单位为分
                    userId: params.userId,
                    commitmentLetter: params.commitmentLetter
                  }
                });

              case 2:
                result = _context.sent;

                if (result.state.code === 0) {
                  window && window.toast('提交成功', 2000);
                  (0, _util.locationTo)("/wechat/page/mine/takeincome-record?liveId=".concat(params.liveId));
                } else {
                  window && window.toast(result.state.msg);
                }

                return _context.abrupt("return", result.data && result.data.purchaseList || []);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
}; // 获取公对公打款信息


exports.commitApply = commitApply;

var getPubToPubMessage = function getPubToPubMessage() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(dispatch, getStore) {
        var result, _result$data, accountName, accountNo, openBank;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _common.api)({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: true,
                  url: "/api/wechat/transfer/h5/live/reward/pubToPub",
                  method: "POST",
                  body: {
                    applyType: "P2P",
                    liveId: params.liveId,
                    userId: params.userId
                  }
                });

              case 2:
                result = _context2.sent;

                if (result.state.code === 0) {
                  _result$data = result.data, accountName = _result$data.accountName, accountNo = _result$data.accountNo, openBank = _result$data.openBank;
                  dispatch({
                    type: GET_PUBTOPUB_MESSAGE,
                    openBank: openBank,
                    accountNo: accountNo,
                    accountName: accountName
                  });
                }

                return _context2.abrupt("return", result.data && result.data.purchaseList || []);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
};

exports.getPubToPubMessage = getPubToPubMessage;

/***/ }),

/***/ "./wechat-react/mine/actions/buy.js":
/*!******************************************!*\
  !*** ./wechat-react/mine/actions/buy.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearBooks = exports.setBooksPage = exports.getBuyLists = exports.GET_BUY_LISTS = void 0;

var _common = __webpack_require__(/*! ./common */ "./wechat-react/mine/actions/common.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var GET_BUY_LISTS = Symbol("GET_BUY_LISTS"); // 获取免费公开课

exports.GET_BUY_LISTS = GET_BUY_LISTS;

var getBuyLists = function getBuyLists() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(dispatch, getStore) {
        var result, purchaseList, buyLists, lists, noneData, isNoMoreCourse;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _common.api)({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: true,
                  url: '/api/wechat/mine/purchaseList',
                  method: 'POST',
                  body: {
                    page: params.page || 1,
                    size: params.size || 20,
                    purchaseType: params.purchaseType
                  }
                });

              case 2:
                result = _context.sent;
                purchaseList = result.data && result.data.purchaseList || [];
                buyLists = getStore().buy.buyLists || [];
                lists = _toConsumableArray(buyLists).concat(_toConsumableArray(purchaseList));
                noneData = false, isNoMoreCourse = false;

                if (!lists.length) {
                  noneData = true;
                }

                if (purchaseList.length < params.size && !!lists.length) {
                  isNoMoreCourse = true;
                }

                dispatch({
                  type: GET_BUY_LISTS,
                  buyLists: purchaseList,
                  noneData: noneData,
                  isNoMoreCourse: isNoMoreCourse,
                  title: result.data && result.data.subTitle || ''
                });
                return _context.abrupt("return", result.data && result.data.purchaseList || []);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
}; // 分页数


exports.getBuyLists = getBuyLists;

var setBooksPage = function setBooksPage(params) {
  return _objectSpread({
    type: SET_BOOKS_LISTS_PAGE
  }, params);
}; // 清空列表


exports.setBooksPage = setBooksPage;

var clearBooks = function clearBooks() {
  return {
    type: CLEAR_BOOKS
  };
};

exports.clearBooks = clearBooks;

/***/ }),

/***/ "./wechat-react/mine/actions/common.js":
/*!*********************************************!*\
  !*** ./wechat-react/mine/actions/common.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loading = loading;
exports.setIsLiveAdmin = setIsLiveAdmin;
exports.fetchSuccess = fetchSuccess;
exports.updateSysTime = updateSysTime;
exports.toast = toast;
exports.uploadAudio = uploadAudio;
exports.uploadDoc = uploadDoc;
exports.uploadRec = uploadRec;
exports.uploadImage = uploadImage;
exports.getStsAuth = getStsAuth;
exports.initUserInfo = initUserInfo;
exports.getUserInfo = getUserInfo;
exports.getQr = getQr;
exports.getTopicQr = getTopicQr;
exports.doPayCamp = doPayCamp;
exports.selectPayResult = selectPayResult;
exports.togglePayDialog = togglePayDialog;
exports.getSysTime = getSysTime;
exports.fetchAndUpdateSysTime = fetchAndUpdateSysTime;
exports.api = api;
exports.getCreateLiveStatus = getCreateLiveStatus;
exports.isLiveAdmin = isLiveAdmin;
exports.bindOfficialKey = bindOfficialKey;
exports.getMyCoralIdentity = getMyCoralIdentity;
exports.SET_IS_LIVE_ADMIN = exports.SET_STS_AUTH = exports.TOGGLE_PAYMENT_DIALOG = exports.FIRST_MSG_CODE = exports.SYSTIME = exports.TOAST = exports.COMPLETE = exports.ERROR = exports.SUCCESS = exports.LOADING = exports.USERINFO = void 0;

var _isomorphicFetch = _interopRequireDefault(__webpack_require__(/*! isomorphic-fetch */ "../node_modules/isomorphic-fetch/fetch-npm-browserify.js"));

var _path = __webpack_require__(/*! path */ "../node_modules/path-browserify/index.js");

var _querystring = __webpack_require__(/*! querystring */ "../node_modules/querystring-es3/index.js");

var _detect = _interopRequireDefault(__webpack_require__(/*! ../../components/detect */ "./wechat-react/components/detect.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import OSS from 'ali-oss'
//获取用户信息
var USERINFO = 'USERINFO'; // 处理中

exports.USERINFO = USERINFO;
var LOADING = 'LOADING'; // 处理成功

exports.LOADING = LOADING;
var SUCCESS = 'SUCCESS'; // 处理失败

exports.SUCCESS = SUCCESS;
var ERROR = 'ERROR'; // 处理完成

exports.ERROR = ERROR;
var COMPLETE = 'COMPLETE'; // 显示toast

exports.COMPLETE = COMPLETE;
var TOAST = 'TOAST';
exports.TOAST = TOAST;
var SYSTIME = 'SYSTIME';
exports.SYSTIME = SYSTIME;
var FIRST_MSG_CODE = 'FIRST_MSG_CODE'; // 关闭支付弹框

exports.FIRST_MSG_CODE = FIRST_MSG_CODE;
var TOGGLE_PAYMENT_DIALOG = 'TOGGLE_PAYMENT_DIALOG'; // 设置sts上传信息

exports.TOGGLE_PAYMENT_DIALOG = TOGGLE_PAYMENT_DIALOG;
var SET_STS_AUTH = 'SET_STS_AUTH';
exports.SET_STS_AUTH = SET_STS_AUTH;
var SET_IS_LIVE_ADMIN = 'SET_IS_LIVE_ADMIN';
exports.SET_IS_LIVE_ADMIN = SET_IS_LIVE_ADMIN;

function loading(status) {
  return {
    type: LOADING,
    status: status
  };
}

;
var uploadClient = null;
var uploadClientDoc = null;

function setIsLiveAdmin(data) {
  return {
    type: SET_IS_LIVE_ADMIN,
    data: data
  };
}

function fetchSuccess() {
  return {
    type: SUCCESS
  };
}

function updateSysTime(sysTime) {
  return {
    type: SYSTIME,
    sysTime: sysTime
  };
}

;

function toast(msg, timeout) {
  return function (dispatch, getStore) {
    dispatch({
      type: TOAST,
      payload: {
        show: true,
        msg: msg,
        timeout: timeout
      }
    });
    setTimeout(function () {
      dispatch({
        type: TOAST,
        payload: {
          show: false
        }
      });
    }, timeout || 1000);
  };
}

; // 上传文件命名

function reName() {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var res = '';

  for (var i = 0; i < 8; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }

  res += '-';

  for (var i = 0; i < 4; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }

  res += '-';

  for (var i = 0; i < 4; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }

  res += '-' + new Date().getTime() + '-';

  for (var i = 0; i < 12; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }

  return res;
}

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
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
/**
 * 图片压缩
 * @param {File} file 文件
 * @returns Promise<File>
 */


function imageCompress(file) {
  var reader = new FileReader();
  var sourceImage = new Image();
  var filename = file.name;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  reader.readAsDataURL(file);
  return new Promise(function (resolve, reject) {
    reader.onload = function (event) {
      sourceImage.src = event.target.result;

      sourceImage.onload = function () {
        canvas.width = sourceImage.width;
        canvas.height = sourceImage.height;
        ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height); // setTimeout(() => {

        var resultFile = dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.5));
        resultFile = new File([resultFile], 'temp.jpg', {
          type: 'image/jpeg'
        });
        resolve(resultFile); // }, 1000);
      };
    };
  });
}
/**
 * 上传音频文件（mp3）
 *
 * @export
 * @param {any} file
 * @param {string} [folder='temp']
 * @param {string} [fileType='.mp3']
 * @param {number} [duration=0]
 * @returns
 */


function uploadAudio(file) {
  var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'audio';
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.mp3';
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    // 是否显示loading遮罩
    showLoading: true,
    // 开始回调
    startUpload: function startUpload() {},
    // 进度回调
    onProgress: function onProgress(progress) {},
    // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
    interruptUpload: function interruptUpload() {
      return false;
    },
    // 上传失败
    onError: function onError() {
      return null;
    }
  };
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(dispatch, getStore) {
        var url, mp3, duration, hasDuration, client, key, checkpoint, fileName, uploadId, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (/(mp3|MP3)$/i.test(file.name)) {
                  _context2.next = 4;
                  break;
                }

                window.toast('只支持MP3文件上传，请重新选择！', 2000);
                options.onError();
                return _context2.abrupt("return");

              case 4:
                if (!(file.size > 31457280)) {
                  _context2.next = 8;
                  break;
                }

                window.toast('请选择小于30M的音频文件！', 2000);
                options.onError();
                return _context2.abrupt("return");

              case 8:
                url = URL.createObjectURL(file);
                mp3 = new Audio(url);
                duration = 0;

                hasDuration = function hasDuration() {
                  return !(duration === 0 || duration === 1);
                };

                mp3.volume = 0;

                mp3.onloadedmetadata = function (data) {
                  duration = hasDuration() ? duration : mp3.duration;
                };

                mp3.ondurationchange = function (data) {
                  duration = hasDuration() ? duration : mp3.duration;
                }; //  先播放 700ms， 确保触发 onloadedmetadata || onloadedmetadata;


                mp3.play();
                _context2.next = 18;
                return new Promise(function (resolve, reject) {
                  setTimeout(function () {
                    mp3.pause();
                    resolve();
                  }, 700);
                });

              case 18:
                client = null;
                _context2.prev = 19;
                _context2.next = 22;
                return getOssClient(getStore, dispatch);

              case 22:
                client = _context2.sent;
                _context2.next = 28;
                break;

              case 25:
                _context2.prev = 25;
                _context2.t0 = _context2["catch"](19);
                console.log('get oss client error: ', _context2.t0);

              case 28:
                key = "qlLive/".concat(folder, "/").concat(reName()).concat(fileType);
                options.showLoading && window.loading(true);
                options.startUpload();
                _context2.next = 33;
                return client.multipartUpload(key, file, {
                  checkpoint: checkpoint,
                  progress: function () {
                    var _progress = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee(p, cpt) {
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              if (!options.interruptUpload()) {
                                _context.next = 4;
                                break;
                              }

                              return _context.abrupt("return", client.abortMultipartUpload(cpt.name, cpt.uploadId));

                            case 4:
                              options.onProgress(p);

                              if (cpt !== undefined) {
                                checkpoint = cpt;
                                fileName = cpt.name;
                                uploadId = cpt.uploadId;
                              }

                              return _context.abrupt("return", Promise.resolve());

                            case 7:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee, this);
                    }));

                    function progress(_x3, _x4) {
                      return _progress.apply(this, arguments);
                    }

                    return progress;
                  }()
                });

              case 33:
                result = _context2.sent;
                file = null;
                options.showLoading && window.loading(false);

                if (!(result.res.status == 200)) {
                  _context2.next = 41;
                  break;
                }

                window.toast('上传成功');
                return _context2.abrupt("return", {
                  url: "https://media.qianliaowang.com/".concat(key),
                  duration: duration
                });

              case 41:
                throw new Error('上传失败 ->' + JSON.stringify(result));

              case 42:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[19, 25]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
}
/**
 * 文档上传
 *
 * @export
 * @param {any} file
 * @param {string} [folder='document']
 * @param {string} [fileType='.pdf']
 * @returns
 */


function uploadDoc(file) {
  var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'document';
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.pdf';
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    // 是否显示loading遮罩
    showLoading: false,
    // 进度回调
    onProgress: function onProgress(progress) {},
    // 是否中断上传，由调用者决定，返回false就是不中断，返回true就是中断
    interruptUpload: function interruptUpload() {
      return false;
    },
    // 错误回调
    onError: function onError() {
      return null;
    },
    // 最大值开关
    maxSizeSwitch: false
  };
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(dispatch, getStore) {
        var maxSize, client, key, checkpoint, fileName, uploadId, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                maxSize = options.maxSizeSwitch ? 63000000 : 20480000;

                if (/(doc|xls|pdf|docx|xlsx|ppt|pptx)$/.test(file.name)) {
                  _context4.next = 5;
                  break;
                }

                window.toast('只支持doc,pdf,xls,ppt文件上传，请重新选择！', 2000);
                options.onError();
                throw new Error('只支持doc,pdf,xls,ppt文件上传，请重新选择!');

              case 5:
                if (!(file.size > maxSize)) {
                  _context4.next = 9;
                  break;
                }

                window.toast("\u6700\u5927\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC7".concat(options.maxSizeSwitch ? '60' : '20', "M!"), 2000);
                options.onError();
                throw new Error("\u6700\u5927\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC7".concat(options.maxSizeSwitch ? '60' : '20', "M!"));

              case 9:
                // 获取文件类型
                if (file.name) {
                  fileType = (0, _path.extname)(file.name);
                }

                _context4.next = 12;
                return getOssClient(getStore, dispatch, 'doc');

              case 12:
                client = _context4.sent;
                key = "qlLive/".concat(folder, "/").concat(reName()).concat(fileType);
                _context4.next = 16;
                return client.multipartUpload(key, file, {
                  checkpoint: checkpoint,
                  progress: function () {
                    var _progress2 = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee3(p, cpt) {
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              if (!options.interruptUpload()) {
                                _context3.next = 4;
                                break;
                              }

                              return _context3.abrupt("return", client.abortMultipartUpload(cpt.name, cpt.uploadId));

                            case 4:
                              options.onProgress(p);
                              return _context3.abrupt("return", function (done) {
                                if (cpt !== undefined) {
                                  checkpoint = cpt;
                                  fileName = cpt.name;
                                  uploadId = cpt.uploadId;
                                  done();
                                }
                              });

                            case 6:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3, this);
                    }));

                    function progress(_x7, _x8) {
                      return _progress2.apply(this, arguments);
                    }

                    return progress;
                  }()
                });

              case 16:
                result = _context4.sent;
                file = null;
                window.loading(false);

                if (!(result.res.status == 200)) {
                  _context4.next = 24;
                  break;
                }

                window.toast('上传成功');
                return _context4.abrupt("return", "https://docs.qianliaowang.com/".concat(key));

              case 24:
                throw new Error('上传失败 ->' + JSON.stringify(result));

              case 25:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function (_x5, _x6) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
}

function uploadRec(file) {
  var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'temp';
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'wav';
  return (
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(dispatch, getStore) {
        var client, key, checkpoint, fileName, uploadId, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return getOssClient(getStore, dispatch);

              case 2:
                client = _context5.sent;
                key = "qlLive/".concat(folder, "/").concat(reName(), ".").concat(fileType);
                window.loading(true);
                _context5.next = 7;
                return client.multipartUpload(key, file, {
                  checkpoint: checkpoint,
                  progress: function progress(p, cpt) {
                    return function (done) {
                      if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                      }

                      done();
                    };
                  }
                });

              case 7:
                result = _context5.sent;
                file = null;
                window.loading(false);

                if (!(result.res.status == 200)) {
                  _context5.next = 15;
                  break;
                }

                window.toast('上传成功');
                return _context5.abrupt("return", "https://media.qlchat.com/".concat(key));

              case 15:
                throw new Error('上传失败 ->' + JSON.stringify(result));

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function (_x9, _x10) {
        return _ref3.apply(this, arguments);
      };
    }()
  );
}
/**
 * 上传图片
 */


function uploadImage(file) {
  var folder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'temp';
  var fileType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.jpg';
  return (
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(dispatch, getStore) {
        var isImage, resultFile, client, key, checkpoint, fileName, uploadId, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (/(jpg|JPG|png|PNG|gif|GIF|bmp|BMP|jpeg|JPEG)$/i.test(file.name)) {
                  _context6.next = 5;
                  break;
                }

                window.toast('图片格式只支持jpg|JPG|png|PNG|gif|GIF|bmp，请重新选择！', 2000);
                return _context6.abrupt("return");

              case 5:
                isImage = true;

              case 6:
                if (!(file.size > 5242880)) {
                  _context6.next = 9;
                  break;
                }

                window.toast('请选择小于5M的图片文件！', 2000);
                return _context6.abrupt("return");

              case 9:
                // 获取文件类型
                if (file.name) {
                  fileType = (0, _path.extname)(file.name);
                }

                resultFile = file;

                if (!(file.size > 3145728)) {
                  _context6.next = 15;
                  break;
                }

                _context6.next = 14;
                return imageCompress(file);

              case 14:
                resultFile = _context6.sent;

              case 15:
                _context6.next = 17;
                return getOssClient(getStore, dispatch);

              case 17:
                client = _context6.sent;
                key = "qlLive/".concat(folder, "/").concat(reName()).concat(fileType);
                window.loading(true);
                _context6.next = 22;
                return client.multipartUpload(key, resultFile, {
                  checkpoint: checkpoint,
                  progress: function progress(p, cpt) {
                    return function (done) {
                      if (cpt !== undefined) {
                        checkpoint = cpt;
                        fileName = cpt.name;
                        uploadId = cpt.uploadId;
                      }

                      done();
                    };
                  }
                });

              case 22:
                result = _context6.sent;
                file = null;
                window.loading(false);

                if (!(result.res.status == 200)) {
                  _context6.next = 30;
                  break;
                }

                if (isImage) {
                  window.toast('图片上传成功');
                } else {
                  window.toast('上传成功');
                }

                return _context6.abrupt("return", "https://img.qlchat.com/".concat(key));

              case 30:
                throw new Error('文件上传失败 ->' + JSON.stringify(result));

              case 31:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function (_x11, _x12) {
        return _ref4.apply(this, arguments);
      };
    }()
  );
}
/**
 * 获取上传组件
 */


function getOssClient(_x13, _x14) {
  return _getOssClient.apply(this, arguments);
}

function _getOssClient() {
  _getOssClient = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee16(getStore, dispatch) {
    var type,
        OSSW,
        STS,
        secure,
        bucket,
        region,
        stsAuth,
        result,
        stsResult,
        client,
        _args16 = arguments;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            type = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : 'common';

            if (!(type === 'common' && uploadClient)) {
              _context16.next = 5;
              break;
            }

            return _context16.abrupt("return", uploadClient);

          case 5:
            if (!(type === 'doc' && uploadClientDoc)) {
              _context16.next = 7;
              break;
            }

            return _context16.abrupt("return", uploadClientDoc);

          case 7:
            if (window.OSS && (!OSSW || !STS)) {
              OSSW = OSS.Wrapper;
              STS = OSS.STS;
            }

            secure = false;

            if (/(https)/.test(window.location.href)) {
              secure = true;
            }

            bucket = 'ql-res';
            region = 'oss-cn-hangzhou';
            stsAuth = getStore().common.stsAuth;

            if (stsAuth) {
              _context16.next = 19;
              break;
            }

            _context16.next = 16;
            return api({
              dispatch: dispatch,
              getStore: getStore,
              showLoading: false,
              url: '/api/wechat/common/getStsAuth'
            });

          case 16:
            result = _context16.sent;
            dispatch({
              type: SET_STS_AUTH,
              stsAuth: result.data
            });
            stsAuth = getStore().common.stsAuth;

          case 19:
            if (!(type == 'doc')) {
              _context16.next = 25;
              break;
            }

            bucket = 'qianliao-doc-download-402-301';
            _context16.next = 23;
            return (0, _isomorphicFetch.default)('/api/wechat/common/getStsAuth?bucketName=' + bucket, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              },
              credentials: 'include'
            }).then(function (res) {
              return res.json();
            });

          case 23:
            stsResult = _context16.sent;

            if (stsResult.state.code == 0) {
              stsAuth = stsResult.data;
            } else {
              console.error('获取sts auth失败！');
            }

          case 25:
            client = new OSSW({
              region: region,
              accessKeyId: stsAuth.accessKeyId,
              secure: secure,
              accessKeySecret: stsAuth.accessKeySecret,
              stsToken: stsAuth.securityToken,
              bucket: bucket
            });

            if (type === 'common') {
              uploadClient = client;
            } else {
              uploadClientDoc = client;
            }

            return _context16.abrupt("return", client);

          case 28:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));
  return _getOssClient.apply(this, arguments);
}

function getStsAuth() {
  return (
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: '/api/wechat/common/getStsAuth'
                });

              case 2:
                result = _context7.sent;
                dispatch({
                  type: SET_STS_AUTH,
                  stsAuth: result.data
                });

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function (_x15, _x16) {
        return _ref5.apply(this, arguments);
      };
    }()
  );
}

function initUserInfo(userInfo) {
  return {
    type: USERINFO,
    userInfo: userInfo
  };
}

;

function getUserInfo(userId, topicId) {
  var params = {
    topicId: topicId
  };

  if (userId) {
    params.userId = userId;
  }

  ;
  return (
    /*#__PURE__*/
    function () {
      var _ref6 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: '/api/wechat/user/info',
                  body: params
                });

              case 2:
                result = _context8.sent;
                dispatch({
                  type: USERINFO,
                  userInfo: result.data
                });
                return _context8.abrupt("return", result);

              case 5:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function (_x17, _x18) {
        return _ref6.apply(this, arguments);
      };
    }()
  );
}
/**
 * 获取二维码
 *
 * @export
 * @param {any} { channel, channelId, liveId, toUserId, topicId, showQl }
 * @returns
 */


function getQr(_ref7) {
  var channel = _ref7.channel,
      channelId = _ref7.channelId,
      liveId = _ref7.liveId,
      _ref7$toUserId = _ref7.toUserId,
      toUserId = _ref7$toUserId === void 0 ? '' : _ref7$toUserId,
      topicId = _ref7.topicId,
      showQl = _ref7.showQl,
      _ref7$showLoading = _ref7.showLoading,
      showLoading = _ref7$showLoading === void 0 ? false : _ref7$showLoading;
  return function (dispatch, getStore) {
    return api({
      dispatch: dispatch,
      getStore: getStore,
      showLoading: showLoading,
      url: '/api/wechat/get-qrcode',
      body: {
        channel: channel,
        channelId: channelId,
        liveId: liveId,
        toUserId: toUserId,
        topicId: topicId,
        showQl: showQl
      }
    });
  };
}
/**
 * 根据话题获取千聊二维码
 *
 * @param {string} topicId
 * @returns
 */


function getTopicQr(topicId, showQl) {
  return function (dispatch, getStore) {
    return api({
      dispatch: dispatch,
      getStore: getStore,
      showLoading: false,
      url: '/api/wechat/get-topic-qrcode',
      body: {
        topicId: topicId,
        showQl: showQl
      }
    });
  };
}
/**
 * 训练营支付
 */


function doPayCamp(_ref8) {
  var _ref8$ifboth = _ref8.ifboth,
      ifboth = _ref8$ifboth === void 0 ? _detect.default.os.phone ? 'Y' : 'N' : _ref8$ifboth,
      _ref8$type = _ref8.type,
      type = _ref8$type === void 0 ? 'TRAINCAMP' : _ref8$type,
      _ref8$source = _ref8.source,
      source = _ref8$source === void 0 ? 'web' : _ref8$source,
      ch = _ref8.ch,
      couponId = _ref8.couponId,
      couponType = _ref8.couponType,
      channelNo = _ref8.channelNo,
      chargeConfigId = _ref8.chargeConfigId,
      shareKey = _ref8.shareKey,
      officialKey = _ref8.officialKey,
      callback = _ref8.callback,
      onCancel = _ref8.onCancel;
  return (
    /*#__PURE__*/
    function () {
      var _ref9 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(dispatch, getStore) {
        var res, order, onBridgeReady;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: 'POST',
                  url: '/api/wechat/make-order',
                  body: {
                    ifboth: ifboth,
                    type: type,
                    source: source,
                    ch: ch,
                    couponId: couponId,
                    couponType: couponType,
                    channelNo: channelNo,
                    chargeConfigId: chargeConfigId,
                    shareKey: shareKey,
                    officialKey: officialKey
                  }
                });

              case 2:
                res = _context9.sent;

                if (res.state.code == 0) {
                  order = res.data.orderResult;

                  if (!_detect.default.os.phone) {
                    dispatch(togglePayDialog(true, order.qcodeId, order.qcodeUrl));
                    selectPayResult(order.qcodeId, function () {
                      typeof callback == 'function' && callback(order.qcodeId);
                      dispatch(togglePayDialog(false));
                    }, function () {
                      console.log('ssss');
                      dispatch(togglePayDialog(false));
                    });
                  } else {
                    onBridgeReady = function onBridgeReady(data) {
                      WeixinJSBridge.invoke('getBrandWCPayRequest', {
                        'appId': data.appId,
                        'timeStamp': data.timeStamp,
                        'nonceStr': data.nonceStr,
                        'package': data.packageValue,
                        'signType': data.signType,
                        'paySign': data.paySign
                      }, function (result) {
                        console.log('调起支付支付回调 == ', JSON.stringify(result));

                        if (result.err_msg == 'get_brand_wcpay_request:ok') {
                          selectPayResult(order.orderId, function () {
                            typeof callback == 'function' && callback(order.orderId);
                          }, function () {
                            dispatch(togglePayDialog(false));
                          });
                        } else if (result.err_msg == 'get_brand_wcpay_request:fail') {
                          dispatch(togglePayDialog(true, order.qcodeId, order.qcodeUrl));
                          selectPayResult(order.qcodeId, function () {
                            dispatch(togglePayDialog(false));
                            typeof callback == 'function' && callback(order.qcodeId);
                          }, function () {
                            dispatch(togglePayDialog(false));
                          });
                        } else if (result.err_msg == 'get_brand_wcpay_request:cancel') {
                          window.toast('已取消付费');

                          if (typeof onCancel === 'function') {
                            onCancel(order.orderId);
                          }
                        }
                      });
                    }; // 监听付款回调


                    if (typeof window.WeixinJSBridge === 'undefined') {
                      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else {
                      onBridgeReady(order);
                    }
                  }
                } else if (res.state.code == 20012) {
                  onPayFree && onPayFree(res);
                }

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function (_x19, _x20) {
        return _ref9.apply(this, arguments);
      };
    }()
  );
}

function selectPayResult(orderId, done, timeout) {
  if (!window.selectPayResultCount) {
    window.selectPayResultCount = 1;
  }

  console.log('支付回调次数 ==== ', window.selectPayResultCount);
  (0, _isomorphicFetch.default)('/api/wechat/selectResult?orderId=' + orderId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    credentials: 'include'
  }).then(function (res) {
    return res.json();
  }).then(function (json) {
    console.log('支付回调 == ', JSON.stringify(json));

    if (json.state.code == 0) {
      window.selectPayResultCount = 1; // if (json.state.msg == 'SUCCESS') {
      //     window.toast('支付成功');

      done(); // } else if (json.state.msg == 'CANCEL') {
      //     window.toast('微信支付处理中，请稍后再看,\n或者联系管理员');
      // } else {
      //     window.toast('支付失败');
      // }
    } else {
      setTimeout(function () {
        if (window.selectPayResultCount < 40) {
          window.selectPayResultCount += 1;
          selectPayResult(orderId, done, timeout);

          if (window.selectPayResultCount == 40) {
            timeout && timeout();
          }
        } else {
          window.selectPayResultCount = 1;
        }
      }, 3000);
    }
  });
} // 开关二维码弹框


function togglePayDialog(show, qcodeId, qcodeUrl) {
  return {
    type: TOGGLE_PAYMENT_DIALOG,
    show: show,
    qcodeId: qcodeId,
    qcodeUrl: qcodeUrl
  };
} // 获取系统时间


function getSysTime() {
  return (
    /*#__PURE__*/
    function () {
      var _ref10 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  url: '/api/base/sys-time',
                  method: 'GET',
                  showLoading: false,
                  body: {}
                });

              case 2:
                result = _context10.sent;
                return _context10.abrupt("return", result);

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      return function (_x21, _x22) {
        return _ref10.apply(this, arguments);
      };
    }()
  );
}

;

function fetchAndUpdateSysTime() {
  return (
    /*#__PURE__*/
    function () {
      var _ref11 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  url: '/api/base/sys-time',
                  method: 'GET',
                  showLoading: false,
                  body: {}
                });

              case 2:
                result = _context11.sent;
                dispatch({
                  type: SYSTIME,
                  sysTime: result.data.sysTime
                });
                return _context11.abrupt("return", result);

              case 5:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function (_x23, _x24) {
        return _ref11.apply(this, arguments);
      };
    }()
  );
} // 请求封装


function api(_ref12) {
  var _ref12$dispatch = _ref12.dispatch,
      dispatch = _ref12$dispatch === void 0 ? function () {} : _ref12$dispatch,
      _ref12$getStore = _ref12.getStore,
      getStore = _ref12$getStore === void 0 ? function () {} : _ref12$getStore,
      url = _ref12.url,
      _ref12$method = _ref12.method,
      method = _ref12$method === void 0 ? 'GET' : _ref12$method,
      _ref12$body = _ref12.body,
      body = _ref12$body === void 0 ? {} : _ref12$body,
      _ref12$showWarningTip = _ref12.showWarningTips,
      showWarningTips = _ref12$showWarningTip === void 0 ? true : _ref12$showWarningTip,
      _ref12$showLoading = _ref12.showLoading,
      showLoading = _ref12$showLoading === void 0 ? true : _ref12$showLoading,
      _ref12$errorResolve = _ref12.errorResolve,
      errorResolve = _ref12$errorResolve === void 0 ? false : _ref12$errorResolve;
  return new Promise(function (resolve, reject) {
    !!showLoading && dispatch(loading(true));
    url = method === 'GET' ? "".concat(url, "?").concat((0, _querystring.encode)(body)) : url;
    (0, _isomorphicFetch.default)(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      credentials: 'include',
      body: method === 'POST' ? JSON.stringify(body) : null
    }).then(function (res) {
      return res.json();
    }).then(function (json) {
      !!showLoading && dispatch(loading(false)); // console.log(json);

      if (!json.state || !json.state.code && json.state.code != 0) {
        console.error('错误的返回格式');
      }

      switch (json.state.code) {
        case 0:
          resolve(json);
          break;

        case 110:
          if (json.data && json.data.url) {
            var redirect_url = window.location.href;
            window.location.replace('/api/wx/login?redirect_url=' + encodeURIComponent(redirect_url));
          }

          break;

        case 10001:
          resolve(json);
          break;

        case 20005:
          // 未登录
          break;

        case 50004:
          // 该CODE已被使用
          resolve(json);
          break;

        case 50005:
          // 已经是管理员
          resolve(json);
          break;

        default:
          if (errorResolve) {
            resolve(json);
          }

          showWarningTips && window.toast(json.state.msg);
          break;
      }
    }).catch(function (err) {
      console.error(err);

      if (errorResolve) {
        resolve(err);
      }

      !!showLoading && dispatch(loading(false));
    });
  });
}

function getCreateLiveStatus(topicId) {
  return (
    /*#__PURE__*/
    function () {
      var _ref13 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: 'POST',
                  showLoading: false,
                  url: '/api/wechat/user/getCreateLiveStatus',
                  body: {
                    topicId: topicId
                  }
                });

              case 2:
                result = _context12.sent;
                return _context12.abrupt("return", result);

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function (_x25, _x26) {
        return _ref13.apply(this, arguments);
      };
    }()
  );
}

function isLiveAdmin(liveId) {
  return (
    /*#__PURE__*/
    function () {
      var _ref14 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee13(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: '/api/wechat/studio/is-live-admin',
                  body: {
                    liveId: liveId
                  }
                });

              case 2:
                result = _context13.sent;
                return _context13.abrupt("return", result);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function (_x27, _x28) {
        return _ref14.apply(this, arguments);
      };
    }()
  );
}
/* 官方课代表绑定临时关系 */


function bindOfficialKey(params) {
  return (
    /*#__PURE__*/
    function () {
      var _ref15 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee14(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  method: 'POST',
                  showLoading: false,
                  url: '/api/wechat/coral/bindUserRef',
                  body: params
                });

              case 2:
                result = _context14.sent;
                return _context14.abrupt("return", result);

              case 4:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function (_x29, _x30) {
        return _ref15.apply(this, arguments);
      };
    }()
  );
}
/* 获取官方课代表身份 */


function getMyCoralIdentity(params) {
  return (
    /*#__PURE__*/
    function () {
      var _ref16 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee15(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return api({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: false,
                  url: '/api/wechat/coral/getMyIdentity',
                  body: params
                });

              case 2:
                result = _context15.sent;
                return _context15.abrupt("return", result);

              case 4:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      return function (_x31, _x32) {
        return _ref16.apply(this, arguments);
      };
    }()
  );
}

/***/ }),

/***/ "./wechat-react/mine/actions/takeincome-record.js":
/*!********************************************************!*\
  !*** ./wechat-react/mine/actions/takeincome-record.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLoadingStatus = exports.resendName = exports.getGuestTransferRecord = exports.getTakeincomeRecord = exports.SET_LOADING_STATUS = exports.GET_TAKEINCOME_RECORD = void 0;

var _common = __webpack_require__(/*! ./common */ "./wechat-react/mine/actions/common.js");

var _util = __webpack_require__(/*! components/util */ "./wechat-react/components/util.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var GET_TAKEINCOME_RECORD = "GET_TAKEINCOME_RECORD";
exports.GET_TAKEINCOME_RECORD = GET_TAKEINCOME_RECORD;
var SET_LOADING_STATUS = "SET_LOADING_STATUS"; // 获取提现列表

exports.SET_LOADING_STATUS = SET_LOADING_STATUS;

var getTakeincomeRecord = function getTakeincomeRecord() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(dispatch, getStore) {
        var takeincomeRecord, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dispatch(setLoadingStatus('pending'));
                takeincomeRecord = getStore().takeincomeRecord;
                _context.next = 4;
                return (0, _common.api)({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: true,
                  url: "/api/wechat/transfer/h5/live/reward/withdrawRecord",
                  method: "POST",
                  body: {
                    liveId: params.liveId,
                    userId: params.userId,
                    page: {
                      page: takeincomeRecord.page,
                      size: takeincomeRecord.pageSize
                    }
                  }
                });

              case 4:
                result = _context.sent;

                if (result.state.code === 0) {
                  dispatch({
                    type: GET_TAKEINCOME_RECORD,
                    payload: result.data
                  });

                  if (result.data.list.length < takeincomeRecord.pageSize) {
                    dispatch(setLoadingStatus('end'));
                  } else {
                    dispatch(setLoadingStatus('more'));
                  }
                }

                return _context.abrupt("return", result.data && result.data.purchaseList || []);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
}; // 获取直播间嘉宾分成发放记录


exports.getTakeincomeRecord = getTakeincomeRecord;

var getGuestTransferRecord = function getGuestTransferRecord() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(dispatch, getStore) {
        var takeincomeRecord, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                dispatch(setLoadingStatus('pending'));
                takeincomeRecord = getStore().takeincomeRecord;
                _context2.next = 4;
                return (0, _common.api)({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: true,
                  url: "/api/wechat/transfer/h5/live/reward/withdrawRecord",
                  method: "POST",
                  body: {
                    liveId: params.liveId,
                    userId: params.userId,
                    page: {
                      page: takeincomeRecord.page,
                      size: takeincomeRecord.pageSize
                    }
                  }
                });

              case 4:
                result = _context2.sent;

                if (result.state.code === 0) {
                  dispatch({
                    type: GET_TAKEINCOME_RECORD,
                    payload: result.data
                  });

                  if (result.data.list.length < takeincomeRecord.pageSize) {
                    dispatch(setLoadingStatus('end'));
                  } else {
                    dispatch(setLoadingStatus('more'));
                  }
                }

                return _context2.abrupt("return", result.data && result.data.purchaseList || []);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
}; // 重新提交申请


exports.getGuestTransferRecord = getGuestTransferRecord;

var resendName = function resendName() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(dispatch, getStore) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _common.api)({
                  dispatch: dispatch,
                  getStore: getStore,
                  showLoading: true,
                  url: "/api/wechat/transfer/h5/profitRecord/saveRealName",
                  method: "POST",
                  body: {
                    liveId: params.liveId,
                    userId: params.userId,
                    name: params.name,
                    recordId: params.recordId
                  }
                });

              case 2:
                result = _context3.sent;
                window && window.toast(result.state.msg);

                if (result.state.code === 0) {
                  (0, _util.locationTo)("/wechat/page/live/profit/withdraw/".concat(params.liveId));
                }

                return _context3.abrupt("return", result.state || []);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
      };
    }()
  );
};

exports.resendName = resendName;

var setLoadingStatus = function setLoadingStatus(status) {
  return {
    type: SET_LOADING_STATUS,
    status: status
  };
};

exports.setLoadingStatus = setLoadingStatus;

/***/ }),

/***/ "./wechat-react/mine/components/portal-com/style.scss":
/*!************************************************************!*\
  !*** ./wechat-react/mine/components/portal-com/style.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/business-payment-takeincome/style.scss":
/*!*****************************************************************************!*\
  !*** ./wechat-react/mine/containers/business-payment-takeincome/style.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/buy-history/components/tab/style.scss":
/*!****************************************************************************!*\
  !*** ./wechat-react/mine/containers/buy-history/components/tab/style.scss ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/buy-history/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/mine/containers/buy-history/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/enter-logout/style.scss":
/*!**************************************************************!*\
  !*** ./wechat-react/mine/containers/enter-logout/style.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/logout-rule/style.scss":
/*!*************************************************************!*\
  !*** ./wechat-react/mine/containers/logout-rule/style.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/takeincome-record/components/guest-profit/style.scss":
/*!*******************************************************************************************!*\
  !*** ./wechat-react/mine/containers/takeincome-record/components/guest-profit/style.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/takeincome-record/components/tab/style.scss":
/*!**********************************************************************************!*\
  !*** ./wechat-react/mine/containers/takeincome-record/components/tab/style.scss ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/takeincome-record/style.scss":
/*!*******************************************************************!*\
  !*** ./wechat-react/mine/containers/takeincome-record/style.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/user-info/style.scss":
/*!***********************************************************!*\
  !*** ./wechat-react/mine/containers/user-info/style.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/containers/verification-code/style.scss":
/*!*******************************************************************!*\
  !*** ./wechat-react/mine/containers/verification-code/style.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./wechat-react/mine/index.js":
/*!************************************!*\
  !*** ./wechat-react/mine/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! @babel/polyfill */ "../node_modules/@babel/polyfill/lib/index.js");

__webpack_require__(/*! isomorphic-fetch */ "../node_modules/isomorphic-fetch/fetch-npm-browserify.js");

__webpack_require__(/*! ./styles.js */ "./wechat-react/mine/styles.js");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../node_modules/react/index.js"));

var _reactDom = __webpack_require__(/*! react-dom */ "../node_modules/react-dom/index.js");

var _reactRouter = __webpack_require__(/*! react-router */ "../node_modules/react-router/es/index.js");

var _history = __webpack_require__(/*! history */ "../node_modules/history/lib/index.js");

var _reduxThunk = _interopRequireDefault(__webpack_require__(/*! redux-thunk */ "../node_modules/redux-thunk/lib/index.js"));

var _redux = __webpack_require__(/*! redux */ "../node_modules/redux/es/index.js");

var _reactRedux = __webpack_require__(/*! react-redux */ "../node_modules/react-redux/es/index.js");

var _reactRouterRedux = __webpack_require__(/*! react-router-redux */ "../node_modules/react-router-redux/lib/index.js");

var _routes = _interopRequireDefault(__webpack_require__(/*! ./routes */ "./wechat-react/mine/routes/index.js"));

var _reducers = _interopRequireDefault(__webpack_require__(/*! ./reducers */ "./wechat-react/mine/reducers/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var history = (0, _reactRouter.useRouterHistory)(_history.createHistory)();
var router = (0, _reactRouterRedux.routerMiddleware)(history);
var middlewares = [router, _reduxThunk.default];
var store = (0, _redux.compose)(_redux.applyMiddleware.apply(void 0, middlewares), window.devToolsExtension ? window.devToolsExtension() : function (f) {
  return f;
})(_redux.createStore)((0, _reducers.default)(null), window.__INIT_STATE__ || {});
history = (0, _reactRouterRedux.syncHistoryWithStore)(history, store); // match 解决router的异步组件请求还未成功时，导致react渲染空组件，从而与服务端渲染代码对不上的问题

(0, _reactRouter.match)({
  history: history,
  routes: _routes.default
}, function (error, redirectLocation, renderProps) {
  var location = renderProps.location;
  (0, _reactDom.hydrate)(_react.default.createElement(_reactRedux.Provider, {
    store: store,
    key: "provider"
  }, _react.default.createElement(_reactRouter.Router, _extends({
    history: history,
    routes: _routes.default
  }, renderProps))), document.getElementById('app'));
});

/***/ }),

/***/ "./wechat-react/mine/reducers/business-payment-takeincome.js":
/*!*******************************************************************!*\
  !*** ./wechat-react/mine/reducers/business-payment-takeincome.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.businessPaymentTakeincome = businessPaymentTakeincome;

var _businessPaymentTakeincome = __webpack_require__(/*! ../actions/business-payment-takeincome */ "./wechat-react/mine/actions/business-payment-takeincome.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initState = {
  accountName: "",
  accountNo: "",
  openBank: ""
};

function businessPaymentTakeincome() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _businessPaymentTakeincome.GET_PUBTOPUB_MESSAGE:
      var newState = _objectSpread({}, state, {
        accountName: action.accountName,
        accountNo: action.accountNo,
        openBank: action.openBank
      });

      return newState;

    default:
      return state;
  }
}

/***/ }),

/***/ "./wechat-react/mine/reducers/buy.js":
/*!*******************************************!*\
  !*** ./wechat-react/mine/reducers/buy.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buy = buy;

var _buy = __webpack_require__(/*! ../actions/buy */ "./wechat-react/mine/actions/buy.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initState = {
  buyLists: [],
  noneData: false,
  isNoMoreCourse: false
};

function buy() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _buy.GET_BUY_LISTS:
      return _objectSpread({}, state, {
        buyLists: _toConsumableArray(state.buyLists).concat(_toConsumableArray(action.buyLists)),
        noneData: action.noneData,
        isNoMoreCourse: action.isNoMoreCourse
      });

    default:
      return state;
  }
}

/***/ }),

/***/ "./wechat-react/mine/reducers/common.js":
/*!**********************************************!*\
  !*** ./wechat-react/mine/reducers/common.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.common = common;

var _common = __webpack_require__(/*! ../actions/common */ "./wechat-react/mine/actions/common.js");

var _common2 = __webpack_require__(/*! ../../actions/common */ "./wechat-react/actions/common.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initData = {
  // toast
  toast: {
    show: false,
    msg: '',
    timeout: 1000
  },
  // loading显示状态
  loading: false,
  // 记录系统时间
  sysTime: null,
  // 虚拟二维码链接
  virtualQrcodeUrl: '',
  payment: {
    showDialog: false
  },
  userInfo: {
    user: {}
  },
  // 是否专业版
  isLiveAdmin: null,
  liveAdminOverDue: null
};

function common() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initData;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _common.TOAST:
      return _objectSpread({}, state, {
        toast: action.payload
      });

    case _common.LOADING:
      return _objectSpread({}, state, {
        loading: action.status
      });

    case _common.SYSTIME:
      return _objectSpread({}, state, {
        sysTime: action.sysTime
      });

    case _common.SET_STS_AUTH:
      return _objectSpread({}, state, {
        stsAuth: action.stsAuth
      });

    case _common.TOGGLE_PAYMENT_DIALOG:
      return _objectSpread({}, state, {
        payment: {
          showDialog: action.show,
          qcodeId: action.qcodeId,
          qcodeUrl: action.qcodeUrl
        }
      });

    case _common.USERINFO:
      return _objectSpread({}, state, {
        userInfo: action.userInfo
      });

    case _common2.UPDATE_USERINFO:
      return _objectSpread({}, state, {
        userInfo: _objectSpread({}, state.userInfo, {
          user: _objectSpread({}, state.userInfo.user, action.userInfo)
        })
      });

    case _common.SET_IS_LIVE_ADMIN:
      return _objectSpread({}, state, {
        isLiveAdmin: action.data.isLiveAdmin,
        liveAdminOverDue: action.data.liveAdminOverDue
      });

    default:
      return state;
  }
}

/***/ }),

/***/ "./wechat-react/mine/reducers/index.js":
/*!*********************************************!*\
  !*** ./wechat-react/mine/reducers/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = __webpack_require__(/*! redux */ "../node_modules/redux/es/index.js");

var _reactRouterRedux = __webpack_require__(/*! react-router-redux */ "../node_modules/react-router-redux/lib/index.js");

var common = _interopRequireWildcard(__webpack_require__(/*! ./common */ "./wechat-react/mine/reducers/common.js"));

var buy = _interopRequireWildcard(__webpack_require__(/*! ./buy */ "./wechat-react/mine/reducers/buy.js"));

var businessPaymentTakeincome = _interopRequireWildcard(__webpack_require__(/*! ./business-payment-takeincome */ "./wechat-react/mine/reducers/business-payment-takeincome.js"));

var takeincomeRecord = _interopRequireWildcard(__webpack_require__(/*! ./takeincome-record */ "./wechat-react/mine/reducers/takeincome-record.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default(_) {
  return (0, _redux.combineReducers)(_objectSpread({}, buy, common, businessPaymentTakeincome, takeincomeRecord, {
    routing: _reactRouterRedux.routerReducer
  }));
};

exports.default = _default;

/***/ }),

/***/ "./wechat-react/mine/reducers/takeincome-record.js":
/*!*********************************************************!*\
  !*** ./wechat-react/mine/reducers/takeincome-record.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeincomeRecord = takeincomeRecord;

var _takeincomeRecord = __webpack_require__(/*! ../actions/takeincome-record */ "./wechat-react/mine/actions/takeincome-record.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initState = {
  page: 1,
  pageSize: 9,
  loadingStatus: 'more',
  takeincomeRecord: []
};

function takeincomeRecord() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _takeincomeRecord.GET_TAKEINCOME_RECORD:
      return _objectSpread({}, state, {
        takeincomeRecord: state.takeincomeRecord.concat(action.payload.list),
        page: state.page + 1
      });

    case _takeincomeRecord.SET_LOADING_STATUS:
      return _objectSpread({}, state, {
        loadingStatus: action.status
      });

    default:
      return state;
  }
}

/***/ }),

/***/ "./wechat-react/mine/routes/buy.js":
/*!*****************************************!*\
  !*** ./wechat-react/mine/routes/buy.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BuyHistory = void 0;
var BuyHistory = {
  path: 'mine/buy',
  getComponent: function getComponent(nextState, callback) {
    Promise.all(/*! require.ensure */[__webpack_require__.e(3), __webpack_require__.e(0), __webpack_require__.e(7)]).then((function (require) {
      callback(null, __webpack_require__(/*! ../containers/buy-history */ "./wechat-react/mine/containers/buy-history/index.jsx"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
  }
};
exports.BuyHistory = BuyHistory;

/***/ }),

/***/ "./wechat-react/mine/routes/enter-logout.js":
/*!**************************************************!*\
  !*** ./wechat-react/mine/routes/enter-logout.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnterLogout = void 0;
var EnterLogout = {
  path: 'mine/enter-logout',
  getComponent: function getComponent(nextState, callback) {
    Promise.all(/*! require.ensure */[__webpack_require__.e(1), __webpack_require__.e(6)]).then((function (require) {
      callback(null, __webpack_require__(/*! ../containers/enter-logout */ "./wechat-react/mine/containers/enter-logout/index.js"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
  }
};
exports.EnterLogout = EnterLogout;

/***/ }),

/***/ "./wechat-react/mine/routes/index.js":
/*!*******************************************!*\
  !*** ./wechat-react/mine/routes/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _app = _interopRequireDefault(__webpack_require__(/*! ../../app.js */ "./wechat-react/app.js"));

var _buy = __webpack_require__(/*! ./buy */ "./wechat-react/mine/routes/buy.js");

var _logoutRule = __webpack_require__(/*! ./logout-rule */ "./wechat-react/mine/routes/logout-rule.js");

var _enterLogout = __webpack_require__(/*! ./enter-logout */ "./wechat-react/mine/routes/enter-logout.js");

var _verificationCode = __webpack_require__(/*! ./verification-code */ "./wechat-react/mine/routes/verification-code.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserInfo = {
  path: 'mine/user-info',
  getComponent: function getComponent(nextState, callback) {
    __webpack_require__.e(/*! require.ensure */ 8).then((function (require) {
      callback(null, __webpack_require__(/*! ../containers/user-info */ "./wechat-react/mine/containers/user-info/index.js").default);
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
  }
};
var BusinessPaymentTakeincome = {
  path: 'mine/business-payment-takeincome',
  getComponent: function getComponent(nextState, callback) {
    Promise.all(/*! require.ensure */[__webpack_require__.e(0), __webpack_require__.e(2), __webpack_require__.e(10)]).then((function (require) {
      callback(null, __webpack_require__(/*! ../containers/business-payment-takeincome */ "./wechat-react/mine/containers/business-payment-takeincome/index.js").default);
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
  }
};
var TakeincomeRecord = {
  path: 'mine/takeincome-record',
  getComponent: function getComponent(nextState, callback) {
    Promise.all(/*! require.ensure */[__webpack_require__.e(5), __webpack_require__.e(0), __webpack_require__.e(2), __webpack_require__.e(4)]).then((function (require) {
      callback(null, __webpack_require__(/*! ../containers/takeincome-record */ "./wechat-react/mine/containers/takeincome-record/index.js").default);
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
  }
};
var rootRoute = {
  path: '/wechat/page',
  component: _app.default,
  childRoutes: [_buy.BuyHistory, _logoutRule.LogOutRule, _enterLogout.EnterLogout, _verificationCode.VerificationCode, UserInfo, BusinessPaymentTakeincome, TakeincomeRecord]
};
var _default = rootRoute;
exports.default = _default;

/***/ }),

/***/ "./wechat-react/mine/routes/logout-rule.js":
/*!*************************************************!*\
  !*** ./wechat-react/mine/routes/logout-rule.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogOutRule = void 0;
var LogOutRule = {
  path: 'mine/logout-rule',
  getComponent: function getComponent(nextState, callback) {
    Promise.all(/*! require.ensure */[__webpack_require__.e(1), __webpack_require__.e(9)]).then((function (require) {
      callback(null, __webpack_require__(/*! ../containers/logout-rule */ "./wechat-react/mine/containers/logout-rule/index.js"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
  }
};
exports.LogOutRule = LogOutRule;

/***/ }),

/***/ "./wechat-react/mine/routes/verification-code.js":
/*!*******************************************************!*\
  !*** ./wechat-react/mine/routes/verification-code.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerificationCode = void 0;
var VerificationCode = {
  path: 'mine/verification-vode',
  getComponent: function getComponent(nextState, callback) {
    Promise.all(/*! require.ensure */[__webpack_require__.e(1), __webpack_require__.e(11)]).then((function (require) {
      callback(null, __webpack_require__(/*! ../containers/verification-code */ "./wechat-react/mine/containers/verification-code/index.js"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
  }
};
exports.VerificationCode = VerificationCode;

/***/ }),

/***/ "./wechat-react/mine/styles.js":
/*!*************************************!*\
  !*** ./wechat-react/mine/styles.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ./components/portal-com/style.scss */ "./wechat-react/mine/components/portal-com/style.scss");

__webpack_require__(/*! ./containers/business-payment-takeincome/style.scss */ "./wechat-react/mine/containers/business-payment-takeincome/style.scss");

__webpack_require__(/*! ./containers/buy-history/components/tab/style.scss */ "./wechat-react/mine/containers/buy-history/components/tab/style.scss");

__webpack_require__(/*! ./containers/buy-history/style.scss */ "./wechat-react/mine/containers/buy-history/style.scss");

__webpack_require__(/*! ./containers/enter-logout/style.scss */ "./wechat-react/mine/containers/enter-logout/style.scss");

__webpack_require__(/*! ./containers/logout-rule/style.scss */ "./wechat-react/mine/containers/logout-rule/style.scss");

__webpack_require__(/*! ./containers/takeincome-record/components/guest-profit/style.scss */ "./wechat-react/mine/containers/takeincome-record/components/guest-profit/style.scss");

__webpack_require__(/*! ./containers/takeincome-record/components/tab/style.scss */ "./wechat-react/mine/containers/takeincome-record/components/tab/style.scss");

__webpack_require__(/*! ./containers/takeincome-record/style.scss */ "./wechat-react/mine/containers/takeincome-record/style.scss");

__webpack_require__(/*! ./containers/user-info/style.scss */ "./wechat-react/mine/containers/user-info/style.scss");

__webpack_require__(/*! ./containers/verification-code/style.scss */ "./wechat-react/mine/containers/verification-code/style.scss");

__webpack_require__(/*! ../assets/ql-fonts/style.scss */ "./wechat-react/assets/ql-fonts/style.scss");

__webpack_require__(/*! ../assets/styles/base-definition.scss */ "./wechat-react/assets/styles/base-definition.scss");

__webpack_require__(/*! ../assets/styles/common.scss */ "./wechat-react/assets/styles/common.scss");

__webpack_require__(/*! ../assets/styles/flex.scss */ "./wechat-react/assets/styles/flex.scss");

__webpack_require__(/*! ../assets/styles/fonts/source-han-sans.scss */ "./wechat-react/assets/styles/fonts/source-han-sans.scss");

__webpack_require__(/*! ../assets/styles/icon.scss */ "./wechat-react/assets/styles/icon.scss");

__webpack_require__(/*! ../assets/styles/mixins.scss */ "./wechat-react/assets/styles/mixins.scss");

__webpack_require__(/*! ../assets/styles/page-common.scss */ "./wechat-react/assets/styles/page-common.scss");

__webpack_require__(/*! ../assets/styles/reset.scss */ "./wechat-react/assets/styles/reset.scss");

__webpack_require__(/*! ../assets/styles/rmc-datepicker-popup.scss */ "./wechat-react/assets/styles/rmc-datepicker-popup.scss");

__webpack_require__(/*! ../assets/styles/rmc-datepicker.scss */ "./wechat-react/assets/styles/rmc-datepicker.scss");

__webpack_require__(/*! ../components/action-sheet/style.scss */ "./wechat-react/components/action-sheet/style.scss");

__webpack_require__(/*! ../components/address-select/style.scss */ "./wechat-react/components/address-select/style.scss");

__webpack_require__(/*! ../components/app-download-bar/style.scss */ "./wechat-react/components/app-download-bar/style.scss");

__webpack_require__(/*! ../components/app-download-confirm/style.scss */ "./wechat-react/components/app-download-confirm/style.scss");

__webpack_require__(/*! ../components/archivement-card/style.scss */ "./wechat-react/components/archivement-card/style.scss");

__webpack_require__(/*! ../components/auto-fixed-nav/style.scss */ "./wechat-react/components/auto-fixed-nav/style.scss");

__webpack_require__(/*! ../components/back-tuition-dialog/style.scss */ "./wechat-react/components/back-tuition-dialog/style.scss");

__webpack_require__(/*! ../components/books-item/style.scss */ "./wechat-react/components/books-item/style.scss");

__webpack_require__(/*! ../components/bottom-brand/style.scss */ "./wechat-react/components/bottom-brand/style.scss");

__webpack_require__(/*! ../components/bullet-screen/style.scss */ "./wechat-react/components/bullet-screen/style.scss");

__webpack_require__(/*! ../components/calendar-card/style/index.scss */ "./wechat-react/components/calendar-card/style/index.scss");

__webpack_require__(/*! ../components/camp-ad/style.scss */ "./wechat-react/components/camp-ad/style.scss");

__webpack_require__(/*! ../components/canvas-video-player/style.scss */ "./wechat-react/components/canvas-video-player/style.scss");

__webpack_require__(/*! ../components/carousel/style.scss */ "./wechat-react/components/carousel/style.scss");

__webpack_require__(/*! ../components/category-menu/style.scss */ "./wechat-react/components/category-menu/style.scss");

__webpack_require__(/*! ../components/channel-list-item/style.scss */ "./wechat-react/components/channel-list-item/style.scss");

__webpack_require__(/*! ../components/common-course-item/style.scss */ "./wechat-react/components/common-course-item/style.scss");

__webpack_require__(/*! ../components/common-input/style.scss */ "./wechat-react/components/common-input/style.scss");

__webpack_require__(/*! ../components/common-textarea/style.scss */ "./wechat-react/components/common-textarea/style.scss");

__webpack_require__(/*! ../components/community-guide-modal/style.scss */ "./wechat-react/components/community-guide-modal/style.scss");

__webpack_require__(/*! ../components/community-suspension/style.scss */ "./wechat-react/components/community-suspension/style.scss");

__webpack_require__(/*! ../components/confirm-dialog/style.scss */ "./wechat-react/components/confirm-dialog/style.scss");

__webpack_require__(/*! ../components/coral-focus-top/style.scss */ "./wechat-react/components/coral-focus-top/style.scss");

__webpack_require__(/*! ../components/coral-tabbar/styles.scss */ "./wechat-react/components/coral-tabbar/styles.scss");

__webpack_require__(/*! ../components/coupon-dialog/style.scss */ "./wechat-react/components/coupon-dialog/style.scss");

__webpack_require__(/*! ../components/coupon-in-detail/style.scss */ "./wechat-react/components/coupon-in-detail/style.scss");

__webpack_require__(/*! ../components/coupon-item/style.scss */ "./wechat-react/components/coupon-item/style.scss");

__webpack_require__(/*! ../components/course-purchase/components/coupon-btn/style.scss */ "./wechat-react/components/course-purchase/components/coupon-btn/style.scss");

__webpack_require__(/*! ../components/course-purchase/components/coupon-lists/style.scss */ "./wechat-react/components/course-purchase/components/coupon-lists/style.scss");

__webpack_require__(/*! ../components/course-purchase/components/payment-details-dialog/style.scss */ "./wechat-react/components/course-purchase/components/payment-details-dialog/style.scss");

__webpack_require__(/*! ../components/course-purchase/components/try-listen-btn/style.scss */ "./wechat-react/components/course-purchase/components/try-listen-btn/style.scss");

__webpack_require__(/*! ../components/course-purchase/style.scss */ "./wechat-react/components/course-purchase/style.scss");

__webpack_require__(/*! ../components/create-live-helper/style.scss */ "./wechat-react/components/create-live-helper/style.scss");

__webpack_require__(/*! ../components/curtain/index.scss */ "./wechat-react/components/curtain/index.scss");

__webpack_require__(/*! ../components/date-picker/style.scss */ "./wechat-react/components/date-picker/style.scss");

__webpack_require__(/*! ../components/dialog/styles.scss */ "./wechat-react/components/dialog/styles.scss");

__webpack_require__(/*! ../components/dialogs-colorful/company/style.scss */ "./wechat-react/components/dialogs-colorful/company/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/coral-join/style.scss */ "./wechat-react/components/dialogs-colorful/coral-join/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/coral-promo-dialog/components/tutorial/styles.scss */ "./wechat-react/components/dialogs-colorful/coral-promo-dialog/components/tutorial/styles.scss");

__webpack_require__(/*! ../components/dialogs-colorful/coral-promo-dialog/style.scss */ "./wechat-react/components/dialogs-colorful/coral-promo-dialog/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/coral-push-box/styles.scss */ "./wechat-react/components/dialogs-colorful/coral-push-box/styles.scss");

__webpack_require__(/*! ../components/dialogs-colorful/doctor/style.scss */ "./wechat-react/components/dialogs-colorful/doctor/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/focus-qrcode/style.scss */ "./wechat-react/components/dialogs-colorful/focus-qrcode/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/focusql-guide/style.scss */ "./wechat-react/components/dialogs-colorful/focusql-guide/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/hot-heart/style.scss */ "./wechat-react/components/dialogs-colorful/hot-heart/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/job-list-dialog/style.scss */ "./wechat-react/components/dialogs-colorful/job-list-dialog/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/live-v/style.scss */ "./wechat-react/components/dialogs-colorful/live-v/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/more-user-info/index.scss */ "./wechat-react/components/dialogs-colorful/more-user-info/index.scss");

__webpack_require__(/*! ../components/dialogs-colorful/new-real-name/style.scss */ "./wechat-react/components/dialogs-colorful/new-real-name/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/push-dialogs/style.scss */ "./wechat-react/components/dialogs-colorful/push-dialogs/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/pyramid/style.scss */ "./wechat-react/components/dialogs-colorful/pyramid/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/real-name/style.scss */ "./wechat-react/components/dialogs-colorful/real-name/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/reprint-push-box/styles.scss */ "./wechat-react/components/dialogs-colorful/reprint-push-box/styles.scss");

__webpack_require__(/*! ../components/dialogs-colorful/share-success/style.scss */ "./wechat-react/components/dialogs-colorful/share-success/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/spokesperson/style.scss */ "./wechat-react/components/dialogs-colorful/spokesperson/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/symbol-list/style.scss */ "./wechat-react/components/dialogs-colorful/symbol-list/style.scss");

__webpack_require__(/*! ../components/dialogs-colorful/teacher-cup/style.scss */ "./wechat-react/components/dialogs-colorful/teacher-cup/style.scss");

__webpack_require__(/*! ../components/down-card/style.scss */ "./wechat-react/components/down-card/style.scss");

__webpack_require__(/*! ../components/empty-page/style.scss */ "./wechat-react/components/empty-page/style.scss");

__webpack_require__(/*! ../components/flag-ui/style.scss */ "./wechat-react/components/flag-ui/style.scss");

__webpack_require__(/*! ../components/fold-view/style.scss */ "./wechat-react/components/fold-view/style.scss");

__webpack_require__(/*! ../components/follow-dialog/style.scss */ "./wechat-react/components/follow-dialog/style.scss");

__webpack_require__(/*! ../components/full-width-btn/style.scss */ "./wechat-react/components/full-width-btn/style.scss");

__webpack_require__(/*! ../components/graphic-course-comment-dialog/style.scss */ "./wechat-react/components/graphic-course-comment-dialog/style.scss");

__webpack_require__(/*! ../components/group-entrance-bar/style.scss */ "./wechat-react/components/group-entrance-bar/style.scss");

__webpack_require__(/*! ../components/guest-you-like/style.scss */ "./wechat-react/components/guest-you-like/style.scss");

__webpack_require__(/*! ../components/guide-video/style.scss */ "./wechat-react/components/guide-video/style.scss");

__webpack_require__(/*! ../components/home-float-button/style.scss */ "./wechat-react/components/home-float-button/style.scss");

__webpack_require__(/*! ../components/horizontal-marquee/style.scss */ "./wechat-react/components/horizontal-marquee/style.scss");

__webpack_require__(/*! ../components/horizontal-scrolling/style.scss */ "./wechat-react/components/horizontal-scrolling/style.scss");

__webpack_require__(/*! ../components/image-viewer/style.scss */ "./wechat-react/components/image-viewer/style.scss");

__webpack_require__(/*! ../components/indep-render/style.scss */ "./wechat-react/components/indep-render/style.scss");

__webpack_require__(/*! ../components/intro-group-bar/style.scss */ "./wechat-react/components/intro-group-bar/style.scss");

__webpack_require__(/*! ../components/intro-qrCode-dialog/style.scss */ "./wechat-react/components/intro-qrCode-dialog/style.scss");

__webpack_require__(/*! ../components/invite-friends-to-listen/style.scss */ "./wechat-react/components/invite-friends-to-listen/style.scss");

__webpack_require__(/*! ../components/job-reminder/style.scss */ "./wechat-react/components/job-reminder/style.scss");

__webpack_require__(/*! ../components/learn-everyday-top-tab-bar/style.scss */ "./wechat-react/components/learn-everyday-top-tab-bar/style.scss");

__webpack_require__(/*! ../components/live-category-picker/style.scss */ "./wechat-react/components/live-category-picker/style.scss");

__webpack_require__(/*! ../components/live-follow-info/style.scss */ "./wechat-react/components/live-follow-info/style.scss");

__webpack_require__(/*! ../components/live-info/style.scss */ "./wechat-react/components/live-info/style.scss");

__webpack_require__(/*! ../components/live-profit-list/style.scss */ "./wechat-react/components/live-profit-list/style.scss");

__webpack_require__(/*! ../components/new-user-gift/style.scss */ "./wechat-react/components/new-user-gift/style.scss");

__webpack_require__(/*! ../components/novice-guide-step/live-index/style.scss */ "./wechat-react/components/novice-guide-step/live-index/style.scss");

__webpack_require__(/*! ../components/novice-guide-step/live-index-bar/style.scss */ "./wechat-react/components/novice-guide-step/live-index-bar/style.scss");

__webpack_require__(/*! ../components/novice-guide-step/live-workbench/style.scss */ "./wechat-react/components/novice-guide-step/live-workbench/style.scss");

__webpack_require__(/*! ../components/novice-guide-step/style.scss */ "./wechat-react/components/novice-guide-step/style.scss");

__webpack_require__(/*! ../components/operate-menu/style.scss */ "./wechat-react/components/operate-menu/style.scss");

__webpack_require__(/*! ../components/optimize-dialog/style.scss */ "./wechat-react/components/optimize-dialog/style.scss");

__webpack_require__(/*! ../components/phone-auth/style.scss */ "./wechat-react/components/phone-auth/style.scss");

__webpack_require__(/*! ../components/phone-code/index.scss */ "./wechat-react/components/phone-code/index.scss");

__webpack_require__(/*! ../components/picker/style/index.scss */ "./wechat-react/components/picker/style/index.scss");

__webpack_require__(/*! ../components/picker-view/style/index.scss */ "./wechat-react/components/picker-view/style/index.scss");

__webpack_require__(/*! ../components/playing-animate/style.scss */ "./wechat-react/components/playing-animate/style.scss");

__webpack_require__(/*! ../components/protocol-live-studio-page/style.scss */ "./wechat-react/components/protocol-live-studio-page/style.scss");

__webpack_require__(/*! ../components/protocol-page/style.scss */ "./wechat-react/components/protocol-page/style.scss");

__webpack_require__(/*! ../components/qfu-enter-bar/style.scss */ "./wechat-react/components/qfu-enter-bar/style.scss");

__webpack_require__(/*! ../components/qlchat-focus-ads/style.scss */ "./wechat-react/components/qlchat-focus-ads/style.scss");

__webpack_require__(/*! ../components/qrcode/style.scss */ "./wechat-react/components/qrcode/style.scss");

__webpack_require__(/*! ../components/react-mobile-datepicker/index.scss */ "./wechat-react/components/react-mobile-datepicker/index.scss");

__webpack_require__(/*! ../components/redpoint/style.scss */ "./wechat-react/components/redpoint/style.scss");

__webpack_require__(/*! ../components/riding-latern/style.scss */ "./wechat-react/components/riding-latern/style.scss");

__webpack_require__(/*! ../components/rolling-down-nav/style.scss */ "./wechat-react/components/rolling-down-nav/style.scss");

__webpack_require__(/*! ../components/scholarship-menu/style.scss */ "./wechat-react/components/scholarship-menu/style.scss");

__webpack_require__(/*! ../components/score-star/style.scss */ "./wechat-react/components/score-star/style.scss");

__webpack_require__(/*! ../components/scroll-view/style.scss */ "./wechat-react/components/scroll-view/style.scss");

__webpack_require__(/*! ../components/scrollToLoad/style.scss */ "./wechat-react/components/scrollToLoad/style.scss");

__webpack_require__(/*! ../components/search-bar/style.scss */ "./wechat-react/components/search-bar/style.scss");

__webpack_require__(/*! ../components/share-user-app/style.scss */ "./wechat-react/components/share-user-app/style.scss");

__webpack_require__(/*! ../components/short-knowledge-tip/style.scss */ "./wechat-react/components/short-knowledge-tip/style.scss");

__webpack_require__(/*! ../components/simple-control-dialog/style.scss */ "./wechat-react/components/simple-control-dialog/style.scss");

__webpack_require__(/*! ../components/sms-protocol-page/style.scss */ "./wechat-react/components/sms-protocol-page/style.scss");

__webpack_require__(/*! ../components/studio-index/components/function-menu/animation.scss */ "./wechat-react/components/studio-index/components/function-menu/animation.scss");

__webpack_require__(/*! ../components/studio-index/components/function-menu/style.scss */ "./wechat-react/components/studio-index/components/function-menu/style.scss");

__webpack_require__(/*! ../components/studio-index/style.scss */ "./wechat-react/components/studio-index/style.scss");

__webpack_require__(/*! ../components/subscription-bar/style.scss */ "./wechat-react/components/subscription-bar/style.scss");

__webpack_require__(/*! ../components/swiper/3.4.2/animate.css */ "./wechat-react/components/swiper/3.4.2/animate.css");

__webpack_require__(/*! ../components/swiper/3.4.2/swiper.min.css */ "./wechat-react/components/swiper/3.4.2/swiper.min.css");

__webpack_require__(/*! ../components/switch/style.scss */ "./wechat-react/components/switch/style.scss");

__webpack_require__(/*! ../components/tab-view/style.scss */ "./wechat-react/components/tab-view/style.scss");

__webpack_require__(/*! ../components/tabbar/styles.scss */ "./wechat-react/components/tabbar/styles.scss");

__webpack_require__(/*! ../components/thousand-live-app-download-bar/style.scss */ "./wechat-react/components/thousand-live-app-download-bar/style.scss");

__webpack_require__(/*! ../components/tips-card/style.scss */ "./wechat-react/components/tips-card/style.scss");

__webpack_require__(/*! ../components/top-optimize-bar/style.scss */ "./wechat-react/components/top-optimize-bar/style.scss");

__webpack_require__(/*! ../components/topic-assemble-content/style.scss */ "./wechat-react/components/topic-assemble-content/style.scss");

__webpack_require__(/*! ../components/topic-list-item/style.scss */ "./wechat-react/components/topic-list-item/style.scss");

__webpack_require__(/*! ../components/try-listen-share-mask/style.scss */ "./wechat-react/components/try-listen-share-mask/style.scss");

__webpack_require__(/*! ../components/try-listen-status-bar/style.scss */ "./wechat-react/components/try-listen-status-bar/style.scss");

__webpack_require__(/*! ../components/update-tips/audio-speed/style.scss */ "./wechat-react/components/update-tips/audio-speed/style.scss");

__webpack_require__(/*! ../components/verticle-marquee/style.scss */ "./wechat-react/components/verticle-marquee/style.scss");

__webpack_require__(/*! ../components/wechat-phone-binding/index.scss */ "./wechat-react/components/wechat-phone-binding/index.scss");

__webpack_require__(/*! ../components/win-course-eval/style.scss */ "./wechat-react/components/win-course-eval/style.scss");

__webpack_require__(/*! ../components/xiumi-editor-h5/style.scss */ "./wechat-react/components/xiumi-editor-h5/style.scss");

/***/ })

},[["./wechat-react/mine/index.js","runtime","vendors"]]]);
//# sourceMappingURL=mine_bundle.chunk.js.map