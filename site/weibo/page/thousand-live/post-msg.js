require('zepto');
require('tapon');


var Handlebars = require('handlebars'),
    model = require('model'),
    conf = require('../conf'),
    toast = require('toast'),
    topicMsgHandle = require('./topic-msg-handle');
var qlCommon = require('../../comp/common-js/ql-common');




var $liveHeader = $('.liveHeader');
var $pageMenu  = $('.pageMenu');
var $barrage  = $('.barrage-control');
var $BubblesTemp  = $('#BubblesTemp');
var $speakBubbles  = $('#speakBubbles');
var $speakBox = $("#speakBox");
var $commentBox= $(".commentBox");
var $caozuoList = $(".caozuo-list");
var _audioPlayer = document.getElementById("audioPlayer");

var postMsg = {

    init:function(initData){
        var that = this;
        this.initData = initData;

        that.topicId =initData.topicPo.id;
        that.liveId =initData.topicPo.liveId;

    },
    //参数区
    saidNoSound:false,
    isTalking:false,

    postComment:function (type,content,isQuestion){
        var that = this;
        if(!that.initData.powerEntity.allowMGLive&&!that.initData.powerEntity.allowSpeak&&!that.saidNoSound&& /(听不到|听不见|没有声音|没声音|加载失败|无法播放)/g.test(content)){
			 that.saidNoSound = true;
			 $(".input-box").blur();
			 //qlSlBoxShow(".saidNoSound");

		}else if(!that.isTalking){
			that.isTalking = true;
			var isquestion=isQuestion||"N";
			
			if(content.trim() ==""){
                toast.toast('内容不能为空', null, 'middle');
				that.isTalking = false;
				return false;
			}
			if(type == "text"){
				//content=content.replace(/ /g,"\&nbsp\;"); 
				content = qlCommon.firstFilter(content);
				content = qlCommon.normalFilter(content);
			};
			if(content.trim().length > 200){
                toast.toast('内容字数不能超过200字', null, 'middle');
				that.isTalking = false;
				return false;
			};

            model.fetch(
            {   
                type:'POST',
                url: conf.api.postComment,
                data: {
                    type:type,
                    liveId:that.liveId,
                    topicId:that.topicId,
                    content:content,
                    isQuestion:isquestion
                },
                success: function (result) {
                    that.isTalking = false;
                    console.log(result);
                    that.postCommentHandle(result,type,content,isQuestion);
                },
                error: function (err) {
                    that.isTalking = false;
                    toast.toast(err.state.msg, null, 'middle');
                },
            });
        }   
    },

    postCommentHandle: function(result,type,content,isQuestion){
        var that = this;
        if(result.state.code == "0"){
            if (type == "text"){
                $(".askTypeBox").hide();
                $(".commentInput").val("");
                $(".danmuInput").val("");
                $(".newCommentBox .input-box").val("");
                $(".newCommentBox .input-box").keydown();
                $(".newCommentBox .btn_ask").removeClass('on');
                $('#student_comment .input-box').trigger('blur');
                $(".commentInput").blur();
                $(".commentBox").removeClass("typing");
                $(".danmuBottom").css({"max-height":"0"});
                $(".qlDanmuBg").hide();
                $(".danmuInput").blur();
            }
            topicMsgHandle.commentHandle(result.data.liveCommentView,true);
            topicMsgHandle.bulletScreensHandle(result.data.liveCommentView);
//            danmuHandle(data.liveCommentView,true);
            $(".commentContentBox").scrollTop(0);
        }else if(result.state.code == "777"){
            that.isTalking = false;
            toast.toast("您已被禁言", null, 'middle');
            $(".danmuBottom .btnCommentCancel,.qlDanmuBg").click();
            $(".bottom_content_area").addClass("disabled");
            $(".danmuBottom").addClass("noseeDanmuBottom").removeClass("danmuBottom");
            $(".qlDanmuBg").addClass("noseeQlDanmuBg").removeClass("qlDanmuBg");
            $(".noseeDanmuBottom").addClass("personal");
        }else{
            that.isTalking = false;
            toast.toast(result.state.msg, null, 'middle');
        }

    },
    delComment:function (commentId,createBy){
        var that = this;
        model.fetch(
        {   
            type:'POST',
            url: conf.api.delComment,
            data: {
                commentId:commentId,
                createBy:createBy,
                topicId:that.topicId
            },
            success: function (result) {
                var data = result;
                if(data.state.code == "0"){
                    topicMsgHandle.delCommentHandle(commentId);
                    
                }else if(data.statusCode == "205"){
                  // alert(data.state.msg);
                };
            },
            error: function (err) {
                toast.toast(err.state.msg, null, 'middle');
            },
        });
           
    }

}

module.exports = postMsg;












