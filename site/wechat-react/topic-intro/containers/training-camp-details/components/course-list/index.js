import React, { Component } from 'react';
import errorCatch from 'components/error-boundary/index';
import { formatDate, digitFormat, isBeginning, locationTo } from 'components/util'
@errorCatch
class CourseList extends Component {

	render(){

        return (
            <div className="course-list">
                {
                    this.props.data.map((item, index) => (
                        <CouseItem
                            item={item}
                            key={`course-item-${index}`}
                            rank={index+1}
                            now={this.props.sysTime}
                            taskClick={this.props.taskClick}
                            />
                    ))
                }
            </div>
        )
    }
}

const CouseItem = (props) => {

    const { item, rank, now } = props
    
    let isFuture = false
    if (!isBeginning(item.startTime, now)) {
        isFuture = true;
    }

    const isHomeWork = item.homeworkList && item.homeworkList.length > 0
    const homeWorkCount = isHomeWork && item.homeworkList.length
    const finishCount = isHomeWork && item.homeworkList.filter((item) => item.finishStatus === 'Y').length

    return (
        <div 
            className={`coure-item ${isFuture ? 'future' : ''}`}
            onClick={ () => { locationTo(`/wechat/page/topic-intro?topicId=${item.id}`)}}>
            <div className="item-content">
                <span className="item-rank">{rank}</span>
                <div className="right">
                    <p className="item-name line-2">{item.topic}</p>
                    <div className="item-info">
                        <p>
                            <span className="time-str">{formatDate(item.startTime, 'yyyy-MM-dd hh:mm')}</span>
                            <span className="learn-num">{digitFormat(item.browseNum)}次学习</span>
                        </p>
                        {
                            isFuture && <span className="label future">待开课</span>
                        }
                        {
                            !isFuture && isHomeWork && (
                                finishCount === homeWorkCount ? (
                                    <div className="go-task-btn finish icon-arrow" onClick={ (e) => { e.stopPropagation(); props.taskClick(item.homeworkList) }}>查看作业</div>
                                ) : (
                                    <div className="go-task-btn not-finish" onClick={ (e) => { e.stopPropagation(); props.taskClick(item.homeworkList) }}>{homeWorkCount > 1 ? `去做作业(${finishCount}/${homeWorkCount})` : '去做作业'}</div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseList;