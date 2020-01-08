import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import { getCookie, locationTo} from 'components/util'; 
import IdeaContent from './idea-item-content'
import IdeaClick from './idea-item-click'
import CommunityUserinfo from '../community-userinfo'
import ShareClick from './share-click'
import IdeaItemToggle from './idea-item-toggle'
import IdeaItemDel from './idea-item-userinfo-del'
import {addLikeNum} from 'components/like-share'

@autobind
export default class extends Component {
    state = {
        needShowTips:false,
        tips:''
    }
   
    get userId(){
        return getCookie('userId','')
    }
    componentDidMount() {
        
    }
    componentWillUnmount(){
         
    }
      
    //处理点赞引导分享
    handleLikeShare(){
        let [needShowTips,tips] = addLikeNum()
        if(needShowTips){
            this.setState({
                needShowTips:needShowTips,
                tips:tips
            },() => {
                setTimeout(() => {
                    this.setState({
                        needShowTips:false,
                        tips:''
                    })
                },2000)
            })
        }
    }
     
    render() {
        const {id,userId,unLink, desc,topicDto,isShowTopic, resource,cardDate, likedUserNameList,likeStatus,selected,  key,className,addClick,isHideTime,logName,logRegion,logPos,isShowClick,deleteIdea, status, ...otherProps} = this.props 
        const {needShowTips, tips} = this.state
        if(status=='D'){
            console.log(status)
            return (
                <IdeaItemDel {...this.props}/>
            )
        }
        return (
            <div className={classnames(`idea-item-userinfo on-visible on-log`,className)}
                data-log-name={desc}
                data-log-region={'un-community-topic-idea-lists'}
                data-log-pos={ id } 
                onClick={(e)=>{
                    e.stopPropagation();
                    this.props.childHandleAppSecondary&&this.props.isQlchat?
                    this.props.childHandleAppSecondary(`/wechat/page/university/community-detail?ideaId=${id}&isRouter=Y`)
                    :
                    !unLink&& this.props.router.push(`/wechat/page/university/community-detail?ideaId=${id}&isRouter=Y`)}
                }
            >  
                <CommunityUserinfo {...this.props} userId={userId}/>  
                
                {
                    selected=='Y'&&<div className="idea-item-jing"><img src={'https://img.qlchat.com/qlLive/business/ULGXELZS-EXSN-O3W8-1569233614537-I825ISRT9EUE.png'}/></div>
                } 
                <div>
                    <IdeaContent {...otherProps} />  
                </div>
                
                {
                    isShowTopic&&topicDto?.name&&
                    <div className="idea-d-topic on-visible on-log" 
                        data-log-name={topicDto?.name}
                        data-log-region={'un-community-idea-topic'}
                        data-log-pos={ topicDto?.id } 
                        onClick={(e)=>{
                            e.stopPropagation();
                            this.props.childHandleAppSecondary?
                            this.props.childHandleAppSecondary(`/wechat/page/university/community-topic?topicId=${topicDto?.id}`)
                            :
                            locationTo(`/wechat/page/university/community-topic?topicId=${topicDto?.id}`)
                        }}> 
                        <div className="idea-d-topic-content"> <i className="iconfont iconhuati"></i>{topicDto?.name}</div>
                    </div>
                }
                
                {
                    isShowClick&&
                    <div className="idea-d-top" onClick={(e) => {e.stopPropagation();e.preventDefault();}}> 
                        <IdeaClick 
                            id={id}
                            userId={userId}
                            addClick={addClick} 
                            isHideTime={isHideTime}
                            cardDate={cardDate}
                            likeStatus={likeStatus}
                            likedUserNameList={likedUserNameList}
                            logName={logName+'点赞'}
                            logRegion={logRegion+'-click'}
                            logPos={logPos}
                            handleLikeShare={this.handleLikeShare}
                            {...otherProps}
                        /> 
                        
                        {
                            userId==this.userId&&deleteIdea?
                            <IdeaItemToggle  {...this.props}/>
                            :
                            <ShareClick className="idea-d-share-guest" needShowTips={needShowTips} tips={tips} {...this.props} hideNum/>
                        } 
                    </div>
                }
            </div>
            
        )
    }
}

