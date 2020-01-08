import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators';
import {campBasicInfoModel, campAuthInfoModel} from '../../../../model';
import { getVal, locationTo, imgUrlFormat } from 'components/util';
import ReactLoading from 'react-loading';

const peopleIcon = require("../../img/icon-people.png");
// let renderTimes = 0
@autobind
export class CampInfo extends PureComponent {
    static propTypes = {

    }
    
    onAuthNumClick(campId) {
        if (!this.props.allowMGLive) {
            return;
        }
        locationTo(`/wechat/page/join-list/camp?id=${campId}`)
    }

    goInvite() {
        const {campId} = this.props.basicInfo;
        let lshareKeyStr = '';
        console.log(this.props.lshareKey);
        if(this.props.lshareKey.length>0){
            lshareKeyStr = '&lshareKey=' + this.props.lshareKey;
        }
        locationTo(`/wechat/page/sharecard?type=camp&campId=${campId}&liveId=${this.props.basicInfo.liveId}&sourceNo=link${lshareKeyStr}`);
    }

    render() {
        const { 
            actualAmount,
            allAffairNum,
            authNum,
            bonusPercent,
            campId,
            headImage,
            liveId,
            name,
            price,
            dateInfo,
        } = this.props.basicInfo;

        const {
            currentDays,
            totalDays,
            startDate,
            endDate,
        } = dateInfo;

        let currentDaysText = '';

        if (currentDays) {
            currentDaysText = currentDays < 0 ? '未开始' : currentDays > totalDays ? '已结束' : `第${currentDays}天`;
        }
        // console.log(allAffairNum);

        // console.log(++renderTimes)

        return (
            <div className="camp-info-container">
                <div className="top-info">
                    <div className="head-img common-bg-img" style={{backgroundImage: `url(${headImage && imgUrlFormat(headImage, '?x-oss-process=image/resize,m_fill,limit_0,w_480,h_300') || ''})`}} />
                    <div className="top-right">
                        <div className="camp-title common-multi-text"><code>{name}</code></div>
                        <div className="detail-info">
                            <div className="days"> {currentDaysText} | 共{totalDays}天</div>
                            {
                                this.props.payStatus === 'Y' || this.props.allowMGLive ?
                                <div className="num" onClick={() => this.onAuthNumClick(campId)}>
                                    <span>{`${authNum}人参与`}</span>
                                    <span>{`${allAffairNum || 0 }次打卡`}</span>
                                    {
                                        this.props.allowMGLive ? 
                                        <span className="icon_enter"></span> :
                                        null
                                    }
                                </div> :
                                <div className="date">{`${startDate} - ${endDate}`}</div>
                            }
                        </div>
                        <div className="icon-invite" onClick={this.goInvite}></div>
                    </div>
                </div>
                {
                    this.props.payStatus === 'N' && !this.props.allowMGLive ?
                    <div className="bottom-info">
                        <div className="info">
                            <span className="info-icon common-bg-img" style={{backgroundImage: `url(${peopleIcon})`}} ></span>
                            <span className="info">{authNum}人参加 | {allAffairNum || 0}次打卡</span>
                        </div>
                        <div className="head-img-list">
                            {
                                this.props.userHeadList.map((imgUrl,idx) => {
                                    if (idx >= 6) return null
                                    return (
                                        <span key={idx} className="head-img common-bg-img" style={{backgroundImage:`url(${imgUrl})`}}></span>
                                    )
                                })
                            }
                        </div>
                    </div> :
                    null
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    // basicInfo: getVal(state, 'campBasicInfo'),
    // basicInfo: {dateInfo:{}},
    // allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
    // allowMGLive: false,
    // payStatus: getVal(state, 'campAuthInfo.payStatus', 'N'),
    // payStatus: 'N',
    // userHeadList: getVal(state, 'campUserList.userHeadList', []).slice(0,6),
    // userHeadList: [],

    return {
        basicInfo: getVal(state, 'campBasicInfo'),
        allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
        payStatus: getVal(state, 'campUserInfo.payStatus', 'N'),
        userHeadList: getVal(state, 'campUserList.userHeadList', []),
        lshareKey: getVal(state, 'channelIntro.lshareKey',''),
    }
};

export default connect(mapStateToProps)(CampInfo)

CampInfo.defaultProps = {
        // basicInfo: getVal(state, 'campBasicInfo'),
        basicInfo: {dateInfo:{}},
        // allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
        allowMGLive: false,
        // payStatus: getVal(state, 'campAuthInfo.payStatus', 'N'),
        payStatus: 'N',
        // userHeadList: getVal(state, 'campUserList.userHeadList', []).slice(0,6),
        userHeadList: [],
    
}