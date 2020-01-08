import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import { getBaseUserInfo,bindAppKaiFang } from "../../actions/common";
import { getListUserCamp,campIsShareUserOnce } from "../../actions/experience"; 
import { getVal, formatDate, locationTo } from '../../../components/util';
import ScrollToLoad from 'components/scrollToLoad';
import Picture from 'ql-react-picture';   
import { createPortal } from 'react-dom';

@autobind
class ExperienceFinanceBought extends Component {
    state = {
        dataList: [],
        isNoMore:false,
        noData:false,
        isShareUserOnce:'N',
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
        this.getIsShareUserOnce()
         bindAppKaiFang()
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-course-test-list-box');
    }
    async getIsShareUserOnce(){
        const {isShareUserOnce} = await campIsShareUserOnce()
        if(isShareUserOnce=='Y'){
            let data = await getBaseUserInfo();
            this.setState({
                user: data?.user,
            });
        }
        this.setState({isShareUserOnce})
    }
    async initData(){ 
        const { dataList } = await getListUserCamp({
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
        const { dataList=[],isNoMore,noData,isShareUserOnce,user } = this.state; 
        console.log(user)
        return (
            <Page title={ '购买记录' } className="experience-finance-bought">
                <ScrollToLoad 
                    className={`experience-finance-scroll-box ${isShareUserOnce=='Y'?'experience-finance-is-share':''}`}
                    toBottomHeight={300} 
                    noMore={isNoMore}
					noneOne={noData} 
                    loadNext={ this.loadNext }> 
                    {
                        isShareUserOnce=='Y'&& createPortal(
                            <div className="experience-finance-bought-header">
                                <div className="ef-header-avator"><Picture resize={{w:64,h:64}} src={user?.headImgUrl}/></div>
                                <div className="ef-header-middle">
                                    <div className="ef-header-name">{user?.name}</div>
                                    <div className="ef-header-tip">邀请好友一起学习即可赚奖学金</div>
                                </div>
                                <div className="ef-header-btn on-log on-visible" 
                                    data-log-name={'去赚奖学金'}
                                    data-log-region="experience-finance-bought-scholarship"
                                    data-log-pos={'0'}      
                                    onClick={()=>{locationTo('/wechat/page/experience-finance-scholarship')}}>
                                    <div className="experience-finance-icon">
                                        <img src="https://img.qlchat.com/qlLive/business/GOGQ3UNH-DK9N-WO61-1571809508541-AZJNPOSGNOUJ.png"/>
                                    </div> 
                                    <div className="ef-header-text">去赚奖学金</div>
                                </div>
                            </div>
                        ,document.getElementById('app'))
                    }
                    <div className="efb-list">
                            {
                                dataList.map((item,index)=>{
                                    return (
                                        <div className="efb-list-item" key={index}>
                                            {
                                                item.type=='multi'&&<div className="efb-list-item-title"><span> {item.name}</span></div>
                                            }  
                                            <div className="efb-list-item-list">
                                                {
                                                    item.periodList&&item.periodList.map((sub_item,sub_index)=>{
                                                        return (
                                                            <div className="efb-list-item-list-item on-log on-visible" 
                                                                data-log-name={'购买记录列表'}
                                                                data-log-region="experience-finance-bought-lists"
                                                                data-log-pos={sub_item.id}     
                                                                key={sub_index} onClick={()=>{this.enterCourse(index,sub_index)}}>  
                                                                <div className="finance-item-img">
                                                                    <Picture src={sub_item.headImg} resize={{w:267,h:166}}/>  
                                                                </div>
                                                                <div className="finance-item-content">
                                                                    <div className="finance-item-title"><span>{sub_item.name} </span> {sub_item.campName} </div>
                                                                    <div className="finance-item-time"> 开营时间：{formatDate(sub_item.startTime,'yyyy/MM/dd')}  </div>
                                                                    <div className="finance-item-bottom"> 
                                                                        <div className="finance-item-state"> 永久有效 </div>
                                                                        {
                                                                            sub_item.endTime<this.props.sysTime?
                                                                            <div className="finance-item-btn end"> 已结营 </div>
                                                                            :sub_item.startTime<this.props.sysTime?
                                                                            <div className="finance-item-btn on"> 去学习 </div>
                                                                            :
                                                                            <div className="finance-item-btn"> 等待开营 </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                } 
                                            </div>
                                        </div>
                                    
                                    )
                                })
                            }
                    </div>
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

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceFinanceBought);