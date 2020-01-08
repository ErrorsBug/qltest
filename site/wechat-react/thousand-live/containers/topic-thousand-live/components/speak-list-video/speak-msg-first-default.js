import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import SpeakMsgContainer from './speak-msg-container';
import { imgUrlFormat } from 'components/util';
import { followLive } from 'thousand_live_actions/thousand-live-common';
import { getVal,isFromLiveCenter } from '../../../../../components/util';
import { locationTo } from 'components/util';
import { whatQrcodeShouldIGet } from 'common_actions/common';
import QRImg from 'components/qr-img';

/**
 * 第一条消息
 *
 * @class FirstSpeakItem
 * @extends {Component}
 */
@autobind
class FirstSpeakItem extends Component {

    state = {
        qrcode: '',
        qrAppId: '',
        showQr: false,
    };

    data = {

    };

    componentDidMount() {
        this.getQr();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.isFollow != this.props.isFollow ||
            nextState.qrcode != this.state.qrcode ||
            nextState.showQl != this.state.showQl;
    }

    /**
     * 关注、取关按钮事件处理
     *
     * @param {any} status
     *
     * @memberof FirstSpeakItem
     */
    async onFocus (status) {
        const result = await this.props.followLive(this.props.liveId, status);

        if (result.state.code == 0) {
            this.setState({
                isFollow: result.data.isFollow
            });
        }

        if(!isFromLiveCenter() && this.state.showQr && !this.props.isCampCourse){
            if(this.props.tracePage ==='coral'){return false;}
            let qrCode = this.props.firstMsgCode || this.state.qrcode
            let appId = this.state.qrAppId
            this.props.showSpeakMsgFirstQrcode(qrCode, appId)
        }
    }

    /**
     * 获取二维码
     *
     *
     * @memberof FirstSpeakItem
     */
    async getQr () {
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

        let result;

        if (this.props.firstMsgCode) { 
            this.setState({
                qrcode: this.props.firstMsgCode,
                showQr: true
            });

        } else {
            if (this.props.isLogin) {
                result = await whatQrcodeShouldIGet({
                    isBindThird,
                    isFocusThree,
                    options: {
                        subscribe,
                        channel: '202',
                        liveId: this.props.liveId,
                        topicId: this.props.topicId,
                    }
                })
            } else {
                result = false;
            }

            if (result) {
                this.setState({
                    qrcode: result.url,
                    qrAppId: result.appId,
                    showQr: true
                });
            } else {
                this.setState({
                    showQr: false
                });
            }
            
        }

    }

    render () {
        return (
            <SpeakMsgContainer
                {...this.props}
                hideFavor = {true}
            >
                {
                    isFromLiveCenter() && this.state.showQr && !this.props.isCampCourse ?
                        <LiveQRcode
                            liveName={this.props.liveName}
                            qrcode={this.props.firstMsgCode || this.state.qrcode}
                            appId = {this.state.qrAppId}
                        />
                        :
                        <LiveCard
                            isFollow={this.props.isFollow}
                            liveName={this.props.liveName}
                            liveLogo={this.props.liveLogo}
                            power={this.props.power}
                            onFocus={this.onFocus}
                            liveId={this.props.liveId}
                        />
                }
            </SpeakMsgContainer>
        );
    }
}

/**
 * 直播间名片
 * @param {*} props
 */
const LiveCard = props => {
    return (
        <div className='live-card-contaner'>
            <main className='card-info' onClick={()=>{locationTo(`/live/${props.liveId}.htm`)}}>
                <img className='card-img' src={imgUrlFormat(props.liveLogo)} alt=""/>
                <p className='card-title elli-text'>{props.liveName}</p>
            </main>

            <footer className='card-footer'>
                <span className='footer-title'>直播间名片</span>

                {
                    (props.power.allowSpeak || props.power.allowMGTopic)?
                    null
                    :
                    props.isFollow ?
                        <span className='btn-focus already on-log'
                            // onClick={ () => {props.onFocus('N')} }
                            data-log-region="speak-list"
                            data-log-pos="first-msg-cancel-focus-btn"
                            >
                            已关注
                        </span>
                        :
                        <span className='btn-focus ready on-log'
                            onClick={ () => {props.onFocus('Y')} }
                            data-log-region="speak-list"
                            data-log-pos="first-msg-focus-btn"
                            >
                            <i className='icon_plus'></i>
                            关注
                        </span>
                }

            </footer>
        </div>
    );
}

/**
 * 直播间二维码
 * @param {*} props
 */
const LiveQRcode = props => {
    function dangerHtml(content) {
        if (content) {
            content = content.replace(/\</g, (m) => "&lt;");
            content = content.replace(/\>/g, (m) => "&gt;");
            content = content.replace(/&lt;br\/&gt;/g, (m) => "<br/>");
        }

        return { __html: content }
    };

    return (
        <div className='live-qrcode-container'>
            <main>
                {/* <img src={props.qrcode} alt=""/> */}
                <div className="img-container">
                    <QRImg 
                        src = {props.qrcode}
                        traceData = 'thousandLiveSpeakMsgFirstQrcode'
                        channel = "202"
                        appId = {props.appId}
                    />
                </div>
                {/* <p
                    className='live-name elli-text'
                    dangerouslySetInnerHTML={dangerHtml(props.liveName)}
                >
                </p> */}
                <div className="tip-container">
                    <p className="tip1">长按识别二维码</p>
                    <p className="tip2">担心课前没通知，课后没回放? 关注直播间，开启你的课程服务</p>
                </div>
            </main>

            {/* <footer>长按二维码查看更多课程</footer> */}
        </div>
    );
}

const mapActionToProps = {
    followLive,
};

function mapStateToProps (state) {
    return {
        isFollow: state.thousandLive.isFollow,
        liveName: state.thousandLive.liveInfo.entity.name,
        liveLogo: state.thousandLive.liveInfo.entity.logo,
        liveId: state.thousandLive.liveInfo.entity.id,
        topicId: state.thousandLive.topicInfo.id,

        isBindThird: state.thousandLive.liveInfo.isBindThird,
        isFocusThree: state.thousandLive.isSubscribe.isFocusThree,
        isShowQl: state.thousandLive.isSubscribe.isShowQl,
        subscribe: state.thousandLive.isSubscribe.subscribe,

        isLiveAdmin: state.common.isLiveAdmin,
        firstMsgCode: state.thousandLive.firstMsgCode,

        isCampCourse: state.thousandLive.topicInfo.isCampCourse === 'Y',
    }
}

export default connect(mapStateToProps, mapActionToProps)(FirstSpeakItem);
