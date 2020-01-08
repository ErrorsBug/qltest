import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { get } from 'lodash';
import FollowDialog from 'components/follow-dialog';

import { isFromLiveCenter } from "components/util";
import Page from 'components/page';
import { setAlert } from '../../../actions/training'
import { apiService } from "components/api-service";

@autobind
class ClassService extends Component {
    state = {
        qrcode: '',  // 用于动态生成二维码
        followDialogOption: {
            title: '',
            desc: '',
            qrUrl: '',
        },
    }

    async initQr(periodInfo, channel) {
        window.loading(true)
        const res = await apiService.post({
            url: "/h5/camp/new/getQr",
            body: {
                    channel,
                    pubBusinessId: get(periodInfo, 'periodPo.id'),
                    showQl: 'N',
                    liveId: periodInfo.periodPo.liveId,
                    isCenter:isFromLiveCenter()?'Y':'N',
                }
        });

        const classQr = get(res, 'data.qrUrl')
        if (channel == 'campJoinClass') {
            this.setState({
                classQr
            })
        } else if (channel == 'campSetAlert') {
            this.setState({
                alertQr: classQr
            })
        }
        window.loading(false)
    }

    // 打开社群
    async openClass() {
        if (!this.state.classQr) {
            await this.initQr(this.props.periodChannel, 'campJoinClass')
        }

        this.setState({
            followDialogOption: {
                title: '请尽快长按扫码入群',
                desc: '跟老师一起学更有效',
                qrUrl: this.state.classQr
            }
        }, () => {
            this.refs.beginDialog.show();
        })
    }

    // 打开作业提醒
    async openHomeworkRemind() {
        if (!this.state.alertQr) {
            await this.initQr(this.props.periodChannel, 'campSetAlert')
        }
        // 调用上课接口
        setAlert()
        this.setState({
            followDialogOption: {
                title: '开启上课提醒通知',
                desc: '长按识别二维码,立即开启通知',
                qrUrl: this.state.alertQr
            }
        }, () => {
            this.refs.beginDialog.show();
        })
    }

    render() {
        let {
            followDialogOption,
        } = this.state

        return (
            <Page title="班级服务" className='training-class-service'>
                <div className="class-service-group">
                    <div 
                        className="group-item" 
                        onClick={this.openClass}
                        >
                        <div className="text">加入班群</div>
                        <div className="enter-arrow"></div>
                    </div>
                    <div 
                        className="group-item" 
                        onClick={this.openHomeworkRemind}
                        >
                        <div className="text">作业提醒</div>
                        <div className="enter-arrow"></div>
                    </div>
                </div>

                {/* 关注弹框 */}
                <FollowDialog
                    ref='beginDialog'
                    title={followDialogOption.title}
                    desc={followDialogOption.desc}
                    qrUrl={followDialogOption.qrUrl}
                />
            </Page> 
        )
    }
}

const mapStateToProps = function (state) {

    return {
        periodChannel: get(state, 'training.periodChannel') || {},
        sysTime: get(state, 'common.sysTime'),
    }
};

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(ClassService);