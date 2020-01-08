import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators'; 
import { formatMoney, locationTo, imgUrlFormat } from 'components/util'; 
 
 

@autobind
export default class extends PureComponent{
    state = { 
        isShowProcess:false
    }
     
    componentDidMount = () => { 
    };
        
    render() { 
        const { 
            isShowWithdraw,
             className,
            id,
            userId,
            status,
            money,
            desc,
            helpNum,
            cardDate,
            cardTime,
            createTime,
            updateTime,
            userName,
            userHeadImg,
            job } = this.props;
            // const status = 'fail'  
        return (
            <Fragment>
                {
                    status=='process'&& 
                    <div className="fh-head">
                        <div className="fh-title">奖学金池：{formatMoney(money||0)}元 
                            <span 
                                className=" on-log on-visible"
                                data-log-name='提现'
                                data-log-region="un-flag-mine-withdraw"
                                data-log-pos="0"
                                onClick={this.props.showWithdraw}>提现</span></div> 
                        <div className="fh-intro">见证人越多奖学金越丰厚哦~</div>
                        <div className="fh-num">已有 <span>{helpNum||0}</span> 位见证人</div>
                        <div className="fh-btn on-log on-visible" 
                            data-log-name='寻找见证人'
                            data-log-region="un-flag-mine-invite"
                            data-log-pos="0"
                            onClick={this.props.initMinCards}>寻找见证人</div> 
                    </div> 
                }
              
                {
                    (status=='success'||status=='pay')&& 
                    <div className="fh-head-success">
                        <div className="fh-avator">
                            <img src={imgUrlFormat(userHeadImg || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_130,w_130','/0')}/>
                        </div>
                        <div className="fh-title">已获得: ￥{formatMoney(money||0)} </div> 
                        <div className="fh-intro">奖学金将放入你的微信钱包，记得查收哦~</div>
                        <div className="fh-content">{desc}</div>
                        <div className="fh-btn on-log on-visible" 
                            data-log-name='发给好友炫耀一下'
                            data-log-region="un-flag-mine-show"
                            data-log-pos="0"
                            onClick={this.props.initSuccessCards}>发给好友炫耀一下</div>
                        <div className="fh-success-icon"> </div> 
                    </div> 
                }
                
                {
                    status=='fail'&& 
                    <div className="fh-head-fail"> 
                        <div className="fh-disfinish">任务未完成…</div>
                        <div className="fh-title">奖学金: ￥{formatMoney(money||0)} </div> 
                        <div className="fh-content">{desc}</div>
                        <div className="fh-btn on-log on-visible" 
                            data-log-name='拿回奖学金'
                            data-log-region="un-flag-get-price"
                            data-log-pos="0"
                            onClick={this.props.showFail}>拿回奖学金</div> 
                    </div> 
                }
            </Fragment>
        )
    }
}
