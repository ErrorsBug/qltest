import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import ClockRank from '../../components/clock-rank'
import { getUrlParams } from 'components/url-utils';
import CampPosterBox from '../../components/show-camp-poster'
import { getStudentInfo } from '../../actions/home'
import PopularityRankRules from '../../components/popularity-rank-rules'
import ShowClockReward from '../../components/show-clock-reward'
import { formatDate, formatNumber } from 'components/util'
import { getRankList, getGiftList, getCheckInPosterInfo, getSubjectInfo } from '../../actions/camp'

@autobind
class PopularRank extends Component {
    state = {
        rankList:[],
        noData:false,
        isMore: false,
        isPoster: false,
        userInfo: {},
        posterInfo: {},
        isRule: false, 
        ruleInfo: {},
        isReward: false, 
        subjectInfo: {}
    }
    isLoading = false;
    page = {
        page: 1,
        size: 20,
    }
    get campId(){
        return getUrlParams('campId', '')
    }
    get periodId() {
        return getUrlParams('periodId', '')
    }
    componentDidMount(){
        this.getStudentInfo();
        this.getGiftList();
        this.getRankList();
        this.getCheckInPosterInfo();
        this.getSubjectInfo(new Date().getTime());
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }
    // 初始化缓存
    initStore(flag) {
        const time = localStorage.getItem(`reward${this.periodId}`)
        if(!time || (time && new Date(Number(time)).toDateString() != new Date().toDateString())){
            this.setState({
                isReward: flag
            })
        }
    }
    // 获取用户信息
    getStudentInfo = async () => {
        const { studentInfo } = await getStudentInfo();
        this.setState({
            userInfo: studentInfo || {}
        })
    }
    // 获取礼包
    async getGiftList() {
        const res = await getGiftList();
        this.setState({
            ruleInfo: res || {},
        })
    }
    // 打卡主题信息
    getSubjectInfo = async (time) => {
        const res = await getSubjectInfo({periodId: this.periodId, date: time});
        this.initStore(Object.is(res?.isCheckIn, 'Y'));
        this.setState({
            subjectInfo: res || {}
        })
    }
    // 获取海报信息
    async getCheckInPosterInfo() {
        const res = await getCheckInPosterInfo({periodId: this.periodId, date: new Date().getTime()});
        this.setState({
            posterInfo: res || {}
        })
    }
    // 获取人气排行
    async getRankList() {
        const { rankList, currentUser } = await getRankList({campId: this.campId, page: this.page.page, size: this.page.size}) || [];
        if(!rankList || (!!rankList && rankList.length >=0 && rankList.length < this.page.size)){
            this.setState({
                isMore: true
            })
        } 
        this.page.page += 1;
        const list = rankList || []
        this.setState({
            userRank: currentUser || {},
            rankList: [...this.state.rankList, ...list],
        })
    }
    // 下拉加载
    async loadNext(next) {
        const { isMore } = this.state;
        if(this.isLoading || rankMore) return false;
        this.isLoading = true;
        await this.getRankList()
        this.isLoading = false
        next && next();
    }
    // 显示每日打卡海报
    showPoster() {
        this.setState({
            isPoster: !this.state.isPoster
        })
    }
    // 处理规则弹窗
    handleRule() {
        this.setState({
            isRule: !this.state.isRule
        })
    }
    // 隐藏奖金
    hideReward() {
        localStorage.setItem(`reward${this.periodId}`, new Date().getTime())
        this.setState({
            isReward: false
        })
    }
    render() {
        const { rankList, noData, isMore, isPoster, userInfo, posterInfo, isRule, ruleInfo, isReward, userRank } = this.state 
        return (
            <Page title="人气值实时榜单" className="un-popularity-rank">
                <ScrollToLoad 
                    className={"scroll-content-container pop-rank-scroll"}
                    toBottomHeight={300}
                    noMore={ isMore }
                    noneOne={noData}
                    emptyMessage="暂无更多"
                    loadNext={ this.loadNext }>
                    <div className="rank-introduce">
                        <div className="background-frag">
                            <div className="background-light">
                                <h2>恭喜你完成今日打卡</h2>
                                <div onClick={ this.showPoster } data-desc="分享成就海报"></div>
                                <p>你的同学们通过晒成就海报攒了不少人气呢！</p>
                            </div>
                        </div>
                    </div>
                    <div className="rank-rules">
                        <h3>人气值实时榜单</h3>
                        <div onClick={ this.handleRule }>必读《规则玩法+奖品介绍+惊喜彩蛋》</div>
                        <p>越多人查看你的海报人气值就越高，高人气还有奖励哦！</p>
                    </div>
                    <ClockRank style={{'marginTop':'-15px'}} userRank={ userRank }list={rankList}/>
                </ScrollToLoad>
                { isPoster && (
                    <CampPosterBox 
                        { ...posterInfo } 
                        { ...userInfo } 
                        hidePoster={ this.showPoster }
                        periodId={ this.periodId } 
                        campId={ this.campId } />
                ) }
                { isRule && <PopularityRankRules goBack={ this.handleRule } ruleInfo={ ruleInfo } /> }
                { isReward && (
                    <ShowClockReward 
                        rewardName="每日打卡奖励" 
                        styleObj={{'backgroundColor':'#FF7033'}} 
                        headLogo="time" 
                        footerTxt={ `领取后自动延长${ formatNumber(Number(ruleInfo.checkIn) / 24) }天，有效期顺延至${ formatDate(userInfo.expireTime, 'yyyy/MM/dd') }` }
                        clickFunc={ this.hideReward }>
                            <div className="pr-dialog-box">
                                <p className="name">大学时长</p>
                                <p className="content">{ formatNumber(Number(ruleInfo.checkIn) / 24) }天</p>
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

module.exports = connect(mapStateToProps, mapActionToProps)(PopularRank);