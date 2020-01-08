import React, { PureComponent } from 'react'
import { MiddleDialog } from 'components/dialog';

const Success = () => (
    <div className="wd-dialog-cont">
        <h4>恭喜，提现成功!</h4>
        <p className="txt-center">请留意，申请提现的奖学金将发放到你的微信钱</p>
    </div>
)

const Rule = ({ money,offerMoney }) => (
    <div className="wd-dialog-cont">
        <h4>奖学金规则和提现说明</h4>
        <p>1、分享邀请海报，好友通过你的海报链接购买可以优惠{ offerMoney || 0 }元。</p>
        <p>2、每位好友加入大学，你即可获得{ money || 0 }元奖学金，不设上限</p>
        <p>3、每笔奖学金收入有7天的冻结期，7天后即可提现，提现金额将直接打到您的微信钱包。</p>
    </div>
)

export default class extends PureComponent{
    render() {
        const { isSuccess, close, isRule, ...otherProps } = this.props;
        return (
            <MiddleDialog
                show={isSuccess || isRule }
                onClose={close}
                className="wd-dialog">
                { isSuccess && <Success /> }
                { isRule && <Rule { ...otherProps } /> }
                <div className="wd-dialog-btn" onClick={ close }>我知道了</div>
            </MiddleDialog>
        )
    }
}