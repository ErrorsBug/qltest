import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Page from 'components/page';
import Carousel from 'components/carousel';
import HorizontalMarquee from 'components/horizontal-marquee';
import { AudioSlicePlayer } from 'components/audio-player';
import { share } from 'components/wx-utils';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate, timeAfter, locationTo } from 'components/util';
import { api } from '../../../../actions/common';
import ReprintModal from '../components/reprint-modal';
import SelectLive from '../components/select-live';
import ChannelItemCard from '../components/channel-item-card';
import MiddleDialog from 'components/dialog/middle-dialog';
import ReprintPushBox from 'components/dialogs-colorful/reprint-push-box';

@autobind
class HighDivisionActivity extends Component {
    state = {
        // 当前选择的课程Tab
        activeTab: 'activity-underway',
        // 课程Tabs
        tabs: [
            {
                id: 'activity-underway',
                name: '进行中',
            },
            {
                id: 'activity-notice',
                name: '活动预告',
            }
        ],
        // 活动中的课程列表数据
        coursesInActivity: [],
        // 活动预告的课程列表数据
        coursesToActivity: [],
        // "进行中"Tab数据加载完毕
        underwayNoMore: false,
        // "进行中"Tab是空页面
        underwayNoOne: false,
        // "预告"Tab数据加载完毕
        noticeNoMore: false,
        // "预告"Tab是空页面
        noticeNoOne: false,
        // 试听状态
        audioPlaying: false,
        // 音频播放进度百分比
        audioPercent: 0,
        // 音频播放的提示信息
        playTip: '',
        // 系列课分类
        channelTags: [],
        // 是否显示底部转载弹窗
        showReprintModal: false,
        // 当前正在被转载的系列课信息
        currentReprintChannel: {},
        // 是否显示底部的推广弹窗
        showPromoteModal: false,
        // 推广数据
        promotionData: {},
        // 是否显示选择直播间的弹窗
        showSelectLiveModal: false,
        // 当前登录用户创建的直播间
        createLiveList: [],
        // 当前登录用户管理的直播间
        manageLiveList: [],
        // 最后一次点击的直播间id
        clickedLiveId: '',
        // 当前确定选择的直播间id
        selectedLiveId: '',
        // 是否显示转载成功的弹窗
        showReprintSuccessModal: false,
    }

    data = {
        // 全局音频播播放器
        audioPlayer: new AudioSlicePlayer(this.audioPercentCallback, this.audioEndCallback, this.audioErrorCallback, this.audioPauseCallback),
        // 当前正在试听的课程索引
        currentAudioIndex: null,
        // 当前正在试听的课程所在的Tab
        currentAudioInTab: '',
        // 每页加载的数据条数
        pageSize: 10,
        // "进行中"Tab的当前页码
        underwayPage: 1,
        // "预告"Tab的当前页码
        noticePage: 1,
    }

    // 获取URL中的selectedLiveId参数值
    get selectedLiveId() {
        return this.props.location.query.selectedLiveId;
    }

    // 页面Tab切换
    toggleTab(event) {
        const tab = event.target.getAttribute('data-tab');
        this.setState({
            activeTab: tab
        });
    }

    // 加载"进行中"Tab的数据
    async loadUnderwayTabData(refresh = false) {
        const { underwayPage, pageSize } = this.data;
        const result = await api({
            method: 'POST',
            url: '/api/wechat/studio/activityCoursesList',
            body: {
                liveId: this.state.selectedLiveId,
                type: 'beginning',
                page: {
                    page: underwayPage,
                    size: pageSize
                }
            }
        });
        if (result.state.code === 0) {
            const channelList = result.data.courseList || [];
            if (channelList.length == 0 && underwayPage == 1) {
                // 空页面
                this.setState({
                    underwayNoOne: true
                });
                return;
            }
            if (channelList.length < pageSize) {
                // 加载完毕
                this.setState({
                    underwayNoMore: true
                });
            } else {
                this.data.underwayPage += 1;
            }
            if (refresh) {
                this.setState({
                    coursesInActivity: [...channelList]
                });
            } else {
                this.setState({
                    coursesInActivity: [...this.state.coursesInActivity, ...channelList]
                });
            }
        } else {
            window.toast(result.state.msg);
        }
    }

