import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import CourseList from './course-list'

import {
    formatMoney,
    imgUrlFormat,
    locationTo,
} from 'components/util'

import {
    fetchHotTags,
    fetchHotTagCourse,
    updateCourseCurIndex,
    clearHotTagCourseList,
} from 'actions/recommend'

@autobind
class HotBlock extends Component {

    componentDidMount() {
        if (!this.props.tags.length) {
            this.initTags()
        }
    }

    componentWillUnmount() {
        // this.props.clearHotTagCourseList()
    }

    async initTags() {
        const tags = await this.props.fetchHotTags();

        let requests = []
        this.props.tags.forEach((item, index) => {
            const params = {
                page: 1,
                size: 10,
                tagId: item.tagId,
            }
            requests.push(this.props.fetchHotTagCourse(params))
        })

        const result = await Promise.all(requests)
        console.log(this.props.list)
    }

    async changeCourse(tagId) {
        let tagItem = this.props.list.find(item => item.tagId === tagId)
        let len = tagItem.courses.length
        const curIndex = tagItem.curIndex

        if (curIndex + 4 * 2 > len && !tagItem.noMore) {
            const { page, size } = tagItem
            const result = await this.props.fetchHotTagCourse({ page, size, tagId })

        }

        tagItem = this.props.list.find(item => item.tagId === tagId)
        len = tagItem.courses.length

        this.props.updateCourseCurIndex({
            tagId,
            curIndex: (curIndex + 4) % len,
        })
    }

    onMoreClick(tagId) {
        setTimeout(function () {
            location.href = `/wechat/page/hot-tag-list/${tagId}`
        }, 150);
    }

    onCourseClick(url, tagId) {
        window.sessionStorage && window.sessionStorage.setItem('trace_page', `recommend_ab_${tagId}`)
        locationTo(url)
    }

    logVisible(list) {
        console.log(list)
    }

    render() {
        return (
            <div>
                {
                    this.props.list.map((item, index) => {
                        return <div className='recommend-hot-block' key={`hot-block-${index}`}>
                            <h1>
                                {item.tagName}
                                <div
                                    className="more on-log"
                                    onClick={(e) => { this.onMoreClick(item.tagId) }}
                                    data-log-name='更多'
                                    data-log-region={`ab_more_${item.tagId}`}
                                >
                                    更多
                                </div>
                            </h1>

                            {
                                <CourseList
                                    courses={item.courses}
                                    curIndex={item.curIndex}
                                    tagId={item.tagId}
                                    onCourseClick={this.onCourseClick}
                                    logVisible={this.logVisible}
                                />
                            }

                            {
                                item.courses.length >= 4 &&
                                <div
                                    className="so-i-changed on-log"
                                    onClick={() => { this.changeCourse(item.tagId) }}
                                    data-log-name='换一换'
                                    data-log-region={`ab_change_${item.tagId}`}
                                >
                                    <span>换一换</span>
                                </div>
                            }

                        </div>
                    })
                }
            </div>
        );
    }
}

HotBlock.propTypes = {

};

function mstp(state) {
    return {
        tags: state.recommend.hotTags,
        list: state.recommend.hotTagList,
    }
}

const matp = {
    fetchHotTags,
    fetchHotTagCourse,
    updateCourseCurIndex,
    clearHotTagCourseList,
}

export default connect(mstp, matp)(HotBlock);