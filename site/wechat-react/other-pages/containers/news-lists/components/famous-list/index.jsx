import React from 'react'
import { formatDate, digitFormat, imgUrlFormat } from "components/util";
import Picture from 'ql-react-picture';

const FamousList = ({ isOne,pubDate,topicList = [], famousIndex, goTopic, commentClick,likeClick, likeList=[] }) => (
  !!topicList.length ?
  (<div className="label-box">
    
    { isOne ? 
      <div className="label-today"><h3>最新</h3> / {formatDate(pubDate,'MM月dd日')}</div>:
      <div className="label-date">{formatDate(pubDate,'MM月dd日')}</div>
    }  
    { topicList.map((item,index) => (
        <div className= "label on-log on-visible" 
        data-log-region= "news-teacher-lists"
        data-log-name= { item.topic }
        onClick= { () => goTopic(item.id) } key={ index }>
            <div className="name">
              <Picture className="pic" src={imgUrlFormat(item.teacherImage)} placeholder = {true}/> 
              <span className="elli">{item.teacherName} - {item.teacherIntro}</span>
            </div>
            <div className="topic elli-text">{ item.topic }</div>
            <div className="count">
              {digitFormat(item.learningNum||0)}次学习 | {likeList[index]? digitFormat((likeList[index].likesNum||0)+item.likeNum) : item.likeNum}人觉得有用
            </div>
            <div className="bottom-button">
            <span className="btn-comment on-log" 
                data-log-region= "news-comment"
                data-log-name= "评论" 
                onClick={(e)=>{ e.stopPropagation();e.preventDefault(); commentClick(famousIndex, index, item.id, item.liveId, item.commentNum)}}>
              {item.commentNum ? <i>{ item.commentNum > 999? '999+':item.commentNum}</i>:null}
            </span>
              <span className={`${likeList[index] && likeList[index].likes? 'active' : ''} btn-reward on-log`} 
                data-log-region= "news-like"
                data-log-name= "有用"
                onClick={(e)=>{ e.stopPropagation();e.preventDefault();likeClick(famousIndex, index, item.id, item.liveId)}}></span>
            </div>
        </div>
    ))}
  </div>) : null
)

export default FamousList;