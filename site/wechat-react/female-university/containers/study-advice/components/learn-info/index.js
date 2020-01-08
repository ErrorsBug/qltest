import React from 'react'
import classnames from 'classnames'
import { digitFormat, getAudioTimeShow } from 'components/util'


const LearnInfo = ({browseNum, handleStudyPlan,topicId, channelId,  courseId, book,  region, 
        courseType, isAnimite, curId,   onAnimationEnd, joinArr,idx,delStudyPlan,isStudent,showJoinDialog }) => { 
    const courId = topicId || channelId || courseId;
    const type = !!book ? book : !!courseType ? courseType : !!channelId ? 'channel' : 'topic'; 
    const cls = classnames("on-log on-visible ",{
        'must-join':  courId === curId && isAnimite || joinArr.includes(courId),
        'must-animate': courId === curId && isAnimite,
        'once': courId === curId && isAnimite,
    })   
    return (
        <div className="sa-learn-info">
            <div className="sac-bottom">
                    <div className="sac-number"> 
                        <span className="icon-numb">{ digitFormat(  browseNum||0) }人在学</span>
                    </div>
            </div>
            {
                !isStudent?
                <p  className="lock on-log on-visible" 
                    data-log-name={`大学测评-结果页-解锁-${idx+1}`} 
                    data-log-region={ region+'-lock' }
                    data-log-pos={ idx+1 }
                    onClick={showJoinDialog}>解锁</p>
                :
                 ( (courId === curId && isAnimite) || joinArr.includes(courId)) ?
                 <p 
                 className={cls} 
                 data-log-name={`大学测评-结果页-已加入-${idx+1}`} 
                 data-log-region={ region+'-added' }
                 data-log-pos={ idx+1 }
                 onAnimationEnd={ onAnimationEnd }
                 onClick={ ()=>delStudyPlan(courId, type,idx) }>取消加入</p>
                 :
                 <p 
                 className={cls} 
                 data-log-name={`大学测评-结果页-加入课表-${idx+1}`}
                 data-log-region={ region }
                 data-log-pos={ idx+1 }
                 onAnimationEnd={ onAnimationEnd }
                 onClick={ (e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     handleStudyPlan(courId, type)
                 } }>加入课表</p>
            } 
        </div>
    )
}

export default LearnInfo