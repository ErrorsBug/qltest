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
			let c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = document.cookie.length;
			}
			return decodeURIComponent(document.cookie.substring(c_start, c_end));
		};
	};
	return "";
};

return {
	init: function(){
		var QR;
		if(location.hash.match('qr')){
			QR = true
		}
		$.ajax({
			url: '/api/wechat/activity/getCommunityQr',
			dataType: 'json',
			data: {
				cId: qs.getUrlParams('id'),
				uId: localStorage.getItem('uid') || getCookie('uid')
			},
			success: function(res){
				if(res.state.code === 0){
					$('.qrcode img').attr('src',res.data.qrcodeUrl);
					if(QR){
						$('.qrcode').addClass('show');
					}
					$('.third-party-temp-container').removeClass('hide')
				}else{
					alert(res.state.msg)
				}
			}
		});
		$('.bottom-panel').click(function(){
			$('.qrcode').addClass('show');
			location.href = location.href.replace('#' + location.hash,'') + '#qr';
		});

		var qrcodeTouchTimer = 0;

		$('.qrcode').on('touchstart mousedown',function(){
			if(qrcodeTouchTimer){
				qrcodeTouchTimer = 0;
			}
			setTimeout(function(){
				qrcodeTouchTimer = 500;
			},500);
		});
		$('.qrcode').on('touchend mouseup',function(){
			if(qrcodeTouchTimer == 0){
				if(QR){
					return false;
				}
				$('.qrcode').removeClass('show');
				location.href = location.href.replace(location.hash,'#');
			}else{
				qrcodeTouchTimer = 0;
			}
		});

		this.overscroll($('.scroll-box'))
	},
	overscroll: function (el) {
        el.addEventListener('touchstart', function() {
            var top = el.scrollTop
                , totalScroll = el.scrollHeight
                , currentScroll = top + el.offsetHeight
            //If we're at the top or the bottom of the containers
            //scroll, push up or down one pixel.
            //
            //this prevents the scroll from "passing through" to
            //the body.
            if(top === 0) {
                el.scrollTop = 1
            } else if(currentScroll === totalScroll) {
                el.scrollTop = top - 1
            }
        })
        el.addEventListener('touchmove', function(evt) {
        //if the content is actually scrollable, i.e. the content is long enough
        //that scrolling can occur
        if(el.offsetHeight < el.scrollHeight)
            evt._isScroller = true
        })
    }
};