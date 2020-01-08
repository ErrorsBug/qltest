import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import FlagItem from '../../components/flag-item';
import FlHead from './components/fl-head';
import Footer from '../../components/footer';
import { universityFlag,flagHelpList ,universityFlagList, doPayForCard } from '../../actions/flag';
import {fillParams, getUrlParams } from 'components/url-utils'; 
import { getCookie,formatDate, locationTo } from 'components/util';  
import PosterDialog from '../../components/poster-dialog';
import FlagFailDialog from '../../components/flag-fail-dialog'; 
import { initMinCards,initSuccessCards } from '../../components/poster-card'
import DialogRule from '../flag-wait/components/dialog'; 
import { falgShareProgress,falgShareSuccess } from '../../components/flag-share';
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit';
import Detect from "components/detect";
import { getDomainUrl } from "../../../actions/common"; 
import AppEventHoc from '../../components/app-event' 
import HandleAppFunHoc from 'components/app-sdk-hoc'
 
@HandleAppFunHoc 
@AppEventHoc 
@autobind
class FlagList extends Component {
    state = {
        isNoMore: false,
        universityFlagData:{},
        flagHelpListData:{},
        lists: [],
        isRule: false,
        isShowFail: false, 
        isShowProcess:false,
        isShowType:"",
        processUrl:"",
        isShowRule:false
    }
    page = {
        size: 20,
        page: 1
    }
    isLoading = false;
    get code(){
        return getUrlParams('nodeCode', '')
    }
    componentDidMount() {
       this.initData();
       this.getUniversityFlagList() 
       
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('fl-scroll-box');
    }
    componentDidUpdate(){
        document.querySelector('.co-dialog-container')&&limitScrollBoundary(document.querySelector('.co-dialog-container')) 
    }
    async initData() { 
        setTimeout(()=>{
            window.loading&&window.loading(true) 
            if(localStorage.userFlag){ 
                this.setState({
                    universityFlagData:JSON.parse(localStorage.userFlag)
                }) 
            }
        })
        const universityFlagData = await universityFlag();
        const flagHelpListData = await flagHelpList();
        this.setState({
            universityFlagData,
            flagHelpListData
        },()=>{
            window.loading&&window.loading(false)
            this.initShare()
        }) 
        
        // 安卓回调
        this.props.onSuccess('onSuccess', () => {
            this.onPaySuccess()
        })
    }
    
    async getUniversityFlagList(){
        const { flagList = [] } = await universityFlagList({
            ...this.page,
            order:'prize',
            helpHeadImg:"Y",
            indexPage:'Y'
        });
        if(!!flagList){
            if(flagList.length >= 0 && flagList.length < this.page.size){
                this.setState({
                    isNoMore: true
                }) 
            }  
            this.setState({
                lists: [...this.state.lists, ...flagList]
            })
        }

    }
    async loadNext(next) { 
        if(this.isLoading || this.state.isNoMore) return false;
        this.page.page += 1;
        this.isLoading = true;
        await this.getUniversityFlagList();
        this.isLoading = false;
        next && next();
    }

    //全量补卡下单支付
    async doPayForCardFunc(){  
        let reqParams = {
            ch: 'payForCard',
            channelNo: 'qldefault',
            ifboth: 'Y',
            source: (Detect.os.weixin && (Detect.os.ios||Detect.os.android))?'h5':'web',
            // url: '/api/wechat/transfer/baseApi/h5/pay/universityCardOrder',
            all: 'Y',
        };
        // app 调起支付
        if (this.props.isQlchat) { 
            this.props.handleAppSdkFun('resign', {  
                all: 'Y',
                aos:'cardpay',
                callback: () => {
                    this.onPaySuccess()
                }
            }) 

        // 微信及H5支付
        } else {
            locationTo(`/wechat/page/payment?reqParams=${JSON.stringify(reqParams)}&type=flag-all`)
        }
         
    }
    onPaySuccess(){
        window.toast("成功支付") 
        locationTo(`${ location.origin }/wechat/page/flag-home?recard=all`) 
    }
      
