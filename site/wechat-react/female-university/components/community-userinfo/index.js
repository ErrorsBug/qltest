import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';   
import { formatDate, getCookie, locationTo } from 'components/util';
import { communityFocus } from '../../actions/community'
import { isStudent } from "../../actions/community";
import Picture from 'ql-react-picture' 
import TimeFormat from '../time-format'

@TimeFormat
@autobind
export default class extends PureComponent{ 
    state={
        isFocus:'Y'
    }
    componentDidMount = () => {   
    }; 
    
    get userId(){
        return getCookie('userId','')
    }

    render() {   
        const {id, checkInId, userId,isFocus,userName,headImgUrl, userHeadImg, createTime,calDay,sysTime,isRouter,deleteIdea,hideTopDel,isQlchat, checkInCount} = this.props
        return (
            <Fragment>
                <div className="communi-userinfo on-visible on-log" 
                    data-log-name={userName}
                    data-log-region={'un-community-avator'}
                    data-log-pos={ userId } 
                    onClick={()=>{
                        isRouter&&!isQlchat?
                            locationTo(`/wechat/page/university/community-home?studentId=${userId}`)
                        : this.props.childHandleAppSecondary?
                            this.props.childHandleAppSecondary(`/wechat/page/university/community-home?studentId=${userId}`)
                        : locationTo(`/wechat/page/university/community-home?studentId=${userId}`)
                    }
                    }>
                    <div className="userinfo-avator">
                        <Picture src={headImgUrl || userHeadImg || ''} resize={{w:100,h:100}}/>
                    </div>
                    <div className="userinfo-right">
                        <div className="userinfo-name">{userName}</div> 
                        <div className="userinfo-time">
                            <span>{calDay(createTime,sysTime)}</span>
                            <span>打卡{checkInCount}次</span>
                        </div> 
                    </div>
                    {
                        userId == this.userId&&deleteIdea&&!hideTopDel && (
                            <div className="idea-d-del on-visible on-log" 
                                data-log-name={'删除想法'}
                                data-log-region="un-community-idea-del"
                                data-log-pos={ '0' }
                                onClick={(e)=>{e.stopPropagation(); deleteIdea(checkInId || id)}}>删除</div>
                        )
                    } 
                </div>
            </Fragment>
        )
    }
}
