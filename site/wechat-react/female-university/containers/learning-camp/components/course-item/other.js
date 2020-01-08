
import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import Picture from 'ql-react-picture'
import { locationTo, formatDate } from 'components/util' 
import DialogCourseConfirm from '../../../../components/dialog-course-confirm';
import LnCourseLimit from '../../../../components/ln-course-info/limit'
import {studyCampStatus} from '../../../../actions/home'
 

@autobind
export default class extends Component {
    state = {  
    }  
     
    componentDidMount() { 
        
    } 
     
    render() { 
        const { type,groupUrl,sysTime, id, idx,handleAppSdkFun,reservationSuccess,reservationNum,  title,name, studyCampConfigDto={}, signupStartTime,signupEndTime, startTime, endTime,studentLimit=0,signUpNum=0, isShowExperi } = this.props
        let status=studyCampStatus({...this.props})
        return (
            <div className="ln-course-item" >
            <div>
                {
                    status=='B' &&<img className="ln-course-item-img" src="https://img.qlchat.com/qlLive/business/TFIHMIKR-HMPO-N44F-1572870118402-UFJR1LAX72P5.png" /> 
                }
                {
                    status=='C' && <img className="ln-course-item-img ln-course-item-end" src="https://img.qlchat.com/qlLive/business/VOV5UJIZ-HM23-9MCV-1572870844630-VW9FUS75U3ZL.png" />
                }
                 <div className="ln-course-pic"><Picture src={studyCampConfigDto?.imageUrl} placeholder={true} resize={{ w: 670, h: 420 }} /></div>
                <div className={ `ln-course-bottom` }>
                    
                    <h3><span>第{name}期</span>{studyCampConfigDto?.title}</h3>
                    <div className="ln-course-start-time">
                        <span className="ln-course-dx">
                            带学时间: { formatDate(startTime, 'MM/dd') } - { formatDate(endTime, 'MM/dd') }
                        </span>
                    </div>
                    <div className="camp-intro-join">
                        {
                            type=='direct'?
                            <LnCourseLimit>{studentLimit}</LnCourseLimit>
                            :
                            <LnCourseLimit text={type=='direct'?'限':'预约名额 '}>{reservationNum}</LnCourseLimit>
                        }
                        <DialogCourseConfirm 
                            className="ln-course-btn on-log on-visible"
                            data-log-name="立即报名"
                            data-log-region="un-camp-intro-join-show"
                            data-log-pos="0" 
                            handleAppSdkFun={handleAppSdkFun}
                            reservationSuccess={reservationSuccess}
                            campInfo={this.props}> 
                            {type=='direct'?'马上报名':'预约报名'}
                        </DialogCourseConfirm>
                    </div>
                </div>
            
            </div>
        </div>
    
        )
    }
} 