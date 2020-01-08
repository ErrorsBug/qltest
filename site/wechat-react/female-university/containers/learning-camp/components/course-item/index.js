
import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import Picture from 'ql-react-picture'
import { locationTo, formatDate } from 'components/util' 
import LnCourseLimit from '../../../../components/ln-course-info/limit'
import ApplyUserList from '../../../../components/apply-user-list'
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom'
import {studyCampStatus} from '../../../../actions/home'

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
        const { imageUrl,sysTime, campId, idx,  title,name, studyCampConfigDto={}, signupStartTime,signupEndTime, startTime, endTime,studentLimit=0,signUpNum=0, hasReservationNum=0 } = this.props 
        let status=studyCampStatus({...this.props}) 
        return (
            <div className="ln-course-item" >
            <div className="on-log on-visible"
                data-log-name={title}
                data-log-region="un-list-camp"
                data-log-pos={campId}
                data-log-index={idx}
                onClick={() => locationTo(`/wechat/page/university/camp-intro?campId=${campId}`)}>
                {
                    status=='B' &&<img className="ln-course-item-img" src="https://img.qlchat.com/qlLive/business/TFIHMIKR-HMPO-N44F-1572870118402-UFJR1LAX72P5.png" /> 
                }
                {
                    status=='C' && <img className="ln-course-item-img ln-course-item-end" src="https://img.qlchat.com/qlLive/business/VOV5UJIZ-HM23-9MCV-1572870844630-VW9FUS75U3ZL.png" />
                }
                <div className="ln-course-pic"><Picture src={studyCampConfigDto?.imageUrl} placeholder={true} resize={{ w: 670, h: 420 }} /></div>
                <div className={`ln-course-bottom`}>
                <h3><span>第{name}期</span>{studyCampConfigDto?.title}</h3>
                {
                    <div className="ln-course-play">
                        <div> 报名时间：{formatDate(signupStartTime, 'MM/dd hh:mm')} - {formatDate(signupEndTime, 'MM/dd hh:mm')} (北京时间)</div>
                    </div>
                }
                <div className="ln-course-start-time"> 
                    <span className="ln-course-dx">带学时间: {formatDate(startTime, 'MM/dd')} - {formatDate(endTime, 'MM/dd')} </span>
                    <div  className="ln-course-start-num">
                        { 
                            Object.is(status, 'A') ? 
                            <LnCourseLimit>{studentLimit}</LnCourseLimit>
                            : Object.is(status, 'B') ?
                            <LnCourseLimit text={`仅剩`}>{studentLimit-signUpNum}</LnCourseLimit>
                            : Object.is(status, 'C') ? 
                            <p>已抢光</p> 
                            :''
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
            
            </div>
        </div>
    
        )
    }
} 






 