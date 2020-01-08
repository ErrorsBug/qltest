import React from "react";
import {connect} from 'react-redux';
import Page from 'components/page';
import { throttle } from "lodash";
import { limitScrollBoundary } from 'components/scroll-boundary-limit';

import {
    topicGuestList,
    deleteTopicTitle,
    setTopicTitle,
    historyGuestList,
    deleteHistoryRecord,
    setHistoryTitle,
    getLiveRole,
} from "../../actions/guest-list";

import ActionSheet from "./components/action-sheet";
import { getCookie } from "components/util";

/**
 * 旧页面 https://m.qlchat.com/live/invite/topicList/${liveId}/${topicId}.htm
 * 
 */

class GuestList extends React.PureComponent {

    state = {
        showConfirmDialog: false,
        showActionSheet: false,
        topicGuestList: [],
        historyGuestList: [],

    }

    get topicId () {
        return this.props.location.query.topicId
    }

    get liveId () {
        return this.props.location.query.liveId
    }

    componentDidMount () {
        this.getTopicGuestList();
        this.getHistoryGuestList();
        limitScrollBoundary(document.querySelector('.guest-page-container'));
        this.getLiveRole();
    }

    getLiveRole = async () => {
        let result = await this.props.getLiveRole(this.liveId);
        if (result.state.code == 0) {
            if (!result.data.role) {
                location.href = `/wechat/page/topic-intro?topicId=${this.topicId}&sourceNo=&fromOld=`;
            }
            this.liveRole = result.data.role;
        }
    }

    getTopicGuestList = async () => {
        let result = await this.props.topicGuestList(this.topicId, this.liveId);
        if (result.state.code == 0) {
            this.setState({
                topicGuestList: result.data.topicInviteList
            })
        } 
    }

    getHistoryGuestList = async () => {
        let result = await this.props.historyGuestList(this.topicId);
        if (result.state.code == 0) {
            this.setState({
                historyGuestList: result.data.historyList
            })
        }  
    }

    setTopicTitle = async (item) => {
        let result = await this.props.setTopicTitle(this.topicId, item.role, item.id, item.title);
        return result; 
    }

    deleteTitle = (item) => {
        if (item.period == 'history') {
            this.deleteHistoryRecord(item);
        } else {
            this.deleteTopicTitle(item);
        }
    }

    deleteTopicTitle = async (item) => {
        let result = await this.props.deleteTopicTitle(this.topicId, item.id);
        if (result.state.code == 0) {
            let {topicGuestList} = this.state;
            let list = topicGuestList.filter(i => {
                return i.userId !== item.userId
            })
            this.setState({
                topicGuestList: list
            })
        }
        return result;
    }

    setHistoryTitle = async (item) => {
        let result = await this.props.setHistoryTitle(this.topicId, item.id, item.role, item.title);
        return result;
    }

    deleteHistoryRecord = async (item) => {
        let result = await this.props.deleteHistoryRecord(this.topicId, item.id);
        if (result.state.code == 0) {
            let {historyGuestList} = this.state;
            let list = historyGuestList.filter(i => {
                return i.userId !== item.userId
            })
            this.setState({
                historyGuestList: list
            })
        }
        return result;
    }

    onScroll = throttle((e) => {
        let {historyGuestContainer} = this;
        let { top } = historyGuestContainer.getBoundingClientRect();
        let {historyGuest} = this;
        let guestTop = historyGuest.getBoundingClientRect().top;
        if (guestTop <= 0) {
            this.insertSticky('top');
        } else if (top >= window.innerHeight) {
            this.insertSticky('bottom');
        } else {
            let ele = document.querySelector('.sticky');
            if (ele) {
                this.guestListContainer.removeChild(ele);
                this.instance = null;
            }
        }
    },100)

    insertSticky = (position) => {
        let instance = document.querySelector('.sticky');
        if (instance) return;
        let ele = document.createElement('div');
        ele.className = 'list-header sticky '+ position;
        ele.innerText = '历史邀请嘉宾';
        this.guestListContainer.appendChild(ele);
    }

    onSet = (item) => {
        if (this.liveRole == 'manager' && item.liveRole == 'creater') {
            return window.toast('管理员不能设置创建者的身份！')
        }
        this.setState({
            showActionSheet: item
        })
    }

    setIdentity = (obj, title) => {
        obj.title = title;
        delete  obj.role;
        return obj;
    }

    updateIdentity = async (status) => {
        let obj = this.state.showActionSheet;
        obj = this.setIdentity(obj, status);
        if (obj.period == 'now') {
            let result = await this.setTopicTitle(obj);
            if (result.state.code == 0) {
                let {topicGuestList} = this.state;
                let list = topicGuestList.map(item => {
                    if (item.userId == obj.userId) {
                        item.title = status;
                    }
                    return item;
                })
                this.setState({
                    topicGuestList: list
                })
            } else {
                window.toast(result.state.msg);
            }
        } else {
            let result = await this.setHistoryTitle(obj);
            if (result.state.code == 0) {
                this.getTopicGuestList();
            } else {
                window.toast(result.state.msg);
            }
        }
    }

