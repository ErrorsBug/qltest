import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import ChToUniversity from '../../components/ch-to-university'; 
import IdeaUserinfo from '../../components/idea-item/idea-item-userinfo'
import CommentItem from '../../components/comment-item'
import TopicItem from '../../components/community-topic-item/detail'
import UserinfoTime from '../../components/community-userinfo/index-time'   
import EmptyStatus from '../../components/empty-status';  
import Reply from './components/reply'  
import { formatMoney, locationTo ,formatDate, getCookie, getVal} from 'components/util'; 
import { getIdea,getCommentList,getListIdeaLike,saveListIdeaData,deleteIdea,deleteComment,collIsCollected } from '../../actions/community'; 
import { getStudentInfo } from '../../actions/home'; 
import { getUrlParams } from 'components/url-utils'; 
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit'; 
import AppEventHoc from '../../components/app-event'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';
import { getWxConfig } from '../../actions/common';
import Picture from 'ql-react-picture'
import PortalCom from '../../components/portal-com'
import appSdk from 'components/app-sdk';
import ClickJson from '../../components/click-json'
import { bindAppKaiFang } from '../../actions/common';

@HandleAppFunHoc
@AppEventHoc
@autobind
class CommunityDetail extends Component {
    state = {
        communityIdea:{},
        sourceId_ListMap:{0:[]},
        commentList:[],
        listIdeaLike:[],
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
        isShowReplyInput:false,
        isStudent:false,
        isGuest:false,
        isShowLikeMore:false
    }
    detailList=null 
    get tabIdx(){
        return getUrlParams('tabIdx','') 
    }
    get ideaId(){
        return getUrlParams('ideaId','')
    }
    get userId(){
        return getCookie('userId','')
    }
    get isRouter(){
        return getUrlParams('isRouter','')
    }
    page={
        page:1,
        size:20,
    }
    commentParams={
        ideaId:this.ideaId,
        sourceIdList:["0"],
        ...this.page,
        time:new Date(2300,1,1).getTime(),
        beforeOrAfter:'before'
    }
    likeParams={
        ideaId:this.ideaId,
        sourceIdList:["0"],
        page:1,
        size:23, 
        time:new Date(2300,1,1).getTime(),
        beforeOrAfter:'before'
    }
    async componentDidMount() {
        window.loading&&window.loading(true) 
        this.initConfig()
        this.getStudentInfo()
        await this.initData(); 
        this.initShare()
        bindAppKaiFang()
        this.getListIdeaLike()
        await this.getCommentList()
        if(this.tabIdx){ 
            await this.changeTab(this.tabIdx)
            this.detailList.scrollIntoView({block : "start"})
        }   
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('fh-scroll-box');
    }
    componentDidUpdate() {
        document.querySelector('.co-dialog-container') && limitScrollBoundary(document.querySelector('.co-dialog-container'))
    }
    async getStudentInfo(){
        const {studentInfo} = await getStudentInfo()
        if(studentInfo?.studentNo){
            this.setState({
                isStudent:true
            })
        }  
    }
    async initShare() {
        const { communityIdea } = this.state
        const params = { 
            wcl:'university_community_share' 
        }  
        const shareParams={
            title:communityIdea?.text?.replace(/\n/g,'').slice(0,60),
            desc:'我在女子大学写了些想法，分享给你',
            timelineDesc:'我在女子大学写了些想法，分享给你',
            imgUrl:communityIdea.headImgUrl||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            shareUrl:fillParams(params,location.href,['tabIdx']),
            successFn:  this.successFn
        }  
        share(shareParams)
        
        appSdk.shareConfig({
            title:communityIdea.text,
            desc: '我在女子大学写了些想法，分享给你',
            thumbImage: communityIdea.headImgUrl||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            content:fillParams(params,location.href,['tabIdx','isRouter']),
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
            category:`community-detail-share`,
            action:'success'
        });
    }
    //初始化数据
    async initData() {  
        const {communityIdea} = await getIdea({
            id:this.ideaId
        })
        await this.setState({
            communityIdea,
            isGuest:communityIdea?.userId!=this.userId
        })
        window.loading&&window.loading(false) 
        return true
    } 
    async getCommentList(){
        const {sourceId_ListMap} = await getCommentList(this.commentParams) 
        if(!!sourceId_ListMap && !!sourceId_ListMap[0]){
            if(sourceId_ListMap[0].length >= 0 && sourceId_ListMap[0].length < this.commentParams.size){
                this.setState({
                    isNoMore: true
                }) 
            }   
            await this.setState({
                commentList:[...this.state.commentList,...sourceId_ListMap[0]]
            })
            if(!this.state.commentList||this.state.commentList.length==0){
                this.setState({
                    noData:true
                })
            }
            await this.getCommentListChildre(sourceId_ListMap)
        } 
        return true
    }
    async getCommentListChildre(list){
        let sourceIdList=[]
        list[0]?.map((item,index)=>{
            sourceIdList.push(item.id)
        })
        const {sourceId_ListMap} = await getCommentList({
            ideaId:this.ideaId,
            sourceIdList:sourceIdList,
            page:1,
            size:5,
            time:new Date(2300,1,1).getTime(),
            beforeOrAfter:'before'
        })
        
        await this.setState({
            sourceId_ListMap:{...this.state.sourceId_ListMap,...sourceId_ListMap}
        }) 
        return true
    } 
    async getListIdeaLike(){
        const {dataList} = await getListIdeaLike(this.likeParams)
        if(!!dataList){
            if(dataList.length >= 0 && dataList.length < this.likeParams.size){
                this.setState({
                    isNoLikeMore: true
                }) 
            }   
            await this.setState({
                listIdeaLike:[...this.state.listIdeaLike,...dataList]
            })
            if(!this.state.listIdeaLike||this.state.listIdeaLike.length==0){
                this.setState({
                    noLikeData:true
                })
            } 
        }  
        return true
    } 

 
    //关注取消关注
    attention() {
        this.setState({
            isAttention: !this.state.isAttention
        })
    }
    
