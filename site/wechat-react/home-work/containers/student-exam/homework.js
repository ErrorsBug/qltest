import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from "components/page";
import { autobind } from "core-decorators";
import { request } from 'common_actions/common';
import { get } from 'lodash';

import './style.scss'

import ExamItem from './components/exam-item'
import { locationTo } from 'components/util';

/**
 * 此页面用于作业使用， 与考试无关
 * 
 * 
 */

@autobind
class HomeworkExam extends Component {
    state={
        examId: '',

        questionList: [],
        currIndex: 0,
    };

    // 记录是否重新答题
    examStatus = ''

    componentDidMount () {
        if (typeof window.sessionStorage != 'undefined') {
            this.examStatus = sessionStorage.getItem("examStatus")
            sessionStorage.removeItem("examStatus")
        }

        this.initExamInfo()
        
        typeof _qla != 'undefined' && _qla.collectVisible();
    }

    // 是否允许考试
    isExam (examUserPo) {
        if (examUserPo) {
            // 完成考试且不是重新答题
            if (examUserPo.finishStatus === 'Y' && this.examStatus !== 'restart') {
                return false
            }

            // 已查看解析
            if (examUserPo.showAnalysis === 'Y') {
                return false
            }
        }
        return true
    }

    async initExamInfo () {
        const homeworkId = this.props.location.query.id
        const topicId = this.props.location.query.topicId

        if (homeworkId) {
            const examInfo = await request({
                url: '/api/wechat/homework/camp/examQuestionHomework',
                body: {
                    homeworkId,
                    needAnalysis: 'N'
                },
                method: "POST"
            })

            const examUserPo = get(examInfo, 'data.userAnswerInfo', {})
            const homeworkType = get(examInfo, 'data.homeworkType')

            if (!this.isExam(examUserPo)) {
                location.replace(`/wechat/page/exam-card?homeworkId=${homeworkId}&topicId=${topicId}`)
                return
            }

            if (homeworkType === 'exam') {
                this.startExam({
                    examUserPo, // 用户考试概况
                    examInfo: get(examInfo, 'data.examInfo', []),
                    questionList: get(examInfo, 'data.examInfo.questionList', []),
                    examId: get(examInfo, 'data.examInfo.id'),
                    homeworkId,
                    topicId,
                    homeworkType
                })
            } else {
                this.startQuestion({
                    examUserPo, // 用户考试概况
                    examInfo: get(examInfo, 'data.examInfo', []),
                    questionList: get(examInfo, 'data.questionList', []),
                    homeworkId,
                    topicId,
                    homeworkType
                })
            }
        }
    }

    _tempUsersAnswer = ''
    upper () {
        const {
            questionList,
            currIndex,
        } = this.state

        this.saveUserAnswer(questionList[currIndex])

        this.setState({
            currIndex: currIndex - 1
        }, () => {
            this._tempUsersAnswer = questionList[currIndex - 1].usersAnswer
        })
    }

    lower () {
        const {
            questionList,
            currIndex,
        } = this.state

        this.saveUserAnswer(questionList[currIndex])

        this.setState({
            currIndex: currIndex + 1
        }, () => {
            this._tempUsersAnswer = questionList[currIndex + 1].usersAnswer
        })
    }

    async saveUserAnswer (question) {
        const usersAnswer = question.usersAnswer
        
        // 修改作答才保存
        if (usersAnswer && usersAnswer !== this._tempUsersAnswer) {
            // 保存用户作答
            await request({
                url: '/api/wechat/homework/camp/saveAnswer',
                body: {
                    homeworkId: this.state.homeworkId,
                    examId: this.state.examId || '',
                    questionId: question.id,
                    answer: usersAnswer
                },
                method: "POST"
            })
        }
    }
    
    handIn () {
        const {
            questionList,
        } = this.state

        if (questionList.filter(question => !question.usersAnswer).length > 0) {
            window.simpleDialog({
                title: '你还有题目没答完，确定要提交吗?',
                confirmText: '继续答题',
                cancelText: '我要提交',
                onCancel: this.submit
            })
        } else {
            this.submit()
        }
    }

