import React, { Component } from 'react';
import { createPortal } from 'react-dom'
import { connect } from 'react-redux';
import { autobind , throttle} from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';  
import ChToEdit from '../../components/ch-to-edit';  
import EmptyStatus from '../../components/empty-status'; 
import IdeaItemUserinfo from '../../components/idea-item/idea-item-userinfo'; 
import { getUrlParams, fillParams } from 'components/url-utils';
import { getVal, locationTo ,formatDate} from 'components/util';    
import { getTopic,getListIdea,saveListIdeaData,isStudent,deleteIdea, collIsCollected, collAdd,collCancel} from "../../actions/community";  
import AppEventHoc from '../../components/app-event' 
import HandleAppFunHoc from 'components/app-sdk-hoc'
import { share } from 'components/wx-utils';
import PubSub from 'pubsub-js' 
import ChIdeaEmpty from '../../components/ch-idea-empty'
import Picture from 'ql-react-picture'
import RightBottomIcon from '../../components/right-bottom-icon';
import TabNav from '../../components/tab-nav'
import DialogBarrage from './components/dialog-barrage';
import appSdk from 'components/app-sdk';
import { BottomDialog } from 'components/dialog';
import ToggleContent from '../../components/toggle-content'
import { bindAppKaiFang } from '../../actions/common';

@HandleAppFunHoc 
@AppEventHoc 
@autobind
class CommunityTopic extends Component {
    state = {
        topic:{},
        listIdeaData:[],
        listIdeaSpecData:[],
        isNoMore:false, 
        scrolling:false,
        tabIdx: '',
        isAttention:false 
    }   
    get isGuest(){
        return true
    }
    get topicId(){
        return getUrlParams('topicId','')
    }
    page={
        page:1,
        size:20
    }
    async componentDidMount() {
        await this.initData();
        this.getListIdeaNewData()
        this.initTopicCollect()
        if (this.props.listIdeaObj.listIdeaData.length>0) {
            const {isNoMore,noData,listIdeaData,page,scrollTop,tabIdx=0}=this.props.listIdeaObj
            this.page.page=page
            await this.setState({
                isNoMore,noData,listIdeaData,tabIdx
            })
            document.getElementById('scrolling-box').scrollTop=scrollTop
            this.getListIdeaSpecData()
        } else {
            window.loading&&window.loading(true) 
            const dataList= await this.getListIdeaSpecData()
            this.state.tabIdx=dataList?.length>0?0:1 
            this.props.saveListIdeaData({tabIdx: this.state.tabIdx})
            await this.getListIdeaData()
            window.loading&&window.loading(false) 
        }
        this.initShare()
        bindAppKaiFang()
        
        PubSub.subscribe('saveIdea', () => {
            this.page.page = 1; 
            this.state.isNoMore=false
            this.state.noData=false 
            this.state.listIdeaData=[]
            this.state.tabIdx=1
            this.props.saveListIdeaData({tabIdx: this.state.tabIdx,page : 1,isNoMore:false,noData:false,listIdeaData:[]})
            this.getListIdeaData(true);
            this.changeNewStatus()
            setTimeout(()=>{ 
                this.getTopic();
            },1000)
        })
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('fh-scroll-box');
    } 
    
