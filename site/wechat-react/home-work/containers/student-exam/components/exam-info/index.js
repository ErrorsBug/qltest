import React, { PureComponent } from 'react';

import './style.scss'
import { locationTo } from 'components/util';

export default class ExamInfo extends PureComponent {

    componentDidMount () {
        typeof _qla != 'undefined' && _qla.collectVisible();
    }

    get timeStr () {
        const duration = this.props.data && this.props.data.duration || 0
        if (duration) {
            if (duration > 9) {
                return (duration + '').split('')
            } else {
                return [0, duration]
            }
        }
        return [0, 0]
    }

    render () {
        const {
            data = {}
        } = this.props
        const s = this.timeStr

        return (
            <div className="exam-info">
                <div className="header">
                    <p className="title">{data.title}</p>
                    <p className="duration">考试时间</p>
                    <div className="timer">
                        {
                            s.map( (_, index) => <p key={index}>{_}</p>)
                        }
                        <span>分</span>
                        <p>0</p>
                        <p>0</p>
                        <span>秒</span>
                    </div>
                </div>

                {
                    this.props.isFollowExam ?
                        <div className="content exam">
                            <p className="has-exam">你已提交了考试，点击查看考试成绩</p>
                            <div 
                                className="see-point-btn on-log on-visible"
                                data-log-region="test-begin"
                                data-log-pos="review"
                                onClick={() => locationTo(`/wechat/page/exam-card?examId=${this.props.examId}&liveId=${this.props.liveId}`)}>查看考试成绩</div>
                            <span 
                                className="to-live-btn on-log on-visible"
                                data-log-region="test-begin"
                                data-log-pos="return"
                                onClick={() => locationTo(`/wechat/page/live/${this.props.liveId}`)}>返回直播间</span>
                        </div>
                        :
                        <div className="content">
                            <div className="splite-title">
                                <p>考试内容</p>
                            </div>
                            <p className="exam-explain">{data.desc}</p>
                        </div>
                }
            </div>
        )
    }
}