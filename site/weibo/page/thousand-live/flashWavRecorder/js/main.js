$(function () {
  var CLASS_CONTROLS = "control_panel";
  var CLASS_RECORDING = "recording";
  var CLASS_PLAYBACK_READY = "playback_ready";
  var CLASS_PLAYING = "playing";
  var CLASS_PLAYBACK_PAUSED = "playback_paused";

//  Embedding flash object ---------------------------------------------------------------------------------------------
 
  var appWidth = 1;
  var appHeight = 1;
  var flashvars = {'upload_image': CtxPath+'/styles/flashWavRecorder/images/upload.png'};
  var params = {};
  var attributes = {'id': "recorderApp", 'name': "recorderApp"};
  swfobject.embedSWF(CtxPath+"/styles/flashWavRecorder/images/recorder.swf", "flashcontent", appWidth, appHeight, "11.0.0", "", flashvars, params, attributes);
//  Handling FWR events ------------------------------------------------------------------------------------------------
	

	var _audioPlayer = document.getElementById("audioPlayer");
	
	var isButtenHide = true,recordingSecond;
	
	function stopAnime(){
		if($(".isPlaying").length > 0){
			$(".isPlaying").removeClass("audioloading").removeClass("isPlaying"); 
		};
		
	};

	function removeClickClass(){
		$(".recording_click .btn_dd").removeClass("stopRec").removeClass("startRec");
	};
	
	
	var sendIMY = true;
	function imTyping(speaker,status){
		if(sendIMY){
			sendIMY = false;
			setTimeout(function(){
				sendIMY = true;
			},10000);
			$.ajax({
				type:"post",
				url: CtxPath +"/live/topic/changespeaker.htm",
				data:{topicId:topicId,speaker:speaker,status:status},
				success:function(result){
				},
				error:function(result){
				}
			});
		};
	};
    
  function recClock(){	
  		imTyping(myName,"Y");
    	recordingSecond=FWRecorder.duration('audio').toFixed(0);
    	if(recordingSecond>60){
    		recordingSecond =60;
    	};
    	$(".second_dd var").text(recordingSecond);
    	if(recordingSecond >=50){
			$(".rTips_1").hide();
			$(".rTips_2").show();
			$(".rTips_2 var").text(60-recordingSecond);
		};
		if(recordingSecond >=60){
			$(".rTips_2 var").text("0");
			$(".second_dd var").text("60");
			clearInterval(recordingTimer);
			$("#btnStopRec").click();
			setTimeout(function(){
				audioObj= new File([FWRecorder.getBlob('audio')],"pcRec.wav");
      	$("#audioUploadBox").click();
			},100);
		};
		
	};



  window.fwr_event_handler = function fwr_event_handler() {
    $('#status').prepend("<div class=\"recorder-event\">" + arguments[0] + "</div>");
    var name, $controls;
    switch (arguments[0]) {
      case "ready":
        var width = parseInt(arguments[1]);
        var height = parseInt(arguments[2]);
        FWRecorder.uploadFormId = "#uploadForm";
        FWRecorder.uploadFieldName = "file";
        FWRecorder.connect("recorderApp", 0);
        FWRecorder.recorderOriginalWidth = width;
        FWRecorder.recorderOriginalHeight = height;
        $('.save_button').css({'width': width, 'height': height});
        break;

      case "no_microphone_found":
        break;

      case "microphone_user_request":
        recorderEl().addClass("floating");
        FWRecorder.showPermissionWindow();
        break;

      case "microphone_connected":
        FWRecorder.isReady = true;
//      $uploadStatus.css({'color': '#000'});
        break;

      case "permission_panel_closed":
        FWRecorder.defaultSize();
        recorderEl().removeClass("floating");
        break;

      case "microphone_activity":
        $('#activity_level').text(arguments[1]);
        break;

      case "recording":
        name = arguments[1];
        $controls = controlsEl(name);
        FWRecorder.hide();
        setControlsClass($controls, CLASS_RECORDING);
        $("#btnCancelRec").text("取消"); 
        stopAnime();
      	_audioPlayer.pause();
      	removeClickClass();
	  		$(".recording_click .btn_dd").addClass("startRec");
	  		$(".speakBottom").addClass("recording");
	  		$(".rTips_1").show();
	  		$(".recing_bg").show();
		  	recordingSecond = 0;
	    	recordingTimer = setInterval(recClock,1000);
	    	if(isButtenHide){
	    		isButtenHide = false;
      	};
        break;

      case "recording_stopped":
        name = arguments[1];
        $controls = controlsEl(name);
//      var duration = arguments[2];
        FWRecorder.show();
        setControlsClass($controls, CLASS_PLAYBACK_READY);
        clearInterval(recordingTimer);
        removeClickClass();
        $(".recording_click .btn_dd").addClass("stopRec");
        $(".rTips_1").hide();$(".rTips_2").hide();
				$(".rTips_5").show();
       	imTyping(myName,"N");
        break;

      case "microphone_level":
        $(".recording_tab_box .second_dd i").css({width: arguments[1]*80 + 'px'});
        break;

      case "observing_level":
        //$showLevelButton.hide();
        //$hideLevelButton.show();
        break;

      case "observing_level_stopped":
        //$showLevelButton.show();
        //$hideLevelButton.hide();
        //$level.css({width: 0});
        break;

      case "playing":
        name = arguments[1];
        $controls = controlsEl(name);
        setControlsClass($controls, CLASS_PLAYING);
        break;

      case "playback_started":
        name = arguments[1];
        var latency = arguments[2];
        break;

      case "stopped":
        name = arguments[1];
        $controls = controlsEl(name);
        setControlsClass($controls, CLASS_PLAYBACK_READY);
        break;

      case "playing_paused":
        name = arguments[1];
        $controls = controlsEl(name);
        setControlsClass($controls, CLASS_PLAYBACK_PAUSED);
        break;

      case "save_pressed":
      	audioObj=FWRecorder.getBlob('audio');
      	$("#audioUploadBox").click();
      	
//      FWRecorder.updateForm();
        break;

      case "saving":
        name = arguments[1];
        break;

      case "saved":
        name = arguments[1];
        var data = $.parseJSON(arguments[2]);
        if (data.saved=="SUCCESS") {
          //$('#upload_status').css({'color': '#0F0'}).text(name + " was saved");
        } else {
         // $('#upload_status').css({'color': '#F00'}).text(name + " was not saved");
        }
        break;

      case "save_failed":
        name = arguments[1];
        var errorMessage = arguments[2];
//      $uploadStatus.css({'color': '#F00'}).text(name + " failed: " + errorMessage);
        break;

      case "save_progress":
        name = arguments[1];
        var bytesLoaded = arguments[2];
        var bytesTotal = arguments[3];
//      $uploadStatus.css({'color': '#000'}).text(name + " progress: " + bytesLoaded + " / " + bytesTotal);
        break;
    }
  };

//  Helper functions ---------------------------------------------------------------------------------------------------


  function setControlsClass($controls, className) {
    $controls.attr('class', CLASS_CONTROLS + ' ' + className);
  }

  function controlsEl(name) {
    return $('#recorder-' + name);
  }

  function recorderEl() {
    return $('#recorderApp');
  }


//  Button actions -----------------------------------------------------------------------------------------------------

  window.microphonePermission = function () {
    recorderEl().addClass("floating");
    FWRecorder.showPermissionWindow({permanent: true});
  };

  window.configureMicrophone = function () {
    if (!FWRecorder.isReady) {
      return;
    }
    FWRecorder.configure("8", "50", "0", "-1");
    
    
    FWRecorder.setUseEchoSuppression(true);
    FWRecorder.setLoopBack(false);
  };

});
