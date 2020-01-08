import React, { Component } from 'react'
import Picture from 'ql-react-picture'
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import { getAudioTimeShow, digitFormat, locationTo } from 'components/util'

@autobind
export default class Index extends Component {
  state = {  }
  goTopic(e){
    e.stopPropagation()
    locationTo(`/wechat/page/topic-intro?topicId=${ this.props.id }`)
  }
  render() {
    const { flag=true,name,description,iconUrl,duration,learningNum } = this.props; 
    const cls = classnames({
      'books-name': !flag
    })
    return (
      <div className="books-topic-item" onClick={ this.goTopic }>
        <div className="books-img">
            <Picture className="books-pic" src={ iconUrl } placeholder={true} resize={{w:'162',h:"207"}} />
        </div>
        <div className="books-intro">
          <div>
              <h3 className={ cls }>{name}</h3>
              { flag && <p>{ description }</p> }
              <div className="books-decs">{ digitFormat(learningNum) }次学习 | 时长{ getAudioTimeShow(duration) }</div>
          </div>
        </div>
      </div>
    );
  }
}