    initShare(){
        const {universityFlagData} =this.state 
        if(universityFlagData?.status=='success'||universityFlagData?.status=='pay'){
            falgShareSuccess({ 
                imgUrl:'https://img.qlchat.com/qlLive/business/UD43R93V-77ZE-NH9H-1560398414611-P1T4XCLNBVZP.png',
                successFn:  this.successFn
            }) 
            return
        }
        falgShareProgress({ 
            imgUrl:'https://img.qlchat.com/qlLive/business/UD43R93V-77ZE-NH9H-1560398414611-P1T4XCLNBVZP.png',
            successFn:  this.successFn
         }) 
    }
     
    successFn(){
        // 分享成功日志 
        typeof _qla != 'undefined' && _qla('event', {
            category:`${this.state.isShowType||'flag-list'}`,
            action:'success'
        });
        this.setState({ 
            isRule: false,
            isShowFail: false, 
            isShowProcess:false,
            isShowType:"",
            processUrl:"",
            isShowRule:false
         })
         this.initShare()
        
    }
    async initMinCards(){  
        const { universityFlagData,flagHelpListData } = this.state 
        initMinCards(universityFlagData,flagHelpListData?.data?.flagHelpList,(url)=>{
            this.setState({
                processUrl:url,
                isShowType:'pd-init'
            },()=>{
                this.showProcess()
                this.closeFail();
            })
        })
    }
    async initSuccessCards(){ 
        const { universityFlagData,flagHelpListData } = this.state 
        initSuccessCards(universityFlagData,flagHelpListData?.data?.flagHelpList,(url)=>{
            this.setState({
                processUrl:url,
                isShowType:'pd-success'
            },()=>{
                this.showProcess()
            })
        }) 
    }
    colse(){
        this.setState({
            isShowProcess: false, 
            isShowType:''
        })
    }
    showProcess(){
        this.setState({
            isShowProcess: true
        })
    }
    showFail(){
        this.setState({
            isShowFail: true,
        })
    }
    closeFail(){
        this.setState({
            isShowFail: false,
        })
    }  
    showRule(){
        this.setState({
            isShowRule:true
        })
    }
    closeRule(){
        this.setState({
            isShowRule:false
        })
    }

    render(){
        const {universityFlagData,flagHelpListData, isNoMore, lists } = this.state
        const {  isShowRule, isShowFail,isShowProcess,processUrl ,isShowType } = this.state;
        if(lists?.length>0&&universityFlagData?.userId){
            let i = lists.findIndex(item => item.userId == universityFlagData.userId)
            if(i>-1){ 
                lists.splice(i, 1) 
            }
        } 
        return (
            <Page title="坚持学习拿奖学金" className="flag-list-page">
                <ScrollToLoad 
                    className={`fl-scroll-box ${(isShowRule||isShowFail||isShowProcess) ? 'pointer-events-none':''}`}
                    toBottomHeight={300}
                    disable={ isNoMore }
                    loadNext={ this.loadNext }> 
                    <FlHead 
                        universityFlagData={universityFlagData} 
                        flagHelpListData={flagHelpListData} 
                        doPayForCard={this.props.doPayForCard}
                        initMinCards={this.initMinCards}
                        initSuccessCards={this.initSuccessCards}
                        showFail={this.showFail}
                        showRule={this.showRule} 
                        />
                    <div className={`fl-lists ${(universityFlagData&&universityFlagData.status)?"fl-footer":""}`}>
                        <div className="fl-title"> - 他们的小目标 - </div>
                        { lists.map((item, index) => (
                            <FlagItem 
                                {...item}
                                key={index}
                                onClick={()=>locationTo(`/wechat/page/flag-other?flagUserId=${item.userId}`)}
                                className={'fl-list-item'}
                            />
                        )) }
                        {
                            (universityFlagData&&universityFlagData.status)&&<Footer /> 
                        }
                    </div>
                </ScrollToLoad>
                
                <FlagFailDialog isShowFail={ isShowFail } {...universityFlagData}   close={ this.closeFail } initMinCards={this.initMinCards} doPayForCard={this.doPayForCardFunc}/>

                <PosterDialog 
                    isShow={ isShowProcess } 
                    imgUrl={processUrl}
                    on={2}
                    hideBtn={false}
                    close={ this.colse } 
                    className={isShowType} 
                    children={
                        <img src={processUrl} className={'on'}/>
                    }
                    />
                {
                    createPortal(
                        <DialogRule  isRule={ isShowRule } close={ this.closeRule } />
                        ,document.getElementById('app')
                    )
                }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    user: ''
});

const mapActionToProps = {
    doPayForCard
};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagList);