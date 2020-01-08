import React, { Component } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import { formatMoney, locationTo ,formatDate, imgUrlFormat} from 'components/util'; 
import IdeaContent from './idea-item-content'
import IdeaClick from './idea-item-click'
import TimeFormat from '../time-format' 

@TimeFormat
@autobind
export default class extends Component {
    state = {
        
    }
   
    componentDidMount() {
         
    }
    componentWillUnmount(){
         
    }
      
     
    render() {
        const {id,userId,isGuest,deleteIdea,selected, desc, resource,createTime,topicDto, likedUserNameList,likeStatus, formatIdeaTime, key,className,addClick,isHideTime,logName,logRegion,logPos,logIndex,...otherProps} = this.props 
        return (
            <div className={classnames(`idea-d-item`,className)}> 
                <div
                    className="on-visible on-log" 
                    data-log-name={logName}
                    data-log-region={logRegion}
                    data-log-pos={ logPos }
                    data-log-index={ logIndex }
                    onClick={()=>{ locationTo(`/wechat/page/university/community-detail?ideaId=${id}`)}}> 
                    <div className="idea-d-title">{
                        formatIdeaTime(createTime)
                    }</div>
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
                        onClick={()=>locationTo(`/wechat/page/university/community-topic?topicId=${topicDto?.id}`)}> 
                        <div className="idea-d-topic-content"> <i className="iconfont iconhuati"></i>{topicDto?.name}</div>
                    </div>
                }
                
                <div className="idea-d-top"> 
                    <IdeaClick  
                        {...this.props}
                        id={id}
                    /> 
                    {
                        !isGuest&&
                        <div className="idea-d-del on-visible on-log" 
                            data-log-name={logName}
                            data-log-region={logRegion+'-del'}
                            data-log-pos={ logPos }
                            data-log-index={ logIndex }
                            onClick={(e)=>{e.stopPropagation(); deleteIdea&&deleteIdea(id)}}>删除</div>
                    }
                    
                </div>

            </div>
            
        )
    }
}