    // 刷新“进行中”Tab的数据
    refreshUnderwayTab() {
        this.data.underwayPage = 1;
        this.loadUnderwayTabData(true);
    }

    // 加载"预告"Tab的数据
    async loadNoticeTabData(refresh = false) {
        const { noticePage, pageSize } = this.data;
        const result = await api({
            method: 'POST',
            url: '/api/wechat/studio/activityCoursesList',
            body: {
                type: 'plan',
                liveId: this.state.selectedLiveId,
                page: {
                    page: noticePage,
                    size: pageSize
                }
            }
        });
        if (result.state.code === 0) {
            const channelList = result.data.courseList || [];
            if (channelList.length == 0 && noticePage == 1) {
                // 空页面
                this.setState({
                    noticeNoOne: true
                });
                return;
            }
            if (channelList.length < pageSize) {
                // 加载完毕
                this.setState({
                    noticeNoMore: true
                });
            } else {
                this.data.noticePage += 1;
            }
            if (refresh) {
                this.setState({
                    coursesToActivity: [...channelList]
                });
            } else {
                this.setState({
                    coursesToActivity: [...this.state.coursesInActivity, ...channelList]
                });
            }
        } else {
            window.toast(result.state.msg);
        }
    }

    // 刷新“预告”Tab的数据
    refreshNoticeTab() {
        this.data.noticePage = 1;
        this.loadNoticeTabData(true);
    }

    // 加载课程数据
    async loadNext(next) {
        const { activeTab } = this.state;
        if (activeTab == 'activity-underway') {
           await this.loadUnderwayTabData();
        } else {
           await this.loadNoticeTabData();
        }
        next && next();
    }

    // 音频播放进度变化的回调函数
    audioPercentCallback(percent) {
        this.setState({
            audioPercent: percent,
            playTip: `${percent > 100 ? 100 : percent}%`,
        });
    }

    // 音频播放完毕的回调函数
    audioEndCallback() {
        this.setState({
            audioPlaying: false,
            audioPercent: 0,
            playTip: '试听结束',
        });
        this.data.currentAudioIndex = null;
        this.data.currentAudioInTab = null;
    }

    // 音频播放错误的回调函数
    audioErrorCallback(error) {
        this.setState({
            audioPlaying: false,
            audioPercent: 0,
            playTip: '出错了:('
        });
        this.data.currentAudioIndex = null;
        this.data.currentAudioInTab = null;
        // 错误信息记录到浏览器控制台
        console.error(error);
    }

    // 音频暂停播放的回调函数
    audioPauseCallback() {
        this.setState({
            audioPlaying: false,
            playTip: `${this.state.audioPercent}%`
        });
    }

    // 点击音频播放
    handleAudioPlayClick(event) {
        const { audioPlaying, activeTab, coursesInActivity, coursesToActivity, audioPercent } = this.state;
        const target = event.currentTarget;
        const courseIndex = +target.getAttribute('data-course-index');
        const coursesList = activeTab == 'activity-underway' ? coursesInActivity : coursesToActivity;
        const audition = coursesList[courseIndex]['audition'];
        if (!audition) {
            // 没有试听音频
            window.toast('暂无试听音频');
        } else if (audioPlaying && this.data.currentAudioIndex === courseIndex && this.data.currentAudioInTab === activeTab) {
            // 暂停试听
            this.data.audioPlayer.pause();
            this.setState({
                audioPlaying: false,
                playTip: `${audioPercent}%`
            });
        } else if (this.data.currentAudioIndex === courseIndex && this.data.currentAudioInTab === activeTab) {
            // 暂停后继续试听
            this.data.audioPlayer.resume();
            this.setState({
                audioPlaying: true,
                playTip: `${audioPercent}%`
            });
        } else {
            // 立即试听新的音频
            this.data.currentAudioIndex = courseIndex;
            this.data.currentAudioInTab = activeTab;
            this.data.audioPlayer.play(audition.contentList, audition.totalSeconds);
            this.setState({
                audioPlaying: true,
                playTip: ''
            });
        }
    }

