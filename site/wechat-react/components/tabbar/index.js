import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';
import { connect } from 'react-redux';
import Redpoint from '../redpoint';

import { locationTo } from '../util';
import { isFunctionWhite } from 'common_actions/common';
import { getCookie } from 'components/util'; 

import { courseAlert } from '../../other-pages/actions/mine';
import { getLearnEverydayNewData } from '../../other-pages/actions/live';



class TabBar extends Component {
    state = {
        showTimelineSpot: false,

        showMyCourseSpot: false,

        showPointSystemTips: false,

        // 如果60min内点击过“我的课程”tab 则不显示红点 这个用来记录
        CourseClicked: false,

        isHaveNewDataInLearnEveryday: 'N',//每天学是否有最新信息

        // 是否启用春节样式
        isSpringFestival: false,

        // 是否为白名单
        isWhite: false
    }

    componentWillMount(){
        // 2月4日00：00-2月11日00：00，底部导航展示春节样式
        if(this.props.sysTime > new Date(2019,1,4,0,0,0).getTime() && this.props.sysTime < new Date(2019,1,11,0,0,0).getTime()){
            this.setState({
                isSpringFestival: true
            })
        }
    }
    
    componentDidMount() {
        this.hadnleWhiteList();
        // if(typeof localStorage !== "undefined" && !localStorage.getItem("timelineSpot")) {
        //     this.setState({
        //         showTimelineSpot: true
        //     })
        // }
        if(this.props.activeTab == "discover") {
            window.localStorage.setItem("lastCourseClickTime", this.props.sysTime)
        }
        
        // 积分体系提示
        // if(typeof localStorage !== "undefined" && !localStorage.getItem("pointSystemTips")) {
        //     this.setState({
        //         showPointSystemTips: true
        //     })
        // }
        this.initMyCourseSpot()
        this.isHaveNewDataInLearnEveryday()
    }

    // 处理报名单
    async hadnleWhiteList() {
        const { isWhite } = await isFunctionWhite(getCookie("userId"), "ufw");
        console.log(isWhite && Object.is(isWhite, 'Y'))
        this.setState({
            isWhite: isWhite && Object.is(isWhite, 'Y')
        })
    }

    componentWillReceiveProps(nextProps){
        // 底部导航条每天学红点的存在与否取决于用户当天有没有进去“每天学”页面调用一个获取学习信息的接口，所以进去“每天学”页面请求了那个接口之后应该再调用一次这个方法
        if(nextProps.canRequest && nextProps.canRequest !== this.props.canRequest && window.location.pathname == '/wechat/page/learn-everyday'){
            this.isHaveNewDataInLearnEveryday()
        }
    }

    initMyCourseSpot = async () => {
        let lastViewTime = window.localStorage.getItem("lastCourseClickTime")
        if(lastViewTime && (this.props.sysTime - parseInt(lastViewTime) < 3600000)) {
            this.setState({
                CourseClicked: true
            })
        }
        const result = await this.props.courseAlert()
        if(result && result.data && result.data.topicList && result.data.topicList.length > 0) {
            this.setState({
                showMyCourseSpot: true
            })
        }
    }

    isHaveNewDataInLearnEveryday = async() => {
        let isHaveNewDataInLearnEveryday = await getLearnEverydayNewData()
        this.setState({isHaveNewDataInLearnEveryday})
    }

