import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import { stringify } from 'querystring';

import { locationTo } from 'components/util'
import {
    loadTopicList,
    loadChannelList,
} from '../../../actions/live'
import ScrollToLoad from 'components/scrollToLoad';


class TopicChannelSelector extends Component {

    constructor(props) {
        super(props);

        this.liveId = props.router.location.query.liveId;
    }

    state = {
        // channel | topic
        nav: "channel",

        channelList : [],
        topicList : [],

        noMoreTopic: false,
        pageTopic: 1,
    }

    data = {
        choseType: "",
        choseIndex: "",
        choseId: "",
    }
    
    async componentDidMount() {
        await this.initList();


        if(this.state.topicList && this.state.topicList.length < 20) {
            this.setState({
                noMoreTopic: true
            })
        }
    }

    initList = async () => {
        if (this.props.lists.channelList && this.props.lists.channelList.length < 1) {
            await this.props.loadChannelList(this.liveId,'N')
        }

        if (this.props.lists.topicList && this.props.lists.topicList.length < 1) {
            await this.props.loadTopicList(this.liveId, {page: 1, size: 20 }, 'N')
        }


        let query = this.props.router.location.query;
        let channelList = this.props.lists && this.props.lists.channelList;
        let topicList = this.props.lists && this.props.lists.topicList;
        let index = 0;

        if (query.type) {
            this.navHandle(query.type);

            if (query.type === 'channel') {
                channelList = channelList.map((item, index) => {
                    if (item.id == query.businessId) {
                        item.chosen = true;
                    }

                    return item;
                })
            }
        }

        this.setState({
            channelList,
            topicList,
        })

    }

    navHandle = (nav) => {
        this.setState({
            nav: nav
        })
    }

    loadChannelList = async () => {
        let list = []
        var result = await this.props.loadChannelList(this.liveId)

        if(result && result.courseList && result.courseList.length > 0) {
            result.courseList.map((item) => {
                list.push({
                    pageTopic: this.state.pageTopic + 1,
                    name: item.name,
                    topicId: item.topicId
                })
            })
        }

        this.setState({
            channelList: list,
        })

    }

    loadMoreTopicHandle = async (next) => {
        let list = [...this.state.topicList]
        var result = await this.props.loadTopicList(this.liveId, {page: this.state.pageTopic + 1, size: 20})

        if (!this.state.noMoreTopic) {
            var result = await this.props.loadTopicList(this.liveId, {page: this.state.pageTopic + 1, size: 20})
            if(result.topicList.length == 20) {
                result.topicList.map((item) => {
                    list.push({
                        pageTopic: this.state.pageTopic + 1,
                        name: item.name,
                        topicId: item.topicId
                    })
                })
                this.setState({
                    topicList: list,
                    noMoreTopic: false
                })
            } else if(result.topicList.length > 0 && result.topicList.length < 20) {
                result.topicList.map((item) => {
                    list.push({
                        pageTopic: this.state.pageTopic + 1,
                        name: item.name,
                        topicId: item.topicId
                    })
                })
                this.setState({
                    topicList: list,
                    noMoreTopic: true
                })
            } else if(result.topicList.length == 0){
                this.setState({
                    pageTopic: this.state.pageTopic + 1,
                    noMoreTopic: true
                })
            }
        }

        if(typeof next === "function") {
            next()
        }
    }

    choseHandle = (type ,index, id) => {
        // 如果之前有选中项目，在此清除选择
        let channelList = [...this.state.channelList]
        let topicList = [...this.state.topicList]

        switch(this.data.choseType) {
            case "channel":
                if (this.state.channelList[this.data.choseIndex]) {
                    channelList[this.data.choseIndex] = {
                        name: this.state.channelList[this.data.choseIndex].name,
                        id: this.state.channelList[this.data.choseIndex].id,
                        chosen: false,
                    }
                }
                
                this.setState((prevState) => {
                    return { channelList: channelList }
                })
                break;
            case "topic":
                if (this.state.topicList[this.data.choseIndex]) {
                    topicList[this.data.choseIndex] = {
                        name: this.state.topicList[this.data.choseIndex].name,
                        topicId: this.state.topicList[this.data.choseIndex].topicId,
                        chosen: false,
                    }
                }
                this.setState((prevState) => {
                    return { topicList: topicList }
                })
                break;
            default:
                break;
        }

        // 修改data已经新的选择数据
        switch (type) {
            case "channel":
                this.data.choseType = "channel"
                this.data.choseIndex = index
                this.data.choseId= id

                if(this.state.channelList[index]) {
                    channelList[index] = {
                        name: this.state.channelList[index].name,
                        id: this.state.channelList[index].id,
                        chosen: true,
                    }
                }
                this.setState((prevState) => {
                    return { channelList: channelList }
                })

                break;
            case "topic":
                this.data.choseType = "topic"
                this.data.choseIndex = index
                this.data.choseId= id

                if(this.state.topicList[index]) {
                    topicList[index] = {
                        name: this.state.topicList[index].name,
                        topicId: this.state.topicList[index].topicId,
                        chosen: true,
                    }
                }

                this.setState((prevState) => {
                    return { topicList: topicList }
                })

                break;
            default:
                break;
        }

        setTimeout(() => {
            const query = this.props.router.location.query;
            query.type = type;
            query.businessName = type == 'topic' ? this.state.topicList[index].name : this.state.channelList[index].name;
            query.businessId = id;
            window.location.replace('/wechat/page/live-banner-editor?' + stringify(query));
        }, 500);
    }

    list = () => {
        switch(this.state.nav) {
            case "channel" :
                return (
                    this.state.channelList ? this.state.channelList.map((item, idx) => {
                        return (
                            <div 
                                key = {"channel-item-" + idx}
                                className={`list-item ${item.chosen? "chosen" : ""}`}
                                onClick={this.choseHandle.bind(this, "channel", idx, item.id)}
                            >
                                <div className="text">{item.name}</div>
                            </div>
                        )
                    }) : ""
                )
            case "topic" :
                return (
                    <ScrollToLoad
                        ref="scrollBox"
                        className="list-scroll-con"
                        toBottomHeight={500}
                        noMore={this.state.noMoreTopic}
                        page={this.state.pageTopic}
                        loadNext={this.loadMoreTopicHandle}
                        notShowLoaded={true}
                    >
                        {
                            this.state.topicList ? this.state.topicList.map((item, idx) => {
                                return (

                                    <div
                                        key = {"topic-item-" + idx}
                                        className={`list-item ${item.chosen ? "chosen" : ""}`}
                                        onClick={this.choseHandle.bind(this, "topic", idx, item.topicId)}
                                    >
                                        <div className="text">{item.name}</div>
                                    </div>

                                )
                            }) : ""
                        }
                    </ScrollToLoad> 
                )
            default:
                break;
        }
    }

    render() {
        return (
            <Page title={'选择链接类型'} className='choose-timeline-type'>
                <nav className="nav">
                    <div onClick={this.navHandle.bind(this, "channel")} className={`nav-item ${this.state.nav == "channel" ? "active" : ""}`}> <div className="text">系列课</div> </div>
                    <div onClick={this.navHandle.bind(this, "topic")} className={`nav-item ${this.state.nav == "topic" ? "active" : ""}`}><div className="text">课程</div></div>
                </nav>

                <div className="list-con">
                    {this.list()}
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state){
    return{
        lists: state.live.liveBannerTypes
    }
}

const mapDispatchToProps ={
    loadTopicList,
    loadChannelList,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TopicChannelSelector)