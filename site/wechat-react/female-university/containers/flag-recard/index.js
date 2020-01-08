import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { formatMoney, locationTo ,formatDate} from 'components/util';
import Detect from 'components/detect'; 
import {doPayForCard } from '../../actions/flag';
import { getUrlParams } from 'components/url-utils';
import { isQlchat } from 'components/envi';
import appSdk from 'components/app-sdk';
import ClickBtn from '../../components/click-btn'
import HandleAppFunHoc from 'components/app-sdk-hoc'
 
@HandleAppFunHoc
@autobind
class FlagAdd extends Component {
    state = {
        value:'',
        money:500
    }
    page = {
        page: 1,
        size: 3,
    }
    isload=false
    componentDidMount(){ 
        this.getRecardNum()
        this.initData()
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }
    // 初始化获取数
    async initData(){
          // 安卓回调
        this.props.onSuccess('onSuccess', () => {
            this.onPaySuccess()
        })
    }
    getRecardNum(){
        const addNum=3+Math.ceil(Math.random()*6)
        const addNumAll=1+Math.ceil(Math.random()*4)
        if(!localStorage.basicNum||formatDate(new Date())!=localStorage.date){
            localStorage.basicNum= 250+Math.ceil(Math.random()*100)
            localStorage.date = formatDate(new Date())
        }
        if(!localStorage.basicNumAll){
            localStorage.basicNumAll= 3000 
        }
        const basicNum=localStorage.basicNum
        localStorage.basicNum=parseFloat(basicNum)+addNum
        const basicNumAll=localStorage.basicNumAll
        localStorage.basicNumAll=parseFloat(basicNumAll)+addNumAll
        this.setState({
            basicNum:localStorage.basicNum,
            basicNumAll:localStorage.basicNumAll,
        })
    }
    textChange(e){
        this.setState({
            value:e.target.value
        })
    }
    
    //单日补卡下单支付
    async submit(){
        if(this.isload){return}
        this.isload=true
        const {cardDate} =this.props.location.query
        // app 调起支付
        if (isQlchat()) { 
            this.isload=false
            await this.props.handleAppSdkFun('resign', {  
                cardDate: formatDate(cardDate), 
                all:'N',
                aos:'cardpay',
                callback: (res) => {
                    this.onPaySuccess()
                }
            }) 
        // 微信及H5支付
        } else {
            window.loading&&window.loading(true) 
            await this.props.doPayForCard({
                cardDate: formatDate(cardDate), 
                callback:()=>{
                    window.toast("成功支付")
                    locationTo(`/wechat/page/flag-home?recard=${getUrlParams('cardDate')}`)
                }, 
                onCancel:()=>{}
            });
            window.loading&&window.loading(false)
        }
        this.isload=false
    }
    onPaySuccess(){
        window.toast("成功支付") 
        locationTo(`/wechat/page/flag-home?recard=${getUrlParams('cardDate')}`)
        // 延迟刷新，避免状态延迟
        setTimeout(() => {
            window.location.reload(true);
        }, 2500);
    }
    render(){
        const {money,basicNum,basicNumAll} =this.state
        const {cardDate} =this.props.location.query

        return (
            <Page title="补打卡" className="un-flag-recard-box">
                <section className="scroll-content-container"> 
                    <div className="fr-top">
                        <div className="fr-title">
                            30天小目标补打卡
                            { !isQlchat() && (
                                <i className="btn-close-back on-log on-visible"  
                                onClick={()=>{history.go(-1)}}></i>
                            ) }
                        </div> 
                        <div className="fr-item">
                            <div className="fr-left">补卡时间</div>
                            <div className="fr-right">{formatDate( cardDate,'yyyy年MM月dd日')}</div>
                        </div> 
                        <div className="fr-item">
                            <div className="fr-left">补卡费用</div>
                            <div className="fr-right">￥{formatMoney(money||0)}</div>
                        </div> 
                        
                    </div> 
                    <div className="fr-intro">
                        <div className="fr-title">
                            补卡说明
                        </div> 
                        <div className="fr-content">
                            1，为了保障其他同学的公平权益，补卡实行付费制度，目前统一补卡价是5元
                        </div>  
                        <div className="fr-content">
                        2，点击下方按钮“立即补卡”，完成支付后，补卡的日期当天，会变为“已打卡”的状态
                        </div>  
                        <div className="fr-content">
                        3，坚持学习，全勤打卡后，将获得奖学金池所有金额
                        </div>  
                        
                    </div> 
                    <div className="fr-tip">你是今天第<span>{basicNum}</span>位补卡的同学 | <span>{basicNumAll}</span>位同学已挑战成功</div>
                    
                    <div className={`on-log on-visible fr-btn on`} 
                        data-log-name='立即补卡'
                        data-log-region="un-flag-recard-confirm"
                        data-log-pos="0"
                        onClick={this.submit}>
                            <ClickBtn>立即补卡</ClickBtn> 
                            </div>  
                </section>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    doPayForCard,

};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagAdd);