import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';   
import { formatDate, locationTo } from 'components/util';
import Picture from 'ql-react-picture' 
 
 
 

@autobind
export default class extends PureComponent{
     
     
    componentDidMount = () => {  
    };
        
    render() {  
        const {userId, userName,headImgUrl,createTime,isGuest} = this.props
        return (
            <Fragment>
                <div className="communi-userinfo" onClick={()=>locationTo(`/wechat/page/university/community-home?studentId=${userId}`)}>
                    <div className="userinfo-avator">
                    <Picture src={headImgUrl||''} resize={{w:100,h:100}}/>
                    </div>
                    <div className="userinfo-right">
                        <div className="userinfo-name">{userName}</div> 
                        <div className="userinfo-time">赞了{isGuest?'TA':'你'}的想法</div> 
                    </div>
                    <div className="userinfo-time">{formatDate(createTime,'yyyy/MM/dd hh:mm')}</div> 
                </div> 
            </Fragment>
        )
    }
}
