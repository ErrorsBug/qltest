import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import StudentTask from '../components/student-task'
import ScrollToLoad from 'components/scrollToLoad';

import { locationTo, formatDate } from "components/util";
import Page from 'components/page';

import {
	campAnswerlikes
} from '../../../actions/channel-intro'
import {
	fetchCampListByChannel,
} from '../../../actions/channel-intro'

const mapStateToProps = function (state) {
    return {
        periodInfo: get(state, 'training.periodChannel.periodPo')
    }
};

const mapActionToProps = {
    fetchCampListByChannel,
	campAnswerlikes
};

@autobind
class LearnRecord extends Component {
    data = {
        currentCommentAnswerId: '',
    };
    state = {
        isOpenInputText: '',
        commentInputVal: '',

        dataList: {
            list: [],
            allList: [],
            page: 1,
            pageSize: 20,
            isNoMore: false,
            isEnd: false,
        },
    }
    // 阻止查看我的和排序同时点击
    toggleing = false

    get liveId() {
        return this.props.location.query.liveId || '';
    }

    async componentDidMount() {
        console.log('periodInfo:', this.props.periodInfo)
        this.loadMore()
    }
    // 点赞
    async toggleFabulous(answer, index) {

        const tempDataList = {...this.state.dataList}
        const _answer = { ...answer }

        _answer.liked = answer.liked === 'Y' ? 'N' : 'Y'

        const res = await this.props.campAnswerlikes({
            status: _answer.liked,
            answerId: _answer.id
        })

        if (res.state && res.state.code === 0) {
            if (_answer.liked === 'Y') {
                _answer.upvoteCount += 1
            } else {
                _answer.upvoteCount -= 1
            }

            tempDataList.list[index] = { ..._answer }

            this.setState({
                dataList: tempDataList
            })
        }
    }

    handleShowComment(id) {
        this.setState({
            isOpenInputText: 'show'
        }, () => {
            this.refs['comment-input'].focus();
            this.data.currentCommentAnswerId = id;
            setTimeout(() => {
                this.refs['comment-input'].scrollIntoView();
            }, 300);
        });
    }

    // 隐藏发言框
    hideComment() {
        this.setState({
            isOpenInputText: '',
            commentInputVal: ''
        })
    }

    // 发言
    commentInputChangeHandle(e) {
        this.setState({
            commentInputVal: e.target.value
        })
    }

    async sendCommentHandle() {
        if (!this.state.commentInputVal) {
            window.toast('请输入内容');
            return false;
        }
        console.log(22222, this.data.currentCommentAnswerId, this.state.commentInputVal)
        // let result = await this.props.putComment({
        //     answerId: this.data.currentCommentAnswerId,
        //     content: this.state.commentInputVal
        // })
        this.hideComment();
    }
    
	// 列表数据装载
	async fetchDataList() {
		const data = {...this.state.dataList}

		if (data.isNoMore) return

		const count = data.page * data.pageSize

		// 当存储数据不满足装载量且没到底，请求增加数据
		if (count > data.allList.length && !data.isEnd) {
            const _listByChannel = await this.props.fetchCampListByChannel({
                channelId: this.props.periodInfo.channelId,
                onlyMine: 'Y',
                order: 'DESC',
                orderByPrime: 'N',
                page: {
                    page: data.page,
                    size: data.pageSize
                }
            })

            const listByChannel = get(_listByChannel, 'data.list') || []
            data.allList.push(...listByChannel)
            if (listByChannel.length < data.pageSize) data.isEnd = true
		}

		if (count >= data.allList.length && data.isEnd) {
			data.isNoMore = true
		}
		data.list = data.allList.slice(0, count)
		data.page += 1

		this.setState({
			dataList: data
		})
	}

    isLock = false

    async loadMore(next) {

        if (!this.isLock) {
            this.isLock = true
            await this.fetchDataList()
            this.isLock = false
        }

        next && next()
    }
    
	/************************* 视频地址转换 *****************************/
    // 待加载视频列表
    lazyVideos = [];

    getChildContext () {
        return {
            lazyVideo: {
                push: this.pushVideoToLazyVideos,
                remove: this.removeVideoToLazyVideos,
            }
        }
	}
	
    pushVideoToLazyVideos (item) {
        if (!this.refs.detailsScroll) {
            this.lazyVideos.push(item);
            return;
        }

        if (!this.isVideoFetch(findDOMNode(this.refs.detailsScroll), item)) {
            this.lazyVideos.push(item);
        }
	}
	
    removeVideoToLazyVideos (id) {
        this.lazyVideos = this.lazyVideos.filter(item => item.id != id);
	}
	
    @throttle(300)
    initLazyVideoLinstener() {
        if (!this.refs.detailsScroll) {
            return;
		}
		const target = findDOMNode(this.refs.detailsScroll)
        const st = target.scrollTop;
        const height = target.clientHeight;

        this.lazyVideos.forEach(item => {
            const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;
            if (pos < height + st) {
                item.init()
            }
        });
    }

    isVideoFetch(target, item) {
        const st = target.scrollTop;
        const height = target.clientHeight;
        const pos = item.ref.parentNode.parentNode.parentNode.parentNode.offsetTop;

        if (pos < height + st) {
            item.init()
            return true;
        } else {
            return false;
        }
	}
    /************************* 视频地址转换 *****************************/
    
	scrollToDo () {
		this.initLazyVideoLinstener()
	}

    render() {
        let { dataList: data } = this.state
        const {periodInfo} = this.props
        return (
            <Page title="学习记录" className="learn-record-wrap">
                <ScrollToLoad
					ref="detailsScroll"
                    className="scroll-container"
                    loadNext={this.loadMore}
                    disable={!data || data.isDisable}
                    noMore={data && data.isNoMore}
                    notShowLoaded={data.list.length === 0 && data.isEnd}
                    scrollToDo={this.scrollToDo}
                >
                    <div className="training-title">
                        【{periodInfo.name}】{periodInfo.campName}
                    </div>
                    <div className="homework-wrap">
                    {
                        data.allList.length > 0 || !data.isEnd ? (
                            <StudentTask
                                data={data.list}
                                toggleFabulous={this.toggleFabulous}
                                showComment={this.handleShowComment}
                                isOpenShare={true}
                                onShare={(item) => locationTo(`/wechat/page/training-details?campId=${periodInfo.campId}&workId=${item.homeworkId}&by=${item.createBy}`)}
                            />
                        ) : <div className="list-empty list-two">暂无内容~</div>
                    }
                        
                    </div>
                </ScrollToLoad>
                {/* 评论框 */}
                <div className={`comment-wrapper ${this.state.isOpenInputText}`} onClick={this.hideComment}>
                    <div className="comment-container" onClick={(e) => e.stopPropagation()}>
                        <div className={`comment-box`}>
                            <div className="input-wrap">
                                <input type="text" ref="comment-input" placeholder="输入评论内容"
                                    value={this.state.commentInputVal}
                                    onFocus={this.commentInputFocusHandle}
                                    onChange={this.commentInputChangeHandle} />
                            </div>
                            <div className="send-btn" onClick={this.sendCommentHandle}>发送</div>
                        </div>
                    </div>
                </div>
            </Page>
        )
    }
}

LearnRecord.childContextTypes = {
	lazyVideo: PropTypes.object
};
module.exports = connect(mapStateToProps, mapActionToProps)(LearnRecord);