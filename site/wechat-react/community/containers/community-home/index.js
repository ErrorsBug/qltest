import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { autobind , throttle} from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad'; 
import ChHead from './components/ch-head'; 
import ChBeGoodAt from './components/ch-be-good-at'; 
import ChPersonalImage from './components/ch-personal-image'; 
import ChIdeaList from './components/ch-idea-list';   
import ChCollectTopicList from './components/ch-idea-list/collect-topic';  
import TipDialog from '../../components/tip-dialog';  
import ChToEdit from '../../components/ch-to-edit';  
import ChToCommunity from '../../components/ch-to-community';  
import ChToUniversity from '../../components/ch-to-university';  
import EmptyStatus from '../../components/empty-status';  
import { getUrlParams, fillParams } from 'components/url-utils';
import { formatMoney, locationTo ,formatDate, getCookie} from 'components/util'; 
import PosterDialog from '../../components/poster-dialog/idea';   
import { communityCards, ideaCards} from '../../components/idea-card'  
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit';
import Detect from "components/detect";
import { getStudentInfo } from "../../actions/home";
import { getUfwUserInfo,getFocusStatus,getListIdea,communityFocus,communityUnfocus,isStudent,updateNotifyStatus,deleteIdea,collList,collCancel } from "../../actions/community";
import PubSub from 'pubsub-js'
import AppEventHoc from '../../components/app-event' 
import HandleAppFunHoc from 'components/app-sdk-hoc'
import { share } from 'components/wx-utils';
import { getWxConfig,bindAppKaiFang } from '../../actions/common';
import appSdk from 'components/app-sdk'; 
import RollingDownNav from 'components/rolling-down-nav'
import Switch from 'components/switch/index'; 
import IdeaItemUserinfo from '../../components/idea-item/idea-item-userinfo';
import Picture from 'ql-react-picture';

const ChUserinfo=({userId,headImgUrl,userName,verified,fansNum,focusNum,likedNum,communityCards,isGuest,attention,isAttention,isAttentionTip})=>{
    return (
        <div className="ch-userinfo">
            <Picture className="ch-avator" onClick={()=>{!isGuest&&locationTo('/wechat/page/university/my-file?showEdit=Y')}} src={headImgUrl}  resize={{w:100,h:100}}/>
            <div className="chu-btn">
                {
                    isGuest?
                        isAttention?
                        <div className="chu-btn-share on on-visible on-log" 
                            data-log-name="已关注"
                            data-log-region="un-community-unattention"
                            data-log-pos="0" 
                            onClick={attention}>已关注</div>
                        :
                        <div className="chu-btn-share on-visible on-log" 
                            data-log-name="关注"
                            data-log-region="un-community-attention"
                            data-log-pos="0" 
                            onClick={attention}>
                                <i className="iconfont icontianjia"></i> 关注
                                {
                                    isAttentionTip&&
                                    <div className="attention-tip">
                                        <img src="https://img.qlchat.com/qlLive/business/44IIUMXR-2DP6-VF4J-1568620759056-FLHSCMMCFMXQ.png" />
                                    </div>
                                }
                        </div>
                    :
                    <div className="chu-btn-change on-visible on-log" 
                        data-log-name="修改资料"
                        data-log-region="community-home-userinfo-update"
                        data-log-pos="0" 
                        onClick={()=>{locationTo('/wechat/page/university/my-file?showEdit=Y')}}> 修改资料</div>
                }
                <div className="chu-btn-file on-visible on-log" 
                    data-log-name="档案"
                    data-log-region="un-community-file"
                    data-log-pos="0" 
                    onClick={
                        ()=>{
                            isStudent(()=>{
                                isGuest?
                                locationTo(`/wechat/page/university/my-file?studentId=${userId}`)
                                :
                                locationTo(`/wechat/page/university/my-file`)
                            })
                        }
                }>档案</div>
            </div>
            <div className="chu-name">{userName}</div>
            {
                verified&&<div className="chu-certify"><i className="iconfont iconguanfang"></i> {verified}</div>
            } 
            <div className="chu-fans-list">
                <div className="chu-fans-item">{likedNum||0}获赞</div>
                <div className="chu-fans-item on-visible on-log" 
                    data-log-name="粉丝"
                    data-log-region="un-community-fans"
                    data-log-pos="0" 
                    onClick={()=>{
                        isStudent(()=>{ 
                            !isGuest?
                            locationTo(`/wechat/page/university/fan-attention?tabIdx=0`)
                            :
                            locationTo(`/wechat/page/university/fan-attention?tabIdx=0&userId=${userId}`)
                        })
                    }}>{fansNum||0}粉丝</div>
                <div className="chu-fans-item on-visible on-log" 
                    data-log-name="关注"
                    data-log-region="un-community-attend"
                    data-log-pos="0" 
                    onClick={()=>{
                        isStudent(()=>{ 
                            !isGuest?
                            locationTo(`/wechat/page/university/fan-attention?tabIdx=1`)
                            :
                            locationTo(`/wechat/page/university/fan-attention?tabIdx=1&userId=${userId}`)
                        })
                    }}>{focusNum||0}关注</div>
            </div>
        </div>
    )
}

