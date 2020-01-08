require('zepto');
// require('zeptofix');
require('tapon');

var Handlebars = require('handlebars'),
    model = require('model'),
    conf = require('../conf'),
	toast = require('toast'),
    pptBox = require('./slider');


var ppt = {
    //参数区
    isPPTChanging: true,

    
    //初始化
    pptLayerInit:function(status,callback){
        var that = this;
        model.fetch(
        {   
            type:'POST',
            url: conf.api.getPPT,
            data: {
                status:status,
                topicId:that.topicId,
                page:1,
                size: 200
            },
            success: function (result) {
                var data = result;
                if(data.state.code == "0"){
                   if(typeof(callback) == "function"){
						callback(data.data);
					};
                }else if(data.statusCode == "205"){
                  // alert(data.state.msg);
                };
            },
            error: function (err) {
                toast.toast(err.state.msg, null, 'middle');
            },
        });
    },



    /************************  
          ppt选取层事件  
    ************************/



    pptLayerShow:function(){


    },

    pptLayerHide:function(){


    },

    pptMoveUp:function(){

    },

    pptMoveDown:function(){

    },

    pptDelete:function(){

    },

    pptToggleOn:function(){

    },

    imgToggleOn:function(){

    },

    pptAdd_mobile:function(){
        // var that = this;
        // wx.chooseImage({
		// 	count: 9,
		// 	sizeType: ['original', 'compressed'],
		// 	sourceType: ['album', 'camera'],
		// 	success: function (res) {
		// 		that.localUrls = res.localIds;
		// 		wxImgUpload("pptMode","N");
		// 	},
		// 	cancel: function (res) {
		// 		$(".loadingBox").hide();
		// 	}
		// });

    },

    pptAdd_pc:function(){
        // if($("#ppt-add-btn").length>0){
		// 	new imgUpload($("#ppt-add-btn"),
		// 	{
		// 		folder: "liveComment",
		// 		multiple: "Y",
		// 		onComplete: function (imgUrl) {
		// 			var pptUrl = imgUrl;
		// 			pptRequestAdd("pc",pptUrl,"N");
		// 		},
		// 		onChange: function () {
		// 			$(".loadingBox").show();
		// 		},
		// 		onError: function () {
		// 			$(".loadingBox").hide();
		// 		}
		// 	});
		// };

    },

    /************************  
           ppt选取层事件  
    ************************/

    pptBoxChange:function (data) {
		var checkTimeNum = data.checkTimeNum||data.checkTime.time;
		if(checkTimeNum >= currentTimeMillis){
			if(isrelay=="Y"&&$(".hasTabBottom").length>0&&$("#ppt-select-layer [data-id=" + data.id + "]").length<=0){
				pptRenderList(data);
			};
			console.log(data);
			if(isPPTChanging){
				isPPTChanging = false;
				if(data.status=="Y"&& $("#ppt_slider [data-id="+ data.id +"]").length<1){
					if ($(".speakBox").hasClass("hidePPT")) {
						resetPPtH();
						$(".speakBox").removeClass("hidePPT");
					};
					pptBox.addSlide(data.id,data.url,data.fileId);
					if($(".isPlaying").length < 1){
						var pptIndex = $("#ppt_slider [data-fileid]").last().index();
						setTimeout(function() {
							pptBox.jumpToSlide(pptIndex);
						}, 100);
					};
				}else if(data.status=="N"&& $("#ppt_slider [data-id="+ data.id +"]").length>0){
					var index = $("#ppt_slider [data-id="+data.id+"]").index();
					pptBox.removeSlide(index);
				};
				pptListChange(data);
				setTimeout(function(){
					isPPTChanging = true;
				},500);
			}else{
				setTimeout(function(){
					pptBoxChange(data);
				},1000);
			};
		};
	},

    addPPTJump:function (data){
        var that = this;
		that.pptBoxChange(data)
		var pptIndex = $("#ppt_slider [data-fileid='"+ data.fileId +"]").index();
		setTimeout(function() {
			pptBox.jumpToSlide(pptIndex);
		}, 100);
	}












}


module.exports = ppt;