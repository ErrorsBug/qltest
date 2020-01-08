
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Page from 'components/page';
import { autobind, throttle } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';

import {
    getCampPeriodHomework
} from '../../../actions/training'
import {
    digitFormat,
    formatDate,
    locationTo 
} from '../../../../components/util';
import {
	getUserInfo,
} from 'common_actions/common'

function mapStateToProps(state) {
    return {
        sysTime: get(state, 'common.sysTime'),
        periodInfo: get(state, 'training.periodChannel.periodPo') || {},
		userInfo: state.common.userInfo,
    }
}

const mapActionToProps = {
    getCampPeriodHomework,
	getUserInfo
};

@autobind
class TrainingHomework extends Component {
    state = {
        list: [],
        pageConfig: {
            page: 1,
            pageSize: 20,
            isNoMore: false,
            noData: false,
        }
    }

    componentDidMount() {
		this.props.getUserInfo()
        this.fetchCampPeriodHomework(1)
    }

    // 今天
    today = null
    // 昨天
    lastday = null
    // 前天
    yesterday = null
    getTimeStr (time) {
        if (!this.today) {
            this.today = new Date(formatDate(this.props.sysTime, 'yyyy/MM/dd')).getTime()
            this.lastday = this.today - 24 * 60 * 60 * 1000
            this.yesterday = this.today - 2 * 24 * 60 * 60 * 1000
        }

        if (time >= this.today) {
            return '今天'
        } else if (time >= this.lastday) {
            return '昨天'
        } else if (time >= this.yesterday) {
            return '前天'
        } else return formatDate(time, 'yyyy-MM-dd')
    }

    goHomeWorkDetails (item) {
        locationTo(`/wechat/page/homework/details?id=${item.homeworkId}&topicId=${item.topicId}${item.liveId ? `&liveId=${item.liveId}` : ''}`)
    }

    goHomeWorkExam (item) {
        locationTo(`/wechat/page/homework-exam?id=${item.homeworkId}&topicId=${item.topicId}`)
    }

    async fetchCampPeriodHomework (page) {
        const {
            pageConfig,
            list
        } = this.state

        const _page = page || pageConfig.page
        
        if (pageConfig.isNoMore) return
        
        const result = await this.props.getCampPeriodHomework({
            campId: this.props.periodInfo.campId,
            periodId: this.props.periodInfo.id,
            page: {
                page: _page,
                size: pageConfig.pageSize,
            }
        })

        const _list = get(result, 'data.homeworkList') || []

        this.setState({
            list: _page === 1 ? _list : list.concat(_list),
            pageConfig: {
                ...pageConfig,
                page: _page + 1,
                isNoMore: _list.length === 0,
                noData: _page === 1 && _list.length === 0,
            }
        })
    }
    
    @throttle(300)
	async loadMore(next) {

        await this.fetchCampPeriodHomework()

		next && next()
	}

    render() {
        const { 
            pageConfig,
            list
        } = this.state
        return (
            <Page title="我的作业" className='training-homework'>
                <ScrollToLoad
                    className="scroll-container"
                    loadNext={this.loadMore}
                    noneOne={pageConfig.noData}
                    noMore={pageConfig.isNoMore}
                    emptyMessage="你还没有创建作业哦！进入PC后台-训练营可布置作业"
                >
                    {
                        list.map((item, index) => (
                            <TrainingHomeWorkItem 
                                key={`training-homework-${index}`} 
                                getTimeStr={this.getTimeStr}
                                goHomeWorkDetails={this.goHomeWorkDetails}
                                goHomeWorkExam={this.goHomeWorkExam}
                                {...item}
								userInfo={(this.props.userInfo && this.props.userInfo.user) || {}}
								campId={this.props.periodInfo.campId}
							/>
                        ))
                    }
                </ScrollToLoad>
            </Page>
        )
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(TrainingHomework);

const TrainingHomeWorkItem = (props) => {
    const timeStr = props.getTimeStr(props.startTime)

    if (/question|exam/.test(props.type)) {
        return ( // 考试
            <div className="training-homework-item">
                <div className="_container" onClick={
                    props.status === 'Y' ? () => { locationTo(`/wechat/page/exam-card?homeworkId=${props.homeworkId}&topicId=${props.topicId}`) } : () => props.goHomeWorkExam(props)
                }>
                    <p className="_title">
                        <p><span>{props.title}</span></p>
                        <p><span>{props.topicName}</span></p>
                    </p>
                    <div className="_content">
                        <div className="_info">
                            <p className="reach">
                                { // 通过率大于0 才展示
                                    props.passRate > 0 ? 
                                        <React.Fragment>
                                            <span className="passrete">通过率{props.passRate}%</span>
                                            <span className="splite">|</span>
                                        </React.Fragment> : null
                                }
                                <span>一共{props.questionCount}题</span>
                            </p>
                            <p><span className="question-count">{digitFormat(props.answerCount)}名学员已完成</span>{timeStr}</p>
                        </div>
                        {
                            props.status === 'Y' ?
                                <div className="go-work-btn" onClick={(e) => {e.stopPropagation();locationTo(`/wechat/page/training-details?campId=${props.campId}&workId=${props.homeworkId}&by=${props.userInfo.userId}`)}}>作业分享</div>
                                :
                                <div className="go-work-btn">{timeStr !== '今天' ? '补作业' : '做作业'}</div>
                        }
                    </div>
                    { /* 分数 */ }
                    {
                        props.status === 'Y' ? <div className="marker"><span>{props.score}分</span></div> : null
                    }
                </div>
            </div>
        )
    }

    return ( // 普通作业
        <div className="training-homework-item">
            <div className="_container" onClick={() => props.goHomeWorkDetails(props)}>
                <p className="_title">
                    <p><span>{props.title}</span></p>
                    <p><span>{props.topicName}</span></p>
                </p>
                <div className="_content">
                    <div className="_info">
                        <p className="reach">
                            <span>{digitFormat(props.answerCount)}名学员已完成</span>
                        </p>
                        <p>{timeStr}</p>
                    </div>
                    {
                        props.status === 'Y' ?
                            <div className="go-work-btn" onClick={(e) => {e.stopPropagation();locationTo(`/wechat/page/training-details?campId=${props.campId}&workId=${props.homeworkId}&by=${props.userInfo.userId}`)}}>作业分享</div>
                            :
                            <div className="go-work-btn">{timeStr !== '今天' ? '补作业' : '做作业'}</div>
                    }
                </div>
            </div>
        </div>
    )
}