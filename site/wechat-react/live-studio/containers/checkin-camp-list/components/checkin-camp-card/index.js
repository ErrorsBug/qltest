import React, { Component } from 'react';
import PropType from 'prop-types';
import { timeAfter, locationTo, digitFormat, } from 'components/util';
import Picture from 'ql-react-picture';

class CheckinCampCard extends Component {
    render(){
        const {
            camp,
            sysTime,
            clientRole,
            displayBottomActionSheet,
            isShowAuthNum,
            isShowAffairCount,
        } = this.props;
        const {
            campId,
            headImage: poster,
            name,
            startTimeStamp: startTime,
            endTimeStamp: endTime,
            authNum,
            allAffairCount: checkinTimes,
            price,
            bonusStatus,
            displayStatus,
            communityStatus
        } = this.props.camp;
        const openBonusPlan = bonusStatus === 'Y';
        const timeAfterStr = timeAfter(startTime, sysTime, endTime + (24 * 3600 * 1000));
        return (
            <div className="checkin-camp-card">
                <div className="checkin-camp-container flex flex-row">
                    <div 
                        className="checkin-camp-poster on-log flex-no-shrink" 
                        data-log-region="checkin-camp-list"
                        data-log-pos={this.props.index + 1} 
                        onClick={() => {locationTo(`/wechat/page/camp-detail?campId=${campId}`)}}
                    >
                        <div className="c-abs-pic-wrap"><Picture src={poster} placeholder={true} resize={{w: '220', h: "138"}} /></div>
                        {
                            displayStatus === 'N' && <span className="hide-icon icon_hidden"></span>
                        }
                        { communityStatus == 'Y' && <span className="community-sign">群</span> }
                    </div>
                    <div className="checkin-camp-detail flex-grow-1 flex flex-col jc-between">
                        <div 
                            className="checkin-camp-name elli-text on-log on-visible flex-grow-1" 
                            data-log-region="checkin-camp-list"
                            data-log-pos={this.props.index + 1} 
                            onClick={() => {locationTo(`/wechat/page/camp-detail?campId=${campId}`)}}
                        >
                            {name}
                        </div>
                        
                        <div className="checkin-camp-signs flex flex-row flex-vcenter jc-between">
                            <div className="checkin-camp-price flex flex-row flex-vcenter">
                                { 
                                    price ?
                                        <span className="bold">￥{price}</span> 
                                    : 
                                        <span className="free-camp bold">免费</span> 
                                }
                                {
                                    openBonusPlan && <div className="checkin-camp-bonus-return" />
                                }
                            </div>
                            {
                                timeAfterStr == '进行中' ? 
                                    <span className="process-sign checkin-camp-processing" />
                                : 
                                    timeAfterStr == '已结束' ? 
                                        <span className="checkin-camp-ended" />
                                    : 
                                        <span className="checkin-camp-not-start">{timeAfterStr}</span>
                            }
                        </div>

                        <div className="checkin-camp-stat flex flex-row jc-between">
                            <div>
                            {
                                isShowAffairCount === 'Y' && <span className="checkin-num">{digitFormat(checkinTimes)}次打卡</span>
                            }
                            {
                                isShowAffairCount == 'Y' && isShowAuthNum == 'Y' && <span className="divide-bar">|</span>
                            }
                            {
                                isShowAuthNum === 'Y' && <span className="auth-num">{digitFormat(authNum)}人参与</span>
                            }
                            </div>
                        {
                            clientRole === 'B' &&
                            <div 
                                className="checkin-camp-arrange on-log on-visible" 
                                data-log-region="checkin-camp-list-option" 
                                data-log-pos={this.props.index + 1} 
                                onClick={() => {
                                    displayBottomActionSheet(camp, this.props.index)
                                }}
                            />  
                        }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

CheckinCampCard.propTypes = {
    camp: PropType.object.isRequired,
    sysTime: PropType.number.isRequired,
    clientRole: PropType.string.isRequired,
    displayBottomActionSheet: PropType.func,
    isShowAuthNum: PropType.string,
    isShowAffairCount: PropType.string,
}

CheckinCampCard.defaultProps = {
    isShowAuthNum: 'Y',
    isShowAffairCount: 'Y',
}

export default CheckinCampCard;