import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getToTal, setAlbumLikeStatus, likeAlbum } from '../../../../actions/camp'
import { getUrlParams,  } from 'components/url-utils';
import { locationTo } from 'components/util'
import { fillParams } from 'components/url-utils';
import dz from '../../img/dz.png'
import flower from '../../img/rose.png';
import slh from '../../img/slh.png';
import mg from '../../img/mg.png';
import $ from 'jquery';

class LastPage extends PureComponent {
    state = {
        total: 0,
        clickOpen: true
    }
    componentDidMount() {
        let {getLikeList}=this.props
        getLikeList()
        this.getToTal()
    }
    //用户id
    get shareUserId() {
        return getUrlParams('shareUserId', '')
    }
    //获取点赞数量
    getToTal = async () => {
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
                }
            } else {
                window.toast('点赞失败')
            }
        } else {
            window.toast('今天没有点赞机会了')
        }
        this.props.handleLink()
        this.setState({
            total,
            clickOpen
        })
    }
    Flowerfly2 = () => {
        this.props.handleLink()
        window.toast('今天没有点赞机会了')
        return
    }
   
    FlowerflyEnd = () => {
        let clickOpen = true
        $('.mg').removeClass('mgFly')
        this.setState({
            clickOpen
        })
    }
    render() {
        const { total, clickOpen } = this.state
        const { likeList, nowPageNum, pageState, headImgUrl } = this.props
        let likeListArr = []
        if(likeList.length > 7){
            for (let i = 0; i < 7; i++) {
                likeListArr.push(likeList[i])
            }
        }else{
            likeListArr = [ ...likeList ]
        }
        
        return <div className="last-page">
            <div className="head-portrait">
                <img src={headImgUrl} />
            </div>
            <div className="copywrite">
                <p>别让自己的小花园荒芜<br />在灿烂的岁月里<br />每个人都可以绽放芳华<br />独立而自信，优雅而美丽</p>
            </div>
            <div className="dz-box" onClick={clickOpen ? this.Flowerfly.bind(this, pageState, nowPageNum) : this.Flowerfly2}>
                <div className="dz">
                    <p className="flower-num">{total}</p>
                    <p className="s-flower">送花</p>
                    <div className="mg" onAnimationEnd={this.FlowerflyEnd}>
                        <img src={mg} />
                        <p>+1</p>
                    </div>
                    <img className="flower" src={flower} />
                    <img src={dz} />
                </div>
                <div className="big-ripple"></div>
                <div className="big-ripple2"></div>
                <div className="big-ripple3"></div>
                <div className="big-ripple4"></div>
            </div>
            <div className="user-info">
                {
                    likeListArr.map((item, idx) => {
                        return <div key={idx}>
                            <img src={idx < 6 ? item.headImg : slh} />
                        </div>
                    })
                }
            </div>
        </div>

    }
}

export default LastPage