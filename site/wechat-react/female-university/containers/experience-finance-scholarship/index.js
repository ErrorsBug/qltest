import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import { getBaseUserInfo,bindAppKaiFang } from "../../actions/common";
import { getShareCamp,getFinancialCampShareMoneyDetail } from "../../actions/experience";
import PressHoc from 'components/press-hoc';
import { getVal, formatDate, locationTo, formatMoney } from '../../../components/util';
import ScrollToLoad from 'components/scrollToLoad';
import Picture from 'ql-react-picture';  
import DialogRule from '../experience-finance-poster/components/dialog-rule' 

@autobind
class ExperienceFinanceScholarship extends Component {
    state = {
        dataList: [],
        isNoMore:false,
        noData:false,
        detailMoney:{},
        user:{}
    }
    get cardId(){
        return getUrlParams("cardId", "")
    } 
    
    page = {
        size: 20,
        page: 1
    }
    async componentDidMount() {
        this.initData()
        this.getFinancialCampShareMoneyDetail()
        bindAppKaiFang()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-course-test-list-box');
    }
    async getFinancialCampShareMoneyDetail(){
        const res= await getFinancialCampShareMoneyDetail()
        let data = await getBaseUserInfo(); 
        this.setState({
            detailMoney:res,
            user: data?.user,
        })
    }
    async initData(){ 
        const { dataList } = await getShareCamp({
            ...this.page
        })   
        
        if(!!dataList){
            if(dataList.length >= 0 && dataList.length < this.page.size){
                this.setState({
                    isNoMore: true
                }) 
            }  
            this.setState({
                dataList: [...this.state.dataList, ...dataList]
            },()=>{
                if(!this.state.dataList||this.state.dataList.length==0){
                    this.setState({
                        noData:true
                    })
                }
            })
        } 
    }
    async loadNext(next) {  
        this.page.page += 1; 
        await this.initData(); 
        next && next();
    }
    
	enterCourse (index,sub_index) {
        const { dataList=[] } = this.state;
        const item=dataList[index]?.periodList[sub_index] 
        if(dataList[index]?.type=='multi'){
            let channelIds= dataList[index].periodList.map((item,index)=>{
                return item.channelId
            })
            locationTo(`/wechat/page/channel-intro?channelId=${item?.channelId}&channelIds=${channelIds}&channelType=camp&source=finance`)  
            return
        }else{
            locationTo(`/wechat/page/channel-intro?channelId=${item?.channelId}&channelType=camp&source=finance`)  
        }   
    }
    
    
    render(){
        const { dataList=[],isNoMore,noData,detailMoney,user } = this.state; 
        return (
            <Page title={ '我的奖学金' } className="experience-finance-scholarship">
                <ScrollToLoad 
                    className={`experience-finance-scroll-box`}
                    toBottomHeight={300} 
                    disable={isNoMore}
					noneOne={noData} 
                    loadNext={ this.loadNext }>  
                    <div className="efs-header">
                        <div className="efs-header-top">
                            <div className="efs-header-avator"><img src={user?.headImgUrl}/> </div>
                            <div className="efs-header-name">{user?.name}</div>
                            <div className="efs-header-invite on-log on-visible" 
                                data-log-name={'邀请明细'}
                                data-log-region="experience-finance-scholarship-invite-detail"
                                data-log-pos={'0'}     
                                onClick={()=>{locationTo('/wechat/page/experience-finance-invite-detail')}}>邀请明细 <i className="iconfont iconxiaojiantou-copy"></i></div>
                        </div>
                        <div className="efs-header-money">
                            <div className="efs-header-totle efs-header-border">
                                <div className="efs-header-price"><span>￥</span>{formatMoney( detailMoney.total||0)} </div>
                                <div className="efs-header-title">
                                    累计奖学金
                                    <DialogRule>
                                        <img src="https://img.qlchat.com/qlLive/business/5NM5L7UO-RDHM-FSKI-1572249160123-EPKZKTBZ2A4P.png"/>
                                    </DialogRule> 
                                </div>
                            </div>
                            <div className="efs-header-totle">
                                <div className="efs-header-price"><span>￥</span>{formatMoney(detailMoney.balance||0)} </div>
                                <div className="efs-header-title efs-header-withdraw on-log on-visible" 
                                    data-log-name={'可提现金额'}
                                    data-log-region="experience-finance-scholarship-withdraw"
                                    data-log-pos={'0'}        
                                    onClick={()=>{locationTo('/wechat/page/experience-finance-withdraw')}}>可提现金额 <i className="iconfont iconxiaojiantou-copy"></i></div>
                            </div>
                        </div>
                    </div>
                    {
                        dataList?.length>0&&
                        <div className="efs-list">
                            <div className="efs-list-item">
                                <div className="efs-list-item-title"><span> 可获得奖学金的训练营</span></div>
                                <div className="efs-list-item-list">
                                    {
                                        dataList.map((item,index)=>{
                                            return (
                                                <div className="efs-list-item-list-item on-log on-visible" 
                                                    data-log-name={'可获得奖学金的训练营'}
                                                    data-log-region="experience-finance-scholarship-lists"
                                                    data-log-pos={item.campId}       
                                                    key={index}  
                                                    onClick={()=>{locationTo(`/wechat/page/experience-finance?campId=${item.campId}`)}}>  
                                                    <div className="finance-item-img">
                                                        <Picture src={item.headImg} resize={{w:267,h:166}}/>  
                                                    </div>
                                                    <div className="finance-item-content">
                                                        <div className="finance-item-title">{item.campName} </div>
                                                        <div className="finance-item-bottom"> 
                                                            <div className="finance-item-state"> 已有{item.orderCount||0}人报名 </div>
                                                            <div className="finance-item-btn on"> 可赚{formatMoney(item.shareMoney) }元 </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                
                    }
                    
                </ScrollToLoad>
                
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = { 
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceFinanceScholarship);