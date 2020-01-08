import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { imgUrlFormat , formatMoney , formatDate} from 'components/util';





class VideoTipsBar extends Component {

    state = {
    }

    componentDidMount() {
    }


    render() {
        return (
            <div className="video-tips-bar">
                <span className="topic-info-tips">
                {/* c端左侧文案
                    1.已购
                    已购买本视频课程，可支持回听
                    2.未购
                    还未购买本视频课程
                    3.开通了免费试听
                    可免费试听本视频，购买系列课即可收听所有课程
                    b端左侧文案
                    1.开通了免费试听
                    已开通免费试听
                    2.已开通单节购买
                    已开通单节购买：￥9.9
                    3.未开通免费试听和单节购买
                    上传     */
                }
                {
                    !this.props.power.allowMGLive ?
                    (
                        this.props.topicInfo.isAuditionOpen != 'Y' ?
                        (this.props.isAuth ? '已购买本视频课程，可支持回听' : '还未购买本视频课程')
                        : '可免费试听本视频，购买系列课即可收听所有课程'
                    )
                    :
                    (
                        this.props.topicInfo.isAuditionOpen == 'Y' ?
                        '开通了免费试听' :
                        this.props.topicInfo.isSingleBuy == 'Y' ?
                        `已开通单节购买：￥${formatMoney(this.props.topicInfo.money)}`    
                        : `${formatDate(this.props.topicInfo.startTime,'yyyy-MM-dd hh:mm')} 上传`
                    )
                }        
                </span>
                {
                    this.props.power.allowMGLive && !this.props.topicInfo.campId ?
                    <span className="btn btn-push" onClick={this.props.pushTopic}>
                        <i className='icon icon_ring'></i>
                        <b>推送通知</b>
                        </span>
                    :null    
                }
                {
                    this.props.topicInfo.isSingleBuy == 'Y' && this.props.showMyInvitationCardBtn ?
                    <span className="btn btn-share-card" onClick={ this.props.onShareCardClick }>
                        <i className='icon icon_share3'></i>
                        <b>{this.props.lshareKey&&this.props.lshareKey.shareKey?'推广赚学费':'我的邀请卡'}</b>
                    </span>
                    :null    
                }
            </div>
                
        );
    }
}

function mapStateToProps (state) {
    return {
        topicInfo: state.thousandLive.topicInfo,
        power: state.thousandLive.power,
        isAuth: state.thousandLive.isAuth,
        lshareKey: state.thousandLive.lshareKey,
    }
}

const mapActionToProps = {
    
};

module.exports = connect(mapStateToProps, mapActionToProps)(VideoTipsBar);