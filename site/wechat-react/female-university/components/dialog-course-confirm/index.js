import React, { PureComponent, Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';  
import { autobind, throttle } from 'core-decorators';
import { createPortal } from 'react-dom'; 
import { formatDate, locationTo, getVal, formatMoney, getCookie } from 'components/util';
import { getCampInfo, joinStudyCamp } from '../../actions/home'; 
import WillJoin from './will-join'
import { isQlchat } from 'components/envi'


@autobind
export default class extends PureComponent{
    state = { 
        isShowTip:false,
        isShowSuccess:false,
        isShowFail:false,
        studyCampPeriodDto:{},
        studyCampConfigDto:{}
    }
    
    data = { 
    }
    componentDidMount = () => {
    };  
     
    @throttle(1000)
    async joinCamp() {
        const { campInfo } = this.props;
        const res = await joinStudyCamp({ periodId: campInfo?.id,type:campInfo?.type })
        if(res.state && res.state.code == 0 ){
            // window.toast('报名成功')
            if(res?.data?.result?.msg=='SUCCESS'){
                if(campInfo?.type=='direct'){
                    if(!isQlchat()){
                        locationTo(campInfo?.groupUrl);
                    }else{
                        if(this.props.handleAppSdkFun){
                            this.props.handleAppSdkFun('sendSubscribeMessage', {
                                sendSubscribeMessage: 'join_learning_camp',
                                campId: campInfo?.id,
                                callback: (res) => {
                                    console.log(res)
                                }
                            }) 
                        }
                    }
                    setTimeout(()=>{
                        window.location.reload()
                    },1000)
                }else{
                    if(!isQlchat()){
                        this.setState({isShowSuccess:true,isShowTip:false}) 
                    }else{
                        this.setState({isShowTip:false}) 
                        window.toast('预约报名成功!')
                    }
                    this.props.reservationSuccess&&this.props.reservationSuccess()
                }
                return 
            }
            //SIGN_UP_FULL：直接报名人数已满 RESERVATION__FULL 预约报名人数已满 TIME_CONFLICT 时间冲突 SUCCESS 报名成功 FAIL 其他失败
            switch (res?.data?.result?.msg) {
                case 'SIGN_UP_FULL': window.toast('报名人数已满'); break;
                case 'ALREADY_SIGN': window.toast('已经报过名了'); break;
                case 'TIME_CONFLICT': this.setState({isShowFail:true,isShowTip:false,studyCampPeriodDto:res?.data?.result?.studyCampPeriodDto,studyCampConfigDto:res?.data?.result?.studyCampConfigDto}); break; 
                default: window.toast('报名失败')
            };
            return
            
        }
    }
    joinCampShow(){
        this.setState({
            isShowTip:true,
            isShowSuccess:false
        }) 
    }
    joinCampClose(){
        this.setState({
            isShowTip:false
        }) 
    }
    joinCampFailClose(){
        this.setState({
            isShowFail:false
        })
    }
    render() {
        const {isShowTip,isShowSuccess,isShowFail,studyCampPeriodDto,studyCampConfigDto}=this.state
        const {children,campInfo,campId,handleAppSdkFun,reservationSuccess, ...otherProps}=this.props 
        return (
            <Fragment> 
                <div {...otherProps} onClick={this.joinCampShow}> 
                    {children}
                </div>
                
                {
                    createPortal(
                        <MiddleDialog 
                            show={isShowTip  }
                            onClose={this.joinCampClose}
                            className={"ln-course-dialog"}>
                                <div className="ln-course-dialog-close" onClick={this.joinCampClose}><i className="iconfont iconxiaoshanchu"></i></div>
                                <div className="un-ci-course-item">
                                    <img src={campInfo?.studyCampConfigDto?.imageUrl}/>
                                    <div className="un-ci-course-item-right">
                                        <div className="un-ci-course-item-num"> 第{campInfo?.name}期</div>
                                        <div className="un-ci-course-item-title">{campInfo?.studyCampConfigDto?.title}</div>
                                    </div>
                                </div>
                                <div className="un-ci-course-item-time">带学时间{formatDate(campInfo?.startTime, 'MM/dd')} - {formatDate(campInfo?.endTime, 'MM/dd')}</div>
                                <div className="un-ci-course-item-rule">
                                    <div className="un-ci-course-item-tip">1、温馨提示，为保证学习质量和机会公平</div>
                                    <div className="un-ci-course-item-red">{formatDate(campInfo?.startTime, 'MM/dd')} - {formatDate(campInfo?.endTime, 'MM/dd')} 学习期间，不能报名其他营</div>
                                    <div className="un-ci-course-item-tip">2、报名之后<span>没有换营机会</span>，请提前选择好当前最想学的学习营。</div>
                                </div> 
                                <div className="un-ci-course-item-btn on-visible on-log"
                                    data-log-name="马上报名"
                                    data-log-region="un-camp-intro-join"
                                    data-log-pos="0"
                                    onClick={ this.joinCamp }>{campInfo?.type=='direct'?'确认报名':'确认预约报名'}</div>
                        </MiddleDialog>  
                        ,document.getElementById('app'))
                }  
                {
                    isShowSuccess&&<WillJoin campInfo={campInfo}/>
                } 
                {
                    isShowFail&&createPortal(
                        <MiddleDialog 
                            show={true  }
                            onClose={this.joinCampFailClose}
                            className={"ln-course-dialog-fail"}>
                                <div className={"ln-course-dialog-fail-title"}>学霸你好~</div>
                                <div className={"ln-course-dialog-fail-content"}>系统检测到您<span>{formatDate(studyCampPeriodDto?.startTime,'MM月dd日')}</span>到<span>{formatDate(studyCampPeriodDto?.endTime,'MM月dd日')}</span>正在学<span>《{studyCampConfigDto?.title}》</span>，请完成学习再报名其他期学习营~</div>
                                <div className={"ln-course-dialog-fail-btn"}  onClick={this.joinCampFailClose}>我知道了</div>
                        </MiddleDialog>  
                        ,document.getElementById('app'))
                }
            </Fragment>
        )
    }
}
