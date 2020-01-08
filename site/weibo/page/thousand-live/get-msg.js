require('zepto');
// require('zeptofix');
require('tapon');

var Handlebars = require('handlebars'),
    model = require('model'),
    conf = require('../conf'),
    topicMsgHandle = require('./topic-msg-handle'),
    toast = require('toast'),
    topicTools = require('./topic-tools'),
    pptModule = require('./ppt-module'),
    analyze = require('../../comp/baidu-analyze'),
    websocket = require('./websocket');


require('hbardateformat');
require('hbarcompare');
require('hbardefaultVal');
require('hbarimgformat');
require('../../comp/default-img/default-img');

var $liveHeader = $('.liveHeader');
var $pageMenu  = $('.pageMenu');
var $barrage  = $('.barrage-control');
var $BubblesTemp  = $('#BubblesTemp');
var $speakBubbles  = $('#speakBubbles');
var $speakBox = $("#speakBox");
var $commentBox= $(".commentBox");
var $caozuoList = $(".caozuo-list");
var _audioPlayer = document.getElementById("audioPlayer");

var getMsg = {

    init:function(initData){
        var that = this;
        that.initData = initData;

        var startTime = initData.topicPo.startTime;
        var currentTimeMillis = initData.currentTimeMillis;
        that.currentTimeMillis = currentTimeMillis;
        that.topicId =initData.topicPo.id;
        that.liveId =initData.topicPo.liveId;
        that.liveFakeStatus = that.initData.topicPo.status;
        topicMsgHandle.liveFakeStatus = that.liveFakeStatus;
        that.loadDataTime = (currentTimeMillis > startTime)? (currentTimeMillis+3600000): startTime;

        $(document).on("click",".btnFirstMsg",function(e){
            that.gotoFirstMsg();
        });

        $(document).on("click",".btn-new-msg",function(e){
            that.gotoLastMsg();
        });

        $(".commentContentBox").scroll(function(e){
            that.commentContentScroll(e);

        })
        if (localStorage.getItem('lastVisit')) {
            that.lastVisit = JSON.parse(localStorage['lastVisit']);
        }

        if(initData.topicPo.status != "ended" && initData.powerEntity.allowSpeak){
			that.getSpeak(that.loadDataTime,"30","before",function(){
				that.isLastMsg = true;
				topicTools.moveToEnd($(".speakContentBox"),true);	
			});	
		}else if(that.lastVisit[that.topicId] && /^(\d)*$/gi.test(that.lastVisit[that.topicId].speakTime)){
			that.liveFakeStatus = "ended";
            topicMsgHandle.liveFakeStatus = that.liveFakeStatus;
			var lastVisitHtml= '<dt class="lastVisit-dt"><b>上次看到这里了</b></dt>';
			$("#speakBubbles").append(lastVisitHtml);
			this.getSpeak(that.lastVisit[that.topicId].speakTime,"30","after",function(){
				$(".loadingBox").hide();
				//$(".enterLiveTips").hide();
				if($(".recordingMsg").length > 0 && $(".isPlaying").length < 1){
					setTimeout(function() {
						$(".recordingMsg").eq(0).click();
					}, 1000);
				};
				$(".speakContentBox").scrollTop(20);
			});

		}else{
			that.liveFakeStatus = "ended";
            topicMsgHandle.liveFakeStatus = that.liveFakeStatus;
			this.getSpeak("1120752000000","30","after",function(){
				$(".loadingBox").hide();
				setTimeout(function() {
					if($(".recordingMsg").length > 0 && $(".isPlaying").length < 1){
						$(".recordingMsg").eq(0).click();
					}
				}, 350);
			});
		};


    },
    //参数区
    isTalkHLoading: true,
	loadPageSize:"30",
    isIntervalStart:true,
    lastVisit:{},
    scrollHistoryLong: 1,
    isLastMsg:false,
    isLoadingComment:false,
    noCommentHistory:true,
    isTopicEnd:false,
    hrTime : 1000,
    getSpeak:function (loadTime,msgLength,bOrA,callback){
        var that = this;
		var beforeOrAfter = "before",
			pullComment = "N";
		if(msgLength!= undefined && msgLength != ""){
			loadPageSize = msgLength;
		}else{
			loadPageSize = "30";
		}
		if(bOrA != undefined && bOrA != ""){
			beforeOrAfter = bOrA;
		}
		if(that.isIntervalStart){
			pullComment = "Y";
		}
		if(that.isTalkHLoading){
			that.isTalkHLoading = false;
			model.fetch(
            {   
                type:'POST',
                url: conf.api.getSpeak,
                data: {
                    liveId:that.liveId,
                    beforeOrAfter:beforeOrAfter,
                    time:loadTime,
                    pageSize:loadPageSize,
                    topicId:that.topicId,
                    pullComment:pullComment,
                    isMgr:that.initData.powerEntity.allowMGLive
                },
                success: function (result) {
                    that.isTalkHLoading = true;
                    that.getSpeakHandle(result.data,beforeOrAfter,callback);
                },
                error: function (err) {
                    
                },
            });
        

		}
	},

    //获取发言数据后处理
    getSpeakHandle:function(data,beforeOrAfter,callback){
        var that = this;
        var btnHeight = $(".btnLoadSpeak")[0].offsetHeight;
        if(beforeOrAfter == "after" && data.liveSpeakViews.length<29){
            that.liveFakeStatus = that.initData.topicPo.status;
        }
        for (var i = 0;i<data.liveSpeakViews.length;i++) {
            var dataObj = data.liveSpeakViews[i];
            topicMsgHandle.liveFakeStatus = that.liveFakeStatus;
            topicMsgHandle.speakHandle(data.liveSpeakViews[i],beforeOrAfter == "before" ? true : false);
        };
        $("#BubblesTemp .recordingMsg").each(function(){
            //imReaded($(this).parents("dd").attr("attr-id"));
        });
        if('liveCommentViews' in data&&data.liveCommentViews != null){
            for (var i = 0;i<data.liveCommentViews.length;i++) {
                var dataComObj = data.liveCommentViews[i];
                if($(".commentContentBox [attr-id='"+dataComObj.id+"']").length < 1){
                    topicMsgHandle.commentHandle(data.liveCommentViews[i],false);
                };
            };
        };
        
                                
        // 初始化点赞信息
        //zan.init();
        
        
        if(that.isIntervalStart){
            that.isIntervalStart = false;
            $(".barrage-tab").eq(0).click();
            $("#BubblesTemp").children().appendTo($("#speakBubbles"));
            $(".btnLoadSpeak").removeClass("on");
            $(".btnLoadSpeakEnd").removeClass("on");
            that.isTalkHLoading = true;
            if(that.initData.topicPo.status != "ended"){
                if(that.initData.powerEntity.allowSpeak){
                    setTimeout(function(){
                        topicTools.moveToEnd($(".speakContentBox"),true);
                    },200);
                };
                that.websocketStart();
                var replaceHeadInterval = setInterval(that.tempHeadReplace,that.hrTime);
            }
            $(".qlLoading").remove();
            
            //clearTimeout(relLoadBox);
            //enterLiveTips();
            setTimeout(function(){
                that.speakContentScroll();
            },500);
            analyze.addBaiduStatistic();
        }else{
            if(that.liveFakeStatus == "ended" && $("#BubblesTemp").children().length < 1&&beforeOrAfter == "after"){
                that.isLastMsg = true;
                 if(that.liveFakeStatus != that.initData.topicPo.status){
                     that.liveFakeStatus = that.initData.topicPo.status;
                     topicMsgHandle.liveFakeStatus = that.liveFakeStatus;
                 }
            }
            setTimeout(function(){
                var pageHeightB = $("#BubblesTemp")[0].offsetHeight;
                if(beforeOrAfter == "before"){
                    $("#BubblesTemp").children().prependTo($("#speakBubbles"));
                    btnHeight = btnHeight - $(".btnLoadSpeak")[0].offsetHeight;
                    pageHeightB = pageHeightB - $("#BubblesTemp")[0].offsetHeight + $(".speakContentBox").scrollTop();
                    $(".speakContentBox").scrollTop(pageHeightB - btnHeight);
                }else{
                    $("#BubblesTemp").children().appendTo($("#speakBubbles"));
                }
                $(".btnLoadSpeak").removeClass("on");
                $(".btnLoadSpeakEnd").removeClass("on");
                that.isTalkHLoading = true;
            },beforeOrAfter == "after"?10:1000);

        }
        if(typeof(callback) == "function")callback();


    },
    //滚动加载帖子
	speakContentScroll:function (){
        var that = this;
		$(".speakContentBox").scroll(function(){
			if($("#speakBubbles").children(".left-bubble,.luckyMoney").length > 0){
				if($(this).scrollTop() <= that.scrollHistoryLong && $(".qlTimerShow").length<3){
                    that.getSpeak($("#speakBubbles").children(".left-bubble,.luckyMoney").eq(0).attr("attr-time"));
					that.scrollHistoryLong = 300;
				}else if(that.liveFakeStatus !='beginning'&& !that.isLastMsg && $(".speakContentBox")[0].scrollHeight - $(".speakContentBox")[0].scrollTop -$(".speakContentBox")[0].offsetHeight <=700){
                    that.getSpeak($("#speakBubbles").children(".left-bubble,.luckyMoney").last().attr("attr-time"),"","after");
					
				}
			}
		});
	},
    loadLastMsg:function(){
        var that = this;
		$(".loadingBox").show();
		$("#BubblesTemp").html("");
		$("#speakBubbles").html("");
		_audioPlayer.pause();
		that.liveFakeStatus = that.initData.topicPo.status;
        topicMsgHandle.liveFakeStatus = that.liveFakeStatus;
		$(".qlTimerShow").removeClass("qlTimerShow");
		var tempLoadDataTime = new Date().getTime();
        tempLoadDataTime = tempLoadDataTime > that.currentTimeMillis? tempLoadDataTime+86400000:that.currentTimeMillis+86400000;
        that.getSpeak(tempLoadDataTime,"30","before",function(){
			$(".loadingBox").hide();
			that.isLastMsg = true;
			topicTools.moveToEnd($(".speakContentBox"),true);	
			setTimeout(function() {
                toast.toast('已到达最后一条内容', null, 'middle');
			}, 1000);
        });
	},
    gotoFirstMsg:function(){
        var that = this;
        if($(".qlTimerShow").length > 0){
			$(".speakContentBox").scrollTop(0);
            toast.toast('已回到第一条内容', null, 'middle');
		}else if(that.isTalkHLoading){
			$(".loadingBox").show();
			$("#BubblesTemp").html("");
			$("#speakBubbles").html("");
			_audioPlayer.pause();
            that.getSpeak("1120752000000","30","after",function(){
               $(".loadingBox").hide();
				setTimeout(function() {
					if($("#speakBubbles").children(".left-bubble,.luckyMoney").length < 20){
						that.isLastMsg = true;
						that.liveFakeStatus = that.initData.topicPo.status;
                        topicMsgHandle.liveFakeStatus = that.liveFakeStatus;
					}else{
						that.isLastMsg = false;
						that.liveFakeStatus = "ended";
                        topicMsgHandle.liveFakeStatus = that.liveFakeStatus;
					}
					toast.toast('已回到第一条内容', null, 'middle');
				}, 300);
				
				$(".speakContentBox").scrollTop(0);
            });

		};
    },
    gotoLastMsg:function(){
        var that = this;
        if(that.isLastMsg){
			topicTools.moveToEnd($(".speakContentBox"),true);	
			setTimeout(function() {
				toast.toast('已到达最后一条内容', null, 'middle');
			}, 500);
		}else if(that.isTalkHLoading){
			that.loadLastMsg();
		};
    },

    getComment:function (loadTime,callback){
        var that = this;
        
		if(!that.isLoadingComment){
			that.isLoadingComment = true;
			model.fetch(
            {   
                type:'POST',
                url: conf.api.getComment,
                data: {
                    liveId:that.liveId,
                    time:loadTime,
                    topicId:that.topicId,
                    beforeOrAfter:"before",
                    pageSize:'30'
                },
                success: function (result) {
                    that.isTalkHLoading = true;
                    that.getCommentHandle(result.data,callback);
                },
                error: function (err) {
                    
                },
            });
        

		}
	},

    getCommentHandle:function(result,callback){
        var that =this;
        var data = result;
        var btnHeight = $(".btnLoadComment")[0].offsetHeight;
        var noContentHtml = '<div class="box-nothing" style="display:block;"><span class="tips-1">没有更多</span></div>';

        for (var i = 0;i<data.liveCommentViews.length;i++) {
            var dataObj = data.liveCommentViews[i];
            var ishas = $(".commentContentBox [attr-id='"+dataObj.id+"']").length < 1;
            if(ishas){
                that.noCommentHistory = false;
                topicMsgHandle.commentHandle(dataObj,false);
            }else{
                that.noCommentHistory = true;
            };
        };
        
        if(that.noCommentHistory && $(".commentContentBox .box-nothing").length<1 && $(".commentContentBox [attr-id]").length >0){
            $(".commentContentBox .scrollContentBox").append(noContentHtml);
        };
        $(".btnLoadComment").removeClass("on");
        that.isLoadingComment = false;
        // if(iscommentStart){
        //     iscommentStart=false;
        // };
        if(typeof(callback) == "function"){
            callback();
        };

    },
    //新评论提示
    newCommentTips:function (){
		if($(".commentBox.isShow").length<=0 && !$(".barrage-control").hasClass("on")){
			$(".barrage-control .tabToComment").addClass("on");
		}
	},

    commentContentScroll:function(){
        if($(".commentContentBox .none-record").length < 1 && $(".commentContentBox .box-nothing").length < 1 && $(".commentContentBox")[0].scrollHeight - $(".commentContentBox")[0].scrollTop - $(".commentContentBox")[0].offsetHeight <= 2){
            $(".btnLoadComment").addClass("on");
            this.getComment($(".comment-dd:last-child").attr("attr-time"));
        }

    },
    websocketStart:function(){
        var that =this;
        var pushData = {dir:"LIVE",id:that.topicId,msgType:"public",reqSleep:4000,funcSleep:"0",
			callback:function(data){
				switch(data.pushExp){
					case "speak": 
						if($("#speakBubbles").children().length > 0 && data.createTime < Number($("#speakBubbles").children().eq(0).attr("attr-time"))){
							return false;
						}else if(that.liveFakeStatus == "beginning" ){
							topicMsgHandle.speakHandle(data,false);
						};
						break;
					case "comment":topicMsgHandle.commentHandle(data,true);topicMsgHandle.bulletScreensHandle(data); that.newCommentTips();break;
					case "speakVote": /*speakVoteHandle(data); */break;
					case "deleteSpeak":topicMsgHandle.delLiveMsgHandle(data.id); break;
					case "deleteComment":topicMsgHandle.delCommentHandle(data.id); break;	
					case "liveEnd": /*removeOtherBClass();*/ $(".speakBox").removeClass("hasTabBottom"); topicMsgHandle.speakHandle(data.liveSpeakPo,false); that.isTopicEnd = true; break;
					case "prompt": topicMsgHandle.speakHandle(data.liveSpeakPo,false); break;
					case "rewardaction": /*rewardactionHandle(data); */break;
					case "inviteAdd": topicMsgHandle.inviteAdd(data); break;					
					case "inviteModify": topicMsgHandle.inviteModifyHandle(data); break;
					case "banned":that.allBanned(data.isBanned); break;
					case "changeSpeaker":if(data.params){topicMsgHandle.whoIsTyping(data.params.speaker,data.params.status);}else{topicMsgHandle.whoIsTyping(data.speaker,data.status);}; break;
					case "changePPTFile":pptModule.pptBoxChange(data); break;
					case "speakLikes": /*zan.updateZan(data.id, data.likesNum);*/ break; 
					case "reload":
						if (data.isEnableReward != percentageRule.isEnable) {
							window.location.reload(true);
						}
						break;
				}
			},
			callEver:function(){
				if(!that.isTopicEnd){
					var onlineNum = websocket.onLineNum;
					var commentNum = websocket.commentNum;
					if(onlineNum>10000){
						onlineNum = (onlineNum/10000).toFixed(1)+"w";
					};
					if(commentNum>10000){
						commentNum = (commentNum/10000).toFixed(1)+"w";
					};
					$(".allcount var").text(onlineNum);
					$("#commentNum").text(commentNum);
				}
			}
		};
		websocket.init(pushData,that.initData.sid,that.initData.topicPo.channelId);

    },
	tempHeadReplace:function (){
        var that =this;
		if($(".hasTempHead").length > 0){
			that.hrTime = 200;
			var $hasTempHead = $(".hasTempHead").eq(0),
				$hasTempHId = $hasTempHead.parents("dd").attr("attr-id"),
				$realHead = $hasTempHead.attr("attr-realSrc");
			$hasTempHead.attr("src",$realHead);
			if($(".danmulist [attr-id='"+$hasTempHId+"']").length > 0){
				$(".danmulist [attr-id='"+$hasTempHId+"']").find("img").attr("src",$realHead);
			};
			$hasTempHead.removeClass("hasTempHead");
		}else{
			that.hrTime = 1000;
		};
	},
    allBanned:function (isenable){
		if(isenable=="N"){
			if($("#allShutup").length > 0 && $("#allShutup").hasClass("swon")){
				topicMsgHandle.addTempTips('讨论区现在允许发言');
			}else if($("#allShutup").length < 1){
				topicMsgHandle.addTempTips('讨论区现在允许发言');
			}
			$("#allShutup").removeClass("swon");
			$(".caozuo-shutup").removeClass("on");
			$(".bottom-content-area").removeClass("disabled");
			$(".bottom-content-area .input-box").removeAttr("disabled");
			$(".noseeDanmuBottom").addClass("danmuBottom").removeClass("noseeDanmuBottom");
			$(".noseeQlDanmuBg").addClass("qlDanmuBg").removeClass("noseeQlDanmuBg");
		}else if(isenable=="Y"){
			if($("#allShutup").length > 0 && !$("#allShutup").hasClass("swon")){
				topicMsgHandle.addTempTips('讨论区禁言功能已开启');
			}else if($("#allShutup").length < 1){
				topicMsgHandle.addTempTips('讨论区禁言功能已开启');
			}
			$(".danmuBottom .btnCommentCancel,.qlDanmuBg").click();
			$("#allShutup").addClass("swon");
			$(".caozuo-shutup").addClass("on");
			$(".bottom-content-area").addClass("disabled");
			$(".bottom-content-area .input-box").attr("disabled","disabled");
			$(".danmuBottom").addClass("noseeDanmuBottom").removeClass("danmuBottom");
			$(".qlDanmuBg").addClass("noseeQlDanmuBg").removeClass("qlDanmuBg");
		}
	}



}

module.exports = getMsg;












