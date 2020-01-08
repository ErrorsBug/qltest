import React, { Component } from 'react'
import { universityStatus, getUniversityCollege } from '../../actions/university';
import { getUrlParams } from 'components/url-utils'
import {getCookie} from 'components/util';
/**
 * 女子大学权限获取
 * @param {*} WrappedComponent
 * @returns
 */
const UniversityStatusHoc = (WrappedComponent) => {
    return class extends Component {
        state = {
            isUniAuth: false, // 是否为大学用户
            isUniCourse: false, // 是否为女子大学课程
            collegeInfo: {},
        }
        componentDidMount() {
            const channelId = getUrlParams('channelId', '')
            const topicId = getUrlParams('topicId', '')
            const courseId = channelId || topicId
            if (getCookie('userId')) {
                this.getUniversityStatus(courseId);
                this.getUniversityCollege(courseId)
            }
        }
        // 获取女子大学权限
        async getUniversityStatus (courseId) {
            const { authStatus, universityCourse } = await universityStatus({ courseId: courseId });
            this.setState({
                isUniAuth: Object.is(authStatus, 'Y'),
                isUniCourse: Object.is(universityCourse, 'Y'),
            })
        }
        async getUniversityCollege(courseId) {
            const { collegeInfo } = await getUniversityCollege({ courseId: courseId });
            this.setState({
                collegeInfo: collegeInfo || {},
            })
        }
        render() {
            return (
                <WrappedComponent { ...this.props } { ...this.state } />
            )
        }
    }
}
export default UniversityStatusHoc