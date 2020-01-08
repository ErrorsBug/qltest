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
        return (
            <Fragment>
               <div className="fh-head-other"> 
                    <div className="fhli-avator">
                        <img src={imgUrlFormat(userHeadImg||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')} />
                    </div>
                    <div className="fhli-right-path">
                        <div className="fhli-top">
                            <div className="fhli-name">{userName}的小目标</div>
                        </div>
                        <div className="fhli-intro">奖金: ￥{formatMoney(money||0)}元</div>
                    </div>
                </div> 
            </Fragment>
        )
    }
}
