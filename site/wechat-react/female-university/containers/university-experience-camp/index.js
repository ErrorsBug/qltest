import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind , throttle} from 'core-decorators';
import Page from 'components/page';  
import { share } from 'components/wx-utils';
import { fillParams ,getUrlParams } from 'components/url-utils';
import Barrage from './components/barrage';
import { createPortal } from 'react-dom'; 
import PortalCom from '../../components/portal-com';
import { formatDate, locationTo, formatMoney } from 'components/util';
import { doPay } from 'common_actions/common'
import PayHoc from './pay-hoc'
import { getWxConfig, uploadImage,bindAppKaiFang } from '../../actions/common';
import UniPayBtnMain from './components/uni-pay-btn-main' 
import FloatRightTopBtn from '../../components/float-right-top-btn'
import { getStudentInfo } from '../../actions/home';   
import HandleAppFunHoc from 'components/app-sdk-hoc'
import AppEventHoc from '../../components/app-event'
import CampGiftEntry from '../../components/camp-gift-entry' 

@HandleAppFunHoc
@AppEventHoc
@PayHoc
@autobind
class UniversityExperienceCamp extends Component { 
    state = { 
        on:false,
        isShow: true,
        campObj: {},
        isSure: false,
        studentInfo:{}
    } 
    scrollContainer=null
    get campId(){ 
        return getUrlParams('campId', '')
    }

    async componentDidMount() {
        this.initData()
        bindAppKaiFang()
        sessionStorage.setItem('urlCampData', JSON.stringify(getUrlParams('', '')))
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-experience-scroll');
    } 
    async initData(){
        const {studentInfo} = await getStudentInfo()  
        this.setState({studentInfo})
    }
    componentWillReceiveProps({ campObj }){
        if(campObj != this.props.campObj){
            this.initShare(campObj)
            setTimeout(()=>{
                this.scrollContainer&&this.scrollContainer.addEventListener('scroll',this.onScrollHandle)
            },1000)
        }
    }
    
