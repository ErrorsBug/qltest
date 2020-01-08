import React, { Component }  from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { imgUrlFormat, locationTo } from 'components/util';
import RewardTip from '../reward-tip';

class CampOverview extends Component {
    state = {
        // 显示契约金提示信息弹窗
        show: false
    }

    render(){
        const {className, campId, headImage, campName, price, daysProgress, totalDays, totalBonus, bonusStatus, bonusPercent, myCheckinCount, authNum, receiveDayNum} = this.props;
        const bonus = Math.floor(price * bonusPercent) / 100;
        return (
            <div className={classnames('camp-overview-container', className)}>
                <div className="camp-poster">
                    <img alt="训练营海报" src={imgUrlFormat(headImage, '@150h_240w_1e_1c_2o')} onClick={() => { locationTo(`/wechat/page/camp-detail?campId=${campId}`) }} />
                </div>
                <div className="camp-detail">
                    <div className="camp-header">
                        <div className="camp-name elli-text" onClick={() => { locationTo(`/wechat/page/camp-detail?campId=${campId}`) }}>{campName}</div>
                    </div>
                    <div className="camp-stat">
                        <div className="camp-progress-count"><span>{daysProgress < 0 ? '未开始' : daysProgress > totalDays ? '已结束' : `第${daysProgress}天`}</span><span className="vertical-bar">|</span><span>共{totalDays}天</span></div>
                        <div className="my-checkin-count">我已经打卡{Number(myCheckinCount)}次</div>
                    </div>
                    {
                        bonusStatus === 'Y' && <div className="camp-bonus" onClick={() => { this.setState({show: true}) }}>￥{totalBonus || bonus}</div>
                    }
                </div>
                <RewardTip 
                    show={this.state.show}
                    bonus={bonus}
                    totalBonus={totalBonus}
                    authNum={authNum}
                    receiveDayNum={receiveDayNum}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const campBasicInfo = state.campBasicInfo;
    return {
        campId: campBasicInfo.campId,
        headImage: campBasicInfo.headImage,
        campName: campBasicInfo.name,
        price: campBasicInfo.price,
        daysProgress: campBasicInfo.dateInfo.currentDays,
        totalDays: campBasicInfo.dateInfo.totalDays,
        totalBonus: campBasicInfo.totalBonus,
        bonusStatus: campBasicInfo.bonusStatus,
        bonusPercent: campBasicInfo.bonusPercent,
        myCheckinCount: state.campUserInfo.affairCount,
        authNum: campBasicInfo.authNum,
        receiveDayNum: campBasicInfo.receiveDayNum,
    }
}

export default connect(mapStateToProps)(CampOverview);