    // 获取系列课的分类信息
    async fetchChannelTags(liveId) {
        const result = await api({
            url: "/api/wechat/live/channelTypeList",
            method: 'POST',
            body: {
                liveId,
                type: 'all',
            },
        });
        if (result.state.code === 0) {
            const {channelTagList = []} = result.data;
            this.setState({
                channelTags: [{name: '全部', id: ''}, ...channelTagList]
            });
        }
    }

    // 展示系列课转载弹窗
    showReprintModal(course) {
        this.setState({
            showReprintModal: true,
            currentReprintChannel: {...course}
        });
    }

    // 关闭系列课弹窗
    closeReprintModal() {
        this.setState({
            showReprintModal: false
        });
    }

    // 系列课转载按钮的点击事件处理函数
    handleRelayClick(event) {
        // 获取对应的系列课信息并且打开转载弹窗
        const target = event.target;
        const courseIndex = +target.getAttribute('data-index');
        const { activeTab, coursesInActivity, coursesToActivity} = this.state;
        const course = activeTab == 'activity-underway' ? coursesInActivity[courseIndex] : coursesToActivity[courseIndex];
        const reprintCourse = {
            index: courseIndex,
            tweetId: `${course.tweetId}`,
            reprintLiveId: course.liveId,
            reprintChannelId: course.businessId,
            reprintChannelName: course.businessName,
            reprintChannelImg: course.businessHeadImg, 
            reprintChannelAmount: course.amount,
            discountStatus: course.discountStatus,
            reprintChannelDiscount: course.discount,
            chargeMonths: course.chargeMonths,
            selfMediaPercent: course.selfMediaPercent,
            selfMediaProfit: course.selfMediaProfit,
        }
        this.showReprintModal(reprintCourse);
    }

