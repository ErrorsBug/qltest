var Handlebars = require('handlebars'),
    toast = require('toast'),
    topicTools = require('./topic-tools');

var tpls = {
        commentMsg: __inline('./tpl/comment-msg.handlebars'),
		speakMsg: __inline('./tpl/speak-msg.handlebars')

    };
require('hbardateformat');
require('hbarcompare');
require('hbarimgformat');

var recordingTimer,
    stopRecTimer,
    _audioPlayer = document.getElementById("audioPlayer");

var topicRecord = {

    init:function(){
        var that = this;
        if(that.isiOSBoolean || that.isAndroidBoolean){
            $("#save_button").remove();
		    //$(".details").remove();
		    //$("#uploadForm").remove();
            wx.ready(function(){
                wx.onVoiceRecordEnd({
                    complete: function (res) {
                        if(that.recordingSecond<58&&$(".changeRecType").length < 1&&that.isiOSBoolean){
                            clearInterval(recordingTimer);
                            that.removeClickClass();
                            // imTyping(myName,"N");
                            $(".recording_click .btn_dd").addClass("stopRec");
                            $(".rTips_1").hide();$(".rTips_2").hide();
                            $(".rTips_5").show();
                            
                            $(document).popBox({
                                boxContent:"微信自动结束录音，是否发送录音", 
                                btnType:"both",
                                confirmFunction: function(){
                                    that.autoStopRec(res.localId);
                                },
                                cancelFunction: function () { 
                                    that.resetRec();
                                }
                            });
                            
                        }else{
                            that.autoStopRec(res.localId);
                        };
                    }
                });
            });


            //长按录音方式
            document.getElementById('btnRecording').addEventListener('touchstart', function(e){
                e.preventDefault();
                that.touchStartRec(e);
            });

            document.getElementById('btnRecording').addEventListener('touchmove', function(e){
                that.touchMoveAnime(e);
            });

            document.getElementById('btnRecording').addEventListener('touchend', function(e){
                that.touchStopRec(e);
            });

            //点击录音方式
            $("#btnStartRec").click(function(e){
                that.clickStartRec(e);
            });
            $("#btnStopRec").click(function(e){
                that.clickStopRec(e);
            });
            $("#btnSentRec").click(function(e){
                that.clickSendRec(e);
            });

            //取消录音
            $(document).on("click","#btnCancelRec,.recing_bg",function(e){
                that.cancelRec(e);
            });

            //重发录音
            $(document).on("click",".btn_resend",function(e){
                that.resendRec(e);
            });


        }else{
            $(".rTips_1").text("录满60秒将自动发送");
		    $(".recType_2").hide();

            //pc录音方式
            $("#btnStartRec").click(function(){
               that.pcClickStartRec();
            });

            $("#btnStopRec").click(function(){
                that.pcClickStopRec();
            });

            $("#btnSentRec").click(function(){
                that.pcClickSendRec();
            });

        }

    },
    //参数区
    recordingSecond: 0,
    btnOffsetTop:"",
    isTouching:true,
    isRecordingStart :false,
    isRecordSent: true,
    isTouching: true,
    isClickRecStart: true,
    firstRec: true,
    frequentlyTouch: true,
    wxUploading: true,


    //点击开始录音
    clickStartRec:function(e){
        var that = this;
        if(that.isClickRecStart){
            that.isClickRecStart = false;
            that.isRecordingStart = true;
            wx.startRecord({
                success: function (res) {
                    that.stopAnime();
                    _audioPlayer.pause();
                    that.removeClickClass();
                    $(".recording_click .btn_dd").addClass("startRec");
                    $(".speakBottom").addClass("recording");
                    $(".rTips_1").show();
                    $(".recing_bg").show();
                    that.recordingSecond = 0;
                    recordingTimer = setInterval(recClock,980);
                    $("#btnCancelRec").text("取消");
                },
                fail:function(res){
                    that.isClickRecStart = true;
                    that.removeClickClass();
                    $("#btnCancelRec").text("刷新");
                }
            });

        };

    },
    //pc点击开始录音
    pcClickStartRec:function(e){
        configureMicrophone();
        FWRecorder.observeLevel();
        FWRecorder.record('audio', 'audio.wav');
    },
    //长按开始录音
    touchStartRec:function(e){
        // e.preventDefault();
        var that = this;
        if(that.firstRec){
            that.firstRec = false;
            toast.toast('如果遇到无法录音，请切换录音模式', null, 'middle');
        };
        that.btnOffsetTop = document.getElementById('speakBottom').offsetTop + $(".tab_speak")[0].offsetHeight;
        that.isTouching = true;
        if(that.isRecording && that.isRecordSent && ithat.sClickRecStart&&that.frequentlyTouch){
            that.isRecording = false;
            that.frequentlyTouch = false;
            setTimeout(function(){
                that.frequentlyTouch = true;
            },1000);
            clearTimeout(stopRecTimer);
            wx.startRecord({
                success: function (res) {
                    that.stopAnime();
                    _audioPlayer.pause();
                    if(that.isTouching){
                        that.isRecordingStart = true;
                        $("#btnRecording").addClass("on");
                        $(".speakBottom").addClass("recording");
                        $(".rTips_3").show();
                        $(".recing_bg").show();
                        that.recordingSecond = 0;
                        recordingTimer = setInterval(recClock,980);
                    }else{
                        wx.stopRecord({
                            complete:function(res){
                                that.isRecording = true;
                            }
                        });

                    };
                },
                fail:function(res){
                    that.isRecording = true;
                }
            });
        };

    },

    //点击停止录音
    clickStopRec:function(e){
        var that = this;
        that.isRecordingStart = false;
        if(that.recordingSecond < 1){
            toast.toast('录音时间太短', null, 'middle');
        }else{
            clearInterval(recordingTimer);
            wx.stopRecord({
                success: function (res) {
                    that.recLocalId = res.localId;
                    that.removeClickClass();
                    //imTyping(myName,"N");
                    $(".recording_click .btn_dd").addClass("stopRec");
                    $(".rTips_1").hide();$(".rTips_2").hide();
                    $(".rTips_5").show();
                },
                fail:function(res){
                    that.removeClickClass();
                    that.isClickRecStart = true;
                    $(".second_dd var").text("0");
                    $(".speakBottom").removeClass("recording");
                    $(".recordingTips").hide();
                    toast.toast(res.errMsg, null, 'middle');
                },
                complete:function(){
                }
            });
        };
    },

    //点击发送录音
    clickSendRec:function(e){
        var that = this;
        if(that.allowSendClick && that.recLocalId != ""){
            that.allowSendClick = false;
            setTimeout(function(){that.allowSendClick = true;},2000);
            wxUploadVoice(that.recLocalId);
        };
    },

    touchStopRec:function(e){
        var that = this;
        if($(".changeRecType").length > 0){
            that.isTouching = false;
            $(".speakBottom").removeClass("recording");
            $(".recordingTips").hide();
            $(".recing_bg").hide();
            $("#btnRecording").removeClass("on");
            $(".second_dd var").text("0");
            
            if(isRecordingStart){
                var touchY = e.changedTouches[0].clientY;
                clearInterval(recordingTimer);
                if(that.recordingSecond < 1){
                    toast.toast("录音时间太短", null, 'middle');
                    wx.stopRecord({
                        complete:function(res){
                        }
                    });
                    that.isRecording = true;
                    that.isRecordingStart = false;
                }else{
                    wx.stopRecord({
                        success: function (res) {
                            that.recLocalId = res.localId;
                            // imTyping(myName,"N");
                            if(touchY >= btnOffsetTop){
                                that.wxUploadVoice(that.recLocalId);
                            }else{
                                toast.toast("已取消发送", null, 'middle');
                            }
                        },
                        complete:function(res){
                            that.isRecording = true;
                            that.isRecordingStart = false;
                        }
                    });
                };
            }else{
                wx.stopRecord();
                that.isRecording = true;
            };
            stopRecTimer = setTimeout(function(){
                if(!that.isTouching){
                    wx.startRecord({
                        complete: function (res) {
                            wx.stopRecord({
                                complete:function(res){
                                }
                            });
                        }
                    });
                    that.isRecording = true;
                    that.isRecordingStart = false;
                    clearInterval(recordingTimer);
                    $(".second_dd var").text("0");
                };
            },500);

        };
    },

    touchMoveAnime:function(e){
        var that = this;
        if($(".changeRecType").length > 0){
            var touchY = e.changedTouches[0].clientY;
            if(touchY >= that.btnOffsetTop){
                $(".rTips_4").hide();
                $(".rTips_3").show();
            }else{
                $(".rTips_4").show();
                $(".rTips_3").hide();
            };
        };
    },

    //pc点击停止录音
    pcClickStopRec:function(e){
        if(Number($(".second_dd var").text()) < 1){
            toast.toast("录音时间太短", null, 'middle');
        }else{
            FWRecorder.stopObservingLevel();
            FWRecorder.stopRecording('audio');
        };
    },

    //pc点击发送录音
    pcClickSendRec:function(e){
        var that = this;
        that.audioObj= new File([FWRecorder.getBlob('audio')],"pcRec.wav");
        $(".loadingBox").show();
            new imgUpload($("#audioUploadBox"),
            {	
                folder:"audio",
                onComplete : function(Url) {
                    $("#btnCancelRec").text("刷新");
                    liveTalk("pcAudioUrl",Url,"",$(".second_dd var").text(),function(){
                        $(".loadingBox").hide();
                    });
                        $(".speakBottom").removeClass("recording");
                        that.removeClickClass();
                        $(".recordingTips").hide();
                        $(".recing_bg").hide();
                        $(".second_dd var").text("0");
                },
                onChange : function(){
                },
                onError : function(){
                    $("#btnCancelRec").text("刷新");
                    $(".loadingBox").hide();
                },
                uploadType:function(){
                    return 'mp3';
                }
                    
            },that.audioObj);
      
    },

    //停止播放动画  
    stopAnime:function (){
		if($(".isPlaying").length > 0){
			$(".isPlaying").removeClass("audioloading").removeClass("isPlaying");

		};
	},

    removeClickClass:function (){
		$(".recording_click .btn_dd").removeClass("stopRec").removeClass("startRec");
	},

    //计时器
    recClock:function (){
    	that.recordingSecond++;
    	if(that.recordingSecond>60){
    		that.recordingSecond =60;
		};
		$(".second_dd var").text(that.recordingSecond);
    	if(that.recordingSecond >=50){
			$(".rTips_1").hide();
			$(".rTips_2").show();
			$(".rTips_2 var").text(60-that.recordingSecond);
		};
		if(that.recordingSecond >=60 && that.isRecordingStart){
			wx.stopRecord({
			    success: function (res) {
			    	that.autoStopRec(res.localId);
			    },
			    complete:function(res){
			    },
			    fail:function(res){
			    	$(document).popBox({
						boxContent:"录音失败",
						btnType:"confirm"
					});
					that.resetRec();
			    }
			});
			
			clearInterval(recordingTimer);
		}else{
			//imTyping(myName,"Y");
		};
	},

    //微信上传
    wxUploadVoice:function(localId) {
        var that = this;
		var rSecond = that.recordingSecond;
    	that.isRecordSent = false;
    	that.insecrtTempAudio(localId,rSecond);
    	if(rSecond<1){
    		rSecond = 1;
		};
		$("#btnCancelRec").text("刷新");
		
		$(".speakBottom").removeClass("recording");
		that.removeClickClass();
    	$(".recordingTips").hide();
    	$(".recing_bg").hide();
    	
		if(rSecond >= 60&&$(".voiceBottom").length > 0&&$(".changeRecType").length < 1&&$(".recordTemp").length < 2){
    		that.isClickRecStart = true;
    		$(".loadingBox").hide();
    		
    		setTimeout(function(){
    			$("#btnStartRec").click();
    		},that.isAndroidBoolean?500:0);
       	}else if(that.isiOSBoolean){
       		//防止iOS录音后不使用扬声器播放
			wx.playVoice({localId: localId });
			wx.stopVoice({localId: localId });
       	};
       	
       	if(that.wxUploading){
       		that.wxUploading = false;
	       	setTimeout(function(){
				wx.uploadVoice({
				    localId: localId, 
				    isShowProgressTips: that.isiOSBoolean?0:0,
				    success: function (res) {
				        var serverId = res.serverId; 
				        $(".left_bubble[qlWxLoaclId='"+localId+"']").attr("qlWxSevId",res.serverId);
				        if(rSecond == 60 && $(".changeRecType").length < 1){
				        	that.isTalking = true;
				        	liveTalk("audioId",serverId,"",rSecond,function(){
				        		that.isClickRecStart = true;
				        		$(".loadingBox").hide();
							});
				        }else{
				        	liveTalk("audioId",serverId,"",rSecond,function(){
				        		that.isClickRecStart = true;
				        		$(".loadingBox").hide();
				        	});
						};
					},
				    complete:function(res){
				    	that.wxUploading = true;
				    },
				    fail:function(res){
                        toast.toast("发送失败", null, 'middle');
				    	$(".left_bubble[qlWxLoaclId='"+localId+"']").find(".btn_resend").show();
						$(".left_bubble[qlWxLoaclId='"+localId+"']").addClass('err_resend');
				    },
				    cancel:function(res){
				    	that.wxUploading = true;
				    	$(".btn_resend").last().show();
						$('.btn_resend').last().parents('dd').addClass('err_resend');
				    }
				});
			},that.isAndroidBoolean?200:200);
		}else if($(".recordTemp").length > 0){
			$(".btn_resend").last().show();
			$('.btn_resend').last().parents('dd').addClass('err_resend');
		};
		$(".second_dd var").text("0");
	},
    //插入临时消息条
    insecrtTempAudio: function (wxId,second){
        var that = this;
    	if($(".left_bubble[qlWxLoaclId='"+wxId+"']").length < 1){
	    	var contentType="";
	    	if(second<=12){
				contentType+=' recordwid1';
			}else if(second<=24){
				contentType+=' recordwid2';
			}else if(second<=36){
				contentType+=' recordwid3';
			}else if(second<=48){
				contentType+=' recordwid4';
			}else if(second<=60){
				contentType+=' recordwid5';
			}
			var itaHtml = '<dd class="left_bubble" qlWxLoaclId="'+ wxId +'"><div class="speak_time">刚刚</div><div class="head_portrait"><img src="'+myHead+'"></div><div class="speaker_name"><b>'+myName+'</b></div><div class="bubble_content recordTemp '+ contentType +'"><i class="audio_info icon_audio_play" ></i> <span class="sending">发送中...</span>  <var>'+ second +'</var></div><a class="btn_resend icon_warning" href="javascript:;"></a></dd>';
	    	
	    	$("#speakBubbles").append(itaHtml);
	    	topicTools.moveToEnd($(".speakContentBox"),true);
		};
	},

    autoStopRec:function (localId){
        var that = this;
    	that.isRecordingStart = false;
    	that.isRecording = true;
    	clearInterval(recordingTimer);
    	if(that.recordingSecond>60){
    		that.recordingSecond =60;
		};
    	$(".speakBottom").removeClass("recording");
		$(".recordingTips").hide();
		$(".recing_bg").hide();
		$("#btnRecording").removeClass("on");
		// that.removeClickClass();
		// if (that.isiOSBoolean || that.isAndroidBoolean) {
		// 	try {
		// 		noSleep.enable();
		// 	} catch (e) {
		// 	};
		// };
		// imTyping(myName,"N");
		that.wxUploadVoice(localId);
	},

    //重置录音属性
    resetRec:function (){
        $("#btnCancelRec").text("刷新");
        isClickRecStart = true;
        isRecordingStart = false;
        $(".second_dd var").text("0");
        $(".speakBottom").removeClass("recording");
        $(".recordingTips").hide();
        $(".recing_bg").hide();
        removeClickClass();
        clearInterval(recordingTimer);
        wx.stopRecord({
            complete: function (res) {}
        });
    },

    cancelRec:function(){
        var that = this;
        if($("#btnCancelRec").text() == "刷新"){
            that.resetRec();
        }else{
            $(document).popBox({
                boxContent:"取消当条声音录制？", 
                btnType:"both",
                confirmFunction: function(){
                    that.resetRec();
                }
            });
        };
    },

    resendRec:function(e){
        var that = this;
        var $resendBtn = e.currnetTarget;
        $resendBtn.hide();
        var nextId,
            nextSecond = $resendBtn.parents(".left_bubble").find("var").text();
        if($resendBtn.parents(".left_bubble").attr("qlWxSevId")){
            nextId = $resendBtn.parents(".left_bubble").attr("qlWxSevId");
            liveTalk("audioId",nextId,"",nextSecond,"");
        }else{
            nextId = $resendBtn.parents(".left_bubble").attr("qlWxLoaclId");
            that.wxUploading = true;
            if($(".btn_resend").index($resendBtn) != 0){
                $(".btn_resend").show();
                $('.btn_resend').parents('dd').addClass('err_resend');
            }
            that.wxUploadVoice(nextId);
        };
    }
	

};

module.exports = topicRecord;