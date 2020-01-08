import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';   
import { formatDate, getCookie, locationTo } from 'components/util';
import { communityFocus } from '../../actions/community'
import { isStudent } from "../../actions/community";
import Picture from 'ql-react-picture' 
import TimeFormat from '../time-format'
import ShowQrcode from '..//show-qrcode'

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

    //关注取消关注
    async attention(followId,isFocus){
        if(isFocus!='Y'){ 
            const res= await communityFocus({
                source:'ufw',
                notifyStatus:'Y',
                followId
            }) 
            if(res?.state?.code==0){ 
                window.toast('关注成功')
                this.setState({
                    isShowQrcode:true
                })
                this.props.focusSuccess&&this.props.focusSuccess(followId)
            }
        }
    }    
    closeQrcode(){
        this.setState({
            isShowQrcode:false
        })
    }
    render() {   
        const {id,userId,isFocus,userName,headImgUrl,createTime,calDay,sysTime,isRouter,deleteIdea,hideTopDel,verify,isQlchat} = this.props
        const {isShowQrcode} = this.state
        return (
            <Fragment>
                <div className="communi-userinfo on-visible on-log" 
                    data-log-name={userName}
                    data-log-region={'un-community-avator'}
                    data-log-pos={ userId } 
                    onClick={(e)=>{
                        e.stopPropagation();
                        isRouter&&!isQlchat?
                        this.props.router.push(`/wechat/page/university/community-home?studentId=${userId}`)
                        :this.props.childHandleAppSecondary?
                        this.props.childHandleAppSecondary(`/wechat/page/university/community-home?studentId=${userId}`)
                        :locationTo(`/wechat/page/university/community-home?studentId=${userId}`)
                    }} 
                    >
                    <div className="userinfo-avator">
                        <Picture src={headImgUrl||''} resize={{w:100,h:100}}/>
                        {
                            verify&&<i className="iconfont iconguanfang"></i>
                        }
                    </div>
                    <div className="userinfo-right">
                        <div className="userinfo-name">{userName}</div> 
                        <div className="userinfo-time">{calDay(createTime,sysTime)}</div> 
                    </div>
                    {
                        userId==this.userId&&deleteIdea&&!hideTopDel?
                        <div className="idea-d-del on-visible on-log" 
                            data-log-name={'删除想法'}
                            data-log-region="un-community-idea-del"
                            data-log-pos={ '0' }
                            onClick={(e)=>{e.stopPropagation(); deleteIdea(id)}}>删除</div>
                        :userId!=this.userId&&isFocus=='N'?
                        <div className="userinfo-attendtion on-visible on-log" 
                            data-log-name={userName}
                            data-log-region={'un-community-detail-attend'}
                            data-log-pos={ userId }  
                            onClick={(e)=>{
                                e.stopPropagation();
                                this.attention(userId,isFocus)
                            }
                            }><i className="iconfont icontianjia"></i> 关注</div>
                        :''
                    } 
                </div> 
                {
                    isShowQrcode&&<ShowQrcode close={this.closeQrcode} pubBusinessId={userId}/>
                }
                
            </Fragment>
        )
    }
}
