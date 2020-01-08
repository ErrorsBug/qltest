import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import DialogRule from '../experience-finance-poster/components/dialog-rule'
import { formatMoney, locationTo } from 'components/util'; 
import { postDraw, getAccount, getStudentInfo, initConfig } from '../../actions/home';
import { getFinancialCampShareMoneyDetail,fCampShareDetailWithdraw } from "../../actions/experience";
import { getBaseUserInfo } from "../../actions/common";

@autobind
class ExperienceFinanceWithdraw extends Component {
    state = {
        value: '',
        isRule: false,
        isSuccess: false,
        userInfo: {},
        drawObj: {
            // balance: 10,
            // beBalance: 10,
            // total:100,
            // withdraw: 0
        },
        levelKey: {},

    }
    data = {
        maxPrice: 0
    }
    componentDidMount() {
        this.initData();
        
       // 绑定非window的滚动层 
       typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }
    async initData() {
        const { user } = await getBaseUserInfo()
        const res = await getFinancialCampShareMoneyDetail();  
        this.data.maxPrice = formatMoney(res.balance || 0);
        this.setState({
            drawObj: res || {},
            value: formatMoney(res.balance) || '',
            userInfo: user || {} 
        })
    }
    changeInput(e) {
        const value = e.target.value.trim();
        this.setState({
            value: value
        })
    }
    async submitBtn() {
        if(this.isloading)return false
        this.isloading=true
        const { drawObj, userInfo, value } = this.state 
        if(!drawObj.balance) return false;
        const flag = this.verifyInput(this.state.value);
        if(!flag) return false;
        const res = await fCampShareDetailWithdraw({
            money: Number(value * 100).toFixed(2),
            realName: userInfo.name,
        });
        if(res && res.flag){
            const res = await getFinancialCampShareMoneyDetail();
            this.setState({
                drawObj: res || {},
                value: formatMoney(res.balance) || '',
            })
            window.toast("提现成功")
        } else {
            window.toast("提现失败")
        }
        this.isloading=false
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
    
    colse(){
        this.setState({
            isRule: false,
            isSuccess: false,
        })
    }
    render(){
        const { value, isRule, isSuccess, drawObj, levelKey, offerMoney, userInfo } = this.state;
        return (
            <Page title="我的奖学金" className="experience-finance-withdraw-box">
                <section className="scroll-content-container"> 
                    <div className="wd-input-group">
                        <p>可提现</p>
                        <div className="wd-input-price">
                            <input onChange={ this.changeInput } value={ value } placeholder="0" />
                        </div>
                    </div>
                    <div className="wd-list">
                        <p>累积奖学金</p>
                        <span className={ !!drawObj.total ? 'red': '' }>￥{ formatMoney(drawObj.total) || 0 }</span>
                    </div>
                    <div className="wd-list">
                        <p>已提现</p>
                        <span className={ !!drawObj.withdraw ? 'red': '' }>￥{ formatMoney(drawObj.withdraw) || 0 }</span>
                    </div>
                    <div className="wd-list wd-last">
                        <p onClick={ this.handleDialog }>冻结奖金</p>
                        <span className={ !!drawObj.beBalance ? 'red': '' }>￥{ formatMoney(drawObj.beBalance) || 0 }</span>
                    </div>
                    <div className={ `wd-btn on-log on-visible ${ !drawObj.balance ? 'no' : '' }` } 
                        data-log-name={'申请提现'}
                        data-log-region="experience-finance-withdraw-btn"
                        data-log-pos={'0'} 
                        onClick={ this.submitBtn }>{ !drawObj.balance ? '暂无可提现金额' : '申请提现' }</div>
                    <div className="wd-tishi">请留意，可提现的奖学金将发放到你的微信钱包</div>
                    <DialogRule>
                    <div className="wd-rule" onClick={ this.handleDialog }><span>规则说明</span></div>
                    </DialogRule>
                </section>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceFinanceWithdraw);