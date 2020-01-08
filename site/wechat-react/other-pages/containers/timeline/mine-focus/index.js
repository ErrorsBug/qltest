import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import TopTabBar from 'components/learn-everyday-top-tab-bar';
import { autobind } from 'core-decorators';
import { digitFormat } from '../../../../components/util'
import { locationTo, imgUrlFormat } from 'components/util'

import { BottomDialog } from 'components/dialog';
import EmptyPage from 'components/empty-page';

import {
    liveFocus,
    focusList,
    onekeyUpdateAlert
} from '../../../actions/timeline'

import {
    liveAlert
} from '../../../actions/live'

import {
    fetchAuthorityList,
} from '../../../actions/live'

@autobind
class MineFocusList extends Component {
    state = {
        noMore: false,
        page: 2,
        focusList : [],
        authorityList: [],
        showAdmin: false,
        // 是否展示一键屏蔽弹窗
        showShieldDialog: false,
        fs: 0,
        noOne: false,
        // 按钮是否是一键屏蔽
        shieldByOneKey: true,
    }

    data = {
        adminIndex: 0,
        adminId: 0,
        initialTouchX: 0,
        initialTouchY: 0,
        currentMoveId: '',
        currentMoveDom: null
    }

    async componentDidMount() {
        this.setState({
            fs: Number(document.querySelector('html').style.fontSize.split('px')[0]),
        })

        const authList = await this.props.fetchAuthorityList()
        if(Array.isArray(authList.data.dataList)){
            this.setState({authorityList: authList.data.dataList})
        }

        let focusList = []
        if(!this.props.myFocusLives || (this.props.myFocusLives && this.props.myFocusLives.length < 1) ) {
            let myFocusLives = await this.props.focusList(1)
            if( myFocusLives.length > 0 ) {
                myFocusLives.map((item) => {
                    focusList.push({
                        headUrl: item.logo,
                        name: item.name,
                        focusNum: item.fansNum,
                        focused: true,
                        id: item.id,
                        isAlert: item.isAlert,
                        move: false,
                    })
                })
            }else {
                this.setState({noOne: true})
            }
        }
        if(this.props.myFocusLives && this.props.myFocusLives.length > 0) {
            this.props.myFocusLives.map((item) => {
                focusList.push({
                    headUrl: item.logo,
                    name: item.name,
                    focusNum: item.fansNum,
                    focused: true,
                    id: item.id,
                    isAlert: item.isAlert,
                    move: false,
                })
            })
        }

        this.setState({
            focusList,
            noMore: focusList.length < 30,
            page: focusList.length == 30 ? 2 : 1
        })

    }
    
    focusHandle = async (idx, id) => {
        const focusResult = await this.props.liveFocus(id, this.state.focusList[idx].focused ? "N":"Y")

        console.log(focusResult);

        if (focusResult) {
            let focusList = [...this.state.focusList]
            focusList[idx].focused = focusResult.isFollow;
            focusList[idx].isAlert = focusResult.isAlert;
            if(!focusList[idx].focused) {
                focusList[idx].focusNum = focusList[idx].focusNum - 1
            } else {
                focusList[idx].focusNum = focusList[idx].focusNum + 1
            }
            
            this.setState({
                focusList
            })
        }
    }

    alertHandle = async (idx, id) => {
        const alertResult = await this.props.liveAlert(id, this.state.focusList[idx].isAlert ? "N":"Y")

        if (alertResult) {
            let focusList = [...this.state.focusList]
            focusList[idx].isAlert = alertResult.isAlert

            // 如果是订阅，将按钮置为一键屏蔽状态
            if(alertResult.isAlert){
                this.setState({shieldByOneKey: true})
            }
            this.setState({
                focusList
            })
        }
    }

