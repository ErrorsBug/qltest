import React, { Component } from 'react'

const pres = ({ progress,topicId }) => {
  if(progress && progress[topicId] ){
    return <React.Fragment><span className="split">|</span>{progress[topicId] >= 1 ? <i className="pro-gray">已学完</i> : `已学${ (progress[topicId] * 100).toFixed(2)}%`}</React.Fragment>
  } else {
    return 
  }
}
const NewCourse = (props) => (
  <div className="new-course">
    <div className="new-head">
      <h2>最新上架</h2>
      <p>{ props.title }</p>
    </div>
    <div className="new-content on-log" onClick={ () => { props.linkToTopic(props.topicId)} } 
      data-log-region="public-class-list"
      data-log-pos={props.key}
      data-log-name={ props.teacherName }>
      <div className="new-left">
        <h3>{ props.topicName }</h3>
        <p>{ props.teacherName } - { props.teacherIntro }</p>
        <div className="new-data">
          <span className="new-plo"><i></i>{ props.learningNum >= 10000 ? (props.learningNum/ 10000).toFixed(1) + "万" : props.learningNum}次学习</span>
          <span className="new-progress">{ pres(props) }</span>
        </div>
      </div>
      <div className="new-right">
        <img src={ props.teacherImg }/>
      </div>
    </div>
  </div>
)

export default NewCourse;