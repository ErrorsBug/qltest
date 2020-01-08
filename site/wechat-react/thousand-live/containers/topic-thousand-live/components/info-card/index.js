import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import shallowCompare from 'react-addons-shallow-compare';

import { locationTo, formatDate, htmlTransferGlobal } from 'components/util';
import { isPc } from 'components/envi';
import { apiService } from "components/api-service";

// import { liveAlert } from 'thousand_live_actions/thousand-live-common';


/**
 * 页面顶部话题信息卡片（包含倒计时和开课提醒、直播推送、邀请嘉宾）
 */
@autobind
class InfoCard extends PureComponent {
    state = {
        isAlert: this.props.isAlert,
        isTopicBeginning: this.isTopicBeginning,
        day: 0,
        hours: 0,
        minutes: 0,
        second: 0,
    }

    componentDidMount() {
        // 未开始时，进入倒计时模式
        // if (!this.state.isTopicBeginning) {
        //     this.initCountDown();
        // }
    }

    // 话题是否开始
    get isTopicBeginning() {
        let { status, sysTime, startTime } = this.props;

        // 未开始时
        if ('beginning' === status && sysTime < startTime) {
            return false;
        } else {
            return true;
        }
    }

    // 倒计时初始化
    initCountDown() {
        let second = this.getLeftSeconds();

        let day = ~~(second / (3600 * 24));
        let hours = ~~(second % (3600 * 24) / 3600);
        let minutes = ~~(second % 3600 / 60);

        this.setState({
            day: day,
            hours: hours,
            minutes: minutes,
            second: second % 60,
        });

        this.doTimer();
    }

    // 获取剩余秒数
    getLeftSeconds() {
        let { startTime, sysTime } = this.props;

        let leftTime = parseInt((Number(startTime) - Number(sysTime)) / 1000);

        if (leftTime < 0) {
            leftTime = 0;
        }

        return leftTime;
    }

    // async handleRemindBtnClick() {
    //     let result = await this.props.setRemindAction(this.props.liveId, 'Y', 'Y');

    //     if (result && result.state && result.state.code === 0) {
    //         // 开课提醒
    //         await liveAlert(this.props.liveId,'Y')
    //         this.setState({
    //             isAlert: true,
    //         });

    //         this.props.onFollowLiveQrcode();
    //     } else {
    //         window.toast(result.state.msg);
    //     }
    // }

    // 跳转到一次性订阅页面
    jumpToOneTimeSubscribe(){
        if(!this.props.oneTimePushSubcirbeStatus.subcribeUrl){
            return
        }
        locationTo(this.props.oneTimePushSubcirbeStatus.subcribeUrl)
    }

    // 取消开课提醒
    cancelRemind() {
        window.simpleDialog({
            msg: '您将无法收到该课程的开课提醒，<br />确定要取消提醒吗？',
            onConfirm: async () => {
                const res = await apiService.post({
                    url: '/h5/topic/oneTimePush/cancleSubcirbe',
                    body: {
                        topicId: this.props.id
                    }
                });
                if (res.state.code === 0) {
                    this.props.switchRemindSubscibeStatus('closed');
                    window.toast('已取消');
                } else {
                    window.toast(res.state.msg);
                }
            }
        });
    }

    // 倒计时计时器
    doTimer() {
        this.timer = setInterval(() => {
            let {day, hours, minutes, second } = this.state;

            if (second === 0 && minutes === 0 && hours === 0 && day === 0) {
                clearInterval(this.timer);
                this.setState({
                    isTopicBeginning: true,
                });
            } else if (second === 0 && minutes === 0 && hours === 0) {
                day -= 1;
                hours = 23;
                minutes = 59;
                second = 59;
            } else if (second === 0 && minutes === 0) {
                hours -= 1;
                minutes = 59;
                second = 59;
            } else if (second === 0) {
                minutes -= 1;
                second = 59;
            } else {
                second -= 1;
            }

            this.setState({
                day: day,
                hours: hours,
                minutes: minutes,
                second: second,
            });
        }, 1000);
    }

    render() {
        return (
            <div className="info-card">
                <div className="name">
                    <code>    
                        {htmlTransferGlobal(this.props.topic)}
                    </code>    
				</div>
                <div className="start-date">
                    <span className="tip">本次课程于{formatDate(this.props.startTime, 'yyyy-MM-dd hh:mm:ss')}开始</span>
                </div>
                {/* {
                    this.state.isTopicBeginning ? (
                        <div className="start-date">
        					<span className="tip">本次课程于{formatDate(this.props.startTime, 'yyyy-MM-dd hh:mm:ss')}开始</span>
        				</div>
                    ): (
                        <div className="start-date">
        					<span className="tip">距课程开始：</span>
        					<dl className="count-down">
                                <dd><var className="day">{this.state.day}</var>天</dd>
                                <dd><var className="hour">{this.state.hours}</var>时</dd>
                                <dd><var className="minute">{this.state.minutes}</var>分</dd>
                                <dd><var className="second">{this.state.second}</var>秒</dd>
                            </dl>
        				</div>
                    )
                } */}
                {
                    this.props.allowMGLive ? (
                        <div className="bottom">
                            <div className="push on-log"
                                onClick={this.props.onPushBtnClick}
                                data-log-region="info-card"
                                data-log-pos="push-btn"
                                >
                                推送通知
                            </div>
                            {
                                this.props.status === 'beginning' && this.props.isRelay != 'Y' ? (
                                    <div className="invite on-log"
                                        onClick={(e) => {
                                            locationTo(`/wechat/page/guest-list?liveId=${this.props.liveId}&topicId=${this.props.id}`);
                                        }}
                                        data-log-region="info-card"
                                        data-log-pos="invite-btn"
                                        >
                                        邀请嘉宾
                                    </div>
                                ): null
                            }
                        </div>
                    ): (
                        <div className="bottom">
                            {
                                this.props.oneTimePushSubcirbeStatus.subcribe === true ? (
                                    <div className="remind-tip">开课前，将通知你！<span className="cancel-remind" role="button" onClick={this.cancelRemind}>取消提醒</span></div>
                                ): (
                                    !isPc() && <div className="remind-btn on-log"
                                        onClick={this.jumpToOneTimeSubscribe}
                                        data-log-region="info-card"
                                        data-log-pos="remind-btn"
                                        >
                                        设置开课提醒
                                    </div>
                                )
                            }
                        </div>
                    )
                }
			</div>
        );
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }
}

InfoCard.propTypes = {
    // 直播间id
    liveId: PropTypes.string,
    // 话题id
    id: PropTypes.string,
    // 话题名称
    topic: PropTypes.string,
    // 进页面时的server时间
    sysTime: PropTypes.number,
    // 话题开始时间
    startTime: PropTypes.number,
    // 话题状态标识
    status: PropTypes.string,
    // 是否转播
    isRelay: PropTypes.string,
    // 是否设置了开课提醒
    isAlert: PropTypes.bool,
    // 是否有管理权限
    allowMGLive: PropTypes.bool,

    // 设置开播提醒action
    setRemindAction: PropTypes.func,
    // 推送直播按钮点击回调
    onPushBtnClick: PropTypes.func,
};


export default InfoCard;
