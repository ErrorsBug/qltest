import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page'; 
import { MiddleDialog } from 'components/dialog';
import { locationTo, formatDate } from 'components/util';
import { getExchage, getIntentionCamp, getCampBuyInfoByBelongId,redemptionCodeExchange } from '../../actions/experience';   
import { getStudentInfo } from '../../actions/home';   
import { isQlchat } from 'components/envi'
import { getSaleQr } from '../../actions/home' 
import Picture from 'ql-react-picture';

@autobind
class ExperienceCampExchange extends Component {
    state = { 
        value:'',
        isShow:false,
        campObj:{},
        flag:false
    } 
    loading=false
    async componentDidMount() {   
        this.initData() 
    }
    async initData(){ 
    }
    //输入
    inputChange(e){
        this.setState({
            value: e.target.value.replace(/\s+/g,"")
        })
    }
    //清除输入
    clearInput(){
        this.setState({
            value:''
        })
    }
    //查询兑换状态
    async searchCode(){
        if(this.loading)return
        this.loading=true
        const {value} = this.state
        if(!value){
            window.toast('请输入兑换码')
            this.loading=false
            return
        }
        const { intentionCampId,flag=false } = await getExchage({code:value})  
        intentionCampId&&await this.getCamp(intentionCampId) 
        this.setState({
            flag
        })
        this.loading=false
    } 
    //获取体验营
    async getCamp(campId){
        let {camp} = await getIntentionCamp({campId})
        //未购
        if(!Object.is(camp.buyStatus, 'Y')){ 
            //判断体验营类型
            if(camp.campType=='ufw_camp'){
                const {studentInfo} = await getStudentInfo()  
                if(studentInfo?.userId){
                    window.toast('大学用户不能兑换')
                    return false
                }
            }
            //判断是否有归属方案
            if(camp.belongId){
                const {actCharge={}} = await getCampBuyInfoByBelongId({belongId:camp.belongId})
                if(actCharge?.actId){
                    let data = await getIntentionCamp({campId:actCharge?.actId}) 
                    camp=data.camp 
                }
            } 
        } 
        this.setState({
            isShow:true,
            campObj:camp
        })
        return true
    } 
    close(){
        this.setState({
            isShow:false
        })
    }
    //进入学习
    toLearn(){
        locationTo('')
    }
    //确认兑换
    async exchange(){
        const {value,campObj} = this.state
        const res = await redemptionCodeExchange({code:value, campId:campObj.id, url:location.href})  
        if(res?.state?.code == 0){ 
            window.toast('兑换成功')
            if(isQlchat()) {
                locationTo(`/wechat/page/university-experience-success?campId=${ campObj.id }`)
                return
            } 
            if(campObj?.shareType=='INVITE_EVENT'&&campObj?.inviteEventCode) {
                locationTo(`/wechat/page/experience-finance-card?actId=${ campObj.id }`)
                return
            } 
            const localUrl = await this.initDataQr();
            setTimeout(() => {
                locationTo(localUrl)
            }, 1000); 
        }
    }
    async initDataQr() {
        const { campObj } = this.state
        const { qr } = await getSaleQr({
            resourceId: campObj.id,
            resourceType: 'ufw_camp'
        });
        let localUrl = `/wechat/page/university-activity-url?campId=${campObj.id}`
        localUrl = !!qr ? localUrl : campObj.wechatUrl
        return localUrl;
    }
     
    render(){
        const { value, isShow, campObj, flag } = this.state;
        return (
            <Page title={ '课程兑换' } className="experience-camp-exchange">
                <div className="experience-camp-exchange-container">
                    <div className="experience-camp-exchange-title">课程兑换码</div>
                    <div className="experience-camp-exchange-input">
                        <input ref="textInput" value={ value } onChange={this.inputChange} placeholder="请输入你的兑换码"/>
                        {
                            value.length>0&&
                            <span onClick={this.clearInput}>
                                <i className="iconfont iconxiaoshanchu"></i>
                            </span>
                        }
                    </div>
                    <div onClick={this.searchCode} 
                        className={`experience-camp-exchange-btn on-log on-visible ${value.length>0?'on':''}`}
                        data-log-name={'兑换'}
                        data-log-region="experience-camp-exchange-btn"
                        data-log-pos="0" >兑换</div>
                </div> 
                <MiddleDialog
                    show={ isShow }
                    onClose={this.close}>
                    <div  className="experience-camp-exchange-dialog">
                        {
                            campObj.buyStatus=='Y'?
                            <div className="dialog-title">您已{flag?'兑换':'购买'}体验营</div>
                            :<div className="dialog-title">是否确认兑换</div>
                        }
                        <div className="dialog-content">
                            <div className="dialog-content-img">
                                <Picture resize={{w:'624',h:'242'}} src={campObj?.boughtImgUrl}/>
                            </div>
                            <div className="dialog-content-bottom">
                                <div className="dialog-content-title">{campObj?.title}</div>
                                {
                                    campObj.buyStatus=='N'&&campObj?.startTime&&campObj?.endTime&&
                                    <div className="dialog-content-time">带学时间：{ formatDate(campObj?.startTime, 'MM/dd') } - { formatDate(campObj?.endTime, 'MM/dd') }</div>
                                }
                            </div>
                        </div>
                        {
                            campObj.buyStatus=='Y'?
                            <div className="dialog-btn" onClick={()=>{locationTo(`/wechat/page/university-experience-camp?campId=${campObj?.id}`)}}>进入学习</div>
                            :
                            <Fragment>
                                <div className="dialog-btn on-log on-visible" 
                                    data-log-name={'确认兑换'}
                                    data-log-region="experience-camp-exchange-btn-confirm"
                                    data-log-pos="0"
                                    onClick={this.exchange}>确认兑换</div>
                                <div className="dialog-tip">确认后即兑换成功</div>
                            </Fragment>
                        }
                    </div>
                </MiddleDialog> 
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = {
     
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceCampExchange);