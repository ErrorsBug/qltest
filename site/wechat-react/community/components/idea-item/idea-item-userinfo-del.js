import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import { getCookie, locationTo} from 'components/util';  
import CommunityUserinfo from '../community-userinfo' 
 

@autobind
export default class extends Component {
    state = {
        
    }
   
    get userId(){
        return getCookie('userId','')
    }
    componentDidMount() {
        
    }
    componentWillUnmount(){
         
    }
      
     
    render() {
        const {id,userId,removeCollect,logName,logRegion,logPos,logIndex} = this.props 
        return (
            <div className="idea-item-del">
                <CommunityUserinfo {...this.props} userId={userId}/>  
                <div className="idea-item-del-content">
                    <div className="idea-item-del-text">该条收藏的想法已被删除</div>
                    {
                        userId==this.userId&&
                        <div className="idea-item-del-btn on-visible on-log" 
                            data-log-name={logName}
                            data-log-region={logRegion+'-del'}
                            data-log-pos={ logPos }
                            data-log-index={ logIndex }
                            onClick={(e)=>{e.stopPropagation(); removeCollect&&removeCollect(id)}}> 移除</div>
                    }
                </div>
                
            </div>
        )
    }
}

