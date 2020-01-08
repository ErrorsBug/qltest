import React, { Component } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import { getCookie, locationTo} from 'components/util'; 
import IdeaContent from './idea-item-content'
import IdeaClick from './idea-item-click'
import CommunityUserinfo from '../community-userinfo'
 
@autobind
export default class extends Component {
   
    get userId(){
        return getCookie('userId','')
    }
    
    render() {
        const {id,checkInId, userId,unLink, desc,topicDto,isShowTopic, resource,cardDate, likedUserNameList,likeStatus,selected,  key,className,addClick,isHideTime,logName,logRegion,logPos,isShowClick,deleteIdea,...otherProps} = this.props 
        return (
            <div className={classnames(`idea-item-userinfo`,className)}>  
                <CommunityUserinfo {...this.props} checkInId={ checkInId } userId={userId}/>  
                {
                    selected=='Y'&&<div className="idea-item-jing"><img src={'https://img.qlchat.com/qlLive/business/ULGXELZS-EXSN-O3W8-1569233614537-I825ISRT9EUE.png'}/></div>
                } 
                <div 
                    className="on-visible on-log" 
                    data-log-name={desc}
                    data-log-region={'un-community-topic-idea-lists'}
                    data-log-pos={ checkInId || id  }>
                    <IdeaContent {...otherProps} />  
                </div>
                {
                    isShowTopic&&topicDto?.name&&
                    <div className="idea-d-topic on-visible on-log" 
                        data-log-name={topicDto?.name}
                        data-log-region={'un-community-idea-topic'}
                        data-log-pos={ topicDto?.id } 
                        onClick={()=>{
                            this.props.childHandleAppSecondary?
                            this.props.childHandleAppSecondary(`/wechat/page/university/community-topic?topicId=${topicDto?.id}`)
                            :
                            locationTo(`/wechat/page/university/community-topic?topicId=${topicDto?.id}`)
                        }}> 
                        <div className="idea-d-topic-content"> <i className="iconfont iconhuati"></i>{topicDto?.name}</div>
                    </div>
                }
            </div>
        )
    }
}

