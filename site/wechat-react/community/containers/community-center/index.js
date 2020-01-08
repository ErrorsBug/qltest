import React, { Component } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import ChToEdit from '../../components/ch-to-edit';
import EmptyStatus from '../../components/empty-status';
import IdeaItemUserinfo from '../../components/idea-item/idea-item-userinfo';
import { getUrlParams, fillParams } from 'components/url-utils';
import { getTopic, getListIdea, saveListIdeaData, isStudent, deleteIdea,getListFocusIdea, getListHomeStudent,getSingleStudentInfo , getObscuration} from "../../actions/community";
import { getVal, locationTo, formatDate, getCookie } from 'components/util';
import { getMenuNode } from '../../actions/home'
import AppEventHoc from '../../components/app-event'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import { share } from 'components/wx-utils';
import PubSub from 'pubsub-js'
import Picture from 'ql-react-picture'
import TabNav from '../../components/tab-nav'
import appSdk from 'components/app-sdk';
import ListTopic from '../../components/list-topic';
import TabBar from 'components/tabbar';
import Lottie from 'lottie-react-web' 
import ExcellentAlumni from './components/excellent-alumni'
import { bindAppKaiFang } from '../../actions/common';
import PortalComp from '../../components/portal-com';
import { isIOS, isAndroid } from 'components/envi'

@HandleAppFunHoc
@AppEventHoc
@autobind
class CommunityCenter extends Component {
    state = {
        topic: {},
        listIdeaData: [],
        listIdeaSpecData: [],
        isNoMore: false,
        universityFlagData: {},
        flagHelpListData: {},
        shareId: '',
        upNumber: 0,
        isShowProcess: false,
        isShowType: "",
        isShowRecard: false,
        showCashIndex: 2,
        recardDate: '',
        showCashType: '',
        isShowFail: false,
        isShowWithdraw: false,
        studentInfo: {},
        scrolling: false,
        tabIdx: 0,
        isAttention: false,
        excellentNodeMsg:{},
        studentTopList:[],
        isShowGuide: false,
        isOnce: false,
        campObj: null,
        targetUrl: '',
        targetCls:''
    }

    get isApp() {
        return getUrlParams('isApp', '')=='Y'
    }
    get isTab() {
        return getUrlParams('isTab', '')
    }
    get isGuest() {
        return true
    }
    get topicId() {
        return getUrlParams('topicId', '')
    }
    get ideaUserId(){ 
        return getUrlParams('studentId','')|| getCookie('userId')
    }
    page = {
        page: 1,
        size: 20
    }
    wdWidth = 0
    async componentDidMount() {
        this.initCampStatus();
        this.initStore();
        if (this.props.listIdeaObj.listIdeaData.length > 0) { 
            const {isNoMore,noData,listIdeaData,page,scrollTop,tabIdx=0,excellentNodeMsg,studentTopList}=this.props.listIdeaObj
            this.page.page=page
            await this.setState({
                isNoMore,noData,listIdeaData,tabIdx,excellentNodeMsg,studentTopList
            })
            document.getElementById('scrolling-box').scrollTop = scrollTop
        } else {
            setTimeout(async ()=>{
                window.loading && window.loading(true)
                await this.queryListHomeStudent()
                await this.getListIdeaData() 
                window.loading && window.loading(false)
            })
        }
        this.getListIdeaNewData()
        this.getFocusListIdeaNewData()

        this.initShare() 
        bindAppKaiFang()
        PubSub.subscribe('saveIdea', async() => {
            this.page.page = 1; 
            this.state.isNoMore=false
            this.state.noData=false 
            this.state.listIdeaData=[]
            this.state.tabIdx=2
            this.props.saveListIdeaData({tabIdx:1,page : 1,isNoMore:false,noData:false,listIdeaData:[]})
            await this.getListIdeaData(true); 
            this.changeNewStatus()
        })
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('fh-scroll-box');
        this.wdWidth = document.scrollingElement.clientHeight
    }

