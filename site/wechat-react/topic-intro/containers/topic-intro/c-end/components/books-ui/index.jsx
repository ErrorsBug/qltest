import React, { Component } from 'react';
import Picture from 'ql-react-picture';

import {
	locationTo,
  imgUrlFormat,
  digitFormat,
  getAudioTimeShow
} from 'components/util';

export default class Index extends Component {
  render() {
    const { imgUrl, name, decs, duration, audienceCount, bookTagName } = this.props;
    return (
      <div className="books-box">
        <div className="books-head">
          <div className="books-img">
            <Picture className="books-pic" src={imgUrl} />
          </div>
          <div className="books-tab">
            <div className="books-play">{ digitFormat(audienceCount) }次学习</div>
            <div className="books-time">{ getAudioTimeShow(duration || 0) }</div>
            <div className="books-assort">{ bookTagName }</div>
          </div>
        </div>
        <div className="intro-head">
          <h2>{ name }</h2>
          <p>{ decs }</p>
        </div>
      </div>
    );
  }
}