    // 转载系列课
    async reprintChannel(params = {relayLiveId:'', tagId:'' ,sourceChannelId:'', tweetId:''}) {
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/reprintChannel',
            method: 'POST',
            body:{
                ...params,
            },
            showLoading: true,
        });
        if (result.state.code === 0) {
            const index = this.state.currentReprintChannel.index;
            let newList = this.state.activeTab == 'activity-underway' ? [...this.state.coursesInActivity] : [...this.state.coursesToActivity];
            newList[index].isRelay = 'Y';
            if (this.state.activeTab == 'activity-underway') {
                this.setState({
                    coursesInActivity: newList,
                });
            } else {
                this.setState({
                    coursesToActivity: newList,
                });
            }
            this.setState({
                showReprintSuccessModal: true
            });
            return result;
        } else {
            window.toast(result.state.msg);
        }
    }

    // 获取当前登录用户的直播间列表
    async fetchLiveList() {
        const result = await api({
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/live/myManageLive',
        });
        if (result.state.code !== 0) {
            window.toast(result.state.msg);
            return false;
        }
        const createLiveList = result.data.result.creator || [];
        const manageLiveList = result.data.result.manager || [];
        const myLiveId = result.data.result.myLiveId || '';
        this.setState({
            createLiveList: createLiveList,
            manageLiveList: manageLiveList,
        });
        // 如果URL中带有selectedLiveId参数，检查selectedLiveId的值是否有效
        if (this.selectedLiveId) {
            const validCreateLive = createLiveList.some((live) => {
                return live.liveId == this.selectedLiveId;
            });
            const validManageLive = manageLiveList.some((live) => {
                return live.liveId == this.selectedLiveId;
            });
            if (validCreateLive || validManageLive) {
                this.setState({
                    selectedLiveId: this.selectedLiveId,
                    clickedLiveId: this.selectedLiveId,
                }, () => {
                    // 更新liveId后，刷新页面数据
                    this.fetchChannelTags(this.state.selectedLiveId);
                    this.refreshUnderwayTab();
                    this.refreshNoticeTab();
                });
                return;
            }
        }
        // 如果URL中不带有selectedLiveId参数或者selectedLiveId参数值无效，则进入直播间列表选择逻辑
        let liveId = '';
        const createLivesCount = createLiveList.length;
        const manageLivesCount = manageLiveList.length;
        if ((createLivesCount + manageLivesCount) == 0) {
            liveId = myLiveId;
        } else if ((createLivesCount + manageLivesCount) >= 1) {
            liveId = createLivesCount > 0 ? createLiveList[0].liveId : manageLiveList[0].liveId;
            // 有权限操作的直播间超过1个，弹窗让用户选择直播间
            if ((createLivesCount + manageLivesCount) > 1) {
                this.setState({
                    showSelectLiveModal: true
                });
            }
        }
        this.setState({ 
            selectedLiveId: liveId,
            clickedLiveId: liveId,
        }, () => {
            // 更新liveId后，刷新页面数据
            this.fetchChannelTags(this.state.selectedLiveId);
            this.refreshUnderwayTab();
            this.refreshNoticeTab();
        });
    }

    // 关闭直播间选择弹窗
    hideSelectLiveModal() {
        this.setState({
            showSelectLiveModal: false
        });
    }

    // 选择某个直播间
    onSelectLiveClick(live) {
        this.setState({
            clickedLiveId: live.liveId
        });
    }

    // 点击直播间选择弹窗的确定和取消按钮
    handleSelectLiveBtnClick(tag) {
        if (tag == 'confirm') {
            const { clickedLiveId, selectedLiveId } = this.state;
            if (clickedLiveId != selectedLiveId) {
                this.setState({
                    selectedLiveId: clickedLiveId
                }, () => {
                    // 调用获取直播间内系列课分类标签的接口
                    this.fetchChannelTags(this.state.selectedLiveId);
                    // 刷新页面数据
                    this.refreshUnderwayTab();
                    this.refreshNoticeTab();
                });
            }
        }
        // 关闭弹窗
        this.hideSelectLiveModal();
    }

    // 关闭转载成功的弹窗
    hideReprintSuccessModal() {
        this.setState({
            showReprintSuccessModal: false
        });
    }

    // 点击转载成功弹窗的取消或确定按钮
    handleReprintSuccessBtnClick(tag){
        if (tag == 'confirm') {
            this.hideReprintSuccessModal();
            this.closeReprintModal();
        } else if (tag == 'cancel') {
            locationTo(`/wechat/page/live-studio/media-market?selectedLiveId=${this.state.selectedLiveId}&tab=market_edit`);
        }
    }

    // 点击推广按钮
    handlePromoteClick(event) {
        const courseIndex = +event.target.getAttribute('data-index');
        const course = this.state.activeTab == 'activity-underway' ? this.state.coursesInActivity[courseIndex]: this.state.coursesToActivity[courseIndex];
        const shareUrl = `${window.location.origin}/live/channel/channelPage/${course.relayChannelId}.htm`;
        const percent = course.selfMediaPercent;
        const datas = {
            businessImage: course.businessHeadImg,
            businessId: course.relayChannelId,
            businessName: course.businessName,
            amount: course.amount,
        }
        this.setState({
            promotionData: {shareUrl, percent, datas},
            showPromoteModal: true
        });
    }

    // 弹出推广弹窗
    showReprintPushBox(promotionData) {
        this.setState({ 
            promotionData,
            showPromoteModal: true,
        })
    }

    componentWillMount() {
        const tab = this.props.location.query.tab;
        if (tab && ['activity-underway', 'activity-notice'].indexOf(tab) > -1) {
            this.setState({
                activeTab: tab
            });
        }
    }

    async componentDidMount() {
        // 获取两个Tab的数据
        await Promise.all([this.loadUnderwayTabData(), this.loadNoticeTabData()]);
        // 获取当前登录用户的直播间信息，如果没有登录，则自动触发登录授权流程
        this.fetchLiveList();
        // 初始化分享信息
        share({
            title: '限时尖叫高分成',
            timelineTitle: '限时尖叫高分成',
            desc: '知识通商城--共享智慧，高分成，高转化',
            timelineDesc: '知识通商城--共享智慧，高分成，高转化',
            imgUrl: 'https://img.qlchat.com/qlLive/wx-share/market-logo.png',
            shareUrl: location.href,
        });
    }

    goToTop () {
        document.querySelector('.courses-list-container').scrollTo(0,0);
    }

    render(){
        const {
            activeTab,
            tabs,
            coursesInActivity,
            coursesToActivity,
            audioPlaying,
            playTip,
            underwayNoMore,
            underwayNoOne,
            noticeNoMore,
            noticeNoOne,
            selectedLiveId,
            clickedLiveId,
            createLiveList,
            manageLiveList,
            showReprintModal,
            showSelectLiveModal,
            showReprintSuccessModal,
            currentReprintChannel,
            showPromoteModal,
            promotionData,
        } = this.state;
        const coursesList = activeTab == 'activity-underway' ? coursesInActivity : coursesToActivity;
        const noMore = activeTab == 'activity-underway' ? underwayNoMore : noticeNoMore;
        const noOne = activeTab == 'activity-underway' ? underwayNoOne : noticeNoOne;
        return (
            <Page title="知识通商城" className="high-division-activity-container">
                <ScrollToLoad
                    ref="scrollToLoad"
                    className="courses-list-container"
                    emptyMessage=""
                    loadNext={this.loadNext}
                    noMore={noMore}
                    noneOne={noOne}
                    hideNoMorePic={true}>
                    <section className="activity-tip">
                    {
                        activeTab == 'activity-underway' ?
                            <div><div>活动期内分发获得的订单，按活动比例结算</div><div>活动结束后产生的订单，按原比例进行结算</div></div>
                        :
                            <div><div>活动开始后产生的订单可享受高分成</div><div>请提前转载，准备推广素材</div></div>
                    }
                    </section>
                    <section className="activity-tabs">
                        <div className="tabs-switcher">
                        {
                            tabs.map((tab, index) => {
                                return (
                                    <button key={index} data-tab={tab.id} className={classnames("tab", {"active-tab": tab.id == activeTab})} onClick={this.toggleTab}>{tab.name}</button>
                                )
                            })
                        }
                        </div>
                        {
                            noOne ? 
                                <div className="empty-page">
                                    <div className="icon-empty"></div>
                                    <div>{activeTab == 'activity-underway' ? '暂无活动' : '暂无预告'}</div>
                                    <div>{activeTab == 'activity-underway' ? '去看看活动预告吧!' : '去看看火热进行中的活动吧'}</div>
                                </div>
                            :
                                <div className="courses-list">
                                {
                                    coursesList.map((course, index) => {
                                        return (
                                            <div key={index} className="course-item">
                                                <div className="activity-time">
                                                {
                                                    activeTab == 'activity-underway' ?
                                                        `${formatDate(course.startTime, 'MM.dd')}-${formatDate(course.endTime, 'MM.dd')} 剩余${timeAfter(course.endTime, this.props.sysTime).slice(0, -1)}`
                                                    :
                                                        `${formatDate(course.startTime, 'MM.dd')}-${formatDate(course.endTime, 'MM.dd')} ${timeAfter(course.startTime, this.props.sysTime)}`
                                                }
                                                </div>
                                                <img className="head-image" alt="" src={`${course.businessHeadImg}@435h_690w_1e_1c_2o`} onClick={() => locationTo(`/live/channel/channelPage/${course.businessId}.htm`)} />
                                                <div className="course-name elli-text">{course.businessName}</div>
                                                <div className="course-tips">
                                                    <div className="money-tip">
                                                        <span className="price">
                                                        {
                                                            course.discountStatus == 'Y' ? `特惠: ￥${course.discount}` : `原价: ￥${course.amount}`
                                                        }
                                                        {
                                                            course.chargeMonths > 0 && `/${course.chargeMonths}月`
                                                        }
                                                        </span>
                                                        <span className="proportion">{course.selfMediaPercent}%分成</span>
                                                    </div>
                                                    <div className="study-times-tip">{course.learningNum < 10000 ? course.learningNum : `${Math.floor((course.learningNum / 10000) * 10) / 10}万`}次学习</div>
                                                </div>
                                                <div className="course-buttons">
                                                {
                                                    activeTab === this.data.currentAudioInTab && index === this.data.currentAudioIndex ?
                                                        <button className="audition-button" data-course-index={index} onClick={this.handleAudioPlayClick}>
                                                            <span className={classnames({"pause-icon": audioPlaying, "play-icon": !audioPlaying})}></span>
                                                            <span className="audition-button-text">{audioPlaying ? '暂停试听' : '立即试听'}</span>
                                                            <span className="audio-play-tip">{playTip}</span>
                                                        </button>
                                                    :
                                                        <button className="audition-button" data-course-index={index} onClick={this.handleAudioPlayClick}>
                                                            <span className="play-icon"></span>
                                                            <span className="audition-button-text">立即试听</span>
                                                        </button>
                                                }
                                                    <button className="view-tweet-button" onClick={() => {
                                                        if (course.url) {
                                                            locationTo(course.url);
                                                        } else {
                                                            window.toast('暂无推文');
                                                        }
                                                    }}>查看推文</button>
                                                {
                                                    course.isRelay == 'N' ?
                                                        <button className="relay-button" data-index={index} onClick={this.handleRelayClick}>赚￥{course.selfMediaProfit}</button>
                                                    :
                                                        <button className="promote-button" data-index={index} onClick={this.handlePromoteClick}>去推广</button>
                                                }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                        }
                    </section>
                </ScrollToLoad>
                {/* 系列课转载弹窗 */}
                <ReprintModal 
                    liveId={this.state.selectedLiveId}
                    show={this.state.showReprintModal}
                    onClose={this.closeReprintModal}
                    channelInfo={this.state.currentReprintChannel}
                    channelTagList={this.state.channelTags}
                    reprintChannel={this.reprintChannel}
                />
                {/* 直播间选择弹窗 */}
                <SelectLive
                    showSelectLiveModal={showSelectLiveModal}
                    hideSelectLiveModal={this.hideSelectLiveModal}
                    handleSelectLiveBtnClick={this.handleSelectLiveBtnClick}
                    createLiveList={createLiveList}
                    manageLiveList={manageLiveList}
                    onSelectLiveClick={this.onSelectLiveClick}
                    curSelectedLiveId={clickedLiveId}
                />
                {/* 转载成功弹窗 */}
                <MiddleDialog
                    show={showReprintSuccessModal}
                    theme='empty'
                    close={false}
                    onClose={this.hideReprintSuccessModal}
                    buttons='cancel-confirm'
                    cancelText='查看列表'
                    confirmText='继续转载'
                    buttonTheme='line'
                    onBtnClick={this.handleReprintSuccessBtnClick}
                    className="reprint-success-modal"
                >
                    <div className='reprint-success'>
                        <div className="success-logo icon_checked"></div>
                        <span className="success-text">转载成功</span>
                        <span className="success-tip">该课程已成功转到你的直播间</span>
                        <div className="card"> 
                            <ChannelItemCard 
                                // 类型
                                itemType="reprint-item"
                                {...currentReprintChannel}
                            />
                        </div>
                    </div>
                </MiddleDialog>
                {/* 推广弹窗 */}
                {
                    showPromoteModal &&
                    <ReprintPushBox 
                        {...promotionData}
                        onClose={() => { this.setState({showPromoteModal: false}) }}
                    />
                }
                <div className="go-to-top" onClick={this.goToTop}>
                </div>
            </Page>
        )
    }
}

const mapStateToProps = state => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(HighDivisionActivity)