    // 体验营蒙层显示
    async initCampStatus() {
        let platform = 'h5'
        if(this.props.isQlchat) {
            if(isAndroid()) {
                platform = 'android'
            } else {
                platform = 'ios'
            }
        }
        const res = await getObscuration({ platform: platform });
        const obj = res && Object.is(res.show,'Y') ? res : null
        this.setState({
            campObj: obj,
            targetUrl: res.targetUrl || ''
        })
    }

    initStore(){
        let guideNumb = localStorage.getItem('guideNumb') || 0
        if(Number(guideNumb) >= 3) {
            this.setState({
                isOnce: true
            })
        }
        
    }

    initShare() {
        const { topic } = this.state
        const params = {
            wcl: 'university_community_share'
        }
        const shareParams = {
            title: '千聊女子大学社区',
            desc: '一起讨论话题，交流想法，用智慧温暖彼此。',
            timelineDesc: '一起讨论话题，交流想法，用智慧温暖彼此。',
            imgUrl: 'https://img.qlchat.com/qlLive/activity/image/7U9OO2L5-Y1W6-WRND-1570504679615-PRIR25AIRY3R.jpg',
            shareUrl: fillParams(params, location.href, ['isTab']),
            successFn: this.successFn
        }
        share(shareParams)
        appSdk.shareConfig({
            title: shareParams.title,
            desc: shareParams.desc,
            thumbImage: shareParams.imgUrl,
            content: shareParams.shareUrl,
            success: this.successFn
        })
    }
    successFn() {
        // 分享成功日志 
        typeof _qla != 'undefined' && _qla('event', {
            category: `community-center-share`,
            action: 'success'
        });
    }
    //初始化数据
    async initData() {
        const { topic } = this.props.topic ? this.props : (await getTopic({ id: this.topicId }))
        await this.setState({
            topic
        })
        return true
    }
    // Tab的变化
    async changeTab(idx) {
        if (idx == this.state.tabIdx) return false
        this.page.page = 1
        this.state.isNoMore = false
        this.state.noData = false
        await this.props.saveListIdeaData({ page: 1, tabIdx: idx, isNoMore: false, noData: false, })
        window.loading && window.loading(true)
        await this.setState({ tabIdx: idx })
        await this.getListIdeaData()
        idx==1&&this.changeFocusNewStatus()
        idx==2&&this.changeNewStatus()
        window.loading && window.loading(false)
        if (this.ctMain.getBoundingClientRect().top < 0) {
            await this.ctMain ?.scrollIntoView({ block: "start" })
            const {scrollTop}=this.props.listIdeaObj 
            document.getElementById('scrolling-box').scrollTop = scrollTop+0.5
        }
        
        // 手动触发打曝光日志
        typeof _qla != 'undefined' && _qla.collectVisible();
        return true
    }
    //获取话题
    async getTopic() {
        const { topic } = await getTopic({ id: this.topicId })
        await this.setState({
            topic
        })
        return true
    }
    async getListIdeaData() {
        let res 
        if(this.state.tabIdx == 1){
            res = await getListFocusIdea({  ...this.page,  source: 'ufw' })
        }else{
            res = await getListIdea({  ...this.page,  source: 'ufw', selected: this.state.tabIdx == 0 ? 'Y' : '' })
        }
        const { dataList = [] } = res
        if (!!dataList) {
            if (dataList.length >= 0 && dataList.length < this.page.size) {
                this.setState({
                    isNoMore: true
                })
                await this.props.saveListIdeaData({ isNoMore: true })
            }
            await this.setState({
                listIdeaData: this.page.page > 1 ? [...this.state.listIdeaData, ...dataList] : dataList
            })

            if (!this.state.listIdeaData || this.state.listIdeaData.length == 0) {
                this.setState({
                    noData: true
                })
                await this.props.saveListIdeaData({ noData: true })
            }
            await this.props.saveListIdeaData({ listIdeaData: this.state.listIdeaData })
        }
        return true
    } 
    //获取关注状态
    async getFocusListIdeaNewData() {
        if(this.state.tabIdx==1)return false
        const { dataList=[] } = await getListFocusIdea({page:1,size:1, source: 'ufw', selected: '',unLike:true })
        const recentFocusIdeaId = localStorage.recentFocusIdeaId
        await this.setState({ 
            hasFocusNew:dataList?.length>0&&(!recentFocusIdeaId||dataList[0]?.id!=recentFocusIdeaId)
        })
    }
    //修改关注状态
    changeFocusNewStatus(){
        const {listIdeaData=[]}=this.state
        localStorage.recentFocusIdeaId=listIdeaData[0]?.id
        this.setState({ 
            hasFocusNew:false
        })
    }
    
    //获取最新状态
    async getListIdeaNewData() {
        if(this.state.tabIdx==2)return false
        const { dataList=[] } = await getListIdea({page:1,size:1, source: 'ufw', selected: '',unLike:true })
        const recentIdeaId = localStorage.recentIdeaId
        await this.setState({ 
            hasNew:dataList?.length>0&&(!recentIdeaId||dataList[0]?.id!=recentIdeaId)
        })
    }
    //修改最新状态
    changeNewStatus(){
        const {listIdeaData=[]}=this.state
        localStorage.recentIdeaId=listIdeaData[0]?.id
        this.setState({ 
            hasNew:false
        })
    }
    async focusSuccess(id) {
        const { listIdeaData } = this.state
        listIdeaData.map((item, index) => {
            if (item.userId == id) {
                item.isFocus = 'Y'
            }
        })
        await this.setState({
            listIdeaData
        })
    }

    async loadNext(next) {
        this.page.page++
        await this.props.saveListIdeaData({ page: this.page.page })
        await this.getListIdeaData()
        next && next();
    }

    //获取优秀校友权重前十的数据
    async queryListHomeStudent(){
        const {menuNode} = await getMenuNode({nodeCode:"QL_NZDX_SY_RMHT_YXXY"}) 
        this.setState({
        })
        const {dataList=[]}=await getListHomeStudent({
            userId:this.ideaUserId,
            businessId:'',
            source:'ufw'
        }) 
        this.setState({
            studentTopList:dataList,
            excellentNodeMsg:menuNode
        })
        this.props.saveListIdeaData({excellentNodeMsg:menuNode,studentTopList:dataList})
    }
    
    //根据目标的id获取目标的状态：followId目标的id,index目标处于数组的下标
    async handlerSingleStudentInfo(followId,index){
        getSingleStudentInfo({
            source:'ufw',
            followId:followId,
            userId:this.ideaUserId
        }).then(({data}) => {
            let changeData = [...this.state.studentTopList]
            changeData[index] = data.dto
            this.setState({
                studentTopList:changeData
            })
        })
    }

    @throttle(1500)
    onScrollHandle() {
        let scrollTop = document.getElementById('scrolling-box') ?.scrollTop
        this.handleScroller(scrollTop)
        this.props.saveListIdeaData({ scrollTop })
    }

    handleScroller(scrollTop) {
        if(scrollTop > this.wdWidth && !this.state.isShowGuide && !this.state.isOnce) {
            this.setState({
                isShowGuide: true,
                isOnce: true
            })
        }
    }

    hideGuide() {
        let guideNumb = JSON.parse(localStorage.getItem('guideNumb') || 0)
        localStorage.setItem('guideNumb', (Number(guideNumb) + 1))
        this.setState({
            targetCls:'protal-box-end'
        },() => {
            setTimeout(() => {
                this.setState({
                    targetCls:'',
                    isShowGuide: false
                })
            },2500)
        })
    }

    initLike(ideaId) {
        let isAdd = false
        const { listIdeaData } = this.props.listIdeaObj
        listIdeaData.map((item, index) => {
            if (item.id == ideaId && !isAdd) {
                item.likedNum = parseFloat(item.likedNum) + 1
                item.isLike = 'Y'
                isAdd = true
            }
            return item
        })
        setTimeout(() => {
            this.props.saveListIdeaData({ listIdeaData })
        }, 100)
    }