    // Tab的变化
    async changeTab(idx) {
        await this.setState({tabIdx: idx}) 
        // 手动触发打曝光日志
        typeof _qla != 'undefined' && _qla.collectVisible();
        return true
    }

    
    async loadNext(next) { 
        
        const {commentList} = this.state
        let len = commentList.length
        if(commentList[len-1]?.createTime){ 
            this.commentParams.time=commentList[len-1].createTime
            await this.getCommentList()  
        }
        next && next(); 
    }
    
    async loadLikeNext(next) { 
        this.likeParams.page++
        await this.getListIdeaLike()   
        next && next();
    }
    async commentSuccess(data){  
        this.commentParams.time=new Date(2300,1,1).getTime()
        this.state.commentList=[]
        await this.getCommentList()
        this.initListIdeaObj(this.ideaId)
        this.calComment()
    } 
    calComment(flag=true){
        const {communityIdea}=this.state
        communityIdea.commentNum=parseFloat(communityIdea.commentNum||0)+(flag?+1:-1)
        this.setState({
            communityIdea
        })

    }
    async initLike(){ 
        this.likeParams.page=1
        this.state.listIdeaLike=[]
        await this.initData();
        await this.getListIdeaLike()  
        this.initLikeRedux(this.ideaId)
    }
    async focusSuccess(){
        await this.initData();
    }  
    
    initLikeRedux(ideaId){
        let isAdd=false
        const {listIdeaData}=this.props.listIdeaObj
        listIdeaData.map((item,index)=>{
            if(item.id==ideaId&&!isAdd){
                item.likedNum=parseFloat(item.likedNum)+1
                item.isLike='Y'
                isAdd=true
            }
            return item
        }) 
        setTimeout(()=>{
            this.props.saveListIdeaData({listIdeaData})
        },100)
    }
    initListIdeaObj(ideaId){
        if(!this.props.listIdeaObj)return false
        let isAdd=false
        const {listIdeaData}=this.props.listIdeaObj
        listIdeaData.map((item,index)=>{
            if(item.id==ideaId&&!isAdd){
                item.commentNum=parseFloat(item.commentNum)+1 
                isAdd=true
            }
            return item
        })  
        setTimeout(()=>{
            this.props.saveListIdeaData({listIdeaData})
        },100)
    }
    
    delListIdeaObj(){
        if(!this.props.listIdeaObj)return false
        const {listIdeaData}=this.props.listIdeaObj
        const index = listIdeaData.findIndex((item,index)=>{
            return item.id==this.ideaId
        })
        listIdeaData.splice(index,1) 
        this.props.saveListIdeaData({listIdeaData})
        return true
    }
    async deleteIdea(){
        window.simpleDialog({
            title: null,
            msg: '确认将此想法删除?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            className: '',
            onConfirm: async () => {  
                const res= await deleteIdea({id:this.ideaId})
                if(res?.state?.code!=0)return false
                await this.delListIdeaObj()
                setTimeout(()=>{
                    const {isRouter} = this.props.location.query
                    if(isRouter){
                        this.props.router.goBack()
                    }else{
                        history.back() 
                    }
                },1000)
            },
            onCancel: ()=>{ 
            },
        })  
    } 
    
    async deleteComment(commentId){
        window.simpleDialog({
            title: null,
            msg: '确认将此评论删除?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            className: '',
            onConfirm: async () => {  
                const res= await deleteComment({commentId})
                if(res?.state?.code!=0)return false
                const {commentList} = this.state
                const index = commentList.findIndex((item,index)=>{
                    return item.id==commentId
                })
                commentList.splice(index,1) 
                this.setState({
                    commentList 
                }) 
                this.calComment(false)
            },
            onCancel: ()=>{ 
            },
        })  
    } 

    //点击大赞引导分享
    handleclickJsonShare(){
        if(this.replyCom && this.replyCom.handleLikeShare){
            this.replyCom.handleLikeShare()
        }
    }

