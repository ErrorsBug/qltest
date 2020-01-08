/*
 * @Author: shuwen.wang 
 * @Date: 2017-07-06 11:58:29 
 * @Last Modified by: piaorong.zeng
 * @Last Modified time: 2018-10-11 11:32:35
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    getTopicQr,
    getQr,
} from 'thousand_live_actions/common';

import {
    checkNeedShowQr,
} from 'thousand_live_actions/thousand-live-common';
import { getVal,isFromLiveCenter } from '../../../../../components/util';
import QRImg from 'components/qr-img';
import { whatQrcodeShouldIGet } from 'common_actions/common';
import { getCoralQRcode } from 'common_actions/coral';

const ANIMATION_PATH = 'https://media.qlchat.com/qlLive/activity/file/MIJFJ2EE-TQNC-XBVJ-1567396191893-5JV3PNM6W8V1.json';

class BottomQrcode extends Component {

    state = {
        // 用户发言锁（true表示用户未在发言的过程中）
        bottomQrcodeLock: true,
        // 是否有资格显示底部二维码弹窗（有二维码的时候就有资格）
        canShow: false,
        qrcodeUrl: '',
        qrAppId: '',
        isNew: '',
    };

    data = {};

    lottie = null;

    async componentDidMount() {

        await this.checkCanPop();

        const tracePage = sessionStorage.getItem('trace_page')
        // 非直播中心进来的用户才显示底部二维码
        if (!isFromLiveCenter()) {
            if(this.props.source === 'coral'||tracePage==="coral"){
                this.checkCoralSubscribe();
            }else {
                this.checkSubscribe()
            }
            
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            bottomQrcodeLock: nextProps.bottomQrcodeLock
        })
    }

    componentWillUnmount() {
        /* 清除计时器*/
        this.timeout = null
    }

    async checkCanPop() {
        try {
            const res = await checkNeedShowQr();
            console.log('res', res);
            let canShowQr = false;

            if (getVal(res, 'state.code') == 0) {
                let isNew = getVal(res, 'data.isNew', 'N');
                let reShowTime = getVal(res, 'data.reShowTime', 0);

                if (isNew == 'N') {
                    let prevTime = localStorage.getItem('CHECK_NEED_SHOW_QR_TIME');
                    let diffTime = Date.now() - prevTime;


                    if (diffTime > (reShowTime * 60 * 60 * 1000)) {
                        canShowQr = true;
                        localStorage.setItem('CHECK_NEED_SHOW_QR_TIME', Date.now());
                    }

                }
            }

            this.setState({
                canShowQr,
            });
        } catch (error) {
            console.error(error);
        }
       
    }

    async checkCoralSubscribe(){
        let coralQRcode = await getCoralQRcode({
            channel: 'detailPageCoral',
            channelId: this.props.channelId,
            topicId: this.props.topicId,
        });
        if(coralQRcode){
            this.setState({
                qrcodeUrl: coralQRcode.qrUrl,
                qrAppId: coralQRcode.appId,
            });
            this.timeout = setTimeout(() => {
                this.setState({ canShow: true })
                this.showAni();
            }, 10 * 1000)
        }
    }

    // 平台板二维码判断
    async checkSubscribe() {
        /* B端或者在三方白名单内则不显示*/
        if (this.props.allowSpeak) {
            return false
        }
        let result = await whatQrcodeShouldIGet({
            isBindThird: this.props.isBindThird,
            isFocusThree: this.props.isFocusThree,
            options: {
                subscribe: this.props.subscribe,
                channel: '208',
                liveId: this.props.liveId,
                topicId: this.props.topicId,
            }
        })
        if (result) {
            this.setState({ 
                qrcodeUrl: result.url,
                qrAppId: result.appId,
            });
            this.timeout = setTimeout(() => {
                this.setState({ canShow: true })
                this.showAni();
            }, 10 * 1000)
        } 
    }

    async showAni() {
        // 延迟加载lottie
        if(!this.lottie) {
            this.lottie = await require.ensure([], (require) => {
                return require('lottie-web');
            });
        }
        typeof document != "undefined" && document.getElementById('bottomQrcode')&&this.lottie.loadAnimation({
            container: document.getElementById('bottomQrcode'), // the dom element that will contain the animation
            renderer: 'svg', //渲染出来的是什么格式
            loop: true,  //循环播放
            autoplay: true, //自动播放
            path: ANIMATION_PATH // the path to the animation json
        });
    }

    /* 隐藏组件*/
    hideComp = () => {
        this.setState({
            canShow: false 
        })
    }

    render() {
        // 未开播且话题未结束不显示
        let {
            currentTimeMillis: now,
            startTime,
            topicStatus,
        } = this.props;
        if(now < startTime && topicStatus != "ended"){
            return ""
        }

        return (
            <ReactCSSTransitionGroup
                transitionName="thousand-live-animation-bottomQrcode"
                transitionEnterTimeout={350}
                transitionLeaveTimeout={350}>
                {
                    // 只有在用户是在非发言状态且有二维码的时候才显示底部二维码
                    this.state.canShow && this.state.bottomQrcodeLock &&
                    <div className='bottom-qrcode-container' ref='qrcode'>

                        <div id="bottomQrcode"></div>
                        <QRImg 
                            src = {this.state.qrcodeUrl}
                            traceData = "thousandLiveBottomQrcode"
                            className = "qrcode"
                            appId = {this.state.qrAppId}
                            channel = "208"
                        />
                        <div className="close-wrap">
                            <div className="close" onClick={this.hideComp} />
                        </div>
                    </div>
                }
            </ReactCSSTransitionGroup>
        );
    }
}

BottomQrcode.propTypes = {
};


function mapStateToProps(state) {
    return {
        liveId: state.thousandLive.topicInfo.liveId,
        channelId: state.thousandLive.topicInfo.channelId,
        subscribe: state.thousandLive.isSubscribe.subscribe,
        allowSpeak: state.thousandLive.power.allowSpeak,
        isShowQl: state.thousandLive.isSubscribe.isShowQl,

        topicId: state.thousandLive.topicInfo.id,
        startTime: state.thousandLive.topicInfo.startTime,
        currentTimeMillis: state.thousandLive.currentTimeMillis,
        topicStatus: state.thousandLive.topicInfo.status,

        isBindThird: state.thousandLive.liveInfo.isBindThird,
        isFocusThree: state.thousandLive.isSubscribe.isFocusThree,

        isLiveAdmin: state.common.isLiveAdmin,
        isCampCourse: state.thousandLive.topicInfo.isCampCourse === 'Y',
    }
}

const mapActionToProps = {
    getTopicQr,
    getQr,
};

export default connect(mapStateToProps, mapActionToProps)(BottomQrcode);
