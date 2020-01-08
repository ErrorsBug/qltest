/**
 * Created by qingxia on 20180417.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import TabView from 'components/tab-view/v2';
import { autobind } from 'core-decorators';
import { getVal, formatDate , locationTo, imgUrlFormat } from 'components/util';
import ScrollToLoad from "components/scrollToLoad";
import ManageDistributeBox from "./components/live-distribute-box";
import SetDistributeBox from "./components/set-distribute-box";
import { getShareUsersLive, getShareUsersLiveCount, getShareLiveManage, getTopic, getChannel , liveInfo } from '../../actions/distribute';

@autobind
class AuthDistribute extends Component {

    state = {
        tabs: [
            {
                name: '设置课代表',
                businessType: 'set',
            },
            {
                name: '管理课代表',
                businessType: 'manage',
            },
            {
                name: '分销说明',
                businessType: 'state',
            }
        ],
        activeTabIndex: Number(this.props.location.query.tab) || 0,
        // typeTags: [
        //     {
        //         name: "直播间",
        //         type: "live",
        //     },
        //     {
        //         name: "系列课",
        //         type: "channel",
        //     },
        //     {
        //         name: "话题",
        //         type: "topic",
        //     },
        // ],
        // activeTypeIndex: 0,
        noMore: false,
        noOne: false,
        liveId: this.props.location.query.liveId,
        liveInfo: {},


        pageSize: 20,


        distributeList: [],
        liveListManageNoMore: false,
        liveListManageNoneOne: false,
        manageLivePageNum: 1,

        liveShareList: [],
        liveListNoMore: false,
        liveListNoneOne: false,
        livePageNum: 1,
        

        channelList: [],
        channelListNoMore: false,
        channelListNoneOne: false,
        channelPageNum: 1,

        topicList: [],
        topicListNoMore: false,
        topicListNoneOne: false,
        topicPageNum: 1,

        distributeCount: {},
    }
    data = {
        newtimer: new Date().getTime(),
    }

    componentDidMount(){
        this.handleIOSRefresh();
        this.getLiveDistributeList();
        this.getShareUsersLiveCount();
        this.getChannelList();
        this.getTopicList();
        this.getDistributeList();
        this.liveInfo();
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

    onClickTab(index){
        if(index ===1 && (new Date().getTime() - this.data.newtimer) >= 20000 ){
            this.data.newtimer = new Date().getTime();
            this.setState({
                distributeList: [],
                liveListManageNoMore: false,
                liveListManageNoneOne: false,
                manageLivePageNum: 1,
            },()=>{
                this.getDistributeList();
            });
            
        }
        this.setState({
            activeTabIndex: index,
        });
    }

    async liveInfo(){
        let liveInfo = await this.props.liveInfo(this.state.liveId);
        console.log(liveInfo)
        this.setState({
            liveInfo,
        });
    }

    /** 设置课程分销 start */

    async getChannelList(next){
        let channelList = await this.props.getChannel(this.state.liveId,this.state.channelPageNum);
            if(channelList && channelList.length>0){
                this.setState({
                    channelList: [ ...this.state.channelList, ...channelList],
                    channelPageNum: this.state.channelPageNum + 1,
                },()=>{
                    next && next();
                });
                if(channelList.length < this.state.pageSize){
                    this.setState({
                        channelListNoMore: true,
                    });
                }
            }else{
                if(this.state.channelList.length > 0 ){
                    this.setState({
                        channelListNoMore: true,
                    });
                }else{
                    this.setState({
                        channelListNoneOne: true,
                    });
                }
                next && next();
            }
            

    }

    async getTopicList(next){
        let topicList = await this.props.getTopic(this.state.liveId,this.state.topicPageNum)
            if(topicList && topicList.length>0){
                console.log(this.state.topicPageNum)
                this.setState({
                    topicList: [ ...this.state.topicList, ...topicList],
                    topicPageNum: this.state.topicPageNum + 1,
                },()=>{
                    console.log(this.state.topicPageNum)
                    next && next();
                });
                if(topicList.length < this.state.pageSize){
                    this.setState({
                        topicListNoMore: true,
                    });
                }
            }else{
                if(this.state.topicList.length > 0 ){
                    this.setState({
                        topicListNoMore: true,
                    });
                }else{
                    this.setState({
                        topicListNoneOne: true,
                    });
                }
                next && next();
            }
            

    }

    async getLiveDistributeList(next){
        let result = await this.props.getShareUsersLive({
            businessId: this.state.liveId,
            businessType: 'live',
            page: {
                page: this.state.livePageNum,
                size: this.state.pageSize
            },
        });
        if(result.state.code ===0 ){
            let liveShareList = result.data.shareUsers || [];
            if(liveShareList.length>0){
                this.setState({
                    liveShareList: [ ...this.state.liveShareList, ...liveShareList],
                    livePageNum: this.state.livePageNum + 1,
                },()=>{
                    next && next();
                });
                if(liveShareList.length < this.state.pageSize){
                    this.setState({
                        liveListNoMore: true,
                    });
                }
            }else{
                if(this.state.liveShareList.length > 0 ){
                    this.setState({
                        liveListNoMore: true,
                    });
                }else{
                    this.setState({
                        liveListNoneOne: true,
                    });
                }
                next && next();
            }
            
        }
        
    }

    async getShareUsersLiveCount (){
        let result = await this.props.getShareUsersLiveCount({
            businessId: this.state.liveId,
            businessType: 'live',
        });
        if(result.state.code === 0){
            this.setState({
                distributeCount: result.data,
            });
        }
    }
    /** 设置课程分销 end */



    /** 直播间课代表管理 */
    async getDistributeList (next){
        let result = await this.props.getShareLiveManage({
            businessId: this.state.liveId,
            businessType: 'live',
            page: {
                page: this.state.manageLivePageNum,
                size: this.state.pageSize
            },
        });
        
        if(result.state.code ===0){
            let distributeList = result.data.shareUser||[];
            if(distributeList.length>0){
                this.setState({
                    distributeList: [...this.state.distributeList, ...distributeList],
                    manageLivePageNum: this.state.manageLivePageNum + 1,
                },()=>{
                    next && next();
                })
                if(distributeList.length < this.state.pageSize){
                    this.setState({
                        liveListManageNoMore: true,
                    },()=>{
                        next && next();
                    })
                }
            }else{
                if(this.state.distributeList.length > 0){
                    this.setState({
                        liveListManageNoMore: true,
                    })
                }else{
                    this.setState({
                        liveListManageNoneOne: true,
                    })
                }
                next && next();
            }
            
        }
    }

    changeDistributeList(list){
        console.log(list);
        this.setState({
            distributeList: list||[],
        });
    }

    changeShareList(list){
        this.setState({
            liveListNoneOne: list.length <= 0,
            liveShareList: list,
        }, () => this.getShareUsersLiveCount());
    }

    async updateShareStatus(shareId,shareStatus, type){
        await this.props.updateShareStatus({
            shareId,shareStatus, type
        });
    }

    

    render() {
        const { tabs, activeTabIndex, distributeList } = this.state;
        console.log(distributeList);
        return (
            <Page title="课程分销" className="auth-distribute">
                <TabView
                    config={tabs}
                    activeIndex={activeTabIndex}
                    onClickItem={this.onClickTab}
                    
                />
                {
                    activeTabIndex === 0 &&
                    <SetDistributeBox 
                        onClickTab = {this.onClickTab.bind(this,1)} 
                        liveId = {this.state.liveId}
                        liveInfo = { this.state.liveInfo.entity||{} }
                        liveShareList= {this.state.liveShareList}
                        liveListNoMore= {this.state.liveListNoMore}
                        liveListNoneOne= {this.state.liveListNoneOne}
                        livePageNum= {this.state.livePageNum}
                        pageSize={this.state.pageSize}
                        getLiveDistributeList = {this.getLiveDistributeList}

                        channelListNoMore= {this.state.channelListNoMore}
                        channelListNoneOne= {this.state.channelListNoneOne}
                        getChannelList = {this.getChannelList}
                        channelList = {this.state.channelList}

                        topicListNoMore= {this.state.topicListNoMore}
                        topicListNoneOne= {this.state.topicListNoneOne}
                        getTopicList = {this.getTopicList}
                        topicList = {this.state.topicList}
                        distributeCount= {this.state.distributeCount}
                        updateShareStatus = {this.updateShareStatus}
                        changeShareList = {this.changeShareList} 
                        />
                    
                }
                {
                    activeTabIndex === 1 &&
                    <ManageDistributeBox className="manage-distribute-box" liveId = {this.state.liveId}
                        noMore = {this.state.liveListManageNoMore}
                        noneOne = {this.state.liveListManageNoneOne}
                        getDistributeList = {this.getDistributeList}
                        distributeList = {distributeList}
                        changeDistributeList = {this.changeDistributeList}
                    />
                }
                {
                    activeTabIndex === 2 &&
                    <div className="state-distribute-box">
                        <div className="state-li" onClick={()=>locationTo('/topic/share/user/guide.htm')} >分销流程说明 <i className="icon_enter"></i></div>
                        <div className="state-li" onClick={()=>locationTo('https://mp.weixin.qq.com/s?__biz=MzA4MTk0OTY1MQ==&mid=100002154&idx=1&sn=e065850640c722e89ed8e53753993480&mpshare=1&scene=1&srcid=1010NAMN94iGkFOE2ztsgN8n&from=singlemessage#wechat_redirect')}>直播间分销教程 <i className="icon_enter"></i></div>
                        <div className="state-li" onClick={()=>locationTo('https://mp.weixin.qq.com/s?__biz=MzA4MTk0OTY1MQ==&mid=100002045&idx=1&sn=564f08cf3590ea50651141459041b75a&mpshare=1&scene=1&srcid=1010a40CDgVlkkFTvNzDIOvE&from=singlemessage#wechat_redirect')}>单课分销教程 <i className="icon_enter"></i></div>

                        <div className="state-tips">
                        <span>1.直播间分销范畴：付费单课的购买和赠送、付费系列课的购买、续费和赠送、系列课内单节购买、直播间VIP购买（不包括赞赏、私问、转载课等其他交易形式）。</span> <br/>
                        <span>2.系列课分销范畴：当前系列课的购买和续费，支持知识通转载课。 </span> <br/>
                        <span>3.单课分销范畴：当前单课的购买和赠送。</span> <br/>
                        <span>4.同一个用户，既是直播间课代表，也是某个系列课／单课的课代表，若该系列课／单课分销成功，则按系列课／单课分销设置的分成比例来结算。</span> <br/>
                        <span>5.课代表分销您从知识通转载的课程，从您的分成所得金额与其进行分成结算。</span><br/>
                        </div>
                    </div>
                }
            </Page>
        );
    }
}

function mapStateToProps (state) {
	return {
	}
}

const mapActionToProps = {
    getShareUsersLive, 
    getShareUsersLiveCount,
    getChannel,
    getTopic,
    getShareLiveManage,
    liveInfo,
};

module.exports = connect(mapStateToProps, mapActionToProps)(AuthDistribute);