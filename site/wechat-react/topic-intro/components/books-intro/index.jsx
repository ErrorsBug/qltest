import React, { Component } from 'react'
import Picture from 'ql-react-picture'

export default class Index extends Component {
  state = {  }
  render() {
    return (
      <div className="books-intro-box">
        <div className="intro-head">
          <h2>《洗脑术：营销极客思想控制的荒唐怪诞者》</h2>
          <p>20年过去，定位思想已经深入人心。为纪念这一伟大的创新，原出版商推出20周年纪念版，此中文版《定位》即</p>
        </div>
        <div className="intro-lists">
          <h4>关于作者</h4>
          <p>本课让你的表达专业度快速上升5个Level！每节课分享1~2个套路，请专心听讲和思考。每节课严格规定在8~12分钟内，以便复习回听午休、上下班路上花个10分钟，不知不觉掌握精准表达！本课让你的表达专业度快速上升5个Level！</p>
          <Picture />
        </div>
      </div>
    );
  }
}