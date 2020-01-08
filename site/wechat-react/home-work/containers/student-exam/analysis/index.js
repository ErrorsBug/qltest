import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from "components/page";
import { autobind } from "core-decorators";
import { request } from 'common_actions/common';
import { get } from 'lodash';

import './style.scss'

import ExamItem from '../components/exam-item'
import { locationTo } from 'components/util';

@autobind
class ExamAnalysis extends Component {
    state={
        examInfo: {},
        examId: '',
        questionList: [],
    };

    componentDidMount () {
        this.initExamInfo()

        typeof _qla != 'undefined' && _qla.collectVisible();
    }

    async initExamInfo () {
        const examId = this.props.location.query.examId
        const liveId = this.props.location.query.liveId
        const homeworkId = this.props.location.query.homeworkId
        const campId = this.props.location.query.campId

        if (examId) {
            // 查看解析
            request({
                url: '/api/wechat/homework/exam/showAnalysis',
                body: {
                    examId,
                },
                method: "POST"
            })
            const examInfo = await request({
                url: '/api/wechat/homework/exam/getExam',
                body: {
                    examId,
                    needAnalysis: 'Y'
                },
                method: "POST"
            })
            this.setState({
                examInfo: get(examInfo, 'data.examPo', {}),
                examUserPo: get(examInfo, 'data.examUserPo', {}),
                questionList: get(examInfo, 'data.examPo.questionList', []),
                examId,
                liveId
            })
        } else if (homeworkId) {
            // 查看解析
            request({
                url: '/api/wechat/homework/camp/showAnalysis',
                body: {
                    homeworkId,
                },
                method: "POST"
            })
            const examInfo = await request({
                url: '/api/wechat/homework/camp/examQuestionHomework',
                body: {
                    homeworkId,
                    needAnalysis: 'Y'
                },
                method: "POST"
            })
            const type = get(examInfo, 'data.homeworkType')
            this.setState({
                examInfo: get(examInfo, 'data.examInfo', {}),
                examUserPo: get(examInfo, 'data.userAnswerInfo', {}),
                questionList: type === 'exam' ? get(examInfo, 'data.examInfo.questionList', []) : get(examInfo, 'data.questionList', []),
                homeworkId,
                homeworkTitle: get(examInfo, 'data.homeworkTitle', {}),
                campId
            })
        }
    }

    render () {

        const {
            examInfo,
            questionList,
            examUserPo,
            homeworkTitle,
            homeworkId
        } = this.state

        return (
            <Page title={homeworkId ? homeworkTitle : examInfo.title} className={`exam-analysis`}>
                <div className="score-tips">你的本次考试得分：{get(examUserPo, 'score', 0)}</div>
                <div 
                    className="container on-visible"
                    data-log-region="test-analysis"
                    >
                    {
                        questionList.length > 0 && questionList.map((data, index) => (
                            <div className="exam-analysis-item" key={`exam-${index}`}>
                                <ExamItem 
                                    data={data}
                                    usersAnswer={data.usersAnswer}
                                    currIndex={index}
                                    maxLength={questionList.length}
                                    onCheck={() => {}}
                                    form="analysis"
                                    />
                            </div>
                        ))
                    }

                </div>
                <div className="footer">
                    {
                        this.state.homeworkId && <div className="btn exam" onClick={() => {window.history.go(-1)}}>返回</div>
                    }
                    {
                        this.state.liveId && <div className="btn exam" onClick={() => locationTo(`/wechat/page/exam-card?examId=${this.state.examId}&liveId=${this.state.liveId}`)}>返回</div>
                    }
                </div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        sysTime: get(state, 'common.sysTime')
    }
}

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExamAnalysis);