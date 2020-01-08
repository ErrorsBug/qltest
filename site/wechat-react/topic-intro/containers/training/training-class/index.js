import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import LearnMode from '../components/learn-mode'
import { formatDate, formateToDay } from "components/util";
import Page from 'components/page';
import JobListDialog from 'components/dialogs-colorful/job-list-dialog'
import { locationTo } from 'components/util';

import {
    fetchCampListTopic,
    getPeriodByChannel,
    studyTopic
} from '../../../actions/training'

const mapStateToProps = function (state) {
    return {
        sysTime: state.common.sysTime,
      }
};

const mapActionToProps = {
    fetchCampListTopic
};

@autobind
class TrainingClass extends Component {
    state = {
        title: '',
        listTopic: [],
        
		showJobListDialog: false,
		jobList: [],
    }
    get channelId() {
        return this.props.location.query.channelId || '';
    }

    componentDidMount() {
        this.initCampList()
    }

    async initCampList () {
        const res = await this.props.fetchCampListTopic(this.channelId)
        const periodChannelInfo = await getPeriodByChannel(this.channelId)
        if (res) {
            this.setState({
                listTopic: res.dataList || []
            })
        }
        if (periodChannelInfo.state.code == 0) {
            this.setState({
                title: periodChannelInfo.data.periodPo.campName,
            })
        }
    }

	showJobListDialog (jobList) {
		this.setState({
			showJobListDialog: true,
			jobList
		})
    }
    
    onViewJob () {
        locationTo(`/wechat/page/training-homework?channelId=${this.channelId}`)
    }

	closeJobListDialog () {
		this.setState({
			showJobListDialog: false
		})
	}
    /**
     * 记录用户学习课程  用于打卡
     */
    async handleStudyTopic(topicId) {
        await studyTopic({
            channelId: this.channelId,
            topicId
        })
    }
    render() {
        let { 
            title, 
            listTopic, 
            showJobListDialog,
            jobList
        } = this.state
        return (
            <Page title="全部课程" className="training-class-wrap">
                <div className="training-header">
                    <div className="header-title">{title}</div>
                    <div className="class-nums">共{listTopic.length}节课</div>
                </div>

                <div className="training-content">
                    <ul className="timeline">
                        {
                            listTopic.map((item, index) => (
                                <li className="timeline-item" key={`time-line-${index}`}>
                                    <div className="timeline-item-tail"></div>
                                    <div className="timeline-item-head"></div>
                                    <div className="timeline-date">{formatDate(item.startTime, 'yyyy-MM-dd hh:mm')} ({formateToDay(item.startTime, '', true)})</div>
                                    <LearnMode
                                        index={index}
                                        data={item}
                                        onShowJobDialog={this.showJobListDialog}
                                        onViewJob={this.onViewJob}
                                        sysTime={this.props.sysTime}
                                        studyTopic={this.handleStudyTopic}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                </div>
                
				<JobListDialog
					isShow={showJobListDialog}
					onClose={this.closeJobListDialog}
					data={jobList}
					liveId={this.state.liveId}
                    newInteraction={true}
				/>

            </Page>
        )
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(TrainingClass);