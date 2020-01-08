var Handlebars = require('handlebars'),
	model = require('model'),
	conf = require('../conf'),
	playMedia = require('./play-media'),
	topicTools = require('./topic-tools'),
	qlCommon = require('../../comp/common-js/ql-common');

var tpls = {
        commentMsg: __inline('./tpl/comment-msg.handlebars'),
		speakMsg: __inline('./tpl/speak-msg.handlebars'),
		bulletMsg: __inline('./tpl/bullet-screens.handlebars')

    };
require('hbardateformat');
require('hbarcompare');
require('hbarimgformat');
var qlCommon = require('../../comp/common-js/ql-common');


var $BubblesTemp  = $('#BubblesTemp');
var $speakBubbles  = $('#speakBubbles');
var commentDl = "#commentDl";
var _audioPlayer = document.getElementById("audioPlayer");
    $audioPlayer = $("#audioPlayer");

var topicMsgHandle = {

	userHeadHandle:function(imgUrl){
		var uhhUrl = "";
		if(/(img\.qlchat\.com)/.test(imgUrl)){
			uhhUrl =imgUrl.replace(/@.*/,"")+"@64h_64w_1e_1c_2o";
		}else if(/(wx\.qlogo\.cn\/mmopen)/.test(imgUrl)){
			uhhUrl =imgUrl.replace(/(\/(0|132|64|96)$)/,"/64");
		}else{
			uhhUrl = "https://img.qlchat.com/qlLive/liveCommon/normalLogo.png";
		}
		return uhhUrl;
	},
	userRole:function(id){
		var that = this;
		var tempRole="嘉宾";
		if (that.liveTopicInviteJsons && that.liveTopicInviteJsons.length > 0) {
			var tempRole = that.liveTopicInviteJsons.filter(function(inviteItem) {return inviteItem.userId == id});
			return tempRole.length > 0 ? (tempRole[0].title || "") : "嘉宾";
		}else {
			return tempRole;
		}
		
	},
	addLink:function (content){
		var linkReg = /((http|https):\/\/)?(\w|\/|\.|-|:|\%)*(\.(com|cn|html|htm|net|org))+(\w|\/|\.|-|:|\%)*(\?+(\w)*.+(\w|\%)*(&+(\w)*.+(\w|\%)*)?)?/gi;
		var reContent = content,
			hasHttp = "",
			linkArr;
		
		if(linkReg.test(reContent)){
			linkArr = reContent.match(linkReg);
			for(ia1 in linkArr){
				reContent = reContent.replace(linkArr[ia1],"@lA"+ia1+"@");
			};
			for(ia2 in linkArr){
				if(/(http|https|ftp)/.test(linkArr[ia2])){
					hasHttp="";
				}else{
					hasHttp="http://";
				};
				reContent = reContent.replace("@lA"+ia2+"@","<a href='"+hasHttp+linkArr[ia2]+"' >"+linkArr[ia2]+"</a>");
			};
		};
		return reContent;
	},
    //评论消息处理
    commentHandle:function(data,isPrepend){
		var that = this;
        $("#loadNone").removeClass("none-record").hide();
        var ishas = $(".commentContentBox [attr-id='"+data.id+"']").length < 1;
        if(ishas){
			var createByImgUrl = this.userHeadHandle(data.createByHeadImgUrl);
            data.createByHeadImgUrl = createByImgUrl;

            var tplsData = {
                data:data,
                topicPo: this.topicPo,
                powerEntity: this.powerEntity,
                isShowMgr:(this.powerEntity.allowDelSpeak || data.createBy == that.userPo.id)
            }
            
			
			if(isPrepend){
				if($("#commentDl").children().length > 0) {
					if(Number($("#commentDl .comment-dd").eq(0).attr("attr-time")) < Number(data.createTime)) {
						$(commentDl).prepend(tpls.commentMsg(tplsData));
					}
				}else {
					$(commentDl).prepend(tpls.commentMsg(tplsData));
				}
                
			}else{
				$(commentDl).append(tpls.commentMsg(tplsData));
			};
		};
    },

	//发言消息处理
	speakHandle:function(data,isPrepend){
		var that = this;
		if(data.id == " "||$(".speakContentBox [attr-id='"+data.id+"']").length < 1){
			var isL = "left-bubble",
				speakTime = "",
				bubbleContent=data.content,
				isMgr = (that.powerEntity.allowDelSpeak || data.createBy == that.userPo.id),
				createTime = data.createTime.time? data.createTime.time:data.createTime,
				speakCreateByHeadImgUrl = this.userHeadHandle(data.speakCreateByHeadImgUrl),
				guestrole = that.userRole(data.createBy);
				createTime = Number(createTime),
				isShowRe = false;

			var tplsData = {
                data:data,
                topicPo: that.topicPo,
                powerEntity: that.powerEntity,
				topicExtendPo:that.topicExtendPo,
				speakTime:speakTime,
				bubbleContent:bubbleContent,
				createTime:createTime,
				isL:isL,
				isMgr:isMgr,
				speakCreateByHeadImgUrl:speakCreateByHeadImgUrl,
				guestrole:guestrole
            }
			
			var prependOrAppend = function(){
				if(isPrepend){
					$("#BubblesTemp").prepend(tpls.speakMsg(tplsData));
				}else{
					if(data.type == "audio" && data.mediaId != "" && $(".left-bubble[qlWxSevId='"+data.mediaId+"']").length > 0){
						$(".left-bubble[qlWxSevId='"+data.mediaId+"']").after(tpls.speakMsg(tplsData));
						$(".left-bubble[qlWxSevId='"+data.mediaId+"']").remove();
					}else{
						if(that.liveFakeStatus == "ended"){
							$("#BubblesTemp").append(tpls.speakMsg(tplsData));
						}else{
							$("#speakBubbles").append(tpls.speakMsg(tplsData));
						};
					};
					if(data.type == "audio"){
						that.newAudioPlay();
					};
					topicTools.moveToEnd($(".speakContentBox"),false);
				};

			}
			

			switch(data.type){
				case "start" : 
					if($(".qlTimerShow").length<1){
						if( that.currentTimeMillis < that.topicPo.startTime && that.topicPo.status != "ended" ){
							$(".qlStartDate").text("本次直播将于"+that.topicPo.startTimeStamp+"开始");
							clearInterval(that.qlStartTimer);
							that.timerSecond = that.topicPo.startTime - that.currentTimeMillis;
							that.qlStartTimer = setInterval(function(){
								that.timerSecond = that.timerSecond - 1000;
								var qlDays = parseInt(that.timerSecond/(1000*60*60*24));
								var qlHours = parseInt(that.timerSecond/(1000*60*60)-qlDays*24);
								var qlMinutes= parseInt(that.timerSecond/(1000*60)-qlDays*24*60-qlHours*60);
								var qlSeconds= parseInt(that.timerSecond/1000-qlDays*24*60*60-qlHours*60*60-qlMinutes*60);
								$(".qlDays").text(qlCommon.checkTime(qlDays));
								$(".qlHours").text(qlCommon.checkTime(qlHours));
								$(".qlMinutes").text(qlCommon.checkTime(qlMinutes));
								$(".qlSeconds").text(qlCommon.checkTime(qlSeconds));
								if(that.timerSecond <= 0){
									clearInterval(that.qlStartTimer);
									$(".qlStartDate").text("本次直播于"+that.topicPo.startTimeStamp+"开始").css('margin-bottom','1rem');
									$(".ql-timer, .follow-live-QRCode").remove();
									if($(".ql-remind-b").length > 0){
										$(".ql-remind-b").remove();
									}
									if($(".ql-start-remind").length > 0){
										$(".ql-start-remind").remove();
									}
								}
							},1000);
						}else{
							$(".ql-timer, .follow-live-QRCode").remove();
							if($(".ql-remind-b").length > 0){
								$(".ql-remind-b").remove();
							}
							if($(".ql-start-remind").length > 0){
								$(".ql-start-remind").remove();
							}
							$(".qlStartDate").text("本次直播于"+that.topicPo.startTimeStamp+"开始").css('margin-bottom','1rem');
						}
						setTimeout(function(){
							$(".ql-start-box").addClass("qlTimerShow");
						},500);
						
						if($(".setPasswordTips").length>0){
							$(".setPasswordTips").show();
						}
						if($(".setGuestTips").length>0){
							$(".setGuestTips").show();
						}
					}
					break;
				case "end" : 
					if($(".end-tips").length < 1){
						prependOrAppend();
					};
					break;
				case "redpacket":
					data.rewardMoney = (data.rewardMoney/100).toFixed(2);
					// tplsData.data = data;
					prependOrAppend();
					break;
				case "prompt" : 
					prependOrAppend();
					break;
				case "whisper" : 
					isL="right-bubble";
					var answerRole = that.userRole(data.createBy);
					data.isL = isL;
					data.answerRole = answerRole;
					prependOrAppend();
					break;
				default :
					var contentType ='';
					var isGif = false;
					var $iHasTime;
					var isVideo = false;
					var isComment = (data.commentId != ""&& data.commentId != null);
					if($(".scrollContentBox .hasTime").length > 0){
						if($("#BubblesTemp .hasTime").length>0){
							$iHasTime = $("#BubblesTemp .hasTime");
						}else{
							$iHasTime = $("#speakBubbles .hasTime");
						}
						if(isPrepend){
							if(Number($iHasTime.eq(0).attr("attr-time"))- Number(data.createTime) >= 120000 ){
								isL += " hasTime";
								speakTime = data.createTimeView;
							}
						}else{
							if(Number(data.createTime) - Number($iHasTime.last().attr("attr-time")) >= 120000 ){
								isL += " hasTime";
								speakTime = data.createTimeView;
							}
						}
					}else{
						isL += " hasTime";
						speakTime = data.createTimeView;
					}
					if(speakTime != ""){
						var nowDateTemp = new Date;
							nowDateTemp = Date.parse(nowDateTemp.getFullYear()+"-"+ qlCommon.checkTime(nowDateTemp.getMonth()+1)+"-"+qlCommon.checkTime(nowDateTemp.getDate()));
						if(data.createTime >= Number(nowDateTemp)){
							speakTime = speakTime.substr(6,11);
						}
					}
					
					

					switch (data.type){
						case "text": 
							if(data.content !=""){
								bubbleContent = bubbleContent.replace(/ /g,"\&nbsp\;");
								bubbleContent = that.addLink(bubbleContent);
								bubbleContent = bubbleContent.replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, "<br>");
							};
							if(data.commentId&&data.commentId != ""){
								isShowRe= true;
							}
							break;
						case "image":
								isGif = /\.gif$/.test(data.content);
								bubbleContent = data.content.replace(/@.*/,"") +'@240h_1e_1c_2o';
							break;
						case "audio": 
										contentType = 'recordingMsg';
										var recordsecond=data.second;
										if(recordsecond<=12){
											contentType+=' recordwid1';
										}else if(recordsecond<=24){
											contentType+=' recordwid2';
										}else if(recordsecond<=36){
											contentType+=' recordwid3';
										}else if(recordsecond<=48){
											contentType+=' recordwid4';
										}else if(recordsecond<=60){
											contentType+=' recordwid5';
										}
										var secondView = qlCommon.convertSecond(data.second);
										tplsData.secondView = secondView;

							break;
						case "video":  
									isVideo =  /(qq\.com)|(youku\.com)/.test(data.content);
									tplsData.isVideo = isVideo;
									tplsData.isAndroidBoolean = that.isAndroidBoolean;
							break;
						case "doc": contentType = 'doc' 
							that.docCreator = data.createBy;
							if(data.files){
								tplsData.files = that.renderFileMsg(data.files,data.content);
							}else{
								var tFiles = that.requestFileById(data.content);

								tplsData.files = that.renderFileMsg(tFiles,data.content);
							}
							
							var payTepl = "default";
							if(tplsData.files&&!/(javascript)/.test(tplsData.files.convertUrl)){
								payTepl="mgr";
							}
							if(tplsData.files&&Number(tplsData.files.amount) == 0.00){
								payTepl="free";
							}
							tplsData.payTepl = payTepl;
							tplsData.docId = data.content;

							break;


					}




					//zan.addIds(Number(data.id));

					tplsData.speakTime = speakTime;
					tplsData.contentType = contentType;
					tplsData.bubbleContent = bubbleContent;
					tplsData.isGif = isGif;
					tplsData.isComment = isComment;
					tplsData.isL = isL;
					tplsData.isShowRe = isShowRe;
					data.msgType = "else";
					prependOrAppend();
				

					
			}
				

		}
	},
	newAudioPlay:function (){
		var that =this;
		if(that.isAutoPlay && that.liveFakeStatus == "beginning" && $(".isPlaying").length < 1 && $(".isWhisperPlay").length < 1){
			 playMedia.playAudio($(".recordingMsg").last());
		};
	},
	delCommentHandle:function (commentId){
		if($("#commentDl [attr-id='"+commentId+"']").length > 0){
			$("#commentDl [attr-id='"+commentId+"']").remove();
		};
		if($(".danmulist [attr-id='"+commentId+"']").length > 0){
			$(".danmulist [attr-id='"+commentId+"']").remove();
		};
		if($("#commentDl dd").length<1){
			$("#loadNone").show();
			$(".box-nothing").hide();
		};
	},

	bulletScreensHandle:function (data){
		if($(".barrage-control").hasClass("on") && $(".danmulist [attr-id='"+data.id+"']").length < 1){
			var createByImgUrl = "https://img.qlchat.com/qlLive/liveCommon/normalLogo.png";
			if( /^(img\.qlchat\.com)/.test(data.createByHeadImgUrl)){
				createByImgUrl =data.createByHeadImgUrl.replace(/@.*/,"")+"@64h_64w_1e_1c_2o";
			}else if(/^(wx\.qlogo\.cn\/mmopen)/.test(data.createByHeadImgUrl)){
				createByImgUrl =data.createByHeadImgUrl.replace(/(\/(0|132|64|96)$)/,"/64");
			};
			var tplsData = {
                data:data,
                createByImgUrl:createByImgUrl

            }
			if($(".danmulist").children().length === 0) {
				$(".danmulist").prepend(tpls.bulletMsg(tplsData));
			}else {
				if($(".danmulist dd").eq(0).attr("attr-time") < data.createTime) {
					$(".danmulist").prepend(tpls.bulletMsg(tplsData));
				}
			}
			
			if($(".danmulist dd").length>3){
				$(".danmulist dd").last().remove();
			}
		}
	},
	//删除直播发言和直播评论处理
	delLiveMsgHandle:function (speakId){
		var that =this;
		if($("#speakBubbles [attr-id='"+speakId+"']").length > 0){
			if($("#speakBubbles [attr-id='"+speakId+"'] .recordingMsg.isPlaying").length>0){
				clearSrc = true;
				_audioPlayer.pause();
				$audioPlayer.attr("src","");
				playMedia.stopAnime();
				if(that.userPo.id!=$("#speakBubbles [attr-id='"+speakId+"'] .recordingMsg.isPlaying").attr("attr-createby")){
					//alertMsg("正在播放的语音已被撤销");
				};
			};
			if($("#videoIframe").attr("attr-id") == speakId){
				$("#videoIframe").attr({"src":"","attr-id":""});
				$(".videoPreview").hide();
				//alertMsg("该视频已被撤回");
			};
			$("#speakBubbles [attr-id='"+speakId+"']").remove();
		};
	},
	requestFileById:function (id) {
		var that = this;
		var oriUrl ="javascript:;";
		var file;
		model.postAsync(
		{   
			url: conf.api.docGet,
			data: {
				docId:id
			},
			success: function (result) {
				var data = result.data;
				if (result.state.code === 0) {
					if (data.isPaid || data.amount === 0 || that.powerEntity.allowMGLive) {
						data.convertUrl = that.downloadUrl(id,data.amount,data.convertUrl);
					}else{
						data.convertUrl = oriUrl;
					}
					file = data;
				}
			},
			error: function (err) {
				
			},
		});
		return file;
	},
	downloadUrl:function (docId, amount, oriUrl) {
		var url = oriUrl;
		
		model.postAsync(
		{   
			url: conf.api.docAuth,
			data: {
				amount:amount,
				docId:docId
			},
			success: function (result) {
				var data = result.data;
				if (result.state.code === 0) {
					url += ('?auth_key=' + data.authKey);
				}
				if (result.state.code === 110) {
					url = data;
				}
			},
			error: function (err) {
				var data = response;
			},
		});

		return url;
		
	},
	renderFileMsg:function (files, docId) {
		var that =this;
		if (files&&files !== undefined&&files != null) {
			var fileTepl;
			var size = that.convertSize(files.size);
			var amount = files.amount || files.downloadCount;
			amount = (Number(amount) / 100).toFixed(2);
			var authView='N';
			files.size = size;
			files.amounts = amount;
		}
		return files;
	},
	convertSize:function (size) {
        var sizeN = Number(size);
        if (sizeN < 1024) {
            return String(sizeN) + 'b';
        }
        if (sizeN < 1048576) {
            return (sizeN / 1024).toFixed(1) + 'k';
        }
        return (sizeN / 1048576).toFixed(1) + 'm';
	},
	inviteAdd:function (data){
		var that = this;
		var checkTimeNum = data.updateTime.time||(data.createTime.time+600000);
		if(checkTimeNum >= currentTimeMillis){
			if($(".guest-list dd[attr-id='"+data.id+"']").length < 1){
				var guestHeadImgUrl = "https://img.qlchat.com/qlLive/liveCommon/normalLogo.png",
					guestrole = "";
					
				if(/^(http)/.test(data.userBackgroundImgUrl)){
					guestHeadImgUrl = data.userBackgroundImgUrl;
				};
				if( /(img\.qlchat\.com)/.test(guestHeadImgUrl)){
					guestHeadImgUrl =guestHeadImgUrl.replace(/@.*/,"")+"@64h_64w_1e_1c_2o";
				}else if(/(wx\.qlogo\.cn\/mmopen)/.test(guestHeadImgUrl)){
					guestHeadImgUrl = guestHeadImgUrl.replace(/(\/(0|132|64|96)$)/,"/64");
				};
				if(data.role=="topicCreater"){
					guestrole="主持人";
				}else if(data.role=="compere"){
					guestrole="特邀主持人";
				}else{
					guestrole="嘉宾";
				};
				guestrole = data.title;
	
				var guestHtml = '<dd attr-id="'+data.id+'" >'
					+'<span class="guest-img"><img src="'+guestHeadImgUrl+'"></span>'
					+'<span class="guest-title">'
					+'<var class="guest-title-1">'+data.userName+'</var>'
					+'<var class="guest-title-2">'+guestrole+'</var>'
					+'</span>'
					+'</dd>';
				$(".guest-list").append(guestHtml);
				that.addTempTips(guestrole + '' + data.userName +'加入直播间');
			};
			if(that.userPo.id == data.userId){
				currentUserRole = data.role;
	//			powerEntity.allowSpeak=true;
				if(!$(".speakBox").hasClass("hasTabBottom")){
					$(".speakBox").addClass("hasTabBottom");
				};
			};
			if($(".setGuestTips").length > 0){
				$(".setGuestTips").hide();
			};
		};
	},
	inviteModifyHandle:function (data){
		var that = this;
		switch(data.status){
			case "publish": 
				if(that.userPo.id == data.userId){
					//currentUserRole = data.role;
				};

				window.liveTopicInviteJsons.forEach(function (item, index) {
					if (item.userId == data.userId) {
						$(".guest-list dd[attr-id='" + data.id + "']").find(".guest-title-2").text(data.title);
						item.title = data.title || "";
					}
				})
				break;
			case "delete":
				var checkTimeNum = data.updateTime.time||(data.createTime.time+600000);
				if(checkTimeNum >= currentTimeMillis){
					if ($(".guest-list dd[attr-id='" + data.id + "']").length > 0) {
						$(".guest-list dd[attr-id='" + data.id + "']").remove();
					};
					if(that.userPo.id == data.userId){
						//currentUserRole = "";
						//removeOtherBClass();
						//$(".speakBox").removeClass("hasTabBottom");
						
						// //禁掉录音和发言功能
						
						// 	wx.stopRecord({
						// 		complete:function(res){
						// 	    }
						// 	});
						// 	isRecording = true;
						//     isRecordingStart = false;
						//     that.powerEntity.allowSpeak=false;
						//     resetRec();
					};
				};
				break;
		};
	},
	whoIsTyping:function (name,status){
		var that = this;
		$("#input-person-name").html(qlCommon.wordFilter(name));
		if(status="N"&& that.userPo.name == name){
			$(".inputing-areowindow").hide(100);
		}else if(status="Y"&& that.userPo.name != name){
			$(".inputing-areowindow").show(100);
			clearTimeout(that.hideWIT);
			that.hideWIT = setTimeout(function(){
				$(".inputing-areowindow").hide(100);
			},10000);
		};
	},
	addTempTips:function (tempText){
		var bubbleGuestHtml= '<dt class="bubble-dt"><b>'+ tempText +'</b></dt>';
		$("#speakBubbles").append(bubbleGuestHtml);
	}
};

module.exports = topicMsgHandle;