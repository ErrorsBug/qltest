/**
 * 单课课列表item，从直播间首页抽离组件
 * @date 20180403
 */

import React, { Component } from 'react';
import { timeAfter, formatDate, locationTo, imgUrlFormat, digitFormat } from 'components/util'
import { autobind } from 'core-decorators';



@autobind
export default class TopicListItem extends Component {
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
        if(this.props.status == "ended") {
            return ""
        } else if(this.props.status == "beginning" && this.props.timeNow - this.props.startTime < 7200000) {
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
        if (!e.target.classList.contains('right')) {
            // locationTo(`/topic/details?topicId=${this.props.topicId}`)
            this.props.startTime > this.props.timeNow || this.props.power.allowMGLive ?
            locationTo("/wechat/page/topic-intro?topicId=" + this.props.topicId)
            :
            locationTo(`/topic/details?topicId=${this.props.topicId}`)
        }
    }

    render() {
        return (
            <div className="__topic-list-item" onClick={ this.onLink }>
                <div className="logo-con">
                    <div className="logo">
                        <img src={imgUrlFormat(this.props.logo, '@240w_148h_1e_1c_2o')} alt=""/>
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
                <div className="main-con">
                    <div className="topic-name" >
                        <div className="left" onClick={() => {locationTo("/wechat/page/topic-intro?topicId=" + this.props.topicId )}}>
                            <span className="title">{this.avTag()}{this.props.title}</span>
                        </div>
                        {
                            this.props.openBottomMenu ?
                            <div className="right" onClick={ this.props.openBottomMenu }>
                                {
                                    this.props.power.allowMGLive ?
                                        <span className="admin"></span> : ""
                                }
                            </div> : false
                        }
                    </div>
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
                            <span className="charge">{this.changeText()}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

