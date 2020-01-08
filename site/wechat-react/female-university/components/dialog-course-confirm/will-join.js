import React, { PureComponent, Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';  
import { autobind, throttle } from 'core-decorators';
import { createPortal } from 'react-dom'; 
import { formatDate, locationTo, getVal, formatMoney, getCookie } from 'components/util';
import { fetchIsSubscribeAndQr } from "../../actions/common";
import PressHoc from 'components/press-hoc';


@autobind
export default class extends PureComponent{
    state = { 
        isShowTip:true,
        isFocusThree:false,
        qrcode:''
    }
    
    data = { 
    }
    componentDidMount = () => {
        this.initData()
        
    }   
    async initData(){ 
        fetchIsSubscribeAndQr({
            channel:'newStudyCampReservation',
            pubBusinessId:this.props.campInfo?.id,
            isFocusThree:()=>{
                this.setState({
                    isFocusThree:true,
                    isShowTip:true
                });
            },
            unFocusThree:(qrUrl)=>{
                this.setState({
                    qrcode: qrUrl ,
                    isFocusThree:false,
                    isShowTip:true
                });
            }, 
        })    
    }   
    joinCampShow(){
        this.setState({
            isShowTip:true
        }) 
    }
    joinCampClose(){
        this.setState({
            isShowTip:false
        }) 
    }
    render() {
        const {isShowTip,isFocusThree,qrcode}=this.state
        const {children,campInfo,...otherProps}=this.props
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
                            className={"ln-course-dialog-will-join"}>
                                <div className="will-join-head">
                                    <div className="will-join-head-rotate-bg"></div>
                                    <img className="will-join-head-bg" src="https://img.qlchat.com/qlLive/business/T876KEJS-6JDG-OYVY-1573019619935-8TXSMTLZ9ISJ.png"/>
                                    <div className="will-join-head-text">
                                        <img src="https://img.qlchat.com/qlLive/business/WA7TFE8S-JM5W-YT4P-1573020001460-S2GG6FSZKCCV.png"/> 
                                        预约报名成功!
                                        <img src="https://img.qlchat.com/qlLive/business/WA7TFE8S-JM5W-YT4P-1573020001460-S2GG6FSZKCCV.png"/> 
                                    </div>
                                </div>
                                <div className="will-join-content">
                                    {
                                        !isFocusThree?
                                        <Fragment>
                                            <div className="ln-course-dialog-title">长按扫码关注，开营提醒你</div>
                                            <div className="ln-course-dialog-tip">开营后，我们将通过公众号通知你进群学习</div>
                                            <div className="ln-course-dialog-qrcode">
                                                <PressHoc region="un-will-join-dialog-qrcode">
                                                    <img src={qrcode}/>
                                                </PressHoc>
                                            </div>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <div className="ln-course-dialog-title">—— 温馨提示 ——</div>
                                            <div className="ln-course-dialog-tip">开营后，我们将通过公众号通知你进群学习请留意哦〜</div>
                                            <div className="ln-course-dialog-btn" onClick={()=>{locationTo(`/wechat/page/university/camp-intro?campId=${campInfo?.campId}`)}}>我知道了</div>
                                        </Fragment>
                                    }
                                    
                                </div>
                        </MiddleDialog>  
                        ,document.getElementById('app'))
                }  
            </Fragment>
        )
    }
}