    // 初始化分享
    initShare(campObj) {
        let shareUrl = fillParams({},location.href,['shareKey']) 
        if(campObj && campObj.shareTitle) {
            share({
                title: campObj.shareTitle,
                timelineTitle: campObj.shareTitle,
                desc: campObj.shareDesc||'',
                timelineDesc: campObj.shareDesc||'',
                imgUrl: campObj.shareImg || 'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
                shareUrl: shareUrl
            });
        } else {
            wx.hideAllNonBaseMenuItem()
        }
    }
     
    
    @throttle(300)
    onScrollHandle() {  
        let on=this.scrollContainer.scrollTop>500
        if(on==this.state.on)return false
        this.setState({
            on
        })
    }
    // 弹窗
    sureBtn() {
        this.setState({
            isSure: !this.state.isSure
        })
    }
    toLearn(){
        const { campObj } = this.props 
        if(campObj?.courseType=='camp'){
            locationTo(`/wechat/page/channel-intro?channelId=${campObj.channelId}&experienceId=${campObj.id}&campType=${campObj.campType}&channelType=camp`)
        }else{
            locationTo(`/wechat/page/experience-camp-list?campId=${this.campId}&channelId=${ campObj.courseId }`)
        }
        
    }
    render(){
        const { campObj, payBtn,isStatus,campConfig, } = this.props 
        const { isSure,studentInfo,on } = this.state;
        if(!campObj) return null; 
        typeof _qla != 'undefined' && _qla.collectVisible();
        return (
            <Page title={ campObj.title || '' } className="uni-camp-box">
                {
                    //分销入口条件，分销类型，且开启分销入口，且未购，大学体验营需要非大学
                    campObj.shareType=='INTENTION_SHARE'&&campConfig?.entranceStatus=='Y'&&campConfig?.distributionStatus=='Y'&&campObj.buyStatus=='N'&&(!studentInfo?.studentNo||campObj.campType=='financing')&&
                    <FloatRightTopBtn 
                        data-log-name={ "招募合伙人" }
                        data-log-region="experience-camp-float"
                        data-log-pos={ 0 }
                        onClick={()=>{locationTo(fillParams(this.props.location.query,`/wechat/page/experience-camp-activity`,[]) )}}
                        className={`university-experience-camp-float on-log on-visible ${on?'on':''}`} 
                        img={"https://img.qlchat.com/qlLive/business/4187UJMY-Y351-RTFN-1573697519456-Z22L9HFBUJXB.png"} 
                        text="招募合伙人"/>
                }
                { 
                    campObj.buyStatus=='Y'?
                    <Fragment>
                        {
                            campConfig?.entranceStatus=='Y'&&campConfig?.distributionStatus=='Y'&&  
                            <div className={ `uni-pay-btn-put-top` }> 您已购买<span>{campObj.title}</span> </div>
                        }    
                        <PortalCom className={ `uni-pay-btn-put` }>
                            <div className="uni-pay-btn uni-pay-pink on-log on-visible" 
                                data-log-name={ "去学习" }
                                data-log-region="experience-camp-to-learn"
                                data-log-pos={ 0 }
                                onClick={this.toLearn }>去学习</div>
                            {
                                campConfig?.entranceStatus=='Y'&&campConfig?.distributionStatus=='Y'&&  
                                <div className="uni-pay-btn uni-pay-red on-log on-visible" 
                                    data-log-name={ "去推广" }
                                    data-log-region="experience-camp-to-put"
                                    data-log-pos={ 0 }  
                                    onClick={()=>{locationTo(`/wechat/page/experience-camp-activity?campId=${this.campId}`)}}>去推广</div> 
                            }
                        </PortalCom>
                    </Fragment> 
                    :
                    studentInfo?.studentNo&&campObj.campType=='ufw_camp'?
                    <Fragment>
                        {
                            campConfig?.entranceStatus=='Y'&&campConfig?.distributionStatus=='Y'?  
                            <Fragment>
                                <div className={ `uni-pay-btn-put-top` }> 大学校友无需加入预科班，去邀请你的好友加入吧 </div>
                                <PortalCom className={ `uni-pay-btn-put` }>
                                        <div className="uni-pay-btn uni-pay-red on-log on-visible" 
                                            data-log-name={ "去推广" }
                                            data-log-region="experience-camp-to-put-un"
                                            data-log-pos={ 1 }   
                                            onClick={()=>{locationTo(`/wechat/page/experience-camp-activity?campId=${this.campId}`)}}>去推广</div> 
                                </PortalCom>
                            </Fragment>
                            :
                            <div className={ `uni-pay-btn-put-top` }> 大学校友无需加入预科班</div>
                        }
                    </Fragment> 
                    :
                    isStatus ? (
                        <PortalCom className={ `uni-pay-btn` }>
                            <div> 
                                <div className="uni-pay-com uni-pay uni-pay-original" onClick={ () => payBtn() }>原价￥{ campObj.price || 0 }</div>
                                <div className="uni-pay-com uni-pay-red on-log on-visible" 
                                        data-log-name={ "免费兑换" }
                                        data-log-region="experience-camp-free-change"
                                        data-log-pos={ 0 }   
                                    onClick={this.sureBtn }>免费兑换</div> 
                            </div>
                        </PortalCom>
                        ) 
                    : createPortal(
                        <UniPayBtnMain {...this.props} {...campObj}/>
                        ,document.getElementById('app')
                    ) 
                } 
                <section className="un-experience-scroll" ref={ r => this.scrollContainer = r }> 
                    { campObj.resourceList && campObj.resourceList.length && (
                        <div className="uec-main"> 
                            <div className="uec-list">
                                {
                                    campObj.resourceList.map((item,index)=>{
                                        return(
                                            <div className="uec-item" key={index+1} onClick={ () => {
                                                item.jumpUrl && locationTo(item.jumpUrl)
                                            } }>
                                                <img src={item?.url} /> 
                                            </div> 
                                        )
                                    })
                                }
                            </div>
                        </div> 
                    ) }
                    {
                        this.props.url&&<img src={this.props.url}/>
                    }
                </section>
                { !(campObj.buyStatus === 'Y' || !!studentInfo?.studentNo) && (
                    createPortal(
                        <Barrage  
                            className={
                                campObj.buyStatus=='N'&&studentInfo?.studentNo&&campObj.campType=='ufw_camp'?
                                'jion-experience-page-status-center'
                                :isStatus?
                                'uni-pay-btn-status':''
                            }
                            actId={ this.campId }
                            doingSt={['成功加入蜕变营','已经开始学习','1分钟前添加了老师','刚刚抢购成功','5秒前购买成功', '刚刚分享了蜕变营', '3分钟前抢购成功', '15秒前加入蜕变营', '正在抢购下单']}
                        />
                        ,document.getElementById('app'))
                ) }  
                { isSure && (
                    <PortalCom className="uni-camp-sure">
                        <div className="uni-camp-sure-cont">
                            <h4>操作确认</h4>
                            <p>大学亲友卡只能免费兑换一次，确认使用亲友卡兑换该体验营的门票吗？</p>
                            <div className="uni-camp-sure-btns">
                                <div onClick={ this.sureBtn }>取消</div>
                                <div className="red" onClick={ () => payBtn(true) }>确认</div>
                            </div>
                        </div>
                    </PortalCom>
                ) }
                {
                    campObj.shareType=='INVITE_EVENT'&&campObj.inviteEventCode&&
                    <CampGiftEntry nodeCode={campObj.inviteEventCode} campId={this.campId}/>
                }
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = { 
    doPay,
    getWxConfig,
    uploadImage
};

module.exports = connect(mapStateToProps, mapActionToProps)(UniversityExperienceCamp);