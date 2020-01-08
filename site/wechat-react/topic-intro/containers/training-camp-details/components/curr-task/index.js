import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import errorCatch from 'components/error-boundary/index';
import { formatDate, digitFormat } from 'components/util';
import Picture from 'ql-react-picture';
import { get } from 'lodash';
@errorCatch
@autobind
class CurrTask extends Component {

    state = {
        workQr: ''
    }

    async componentDidMount () {
        if (this.props.campStatus === 'open') {
			const res = await this.props.getQr({
                channel: 'channelCampAlert',
				pubBusinessId: this.props.periodInfo.channelId,
				showQl: 'N',
				liveId: this.props.liveId
			})
	
            this.setState({
                workQr: get(res, 'data.qrUrl')
            })
        }
        
    }

    async showWorkQr () {
        this.props.showQr({
            title: '开启上课提醒通知',
            desc: '长按识别二维码，立即开启通知',
            qrUrl: this.state.workQr
        })
    }
    
	render(){
        const { campStatus, data, isFocusThree, classQr } = this.props

        if (campStatus === 'unopened') return <CampBefore qrUrl={classQr} />

        if (!data) return null

        if (campStatus === 'end') return <CampEnd onClickCertificate={this.props.showCardNameSettingDialog} hasQualification={this.props.hasQualification}/>
        
        const isHomeWork = data.homeworkList && data.homeworkList.length > 0
        const homeWorkCount = isHomeWork && data.homeworkList.length
        const finishCount = isHomeWork && data.homeworkList.filter((item) => item.finishStatus === 'Y').length

        return (
            <div className="curr-task curr">
                <div className="header">
                    <p className="title">当前任务</p>
                    <span className="remind on-log" data-log-region="homework_remind" onClick={this.showWorkQr}>作业提醒</span>
                </div>
                <div className="content">
                    <p className="course-name">{data.topic}</p>
                    <div className="course-info">
                        <p className="time-str">{formatDate(data.createDate, 'yyyy-MM-dd hh:mm')}</p>
                        <p className="learn-num">{digitFormat(data.browseNum)}次学习</p>
                    </div>
                </div>
                <div className="footer">
                    <p className="desc emphasize">{data.homeworkFinishCount > 0 ? `${data.homeworkFinishCount}人完成作业` : '最早提交会排在学员作业第1位'}</p>
                    {
                        isHomeWork && (
                            finishCount === homeWorkCount ? (
                                <p className="check-btn icon-arrow" onClick={() => { this.props.taskClick(data.homeworkList) }}>查看作业</p>
                            ) : (
                                <p className="check-btn not-finish" onClick={() => { this.props.taskClick(data.homeworkList) }}>{homeWorkCount > 1 ? `去做作业(${finishCount}/${homeWorkCount})` : '去做作业'}</p>
                            )
                        )
                    }
                </div>
            </div>
        )
    }
}

const CampEnd = (props) => {
    return (
        <div className="curr-task end">
            <p className="title">训练营已结束</p>
            <p>课程内容可重读学习哦~</p>
            <div className="certificate">
                {
                    props.hasQualification ==='Y' ?
                    <div className="btn-get-certificate" onClick={props.onClickCertificate}>领取证书啦</div>
                    :
                    <div className="complete">
                        <div className="tips">未完成训练任务，没办法领取证书哦</div>
                    </div>
                }
            </div>
        </div>
    )
}

const CampBefore = (props) => {
    console.log(props.qrUrl)
    return (
        <div className="curr-task before">
            <p className="title">当前任务</p>
            <p>识别下方二维码，及时获得上课、作业提醒</p>
            <div className="Qr-box">
                <div className="qr-code">
                    {/* {
                        props.qrUrl && <Picture src={props.qrUrl} />
                    } */}
                    <Picture src={require('./img/temp-qrcode.jpg')} />
                </div>
                <div className="guide"></div>
            </div>
        </div>
    )
}

export default CurrTask;