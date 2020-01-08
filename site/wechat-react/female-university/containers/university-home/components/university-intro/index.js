import React, { PureComponent, Fragment } from 'react';
import { autobind } from 'core-decorators';
import ScrollShowInfo from '../scroll-show';
import Scholarship from '../scholarship';
import { locationTo, imgUrlFormat } from 'components/util';
import Search from '../../../../components/search'
import classnames from 'classnames'

@autobind
export default class extends PureComponent{
    state = {
        isShow: false,
    }
    componentDidMount() {
        this.initScroller();
    }
    initScroller() {
        const scrollNode = typeof document != 'undefined' && document.querySelector('.scroll-content-container');
        scrollNode.addEventListener('scroll', () => {
            const top = this.userRef.getBoundingClientRect().top
            if(top >= 0){
                this.setState({
                    isShow: false
                })
            } else {
                this.setState({
                    isShow: true
                })
            }
        })
    }
    handleLink(){
        locationTo('/wechat/page/university/community-home')
    }
    render() {
        const { isShow } = this.state;
        const { userInfo = {}, isAnimite, onAnimationEnd, isMarkCommunity = false } = this.props;
        const cls = classnames('un-intro-pic on-visible on-log', {
            'un-community-home': isMarkCommunity
        })
        return (
            <Fragment >
                <div className="un-intro-box" ref={ r => this.userRef = r }>
                    <div className="un-intro-cont">
                        <div className="un-intro-user on-visible on-log"
                            data-log-name="个人主页"
                            data-log-region="un-community-home"
                            data-log-pos="0" 
                            onClick={ this.handleLink }>
                            <div className="un-intro-pic"><img src={ imgUrlFormat(userInfo.headImgUrl || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_130,w_130','/0')  } alt=""/></div>
                            <div className="un-intro-info">
                                <p>{ userInfo.userName }</p>
                                <span>个人主页</span>
                            </div>
                        </div>
                        <div className="un-intro-controll">
                            <div className="un-intro-search on-visible on-log" 
                                data-log-name="搜索"
                                data-log-region="un-search-btn"
                                data-log-pos="0" 
                                onClick={ () => locationTo(`/wechat/page/search?source=university`) }><i className="iconfont iconsousuo"></i> 找课</div>
                            { !isShow && !!userInfo.shareType && !Object.is(userInfo.shareType, 'LEVEL_F') && <Scholarship /> }
                        </div>
                    </div>
                </div>
                <ScrollShowInfo 
                        className={ isShow ? 'show' : '' } 
                        isAnimite={ isAnimite }
                        onAnimationEnd={ onAnimationEnd }
                        isShow={ !Object.is(userInfo.shareType, 'LEVEL_F') } 
                        userName={ userInfo.userName } url={ userInfo.headImgUrl } />
            </Fragment>
            
        )
    }
}