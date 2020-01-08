import React, { PureComponent } from 'react'
import { MiddleDialog } from 'components/dialog';

 
const Rule = () => (
    <div className="fl-dialog-cont">
        <h4>活动规则</h4>
        <p>1、活动时间：契约生效后次日开始算起，连续30天挑战时长 </p>
        <p style={{marginBottom:0}}>2、领取说明： </p>
        <p style={{marginBottom:0}}>① 写下目标后，邀请3名好友来当你的见证人，契约即可生效，当前奖学金池为15元； </p> 
        <p style={{marginBottom:0}}>② 见证人越多，奖学金池越多，最高可得160元，每多一个见证人，奖学金池即增加1~3元； </p> 
        <p>③ 每天写下学习笔记（不强制发朋友圈打卡），<span style={{color:'#E0414F'}}>坚持满30天，系统自动将奖学金打到微信钱包。</span> </p> 
        <p>3、每人仅有一次机会参与30天学习挑战活动，不可重复领取 </p> 
        <p>4、本活动最终解释权归千聊女子大学所有 </p>
    </div>
)

export default class extends PureComponent{
    render() {
        const { isShow, close, isRule } = this.props;
        return (
            <MiddleDialog 
                show={isShow || isRule }
                onClose={close}
                close={true}
                closeStyle={' fl-close-btn icon_cross'}
                className="flag-rule-dialog">
                <Rule />
            </MiddleDialog>
        )
    }
}