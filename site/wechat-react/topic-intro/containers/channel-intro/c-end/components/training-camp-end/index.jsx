import React from 'react'


const TrainingCampEnd = ({ endTime, startTime }) => (
  <div className="camp-end-box">
    <div className="camp-cutoff-date">报名截止: { endTime }</div>
    <span>|</span>
    <div className="camp-start-date">开营时间: { startTime }</div>
  </div>
)
export default TrainingCampEnd