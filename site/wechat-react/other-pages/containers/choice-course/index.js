import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from "core-decorators";
import NewCourse from "./components/new-course";
import CourseItem from "./components/course-item";
import ScrollToLoad from "components/scrollToLoad";
import { getPublicCourse, clearCourses } from "../../actions/choice";
import { locationTo, getCookie } from "components/util";
import ShareUserApp from 'components/share-user-app';
import { getUserInfo } from '../../actions/common';
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils';
import HomeFloatButton from "components/home-float-button";
import {
    bindOfficialKey,
} from '../../../actions/common';

@autobind
class ChoiceCourse extends Component {
    state = {
        progress: {},
        page: 0,
        isShare: this.props.location.query && !!this.props.location.query.userId && (getCookie("userId") !== this.props.location.query.userId), // 是否分享
    };
    get urlParams(){
        return getUrlParams("","")
    }

    get tracePage() {
        return window.sessionStorage && sessionStorage.getItem('trace_page')
    }

    set tracePage(tp) {
        window.sessionStorage && sessionStorage.setItem('trace_page', tp)
    }

    async componentDidMount() {

        this.init();
        let progress = localStorage.getItem("coursePercentageCompleteRecord");
        this.setState({
            progress: progress ? JSON.parse(progress) : {}
        });
        if(this.props.location.query){
            await this.props.getUserInfo('',this.props.location.query.userId);
        }
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('ch-scroll');
             // 绑定非window的滚动层
        }, 1000);
        this.initShare();


        if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
        }
        
        //officialKey，就绑定关系
        if(this.props.location.query.officialKey){
            this.props.bindOfficialKey({
                officialKey: this.props.location.query.officialKey
            });
        }

    }
    async componentWillUnmount() {
        this.setState({ page: 0 });
        this.props.clearCourses();
    }
    initShare(){
        const { userInfo } = this.props;
        const urlParams = this.urlParams;
        const hreFUrl = window.location.href;
        let url = '';
        urlParams.secondName = encodeURIComponent(urlParams.secondName || '');
        if(urlParams && urlParams.userId){
            const userId = getCookie("userId");
            urlParams.userId = userId;
        } else {
            urlParams.userId = userInfo.user ? userInfo.user.userId : '';
        }
        if(this.tracePage === 'coral'){
            urlParams.officialKey = getCookie("userId");
        }
        url = fillParams(urlParams,hreFUrl);
        share({
            title: '千聊公开课----免费，因为无价',
            timelineTitle: '千聊公开课----千聊知识平台匠心打造',
            desc: '千聊知识平台匠心打造',
            timelineDesc: '千聊知识平台匠心打造', // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/business/PUXNZY3D-3TEM-RKWX-1545997112634-F3H7OILGKJHI.png',
            shareUrl: url
        });
    }
    // 初始化获取数据
    init() {
        const param = {
            page: this.props.pageNumb,
        }
        this.props.getPublicCourse(param);
    }
    // 加载更多
    loadNext(next) {
        const { pageNumb, isNoMore } = this.props;
        if (this.state.page !== pageNumb) {
            this.setState(
                {
                    page: pageNumb
                },
                async () => {
                    if (!isNoMore) {
                        await this.init();
                    }
                }
            );
        }
        next && next();
    }
    // 跳转链接
    LinkTo(topicId) {
        if (!!topicId) {
            let { courseList } = this.props;
            let freePublicCourse = courseList.find(
                item => item.topicId == topicId
            );
            if (freePublicCourse.style) {
                if (freePublicCourse.style.indexOf("video") > -1) {
                    return locationTo(
                        `/wechat/page/topic-simple-video?topicId=${
                            freePublicCourse.topicId
                        }`
                    );
                } 
                if (freePublicCourse.style.indexOf('audio') > -1) {
                    if (freePublicCourse.style == "audioGraphic") {
                        return locationTo(
                            `/topic/details-listening?topicId=${
                                freePublicCourse.topicId
                            }`
                        );
                    } else {
                        if (freePublicCourse.status == "ended") {
                            return locationTo(
                                `/topic/details-listening?topicId=${
                                    freePublicCourse.topicId
                                }`
                            );
                        } else {
                            return locationTo(
                                `/topic/details-video?topicId=${
                                    freePublicCourse.topicId
                                }`
                            );
                        }
                    }
                }
            }
            return locationTo(`/topic/details-listening?topicId=${topicId}`);
        }
    }
    scrollingFunc(){
        console.log("jjjjjjjjjjjj")
        this.setState({
          scrolling: 'Y',
        });
        clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
          this.setState({
            scrolling: 'S',
          });
        },1000)
      }

    render() {
        const {
            courseList,
            location: { query = {} },
            userInfo
        } = this.props;
        return (
            <Page title={'千聊公开课'} className="ch-box">
                <ScrollToLoad
                    className="ch-scroll on-visible"
                    toBottomHeight={300}
                    noneOne={this.props.noData}
                    loadNext={this.loadNext}
                    noMore={this.props.isNoMore}
                    scrollToDo={this.scrollingFunc.bind(this)}
                >
                    {!!courseList.length &&
                        courseList.map((item, index) => {
                            if (index === 0) {
                                return (
                                    <NewCourse
                                        {...query}
                                        key={index}
                                        {...item}
                                        title={ this.props.title }
                                        progress={this.state.progress}
                                        linkToTopic={this.LinkTo}
                                    />
                                );
                            } else {
                                return (
                                    <CourseItem
                                        {...item}
                                        key={index}
                                        progress={this.state.progress}
                                        linkToTopic={this.LinkTo}
                                    />
                                );
                            }
                        })}
                </ScrollToLoad>
                { this.state.isShare && <ShareUserApp show="choice" userInfo={ userInfo.user || {} } /> }
                <HomeFloatButton scrolling = { this.state.scrolling }/>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        courseList: state.choice.courseList || [],
        pageNumb: state.choice.pageNumb || 0,
        noData: state.choice.noData || false,
        isNoMore: state.choice.isNoMore || false,
        userInfo: state.common.userInfo || {},
        title: state.choice.title,
    };
}

const mapActionToProps = {
    getPublicCourse,
    clearCourses,
    getUserInfo,
    bindOfficialKey,
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(ChoiceCourse);
