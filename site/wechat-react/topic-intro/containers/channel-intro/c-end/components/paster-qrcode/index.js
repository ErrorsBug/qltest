import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fail } from 'assert';

import { connect } from 'react-redux';

import { getVal, isFromLiveCenter } from 'components/util';

import QRImg from 'components/qr-img';
import {
    whatQrcodeShouldIGet
} from 'common_actions/common';

class PasterQrcode extends Component {
    state = {
        show: true,
        url:'',
        appId: '',
    }

    data = {
        isGetQr : false,
    }

    componentDidMount() {
        this.getFollowQr(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.isSubscribe != undefined && nextProps.isSubscribe != this.props.isSubscribe)|| (
            nextProps.userId && nextProps.userId != this.props.userId
        )) {
            this.getFollowQr(nextProps);
        }
    }
    
    // 获取关注二维码，如果没有则不显示模块
    async getFollowQr(nextProps) {
        // 如果是管理员则不显示
        if (this.props.power.allowMGLive||!nextProps.userId) {
            return false;
        }
        const result = await whatQrcodeShouldIGet({
            isBindThird: nextProps.isBindThird,
            isFocusThree: nextProps.isFocusThree,
            options: {
                subscribe: nextProps.isSubscribe, 
                channel: 'serintro',
                liveId: this.props.liveId,
                channelId: this.props.channelId,
            }
        })
        if(result){
            this.setState({ 
                url: result.url,
                appId: result.appId,
             })
        }

    }
 
    hideCode = () => {
        this.setState({
            show: false
        })
    }

    
    async getRelationInfo() {
        const res = await fetchRelationInfo({
            userId: this.props.userId
        })
        if(res.state.code === 0) {
            this.setState({

            })
        }
    }


    renderTitle() {
        const { relationInfo } = this.props;
        if(relationInfo && relationInfo.friendNum > 0) {
            return `${relationInfo.friendName}等${relationInfo.friendNum}人邀请你一起学习`;
        } else {
            return '有3位好友邀请你一起学习';
        }
    }


    render() {
        if (this.state.show && this.state.url && !isFromLiveCenter()) {
            return (
                <div className='paster-qrcode'>
                    <div className="main channel">
                        <QRImg 
                            src = {this.state.url}
                            traceData = "channelQrcode"
                            channel = "serintro"
                            appId = {this.state.appId}
                            className="qrcode"
                        /> 
                        <div className="desc">
                            <p className="desc-title">{this.renderTitle()}</p>
                            <p className="desc-sub">长按识别二维码，揭秘好友课单!</p>
                        </div>
                        <img 
                            className="close" 
                            src={require('./img/close.png')} 
                            onClick={this.hideCode}
                        />
                    </div>
                </div>
            );
            
        } else {
            return null;
        }
    }
}



function mapStateToProps (state) {
    return {
        channelInfo: state.channelIntro.channelInfo,
        channelId: state.channelIntro.channelId,
        liveId: state.channelIntro.liveId,
        isSubscribe: state.channelIntro.isSubscribe,
        power: state.channelIntro.power||{},
        isLiveAdmin: state.channelIntro.isLiveAdmin,
        isFocusThree: state.channelIntro.isFocusThree,
        isBindThird: state.channelIntro.isBindThird,
        userId: state.channelIntro.userId,
    }
}

const mapActionToProps = {
}

export default connect(mapStateToProps, mapActionToProps)(PasterQrcode); 