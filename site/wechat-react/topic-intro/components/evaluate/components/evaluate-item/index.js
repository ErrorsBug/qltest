import React, { Component } from 'react';
import { formatDate, digitFormat, formatMoney, timeAfter, isBeginning } from 'components/util';
import ScoreStar, { CourseEvalText } from 'components/score-star';

export default class EvaluateItem extends Component {

    get getRanking () {
        const { score } = this.props.item
        if (score >= 4.5) {
            return '无可挑剔'
        } else if (score >= 3.5) {
            return '非常满意'
        } else if (score >= 2.5) {
            return '很不错啊'
        } else if (score >= 1.5) {
            return '一般'
        } else {
            return '不满意'
        }
    }

    replyEvent () {
        this.props.reply(this.props.index, this[`evaluate-item-${this.props.item.id}`])
    }

    render() {
        const { item, reply, index, removeReply, isAuth, courseType, ...props} = this.props
        return (
            <div {...props} ref={el => (this[`evaluate-item-${item.id}`] = el)}>
                <div className="user-info">
                    <img src={item.headImageUrl} className="user-poster" alt=""/>
                    <p className="flex-1 user-name">{item.userName}</p>
                    {
                        !isAuth && <p className="eval-time">{formatDate(item.evalTime, 'yyyy.MM.dd')}</p>
                    }
                </div>
                <div className="user-star">
                    <span className="star-level"><CourseEvalText score={item.score} /></span>
                    <ScoreStar 
                        score={item.score}
                        />
                </div>
                <p className="user-content">{item.content}</p>
                {
                    courseType !== 'topic' && item.topicName ? (
                        <p className="evaluate-source"><span className="text">{item.topicName}</span></p>
                    ) : null
                }
                {/* 回复内容 */}
                {
                    item.replyType === 'Y' ? (
                        <div className="reply">
                            <span className="Identification">直播间回复：</span>{item.replyContent}
                        </div>
                    ) : null
                }
                {
                    isAuth && (
                        <div className="operation">
                            <span>{formatDate(item.evalTime, 'yyyy.MM.dd')}</span>
                            {
                                item.replyType === 'Y' ? (
                                    <span 
                                        className="reply-btn on-log on-visible" 
                                        data-log-region={ `${courseType === 'topic' ? 'topic' : 'channel'}-comment-removeReply-btn` }
                                        data-log-pos={index}
                                        onClick={ () => { removeReply(index) }}>撤回</span>
                                ) : (
                                    <span 
                                        className="reply-btn on-log on-visible" 
                                        data-log-region={ `${courseType === 'topic' ? 'topic' : 'channel'}-comment-reply-btn` }
                                        data-log-pos={index}
                                        onClick={ this.replyEvent.bind(this) }>回复</span>
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    }
}