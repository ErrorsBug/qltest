import React, { PureComponent, Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';
import { locationTo } from 'components/util';
import { formatMoney } from 'components/util'; 

const InvitaHead = ({ showDialogRule,couponAmount, getMoney }) => (
    <Fragment>
        <div className="it-un-head">
            <h3>邀请好友，互惠双赢</h3>
            <p>好友入学省{couponAmount}元{ !!getMoney && `，你获${getMoney}元` }</p>
        </div>
        <div className="it-un-rula" onClick={ showDialogRule }>规则</div>
    </Fragment>
)

const InvitaOne = ({ isRule, showRula,inviteData,couponAmount, getMoney,total }) => (
    <div className="it-join-head">
        <div className="it-join-cont">
            <div className="it-join-info">
                <div className="it-join-flex">
                    <strong>{inviteData.count}</strong>
                    <p>位好友已加入，获奖</p>
                    <strong>{formatMoney(total || 0)}元</strong>
                    {  inviteData.students.map((item, index) => (
                        index < 3&&<i className={ `icon${index}` } key={ index } style={{ zIndex: index+1 }}><img src={item.headImgUrl}/></i>
                    )) }
                    {
                        inviteData.students.length>3&&<i className="apply-user-more"></i>
                    } 
                </div>
                <div className="it-join-withdraw" onClick={()=>locationTo('/wechat/page/university/withdraw')}>提现</div>
            </div>
            <div className="it-join-rula"><span className={ isRule ? 'show' : '' } onClick={ showRula }>展开规则</span></div>
            { isRule && (
                <div className="it-rula-info">
                    <div className="it-rula-gold">
                        <p>分享得</p>
                        <h3>奖学金</h3>
                    </div>
                    <div className="it-rula-g">
                        <p>1. 长按以下海报，发送给好友</p>
                        <p>2. 每有一位好友成功购买学习，<span>可省{couponAmount}元</span></p>
                        <p>3. 有好友通过你的邀请加入，<span>奖{getMoney}元 (没上限)</span></p>
                    </div>
                </div>
            ) }
        </div>
    </div>
)


export default class extends PureComponent{
    state = { 
        isRule: false,
        isShowRule: false
    }
    componentDidMount = () => {
    };
    showRula = () => {
        this.setState({
            isRule: !this.state.isRule
        })
    }
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
        const {  inviteData ,couponAmount, getMoney,total } = this.props; 
        return (
            <Fragment>
                {
                    !inviteData || !inviteData.count  || !inviteData.students || !inviteData.students.length?
                    <InvitaHead showDialogRule={ this.showDialogRule } couponAmount={couponAmount} getMoney={getMoney}/>
                    :
                    <InvitaOne
                    showRula={ this.showRula }
                    isRule={ isRule } 
                    inviteData={inviteData}
                    couponAmount={couponAmount} 
                    getMoney={getMoney}
                    total={total}
                    />
                }
                <MiddleDialog
                    show={ isShowRule }
                    onClose={this.close}
                    className="it-dialog">
                    <div className="it-dialog-cont">
                        <h4>邀请规则</h4>
                        <p>1、分享邀请海报给好友，好友通过您的海报链接购买可以优惠{ couponAmount }元</p>
                        <p>2、每位好友加入大学，您即可获得{ getMoney || 0 }元奖学金，不设上限</p>
                        <p>3、每笔奖学金收入有7天的冻结期，7天后即可提现，提现金额将直接打到您的微信钱包</p>
                    </div>
                    <div className="it-dialog-btn" onClick={ this.close }>我知道了</div>
                </MiddleDialog>
            </Fragment>
        )
    }
}
