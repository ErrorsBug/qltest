const isNode = typeof window == 'undefined';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators'

import Page from 'components/page'
import Confirm from 'components/dialog/confirm'
import { stringLengthValid, sortBy, locationTo } from 'components/util'

import FunctionMenus from './components/function-menu'
import PageMenus from './components/page-menu'

import {
    fetchPageConfig,
    savePageConfig,

    fetchLiveExtend,
    saveUserDefined,
    fetchIsAdminFlag,

    updateFunctionMenus,
    updatePageMenus,
} from 'studio_actions/live-studio'

import { setIsLiveAdmin } from 'studio_actions/common';
import { request } from 'common_actions/common';

import {bindAfterSave} from './after-decorator'

export const LIVE_CUSTOM = 'LIVE_CUSTOM'

const BASE_ADMIN_FUNCS = ["course_table", "vip", "whisper_question", "introduce"];

@autobind
class Custom extends Component {

    state = {
        /* 主页名字 */
        title: '',

        /* 功能开关状态 */
        functionMenus: [],

        /* 页面排版和重命名 */
        pageMenus: [],

        activeEditIndex: null,

        editInputValue: '',
    }

    async componentDidMount() {
        await this.updateMenu(this.getCustomMenu)
        
        // this.checkSession()
        this.unregisterLeaveHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    }

    routerWillLeave(target) {
        window.simpleDialog({
            msg: '确定放弃本次修改?',
            onConfirm: () => {
                this.unregisterLeaveHook = this.props.router.setRouteLeaveHook(this.props.route, ()=>{return true});
                this.props.router.push(target.pathname)
            }
        })

        return false
    }

    get customData() {
        let { title = '', functionMenus, pageMenus } = this.state
        functionMenus = functionMenus.map((item, index) => {
            const { code, name, isShow } = item
            return { code, name, isShow }
        })
        pageMenus = pageMenus.map((item, index) => {
            const { itemCode, itemName } = item
            return { itemCode, itemName, sort: index + 1 }
        })
        return { liveId: this.liveId, title: title && title.trim(), functionMenus, pageMenus }
    }

    get liveId() {
        return this.props.params.liveId
    }

    async updateMenu(done) {
        const [pageConfig, extend] = await Promise.all([
            this.props.fetchPageConfig({ liveId: this.liveId }),
            this.props.fetchLiveExtend({liveId:this.liveId}),
        ])
        let config = pageConfig.data.config;
        // 如果是非专业版，过滤掉非基础功能
        // let menus = this.props.isLiveAdmin === "Y" ? pageConfig.data.config.liveFunction.functions : pageConfig.data.config.liveFunction.functions.filter(item => BASE_ADMIN_FUNCS.includes(item.code));
        this.setState({
            functionMenus: pageConfig.data.config.liveFunction.functions,
            pageMenus: [{ ...config.feed, type:'feed'}, {...config.topic, type:'topic'}, {...config.channel, type:'channel'}, {...config.camp, type:'camp'},{...config.community, type: 'community'}, {...config.training, type:'training'}, {...config.shortKnowledge, type:'shortKnowledge'}].sort(sortBy('sort',true)),
            title: pageConfig.data.config.info.pageTitle,
        }, done);
    }

    async getCustomMenu() {
        const res = await request.post({
            url: '/api/wechat/transfer/h5/live/selfDefine/modules/list',
            method: 'POST',
            body: {
                liveId: this.liveId
            }
        });
        if(res.state.code === 0) {
            // 如果发现 不存在与functionMenu中的menu， 添加放到functionMenu列表，默认不显示
            let arr = [];
            let curLength = this.state.functionMenus.length;
            let list = res.data.config && res.data.config.adminFunctionConfigDtoList;
            if(list) {
                list.forEach(dto => {
                    if(!this.state.functionMenus.find(item => item.code == dto.id)) {
                        arr.push({
                            code: dto.id,
                            icon: dto.icon,
                            name: dto.title,
                            isShow: 'N',
                            sort: curLength + 1
                        });
                        curLength++;
                    }
                });
            }
            if(arr.length > 0) {
                this.setState({
                    functionMenus: [...this.state.functionMenus, ...arr]
                });
            }
        }
    }