    loadMoreHandle = async (next) => {

        let focusList = [...this.state.focusList]

        if (!this.state.noMoreTopic) {

            let myFocusLives = await this.props.focusList(this.state.page)

            if (myFocusLives.length > 0) {
                myFocusLives.map((item) => {
                    focusList.push({
                        headUrl: item.logo,
                        name: item.name,
                        focusNum: item.fansNum,
                        focused: true,
                        id: item.id,
                        isAlert: item.isAlert,
                        move: false,
                    })
                })
            }
            
            if(myFocusLives.length == 30) {
                this.setState({
                    page: this.state.page + 1,
                    focusList,
                })

            } else if(myFocusLives.length > 0 && myFocusLives.length < 30) {
                this.setState({
                    focusList,
                    noMore: true,
                })
            } else if(myFocusLives.length == 0){
                this.setState({
                    noMore: true,
                })
            }
        }

        if(typeof next === "function") {
            next()
        }
    }

    gotoLiveHandle = (liveId, move) => {
        if(move){
            return
        }
        locationTo("/wechat/page/live/" + liveId)
    }

    showAdminHandle = (id, idx, move) => {
        // 将上一次滑开的选项弹回去
        if(this.data.currentMoveDom){
            this.moveAnimation(false, this.data.currentMoveDom)
        }
        this.data.currentMoveId = id
        this.data.currentMoveDom = this[`moveDom${id}`]
        if(move){
            this.data.isDisableMoveEvent = true
            this.moveAnimation(false)
        } else {
            this.data.isDisableMoveEvent = true
            this.moveAnimation(true)
        }
    }

    clickFocusItem(id, move){
        if(!move){
            return
        }
        this.data.currentMoveId = id
        this.data.currentMoveDom = this[`moveDom${id}`]
        this.moveAnimation(false)
    }

    closeAdminHandle = () => {
        this.setState({
            showAdmin: false
        })
    }

    onAdminItemClick = (key) => {
        switch (key) {
            case "focus":
                this.focusHandle(this.data.adminIndex, this.data.adminId)
                break;
            case "alert": 
                this.alertHandle(this.data.adminIndex, this.data.adminId)
                break;
            default:
                break;
        }
    }

    // 更新滑动状态
    updateListMoveStatus(bol){
        let focusList = this.state.focusList
        let newList = focusList.map(item => {
            if(item.id == this.data.currentMoveId){
                return {
                    ...item,
                    move: bol
                }
            }else {return item}
        })
        this.setState({focusList: newList})
    }

    // 滑动touchstart事件
    touchStartHandler(e){
        // 将上一次滑开的选项弹回去
        if(this.data.currentMoveDom){
            this.moveAnimation(false, this.data.currentMoveDom)
        }
        let tar = e.targetTouches[0];
        this.data.initialTouchX = tar.pageX;
        this.data.initialTouchY = tar.pageY;
        this.data.currentMoveId = e.currentTarget.dataset.id
        this.data.currentMoveDom = this[`moveDom${e.currentTarget.dataset.id}`]
        let isCurrentDomHasMoved = this.state.focusList.find(item => item.id == e.currentTarget.dataset.id && item.move)
        if(isCurrentDomHasMoved) {
            this.data.isDisableMoveEvent = true
            this.moveAnimation(false)
        }
    }

    // 滑动touchmove事件
    touchMoveHandler(e){
        if(!this.data.isDisableMoveEvent){
            let currentX = e.targetTouches[0].pageX,
                currentY = e.targetTouches[0].pageY,
                moveX = currentX - this.data.initialTouchX,
                moveY = currentY - this.data.initialTouchY
            // X轴上滑动
            if(Math.abs(moveX) > Math.abs(moveY)){
                if(moveX < 0){
                    let position = moveX/this.state.fs;
                    if(position > -5) {
                        this.data.currentMoveDom.style.transform = 'translate3d(' + moveX + 'px,0,0)'
                        this.preventDefault(e)
                    }           
                }
                this.data.isVerticalMoveStart = false
            }else {
                // 初始滑动方向为垂直则禁用滑动
                if(this.data.isVerticalMoveStart){                
                    this.data.isDisableMoveEvent = true
                }else {
                    this.preventDefault(e)
                }
            }
        }
    }

