import React, { PureComponent } from 'react'
import { MiddleDialog } from 'components/dialog';

const Success = () => (
    <div className="wd-dialog-cont">
        <h4>恭喜，提现成功!</h4>
        <p className="txt-center">请留意，申请提现的奖学金将发放到你的微信钱</p>
    </div>
)

const Attestation = () => (
    <div className="wd-dialog-cont">
        <h4>您还没实名认证</h4>
        <p className="txt-center">为了保障您的资金安全，需要完成实名认证才可以提现到微信钱包哦~！</p>
        <div className="gw-btn">去认证</div>
    </div>
)

const ToExamine = () => (
    <div className="wd-dialog-cont">
        <h4>实名认证审核中</h4>
        <p className="txt-center">请耐心等待，审核通过后，马上可以安全提现</p>
        <div className="gw-btn gw-gray">查看审核进度</div>
    </div>
)



export default class extends PureComponent{
    render() {
        const { isSuccess, close, isRule, btnText } = this.props;
        return (
            <MiddleDialog
                show={isSuccess || isRule }
                onClose={close}
                className="wd-dialog-box">
                <div onClick={ close } className="wd-dialog-close iconfont iconxiaoshanchu"></div>
                {/* { isSuccess && <Success /> } */}
                {/* { isRule && <Attestation /> } */}
                <ToExamine />
                {/* <div className="wd-dialog-btn" onClick={ close }>我知道了</div> */}
            </MiddleDialog>
        )
    }
}