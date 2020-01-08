import React, { PureComponent,Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';
import { formatMoney } from "components/util";

import "./style.scss";
 
const ShowFail = ({money,getMoney,payMoney}) => (
    <div className="fl-dialog-cont">
        <h4>如何拿回奖学金?</h4>
        <h5>方法1</h5>
        <p>1. 支付{formatMoney(payMoney)}元补卡费用，拿回{formatMoney(money)}元奖学金，<span style={{color:'#E0414F'}}>净赚{formatMoney(money-payMoney)}元！</span> </p>
        <h5>方法2（推荐）</h5>
        <p> 2. 继续寻找见证人，你还可获得{formatMoney(getMoney)}元，不要放弃之前的努力哦  </p> 
    </div>
) 
const ShowGet = ({getMoney}) => (
    <div className="fl-dialog-cont get">
        <h4>如何拿回奖学金?</h4> 
        <p style={{marginBottom:0}}>补卡费用太高，建议先拉见证人</p> 
        <p>您还可获得<span style={{color:'#E0414F'}}>{formatMoney(getMoney)}元</span> ，不要放弃之前的努力哦</p> 
    </div>
)

export default class extends PureComponent{
    state={ 
    } 

    render() {
        const { isShow, close, isShowFail ,money,cardTime} = this.props;
        const getMoney=16000-money          //还可获得
        const payMoney=(30-cardTime)*500    //补卡费用 

        return (
            <MiddleDialog 
                show={isShow || isShowFail }
                onClose={close}
                className="fl-dialog"
                closeStyle="fl-close-btn icon_cross"
                close={true}
                >
                    {
                        money>payMoney?
                        <Fragment>
                            <ShowFail money={money} getMoney={getMoney} payMoney={payMoney}/>
                            <div className="fl-btn-container">
                                <div className="fl-on-card on-log on-visible" 
                                    data-log-name='去补卡'
                                    data-log-region="un-flag-to-recard"
                                    data-log-pos="0"
                                    onClick={this.props.doPayForCard}>去补卡</div>
                                <div className="fl-on-get on-log on-visible" 
                                    data-log-name='去补卡'
                                    data-log-region="un-flag-to-share"
                                    data-log-pos="0"
                                    onClick={this.props.initMinCards}>再多拿奖学金</div>
                            </div>
                        </Fragment>
                        :
                        <Fragment>
                            <ShowGet  getMoney={getMoney}/>
                            <div className="fl-btn-container get"> 
                                <div className="fl-on-get on-log on-visible" 
                                    data-log-name='去补卡'
                                    data-log-region="un-flag-to-invite"
                                    data-log-pos="0"
                                    onClick={this.props.initMinCards}>继续寻找见证人，再多拿奖学金</div>
                            </div>
                        </Fragment>
                    } 
            </MiddleDialog>
        )
    }
}