    render() {
        const {  
            communityIdea,
            sourceId_ListMap,
            commentList,
            listIdeaLike, 
            tabIdx,
            isNoMore,
            isNoLikeMore,
            isGuest,
            noData,  
            isShowLikeMore } = this.state; 
        const { onPress, isQlchat } = this.props
        if(communityIdea===null||!communityIdea||communityIdea.status=='D'){
            setTimeout(()=>{
                locationTo('/wechat/page/university/home')
            },3000)
            return <EmptyStatus text="该想法已被删除"/>
        }
        return (
            <Page title={communityIdea?.userName} className="community-detail-page">
                <ScrollToLoad
                    id="scrolling-box"
                    className={`ch-scroll-box`}
                    toBottomHeight={300}
                    noMore={ (tabIdx==0&&isNoMore)||(tabIdx==1&&isNoLikeMore) }
                    loadNext={this.loadNext} 
                >
                    <div className="ch-main">
                        <IdeaUserinfo {...communityIdea} ideaInfo={ communityIdea } maxLine={'unset'} unLink focusSuccess={this.focusSuccess} deleteIdea={this.deleteIdea}/> 
                        {
                            communityIdea?.topicDto&&<TopicItem {...communityIdea?.topicDto} handleSelectTopic={()=>{locationTo(`/wechat/page/university/community-topic?topicId=${communityIdea?.topicDto?.id}`)}} isLink/>
                        }
                        <ClickJson {...communityIdea} initLike={this.initLike} handleclickJsonShare={this.handleclickJsonShare}/> 
                        {
                            listIdeaLike?.length>0&&
                            <div className="community-avator-list">
                                    {
                                        listIdeaLike.map((item,index)=>{
                                            if(index>=23)return false
                                            return (
                                                <div className="community-avator-item" onClick={()=>{locationTo(`/wechat/page/university/community-home?studentId=${item.userId}`)}} key={index}>
                                                    <Picture src={item.headImgUrl} resize={{w:64,h:64}}/>
                                                    {
                                                        item.verify&&<i className="iconfont iconguanfang"></i>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        listIdeaLike.length>=23&&
                                        <div className="community-avator-item">
                                            <div className="community-avator-more" onClick={()=>{this.setState({isShowLikeMore:true})}}>更多</div>
                                    </div>
                                    }
                                {
                                    isShowLikeMore&&
                                        <PortalCom className="community-like-lists">
                                            <div className="community-like-blank"></div>
                                            <div className="community-like-box">
                                                <div className="community-like-header">全部点赞 <i className="iconfont iconxiaoshanchu" onClick={ ()=>{this.setState({isShowLikeMore:false})} }></i></div>
                                                <div className="community-like-items">
                                                    <ScrollToLoad
                                                        toBottomHeight={300}
                                                        disable={ isNoLikeMore }
                                                        className="community-like-scorll"
                                                        loadNext={ this.loadLikeNext }>
                                                        { listIdeaLike.map((item, index) => (
                                                            <UserinfoTime isGuest={isGuest} key={index} {...item} />
                                                        )) }
                                                        { isNoMore && <div className="community-like-more">没有更多数据</div> }
                                                    </ScrollToLoad>
                                                </div>
                                            </div>
                                        </PortalCom> 
                                }

                                </div>
                        }
                        <div className="community-detail-title">{`评论 ${communityIdea?.commentNum||0}`}</div>  
                        <div className="community-detail-list" ref={ r => this.detailList = r }>
                            { 
                                commentList?.map((item,index)=>{ 
                                    return <CommentItem calComment={this.calComment} deleteComment={this.deleteComment} isGuest={isGuest} isStudent={this.state.isStudent} sysTime={this.props.sysTime}  key={index} {...item} subList={sourceId_ListMap[item.id]||[]}/>
                                })
                            }
                            {
                                tabIdx==1&&( 
                                    listIdeaLike.map((item,index)=>{
                                        return <UserinfoTime isGuest={isGuest} key={index} {...item} />
                                    })
                                )
                            } 
                        </div>
                    </div>
                </ScrollToLoad>
                <ChToUniversity 
                        initClick={()=>{ locationTo(`/wechat/page/university/community-center`)}}
                        imgUrl="https://img.qlchat.com/qlLive/business/WO6I8XW1-8V4O-GT1E-1571020407965-PABC7DAHRGJA.png"/>
                <Reply 
                    ref={(r) =>{this.replyCom = r}}
                    {...communityIdea}
                    ideaId={this.ideaId}  
                    ideaInfo={ communityIdea }
                    parentId='0' 
                    sourceId='0'
                    commentSuccess={this.commentSuccess}
                    toggleReply={this.toggleReply} 
                    initLike={this.initLike}
                    logRegion={`un-community-idea`}
                    logPos={this.ideaId}
                    isStudent={this.state.isStudent} 
                    />   
 
                   

            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime:getVal(state,'common.sysTime'),
    communityIdea:state.community.communityIdea,
    listIdeaObj:state.community.listIdeaObj
    
});

const mapActionToProps = { 
    getWxConfig,
    saveListIdeaData
};

module.exports = connect(mapStateToProps, mapActionToProps)(CommunityDetail);