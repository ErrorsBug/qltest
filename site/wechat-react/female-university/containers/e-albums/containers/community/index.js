import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ReactSwiper from 'react-id-swiper'
import './style.scss';
import bg6 from '../../img/bg6.png';
import rw6 from '../../img/rw6.png';
import dm from '../../img/dm.png';
import jt from '../../img/jt.png';
import like from '../../img/like.png';

class Community extends PureComponent {
    render() {
        const { likedNum, ideaNum, Barrage } = this.props.userInfo
        const { pageFive } = this.props
        const opt = {
            direction: 'vertical',
            loop: true,
            speed: 1000,
            spaceBetween: 10,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                reverseDirection: false,
            }
        }
        return <div className="five-page">
            <div className="five-page-box">
                <p className={pageFive ? 'timer one-flash' : 'timer'}>大学社区里</p>
                <p className={pageFive ? 'cont-one three-flash' : 'cont-one'}>校友们各抒己见，留下 <span>{ideaNum > 3000 ? parseInt(ideaNum / 1000) : '3'}000+</span> 条精彩想法</p>
                <p className={pageFive ? 'like-num three-flash' : 'like-num'} style={likedNum < 30 ? { display: 'none' } : { display: 'block' }}>我的想法备受认可，获得 <span>{likedNum || 0}</span> 个赞</p>
                <p className={pageFive ? 'f-bottom five-flash' : 'f-bottom'}><i className="iconfont iconyinhao"></i> 和姐妹抱团成长，<br />是我最开心的事情 <i className="iconfont iconyinhao"></i></p>
            </div>
            <div className="five-page-bg">
                <div className="dm">
                    <div className="dm-box">
                        <div className="dm-swiper">
                            <ReactSwiper {...opt}>
                                {   Barrage &&
                                    Barrage.map((item, idx) => {
                                        return <div className="dm-cont" key={idx}>
                                            <p className="dm-title">{item.name}</p>
                                            <p className="dm-interact">{item.userNum || 0}次互动，{item.ideaNum || 0}条想法</p>
                                        </div>
                                    })
                                }
                            </ReactSwiper>
                        </div>
                    </div>
                </div>
                <div className="like">
                    <img src={like} />
                </div>
                <div className="jt">
                    <img src={jt} />
                </div>
                <img className={pageFive ? 'bg6 bg1-flash' : 'bg6'} src={bg6} />
                <img className={pageFive ? 'rw6 bg2-flash' : 'rw6'} src={rw6} />
            </div>
        </div>

    }
}

export default Community