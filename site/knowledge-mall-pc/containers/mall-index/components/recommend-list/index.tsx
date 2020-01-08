import React, { Component, PureComponent } from "react";
import { apiService } from "../../../../components/api-service";
import HighBonusBanner from '../high-bonus-banner';
import CourseList from '../../../../components/course-list';
import { connect } from 'react-redux';
import SectionHeader from '../../../../components/section-header';
import { updateNavCourseModule, setLoginModalShow, setReprintModalShow, setPromotionModalShow } from "../../../../actions/common";
import { fetchCourseList, updateCourseList, clearCourseList,setReprintInfo, setPromotionInfo } from '../../../../actions/course';
import { fetchModuleCourseList } from "../../../../actions/recommend";
class RecommendList extends PureComponent<any, any> {

    state = {
        moduleList: []
    }

    data = {
        moduleList: []
    }

    componentDidMount () {
        // this.getModuleList();
        this.props.fetchModuleCourseList({liveId: this.props.liveInfo.liveId, agentId: this.props.agentInfo.agentId});
    }

    componentWillReceiveProps (nextProps, ) {
        if (nextProps.liveInfo.liveId != this.props.liveInfo.liveId) {
            this.props.fetchModuleCourseList({liveId: nextProps.liveInfo.liveId, agentId: nextProps.agentInfo.agentId});
        }
    }


    render () {
        return (
            <React.Fragment>
                {
                    this.props.moduleCourseList.list.filter(item => {
                        return Array.isArray(item.courseList) && item.courseList.length > 0
                    }).map(item => {
                        return (
                            <div className="course-module" data-name={item.title}>
                                <SectionHeader {...item} id={item.title}/>
                                <CourseList key={item.code}
                                    list={item.courseList} 
                                    agentInfo={this.props.agentInfo}
                                    userIdentity={this.props.userIdentity}
                                    setReprintInfo={this.props.setReprintInfo}
                                    setReprintModalShow={this.props.setReprintModalShow}
                                    setPromotionModalShow={this.props.setPromotionModalShow}
                                    setPromotionInfo={this.props.setPromotionInfo}
                                    liveId={this.props.liveInfo.liveId}
                                    setLoginModalShow={this.props.setLoginModalShow}
                                    
                                    
                                    />
                            </div>
                        )
                    })
                }
                {/* {
                    !this.props.agentInfo.agentId &&
                    <HighBonusBanner 
                        agentInfo={this.props.agentInfo}
                        userIdentity={this.props.userIdentity}
                        setReprintInfo={this.props.setReprintInfo}
                        setReprintModalShow={this.props.setReprintModalShow}
                        setPromotionModalShow={this.props.setPromotionModalShow}
                        setPromotionInfo={this.props.setPromotionInfo}
                        liveId={this.props.liveInfo.liveId}
                        setLoginModalShow={this.props.setLoginModalShow}
                    />
                } */}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        courseList: state.course.courseList,
        userIdentity: state.common.userIdentity,
        agentInfo: state.common.agentInfo,
        userInfo: state.common.userInfo,
        liveInfo: state.common.liveInfo,
        hasPortraitInfo: state.portrait.hasPortraitInfo,
        wechatInfo: state.portrait.wechatInfo,
        fansTags: state.portrait.fansTags,
        teamTags: state.portrait.teamTags,
        tagsSelected: state.portrait.tagsSelected,
        fansRemark: state.portrait.fansRemark,
        activePlatforms: state.portrait.activePlatforms,
        activeCategoryId: state.updateFilterConditions.activeCategoryId,
        sortBy: state.updateFilterConditions.sortBy,
        sortOrder: state.updateFilterConditions.sortOrder,
        onlyViewRelayCourse: state.updateFilterConditions.onlyViewRelayCourse,
        searchText: state.updateFilterConditions.searchText,
        page: state.updateFilterConditions.page,
        size: state.updateFilterConditions.size,
        noMore: state.updateFilterConditions.noMore,
        categorySelected: state.updateFilterConditions.categorySelected,
        viewTopTenCourses: state.updateFilterConditions.viewTopTenCourses,
        moduleList: state.common.moduleList,
        moduleCourseList: state.recommend.moduleCourseList
    }
}

const mapActionToProps = {
    updateNavCourseModule, 
    // fetchHasPortraitInfo,
    // fetchTagsList,
    // fetchPortraitInfo,
    // savePortraitInfo,
    // setLiveInfo,
    setReprintInfo,
    setReprintModalShow,
    setPromotionModalShow,
    setPromotionInfo,
    setLoginModalShow,
    fetchModuleCourseList
}

export default connect(mapStateToProps, mapActionToProps)(RecommendList)