    deleteGuest = () => {
        let {showActionSheet} = this.state;
        this.setState({
            showActionSheet: false,
            showConfirmDialog: showActionSheet
        })
    }

    showDelete = () => {
        let { liveRole } = this;
        let userId = getCookie('userId');
        let current = this.state.showActionSheet;
        return !(current.userId == userId)
    }

    render () {
        return (
            <Page title="话题参与人" className="guest-page-container" onScroll={this.onScroll}>
                <div className="guest-list-container" ref={ref => {
                    this.guestListContainer = ref;
                }}>
                    <div className="list-header">
                        话题参与人
                    </div>
                    <div className="list-container" >
                    {
                        this.state.topicGuestList.map((item, idx) => {
                            return <ListItem key={item.id} {...item} onClick={this.onSet}/>
                        })
                    }
                    </div>
                    <div className="list-header" ref={ref => {
                        this.historyGuest = ref;
                    }}>
                        历史邀请嘉宾
                    </div>
                    <div className="list-contaner" ref={(ref) => {
                        this.historyGuestContainer = ref;
                    }}>
                    {
                        this.state.historyGuestList.map((item, idx) => {
                            return <HistoryListItem key={item.id} {...item} onClick={this.onSet} />
                        })
                    }
                    </div>
                    <img className="invite-guest" src={require('./img/invite-guest.png')} onClick={() => {
                        location.href = `/wechat/page/live-invitation?liveId=${this.liveId}&topicId=${this.topicId}`
                    }} />
                </div>
                
                {
                    this.state.showConfirmDialog ?
                    <ConfirmDialog
                        onClose={() => {
                            this.setState({
                                showConfirmDialog: false
                            })
                        }}
                        onConfirm={() => {
                            let {showConfirmDialog} = this.state;
                            this.deleteTitle(showConfirmDialog);
                            this.setState({
                                showConfirmDialog: false
                            })
                        }}
                    >
                        {`确定删除${this.state.showConfirmDialog.userName}吗？`}
                    </ConfirmDialog>: null
                }
                <ActionSheet
                    show={this.state.showActionSheet}
                    onClose={() => {
                        this.setState({
                            showActionSheet: false
                        })
                    }}
                    close={this.showDelete()}
                    closeText="删除嘉宾"
                    title={this.state.showActionSheet ? this.state.showActionSheet.userName : ' '}
                    changeStatus={this.updateIdentity}
                    hide={this.deleteGuest}
                >
                    
                </ActionSheet>
            </Page>
        )
    }
}

class ConfirmDialog extends React.PureComponent {
    render () {
        return (
            <div
                className={`confirm-dialog_EIORUQIER ${this.props.className}` }>
                <div className="mask" onClick={(e) => {
                    e.stopPropagation();
                    this.props.onClose();
                }}>
                    <div className="body" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <div className="sect">
                            {this.props.children}
                        </div>
                        <div className="bottom">
                            <div className="btn confirm" onClick={this.props.onConfirm}>
                                {this.props.confirmText || '确认'}
                            </div>
                            <div className="btn cancel" onClick={this.props.onClose}>
                                {this.props.cancelText || '取消'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class HistoryListItem extends React.PureComponent {

    onClick = () => {
        this.props.onClick({...this.props, period: 'history'});
    }

    render () {
        let { userHeadImage, userName } = this.props;
        return (
            <div className="list-item">
                <div className="info">
                    <img className="avatar" src={userHeadImage}/>
                    <div className="username">
                        {userName}
                    </div>
                </div>
                <div className="button">
                    <div className="btn" onClick={this.onClick}>
                        设置
                    </div>
                </div>
            </div>
        )
    }
}

function getStyleByTitle (title) {
    switch (title) {
        case '主讲人':
            return 'compere';
        case '主持人':
            return 'compere';
        case '特邀主持人':
            return 'compere';
        case '嘉宾':
            return 'guest';
        case '管理员':
            return 'admin';
    }
}

class ListItem extends React.PureComponent {

    onClick = () => {
        this.props.onClick({...this.props, period: 'now'});
    }

    getPicByTitle = (title) => {
        switch (title) {
            case '特邀主持人':
                return require('./img/teyaozhuchiren.png');
            case '主持人':
                return require('./img/zhuchiren.png');
            case '主讲人':
                return require('./img/zhujiangren.png');
            case '嘉宾':
                return require('./img/guest.png');
            case '管理员':
                return require('./img/guanliyuan.png');
        }
    }

    render () {
        let { userHeadImage, userName, title } = this.props;
        return (
            <div className="list-item">
                <div className="info">
                    <img className="avatar" src={userHeadImage}/>
                    <div className="username">
                        {userName}
                    </div>
                    <img className="user-identity" src={this.getPicByTitle(title)} />
                </div>
                <div className="button">
                    <div className="btn" onClick={this.onClick}>
                        设置
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        
    }
}

const mapActionToProps = {
    topicGuestList,
    deleteTopicTitle,
    setTopicTitle,
    historyGuestList,
    deleteHistoryRecord,
    setHistoryTitle,
    getLiveRole
}

module.exports = connect(mapStateToProps, mapActionToProps)(GuestList);