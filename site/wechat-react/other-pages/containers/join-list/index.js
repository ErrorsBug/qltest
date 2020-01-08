/*
 * 引入框架和库方法
 *
 * [react + redux] 页面框架和数据管理
 * [core-decorators] 提供this绑定的装饰器方法
 * */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { autobind } from 'core-decorators';
import { Confirm } from 'components/dialog';

/*
 * 引入自定义组件
 *
 * [通用组件]
 * [页面组件]
 * */
import ScrollToLoad from 'components/scrollToLoad';
import Actionsheet from 'components/dialog/bottom-dialog';
import Page from 'components/page';
import { formatDate, locationTo, imgUrlFormat } from 'components/util';

import ManageList from './components/manage-list';
import JoinList from './components/join-list';
import {
    TOPIC,
    CHANNEL,
    VIP,
    titleMap,
    genKickConfirmContent,
    genBlackConfirmContent,
    CAMP,
    CUSTOMVIP,
} from './methods'

/*
 * 引入action
 *
 * [update] 更新reducer数据
 * [clear] 清除reducer数据
 * [fetch] 通过请求获取数据
 * [perform] 通过请求执行操作
 */
import {
    updateList,
    updatePage,
    updateAuthCount,

    clearList,

    fetchTopicAuthCount,
    fetchChannelAuthCount,
    fetchVipAuthCount,
    fetchTopicAuthList,
    fetchChannelAuthList,
    fetchVipAuthList,
    fetchCampAuthCount,
    fetchCampAuthList,
    fetchCustomVipAuthCount,
    fetchCustomVipAuthList,

    performKick,
    performVipKick,
    performCampKick,
    performBlack,
    kickOut,
    goBlack,

    isRelayChannel,
} from '../../actions/join-list'
import { fetchUserPower } from '../../actions/common'

