
import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'
import { locationTo, formatDate } from 'components/util'
import LnCourseLimit from './limit'
import ApplyUserList from '../apply-user-list'
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom'

@autobind
export default class extends Component {
    state = {  
        isShowTip:false
    }  
     

    componentDidMount() { 
        
    } 
    showTip(){
        this.setState({isShowTip:true})
    }
    close(){
        this.setState({isShowTip:false})
    }
    render() {
        const {isShowTip}=this.state
        const {title,name, collectStatus, signupStartTime,signupEndTime, startTime, endTime,studentLimit,signUpNum, isShowExperi} = this.props
        
        const flag = Object.is(collectStatus, 'Y')
        const time = new Date().getTime()
        return (
            <div className={`ln-course-bottom`}>
                <h3><span>第{name}期</span>{title}</h3>
                {
                    <div className="ln-course-play">
                        <div> 报名时间：{formatDate(signupStartTime, 'MM/dd hh:mm')} - {formatDate(signupEndTime, 'MM/dd hh:mm')}</div>
                        {
                            isShowExperi&&<div className="ln-course-experi-time" onClick={this.showTip}>报名提醒</div>
                        }
                    </div>
                }
                <div className="ln-course-start-time"> 
                    <span className="ln-course-dx">带学时间: {formatDate(startTime, 'MM/dd')} - {formatDate(endTime, 'MM/dd')} </span>
                    <div  className="ln-course-start-num">
                        {
                            !isShowExperi?
                            <LnCourseLimit>{studentLimit}</LnCourseLimit>
                            :
                            <Fragment>
                                <LnCourseLimit text={`限${{studentLimit}}人，仅剩 `}>{studentLimit-signUpNum}</LnCourseLimit>
                                <ApplyUserList className={`ln-course-user`} {...this.props} isHideUserCount/>
                            </Fragment>
                        }
                    </div>
                </div>
                {
                    createPortal(
                        <MiddleDialog 
                            show={isShowTip  }
                            onClose={this.close}
                            className={"ln-course-dialog"}>
                                <div className="ln-course-dialog-close"><i className="iconfont iconxiaoshanchu"></i></div>
                                <div className="ln-course-dialog-title">长按扫码，添加报名提醒</div>
                                <div className="ln-course-dialog-tip">开始报名前10分钟，我们将通过公众号提醒你</div>
                                <div className="ln-course-dialog-qrcode"><img src="https://img.qlchat.com/qlLive/business/5O18Y6WJ-KKHS-XAGH-1572960441301-Z7JLN9PDNSNN.jpg"/></div>
                        </MiddleDialog> 
                    ,document.getElementById('app'))
                }
            </div>
        )
    }
}

