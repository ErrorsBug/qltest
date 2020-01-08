const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import Page from 'components/page';

import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';

//子组件
import ReturnRepresent from './components/return-list';

import { missionList } from '../../actions/channel-distribution';
import { refreshPageData, locationTo } from 'components/util';
import { getQlchatVersion } from 'components/envi';
import appSdk from 'components/app-sdk';
import AuthRepresent from '../channel-distribution-list/components/auth-represent';
import AutoRepresent from '../channel-distribution-list/components/auto-represent';
import ShareDialog from '../channel-distribution-list/components/share-dialog/index';
import { getTopicInfo, getTopicDistributionList, getTopicAutoShare } from '../../actions/topic';

class TopicDistributionList extends Component {
    state = {
        authTab: '',
        authIsNoMoreDistribution: false,
        autoIsNoMoreDistribution: false,
        authIsNoOneDistribution: false,
        autoIsNoOneDistribution: false,
        authPageNum:1,
        autoPageNum:1,
        pageSize: 20,
        topicId: this.props.params.topicId,
        pageSize: 20,
        returnList: [], // 拉人返学费
        returnPageNum: 1,
        returnIsNoOne: false,
        returnNoMore: false,
        authList: [],
        autoList: [],
        showShareDialog: false,
    }

    componentDidMount() {
        this.handleIOSRefresh();
        this.toggleTabs('auth');    // 默认tab页为“授权课代表”
        this.getTopicInfo(this.props.params.topicId);
        this.getAutoStatus();
        refreshPageData();
    }

    handleIOSRefresh = () => {
        // 因iOS端内核的机制问题，导致返回到此页面时不执行刷新，以下逻辑旨在兼容处理
        const browserIOSRule = /^.*((iPhone)|(iPad)|(Safari))+.*$/;
        if (browserIOSRule.test(navigator.userAgent)) {
            // disable bfcache
            try {
                const bfWorker = new Worker(window.URL.createObjectURL(new Blob(['1'])));
                window.addEventListener('unload', () => {
                    bfWorker.terminate();
                });
            }
            catch (err) {
                console.error(err);
            }
        }
    }

    //点击tabs切换样式
    toggleTabs(tab) {
        if (tab === this.state.authTab) {
            return;
        }
        this.setState({
            authTab: tab
        }, () => {
            const {authList, autoList, returnList} = this.state;
            switch (tab) {
                case 'return':
                    !returnList.length > 0 && this.fetchReturnList();
                    break;
                case 'auto':
                    !autoList.length > 0 && this.loadDistributionList("auto"); // 为了取auto的总个数
                    break;
                default:
                    !authList.length > 0 && this.loadDistributionList('auth');
                    break;
            }
        });
    }

    async loadMoreReturn(next) {
        await this.fetchReturnList();
        next && next();
    }

    getTopicInfo(topicId){
        this.props.getTopicInfo(topicId);
    }

    //获取自动分销开启状态
    async getAutoStatus() {
        const result = await this.props.getTopicAutoShare(this.props.params.topicId);
        this.setState({
            autoStatus: result.data.isAutoshareOpen,
            autoSharePercent: result.data.percent
        });
    }

    //下拉加载更多
    loadMoreRepresent = async next => {
        await this.loadDistributionList(this.state.authTab);
        next && next();
    }

