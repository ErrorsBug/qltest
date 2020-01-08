import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators';
import { loadavg } from 'os';
import MiddleDialog from '../../../../components/dialog/middle-dialog';
import { getVal } from 'components/util';
@autobind
export class campReward extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {
            showTips: false,
        }
    }
    
    setTipDetailShow(show) {
        this.setState({showTips: show})
    }

    onbgClick(e) {
        this.setTipDetailShow(true);
        // if (e.target === this.bg) {
        //     this.setTipDetailShow(true);
        // }
    }

    render() {
        if ( this.props.allowMGLive || this.props.payStatus === 'Y' || this.props.bonusStatus === 'N' || this.props.isEnd === 'Y') {
            return null
        }

        
        const { authNum, price, bonusPercent} = this.props
        let alerydic = this.props?.campSatus?.money ? this.props?.campSatus?.money > price ? price : this.props?.campSatus?.money:0;
        return (
            <div>
                <div className="camp-reward-container common-bg-img" onClick={this.onbgClick}>
                    <div className="total-reward">¥{authNum > 1 ? this.props.totalBonus : Math.floor((price-alerydic).toFixed(2) * bonusPercent) / 100 }</div>
                    <div className="tips">
                        <span>奖金持续上涨，坚持打卡平分</span>
                        <span className="icon_ask2"></span>
                    </div>
                </div>
                <MiddleDialog
                        show={this.state.showTips}
                        onClose={() => {this.setTipDetailShow(false)}}
                        showCloseBtn={true}
                        className="tips"
                    >
                        <div className="camp-reward-tip-container">
                            <div className="tip-head-img common-bg-img"></div>
                            <div className="tip-info">
                                <div className="title">
                                    <span className="money-icon common-bg-img"></span>
                                    <span>什么是契约奖金</span>
                                </div>
                                <div className="info">
                                    <span>打卡契约是所有成员共同签订的神圣约定，从每一位成员的入场票中扣除部分契约金形成奖金池。训练营结束后，奖金由所有完成目标的学员瓜分，不达标成员无任何返利。</span>
                                </div>
                                <div className="title">
                                    <span className="info-icon common-bg-img"></span>
                                    <span>加入契约打卡须知</span>
                                </div>
                                <ul className="info">
                                    <li>付费入场后，不支持退款，请慎重考虑</li>
                                    <li>活动结束后，系统根据所有学员的打卡完成情况进行结算，自动给达标者返回奖金，不达标者无任何返利。</li>
                                    <li>VIP用户可免费参与打卡训练营，但不参与契约金分成</li>
                                </ul>
                            </div>
                            <div className="info-btn" onClick={(e) => this.setTipDetailShow(false)}>我知道了</div>
                        </div>
                    </MiddleDialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
    payStatus: getVal(state, 'campUserInfo.payStatus', 'N'),
    totalBonus: getVal(state, 'campBasicInfo.totalBonus'),
    bonusPercent: getVal(state, 'campBasicInfo.bonusPercent'),
    bonusStatus: getVal(state, 'campBasicInfo.bonusStatus'),
    price: getVal(state, 'campBasicInfo.price'),
    authNum: getVal(state, 'campBasicInfo.authNum'),
    isEnd: getVal(state, 'campBasicInfo.dateInfo.isEnd'),
})

export default connect(mapStateToProps)(campReward)
