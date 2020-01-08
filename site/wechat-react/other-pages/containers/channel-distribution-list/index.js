const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import Page from 'components/page';

import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';

//子组件
import AuthRepresent from './components/auth-represent';
import AutoRepresent from './components/auto-represent';
import ReturnRepresent from './components/return-list';
import ShareDialog from './components/share-dialog';
//action
import { getChannelInfo } from '../../actions/channel';
import {
    getChannelDistributionList,
    channelAutoDistributionInfo,
    missionList
} from '../../actions/channel-distribution';
import {
    refreshPageData,
} from 'components/util';
import { getQlchatVersion } from 'components/envi';
import appSdk from 'components/app-sdk';


class ChannelDistributionList extends Component {
    state = {
        authList:[],
        autoList:[],
        authCount: 0, // 授权分销课代表个数
        autoCount: 0,
        authNotSend: 0, // 未发送授权的个数
        authIsNoMoreDistribution: false,
        autoIsNoMoreDistribution: false,
        authIsNoOneDistribution: false,
        autoIsNoOneDistribution: false,
        authTab: 'auth', // 是否auth auto return tab激活
        showShareDialog: false,//分享弹框,
        autoStatus: null, // 是否开启自动分销
        autoSharePercent: 0, //自动分销比例
        channelId:this.props.params.channelId,
        authPageNum:1,
        autoPageNum:1,
        pageSize: 20,
        returnList: [], // 拉人返学费
        returnPageNum: 1,
        returnIsNoOne: false,
        returnNoMore: false,
    }
    componentDidMount() {
        this.handleIOSRefresh();
        this.loadDistributionList("auth");
        this.loadDistributionList("auto"); // 为了取auto的总个数
        this.getChannelInfo(this.props.params.channelId);
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
        this.setState({
            authTab: tab
        }, () => {
            if (tab == 'return' && this.state.returnList.length <= 0) {
                this.fetchReturnList()
            }
        });
    }
    //下拉加载更多
    async loadMoreRepresent(next) {
         await this.loadDistributionList(this.state.authTab);

         next && next();
    }
    async loadMoreReturn(next) {
        await this.fetchReturnList();

        next && next();
    }

