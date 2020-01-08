import { formatDate, imgUrlFormat, locationTo, formateToDay, timeAfterMixWeek } from 'components/util'
import React, { Component } from 'react';

const CampCourseCard = (props) => {
    const courseItem = props.courseItem
    const timeRender = () => {
        var timeLeft = Number(props.courseItem.startTime - props.sysTime)
        var d_hours = Math.floor(timeLeft / 86400000)
        var d_minutes = Math.floor((timeLeft - d_hours * 86400000) / 3600000)
        var d_secs = Math.floor((timeLeft - d_hours * 86400000 - d_minutes * 3600000) / 60000)
        return (
            <div className="time-tick">
                <span className="time-block">{d_hours < 10 ? '0' + d_hours : d_hours}</span>天
                <span className="time-block">{d_minutes < 10 ? '0' + d_minutes : d_minutes}</span>时
                <span className="time-block">{d_secs < 10 ? '0' + d_secs : d_secs}</span>分
            </div>
        )
    }
    if (courseItem.startTime > props.sysTime) {
        return (
            <div className="course-item">
                <h1 className="title">{props.last ? "最新开课" : "下一课时"}</h1>
                <div className="time">{formatDate(courseItem.startTime) + "  " + formateToDay(courseItem.startTime, props.sysTime) + "  " + formatDate(courseItem.startTime, 'hh:mm')}</div>
                <div className="course-card">
                    <div className="banner-con">
                        <div className="time-tick-wrap">
                            <div className="time-tick-con">距开始：{timeRender()}</div>
                            <div className="speaker">主讲人: {courseItem.speaker}</div>
                        </div>
                        <img className='banner' src={courseItem.headImage + '@750w_469h_1e_1c_2o'} alt="" />
                    </div>
                    <div className="order">第{courseItem.order}课</div>
                    <div className="course-name">{courseItem.name}</div>

                    <div className="btn-wrap">
                        <div className={`card-btn${courseItem.isReply == "Y" ? " is-reply" : ""}`} onClick={() => { props.cardGoToPretest(courseItem.topicId, courseItem.isReply) }}>课前预习</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="course-item">
                <h1 className="title">最新开课</h1>
                <div className="time">{formatDate(courseItem.startTime) + "  " + formateToDay(courseItem.startTime, props.sysTime) + "  " + formatDate(courseItem.startTime, 'hh:mm')}</div>

                <div className="course-card">
                    <div className="banner-con" onClick={() => { props.gotoCourseHandle(courseItem.style, courseItem.topicId) }}>
                        <div className="play"> <span className="icon_audio_play"></span> </div>
                        <img className='banner' src={courseItem.headImage + '@750w_469h_1e_1c_2o'} alt="" />
                    </div>
                    <div className="order">第{courseItem.order}课</div>
                    <div className="course-name">{courseItem.name}</div>

                    <div className="btn-wrap">
                        <div className={`card-btn${courseItem.isReply == "Y" ? " is-reply" : ""}`} onClick={() => { props.cardGoToPretest(courseItem.topicId, courseItem.isReply) }}>课前预习</div>
                        <div className={`card-btn${courseItem.isReply == "Y" ? " is-reply" : ""}`} onClick={() => { props.cardGoToHomework(courseItem.homeworkIdList, courseItem.isReply, courseItem.topicId) }}>课后作业</div>
                    </div>
                </div>
            </div>
        )
    }
}


export default CampCourseCard