    //获取最新状态
    async getListIdeaNewData() {
        if(this.state.tabIdx==1)return false
        const { dataList=[] } = await getListIdea({page:1,size:1, source: 'ufw',topicId:this.topicId, selected: '',unLike:true })
        const recentTopicIdeaId = localStorage.recentTopicIdeaId
        await this.setState({ 
            hasNew:dataList?.length>0&&(!recentTopicIdeaId||dataList[0]?.id!=recentTopicIdeaId)
        }) 
    }
    //修改最新状态
    changeNewStatus(){
        const {listIdeaData=[]}=this.state
        localStorage.recentTopicIdeaId=listIdeaData[0]?.id
        this.setState({ 
            hasNew:false
        })
    }
    initShare() {
        const { topic={} } = this.state
        const params = { 
            wcl:'university_community_share' 
        }
        const shareParams={
            title:topic.name,
            desc:topic.introduction,
            timelineDesc:topic.introduction,
            imgUrl:topic.imgUrl||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            shareUrl: fillParams(params,location.href,['']),
            successFn:  this.successFn
        } 
        share(shareParams)
        appSdk.shareConfig({
            title:topic.name,
            desc:topic.introduction,
            thumbImage: topic.imgUrl||'https://img.qlchat.com/qlLive/business/4LDUXDWT-WF5G-XN7I-1559616097538-33174BF2MIXE.png',
            content:fillParams(params,location.href,['']),
            success:this.successFn
        }) 
    }
    successFn(){
        // 分享成功日志 
        typeof _qla != 'undefined' && _qla('event', {
            category:`community-topic-share`,
            action:'success'
        });
    }
    //初始化数据
    async initData() {
        const {topic}= this.props.topic?this.props:(await getTopic({id:this.topicId}))
        await this.setState({
            topic
        }) 
       return true  
    } 
    // Tab的变化
    async changeTab(idx) { 
        if(idx==this.state.tabIdx)return false
        this.changeNewStatus()
        this.page.page=1 
        this.state.isNoMore=false
        this.state.noData=false 
        await this.props.saveListIdeaData({page:1,tabIdx: idx,isNoMore:false,noData:false,})
        window.loading&&window.loading(true) 
        await this.setState({tabIdx: idx}) 
        await this.getListIdeaData()
        window.loading&&window.loading(false) 
        if(this.ctMain.getBoundingClientRect().top<0){
            this.ctMain?.scrollIntoView({block : "start"})
        }
        // 手动触发打曝光日志
        typeof _qla != 'undefined' && _qla.collectVisible();
        return true
    }
    //获取话题
    async getTopic() {
        const {topic}= await getTopic({id:this.topicId})
        await this.setState({
            topic
        }) 
       return true  
    } 
    async getListIdeaData(){ 
        const {dataList=[]}= await getListIdea({ideaUserId:this.ideaUserId,...this.page,topicId:this.topicId,source:'ufw',selected:this.state.tabIdx==0?'Y':''})
        if(!!dataList){
            if(dataList.length >= 0 && dataList.length < this.page.size){
                this.setState({
                    isNoMore: true
                }) 
                await this.props.saveListIdeaData({isNoMore:true})
            }   
            await this.setState({
                listIdeaData:this.page.page>1?[...this.state.listIdeaData,...dataList]:dataList
            })
             
            if(!this.state.listIdeaData||this.state.listIdeaData.length==0){
                this.setState({
                    noData:true
                })
                await this.props.saveListIdeaData({noData:true})
            } 
            await this.props.saveListIdeaData({listIdeaData:this.state.listIdeaData}) 
        }  
        return true
    }
    //获取精选
    async getListIdeaSpecData(){
        const {dataList}= await getListIdea({ideaUserId:this.ideaUserId,...this.page,topicId:this.topicId,source:'ufw',selected:'Y'})
        await this.setState({
            listIdeaSpecData:dataList
        })
        return dataList
    }
    async focusSuccess(id){
        const {listIdeaData} = this.state
        listIdeaData.map((item,index)=>{ 
            if(item.userId==id){
                item.isFocus='Y'
            } 
        })
        await this.setState({
            listIdeaData
        })
    } 
    
    async loadNext(next) { 
        this.page.page++
        await this.props.saveListIdeaData({page:this.page.page})
        await this.getListIdeaData()
        next && next();
    }
    
    @throttle(1500)
    onScrollHandle() { 
        let scrollTop= document.getElementById('scrolling-box')?.scrollTop
        this.props.saveListIdeaData({scrollTop}) 
    } 

