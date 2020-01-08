import React, { Component } from 'react';
import CallApp from 'callapp-lib';

import { autobind } from 'core-decorators'

@autobind
export default class  extends Component {
  state = {
    isShow: true
  }
  close(e){
    e.stopPropagation();
    this.setState({
      isShow: false
    })
  }
  goApp(){
    window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1415972989090"
  }
  render() {
    const { userInfo, show } = this.props;
    return (
      this.state.isShow &&
      (<div className="show-user-box">
      <div 
        className="on-visible on-log"
        data-log-region={`show-user-${ show }`}
        data-log-pos={ show }
        data-log-name={ show }
        onClick={ this.goApp }>
        <div className="show-img">
          <img src={ userInfo.headImgUrl } />
        </div>
        <div className="show-cont">
          <h3>{ userInfo.name }</h3>
          <p>在用<span>千聊</span>上课，邀请你一起学习</p>
        </div>
        <div className="show-close" onClick={ this.close }></div>
        <div className="go-app">去学习</div>
      </div>
    </div>)
    );
  }
}