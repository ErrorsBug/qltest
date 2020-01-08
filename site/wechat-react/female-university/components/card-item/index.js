import React, { Component } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import { formatMoney, locationTo ,formatDate, imgUrlFormat} from 'components/util'; 
import CardContent from '../card-item-content'
import CardClick from '../card-item-click'
 

@autobind
export default class extends Component {
    state = {
        
    }
   
    componentDidMount() {
        
    }
    componentWillUnmount(){
         
    }
      
    
    //是否今天
    isToday(str) {
        if (new Date(str).toDateString() === new Date().toDateString()) {
            return true
        }  
        return false
    } 
    render() {
        const {id,userId, desc, resource,cardDate, likedUserNameList,likeStatus, shareDay, key,className,addClick,isHideTime,logName,logRegion,logPos} = this.props
        return (
            <div className={classnames(`fhl-d-item${this.isToday(cardDate)?" on":""}`,className)}>
                {
                    shareDay&&
                    <span className="fhl-share-ico on-log on-visible" 
                        data-log-name='每日打卡'
                        data-log-region="un-flag-mine-text"
                        data-log-pos="0"
                        data-log-index={key}
                        onClick={()=>shareDay(cardDate)}></span>
                }
                <div className="fhl-d-title">{
                    this.isToday(cardDate)?
                    <span className="on">今天</span>
                    :
                    formatDate(cardDate,'yyyy年MM月dd日')
                }</div>
                <CardContent
                    desc={desc}
                    resource={resource} 
                    maxLine={6}
                    logName={logName+'打卡'}
                    logRegion={logRegion+'-content'}
                    logPos={logPos}
                /> 
                <CardClick
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
                /> 

            </div>
            
        )
    }
}

