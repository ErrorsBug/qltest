import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import './style.scss';
import bg5 from '../../img/bg5.png';
import rw5 from '../../img/rw5.png';
import jt from '../../img/jt.png';

/**action */
import { getAlbumInfo } from '../../../../actions/camp'

class AggregateRead extends PureComponent {
    
    render() {
        const { bookNum, courseNum, listenNum, noteWordNum, interestSubject, subjectNum } = this.props.userInfo
        const { pageTwo } = this.props
        return <div className="two-page">
            <div className="two-page-box">
                <p className={pageTwo ? 'timer one-flash' : 'timer'}>在图书馆，我翻阅了 <span>{bookNum > 5 ? bookNum : 5}</span> 本书 </p>
                <p className={pageTwo ? 'addBook three-flash' : 'addBook'} style={courseNum > 5 ? { display: 'block' } : { display: 'none' }}>在学院里，我添加了 <span>{courseNum || 0}</span> 门课<br/>对{interestSubject}的内容尤其感兴趣</p>
                <p className={pageTwo ? 'subject three-flash' : 'subject'} style={courseNum > 5 ? { display: 'none' } : { display: 'block' }}>在学院里，我添加了 <span>{subjectNum || 0}</span> 个学科<br/>对亲子类的内容尤其感兴趣</p>
                <p className={pageTwo ? 'cont-one five-flash' : 'cont-one'}>到现在，我累计收听课程 <span>{listenNum}</span> 次<br/>认真写了 <span>{noteWordNum > 1000 ? noteWordNum : `1000+`}</span> 字的笔记</p>
                <p className={pageTwo ? 'f-bottom seven-flash' : 'f-bottom'}><i className="iconfont iconyinhao"></i> 知识和智慧，<br/>让我愈发温柔而有力量 <i className="iconfont iconyinhao"></i></p>
            </div>
            <div className="jt">
                <img src={jt} />
            </div>
            <div className="two-page-bg">
                <img className={pageTwo ? 'bg5 bg1-flash' : 'bg5'} src={bg5} />
                <img className={pageTwo ? 'rw5 bg2-flash' : 'rw5'} src={rw5} />
            </div>
        </div>

    }
}

export default AggregateRead