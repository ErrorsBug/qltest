import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { Confirm } from 'components/dialog';
import QRImg from 'components/qr-img';
import { imgUrlFormat } from 'components/util';
import { whatQrcodeShouldIGet } from 'common_actions/common';
import IntroQrCodeDialog from 'components/intro-qrCode-dialog'

@autobind
class FollowQrcode extends Component {

    state = {
        qrcode: '',
        qrAppId: '',
        timeStr: '',
        hasFocus: false,
        focusTip: '',
        // 是否有三方导粉公众号
        appBindLive: false,
        // 三方导粉公众号绑定的直播间id
        liveId: '',
        focusLiveType:'',
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showDialog) {
            this.showQrcodeDialog();
        }
    }
    
    componentDidMount() { 
    }

    async showQrcodeDialog() {
        let {
            // 是否绑定三方
            isBindThird,
            // 是否关注三方
            isFocusThree,
            // 是否关注千聊
            subscribe,
            // 是否专业版
            isLiveAdmin,
        } = this.props;

        const result = await whatQrcodeShouldIGet({
            isBindThird,
            isFocusThree,
            options: {
                subscribe,
                channel: '204',
                liveId: this.props.liveId,
                topicId: this.props.topicId,
            }
        })

        if (result) {
            this.setState({
                focusLiveType:'focusClick',
                qrcode: result.url,
                qrAppId: result.appId,
            });
            this.introQrCodeDialogDom.show();
        }
        // 禁用关注确认弹窗
        // else{
        //     this.setState({
        //         focusLiveType:'focusliveConfirmClick',
        //     });
        //     this.introQrCodeDialogDom.show();
        // }
    }

    onClickClose(){
        this.props.onClose&& this.props.onClose();
        this.introQrCodeDialogDom.hide();
    }


    render() {
        if(this.props.isCampCourse) {
            return ""
        }

        const option = {
            traceData: "thousandLiveFollowQrcode",
            channel: "204",
            appId: this.state.qrAppId,
        }

        return (
            <IntroQrCodeDialog 
                ref={ dom => dom && (this.introQrCodeDialogDom = dom) }
                onClose = {this.onClickClose}
                qrUrl={ ` ${imgUrlFormat(this.state.qrcode,'?x-oss-process=image/resize,h_100,w_100,m_fill')}` }
                option={ option }
                followDialogType = {this.state.focusLiveType}
                focusLiveConfirm = {this.props.focusLiveClick}
                relationInfo = {this.props.relationInfo}
            />
        );
    }
}

FollowQrcode.propTypes = {
    
};

const mapStateToProps = state => ({
    liveName: state.thousandLive.liveInfo.entity.name,
    liveLogo: state.thousandLive.liveInfo.entity.logo,
    liveId: state.thousandLive.liveInfo.entity.id,
    topicId: state.thousandLive.topicInfo.id,
    power: state.thousandLive.power,

    isBindThird: state.thousandLive.liveInfo.isBindThird,
    isFocusThree: state.thousandLive.isSubscribe.isFocusThree,
    isShowQl: state.thousandLive.isSubscribe.isShowQl,
    subscribe: state.thousandLive.isSubscribe.subscribe,

    isLiveAdmin: state.common.isLiveAdmin,
    isCampCourse: state.thousandLive.topicInfo.isCampCourse === 'Y',
});

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(FollowQrcode);