    // 获取拉人返现列表
    async fetchReturnList () {
        let result = await this.props.missionList({
            businessId: this.props.params.channelId,
            businessType: 'channel',
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
    
    //请求
    async loadDistributionList(type){
        const result = await this.props.getChannelDistributionList(
            this.props.params.channelId,
            type,
            {
                page:type =='auth'? this.state.authPageNum : this.state.autoPageNum, 
                size: this.state.pageSize
            }
        );// 20代表每页大小
        
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

    getChannelInfo(channelId){
        this.props.getChannelInfo(channelId);
    }
    //点击发送按钮弹出对话框
    showIfAuthDialog(id,percent,key) {
        this.initSingleShare(id,percent,key);
    }
    hideShare(){
        this.setState({
            showShareDialog: false
        });
        //console.log('hideShare');
    }
    initSingleShare (id,percent,key) {
        let wxqltitle = '课代表邀请 - 来自系列课 『'+ this.props.channelInfo.name+'』';
        let shareOption={
            wxqltitle : wxqltitle,
            descript : '点击后成为该系列课课代表\n 分成比例'+ percent + '%',
            wxqlimgurl : this.props.channelInfo.headImage,
            friendstr : wxqltitle,
            shareUrl : window.location.origin +'/wechat/page/represent-auth?channelId='+ this.props.params.channelId + '&shareId=' + id + '&shareKey=' + key || '',
        };
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
    initBatchShare () {
        if (this.state.authNotSend < 1) {
            window.toast('您没有更多分销课代表名额了');
            return false;
        }
        let wxqltitle='课代表邀请 - 来自系列课 『'+ this.props.channelInfo.name+'』';
        let shareBathOption={
            wxqltitle : wxqltitle,
            descript : '点击后成为该系列课课代表',
            wxqlimgurl : this.props.channelInfo.headImage,
            friendstr : wxqltitle,
            shareUrl : window.location.origin +'/wechat/page/represent-auth?channelId='+ this.props.params.channelId,
        };
        if(getQlchatVersion()){
            shareBathOption.shareUrl = shareBathOption.shareUrl.replace(/http[s]{0,1}\:\/\/m\.qlchat\.com/, 'http://v' + (Math.random() * 9).toFixed(0) + '.qianliao.tv');
            console.log(shareBathOption);
            appSdk.share(shareBathOption);
        }else{
            share({
                title: shareBathOption.wxqltitle,
                timelineTitle: shareBathOption.friendstr,
                desc: shareBathOption.descript,
                timelineDesc: shareBathOption.friendstr, // 分享到朋友圈单独定制
                imgUrl: shareBathOption.wxqlimgurl,
                shareUrl: shareBathOption.shareUrl
            });
            this.setState({
                showShareDialog: true
            });
        }

    }

    //删除授权单项
    deleteAuthItem(nused, used) {
        this.setState({
            authCount: this.state.authCount - 1,
            authNotSend: nused.length,
            authList:[...used,...nused],
        });
    }
    //获取自动分销开启状态
    async getAutoStatus() {
        const result = await this.props.channelAutoDistributionInfo(this.props.params.channelId);
        // console.log(result);
        this.setState({
            autoStatus: result.data.isOpenShare,
            autoSharePercent: result.data.autoSharePercent
        });
    }
    render() {
        console.log(33333, this.state.authIsNoOneDistribution, this.state.authIsNoMoreDistribution)
        return (
            <Page title='系列课分销用户列表' className='channel-distri-list-container'>
                <header className='tabs'>
                    <section className={`tab auth-tab ${this.state.authTab == 'auth' ? 'active' : ''}`}>
                        <div onClick={()=>{this.toggleTabs('auth')}}>
                            <span>授权课代表(</span>
                            <span id='auth-rep-num'>{this.state.authCount-this.state.authNotSend}</span>
                            <span>)</span>
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
                            <span>自动分销(</span>
                            <span id='auto-rep-num'>{this.state.autoCount}</span>
                            <span>)</span>
                        </div>
                    </section>
                </header>
                <section className='content'>
                    
                    <ScrollToLoad
                        className={`scroll-box auth-scroll ${this.state.authTab == 'auth' ? '' : 'hide'}`}
                        toBottomHeight={500}
                        loadNext={ this.loadMoreRepresent.bind(this) }
                        noneOne={this.state.authIsNoOneDistribution}
                        noMore={ this.state.authIsNoMoreDistribution } >
                        
                        <AuthRepresent 
                            AuthRepresents = {this.state.authList} 
                            showIfAuthDialog = {this.showIfAuthDialog.bind(this)}
                            deleteAuthItem = {this.deleteAuthItem.bind(this)}
                            
                        />

                    </ScrollToLoad>
                    <ScrollToLoad
                        className={`scroll-box auth-scroll ${this.state.authTab == 'return' ? '' : 'hide'}`}
                        toBottomHeight={500}
                        loadNext={ this.loadMoreReturn.bind(this) }
                        noneOne={this.state.returnIsNoOne}
                        noMore={ this.state.returnNoMore } >

                        <ReturnRepresent
                            list={this.state.returnList}
                            channelId= {this.props.params.channelId}
                        />
                    </ScrollToLoad>
                    <ScrollToLoad
                        className={`scroll-box auth-scroll ${this.state.authTab == 'auto' ? '' : 'hide'}`}
                        toBottomHeight={500}
                        loadNext={ this.loadMoreRepresent.bind(this) }
                        noneOne={this.state.autoIsNoOneDistribution}
                        noMore={ this.state.autoIsNoMoreDistribution } >

                        <AutoRepresent 
                            
                            AuthRepresents = {this.state.autoList} 
                            
                        />

                    </ScrollToLoad>
                </section>
                {
                    this.state.authTab == 'auth'?
                        <footer className='footer'>
                            <a className='btn btn-add' href={`/wechat/page/channel-distribution-add/${this.props.params.channelId}`}><span className='icon_plus'></span>添加分销用户</a>
                            {
                                (this.state.authNotSend > 1)?
                                <div className='btn btn-mass' onClick={this.initBatchShare.bind(this)}>{this.state.authNotSend}个未领取，点击群发</div>
                                :null
                            }
                        </footer>
                    :
                        this.state.authTab == 'auto'?
                            <footer className='footer'>

                                <div className='btn btn-mass'><a href={`/wechat/page/channel-distribution-set/${this.state.channelId}`}>自动分销<var className="status">（{this.state.autoStatus=== 'Y'?'已开启':'未开启'}）</var></a></div>

                            </footer>
                        : 
                            null
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
        channelInfo: state.channel.channelInfo,
        autoShareInfo: state.autoShareInfo
    };
}

const mapActionToProps = {
    getChannelDistributionList,
    getChannelInfo,
    channelAutoDistributionInfo,
    missionList,
};

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelDistributionList);