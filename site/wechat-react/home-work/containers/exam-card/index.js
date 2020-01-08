import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from "components/page";
import { autobind } from "core-decorators";
import { request, getExamQrCode } from 'common_actions/common';
import { get } from 'lodash';
import drawCard from './until'
import { locationTo } from 'components/util';
import { logQRCodeTouchTrace } from 'components/log-util';
import { apiService } from "components/api-service";
import { isFromLiveCenter } from 'components/util';

@autobind
class ExamCard extends Component {
    state = {
        userExamInfo: {},
        shareCardUrl: ''
    };

    data = {
        rankArr: [
            {
                txt: {
                    text: '大神',
                    style: {
                        top: 560,
                        left: 300,
                        font: 36,
                        color: "#F6D75B",
                    }
                },
                bg: {
                    url: 'https://img.qlchat.com/qlLive/liveCommon/exam_great_god.png',
                    style: {
                        top: 190,
                        left: 135,
                        width: 400,
                        height: 306
                    }
                }
            },
            {
                txt: {
                    text: '精英',
                    style: {
                        top: 560,
                        left: 300,
                        font: 36,
                        color: "#F6B15B",
                    }
                },
                bg: {
                    url: 'https://img.qlchat.com/qlLive/liveCommon/exam_elite.png',
                    style: {
                        top: 190,
                        left: 135,
                        width: 400,
                        height: 306
                    }
                }
            },
            {
                txt: {
                    text: '大咖',
                    style: {
                        top: 560,
                        left: 300,
                        font: 36,
                        color: "#F6826B",
                    }
                },
                bg: {
                    url: 'https://img.qlchat.com/qlLive/liveCommon/exam_big_coffee.png',
                    style: {
                        top: 190,
                        left: 135,
                        width: 400,
                        height: 306
                    }
                }
            },
            {
                txt: {
                    text: '达人',
                    style: {
                        top: 560,
                        left: 300,
                        font: 36,
                        color: "#EE60D1",
                    }
                },
                bg: {
                    url: 'https://img.qlchat.com/qlLive/liveCommon/exam_talent.png',
                    style: {
                        top: 190,
                        left: 135,
                        width: 400,
                        height: 306
                    }
                }
            },
            {
                txt: {
                    text: '新手',
                    style: {
                        top: 560,
                        left: 300,
                        font: 36,
                        color: "#6D81F0",
                    }
                },
                bg: {
                    url: 'https://img.qlchat.com/qlLive/liveCommon/exam_novice.png',
                    style: {
                        top: 190,
                        left: 135,
                        width: 400,
                        height: 306
                    }
                }
            },
            {
                txt: {
                    text: '再接再厉',
                    style: {
                        top: 560,
                        left: 265,
                        font: 36,
                        color: "#56E6A5",
                    }
                },
                bg: {
                    url: 'https://img.qlchat.com/qlLive/liveCommon/exam_hard_work.png',
                    style: {
                        top: 190,
                        left: 135,
                        width: 400,
                        height: 306
                    }
                }
            },
        ]
    }

    componentDidMount() {
        this.initExamInfo()
    }
    
    async initExamInfo () {
        const examId = this.props.location.query.examId
        const liveId = this.props.location.query.liveId

        const homeworkId = this.props.location.query.homeworkId
        const topicId = this.props.location.query.topicId

        let userExamInfo = null
        
        if (examId) { // 考试
            const examInfo = await request({
                url: '/api/wechat/homework/exam/getUserExamInfo',
                body: {
                    examId,
                },
                method: "POST"
            })
            
            userExamInfo = get(examInfo, 'data.userExamInfo')

            // 未参加答题重定向到答题页
            if (!userExamInfo) {
                window.location.replace(`/wechat/page/student-exam?examId=${examId}&liveId=${liveId}`);
                return
            }

            this.setState({
                userExamInfo,
                examId,
                liveId,
                type: 'exam'
            }, () => {
                this.initCardPoint()
            })
        } else if (homeworkId) { // 训练营作业
            const examInfo = await request({
                url: '/api/wechat/homework/camp/getUserAnswerInfo',
                body: {
                    homeworkId,
                },
                method: "POST"
            })
            let campId = ''
            let liveId = ''
            let channelId = ''
            if (topicId) {
                const camp = await request({
                    url: '/api/wechat/training/getCampByTopicId',
                    body: {
                        topicId,
                    },
                    method: "POST"
                })
                campId = get(camp, 'data.campPeriod.campId')
                liveId = get(camp, 'data.campPeriod.liveId')
                channelId = get(camp, 'data.campPeriod.channelId')
            }

            userExamInfo = get(examInfo, 'data.answerInfo')

            if (!userExamInfo) {
                window.location.replace(`/wechat/page/homework-exam?id=${homeworkId}&topicId=${topicId}`);
                return
            }

            this.setState({
                userExamInfo,
                type: 'campExam',
                homeworkId,
                campId,
                topicId,
                liveId,
                channelId
            }, () => {
                this.initCardPointOfCamp()
            })
        }
    }
    
