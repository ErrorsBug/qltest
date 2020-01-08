import React from 'react'
import classnames from 'classnames'  

const StudyPlanBtn = ({ handleStudyPlan  ,topicId, channelId, isJoin,  courseId, book,  region, 
        courseType, isAnimite, curId, isHome=false , onAnimationEnd, joinArr,  className = '' }) => {
    const courId = topicId || channelId || courseId;
    const type = !!book ? book : !!courseType ? courseType : !!channelId ? 'channel' : 'topic';
    const cls = classnames("study-plan-btn on-log",className, {
        'must-join': isJoin || courId === curId && isAnimite || (joinArr && joinArr.includes(courId)),
        'must-animate': courId === curId && isAnimite,
        'once': courId === curId && isAnimite,
    }) 
    return (
        <div 
            className={cls} 
            data-log-name="加入课表"
            data-log-region={ region }
            data-log-pos={ courId }
            onAnimationEnd={ onAnimationEnd }
            onClick={ (e) => {
                e.preventDefault();
                e.stopPropagation();
                courseType==='liveTopic'?
                window.toast('直播课不支持加入课表')
                :
                handleStudyPlan(courId, type, isJoin, isHome)
            } }>{ (isJoin || (courId === curId && isAnimite) || (joinArr && joinArr.includes(courId))) ? '已加课表' : '加入课表' }</div>
    )
}

export default StudyPlanBtn