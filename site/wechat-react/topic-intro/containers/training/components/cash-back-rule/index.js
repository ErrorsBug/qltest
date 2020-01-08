import React, { Component } from "react";
import { autobind } from "core-decorators";
import errorCatch from "components/error-boundary";
import { MiddleDialog } from 'components/dialog';

@errorCatch()
@autobind
class CashBackRuleDialog extends Component {

    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                titleTheme={'white'}
                className="cash-back-dialog"
                onClose={this.props.onClose}
            >
                <div className='main cash-back-content'>
                    <p className="title">全额返学费规则说明</p>
                    <div className="item">
                        <p className="question">如何学费全返?</p>
                        <p className="answer">
                            每天在千聊训练营公众号上学习当日推送课程内容后，提交作业并点打卡分享到朋友圈，
                            打卡分享不设置分组可见，课程期间不删除。累计完成更新课程的<strong>{this.props.refundAffairNum}</strong>
                            天学习和打卡，即可申请<strong>学费全返</strong>。
                        </p>
                    </div>
                    <div className="item">
                        <p className="question">学费如何返还?需要多久?</p>
                        <p className="answer">
                            从开营日起，坚持累计打卡<strong>{this.props.refundAffairNum}</strong>天，符合打卡规则的学员可以在训练营主页，
                            点击“<strong>申请学费全返</strong>”进行申请。我们将在<strong>7</strong>个工作日内完成审核、
                            发放(按原支付路径返回)
                        </p>
                    </div>
                    <div className="item">
                        <p className="question">学费全返必须参加吗?</p>
                        <p className="answer">
                            朋友圈打卡获取学费全返任务属<strong>自愿参加</strong>。 
                            数据表明：将自己学习进度通过朋友圈展示给好友的学员，学习完成度和学习效果都将 大幅提高。
                        </p>
                    </div>
                </div>
                <div 
                    className="footer-btn"
                    onClick={this.props.onClose}
                    >
                    <p>我知道了</p>
                </div>
            </MiddleDialog>
        )
    }
}

export default CashBackRuleDialog