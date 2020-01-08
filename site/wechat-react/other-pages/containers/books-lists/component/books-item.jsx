import React, { Component } from 'react'
import Picture from 'ql-react-picture'
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import {
  digitFormat,
  getAudioTimeShow,
  locationTo,
  formatMoney
} from 'components/util';

@autobind
export default class BooksItem extends Component {

  goMini(e,topicId){
    e.stopPropagation();
    e.preventDefault();
    locationTo(`/topic/details-listening?topicId=${ topicId }`)
  }
  toTopic(topicId){
    locationTo(`/wechat/page/topic-intro?topicId=${ topicId }`)
  }
  render() {
    const { title, bookList = [], latest } = this.props;
    return (
      <div className="books-item">
        <div className={`item-title${latest ? ' newest' : ''}`}></div>
        <h2><span>{ title }</span></h2>
        <div className="books-lists-box">
          { bookList.map((item,index) => (
            <div key={ index } 
              data-log-region={"books-item"}
              data-log-pos={ index }
              data-log-name={ item.name }
              className="books-topic on-visible on-log" onClick={ () => this.toTopic(item.topicId) }>
              <div className="books-img">
                <Picture src={ item.headImageUrl } placeholder={true} resize={{w:'162',h:'201'}} />
                { item.label && <p>{ item.label }</p> }
              </div>
              <div className="books-intro">
                <div className="item-info">
                  <h3>{ item.name }</h3>
                  <p>{ item.description }</p>
                </div>
                <div className="item-tip">
                  <div className="books-decs">
                    <span>{ digitFormat(item.learningNum) }次学习 | 时长{ getAudioTimeShow(item.duration) }</span>
                  </div>
                  <div onClick={ (e) => { this.goMini(e, item.topicId) } } className={ `books-pos ${Object.is(item.isAuth, 'Y') || Object.is(item.isAuditionOpen,'Y') || !item.money ? 'books-play' : ''}` }>
                    {
                      (!Object.is(item.isAuth, 'Y') && !Object.is(item.isAuditionOpen,'Y') && !!item.money) ?
                          <span>￥{formatMoney(item.money)}</span>
                          :
                          '播放'
                    }
                  </div>
                </div>
              </div>
            </div>
          )) }
        </div>
      </div>
    );
  }
}