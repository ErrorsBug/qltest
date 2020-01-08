import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import drawRewardCard from '../drawRewardCard';
import { fetchRewardQRCode } from '../../../../actions/thousand-live-common'

@autobind
class RewardCard extends Component {
    state = {
        rewardCard: '',//打赏后的卡片
        noneCard: '',//未打赏的卡片
        show: false,
        type: '',
    }

    // 是否正在进行touch事件
    isTouching = false
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            rewardCard: nextProps.rewardCardCardUrl,
        })
    }


    componentDidMount(){

    }

    async show(type){
        if(type === 'reward' && !this.state.rewardCard){
            const qrUrl = await fetchRewardQRCode('reward',this.props.topicInfo.id,this.props.topicInfo.liveId)
            this.setState({
                rewardCard: await drawRewardCard(this.props.userInfo,{width: 500, height: 889},this.props.topicInfo, type, qrUrl)
            })
        }
        if(type === 'none' && !this.state.noneCard){
            const qrUrl = await fetchRewardQRCode('noReward',this.props.topicInfo.id,this.props.topicInfo.liveId)
            this.setState({
                noneCard: await drawRewardCard(this.props.userInfo,{width: 500, height: 889},this.props.topicInfo, type, qrUrl)
            })
        }
        this.setState({show: true, type})
        // 手动触发曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    touchStartHandle(){
        this.isTouching = true
        this.touchTimer = setTimeout(() => {
            if(this.isTouching){
                console.log(this.state.type === 'reward' ? 'focus-reward' : 'focus-no-reward')
                try {
                    if (typeof _qla != 'undefined') {
                        _qla('event', {
                            category: this.state.type === 'reward' ? 'focus-reward' : 'focus-no-reward',
                            action: 'success',
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


    render() {
        if(this.state.show){
            return createPortal(
                <div className="lucky-card-container">
                    <div className="bg" onClick={()=>{this.setState({show: false})}}></div>
                    <div className="lucky-card-content">
                        <div className="card">
                            <img src={this.state.type == 'reward' ? this.state.rewardCard : this.state.noneCard}
                                className="on-visible"
                                data-log-name="打赏凭证"
                                data-log-region={this.state.type == 'reward'?"visible-reward":"visible-noreward"}
                                onTouchStart = {this.touchStartHandle.bind(this)} 
                                onTouchEnd = {this.touchEndHandle.bind(this)}/>
                        </div>
                        {
                            this.state.type === 'none' && 
                            <div className="tip-container">
                                <div className="share"></div>
                                <div className="tip-group">
                                    <p>分享是对老师最大的赞赏</p>
                                    <p>长按保存海报，邀请朋友来上课</p>
                                </div>
                            </div>
                        }
                        {
                            this.state.type === "reward" &&
                            <div className="tip-container">
                                <div className="tap"></div>
                                <p>长按保存打赏凭证</p>
                            </div>
                        }
                    </div>
                </div>,
                document.body
            );
        }else {
            return null
        }
    }
}

export default RewardCard;