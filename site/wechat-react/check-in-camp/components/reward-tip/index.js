import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import MiddleDialog from '../dialog/middle-dialog';

@autobind
class RewardTip extends Component  {
    state = {
        // 是否显示弹窗
        show: false
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            show: nextProps.show
        });
    }

    render(){
        return (
            <MiddleDialog
                show={this.state.show}
                onClose={() => { this.setState({show: false}) }}
                showCloseBtn={true}
                className="check-in-reward-tips"
            >
                <div className="check-in-reward-tip-container">
                    <div className="tip-head-img common-bg-img"></div>
                    <div className="tip-info">
                        <div className="total-bonus">￥{this.props.totalBonus || this.props.bonus}</div>
                        <div className="info">共{this.props.authNum}人参加 | 打卡{this.props.receiveDayNum}天分奖金</div>
                        <ul className="tip-area">
                            <li>打卡契约是所有成员共同签订的神圣约定，从每一位成员的入场票中扣除部分契约金形成奖金池</li>
                            <li>训练营结束后，奖金由所有完成目标的学员瓜分，不达标成员无任何返利</li>
                            <li>VIP用户可免费参与打卡训练营，但不参与契约金分成</li>
                        </ul>
                    </div>
                    <div className="info-btn" onClick={() => { this.setState({show: false}) }}>我知道了</div>
                </div>
            </MiddleDialog>
        )
    }
}

export default RewardTip;