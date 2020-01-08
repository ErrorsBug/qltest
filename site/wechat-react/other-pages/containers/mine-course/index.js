import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import dayjs from 'dayjs';

import Page from 'components/page';
import TabBar from 'components/tabbar';
import ScrollToLoad from 'components/scrollToLoad';
// import ListDialog from 'components/dialog/list-dialog';
import BottomDialog from 'components/dialog/bottom-dialog';

import { getVal, locationTo, formatDate } from 'components/util';
import { purchaseCourse, planCourse, recentCourse, courseAlert } from '../../actions/mine';

import {
    fetchIsMineNew,
} from '../../actions/recommend';

import QlchatFocusAds from 'components/qlchat-focus-ads';
import {
    getQlchatSubscribeStatus,
    getQlchatQrcode
} from '../../actions/common';

@autobind
class MineCourse extends Component {

    data = {
        pageSize: 20,
        timeToday: "", 
        timeTomorrow: "", 
        timeTDAT: "", 
    }

    state = {
        // 个人中心定制课程小红点状态
        isMineNewSession: "N",

        // recent(最近学习) immediately（即将开始） purchased（已购课程） 
        activeTag: "recent",

        // recent(最近学习列表)
        chosnHomeworkList: [],
        showHomeworkDialog: false,

        recentList: [
            // {
            //     id: "2000000352308292",
            //     topic: "国民穿搭导师：教你穿出优势，用美赢得机会",
            //     backgroundUrl: "https://img.qlchat.com/qlLive/channelLogo/74W4PM5R-NMP4-C8OJ-1511585925100-K58LA3E1N5DB.jpg@296h_480w_1e_1c_2o",
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


        //immediately（即将开始列表）
        originDataList: [
            // {
            //     topicId: "200000035234292",
            //     topicName: "30日 4点的话题",
            //     startTime: "1511985600000",
            //     backgroundUrl: "https://img.qlchat.com/qlLive/channelLogo/74W4PM5R-NMP4-C8OJ-1511585925100-K58LA3E1N5DB.jpg@296h_480w_1e_1c_2o",
            // },
        ],
        todayList: [],
        tomorrowList: [],
        TDATList: [],
        restList: [],

        // purchased（已购课程）
        purchasedList: [
            // {
            //     bussinessId: "222222cc222",
            //     type: "名字很长的系列课",
            //     title: "channel",
            //     pic: "https://img.qlchat.com/qlLive/channelLogo/74W4PM5R-NMP4-C8OJ-1511585925100-K58LA3E1N5DB.jpg@296h_480w_1e_1c_2o",
            //     money: "22",
            //     time: "1511745720000",
            //     learningCount: "22",
            //     topicCount: "22",
            //     hasFile: true,
            // },
        ],
        purchasedPage: 1,
        purchasedNoMore: false,
		showQlchatAds: false,
		isFocusThree: false,
		isFocusQlchat: false,
		threeQrcode: '', // 三方二维码
		qlchatQrcode: '', // 官方二维码
    }

    async componentDidMount() {

        this.windowPopStateHandle()

        // 小红点标识状态相关
        this.initIsMineNew();
        this.initIsMineNewSession();
        

        this.initImmediatelyList()
        this.loadRecent()
        this.loadPurchased()


        // this.immediatelyDateFilter()
        this.setTraceSession()

        // this.initFocusAds();
    }



    setTraceSession() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', "mine-course");
    }

    initImmediatelyList = async () => {
        const result = await this.props.planCourse({page: {
            page : 1, 
            size : 40 
        }})
        if(result && result.data && result.data.dataList && result.data.dataList.length > 0) {
            this.setState({
                originDataList :result.data.dataList
            })
            this.immediatelyDateFilter(result.data.dataList)
        }
    }

