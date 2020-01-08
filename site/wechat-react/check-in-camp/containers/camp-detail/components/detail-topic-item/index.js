import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import { timeAfter, formatDate, locationTo, imgUrlFormat, digitFormat } from 'components/util'

@autobind
export class DetailTopicItem extends Component {
    changeText = () => {
        if(this.props.chargeType === "encrypt") {
            return "加密"
        }
        if(this.props.chargeType === "public") {
            return <span className="free">免费</span>
        }
        if(this.props.chargeType === "charge") {
            return "￥" + this.props.money/100
        }
    }

    topicStatusTag = () => {
        if(this.props.status == "ended" || this.props.style === "videoGraphic" || this.props.style === "audioGraphic") {
            return ""
        } else if(this.props.status == "beginning") {
            if(this.props.startTime > this.props.timeNow) {
                return <span className="not-start"><span className="red-clock"></span>{timeAfter(this.props.startTime, this.props.timeNow)}</span>
            } else {
                return <span className="beginning"></span>
            }
        }
    }

    avTag = () => {
        if(this.props.topicStyle == "audio") {
            return <span className="audio"></span>
        }
        if (this.props.topicStyle == "video") {
            return <span className="video"></span>
        }
    }

    onLink(e) {

        // if(!this.props.allowMGLive && this.props.payStatus === 'N') {
        //     window.toast("请先购买训练营");
        //     return;
        // }

        if (!e.target.classList.contains('right')) {
            this.props.startTime > this.props.timeNow ?
            locationTo("/wechat/page/topic-intro?topicId=" + this.props.topicId)
            :
            locationTo(`/topic/details?topicId=${this.props.topicId}`)
        }
    }

    handleOperClick(e) {
        const {index, title, topicId, displayStatus, style, status} = this.props;
        this.props.showOperationDialog();
        // console.log(status)
        this.props.setCurrentTopic({index, title, topicId, displayStatus, style, status})
    }

    render() {
        return (
            <div className="detail-topic-item-container">
                <div className="logo-con" onClick={ this.onLink }>
                    <div className="logo">
                        <div className="bg-img common-bg-img" style={{backgroundImage: `url(${imgUrlFormat(this.props.logo, '?x-oss-process=image/resize,m_fill,limit_0,w_240,h_148')})`}}/>
                        {
                            this.props.isRelay === 'Y' &&
                            <span className='relay-btn'>转播</span>
                        }
                        {
                            this.props.displayStatus == 'N' &&
                            <span className="show-hide-icon icon_hidden" />
                        }
                    </div>
                </div>
                <div className="main-con" onClick={ this.onLink } >
                    <div className="topic-name" >
                        <div className="left" onClick={() => {locationTo("/wechat/page/topic-intro?topicId=" + this.props.topicId)}}>
                            <span className="title">{this.avTag()}{this.props.title}</span>
                        </div>
                    </div>

                    <div className="main-bottom">
                        <div className="topic-time"> {formatDate(this.props.startTime, "MM月dd日 hh:mm")}</div>
                        <div className="last-con">
                            <div className="left">
                                {this.topicStatusTag()}
                                {
                                    (!this.props.isShowStudyNum || this.props.isShowStudyNum == 'Y')?
                                    <span className="learning-num">{digitFormat(this.props.browseNum)}次学习</span>
                                    :null
                                }
                            </div>
                            <div className="right">
                                {/* <span className="charge">{this.changeText()}</span> */}
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.allowMGLive ? 
                    <div className="operation" onClick={this.handleOperClick}><span className="icon_dots_horizontal"></span></div>:
                    null
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    // dateInfo: getVal(state, 'campBasicInfo.dateInfo'),
    allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
    payStatus: getVal(state, 'campUserInfo.payStatus'),
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailTopicItem)
