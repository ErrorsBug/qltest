import React, {Component} from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import CoralTabBar from 'components/coral-tabbar';

import { getVal, locationTo, formatDate } from 'components/util';
import { purchaseCourse, recentCourse } from '../../actions/mine';

import {
    getUserInfo,
} from '../../actions/common';
import { getMyIdentity } from '../../actions/mine';

@autobind
class MineCourse extends Component {

    data = {
        pageSize: 20,
        timeToday: "", 
        timeTomorrow: "", 
        timeTDAT: "", 
    }

    state = {
        // recent(最近学习) immediately（即将开始） purchased（已购课程） 
        activeTag: "recent",

        // recent(最近学习列表)
        chosnHomeworkList: [],
        showHomeworkDialog: false,

        recentList: [
            // {
            //     id: "2000000352308292",
            //     topic: "国民穿搭导师：教你穿出优势，用美赢得机会",
            //     backgroundUrl: "https://img.qlchat.com/qlLive/channelLogo/74W4PM5R-NMP4-C8OJ-1511585925100-K58LA3E1N5DB.jpg",
            //     lastLearnTime: "0",
            //     endRate: 33,
            //     homeworks: [
            //         {
            //             id: "1111111",
            //             title: "这是第一份作业"
            //         },
            //         {
            //             id: "1111111",
            //             title: "这是第二份作业"
            //         },
            //     ]
            // },
        ],
        recentPage: 1,
        recentNoMore: false,
        recentNoOne: false,

        // purchased（已购课程）
        purchasedList: [
            // {
            //     bussinessId: "222222cc222",
            //     type: "channel",
            //     title: "名字很长的系列课",
            //     pic: "https://img.qlchat.com/qlLive/channelLogo/74W4PM5R-NMP4-C8OJ-1511585925100-K58LA3E1N5DB.jpg",
            //     money: "22",
            //     time: "1511745720000",
            //     learningCount: "22",
            //     topicCount: "22",
            //     hasFile: true,
            // },
        ],
        purchasedPage: 1,
        purchasedNoMore: false,
        purchasedNoOne: false,
		showQlchatAds: false,
		isFocusThree: false,
		isFocusQlchat: false,
		threeQrcode: '', // 三方二维码
		qlchatQrcode: '', // 官方二维码
    }

    async componentDidMount() {
        this.initLinkData();
        this.windowPopStateHandle()

        this.loadRecent()
        this.loadPurchased()

        this.setTraceSession()

    }

    async initLinkData(){
        const task = [];
        if(!this.props.userInfo.userId){
            task.push(this.props.getUserInfo());
        }
        if(this.props.myIdentity.identity === undefined){
            task.push(this.props.getMyIdentity());
        }
        return await Promise.all(task);
    }