    immediatelyDateFilter = (dataList) => {

        var todayTimeStamp = parseInt(new Date(new Date(this.props.sysTime).setHours(0,0,0,0)).getTime())

        var timeStamp1 = todayTimeStamp + 86400000
        var timeStamp2 = timeStamp1 + 86400000
        var timeStamp3 = timeStamp2 + 86400000
    
        this.data.timeToday = todayTimeStamp
        this.data.timeTomorrow = timeStamp1
        this.data.timeTDAT = timeStamp2

        const  dateJudge = (judgeTime) => {
            var timeBeJudge = parseInt(judgeTime)
            if(timeBeJudge < todayTimeStamp) {
                return "今天以前"
            } else if(timeBeJudge >= todayTimeStamp && timeBeJudge < timeStamp1 ){
                return "今天"
            } else if(timeBeJudge >= timeStamp1 && timeBeJudge < timeStamp2 ){
                return "明天"
            } else if(timeBeJudge >= timeStamp2 && timeBeJudge < timeStamp3 ){
                return "后天"
            } else {
                return "后天以后"
            }
        }

        const originDataList = dataList || this.state.originDataList
        const todayList = this.state.todayList
        const tomorrowList = this.state.tomorrowList
        const TDATList = this.state.TDATList
        const restList = this.state.restList

        originDataList.map((item) => {
            switch (dateJudge(item.startTime)) {
                case "今天":
                    todayList.push(item)
                    break;
                case "明天":
                    tomorrowList.push(item)
                    break;
                case "后天":
                    TDATList.push(item)
                    break;
                case "后天以后":
                    restList.push(item)
                    break;
                default:
                    break;
            }
        })

        this.setState({
            todayList,
            tomorrowList,
            TDATList,
            restList,
        })
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
            // noMore: result.length < this.data.pageSize,
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
            locationTo(`/topic/details?topicId=${item.id}`)
        }
    }
    goToTopicIntro = (e, item) => {
        locationTo(`/wechat/page/topic-intro?topicId=${item.id}`)
    }

    goToCourse = (e, item) => {
        switch (item.type) {
            case "channel":
                locationTo(`/live/channel/channelPage/${item.bussinessId}.htm`)
                break;
            case "topic":
                locationTo(`/topic/details?topicId=${item.bussinessId}`)
                break;
            default:
                break;
        }
    }

    renderEmpty = () => {
        return (
            <div className="empty-con">
                <div className="empty-img"></div>
                暂无课程
            </div>
        )
    }

    renderCourseList = () => {
        switch (this.state.activeTag) {
            case "recent":
                if(this.state.recentList.length === 0) {
                    return this.renderEmpty()
                }
                return (
                    <ScrollToLoad
                        className={'recent-list ' + (this.state.showQlchatAds ? "more-top": "") }
                        loadNext={this.loadRecent}
                        noMore={this.state.recentNoMore}
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
            case "immediately":
                if(this.state.originDataList.length === 0) {
                    return this.renderEmpty()
                }
                return (
                    <div className={"immediately-list " + (this.state.showQlchatAds ? "more-top": "") }>
                        {
                            this.state.todayList.length > 0 &&
                            <div className='immediately-list-con'> 
                                <div className="time today">{formatDate(this.data.timeToday, 'MM-dd')} 今天</div>

                                {this.state.todayList.map((item, index) => {
                                    return(
                                        <div className="immediately-list-item on-log" 
                                            data-log-course-id={item.id}
                                            data-log-region="immediately-list"
                                            data-log-time="今天"
                                            data-log-name="即将开始"
                                            key={`immediately-list-item-${item.id}`} 
                                            onClick={(e) => {this.goToTopicDetails(e, item)}}
                                        >
                                            <div className="img-con">
                                                <img className='headImg' src={`${item.backgroundUrl}@296h_480w_1e_1c_2o`} alt="" />
                                                <div className="img-time"> <span className="clock-icon"></span> {formatDate(item.startTime, 'hh:mm')}</div>
                                            </div>
                                            <div className="info">
                                                <div className="title">{item.topic}</div>
                                                <div className="topic-time">开课时间：{formatDate(item.startTime, 'MM-dd hh:mm')}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {
                            this.state.tomorrowList.length > 0 &&
                            <div className='immediately-list-con'> 
                                <div className="time">{formatDate(this.data.timeTomorrow, 'MM-dd')} 明天</div>
                                {this.state.tomorrowList.map((item, index) => {
                                    return(
                                        <div className="immediately-list-item on-log" 
                                            data-log-course-id={item.id}
                                            data-log-region="immediately-list"
                                            data-log-time="明天"
                                            data-log-name="即将开始"
                                            key={`immediately-list-item-${item.id}`} 
                                            onClick={(e) => {this.goToTopicDetails(e, item)}}
                                        >
                                            <div className="img-con">
                                                <img className='headImg' src={`${item.backgroundUrl}@296h_480w_1e_1c_2o`} alt="" />
                                                <div className="img-time"> <span className="clock-icon"></span> {formatDate(item.startTime, 'hh:mm')}</div>
                                            </div>
                                            <div className="info">
                                                <div className="title">{item.topic}</div>
                                                <div className="topic-time">开课时间：{formatDate(item.startTime, 'MM-dd hh:mm')}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {
                            this.state.TDATList.length > 0 &&
                            <div className='immediately-list-con'> 
                                <div className="time">{formatDate(this.data.timeTDAT, 'MM-dd')} 后天</div>

                                {this.state.TDATList.map((item, index) => {
                                    return(
                                        <div className="immediately-list-item on-log" 
                                            data-log-course-id={item.id}
                                            data-log-region="immediately-list"
                                            data-log-time="后天"
                                            data-log-name="即将开始"
                                            key={`immediately-list-item-${item.id}`} 
                                            onClick={(e) => {this.goToTopicDetails(e, item)}}
                                        >
                                            <div className="img-con">
                                                <img className='headImg' src={`${item.backgroundUrl}@296h_480w_1e_1c_2o`} alt="" />
                                                <div className="img-time"> <span className="clock-icon"></span> {formatDate(item.startTime, 'hh:mm')}</div>
                                            </div>
                                            <div className="info">
                                                <div className="title">{item.topic}</div>
                                                <div className="topic-time">开课时间：{formatDate(item.startTime, 'MM-dd hh:mm')}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {
                            this.state.restList.length > 0 &&
                            <div className="immediately-list-con">
                                <div className="time">三天后</div>
                                {this.state.restList.map((item, index) => {
                                    return(
                                        <div className="immediately-list-item on-log" 
                                            data-log-course-id={item.id}
                                            data-log-region="immediately-list"
                                            data-log-time="三天后"
                                            data-log-name="即将开始"
                                            key={`immediately-list-item-${item.id}`} 
                                            onClick={(e) => {this.goToTopicDetails(e, item)}}
                                        >
                                            <div className="img-con">
                                                <img className='headImg' src={`${item.backgroundUrl}@296h_480w_1e_1c_2o`} alt="" />
                                            </div>
                                            <div className="info">
                                                <div className="title">{item.topic}</div>
                                                <div className="topic-time">开课时间：{formatDate(item.startTime, 'MM-dd hh:mm')}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>
                )
            case "purchased":
                if(this.state.purchasedList.length === 0) {
                    return this.renderEmpty()
                }
                return (
                    <ScrollToLoad
                        className={'purchased-list ' + (this.state.showQlchatAds ? "more-top": "")}
                        loadNext={this.loadPurchased}
                        noMore={this.state.purchasedNoMore}
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

    // 初始化是否有新课程（个人中心小红点）
    initIsMineNewSession() {
        var newPointList = {};
        if (localStorage.getItem('newPointList')) {
            newPointList = JSON.parse(localStorage.getItem('newPointList'));
            if (newPointList["个人中心_课程定制"] && newPointList["个人中心_课程定制"].length <= 0) {
                this.setState({
                    isMineNewSession: "Y",
                });
            }
        } else {
            this.setState({
                isMineNewSession: "Y",
            });
        };
    }
    initIsMineNew() {
        this.props.fetchIsMineNew();
    }

    // closeQlchatAds = () => {
    //     // session内不再显示
	// 	try {
    //         const maxAge = new Date(dayjs().format('YYYY/MM/DD 23:59:59')).getTime();
	// 		localStorage.setItem('__hideTopBarAds', maxAge)
	// 	} catch (e) {}

    //     this.setState({
    //         showQlchatAds: false
    //     })
    // }

	// /**
	//  * 获取关注状态
	//  * 1.优先关注垂直号
	//  * 2.次关注千聊
	//  * 3.引导下载app
	//  */
	// initFocusAds = async () => {
	// 	// 是否显示顶部广告
	// 	try {
	// 		if (new Date().getTime() < localStorage.getItem('__hideTopBarAds')) {
	// 			return
	// 		}
	// 	} catch (e) {}

	// 	let subscribeStatus = await this.props.getQlchatSubscribeStatus()

	// 	let isFocusThree = subscribeStatus.isFocusThree,
	// 		isFocusQlchat = subscribeStatus.subscribe || !subscribeStatus.isShowQl;

	// 	this.setState({
	// 		isFocusThree,
	// 		isFocusQlchat
	// 	})

	// 	// 获取三方二维码
	// 	if (!isFocusThree) {
	// 		let threeQrcode = await this.props.getQlchatQrcode({ liveId: '2000000645972374', showQl: 'N' });
	// 		threeQrcode && this.setState({
	// 			threeQrcode
	// 		})
	// 	}

	// 	// 获取官方二维码
	// 	if (!isFocusQlchat) {
	// 		let qlchatQrcode = await this.props.getQlchatQrcode({ liveId: '2000000645972374'});
	// 		qlchatQrcode && this.setState({
	// 			qlchatQrcode
	// 		})
	// 	}

	// 	this.setState({
	// 		showQlchatAds: true
	// 	})
    // }

    onChangeVisiable(show) {
		this.setState({
			showQlchatAds: show
		})
    }

    render() {
        return (
            <Page title="我的课程" className="my-course-page">

                {/* {this.state.showQlchatAds ? 
                    <QlchatFocusAds onClose={this.closeQlchatAds} qrcode={this.state.threeQrcode||this.state.qlchatQrcode} />
                    : null
                } */}
                {/* <QlchatFocusAds onChangeVisiable={ this.onChangeVisiable } /> */}
                <div className={"tag-menu"}>
                    <div className={`tag on-log${this.state.activeTag == "recent" ? " active" : ""}`}
                         onClick={this.tagClickHandle.bind(this, "recent")}
                         data-log-name="最近学习tag"
                         data-log-region="tag-menu"
                         data-log-pos="recent"
                    >最近学习</div>
                    <div className={`tag on-log${this.state.activeTag == "immediately" ? " active" : ""}`}
                         onClick={this.tagClickHandle.bind(this, "immediately")}
                         data-log-name="即将开始tag"
                         data-log-region="tag-menu"
                         data-log-pos="immediately"
                    >即将开始</div>
                    <div className={`tag on-log${this.state.activeTag == "purchased" ? " active" : ""}`}
                         onClick={this.tagClickHandle.bind(this, "purchased")}
                         data-log-name="已购课程tag"
                         data-log-region="tag-menu"
                         data-log-pos="purchased"
                    >已购课程</div>
                </div>

               
                {this.renderCourseList()}


                <BottomDialog
                    show={this.state.showHomeworkDialog}
                    theme={'list'}
                    items={this.state.chosnHomeworkList}
                    title={"作业列表"}
                    close={true}
                    onClose={this.hideHomeworkList}
                    onItemClick={this.homeworkListHandle}
                />

                <TabBar
                    activeTab={"discover"}
                    isMineNew={this.props.isMineNew && this.props.isMineNew.isPushNew == "Y" ? true : false}
                    isMineNewSession={this.state.isMineNewSession}
                />

            </Page>
        );
    }
}

MineCourse.propTypes = {

};

function mapStateToProps (state) {
    return {
        isMineNew: state.recommend.isMineNew,
        sysTime: state.common.sysTime,
    }
}

const mapActionToProps = {
    purchaseCourse, planCourse, recentCourse, courseAlert,

    fetchIsMineNew,
    getQlchatSubscribeStatus,
    getQlchatQrcode
}

module.exports = connect(mapStateToProps, mapActionToProps)(MineCourse);
