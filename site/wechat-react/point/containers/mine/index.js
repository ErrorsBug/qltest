import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import classNames from 'classnames';

import Pitcure from 'ql-react-picture';
import MiddleDialog from 'components/dialog/middle-dialog';
import ScrollView from 'components/scroll-view';

import { request } from 'common_actions/common';
import { locationTo } from 'components/util';
import { collectVisible, bindVisibleScroll } from 'components/collect-visible';

import {
    userBindKaifang
} from "../../actions/common";


class PageContainer extends Component {

    get kfInfo() {
        if (
            this.props.location.query.kfAppId &&
            this.props.location.query.kfOpenId
        ) {
            return {
                kfAppId: this.props.location.query.kfAppId,
                kfOpenId: this.props.location.query.kfOpenId
            };
        } else {
            return;
        }
    }

    state = {
        isShowDialogUsage: false,
        isShowDialogAttendance: false,

        // 剩余积分
        residuePoint: '?',
        // 连续打卡天数，！！！这个是显示值，不是索引值
        signDay: 0,	
        // 今日是否打卡
        hasSign: false,	

        // 打卡模块配置
        signScoreList: [],

        // 打卡请求状态
        attendStatus: '',
        todaySignPoint: 0,

        // 礼品列表
        giftList: {
            status: '',
            data: undefined,
            page: {
                size: 10,
            },
        },

        taskTabActiveIndex: 0,

        // 所有任务（此处只保留索引）
        totalTasks: [],
        taskMap: {}
    }

    componentDidMount() {
        this.initPage();
        bindVisibleScroll('p-point-mine');
        if(this.kfInfo) {
            this.props.userBindKaifang(this.kfInfo);
        }
    }

