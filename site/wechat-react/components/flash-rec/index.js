/**
 * 
 */
export function configureMicrophone () {
    if (!FWRecorder.isReady) {
      return;
    }
    FWRecorder.configure("8", "50", "0", "-1");
    
    
    FWRecorder.setUseEchoSuppression(true);
    FWRecorder.setLoopBack(false);
};
export function microphonePermission () {
    $('#recorderApp').addClass("floating");
    FWRecorder.showPermissionWindow({permanent: true});
};


export function flashRecMain(recClock,startRecording,stopRecording) {
    var CLASS_CONTROLS = "control_panel";
    var CLASS_RECORDING = "recording";
    var CLASS_PLAYBACK_READY = "playback_ready";
    var CLASS_PLAYING = "playing";
    var CLASS_PLAYBACK_PAUSED = "playback_paused";

    //  Embedding flash object ---------------------------------------------------------------------------------------------
    
    var appWidth = 1;
    var appHeight = 1;
    var flashvars = {'upload_image': ''};
    var params = {};
    var attributes = {'id': "recorderApp", 'name': "recorderApp"};
    if(swfobject){
        swfobject.embedSWF("/api/swf/rec", "flashcontent", appWidth, appHeight, "11.0.0", "", flashvars, params, attributes);
    }
    
    var recordingTimer;

    function setControlsClass($controls, className) {
        $controls.attr('class', CLASS_CONTROLS + ' ' + className);
    }

    function controlsEl(name) {
        return $('#recorder-' + name);
    }

    function recorderEl() {
        
        return $('#recorderApp');
    }
    function recorderElD() {
        return document.getElementById('recorderApp');
    }

    return function fwr_event_handler(){
        let reDiv = document.createElement("div");
        reDiv.innerHTML = arguments[0];
        document.querySelector('#status') && document.querySelector('#status').appendChild(reDiv);
            
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
            break;

        case "recording":
            try {
            name = arguments[1];
            $controls = controlsEl(name);
            FWRecorder.hide();
            setControlsClass($controls, CLASS_RECORDING);
            recordingTimer = setInterval(recClock,1000);
            startRecording();
                
            } catch (error) {
                console.log(error)
            }
            break;

        case "recording_stopped":
            name = arguments[1];
            $controls = controlsEl(name);
            FWRecorder.show();
            setControlsClass($controls, CLASS_PLAYBACK_READY);
            clearInterval(recordingTimer);
            stopRecording();
            break;

        case "microphone_level":
            break;

        case "observing_level":
            break;

        case "observing_level_stopped":
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
            
            break;

        case "saving":
            name = arguments[1];
            break;

        case "saved":
            name = arguments[1];
            var data = $.parseJSON(arguments[2]);
            if (data.saved=="SUCCESS") {
            } else {
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
    }
    
};