    async initQrCode (channel) {
        let qrCode = ''

        if (channel === 'examShare') {
            const res = await getExamQrCode({
                channel: 'examShare',
                liveId: this.props.location.query.liveId,
                pubBusinessId: this.props.location.query.examId
            })
    
            qrCode = res.url
        } else if (channel === 'homeworkQuestionShare') {
            const res = await apiService.post({
                url: "/h5/camp/new/getQr",
                body: {
                        channel,
                        pubBusinessId: this.props.location.query.homeworkId,
                        showQl: 'N',
                        liveId: this.state.liveId,
                        isCenter: isFromLiveCenter() ? 'Y':'N',
                    }
            });
            qrCode = get(res, 'data.qrUrl')
        }

        this.setState({
            qrCode
        })
        return qrCode
    }

    // 通用考试成绩卡
    async initCardPoint () {
        window.loading(true);
        const width = 670
        const height = 766

        const calculationTextAlign = (num) => {
            const lenght = (num + '').split('').length

            if ((num + '').indexOf('.') > -1) {
                return lenght * 20 + 2 - 15
            } else {
                return lenght * 20 + 2
            }
        }

        const {
            userExamInfo
        } = this.state

        const score = get(userExamInfo, 'score', 0)

        const singleContens = [
            {
                text: get(userExamInfo, 'userName'),
                style: {
                    top: 70,
                    left: 158,
                    font: 28,
                    color: "#333",
                }
            },
            {
                text: score + '',
                style: {
                    top: 385,
                    left: 340 - calculationTextAlign(score),
                    font: 55,
                    bolder: true,
                    color: "#FFF",
                }
            },
            {
                text: `考试时长：${get(userExamInfo, 'duration', 0)}分钟`,
                style: {
                    top: 620,
                    left: 40,
                    font: 28,
                    color: "#333",
                }
            },
            {
                text: `题目数量：${get(userExamInfo, 'questionCount', 0)}题`,
                style: {
                    top: 660,
                    left: 40,
                    font: 28,
                    color: "#333",
                }
            },
            {
                text: '扫码查看更多考试',
                style: {
                    top: 715,
                    left: 40,
                    font: 24,
                    color: "#999",
                }
            },
        ]
        
        let qrCode = this.state.qrCode
        if (!qrCode) {
            qrCode = await this.initQrCode('examShare')
        }

        const imageContens = [
            {
                url: get(userExamInfo, 'headImgUrl'),
                style: {
                    left: 40,
                    top: 40,
                    width: 88,
                    height: 88,
                    isClip: true,
                    x: 40,
                    y: 40,
                    w: 88,
                    h: 88,
                    r: {
                        r_top_left: 44,
                        r_top_right: 44,
                        r_bottom_right: 44,
                        r_bottom_left: 44
                    },
                    bdWidth: 1,
                    bdColor: "#fff",
                    bgcolor: "rgba(255,255,255)",
                }
            },
        ]
        
        if (qrCode) {
            imageContens.push({
                url: qrCode,
                style: {
                    top: 580,
                    left: 485,
                    width: 150,
                    height: 150
                }
            })
        }

        let rank = 5
        if (score > 99) {
            rank = 0
        } else if (score > 89) {
            rank = 1
        } else if (score > 79) {
            rank = 2
        } else if (score > 69) {
            rank = 3
        } else if (score > 59) {
            rank = 4
        }

        const rankObj = this.data.rankArr[rank]
        singleContens.push(rankObj.txt)
        imageContens.push(rankObj.bg)

        const multiContens = [
            {
                text: `我参加了${get(userExamInfo, 'examTitle')}的考试`,
                style: {
                    top: 110,
                    left: 158,
                    font: 24,
                    width: 450,
                    lineHeight: 35,
                    maxLine: 2,
                    color: "#999",
                }
            }
        ]
        drawCard({
            cardWidth: width,
            cardHeight: height,
            singleContens,
            imageContens,
            multiContens,
            blockContents: [
                {
                    x: 40, 
                    y: 575, 
                    w: width - 80, 
                    h: 1,
                    bgcolor: '#EEE',
                    r: {
                        r_top_right: 0,
                        r_bottom_right: 0,
                        r_bottom_left: 0,
                        r_top_left: 0
                    },
                    bdWidth: 0, //边框的宽度厚度
                    bdColor: '#FFF'
                }
            ],
            cb: (url) => {
                window.loading(false);
                this.setState({
                    shareCardUrl: url
                }, () => {
                    typeof _qla != 'undefined' && _qla.collectVisible();
                })
            }
        })
    }
    
