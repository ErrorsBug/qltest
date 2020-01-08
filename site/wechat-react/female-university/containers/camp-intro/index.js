import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import Picture from 'ql-react-picture';
import { getCampInfo, studyCampStatus, setSignUpRemain, getSignUpRemainStatus, getStudentInfo } from '../../actions/home';
import { getUrlParams } from 'components/url-utils';
import { locationTo, formatDate, getVal, formatMoney, formatNumber } from 'components/util';
import AppEventHoc from '../../components/app-event'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import JoinHoc from '../../components/join-dialog/join-hoc';
import DialogCourseConfirm from '../../components/dialog-course-confirm';
import { createPortal } from 'react-dom'
import { fetchIsSubscribeAndQr, bindAppKaiFang } from "../../actions/common";
import CampIntroBtnOther from './components/camp-intro-btn-other'
import PortalComp from '../../components/portal-com';
import CampInfo from './components/camp-info'
import RollingDownNav from 'components/rolling-down-nav'
import { MiddleDialog } from 'components/dialog';
import PressHoc from 'components/press-hoc'
import Footer from '../../components/footer';
import CheckIn from './components/check-in'
import ScrollToLoad from 'components/scrollToLoad';
import PopularityList from './components/popularity-list';
import PosterBtn from './components/poster-btn'
import CampPosterBox from '../../components/show-camp-poster'
import Pubsub from 'pubsub-js'
import ShowClockReward from '../../components/show-clock-reward'
import GraduationPoster from '../../components/show-graduation-poster'
import ShareCertificate from '../../components/share-certificate'
import { getCheckStatus, rewardObj } from './com'
import {
    getTargetStatus, getPaperInfo,
    getCheckInPosterInfo, getSubjectInfo,
    listCheckIn, getRankList, getFirstCheckInTime,
    setRewardStatus, getTargetCount, getStudyCampByPeriodId,
    getGraduationReward, getGraduationLearnInfo, getGiftList
} from '../../actions/camp'

const PortalCom = ({ children, className }) => {
    return createPortal(
        <div className={className}>{children}</div>
        , document.getElementById('app'))
}

const CampIntroEmpty = ({ title }) => {
    return (
        <div className="camp-intro-info">
            <div className="camp-intro-empty">
                <img src="https://img.qlchat.com/qlLive/business/FV7DUE14-HCY9-QN46-1573442248791-72NF9WXG5DLO.png" />
                <div className="camp-intro-empty-title">下一期筹备中</div>
                <div className="camp-intro-empty-tip">敬请期待</div>
            </div>
        </div>
    )
}

const tabs = [
    { name: '学习营介绍' },
    { name: '学习打卡' },
    { name: '人气榜单' },
]

@HandleAppFunHoc
@AppEventHoc
@JoinHoc
@autobind
class CampIntro extends Component {
    state = {
        isShowTip: false,
        qrcode: '',
        isShow: false,
        periodDto: {},
        tabIdx: 0,
        isTarget: false,
        targetTxt: '',
        paperInfo: {},
        subjectInfo: {},
        posterInfo: {},
        checkList: [],
        rankList: [],
        checkMore: false,
        rankMore: false,
        isCheckPoster: false,
        userInfo: {},
        checkStartTime: '',
        checkTotal: 0,
        isCheck: false,
        rewardList: {},
        isEnd: false,
        learnInfo: {},
        isReward: false,
        rewardIdx: 0,
        isStartReward: false,
        curRewardInfo: {},
        isRewardStatus: false,
        ruleInfo: {},
        aimsTotal: 0,
        userRank: {},
        isShowReward: false,
        applyCampInfo: {}
    }
    page = {
        checkPage: 1,
        size: 20,
        rankPage: 1,
    }
    isLoading = false
    get campId() {
        return getUrlParams('campId', '')
    }
    componentDidMount() {
        wx.ready(function () {
            wx.hideAllNonBaseMenuItem()
        });
        this.initData();
        this.getStudentInfo();
        this.getGitftInfo();
        this.getRankList();
        this.listCheckIn();
        Pubsub.subscribe('createAims', () => {
            // 更新状态
            this.getTargetStatus()
        })
        Pubsub.subscribe('editPaper', () => {
            // 更新状态
            this.getPaperInfo()
        })
        bindAppKaiFang()
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }
    // 初始化数据
    async initData() {
        const { periodDto } = await getCampInfo({ campId: this.campId });
        const id = periodDto.recentPeriodId || null; // 用户购买的期数
        if (id) {
            this.periodId = id;
            this.getStudyCampByPeriodId();
            this.getTargetStatus()
            this.getPaperInfo()
            this.getCheckInPosterInfo()
            this.getSubjectInfo();
            this.getGraduationReward();
            this.getGraduationLearnInfo();
            this.getAimsCount();
        }
        this.setState({
            periodDto: periodDto || {},
        })
    }

