import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { autobind } from 'core-decorators';
import {createPortal} from 'react-dom'
import drawCard from './drawCard'
@autobind
class DiplomaDialog extends Component {

    state = {
        showBox: false,
        card: '',
        show: false,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

    // 是否正在进行touch事件
    isTouching = false
    // 是否请求过配置接口
    isFetch = false

    data = {
        // 是否是白名单
        isWhite: 'N',
        // 是否是专业版
        isLiveAdmin: 'N',
        // 是否是官方直播间
        isOfficialLive: false,
    }

    touchStartHandle(){
        this.isTouching = true
        this.touchTimer = setTimeout(() => {
            if(this.isTouching){
                try {
                    if (typeof _qla != 'undefined') {
                        _qla('event', {
                            category: 'SC-diploma-Focus',
                            action: this.props.topicInfo.style,
                            trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },700)
    }

    touchEndHandle(){
        if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
    }

    async show(data){   
        // 画卡
        this.setState({
            card: await drawCard({
                userInfo: this.props.userInfo,
                title: this.props.topicInfo.topic,
                liveName: this.props.topicInfo.liveName,
                courseImg: this.props.topicInfo.backgroundUrl,
                qrUrl: data.qrUrl,
                browseNum: this.props.topicInfo.browseNum,
                showQl: !data.isFetchFocus,
                cardData: data
            })
        })
        this.setState({show: true})
        // 手动触发曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    hide(){
        this.setState({show: false})
        window._qla && _qla('click', {region: 'SC-diploma-turnoff', pos: this.props.topicInfo.style});
    }

    render() {
        return (
            createPortal(
                <div className="diploma-dialog">
                    <ReactCSSTransitionGroup
                        transitionName="black"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        this.state.show && 
                        <div className="black" onClick={this.props.hideDiploma}></div>
                    }
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                        transitionName="diploma-dialog-container"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        this.state.show && 
                        <div className="diploma-card-container">
                            <div className="down" onClick={this.props.hideDiploma}></div>
                            <div className="share-content">
                                <img src={this.state.card} alt="" 
                                    className="card on-visible" 
                                    data-log-name="成就卡"
                                    data-log-region="visible-achievementCard"
                                    data-log-pos="achievementCard" 
                                    onTouchStart = {this.touchStartHandle.bind(this)} 
                                    onTouchEnd = {this.touchEndHandle.bind(this)}/>
                                <div className="savePicture">长按保存图片</div>
                                <div className="block"></div>
                            </div>
                            <div className="share">
                                <img src={require('./img/share.png')} alt=""/>
                                <p>长按保存毕业证，记录你爱学习的模样~</p>
                            </div>
                        </div>
                    }
                    </ReactCSSTransitionGroup>
                </div>,
                document.body
            )
        )
    }
}

DiplomaDialog.propTypes = {

};

export default DiplomaDialog;