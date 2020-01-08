var envi = require('envi');
var qlCommon = require('../../comp/common-js/ql-common');

var _audioPlayer = document.getElementById("audioPlayer");
    $audioPlayer = $("#audioPlayer"),
    toast = require('toast'),
    pptBox = require('./slider');
var checkALoad;

var playMedia = {


    init:function(){
        var that = this;
        if(envi.isAndroid()){
    		that.audioType = ".amr";
		}

        if (localStorage.getItem('lastVisit')) {
            that.lastVisit = JSON.parse(localStorage['lastVisit']);
        }

        $(document).on("click",".recordingMsg",function(e){
            if(e.target.className !="block"){
                that.playAudio($(this));
            };
        });

        _audioPlayer.loop = false;

        try {

            //音频停止时处理
            _audioPlayer.addEventListener('ended',function(){
                that.audioEnded();
            }, false);
            //音频暂停时处理
            _audioPlayer.addEventListener('pause',function(){
                that.audioPause();
            }, false);
            //音频可以播放时处理
            _audioPlayer.addEventListener('canplaythrough',function(){
                that.canplaythrough();
            }, false);
            //音频中断时处理
            _audioPlayer.addEventListener('stalled', function(e){
                console.log("stalled");
                that.audioStalled(e);
            }, false);
            //音频错误时处理
            _audioPlayer.addEventListener('error', function(e){
                console.log("error");
                that.audioError(e);
            }, false);
            _audioPlayer.addEventListener('suspend',function(){
                console.log("suspend");
            }, false);
            _audioPlayer.addEventListener('abort',function(){
                console.log("abort");
            }, false);

        } catch (error) {

        }

        $('#audioPlayer').on('loadedmetadata', function (e) {
            that.loadedmetadata(e);
        })

        $(document).on('click', '.audio-bar-area .block', function (e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        })

        $(document).on('mousedown', '.audio-bar-area .block', function (e) {
            e.stopPropagation();
            that.mouseDrag(e);
        });

        $(document).on('touchstart', '.audio-bar-area .block', function (e) {
            e.stopPropagation();
            that.touchDrag(e);
        });
        $(document).on('touchstart', 'body', function (e) {
            if(that.firstTouch && $audioPlayer.attr("src") && $audioPlayer.attr("src") != ""){
                that.firstTouch = false;
                 console.log("firstTouch",$audioPlayer.attr("src"));
                _audioPlayer.play();
            }
        });


        //记录已播放
        if(localStorage.getItem('recordReaded')){
            that.recordReaded=JSON.parse(localStorage['recordReaded']);
        };

        $("#speakBubbles .recordingMsg").each(function(){
            that.imReaded($(this).parents("dd").attr("attr-id"));
        });

        //是否自动播放
        if(localStorage.getItem('isAutoPlay')){
            if(localStorage.getItem('isAutoPlay') == "false"){
                that.isAutoPlay = false;
            };
        }

        if(that.powerEntity.allowSpeak){
            that.isAutoPlay = false;
        }

        if(!that.isAutoPlay){
            $("#btnAutoPlay").removeClass("swon");
        }



    },

    //参数区
    audioTempSrc:"", //音频播放路径
    isAutoPlay: true, //是否自动播放
	audioType:".aac", //播放格式
    newCurrentTime:0, //
    isWaitTime:0,
    clearSrc:false,
    recordReaded:{},
    lastVisit:{},
    isBarDragging:false,
    firstTouch:true,
    //播放音频
    playAudio:function (isme){
        var that = this;
		var self = isme;
		clearSrc = false;

		// if((isAndroidBoolean||isiOSBoolean)&& pageRandomNum != localStorage.getItem("pageRandomNum")){
		// 		return false;
		// };//尝试禁止多标签页播放

		self.addClass("isReaded");
		if(checkALoad){
			clearInterval(checkALoad);
		};
		that.rememberImReaded(self.parents("dd").attr("attr-id"));
		that.rememberLastReaded(self.parents("dd").attr("attr-time"),self.parents("dd").attr("attr-id"));
		_audioPlayer.pause();
		if(!self.hasClass("isPlaying")){
			that.stopAnime();
			self.addClass("isPlaying");
			that.audioTempSrc = self.find(".audio-info").attr("attr-src");
			if(!/(\.mp3)/.test(that.audioTempSrc)){
				$audioPlayer.attr("preload","auto");
                var ats = that.audioTempSrc;
				that.audioTempSrc = ats.replace(/(\.amr)|(\.aac)/gi,"")+that.audioType;
			}else{
				$audioPlayer.attr("preload","meta");
			}
			that.audioCurrentSrc = _audioPlayer.currentSrc;
			_audioPlayer.pause();
			if (that.audioCurrentSrc.replace(/(\?.*)/,"") != that.audioTempSrc) {

				if(envi.isIOS()&&/(\.mp3)/.test(that.audioTempSrc)){
					$audioPlayer.attr("src", that.audioTempSrc+"?again="+(new Date()).getTime());
				}else{
					$audioPlayer.attr("src", that.audioTempSrc);
				}
			}
			self.addClass("isPlaying");
			_audioPlayer.volume=1;
			_audioPlayer.play();

			if($(".pptMode").length >0&&$("#ppt-slider [data-fileid='"+ self.parents("dd").data("fileid") +"']").length>0){
				var pptIndex = $("#ppt-slider [data-fileid='"+ self.parents("dd").data("fileid") +"']").index();
				pptBox.jumpToSlide(pptIndex);
			};

			var btnHeight=0;
			var pageHeight = $(".speakContentBox")[0].offsetHeight;
			var boxScrollTop = $(".speakContentBox")[0].scrollTop;
			if(self.parents("dd")[0].offsetTop>pageHeight+boxScrollTop-100){
				$(".speakContentBox").scrollTop(boxScrollTop + pageHeight/2);
			};

		}else{
			clearSrc = true;
			_audioPlayer.pause();
			that.stopAnime();
		};
	},

    //停止播放动画
    stopAnime:function(){
		if($(".isPlaying").length > 0){
			$(".isPlaying").removeClass("audioloading").removeClass("isPlaying");
            $audioPlayer.removeAttr("src");
		};
	},

    audioEnded:function(){
        var that = this;
        var self = $(".isPlaying");
        self.removeClass("audioloading");
        clearInterval(checkALoad);
        var playIndex = $("#speakBubbles .recordingMsg").index(self);
        if(playIndex < $("#speakBubbles .recordingMsg").length - 1){
            that.playAudio($("#speakBubbles .recordingMsg").eq(playIndex+1));
        }else{
            that.stopAnime();
        };
    },

    audioPause:function(){
        var that = this;
        var self = $(".isPlaying");
        if(!$audioPlayer.hasClass("isSpecialPause")){
            clearInterval(checkALoad);
        };
    },

    canplaythrough:function(){
        var that = this;
        $(".isPlaying").removeClass("audioloading");
        if(checkALoad){
            clearInterval(checkALoad);
        }
        checkALoad = setInterval(function(){
            $audioPlayer.removeClass("isSpecialPause");
            if(that.newCurrentTime == _audioPlayer.currentTime){
                $(".isPlaying").addClass("audioloading");
                that.isWaitTime++;
                if(that.isWaitTime > 2 && envi.isIOS()){
                    that.isWaitTime = 0;
                    $audioPlayer.addClass("isSpecialPause");
                    _audioPlayer.pause();
                    _audioPlayer.currentTime = _audioPlayer.currentTime+0.1;
                    _audioPlayer.play();

                };
            }else{
                that.isWaitTime = 0;
                $(".isPlaying").removeClass("audioloading");
            };
            that.newCurrentTime = _audioPlayer.currentTime;
        },1100);

    },

    audioStalled:function(){

    },

    audioError:function(e){
        var that = this;
        var errorCodeMsg;
        var errorCode = _audioPlayer.error.code;
        switch(errorCode){
            case 1: errorCodeMsg = "1: MEDIA_ERR_ABORTED - 取回过程被用户中止"; break;
            case 2: errorCodeMsg = "2: MEDIA_ERR_NETWORK - 当下载时发生错误"; break;
            case 3: errorCodeMsg = "3: MEDIA_ERR_DECODE - 当解码时发生错误"; break;
            case 4: errorCodeMsg = "4: MEDIA_ERR_SRC_NOT_SUPPORTED - 不支持音频/视频"; break;
        }
        console.log("error : "+  errorCodeMsg,$audioPlayer.attr("src"));

        if (!that.clearSrc) {


            /*音频播放失败，先尝试使用http, 不行再用qiniu, 不行再用mp3,不行重试，再次失败则提交错误报告*/
			if(/(\.amr)/.test(that.audioTempSrc)){
				that.audioTempSrc = that.audioTempSrc.replace("\.amr","\.aac");
				$audioPlayer.attr("src",that.audioTempSrc);
				_audioPlayer.play();
			} else if(/(https\:)/.test(that.audioTempSrc) && /(amr|aac)/.test(that.audioTempSrc)){
				that.audioTempSrc = that.audioTempSrc.replace("https:","http:");
				$audioPlayer.attr("src",that.audioTempSrc);
				_audioPlayer.play();
			} else if (/(http\:)/.test(that.audioTempSrc) && /(amr|aac)/.test(that.audioTempSrc) && (that.audioTempSrc || '').indexOf('qiniu.qianliaowang.com') < 0) {
                that.audioTempSrc = that.audioTempSrc.replace("media.qlchat.com", "qiniu.qianliaowang.com");
				$audioPlayer.attr("src",that.audioTempSrc);
				_audioPlayer.play();
            } else if(/(http\:)/.test(that.audioTempSrc) && /(amr|aac)/.test(that.audioTempSrc)){
				that.audioTempSrc = that.audioTempSrc.replace("http:","https:");
				that.audioTempSrc = that.audioTempSrc.replace(/(media\.qlchat\.com)|(qiniu\.qianliaowang\.com)/, "audio.qianliaowang.com").replace(/\.(amr|aac)/,"\.mp3");
				$audioPlayer.attr("src",that.audioTempSrc);
				_audioPlayer.play();
			}else if(/(https\:)/.test(that.audioTempSrc) && /(\.mp3)/.test(that.audioTempSrc)){
				that.audioTempSrc = that.audioTempSrc.replace("https:","http:");
				$audioPlayer.attr("src",that.audioTempSrc);
				_audioPlayer.play();
			}else if(!/(again)/.test(that.audioTempSrc)){
				that.audioTempSrc = that.audioTempSrc+"?again="+(new Date()).getTime();
				$audioPlayer.attr("src",that.audioTempSrc);
				_audioPlayer.play();
			}else{
				toast.toast('音频加载失败，请稍后重试', null, 'middle');
				that.stopAnime();
				that.reportAudioError(e,msg,errorCode);
			}

        };

    },
    reportAudioError:function (e,msg,errorCode) {
		var _url=e.currentTarget.currentSrc ;
		var _status=errorCode;
		$.ajax({
			type:'get',
			url: '//stat.corp.qlchat.com/media.gif',
			data:{
				url: _url,
				status: _status,
				playType:playAudioType,
				errorCodeMsg:msg,
			},
			success: function (result) { return;},
			error: function (result) { return;}
		})
	},
    loadedmetadata:function(e){
        var that = this;
        var $this = $(e.currentTarget);
        var audio = $this[0];
        var total = Number(audio.duration);

        // get the jquery element
        var $audioBarArea = $('.isPlaying .audio-bar-area');
        var $backBar = $audioBarArea.find(".before");
        var $block = $audioBarArea.find('.block');
        var $frontBar = $audioBarArea.find('.front-bar');

        // get the width to calculate
        var blockLeft = $block.css('left');
            blockLeft = Number(blockLeft.replace('px', ''));
        var backWidth = Number($backBar.width());

        $this.on('timeupdate', function () {
            if (that.isBarDragging) {
                return;
            }
            var total = Number(audio.duration);
            var current = Number(audio.currentTime);
            // the percent of audio playing
            percent = (current / total).toFixed(2);

            var blockX = (backWidth * percent) ;


            if (blockX > backWidth) {
                blockX = backWidth;
            }

            percent = blockX / backWidth;

            // change the audio bar and slider
            $block.css('left', blockX + 'px');
            $frontBar.css('width', blockX + 'px');
        });

        // when change audio or this audio ended reset the audio bar
        $this.on('ended, emptied', function () {
            // unbind the timeupdate event and reset audio bar
            $this.off('timeupdate');
            $block.attr('style', '');
            $frontBar.attr('style', '');
        });

    },

    mouseDrag:function(event){
        var that = this;
        var $this = $(event.currentTarget);

        // compare the audio src and current src to see if audio is paused
        var thisAudioTempSrc = $this.parents('.bubble-content').find(".audio-info").attr("attr-src").replace(/.*\//,"").replace(/\..*/,"");
        var audioCurrentSrc = _audioPlayer.currentSrc.replace(/.*\//,"").replace(/\..*/,"");

        var isPause = thisAudioTempSrc === audioCurrentSrc;
        var isPlaying = $this.parents('.bubble-content').hasClass('isPlaying');

        // if the bubble is not playing or pause, return
        if (!(isPlaying||isPause))
        {
            return;
        }

        that.isBarDragging = true;

        // get the jquery element
        var $audioBarArea = $this.parents('.audio-bar-area');
        var $backBar = $audioBarArea.find(".before");
        var $block = $this;
        var $frontBar = $audioBarArea.find('.front-bar');
        // get the display second and the real second
        var totalsecond = Number($block.data('second'))
        var audioSecond = Number(_audioPlayer.duration);
        var currentSecond=Number($block.data('current').replace('″', ''));

        // get the position when start touch
        var startX
        if (envi.isAndroid() || envi.isIOS())
        {
            startX = event.originalEvent.touches[0].pageX;
        }
        else
        {
            startX = event.originalEvent.pageX;
        }

        var theLeft = 0;
        var blockLeft = Number($block.css('left').replace('px', ''));
        var backWidth = Number($backBar.width());

        $block.addClass('active');

        // the percent of position now
        var percent;

        $(document).on('mousemove', moveHandle);

        function moveHandle(e) {
            e.stopPropagation();
            var currentX;
            if (envi.isAndroid() || envi.isIOS() )
            {
                currentX = e.touches[0].pageX;
            }
            else {
                currentX = e.pageX;
            }
            var distance = currentX - startX;

            var newPosition = blockLeft + distance;

            // if the new position in range, move it
            if (newPosition < theLeft) {
                newPosition = theLeft;
            }
            if (newPosition > backWidth) {
                newPosition = backWidth;
            }
            // get the new second
            percent = (newPosition) / (backWidth);
            var newSecond = (totalsecond * percent).toFixed(0);

            // move the block and front-bar
            $block.css('left', newPosition + 'px');
            $frontBar.css('width', newPosition + 'px');

            // if the second in range, change it
            if (newSecond >= 0 && newSecond <= totalsecond) {
                $block.attr('data-current', qlCommon.convertSecond(newSecond));
            };
        }


        $(document).on('mouseup', endHandle);

        function endHandle(e) {
            e.stopPropagation();
            // hide the time modal and unbind the touchmove event
            $block.removeClass('active');
            $(document).off('mousemove');


            // change the second to play
            var currentSecond = Number((audioSecond * percent).toFixed(3));

            if (!isNaN(currentSecond)) {
                _audioPlayer.currentTime = currentSecond;
            }


            that.isBarDragging = false;

            $(document).off('mouseup')

            return false;
        }

        return false;

    },

    touchDrag :function(event){
        var that = this;
        var $this = $(event.currentTarget);

        // compare the audio src and current src to see if audio is paused
        var thisAudioTempSrc = $this.parents('.bubble-content').find(".audio-info").attr("attr-src").replace(/.*\//,"").replace(/\..*/,"");
        var audioCurrentSrc = _audioPlayer.currentSrc.replace(/.*\//,"").replace(/\..*/,"");


        var isPause = thisAudioTempSrc === audioCurrentSrc;
        var isPlaying = $this.parents('.bubble-content').hasClass('isPlaying');

        // if the bubble is not playing or pause, return
        if (!(isPlaying||isPause))
        {
            return;
        }

        that.isBarDragging = true;

        // get the jquery element
        var $audioBarArea = $this.parents('.audio-bar-area');
        var $backBar = $audioBarArea.find(".before");
        var $block = $this;
        var $frontBar = $audioBarArea.find('.front-bar');

        // get the display second and the real second
        var totalsecond = Number($block.data('second'))
        var audioSecond = Number(_audioPlayer.duration);
        var currentSecond=Number($block.data('current').replace('″', ''));

        // get the position when start touch
        var startX
        if (envi.isAndroid()  || envi.isIOS() )
        {
            startX = event.originalEvent.touches[0].pageX;
        }
        else
        {
            startX = event.originalEvent.pageX;
        }

        var theLeft = 0;
        var blockLeft = Number($block.css('left').replace('px', ''));
        var backWidth = Number($backBar.width());

        $block.addClass('active');

        // the percent of position now
        var percent;

        $(document).on('touchmove', moveHandle);

        function moveHandle(e) {
            e.stopPropagation();
            var currentX;
            if (envi.isAndroid()  || envi.isIOS() )
            {
                currentX = e.touches[0].pageX;
            }
            else {
                currentX = e.pageX;
            }
            var distance = currentX - startX;

            var newPosition = blockLeft + distance;
            // if the new position in range, move it
            if (newPosition < theLeft) {
                newPosition = theLeft;
            }
            if (newPosition > backWidth) {
                newPosition = backWidth;
            }
            // get the new second
            percent = (newPosition) / (backWidth);
            var newSecond = (totalsecond * percent).toFixed(0);

            // move the block and front-bar
            $block.css('left', newPosition + 'px');
            $frontBar.css('width', newPosition+ 'px');

            // if the second in range, change it
            if (newSecond >= 0 && newSecond <= totalsecond) {
                $block.attr('data-current', qlCommon.convertSecond(newSecond));
            };
        }


        $(document).on('touchend', endHandle);

        function endHandle(e) {
            e.stopPropagation();
            // hide the time modal and unbind the touchmove event
            $block.removeClass('active');
            $(document).off('touchmove');


            // change the second to play
            var currentSecond = Number((audioSecond * percent).toFixed(3));

            if (!isNaN(currentSecond)) {
                _audioPlayer.currentTime = currentSecond;
            }


            that.isBarDragging = false;

            $(document).off('touchend')

            return false;
        }

        return false;



    },

    imReaded:function (id){
        var that = this;
		if(that.recordReaded[id]){
			$(".left-bubble[attr-id='"+ id +"']").find(".recordingMsg").addClass("isReaded");
		};
	},

    rememberImReaded:function (id){
        var that = this;
		if(!that.recordReaded[id]){
			that.recordReaded[id] = new Date().getTime();
			localStorage.setItem('recordReaded',JSON.stringify(that.recordReaded));
		};
	},

    rememberLastReaded:function (time, id) {
        var that = this;
        var tempVisit = {};
        tempVisit['speakTime'] = time;
        tempVisit['speakId'] = id;
        that.lastVisit[that.topicPo.id] = tempVisit;
        localStorage.setItem('lastVisit', JSON.stringify(that.lastVisit));
    }



};

module.exports = playMedia;
