import React, { Component } from 'react'
import Detect from 'components/detect';
import { fillParams, getUrlParams } from 'components/url-utils';
import { locationTo, getCookie } from 'components/util';
import { getIntentionCamp,getDistributeConfig,updateActChargeShareUrl } from '../../actions/experience'
import { userCardRefInfo, cardExchange } from '../../actions/family'
import { getSaleQr, getMenuNode } from '../../actions/home' 

const PayHoc = (WrappedComponent) => {
    return class extends Component {
        state = {
            campObj: null,
            m: "00",
            s: "00",
            isStatus:  false,
            campConfig:{},
            countEndTime:'',
        }
        timer = null
        isStatus = false
        get campId(){ 
            return getUrlParams('campId', '')
        }
        
        get shareKey(){
            return getUrlParams('shareKey', '')
        }
        get inviteKey(){
            return getUrlParams('inviteKey', '')
        }
        get getAos(){
            return getUrlParams('aos', '')
        }
        async componentDidMount() {
            this.countTime(); 
            if(!this.campId) {
                locationTo('/wechat/page/join-university')
            }
            // 安卓回调
            this.props.onSuccess('onSuccess', () => {
                this.paySuccess()
            })
            await this.initCardStatus();
            await this.initData() 
        } 
        async initDataQr() {
            const { campObj } = this.state
            const { qr } = await getSaleQr({
                resourceId: this.campId,
                resourceType: 'ufw_camp'
            });
            let localUrl = `/wechat/page/university-activity-url?campId=${this.campId}`
            localUrl = !!qr ? localUrl : campObj.wechatUrl
            return localUrl;
        }
        
        async initCardStatus() {
            const { status, selectCourseStatus } = await userCardRefInfo();
            this.isStatus = (Object.is(status, 'Y') && Object.is(selectCourseStatus, 'N'))
        }

        async initConfig(){ 
            let config = await this.props.getWxConfig(); 
            var apiList = ['checkJsApi',  'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice',
                'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation',
                'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
            ]
            wx.config({...config,jsApiList: apiList });
        }

        // 获取体验营详细
        initData = async () => {  
            const { camp,chargeDto } = await getIntentionCamp({
                campId: this.campId,
            }) 
            const { config } = await getDistributeConfig({
                campId: this.campId,
                type:"INTENTION"
            }) 
            const flag = camp && Object.is(camp?.sendCampFlag, "Y") && this.isStatus 
            await this.setState({
                campObj: camp || {},
                isStatus: flag,
                campConfig:config,
                chargeDto
            })
            return true
        }
        // 支付
        pay = async (flag) => {   
            const { campObj, isStatus } = this.state
            if(this.props.isQlchat){
                this.appPay();
            } else {
                if(isStatus && !!flag) {
                    try {
                        const res = await cardExchange({ campId: this.campId, url:location.href })
                        if(res){
                            locationTo(campObj.wechatUrl)
                        }
                    } catch (error) {}
                } else {
                    const urlData = JSON.parse(sessionStorage.getItem('urlCampData') || '{}') 
                    const url = fillParams(urlData,window.location.href)
                    const params = { 
                        source: (Detect.os.weixin && (Detect.os.ios||Detect.os.android))?'h5':'web',
                        ch: url,
                        url: '/api/wechat/transfer/baseApi/h5/pay/ufwCampOrder',
                        campId: this.campId || '' ,
                        shareKey:this.shareKey||'' ,
                        inviteKey:this.inviteKey||''                
                    }
                    this.props.doPay({
                        ...params,
                        callback: this.paySuccess,
                        onCancel: () => {
                            const path = location.pathname
                            if(path != '/wechat/page/experience-bottom'){
                                setTimeout(() => {
                                    locationTo(fillParams({campId:this.campId,shareKey:this.shareKey,inviteKey:this.inviteKey},`/wechat/page/experience-bottom`,[]) )
                                }, 300);
                            }
                        },
                        onPayFree: this.paySuccess
                    })
                }
            }
        }
        async appPay() {
            const { campObj } = this.state;
            await this.props.handleAppSdkFun('commonOrder', {  
                type: 'ufw_camp',
                channel: 'h5',
                aos: this.getAos,
                orderData: {
                    campId: Number(this.campId)
                },
                displayPrice: campObj.bestPrice !==null ? campObj.bestPrice : campObj.price ,
                callback: (res) => {
                    this.paySuccess();
                }
            }) 
        }
        // 支付成功
        paySuccess = async () => {
            window.toast("成功支付")
            if(this.props.isQlchat) {
                locationTo(`/wechat/page/university-experience-success?campId=${ this.campId }`)
                return
            } 
            const { campObj,chargeDto } = this.state
            if(campObj?.shareType=='INVITE_EVENT'&&campObj?.inviteEventCode) {
                locationTo(`/wechat/page/experience-finance-card?actId=${ this.campId }`)
                return
            } 
            const localUrl = await this.initDataQr();
            setTimeout(() => {
                locationTo(localUrl)
            }, 1000); 
        }  
              
        countTime = () => {
            let campTime = localStorage.getItem(`campTime${ this.campId }`);
            const time = 15 * 60 * 1000;
            const sysTime = new Date().getTime()
            if(campTime && ((Number(campTime) + time) > sysTime)) {
                campTime = campTime;
            } else {
                campTime = sysTime;
                localStorage.setItem(`campTime${ this.campId }`, campTime);
            }
            const countEndTime = (Number(campTime) + time)
            this.setState({
                countEndTime
            })
            
        }
        componentWillUnmount() {
            clearInterval(this.timer)
            this.timer = null;
        }
        render() {
            return (
                <WrappedComponent payBtn={ this.pay } { ...this.props } { ...this.state } />
            )
        }
    }
}
export default PayHoc