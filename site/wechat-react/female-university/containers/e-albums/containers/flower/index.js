import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PortalComp from '../../../../components/portal-com'
import { setAlbumLikeStatus, likeAlbum, getToTal } from '../../../../actions/camp'
import { getUrlParams } from 'components/url-utils';
// import './style.scss';
import rose from '../../img/rose.png'
import dz from '../../img/dz.png';
import mg from '../../img/mg.png';


import $ from 'jquery';
import { request } from 'actions/common';
import { log } from 'async';

const arrPage = ['ruxue', 'xuexishuju', 'xuexiying', 'quanzi', 'shequ', 'guanjianci']

class Flower extends Component {
    state = {
        total: 0,
        nowData: '',
        clickOpen: true,
        isShow: false
    }
    componentDidMount() {
        let {getLikeList} = this.props
        getLikeList()
        this.getToTal()
    }
    //用户id
    get shareUserId() {
        return getUrlParams('shareUserId', '')
    }
    //获取点赞数量
    getToTal = async () => {
        // businessId: this.shareUserId
        const result = await getToTal({ businessId: this.shareUserId }) || {}
        let { total } = result
        this.setState({
            total
        })
    }
    //飞花效果
    Flowerfly = async (pageState, nowPageNum) => {
        let clickOpen = false
        let { total } = this.state
        if (pageState[nowPageNum].result === 'N') {
            $('.mg').addClass('mgFly')
            let { result } = await likeAlbum({ businessId: this.shareUserId })
            if(Object.is(result,'Y')) {
                let { result: status } = await setAlbumLikeStatus({ businessId: this.shareUserId,key:nowPageNum+1 })
                if(Object.is(status, 'Y')) {
                    total += 1
                    pageState[nowPageNum].result = 'Y'
                    this.props.setPageState(pageState)
                    this.getToTal()
                }
            } else {
                window.toast('点赞失败')
            }
        } else {
        }
        this.setState({
            total,
            clickOpen,
            isShow: true
        })
    }
    Flowerfly2 = () => {
        this.setState({
            isShow: true
        })
        return
    }
    FlowerflyEnd = () => {
        let clickOpen = true
        $('.mg').removeClass('mgFly')
        this.setState({
            clickOpen
        })
    }
    onClose = (e) => {
        e && e.stopPropagation();
        e && e.preventDefault();
        this.setState({
            isShow: false
        })
    }
    render() {
        const { likeList, nowPageNum, pageState, isSelf } = this.props
        const { total, clickOpen, isShow } = this.state
        let likeListArr = []
        if(likeList.length > 5){
            for (let i = 0; i < 4; i++) {
                likeListArr.push(likeList[i])
            }
        }else{
            likeListArr = [...likeList]
        }
        return (
            <Fragment>
                <PortalComp>
                    <div className="flower-box">
                        <div className="flower on-log" onClick={clickOpen ? this.Flowerfly.bind(this, pageState, nowPageNum) : this.Flowerfly2}>
                            <p className="flower-num">{total}</p>
                            <p className="dz">{ pageState[nowPageNum].result === 'Y' ? '已送' : '送花' }</p>
                            <img className="rose" src={rose} />
                            <img src={dz} />
                            <div className="mg" onAnimationEnd={this.FlowerflyEnd}>
                                <img src={mg} />
                                <p>+1</p>
                            </div>
                        </div>
                        <div className="ripple"></div>
                        <div className="ripple2"></div>
                        <div className="ripple3"></div>
                        <div className="ripple4"></div>
                        <div className="user">
                            {
                                likeListArr.map((item, idx) => {
                                    return <div className="user-box" key={idx}>
                                        <img src={item.headImg} />
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </PortalComp>
                { (!isSelf && isShow) && (
                    <PortalComp className="flower-tip-box">
                        <div className="on-log"
                            data-log-name=""
                            data-log-region={ `flower-${arrPage[nowPageNum] }-btn` }
                            data-log-pos={nowPageNum}
                            onClick={ this.props.handleLink } >
                            <div className="flower-tip-close" onClick={ this.onClose }><i className="iconfont iconxiaoshanchu"></i></div>
                            <img src={ this.props.headImgUrl } alt=""/>
                            <p>太感谢啦！想了解我在学什么吗？<span>点击可查看哦~</span></p>
                        </div>
                    </PortalComp>
                ) }
            </Fragment>
        )
    }
}

export default Flower