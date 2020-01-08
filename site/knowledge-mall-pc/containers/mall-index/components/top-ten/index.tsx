import * as React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import {  } from '../../../../actions/course';
import { updateNavCourseModule, setLoginModalShow, setReprintModalShow } from "../../../../actions/common";
import { fetchCourseList, updateCourseList, clearCourseList,setReprintInfo, setPromotionInfo } from '../../../../actions/course';
import { fetchTopTenCourses } from "../../../../actions/recommend";
import SectionHeader from "../../../../components/section-header";
import CourseList from "../top-ten-course-list";

import styles from './style.scss';

export interface props {
    liveId: string;
    agentId: string;
    fetchTopTenCourses: (liveId: string, agentId: string) => any;
    userIdentity: string;
    setReprintInfo: (any) => void;
    setReprintModalShow: (string) => void;
    setPromotionModalShow: (string) => void;
    setPromotionInfo: (any) => void;
    setLoginModalShow: (string) => void;
}

@autobind
class TopTen extends React.Component<props, any> {
    state = {
        // 热销排行课程数据
        courses: [],
    }

    // 获取热销排行数据
    async fetchTopTenCourses(liveId, agentId) {
        await this.props.fetchTopTenCourses(liveId, agentId);
    }

    // 登录检查
    checkLogin() {
        if (this.props.userIdentity === 'not-login') {
            this.props.setLoginModalShow('Y');
            return false;
        } else {
            return true;
        }
    }

    // 推广课程
    promoteCourse(e) {
        if (!this.checkLogin) {
            return;
        }
        const courseIndex = +e.target.getAttribute('data-index');
        const course = this.state.courses[courseIndex];
        const {
            tweetId,
            liveName, 
            relayChannelId, 
            businessName, 
            selfMediaPercent,
            businessHeadImg,
            selfMediaProfit,
            amount,
            liveId,
            discountStatus,
            chargeMonths,
            discount,
        } = course;
        const shareUrl = `${window.location.origin}/live/channel/channelPage/${relayChannelId}.htm`;
        const percent = selfMediaPercent;
        const data = {
            businessImage: businessHeadImg,
            businessId: relayChannelId,
            businessName,
            amount: discountStatus == 'Y' ? discount : amount,
        };
        this.props.setReprintInfo({
            tweetId,
            reprintLiveId: liveId,
            reprintLiveName: liveName,
            reprintChannelId: relayChannelId,
            reprintChannelName: businessName,
            reprintChannelImg: businessHeadImg,
            reprintChannelAmount:  amount,
            reprintChannelDiscount: discount,
            selfMediaPercent: selfMediaPercent,
            selfMediaProfit: selfMediaProfit,
            discountStatus,
            chargeMonths,
        });
        this.props.setPromotionInfo({shareUrl, percent, data});
        this.props.setPromotionModalShow('Y');
    }

    // 转载课程
    relayCourse(e) {
        if (!this.checkLogin()) {
            return;
        }
        const courseIndex = +e.target.getAttribute('data-index');
        const course = this.state.courses[courseIndex];
        const {
            tweetId,
            liveName, 
            businessId,
            businessName, 
            selfMediaPercent,
            businessHeadImg, 
            selfMediaProfit,
            amount,
            liveId,
            discountStatus,
            discount,
            chargeMonths,
        } = course;
        this.props.setReprintInfo({
            tweetId,
            reprintLiveId: liveId,
            reprintLiveName: liveName,
            reprintChannelId: businessId,
            reprintChannelName: businessName,
            reprintChannelImg: businessHeadImg,
            reprintChannelAmount: amount,
            reprintChannelDiscount: discount,
            selfMediaPercent: selfMediaPercent,
            selfMediaProfit: selfMediaProfit,
            discountStatus,
            chargeMonths,
            index: courseIndex,
            reprintCallback: this.reprintCallback,
        });
        this.props.setReprintModalShow('Y');
    }

    // 转载回调
    reprintCallback(courseIndex, response) {
        const relayChannelId = response.data.relayChannelId;
        let newList = [...this.state.courses]
        newList[courseIndex].isRelay = 'Y';
        newList[courseIndex].relayChannelId = relayChannelId;
        this.setState({
            courses: [...newList]
        });
    }

    componentDidMount() {
        this.fetchTopTenCourses(this.props.liveId, this.props.agentId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.liveId != this.props.liveId) {
            this.fetchTopTenCourses(nextProps.liveId, nextProps.agentId);
        }
    }

    render() {
        if (this.props.topTenCourseList.length > 0) {
            return (
                <div className="course-module" data-name="热销排行">
                    <SectionHeader title='热销排行' description="您最稳的分发指南" id="热销排行">
    
                    </SectionHeader>
                    <CourseList 
                        list={this.props.topTenCourseList}
                        agentInfo={this.props.agentInfo}
                        liveId={this.props.liveId}
                        userIdentity={this.props.userIdentity}
                        setReprintInfo={this.props.setReprintInfo}
                        setReprintModalShow={this.props.setReprintModalShow}
                        setPromotionModalShow={this.props.setPromotionModalShow}
                        setPromotionInfo={this.props.setPromotionInfo}
                        setLoginModalShow={this.props.setLoginModalShow}
                    >
    
                    </CourseList>
                </div>
            )
        }
        return null;
    }
}

const mapStateToProps = state => ({
    liveId: state.common.liveInfo.liveId || '',
    agentId: state.common.agentInfo.agentId || '',
    agentInfo: state.common.agentInfo,
    topTenCourseList: state.recommend.topTenCourse.list
});

const mapActionToProps = {
    fetchTopTenCourses,
    updateNavCourseModule,
    setReprintInfo,
    setReprintModalShow,
    setLoginModalShow,
};

export default connect(mapStateToProps, mapActionToProps)(TopTen);