    async startQuestion (state) {
        const {examUserPo} = state

        if (!examUserPo || !examUserPo.finishStatus || examUserPo.finishStatus !== 'ING') {
            const examStatus = await request({
                url: '/api/wechat/homework/camp/startHomework',
                body: {
                    homeworkId: state.homeworkId,
                },
                method: "POST"
            })
            if (examStatus.state.code != 0) {
                window.toast(examStatus.state.msg)
            }

            if (examUserPo && examUserPo.finishStatus === 'Y' && this.examStatus === 'restart') {
                this.initExamInfo()
                return
            }
        }
        
        window.onbeforeunload=function(e){     
        　　var e = window.event||e;  
        　　e.returnValue=("确定离开当前页面吗？");
        }

        this.setState(state, () => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        })
    }
    
    async startExam (state) {
        const {
            examUserPo,
            examInfo
        } = state
        
        // 设置时间
        let min = examInfo.duration
        let sec = 0

        if (examUserPo && examUserPo.finishStatus === 'ING') {
            // 考试中
            const res = await request({
                url: '/api/base/sys-time',
                data: {},
            })
            const sysTime = get(res, 'data.sysTime')
            const left = min * 60 - Math.floor((sysTime - examUserPo.startTime) / 1000)
            // 已超时 则直接提交
            if (left <= 0) {
                this.submit()
                return
            }

            min = Math.floor(left / 60)
            sec = left - min * 60
        } else {
            // 未参加考试 or 重新考试
            const examStatus = await request({
                url: '/api/wechat/homework/camp/startHomework',
                body: {
                    homeworkId: state.homeworkId,
                },
                method: "POST"
            })
            if (examStatus.state.code != 0) {
                window.toast(examStatus.state.msg)
            }
            
            if (examUserPo && examUserPo.finishStatus === 'Y' && this.examStatus === 'restart') {
                this.initExamInfo()
                return
            }
        }

        const timerFucn = () => {

            if (sec > 0) {
                sec--
            } else if (min > 0) {
                min--
                sec = 59
            }

            if (min > 0 || sec > 0) {
                this.setState({
                    remainingTimeStr: `${min}分${sec}秒`
                })
            } else {
                // 结束 提交
                window.toast('考试时间已到，系统自动为您提交考试')
                this.submit()
            }
        }
        
        window.onbeforeunload=function(e){     
        　　var e = window.event||e;  
        　　e.returnValue=("确定离开当前页面吗？");
        }

        this.timer = setInterval(timerFucn, 1000);

        state.remainingTimeStr = `${min}分${sec}秒`

        this.setState(state, () => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        })
        
    }

    async submit () {
        const {
            questionList,
            currIndex,
        } = this.state

        // 交卷前保存当前所做的题目
        await this.saveUserAnswer(questionList[currIndex])

        // 交卷
        const rest = await request({
            url: '/api/wechat/homework/camp/endHomework',
            body: {
                homeworkId: this.state.homeworkId,
            },
            method: "POST"
        })

        if (rest && rest.state.code === 0) {
            window.onbeforeunload = function(e){}
            locationTo(`/wechat/page/exam-card?homeworkId=${this.state.homeworkId}&topicId=${this.state.topicId}`)
        }
    }

    onCheck (val) {
        const {
            questionList,
            currIndex
        } = this.state

        const temp = [...questionList]

        if (temp[currIndex].type === 'multi') { // 多选
            let usersAnswer = temp[currIndex].usersAnswer || ''
            if (usersAnswer && usersAnswer.indexOf(val) > -1) {
                usersAnswer = usersAnswer.split(val).join("")
            } else {
                usersAnswer += val
            }
            temp[currIndex].usersAnswer = usersAnswer
        } else { // 单选 判断
            temp[currIndex].usersAnswer = val
        }

        this.setState({
            questionList: temp
        })
    }

    renderFooter () {
        return (
            <div className="footer">
                {
                    this.state.currIndex !== 0 && <div className={`btn ${this.state.currIndex !== this.state.questionList.length - 1 ? 'mr20' : 'exam'}`} onClick={this.upper}>上一题</div>
                }
                {
                    this.state.currIndex !== this.state.questionList.length - 1 ?
                        <div className="btn exam" onClick={this.lower}>下一题</div>
                        :
                        <div className="btn exam" onClick={this.handIn}>交卷</div>
                }
            </div>
        )
    }

    render () {

        const {
            remainingTimeStr,
            questionList,
            currIndex,
            homeworkType
        } = this.state

        const data = questionList[currIndex]

        return questionList.length > 0 ? (
            <Page title="考试" className="student-exam">

                <div className="timer-box">
                    {
                        homeworkType === 'exam' ?
                            <p>考试剩余时间：{remainingTimeStr}</p>
                            :
                            <p>总共：{questionList.length}题</p>
                    }
                    <div 
                        className="submit-btn on-log on-visible"
                        data-log-region="test-on"
                        data-log-pos="submit"
                        onClick={this.handIn}>交卷</div>
                </div>

                <div className="container">
                    <ExamItem 
                        data={data}
                        usersAnswer={data.usersAnswer}
                        currIndex={currIndex}
                        maxLength={questionList.length}
                        onCheck={this.onCheck}
                        />
                </div>

                {
                    this.renderFooter()
                }
            </Page>
        ) : null
    }
}

function mapStateToProps (state) {
    return {
        sysTime: get(state, 'common.sysTime')
    }
}

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(HomeworkExam);