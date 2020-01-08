import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import Calendar from './components/calendar'
import { getUrlParams } from 'components/url-utils';
import { formatDate, formatNumber } from 'components/util';
import { getStudentInfo } from '../../actions/home'; 
import ShowClockReward from '../../components/show-clock-reward'
import { getCheckInCalendar, getAppendCouponInfo, getSubjectInfo, getStudyCampByPeriodId, getGiftList } from '../../actions/camp'

@autobind
class OpenCalendar extends Component {
    state = {
        isShow: false,
        dateList: [],
        couponInfo: {},
        campInfo: {},
        userInfo: {},
        subjectInfo: {},
        isReward: false,
        ruleInfo: {}
    }
    get campId(){
        return getUrlParams('campId', '')
    }
    get periodId() {
        return getUrlParams('periodId', '')
    }
    componentDidMount() {
        this.initData();
        this.getStudentInfo();
        this.getGitftInfo()
        this.getAppendCouponInfo();
        this.getSubjectInfo(new Date().getTime());
    }
    // 初始化数据
    async initData() {
        const { periodDto } = await getStudyCampByPeriodId({ periodId: this.periodId });
        this.getCheckInCalendar(periodDto?.graduationTime);
        this.setState({
            campInfo: periodDto || {}
        })
    }
    // 获取打卡日历
    async getCheckInCalendar(time) {
        const res = await getCheckInCalendar({ periodId: this.periodId });
        const list = res?.list || []
        this.setState({
            dateList: [...list, {  checkInStatus: 'END', date: time }]
        })
    }
    // 获取补卡信息
    async getAppendCouponInfo() {
        const res = await getAppendCouponInfo({ periodId: this.periodId });
        this.setState({
            couponInfo: res || {}
        })
    }
    // 获取用户信息
    getStudentInfo = async () => {
        const { studentInfo } = await getStudentInfo();
        this.setState({
            userInfo: studentInfo || {}
        })
    }
    // 打卡主题信息
    getSubjectInfo = async (time) => {
        const res = await getSubjectInfo({periodId: this.periodId, date: time});
        this.setState({
            subjectInfo: res || {}
        })
    }
    // 隐藏奖励
    hideReward() {
        localStorage.setItem(`reward${this.periodId}`, new Date().getTime())
        this.setState({
            isReward: false
        })
    }
    // 显示奖励
    showReward() {
        this.setState({
            isReward: true
        })
    }
    //获取礼包
    getGitftInfo = async () => {
        const res = await getGiftList();
        this.setState({
            ruleInfo: res || {}
        })
    }
    render() {
        const { dateList, couponInfo, userInfo, subjectInfo, isReward, ruleInfo, campInfo } = this.state;
        const isSignStaus = !!campInfo.isSignUp && (campInfo.signUpType == 'direct' || campInfo.signUpType == 'reservation')
        return (
            <Page title="打卡日历" className="oc-open-box">
                <section className="scroll-content-container">
                    <Calendar 
                        list={ dateList } 
                        periodId={ this.periodId } 
                        campId={ this.campId } 
                        userInfo={ userInfo }
                        subjectInfo={ subjectInfo }
                        updateChange={ this.showReward }
                        getSubjectInfo={ this.getSubjectInfo }
                        isSignStaus={ isSignStaus }
                        couponInfo={ couponInfo } />
                </section>
                { isReward && (
                    <ShowClockReward 
                        rewardName="每日打卡奖励" 
                        styleObj={{'backgroundColor':'#FF9C01'}} 
                        headLogo="popular" 
                        footerTxt={ `领取后自动延长${ formatNumber(Number(ruleInfo.checkIn || 0) / 24)}天，有效期顺延至${ formatDate(userInfo.expireTime, 'yyyy/MM/dd') }` }
                        clickFunc={ this.hideReward }>
                            <div className="pr-dialog-box">
                                <p className="name">获得大学时长</p>
                                <p className="content">{formatNumber(Number(ruleInfo.checkIn || 0) / 24)}天</p>
                            </div>
                    </ShowClockReward>
                ) }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(OpenCalendar);