@HandleAppFunHoc 
@AppEventHoc 
@autobind
class CommunityHome extends Component {
    state = {
        studentInfo:{},
        ufwUserInfoDate:{},
        focusStatus:{},
        listData:[],
        isCommunityFirst:false,
        isShowTi:false, 
        flagHelpListData:{},
        shareId:'', 
        upNumber:0,
        isShowProcess:false, 
        isShowType:"", 
        isShowRecard:false,  
        showCashIndex:2,
        recardDate:'',
        showCashType:'',
        isShowFail: false,
        isShowWithdraw:false,
        scrolling:false,
        isAttention:false,
        isAttentionTip:false,
        isMore: false,
        hei: 0
    }   
    page={
        page:1,
        size:20
    }
    isLoading = false;
    get ideaUserId(){
        return getUrlParams('studentId','')||getCookie('userId')
    }
    get isGuest(){  
        return getCookie('userId')!=this.ideaUserId
    }
    async componentWillMount() {
        
        this.initConfig()
        await this.initData();
        if(this.isGuest){
            this.getFocusStatus()
        }else{
            this.getCommunityFirst()
        }  
        this.getListIdeaData() 
        this.initShare()
        bindAppKaiFang()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('fh-scroll-box');
        PubSub.subscribe('tags', (key, tags) => {
            const {ufwUserInfoDate} = this.state
            ufwUserInfoDate.userTagList = tags;
            this.setState({
                ufwUserInfoDate: ufwUserInfoDate
            })
        })
        PubSub.subscribe('saveIdea', () => {
            this.page.page = 1;
            this.state.listData = [];
            this.setState({
                isMore: false
            })
            this.getListIdeaData(true);
        })
    }
    componentDidUpdate(){
        document.querySelector('.co-dialog-container')&&limitScrollBoundary(document.querySelector('.co-dialog-container')) 
    }
    async initShare() {
        const { studentInfo } = this.state
        const params = { 
            wcl:'university_community_share',
            studentId:studentInfo?.userId
        }
        const shareParams={
            title:`${studentInfo?.userName}的个人主页`,
            desc:studentInfo?.hobby,
            timelineDesc:studentInfo?.hobby,
            imgUrl:studentInfo?.headImgUrl||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            shareUrl:fillParams(params,location.href,['']),
            successFn:  this.successFn
        } 
        share(shareParams)
        
        appSdk.shareConfig({
            title:`${studentInfo?.userName}的个人主页`,
            desc:studentInfo?.hobby,
            thumbImage: studentInfo?.headImgUrl||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            content:fillParams(params,location.href,['']),
            success:this.successFn
        }) 
        
    }
    async initConfig(){
        let config = await this.props.getWxConfig(); 
        var apiList = ['checkJsApi',  'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice',
            'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation',
            'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
        ]
        wx.config({...config,jsApiList: apiList });
    }
    successFn(){
        // 分享成功日志 
        typeof _qla != 'undefined' && _qla('event', {
            category:`community-home-share`,
            action:'success'
        });
        this.setState({
            isShowProcess:false, 
            isShowType:"", 
            isShowRecard:false,    
            showCashType:'',
            isShowFail: false,
        }) 
    }
    //初始化数据
    async initData() {  
        const {studentInfo}= this.props.studentInfo?this.props:(await  getStudentInfo({studentId:this.ideaUserId}))
        const getUfwUserInfoDate= await getUfwUserInfo({ideaUserId:this.ideaUserId})
        await this.setState({
            studentInfo,
            ufwUserInfoDate:getUfwUserInfoDate
        }) 
        
        return true 
    } 
    async getFocusStatus(){
        const data= await getFocusStatus({
            followId:this.ideaUserId,
            source:'ufw'
        })
        this.setState({
            focusStatus:data,
            isAttention:data.isFocus=='Y',
            isAttentionTip:data.isFocus=='N',
            isActive:data.isNotify=='Y'
        })
        if(data.isFocus=='N'){
            setTimeout(()=>{
                this.setState({ 
                    isAttentionTip:false
                })   
            },3000)
        }
        return true
    }
    async getCommunityFirst(){
        if(localStorage?.communitySecond!='Y'){
            await this.setState({
                isShowTi:true,
                isCommunityFirst:true,
                isHideFirst:localStorage?.isCommunityFirst=='Y'
            }) 
            localStorage.removeItem('isCommunityFirst')
            localStorage.communitySecond='Y'
        }
    }
    async getListIdeaData(flag){
        const {tagActive=0,collectTagActive=0} = this.state
        let dataList
        if(tagActive==0){
            const res= await getListIdea({ideaUserId:this.ideaUserId,...this.page,topicId:'',source:'ufw'})
            dataList=res?.dataList||[]
        }else if(collectTagActive==0){
            const res= await collList({collectUserId:this.ideaUserId,...this.page,type:'UNIVERSITY_COMMUNITY_IDEA',source:'ufw'})
            dataList=res?.collections||[]
        }else if(collectTagActive==1){
            const res= await collList({collectUserId:this.ideaUserId,...this.page,type:'UNIVERSITY_COMMUNITY_TOPIC',source:'ufw'})
            dataList=res?.collections||[]
        }
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isMore: true
            })
        } 
        this.page.page += 1;
        const newData = flag ? dataList : [ ...this.state.listData , ...dataList ]
        this.setState({
            listData: newData
        }) 
    } 
     
    async communityCards(){   
        const { studentInfo,ufwUserInfoDate } = this.state 
        communityCards({...studentInfo,...ufwUserInfoDate},(url)=>{
            this.setState({
                processUrl:url,
                isShowType:'community'
            },()=>{
                this.showProcess()
            })
        })
    } 
      
    colse(){
        this.setState({
            isShow: false,
        })
    }
    showProcess(){ 
        this.setState({
            isShowProcess: true,
        })
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    } 
    colseProcess(){ 
        this.setState({ 
            isShowProcess: false, 
            isShowType:''
        }) 
    }   
    //关注取消关注
    async attention(followId){
        if(!this.state.isAttention){ 
            await communityFocus({
                source:'ufw',
                notifyStatus:'Y',
                followId:this.ideaUserId
            })
            try {
                let wHeight=document.documentElement.clientHeight
                let bHeight=document.querySelector('.ch-main')?.offsetTop+document.querySelector('.ch-idea-list')?.offsetTop+50
                if(wHeight<bHeight){
                    this.listBox.scrollIntoView(true)
                }
            }catch(err) {}
        }else{
            await communityUnfocus({
                source:'ufw', 
                followId:this.ideaUserId
            }) 
        }
        await this.getFocusStatus()
        this.setState({
            isShowTi:this.state.isAttention,
        }) 
    }
    closeShowTi(){
        this.setState({
            isShowTi:false,
            isCommunityFirst:false,
        })
    }

    async loadNext(next) {
        if(this.isLoading || this.state.isMore) return false;
        this.isLoading = true;
        await this.getListIdeaData();
        this.isLoading = false;
        next && next();
    }
    async deleteIdea(id){
        window.simpleDialog({
            title: null,
            msg: '确认将此想法删除?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            className: '',
            onConfirm: async () => {  
                const res= await deleteIdea({id})
                const {listData} =this.state
                const index = listData.findIndex((item,index)=>{
                    return item.id==id
                })
                listData.splice(index,1)
                if(listData.length>3){
                    await this.setState({
                        listData:[...listData]
                    }) 
                }else{
                    this.page.page = 1;
                    this.state.listData = [];
                    await this.getListIdeaData();
                }
            },
            onCancel: ()=>{ 
            },
        })  
    } 
     
    
    async removeCollect(businessId){
        window.simpleDialog({
            title: null,
            msg: '确认将此想法移除?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            className: '',
            onConfirm: async () => {  
                let addResult = await collCancel({
                    businessId,
                    type:'UNIVERSITY_COMMUNITY_IDEA'
                });   
                if(addResult?.state?.code==0){  
                    const {listData} =this.state
                    const index = listData.findIndex((item,index)=>{
                        return item.id==businessId
                    })
                    listData.splice(index,1)
                    if(listData.length>3){
                        await this.setState({
                            listData:[...listData]
                        }) 
                    }else{
                        this.page.page = 1;
                        this.state.listData = [];
                        await this.getListIdeaData();
                    }
                }  
            },
            onCancel: ()=>{ 
            },
        })  
    } 

    async onChange(){
        await updateNotifyStatus({
            source:'ufw',
            followId:this.ideaUserId,
            notifyStatus:this.state.isActive?'N':'Y'
        })
        this.setState({
            isActive:!this.state.isActive
        })
         // 手动触发打点日志 
        typeof _qla != 'undefined' && _qla('click', {
            region:this.state.isActive?'un-community-undate-on':'un-community-undate-off',
        });
    } 
    setActive({tagActive,collectTagActive}){
        if(this.state.tagActive==tagActive&&this.state.collectTagActive==collectTagActive)return false
       
        this.state.tagActive=tagActive
        this.state.collectTagActive=collectTagActive
        this.page.page=1
        this.getListIdeaData(true)
    }
    
    async focusSuccess(id){
        const {listData} = this.state
        listData.map((item,index)=>{ 
            if(item.userId==id){
                item.isFocus='Y'
            } 
        }) 
        await this.setState({
            listData
        })
    } 
    render(){
        const {  
            studentInfo,
            ufwUserInfoDate,
            focusStatus,
            listData,
            isCommunityFirst,
            isShowTi, 
            shareId, 
            isShowProcess, 
            isShowRecard,
            processUrl, 
            showCashType,
            isShowFail, 
            isShowType,
            isShowWithdraw, 
            isMore,
            isAttention,
            isAttentionTip,
            isHideFirst,
            isActive, 
            tagActive=0, 
            collectTagActive=0,
            collectionsData=[] } = this.state;
        const {onPress,isQlchat} = this.props  
        if(studentInfo===null||!studentInfo){
            return <EmptyStatus />
        } 
        return (
            <Page title={studentInfo?.userName||''} className={`community-home-page  ${ (isAttention&&isShowTi) ? 'hides' : '' }`}>
                <ScrollToLoad
                    id="scrolling-box"
                    className={`ch-scroll-box`}
                    toBottomHeight={300} 
                    noMore={  isMore }
                    disable={listData?.length==0}
                    loadNext={this.loadNext}
                    >
                    <div id="community-home-container" className="community-home-container">
                    <ChHead  
                        {...studentInfo}
                        communityCards={this.communityCards}  
                        shareId={shareId}
                        isGuest={this.isGuest}/>
                    <div className="ch-main"  ref={ r => this.listBox = r }> 
                        <ChUserinfo 
                            {...studentInfo}
                            {...ufwUserInfoDate} 
                            communityCards={this.communityCards} 
                            isGuest={this.isGuest}
                            attention={this.attention}
                            isAttention={isAttention}
                            isAttentionTip={isAttentionTip}/>
                        <ChBeGoodAt {...studentInfo} isGuest={this.isGuest}/>
                        <ChPersonalImage  isGuest={this.isGuest} {...ufwUserInfoDate}/>
                        
                        <div className="ch-idea-list">
                            <div className="ch-idea-title">
                                <RollingDownNav
                                    scrollNode="ch-scroll-box"
                                    innerClass="ch-idea-inner"
                                    outerClass={ `ch-idea-outer ${ tagActive==1 ? 'max-height' : '' }` }>
                                    <div className="ch-idea-total">
                                        <div className="ch-idea-tag">
                                            <div>
                                                <p 
                                                    className={`on-visible on-log ${tagActive==0?"action":""}`} 
                                                    data-log-name={ "想法" }
                                                    data-log-region={"community-home-tab-idea"}
                                                    data-log-pos={ 0 }
                                                    onClick={()=>{this.setActive({tagActive:0,collectTagActive})}}>想法</p>
                                                <p 
                                                    className={`on-visible on-log ${tagActive==1?"action":""}`} 
                                                    data-log-name={ "收藏" }
                                                    data-log-region={"community-home-tab-collect"}
                                                    data-log-pos={ 0 }
                                                    onClick={()=>{this.setActive({tagActive:1,collectTagActive})}}>收藏</p>
                                            </div>
                                            { this.isGuest && isAttention && (
                                                <div className="ch-idea-tip">
                                                    新想法提醒 <Switch className={ ` on-visible on-log ${isShowTi?'show-tip':''}`} active={isActive} size={'sm'} onChange={this.onChange}/>
                                                </div>)
                                            }
                                        </div>
                                        {
                                            tagActive==1&&
                                            <div className="ch-idea-collect">
                                                <div className="ch-collect-tag">
                                                    <span 
                                                        className={`on-visible on-log ${collectTagActive==0?"action":""}`} 
                                                        data-log-name={ "想法" }
                                                        data-log-region={"community-home-tab-collect-idea"}
                                                        data-log-pos={ 0 }
                                                        onClick={()=>{this.setActive({tagActive,collectTagActive:0})}}>想法</span>
                                                    <span 
                                                        className={`on-visible on-log ${collectTagActive==1?"action":""}`} 
                                                        data-log-name={ "话题" }
                                                        data-log-region={"community-home-tab-collect-topic"}
                                                        data-log-pos={ 0 }
                                                        onClick={()=>{this.setActive({tagActive,collectTagActive:1})}}>话题</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </RollingDownNav>
                            </div> 
                            {
                                tagActive==0&&
                                <ChIdeaList 
                                    {...this.props}
                                    {...studentInfo} 
                                    {...focusStatus} 
                                    isAttention={isAttention} 
                                    isShowTi={isShowTi}
                                    isGuest={this.isGuest} 
                                    lists={listData} 
                                    initLike={this.initData} 
                                    initShare={this.initShare}
                                    deleteIdea={this.deleteIdea}/>
                            } 
                            {
                                tagActive==1&&collectTagActive==0&&
                                <Fragment>
                                    {    
                                        listData&&listData.length>0?
                                        <div className="ch-i-details">
                                            {
                                                listData.map((item,index)=>{  
                                                    return <IdeaItemUserinfo
                                                        {...this.props}
                                                        {...studentInfo} 
                                                        {...focusStatus} 
                                                        ideaInfo={ item }
                                                        isAttention={isAttention} 
                                                        isShowTi={isShowTi}
                                                        isGuest={this.isGuest}  
                                                        initLike={this.initData} 
                                                        initShare={this.initShare}
                                                        deleteIdea={this.deleteIdea}
                                                        focusSuccess={this.focusSuccess}
                                                        removeCollect={this.removeCollect}
                                                        isShowClick
                                                        isShowTopic
                                                        hideTopDel
                                                        key={index}
                                                        isHideTime={true}
                                                        logName={item.text}
                                                        logRegion={`un-community-idea`}
                                                        logPos={item.id}
                                                        logIndex={index}
                                                        {...item} 
                                                    />  
                                                })
                                            } 
                                        </div>   
                                        :
                                        document.getElementById('community-home-container')&&createPortal(<EmptyStatus text="暂无收藏想法"/>,document.getElementById('community-home-container')) 
                                    } 
                                </Fragment> 
                            }
                            {
                                tagActive==1&&collectTagActive==1&&
                                <ChCollectTopicList lists={listData}/>  
                            }
                        </div> 
                    </div>
                    {/* <div className="ch-no-more">没有更多了</div> */}
                    </div>
                </ScrollToLoad> 
                <ChToUniversity initClick={()=>{ isStudent(()=>{
                    locationTo('/wechat/page/university/home')
                }) }}/>
                {
                    this.isGuest?
                    <ChToCommunity initClick={()=>{ isStudent(()=>{
                        locationTo('/wechat/page/university/community-home')
                    }) }}/>
                    :
                    <ChToEdit/>
                } 
                
                {
                    isCommunityFirst&& isShowTi&&
                    <TipDialog showTi={this.closeShowTi}>
                        {
                            !isHideFirst?
                            <div className="ch-first-visity-prev" onClick={(e)=>{e.stopPropagation(); this.setState({isHideFirst:true})}}>
                                <div className="ch-first-visity">
                                    <div><img src='https://img.qlchat.com/qlLive/business/4O6GANUK-6KCT-I2NG-1567997143019-7BSSGEODIL9Q.png'/></div>
                                    <div className="ch-first-text">欢迎来到你的个人主页！在这里记录你的好想法吧~</div>
                                </div>
                            </div>
                            :
                            <Fragment> 
                                <div className="chh-share chh-change" > 
                                    <img src="https://img.qlchat.com/qlLive/business/9ALOYTM1-DBJD-MF13-1574650250881-8SO6TYOB5248.png"/> 
                                </div>
                                <div className="ch-first-visity-next">
                                    <div><img src='https://img.qlchat.com/qlLive/business/I4O7EEBJ-VGGR-K47Y-1574648868719-WL3U4G2BM8UQ.png'/></div> 
                                </div> 
                            </Fragment>
                        }
                    </TipDialog>
                }
                {
                    isAttention&&isShowTi&& 
                    <TipDialog showTi={this.closeShowTi}>
                        <div className="ch-attention">
                            <div className="ch-attention-text">关注成功，TA一旦有新动态我们会马上通知你，如果不需要可以选择关闭~</div>
                            <div className="ch-attention-img"><img src='https://img.qlchat.com/qlLive/business/CVN8JSRB-7511-RJQZ-1567998370835-5AMNSJXQ3P4F.png'/></div>
                        </div>
                    </TipDialog>
                }
                <PosterDialog 
                    isShow={ isShowProcess } 
                    imgUrl={processUrl}
                    on={1}
                    close={ this.colseProcess }
                    className={isShowType}
                    children={
                        <div>
                            <img src={processUrl}/>
                        </div>
                    }
                    />
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = { 
    getWxConfig
};

module.exports = connect(mapStateToProps, mapActionToProps)(CommunityHome);