    // 滑动touchend事件
    touchEndHandler(e){
        let currentX = e.changedTouches[0].pageX;
        //防止点击事件触发滑动效果
        if(!this.data.isDisableMoveEvent && currentX && Math.abs(currentX - this.data.initialTouchX) > 5){
            let moveX = (currentX - this.data.initialTouchX)/this.state.fs;
            if(moveX > -1){
                this.moveAnimation(false)
            }else{
                this.moveAnimation(true)
            }
        }
        this.data.isVerticalMoveStart = true;
        setTimeout(()=>{
            this.data.currentMoveDom.style.transition = '';
            this.data.isDisableMoveEvent = false;
        },250)
    }

    // 移动动画
    moveAnimation(flag, dom){
        // 上一次滑开的选项自动弹回去
        if(dom){
            dom.style.transition = 'transform ease .25s';
            dom.style.transform = 'translate3d(0,0,0)' 
            this.updateListMoveStatus(!!flag)
            return
        }
        //动画中禁用touch事件
        this.data.isDisableMoveEvent = true
        this.data.currentMoveDom.style.transition = 'transform ease .25s';
        if(typeof flag === "boolean"){
            if(flag){
                this.data.currentMoveDom.style.transform = 'translate3d(' + -4 * this.state.fs + 'px,0,0)'
            }
            else {
                this.data.currentMoveDom.style.transform = 'translate3d(0,0,0)'          
            }
        }else {
            this.data.currentMoveDom.style.transform = 'translate3d(' + flag + 'px,0,0)'
        }
        setTimeout(()=>{
            this.updateListMoveStatus(!!flag)
        },250)
    }

