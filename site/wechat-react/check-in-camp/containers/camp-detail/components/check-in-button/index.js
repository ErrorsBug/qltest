import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import AchievementCard from '../../../../components/achievement-card'
import { mockableApiFactory } from '../../../../utils/api';

const getQrCodeApi = mockableApiFactory({
    url: '/api/wechat/checkInCamp/getQrCode',
    method: 'POST',
})
@autobind
export class CheckInButton extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {
            showAchieve: false,
            qrUrl: '',
        }
    }

    handleOnCheckIn() {
        this.props.showCheckInPage();
    }

    handleBonusClick() {
        this.props.setRewardTipsShow(true);
    }

    getCheckInBtn() {
        const {
            startDate,
            endDate,
            isEnd,
        } = this.props.dateInfo;

        const { affairStatus } = this.props
        
        
        if (isEnd == 'Y') {
            return (
                <div className="end-btn">
                    <div className="end-title">打卡已结束</div>
                    <div className="date">{`${startDate} 至 ${endDate}`}</div>
                    <div className="achievement-btn" onClick={this.showAchievementCard}>成就卡</div>
                </div>
            )
        }

        if (isEnd !== 'Y' && affairStatus !== 'Y') {
            return (
                <div className="check-btn" onClick={this.handleOnCheckIn}>打卡</div>
            )
        }

        if (isEnd !== 'Y' && affairStatus === 'Y') {
            return (
                <div className="checked-btn">
                    <div className="checked-title"><span className="icon_choosethis"></span>今日已打卡</div>
                    <div className="achievement-btn" onClick={this.showAchievementCard}>成就卡</div>
                </div>
            )
        }

    }
    async getQrUrl() {
        const { campId, liveId } = this.props;
        if (campId && liveId && this.state.qrUrl == '') {
            const channel = 'campAffairAchievement';
            const qrRes = await getQrCodeApi({ params: {campId, liveId, channel}, mock:false});
            let qrUrl = qrRes.data.qrUrl;
            await this.setState({ qrUrl })
        }
    }

    async showAchievementCard() {
        window.loading(true);
        if (!this.state.qrUrl || this.state.qrUrl == '') {
            await this.getQrUrl();
        }
        this.setState({ showAchieve: true})
    }

    hideAchievementCard() {
        this.setState({ showAchieve: false})
    }

    onAchieveCardLoad() {
        window.loading(false);
    }

    render() {
        const { totalBonus, authNum, price ,bonusPercent, userName, campName, affairCount, headImgUrl, receiveDayNum, isEnd} = this.props;
        const { isBegin } =this.props.dateInfo;
        // console.log(this.props.shareData)
        if (isBegin === 'N') {
            return null;
        }
        const shareData = {
            userName,
            campName,
            daysNum: affairCount,
            headImgUrl: headImgUrl,
            shareUrl: this.state.qrUrl || '',
            receiveDayNum: receiveDayNum || 0,
        }


        return (
            <div className="check-in-button">
                {
                    this.getCheckInBtn()
                }
                {
                    this.props.bonusStatus === 'Y' ?
                    <div className="bonus" onClick={this.handleBonusClick}>
                        <span className="icon_ask2 ask"></span>
                        <span>奖金池 ¥{authNum > 1 ? this.props.totalBonus : Math.floor(price * bonusPercent) / 100} {isEnd === 'Y' ? '' : "持续上涨"}</span>
                    </div> :
                    null
                }
                {

                }
                <AchievementCard 
                    show={this.state.showAchieve}
                    shareData={shareData}
                    onClose={this.hideAchievementCard}
                    onLoad={this.onAchieveCardLoad}
                    liveHeadImage={this.props.liveHeadImage}
                />
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    dateInfo: getVal(state, 'campBasicInfo.dateInfo'),
    affairStatus: getVal(state, 'campUserInfo.affairStatus'),
    userName: getVal(state, 'campUserInfo.nickName', ''),
    headImgUrl: getVal(state, 'campUserInfo.headImage', ''),
    affairCount: getVal(state, 'campUserInfo.affairCount', 0),
    totalBonus: getVal(state, 'campBasicInfo.totalBonus'),
    bonusPercent: getVal(state, 'campBasicInfo.bonusPercent'),
    bonusStatus: getVal(state, 'campBasicInfo.bonusStatus'),
    price: getVal(state, 'campBasicInfo.price'),
    authNum: getVal(state, 'campBasicInfo.authNum'),
    campName: getVal(state, 'campBasicInfo.name', ''),
    campId: getVal(state, 'campBasicInfo.campId'),
    liveId: getVal(state, 'campBasicInfo.liveId'),
    receiveDayNum: getVal(state, 'campBasicInfo.receiveDayNum'),
    liveHeadImage: getVal(state, 'campBasicInfo.liveHeadImage'),
    isEnd: getVal(state, 'campBasicInfo.dateInfo.isEnd'),
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInButton)
