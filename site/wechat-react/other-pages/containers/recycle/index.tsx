import * as React from 'react';
import {connect} from 'react-redux';
import {autobind} from 'core-decorators';

import Page from 'components/page';
import {formatDate, formatMoney} from 'components/util';
import {
    deleteCamp,
    deleteChannel,
    deleteNewCamp,
    deleteTopic,
    endTopic,
    getCampList,
    getChannelList,
    getNewCampList,
    getTopicList,
    hideCamp,
    hideChannel,
    hideNewCamp,
    hideTopic,
} from '../../actions/recycle'

import {BottomDialog} from 'components/dialog';
import EmptyPage from 'components/empty-page';

import moreIcon from './img/more.png';

const menuArr = [
    {id: 1, name: '单课'},
    {id: 2, name: '系列课'},
    {id: 3, name: '训练营'},
    {id: 4, name: '打卡'},
]

@autobind
class Recycle extends React.Component {

    state = {
        currentTab: 1,
        topicList: [],
        channelList: [],
        newCampList: [],
        campList: [],
        showMenuDialog: false,
        dialogStatus: {type: undefined, item: undefined, itemIndex: undefined}
    }

    get liveId() {
        let param = this.props.location.query.liveId
        if (/\.htm|\.html/gi.test(param)) {
            param = param.replace(/\.htm|\.html/gi, '')
        }
        return param || ''
    }

    get tab() {
        return this.props.location.query.tab || 1
    }


