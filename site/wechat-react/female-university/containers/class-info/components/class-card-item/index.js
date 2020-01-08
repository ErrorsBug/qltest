import React from 'react'
import { locationTo, imgUrlFormat } from 'components/util';
import CardContent from '../../../../components/card-item-content'
import CardClick from '../../../../components/card-item-click'
import { getCookie } from '../../../../../components/util';

const ClassCardItem = ({id, desc, resource, isHideTime, cardDate,likeStatus,likedUserNameList, userId ,userHeadImgUrl,userName, key }) =>{ 
    const toFlag =() =>{  
        if(getCookie('userId')==userId){
            locationTo(`/wechat/page/flag-home`)
            return 
        }
        locationTo(`/wechat/page/flag-other?flagUserId=${userId}`)
    }
    return (
        <div className="class-card-item">
            <div className="cci-avator on-log on-visible" 
                            data-log-name='个人头像'
                            data-log-region="class-info-learn-avator"
                            data-log-pos="0"  onClick={ () =>  toFlag() }>
                <img src={ imgUrlFormat(userHeadImgUrl || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_130,w_130','/0') } />
            </div>
            <div className="cci-card-info">
                <div className="cci-name"  onClick={ () =>  toFlag() }>{ userName||'昵称' } </div>   
                <CardContent
                    desc={desc}
                    resource={resource} 
                    maxLine={6}
                    logName={'学习动态打卡'}
                    logRegion={'class-info-content'}
                    logPos={1}
                /> 
                <CardClick
                    id={id}
                    userId={userId} 
                    isHideTime={isHideTime}
                    cardDate={cardDate}
                    likeStatus={likeStatus}
                    likedUserNameList={likedUserNameList} 
                    logName={`学习动态点赞`}
                    logRegion={`class-info-click`}
                    logPos={1}
                /> 
            </div>
        </div>
    )
}

export default ClassCardItem