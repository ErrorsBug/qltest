import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import { getBaseUserInfo,bindAppKaiFang } from "../../actions/common";
import { userDistributeProfitList,ufwDistributeAccount } from "../../actions/experience";
import PressHoc from 'components/press-hoc';
import { getVal, formatDate, locationTo, formatMoney } from '../../../components/util';
import ScrollToLoad from 'components/scrollToLoad';
import Picture from 'ql-react-picture';  
import DialogRule from '../experience-finance-poster/components/dialog-rule' 
import { fillParams } from '../../../components/url-utils';

@autobind
class ExperienceCampScholarship extends Component {
    state = {
        profitList: [],
        isNoMore:false,
        noData:false,
        detailMoney:{},
        user:{}
    }
    get type(){
        return getUrlParams("type")||'intention'
    } 
    get accountType(){
        return this.type=='financial'?'FINANCING_DISTRIBUTE':'UFW_CAMP_DISTRIBUTE'
    } 
    
    page = {
        size: 20,
        page: 1
    }
    async componentDidMount() {
        this.initData()
        this.ufwDistributeAccount()
        bindAppKaiFang()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-course-test-list-box');
    }
    async ufwDistributeAccount(){
        const res= await ufwDistributeAccount({accountType:this.accountType})
        this.setState({
            detailMoney:res,
        })
    }
    async initData(){ 
        const { profitList,count } = await userDistributeProfitList({
            ...this.page,
            accountType:this.accountType
        })   
        
        if(!!profitList){
            if(profitList.length >= 0 && profitList.length < this.page.size){
                this.setState({
                    isNoMore: true
                }) 
            }  
            this.setState({
                profitList: [...this.state.profitList, ...profitList],
                count
            },()=>{
                if(!this.state.profitList||this.state.profitList.length==0){
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
     
    
    
    render(){
        const { profitList=[],isNoMore,noData,detailMoney,count=0 } = this.state; 
        return (
            <Page title={ '我的奖学金' } className="experience-camp-scholarship">
                <ScrollToLoad 
                    className={`experience-camp-scroll-box`}
                    toBottomHeight={300} 
                    noMore={isNoMore}
					noneOne={noData} 
                    loadNext={ this.loadNext }>  
                    <div className="camp-scholarship-head">
                        <div className="scholarship-head-title"> 可提现奖学金</div>
                        <div className="scholarship-head-intro"> 好友完成购买后，{this.type=='financial'?'14':'7'}天后即可提现奖学金</div>
                        <div className="scholarship-head-money"><span>￥</span>{formatMoney(detailMoney?.balance||0)}</div>
                        <div className="scholarship-head-btn on-log on-visible" 
                            data-log-name={ "去提现" }
                            data-log-region="experience-camp-scholarship-withdraw"
                            data-log-pos={ 0 } 
                            onClick={()=>{locationTo(fillParams({type:this.type},`${location.origin}/wechat/page/experience-camp-withdraw`) )}}>去提现</div>
                    </div>
                    <div className="camp-scholarship-money">
                        <div className="scholarship-money-item">
                            <div className="scholarship-money-item-title"> 累计奖学金 </div>
                            <div className="scholarship-money-item-num  "> ￥{formatMoney(detailMoney?.total||0)} </div>
                        </div>
                        <div className="scholarship-money-item">
                            <div className="scholarship-money-item-title"> 待结算奖学金 </div>
                            <div className="scholarship-money-item-num  "> ￥{formatMoney(detailMoney?.beBalance||0)} </div>
                        </div>
                        <div className="scholarship-money-item">
                            <div className="scholarship-money-item-title"> 推广人数 </div>
                            <div className="scholarship-money-item-num  "> {count} </div>
                        </div>
                    </div>
                    <div className="camp-scholarship-list">
                        <div className="scholarship-list-title">奖学金明细</div>
                        {
                            profitList?.map((item,index)=>{
                                return (
                                    <div className="scholarship-list-item" key={index}>
                                        <div className="scholarship-list-item-avator"><img src={item.createByHeadImg}/></div>
                                        <div className="scholarship-list-item-content">
                                            <div className="scholarship-list-item-name">{item.createByName} </div>
                                            <div className="scholarship-list-item-camp">{item.profitName} </div>
                                        </div>
                                        <div className="scholarship-list-item-num">
                                            <div className="scholarship-list-item-money">+{formatMoney( item.money )}元 </div>
                                            <div className="scholarship-list-item-time">{formatDate( item.createTime ,'MM/dd')} </div>
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

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceCampScholarship);