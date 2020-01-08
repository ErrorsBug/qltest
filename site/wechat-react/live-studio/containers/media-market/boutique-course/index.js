import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { locationTo } from 'components/util';
import ScrollToLoad from 'components/scrollToLoad';
import CourseItem from '../components/course-item';
import { api } from '../../../actions/common';
import ReprintModal from '../components/reprint-modal';
import MiddleDialog from 'components/dialog/middle-dialog';
import ChannelItemCard from '../components/channel-item-card';
import { AudioSlicePlayer } from 'components/audio-player';
import { share } from 'components/wx-utils';
import ReprintPushBox from 'components/dialogs-colorful/reprint-push-box';

@autobind
class BoutiqueCourse extends Component {

    constructor (props) {
        super(props);
        this.data = {
            pageSize: 10
        }
    }

    state = {
        courseList: [],
        pageNum: 0,
        showReprintModal: false,
        currentReprintChannel: {},
        showReprintSuccessModal: false,
        noMore: false,
        // 弹出直播间选择弹框
        showSelectLiveModal: false,
        curSelectedLiveId: undefined,

        createLiveList: [],

        currentAudio: -1, //当前播放音频
        audioStatus: 'stop',
        audioPercent: 0,
        currentPlayTab: '',
    }

    async componentDidMount () {
        if (this.props.isLogin) {
            await this.getAdminLiveListInfo();
            this.getCourseList(true);
            this.fetchChannelTags(this.liveId)
        } else {
            this.getCourseList();
        }
        this.initShare();
    }

