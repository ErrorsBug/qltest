import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatDate, digitFormat, formatMoney, timeAfter, isBeginning } from 'components/util';


export default class TopicList extends Component {
    render() {
        let { list, onClickItem, isUnlockChannel, unlockInfo, userUnlockProcess, isShowAudition } = this.props;
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
                                    isShowAudition={ isShowAudition }
                                    isUnlockChannel={isUnlockChannel}
                                    unlockInfo={unlockInfo}
                                    userUnlockProcess={userUnlockProcess}
                                />
                    })
                }
            </div>
        )
    }
}


class TopicItem extends Component {
    render() {
        let { data, now, index, isUnlockChannel, unlockInfo, userUnlockProcess = {}, isShowAudition } = this.props;
        let { unlockStatus, unlockTopicId } = userUnlockProcess
        let isBegin = false,
            isFuture = false,
            isLock = false;
        
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
        
        // 一元解锁课
        if(isUnlockChannel) {
            if(unlockStatus === 'wait' || unlockStatus === 'unPay') {
                if(unlockTopicId == data.id) {
                    isLock = false
                } else {
                    isLock = true
                }
            } else {
                isLock = false
            }
            if(data.isAuditionOpen === 'Y') {
                isLock = false
            }
        }

        let cls = classNames('item on-log', {
            'is-future': isFuture,
            'is-lock': isLock
        });

        return (
            <div className={cls}
                 onClick={() => this.onClick(data, isLock)}
                 data-log-name="channel-course-item"
                 data-log-region="channel-course-item"
                 data-log-pos={data.indexNum}
            >
                {
                    data.indexNum !== undefined &&
                    <div className="index">{data.indexNum}</div>
                }
                <div className="c-flex-grow1">
                    <div className="title">{data.topic}</div>
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
                                (data.isAuditionOpen === 'Y' && isShowAudition) ?
                                    <div className="label">试听</div> :
                                        isBegin ? (isLock ? null : <div className="label label-red-o">直播中</div>) :
                                            isFuture ? (isLock ? null : <div className="label label-gray">待开课</div>) : false
                            }
                            {
                                data.isUnlock ? <span className="label already-unlock">已解锁</span> : null
                            }
                            {
                                isLock && <img className="icon-lock" src={require('./img/lock.png')}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onClick = (data, isLock) => {
        this.props.onClick && this.props.onClick(this.props.data, isLock)
    }
}
