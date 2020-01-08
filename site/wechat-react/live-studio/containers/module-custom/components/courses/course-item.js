import React, { Component } from 'react';
import { timeAfter, formatDate, locationTo, imgUrlFormat, digitFormat } from 'components/util'
import { autobind } from 'core-decorators';

@autobind
class CourseItem extends Component {
    componentDidMount() {
    }
    
    chargeText = () => {
        if (this.props.type === "encrypt") {
            return "加密"
        }
        if (this.props.type === "public") {
            return <span className="free">免费</span>
        }
        if (this.props.type === "charge") {
            return "￥" + this.props.money / 100
        }
    }

    topicStatusTag = () => {
        if (this.props.status == "ended") {
            return ""
        } else if (this.props.status == "beginning" && this.props.timeNow - this.props.startTime < 7200000) {
            if (this.props.startTime > this.props.timeNow) {
                return <span className="not-start"><span className="red-clock"></span>{timeAfter(this.props.startTime, this.props.timeNow)}</span>
            } else {
                return <span className="beginning"></span>
            }
        }
    }

    avTag = () => {
        if (this.props.style == "audio") {
            return <span className="audio"></span>
        }
        if (this.props.style == "video") {
            return <span className="video"></span>
        }
    }

    onLink = (e) => {
        this.props.startTime > this.props.timeNow || this.props.power.allowMGLive ?
            locationTo("/wechat/page/topic-intro?topicId=" + this.props.id)
            :
            locationTo(`/topic/details?topicId=${this.props.id}`)
    }

    render() {

        const {
            id,	// String	话题id
            topic,	// String	话题名称
            status,	// String	话题状态
            browseNum,	// Int	浏览人数
            authNum,	// Int	付费报名人数
            commentNum,	// Int	评论人数
            startTime,	// timestamp	开始时间
            endTime,	// timestamp	结束时间
            type,	// String	话题类型 encrypt= 加密;public = 公开
            style,	// timestamp	话题风格类型 ‘normal’,’ppt’,’video’,’audioGraphic’,’audio’
            money,	// decimal	费用
            backgroundUrl,	// String	背景图url
            beginTime,	// String	开始时间
        } = this.props.data

        const {
            name,	//String	系列课模块名称
            isShowTime,	//String	是否展示学习次数 Y:是 N:否
            isShowPrice,	//String	是否展示价格 Y:是, N: 否
            refId,	//Array	勾选的系列课id组成的数组 [‘123456’, ’234553’]
        } = this.props.config

        return (
            <div
                className="course-item on-log on-visible"
                onClick={this.onLink}
                data-log-region='topic_list'
                data-log-pos={this.props.index}
                data-log-name={topic}
                data-log-business_id={id}
            >
                <div className="logo-con">
                    <div className="logo">
                        <img src={imgUrlFormat(this.props.backgroundUrl, '@240w_148h_1e_1c_2o')} alt="" />
                        {
                            this.props.isRelay === 'Y' &&
                            <span className='relay-btn'>转播</span>
                        }
                    </div>
                </div>
                <div className="main-con">
                    <div className="topic-name" >
                        <div className="left" onClick={() => { locationTo("/wechat/page/topic-intro?topicId=" + this.props.topicId ) }}>
                            <span className="title">{this.avTag()}{this.props.topic}</span>
                        </div>
                    </div>
                    <div className="topic-time">{formatDate(this.props.startTime, "MM月dd日 hh:mm")}</div>
                    <div className="last-con">
                        <div className="left">
                            {this.topicStatusTag()}
                            {
                                isShowTime === 'Y' &&
                                <span className="learning-num">{digitFormat(this.props.browseNum)}次学习</span>
                                ||null
                            }
                        </div>
                        <div className="right">
                            {
                                isShowPrice === 'Y' &&
                                <span className="charge">{this.chargeText()}</span>
                                ||null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CourseItem
