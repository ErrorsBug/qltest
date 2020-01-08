import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { userBindKaiFang } from "../../../actions/common"
import PortalCom from '../../components/portal-com';
import { fillParams ,getUrlParams } from 'components/url-utils';
import Iframe from 'react-iframe'
import { getTopicListByChannel, getTopicInfo } from "../../actions/home";
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate, digitFormat, isBeginning, locationTo } from 'components/util';
import { getSaleQr } from '../../actions/home'
import AppEventHoc from '../../components/app-event'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import FloatRightTopBtn from '../../components/float-right-top-btn'
import {  getIntentionCamp,getDistributeConfig } from "../../actions/experience";
import CampGiftEntry from '../../components/camp-gift-entry'

const CampItems = ({ idx, topic, browseNum, sysTime, handleLink, id, status, startTimer, startTime }) => {
    let isFuture = false;
    if (startTimer && (sysTime < startTimer)) {
        isFuture = true;
    }
    return(
        <div className="exp-camp-item" data-idx={ idx } onClick={ () => handleLink(id, isFuture) }>
            <p>{ topic }</p>
            <div className="exp-camp-info">
                <div className="exp-camp-status">
                    {/* <i>{formatDate(startTime, 'MM月dd日 hh:mm')}</i> */}
                    <i>{digitFormat(browseNum || 0)}次学习</i>
                </div>
                { isFuture && <span className="iconfont iconsuo"></span> }
            </div>
        </div>
    )
}

@HandleAppFunHoc
@AppEventHoc
@autobind
class ExperienceCampList extends Component {
    state = {
        campObj: {},
        isShow: false,
        topicLists: [],
        isOnce: false,
        isNoMore: false,
        isLoad: false,
        topicInfo: null,
        startTimer: null,
        endTimer: null,
        isQr: false
    }
    page = {
        page: 1,
        size: 1000,
    }
    
    get campId(){ 
        return getUrlParams('campId', '')
    }
    get topicId() {
        return getUrlParams('topicId', '')
    }
    courseId = ''
    isLoading = false
    async componentDidMount() { 
        const campId = localStorage.getItem('showIframe')
        if(campId && (this.campId == campId)){
            this.setState({
                isOnce: true, 
            }) 
        }
        // 安卓回调
        this.props.onSuccess('onSuccess', () => {
            this.paySuccess()
        })
        this.initDataQr();
        this.initData();
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-class-code');
    }

    // 获取导购图列表
    async initData() {  
        const { camp, userBuyCampBeginTime, userBuyCampEndTime } = await getIntentionCamp({
            campId: this.campId,
        }) 
        const { config } = await getDistributeConfig({
            campId: this.campId,
            type:"INTENTION"
        }) 
        if(camp?.courseId && camp?.courseType){
            const flag = camp?.courseType === 'camp'
            this.courseId = flag ? camp?.channelId : camp?.courseId;
            if(camp?.courseType === 'channel' || flag) {
                this.getLists()
            }
            if(camp?.courseType === 'topic') {
                this.getTopicInfo()
            }
        } else {
            this.setState({
                isLoad: true,
            })
        }
        this.setState({
            config,
            campObj: camp || {},
            startTimer: userBuyCampBeginTime || null,
            endTimer: userBuyCampEndTime || null
        })
    }
    async initDataQr() {
        const { qr } = await getSaleQr({
            resourceId: this.campId,
            resourceType: 'ufw_camp'
        });
        this.setState({
            isQr: !!qr
        })
    }
    
    // 获取听书列表
    async getLists() {
        let { dataList } = await getTopicListByChannel({
            channelId: this.courseId,
        });
        const lists = dataList || [];
        this.setState({
            topicLists: lists,
            isLoad: !lists.length
        })
    }

    // 获取话题数据
    async getTopicInfo() {
        const { data } = await getTopicInfo({
            topicId: this.courseId
        })
        this.setState({
            topicInfo: data?.topicPo || null
        })
        // console.log(res)
    }

    // 隐藏弹窗
    hideIframe() {
        localStorage.setItem('showIframe', this.campId)
        this.setState({
            isShow: false,
            isOnce: true
        })
    }

