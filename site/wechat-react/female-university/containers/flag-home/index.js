import React, { Component } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad'; 
import FhHead from './components/fh-head';
import FhDate from './components/fh-date';
import FhFlag from './components/fh-flag';
import FhList from './components/fh-list';
import FhBottomBtn from './components/fh-bottom-btn';
import DialogRecard from './components/dialog/recard'; 
import { universityFlag,flagHelpList,universityFlagCardList, doPayForCard,getFlagCardBg} from '../../actions/flag';
import { getUrlParams } from 'components/url-utils';
import { formatMoney, locationTo ,formatDate} from 'components/util'; 
import PosterDialog from '../../components/poster-dialog'; 
import CashDialog from './components/cash-dialog'; 
import FlagFailDialog from '../../components/flag-fail-dialog'; 
import { initMinCards,initSuccessCards ,initDaysCards} from '../../components/poster-card' 
import { falgShareProgress ,falgShareSuccess} from '../../components/flag-share';
import WdRule from './components/dialog/wd-rule'; 
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit';
import Detect from "components/detect";
import { getStudentInfo } from "../../actions/home";
import UniversityHome from 'components/operate-menu/home' 
import AppEventHoc from '../../components/app-event' 
import HandleAppFunHoc from 'components/app-sdk-hoc'
 
@HandleAppFunHoc 
@AppEventHoc 
@autobind
class FlagHome extends Component {
    state = {
        universityFlagData:{},
        flagHelpListData:{},
        shareId:'', 
        upNumber:0,
        isShowProcess:false, 
        isShowType:"", 
        isShowRecard:false,  
        showCashIndex:2,
        recardDate:'',
        showCashType:'',
        isShowFail: false,
        isShowWithdraw:false,
        studentInfo:{}
    }   
    componentDidMount() {
       this.initData();
       
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('fh-scroll-box');
    }
    componentDidUpdate(){
        document.querySelector('.co-dialog-container')&&limitScrollBoundary(document.querySelector('.co-dialog-container')) 
    }
    //初始化数据
    async initData() {
        const universityFlagData = await universityFlag({
            cardDate: formatDate(new Date()) 
        });  
        const flagHelpListData = await flagHelpList();
        const { flagCardList = [] } = await universityFlagCardList();
        this.setState({
            universityFlagData,
            flagHelpListData,
            flagCardList
        },()=>{
            this.initShare()
        })  
        this.showPoster(universityFlagData) 
        
        // 安卓回调
        this.props.onSuccess('onSuccess', () => {
            this.onPaySuccess()
        })
        localStorage.setItem('userFlag',JSON.stringify(universityFlagData))
         
    } 
    successFn(){
        // 分享成功日志 
        typeof _qla != 'undefined' && _qla('event', {
            category:`${this.state.isShowType||'flag-home'}`,
            action:'success'
        });
        this.setState({
            isShowProcess:false, 
            isShowType:"", 
            isShowRecard:false,    
            showCashType:'',
            isShowFail: false,
        })
        this.initShare()
    }
    initShare(){
        const {universityFlagData} =this.state 
        if(universityFlagData.status=='success'||universityFlagData.status=='pay'){
            falgShareSuccess({ 
                successFn:  this.successFn
            }) 
            return
        }
        falgShareProgress({ 
            successFn:  this.successFn
        }) 
    }
    //首次，每天第一次，对比上一次金额有变化，进入弹窗显示金额
    showPoster(data){ 
        //新打卡
        if(getUrlParams('cardDate','')
            &&(!localStorage.newCardDate||localStorage.newCardDate!=formatDate(getUrlParams('cardDate','')))){
            this.shareDay(getUrlParams('cardDate',''))
            localStorage.setItem('newCardDate',formatDate(getUrlParams('cardDate','')))
            return
        } 
        //进入页面弹出成就卡
        const {status} = this.state.universityFlagData 
        if(getUrlParams('status','')=='success'&&(status=='success'||status=='pay')){
            this.initSuccessCards()
            return
        }
        //补卡成功
        if(!!(getUrlParams('recard','')&&getUrlParams('recard','')!=localStorage.recard)){
            localStorage.setItem('recard',getUrlParams('recard',''))
            if(getUrlParams('recard','')=='all'){
                this.initSuccessCards()
                return
            }
            this.setState({
                isShowRecard:true,
                recardDate:getUrlParams('recard','')
            }) 
            return
        }   
        
        if(data.money<16000&&(data.status!='success'&&data.status!='pay')){ 
            const userFlag = localStorage.userFlag 
            const addNum = userFlag?data.helpNum-JSON.parse(userFlag).helpNum:0
            //首次
            if(!userFlag||addNum<0){
                this.setState({
                    showCashType:'first',
                    isShowType:'pd-first'
                })  
                localStorage.setItem('date',formatDate(new Date()))
                setTimeout(function(){
                    typeof _qla != 'undefined' && _qla.collectVisible();
                }, 0);
                return
            }
            //金额有变化
            if(JSON.parse(userFlag).helpNum!=data.helpNum){
                this.setState({
                    showCashType:'change',
                    isShowType:'pd-change',
                    upNumber:addNum
                })  
                localStorage.setItem('date',formatDate(new Date()))
                setTimeout(function(){
                    typeof _qla != 'undefined' && _qla.collectVisible();
                }, 0);
                return 
            }
            //每日首次
            if(!localStorage.date||localStorage.date!=formatDate(new Date()) ){
                this.setState({
                    isShowType:'pd-date',
                    showCashType:'date'
                }) 
                localStorage.setItem('date',formatDate(new Date()))
                setTimeout(function(){
                    typeof _qla != 'undefined' && _qla.collectVisible();
                }, 0);
                return
            } 
        }
    }
    async shareDay(date){ 
        
        const topBg=await getFlagCardBg()  
        const {studentInfo}=await getStudentInfo()
        
        const {flagHelpList} =this.state.flagHelpListData?.data 
        const {flagCardList,universityFlagData,flagHelpListData} =this.state
        const {userHeadImg,cardTime,userName} =this.state.universityFlagData
        
        initDaysCards({
            flagCardList,universityFlagData,flagHelpListData, date,topBg,studentInfo
        },(url)=>{
            this.setState({
                processUrl:url,
                isShowType:'pd-day'
            },()=>{
                this.showProcess()
                this.closeFail();
            })
        }) 
    }
     
    
     