    initCollect(ideaId,isAdd){ 
        const {listIdeaData}=this.props.listIdeaObj
        listIdeaData.map((item,index)=>{
            if(item.id==ideaId){
                item.collectNum=isAdd?parseFloat(item.collectNum)+1:parseFloat(item.collectNum)-1
                item.isCollected=isAdd?'Y':"N" 
            }
            return item
        }) 
        setTimeout(()=>{
            this.props.saveListIdeaData({listIdeaData})
        },100)
    }
    async deleteIdea(id) {
        window.simpleDialog({
            title: null,
            msg: '确认将此想法删除?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            className: '',
            onConfirm: async () => {
                const res = await deleteIdea({ id })
                const { listIdeaData } = this.state
                const index = listIdeaData.findIndex((item, index) => {
                    return item.id == id
                })
                listIdeaData.splice(index, 1)
                if (listIdeaData.length > 3) {
                    await this.setState({
                        listIdeaData: [...listIdeaData]
                    })
                } else {
                    this.page.page = 1;
                    this.state.listIdeaData = [];
                    await this.getListIdeaData();
                }
                setTimeout(() => {
                    this.getTopic();
                    this.props.saveListIdeaData({ listIdeaData })
                }, 1000)
            },
            onCancel: () => {
            },
        })
    }
    componentWillUnmount(){
        this.timer&&clearInterval(this.timer)
    }
    appGo() {
        const { targetUrl } = this.state;
        this.handleGoApp(targetUrl)
    }
    appGoCamp(e) {
        e.preventDefault();
        e.stopPropagation();
        const { campObj } = this.state
        this.handleGoApp(campObj.targetUrl)
    }
    handleGoApp(targetUrl) {
        const { isQlchat } = this.props
        const params = {}
        if(isQlchat) {
            params.aos = 'projectAds_community_campAds'
        }
        const url = fillParams(params, targetUrl)
        this.props.handleAppSecondary(url, {
            entry: {
                "target": "webpage12",
                "webUrl": url
            }
        })
    }
    render() {
        const { topic, listIdeaData = [], isNoMore, noData, tabIdx, hasNew,hasFocusNew,isShowGuide, campObj,targetCls } = this.state;
        const {studentInfo, rmht, listTopicData, isQlchat,handleAppSecondary } = this.props
        const eleCon = document.getElementById('community-center-container')
        return (
            <Page title={'女子大学社区'} className="community-center-page">
                <ScrollToLoad
                    id="scrolling-box"
                    className={`cc-scroll-box ch-scroll-box ${this.isTab == 'Y' ? 'cen-btm' : ''}`}
                    toBottomHeight={300}
                    noMore={isNoMore}
                    disable={noData}
                    loadNext={this.loadNext}
                    scrollToDo={this.onScrollHandle}
                >
                    <div id="community-center-container" className="community-center-container">
                        <div className="cc-head">
                            <div className={ `cc-head-bg ${ isQlchat ? 'max-width' : '' }` }>
                                <Picture src={ isQlchat ? 'https://img.qlchat.com/qlLive/activity/image/B2858FJL-6S8K-L96B-1573820232001-66OJ21M9E1G7.png' : 'https://img.qlchat.com/qlLive/business/V1TAUCT1-UXE6-XZNR-1569810570946-KYLFNLUAZR3X.png'} resize={{ w: 750, h: 488 }} />
                            </div>
                            {
                                studentInfo?.studentNo&&
                                <div className="community-center-container-home on-visible on-log" 
                                    data-log-name="我的主页"
                                    data-log-region="community-center-container-home"
                                    data-log-pos="0"  
                                    onClick={()=>{
                                        handleAppSecondary(`/wechat/page/university/community-home`) 
                                    }}>
                                    <img src="https://img.qlchat.com/qlLive/business/JONN5KI5-9ZY4-48YW-1574861024360-LISLPQIL3V5V.png"/> 我的主页
                                </div>
                            }
                        </div>
                        <div className="cc-main">
                            <ListTopic
                                isToMore
                                isTitle={true}
                                title={'热门话题'}
                                decs={'期待与你一起交流'}
                                listTopicData={listTopicData}
                                childHandleAppSecondary={handleAppSecondary} />
                                {
                                    this.state.excellentNodeMsg && this.state.excellentNodeMsg.status === 'Y' && this.state.studentTopList.length > 0 && 
                                    <ExcellentAlumni
                                        currentUserId={this.ideaUserId}
                                        excellentNodeMsg={this.state.excellentNodeMsg}
                                        studentTopList={this.state.studentTopList}
                                        handlerSingleStudentInfo={this.handlerSingleStudentInfo}
                                        childHandleAppSecondary={handleAppSecondary}
                                    />
                                }
                            <div ref={r => this.ctMain = r}>
                                <TabNav
                                    tabs={[`精选`, `<div class="${hasFocusNew?'cc-new-icon':''}">关注</div>`, `<div class="${hasNew?'cc-new-icon':''}">最新</div>`]}
                                    changeTab={this.changeTab}
                                    tabIdx={parseFloat(tabIdx)}
                                    className={`un-community-center-tab-nav ${isQlchat&&this.isApp?'app':''}`}
                                    logs={'un-community-center-tab-nav'} />
                                {
                                    listIdeaData ?.length > 0 ?
                                        listIdeaData.map((item, index) => {
                                            return <IdeaItemUserinfo
                                                isShowTopic
                                                deleteIdea={this.deleteIdea}
                                                hideTopDel
                                                initLike={this.initLike}
                                                initCollect={this.initCollect}
                                                isRouter
                                                {...this.props}
                                                key={index}
                                                isShowClick
                                                isGuest
                                                ideaInfo={ item }
                                                {...item}
                                                initShare={this.initShare}
                                                focusSuccess={this.focusSuccess} 
                                                childHandleAppSecondary={handleAppSecondary}/>
                                        })
                                        : ''
                                }
                                {
                                    tabIdx!=1&&noData && eleCon && createPortal(<EmptyStatus text="暂无想法" />, eleCon)
                                }
                                {
                                    tabIdx==1&&noData && eleCon && createPortal(
                                        <div className="ch-idea-empty">
                                            <div className="ch-idea-to-share">{`把好想法写下来和大家分享一下吧~`}</div> 
                                            <div className="ch-idea-to-edit on-visible on-log" 
                                                data-log-name="去关注"
                                                data-log-region="un-community-go-attendtion"
                                                data-log-pos="0" 
                                                onClick={()=>{locationTo(`/wechat/page/community/excellent-person`)}}>去关注 <i className="iconfont iconxiaojiantou"></i></div> 
                                        </div> 
                                        , eleCon)
                                }
                            </div>    
                        </div>
                    </div>
                </ScrollToLoad> 
                <div className={this.isTab == 'Y' ? 'cc-with-tab' : ''}>
                    {
                        studentInfo?.classNo?
                        <ChToEdit region='un-community-center-edit'/>
                        :
                        <div className="cc-to-join  on-log on-visible" 
                            data-log-name='了解大学'
                            data-log-region="un-community-center-konw-university"
                            data-log-pos="0"  
                            onClick={this.appGo}>
                            <Lottie
                                options={{
                                    path: 'https://media.qlchat.com/qlLive/activity/file/EQD8386K-BLOR-TZ16-1570502887952-FRU5JPMIP1VR.json',
                                    autoplay: true
                                }} 
                            />
                        </div>
                    }
                </div>
                {
                    !isQlchat && Object.is(this.isTab, 'Y') &&
                    (
                        <TabBar
                            activeTab='university'
                            isMineNew={false}
                            isMineNewSession={"N"} />
                    )
                }
                { isShowGuide && !!campObj && (
                    <PortalComp className={ `un-community-guide ${targetCls} ${ this.isTab ? 'max-tab' : '' }` } onClick={ this.hideGuide }>
                        <img onClick={this.appGoCamp} src={ campObj.iconUrl } alt=""/>
                    </PortalComp>
                ) }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: getVal(state, 'common.sysTime'), 
    studentInfo: state.community?.communityCenter?.studentInfo,
    rmht: state.community?.communityCenter?.rmht,
    listTopicData: state.community?.communityCenter?.listTopicData,
    listIdeaObj: state.community?.listIdeaObj
});

const mapActionToProps = {
    saveListIdeaData
};

module.exports = connect(mapStateToProps, mapActionToProps)(CommunityCenter);