@autobind
class PageJoinList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchWord: '',
            inputFocusing: false,
            showActionsheet: false,
            activeItem: null,
            noMore: false,
            noneOne: false,
            confirmContent: '',
            confirmTop: '',
            qrcodeUrl: '',
            isRelayChannel: false,
        }
        /* 存放一些不会变化的数据*/
        this.constant = {
            type: props.params.type.toUpperCase(),
            id: props.location.query.id,
        }
    }


    /* 根据类型区分页面标题*/
    get pageTitle() {
        return titleMap[this.constant.type]
    }

    /* 根据类型区分获取报名人数方法 */
    get fetchCount() {
        switch (this.constant.type) {
            case TOPIC:
                return this.props.fetchTopicAuthCount({ topicId: this.constant.id })
            case CHANNEL:
                return this.props.fetchChannelAuthCount({ channelId: this.constant.id })
            case VIP:
                return this.props.fetchVipAuthCount({ liveId: this.constant.id });
            case CAMP: 
                return this.props.fetchCampAuthCount({campId: this.constant.id});
            case CUSTOMVIP: 
                return this.props.fetchCustomVipAuthCount({cVipId:this.props.location.query.cvid, searchName: this.state.searchWord || null });
            
            default:
                break;
        }
    }

    /* 根据类型区分获取报名列表方法 */
    get fetchList() {
        switch (this.constant.type) {
            case TOPIC:
                return this.props.fetchTopicAuthList({ topicId: this.constant.id, searchName: this.state.searchWord || null })
            case CHANNEL:
                return this.props.fetchChannelAuthList({ channelId: this.constant.id, searchName: this.state.searchWord || null })
            case VIP:
                return this.props.fetchVipAuthList({ liveId: this.constant.id, searchName: this.state.searchWord || null })
            case CAMP: 
                return this.props.fetchCampAuthList({ campId: this.constant.id, searchName: this.state.searchWord || null })
            case CUSTOMVIP: 
                return this.props.fetchCustomVipAuthList({cVipId:this.props.location.query.cvid, status:'Y', searchName: this.state.searchWord || null });
            default:
                break;
        }
    }

    /*
     * 根据类型区分获取用户权限的参数
     * 这里获取用户权限，主要有两个作用：
     * 1. 为了判断用户是否有权限查看这个页面，没有的话就跳转到个人中心，
     *    服务端渲染也需要做对应权限判断
     * 2. 为了获取当前话题或频道对应的liveId，在拉黑操作中需要用到，
     *    虽然在获取话题或频道信息接口中有返回，但代价太高了，并不需要
     *    那么多信息。
     *  */
    get powerParams() {
        switch (this.constant.type) {
            case TOPIC:
                return { topicId: this.constant.id }
            case CHANNEL:
                return { channelId: this.constant.id }
            case VIP:
                return { liveId: this.constant.id }
            case CAMP: 
                return { campId: this.constant.id}
            default:
                break;
        }
    }

    /**
     * 检查是否是转载的系列课
     */
    async checkIsRelayChannel() {
        const type = this.constant.type;
        if (type === CHANNEL || type === TOPIC) {
            const businessId = this.constant.id;
            const result = await this.props.isRelayChannel(businessId, type.toLowerCase());
            if (result.state.code === 0 && result.data.status === 'Y') {
                this.setState({
                    isRelayChannel: true,
                })
            }
        } else {
            return;
        }
    }

    componentDidMount() {
        /* 判断到没有获取权限则进行获取 */
        if (!this.props.power.liveId) {
            this.doFetchPower()
        }

        this.checkIsRelayChannel();

        /* 判断到列表为空或人数为null，说明没有经过服务端渲染，开始前端渲染 */
        const noneList = !this.props.list.length && this.props.page === 1
        const noneCount = this.props.count === null

        if (noneList || noneCount) {
            Promise.all([
                this.doFetchList(),
                this.doFetchCount(),
            ])
        }
    }

    componentWillUnmount() {
        /* 离开页面时清空列表 */
        this.props.clearList()
    }

    onConfirmDialog(tag) {
        
        if (tag == 'confirm') {
            this.successDialog && this.successDialog();
            this.refs.dialogConfirm.hide();
        } else {
            this.cancelDialog && this.cancelDialog();
        }

        this.successDialog = null;
        this.cancelDialog = null;

    }

    /* 获取用户权限操作 */
    async doFetchPower() {
        try {
            const result = await this.props.fetchUserPower(this.powerParams)
            // if (!result.data.powerEntity.allowMGLive) {
            //     /* 没有权限就重定向到个人中心页 */
            //     locationTo('/wechat/page/mine')
            // }
        } catch (error) {
            console.error(error)
        }
    }

    /* 获取列表数据操作 */
    async doFetchList(next) {
        try {
            const result = await this.fetchList
            if (result && result.state && result.state.code === 0) {
                const list = this.constant.type === CAMP ? result.data.userList :this.constant.type === CUSTOMVIP ? result.data.authList :result.data.list
                this.props.updateList(list)
                this.props.updatePage(this.props.page + 1)
                if (list.length < this.props.size) {
                    this.setState({
                        noMore: true,
                        noneOne: this.props.list.length === 0,
                    })
                }
            }
            next && next()
        } catch (error) {
            console.error(error)
        }
    }

    /* 获取报名人数操作 */
    async doFetchCount() {
        try {
            const result = await this.fetchCount
            if (result && result.state && result.state.code === 0) {
                const count = this.constant.type === CAMP ? result.data.authNum : result.data.count
                this.props.updateAuthCount(count)
            }
        } catch (error) {
            console.error(error)
        }
    }

    /* 搜索框触发焦点事件*/
    onSearchFocus() {
        this.setState({
            inputFocusing: true,
        })
    }

    /* 搜索框失去焦点事件*/
    onSearchBlur() {
        if (this.state.searchWord) {
            return
        }
        this.setState({
            inputFocusing: false,
        })
    }

    /* 搜索框文字内容改变*/
    onSearchChange(e) {
        this.setState({
            searchWord: e.target.value,
        })
    }

    /* 搜索词键盘输入事件*/
    onSearchKeyup(e) {
        if (e.keyCode === 13) {
            this.doSearch()
        }
    }

    /* 点击清除按钮事件 */
    onClearInputClick() {
        /* 防止焦点转移到button*/
        this.refs.searchInput.focus()
        this.setState({
            searchWord: ''
        })
    }

    /* 点击搜索按钮事件*/
    onSearchButtonClick(e) {
        /* 防止焦点转移到button*/
        this.refs.searchInput.focus()
        /* 搜索词为空则弹出提示*/
        if (!this.state.searchWord) {
            window.toast('请输入关键词')
            return
        }
        this.doSearch()
    }

    /* 进行搜索*/
    doSearch() {
        this.setState({
            searchWord: this.refs.searchInput.value,
        }, () => {
            this.props.clearList();
            this.props.updatePage(1)
            this.doFetchList();
        })
    }

    /* 点击管理按钮事件*/
    async onListManageClick(id) {
        const activeItem = this.props.list.find((item, index) => {
            return item.id === id
        })
        /* 设置好activeItem后才显示底部菜单栏 */
        await this.setState({ activeItem })
        this.setState({ showActionsheet: true })
    }

    /* actionsheet关闭事件*/
    onActionsheetClose() {
        this.setState({
            showActionsheet: false,
        })
    }

    /* 踢出按钮点击事件 */
    onKickClick() {
        /* 弹窗确认是否踢出 */
        window.confirmDialog(
            genKickConfirmContent(this.state.activeItem.userName, this.state.activeItem.kickOutStatus),
            this.onConfirmKick,
            /* 为什么onCancel是必须的呢？找机会把它做掉吧 */
            () => { },
        )
        // this.setState({
        //     confirmContent: genKickConfirmContent(this.state.activeItem.userName, this.state.activeItem.kickOutStatus)
        // })
        // this.refs.dialogConfirm.show();
        // this.successDialog = this.onConfirmKick;
        // this.cancelDialog = () => {}
    }

    /* 加入黑名单按钮点击事件 */
    onBlackClick() {
        /* 弹窗确认是否加入黑名单 */
        window.confirmDialog(
            genBlackConfirmContent(this.state.activeItem.userName, this.state.activeItem.blackListStatus),
            this.onConfirmBlack,
            () => { },
        )
        // this.setState({
        //     confirmContent: genBlackConfirmContent(this.state.activeItem.userName, this.state.activeItem.blackListStatus)
        // })
        // this.refs.dialogConfirm.show();
        // this.successDialog = this.onConfirmBlack;
        // this.cancelDialog = () => {};
    }

    /* 确认踢出操作 */
    async onConfirmKick() {
        let type = this.constant.type.toLowerCase();
        let params = {};
        //vip踢出的接口参数
        if (type === 'vip') {
            params = {
                id: this.state.activeItem.id,
                status: this.state.activeItem.kickOutStatus === 'Y' ? 'Y' : 'D',
                userId: this.state.activeItem.userId
            }
        } else if(type === 'customvip') {
            params = {
                liveId: this.constant.id,
                id: this.state.activeItem.id,
                targetUserId: this.state.activeItem.userId,
                status: this.state.activeItem.kickOutStatus === 'Y' ? 'Y' : 'D',
            }
        } else if(type === 'camp') {
            params = {
                campId: this.constant.id,
                targetUserId: this.state.activeItem.userId,
                status: this.state.activeItem.kickOutStatus === 'Y' ? 'Y' : 'D',
            }
        } else {
            //非vip的踢出的接口参数
            params = {
                businessId: this.constant.id,
                type: this.constant.type.toLowerCase(),
                status: this.state.activeItem.kickOutStatus === 'Y' ? 'N' : 'Y',
                targetUserId: this.state.activeItem.userId,
                isDelete: 'N',
            }
        }

        try {
            let result ;
            //如果是vip的调下面的接口
            if (type === 'vip' || type === 'customvip') {
                result = await this.props.performVipKick(params);
            } else if(type === 'camp') {

                result = await this.props.performCampKick(params)
            
            } else {
                //非vip调下面的接口
                result = await this.props.performKick(params)
            }
            
            if (result.state.code == 0) {
                let newStatus = params.status;
                if (type === 'vip' || type === 'customvip' || type === 'camp') {
                    newStatus = params.status === 'Y' ? 'N': 'Y';
                }

                this.props.kickOut({
                    targetUserId: params.targetUserId || params.userId,
                    status: newStatus,
                });
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            window.toast('踢出操作失败!')
            console.error(error)
        } finally {
            this.setState({ showActionsheet: false })
        }
    }

    /* 确认拉黑操作 */
    async onConfirmBlack() {
        const params = {
            liveId: this.props.power.liveId,
            targetUserId: this.state.activeItem.userId,
            status: this.state.activeItem.blackListStatus === 'Y' ? 'N' : 'Y',
        }

        try {
            const result = await this.props.performBlack(params)

            if (result.state.code == 0) {
                this.props.goBlack({
                    targetUserId: params.targetUserId,
                    liveId: params.liveId,
                    status: params.status,
                });
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            window.toast('拉黑操作失败!')
            console.error(error)
        } finally {
            this.setState({ showActionsheet: false })
        }
    }

    render() {
        return (
            <Page title={this.pageTitle} cs='page-join-list'>
                <div className="join-list-container">
                    {/* 顶部header和输入框 */}
                    <header className={this.state.inputFocusing ? 'focusing' : null}>
                        <div className={`input-container ${this.state.inputFocusing ? 'focusing' : ''}`}>
                            <input
                                ref='searchInput'
                                type="text"
                                onFocus={this.onSearchFocus}
                                onBlur={this.onSearchBlur}
                                value={this.state.searchWord}
                                onChange={this.onSearchChange}
                                onKeyUp={this.onSearchKeyup}
                            />
                            {
                                this.state.searchWord.length > 0 &&
                                <span
                                    className='clear-input'
                                    onClick={this.onClearInputClick}
                                >
                                </span>
                            }
                        </div>
                        <button onClick={this.onSearchButtonClick}>搜索</button>
                    </header>

                    {/* 滚动加载列表 */}
                    <ScrollToLoad
                        className='join-list-scroll'
                        toBottomHeight={1000}
                        loadNext={this.doFetchList}
                        noneOne={this.state.noneOne}
                        noMore={this.state.noMore}
                    >
                        <section className='members'>
                            {
                                this.state.isRelayChannel ? <div className="members-tip">温馨提示：由于该课为转载课，您只能查看和管理通过您的渠道报名的学员。</div> : null
                            }
                            <div className="members-count">实际报名人数共{this.props.count}人</div>
                        </section>
                        <JoinList
                            type={this.constant.type}
                            list={this.props.list}
                            onListManageClick={this.onListManageClick}
                        />
                    </ScrollToLoad>

                    {/* 底部弹出菜单 */}
                    <Actionsheet
                        show={this.state.showActionsheet}
                        theme='empty'
                        className='join-list-actionsheet'
                        bghide={true}
                        close={true}
                        onClose={this.onActionsheetClose}
                    >
                        <ManageList
                            activeItem={this.state.activeItem}
                            onCancelClick={this.onActionsheetClose}
                            onKickClick={this.onKickClick}
                            onBlackClick={this.onBlackClick}
                        />
                    </Actionsheet>
                </div>
            </Page>
        )
    }
}

PageJoinList.propTypes = {
    list: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    count: PropTypes.number,
};

function mapStateToProps(state) {
    return {
        /* 列表相关 */
        list: state.joinList.list,
        page: state.joinList.page,
        size: state.joinList.size,
        /* 报名人数 */
        count: state.joinList.count,
        /* 用户权限 */
        power: state.common.power,
    };
}

const mapActionToProps = {
    updateList,
    updatePage,
    updateAuthCount,

    clearList,

    fetchTopicAuthCount,
    fetchChannelAuthCount,
    fetchVipAuthCount,
    fetchTopicAuthList,
    fetchChannelAuthList,
    fetchVipAuthList,
    fetchCampAuthCount,
    fetchCampAuthList,
    fetchUserPower,

    performKick,
    performVipKick,
    performCampKick,
    performBlack,
    kickOut,
    goBlack,

    isRelayChannel,
    fetchCustomVipAuthList,
    fetchCustomVipAuthCount
};

module.exports = connect(mapStateToProps, mapActionToProps)(PageJoinList)
