import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import Dialog from './components/dialog';
import { formatMoney, locationTo } from 'components/util'; 
import { ufwDistributeAccount,ufwDistributeDraw } from '../../actions/experience';
import PortalCom from '../../components/portal-com';
import { getUrlParams, fillParams } from '../../../components/url-utils';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import {myLiveEntity,getRealStatus, getCheckUser,getRealNameInfo, getVerifyInfo} from '../../actions/common'

@autobind
class Withdraw extends Component {
    state = {
        value: '',
        isRule: false,
        isSuccess: false,
        userInfo: {},
        drawObj: {
            // balance: 10,
            // beBalance: 10,
            // total:100,
            // withDraw: 0
        },
        levelKey: {}, 
        realStatus: "",
        rejectReason:"",
        entityPo:{}

    }
    data = {
        maxPrice: 0
    }
    get type(){
        return getUrlParams("type")||'intention'
    } 
    get accountType(){
        return this.type=='financial'?'FINANCING_DISTRIBUTE':'UFW_CAMP_DISTRIBUTE'
    }  
    componentDidMount() {
        this.initData();
        this.initDataReal()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }
    async initData() {
        const res = await ufwDistributeAccount({accountType:this.accountType})
        this.data.maxPrice = formatMoney(res.balance || 0);
        this.setState({
            drawObj: res || {} ,
            value: formatMoney(res.balance) || '',
        })
    }
    
	async initDataReal(){
        const {entityPo={}} =  await myLiveEntity()
        let oldRealRes =entityPo?.id? await getRealStatus(entityPo?.id, 'live'):{};
        const res = await getCheckUser();
        const newReal = (res.data && res.data.status) || 'no';
        const oldReal = (oldRealRes.data && oldRealRes.data.status) || 'unwrite';
        const rejectReason = res.data && res.data.rejectReasons
        if (newReal != 'no') {
            this.getVerifyInfo();
        } else {
            this.getRealNameInfo(entityPo?.id);
        }
		this.setState({
            newRealStatus: newReal,
			realStatus: oldReal,
            rejectReason,
            entityPo
        });
    }
    
    // 获取旧版实名验证已经提交的认证信息
    async getRealNameInfo(liveId) {
        if (liveId) {
            const { data } = await getRealNameInfo({
                liveId
            });
            if (data && data.identity) {
                let { name = '' } = data.identity;
                this.setState({
                    realName:name
                });
            }
        }
    }

    /**
     * 获取新版实名验证已经提交的认证信息
     */
    async getVerifyInfo() {
        const res = await getVerifyInfo();
        if (res.state && res.state.code === 0) {
            const verifyInfo = res.data.identityPo;
            if (verifyInfo) {
                let { name = '' } = verifyInfo;
                this.setState({ 
                    realName:name
                });
            }
        } else {
            window.toast(res.state.msg);
        }
    }
    changeInput(e) {
        const value = e.target.value.trim();
        this.setState({
            value: value
        })
    }
    async submitBtn() {
        const { drawObj, realName, value } = this.state 
        if(!drawObj.balance) return false;
        const flag = this.verifyInput(this.state.value);
        if(!flag) return false;
        const res = await ufwDistributeDraw({
            money: Number(value * 100).toFixed(2),
            realName,
            accountType:this.accountType,
        });
        if(res && res.flag){
            const res = await ufwDistributeAccount({accountType:this.accountType})
            this.setState({
                drawObj: res || {},
                value: formatMoney(res.balance) || '',
            })
            window.toast("提现成功")
        } else {
            window.toast("提现失败")
        }
    }
    verifyInput(value){
       const reg = new RegExp( /^\d+(\.\d+)?$/);
       if(!value){
            window.toast("请输入提现金额")
           return false
       }
       if(!reg.test(value)){
           window.toast("请输入数字")
           return false
       }
       if(!(value <= this.data.maxPrice)){
           window.toast("输入金额不能大于提现金额")
           return false
       }
       if(!(value >= 1)){
           window.toast("最小提现金额为1元哟")
           return false
       }
       return true
    }
    handleDialog() {
        this.setState({
            isRule: true,
        })
    }
     
	clearRealName(){
		this.setState({
			isShowRealName: false,
		})
	}
    render(){
        const { value, isRule, isSuccess, drawObj, isShowRealName=true } = this.state;
        return (
            <Page title="我的奖学金" className="experience-camp-withdraw-box">
                <section className="scroll-content-container">
                    <div className="wd-input-group">
                        <p>可提现</p>
                        <div className="wd-input-price">
                            <input onChange={ this.changeInput } value={ value } placeholder="0" />
                        </div>
                    </div>
                    <div className="wd-list">
                        <p>累积获得奖学金</p>
                        <span className={ !!drawObj.total ? 'red': '' }>￥{ formatMoney(drawObj.total) || 0 }</span>
                    </div>
                    <div className="wd-list">
                        <p>已提现</p>
                        <span className={ !!drawObj.withDraw ? 'red': '' }>￥{ formatMoney(drawObj.withDraw) || 0 }</span>
                    </div>
                    <div className="wd-list">
                        <p>待结算</p>
                        <span className={ !!drawObj.beBalance ? 'red': '' }>￥{ formatMoney(drawObj.beBalance) || 0 }</span>
                    </div>
                    <div className={ `wd-btn on-log on-visible ${ !drawObj.balance ? 'no' : '' }` } 
                        data-log-name={ "申请提现" }
                        data-log-region="experience-camp-withdraw-btn"
                        data-log-pos={ 0 } 
                        onClick={ this.submitBtn }>{ !drawObj.balance ? '暂无可提现金额' : '申请提现' }</div>
                    <div className="wd-tishi">请留意，可提现的奖学金将发放到你的微信钱包</div>
                </section>
                <PortalCom className="wd-record-box on-log on-visible" 
                    data-log-name={ "提现记录" }
                    data-log-region="experience-camp-withdraw-record"
                    data-log-pos={ 0 }  
                    onClick={ ()=>{locationTo(fillParams({type:this.type},`${location.origin}/wechat/page/experience-camp-withdraw-list`))} }><span>提现记录</span></PortalCom>
                {
                    this.state.newRealStatus&&
                    <NewRealNameDialog 
                        show = { this.state.newRealStatus!='pass' }
                        onClose = {this.clearRealName.bind(this)}
                        realNameStatus = { this.state.realStatus || 'unwrite'}
                        checkUserStatus = { this.state.newRealStatus || 'no' }
                        rejectReason={this.state.rejectReason}
                        isClose = {true}
                        liveId = {this.state.entityPo?.id}
                    />
                }
           
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
     
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(Withdraw);