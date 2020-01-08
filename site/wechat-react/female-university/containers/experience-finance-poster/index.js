import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import InvitaHead from './components/invita-head';
import ReactSwiper from 'react-id-swiper' 
import { request } from 'common_actions/common';
import { getCookie, locationTo } from 'components/util';
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils';
import { initConfig } from '../../actions/home' 
import AppEventHoc from '../../components/app-event'
import { isAndroid } from 'components/envi';
import BasicData from '../experience-finance/basic-data'
import { invitationCard } from './components/card/card'
import QRCode from 'qrcode'
import { getBaseUserInfo } from "../../actions/common"; 

@BasicData
@AppEventHoc 
@autobind
class InvitationCard extends Component {
    state = {
        showUrl: '', 
        levelKey:{},
        couponAmount:0,
        total:0,
        dataList:[],
        idx: 0,
        user:{},
        minCards:[], 
        maxCards:[],
    }
    dataList=[]
    index = 0; 
    get campId(){
        return getUrlParams('campId','')
    }
    async componentDidMount(){ 
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('card-box');
    } 
    
    async componentDidMount(){
    } 
    
    componentWillReceiveProps({ financialCamp,getShareMoneyData }){
        if(financialCamp != this.props.financialCamp){
            this.initMinCards(financialCamp,getShareMoneyData);  
        }
    } 
    // 生成二维码
    async getQr (getShareMoneyData){ 

        let params={wcl:'finance_share',campId:this.campId}
        if(getShareMoneyData?.isShareUser==='Y'){
            params.userId=getCookie('userId')
            params.couponType='share' 
        }
        let neUrl = fillParams(params,`${location.origin}/wechat/page/experience-finance`,[])  
        // https://ql.kxz100.com
        const res=QRCode.toDataURL(neUrl, {
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff" 
          })
            .then(url => {
                return url
            })
            .catch(err => {
                console.error(err)
            })     
        return res
    }
     
    async initMinCards(financialCamp,getShareMoneyData){ 
        window.loading&&window.loading(true)
        const {user={}}=await getBaseUserInfo()
        const qrUrl=await this.getQr(getShareMoneyData) 
        invitationCard('https://img.qlchat.com/qlLive/business/6BBFIGOR-8CM3-L939-1571738176362-1Y8CDULSC7HU.png',
            {...financialCamp,qrUrl,userName:user.name,userHeadImgUrl:user.headImgUrl},(url)=> {
            this.initMaxCards(url);
        }, 610, 856);
    }
    initMaxCards(minUrl){
        this.setState({ 
            maxCards: [...this.state.maxCards, minUrl],
            minCards: [...this.state.minCards, minUrl],
        },() => {
            this.index += 1;
            window.loading(false)
            if(this.index < this.dataList.length){
                this.initMinCards();
            } 
        })
    } 
    showCurImg(url) {
        if(!url){
            const { isQlchat, onPress } = this.props;
            if(isQlchat){
                onPress && onPress(false);
            }
        }
        window.showImageViewer(url,[url]); 
    }
    beforeChange(from, to){
        if(from != to){
            this.setState({
                nextActive: to
            })
        }
    }  
    render() {
        const self = this;
        const {  studentInfo,   isQlchat, getCardUrl,financialCamp ,getShareMoneyData} = this.props; 
        const { minCards, maxCards, dataList, couponAmount,levelKey, total} = this.state; 
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
                    const { minCards, maxCards } = self.state; 
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
        if(getShareMoneyData?.isShareUser==='N'){locationTo(`/wechat/page/experience-finance?campId=${this.campId}`)}
        return (
            <Page title="邀请好友" className="experience-finance-poster">
                <section className="scroll-content-container" onClick={ () => this.props.onPress(false) }>
                    <InvitaHead  couponAmount={getShareMoneyData?.redMoney||0} getMoney={getShareMoneyData?.shareMoney}/>
                    <div className="card-swiper-box">
                        { !!minCards.length && (
                            <ReactSwiper {...opt} >
                                { Array.from({ length: 1 }).map((_, index) => (
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