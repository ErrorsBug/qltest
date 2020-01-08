import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from "components/page";
import { autobind } from "core-decorators";
import { request } from 'common_actions/common';
import { get } from 'lodash';

import './style.scss'

import ExamInfo from './components/exam-info'
import ExamItem from './components/exam-item'
import { locationTo } from 'components/util';

@autobind
class StudentExam extends Component {
    state={
        examInfo: '',
        examId: '',

        status: 'ready', // ready begin end

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
            if (examUserPo.userExamStatus === 'Y' && this.examStatus !== 'restart') {
                return false
            }
        }
        return true
    }

    async initExamInfo () {
        const examId = this.props.location.query.examId
        const liveId = this.props.location.query.liveId

        if (examId) {
            const examInfo = await request({
                url: '/api/wechat/homework/exam/getExam',
                body: {
                    examId,
                    needAnalysis: 'N'
                },
                method: "POST"
            })
            
            const examUserPo = get(examInfo, 'data.examUserPo', {})
            
            if (!this.isExam(examUserPo)) {
                location.replace(`/wechat/page/exam-card?examId=${examId}&liveId=${liveId}`)
                return
            }

            this.setState({
                examInfo: get(examInfo, 'data.examPo', {}),
                examUserPo,
                questionList: get(examInfo, 'data.examPo.questionList', []),
                examId,
                liveId
            })
        }
    }

    async startExam () {
        await this.initExamInfo()

        const {
            examUserPo,
            questionList,
        } = this.state

        if (this.state.examInfo.status === 'N') {
            window.toast('考试已结束')

            if (examUserPo && examUserPo.userExamStatus !== 'N') {
                return
            }

            setTimeout(() => {
                locationTo(`/wechat/page/live/${this.state.liveId}`)
            }, 300);
            return
        }
        
        // 设置时间
        let min = this.state.examInfo.duration
        let sec = 0

        if (examUserPo && examUserPo.userExamStatus === 'E') {
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
                url: '/api/wechat/homework/exam/startExam',
                body: {
                    examId: this.state.examId,
                },
                method: "POST"
            })
            if (examStatus.state.code != 0) {
                window.toast(examStatus.state.msg)
                return
            }

            this.setState({
                questionList: questionList.map(question => {
                    question.usersAnswer = ''
                    return question
                })
            })
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

        this.setState({
            status: 'begin',
            remainingTimeStr: `${min}分${sec}秒`
        }, () => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        })
    }
    
    // 是否允许考试
    get isFollowExam () {
        const {
            examUserPo,
            examInfo
        } = this.state
        
        if (examInfo && examInfo.status === 'Y') { // 考试生效: Y 未查看解析
            if (examUserPo && examUserPo.showAnalysis === 'Y') {
                return false
            } else return true
        } else { // 考试生效: N 未考试
            if (!examUserPo || (examUserPo && examUserPo.userExamStatus === 'N')) {
                return true
            } else return false
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
                url: '/api/wechat/homework/exam/saveAnswer',
                body: {
                    examId: this.state.examId,
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
            currIndex,
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

    async submit () {
        const {
            questionList,
            currIndex,
        } = this.state

        // 交卷前保存当前所做的题目
        await this.saveUserAnswer(questionList[currIndex])

        // 交卷
        const rest = await request({
            url: '/api/wechat/homework/exam/endExam',
            body: {
                examId: this.state.examId,
            },
            method: "POST"
        })

        if (rest && rest.state.code === 0) {
            
            window.onbeforeunload = function(e){}
            locationTo(`/wechat/page/exam-card?examId=${this.state.examId}&liveId=${this.state.liveId}`)
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

                usersAnswer = usersAnswer.split('').sort().join('')
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
        if (!this.isFollowExam) return null

        switch (this.state.status) {
            case 'ready':
                return (
                    <div className="footer">
                        <div 
                            className="btn exam on-log on-visible"
                            data-log-region="test-begin"
                            data-log-pos="start"
                            onClick={this.startExam}>开始考试</div>
                    </div>
                )
            case 'begin':
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
    }

    render () {

        const {
            status,
            remainingTimeStr,
            examInfo,
            questionList,
            currIndex,
            examUserPo
        } = this.state

        const data = questionList[currIndex]

        console.log(examInfo, '111111111111111111')

        return examInfo ? (
            <Page title="考试" className={`student-exam ${!this.isFollowExam ? 'finish' : ''}`}>

                {
                    status === 'begin' ? (
                        <div className="timer-box">
                            <p>考试剩余时间：{remainingTimeStr}</p>
                            <div 
                                className="submit-btn on-log on-visible"
                                data-log-region="test-on"
                                data-log-pos="submit"
                                onClick={this.handIn}>交卷</div>
                        </div>
                    ) : null
                }

                <div className="container">

                    {
                        // 考试说明
                        status === 'ready' && <ExamInfo data={examInfo} examId={this.state.examId} liveId={this.state.liveId} isFollowExam={!this.isFollowExam} />
                    }

                    {
                        status === 'begin' && examUserPo && (examUserPo.score > 0 || examUserPo.wrongQuestions) ?
                        <div className="last-time-tips">
                            <p>温馨提示</p>
                            <p>
                                你上次考试得分: {examUserPo.score}分<br />
                                上一次答题出错的题目序号: {examUserPo.wrongQuestions}
                            </p>
                        </div>
                        : null
                    }

                    {
                        status === 'begin' && questionList.length > 0 && 
                        <ExamItem 
                            data={data}
                            usersAnswer={data.usersAnswer}
                            currIndex={currIndex}
                            maxLength={questionList.length}
                            onCheck={this.onCheck}
                            />
                    }

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

module.exports = connect(mapStateToProps, mapActionToProps)(StudentExam);