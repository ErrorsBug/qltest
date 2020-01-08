import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatDate, digitFormat, formatMoney, timeAfter, isBeginning } from 'components/util';


export default class TopicList extends Component {
    render() {
        let { list, onClickItem, playerTopicId, playerStatus } = this.props;
        let now = Date.now();

        return (
            <div className="p-intro-topic-list">
                {
                    list.map((item, index) => {
                        return <TopicItem 
                                    key={index}
                                    index={index}
                                    data={item}
                                    onClick={onClickItem}
                                    now={now}
                                    playerTopicId={playerTopicId}
                                    playerStatus={playerStatus}
                                />
                    })
                }
            </div>
        )
    }
}


class TopicItem extends Component {
    render() {
        let { data, now, index, playerTopicId, playerStatus } = this.props;

        let isBegin = false,
            isFuture = false;
        
        if (data.status === 'beginning' 
            && !/^(audioGraphic|videoGraphic)$/.test(data.style) 
            && now - data.startTimeStamp < 7200000
        ) {
            if (isBeginning(data.startTimeStamp, now)) {
                isBegin = true;
            } else {
                isFuture = true;
            }
        }

        let cls = classNames('item on-log', {
            'is-future': isFuture
        });

        return (
            <div className={cls}
                 onClick={this.onClick}
                 data-log-name="channel-course-item"
                 data-log-region="channel-course-item"
                 data-log-pos={index}
            >
                <div className={`title ${playerTopicId === data.id && playerStatus ? 'played' : ''}`}>{data.topic}</div>
                <div className="desc c-flex">
                    <div className="c-flex-grow1 c-flex">
                        <div className="date">{formatDate(data.startTime, 'MM月dd日 hh:mm')}</div>
                        <div className="learn-num">{digitFormat(data.browseNum || 0)}次学习</div>
                    </div>
                    <div className="c-flex-shrink0 c-flex">
                        {
                            data.isSingleBuy === 'Y' ? (
                                <span className="single-buy">&yen;{formatMoney(data.money)}</span>
                            ) : null
                        }
                        {
                            data.isAuditionOpen === 'Y' ?
                                <div className="label">试听</div> :
                                    isBegin ? <div className="label label-red-o">直播中</div> :
                                        isFuture ? <div className="label label-gray">待开课</div> : false
                        }
                    </div>
                </div>
            </div>
        )
    }

    onClick = () => {
        this.props.onClick && this.props.onClick(this.props.data)
    }
}