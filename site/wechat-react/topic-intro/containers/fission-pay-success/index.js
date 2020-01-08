import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {autobind} from 'core-decorators';
import Page from 'components/page';
import {get} from 'lodash';
import {locationTo, formatMoney} from 'components/util';
import {getQr} from '../../../actions/common'
import {getChannelInfo} from '../../actions/channel'
import {share} from 'components/wx-utils';
import { fillParams } from 'components/url-utils'
import {
    getUserInfo,
} from 'common_actions/common'

@autobind
class PaySuccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            liveId: this.props.location.query.liveId,
            channelId: this.props.location.query.channelId,
            imgUrl: '',
            appId: this.props.location.query.appId,
            unlockCourseInfo: {},
            channel: {}
        }
    }
    
    data = {}
    
    async componentDidMount() {
        await this.props.getUserInfo()
        const channelRes = await this.props.getChannelInfo(this.state.channelId)
        const unlockCourseInfo = get(channelRes, 'data.unlockCourseInfo', {})
        const channel = get(channelRes, 'data.channel', {})
        const res = await this.props.getQr({
            channel: 'unlockCourse',
            channelId: this.state.channelId,
            liveId: this.state.liveId,
            appId: this.state.appId,
        })
        if (res.state.code == 0) {
            this.setState({
                imgUrl: res.data.qrUrl || '',
                unlockCourseInfo: unlockCourseInfo,
                channel: channel
            })
        }
        share({
            title: unlockCourseInfo.shareTitle || `嘀！入学报道！我在学《${channel.name}》`,
            timelineTitle: unlockCourseInfo.shareTitle || `嘀！入学报道！我在学《${channel.name}》`,
            desc: unlockCourseInfo.shareContent || `通过我分享的链接${unlockCourseInfo.discountAmount || 1}元报名,活动结束立刻恢复原价!`,
            timelineDesc: unlockCourseInfo.shareContent || `通过我分享的链接${unlockCourseInfo.discountAmount || 1}元报名,活动结束立刻恢复原价!`, // 分享到朋友圈单独定制
            imgUrl: unlockCourseInfo.shareImage || channel.headImage,
            shareUrl: fillParams({unlockUserId: this.props.userInfo.userId}, window.location.href.replace('/wechat/page/fission-finish-pay', '/wechat/page/channel-intro')),
        })
    }
    
    // 跳转到系列课介绍页
    jumpToChannelIntroPage = () => {
        locationTo(`/wechat/page/channel-intro?channelId=${this.state.businessId}&missionId=${this.state.missionId}`)
    }
    
    render() {
        return (
            <Page title={'支付成功'} className={`fission-pay-success-page`}>
                <div className="bg bg-top"></div>
                <div className="bg bg-middle"></div>
                <div className="bg bg-bottom"></div>
                <div className="main-wrapper">
                    <div className="header">
                        <i></i>
                        <p>成功解锁第一课</p>
                    </div>
                    <div className="main-card">
                        <div className="title"><strong>扫码进入公众号</strong></div>
                        <div className="tip">
                            <span className="tipbar">
                                <span class="arrow-wrapper left">
                                    <i className="arrow-icon arrow-left ani-1"></i>
                                    <i className="arrow-icon arrow-left ani-2"></i>
                                    <i className="arrow-icon arrow-left ani-3"></i>
                                </span>
                                否则无法听课
                                <span class="arrow-wrapper right">
                                    <i className="arrow-icon arrow-right ani-3"></i>
                                    <i className="arrow-icon arrow-right ani-2"></i>
                                    <i className="arrow-icon arrow-right ani-1"></i>
                                </span>
                            </span>
                        </div>
                        <div className="qrCode on-log on-visible"
                             data-log-region="visible-unlockCourse"
                             data-log-pos="unlockCourse"
                        >
	                        <img src={this.state.imgUrl}/>
                        </div>
                        <div className="bottomText">长按识别二维码</div>
                    </div>
                </div>
            </Page>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        userInfo: state.common.userInfo.user || {},
        userId: state.common.userInfo.userId
    }
};

const mapActionToProps = {
    getQr,
    getChannelInfo,
    getUserInfo
};

module.exports = connect(mapStateToProps, mapActionToProps)(PaySuccess);
