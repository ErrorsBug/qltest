import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Detect from 'components/detect';

import Page from 'components/page';
import { autobind, throttle } from 'core-decorators';
import {
	getStsAuth,
	uploadRec,
	getWxConfig
} from '../../../../../actions/common';

import Recorder from '../../../components/recorder';
import AudioController from '../../../components/audio-controller';

import {
	htmlTransfer
} from 'components/util';

@autobind
class HomeworkContent extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

    state = {
        // 输入内容长度
        inputCount: this.props.homeworkInfo.content && htmlTransfer(this.props.homeworkInfo.content).length || 0,
	    inputValue: htmlTransfer(this.props.homeworkInfo.content) || '',

	    showRecorder: false,
	    showAudioController: true,

	    currentAudioUrl: '',
	    recLocalId: '',
	    second: ''
    };
    componentWillMount(){
	    // this.initStsInfo();
	    // this.initWxConfig();
	    if(typeof sessionStorage !== 'undefined'){
		    if(sessionStorage.getItem('content')){
		    	this.setState({
				    inputCount: sessionStorage.getItem('content').length,
				    inputValue: sessionStorage.getItem('content')
			    });
		    }
		    if(sessionStorage.getItem('second')){
			    this.setState({
				    currentAudioUrl: sessionStorage.getItem('audioUrl'),
				    second: sessionStorage.getItem('second'),
				    recLocalId: sessionStorage.getItem('recLocalId')
			    });
		    }
	    }
    }
    componentDidMount(){
	    if(!Detect.os.phone) this.initStsInfo();

	    let audio = this.props.homeworkInfo.audioList && this.props.homeworkInfo.audioList.length && this.props.homeworkInfo.audioList[0];
	    if(audio){
	    	this.setState({
			    currentAudioUrl: audio.audioUrl,
			    second: audio.second
		    })
	    }
    }
	async initWxConfig(){
    	let config = await this.props.getWxConfig();
    	// console.log(location.href);
    	// console.log(config);
    	wx.config(config);
	}
	// oss上传
	initStsInfo() {
		this.props.getStsAuth();

		const script = document.createElement('script');
		script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
		document.body.appendChild(script);
	}
    inputHandle(e){
    	let value = e.target.value;
	    this.setState({
		    inputValue: value,
		    inputCount: value.length
	    });
    }
	confirm(){
    	if(!this.state.inputValue.trim()){
    		window.toast('请输入内容');
		    return false;
	    }else if(this.state.inputValue.trim().length > 1000){
		    window.toast('内容长度不能大于1000字');
		    return false;
	    }

		if(this.refs.audioController) this.refs.audioController.pauseAudio();

		sessionStorage.setItem('content',this.state.inputValue.trim());
		sessionStorage.setItem('audioUrl',this.state.currentAudioUrl || '');
		sessionStorage.setItem('second',this.state.second || '');
		this.state.recLocalId && sessionStorage.setItem('recLocalId', this.state.recLocalId);
		this.state.recServerId && sessionStorage.setItem('audioId',this.state.recServerId);
		// this.context.router.goBack();
		location.href = `/wechat/page/homework/create?liveId=${this.props.location.query.liveId}&id=${this.props.location.query.id || ''}`;
	}


	onPCRecUploadSuccess(url,second){
		this.setState({
			showRecorder: false,
			currentAudioUrl: url,
			second: second
		});
	}
	onWXRecUploadSuccess(recServerId, second, recLocalId){
		this.setState({
			showRecorder: false,
			recServerId: recServerId,
			second: second,
			recLocalId: recLocalId
		});
	}
	deleteAudio(){
		this.refs.audioController.pauseAudio();
		this.setState({
			showAudioController: false,
			currentAudioUrl: '',
			recServerId: '',
			recLocalId: '',
			second: 0
		});
	}
	showRecorder(){
		if(this.state.second){
			window.toast('您只能录一条语音');
			return false;
		}
		this.setState({
			showRecorder: true
		});
	}
	hideRecorder(){
		this.refs.recorder.resetRec().then(() => {
			this.setState({
				showRecorder: false
			});
		});
	}
    render() {
        return (
            <Page title="作业内容" className="set-homework-content">
                <div className="input-content-box">
                    <textarea className="input-content" placeholder="请输入内容" onChange={this.inputHandle} value={this.state.inputValue}></textarea>
                    <div className="input-count"><span>{this.state.inputCount}</span>/1000</div>
                </div>

	            {
		            (!!this.state.currentAudioUrl || !!this.state.recLocalId) &&
		            <div className={`audio-wrapper show`}>
			            <AudioController
				            ref="audioController"
				            currentAudioUrl={this.state.currentAudioUrl}
				            recLocalId={this.state.recLocalId}
				            second={this.state.second}
				            theme="green"
			            />
			            <div className="delete-btn" onClick={this.deleteAudio}>删除</div>
		            </div>
	            }

                <div className="append-record" onClick={this.showRecorder}>
                    <span className="icon-record"></span>
                    添加语音
                </div>
                <div className="btn-ensure" onClick={this.confirm}>确认</div>

	            <div className={`recording-wrapper${this.state.showRecorder ? ' show' : ''}`} onClick={this.hideRecorder}>
		            <div className="recording-box" onClick={(e) => e.stopPropagation()}>
			            <Recorder
				            ref="recorder"
				            className="recorder-container"
				            uploadRec={this.props.uploadRec}
				            onPCRecUploadSuccess={this.onPCRecUploadSuccess}
				            onWXRecUploadSuccess={this.onWXRecUploadSuccess}
			            />
		            </div>
	            </div>

            </Page>
        );
    }
}

const mapDispatchToProps = {
	getStsAuth,
	uploadRec,
	getWxConfig
};
function mapStateToProps(state) {
    return{
	    homeworkInfo: state.homework.info
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(HomeworkContent);
