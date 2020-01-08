import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { imgUrlFormat , formatMoney, locationTo} from 'components/util';
import VideoPlayerController from '../video-player-controller';
import classnames from 'classnames';

import { getMediaActualUrl } from '../../../../../video-course/actions/video'

import {
    getSysTime,
} from 'thousand_live_actions/common';


class VideoBanner extends Component {

    state = {
        isShareTagShow: true,
        // 视频资源链接
        videoSourceUrl: '',
        // 视频时长
        duration: 0,
    }

    componentDidMount(){
        typeof _qla != 'undefined' && _qla.collectVisible();
    }

    playAuth = () => {
        return this.props.clientBListen == 'Y' ? true :
            this.props.power.allowMGLive ? 
                true :
                this.props.isAuth
    }

    toogleShareTagShow = (param) => {
        this.setState({isShareTagShow: param})
    }


    render() {
        const isSingleBuy = this.props.topicInfo.isSingleBuy === 'Y';
        return (
            <div className='media-box'>
                {/* 单节付费才显示邀请卡 */}
                {
                    this.state.isShareTagShow &&
                    !this.props.topicInfo.campId &&
                    (this.props.showUncertainShareBtn &&
                    <div className="share-tag uncertain" onClick={e => this.props.uncertainShareBtnClickHandle()}>
                        分享赚
                    </div>)
                }
                {
                    /* 根据课程数据邀请卡需求，B端暂时隐藏该功能，改由数据卡替代 */

                    this.props.power.allowMGLive ? (
                        <div 
                            className="course-data-entrance on-log on-visible"
                            data-log-region="DataCard"
                            data-log-pos={`tap_${this.props.topicInfo.style}`}
                            onClick={() => locationTo(`/wechat/page/course-data-card/${this.props.topicInfo.id}`)}>直播数据
                        </div>
                    ) : 
                        this.state.isShareTagShow &&
                        !this.props.topicInfo.campId &&
                        (
                            this.props.showMyInvitationCardBtn ?
                                <div 
                                    className={
                                        classnames(
                                            'share-tag',
                                            'my-invitation-card'
                                            // 下面是否显示赚多少钱
                                            // this.props.lshareKey && this.props.lshareKey.shareKey && isSingleBuy ? '' : 'my-invitation-card'
                                        )
                                    } 
                                    onClick={ () => {this.props.onShareCardClick()} }
                                >
                                    <div className="final-tag"></div>
                                    {/* 下面是显示赚多少钱 */}
                                    {/* {
                                        this.props.lshareKey && this.props.lshareKey.shareKey && isSingleBuy && 
                                        <span className="share-word">
                                            赚 {
                                                formatMoney((this.props.shareEarningPercent || this.props.shareEarningPercent) / 100 * this.props.topicInfo.money) 
                                            }
                                        </span>
                                    } */}
                                </div> 
                            : null
                        )
                }
                {/* 单节付费才显示珊瑚计划 */}
                {
                    this.state.isShareTagShow &&
                    !this.props.topicInfo.campId &&
                    (this.props.showShareCoralBtn &&
                    <div className="share-tag coral-share" onClick={ e => this.props.showCoralPromoDialog() }>
                        分享 | 赚{formatMoney(this.props.coralPercent / 100 * this.props.topicInfo.money)}元
                    </div>)
                }
                
                {
                    this.playAuth() ?
                        <VideoPlayerController
                            topicInfo={this.props.topicInfo}
                            fetchMediaUrlAction={this.props.fetchMediaUrl}
                            toogleShareTagShow={this.toogleShareTagShow}
                        />
                    :    
                        <div className="cover-wrap"
                            onClick={this.props.showPayTopic}
                            >
                            <img id="bg-img" crossOrigin="" className="bg-img" src={`${imgUrlFormat(this.props.topicInfo.backgroundUrl, '?x-oss-process=image/resize,h_420,w_750,m_fill,limit_0')}`} />
                            <i className="btn-play icon_audio_play"></i>
                        </div>
                } 
                
            </div>   
                
        );
    }
}

function mapStateToProps (state) {
    return {
        sysTime: state.common.sysTime,
        topicInfo: state.thousandLive.topicInfo,
        isAuth: state.thousandLive.isAuth,
        lshareKey: state.thousandLive.lshareKey,
        clientBListen: state.thousandLive.clientBListen,
        power: state.thousandLive.power,
    }
}

const mapActionToProps = {
    fetchMediaUrl: getMediaActualUrl,
    getSysTime,
};

module.exports = connect(mapStateToProps, mapActionToProps)(VideoBanner);