/**
 * Created by dylanssg on 2017/9/20.
 */
require('zepto');
var envi = require('envi');
var qs = require('urlutils');

var getCookie = (c_name) => {
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
	}
	return "";
};

return {
	init: function(){
		$.ajax({
			url: '/api/wechat/activity/getCommunityQr',
			dataType: 'json',
			data: {
				cId: qs.getUrlParams('id'),
				uId: localStorage.getItem('uid') || getCookie('uid')
			},
			success: function(res){
				if(res.state.code === 0){
					$('img').attr('src',res.data.qrcodeUrl);
				}else{
					alert(res.state.msg)
				}
			}
		});
	}
};