    /* 检查页面session是否有保存的数据，有则更新到视图 */
    checkSession() {
        this.updateMenu()

        var saves = window.sessionStorage.getItem(LIVE_CUSTOM)
        if (saves) { 
            saves = JSON.parse(saves)
        } else {
            this.updateMenu()
            return
        }
        if ( saves.liveId === this.liveId) {
            const { title, functionMenus, pageMenus } = saves
            this.setState({ title, functionMenus, pageMenus })
            return
        }

        this.updateMenu()
    }

    /* 保存当前修改内容到sessionStorage */
    saveSession() {
        window.sessionStorage &&
            window.sessionStorage.setItem(LIVE_CUSTOM, JSON.stringify(this.customData))
    }

    /* 清除session中保存的内容 */
    clearSession() {
        window.sessionStorage &&
            window.sessionStorage.clear(LIVE_CUSTOM)
    }

    @bindAfterSave
    /* 修改title事件 */
    async onTitleChange(e) {
        await this.setState({ title: e.target.value })
    }

    @bindAfterSave
    /* switch改变状态事件 */
    async onSwitchesChange(code) {
        const { functionMenus } = this.state;
        const target = functionMenus.find(item => item.code == code);
        if(!target) return;
        let selectedItem = functionMenus.filter(item => item.isShow == 'Y');

        if (selectedItem.length >= 5 && target.isShow === 'N') {
            window.toast('最多显示5个');
            return false;
        }
        target.isShow = target.isShow === 'Y' ? 'N' : 'Y'
    

        await this.setState({ functionMenus }, () => console.log('MENU: ',functionMenus))
    }

    /**
     * 板块排序事件
     *
     * @param {number} index 操作序号
     * @param {Boolean} isUp 上移还是下移
     * @memberof Custom
     */
    @bindAfterSave
    async onOrderChange(index, isUp) {
        if(this.props.isLiveAdmin === "N") return;
        let { pageMenus } = this.state

        const swapIndex = isUp ? index - 1 : index + 1
        let temp = pageMenus[index]
        pageMenus[index] = pageMenus[swapIndex]
        pageMenus[swapIndex] = temp

        await this.setState({
            pageMenus,
        })
    }

    onCustomClick() {
        window.simpleDialog({
            title: '确定保存本次修改?',
            msg: '确定后，您本次的修改即生效，是否确定应用本次修改？',
            confirmText: '确定',
            cancelText: '我再看看',
            onConfirm: this.onCustomSave,
        })
    }

    /**
     * 保存修改
     * 1.判断输入合法和功能入口数量
     * 2.请求接口保存
     * 3.1.[保存成功] 清除session并重置路由跳转钩子方法
     * 3.2.[保存失败] 提示错误信息
     * 4.提示成功并延时跳转
     *
     * @memberof Custom
     */
    async onCustomSave() {
        const title = this.state.title && this.state.title.trim()
        if (title && !stringLengthValid(title,30,1,'首页名称')) {
            return
        }

        // 直播间信息
        let pageInfoData = {
            isShow: 'Y',
            name: 'info',
            pageTitle: title,
        };
        // 模块数据
        let pageFunctionData = {
            isShow: 'Y',
            name: 'liveFunction',
            functions:this.state.functionMenus
        };
        
        // 排序数据
        let pageLayoutData = this.state.pageMenus.reduce((pre, cur, index) => {
            return {
                ...pre,
                [cur.type]: {
                    sort: index,
                    name:cur.name
                }
            }
        },{});

        let result = await this.props.savePageConfig({
            liveId: this.liveId,
            info:pageInfoData,
            liveFunction:pageFunctionData,
            ...pageLayoutData,
        })
        if (result.state && result.state.code === 0) {
            this.clearSession()
            window.toast('保存成功')
            setTimeout(() => {
                location.href = `/wechat/page/live/${this.liveId}`
            }, 1000);
        } else if(result.state) {
            window.toast(result.state.msg)
        }
    }
    
    onEditClick(index, name) {
        if(this.props.isLiveAdmin === "N") return ;
        this.refs.editModal.show()
        this.setState({
            activeEditIndex: index,
            editInputValue: name,
        })
    }

    onEditInputChange(e) {
        this.setState({
            editInputValue: e.target.value,
        })
    }

