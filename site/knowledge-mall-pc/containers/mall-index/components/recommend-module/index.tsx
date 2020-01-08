import React, { Component, PureComponent, Fragment } from "react";
import CourseList from "../../../../components/course-list";
import SectionHeader from "../../../../components/section-header";
import styles from './style.scss';
import { apiService } from "../../../../components/api-service";
import { connect } from "react-redux";
import { updateNavCourseModule, setLoginModalShow, setReprintModalShow, setPromotionModalShow } from "../../../../actions/common";
import { fetchCourseList, updateCourseList, clearCourseList,setReprintInfo, setPromotionInfo } from '../../../../actions/course';
import { fetchRecomendModuleList } from "../../../../actions/recommend";

class RecommentModule extends PureComponent<any, any> {

    data = {
        atTheEnd: false, // 判断是否到最后一页
        page: 1,
        size: 8
    }

    state = {
        recommendList: [],
        page: 1,
        title: '',
        desc: ''
    }

    componentDidMount () {
        this.props.fetchRecomendModuleList({liveId: this.props.liveId, agentId: this.props.agentId});
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.liveId != this.props.liveId) {
            this.props.fetchRecomendModuleList({liveId: this.props.liveId, agentId: this.props.agentId});
        }
    }

    // getRecommentCourseList = () => {
    //     apiService.post({
    //         url: '/h5/knowledge/recommendCourseList',
    //         body: {
    //             liveId: this.props.liveId,
    //             agentId: this.props.agentId,
    //             page: {
    //                 page: this.data.atTheEnd ? this.data.page = 1 : this.data.page,
    //                 size: 8
    //             }
    //         }
    //     }).then(res => {
    //         if (res.state.code == 0) {
    //             if (res.data.recommendList.length == 0 && this.data.page != 1) {
    //                 this.data.atTheEnd = false;
    //                 this.data.page = 1;
    //                 this.getRecommentCourseList()
    //                 return 
    //             }

    //             if (res.data.recommendList.length < 8) {
    //                 this.data.atTheEnd = true;
    //             }
    //             this.setState({
    //                 ...res.data,
    //             })
    //             this.data.page =  ++ this.data.page
    //         }
    //     }).catch(err => {
    //         console.error(err)
    //     })
    //     if (this.data.atTheEnd) {
    //         this.data.atTheEnd = false;
    //     }
    // }

    getRecommendCourseList = () => {
        this.props.fetchRecomendModuleList({liveId: this.props.liveId, agentId: this.props.agentId});
    }

    render () {
        let {list, title, desc, totalCount} = this.props.recommendModule;
        if (list.length > 0) {
            return (
                <div className="course-module" data-name={title}> 
                    <SectionHeader
                        className={styles.btnWrap}
                        title={title}
                        description={desc}
                        id={title}
                    >
                        { totalCount > 8 ? <button className={styles.btn} onClick={this.getRecommendCourseList}>换一批</button> : null}
                    </SectionHeader>
                <CourseList
                    list={list}
                    agentInfo={this.props.agentInfo}
                    liveId={this.props.liveInfo.liveId}
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
         } else {
             return null
         }
    }
}

const mapStateToProps = (state) => {
    return {
        liveId: state.common.liveInfo.liveId,
        agentId: state.common.agentInfo.agentId,
        agentInfo: state.common.agentInfo,
        liveInfo: state.common.liveInfo,
        moduleList: state.common.moduleList,
        recommendModule: state.recommend.recommendModule
    }
}

const mapActionToProps = {
    updateNavCourseModule,
    setReprintInfo,
    setReprintModalShow,
    setLoginModalShow,
    setPromotionModalShow,
    fetchRecomendModuleList,
    setPromotionInfo,
}

export default connect(mapStateToProps, mapActionToProps)(RecommentModule)