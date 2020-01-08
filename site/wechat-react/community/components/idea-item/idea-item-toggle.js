import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'  
import ShareClick from './share-click'
 
@autobind
export default class extends Component {
    state = {
        
    }
   
    componentDidMount() {
         
    }
    componentWillUnmount(){
         
    }
      
     
    render() {
        const {isShowToggle} = this.state
        const {id,userId,isGuest,deleteIdea,selected, desc, resource,createTime,topicDto, likedUserNameList,likeStatus, formatIdeaTime, key,className,addClick,isHideTime,logName,logRegion,logPos,logIndex,...otherProps} = this.props 
        return (
            <div className="idea-d-toggle on-visible on-log" 
                data-log-name={logName}
                data-log-region={logRegion+'-toggle'}
                data-log-pos={ logPos }
                data-log-index={ logIndex }
                onClick={(e)=>{e.stopPropagation(); this.setState({isShowToggle:true})}}>
                    <img src="https://img.qlchat.com/qlLive/business/JY12PHFJ-YJBT-GBOR-1574651707571-T1ONSXM7461A.png"/>
                    { 
                        isShowToggle&&
                        <Fragment>
                            <div className="idea-d-right-container"> 
                                <div className="idea-d-right-item on-visible on-log" 
                                    data-log-name={logName}
                                    data-log-region={logRegion+'-del'}
                                    data-log-pos={ logPos }
                                    data-log-index={ logIndex }
                                    onClick={(e)=>{e.stopPropagation();this.setState({isShowToggle:false}); deleteIdea&&deleteIdea(id)}}> 
                                    <i className="iconfont iconshanchu"></i>删除
                                </div> 
                                <ShareClick {...this.props} hideNum content="分享"/>
                            </div>
                            <div className="idea-d-right-container-bg" onClick={(e)=>{e.stopPropagation(); this.setState({isShowToggle:false})}} onTouchMove={(e)=>{e.stopPropagation(); this.setState({isShowToggle:false})}}> </div>
                        </Fragment>
                    }
            </div> 
        )
    }
}

