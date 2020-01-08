
import React, { Component } from 'react';

const handleDate = (date) => {
  const now = new Date(date);
  const month = now.getMonth() + 1;
  const day = now.getDate(); 
  const week = now.getDay();
  const weelArr = ['周日','周一','周二','周三','周四','周五','周六']
  return (
    <h3>{ month >= 10 ? `${month}月` : `0${month}月` }{ day >= 10 ? `${day}日` : `0${day}日` } / <span>{ weelArr[week] }</span></h3>
  )
}

const pres = ({ progress,topicId }) => {
  if(progress && progress[topicId]){
    return <React.Fragment><span className="split">|</span>{progress[topicId] >= 1 ? '已学完' : `已学${ (progress[topicId] * 100).toFixed(2)}%`}</React.Fragment>
  } else {
    return 
  }
}
const CourseItem = (props) => (
  <div className="choice-item">
    { handleDate(props.publishTime) }
    <div className="choice-cont on-log" onClick={ () => { props.linkToTopic(props.topicId)} } 
       data-log-region="public-class-list"
       data-log-pos={props.key}
       data-log-name={ props.teacherName }>
      <div className="choice-com">
        <h4>{ props.topicName }</h4>
        <p>{ props.teacherName } - { props.teacherIntro }</p>
        <div className="new-data">
          <span className="new-plo"><i></i>{ props.learningNum >= 10000 ? (props.learningNum/ 10000).toFixed(1) + "万" : props.learningNum}次学习</span>
          <span className="new-progress">{ pres(props) }</span>
        </div>
      </div>
      <div className="choice-img">
        <img src={ props.teacherImg } />
      </div>
    </div>
  </div>
)

export default CourseItem;