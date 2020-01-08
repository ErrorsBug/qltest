import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { createPortal } from 'react-dom';
import { MiddleDialog } from 'components/dialog';
import NoticeCard from '../../components/notice-card'
import { getVal, locationTo } from '../../../components/util';
import { getIsSubscribe, getQr } from "../../actions/common";
import { getStudentInfo, initConfig } from "../../actions/home";
import { request } from 'common_actions/common';
import { userBindKaiFang } from "../../../actions/common";
import { getUrlParams } from 'components/url-utils';
import AppEventHoc from '../../components/app-event'
import QRCode from 'qrcode'
import HandleAppFunHoc from 'components/app-sdk-hoc'

@HandleAppFunHoc
@AppEventHoc
@autobind
class JoinUniversityCountdown extends Component {
    state = {
        portalDom:null,
        isShowQr:false,
        isFocus: false, 
        isShowCard: true,
        userInfo: {},
        createQrUrl:'',
        isShowAppHome: false
    }
    get isShowAppHome () {
        const isHome = localStorage.getItem('isShowAppHome')
        return Object.is(isHome, 'Y')
    }
    componentDidMount() {
        this.setState({
            portalDom:document.querySelector('.portal-middle')
        })
        this.getStudentInfo();
        this.initUniversityInfo();
        this.bindAppKaiFang(); 
        this.initShare();
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('join-university-countdown-page');
    }
    close() {
        this.props.onPress && this.props.onPress(false);
        this.setState({
            isShowCard: false
        })
    }
    toggleQrDialog() {
        if(!this.state.isFocus){
            this.setState({
                isShowQr:!this.state.isShowQr
            })
        }else{
            locationTo('/wechat/page/university/home');
        }
    }
    async getNotiseQr(){
        let subscribeResult = await this.props.getIsSubscribe({
            liveId: this.state.liveId,
            appId: this.state.appId
        });
        if(subscribeResult.data && subscribeResult.data.isFocusThree){
            this.setState({
                isFocus: true,
            });
        }
        let qrResult = await this.props.getQr({
            channel: 'universityRegistration',
            liveId: this.state.liveId,
        });
        this.setState({
            qrcode: (qrResult.data && qrResult.data.qrUrl) || '',
        });
    }

    async initUniversityInfo(){
        let res = await initConfig({businessType:'UFW_CONFIG_KEY'});
        this.setState({
            liveId: getVal(res, 'UFW_LIVE_ID', ''),
            appId: getVal(res, 'UFW_APP_ID', ''),
        },()=>{
            this.getNotiseQr();
        });
    }

    async getStudentInfo (){
        let result = await getStudentInfo();
        this.setState({
            studentInfo: (result && result.studentInfo) || {},
        },()=>{
            this.createQr() 
        });
    }
    async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId');
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }
    }

    /**
     * app 分享
     * @memberof JoinUniversityCountdown
     */
    initShare() {
        const { isQlchat } = this.props;
        // 显示分享
        if(isQlchat){
            this.props.onPress && this.props.onPress()
        }
        // 安卓回调
        this.props.onSuccess('onSuccess', () => {
            localStorage.setItem('isShowAppHome', 'Y')
            this.setState({
                isShowAppHome: true
            })
        })
    }

    async createQr(){   
        const { studentInfo } = this.state
        let url = "https://ql.kxz100.com/wechat/page/join-university?wcl=university_luqu"
        if(!!studentInfo.shareType && !Object.is(studentInfo.shareType, 'LEVEL_F')){
            url = `${url}&userId=${ studentInfo.userId }`
        }
        const res=QRCode.toDataURL(url, {
            width: 180,
            height: 180,
            colorDark : "#000000",
            colorLight : "#ffffff" 
            })
            .then(url => {
                this.setState({
                    createQrUrl:url
                },()=>{
                    setTimeout(()=>{
                        // !sessionStorage.paySuccess&& this.showCard()
                        sessionStorage.paySuccess='Y'
                    },500)
                }) 
            })
            .catch(err => {
                console.error(err)
            })   
    }
    // 调用app一次性订阅
    sendAppSubscribe(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.handleAppSdkFun('sendSubscribeMessage', {
            sendSubscribeMessage: 'university_join_class',
            callback: () => {
                localStorage.setItem('isShowAppHome', 'Y')
                this.setState({
                    isShowAppHome: true
                })
            }
        })
    }
    // 进入app大学首页
    goAppHome(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.props.isQlchat){
            // app(IOS、安卓) 调用方法
            this.props.handleAppSdkFun('callNativeView', {
                view: 'universityOpens'
            })
        }
    }
    isRenderApp() {
        const { isQlchat } = this.props;
        if(isQlchat){
            return (
                <div className="un-app-success">
                    <p>同学们都在等你，请务必加入班级!</p>
                    <img src={ require('./img/icon-pon.png') } />
                    <div className="un-success-click" onClick={ this.sendAppSubscribe }>点此获取进班通道</div>
                    { (this.isShowAppHome || this.state.isShowAppHome) && <div className="un-go-btn"><span onClick={ this.goAppHome }>进入大学报到</span></div> }
                </div>
            )
        } else {
            return (
                <div className="success-tips">
                    <span className="title">请务必扫码关注公众号</span>
                    <span className="tips"><img src={ require('./img/bg01.png') } /></span>
                    <div className="btn-enter ">
                        <img src={this.state.qrcode || "//open.weixin.qq.com/qr/code?username=qianliaoEdu"} className='qrcode' alt="" />
                        <p>长按识别二维码关注</p>
                    </div>
                </div>
            )
        }
    }
    render() {
        if (!this.state.portalDom) {
            return null
        }
        const { isQlchat, onPress, getCardUrl } = this.props;
        return (
            <Page title="进入大学报到" className="flex-body join-university-countdown-page">
                <div className="flex-main-s">
                    <div className="course-info-box success">
                        <img className='bg-con' src={require('./img/bg-congratulations.png')} alt=""/>
                        <span className="title">你已成功加入千聊女子大学!</span>
                        {/* <span className='go-back on-log on-visible' 
                            data-log-name="查看通知书"
                            data-log-region="un-notice-btn"
                            data-log-pos="0"
                            onClick={this.showCard} >招生办发来录取通知书，点击查看 >></span> */}
                    </div>
                    { this.isRenderApp() }
                </div>
                {
                    this.state.isShowQr && createPortal(       
                        <MiddleDialog
                            show={this.state.isShowQr }
                            theme='empty'
                            bghide
                            titleTheme={'white'}
                            buttons={null}
                            close={true}
                            title="关注公号，进入大学"
                            className='jion-page-follow-dialog'
                            onClose={ this.toggleQrDialog}>
                            <div className='main'>
                                <span>请务必关注，方便随时找到上课入口，接收上课提醒，了解更多大学活动</span>
                                <img src={this.state.qrcode || "//open.weixin.qq.com/qr/code?username=qianliaoEdu"} className='qrcode' alt="" />
                                {/* <span>或拨打：123223953234</span> */}
                            </div>
                        </MiddleDialog>
                        ,this.state.portalDom
                    )
                }
                { isQlchat && <NoticeCard isQlchat={ isQlchat } close={ this.close }  getCardUrl={ getCardUrl } isShow={ this.state.isShowCard } /> }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    getQr,
    getIsSubscribe,
    userBindKaiFang
};

module.exports = connect(mapStateToProps, mapActionToProps)(JoinUniversityCountdown);