import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';  
import { fillParams ,getUrlParams } from 'components/url-utils';
import Barrage from './components/barrage';
import { createPortal } from 'react-dom';
import { getFinancialCamp,getCourseInfo,getCourseTopicList } from '../../actions/experience'
import PortalCom from '../../components/portal-com';
import { formatDate, locationTo, getVal, formatMoney, getCookie } from 'components/util';
import { doPay } from 'common_actions/common'
import BasicData from './basic-data'
import FinancePayment from '../../components/finance-payment';
import Picture from 'ql-react-picture';
import { MiddleDialog } from 'components/dialog';
import { request } from 'common_actions/common'
import PayTimer from './components/pay-timer' 
import {  bindAppKaiFang } from "../../actions/common";
import FixedTopRight from '../../components/fixed-top-right'
import DialogCourseDetails from '../../components/dialog-course-details'

@BasicData
@autobind
class ExperienceFinance extends Component { 
    state = {  
        isShow: true,
        campObj: {}, 
        orderList:[],
        d: '0',
        h: "00",
        m: "00",
        s: "00",
        t: "0",
        totalPrice:0
    }
    
    get campId(){ 
        return getUrlParams('campId', '')
    }

    get qyId(){
        return getUrlParams('qyId', '')
    }

    async componentDidMount() { 
        this.initAvatorAnimation() 
        this.getOrders() 
        bindAppKaiFang()
        sessionStorage.setItem('urlCampData', JSON.stringify(getUrlParams('', '')))
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('experience-finance-box');
    } 
    
    initAvatorAnimation(){
        setInterval(async ()=>{
            let {activeIndex=0}=this.state
            activeIndex++
            await this.setState({
                activeIndex
            })
        },1000)
    }
    
    // 获取购买历史
    async getOrders() {
        await request({
            url: '/api/wechat/transfer/shortKnowledgeApi/financial/camp/listOrder',
            method: 'POST',
            body: {
                type: 'ufw_camp', 
                page: {
                    page: 1,
                    size:20
                }
            }
        }).then(res => {
            let orderList = getVal(res, 'data.dataList', []);
            this.setState({
                orderList
            })
            
		}).catch(err => {
			console.log(err);
		})
    }
     
    
    updatTime({d,h,m,s,t}){ 
        this.setState({
            d,h,m,s,t
        })
    }

    updateCharge(totalPrice){
        this.setState({totalPrice})
    }
  