    handleLink(item) {
        let url = '';
        if (Object.is(item.courseType, 'book')) {
            url = `/topic/details-listening?topicId=${item.courseId}&isUnHome=Y`
        } else if (Object.is(item.courseType, 'topic')) {
            url = `/wechat/page/topic-intro?topicId=${item.courseId}&isUnHome=Y`
        } else {
            url = `/wechat/page/channel-intro?channelId=${item.courseId}&isUnHome=Y`
        }
        locationTo(url)
    }
    calDay({ signupStartTime, name }) {
        let time = new Date(new Date().toDateString()).getTime()
        let day = Math.floor((signupStartTime - time) / (1000 * 60 * 60 * 24))
        if (day > 0) {
            return `第${name}期 -${day}天后开始报名`
        } else {
            return `今天${formatDate(signupStartTime, 'hh:mm')}开始报名`
        }
    }
    async isSetSignUpRemain() {
        const { result } = await getSignUpRemainStatus({ periodId: this.state.periodDto?.id })
        result == 'N' && await setSignUpRemain({ periodId: this.state.periodDto?.id })
    }
    async showTip() {
        this.isSetSignUpRemain()
        fetchIsSubscribeAndQr({
            channel: 'newStudyCampSignUpRemain',
            pubBusinessId: this.state.periodDto?.id,
            isFocusThree: () => {
                this.setState({
                    isShow: true
                })
            },
            unFocusThree: (qrUrl) => {
                this.setState({
                    qrcode: qrUrl,
                    isShowTip: true
                });
            },
        })
    }
    close() {
        this.setState({ isShowTip: false })
    }
    toGroup(groupUrl) {
        if (!this.props.isQlchat) {
            locationTo(groupUrl);
            return
        }
        if (this.props.handleAppSdkFun) {
            this.props.handleAppSdkFun('sendSubscribeMessage', {
                sendSubscribeMessage: 'join_learning_camp',
                campId: this.state.periodDto?.id,
                callback: (res) => {
                    console.log(res)
                }
            })
        }
    }
    // 隐藏提醒弹窗
    onHide() {
        this.setState({
            isShow: false
        })
    }
    // tab切换
    setTab(tabIdx) {
        if (this.state.tabIdx === tabIdx) return false
        this.isLoading = false
        this.setState({
            tabIdx: tabIdx,
        })
    }

    // 获取小目标状态
    getTargetStatus = async () => {
        const { result, target } = await getTargetStatus({ periodId: this.periodId }) || {};
        this.setState({
            isTarget: Object.is(result, 'Y'),
            targetTxt: target
        },() => {
            this.getAimsCount();
        })
    }

    // 获取论文信息
    getPaperInfo = async () => {
        const res = await getPaperInfo({ periodId: this.periodId });
        this.setState({
            paperInfo: res || {}
        })
    }

