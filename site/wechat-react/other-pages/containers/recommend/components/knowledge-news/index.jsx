import React, { Component } from 'react';
import {connect} from 'react-redux'
import { locationTo, digitFormat, imgUrlFormat } from 'components/util';
import { Link } from 'react-router'
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';
import { getLike } from '../../../../actions/common';

const handleTime = (time) => {
  if(time){
    let h = Math.floor((Number(time) / 3600) % 60);
    let m = Math.floor((Number(time) / 60) % 60);
    let s = Math.floor(Number(time)%60);
    m = (h > 0) ? (h * 60 + m) : m;
    m = (m >= 10) ? m :`0${m}`;
    s = (s >= 10) ? s :`0${s}`
    return `${m}:${s}`
  } else {
    return "00:00"
  }
}



@autobind
class KnowledgeNewsBar extends Component {
  state = { likeNum: 0,  }
  goTopic(id){
    typeof _qla != 'undefined' && _qla('click', {
      region:'news-play',
    });
    setTimeout(() => {
      locationTo(`/topic/details-listening?topicId=${id}`);
    },500)
  }
  componentDidMount(){
    this.getTopicLike();

  }

  async getTopicLike(){
    let topicList = this.props.topicList;
    let topicId = topicList[0].id;
    let result = await this.props.getLike({speakIds: topicId});
    this.setState({
      likeNum: (result.data.speaks && result.data.speaks[0] && result.data.speaks[0].likesNum) || 0,
    });
  }

  render() {
    const { name, topicList } = this.props;
    return (
      <div className="k-news-box on-visible"
        data-log-region="news-home-show"
        data-log-pos={ 0 }
        data-log-name="知识新闻">
        <div className="news-content">
          <div className="news-cont">
            <div className="news-head">
              <h3 className="on-log"
                data-log-region="news-more"
                data-log-name="查看更多"
                onClick={ () => {
                locationTo(`/wechat/page/knowledge-news`)
              } }><span>{ name }</span></h3>
              <p className="on-log"
                data-log-region="news-play"
                data-log-pos={topicList[0].id}
                data-log-name="播放" onClick={ () => this.goTopic(topicList[0].id) }>播放</p>
            </div>
            {
              topicList[0] &&
              <div className="news-lists on-log"
                  data-log-region="news-home-lists"
                  data-log-pos={ 0 }
                  data-log-name={ topicList[0].topic } 
                  onClick={ () => this.goTopic(topicList[0].id) }>

                <div className="topic"> {topicList[0].topic} </div>

                <div className="name">
                  <Picture className="pic" placeholder={true} src={imgUrlFormat(topicList[0].teacherImage)} /> 
                  <span className="elli">{topicList[0].teacherName} - {topicList[0].teacherIntro}</span>
                </div>
                
                <div className="count">{digitFormat(topicList[0].learningNum||0)}次学习 | {this.state.likeNum && digitFormat((this.state.likeNum||0) + (topicList[0].likeNum||0))}人觉得有用</div>
              </div>
            }
            {/* <div className="news-more">
              <Link className="on-log"
                data-log-region="news-more"
                data-log-name="查看更多" to={ `/wechat/page/knowledge-news` }><span>查看更多</span></Link>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

function msp(state) {
  return {
  }
}

const map = {
  getLike,
}

export default connect(msp, map)(KnowledgeNewsBar)