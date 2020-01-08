import React, { Component } from 'react'
import { studentCourseMap, addStudentCourse } from '../actions/university'
import { getUrlParams } from 'components/url-utils'
import { locationTo } from 'components/util';

/**
 * 课程是否加入女大以及的加入女大的按钮
 * @param {*} WrappedComponent
 * @returns
 */
const AddUniversityCourse = (WrappedComponent) => {
    return class extends Component {
        state = {
            isJoinUni: false,
            isAnimate: false,
        }
        isLoading = false
        get courseId() {
            const channelId = getUrlParams('channelId', '')
            const topicId = getUrlParams('topicId', '')
            const courseId = channelId || topicId
            return courseId;
        }
        componentDidUpdate({ isUniCourse }, current_state) {
            if(isUniCourse !== this.props.isUniCourse) {
                this.initData();
            }
        }
         initData = async () => {
            const res = await studentCourseMap({ courseIdList: [this.courseId] })
            const result = res.studentCourseMap || {}
            const keys = Object.keys(result)
            if(!!keys.length && result[this.courseId] == 'Y') {
                this.setState({
                    isJoinUni: true
                })
            }
        }
        joinUniversityBtn = async (isBooks) => {
            if(this.state.isJoinUni){
                locationTo("/wechat/page/university/my-course-list");
                return false;
            }
            if(this.isLoading) return false
            const topicId = getUrlParams('topicId', '');
            this.isLoading = true
            const res = await addStudentCourse({
                businessId: this.courseId,
                businessType: isBooks ? 'book' : topicId ? 'topic' : 'channel'
            })
            this.handleAnimateEnd()
            if(res && res.state && res.state.code == 0){
                this.setState({
                    isAnimate: true,
                    isJoinUni: true,
                })
            } else {
                window.toast("加入课表失败")
            }
            this.isLoading = false; 
        }
        handleAnimateEnd = () =>{
            setTimeout(() => {
                this.setState({
                    isAnimate: false,
                })
            }, 1500);
        }
        render() {
            return (
                <WrappedComponent
                    joinUniversityBtn={ this.joinUniversityBtn }
                    handleAnimateEnd={ this.handleAnimateEnd }
                    { ...this.props } 
                    { ...this.state }  />
            )
        }
    }
}
export default AddUniversityCourse