    componentDidMount() {
        this.initData()
        this.setState({
            currentTab: this.tab
        })
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 2000);
    }

    async initData(isOnlyType?: string) {
        let page = {
            page: 1,
            size: 99999,
            pageSize: 99999
        }
        let showDisplay = 'Y'
        let displayStatus = 'N'
        let liveId = this.liveId

        let topicList = []
        let channelList = []
        let campList = []
        let newCampList = []

        // 单课
        if (!isOnlyType || isOnlyType == 'topic') {
            topicList = await getTopicList({liveId, page, showDisplay, displayStatus}).then(res => {
                return res.data.liveTopics || []
            }).catch(err => {
                return []
            })
            this.setState({
                topicList,
            })
        }

        // 系列课
        if (!isOnlyType || isOnlyType == 'channel') {
            channelList = await getChannelList({liveId, page, showDisplay, displayStatus}).then(res => {
                return res.data.liveChannels || []
            }).catch(err => {
                return []
            })
            this.setState({
                channelList,
            })
        }

        // 训练营
        if (!isOnlyType || isOnlyType == 'newCamp') {
            newCampList = await getNewCampList({liveId, page, showDisplay, displayStatus, status: 'N'}).then(res => {
                return res.data.dataList || []
            }).catch(err => {
                return []
            })
            this.setState({
                newCampList
            })
        }

        // 打卡
        if (!isOnlyType || isOnlyType == 'camp') {
            campList = await getCampList({liveId, page, showDisplay, displayStatus}).then(res => {
                return res.data.liveCampList || []
            }).catch(err => {
                return []
            })
            this.setState({
                campList,
            })
        }

    }

    handleClickTab(item: any) {
        this.setState({
            currentTab: item.id
        }, () => {

        })
    }

    handleOpenMenu(type: string, item: any, itemIndex: number) {
        this.setState({
            showMenuDialog: true,
            dialogStatus: {
                type,
                item,
                itemIndex
            }
        }, () => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        })
    }

    handleCloseMenu() {
        this.setState({
            showMenuDialog: false
        }, () => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        })
    }

    closeBottomMenu(e) {
        this.handleCloseMenu()
    }

    async onItemClick(e) {
        if (e == 'show') {
            const {dialogStatus} = this.state;
            const qlaObj = {
                'topic': 'topic',
                'channel': 'channel',
                'newCamp': 'train',
                'camp': 'camp'
            }
            window.simpleDialog({
                title: '取消隐藏',
                msg: `取消隐藏后，课程将恢复到直播间首页可见状态。确定取消隐藏吗?`,
                onConfirm: async () => {
                    await this.handleProcessResume()
                    this.handleCloseMenu()
                    typeof _qla != 'undefined' && _qla('click', {
                        region: `recycle-${qlaObj[dialogStatus.type]}-cancelhidden-btn`,
                    });
                }
            });
        }
        if (e == 'delete') {
            const {dialogStatus} = this.state;
            if(dialogStatus.type === 'topic') { // 删除单课
                if (dialogStatus.item.authNum !== undefined && dialogStatus.item.authNum > 0) {
                    window.toast('目前该课程已有学员报名，不可删除');
                    this.handleCloseMenu()
                    return ; 
                }
            } else if (dialogStatus.type === 'channel') { // 删除系列课
                if (dialogStatus.item.topicCount !== undefined && dialogStatus.item.topicCount > 0) {
                    window.toast('目前该系列课内有课，不可删除');
                    this.handleCloseMenu()
                    return ;                     
                }
            } else if (dialogStatus.type === 'newCamp') {
                if(dialogStatus.item.periodCount !== undefined && dialogStatus.item.periodCount > 0) {
                    window.toast('目前该课程内有期数，不可删除');
                    this.handleCloseMenu()
                    return ;                         
                }
            }
            
            window.simpleDialog({
                title: '删除课程',
                msg: `是否删除此课程`,
                onConfirm: async () => {
                    await this.handleProcessDelete()
                    this.handleCloseMenu()
                }
            });

        }
        if (e == 'finish') {
            window.simpleDialog({
                title: '结束直播',
                msg: `1.结束直播后，讲师嘉宾将不能继续发言。<br>2.结束本次直播，用户将从头开始回顾。<br>3.若在话题开播前结束直播，将导致该话题门票收益无法提现。`,
                onConfirm: async () => {
                    await this.handleProcessEndTopic()
                    this.handleCloseMenu()
                }
            });
        }
    }

    async handleProcessResume() {
        let {dialogStatus} = this.state
        if (dialogStatus.type == 'topic') {
            await hideTopic({topicId: dialogStatus.item.id, status: 'Y'})
            await this.initData('topic')
        }
        if (dialogStatus.type == 'channel') {
            await hideChannel({channelId: dialogStatus.item.id, status: 'Y', tagId: "0"})
            await this.initData('channel')
        }
        if (dialogStatus.type == 'newCamp') {
            await hideNewCamp({id: dialogStatus.item.id, status: 'Y', liveId: this.liveId})
            await this.initData('newCamp')
        }
        if (dialogStatus.type == 'camp') {
            await hideCamp({campId: dialogStatus.item.campId, displayStatus: 'Y'})
            await this.initData('camp')
        }
    }

    async handleProcessDelete() {
        let {dialogStatus} = this.state
        if (dialogStatus.type == 'topic') {
            await deleteTopic({topicId: dialogStatus.item.id}).then(res => {
                if (res.state.code != 0) {
                    window.toast(res.state.msg);
                }
            })
            await this.initData('topic')
        }
        if (dialogStatus.type == 'channel') {
            await deleteChannel({channelId: dialogStatus.item.id}).then(res => {
                if (res.state.code != 0) {
                    window.toast(res.state.msg);
                }
            })
            await this.initData('channel')
        }
        if (dialogStatus.type == 'newCamp') {
            await deleteNewCamp({id: dialogStatus.item.id, liveId: this.liveId}).then(res => {
                if (res.state.code != 0) {
                    window.toast(res.state.msg);
                }
            })
            await this.initData('newCamp')
        }
        if (dialogStatus.type == 'camp') {
            await deleteCamp({campId: dialogStatus.item.campId}).then(res => {
                if (res.state.code != 0) {
                    window.toast(res.state.msg);
                }
            }) 
            await this.initData('camp')
        }
    }

    async handleProcessEndTopic() {
        let {dialogStatus} = this.state
        await endTopic({topicId: dialogStatus.item.id}).then(res => {
            if (res.state.code != 0) {
                window.toast(res.state.msg);
            }
        })
        await this.initData('topic')
    }

    render() {
        let {currentTab, dialogStatus} = this.state
        const qlaTab = {
            1: 'topic',
            2: 'channel',
            3: 'train',
            4: 'camp'
        }
        const qlaObj = {
            'topic': 'topic',
            'channel': 'channel',
            'newCamp': 'train',
            'camp': 'camp'
        }
        return (
            <Page title="回收站" className="check-in-recycle-container on-log">
                <div className="top-menu">
                    {
                        menuArr.map((item: any, index: number) => {
                            return (
                                <div className={`item ${item.id == currentTab ? ' cur' : ''}`}
                                     onClick={() => this.handleClickTab(item)}
                                     data-log-region={`recycle-${qlaTab[item.id]}-btn`}
                                     key={'tab-item' + index}>{item.name}</div>
                            )
                        })
                    }
                </div>
                <div
                    className={`recycle-list-container co-scroll-to-load`}
                >
                    {this.state.currentTab == 1 ?
                        this.state.topicList.length ?
                            this.state.topicList.map((item: any, index: number) => {
                                return (
                                    <div className="course-item" key={'course-item' + index}>
                                        <div className="banner">
                                            <img className="image"
                                                 src={item.backgroundUrl + '?x-oss-process=image/resize,m_fill,limit_0,w_240,h_148'}/>
                                            <p className="studyNum">{item.browseNum}次学习</p>
                                        </div>
                                        <div className="main">
                                            <div className="title"><span className="elli-text">{item.topic}</span>
                                            </div>
                                            <div className="bottom">
                                                <div>
                                                <span
                                                    className="smallTip">{formatDate(item.startTime, "MM月dd日 hh:mm")}</span>
                                                    <span
                                                        className="money">{item.type === 'encrypt' ? '加密' : item.money <= 0 ? '免费' : `￥${formatMoney(item.money)}`}</span>
                                                </div>
                                                <div className="control"
                                                     onClick={() => this.handleOpenMenu('topic', item, index)}>
                                                         <img src={moreIcon} alt=""/>
                                                     </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <EmptyPage/>
                        :
                        null
                    }

                    {this.state.currentTab == 2 ?
                        this.state.channelList.length ?
                            this.state.channelList.map((item: any, index: number) => {
                                return (
                                    <div className="course-item" key={'course-item' + index}>
                                        <div className="banner">
                                            <img className="image"
                                                 src={item.headImage + '?x-oss-process=image/resize,m_fill,limit_0,w_240,h_148'}/>
                                            <p className="studyNum">{item.learningNum}次学习</p>
                                        </div>
                                        <div className="main">
                                            <div className="title"><span className="elli-text">{item.name}</span>
                                            </div>
                                            <div className="bottom">
                                                <div>
                                                    <span className="smallTip">已开课{item.topicCount}节</span>
                                                    <span
                                                        className="money">{item.chargeConfigs[0].amount <= 0 ? '免费' : `￥${formatMoney(item.chargeConfigs[0].amount, 1)}`}</span>
                                                </div>
                                                <div className="control"
                                                     onClick={() => this.handleOpenMenu('channel', item, index)}>
                                                         <img src={moreIcon} alt=""/>
                                                     </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <EmptyPage/>
                        :
                        null
                    }

                    {this.state.currentTab == 3 ?
                        this.state.newCampList.length ?
                            this.state.newCampList.map((item: any, index: number) => {
                                return (
                                    <div className="course-item train" key={'course-item' + index}>
                                        <div className="banner">
                                            <img className="image"
                                                 src={item.headImage + '?x-oss-process=image/resize,m_fill,limit_0,w_240,h_148'}/>
                                            {/*<p className="studyNum">次学习</p>*/}
                                        </div>
                                        <div className="main">
                                            <div className="title"><span className="elli-text">{item.name}</span>
                                            </div>
                                            <div className="bottom">
                                                <div>
                                                    <span className="smallTip">共{item.periodCount}期</span>
                                                    {/*<span className="money">{item.price <= 0 ? '免费' : `￥${formatMoney(item.price)}`}</span>*/}
                                                </div>
                                                <div className="control"
                                                     onClick={() => this.handleOpenMenu('newCamp', item, index)}>
                                                         <img src={moreIcon} alt=""/>
                                                     </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <EmptyPage/>
                        :
                        null
                    }

                    {this.state.currentTab == 4 ?
                        this.state.campList.length ?
                            this.state.campList.map((item: any, index: number) => {
                                return (
                                    <div className="course-item" key={'course-item' + index}>
                                        <div className="banner">
                                            <img className="image"
                                                 src={item.headImage + '?x-oss-process=image/resize,m_fill,limit_0,w_240,h_148'}/>
                                            <p className="studyNum">{item.authNum}人参与</p>
                                        </div>
                                        <div className="main">
                                            <div className="title"><span className="elli-text">{item.name}</span>
                                            </div>
                                            <div className="bottom">
                                                <div>
                                                    <span className="smallTip">{item.allAffairCount}次打卡</span>
                                                    <span
                                                        className="money">{item.price <= 0 ? '免费' : `￥${formatMoney(item.price, 1)}`}</span>
                                                </div>
                                                <div className="control"
                                                     onClick={() => this.handleOpenMenu('camp', item, index)}>
                                                         <img src={moreIcon} alt=""/>
                                                     </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <EmptyPage/>
                        :
                        null
                    }
                </div>


                <BottomDialog
                    className="recycle-bottom-dialog"
                    show={this.state.showMenuDialog}
                    theme={'list'}
                    close={true}
                    onClose={this.closeBottomMenu}
                    onItemClick={this.onItemClick}

                    items={
                        [
                            {
                                key: 'show',
                                content: '取消隐藏',
                                show: true,
                                region: `recycle-${qlaObj[dialogStatus.type]}-cancelhidden`,
                                pos: 0
                            },
                            {
                                key: 'delete',
                                content: '删除',
                                show: dialogStatus.type != 'topic' ? true : dialogStatus.item.status == 'ended',
                                theme: 'danger',
                                region: `recycle-${qlaObj[dialogStatus.type]}-delete`,
                                pos: 1
                            },
                            {
                                key: 'finish',
                                content: '结束直播',
                                show: dialogStatus.type == 'topic' && dialogStatus.item.status == 'beginning',
                                theme: 'danger',
                                region: 'single-lessons-list-option-end',
                                pos: 1
                            }
                        ]
                    }
                >

                </BottomDialog>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({});

const mapActionToProps = {}

export default connect(mapStateToProps, mapActionToProps)(Recycle);
