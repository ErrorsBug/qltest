import React, { Component } from 'react';
import PropType from 'prop-types';
import { Link } from 'react-router';
import { imgUrlFormat, timeAfter } from 'components/util';
import { autobind } from 'core-decorators';
import { MiddleDialog } from 'components/dialog';
import Switch from 'components/switch';

@autobind
class CheckinCampCard extends Component {

    // 显示弹出
    btnNotice() { 
        this.props.onChangeDialog();
    }

    // 确认
    
    render() {
        const {
            camp,
            sysTime,
        } = this.props;
        const {
            campId,
            headImage: poster,
            name,
            beginTime: startTime,
            endTime: endTime,
            isBonus: bonusStatus,
            isAffair: isCheckined,
        } = this.props.camp;
        const openBonusPlan = bonusStatus === 'Y';
        const timeAfterStr = timeAfter(startTime, sysTime, endTime + (24 * 3600 * 1000));
        let checkInProgress, totalDays;
        totalDays = ((endTime - startTime) / 1000 / 3600 / 24) + 1;
        if (sysTime < startTime) {
            // 未开始
            checkInProgress = 0;
        } else if (sysTime >= endTime) {
            // 已结束
            checkInProgress = totalDays;
        } else {
            // 进行中
            checkInProgress = Math.ceil((sysTime - startTime) / 1000 / 3600 / 24);
        }

        return (
            <div className="checkin-camp-card">
                <div className="checkin-camp-container">
                    <div className="checkin-camp-poster">
                        <Link to={`/wechat/page/camp-detail?campId=${campId}`}><img alt="训练营海报" src={imgUrlFormat(poster, '@150h_240w_1e_1c_2o')} /></Link>
                    </div>
                    <div className="checkin-camp-detail">
                        <div className="checkin-camp-header">
                            <div className="checkin-camp-name elli-text"><Link to={`/wechat/page/camp-detail?campId=${campId}`}>{name}</Link></div>
                        </div>
                        <div className="checkin-camp-signs">
                            {
                                openBonusPlan && <span className="checkin-camp-bonus-return">￥返奖金</span>
                            }
                            {
                                timeAfterStr == '进行中' ? <span className="process-sign checkin-camp-processing">• 进行中</span>
                                    : timeAfterStr == '已结束' ? <span className="process-sign checkin-camp-ended">• 已结束</span>
                                        : <span className="checkin-camp-not-start">{timeAfterStr}</span>
                            }
                        </div>
                        <div className="checkin-camp-stat">
                            <div className="checkin-camp-count">
                                {timeAfterStr == '进行中' && <span><span>第{checkInProgress}天</span><span className="vertical-bar">|</span></span>}<span>共{totalDays}天</span>
                            </div>
                        </div>
                        {/* {
                            timeAfterStr == '进行中' ?
                                isCheckined === 'Y' ? <div className="check-in-button have-checkin" role="button">已打卡</div>
                                : <div className="check-in-button not-checkin" role="button"><Link to={`/wechat/page/camp-detail?campId=${campId}#checkInPage=true`}>去打卡</Link></div>
                            : null
                        } */}
                        { timeAfterStr == '进行中' && <div className="check-in-button have-checkin check-red" onClick={(e) => this.btnNotice(e)}>通知</div> }
                    </div>
                </div>
            </div>
        )
    }
}

CheckinCampCard.propTypes = {
    camp: PropType.object.isRequired,
    sysTime: PropType.number.isRequired,
}

export default CheckinCampCard;