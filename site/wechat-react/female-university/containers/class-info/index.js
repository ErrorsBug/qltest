import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import Placard from './components/placard';
import ScrollToLoad from 'components/scrollToLoad';
import ClassmateItem from './components/classmate-item';
import PortalCom from '../../components/portal-com';
import { MiddleDialog } from 'components/dialog';
import { getClassInfo, getStudentInfo, getCardRank, getRankOverview } from '../../actions/home';
import { universityflagListClassCard, universityflagCardLike, universityFlag } from '../../actions/flag'; 
import { getUrlParams } from 'components/url-utils';
import { locationTo } from 'components/util';
import { userBindKaiFang } from "../../../actions/common";
import { isQlchat } from 'components/envi'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import TabNav from './components/tab-nav'
import Ranking from './components/ranking'
import ClassCardItem from './components/class-card-item'

@HandleAppFunHoc
@autobind
class ClassInfo extends Component {
    state = {
        isShowDialog: false,
        lists: [],
        classInfo: {},
        isNoMore: false,
        isNoMoreCard: false,
        studentInfo: {},
        cardList:[], 
        tabIdx: 1,
        mineRank: {},
        ranks: [],
        flagInfo: {  },
        mineRankIdx: -1,
        isShowRule: false,
        rankInfo: {}
    }
    page = {
        page: 1,
        size: 20,
    }
    cardPage= {
        page: 1,
        size: 20,
    }
    weekRanks = [];
    allRanks = [];
    mineWeekRank = null;
    mineAllRank = null;
    isLoading = false;
    classId = ''
    isOnce= false
    async componentDidMount() {
        if(this.props.location.query.tabIdx){
            this.setState({
                tabIdx:(this.props.location.query.tabIdx-1)||1
            })
        }
        const { studentInfo } = await getStudentInfo()
        this.classId = studentInfo.classId || ''
        this.initData();
        this.flagListClassCard();
        this.bindAppKaiFang();
        this.setState({ studentInfo: studentInfo || {}},() => {
            this.getCardRank();
        })
        this.getFlagStatus();
        this.getRankOverview();
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('ln-scroll-box');
    }
    async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId');
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }
    }

    // 初始化数据
    async initData() {
        const { students, classInfo } = await getClassInfo({ classId: this.classId, ...this.page }); 
        if(!!students){
            if(students.length >= 0 && students.length < 20){
                this.setState({
                    isNoMore: true
                })
            } else {
                this.page.page +=1;
            }
        }
        this.setState({
            lists: [...this.state.lists, ...students] || [],
            classInfo: classInfo || {} 
        })
    }

    // 获取学习动态
    async flagListClassCard() { 
        const { dataList } = await universityflagListClassCard({ classId: this.classId, ...this.cardPage });
        if(!!dataList){
            if(dataList.length >= 0 && dataList.length < 20){
                this.setState({
                    isNoMoreCard: true
                })
            } else {
                this.cardPage.page +=1;
            }
        }
        this.setState({ 
            cardList:[...this.state.cardList,...dataList] || []
        })
    }
    

    // 打卡榜单
    async getCardRank(isAll) {
        const { studentInfo } = this.state;
        const params = {
            classId: this.classId,
            type: isAll ? 'ALL' : 'WEEK',
        }
        const { dataList } = await getCardRank(params)
        const arr = dataList || []
        const mineRank = arr.filter((item) => Object.is(studentInfo.userId, item.userId))[0]
        const mineRankIdx = arr.findIndex((item) => Object.is(studentInfo.userId, item.userId))
        this[isAll ? 'allRanks': 'weekRanks'] = arr;
        this[isAll ? 'mineAllRank' : 'mineWeekRank'] = mineRank;
        this.setState({
            ranks: [...arr],
            mineRank: mineRank || {},
            mineRankIdx: mineRankIdx
        })
    }

    // 获取榜单数据
    async getRankOverview(isAll) {
        const params = {
            classId: this.classId,
            type: isAll ? 'ALL' : 'WEEK',
        }
        const res = await getRankOverview(params)
        this.setState({
            rankInfo: res || {}
        })
    }

    // 获取flag状态
    async getFlagStatus() {
        const res = await universityFlag();
        this.setState({ flagInfo: res || {} })
    }

    /**
     * 点赞
     */
    async addClick(cardId,userId){ 
        let addResult = await universityflagCardLike({
            cardId,
            userId, 
        });
    }
    async loadNext(next){ 
        const { tabIdx,isNoMore,isNoMoreCard } = this.state
        if(tabIdx==0&&!isNoMore){
            await this.initData();  
        }
        if(tabIdx==1&&!isNoMoreCard){
            await this.flagListClassCard();  
        }  
        next && next();
    }
    // 显示班级二维码
    showClassQr() {
        const flag = isQlchat()
        if(flag){
            this.props.handleAppSdkFun('sendSubscribeMessage', {
                sendSubscribeMessage: 'university_join_class',
                callback: (res) => {
                }
            })
        } else {
            this.setState({
                isShowDialog: !this.state.isShowDialog
            })
        }
    }
    myFile() {
        locationTo('/wechat/page/university/my-file')
    }
    // Tab的变化
    changeTab(idx) {
        this.setState({tabIdx: idx},()=>{ 
            // 手动触发打曝光日志
            typeof _qla != 'undefined' && _qla.collectVisible();
        })
    }
    // 排行榜切换
    async changeRankIdx(flag){
        await this.getRankOverview(flag);
        if(flag && this.isOnce){
            this.setState({
                ranks: [...this.allRanks],
                mineRank: this.mineAllRank
            })
        } else if(!flag && this.isOnce){
            this.setState({
                ranks: [...this.weekRanks],
                mineRank: this.mineWeekRank
            })
        } else {
            await this.getCardRank(flag);
            this.isOnce = true;
        }
    }
    // 处理规则显示隐藏
    hideRankRule() {
        this.setState({
            isShowRule: !this.state.isShowRule
        })
    }
    // 根据tab渲染不同数据
    renderTab() {
        const { tabIdx, cardList=[], studentInfo, lists, ranks, mineRank, flagInfo,   rankInfo } = this.state;
        const mineRankIdx = ranks.findIndex((item) => Object.is(studentInfo.userId, item.userId))
        if(tabIdx === 0){
            return (<Fragment>
                { !!studentInfo.userId && <ClassmateItem key={0} { ...studentInfo } /> }
                { lists.map((item, index) => (
                    <ClassmateItem { ...item } key={ index + 1 }/>
                )) }
            </Fragment>)
        }
        if(tabIdx === 1){
            return (
                <Fragment>
                    {
                        cardList.length>0 ? 
                        cardList.map((item,index)=>{
                            return <ClassCardItem { ...item } key={ index + 1 }  addClick={this.addClick}/>
                        })
                        :
                        <div className="ci-list-empty">
                            <img src={'https://img.qlchat.com/qlLive/business/TDBGO3ND-HRY5-WIBE-1564047158809-E68IGWCDMPEI.png'} />
                            <p>暂无学习动态</p>
                        </div>
                    }
                </Fragment>
            )
        }
        if(tabIdx === 2) {
            return (<Ranking 
                    ranks={ ranks || [] } 
                    mineRank={ mineRank || {} } 
                    rankInfo={rankInfo}
                    flagInfo={ flagInfo } 
                    mineRankIdx={ mineRankIdx } 
                    studentInfo={studentInfo}
                    />)
        }
    }
    render(){
        const { isShowDialog, classInfo, isNoMore,isNoMoreCard, studentInfo, tabIdx, isShowRule } = this.state 
        return (
            <Page title={ `${ studentInfo.year || '' }级(${ studentInfo.classNo || '' })班` } className="cl-class-box">
                <ScrollToLoad
                    className={"ln-scroll-box"}
                    toBottomHeight={300}
                    disable={ tabIdx==0?isNoMore:tabIdx==1?isNoMoreCard:true }
                    loadNext={ this.loadNext }>
                    <div className="ci-container-bg">
                        <Placard notice={ classInfo.notice } />
                        <div className="ln-class-list">
                            <TabNav changeTab={ this.changeTab } hideRankRule={ this.hideRankRule } changeRankIdx={ this.changeRankIdx } tabIdx={tabIdx} />
                            { this.renderTab() }
                        </div>
                        { isNoMore && tabIdx === 0 && <div className="cl-class-more">更多同学在报到的路上哦</div> }
                    </div>
                </ScrollToLoad>
                { tabIdx === 0 && (
                    <PortalCom className="cl-class-qr">
                        <div 
                            className="cl-class-btn on-visible on-log" 
                            data-log-name="辅导员微信"
                            data-log-region="un-class-qr"
                            data-log-pos="0"
                            onClick={ this.showClassQr }>加入班级</div>
                    </PortalCom>
                ) }
                <MiddleDialog
                    show={isShowDialog}
                    onClose={this.showClassQr}
                    className="cl-dialog-box">
                        <img src={ classInfo.qrCode } />
                </MiddleDialog>
                { isShowRule && (
                    <PortalCom className="rank-rule-box">
                        <div className="rank-rule-cont">
                            <div className="rank-rule-txt">
                                <h4>排名规则</h4>
                                <p><span> 1、</span>打卡1次得1分，被点赞1次得2分。</p>
                                <p><span> 2、</span>依据个人的总得分进行排名，得分越高排名越靠前。若得分一样，最先达到该分数的用户排前面。
                                </p>
                                <p><span> 3、</span>排名分为周榜和总榜，周榜为本周的打卡得分排名，周日晚上24点清零重新统计。总榜为历史累计打卡得分排名。
                                </p>
                            </div>
                            <div className="rank-rule-btn  on-log on-visible"
                                data-log-name='我知道了'
                                data-log-region={`rank-rule-btn`}
                                data-log-pos="0" 
                            onClick={ this.hideRankRule }>我知道了</div>
                        </div>
                    </PortalCom>
                ) }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    userBindKaiFang
};

module.exports = connect(mapStateToProps, mapActionToProps)(ClassInfo);