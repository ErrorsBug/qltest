import React, { Component } from 'react'
import Detect from 'components/detect';
import { fillParams, getUrlParams } from 'components/url-utils';
import { locationTo, getCookie } from 'components/util';
import { getFinancialCamp,getShareMoney } from '../../actions/experience'
import { share } from 'components/wx-utils';

const PayHoc = (WrappedComponent) => {
    return class extends Component {
        state = {
            financialCamp:{},
            getShareMoneyData:{},
            campObj: null,
            m: "00",
            s: "00",
            t: "0"
        }
        timer = null
        get campId(){ 
            return getUrlParams('campId', '')
        }
    
        get qyId(){
            return getUrlParams('qyId', '')
        }
        
        async componentDidMount() {
            if(!this.campId) {
                locationTo('/wechat/page/join-university')
            }
            this.initData() 
        } 

        componentWillReceiveProps({ sysTime }){ 
        };
 
        initData = async() => {
            const {financialCamp}= await getFinancialCamp({id:this.campId})
            const getShareMoneyData= await getShareMoney({campId:this.campId,shareUserId:getCookie('userId')})
            let price=0
            financialCamp?.periodList?.map((item,index)=>{
                price+=item.price
                if(!financialCamp.signupEndTime||financialCamp.signupEndTime>item.signupEndTime){
                    financialCamp.signupEndTime=item.signupEndTime
                }
            })
            financialCamp.price=price
            await this.setState({
                getShareMoneyData,
                financialCamp,
            }) 
            this.initShare()
        }
        
        initShare() {
            const {financialCamp,getShareMoneyData} =this.state
            let params={wcl:'finance_share',campId:this.campId}
            if(getShareMoneyData?.isShareUser==='Y'){
                params.userId=getCookie('userId')
                params.couponType='share' 
            }
            if(financialCamp) {
                let shareUrl = fillParams(params,`${location.origin}/wechat/page/experience-finance`,[])   
                share({
                    title: financialCamp.shareTitle,
                    timelineTitle: financialCamp.shareTitle,
                    desc: financialCamp.shareDesc,
                    timelineDesc: financialCamp.shareDesc,
                    imgUrl: financialCamp.shareImg || 'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
                    shareUrl: shareUrl
                });
            }
        }
        // 支付
        pay = () => {  
            const { campObj } = this.state
            const urlData = JSON.parse(sessionStorage.getItem('urlCampData') || '{}') 
            const url = fillParams(urlData,window.location.href)
            const params = { 
                source: (Detect.os.weixin && (Detect.os.ios||Detect.os.android))?'h5':'web',
                ch: url,
                url: '/api/wechat/transfer/baseApi/h5/pay/ufwCampOrder',
                campId: this.campId || ''                
            }
            this.props.doPay({
                ...params,
                callback: () => {
                    window.toast("成功支付")
                    setTimeout(() => {
                        locationTo(campObj.wechatUrl)
                    }, 1000);
                },
                onCancel: () => {
                    const path = location.pathname
                    if(path != '/wechat/page/experience-bottom'){
                        setTimeout(() => {
                            locationTo(`/wechat/page/experience-bottom?campId=${this.campId}`)
                        }, 300);
                    }
                },
                onPayFree:() => {
                    window.toast("成功支付")
                    setTimeout(() => {
                        locationTo(campObj.wechatUrl)
                    }, 1000);
                }
            })
        }
        
        render() {
            return (
                <WrappedComponent payBtn={ this.pay } { ...this.props } { ...this.state } />
            )
        }
    }
}
export default PayHoc