import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { Confirm } from 'components/dialog';
import QRImg from 'components/qr-img';
import { imgUrlFormat } from 'components/util';
import { whatQrcodeShouldIGet } from 'common_actions/common';
import FollowDialog from 'components/follow-dialog';

@autobind
class CommencementQrcode extends Component {

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

        followDialogOption: {
            channel: '102',
            traceData: 'thousandLiveCommencementQrcode',
        }
    }
    
    componentDidMount() {
        this.showQrcodeDialog();
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
                channel: '102',
                liveId: this.props.liveId,
                topicId: this.props.topicId,
            }
        })
        if (result) {
            let followDialogOption = this.state.followDialogOption
            followDialogOption.appId = result.appId
            this.setState({
                qrcode: result.url,
                qrAppId: result.appId,
                followDialogOption
            });
            this.refs.followDialog.show();
        }
    }

    onClickClose(){
        this.refs.followDialog.hide();
    }


    render() {
        if(this.props.isCampCourse) {
            return ""
        }
        return (
            <FollowDialog 
                ref='followDialog'
                title='开播提醒'
                desc='太忙了，常常忘记上课？开课前15分钟，老师贴心提醒你'
                qrUrl={ imgUrlFormat(this.state.qrcode,'?x-oss-process=image/resize,h_100,w_100,m_fill') }
                option={ this.state.followDialogOption }
            />
        );
    }
}

CommencementQrcode.propTypes = {
    
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

export default connect(mapStateToProps, mapActionToProps)(CommencementQrcode);
