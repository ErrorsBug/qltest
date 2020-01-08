import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import CheckInTodayTopics from '../check-in-today-topics';
import CheckInCalendar from '../check-in-calendar';
import CheckInButton from '../check-in-button';
import CheckInBottomInfo from '../check-in-bottom-info';
import CheckInReward from '../check-in-reward';
import { getVal } from 'components/util';
import CheckInPage from '../../../../components/check-in-page';
import RewardTip from '../../../../components/reward-tip';
import ReactLoading from 'react-loading';

@autobind
export class CampCheckInInfo extends Component {
    static propTypes = {

    }
    
    constructor(props) {
        super(props)
        
        this.state = {
            showRewardTips: false,
            showCheckInPage: false,
        }
    }
    

    setRewardTipsShow(isShow) {
        this.setState({showRewardTips: isShow})
    }

    closeCheckInPage() {
        this.setState({ showCheckInPage: false })
    }

    showCheckInPage() {
        this.setState({ showCheckInPage: true })
    }

    render() {

        // console.log(this.props.userLoading)

        if ( !this.props.allowMGLive && this.props.payStatus === 'N' && this.props.isEnd === 'N') {
            return null
        }
        
        if (this.props.authLoading || 
            this.props.baseLoading ||
            this.props.userLoading 
        ) {
            return <ReactLoading type="spin" color="#fe5670"  className="loading-spin"/>
        }

        return (
            <div className="check-in-info-container">
                <CheckInReward setRewardTipsShow={this.setRewardTipsShow}/>
                <CheckInTodayTopics />
                <CheckInCalendar />
                <CheckInButton setRewardTipsShow={this.setRewardTipsShow} showCheckInPage={this.showCheckInPage}/>
                <CheckInBottomInfo />
                <RewardTip
                    show={this.state.showRewardTips}
                    bonus={Math.floor(this.props.price * this.props.bonusPercent) / 100}
                    totalBonus={this.props.totalBonus}
                    authNum={this.props.authNum}
                    receiveDayNum={this.props.receiveDayNum}
                />
                <CheckInPage 
                    isShow={this.state.showCheckInPage} 
                    close={this.closeCheckInPage}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    price: getVal(state, 'campBasicInfo.price', 0),
    bonusPercent: getVal(state, 'campBasicInfo.bonusPercent', 0),
    allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
    payStatus: getVal(state, 'campUserInfo.payStatus', 'N'),
    totalBonus: getVal(state, 'campBasicInfo.totalBonus'),
    authNum: getVal(state, 'campBasicInfo.authNum'),
    receiveDayNum: getVal(state, 'campBasicInfo.receiveDayNum'),
    isEnd: getVal(state, 'campBasicInfo.dateInfo.isEnd'),
    authLoading: getVal(state, 'campAuthInfo.loading'),
    baseLoading: getVal(state, 'campBasicInfo.loading'),
    userLoading: getVal(state, 'campUserInfo.loading'),
})

export default connect(mapStateToProps)(CampCheckInInfo)
