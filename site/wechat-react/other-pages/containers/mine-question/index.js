import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { getUserInfo } from '../../actions/common';
import { getMyLive, getMySubscribe, getMyCenter } from '../../actions/mine';


import Page from 'components/page';

class MineQuestion extends Component {

    state = {
	    centerData: {}
    }

	async componentDidMount() {
    	if(!this.props.userInfo.user.userId) await this.props.getUserInfo();
    	if(!this.props.liveData.id){
		    this.props.getMyLive(this.props.userInfo.user.userId);
	    }
		if(!this.state.centerData.isWhisperOpen){
			let myCenterTask =  this.props.getMyCenter(this.props.userInfo.user.userId);
			let myCenter = await myCenterTask;
			this.setState({
				centerData: myCenter.data || {}
			});
		}

    }

    myQuestionPageHandle() {
        sessionStorage.setItem('askLiveId', this.props.liveData.id);

    	if(this.state.centerData.isWhisperOpen == 'Y')
            location.href = `/live/whisper/ask.htm?u=${this.props.userInfo.user.userId}&liveId=${this.props.liveData.id}`;
    	else
            location.href = '/live/whisper/setPersonAuth.htm';

    }

    render() {
        return (
            <Page title="个人中心-私问" className='personal-center-pgae question'>
	            <div className="question-nav-box">
		            <div className="personal-center-nav">
			            <div className="item" onClick={this.myQuestionPageHandle.bind(this)}>
				            <div className="text">我的私问主页</div>
				            {this.state.centerData.isWhisperOpen == 'N' && <div className="unopen">未开启</div>}
				            <div className="enter-arrow"></div>
			            </div>
			            <div className="item" onClick={() => location.href = `/live/whisper/findMyAnswer.htm?type=waiting&liveId=${this.props?.liveData?.id || ''}`}>
				            <div className="text">我的回答</div>
				            <div className="enter-arrow"></div>
			            </div>
			            <div className="item" onClick={() => location.href = `/live/whisper/findMyQuestion.htm?liveId=${this.props?.liveData?.id || ''}`}>
				            <div className="text">我的提问</div>
				            <div className="enter-arrow"></div>
			            </div>
		            </div>
	            </div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
	    userInfo: state.common.userInfo,
	    liveData: state.mine.liveData
    }
}

const mapActionToProps = {
	getUserInfo,
	getMyLive,
	getMyCenter
}

module.exports = connect(mapStateToProps, mapActionToProps)(MineQuestion);