    render() {
        console.log(this.props.activeTab, this.state.isWhite)
        return (
            <ul className={`co-tab-bar${this.state.isSpringFestival ? ' spring-festival': ''}`}>
                <li
                    className={classnames("tab-item", "recommend", "on-log", {
                        active: this.props.activeTab === 'recommend'
                    })}
                    onClick={e => {
                        if(this.props.activeTab != 'recommend'){
                            locationTo(`/wechat/page/recommend`);
                        }
                    }}
                    data-log-region="tab-bar"
                    data-log-pos="recommend"
                    data-log-name="推荐">
                    <div className="tab-icon"></div>
                    <div className="tab-title">推荐</div>
                </li>
                <li
                    className={classnames("tab-item", "university", "on-log on-visible", {
                        active: this.props.activeTab === 'university'
                    })}
                    onClick={e => {
                        if(this.props.activeTab != 'university'){
                            locationTo(`/wechat/page/university/home?isTab=Y&ch=university_qltar&wcl=university_ql_tab2`);
                        }
                    }}
                    data-log-region="university-tar"
                    data-log-pos="university"
                    data-log-name="大学">
                    <div className="tab-icon">
                    </div>
                    <div className="tab-title">大学</div>
                </li>
                {/* { !!this.state.isWhite ? (
                    <li
                        className={classnames("tab-item", "university", "on-log", {
                            active: this.props.activeTab === 'university'
                        })}
                        onClick={e => {
                            if(this.props.activeTab != 'university'){
                                locationTo(`/wechat/page/university/home?isTab=Y`);
                            }
                        }}
                        data-log-region="university-tar"
                        data-log-pos="university"
                        data-log-name="大学">
                        <div className="tab-icon">
                        </div>
                        <div className="tab-title">大学</div>
                    </li>
                ) : (
                    <Link
                        className={classnames("tab-item", "timeline", "on-log", {
                            active: this.props.activeTab === 'timeline'
                        })}
                        to={this.state.isHaveNewDataInLearnEveryday === 'Y' ? '/wechat/page/learn-everyday?wcl=lc_discover_dailylearning&f=messages' : '/wechat/page/messages'}
                        data-log-region="tab-bar"
                        data-log-pos="timeline"
                        data-log-name="动态">
                        <div className="tab-icon">
                            {
                                this.state.isHaveNewDataInLearnEveryday === 'Y' ?
                                    <Redpoint pointContent="" pointStyle="" pointBtnStyle="" pointNpval={`每天学`} isNotLocalstorage="Y" />
                                    : ""
                            }
                        </div>
                        <div className="tab-title">动态</div>
                    </Link>
                ) } */}
                <li
                    className={classnames("tab-item", "bought", "on-log", {
                        active: this.props.activeTab === 'discover'
                    })}
                    onClick={ () => {
                        if(this.props.activeTab != 'discover'){
                            const url = this.state.showMyCourseSpot && !this.state.CourseClicked ? "/wechat/page/mine/course?activeTag=purchased" : (this.state.isHaveNewDataInLearnEveryday === "Y" ? "/wechat/page/learn-everyday?wcl=lc_course_dailylearning&f=course" : "/wechat/page/mine/course?activeTag=recent")
                            locationTo(url)
                        }
                    } }
                    data-log-region="tab-bar"
                    data-log-pos="course"
                    data-log-name="我的课程">
                    <div className="tab-icon">
                        {
                            (this.state.showMyCourseSpot && !this.state.CourseClicked || this.state.isHaveNewDataInLearnEveryday === 'Y') && this.props.activeTab != 'discover' ?
                                <Redpoint pointContent="" pointStyle="" pointBtnStyle="" pointNpval={`新课提醒`} isNotLocalstorage="Y" />
                                : ""
                        }
                    </div>
                    <div className="tab-title">我的课程</div>
                </li>
                <li
                    className={classnames("tab-item", "mine", "on-log", {
                        active: this.props.activeTab === 'mine'
                    })}
                    onClick={e => {
                        if (this.props.activeTab != 'mine') {
                            locationTo(`/wechat/page/mine`);
                        }
                    }}
                    data-log-region="tab-bar"
                    data-log-pos="mine"
                    data-log-name="个人中心">
                    {
                        this.state.showPointSystemTips && (
                            <div 
                                className="point-system-tips on-visible"
                                data-log-region="point-system-tips"
                                >
                                <span>做任务赚学分</span>
                            </div>
                        )
                    }
                    <div className="tab-icon">
                        {
                            this.props.isMineNewSession == "Y" ?
                                <Redpoint pointContent="" pointStyle="" pointBtnStyle="" pointNpval={`个人中心_课程定制`} isNotLocalstorage="Y" />
                                :
                                (
                                    this.props.isMineNew ?
                                        <Redpoint pointContent="" pointStyle="" pointBtnStyle="" pointNpval={`我的个人中心-定制`} isNotLocalstorage="Y" />
                                        :
                                        null
                                )
                        }

                    </div>
                    <div className="tab-title">个人中心</div>
                </li>
            </ul>
        );
    }
}

TabBar.propTypes = {
    // 当前激活的tab名称
    activeTab: PropTypes.string.isRequired,
    isMineNew: PropTypes.bool.isRequired,
    isMineNewSession: PropTypes.string.isRequired,
};


function mapStateToProps (state) {
    return {
        sysTime: state.common.sysTime,
    }
}
const mapActionToProps = {
    courseAlert,
}

export default connect(mapStateToProps, mapActionToProps)(TabBar);