import React, { PureComponent, Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';
import { locationTo } from 'components/util';
import { formatMoney } from 'components/util'; 
 


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
        const {  dataList=[],couponAmount, getMoney,total } = this.props; 
        return (
             <div className="il-empty">
                 <div className="il-container">
                    <div className="il-img">
                        <img src="https://img.qlchat.com/qlLive/business/S6MTJ8DI-SGKT-J9SX-1561348479457-88PULZTABTHT.png"/>
                    </div>
                    <div className="il-text">暂无邀请记录，快去邀请好友赚奖学金吧〜</div>
                    <div className="il-btn" onClick={()=>{locationTo(`/wechat/page/university/invitation-card`)}}>邀请好友赚奖学金</div>
                 </div>
             </div>
        )
    }
}