    // 打卡主题信息
    getSubjectInfo = async () => {
        const res = await getSubjectInfo({ periodId: this.periodId, date: new Date().getTime() });
        this.setState({
            subjectInfo: res || {}
        })
    }

    // 获取海报信息
    getCheckInPosterInfo = async () => {
        const res = await getCheckInPosterInfo({ periodId: this.periodId, date: new Date().getTime() });
        this.setState({
            posterInfo: res || {}
        })
    }
    // 获取打卡列表 
    listCheckIn = async (page) => {
        const { ideaList, total } = await listCheckIn({ campId: this.campId, page: page || this.page.checkPage, size: this.page.size });
        if (!ideaList || (!!ideaList && ideaList.length >= 0 && ideaList.length < this.page.size)) {
            this.setState({
                checkMore: true
            })
        }
        const list = ideaList || []
        let newPage = 1, newList = [];
        if (page) {
            newPage = page
            newList = list
        } else {
            newPage = this.page.checkPage
            newList = [...this.state.checkList, ...list]
        }
        this.page.checkPage = newPage + 1;
        this.setState({
            checkList: newList,
            checkTotal: total || 0
        })
    }
    // 人气排行
    getRankList = async () => {
        let { rankList, currentUser } = await getRankList({ campId: this.campId, page: this.page.rankPage, size: this.page.size });
        if(!rankList || (!!rankList && rankList.length >=0 && rankList.length < this.page.size)){
            this.setState({
                rankMore: true
            })
        } 
        this.page.rankPage += 1;
        const list = rankList || []
        this.setState({
            rankList: [...this.state.rankList, ...list] ,
            userRank: currentUser || {}
        })
    }
    // 获取用户信息
    getStudentInfo = async () => {
        const { studentInfo } = await getStudentInfo();
        this.setState({
            userInfo: studentInfo || {}
        })
    }
    //获取礼包
    getGitftInfo = async () => {
        const res = await getGiftList();
        this.setState({
            ruleInfo: res || {}
        })
    }
    // 下拉加载
    async loadNext(next) {
        const { checkMore, tabIdx, rankMore } = this.state;
        if(tabIdx == 0 || this.isLoading || (tabIdx == 1 && checkMore) || (tabIdx == 2 && rankMore )) return false;
        this.isLoading = true;
        Object.is(tabIdx, 1) ? await this.listCheckIn() : await this.getRankList();
        this.isLoading = false
        next && next();
    }
    // 生成海报
    async generatePoster(editType) {
        if(Object.is(editType, 'check')){
            await this.getCheckInPosterInfo();
        }
        this.setState({
            isCheckPoster: !this.state.isCheckPoster,
            isCheck: Object.is(editType, 'check')
        })
    }
    // 获取当前一期学习营开始打卡日期
    async getFirstCheckInTime(endTime) {
        const { time } = await getFirstCheckInTime({ periodId: this.periodId });
        const type = getCheckStatus(this.props.sysTime, time, endTime)
        const periodId = localStorage.getItem(`campReward_${this.periodId}`)
        this.setState({
            checkStartTime: time || '',
            isEnd: (periodId != this.periodId) && Object.is(type, 'end')
        })
    }
    // 隐藏进入海报
    hidePoster() {
        this.setState({
            isCheckPoster: false,
            isCheck: false
        })
    }
    // 获取毕业典礼信息
    async getGraduationReward() {
        const res = await getGraduationReward({ periodId: this.periodId })
        const result = this.handleRewardData(res)
        const len = this.handleRewardSttus(res)
        const isReward = !!result.length
        const obj = isReward ? result[0] : {}
        const periodId = localStorage.getItem(`campReward_${this.periodId}`)
        this.setState({
            rewardList: result,
            isReward: isReward,
            curRewardInfo: obj,
            isRewardStatus: len !== result.length || periodId != this.periodId,
        })
    }
    // 获取学习时长
    async getGraduationLearnInfo() {
        const res = await getGraduationLearnInfo({ periodId: this.periodId })
        this.setState({
            learnInfo: res || {}
        })
    }
    // 处理是否已领奖
    handleRewardSttus(res) {
        let arr = []
        for (const vlaue of Object.values(res)) {
            if (typeof (vlaue) == 'object') {
                Object.is(vlaue?.status, 'N') && arr.push(vlaue)
            }
        }
        return arr.length;
    }
    // 获取小目标数量
    async getAimsCount() {
        const res = await getTargetCount({ periodId: this.periodId })
        this.setState({
            aimsTotal: res?.total || 0
        })
    }
    // 处理典礼数据
    handleRewardData(res) {
        let list = []
        if(!res) return list
        const { userInfo } = this.state;
        const types = ['diploma', 'fullAttendance', 'cash', 'addHours', 'schoolBadge', 'notebook']
        for (const key in types) {
            const flag = typeof (res[types[key]]) == 'object' && Object.is(res[types[key]]?.status, 'Y') && Object.is(res[types[key]]?.isShow, 'Y')
            const footerTxt = '奖金已发放到你的微信钱包，请查收哦'
            if (flag) {
                if (Object.is(types[key], 'addHours') || Object.is(types[key], 'fullAttendance')) {
                    footerTxt = `领取后自动延长${formatNumber((res[types[key]].hours || 0) / 24)}天，有效期顺延至${formatDate(userInfo.expireTime, 'yyyy/MM/dd')}`
                }
                if (Object.is(types[key], 'schoolBadge') || Object.is(types[key], 'notebook')) {
                    footerTxt = '填写收货地址后，我们将邮寄周边给您~'
                }
                !Object.is(types[key], 'diploma') && (res[types[key]].footerTxt = footerTxt)
                list.push({ ...res[types[key]], ...rewardObj[types[key]] })
            }
        }
        return list
    }
    // 开始领奖
    receiveAnAward() {
        this.setState({
            isStartReward: true,
            isEnd: false,
        })
    }
    // 领取奖项
    async rewardAwardBtn(key) {
        const { rewardList, rewardIdx } = this.state;
        const { result } = await setRewardStatus({ key: key, periodId: this.periodId })
        if (Object.is(result, 'Y')) {
            const nextIdx = rewardIdx + 1
            if(!rewardList[nextIdx]) {
                localStorage.setItem(`campReward_${this.periodId}`, this.periodId)
            }
            this.setState({
                isStartReward: !!rewardList[nextIdx],
                curRewardInfo: rewardList[nextIdx],
                rewardIdx: nextIdx
            })
        } else {
            window.toast('领取失败，请稍后再试！')
        }
    }
    // 显示毕业典礼海报
    onShowCert() {
        const { rewardList } = this.state;
        localStorage.setItem(`campReward_${this.periodId}`, this.periodId)
        this.setState({
            isShowReward: !this.state.isEnd && !this.state.isShowReward,
            isEnd: false,
            curRewardInfo: rewardList[0] || {}
        })
    }
    // 用户报名最近期数学习营
    async getStudyCampByPeriodId() {
        const { periodDto } = await getStudyCampByPeriodId({ periodId: this.periodId })
        this.getFirstCheckInTime(periodDto.graduationTime)
        const flag = periodDto.isSignUp && (periodDto.signUpType == 'direct' || periodDto.signUpType == 'reservation')
        this.setState({
            applyCampInfo: periodDto || {},
            tabIdx: flag ? 1 : 0
        })
    }
    // 渲染领奖
    renderReward() {
        const { curRewardInfo } = this.state;
        // 全勤
        if (Object.is(curRewardInfo.key, 'FULL_ATTENDANCE')) {
            return (
                <div className="pr-dialog-box">
                    <p className="name">奖励全勤的你，获得大学时长</p>
                    <p className="content">{formatNumber(Number(curRewardInfo.hours || 0) / 24)}天</p>
                </div>
            )
        }
        //  现金
        if (Object.is(curRewardInfo.key, 'CASH')) {
            return (
                <div className="pr-dialog-box">
                    <p className="name">人气榜第{curRewardInfo.position}，获得红包</p>
                    <p className="content"><span>￥</span>{formatMoney(curRewardInfo.money)}</p>
                </div>
            )
        }
        // 小时
        if (Object.is(curRewardInfo.key, 'ADD_HOURS')) {
            return (
                <div className="pr-dialog-box">
                    <p className="name">人气榜前{curRewardInfo.topN}，获得大学时长</p>
                    <p className="content">{formatNumber(Number(curRewardInfo.hours || 0) / 24)}天</p>
                </div>
            )
        }
        // 大学周边
        if (Object.is(curRewardInfo.key, 'SCHOOL_BADGE')) {
            return (
                <div className="pr-dialog-box">
                    <p className="name">《{ curRewardInfo.text }》</p>
                </div>
            )
        }
        if (Object.is(curRewardInfo.key, 'NOTEBOOK')) {
            return (
                <div className="pr-dialog-box">
                    <p className="name">《{ curRewardInfo.text }》</p>
                </div>
            )
        }
        return null;
    }
    render() {
        const { periodDto, isShowTip, qrcode, isShow, tabIdx, isTarget, paperInfo, subjectInfo, posterInfo, userInfo, rewardList,
             isCheck, isEnd, isRewardStatus, aimsTotal, userRank, rankMore, isShowReward, applyCampInfo, curRewardInfo, ruleInfo, 
            checkList, rankList, targetTxt, checkMore, isCheckPoster, checkStartTime, checkTotal, learnInfo, isReward, isStartReward } = this.state;
        const { id, name, studyCampConfigDto, isSignUp, signUpType, groupUrl, startTime, recentPeriodId } = periodDto;
        const { graduationTime } = applyCampInfo;
        const { sysTime, isQlchat } = this.props
        let status = studyCampStatus({ ...periodDto, sysTime })
        const isSignStaus = !!applyCampInfo.isSignUp && (applyCampInfo.signUpType == 'direct' || applyCampInfo.signUpType == 'reservation')
        return (
            <Page title={studyCampConfigDto?.title} className="camp-intro-box">
                <ScrollToLoad
                    toBottomHeight={500}
                    disable={ tabIdx == 0 || (tabIdx == 1 && !checkList.length) || (tabIdx == 2 && !rankList.length) }
                    // disable={tabIdx == 0 || (tabIdx == 1 && !checkList.length) || (tabIdx == 2)}
                    // noMore={(tabIdx == 1 && checkMore)}
                    noMore={(tabIdx == 1 && checkMore) || (tabIdx == 2 && rankMore)}
                    loadNext={this.loadNext}
                    className={`scroll-content-container ${!Object.is(periodDto.collectStatus, 'Y') ? 'no-btm' : ''}`}>
                    <div className="camp-intro-pic">
                        <Picture src={studyCampConfigDto?.imageUrl || ''} placeholder={true} />
                    </div>
                    <div className="camp-intro-info no-btm">
                        <div className="camp-intro-head">
                            <div className="ln-course-bottom">
                                 <h3>{ name && <span>第{name}期</span>}{studyCampConfigDto?.title}</h3>
                                { studyCampConfigDto?.remark && <p><i className="iconfont iconyinhao"></i>{studyCampConfigDto?.remark}</p> }
                            </div>
                            <RollingDownNav
                                scrollNode="scroll-content-container"
                                outerClass="cf-out-tag"
                                innerClass="cf-inner-tag"
                            >
                                <div className="cf-tag-list">
                                    {tabs.map((item, index) => (
                                        <p key={index} onClick={() => this.setTab(index)}>
                                            <span className={tabIdx === index ? 'action' : ''}>
                                                {item.name}
                                                {(index === 1 && !!checkTotal) && <i>{Number(checkTotal) >= 999 ? '999+' : checkTotal}</i>}
                                            </span>
                                        </p>
                                    ))}
                                </div>
                                { tabIdx == 1 && !(isSignStaus) && (
                                    <div className="eb-tip-box">报名加入学习营，才可参与有奖的打卡学习活动哦~</div>
                                ) }
                            </RollingDownNav>
                        </div>
                    </div>
                    {tabIdx == 0 && (<>
                        {
                            id !== null && studyCampConfigDto?.status == 'Y' ? (
                                <>
                                    <CampInfo name={name} {...this.props } handleLink={ this.handleLink } typeSts={status} isQlchat={this.props.isQlchat} showTip={ this.showTip } {...periodDto} otherProps={this.props} />
                                    <Footer />
                                </>
                            ) : (
                                <CampIntroEmpty {...studyCampConfigDto} />
                            )
                        }
                    </>)}
                    {tabIdx == 1 && (
                        <CheckIn
                            ruleInfo={ruleInfo}
                            isTarget={isTarget}
                            sysTime={sysTime}
                            periodId={recentPeriodId}
                            paperInfo={paperInfo}
                            subjectInfo={subjectInfo}
                            posterInfo={posterInfo}
                            checkList={checkList}
                            campId={this.campId}
                            targetTxt={targetTxt}
                            listCheckIn={this.listCheckIn}
                            generatePoster={this.generatePoster}
                            checkStartTime={checkStartTime}
                            userInfo={userInfo}
                            learnInfo={learnInfo}
                            aimsTotal={ aimsTotal }
                            getSubjectInfo={ this.getSubjectInfo }
                            onShowCert={ this.onShowCert }
                            isQlchat={ isQlchat }
                            {...this.props}
                            {...applyCampInfo}/>
                    )}
                    {tabIdx == 2 && (
                        <>
                            <PopularityList rankList={rankList} userRank={ userRank } ruleInfo={ruleInfo}/>
                            {Object.is( subjectInfo.isCheckIn, 'Y') && !isCheckPoster &&  (<PosterBtn generatePoster={this.generatePoster} />) }
                        </>
                    )}
                </ScrollToLoad>
                {isShow && (
                    <PortalComp className="camp-set-box">
                        <div>
                            <div className="camp-set-info">
                                <h4>设置成功</h4>
                                <p>我们将在开始报名前10分钟通过</p>
                                <p><span>女子大学公众号</span>提醒你，请保持关注哦~</p>
                            </div>
                            <div className="camp-set-btn" onClick={this.onHide}>我知道了</div>
                        </div>
                    </PortalComp>
                )}
                {
                    createPortal(
                        <MiddleDialog
                            show={isShowTip}
                            onClose={this.close}
                            className={"ln-course-dialog"}>
                            <div className="ln-course-dialog-close" onClick={this.close}><i className="iconfont iconxiaoshanchu"></i></div>
                            <div className="ln-course-dialog-title">长按扫码，添加报名提醒</div>
                            <div className="ln-course-dialog-tip">开始报名前10分钟，我们将通过公众号提醒你</div>
                            <div className="ln-course-dialog-qrcode">
                                <PressHoc region="un-course-dialog-qrcode">
                                    <img src={qrcode} />
                                </PressHoc>
                            </div>
                        </MiddleDialog>
                        , document.getElementById('app'))
                }
                {isCheckPoster && (
                    <CampPosterBox
                        {...posterInfo}
                        {...userInfo}
                        periodId={recentPeriodId}
                        isCheck={ isCheck }
                        hidePoster={isCheck ? null : this.hidePoster}
                        campId={this.campId} />
                )}
                {(isEnd && !!graduationTime && isRewardStatus && isSignStaus) && (
                    <GraduationPoster
                        isBtn={ isReward }
                        learnInfo={learnInfo}
                        endTime={graduationTime}
                        key={0}
                        userName={ userInfo.userName }
                        onClose={ this.onShowCert }
                        receiveAnAward={this.receiveAnAward} />
                )}
                {(isStartReward || isShowReward) && (
                    <>
                        {(Object.is(curRewardInfo.key, 'DIPLOMA') || isShowReward) ? (
                            <ShareCertificate
                                endTime={graduationTime}
                                type={curRewardInfo.key}
                                userName={userInfo.userName}
                                campName={posterInfo.campName}
                                isShowReward={ isShowReward }
                                bgUrl={ applyCampInfo?.studyCampConfigDto?.diplomaBgImgUrl }
                                rewardAwardBtn={ isShowReward ? this.onShowCert : this.rewardAwardBtn} />
                        ) : (
                                <ShowClockReward
                                    rewardName={curRewardInfo.title}
                                    styleObj={{ 'backgroundColor': curRewardInfo.bg }}
                                    headLogo={curRewardInfo.headLogo}
                                    type={curRewardInfo.key}
                                    footerTxt={curRewardInfo.footerTxt}
                                    clickFunc={this.rewardAwardBtn}>
                                    {this.renderReward()}
                                </ShowClockReward>
                            )}
                    </>
                )}
                { /*===================================*/}
                { tabIdx == 0 && (
                    <>
                        {
                            status == "D" || studyCampConfigDto?.status == 'N' ?
                                ""
                                :
                                //已报名
                                (isSignUp && (signUpType == 'direct' || (signUpType == 'reservation' && status != "A"))) ?
                                    (
                                        <PortalCom className="camp-intro-btn stop">
                                            <div className="camp-intro-tip">
                                                <img src="https://img.qlchat.com/qlLive/business/R5NCW9WD-BGOD-28TA-1572945645904-5A2A85D427YZ.png" />
                                            </div>
                                            <div className="camp-intro-join on-visible on-log"
                                                data-log-name="马上报名"
                                                data-log-region="un-camp-intro-join-stop"
                                                data-log-pos="0"
                                                onClick={() => { this.toGroup(groupUrl) }}><span>您已报名成功，请进群学习</span>  <i className="iconfont iconxiaojiantou"></i></div>
                                        </PortalCom>
                                    )
                                    :
                                    isSignUp && signUpType == 'reservation' ?
                                        //已预约
                                        (
                                            <PortalCom className="camp-intro-btn full willbe">
                                                <div className="camp-intro-join">您已被保送该期（{formatDate(startTime, 'MM月dd日')}开营）</div>
                                            </PortalCom>
                                        )
                                        :
                                        //没到报名时间
                                        status == "A" ?
                                            <PortalCom className="camp-intro-btn full begin">
                                                <div className="camp-intro-join">{this.calDay({ ...periodDto })}</div>
                                            </PortalCom>
                                            :
                                            //正在报名
                                            status == "B" ?
                                                (
                                                    <PortalCom className="camp-intro-btn">
                                                        <DialogCourseConfirm
                                                            className="on-visible on-log"
                                                            data-log-name="马上报名"
                                                            data-log-region="un-camp-intro-join-show"
                                                            data-log-pos="0"
                                                            campInfo={{ ...periodDto, type: "direct" }}
                                                            handleAppSdkFun={this.props.handleAppSdkFun}>
                                                            <div className="camp-intro-join">立即报名</div>
                                                        </DialogCourseConfirm>
                                                    </PortalCom>
                                                )
                                                : status == "C" ?
                                                    //正在报名,人数已满
                                                    <CampIntroBtnOther currentPeriod={name} campId={this.campId} />
                                                    : ''
                        }
                    </>
                ) }
            </Page>
        );
    }
}

const mapStateToProps = (state) => ({
    sysTime: getVal(state, 'common.sysTime'),
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(CampIntro);