    // 训练营作业成绩卡
    async initCardPointOfCamp () {
        window.loading(true);
        const width = 670
        const height = 766

        const calculationTextAlign = (num) => {
            const lenght = (num + '').split('').length

            if ((num + '').indexOf('.') > -1) {
                return lenght * 20 + 2 - 15
            } else {
                return lenght * 20 + 2
            }
        }

        const {
            userExamInfo
        } = this.state

        const score = get(userExamInfo, 'score', 0)

        const singleContens = [
            {
                text: get(userExamInfo, 'userName'),
                style: {
                    top: 70,
                    left: 158,
                    font: 28,
                    color: "#333",
                }
            },
            {
                text: score + '',
                style: {
                    top: 385,
                    left: 340 - calculationTextAlign(score),
                    font: 55,
                    bolder: true,
                    color: "#FFF",
                }
            },
            {
                text: `题目数量：${get(userExamInfo, 'questionCount', 0)}题`,
                style: {
                    top: 660,
                    left: 40,
                    font: 28,
                    color: "#333",
                }
            },
            {
                text: '扫码查看更多作业',
                style: {
                    top: 715,
                    left: 40,
                    font: 24,
                    color: "#999",
                }
            },
        ]

        if (get(userExamInfo, 'duration', 0) > 0) {
            singleContens.push({
                text: `作业时长：${get(userExamInfo, 'duration', 0)}分钟`,
                style: {
                    top: 620,
                    left: 40,
                    font: 28,
                    color: "#333",
                }
            })
        }

        let qrCode = this.state.qrCode
        if (!qrCode) {
            qrCode = await this.initQrCode('homeworkQuestionShare')
        }

        const imageContens = [
            {
                url: get(userExamInfo, 'headImgUrl'),
                style: {
                    left: 40,
                    top: 40,
                    width: 88,
                    height: 88,
                    isClip: true,
                    x: 40,
                    y: 40,
                    w: 88,
                    h: 88,
                    r: {
                        r_top_left: 44,
                        r_top_right: 44,
                        r_bottom_right: 44,
                        r_bottom_left: 44
                    },
                    bdWidth: 1,
                    bdColor: "#fff",
                    bgcolor: "rgba(255,255,255)",
                }
            },
        ]
        
        if (qrCode) {
            imageContens.push({
                url: qrCode,
                style: {
                    top: 580,
                    left: 485,
                    width: 150,
                    height: 150
                }
            })
        }

        let rank = 5
        if (score > 99) {
            rank = 0
        } else if (score > 89) {
            rank = 1
        } else if (score > 79) {
            rank = 2
        } else if (score > 69) {
            rank = 3
        } else if (score > 59) {
            rank = 4
        }

        const rankObj = this.data.rankArr[rank]
        singleContens.push(rankObj.txt)
        imageContens.push(rankObj.bg)

        const multiContens = [
            {
                text: `我参加了${get(userExamInfo, 'homeworkTitle')}的作业`,
                style: {
                    top: 110,
                    left: 158,
                    font: 24,
                    width: 450,
                    lineHeight: 35,
                    maxLine: 2,
                    color: "#999",
                }
            }
        ]
        drawCard({
            cardWidth: width,
            cardHeight: height,
            singleContens,
            imageContens,
            multiContens,
            blockContents: [
                {
                    x: 40, 
                    y: 575, 
                    w: width - 80, 
                    h: 1,
                    bgcolor: '#EEE',
                    r: {
                        r_top_right: 0,
                        r_bottom_right: 0,
                        r_bottom_left: 0,
                        r_top_left: 0
                    },
                    bdWidth: 0, //边框的宽度厚度
                    bdColor: '#FFF'
                }
            ],
            cb: (url) => {
                window.loading(false);
                this.setState({
                    shareCardUrl: url
                }, () => {
                    typeof _qla != 'undefined' && _qla.collectVisible();
                })
            }
        })
    }

