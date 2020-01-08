import React, { Component } from "react";
import { autobind } from "core-decorators";
import errorCatch from "components/error-boundary";
import { formatDate, locationTo, digitFormat } from "components/util";

@errorCatch()
@autobind
class LearnMode extends Component {
    state = {};
    
    async goToTopic(data) {
        if (data.startTime > this.props.sysTime) {
            window.toast('未到开课时间，请耐心等候，订阅千聊训练营公众号及时获得通知', 2000)
        } else if (this.props.sysTime > data.startTime) {
            locationTo(`/topic/details?topicId=${data.id}`)
        } else {
            locationTo(`/wechat/page/topic-intro?topicId=${data.id}`)
        }
    }

    render() {
      let { data, onShowJobDialog, onViewJob } = this.props
        return (
            <div className={`learn-li on-log on-visible ${data.startTime > this.props.sysTime ? 'lock': ''}`}
                data-log-region="current_task"
                data-log-pos={this.props.index + 1}
                onClick={() => this.goToTopic(data)}>
                <div className="learn-top">
                    <div className="learn-title">{data.topic}</div>
                </div>
                <div className="learn-bottom">
                    <div className="left">
                        <div className="learn-time">开课时间：{formatDate(data.startTime, 'MM-dd hh:mm')}</div>
                        <div className="learn-learns"><span>学习：{digitFormat(data.browseNum || 0)}次</span>{ data.answerCount > 0 && <span>提交: {data.answerCount}人</span>}</div>
                    </div>
                    <div className="right">
                        {
                            (data.startTime < this.props.sysTime) && data.homeworkList ? 
                                data.homeworkList.filter(item => item.finishStatus === 'N').length > 0 ?
                                    <div className="learn-btn on-log on-visible"
                                        data-log-region="do_homework"
                                        onClick={(e) => {e.stopPropagation();onShowJobDialog(data.homeworkList)}}>做作业</div>
                                    :
                                    <div className="learn-arrow on-log on-visible"
                                        data-log-region="check_homework"
                                        onClick={(e) => {e.stopPropagation();onViewJob(data.homeworkList)}}>查看作业<i className="icon_enter" /></div>
                                : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}


module.exports = LearnMode
