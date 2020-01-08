import React, { Component } from 'react'
import { Link } from 'react-router'
import { locationTo } from 'components/util';
import { autobind } from 'core-decorators'
import Picture from 'ql-react-picture';


@autobind
export default class extends Component {
  linkTo(){
    typeof _qla != 'undefined' && _qla('click', {
      region:'public-class',
    });
    setTimeout(() => {
      this.toPage();
    },300)
  }
  toPage(){
    const { freePublicCourse } = this.props;
    if(!!freePublicCourse && freePublicCourse.topicId){
      if (freePublicCourse.style) {
        if (freePublicCourse.style.indexOf('video') > -1) {
          return locationTo(`/wechat/page/topic-simple-video?topicId=${freePublicCourse.topicId}`)
        } 
        if (freePublicCourse.style.indexOf('audio') > -1) {
          if (freePublicCourse.style == 'audioGraphic') {
            return locationTo(`/topic/details-listening?topicId=${ freePublicCourse.topicId }`)
          } else {
            if (freePublicCourse.status == 'ended') {
              return locationTo(`/topic/details-listening?topicId=${ freePublicCourse.topicId }`)
            } else {
              return locationTo(`/topic/details-video?topicId=${freePublicCourse.topicId}`);
            }
          }
        }
      }
      return locationTo(`/topic/details-listening?topicId=${ freePublicCourse.topicId }`)
    }
  }
  render() {
    const { name, freePublicCourse = {},secondName } = this.props;
    return (
      <div className="recommend-public on-visible">
        <div className="pub-comp">
          <div className="pub-cont">
            <div className="public-content on-log on-visible" 
              data-log-region="public-class"
              data-log-pos={freePublicCourse.id}
              data-log-name={freePublicCourse.teacherName} onClick={ this.linkTo } >
              <h3><p>{name}</p> <span>{ secondName ? secondName : '每周二 / 四 / 六更新' }</span></h3>
              <div className="pub-width">
                <h4>{ freePublicCourse.topicName }</h4>
                <p>{ freePublicCourse.teacherName } - { freePublicCourse.teacherIntro }</p>
              </div>
            </div>
            <div className="pub-more">
              <Link 
                className="on-log"
                data-log-region="public-class-more"
                data-log-pos="0"
                data-log-name="更多公开课" to={ `/wechat/page/choice-course` }><span>查看往期</span></Link>
            </div>
            <div className="pub-img" >
                <Picture src={freePublicCourse.teacherImg}
                  placeholder={true}
                />
              </div>
          </div>
        </div>
      </div>
    );
  }
}