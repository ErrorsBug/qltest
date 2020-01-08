import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fail } from 'assert';

import { connect } from 'react-redux';

import { getVal } from 'components/util';

import QRImg from 'components/qr-img';
import {
    whatQrcodeShouldIGet,
} from 'common_actions/common';

class FollowQlCode extends Component {
    state = {
        show: true,
        url:'',
        appId: '',
    }

    data = {
        isGetQr : false,
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSubscribe && nextProps.isSubscribe != this.props.isSubscribe) {
            this.getFollowQr(nextProps);
        }
    }
    
    // 获取关注二维码，如果没有则不显示模块
    async getFollowQr(nextProps) {
        // 如果是管理员则不显示
        if (nextProps.power.allowMGLive || this.data.isGetQr) {
            return false;
        }
        this.data.isGetQr = true;
        
        let { liveId, id } = nextProps.topicInfo;
        let {isLiveAdmin } = nextProps.liveAdmin;
        const result = await whatQrcodeShouldIGet({
            isBindThird: nextProps.isBindThird,
            isFocusThree: nextProps.isFocusThree,
            isLiveAdmin,
            options: {
                subscribe: nextProps.subscribe, 
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


    render() {
        if (this.state.show && this.state.url) {
            return (
                <div className='flollow-ql-code'>
                    <span className="btn-close icon_cross" onClick={this.hideCode}></span>  
                    <QRImg 
                        src = {this.state.url}
                        traceData = "topicIntroQrcode"
                        channel = "intro"
                        appId = {this.state.appId}
                        className="qrcode"
                    />  
                    {/* <img className="qrcode" src={this.state.url} /> */}
                    <div className="content">
                        <p >长按识别二维码</p>
                        <p >查看该直播间更多精彩话题</p>
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
        userId: getVal(state, 'topicIntro.userId'),
        topicId: getVal(state, 'topicIntro.topicInfo.id'),
        liveId: getVal(state, 'topicIntro.topicInfo.liveId'),
        topicInfo : getVal(state, 'topicIntro.topicInfo', {}),
        isSubscribe: getVal(state, 'topicIntro.isSubscribe', null),
        power: getVal(state, 'topicIntro.power', {}),
        liveAdmin:getVal(state, 'topicIntro.isLiveAdmin',{}),
    }
}

const mapActionToProps = {
}

export default connect(mapStateToProps, mapActionToProps)(FollowQlCode); 