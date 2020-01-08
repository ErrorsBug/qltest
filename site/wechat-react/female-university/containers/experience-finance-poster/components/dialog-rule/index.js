import React, { PureComponent, Fragment } from 'react'
import { MiddleDialog } from 'components/dialog'; 
import { formatMoney } from 'components/util';
import { createPortal } from 'react-dom';
 


export default class extends PureComponent{
    state = { 
        isRule: false,
        isShowRule: false
    }
    componentDidMount = () => {
    }; 
    close = () => {
        this.setState({
            isShowRule: false
        })
    }
    showDialogRule = () => {
        this.setState({
            isShowRule: true
        })
    }
    render() {
        const { isRule, isShowRule } = this.state;
        const {children,  dataList=[],couponAmount, getMoney,total } = this.props; 
        return (
            <Fragment> 
                <div onClick={ this.showDialogRule }> 
                    {children}
                </div>
                {
                    createPortal(
                        <MiddleDialog
                            show={ isShowRule }
                            onClose={this.close}
                            className="efp-dialog">
                            <div className="efp-dialog-cont">
                                <h4>邀请规则</h4>
                                {
                                    couponAmount!==undefined&&getMoney!==undefined?
                                    <Fragment> 
                                        <p>1、分享邀请海报给好友，好友通过你的海报链接购买即可优惠{formatMoney(couponAmount||0)  }元；</p>
                                        <p>2、每位好友成功报名后，你即可获得{formatMoney( getMoney || 0)  }元奖学金，不设上限；</p>
                                        <p>3、每笔奖学金收入有7天的冻结期，7天后即可提现，提现金额将直接打到你的微信钱包；</p>
                                        <p>4、活动最终解释权归千聊富家理财所有。</p>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <p>1、邀请好友成功报名后，你即可获得奖学金，不设上限；</p>
                                        <p>2、每笔奖学金收入有7天的冻结期，7天后即可提现，提现金额将直接打到你的微信钱包；</p>
                                        <p>3、累计奖学金包含你已提现的金额和冻结奖金；</p>
                                        <p>4、活动最终解释权归千聊富家理财所有。</p>
                                    </Fragment>
                                }
                            </div>
                            <div className="efp-dialog-btn" onClick={ this.close }>我知道了</div>
                        </MiddleDialog>
                        ,document.getElementById('app'))
                }
                
            </Fragment>
        )
    }
}
