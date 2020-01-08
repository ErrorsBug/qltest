import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import InvitaHead from './components/invita-head';
import ReactCarousel from 'nuka-carousel';
import ReactSwiper from 'react-id-swiper'
import InvitaCard from './components/card'
import { request } from 'common_actions/common';
import { getCookie } from 'components/util';
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils';
import { initConfig } from '../../actions/home' 
import AppEventHoc from '../../components/app-event'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import { isAndroid } from 'components/envi';

@AppEventHoc
@InvitaCard
@autobind
class InvitationCard extends Component {
    state = {
        showUrl: '', 
        levelKey:{},
        couponAmount:0,
        total:0,
        inviteData:[],
        idx: 0
    }
    async componentDidMount(){
        await this.initData()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('card-box');
    } 
    componentWillReceiveProps({ maxCards }) {
        const { isQlchat, getCardUrl } = this.props;
        if(isQlchat && maxCards[this.state.idx]) {
            getCardUrl && getCardUrl(maxCards[this.state.idx])
        }
    }
    // 初始化获取数
    async initData(){
        const levelKey = await initConfig({businessType:'UFW_SHARE_LEVEL_KEY'})
        const {UFW_SHARE_COUPON_AMOUNT}=await initConfig({businessType:'UFW_CONFIG_KEY'})
        const inviteData=await this.listInviteUser()  
        const {total}=await this.ufwAccount()  
        this.setState({
            total,
            inviteData, 
            levelKey,
            couponAmount:UFW_SHARE_COUPON_AMOUNT
        },() => {
            this.initShare();
        }) 
    } 
    // 获取邀请的用户
    async listInviteUser() {
        const res = await request({
            url: '/api/wechat/transfer/h5/woman/university/listInviteUserByProfit',
            method: 'POST',
            body: {
                userId:getCookie("userId"),
                pageSize:3,
                pageNum:1
            }
        }).then(res => {
            if(res.state && res.state.code !== 0){
                throw new Error(res.state.msg)
            }
            return res; 
        }).catch(err => {
            window.toast(err.message);
        })
        return res && res.data  || {};
    }
    // 获取邀请的用户
    async ufwAccount() {
        const res=await request({
            url: '/api/wechat/transfer/h5/account/ufwAccount',
            method: 'POST',
            body: {
                 
            }
        }).then(res => {
            if(res.state && res.state.code !== 0){
                throw new Error(res.state.msg)
            }
            return res; 
        }).catch(err => {
            window.toast(err.message);
        })
        return res && res.data  || {}; 
    }
    showCurImg(url) {
        if(!url){
            const { isQlchat, onPress } = this.props;
            if(isQlchat){
                onPress && onPress(false);
            }
        }
        this.setState({
            showUrl: url
        })
    }
    beforeChange(from, to){
        if(from != to){
            this.setState({
                nextActive: to
            })
        }
    }
    initShare() {
        const { studentInfo, shareConfig } = this.props
        const params = {
            isTab: "N",
            wcl:'university_share'
        }
        if(studentInfo.shareType && !Object.is(studentInfo.shareType, "LEVEL_F")){
            params.userId = getCookie("userId")
        }
        let title = '千聊女子大学';
        let desc = '女性无需全能，但有无限可能。加入女子大学，追寻有能量的人，发现自己的能量。';
        let shareUrl = fillParams(params,`${ location.origin}/wechat/page/university/home`,['couponCode'])
        const imgUrl = 'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png'
        // h5分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });
        // app分享
        shareConfig({
            content: shareUrl,
            title: title,
            desc: desc,
            thumbImage: imgUrl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        })
    }
    clickInvite(e) {
        e.preventDefault();
        e.stopPropagation();
        const { isQlchat, onPress, getCardUrl, maxCards } = this.props;
        if(isQlchat){
            getCardUrl && getCardUrl(maxCards[this.state.idx])
            onPress && onPress();
        }
    }
    render() {
        const self = this;
        const { minCards, maxCards, studentInfo, len, isQlchat, getCardUrl } = this.props; 
        const { showUrl, inviteData, couponAmount,levelKey, total} = this.state; 
        const opt = {
            spaceBetween: isAndroid()?35:90, 
            freeMode:false,  
            touchRatio:0.5,  
            longSwipesRatio:0.1,  
            threshold:50,  
            followFinger:false,  
            observer: true,//修改swiper自己或子元素时，自动初始化swiper  
            observeParents: true,//修改swiper的父元素时，自动初始化swiper  
            on:{
                slideChangeTransitionStart: function(){
                    const { minCards, maxCards } = self.props; 
                    self.setState({
                        idx: this.activeIndex
                    })
                    if(isQlchat && maxCards[this.activeIndex]) {
                        getCardUrl && getCardUrl(maxCards[this.activeIndex])
                    }
                    if(!minCards[this.activeIndex]){
                        window.loading(true)
                    }
                }
            }
        }
        return (
            <Page title="邀请好友" className="card-box">
                <section className="scroll-content-container" onClick={ () => this.props.onPress(false) }>
                    <InvitaHead inviteData={inviteData} couponAmount={couponAmount} getMoney={levelKey[studentInfo?.shareType]} total={total}/>
                    <div className="card-swiper-box">
                        { !!minCards.length && (
                            <ReactSwiper {...opt} >
                                { Array.from({ length: len }).map((_, index) => (
                                    <div className="card-item " key={ index }>
                                        <img src={ minCards[index] } />
                                        <img className="max-img" onClick={ (e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            this.showCurImg(maxCards[index])
                                        } } src={ maxCards[index] } />
                                    </div>
                                )) }
                            </ReactSwiper>
                        )}
                    </div>
                    { !isQlchat && <div className="card-ti">长按图片保存或分享给好友</div> }
                    { isQlchat && <div className="app-card-btn" onClick={ this.clickInvite }>
                        <div>点击邀请</div>
                    </div>  }
                    { showUrl && (
                        <div className="card-dislog-box">
                            <div>
                                <div className="card-dislog-close" onClick={ () => this.showCurImg('') }></div>
                                <img src={ showUrl } />
                            </div>
                        </div>
                    )}
                </section>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(InvitationCard);