    //获取话题分销列表
    async loadDistributionList(type){
        const result = await this.props.getTopicDistributionList(
            this.props.params.topicId,
            type,
            {
                page: type == 'auth' ? this.state.authPageNum : this.state.autoPageNum, 
                size: this.state.pageSize
            }
        );
        
        if (result.state.code == 0) {
            switch(type){
                case "auth": 
                    this.setState({
                        authList: [...this.state.authList,...result.data.list],
                        authCount: result.data.allCount,
                        authNotSend: result.data.unUsedCount || this.state.authNotSend,
                        authPageNum: ++this.state.authPageNum,
                    });
                    if(this.state.authList.length<=0){
                        this.setState({
                            authIsNoOneDistribution: true,
                        });
                    }else if(result.data.list&&result.data.list.length < this.state.pageSize){
                        this.setState({
                            authIsNoOneDistribution: false,
                            authIsNoMoreDistribution:true
                        });
                    };
                break;
                case "auto": 
                    this.setState({
                        autoList:[...this.state.autoList,...result.data.list],
                        autoCount: result.data.allCount,
                        autoPageNum:++this.state.autoPageNum,
                    });
                    if(this.state.autoList.length<=0){
                        this.setState({
                            autoIsNoOneDistribution: true,
                        });
                    }else if(result.data.list&&result.data.list.length < this.state.pageSize){
                        this.setState({
                            autoIsNoOneDistribution: false,
                            autoIsNoMoreDistribution:true
                        });
                    };
                break;
            }
        }
    }

    // 获取拉人返现列表
    async fetchReturnList () {
        let result = await this.props.missionList({
            businessId: this.props.params.topicId,
            businessType: 'topic',
            page: {
                page: this.state.returnPageNum,
                size: this.state.pageSize
            }
        })
        if (result.state.code == 0) {
            this.setState({
                returnList: [...this.state.returnList, ...result.data.missionList],
                returnPageNum: ++this.state.returnPageNum,
            });
            if(this.state.returnList.length <= 0) {
                this.setState({
                    returnIsNoOne: true,
                });
            }else if(result.data.missionList && result.data.missionList.length < this.state.pageSize) {
                this.setState({
                    returnIsNoOne: false,
                    returnNoMore: true
                });
            };
        }
    }

    //删除授权单项
    deleteAuthItem = (used, nused) => {
        this.setState({
            authCount: this.state.authCount - 1,
            authNotSend: this.state.authNotSend - 1,
            authList: [...used, ...nused],
        });
    }

    //点击发送按钮弹出对话框
    showIfAuthDialog = (id, percent, key) => {
        this.initSingleShare(id, percent, key);
    }

    hideShare(){
        this.setState({
            showShareDialog: false
        });
        //console.log('hideShare');
    }

    handleShare = shareOption => {
        if(getQlchatVersion()){
            shareOption.shareUrl = shareOption.shareUrl.replace(/http[s]{0,1}\:\/\/m\.qlchat\.com/, 'http://v' + (Math.random() * 9).toFixed(0) + '.qianliao.tv');
            console.log(shareOption);
            appSdk.share(shareOption);
        }else{
            share({
                title: shareOption.wxqltitle,
                timelineTitle: shareOption.friendstr,
                desc: shareOption.descript,
                timelineDesc: shareOption.friendstr, // 分享到朋友圈单独定制
                imgUrl: shareOption.wxqlimgurl,
                shareUrl: shareOption.shareUrl
            });
            this.setState({
                showShareDialog: true
            });
        }
    }

    initSingleShare (id, percent, key) {
        const { topicInfo, params } = this.props;
        let wxqltitle = '课代表邀请 - 来自话题 『'+ topicInfo.topic +'』';
        let shareOption = {
            wxqltitle: wxqltitle,
            descript: '点击后成为该话题课代表\n 分成比例'+ percent + '%',
            wxqlimgurl: topicInfo.backgroundUrl,
            friendstr: wxqltitle,
            shareUrl: `${window.location.origin}/wechat/page/represent-auth?topicId=${params.topicId||''}&shareId=${id||''}&shareKey=${key}`,
        };
        this.handleShare(shareOption)
    }

    initBatchShare () {
        if (this.state.authNotSend < 1) {
            window.toast('您没有更多分销课代表名额了');
            return false;
        }
        const { topicInfo, params } = this.props;
        let wxqltitle='课代表邀请 - 来自话题 『'+ topicInfo.topic +'』';
        let shareBatchOption={
            wxqltitle : wxqltitle,
            descript : '点击后成为该话题课代表',
            wxqlimgurl : topicInfo.backgroundUrl,
            friendstr : wxqltitle,
            shareUrl : `${window.location.origin}/wechat/page/represent-auth?topicId=${params.topicId || ''}`
        };
        this.handleShare(shareBatchOption)
    }

