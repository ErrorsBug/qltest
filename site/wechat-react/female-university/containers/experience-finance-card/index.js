import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams, fillParams } from 'components/url-utils';
import { getQr,initConfig } from "../../actions/common"; 
import PressHoc from 'components/press-hoc';
import { getVal, locationTo, getCookie } from '../../../components/util';
import { getFinancialCamp,getIntentionCamp,updateActChargeShareUrl } from '../../actions/experience'
import {  getMenuNode } from '../../actions/home'
import { inviteCard } from '../../components/canvas-img/getCard'
import { getBaseUserInfo, dataURLtoFile } from '../../actions/common' 
import { insertOssSdk } from 'common_actions/common';
import { uploadImage } from '../../actions/common';

@autobind
class ExperienceFinanceCard extends Component {
    state = {
        qrUrl: '',
        financialCamp:{},
        campObj:{}
    }
    //理财高价营id
    get campId(){
        return getUrlParams("campId", "")
    }
    //理财低价营id
    get actId(){
        return getUrlParams("actId", "")
    }
    async componentDidMount() { 
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-class-code');
    }
    async componentDidMount(){ 
        this.campId&&this.getCamp()
        this.actId&&this.getAct()
    }
    async getCamp(){
        const {financialCamp={},appId}= await getFinancialCamp({id:this.campId})
        if(financialCamp.buyStatus=='N'){
            locationTo(`/wechat/page/experience-finance?campId=${this.campId}`)
            return
        }
        let qrResult = await this.props.getQr({
            channel: 'financialCamp',
            appId,
            pubBusinessId: this.campId,
        });
        this.setState({
            qrUrl: (qrResult.data && qrResult.data.qrUrl) || '',
            financialCamp
        })
    }
    async getAct(){
        const {camp={},chargeDto}= await getIntentionCamp({campId:this.actId})
        if(camp.buyStatus=='N'){
            locationTo(`/wechat/page/university-experience-camp?campId=${this.actId}`)
            return
        }
        let appId = '';
        if(camp.campType=='ufw_camp'){
            const {UFW_APP_ID} = await initConfig({businessType: "UFW_CONFIG_KEY"})
            appId = UFW_APP_ID
        }else{
            const {FINANCIAL_CAMP_APPID} = await initConfig({businessType: "FINANCIAL_CAMP"})
            appId = FINANCIAL_CAMP_APPID
        }
        if(camp?.inviteEventCode&&!chargeDto?.shareImgUrl){
            this.getCard(camp?.inviteEventCode)
        }
        let qrResult = await this.props.getQr({
            channel: 'financialInviteGift',
            appId,
            pubBusinessId: this.actId,
        });
        await this.setState({
            qrUrl: (qrResult.data && qrResult.data.qrUrl) || '',
            campObj:camp
        })
    } 
    //获取卡片
    async getCard(nodeCode){
        const {user} = await getBaseUserInfo()
        const {menuNode} = await getMenuNode({nodeCode})  
        let shareUrl=fillParams({campId:this.actId,inviteKey:getCookie('userId'),wcl:'share_1130445'},`https://ql.kxz100.com/wechat/page/university-experience-camp`)
        inviteCard({...user,...menuNode,shareUrl}).then(async (url)=>{
            const inviteCardFile =await dataURLtoFile(url,'invite.jpg')
            insertOssSdk()
                .then(() => this.props.uploadImage(inviteCardFile,'finance','.jpg',true))
                .then(_headImgUrl => {
                    updateActChargeShareUrl({
                        campId: this.actId,
                        shareImgUrl:_headImgUrl
                    }) 
                })
        })
    }       
    render(){
        const {financialCamp,campObj, qrUrl } = this.state;
        return (
            <Page title={ '报名成功' } className="experience-finance-card">
                <div className="uni-exp-img">
                    {
                        financialCamp?.name&&<div className="efc-title">《<span>{financialCamp?.name}</span> 》</div>
                    }
                    {
                        campObj?.title&&<div className="efc-title">《<span>{campObj?.title}</span> 》</div>
                    }
                    
                    <img className="img" src="https://img.qlchat.com/qlLive/business/PYEJPFP2-MQ7I-YC9E-1571216642640-MOT86R6LEOBN.png" alt=""/>
                    <div className="uni-exp-ercode">
                        <PressHoc region={financialCamp?.name?"experience-finance-card-press":"experience-invite-card-press"}>
                            <img src={ qrUrl } alt=""/>
                        </PressHoc>
                    </div>
                </div>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    getQr,
    uploadImage
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceFinanceCard);