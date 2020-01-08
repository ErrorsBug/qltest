import React from 'react'
import { locationTo,getCookie } from 'components/util';
import { getUrlParams } from 'components/url-utils';
import { excellentAlumniFocus, excellentAlumniUnfocus} from '../../../../actions/community'


let _handlerSingleStudentInfo = null
/**
 * handleFocus:处理点击取消关注/已关注/相互关注逻辑处理
 * params:e：事件；currentType（当前状态）:true已经关注，false未关注；targetId：关注/取关用户的id
 * desc:当前未关注调用关注，当前关注就调用取消关注，处理完成后重新渲染列表
 */
let handleFocus = (e, currentType, targetId,zIndex) => {
    e.preventDefault()
    e.stopPropagation()
    const userId = getUrlParams('studentId','')|| getCookie('userId')
    let requestParams = {
        source:'ufw',
        followId:targetId,
        userId:userId,
    }
    if(currentType){
        excellentAlumniUnfocus(requestParams).then(() => {
            window.toast("取消成功")
            _handlerSingleStudentInfo(targetId,zIndex)
        })
    }else{
        excellentAlumniFocus(Object.assign(requestParams,{ notifyStatus:'Y'})).then(res => {
            window.toast("关注成功")
            _handlerSingleStudentInfo(targetId,zIndex)
        })
    }
}



function FanInfo({userId,userHeadImg,userName,userTagList,fansNum,likedNum,isFocus,mutualFocus,handlerSingleStudentInfo,zIndex,verified}) {
    _handlerSingleStudentInfo = handlerSingleStudentInfo //用于重新渲染列表
    // const decs = userTagList && userTagList.map((item) => item.name) || []
    // const itemId=isFans?followerId:followId
    const isMine=userId==getCookie('userId','') 
    return (
        <div className="fan-info-item">
            <div className="fan-info-cont on-log on-visible"
                data-log-name={ "关注粉丝" }
                data-log-region={"community-excellent-person-avator"}
                data-log-pos={ userId }
                onClick={()=>locationTo(`/wechat/page/university/community-home?studentId=${userId}`)}
                >
                <div className="fan-info-pic">
                    <div className="fan-info-pic-center">
                        <img src={ userHeadImg } />
                        {
                            verified && <i className="iconfont iconguanfang"></i>
                        }
                    </div>
                </div>
                <div className="fan-info-intro">
                    <h4>{ userName }</h4>
                    <p>
                        {userTagList && userTagList.filter((item,i) => i < 2 ).map(ele => ele.name).join(',')}
                    </p>
                    { <span><i>{fansNum || 0}粉丝</i><i>{likedNum || 0}获赞</i></span> }
                </div>
            </div>
            {
                !isMine && 
                <div className={ `on-log on-visible fan-info-status ${  !Object.is(isFocus, 'Y') ? 'no' : '' }` }  
                    data-log-region={"community-excellent-person-attendtion"}
                    data-log-pos={ userId }
                    onClick={ (e) => {
                        handleFocus(e, Object.is(isFocus, 'Y'), userId,zIndex);
                } }>
                    {  !Object.is(isFocus, 'Y') && <em className="iconfont icontianjia"></em> } 
                    { Object.is(mutualFocus, 'Y') ? '相互关注': Object.is(isFocus, 'Y') ? '已关注' : '关注' }
                </div>
            }
        </div>
    )
}

export default FanInfo