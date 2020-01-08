import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Detect from 'components/detect';
import Page from 'components/page';
import { apiService } from "components/api-service";

@autobind
class TabletAudio extends Component {

	state = {
        courseInfo: {},
        isPc: false
	}

	// 是否正在进行touch事件
	isTouching = false

	async componentDidMount(){
        // 需要重置 app-wrap的max-width
        let appWrap = document.querySelector('.app-wrap')
        appWrap.setAttribute('style', 'max-width: 100%')
        this.getTopicInfo()

        this.setState({
            isPc: !Detect.os.weixin
        })
    }
    componentWillUnmount() {
        let appWrap = document.querySelector('.app-wrap')
        appWrap.removeAttribute('style')
    }
    getTopicInfo() {
        return apiService.get({
            url: '/h5/topic/get',
            body: {
                topicId: this.props.location.query.topicId
            }
        }).then(res => {
            if (res.state.code == 0) {
                this.setState({
                    courseInfo: res.data.topicPo
                });
            }
        })
    }


	render(){
		
		return (
			<Page title="音频" className='tablet-audio-wrap'>
				<div className="tablet-audio-box">
                    {
                        this.state.courseInfo.audioAssemblyUrl ?
                        <video controls autoplay name="media">
                            <source src={this.state.courseInfo.audioAssemblyUrl} />
                        </video>
                        
                        : <div className="no-auiod-text">暂无合成音频</div>
                    }
                </div>
                {
                    this.state.courseInfo.audioAssemblyUrl && !this.state.isPc &&
                    <img src={require('./img/icon_wxtc.png')} className="guide-img"/>
                }
			</Page>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		
	}
};

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(TabletAudio);