    initLike(ideaId){
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
                const {listIdeaData} =this.state
                const index = listIdeaData.findIndex((item,index)=>{
                    return item.id==id
                })
                listIdeaData.splice(index,1)
                if(listIdeaData.length>3){
                    await this.setState({
                        listIdeaData:[...listIdeaData]
                    }) 
                }else{
                    this.page.page = 1;
                    this.state.listIdeaData = [];
                    await this.getListIdeaData();
                }
                setTimeout(()=>{
                    this.getTopic();
                    this.props.saveListIdeaData({listIdeaData})
                },1000)
            },
            onCancel: ()=>{ 
            },
        })  
    } 
    toggleClick(){
        this.setState({
            isShowToggle:!this.state.isShowToggle
        })
    }
    //初始收藏
    async initTopicCollect() {  
        const {isCollected} = await collIsCollected({
            businessId:this.topicId ,
            type:'UNIVERSITY_COMMUNITY_TOPIC' 
        })
        await this.setState({
            isCollected 
        }) 
        return true
    }
    /**
     * 收藏
     */
    async addCollect(){ 
        if(this.isload){return false}
        this.isload=true
        if(this.state.isCollected!=='Y'){  
            let addResult = await collAdd({
                businessId:this.topicId ,
                type:'UNIVERSITY_COMMUNITY_TOPIC' 
            });   
            if(addResult?.state?.code!=0){  
                this.isload=false
                return
            } 
            window.toast(`收藏成功`) 
            await this.setState({ 
                isCollected:'Y', 
            })  
        }else{
            let addResult = await collCancel({
                businessId:this.topicId ,
                type:'UNIVERSITY_COMMUNITY_TOPIC' 
            });   
            if(addResult?.state?.code!=0){  
                this.isload=false
                return
            } 
            window.toast(`取消成功`) 
            await this.setState({ 
                isCollected:'N', 
            }) 
            
        }
 
        this.isload=false
    } 
    render(){
        const {   topic,listIdeaData=[] ,isNoMore ,noData,tabIdx,listIdeaSpecData,isShowToggle, isCollected, hasNew } = this.state;
        const {onPress,isQlchat} = this.props 
        if(topic===null||!topic||topic.status=='N'){
            setTimeout(()=>{
                locationTo('/wechat/page/university/home')
            },3000)
            return <EmptyStatus text="话题已下架"/>
        }
         
        const eleCon =  document.getElementById('community-topic-container')
        return (
            <Page title={topic?.name} className="community-topic-page">
                <ScrollToLoad
                    id="scrolling-box"
                    className={`ct-scroll-box ch-scroll-box`}
                    toBottomHeight={300}  
                    noMore={ isNoMore }
                    disable={noData}
                    loadNext={this.loadNext}
                    scrollToDo={this.onScrollHandle}
                    >
                        
                    {
                        listIdeaSpecData?.length>0&&<DialogBarrage listIdeaSpecData={listIdeaSpecData}/>
                    }
                    {
                        <div className="community-topic-collect on-log on-visible"
                            data-log-name={'话题收藏'}
                            data-log-region={'community-topic-collect'}
                            data-log-pos={0}  
                            onClick={this.addCollect}>
                            <i className={`iconfont ${isCollected=='Y'?'iconyishoucang':'iconshoucang'}`}></i>
                        </div>
                    }
                    <div id="community-topic-container" className="community-topic-container">
                        <div className="ct-head"> 
                            <div  className="ct-head-bg"> 
                                <Picture src={topic?.imgUrl||''} resize={{w:750,h:750}}/>
                            </div> 
                            <div className={`ct-head-content ct-head-bgcolor${parseFloat(this.topicId)%8}`}>
                                <div className="ct-head-title"><i className="iconfont iconhuati"></i> {topic?.name}</div>
                                <div className="ct-head-num">
                                    <div className="ct-num-item"> {topic?.viewNum}浏览</div>
                                    <div className="ct-num-item"> {topic?.userNum}次互动</div>
                                    <div className="ct-num-item"> {topic?.ideaNum}条想法</div>
                                    <div className="ct-num-item ct-topic-center" onClick={()=>{locationTo(`/wechat/page/university/community-list-topic`)}}> 话题广场<i className="iconfont iconxiaojiantou"></i></div>
                                </div>
                                {
                                    topic?.introduction&&<ToggleContent  
                                        className={`ct-head-intro-container${parseFloat(this.topicId)%8}`}
                                        maxLine={2}  
                                        children={
                                            <span className={`ct-head-intro`}
                                                dangerouslySetInnerHTML={{ __html: topic?.introduction?.replace(/\n/g,'<br/>') }}
                                            ></span>
                                        }
                                    /> 
                                } 
                                
                            </div>
                        </div> 
                        <div className="ct-main"  ref={ r => this.ctMain = r }>  
                        {
                            
                        }
                        <TabNav 
                            tabs={[`精选`,`<div class="${hasNew&&tabIdx!=1?'cc-new-icon':''}">最新</div>`]} 
                            changeTab={this.changeTab} 
                            tabIdx={parseFloat(tabIdx) } 
                            logs={'community-detail-tab-nav'}/>      
                        {
                            listIdeaData?.length>0?
                            listIdeaData.map((item,index)=>{ 
                                return <IdeaItemUserinfo 
                                        logRegion={'un-community-topic-list-idea'}
                                        deleteIdea={this.deleteIdea}
                                        hideTopDel
                                        initLike={this.initLike}
                                        initCollect={this.initCollect}
                                        isRouter
                                        ideaInfo={ item }
                                        {...this.props} 
                                        key={index} 
                                        isShowClick 
                                        isGuest 
                                        {...item} 
                                        initShare={this.initShare}
                                        focusSuccess={this.focusSuccess}/>
                                })
                            :''
                        }
                        {
                            noData&&tabIdx==1&&eleCon&&createPortal(<ChIdeaEmpty text="大家都还没发表想法哦~" {...topic}/>,eleCon)  
                        }
                        {
                            noData&&tabIdx==0&&eleCon&&createPortal(<EmptyStatus text="暂无精选"/>,eleCon)
                        }
                    </div>
                    </div>
                </ScrollToLoad>
                <div className="ct-to-toggle">
                    <RightBottomIcon initClick={this.toggleClick}>
                        <div className="cl-td-icon on-visible on-log" 
                            data-log-name="菜单悬浮icon"
                            data-log-region="un-community-topic-float-icon"
                            data-log-pos={0}>
                            <Picture src={"https://img.qlchat.com/qlLive/business/9GVWR7CJ-JC12-LBU4-1570527146165-9OZ6IRXR98FJ.png"} /> 
                        </div> 
                    </RightBottomIcon>  
                </div>
                <ChToEdit {...topic}/>
  
                
                <BottomDialog
                    show={isShowToggle}
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    buttons={null}
                    close={true} 
                    className={`ct-bottom-toggle`}
                    onClose={this.toggleClick}>
                        <div className="ctb-list">
                            <div className="ctb-item on-visible on-log" 
                                data-log-name="社区首页"
                                data-log-region="un-community-topic-to-center"
                                data-log-pos={0} 
                                onClick={()=>{locationTo(`/wechat/page/university/community-center`)}}>
                                <div className="ctb-icon">
                                    <img src="https://img.qlchat.com/qlLive/business/M11PZO66-TG1C-GRDH-1570531200445-2U2X4RKYTQZL.png"/>
                                </div>
                                社区首页
                            </div>
                            <div className="ctb-item on-visible on-log" 
                                data-log-name="我的主页"
                                data-log-region="un-community-topic-to-home"
                                data-log-pos={0}   
                                onClick={()=>{isStudent(()=>{
                                    locationTo('/wechat/page/university/community-home')
                                })}}>
                                <div className="ctb-icon">
                                    <img src="https://img.qlchat.com/qlLive/business/639BMXOO-JSXY-3DQ3-1570531195964-ME4RTLZRY9TH.png"/>
                                </div>
                                我的主页
                            </div>
                        </div>
                        <div className="ctb-cancle" onClick={this.toggleClick}>取消</div>
                </BottomDialog>     

                
                   
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: getVal(state,'common.sysTime'),
    topic:state.community.topic,
    listIdeaObj:state.community.listIdeaObj
});

const mapActionToProps = { 
    saveListIdeaData
};

module.exports = connect(mapStateToProps, mapActionToProps)(CommunityTopic);