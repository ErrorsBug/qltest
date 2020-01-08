import React, { Component } from 'react';
import { autobind } from 'core-decorators'

import {
    formatMoney,
    imgUrlFormat,
    locationTo,
} from 'components/util'

class CourseList extends Component {

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.curIndex !== this.props.curIndex) {
            this.logVisible()
        }
    }

    get visibleList() {
        let { courses, curIndex } = this.props
        courses = courses.map((item,index )=> {
            return {
                ...item,
                indexOfAll: index,
            }
        })

        let list = courses.slice(curIndex, curIndex + 4)
        while (list.length < 4 && courses.length) {
            list = list.concat(courses.slice(0, 4 - list.length))
        }
        if (courses.length < 4) {
            list = courses
        }
        return list
    }

    /* 手动打曝光日志 */
    logVisible() {
        const list = this.visibleList.map((item, index) => {
            return {
                name: item.courseName,
                pos: item.indexOfAll,
                business_id: item.courseId,
                business_type:item.courseType,
                region: `ab_course_${this.props.tagId}`,
            }
        })
        const logs = JSON.stringify(list)
        window._qla && window._qla('visible',{
            logs,
        })
    }

    render() {
        const {
            courses, curIndex, tagId, courseId,
            onCourseClick,
        } = this.props

        return <ul className='hot-list'>
            {
                this.visibleList.map((item, index) => {
                    return <li
                        key={`hot-list-${index}`}
                        className='hot-list-item on-log on-visible'
                        onClick={() => { onCourseClick(item.url, tagId) }}
                        data-log-name={item.courseName}
                        data-log-pos={index}
                        data-log-business_id={item.courseId}
                        data-log-business_type={item.courseType}
                        data-log-region={`ab_course_${tagId}`}
                    >
                        <section
                            className={`cover ${item.flag === 'boutique' ? 'boutique' : ''}`}
                            style={{ backgroundImage: `url(${imgUrlFormat(item.headImageUrl, '@250g_400h_1e_1c_2o')})` }}
                        >
                            <div className="shadow"></div>
                            <div className="member">{item.learningNum}次学习</div>
                        </section>

                        <h1>{item.courseName}</h1>

                        <div className="more-info">
                            {
                                item.price === 0
                                    ? <span className="money free">免费</span>
                                    : null
                            }

                            {
                                item.price > 0 && (
                                    item.discount === -1
                                        ? <span className="money">￥{formatMoney(item.price)}</span>
                                        : <span className="money">￥{formatMoney(item.discount)} <del>￥{formatMoney(item.price)}</del></span>)
                            }

                            {
                                item.courseType === 'channel' && item.topicNum > 0 &&
                                <span className="class-num">{item.topicNum}节课</span>
                            }
                        </div>
                    </li>
                })
            }

        </ul>
    }
}

export default CourseList