    render() {
        return (
            <Page title='话题分销用户列表' className='topic-distri-list-container'>
                <header className='tabs'>
                    <section className={`tab auth-tab ${this.state.authTab == 'auth' ? 'active' : ''}`}>
                        <div onClick={()=>{this.toggleTabs('auth')}}>
                            <span>授权课代表</span>
                        </div>
                    </section>
                    <section className='line'></section>
                    <section className={`tab auth-tab ${this.state.authTab == 'return' ? 'active' : ''}`}>
                        <div onClick={()=>{this.toggleTabs('return')}}>
                            <span>拉人返学费</span>
                        </div>
                    </section>
                    <section className='line'></section>
                    <section className={`tab auth-tab ${this.state.authTab == 'auto' ? 'active' : ''}`}>
                    <div onClick={()=>{this.toggleTabs('auto')}}>
                        <span>自动分销</span>
                    </div>
                    </section>
                </header>
                <section className='content'>
                    <ScrollToLoad
                        className={`scroll-box auth-scroll ${this.state.authTab == 'auth' ? '' : 'hide'}`}
                        toBottomHeight={500}
                        loadNext={ this.loadMoreRepresent}
                        noneOne={this.state.authIsNoOneDistribution}
                        noMore={this.state.authIsNoMoreDistribution} >
                        <AuthRepresent 
                            AuthRepresents = {this.state.authList} 
                            showIfAuthDialog = {this.showIfAuthDialog}
                            deleteAuthItem = {this.deleteAuthItem}
                        />
                    </ScrollToLoad>
                    <ScrollToLoad
                        className={`scroll-box auth-scroll ${this.state.authTab == 'return' ? '' : 'hide'}`}
                        toBottomHeight={500}
                        loadNext={this.loadMoreReturn}
                        noneOne={this.state.returnIsNoOne}
                        noMore={this.state.returnNoMore }>
                        <ReturnRepresent
                            list={this.state.returnList}
                            topicId= {this.props.params.topicId}
                        />
                    </ScrollToLoad>
                    <ScrollToLoad
                        className={`scroll-box auth-scroll ${this.state.authTab == 'auto' ? '' : 'hide'}`}
                        toBottomHeight={500}
                        loadNext={this.loadMoreRepresent}
                        noneOne={this.state.autoIsNoOneDistribution}
                        noMore={this.state.autoIsNoMoreDistribution}>
                        <AutoRepresent 
                            AuthRepresents = {this.state.autoList} 
                        />
                    </ScrollToLoad>
                </section>
                {
                    this.state.authTab == 'auth'?
                        <footer className='footer'>
                            <a className='btn btn-add' href={`/wechat/page/auth-distribution-add/${this.props.params.topicId}?type=topic`}><span className='icon_plus'></span>添加分销用户</a>
                            {
                                (this.state.authNotSend > 1)?
                                <div className='btn btn-mass' onClick={this.initBatchShare.bind(this)}>{this.state.authNotSend}个未领取，点击群发</div>
                                :null
                            }
                        </footer>
                    :
                        this.state.authTab == 'auto'?
                            <footer className='footer'>
                                <div className='btn btn-mass'><a href={`/wechat/page/topic-distribution-set/${this.state.topicId}`}>自动分销<var className="status">（{this.state.autoStatus === 'Y' ? '已开启' : '未开启'}）</var></a></div>
                            </footer>
                    : null
                }
                <ShareDialog 
                    show = {this.state.showShareDialog} 
                    buttons = 'cancel'
                    hideShare = {this.hideShare.bind(this)}
                    > 
                    <div className='abc'>点击右上角分享</div>
                </ShareDialog>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        topicInfo: state.topic.topicInfo,
        autoShareInfo: state.autoShareInfo
    };
}

const mapActionToProps = {
    missionList,
    getTopicInfo,
    getTopicDistributionList,
    getTopicAutoShare,
};

module.exports = connect(mapStateToProps, mapActionToProps)(TopicDistributionList);