    /* 编辑名称弹窗点击确定按钮 */
    onEditModalConfirm(type) {
        /* 清空输入框 */
        const clearInput = () => {
            this.setState({ editInputValue: '' })
        }

        /* 隐藏弹窗 */
        const hideModal = () => {
            this.refs.editModal.hide()
        }

        /* 更新pageMenu值 */
        const updatePageMenuName = (val) => {
            let { pageMenus, activeEditIndex } = this.state
            pageMenus[activeEditIndex].name = val

            this.setState({ pageMenus })
        }

        if (type === 'confirm') {
            let val = this.state.editInputValue && this.state.editInputValue.trim()

            if (stringLengthValid(val,10,1)) {
                updatePageMenuName(val)
                clearInput()
                hideModal()
            }
        }

        if (type === 'cancel') {
            clearInput()
        }
    }

    render() {
        const { functionMenus, pageMenus } = this.state

        return <Page title={'自定义直播间'} >
            <div className="live-studio-custom-page">
                <div className='live-studio-custom'>

                    <section className='option-bar'>
                        <label htmlFor="live-name">直播间名称：</label>
                        <input
                            type="text"
                            name='live-name'
                            disabled={this.props.isLiveAdmin === "N"}
                            placeholder='请设置你的首页链接名字'
                            onChange={this.onTitleChange}
                            value={this.state.title}
                        />
                        {
                            this.props.isLiveAdmin === "N" &&
                            <div className="base-warning" onClick={() => locationTo(`/topic/live-studio-intro?liveId=${this.liveId}`)}>专业版可编辑，立即升级<i className="arrow-icon"><img src={require('./img/red-arrow.png')} alt=""/></i></div>
                        }
                    </section>

                    <section className='option-bar right'>
                        <span>编辑轮播图</span>
                        <a onClick={() => {locationTo(`/wechat/page/live/banner/${this.liveId}`)}} href="javascript:void(0)"></a>
                    </section>

                    {/* 功能菜单 */}
                    <FunctionMenus
                        switches={
                            this.props.isLiveAdmin === "Y" ? 
                            this.state.functionMenus 
                            : 
                            this.state.functionMenus.filter(item => BASE_ADMIN_FUNCS.includes(item.code))
                        }
                        onSwitchesChange={this.onSwitchesChange}
                        isLiveAdmin={this.props.isLiveAdmin}
                    />

                    {
                        this.props.isLiveAdmin === "N" ?
                        <p className="base-tip">
                            专业版可添加更多功能，<a href={`/topic/live-studio-intro?liveId=${this.liveId}`}>立即升级</a>
                        </p>:
                        <p className="base-tip">
                            登录“电脑版-千聊讲师管理后台”，创建课程专辑<br /><a href="https://mp.weixin.qq.com/s/0nLM_tmqj5P9PQ0pr7bLhg">查看教程<i className="arrow-icon"><img src={require('./img/red-arrow.png')} alt=""/></i></a>
                        </p>
                    }

                    {/* 页面排版菜单 */}
                    <PageMenus
                        isLiveAdmin={this.props.isLiveAdmin}
                        menu={this.state.pageMenus}
                        onOrderChange={this.onOrderChange}
                        disabled={this.props.isLiveAdmin === "N"}
                        onEditClick={this.onEditClick}
                        liveId={this.liveId}
                    />

                    <div className="white-space"></div>

                    <footer className="save-custom" onClick={this.onCustomClick}>
                        <div className="btn">
                            保存修改
                        </div>
                    </footer>

                </div>
                <Confirm
                    title='输入名称'
                    buttons='cancel-confirm'
                    onBtnClick={this.onEditModalConfirm}
                    buttonTheme='line'
                    titleTheme='white'
                    ref='editModal'
                >
                    <input
                        type="text"
                        placeholder='请输入内容'
                        onChange={this.onEditInputChange}
                        value={this.state.editInputValue}
                        className='edit-input'
                        onBlur={() => {window.scrollTo(0, 0)}}
                    />
                </Confirm>
            </div>      
        </Page>

    }
}

function mstp(state) {
    const { functionMenus, pageMenus } = state.liveStudio
    return {
        functionMenus,
        pageMenus,
        liveInfo: state.live.liveInfo,
        isLiveAdmin: state.common.isLiveAdmin
    }
}

const matp = {
    fetchPageConfig,
    savePageConfig,

    fetchLiveExtend,
    saveUserDefined,
    fetchIsAdminFlag,

    updateFunctionMenus,
    updatePageMenus,
    setIsLiveAdmin,
}

export default connect(mstp, matp)(Custom)
