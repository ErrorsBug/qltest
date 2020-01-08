import React from 'react'
import { locationTo,getCookie } from 'components/util';


function FanInfo({isGuest, followerName, followerHeadImg, followerId, onFocusStatus, isFans, mutualFocus, isFocus, userTagList = [], followHeadImg, followId, followName, isShow }) {
    const decs = userTagList && userTagList.map((item) => item.name) || []

    const itemId=isFans?followerId:followId
    const isMine=itemId==getCookie('userId','') 
    return (
        <div className="fan-info-item">
            <div className="fan-info-cont on-log on-visible"
                data-log-name={ "关注粉丝" }
                data-log-region={"un-community-fan-avator"}
                data-log-pos={ itemId }
                onClick={()=>locationTo(`/wechat/page/university/community-home?studentId=${itemId}`)}
                >
                <div className="fan-info-pic"><img src={ followerHeadImg || followHeadImg } /></div>
                <div className="fan-info-intro">
                    <h4>{ followerName || followName }</h4>
                    <p>{ decs.join('、') }</p>
                    { isShow && <span><i>100粉丝</i><i>234获赞</i></span> }
                </div>
            </div>
            {
                !isMine&&
                <div className={ `on-log on-visible fan-info-status ${  !Object.is(isFocus, 'Y') ? 'no' : '' }` }  
                    data-log-pos={ itemId }
                    onClick={ (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFocusStatus(itemId, Object.is(isFocus, 'Y'));
                } }>
                    {  !Object.is(isFocus, 'Y') && <em className="iconfont icontianjia"></em> } 
                    { (Object.is(mutualFocus, 'Y')&&!isGuest) ? '相互关注': Object.is(isFocus, 'Y') ? '已关注' : '关注' }
                </div>
            }
        </div>
    )
}

export default FanInfo