    seeAnswer () {
        if (this.state.type === 'campExam') {
            locationTo(`/wechat/page/exam-analysis?homeworkId=${this.state.homeworkId}&campId=${this.state.campId}`)
        } else {
            locationTo(`/wechat/page/exam-analysis?examId=${this.state.examId}&liveId=${this.state.liveId}`)
        }
    }
    
    // 是否正在进行touch事件
    isTouching = false
    touchStartHandle(){
        this.isTouching = true
        this.touchTimer = setTimeout(() => {
            if(this.isTouching){
                logQRCodeTouchTrace('save')
            }
        },700)
    }
    
    touchEndHandle(){
        if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
    }

    async reStart () {

        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('examStatus', 'restart');

        if (this.state.type === 'campExam') {
            locationTo(`/wechat/page/homework-exam?id=${this.state.homeworkId}&topicId=${this.state.topicId}`)
        } else {
            locationTo(`/wechat/page/student-exam?examId=${this.state.examId}&liveId=${this.state.liveId}`)
        }
    }
    
    renderCampExam = () => {
        return this.state.shareCardUrl ? (
            <Page title={this.state.userExamInfo.homeworkTitle} className='exam-card'>
                <div className="container">
                    <div className="card-box">
                        <img 
                            className="on-visible"
                            data-log-region="test-share"
                            data-log-pos="save"
                            onTouchStart = {this.touchStartHandle.bind(this)} 
                            onTouchEnd = {this.touchEndHandle.bind(this)}
                            src={this.state.shareCardUrl} />
                    </div>
                    <p className="tips">长按图片保存到相册，或发送给朋友</p>
                    <div className="see-answer">
                        <strong 
                            className="on-log on-visible" 
                            data-log-region="test-share"
                            data-log-pos="analysis"
                            onClick={this.seeAnswer}>查看解析</strong>（查看后无法重新答题）</div>
                </div>

                <div className="footer">
                    {
                        this.state.userExamInfo.showAnalysis === 'N' && 
                        <div className="btn mr20 on-log on-visible" 
                            data-log-region="test-share"
                            data-log-pos="restar"
                            onClick={this.reStart}>重新答题</div>
                    }
                    {
                        this.state.channelId ? 
                            <div 
                                className="btn exam on-log on-visible" 
                                data-log-region="test-share"
                                data-log-pos="return"
                                onClick={() => locationTo(`/wechat/page/training-learn?channelId=${this.state.channelId}`)}>返回训练营</div>
                            : null
                    }
                </div>
            </Page>
        ) : null
    }

    render() {
        if (this.state.type === 'campExam') {
            return this.renderCampExam()
        }

        return this.state.shareCardUrl ? (
            <Page title={this.state.userExamInfo.examTitle} className='exam-card'>
                <div className="container">
                    <div className="card-box">
                        <img 
                            className="on-visible"
                            data-log-region="test-share"
                            data-log-pos="save"
                            onTouchStart = {this.touchStartHandle.bind(this)} 
                            onTouchEnd = {this.touchEndHandle.bind(this)}
                            src={this.state.shareCardUrl} />
                    </div>
                    <p className="tips">长按图片保存到相册，或发送给朋友</p>
                    <div className="see-answer">
                        <strong 
                            className="on-log on-visible" 
                            data-log-region="test-share"
                            data-log-pos="analysis"
                            onClick={this.seeAnswer}>查看解析</strong>（查看后无法重新答题）</div>
                </div>

                <div className="footer">
                    {
                        this.state.userExamInfo.showAnalysis === 'N' && 
                        <div className="btn mr20 on-log on-visible" 
                            data-log-region="test-share"
                            data-log-pos="restar"
                            onClick={this.reStart}>重新答题</div>
                    }
                    {
                        this.state.liveId ? 
                            <div 
                                className="btn exam on-log on-visible" 
                                data-log-region="test-share"
                                data-log-pos="return"
                                onClick={() => locationTo(`/wechat/page/live/${this.state.liveId}`)}>返回直播间</div>
                            : null
                    }
                </div>
            </Page>
        ) : null
    }
}

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExamCard);