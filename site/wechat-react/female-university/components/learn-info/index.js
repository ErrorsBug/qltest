import React from 'react'
import classnames from 'classnames'
import { digitFormat, getAudioTimeShow } from 'components/util'
import StudyPlanBtn from '../study-plan-btn' 

const LearnInfo = ({   isCourse  , channelId , book, duration , topicCount, browseNum,
        courseType , liveChannelPo, liveEntityPo, liveTopicPo , isHideNum, ...otherProps }) => {
            
    const obj = liveChannelPo || liveEntityPo || liveTopicPo || {}; 
    const type = !!book ? book : !!courseType ? courseType : !!channelId ? 'channel' : 'topic'; 
    return (
        <div className="cp-learn-info">
            <div className="library-number">
                { isCourse && <span className="icon-course">{ Object.is(type, "channel") ? obj.topicCount || topicCount : '单' }课</span> }
                {
                    !isHideNum&&<span className="icon-numb">{ digitFormat(obj.browseNum || browseNum || obj.learningNum || 0) }</span>
                } 
                { !isCourse && <span className="icon-time">{ getAudioTimeShow(duration || obj.duration || 0) }</span> }
            </div>
            <StudyPlanBtn {...otherProps} channelId={channelId} courseType={courseType} book={book}/> 
        </div>
    )
}

export default LearnInfo