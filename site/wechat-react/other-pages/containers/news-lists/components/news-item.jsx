import React from 'react'
import { formatDate, digitFormat } from "components/util";

const handleTime = (time) => {
  if(time){
    let h = Math.floor((Number(time) / 3600) % 60);
    let m = Math.floor((Number(time) / 60) % 60);
    let s = Math.floor(Number(time)%60);
    m = (h > 0) ? (h * 60 + m) : m;
    m = (m >= 10) ? m :`0${m}`;
    s = (s >= 10) ? s :`0${s}`
    return `${m}:${s}`
  } else{
    return "00:00"
  }
}

const NewsItem = ({ isOne,pubDate,topicList = [], goTopic }) => (
  !!topicList.length ?
  (<div className="news-item-box">
    <div className="item-head">
      {/* { isOne && <h3>最新</h3> } */}
      {formatDate(pubDate,'MM月dd日')}
    </div>
    { topicList.map((item,index) => (
      <div className="item-elm on-log" 
        data-log-region="news-lists"
        data-log-pos={ index }
        data-log-name={ item.topic }
        onClick={ () => goTopic(item.id) } key={ index }>
        <div className="item-p">{ item.topic }</div>
        <div className="item-desc">
          <span className="item-numb">{ digitFormat(item.learningNum) }次学习</span>
          { item.duration && <span className="item-time"><span className="split">|</span>时长{ handleTime(item.duration) }</span> }
        </div>
      </div>
    ))}
  </div>) : null
)

export default NewsItem;