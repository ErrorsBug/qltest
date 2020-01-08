import React, { Component } from 'react';
import { timeAfter, formatDate, locationTo, digitFormat, } from 'components/util';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';

@autobind
class LiveTopicItem extends Component {

    chargeText = () => {
        if(this.props.chargeType === "encrypt") {
            return <span className="actual-price">加密</span>
        }
        if(this.props.chargeType === "public") {
            return <span className="free actual-price">免费</span>
        }
        if(this.props.chargeType === "charge") {
            return <span className="actual-price">￥{this.props.money / 100}</span>
        }
    }

    topicStatusTag = () => {
        if(this.props.status == "ended") {
            return ""
        } else if(this.props.status == "beginning" && this.props.timeNow - this.props.startTime < 7200000) {
            if(this.props.startTime > this.props.timeNow) {
                return <span className="not-start time-info flex flex-row flex-vcenter">{timeAfter(this.props.startTime, this.props.timeNow)}</span>
            } else {
                return <span className="beginning time-info "></span>
            }
        }
    }

    avTag = () => {
        if(this.props.topicStyle == "audio") {
            return <span className="audio type-tag"></span>
        }
        if (this.props.topicStyle == "video") {
            return <span className="video type-tag"></span>
        }
    }

    onLink(e) {
        if (!e.target.classList.contains('icon-menu')) {
            this.props.startTime > this.props.timeNow || this.props.power.allowMGLive ?
                locationTo(`/wechat/page/topic-intro?topicId=${this.props.topicId}${this.props.auditStatus ? "&auditStatus=" + this.props.auditStatus : ""}`)
            :
                locationTo(`/topic/details?topicId=${this.props.topicId}${this.props.auditStatus ? "&auditStatus=" + this.props.auditStatus : ""}`)
        }
    }

    render() {
        return (
            <div 
                className="live-topic-item on-log on-visible flex flex-row jc-between"
                data-log-region="single-lessons-list"
                data-log-pos={this.props.index + 1} 
                onClick={this.onLink}
            >
                <div className="logo-con flex-no-shrink">
                    <div className="logo">
                        <div className="c-abs-pic-wrap"><Picture src={this.props.logo} placeholder={true} resize={{w:'220', h: "138"}} /></div>
                        {
                            this.props.isRelay === 'Y' &&
                            <span className='relay-btn'>转播</span>
                        }
                        {
                            this.props.displayStatus == 'N' &&
                            <span className="show-hide-icon icon_hidden" />
                        }
                        {
                            this.props.hasCommunity == 'Y' &&
                            <span className="community-sign">群</span>
                        }
                    </div>
                </div>
                <div className="main-con flex-grow-1 flex flex-col jc-between">
                    <div 
                        className="topic-name elli-text flex-grow-1"
                    >
                        { this.avTag() }{ this.props.title }
                    </div>

                    <div className="last-con flex flex-row flex-vcenter jc-between">
                        <div className="charge flex flex-row flex-vcenter">
                            { this.chargeText() }
                            { this.topicStatusTag() }
                        </div>
                    {
                        this.props.power.allowMGLive && <div className="icon-menu" onClick={this.props.openBottomMenu} />
                    }
                    </div>

                    <div className="topic-time flex flex-row flex-vcenter jc-between">
                        <div className="flex flex-row flex-vcenter">
                            { formatDate(this.props.startTime, "yyyy/MM/dd hh:mm") }
                        </div>
                        {
                            (!this.props.isShowStudyNum || this.props.isShowStudyNum == 'Y') && <span className="learning-num">{digitFormat(this.props.browseNum)}次学习</span>
                        }
                    </div>
                </div>
            </div>
        );
    }
}


export default LiveTopicItem
