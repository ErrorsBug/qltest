import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import './style.scss';
import bg7 from '../../img/bg7.png';
import zsleft from '../../img/zsleft.png';
import zsright from '../../img/zsright.png';
import year from '../../img/year.png';
import jt from '../../img/jt.png';

class Antistop extends PureComponent {
    render() {
        const { beatPercent, keyWord } = this.props.userInfo
        const { pageSix } = this.props
        return (
            <div className="six-page">
                <div className="six-page-cont">
                    <div className={pageSix ? 'year one-flash' : 'year'}>
                        <img src={year} />
                    </div>
                    <p className={pageSix ? 'antistop-title three-flash' : 'antistop-title'}>我的蜕变关键词</p>
                    <div className={pageSix ? 'honor five-flash' : 'honor'}>
                        <p className="honor-title">{keyWord}</p>
                        <div className="honor-img">
                            <img className="zsleft" src={zsleft} />
                            <p className="wire"></p>
                            <img className="zsright" src={zsright} />
                        </div>
                    </div>
                    <div className={pageSix ? 'copywriter seven-flash' : 'copywriter'}>
                        <p>这一年对我来说特别有意义<br />蜕变觉醒，破茧成蝶<br />行动力超过 <span>{beatPercent}</span> 的人<br />学到的知识已成为我的战衣</p>
                    </div>
                </div>
                <div className="jt">
                    <img src={jt} />
                </div>
                <div className={pageSix ? 'bg7 bg1-flash' : 'bg7'}>
                    <img src={bg7} />
                </div>
            </div>
        )
    }
}

export default Antistop