    setTraceSession() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', "coral");
    }

    loadRecent = async (next) => {

        let time = 0
        if(this.state.recentList.length > 0) {
            time = this.state.recentList[this.state.recentList.length - 1].lastLearnTime
        }

        const result = await this.props.recentCourse({
            pageSize: 20,
            time: time,
            beforeOrAfter: "before"
        })

        const dataList = this.state.recentList

        if(result && result.data && result.data.learningList && result.data.learningList.length > 0) {
            result.data.learningList.map((item) => {
                dataList.push(item)
            })
        }

        let noMore = true
        if(result && result.data && result.data.learningList && result.data.learningList.length > 0) {
            noMore = false
        }

        this.setState({
            recentPage: this.state.recentPage + 1,
            recentList: dataList,
            recentNoMore: noMore,
            recentNoOne: this.state.recentList.length<0&&result.data.learningList.length<=0
        }, () => {
            next && next();
        });
    }
    loadPurchased = async (next) => {
        const result = await this.props.purchaseCourse({page: {
            page : this.state.purchasedPage, 
            size : this.data.pageSize,
        }})

        const dataList = this.state.purchasedList
        let resultList = []
        if(result && result.data && result.data.list && result.data.list.length > 0) {
            resultList = result.data.list
        }

        resultList.map((item) => {
            dataList.push(item)
        })

        this.setState({
            purchasedPage: this.state.purchasedPage + 1,
            purchasedList: dataList,
            purchasedNoMore: resultList.length < this.data.pageSize,
            purchasedNoOne: resultList.length <=0&&result.data.list.length >= 0,
        }, () => {
            next && next();
        });
    }

    tagHandle = () => {
        this.setState({
            activeTag: this.props.location.query.activeTag
        })
    }

    windowPopStateHandle = () => {

        if(this.props.location.query.activeTag) {
            this.setState({
                activeTag: this.props.location.query.activeTag
            })
        }

        window.addEventListener('popstate', this.tagHandle);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.tagHandle);
    }

    tagClickHandle = (key) => {
        window.history.pushState(null,null,"?activeTag=" + key)
        this.setState({
            activeTag: key
        })

        if (typeof _qla != 'undefined') {
            _qla('pv', {});
        }
    }

    recentListHomeworkHandle = (homeWorkList) => {

        console.log(homeWorkList);

        if(homeWorkList && homeWorkList.length == 1) {
            locationTo("/wechat/page/homework/details?id=" + homeWorkList[0].id)
            return 
        }

        const dataList = []
        homeWorkList.map((item, index) => {
            dataList.push({
                key: item.id,
                content: item.title,
                show: true,
            })
        })

        this.setState({
            chosnHomeworkList: dataList,
            showHomeworkDialog: true,
        })
    }

    goToTopicDetails = (e, item) => {
        if(e.target.className != "homeWork") {
            locationTo(`/topic/details?topicId=${item.id}&source=coral`)
        }
    }

    goToCourse = (e, item) => {
        switch (item.type) {
            case "channel":
                locationTo(`/wechat/page/channel-intro?channelId=${item.bussinessId}&source=coral`)
                break;
            case "topic":
                locationTo(`/topic/details?topicId=${item.bussinessId}&source=coral`)
                break;
            default:
                break;
        }
    }

    renderCourseList = () => {
        switch (this.state.activeTag) {
            case "recent":
                return (
                    <ScrollToLoad
                        className={'recent-list ' + (this.state.showQlchatAds ? "more-top": "") }
                        loadNext={this.loadRecent}
                        noMore={this.state.recentNoMore}
                        noneOne={this.state.recentNoOne}
                        emptyPic={require('./imgs/empty.png')}
                    >
                        {
                            this.state.recentList.map((item, index) => (
                                <div className="recent-item on-log" key={`recent-item-${index}`} 
                                    data-log-course-id={item.id}
                                    data-log-region="recentList"
                                    data-log-name="最近学习"
                                    onClick={(e) => { 
                                    if(e.target.className != "homeWork on-log")  {
                                        this.goToTopicDetails(e, item)
                                    }
                                    
                                }}>
                                    <img className="headImg" src={`${item.backgroundUrl}@296h_480w_1e_1c_2o`} alt=""/>
                                    <div className="info">
                                        <div className="title">{item.topic}</div>
                                        <div className="last-learn">上次学习{formatDate(item.lastLearnTime, "MM-dd hh:mm")}</div>
                                        {/*<div className="rate">已学{(item.endRate * 100).toFixed(2)}%</div>*/}
                                    </div>
                                    {
                                        item.homeworks && item.homeworks.length > 0 ?
                                            <div 
                                                className="homeWork on-log" 
                                                onClick={this.recentListHomeworkHandle.bind(this, item.homeworks)}
                                                data-log-course-id={item.id}
                                                data-log-region="mycourse-homework"
                                            >
                                            </div>
                                        :
                                            <div className="empty-homework"></div>
                                    }
                                </div>
                            ))
                        }
                    </ScrollToLoad>
                )
            case "purchased":
                return (
                    <ScrollToLoad
                        className={'purchased-list ' + (this.state.showQlchatAds ? "more-top": "")}
                        loadNext={this.loadPurchased}
                        noMore={this.state.purchasedNoMore}
                        noneOne = {this.state.purchasedNoOne}
                        emptyPic={require('./imgs/empty.png')}
                    >
                        {
                            this.state.purchasedList.map((item, index) => (
                                <div className="purchased-item on-log" 
                                    data-log-course-id={item.bussinessId}
                                    data-log-region="purchased"
                                    data-log-type={item.type}
                                    data-log-name="已购课程"
                                    key={`purchased-item-${index}`} 
                                    onClick={(e) => {this.goToCourse(e, item)}}
                                >
                                    <img src={`${item.pic}@296h_480w_1e_1c_2o`} alt="" className="headImg"/>
                                    <div className="info">
                                        <div className={`title${item.type === "channel" ? " channel" : ""}`}>{item.type === "channel" && <span className='channel-tag'>系列课</span>} {item.title} {item.hasFile && <span className='file-icon'></span>}</div>
                                        {item.type === "channel" && <div className="topicNum">共{item.topicCount}节课</div>} 
                                    </div>
                                </div>
                            ))
                        }
                    </ScrollToLoad>
                )
            default:
                break;
        }
    }

    homeworkListHandle = (e) => {
        locationTo("/wechat/page/homework/details?id=" + e)
    }

    hideHomeworkList = (e) => {
        this.setState({
            showHomeworkDialog: false,
            chosnHomeworkList: []
        })
    }


    onChangeVisiable(show) {
		this.setState({
			showQlchatAds: show
		})
    }

    render() {
        return (
            <Page title="我的课程" className="my-course-page">
                <div className={"tag-menu"}>
                    <div className={`tag on-log${this.state.activeTag == "recent" ? " active" : ""}`}
                         onClick={this.tagClickHandle.bind(this, "recent")}
                         data-log-name="最近学习tag"
                         data-log-region="tag-menu"
                         data-log-pos="recent"
                    >最近学习</div>
                    <div className={`tag on-log${this.state.activeTag == "purchased" ? " active" : ""}`}
                         onClick={this.tagClickHandle.bind(this, "purchased")}
                         data-log-name="已购课程tag"
                         data-log-region="tag-menu"
                         data-log-pos="purchased"
                    >已购课程</div>
                </div>

               
                {this.renderCourseList()}


                <div className="shop-bottom">
                    <CoralTabBar className="coral-bottom"  activeTab="coral-bought" />
                </div>

            </Page>
        );
    }
}

MineCourse.propTypes = {

};

function mapStateToProps (state) {
    return {
        myIdentity: state.mine.myIdentity || {},
        sysTime: state.common.sysTime,
        userInfo: state.mine.userInfo||{},
    }
}

const mapActionToProps = {
    purchaseCourse, 
    recentCourse,

    getMyIdentity,
    getUserInfo,
}

module.exports = connect(mapStateToProps, mapActionToProps)(MineCourse);
