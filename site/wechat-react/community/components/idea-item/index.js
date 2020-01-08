import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import { formatMoney, locationTo ,formatDate, imgUrlFormat} from 'components/util'; 
import IdeaContent from './idea-item-content'
import IdeaClick from './idea-item-click'
import TimeFormat from '../time-format' 
import ShareClick from './share-click'
import IdeaItemToggle from './idea-item-toggle'
import {addLikeNum} from 'components/like-share'

@TimeFormat
@autobind
export default class extends Component {
    state = {
        needShowTips:false,
        tips:''
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
        const {isShowToggle,needShowTips, tips} = this.state
        const {id,userId,isGuest,deleteIdea,selected, desc, resource,createTime,topicDto, likedUserNameList,likeStatus, formatIdeaTime, key,className,addClick,isHideTime,logName,logRegion,logPos,logIndex,...otherProps} = this.props 
        return (
            <div 
                data-log-name={logName}
                data-log-region={logRegion}
                data-log-pos={ logPos }
                data-log-index={ logIndex }
                onClick={()=>{ locationTo(`/wechat/page/university/community-detail?ideaId=${id}`)}}
                className={classnames(`idea-d-item on-visible on-log`,className)}> 
                <div> 
                    <div className="idea-d-title">
                        { formatIdeaTime(createTime) }
                    </div>
                    {
                        selected=='Y'&&<div className="idea-item-jing"><img src={'https://img.qlchat.com/qlLive/business/ULGXELZS-EXSN-O3W8-1569233614537-I825ISRT9EUE.png'}/></div>
                    }
                    
                    <IdeaContent 
                        maxLine={6} 
                        {...this.props}
                        /> 
                </div>
                {
                    topicDto?.name&&
                    <div className="idea-d-topic on-visible on-log" 
                        data-log-name={topicDto?.name}
                        data-log-region={'un-community-idea-topic'}
                        data-log-pos={ topicDto?.id }
                        data-log-index={ logIndex }
                        onClick={(e)=>{e.stopPropagation();locationTo(`/wechat/page/university/community-topic?topicId=${topicDto?.id}`)}}> 
                        <div className="idea-d-topic-content"> <i className="iconfont iconhuati"></i>{topicDto?.name}</div>
                    </div>
                }
                
                <div className="idea-d-top" onClick={(e) => {e.preventDefault();e.stopPropagation();}}> 
                    <IdeaClick  
                        handleLikeShare={this.handleLikeShare}
                        {...this.props}
                        id={id}
                    /> 
                    {
                        !isGuest?
                        <IdeaItemToggle  {...this.props}/>
                        :
                        <ShareClick className="idea-d-share-guest" {...this.props} needShowTips={needShowTips} tips={tips} hideNum/>
                    }
                    
                </div>

            </div>
            
        )
    }
}

