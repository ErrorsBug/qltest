/**
 * 描述：TODO 推送类
 * 构建组：app-push
 * 作者：zhongjinyou
 * 邮箱: jinyou.zhong@qlchat.com
 * 日期:Dec 26, 2015-10:07:22 PM
 * 版权：千聊 公司版权所有
 *
 * @param {Object} data {dir:"论坛：FROUM/直播：LIVE",id:论坛ID/直播ID,msgType:消息类型:public/private,reqSleep:请求间隔时间(默认3秒),funcSleep:回调方法间隔时间（默认为0）,callback:回调函数}
 */
var model = require('model');

var PushMessageListener = {
	wsUrl: window.__WSURL__ || 'wss://ws-h5.qianliao.cn/websocket',
	onLineNum: '0',
	idx: 0,
	prevTime: '',
	init: function (data, sid, channelId) {
		var _self = this;
		this.callback = data.callback;
		this.callEver = data.callEver;
		this.reqSleep = 3000;
		this.funcSleep = 0;
		this.topicId = data.id;
		this.msgType = data.msgType;
		this.dir = data.dir;
		this.errTime = 0;
		this.sid = sid;
		if (data.reqSleep) {
			this.reqSleep = data.reqSleep;
		}
		if (data.funcSleep) {
			this.funcSleep = data.funcSleep;
		}
		this.refresh = function () {
			console.log('卡住了');
			// $(document).popBox({
			// 	boxType:"", // 提示框类型 “success,wrong或空”
			// 	boxContent:"卡住了，刷新一下~",  // 提示框内容
			// 	btnType:"confirm",  // 按钮类型 “confirm,cancel,both或空”
			// 	confirmName:"确定",//需要修改时使用
			// 	cancelName:"取消",//需要修改时使用
			// 	textAlign:"center",//需要修改时使用，默认center，可传left；
			// 	confirmFunction: function(){if(/\?/.test(window.location.href))window.location.href = (window.location.href).replace(/(\&?)(restime\=)(\w+)/,'')+'&restime='+new Date().getTime();else window.location.href = (window.location.href).replace(/(\&?)(restime\=)(\w+)/,'')+'?restime='+new Date().getTime();}, //需要修改时使用， 提交后执行函数
			// 	cancelFunction:function(){}//需要修改时使用，
			// });
		};
		this.receive = function () {
			var baseUrl = '';

			if (window.location.origin.indexOf('m.qlchat.com') > -1) {
				baseUrl = 'https://rs.qlchat.com:8080';
			} else if (/(localhost)/gi.test(window.location.origin)) {
				baseUrl = 'http://m.dev1.qlchat.com';
			}

			$.ajax({
				type: 'GET',
				url: baseUrl + '/push/receive.htm',
				data: {sid: _self.sid, idx: _self.idx, prevTime: _self.prevTime, dir: _self.dir, id: _self.topicId, msgType: _self.msgType, onLineNum: PushMessageListener.onLineNum },
				success: function (result) {
					if (result != '') {
						var data = result;
						PushMessageListener.onLineNum = data.onLineNum;
						PushMessageListener.commentNum = data.commentNum;
						if (data.status == '200') {
							_self.idx = data.idx;
							_self.prevTime = data.prevTime;
							var execSleep = 0;
							if (_self.funcSleep > 0) {
								for (var i = 0; i < data.list.length; i++) {
									execSleep = execSleep + _self.funcSleep;
									var dataObj = eval('(' + data.list[i] + ')');
									setTimeout(function () {
										_self.callback(dataObj);
									}, execSleep);
								}
							} else {
								for (var i = 0; i < data.list.length; i++) {
									var dataObj = eval('(' + data.list[i] + ')');
									_self.callback(dataObj);
								}
							}
						}
						if (channelId == '' || channelId == '0' || channelId == 'null')
							_self.callEver();
					}
					_self.timer = setTimeout(_self.receive, _self.reqSleep);
				}, error: function (XMLHttpRequest, textStatus, errorThrown) {
					if (textStatus == 'timeout' || textStatus == 'error') {
						clearTimeout(_self.timer);
						_self.timer = setTimeout(_self.receive, _self.reqSleep);
					}
				}, cache: false, timeout: 5000,
			});
		};
		this.openSocket = function () {
			_self.websocket = new WebSocket(_self.wsUrl + '?_time=' + new Date().getTime());

			// 连接错误的回调方法
			_self.websocket.onerror = function (event) {
				// console.log(event);
			};

			// 连接关闭的回调方法
			_self.websocket.onclose = function (event) {
				// console.log(event);
				_self.errTime += 1;
				if (_self.errTime > 3) {
					_self.pushType = 'SWITCH_HTTP';
					_self.receive();
					return;
				}

				if (_self.pushType != 'SWITCH_HTTP') {
					setTimeout(function () {
						_self.openSocket();
					}, 1000);
				}
			};
			// 连接成功建立的回调方法
			_self.websocket.onopen = function (event) {
				// console.log(event);
				_self.errTime = 0;
				_self.websocket.send(JSON.stringify({ sid: _self.sid, topicId: _self.topicId, prevTime: _self.prevTime, idx: _self.idx }));
			};
			// 接收到消息的回调方法
			_self.websocket.onmessage = function (event) {
				//				console.log(event);
				var data = eval('(' + event.data + ')');
				PushMessageListener.onLineNum = data.onLineNum;
				PushMessageListener.commentNum = data.commentNum;
				if (channelId == '' || channelId == '0' || channelId == 'null')
					_self.callEver();


				if (data.status == '200') {
					for (var i = 0; i < data.list.length; i++) {
						var dataObj = eval('(' + data.list[i] + ')');
						if (dataObj.dateStr != _self.prevTime) {
							_self.prevTime = dataObj.dateStr;
							_self.idx = 1;
						} else {
							_self.idx++;
						}
						_self.callback(dataObj);
					}
				} else {
					_self.pushType = 'SWITCH_HTTP';
					_self.receive();
				}
			};
			// 退出页面前关闭socket连接
			window.onbeforeunload = function () {
				_self.websocket.close();
			};
		};
		try {
			_self.openSocket();
		} catch (e) {
			_self.receive();
		}
	},
};

module.exports = PushMessageListener;
