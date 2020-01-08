import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import BottomDialog from 'components/dialog/bottom-dialog';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    locationTo,
    getVal,
} from 'components/util';
import { request } from 'common_actions/common';

@autobind
class SimpleControlDialog extends Component {

    state={
        isShow: false,
        isOpenEvaluate: false,
        collected:false,
    }

    componentDidMount() {
        this.getIsOpenEvaluate();
        
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextState.isShow && !this.state.isShow) {
            this.isCollected();
        }
    }
    

    show=()=> {
        this.setState({
            isShow:true,
        })
        typeof _qla != 'undefined' && _qla.collectVisible();
    }
    hide=()=> {
        this.setState({
            isShow:false,
        })
    }

    gotoComment=()=>{
        locationTo(`/wechat/page/evaluation-create/${this.props.topicId}`)
    }

    //获取是否开启评价
    getIsOpenEvaluate() {
        if (!getVal(this.props,'topicInfo.liveId','')) {
            return
        }
        return request({
            url: '/api/wechat/evaluation/getIsOpenEvaluate',
            method: 'GET',
            body: {
                liveId:this.props.topicInfo.liveId
            }
        }).then(res => {
            let isOpenEvaluate = getVal(res, 'data.isOpenEvaluate', '');
            this.setState({
                isOpenEvaluate:isOpenEvaluate=='Y'
            })
        })
    }
    
    // 获取是否收藏
    async isCollected(){
        return request({
            url: '/api/wechat/mine/isCollected',
            method: 'POST',
            body: {
                businessId: this.props.topicInfo.id,
                type: 'topic'
            }
        }).then(res => {
            if(res.state.code === 0){
                this.setState({
                    collected: res.data.isCollected === 'Y'
                });
            }
        })
    	
    }
    async collect(){
        if(this.state.collected){
            this.cancelCollect();
    		return false;
	    }
        return request({
            url: '/api/wechat/mine/addCollect',
            method: 'POST',
            body: {
                businessId: this.props.topicInfo.id,
                type: 'topic'
            }
        }).then(res => {
            if(res.state.code === 0){
                window.toast('收藏成功');
                this.setState({
                    collected: true
                });
            }else{
                window.toast(res.state.msg);
            }
        })
    	
    }

    async cancelCollect() {
        return request({
            url: '/api/wechat/mine/cancelCollect',
            method: 'POST',
            body: {
                businessId: this.props.topicInfo.id,
                type: 'topic'
            }
        }).then(res => {
            if(res.state.code === 0){
                window.toast('已取消收藏');
                this.setState({
                    collected: false
                });
            }else{
                window.toast(res.state.msg);
            }
        })
		
	}

    render() {
        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-middle");

        if (!portalBody) {
            return null;
        }
        
        return (
            createPortal(
                <ReactCSSTransitionGroup
                    transitionName="course-video-page-menu"
                    transitionEnterTimeout={3000}
                    transitionLeaveTimeout={3000}
                >
                    <BottomDialog
                        show = {this.state.isShow}
                        bghide = {true}
                        theme="empty"
                        onClose = {this.hide}
                        className = "simple-control-dialog"
					>
						<div className="simple-control-main">
                            <div className="title-bar">
                                更多操作
                                <div className="btn-close icon_cross"  onClick={this.hide}></div>
                            </div>
                            <div className="control-container">
                                <ul>
                                    {
                                        (!(this.props.power.allowMGTopic||this.props.power.allowSpeak) && this.state.isOpenEvaluate&&this.props.topicInfo.isAuditionOpen != "Y")&&
                                        <li className='on-log on-visible'
                                            onClick={this.gotoComment}
                                            data-log-region="bottom-control-dialog"
                                            data-log-pos="appraise-btn"
                                        >
                                            <i className='icon-comment'></i><span>评价课程</span><i className='icon_enter'></i>
                                        </li>
                                    }
                                    <li className='on-log on-visible'
                                        data-log-region="bottom-control-dialog"
                                        data-log-pos="favarite-btn"
                                        onClick={this.collect}>
                                        <i className={this.state.collected ? 'icon-collected' : 'icon-collect'}></i><span>{this.state.collected && '已'}收藏</span></li>
                                </ul>
                            </div>
						</div>
                    </BottomDialog>
                </ReactCSSTransitionGroup>,
            portalBody)
        );
    }
}

SimpleControlDialog.propTypes = {

};

export default SimpleControlDialog;