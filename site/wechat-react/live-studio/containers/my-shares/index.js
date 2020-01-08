const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';

import LiveShareList from './components/live-share-list';
import TopicShareList from './components/topic-share-list';
import ChannelShareList from './components/channel-share-list';
// actions
import { 
    getMyshare,
 } from '../../actions/my-shares';

class MyShares extends Component {

    state = {
        livePage:1,
        topicPage:1,
        channelPage:1,
        pageSize:20,

        // 没有更多直播间数据
        isNoMoreLiveDate:false,
        isNoMoreTopicDate:false,
        isNoMoreChannelDate:false,

        livenone:false,
        topicnone:false,
        channelnone:false,

        // tab状态
        tabOn:"live",
    }

    get liveId(){
		return this.props.location.query.liveId
	}

    async loadMoreLiveDate(isInit=false,next){
        this.setState({
            livePage:this.state.livePage+1
        })
        let result = await this.props.getMyshare("live",this.state.livePage,this.state.pageSize,this.liveId);
        if(result.state&&result.state.code == 0){
            this.nonePageShow(result.data.dataList,"live");
            
        }
        next&&next();
    }
    async loadMoreTopicDate(isInit=false,next){
        this.setState({
            topicPage:this.state.topicPage + 1
        })
        let result = await this.props.getMyshare("topic",this.state.topicPage,this.state.pageSize,this.liveId);
        if(result.state&&result.state.code == 0){
            this.nonePageShow(result.data.dataList,"topic");
        }
        next&&next();
    }

    
    async loadMoreChannelDate(isInit=false,next){
        this.setState({
            channelPage:this.state.channelPage + 1
        })
        let result = await this.props.getMyshare("channel",this.state.channelPage,this.state.pageSize,this.liveId);
        if(result.state&&result.state.code == 0){
            this.nonePageShow(result.data.dataList,"channel");
        }
        next&&next();
    }

    async componentDidMount() {
        this.switchTab('live');
    }

    nonePageShow(initList,type,isInit){
        if (isInit=="Y"&&initList.length<=0){
            switch (type){
                case "live": 
                    this.setState({
                        livenone:true
                    })
                    break;
                case "topic":
                    this.setState({
                        topicnone:true
                    });
                     break;
                case "channel":this.setState({
                        channelnone:true
                    }); break;
            }
        }else if(initList.length<this.state.pageSize){
            switch (type){
                case "live": 
                    this.setState({
                        isNoMoreLiveDate:true
                    })
                    break;
                case "topic":
                    this.setState({
                        isNoMoreTopicDate:true
                    });
                     break;
                case "channel":this.setState({
                        isNoMoreChannelDate:true
                    }); break;
            }
            
        };
        
    }



    async switchTab(val){
        this.setState({
            tabOn:val,
        })

        const {
            channelPage,
            isNoMoreChannelDate,

            topicPage,
            isNoMoreTopicDate,

            livePage,
            isNoMoreLiveDate,

            pageSize,
        } = this.state;
        switch (val) {
            case 'channel':
                if (channelPage === 1 && this.props.channelShareList.length === 0 && !isNoMoreChannelDate) {
                    var resultchannel= await this.props.getMyshare("channel",channelPage,pageSize,this.liveId);
                    this.nonePageShow(resultchannel.data.dataList || [],"channel",'Y');
                }
                break;
        
            case 'topic':
                if (topicPage === 1 && this.props.topicShareList.length === 0 && !isNoMoreTopicDate) {
                    var resulttopic= await this.props.getMyshare("topic",topicPage,pageSize,this.liveId);
                    this.nonePageShow(resulttopic.data.dataList || [],"topic",'Y');
                }
                break;
        
            case 'live':
                if (livePage === 1 && this.props.liveShareList.length === 0 && !isNoMoreLiveDate) {
                    var resultlive= await this.props.getMyshare("live",livePage,pageSize,this.liveId);
                    this.nonePageShow(resultlive.data.dataList || [],"live",'Y');
                }
                break;
        
            default:
                break;
        }
    }

    render() {

        let { banners, courseList } = this.props;

        return (
            <Page title={`我的推广`} className='my-shares-container'>
                <div className="flex-body my-shares-flex">
                    <div className="tab-head">
                        <span className={`tab-item ${this.state.tabOn=="live"&&"on"}`} onClick={()=>{ this.switchTab("live")}} >直播间</span>
                        <span className={`tab-item ${this.state.tabOn=="channel"&&"on"}`} onClick={()=>{ this.switchTab("channel")}} >系列课</span>
                        <span className={`tab-item ${this.state.tabOn=="topic"&&"on"}`} onClick={()=>{ this.switchTab("topic")}} >话题</span>
                    </div>
                    <div className={`flex-main-h live-flex-main ${this.state.tabOn!="live"&&"hide"}`}>
                        <ScrollToLoad
                            className="scroll-box"
                            toBottomHeight={100}
                            page={this.state.livePage}
                            noneOne={this.state.livenone}
                            loadNext={ this.loadMoreLiveDate.bind(this) }
                            noMore={ this.state.isNoMoreLiveDate } >
                            <LiveShareList 
                                shareList = {this.props.liveShareList}
                            />
                        </ScrollToLoad>
                    </div>
                    <div className={`flex-main-h live-flex-main ${this.state.tabOn!="channel"&&"hide"}`}>
                        <ScrollToLoad
                            className="scroll-box"
                            toBottomHeight={100}
                            page={this.state.channelPage}
                            noneOne={this.state.channelnone}
                            loadNext={ this.loadMoreChannelDate.bind(this) }
                            noMore={ this.state.isNoMoreChannelDate } >
                            <ChannelShareList 
                                shareList = {this.props.channelShareList}
                            />
                        </ScrollToLoad>
                    </div>
                    <div className={`flex-main-h live-flex-main ${this.state.tabOn!="topic"&&"hide"}`}>
                        <ScrollToLoad
                            className="scroll-box"
                            toBottomHeight={100}
                            page={this.state.topicPage}
                            noneOne={this.state.topicnone}
                            loadNext={ this.loadMoreTopicDate.bind(this) }
                            noMore={ this.state.isNoMoreTopicDate } >
                            <TopicShareList 
                                shareList = {this.props.topicShareList}
                            />
                        </ScrollToLoad>
                    </div>
                    
                </div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        liveShareList:state.myShareList.liveShareList,
        topicShareList:state.myShareList.topicShareList,
        channelShareList:state.myShareList.channelShareList,
    }
}

const mapActionToProps = {
    getMyshare,
}

export default connect(mapStateToProps, mapActionToProps)(MyShares);