    async initMinCards(){   
        const { universityFlagData,flagHelpListData } = this.state 
        initMinCards(universityFlagData,flagHelpListData?.data?.flagHelpList,(url)=>{
            this.setState({
                processUrl:url,
                isShowType:'pd-init'
            },()=>{
                this.showProcess()
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
     
    showWithdraw(){ 
        this.setState({ 
            isShowWithdraw: true,
        })
    } 
    colseWithdraw(){
        this.setState({ 
            isShowWithdraw: false,
        })
    } 
    closeCash(){
        this.setState({
            showCashType: false,
            isShowType:''
        })
    }
    colse(){
        this.setState({
            isShow: false,
        })
    }
    showProcess(){ 
        this.setState({
            isShowProcess: true,
        })
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    } 
    colseProcess(){ 
        this.setState({ 
            isShowProcess: false, 
            isShowType:''
        }) 
    } 
    colseRecard(){
        this.setState({ 
            isShowRecard: false,
        }) 
    } 
    changShowIndex(){
        this.setState({
            showCashIndex:0
        })
    }

    showFail(){
        this.setState({
            isShowFail: true,
        })
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    closeFail(){
        this.setState({
            isShowFail: false,
        });
    }

    //全量补卡下单支付
    async doPayForCardFunc() { 
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

    render(){
        const { universityFlagData,
            flagHelpListData,
            flagCardList,
            shareId, 
             isShowProcess,
             showCashIndex,
             isShowRecard,
             processUrl,
             recardDate,
             showCashType,
             isShowFail,
             upNumber,
             isShowType,
             isShowWithdraw } = this.state;
        const {onPress,isQlchat} = this.props 
        return (
            <Page title="我的小目标" className="flag-home-page">
                <ScrollToLoad
                    className={`fh-scroll-box ${(isShowProcess||isShowFail||!!showCashType||isShowRecard||isShowWithdraw) ? 'pointer-events-none':''}`}
                    toBottomHeight={300}
                    disable={true}
                    notShowLoaded={true}
                    >
                    <FhHead 
                        showWithdraw={this.showWithdraw}
                        initMinCards={this.initMinCards}
                        initSuccessCards={this.initSuccessCards}
                        showFail={this.showFail}
                        {...universityFlagData}
                        shareId={shareId}/>
                    <div className="fh-main"> 
                        <FhDate {...universityFlagData} flagCardList={flagCardList}/>
                        {
                            universityFlagData.status=='process'&&<FhFlag {...universityFlagData}/>
                        } 
                        <FhList 
                            {...universityFlagData}
                            flagList={flagHelpListData?.data?.flagHelpList} 
                            flagCardList={flagCardList} 
                            shareDay={this.shareDay}/>
                    </div>
                </ScrollToLoad>
                <FhBottomBtn {...universityFlagData}/>
                <PosterDialog 
                    isShow={ isShowProcess } 
                    imgUrl={processUrl}
                    on={2}
                    hideBtn={isShowType=='pd-day'}
                    close={ this.colseProcess }
                    className={isShowType}
                    children={
                        <div>
                            <img src={processUrl}/>
                            {
                                isShowType=='pd-day'&&!isQlchat&&
                                <div className="fh-share-text">
                                    <p>长按保存或直接发送给好友</p>
                                    <p>邀请TA给你点赞</p>
                                </div>
                            }
                        </div>
                    }
                    />

                <FlagFailDialog  isShowFail={ isShowFail } {...universityFlagData} close={ this.closeFail } initMinCards={this.initMinCards} doPayForCard={this.doPayForCardFunc} />
                    
                <WdRule isShow={ isShowWithdraw } close={ this.colseWithdraw }/> 
                {
                    !isQlchat&&<UniversityHome isUnHome />
                }
                
                <CashDialog 
                    isShow={ !!showCashType } 
                    // isShow={ true } 
                    imgUrl={"https://img.qlchat.com/qlLive/business/TUVTN3DH-HNOJ-K2ZC-1560844590341-D3BFUR21XZ6Z.png"}
                    on={showCashIndex}
                    hideBtn={true}
                    close={ this.closeCash }  
                    showCashType={showCashType}
                    {...universityFlagData}
                    upNumber={upNumber}
                    onPress={onPress}
                    isQlchat={isQlchat}
                    initMinCards={this.initMinCards}
                    />

                
                    {
                        createPortal(
                            <DialogRecard isShow={ isShowRecard }  close={ this.colseRecard } recardDate={recardDate}/>,
                                document.getElementById('app')
                            ) 
                    }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
     
});

const mapActionToProps = {
    doPayForCard,
};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagHome);