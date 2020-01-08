import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'  
import { formatDate, locationTo } from 'components/util'; 
import { digitFormat } from '../../../components/util'; 
import { isStudent } from "../../actions/community";

@autobind
export default class extends Component {
    state = { 
        likedUserNameList:[],
        isLike:'',
        isShowClick:false,
        clickText:'',
        processUrl:'', 
        isShowProcess: false, 
        isShowType:'',
        likedNum:0
    } 
    isload=false
     

    componentDidMount() { 
        
    }
    componentWillUnmount(){
         
    } 
    toComment(id){  
        this.props.childHandleAppSecondary&&this.props.isQlchat?
        this.props.childHandleAppSecondary(`/wechat/page/university/community-detail?ideaId=${id}&tabIdx=0`)
        :
        this.props.router.push(`/wechat/page/university/community-detail?ideaId=${id}&tabIdx=0`) 
    }
    render() { 
        const {id,userId,commentNum,logName,logRegion,logPos} = this.props  
        return (
            <Fragment>
                <div className="iic-top">
                    <div 
                        data-log-name={ "想法评论" }
                        data-log-region={"un-community-idea-comment"}
                        data-log-pos={ id } 
                        onClick={()=>{isStudent(()=>{
                            this.toComment(id,userId)
                            },this.props.childHandleAppSecondary)
                        }}
                        className={`iic-item on-log on-visible`}>
                            <i className="iconfont iconpinglun"></i> 
                            {digitFormat(commentNum || 0)} 
                    </div>
                </div> 
            </Fragment>
        )
    }
}