    render() {
        const { taskTabActiveIndex } = this.state;
        const signProgMaxDay = this.state.signScoreList.length;

        return <Page title="我的学分" className="p-point-mine">
            <ScrollView
                status={this.state.giftList.status}
                onScrollBottom={() => this.getGiftList(true)}
            >
                <div className="overview">
                    <div className="total-point">
                        <span>{this.state.residuePoint}</span>学分
                    </div>
                    <div className="btn-usage on-log" data-log-region="btn-usage" onClick={this.showDialogUsage}>?</div>
                </div>

                {
                    !!this.state.signScoreList.length &&
                    <div className="attendance">
                        <div className="attend-wrap">
                            <div>
                                <h1>已连续打卡 {this.state.signDay} 天</h1>
                                <h2>打卡有福利，奖品随意挑</h2>
                            </div>
                            <div className={`btn-attend${this.state.hasSign ? ' disabled' : ' on-log on-visible'}`}
                                data-log-region="btn-attend"
                                onClick={this.onClickAttend}
                            >{this.state.hasSign ? '已打卡' : '打卡'}</div>
                        </div>
                        <div className="progress">
                            {this.state.signScoreList.map((item, index) => {
                                const cln = index < this.state.signDay ? 'item active' : 'item';
                                return <div className={cln} key={index}>
                                    <div className="entity">
                                    {
                                        index === signProgMaxDay - 1
                                        ?
                                        <div className="icon-gift"></div>
                                        :
                                        `+${item.point}`
                                    }
                                    </div>
                                    <div className="line"></div>
                                </div>
                            })}
                        </div>
                    </div>
                }

                {
                    !!this.state.totalTasks.length &&
                    <div className="task">
                        <div className="tabs">
                            {this.state.totalTasks.map((item, index) => {
                                return <div key={index}
                                    className={`tab-item on-log${index == taskTabActiveIndex ? ' active' : ''}`}
                                    data-log-region={'tab-' + item.id}
                                    onClick={() => this.onClickTaskTab(index)}
                                >
                                    {item.name}
                                </div>
                            })}
                        </div>
                        <div className="task-list">
                            {this.state.totalTasks[taskTabActiveIndex].tasks.map((id, index) => {
                                const item = this.state.taskMap[id];
                                const cln = classNames('task-item', item.isSuccess === 'Y' ? 'status-done' : item.waitPoint > 0 ? 'status-receive' : 'status-do');

                                return <div className={cln} key={item.assignmentCode + index}>
                                    <div className="name-wrap">
                                        <span className="name">{item.assignmentName}</span>
                                        <span className="point">（+{item.point}）</span>
                                    </div>
                                    {
                                        item.isSuccess === 'Y'
                                            ?
                                            <div className="btn-operate">已完成</div>
                                            :
                                            item.waitPoint > 0
                                                ?
                                                <div className="btn-operate on-log on-visible"
                                                    data-log-region="task-btn-receive"
                                                    data-log-pos={item.assignmentCode}
                                                    onClick={() => this.onClickReceive(id, taskTabActiveIndex)}
                                                >领取</div>
                                                :
                                                <div className="btn-operate on-log on-visible"
                                                    data-log-region="task-btn-do"
                                                    data-log-pos={item.assignmentCode}
                                                    onClick={() => locationTo(item.url)}
                                                >做任务</div>
                                    }
                                </div>
                            })}
                        </div>
                    </div>
                }

                {
                    this.state.giftList.data &&
                    <div className="exchange">
                        <div className="title-wrap">
                            学分兑换
                            <div className="btn-check-received on-log"
                                data-log-region="btn-check-received"
                                onClick={() => this.props.router.push('/wechat/page/point/received')}>查看已领奖品</div>
                        </div>
                        <div className="reward-list">
                            {
                                this.state.giftList.data.map((item, index) => {
                                    return <div className="reward-item on-log on-visible" key={index}
                                        data-log-region="reward-item"
                                        data-log-pos={index}
                                        onClick={() => locationTo('/wechat/page/point/gift-detail?giftId='+ item.id)}>
                                        <div className="head-img">
                                            <Pitcure src={`${item.headImageUrl}@306w_192h_1e_1c_2o`} />
                                        </div>
                                        
                                        <div className="name">{item.giftName}</div>
                                        <div className="point">
                                            {item.changePoint}学分
                                            {
                                                item.receiveStauts === 'Y' && item.changePoint <= this.state.residuePoint &&
                                                <span className="icon-can-exchange">可兑换</span>
                                            }
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                }
            </ScrollView>

            {
                this.state.isShowDialogAttendance &&
                <div className="dialog-attendance" onClick={this.closeDialogAttendance}>
                    <div className="header-light"></div>
                    <div className="entity" onClick={e => e.stopPropagation()}>
                        <div className="header">
                            <h1>打卡成功</h1>
                            <h2>连续打卡{signProgMaxDay}天送大礼包</h2>
                        </div>

                        {
                            this.state.signDay >= signProgMaxDay
                            ?
                            <div className="desc">恭喜你获得<span>{this.state.todaySignPoint}学分</span>大礼包</div>
                            :
                            <div className="desc">今天已领{this.state.todaySignPoint}学分</div>
                        }

                        {
                            this.state.signDay >= signProgMaxDay
                            ?
                            <div className="img-gift"></div>
                            :
                            <div className="progress-d">
                                {this.state.signScoreList.map((item, index) => {
                                    const cln = classNames('item', {
                                        active: index < this.state.signDay,
                                        gift: index === signProgMaxDay - 1,
                                    });
                                    return <div className={cln} key={index}>
                                        +{item.point}
                                    </div>
                                })}
                            </div>
                        }

                        <div className="btn-iknow on-log on-visible"
                            data-log-region="dialog-attendance-btn-iknow"
                            data-log-pos={this.state.signDay}
                            onClick={this.closeDialogAttendance}>我知道了</div>
                    </div>
                </div>
            }

            <MiddleDialog
                show={this.state.isShowDialogUsage}
                buttonTheme="line"
                buttons="cancel"
                cancelText="我知道了"
                onClose={this.closeDialogUsage}
                onBtnClick={this.onClickDialogUsageBtn}
            >
                <div className="dialog-usage">
                    <div className="title">学分说明</div>
                    <p>1. 学分可以用来兑换礼品，包括课程、优惠券、会员体验卡等等</p>
                    <p>2. 学分可以通过做任务和打卡获得</p>
                    <p>3. 学分只可以在千聊内部使用，不可兑换现金</p>
                    <p>4. 千聊保留最终解释权</p>
                </div>
            </MiddleDialog>
        </Page>
    }

    initPage() {

        // 获取用户积分信息
        request({
            url: '/api/wechat/transfer/pointApi/point/getPointUserInfo',
            method: 'POST',
            throwWhenInvalid: true,
        }).then(res => {
            this.setState({
                residuePoint: res.data.residuePoint,
                hasSign: res.data.hasSign === 'Y',
                signDay: res.data.signDay,
            }, () => {
                collectVisible();
            })
        }).catch(err => {
            console.error(err);
            window.toast('获取用户积分失败');
        })


        // 获取任务列表
        request({
            url: '/api/wechat/transfer/pointApi/point/getPointAssignmentUserList',
            method: 'POST',
            throwWhenInvalid: true,
        }).then(res => {
            const totalTasks = res.data.assignmentUserList || {};
            this.setState({
                signScoreList: totalTasks.signScoreList || [],
            })

            const taskMap = {};
            const doIt = tasks => {
                let _tasks = [];
                tasks.forEach((item, index) => {
                    // _status字段用与排序
                    // 1：领取 2：做任务 3：已完成
                    item._status = item.isSuccess === 'Y' ? 3 : item.waitPoint > 0 ? 1 : 2;
                    // 记录后端输出排序
                    item._index = index;
                    
                    _tasks.push(item.id);
                    taskMap[item.id] = item;
                })

                return tasksBubbleSort(_tasks, taskMap);
            }

            const newTasks = doIt(totalTasks.newPointAssignmentList || []);
            const usualTasks = doIt(totalTasks.usualPointAssignmentList || []);
            const growTasks = doIt(totalTasks.growPointAssignmentList || []);

            this.setState({
                totalTasks: [
                    {
                        name: '新手任务',
                        id: 'new-tasks',
                        tasks: newTasks,
                    },{
                        name: '日常任务',
                        id: 'usual-tasks',
                        tasks: usualTasks,
                    },{
                        name: '成长任务',
                        id: 'grow-tasks',
                        tasks: growTasks,
                    }
                ],
                taskMap,
            }, () => {
                collectVisible();
            })
        }).catch(err => {
            console.error(err);
        })

        this.getGiftList();
    }

    getGiftList = isContinue => {
        const giftList = this.state.giftList;
        if (/pending|end/.test(giftList.status)) return;

        const page = {...giftList.page};
        page.page = isContinue && page.page ? page.page + 1 : 1;

        this.setState({
            giftList: {
                ...giftList,
                status: 'pending',
            }
        })

        request({
            url: '/api/wechat/transfer/pointApi/point/giftList',
            method: 'POST',
            throwWhenInvalid: true,
            body: {
                page
            }
        }).then(res => {
            const list = res.data.giftList || [];

            this.setState({
                giftList: {
                    ...this.state.giftList,
                    data: isContinue ? (this.state.giftList.data || []).concat(list) : list,
                    status: list.length < page.size ? 'end' : 'success',
                    page,
                }
            }, () => {
                collectVisible();
            })
        }).catch(err => {
            console.error(err);

            this.setState({
                giftList: {
                    ...this.state.giftList,
                    status: '',
                }
            })
        })
    }

    onClickReceive = (id, tabIndex) => {
        const task = this.state.taskMap[id];

        if (task._request === 'pending') return;
        this.setState({
            taskMap: {
                ...this.state.taskMap,
                [id]: {
                    ...task,
                    _request: 'pending',
                }
            }
        })

        request({
            url: '/api/wechat/transfer/pointApi/point/receivePoint',
            method: 'POST',
            throwWhenInvalid: true,
            body: {
                assignmentCode: task.assignmentCode
            }
        }).then(res => {
            const point = res.data.point || 0;
            window.toast('学分+' + point);

            this.setState({
                residuePoint: this.state.residuePoint + point,
                taskMap: {
                    ...this.state.taskMap,
                    [id]: {
                        ...this.state.taskMap[id],
                        isSuccess: 'Y',
                        _request: '',
                        _status: 3,
                    }
                }
            }, () => {
                // update sort
                const totalTasks = [...this.state.totalTasks];
                totalTasks[tabIndex] = {
                    ...totalTasks[tabIndex],
                    tasks: tasksBubbleSort(totalTasks[tabIndex].tasks, this.state.taskMap),
                }
                this.setState({
                    totalTasks
                })
            })
        }).catch(err => {
            console.error(err);
            window.toast('领取失败');

            this.setState({
                taskMap: {
                    ...this.state.taskMap,
                    [id]: {
                        ...this.state.taskMap[id],
                        _request: '',
                    }
                }
            })
        })
    }

    onClickAttend = () => {
        if (!(this.state.residuePoint >= 0)) return;
        if (this.state.hasSign) return;
        if (this.state.attendStatus === 'pending') return;

        this.setState({
            attendStatus: 'pending',
        })

        request({
            url: '/api/wechat/transfer/pointApi/point/sign',
            method: 'POST',
            throwWhenInvalid: true,
        }).then(res => {
            let todaySignPoint = res.data.point || 0;
            let signDay = this.state.signDay + 1
            this.setState({
                attendStatus: 'success',
                hasSign: true,
                signDay,
                todaySignPoint,
                residuePoint: this.state.residuePoint + todaySignPoint,
            })
            
            this.showDialogAttendance();
        }).catch(err => {
            console.error(err);
            window.toast('打卡失败');
            this.setState({
                attendStatus: '',
            })
        })
    }

    onClickTaskTab = index => {
        this.setState({taskTabActiveIndex: index}, () => {
            collectVisible();
        });
    }

    onClickDialogUsageBtn = type => {
        if (type === 'cancel') {
            this.closeDialogUsage();
        } 
    }

    showDialogUsage = () => {
        this.setState({isShowDialogUsage: true});
    }

    closeDialogUsage = () => {
        this.setState({isShowDialogUsage: false});
        typeof _qla !== undefined && _qla('click', {region: 'dialog-usage-close'});
    }

    showDialogAttendance = () => {
        this.setState({isShowDialogAttendance: true}, () => {
            collectVisible();
        });
    }

    closeDialogAttendance = () => {
        this.setState({isShowDialogAttendance: false});
    }
}


module.exports = connect(state => state, {userBindKaifang})(PageContainer);





// 按照任务状态排序
function tasksBubbleSort(tasks, taskMap) {
    tasks = [...tasks];
    const len = tasks.length;

    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (taskMap[tasks[j]]._index > taskMap[tasks[j + 1]]._index) {
                let temp = tasks[j];
                tasks[j] = tasks[j + 1];
                tasks[j + 1] = temp;
            }
        }
    }

    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (taskMap[tasks[j]]._status > taskMap[tasks[j + 1]]._status) {
                let temp = tasks[j];
                tasks[j] = tasks[j + 1];
                tasks[j + 1] = temp;
            }
        }
    }
    
    return tasks;
}