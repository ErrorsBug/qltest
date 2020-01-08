import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';

import FollowQlMiddleDialog from '../follow-ql-middle-dialog';

import {
    getQr,
} from '../../../../../actions/common';


class FollowLiveTopBar extends Component {
    state = {
        showModule : false,
        showDialog : false,
        qrUrl : '',
    }

    data = {
        isGetQr : false,
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSubscribe && nextProps.isSubscribe != this.props.isSubscribe) {
            this.getQrCode(nextProps);
        }
    }
    
    async getQrCode(props) {
        // 三方分销进来的,不是三方白名单，不判断是否关注三方，只判断是否关注千聊
        if (props.liveInfo.isWhite === 'Y' || props.isSubscribe.subscribe || this.data.getQr) {
            return false;
        }
        
        this.data.isGetQr = true;

        let result = await props.getQr({
            channel: 111, //三方分销 话题介绍页顶部 引导关注千聊二维码
            liveId: props.topicInfo.liveId,
            topicId: props.topicInfo.topicId,
        })

        if (result.state && result.state.code == '0') {
            this.setState({
                showModule:true,
                qrUrl:result.data.qrUrl
            })
        }
    }

    showDialog = () => {
        this.setState({
            showDialog:true
        })
    }

    hide = () => {
        this.setState({
            showDialog:false
        })
    }

    render() {
        if (this.state.showModule) {
            return (
                <div className='follow-ql-top'>
                    <img className="icon-qlchat" src={require('./img/ql-logo.png')} />
                    <span className="content">关注千聊获取更多优质课程</span>
                    <span className="btn-follow" onClick={this.showDialog}>立即关注</span>
                    
                    {
                        this.state.showDialog ?
                        <FollowQlMiddleDialog
                            hide = {this.hide}
                            qrUrl = {this.state.qrUrl}
                        />    
                        :null
                    }
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
        liveInfo : getVal(state, 'topicIntro.liveInfo', {}),
        isSubscribe:getVal(state, 'topicIntro.isSubscribe', null),
    }
}

const mapActionToProps = {
    getQr,
}

export default connect(mapStateToProps, mapActionToProps)(FollowLiveTopBar); 