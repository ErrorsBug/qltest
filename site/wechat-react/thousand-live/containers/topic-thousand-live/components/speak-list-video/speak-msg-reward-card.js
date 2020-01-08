import React, { Component } from 'react';
import drawRewardCard from '../drawRewardCard';
import {fetchRewardQRCode} from '../../../../actions/thousand-live-common';

export default class RewordCard extends Component {
    render(){
        return (
            <div className="reward-card-speak-container">
                <div className="speak-head">
                    <img src={this.props.byAwardPersonHeadImgUrl} alt=""/>
                </div>
                <span className="speak-box">
                    <span className="msg-box">
                        <div className="name">
                            <b>{this.props.byAwardPersonUserName}</b>
                        </div>
                        <div className="text">
                            <pre className="div-p">{this.props.userInfo.name}同学，你的认可是我前进的动力！这是你的打赏凭证，可直接长按保存~<br/></pre>
                        </div>
                        <div className="card" onClick={()=>{this.props.showRewardCard('reward')}}>
                            <div className="img">
                                <img src={this.props.rewardCardCardUrl} alt=""/>
                            </div>
                            <div className="tip">查看详情</div>
                        </div>
                    </span>
                </span>
            </div>
        )
    }
}