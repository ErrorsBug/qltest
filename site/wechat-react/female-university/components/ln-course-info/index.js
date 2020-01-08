import React from 'react'
import classnames from 'classnames'
import { locationTo, formatDate } from 'components/util'
import CampStatus from '../camp-status'
import ApplyUserList from '../apply-user-list'

const LnCourseInfo = ({  collectStatus, title,  startTime, endTime,signupStartTime, isNewCamp, ...otherProps }) => {
    
    //是否今天
    const isToday=(str)=> {
        if (new Date(str).toDateString() === new Date().toDateString()) {
            return true
        }  
        return false
    }    
    const flag = Object.is(collectStatus, 'Y')
    const time = new Date().getTime()  
    return (
        <div className={ `ln-course-info ${ isNewCamp ? 'ln-course-news' : '' }` }>
            { !isNewCamp && (
                <h3>
                    { title }
                </h3> 
            ) }
            {
                time<signupStartTime&&flag&&
                <div className="ln-course-play">报名时间：{ isToday(signupStartTime)?`今天${formatDate(signupStartTime, 'hh:mm')}`:formatDate(signupStartTime, 'MM/dd hh:mm') }开始</div>
            }
            <p>
                {
                    (time>signupStartTime||!flag)&&<CampStatus className={ flag ? 'ing' : 'end' } txtStatus={ flag ? '火热报名中': '报名已结束' } /> 
                }
                { !isNewCamp && (
                    <span className="ln-course-dx">
                        带学时间: { formatDate(startTime, 'MM/dd') } - { formatDate(endTime, 'MM/dd') }
                    </span>
                ) }
            </p>
            { isNewCamp && (
                <h3>
                    { title }
                </h3> 
            ) }
            {
                (time>signupStartTime||!flag)&&<ApplyUserList className={`ln-course-user ${flag?'ing':'end'}`} {...otherProps} />
            }
            
        </div>
    )
}

export default LnCourseInfo