    // preventDefault方法（兼容新版Chrome）
    preventDefault(event){
        // 判断默认行为是否可以被禁用
        if (event.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!event.defaultPrevented) {
                event.preventDefault();
            }
        }
    }

    // 一键屏蔽
    async onekeyUpdateAlert(status){
        const result = await onekeyUpdateAlert({status})
        if(result.state.code === 0){
            if(status == 'N'){
                let focusList = this.state.focusList.map(item => {
                    return {
                        ...item,
                        isAlert: false
                    }
                })
                this.setState({shieldByOneKey: false,focusList,showShieldDialog: false})
                window.toast('一键屏蔽成功')
            }else if(status == 'Y'){
                let focusList = this.state.focusList.map(item => {
                    return {
                        ...item,
                        isAlert: true
                    }
                })
                this.setState({shieldByOneKey: true,focusList})
                window.toast('一键恢复成功')
            }
        }
    }

    render() {
        return (
            <Page
                title={'我的关注'}
                className='timeline-container'
            >
            <TopTabBar 
                config = {[
                    {
                        name: '订阅的课程',
                        href: '/wechat/page/learn-everyday?wcl=lc_focus_dailylearning&f=focus'
                    },
                    {
                        name: '我的关注',
                        href: '/wechat/page/timeline/mine-focus'
                    },
                ]}
                activeIndex = {1}
            />
                {
                    !this.state.noOne ? 
                    [
                        (
                            this.state.focusList.length > 0 ?
                            <div className="top">
                                <span>你订阅的直播间有新课，会第一时间通知你~ 屏蔽后，将不再收到课程推送。</span>
                                {
                                    this.state.shieldByOneKey ? 
                                    <div className="shield btn" onClick={()=>{this.setState({showShieldDialog: true})}}>一键屏蔽</div>
                                    :<div className="resume btn" onClick={this.onekeyUpdateAlert.bind(this, 'Y')}>恢复订阅</div>
                                }
                            </div>: null
                        ),
                        <div className="content">
                            <ScrollToLoad
                                ref="scrollBox"
                                className="scroll-box"
                                toBottomHeight={500}
                                noMore={this.state.noMore}
                                page={this.state.page}
                                loadNext={this.loadMoreHandle}
                            >
                                {
                                    this.state.focusList.map((item, idx) => {
                                        return (
                                            <div className="list-content" key={"focus-item-" + idx}>
                                                <div className="focus-item" ref={el=>this[`moveDom${item.id}`] = el} data-id = {item.id} onTouchStart={this.touchStartHandler} onTouchMove={this.touchMoveHandler} onTouchEnd={this.touchEndHandler} onClick={this.clickFocusItem.bind(this, item.id, item.move)}>
                                                    <div className={`head-img${item.isAlert ? '' : ' shield-course'}`} onClick={this.gotoLiveHandle.bind(this, item.id, item.move)}>
                                                        <img src={imgUrlFormat(item.headUrl, "@140h_140w_1e_1c_2o", "/140")} /> 
                                                    </div>
                                                    <div className="right-con">
                                                        <div className="text-con" onClick={this.gotoLiveHandle.bind(this, item.id, item.move)}>
                                                            <div className="name">{item.name}</div>
                                                            <div className="group">
                                                                <div className="focus-num">{digitFormat(item.focusNum)}人关注</div>
                                                                {
                                                                    this.state.authorityList.indexOf(item.id) > -1
                                                                    ? <span className='tag-authority'></span>
                                                                    : null
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="admin-tag" onClick={this.showAdminHandle.bind(this, item.id, idx, item.move)}></div>
                                                    </div>
                                                </div>
                                                <div className="btn-group">
                                                    <div className="cancel" onClick={this.focusHandle.bind(this, idx, item.id)}>{item.focused ? '取消关注' : '恢复关注'}</div>
                                                    <div className="subscribe" onClick={this.alertHandle.bind(this, idx, item.id)}>{item.isAlert ? '屏蔽动态' : '订阅动态'}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </ScrollToLoad>
                        </div>
                    ] : 
                    <EmptyPage emptyMessage="你还没有关注的直播间"
                        footer={<div className="look-look" onClick={()=>{locationTo(`/wechat/page/recommend`)}}>去看看</div>}
                    />
                }   
                <BottomDialog
                    show={ this.state.showAdmin }
                    theme={ 'list' }
                    items={
                        [
                            {
                                key: 'focus',
                                content: this.data.adminId != 0 ?
                                            this.state.focusList[this.data.adminIndex].focused ? "取消关注" : "恢复关注"
                                            :
                                            "",
                                show: true,
                            },
                            {
                                key: 'alert',
                                content: this.data.adminId != 0 ?
                                            this.state.focusList[this.data.adminIndex].isAlert ? "关闭开播通知" : "开启开播通知"
                                            :
                                            "",
                                show: true,
                            },
                        ]
                    }

                    title={this.data.adminId == 0 ? '' : this.state.focusList[this.data.adminIndex].name}
                    titleLabel={"直播间"}

                    close={ true }
                    onClose={ this.closeAdminHandle }
                    onItemClick={ this.onAdminItemClick }
                />
                {
                    this.state.showShieldDialog ? 
                    <div className="shield-dialog">
                        <div className="bg" onClick={()=>{this.setState({showShieldDialog: false})}}></div>
                        <div className="shield-content">
                            <div className="logo"></div>
                            <div className="tip">请慎重!<br/>你正在屏蔽所有直播间的课程动态<br/>将无法获得最新最有价值的知识服务</div>
                            <div className="btn-group">
                                <span className="btn" onClick={this.onekeyUpdateAlert.bind(this, 'N')}>狠心屏蔽</span>
                                <span className="btn think" onClick={()=>{this.setState({showShieldDialog: false})}}>再想想</span>
                            </div>
                        </div>
                    </div> : null
                }
            </Page>
        );
    }
}


class ComponnetName extends Component {
    render() {
        return (
            <div></div>
        );
    }
}

function mapStateToProps(state){
    return{
        myAdminLives: state.timeline.liveList.myAdminLives,
        myFocusLives: state.timeline.liveList.myFocusLives,
    }
}

const mapDispatchToProps ={
    liveFocus,
    focusList,
    fetchAuthorityList,
    liveAlert
}
export default connect(mapStateToProps, mapDispatchToProps)(MineFocusList)