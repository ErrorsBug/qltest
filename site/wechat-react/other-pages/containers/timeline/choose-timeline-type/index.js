import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import { locationTo } from 'components/util'
import {
    loadTopicList,
    loadHomeworkList,
    loadChannelList,
    getLiveId,
    setLiveId,
} from '../../../actions/timeline'
import ScrollToLoad from 'components/scrollToLoad';


class ChooseTimelineType extends Component {

    state = {
        // channel | topic | homework
        nav: "channel",

        channelList : [],
        topicList : [],
        homeworkList : [],


        noMoreTopic: false,
        noMoreHomework: false,
        pageTopic: 1,
        pageHomework: 1,

    }

    data = {
        choseType: "",
        choseIndex: "",
        choseId: "",
    }
    
    async componentDidMount() {
        
        if(this.props.location.query.liveId) {
            await this.props.setLiveId(this.props.location.query.liveId)
        } else {
            if(!this.props.liveId){
                await this.props.getLiveId()
            }
        }

        await this.initList();


        if(this.state.topicList && this.state.topicList.length < 20) {
            this.setState({
                noMoreTopic: true
            })
        }
        if(this.state.homeworkList && this.state.homeworkList.length < 20) {
            this.setState({
                noMoreHomework: true
            })
        }
    }
    
     initList = async () => {
        if (this.props.lists.channelList && this.props.lists.channelList.length < 1) {
            await this.props.loadChannelList(this.props.liveId)
        } 
        if (this.props.lists.topicList && this.props.lists.topicList.length < 1) {
            await this.props.loadTopicList(this.props.liveId, {page: 1, size: 20})
        } 
        if (this.props.lists.homeworkList && this.props.lists.homeworkList.length < 1) {
           await this.props.loadHomeworkList(this.props.liveId, {page: 1, size: 20})
        } 

            this.setState({
                channelList: this.props.lists && this.props.lists.channelList,
                topicList: this.props.lists && this.props.lists.topicList,
                homeworkList: this.props.lists && this.props.lists.homeworkList,
            })

    }

    navHandle = (nav) => {
        this.setState({
            nav: nav
        })
    }
    loadChannelList = async () => {
        let list = []
        var result = await this.props.loadChannelList(this.props.liveId)

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
        var result = await this.props.loadTopicList(this.props.liveId, {page: this.state.pageTopic + 1, size: 20})

        if (!this.state.noMoreTopic) {
            var result = await this.props.loadTopicList(this.props.liveId, {page: this.state.pageTopic + 1, size: 20})
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

    loadMoreHomeworkHandle = async (next) => {
        let list = [...this.state.homeworkList]

        if (!this.state.noMoreHomework) {
            var result = await this.props.loadHomeworkList(this.props.liveId, {page: this.state.pageTopic + 1, size: 20})
            if(result.list.length == 20) {
                result.list.map((item) => {
                    list.push({
                        pageHomework: this.state.pageHomework + 1,
                        title: item.title,
                        id: item.id
                    })
                })
                this.setState({
                    homeworkList: list,
                    noMoreHomework: false
                })
            } else if(result.list.length > 0 && result.list.length < 20) {
                result.list.map((item) => {
                    list.push({
                        pageHomework: this.state.pageHomework + 1,
                        title: item.title,
                        id: item.id
                    })
                })
                this.setState({
                    homeworkList: list,
                    noMoreHomework: true
                })
            } else if(result.list.length == 0){
                this.setState({
                    pageHomework: this.state.pageHomework + 1,
                    noMoreHomework: true
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
        let homeworkList = [...this.state.homeworkList]

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
            case "homework":
                if (this.state.homeworkList[this.data.choseIndex]) {
                    homeworkList[this.data.choseIndex] = {
                        title: this.state.homeworkList[this.data.choseIndex].title,
                        id: this.state.homeworkList[this.data.choseIndex].id,
                        chosen: false,
                    }
                }
                this.setState((prevState) => {
                    return { homeworkList: homeworkList }
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
            case "homework":
                this.data.choseType = "homework"
                this.data.choseIndex = index
                this.data.choseId= id

                if(this.state.homeworkList[index]) {
                    homeworkList[index] = {
                        title: this.state.homeworkList[index].title,
                        id: this.state.homeworkList[index].id,
                        chosen: true,
                    }
                }

                this.setState((prevState) => {
                    return { homeworkList: homeworkList }
                })

                break;                

        
            default:
                break;
        }
    }

    confirmHandle = () => {

        if(this.data.choseId) {
            this.props.router.push(`/wechat/page/timeline/create?liveId=${this.props.liveId}&type=${this.data.choseType}&id=${this.data.choseId}`)
            // locationTo(`/wechat/page/timeline/create?type=${this.data.choseType}&id=${this.data.choseId}`)
        } else {
            window.toast("请选择动态关联的系列课、课程或作业")
        }
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
            case "homework" :
                return (
                    <ScrollToLoad
                        ref="scrollBox"
                        className="list-scroll-con"
                        toBottomHeight={500}
                        noMore={this.state.noMoreHomework}
                        page={this.state.pageHomework}
                        loadNext={this.loadMoreHomeworkHandle}
                        notShowLoaded={true}
                    >
                        {
                            this.state.homeworkList ? this.state.homeworkList.map((item, idx) => {
                                return (

                                    <div
                                        key = {"homework-item-" + idx}
                                        className={`list-item ${item.chosen ? "chosen" : ""}`}
                                        onClick={this.choseHandle.bind(this, "homework", idx, item.id)}
                                    >
                                        <div className="text">{item.title}</div>
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
            <Page title={'选择动态类型'} className='choose-timeline-type'>
                <nav className="nav">
                    <div onClick={this.navHandle.bind(this, "channel")} className={`nav-item ${this.state.nav == "channel" ? "active" : ""}`}> <div className="text">系列课</div> </div>
                    <div onClick={this.navHandle.bind(this, "topic")} className={`nav-item ${this.state.nav == "topic" ? "active" : ""}`}><div className="text">单课</div></div>
                    <div onClick={this.navHandle.bind(this, "homework")} className={`nav-item ${this.state.nav == "homework" ? "active" : ""}`}><div className="text">作业</div></div>
                </nav>

                <div className="list-con">
                    {this.list()}
                </div>

                <div className="conform" onClick={this.confirmHandle}>
                    <div className="text">下一步</div>
                </div>

            </Page>
        );
    }
}

function mapStateToProps(state){
    return{
        lists: state.timeline.timelineTypes,
        liveId: state.timeline.myCurrentLiveId,
    }
}

const mapDispatchToProps ={
    loadTopicList,
    loadHomeworkList,
    loadChannelList,
    getLiveId,
    setLiveId,
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseTimelineType)