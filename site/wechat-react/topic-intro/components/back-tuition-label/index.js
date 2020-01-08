import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import { formatNumber } from 'components/util';

class BackTuitionLabel extends Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    
    render(){
        let {fromB = false, maxReturnMoney, inviteReturnCouponMoney = 0, isOpenMemberBuy, inviteReturnConfig} = this.props
        let money = 0
        // 返现比例
        let returnPercent = get(inviteReturnConfig, 'returnPercent', 100)
        // C端介绍页需要计算返现金额
        if(!fromB){
            money = maxReturnMoney - inviteReturnCouponMoney
            money = money * returnPercent / 100
            // 会员打八折
            if(isOpenMemberBuy){
                money = money * 0.8
            }
        }

        return (
            <div className="back-tuition-label">
                <div className="title">组队学习返学费</div>
                {
                    fromB ? 
                    //<div className="tip">邀请{get(inviteReturnConfig, 'inviteTotal', 0)}位好友报名，返学费<em>{returnPercent}%</em></div>
                    <div className="tip">请朋友一起学可返学费</div>
                        :
                    //<div className="tip">报名后，邀请{get(inviteReturnConfig, 'inviteTotal', 0)}位好友立返学费{money > 0 ? <em>(最高￥{formatNumber(money)})</em> : null}</div>
                    <div className="tip">报名后，请朋友一起学可返学费</div>
                }
                <div className="process-container">
                    <span className="sign icon"></span>
                    <span className="step"></span>
                    <span className="friends icon"></span>
                    <span className="step"></span>
                    <span className="money icon"></span>
                </div>
            </div>
        )
    }
}

BackTuitionLabel.propTypes = {
    
};

export default BackTuitionLabel