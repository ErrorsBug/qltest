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
        appId: ''
    }

    data = {
        isGetQr : false,
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.isSubscribe && nextProps.isSubscribe != this.props.isSubscribe) || (
            nextProps.userId && nextProps.userId != this.props.userId
        )) {
            this.getFollowQr(nextProps);
        }
    }
    
    // 获取关注二维码，如果没有则不显示模块
    async getFollowQr(nextProps) {
        // 如果是管理员则不显示
        if (nextProps.power.allowMGLive || this.data.isGetQr||!nextProps.userId) {
            return false;
        }
        this.data.isGetQr = true;
        
        let { liveId, id } = nextProps.topicInfo;
        let {isLiveAdmin } = nextProps.liveAdmin;
        const result = await whatQrcodeShouldIGet({
            isBindThird: nextProps.isSubscribe.isBindThird,
            isFocusThree: nextProps.isSubscribe.isFocusThree,
            isLiveAdmin,
            options: {
                subscribe: nextProps.isSubscribe.subscribe, 
                channel: 'intro',
                liveId,
                topicId: id,
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
                    <h2>更多话题</h2>
                    <div className="main topic">
                        <QRImg 
                            src = {this.state.url}
                            traceData = "topicIntroQrcode"
                            channel = "intro"
                            appId = {this.state.appId}
                            className="qrcode"
                        />   
                        <div className="desc">
                            <p className="desc-title">{this.renderTitle()}</p>
                            <p className="desc-sub">长按识别二维码，揭秘好友课单</p>
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
        topicId: getVal(state, 'topicIntro.topicInfo.id'),
        liveId: getVal(state, 'topicIntro.topicInfo.liveId'),
        topicInfo : getVal(state, 'topicIntro.topicInfo', {}),
        isSubscribe: getVal(state, 'topicIntro.isSubscribe', null),
        power: getVal(state, 'topicIntro.power', {}),
        liveAdmin: getVal(state, 'topicIntro.isLiveAdmin', {}),
        userId: getVal(state, 'common.userInfo.user.userId'),
    }
}

const mapActionToProps = {
}

export default connect(mapStateToProps, mapActionToProps)(PasterQrcode); 