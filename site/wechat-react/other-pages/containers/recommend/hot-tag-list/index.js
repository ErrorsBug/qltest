import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import Page from 'components/page'
import ScrollToLoad from 'components/scrollToLoad'
import {  locationTo } from 'components/util';
import {
    fetchHotTags,
    fetchHotTagCourse,
} from 'actions/recommend'

import CourseList from './components/course-list'

@autobind
class RecommendHotTag extends Component {

    state = {
        list: [],
        noMore: false,
        noneOne: false,
        page: 1,
        size: 20,
        title: '热门分类',
    }

    get tagId() {
        return this.props.router.params.tagId
    }

    get params() {
        return {
            page: this.state.page,
            size: this.state.size,
            tagId: this.tagId,
            noRedux: true,
        }
    }

    get title() {
        let title = '热门分类'
        if (Array.isArray(this.props.tags)) {
            this.props.tags.find(item => {
                if (item.tagId === this.tagId) {
                    title = item.tagName
                }
            })
        }
        return title
    }

    componentDidMount() {
        this.props.fetchHotTags()
        this.loadList()
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);
    }

    async loadList(next = () => { }) {
        const { page, size, list } = this.state
        const result = await this.props.fetchHotTagCourse(this.params)

        if (!result.length && page === 1) {
            this.setState({ noneOne: true })
        } else if (result.length < size) {
            this.setState({ noMore: true })
        }

        this.setState({
            list: list.concat(result),
            page: this.state.page + 1,
        })
        next()
    }

    onCourseClick(url, tagId) {
        window.sessionStorage && window.sessionStorage.setItem('trace_page', `recommend_ab_${tagId}`)
        locationTo(url)
    }

    render() {
        let { title, noMore, noneOne, list, tagId } = this.state

        return (
            <Page title={this.title} >
                <div className='recommend-hot-tag-list'>
                    <ScrollToLoad
                        loadNext={this.loadList}
                        noMore={noMore}
                        noneOne={noneOne}
                        className={'recommend-hot-tag-list-scrollload'}
                    >
                        {
                            list.length > 0 && <CourseList
                                list={list}
                                tagId={this.tagId}
                                onCourseClick={this.onCourseClick}
                            />
                        }
                    </ScrollToLoad>
                </div>
            </Page>
        );
    }
}

function mstp(state) {
    return {
        tags: state.recommend.hotTags,
    }
}

const matp = {
    fetchHotTags,
    fetchHotTagCourse,
}

RecommendHotTag.propTypes = {

};

export default connect(mstp, matp)(RecommendHotTag)
