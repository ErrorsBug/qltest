import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import list from '../../../../../components/live-profit-list/list';

@autobind
export class CheckInReward extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {

        }
    }

    handleClick() {
        this.props.setRewardTipsShow(true);
    }

    render() {
        const { authNum, price, bonusPercent} = this.props
        // 打卡已开始且没结束的时候不显示
        if ( this.props.isBegin === 'Y' && this.props.isEnd === 'N') {
            return null
        }

        if (this.props.bonusStatus === 'N') return null

        let title = <div className="bonus">￥{authNum > 1 ? this.props.totalBonus : Math.floor(price * bonusPercent) / 100 }</div>;
        let tipText = '参加打卡，平分奖池';

        if (this.props.isEnd === 'Y' && this.props.completeStatus === 'Y') {
            title = <div className="complete">恭喜您完成任务,获得<span>¥{this.props.shareBonus}</span>奖金</div>;
            tipText = `${this.props.realCompleteNum}人瓜分${this.props.totalBonus}元奖金`;
        }

        if (this.props.isEnd === 'Y' && this.props.completeStatus === 'N') {
            tipText = `已被${this.props.realCompleteNum}位达标成员瓜分`;
        }
        
        if (this.props.isEnd === 'Y' && this.props.completeNum === 0) {
            tipText = `这一届学员很懒，无人达标`;
        } 


        return (
            <div className="check-in-reward-container common-bg-img">
                {title}
                <div className="tips">
                    <span>{tipText}</span>
                    {
                        this.props.isBegin === 'N' ?
                        <span className="icon_ask2" onClick={this.handleClick}></span> :
                        null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isEnd: getVal(state, 'campBasicInfo.dateInfo.isEnd'),
    isBegin: getVal(state, 'campBasicInfo.dateInfo.isBegin'),
    totalBonus: getVal(state, 'campBasicInfo.totalBonus'),
    completeNum: getVal(state, 'campBasicInfo.completeNum'),
    realCompleteNum: getVal(state, 'campBasicInfo.realCompleteNum'),
    bonusStatus: getVal(state, 'campBasicInfo.bonusStatus'),
    shareBonus: getVal(state, 'campUserInfo.shareBonus'),
    completeStatus: getVal(state, 'campUserInfo.completeStatus'),
    price: getVal(state, 'campBasicInfo.price'),
    bonusPercent: getVal(state, 'campBasicInfo.bonusPercent'),
    authNum: getVal(state, 'campBasicInfo.authNum'),
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInReward)
