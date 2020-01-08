import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import './style/scss';
import bg3 from '../../img/bg3.png';
import rw3 from '../../img/rw3.png';
import jt from '../../img/jt.png';

/**action */
import { getAlbumInfo } from '../../../../actions/camp'

class RecentDevelopments extends PureComponent {
    render() {
        const { recentCampSignUpNum, recentCampName, campNum, otherCampName, knowledgeNum, learnTime } = this.props.userInfo
        const { pageThree } = this.props
        return <div className="three-page">
            <div className="three-page-box">
                <p className={pageThree ? 'timer one-flash' : 'timer'}>最近一个月<br/>我和 <span>{recentCampSignUpNum || 0}</span> 位姐妹一起报名 <span><br/>《{recentCampName}》</span></p>
                { !!otherCampName?.length && (
                    <p className={pageThree ? 'cont-one three-flash' : 'cont-one'}>
                        另外，我还参加过 <span>{campNum}</span> 个营 - {otherCampName && otherCampName.map((item, idx) => (<span className='otherCamp' key={idx}>{item}</span>))}
                    </p>
                ) }
                <p className={pageThree ? 'cont-one three-flash' : 'cont-one'}>
                    我累计学习 <span>{learnTime || 0}</span> 分钟<br />
                    { knowledgeNum > 5 ? <>系统掌握了 <span>{knowledgeNum || 0}</span> 个知识点</> : '系统掌握很多知识点' }
                </p>
                <p className={pageThree ? 'f-bottom five-flash' : 'f-bottom'}><i className="iconfont iconyinhao"></i> 每天进步一点点，<br />真的很充实 <i className="iconfont iconyinhao"></i></p>
            </div>
            <div className="jt">
                <img src={jt} />
            </div>
            <div className="three-page-bg">
                <img className={pageThree ? 'bg3 bg1-flash' : 'bg3'} src={bg3} />
                <img className={pageThree ? 'rw3 bg2-flash' : 'rw3'} src={rw3} />
            </div>
        </div>

    }
}

export default RecentDevelopments