    initShare() {
        
        share({
            appTitle: '知识通商城',
            timelineTitle: '知识共享时代，加入千聊知识通，一起做大内容变现事业，传播智慧，享受分成',
            desc: '知识共享时代，加入千聊知识通，一起做大内容变现事业，享受分成',
            shareUrl: location.origin + location.pathname,
            imgUrl: 'https://img.qlchat.com/qlLive/wx-share/market-logo.png'
        })
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

    showReprintModal(channelInfo) {
        if (!this.props.isLogin) {
            location.href = '/page/login?redirect_url=' + encodeURIComponent(location.origin + location.pathname);
            return ;
        }
        this.setState({
            showReprintModal: true,
            currentReprintChannel: {...channelInfo}
        }); 
    }
    // 获取直播间列表
    async getAdminLiveListInfo() {
        const result = await api({
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/live/myManageLive',
        });
        if (result.state.code !== 0) {
            window.toast("myManageLive接口错误");
            return ;
        }

        const createLiveList = result.data.result.creator || [];
        const manageLiveList = result.data.result.manager || [];

        this.setState({
            createLiveList: createLiveList,
            manageLiveList: manageLiveList,
        });

        // 如果URL中带有selectedLiveId参数，检查selectedLiveId的值是否有效
        const {selectedLiveId} = this.props.location.query;
        if (selectedLiveId) {
            const validCreateLive = createLiveList.some((live) => {
                return live.liveId == selectedLiveId;
            });
            const validManageLive = manageLiveList.some((live) => {
                return live.liveId == selectedLiveId;
            });
            if (validCreateLive || validManageLive) {
                this.liveId = selectedLiveId;
                this.setState({
                    curSelectedLiveId: selectedLiveId
                });
                return;
            }
        }

        const showSelectLiveModal = this.liveId ? false : [].concat(createLiveList).concat(manageLiveList).length > 1;

        const myLiveId = result.data.result.myLiveId || '';

        this.liveId = myLiveId;
        
        this.setState({
            showSelectLiveModal,
            curSelectedLiveId: myLiveId
        })
    }

    handleListen = (idx) => {
        if (this.state.currentPlayTab !== this.state.currentMarketTypeTab) {
            this.startListening(idx);
            return;
        }
        // 没有音频播放或暂停则开始播放
        if (this.state.audioStatus == 'ended') {   
            this.startListening(idx);
        // 已经有音频在播放，刚好是当前音频
        } else if (idx == this.state.currentAudio) {
            let {audioStatus} = this.state;
            if (audioStatus == 'pause') {
                this.audioSlicePlayer.resume();
                this.setState({
                    audioStatus: 'playing',
                    currentAudio: idx,
                })
            } else {
                this.audioSlicePlayer.pause();
                this.setState({
                    audioStatus: 'pause',
                    currentAudio: idx,
                })
            }
        // 已经有音频在播放切不是当前音频
        } else {
            this.setState({
                audioPercent: 0,
            })
            this.startListening(idx);
        }
    }

    startListening = (idx) => {
        let {audition} = this.state.courseList[idx];
        if (!audition) {
            window.toast('暂无试听音频');
        } else {
            this.setState({
                audioStatus: 'playing',
                currentAudio: idx,
                audioPercent: 0,
                currentPlayTab: this.state.currentMarketTypeTab
            });
            this.audioSlicePlayer.play(audition.contentList, audition.totalSeconds);
        }
    }

    pauseListening = () => {
        this.audioSlicePlayer.pause();
    }

    onClosePushBox(){
        this.setState({
            showPromotionModal:false,
        });
    }

    showReprintPushBox(promotionData) {
        this.setState({ 
            promotionData,
            showPromotionModal: true,
        })
    }

    uiCourseList = () => {
        return this.state.courseList.map((item, index) => {
            return (
                <CourseItem
                    index={index}
                    key={item.businessId}
                    // 三方推文id
                    tweetId={item.tweetId}
                    // 三方推文链接
                    tweetUrl={item.url}
                    // 当前直播间 liveId
                    liveId={this.liveId}
                    // 被转播的课程直播间 liveId
                    reprintLiveId={item.liveId}
                    // 被转载的直播间名称
                    reprintLiveName={item.liveName}
                    // 被转播的系列课 id
                    reprintChannelId={item.businessId}
                    // 转载方系列课的id
                    relayChannelId={item.relayChannelId}
                    // 被转播的系列课名称
                    reprintChannelName={item.businessName}
                    // 被转播的系列课头图
                    reprintChannelImg={item.businessHeadImg}
                    // 被转播的系列课原价
                    reprintChannelAmount={item.amount}
                    // 被转播的系列课优惠价 无
                    reprintChannelDiscount={item.discount}
                    // 当前直播间分成比例
                    selfMediaPercent={item.selfMediaPercent}
                    // 当前直播间分成收益
                    selfMediaProfit={item.selfMediaProfit}
                    chargeMonths={item.chargeMonths}
                    // 是否可以转播
                    isRelay={item.isRelay}
                    learningNum={item.learningNum}
                    isActivityCourse={item.isActivityCourse}
                    onReprint={this.showReprintModal}
                    setReprintTipModal={this.setReprintTipModal}
                    discountStatus={item.discountStatus}
                    handleListen={this.handleListen}
                    currentAudio={this.state.currentAudio}
                    percent={this.state.audioPercent}
                    audioStatus={this.state.audioStatus}
                    currentPlayTab={this.state.currentPlayTab}
                    currentMarketTypeTab={this.state.currentMarketTypeTab}
                    showReprintPushBox={this.showReprintPushBox}
                >
                    
                </CourseItem>
            )
        })
    }

    loadNext = async (cb) => {
        const result = await this.getCourseList();
        cb();
    }

    getCourseList = async (refresh) => {
        const isRecommend = 'Y';
        const result = await api({
            url: '/api/wechat/studio/mediaMarket/courseList',
            method: 'POST',
            body: {
                isRecommend,
                pageNum: refresh ? 1 :this.state.pageNum + 1,
                pageSize: this.data.pageSize,
                liveId: this.liveId
            },
            showLoading: true,
        });
        if (result && result.state && result.state.code === 0 ) {
            const { channelList } = result.data;
            const noMore = channelList.length < this.data.pageSize ? true : false;
            let { courseList } = this.state;
            refresh ? courseList = channelList : courseList = courseList.concat(channelList);
            this.setState({
                courseList,
                pageNum: refresh ? 1 : this.state.pageNum + 1,
                noMore: noMore
            })
        } else {
            window.toast(result.state.msg);
        }

        if (!this.audioSlicePlayer) {
            this.audioSlicePlayer = new AudioSlicePlayer((p) => {
                this.setState({
                    audioPercent: p
                })
            }, (e) => {
                this.setState({
                    audioStatus: 'ended',
                    audioPercent: 0
                })
            },(e) => {
                
            });
        }
        return result;
    }

    // 关闭弹框
    closeReprintModal = () => {
        this.setState({
            showReprintModal: false
        })
    }

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
            let newList = [...this.state.courseList]
            newList[index].isRelay = 'Y';
            this.setState({
                courseList: newList,
            })
            this.setReprintSuccessModal(true);
            window.toast('操作成功');
        } else {
            window.toast(result.state.msg);
        }
        return result;
    }

    setReprintSuccessModal(showReprintSuccessModal) {
        this.setState({ showReprintSuccessModal })
    }

    handleReprintSuccessBtnClick(tag){
        switch(tag) {
            case 'confirm':
                break;
            case 'cancel':
                location.href = `/wechat/page/live-studio/media-market?selectedLiveId=${this.liveId}&tab=market_edit`
                break;
            
        }
        this.setReprintSuccessModal(false);
        this.closeReprintModal();
    }

    hideSelectLiveModal = () => {
        this.setState({
            showSelectLiveModal: false
        })
    }

    handleSelectLiveBtnClick = (tag) => {

        switch (tag) {
            case 'confirm':
                this.getCourseList(true);
                break;
            case 'cancel':
                break;
        }
        this.setState({showSelectLiveModal: false});
    }

    onSelectLiveClick = (liveInfo) => {
        this.liveId = liveInfo.liveId;
        this.setState({
            curSelectedLiveId: liveInfo.liveId
        })
    } 

    render() {
        let { createLiveList, manageLiveList, curSelectedLiveId } = this.state;
        return (
            <Page title="知识通商城" className="boutique-course-container">
                <ScrollToLoad
                    className="list-container"
                    loadNext={this.loadNext}
                    emptyPicIndex={3}
                    emptyMessage="暂无课程"
                    noMore={this.state.noMore}
                >
                    <div className="top-header">
                    </div>
                    {this.uiCourseList()}
                </ScrollToLoad>
                <ReprintModal 
                    liveId={this.state.curSelectedLiveId}
                    show={this.state.showReprintModal}
                    onClose={this.closeReprintModal}
                    channelInfo={this.state.currentReprintChannel}
                    channelTagList={this.state.channelTags}
                    reprintChannel={this.reprintChannel}
                />
                {
                    this.state.showPromotionModal&&
                    <ReprintPushBox 
                        {...this.state.promotionData}
                        onClose={this.onClosePushBox}
                    />
                }
                <MiddleDialog
                    show = { this.state.showReprintSuccessModal }
                    theme = 'empty'
                    close = {false}
                    onClose = {() => this.setReprintSuccessModal(false)}
                    buttons = 'cancel-confirm'
                    cancelText = '查看列表'
                    confirmText = '继续转载'
                    buttonTheme ='line'
                    onBtnClick = {this.handleReprintSuccessBtnClick}
                    className = "reprint-success-modal"
                >
                    <div className = 'reprint-success'>
                        <div className="success-logo icon_checked"></div>
                        <span className="success-text">转载成功</span>
                        <span className="success-tip">该课程已成功转到你的直播间</span>
                        <div className="card"> 
                            <ChannelItemCard 
                                // 类型
                                itemType="reprint-item"
                                {...this.state.currentReprintChannel}
                            />
                        </div>
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    show = { this.state.showSelectLiveModal }
                    theme = 'empty'
                    close = {false}
                    onClose = {this.hideSelectLiveModal}
                    buttons = 'cancel-confirm'
                    cancelText = '取消'
                    confirmText = '确定'
                    buttonTheme ='line'
                    onBtnClick = {this.handleSelectLiveBtnClick}
                    className = "select-live-modal"
                >
                    <div className="title">选择直播间</div>
                    <div className={`live-list-container live-list-bottom-border ${createLiveList && createLiveList.length > 0 ? '' : 'hide' }`}>
                        <div className="list-title">我的直播间</div>
                        <ul className="list">
                            {
                                createLiveList ?
                                createLiveList.map((item) => {
                                    return <li 
                                        className={`list-item ${item.liveId === curSelectedLiveId ? 'selected' : ''}`} 
                                        key={item.liveId} 
                                        onClick={() => this.onSelectLiveClick(item)}
                                    >
                                        {item.liveName} 
                                        <span className={`icon_checked ${item.liveId === curSelectedLiveId ? '' : 'hide' }`}></span>
                                    </li>
                                })
                                :
                                null
                            }
                        </ul>
                    </div>
                    <div className={`live-list-container ${manageLiveList && manageLiveList.length > 0 ? '' : 'hide' }`}>
                        <div className="list-title">我管理的直播间</div>
                        <ul className="list">
                            {
                                manageLiveList ? 
                                manageLiveList.map((item) => {
                                    return <li 
                                        className={`list-item ${item.liveId === curSelectedLiveId ? 'selected' : ''}`} 
                                        key={item.liveId} 
                                        onClick={() => this.onSelectLiveClick(item)}
                                    >
                                        {item.liveName}
                                        <span className={`icon_checked ${item.liveId === curSelectedLiveId ? '' : 'hide' }`}></span>
                                    </li>
                                }) :
                                null
                            }
                        </ul>
                    </div>
                </MiddleDialog>
            </Page>
        )
    }
}

const mapStateToProps = state => ({
    isLogin: state.common.isLogin
});

const mapActionToProps = {

};

export default connect(mapStateToProps, mapActionToProps)(BoutiqueCourse);
