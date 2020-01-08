import React, { Component } from 'react';
import { connect } from 'react-redux';
import AudioPlayerController from '../audio-player-controller';
import { imgUrlFormat , formatMoney, locationTo} from 'components/util';
import classnames from 'classnames';

import {
    fetchMediaUrl,
} from 'thousand_live_actions/thousand-live-av';


class AudioBanner extends Component {

    state = {
        isShareTagShow: true
    }

    componentDidMount() {
        // console.log('audio banner');
        typeof _qla != 'undefined' && _qla.collectVisible();
    }

    playAuth = () => {
        return this.props.clientBListen == 'Y' ? true :
            this.props.power.allowMGLive ? 
                true :
                this.props.isAuth
    }

    toogleShareTagShow = (param) => {
        this.setState({isShareTagShow: param});
        this.props.playStatus(param);
    }
    
    render() {
        const isSingleBuy = this.props.topicInfo.isSingleBuy === 'Y';
        return (
            <div>
                <div className='topic-banner-container'>
                    <img className='banner' src={`${imgUrlFormat(this.props.topicInfo.backgroundUrl,'?x-oss-process=image/resize,h_625,w_1000,limit_0,m_fill')}`} />
                    {
                        !this.props.topicInfo.campId && 
                        ((this.props.topicInfo.isAuditionOpen == 'Y' && !this.props.power.allowMGLive) ?
                            <div className='free-audio-tips'>您可免费试听音频，开通会员后即可完整收听</div>
                        : (this.props.topicInfo.isAuditionOpen == 'Y' && this.props.power.allowMGLive) ?
                            <div className='free-audio-tips'>已开通免费试听</div>
                        :null)

                    }
                    {
                        !this.props.topicInfo.campId && 
                        (this.props.power.allowMGLive ?
                            <a className='push-btn on-log'
                                data-log-region="show-push-graphic-topic-dialog"    
                                onClick={this.props.pushTopic}>推送通知</a>
                        : null)
                    }
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

                        !this.props.power.allowMGLive ?
                            this.state.isShareTagShow &&
                            !this.props.topicInfo.campId &&
                            (this.props.showMyInvitationCardBtn ?
                            <div className={
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
                            :null)
                        : (
                            <div 
                                className="course-data-entrance on-log on-visible"
                                data-log-region="DataCard"
                                data-log-pos={`tap_${this.props.topicInfo.style}`}
                                onClick={() => locationTo(`/wechat/page/course-data-card/${this.props.topicInfo.id}`)}>直播数据
                            </div>
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
                   
                   
                </div>

                <AudioPlayerController
                    fetchMediaUrl = {this.props.fetchMediaUrl}
                    topicId = {this.props.topicInfo.id}
                    lastTopicId = {this.props.lastTopicId}
                    nextTopicId = {this.props.nextTopicId}
                    isAuth = {this.playAuth()}
                    topicInfo = {this.props.topicInfo}
                    channelInfo = {this.props.channelInfo}
                    showPayTopic = {this.props.showPayTopic}
                    showGotoNext = {this.props.showGotoNext}
                    shareKey = {this.props.location.query.shareKey||''}
                    power={this.props.power}
                    userId ={this.props.userId}
                    compliteStatus={(this.props.pushCompliteInfo && this.props.pushCompliteInfo.achievementCardRecord) || {}}
                    pushCompliteFun={this.props.pushCompliteFun}
                    getArchivementCardBtn={this.props.getArchivementCardBtn}
                    getArchivementCardModal={this.props.getArchivementCardModal}
                    showCourseListDialog={this.props.showCourseListDialog}
                    courseList={this.props.courseList}
                    ref={c => (this.audioPlayerControllerRef = c)}
                    toogleShareTagShow={this.toogleShareTagShow}
                />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        topicInfo: state.thousandLive.topicInfo,
        channelInfo: state.thousandLive.channelInfo,
        power: state.thousandLive.power,
        isAuth: state.thousandLive.isAuth,
        userId: state.thousandLive.userId || null,
        lshareKey: state.thousandLive.lshareKey,
        pushCompliteInfo: state.thousandLive.pushCompliteInfo,
        clientBListen: state.thousandLive.clientBListen,
        
    }
}

const mapActionToProps = {
    fetchMediaUrl,
    
};

module.exports = connect(mapStateToProps, mapActionToProps, null, { withRef: true })(AudioBanner);