    // 跳转页面
    goPage() {
        const { campObj, isQr } = this.state;
        if(this.props.isQlchat) {
            this.sendAppSubscribe();
        } else {
            let localUrl = `/wechat/page/university-activity-url?campId=${this.campId}`
            localUrl = isQr ? localUrl : campObj.wechatUrl
            locationTo(localUrl)
        }
    }

    // async loadNext(next) {
    //     if(this.isLoading || this.state.isNoMore) return false;
    //     this.isLoading = true;
    //     await this.getLists();
    //     this.isLoading = false
    //     next && next();
    // }

    // 跳转链接
    handleLink(id, isFuture){
        if(isFuture){
            window.toast('请添加班主任，加入班级群学习~')
        } else {
            locationTo(`/topic/details?topicId=${ id }&isUnHome=Y`)
        }
    }

    // 调用app一次性订阅
    sendAppSubscribe() {
        this.props.handleAppSdkFun('commonSubscribeMessage', {
            type: 'ufw_camp',
            pushData: {
                campId: Number(this.campId),
            },
            callback: () => {
                
            }
        })
    }

    render(){
        const { campObj, isShow, topicLists, isOnce, isNoMore, isLoad, topicInfo, startTimer, endTimer, config } = this.state;
        return (
            <Page title={ campObj?.title || '' } className="exp-camp-list">
                <ScrollToLoad
                    className={"exp-camp-scroll"}
                    toBottomHeight={300}
                    disable={ true }
                    >
                        {
                            campObj.shareType=='INTENTION_SHARE'&&config?.distributionStatus=='Y'&&config?.entranceStatus=='N'&&
                            <FloatRightTopBtn region={'experience-camp-list-scholarship'} onClick={()=>{locationTo(fillParams({type:campObj?.campType=='ufw_camp'?'intention':'financial'}, `/wechat/page/experience-camp-scholarship`))}}/>
                        }
                    <div className="exp-camp-header">
                        <div className="exp-camp-img">
                            <img src={ campObj?.boughtImgUrl } alt=""/>
                            <div className="exp-camp-info">
                                <h3>{ campObj?.title || '' }</h3>
                                { ((campObj?.startTime && campObj?.endTime) || (startTimer && endTimer))&& <p>带学时间: { formatDate(startTimer || campObj?.startTime, 'MM/dd') } - { formatDate(endTimer || campObj?.endTime, 'MM/dd') }</p> }
                            </div>
                        </div>
                        <h4>务必加老师微信，领每日学习资料</h4>
                        <div className="exp-camp-wx on-log on-visible" 
                            data-log-name={ "添加微信" }
                            data-log-region="experience-camp-list-wx"
                            data-log-pos={ 0 } 
                            onClick={ this.goPage }>添加微信</div>
                    </div>
                    {
                        campObj.shareType=='INTENTION_SHARE'&&config?.distributionStatus=='Y'&&config?.entranceStatus=='Y'&&config?.entranceImgUrl&&
                        <div  className="exp-camp-to-share on-log on-visible" 
                            data-log-name={ "奖学金活动入口" }
                            data-log-region="experience-camp-list-entrance"
                            data-log-pos={ 0 }
                            onClick={()=>{locationTo(`/wechat/page/experience-camp-activity?campId=${this.campId}`)}}><img src={config?.entranceImgUrl}/></div>
                    }
                    <div className="exp-camp-cont">
                        <h4>{ !!topicInfo ? '课程' : '课程列表' }</h4>
                        { !!topicLists.length && topicLists.map((item, index) => (
                            <CampItems 
                                key={ index } 
                                handleLink={ this.handleLink }
                                sysTime={ this.props.sysTime }
                                startTimer={startTimer}
                                idx={ index + 1 } 
                                {...item} />
                        )) }
                        { topicInfo && 
                            <CampItems 
                                idx={ 1 } 
                                handleLink={ this.handleLink }
                                sysTime={ this.props.sysTime }
                                startTimer={startTimer} 
                                {...topicInfo}/> }
                    </div>
                    { isLoad && <div className="exp-camp-more">暂无数据</div> }
                </ScrollToLoad>
                {
                    campObj.shareType=='INVITE_EVENT'&&campObj.inviteEventCode&&
                    <CampGiftEntry region="experience-camp-list-gift-entry" nodeCode={campObj.inviteEventCode} campId={this.campId} className="experience-camp-list-entry"/>
                }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = {
    userBindKaiFang
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceCampList);