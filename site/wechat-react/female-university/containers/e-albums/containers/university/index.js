import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import './style.scss';
import bg2 from '../../img/bg2.png';
import rw2 from '../../img/rw2.png';
import jt from '../../img/jt.png';

/**action */
import { getAlbumInfo } from '../../../../actions/camp'

class University extends PureComponent {
    state = {
        userInfo: {
            Circle: [
                '育儿圈',
                '理财圈',
                '职场圈',
                '变美圈',
                "健康圈",
                "呼啦圈"
            ]
        }
    }
    render() {
        const { Circle } = this.state.userInfo
        const { pageFour } = this.props
        let CircleCont = []
        for (let i = 0; i < 6; i++) {
            CircleCont.push(Circle[i])
        }
        return (
            <div className="four-page">
                <div className="four-page-box">
                    <p className={pageFour ? 'timer one-flash' : 'timer'}>大学真的很精彩<br /><span>8</span>大学院，<span>120+</span>们精品课，<span>300+</span>本好书<br />还有<span>9</span>大学习营一步步带我蜕变</p>
                    <p className={pageFour ? 'cont-one three-flash' : 'cont-one'}>最重要是，有志同道合的圈子</p>
                    <div className={pageFour ? 'circle five-flash' : 'circle'}>
                        {
                            CircleCont.map((item, idx) => {
                                return <div key={idx}>{idx > 4 ? '......' : item}</div>
                            })
                        }
                    </div>
                    <p className={pageFour ? 'f-bottom seven-flash' : 'f-bottom'}><i className="iconfont iconyinhao"></i> 选对圈子，<br />感觉开启了人生新副本 <i className="iconfont iconyinhao"></i></p>
                </div>
                <div className="jt">
                    <img src={jt} />
                </div>
                <div className="four-page-bg">
                    <img className={pageFour ? 'bg2 bg1-flash' : 'bg2'} src={bg2} />
                    <img className={pageFour ? 'rw2 bg2-flash' : 'rw2'} src={rw2} />
                </div>
            </div>
        )
    }
}

export default University