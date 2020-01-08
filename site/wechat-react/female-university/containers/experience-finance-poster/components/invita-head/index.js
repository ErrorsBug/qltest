import React, { PureComponent, Fragment } from 'react' 
import DialogRule from '../dialog-rule'
import { formatMoney } from 'components/util'

const InvitaHead = ({ showDialogRule,couponAmount, getMoney }) => (
    <Fragment>
        <div className="efp-un-head">
            <h3>邀请好友，互惠双赢</h3>
            <p dangerouslySetInnerHTML={{__html:`好友报名能省${formatMoney(couponAmount) }元${ !!getMoney ? `，你赚<span>${formatMoney(getMoney)}</span>元`:''} `}}></p>
        </div>
        <DialogRule  couponAmount={couponAmount} getMoney={getMoney}>
            <div className="efp-un-rula">规则</div>
        </DialogRule>
    </Fragment>
)
 


export default class extends PureComponent{
    state = { 
        isRule: false,
        isShowRule: false
    }
    componentDidMount = () => {
    }; 
    render() { 
        const {  dataList=[],couponAmount, getMoney,total } = this.props; 
        return (
            <div className="experience-finance-poster-head">
                <InvitaHead couponAmount={couponAmount} getMoney={getMoney}/> 
            </div>
        )
    }
}
