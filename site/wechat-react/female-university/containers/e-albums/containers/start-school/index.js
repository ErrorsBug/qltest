import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getAlbumLikeStatus } from '../../../../actions/camp'
import './style.scss';
import bg1 from '../../img/bg1.png';
import rw1 from '../../img/rw1.png';
import jt from '../../img/jt.png'
import { request } from 'actions/common';
import { getUrlParams } from 'components/url-utils';

class StartSchool extends PureComponent {
    //用户id
    get shareUserId() {
        return getUrlParams('shareUserId', '')
    }
    render() {
        const { year, month, date, classNo, enterDay, classmateNum } = this.props.userInfo
        const { pageOne } = this.props
        return <div className="page">
            <div className="page-box">
                <p className="timer one-flash">{year}年{month}月{date}日</p>
                <p className={pageOne ? 'cont-one three-flash' : 'cont-one'}>在这天，我加入了千聊女子大学<br/>成为<span>{year}级{classNo}班</span>的一员</p>
                <p className={pageOne ? 'cont-two five-flash' : 'cont-two'}>在这里，我认识了 <span>{classmateNum || 0}</span> 位同学<br/>我们抱团精进，共同成长了 <span>{enterDay || 0}</span> 天了</p>
                <p className={pageOne ? 'f-bottom seven-flash' : 'f-bottom'}><i className="iconfont iconyinhao"></i> 我相信，要到达的远方，<br/>现在就要起航 <i className="iconfont iconyinhao"></i></p>
            </div>
            <div className="jt">
                <img src={jt} />
            </div>
            <div className="page-bg">
                <img className={pageOne ? 'bg1 bg1-flash' : 'bg1'} src={bg1} />
                <img className={pageOne ? 'bg2 bg2-flash' : 'bg2'} src={rw1} />
            </div>
        </div>

    }
}

export default StartSchool