    render(){
        const {   
            isShowRule=false,
            activeIndex=0,
            orderList=[], 
            totalPrice, 
        } = this.state
        const {financialCamp,getShareMoneyData, campObj, payBtn } = this.props  
        if(!financialCamp) return null; 
        const isPlaying=financialCamp?.buyStatus=='N'&&financialCamp?.periodList&&financialCamp?.signupEndTime>this.props.sysTime&&financialCamp?.status=='Y'
        return (
            <Page title={ financialCamp?.name || '' } className="experience-finance-box">
                { financialCamp?.type=='single'&&financialCamp?.resourceList && financialCamp?.resourceList.length && (
                    <div className="experience-finance-main"> 
                        <div className="experience-finance-list">
                            {
                                financialCamp?.resourceList.map((item,index)=>{
                                    return(
                                        <div className="experience-finance-item" key={index+1} onClick={ () => {
                                            item.jumpUrl && locationTo(item.jumpUrl)
                                        } }>
                                            <img src={item?.url} /> 
                                        </div> 
                                    )
                                })
                            }
                        </div>
                    </div> 
                ) }
                { financialCamp?.type=='multi' && (
                    <div className="experience-finance-camp"> 
                        <div><Picture src={financialCamp?.headImg} resize={{w:750,h:439}}/></div>
                        <div className="experience-finance-main-list" style={{background:financialCamp?.bgColor}}>
                            <div className="experience-finance-list-container">
                                <div className="experience-finance-data">
                                    {
                                        financialCamp?.periodList?.map((item,index)=>{
                                            return(
                                                <div className="experience-finance-item" key={index+1} onClick={ () => {
                                                    item.jumpUrl && locationTo(item.jumpUrl)
                                                } }>
                                                    <div className="finance-item-img">
                                                        <Picture src={item.headImg} resize={{w:267,h:166}}/>  
                                                    </div>
                                                    <div className="finance-item-content">
                                                        <div className="finance-item-title"> {item.campName} </div>
                                                        <div className="finance-item-time"> 开营时间：{formatDate(item.startTime,'yyyy/MM/dd')} </div>
                                                        <div className="finance-item-bottom"> 
                                                            <div className="finance-item-price"> 原价 ￥{formatMoney(item.price)} </div>
                                                            {
                                                                item.tryListen=='Y'&&
                                                                <DialogCourseDetails 
                                                                    businessId={item.channelId} 
                                                                    desc={item.desc} 
                                                                    tabTitle={['训练营简介','听课列表']}
                                                                    className="on-log on-visible" 
                                                                    data-log-name={'试听'}
                                                                    data-log-region="experience-finance-try-listen-multi"
                                                                    data-log-pos={item.id}> 
                                                                    <div className="finance-item-btn" > 试听 </div>
                                                                </DialogCourseDetails>
                                                            }
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                </div> 
                                            )
                                        })
                                    }
                                </div>
                                <div className="experience-finance-buy-num">
                                    <div className="experience-finance-avator">
                                        {
                                            orderList.map((item,index)=>{
                                                return <img key={index} className={(index==activeIndex%orderList.length||index==activeIndex%orderList.length-1)?'on':''} src={item.headImgUrl}/>
                                            })
                                        }
                                    </div>    
                                    <div className="experience-finance-buy-text">已有<span>{financialCamp?.orderCount||0}</span>人抢购成功，名额有限，手快有，手慢无</div>
                                </div>   
                                <div className="experience-finance-rule on-log on-visible" 
                                    data-log-name={'购买须知'}
                                    data-log-region="experience-finance-buy-rule"
                                    data-log-pos="0"    
                                    ><span onClick={()=>{this.setState({isShowRule:true})}}>购买须知</span></div>
                            </div> 
                        </div> 
                    </div> 
                ) }
                {
                    createPortal(
                        <MiddleDialog 
                            show={isShowRule }
                            onClose={()=>{this.setState({isShowRule:false})}}
                            className="experience-finance-rule-dialog">
                            <div className="ef-rule-title">购买须知</div>
                            <div className="ef-rule-content">
                                <ol>
                                    <li><span>1、</span>成功购买训练营后，将按时解锁学习，课程享受永久回听。</li>
                                    <li><span>2、</span>如已单独购买过套餐中的部分训练营，将无法重复购买，可联系班主任了解其他套餐或训练营。</li>
                                    <li><span>3、</span>本训练营为线上内容服务，基于在线内容的特殊性及产品的整体性，学员购买后将不支持退款。</li>
                                    <li><span>4、</span>请务必扫描下方二维码，关注公众号听课。购买后记得按照提示，添加班主任微信，获得开营提醒，锁定各种班级福利。</li>
                                    <li><span>5、</span>活动最终解释权归千聊富家理财所有。</li>
                                </ol>
                                <div className="ef-rule-qrcode"><img src="https://img.qlchat.com/qlLive/business/1V9MFDOQ-GV75-7AWH-1571304076616-GYBJR8XFJWPL.jpg"/></div>
                            </div>
                            <div className="ef-rule-bottom" onClick={()=>{this.setState({isShowRule:false})}}>我知道了</div>
                        </MiddleDialog>
                        ,document.getElementById('app'))
                } 
                {
                    orderList?.length>0&&createPortal(
                        <Barrage  
                            className={isPlaying?'efb-with-time':''}
                            orderList={orderList}
                            actId={ this.campId }
                            doingSt={['刚分享给朋友','5秒前下单','已加入训练营','邀请你一起抱团成长','已经开始学习']}
                        />
                        ,document.getElementById('app'))
                }  
                <PortalCom className={ `experience-pay-btn` }>  
                    {
                        isPlaying&&<PayTimer {...this.state}/>
                    }
                    {
                        financialCamp?.type=='single'&&<div className="experience-one">
                            {
                                financialCamp?.buyStatus=='Y'&&financialCamp?.status=='Y'?
                                <div className="experience-pay-start on-log on-visible" 
                                    data-log-name={'进入训练营'}
                                    data-log-region="experience-finance-single-enter"
                                    data-log-pos="0"    
                                    onClick={()=>locationTo(`/wechat/page/channel-intro?channelId=${financialCamp?.periodList[0].channelId}&channelType=camp&source=finance`)}>进入训练营</div>
                                :
                                isPlaying?
                                <Fragment>
                                    {
                                        financialCamp?.periodList[0].tryListen=='Y'&&
                                        <DialogCourseDetails 
                                            businessId={financialCamp?.periodList[0]?.channelId} 
                                            isHideIntro 
                                            className="on-log on-visible" 
                                            data-log-name={'试听'}
                                            data-log-region="experience-finance-try-listen-single"
                                            data-log-pos="0">
                                            <div className="uni-pay-com uni-pay-info" 
                                                data-log-name={'试听'}
                                                data-log-region="experience-finance-try-listen-single"
                                                data-log-pos="0">
                                                <img src="https://img.qlchat.com/qlLive/business/AM2189OH-TG1I-GX1Z-1570850081872-PAT7QHDWHXOH.png"/>试听
                                            </div>
                                        </DialogCourseDetails>
                                    }
                                    <FinancePayment region={'experience-finance-single'} updateCharge={this.updateCharge} updatTime={this.updatTime} {...financialCamp}>
                                        <div className="uni-pay-com uni-pay-red">
                                            <div className="pay-price-count">¥{totalPrice}</div>
                                            {
                                                financialCamp?.price>0&&<div className="pay-price"><div>原价</div><div>¥{formatMoney(financialCamp?.price)}</div></div>
                                            }
                                            <div>立即加入</div>
                                        </div>
                                    </FinancePayment> 
                                </Fragment>
                                :<div className="experience-pay-end">该训练营已结束</div>
                            }
                        </div>
                    }
                   {
                        financialCamp?.type=='multi'&&
                        <Fragment> 
                            <div className="experience-list">
                            {
                                financialCamp?.buyStatus=='Y'&&financialCamp?.status=='Y'?
                                <div className="experience-pay-start on-log on-visible" 
                                    data-log-name={'开始学习'}
                                    data-log-region="experience-finance-multi-learn"
                                    data-log-pos="0"    
                                    onClick={()=>{locationTo('/wechat/page/experience-finance-bought')}}>开始学习</div>
                                :
                                isPlaying?
                                <Fragment>
                                    <div className="uni-pay-com uni-pay-info">
                                        <div className="pay-price-count">¥{totalPrice}</div>
                                        {
                                            financialCamp?.price>0&&<div className="pay-price"><div>原价</div><div>¥{formatMoney(financialCamp?.price)}</div></div>
                                        } 
                                    </div>
                                    <FinancePayment region={'experience-finance-multi'} updateCharge={this.updateCharge} updatTime={this.updatTime} {...financialCamp}>
                                        <div className="uni-pay-com uni-pay-red">
                                                立即加入
                                        </div>
                                    </FinancePayment>
                                </Fragment>
                                :<div className="experience-pay-end">活动已结束</div>
                            }
                                 
                            </div>
                        </Fragment>
                    }
                </PortalCom> 
                {
                    getShareMoneyData?.isShareUser==='Y'&&financialCamp?.periodList&&financialCamp?.signupEndTime>this.props.sysTime&&financialCamp?.status=='Y'
                    &&
                    createPortal(
                        <FixedTopRight url={`/wechat/page/experience-finance-poster?campId=${this.campId}`}>
                            <div className="experience-finance-icon">
                                <img src="https://img.qlchat.com/qlLive/business/GOGQ3UNH-DK9N-WO61-1571809508541-AZJNPOSGNOUJ.png"/>
                            </div> 
                            <div className="text">赚<span>{formatMoney( getShareMoneyData?.shareMoney )}</span>元</div>
                        </FixedTopRight>
                        ,document.getElementById('app')) 
                } 
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = { 
    doPay
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceFinance);