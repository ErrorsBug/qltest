import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import FlagItem from '../../../../components/flag-item'; 
import { locationTo, formatDate } from 'components/util' 
import { getUrlParams } from 'components/url-utils'; 
 
@autobind
export default class extends PureComponent{
    state = { 
        universityFlagData:{}, 
    }
    endTime = 1574870399000;
    get curTime(){
        return getUrlParams("endTime", "") || Date.now()
    }
    clickFlagItem(){
        locationTo('/wechat/page/flag-home')
    }
    render() { 
        const { universityFlagData,flagHelpListData } = this.props 
        return (
            <Fragment>
               <div className="fl-head">
                   {
                       !universityFlagData||!universityFlagData.id?
                       <div className="fl-poster">
                           <span  
                            className="on-log on-visible"
                            data-log-name='规则'
                            data-log-region="un-flag-rule"
                            data-log-pos="0"
                            onClick={this.props.showRule}>规则</span>
                           <img src="https://img.qlchat.com/qlLive/business/8QAO66HP-LMZI-K277-1560513014244-W8A5LI4LDBT2.png"/>
                           {
                            ((!universityFlagData || !universityFlagData.status) && Number(this.curTime) < Number(this.endTime))&&createPortal(
                                <div className="fl-set-btn">
                                    <div 
                                        className="on-log on-visible"
                                        data-log-name='我要定目标'
                                        data-log-region="un-flag-add"
                                        data-log-pos="0"
                                        onClick={()=>{locationTo('/wechat/page/university/flag-add')}}>我要定目标</div> 
                                </div>,
                                    document.getElementById('app')
                                ) 
                           }
                            
                       </div> 
                       :
                       <div className="fl-my-flag">
                            <div className="fl-title">我的小目标</div>
                            <div className="fl-item"> 
                                <FlagItem  
                                    {...universityFlagData}
                                    helpHeadImg={flagHelpListData?.data?.flagHelpList}
                                    className={'fl-content fl-mark'}
                                    job={'mine'}
                                    onClick={this.clickFlagItem}
                                    />
                            </div>
                            {  
                                universityFlagData.status=='join'?
                                <Fragment>
                                    <div className="fl-tip">请3位姐妹帮你见证，目标即可创建成功</div>
                                    <div className="fl-btn on-log on-visible"
                                        data-log-name='马上寻找见证人'
                                        data-log-region="un-flag-invite"
                                        data-log-pos="0"
                                         onClick={this.props.initMinCards}>马上寻找见证人</div> 
                                </Fragment>
                                : universityFlagData.status=='process'?
                                <div className="fl-btn fl-mar on-log on-visible"
                                    data-log-name='继续寻找见证人'
                                    data-log-region="un-flag-inviteing"
                                    data-log-pos="0"
                                    onClick={this.props.initMinCards}>继续寻找见证人</div>
                                : universityFlagData.status=='success'||universityFlagData.status=='pay'?
                                <div className="fl-btn fl-mar on-log on-visible" 
                                    data-log-name='发给好友炫耀一下'
                                    data-log-region="un-flag-show"
                                    data-log-pos="0"
                                    onClick={this.props.initSuccessCards}>发给好友炫耀一下</div>
                                :  
                                <div className="fl-btn fl-mar" onClick={this.props.showFail}>拿回奖学金</div>
                            }
                       </div>
                   }
                </div>
                 
            </Fragment>
        )
    }
}
