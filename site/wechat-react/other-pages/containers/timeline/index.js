const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import dayjs from 'dayjs';

import Page from 'components/page';
import TabBar from 'components/tabbar';
import { BottomDialog, Confirm } from 'components/dialog';
import { locationTo, imgUrlFormat, getCookie } from 'components/util';
import { share } from 'components/wx-utils';

import EmptyTimeLine from './components/empty'
// import MyFocusBar from './components/my-focus-bar'
import TimeLineList from './components/time-line-list'
// import QlchatFocusAds from 'components/qlchat-focus-ads'
import DiscoveryTopTabBar from '../messages/discovery-top-tab-bar';
import NewUserGift, { getNewUserGiftData } from 'components/new-user-gift';
import { isFunctionWhite } from 'common_actions/common';

// actions
import {
    initTimeline,
    loadMoreTimeline,
    timelineLike,
    deleteTimeLine,
} from '../../actions/timeline';



import {
    fetchIsMineNew,
} from '../../actions/recommend';

import {
    getQlchatSubscribeStatus,
    getQlchatQrcode
} from '../../actions/common';


/**
 * 动态页
 */
class Timeline extends Component {

    constructor(props, context) {
        super(props, context);
    }

    state = {
        // 个人中心定制课程小红点状态
        isMineNewSession: "N",

        remindActive: false,
        userType : "B",
        timeLineList: [],
        mineFocusList: [],
        myLives: [],
        showAdmin: false,
		showQlchatAds: false,
		isFocusThree: false,
		isFocusQlchat: false,
		threeQrcode: '', // 三方二维码
		qlchatQrcode: '', // 官方二维码

        isShowNewUserGift: false,
        isWhite: false,
        isLaoding: true
    }

    data = {
        // B端讲师管理自己的动态的时候用来记录是针对哪条动态的索引
        adminIndex : "",
        adminID: "",

        // 点赞标记索引
        likeIndex: "",
        likeId: "",
    }

    async componentDidMount() {
        this.hadnleWhiteList();
        // 小红点标识状态相关
        this.initIsMineNew();
        this.initIsMineNewSession();
        this.initTimelineSpot()

        // this.initFocusAds();
        
        //没有触发服务端渲染，用这个接口来拿数据
        if (
                this.props.myCurrentLiveId == 0 
                || !this.props.myFocusLives 
                || (this.props.myFocusLives && this.props.myFocusLives.length < 1) 
            ) {
            await this.props.initTimeline();
        }

        if(this.props.power && this.props.power.allowMGLive) {
            if(localStorage && !localStorage.getItem("timelineReminded")) {
                this.setState({
                    userType: "B",
                    // remindActive: true // 20181206产品说不要那个没用的弹层了
                })
                localStorage.setItem("timelineReminded", true)
            } else {
                this.setState({
                    userType: "B"
                })
            }
        } else {
            this.setState({
                userType: "C"
            })
        }
        
        getNewUserGiftData().then(res => this.setState(res));

        share({
            title: '【千聊】 你所关注的直播间动态',
            timelineTitle: '【千聊】 你所关注的直播间动态',
            desc: '随时随地查看关注的优质内容，还可点赞喔！',
            timelineDesc: '随时随地查看关注的优质内容，还可点赞喔！', // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/red-loading.png',
        });

        this.setTraceSession()

    }

    setTraceSession() {
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', "timeline");
    }

    // 初始化个人中心小红点信息状态
    initIsMineNew() {
        this.props.fetchIsMineNew();
    }

    initTimelineSpot() {
        localStorage && !localStorage.getItem("timelineSpot") ?
        localStorage.setItem("timelineSpot",true) : ""
    }

     // 处理白名单
     hadnleWhiteList = async () => {
        const { isWhite } = await isFunctionWhite(getCookie("userId"), "ufw");
        this.setState({
            isWhite: isWhite && Object.is(isWhite, 'Y'),
            isLaoding: false
        })
    }

    // 初始化是否有新课程（个人中心小红点）
    initIsMineNewSession() {
        var newPointList={};
        if (localStorage.getItem('newPointList')) {
			newPointList = JSON.parse(localStorage.getItem('newPointList'));
            if(newPointList["个人中心_课程定制"] && newPointList["个人中心_课程定制"].length <= 0){
                this.setState({
                    isMineNewSession:"Y",
                });
            }
		} else {
            this.setState({
                isMineNewSession:"Y",
            });
        };
    }

    closeRemindHandle = (e) => {
        this.setState({
            remindActive: false
        })
    }

    openRemindHandle = (e) => {
        this.setState({
            remindActive: true
        })
    }

    adminClickHandle = (key) => {
        switch(key) {
            case 'del': 
                this.openDelConfirmHandle();
                break;
            default: 
                break;
        }
    }

    routerGotoHandle = (url) => {
        this.props.router.push(url)
    }

    // idx  对应组件的在列表中的位置  id 对应后端返回数据中的动态唯一id
    openAdminHandle = (idx, id) => {
        this.data.adminID = id
        this.data.adminIndex = idx
        this.setState({
            showAdmin: true,
        })
    }

    closeAdminHandle = () => {
        this.setState({
            showAdmin: false,
        })
    }

    //status 为true点赞   为false时为点赞
    likeHandle = async (id, status, idx) => {
        this.data.likeId = id
        
        const result = await this.props.timelineLike(id, status, idx)
        return result
    }


    openConfirmHandle = () => {
        this.refs.confirm.show()
    }

    closeConfirmHandle = () => {
        this.refs.confirm.hide()
    }

    confirmHandle = () => {
        this.props.router.push('/wechat/page/timeline/choose-type');
        this.refs.confirm.hide()
    }


    openDelConfirmHandle = () => {
        this.refs.delConfirm.show()
        this.setState({
            showAdmin: false
        })
    }

    closeDelConfirmHandle = () => {
        this.refs.delConfirm.hide()
    }

    delConfirmHandle = (tag) => {
        if(tag == "confirm") {
            this.props.deleteTimeLine(this.data.adminID, this.data.adminIndex)
        }
        this.refs.delConfirm.hide()
    }



    createSpan = () => {
        if(this.props.power && this.props.power.allowCreateTopic) {
            return (
                <Link to="/wechat/page/timeline/choose-type">
                    <div className="create-span"></div>
                </Link>
            )
        } else if (this.props.power && this.props.power.allowMGLive) {
            return (
                <div className="create-span" onClick={this.openConfirmHandle}></div>
            )
        }


        (this.state.restPushChance > 0 && this.state.userType === "B") ?
            <Link to="/wechat/page/timeline/choose-type">
                <div className="create-span"></div>
            </Link>
            : ""
    }

    myFocusBar = () => {
        return (
            <MyFocusBar
                myLives={this.state.myLives}
                myAdminLives={this.props.myAdminLives}
                myFocusLives={this.props.myFocusLives}
                mineFocusList={this.state.mineFocusList}
                userType={this.state.userType}
                routerGotoHandle={this.routerGotoHandle}
            />
        )
    }

    // closeQlchatAds = () => {
    //     // session内不再显示
	// 	try {
	// 		const maxAge = new Date(dayjs().format('YYYY/MM/DD 23:59:59')).getTime();
	// 		localStorage.setItem('__hideTopBarAds', maxAge)
    //     } catch (e) {}
        
    //     this.setState({
    //         showQlchatAds: false
    //     })
    // }

	// /**
	//  * 获取关注状态
	//  * 1.优先关注垂直号
	//  * 2.次关注千聊
	//  * 3.引导下载app
	//  */
	// initFocusAds = async () => {
	// 	// 是否显示顶部广告
	// 	try {
	// 		if (new Date().getTime() < localStorage.getItem('__hideTopBarAds')) {
	// 			return
	// 		}
	// 	} catch (e) {}

	// 	let subscribeStatus = await this.props.getQlchatSubscribeStatus()

	// 	let isFocusThree = subscribeStatus.isFocusThree,
	// 		isFocusQlchat = subscribeStatus.subscribe || !subscribeStatus.isShowQl;

	// 	this.setState({
	// 		isFocusThree,
	// 		isFocusQlchat
	// 	})

	// 	// 获取三方二维码
	// 	if (!isFocusThree) {
	// 		let threeQrcode = await this.props.getQlchatQrcode({ liveId: '2000000645972374', showQl: 'N' });
	// 		threeQrcode && this.setState({
	// 			threeQrcode
	// 		})
	// 	}

	// 	// 获取官方二维码
	// 	if (!isFocusQlchat) {
	// 		let qlchatQrcode = await this.props.getQlchatQrcode({ liveId: '2000000645972374'});
	// 		qlchatQrcode && this.setState({
	// 			qlchatQrcode
	// 		})
	// 	}

	// 	this.setState({
	// 		showQlchatAds: true
	// 	})
  	// }

    render() {

        return (
            <Page title={'发现'} className='timeline-container'>
                <DiscoveryTopTabBar activeIndex="1"/>

                {/* {
                    this.state.showQlchatAds ? 
                    <QlchatFocusAds onClose={this.closeQlchatAds} qrcode={this.state.threeQrcode||this.state.qlchatQrcode}/>
                    : null
                } */}

                {

                     (this.state.userType === "C" && (this.props.timelineList && this.props.timelineList.length < 1)) ?
                        <EmptyTimeLine
                            myLives={this.state.myLives}
                            myAdminLives={this.props.myAdminLives}
                            myFocusLives={this.props.myFocusLives}
                            mineFocusList={this.state.mineFocusList}
                            userType={this.state.userType}
                            routerGotoHandle={this.routerGotoHandle}
                        />
                    :
                        <TimeLineList
                            newLikeCount = {this.state.newLikeCount}
                            timelineList = {this.props.timelineList}
                            newLikeNum = {this.props.newLikeNum}
                            admin = {this.openAdminHandle}
                            likeHandle = {this.likeHandle}
                            loadMoreTimeline = {this.props.loadMoreTimeline}
                            liveId = {this.props.myCurrentLiveId} 
                            power = {this.props.power}
                            sysTime = {this.props.sysTime}
                            
                            myLives={this.state.myLives}
                            myAdminLives={this.props.myAdminLives}
                            myFocusLives={this.props.myFocusLives}
                            mineFocusList={this.state.mineFocusList}
                            userType={this.state.userType}
                            routerGotoHandle={this.routerGotoHandle}
                        >
                            {/*<QlchatFocusAds />*/}
                        </TimeLineList>

                }

                {
                    this.state.remindActive ?
                        <div className="reminder" onClick={this.closeRemindHandle}>
                            <div className="reminder-content">
                                <span className="text">推送不再单调，马上发布动态吧</span>
                                <span className="get">get</span>
                            </div>
                        </div>
                    : ""
                }

                
                {
                    this.createSpan()
                }

                {/* {
                    (this.state.restPushChance > 0 &&  this.state.userType === "B") ?
                        <Link to="/wechat/page/timeline/choose-type">
                            <div className="create-span"></div>
                        </Link>
                        : ""
                } */}

                <BottomDialog
                    className="admin-dialog"
                    show={this.state.showAdmin}
                    bghide={true}
                    theme='list'
                    title='动态管理'
                    items={
                         [
                            {
                                key: 'del',
                                icon: 'icon_trash',
                                show: true,
                                content: '删除'
                            }
                        ]
                    }
                    onItemClick={this.adminClickHandle}
                    close={true}
                    onClose={this.closeAdminHandle}
                />
                

                <Confirm
                    onClose={this.closeConfirmHandle}
                    onBtnClick={this.confirmHandle}
                    ref='confirm'
                >
                    <div className="confirm-text">当前登录非创建的直播间，是否以管理员身份发送动态？</div>
                </Confirm>

                <Confirm
                    onClose={this.closeDelConfirmHandle}
                    onBtnClick={this.delConfirmHandle}
                    ref='delConfirm'
                    button="cancel-confirm"
                >
                    <div className="confirm-text">确定要删除该动态吗</div>
                </Confirm>

                {
                    this.state.isShowNewUserGift &&
                    <NewUserGift
                        courseList={this.state.newUserGiftCourseList}
                        onClose={() => this.setState({isShowNewUserGift: false})}
                        expiresDay={this.state.newUserGiftExpiresDay}
                    />
                }
                { !this.state.isLaoding && !this.state.isWhite && (
                    <TabBar
                        activeTab={"timeline"}
                        isMineNew={false}
                        isMineNewSession={"N"}
                    />
                ) }
                
                
            </Page>
        );
    }
}


function mapStateToProps (state) {
    return {
        isMineNew: state.recommend.isMineNew,
        myAdminLives: state.timeline.liveList.myAdminLives,
        myFocusLives: state.timeline.liveList.myFocusLives,
        myCurrentLiveId: state.timeline.myCurrentLiveId,
        power: state.timeline.power,
        timelineList: state.timeline.timelineList,
        newLikeNum: state.timeline.newLikeNum,
        sysTime: state.common.sysTime,
    }
}

const mapActionToProps = {
    fetchIsMineNew,
    initTimeline,
    loadMoreTimeline,
    timelineLike,
    deleteTimeLine,
    getQlchatSubscribeStatus,
    getQlchatQrcode
}

module.exports = connect(mapStateToProps, mapActionToProps)(Timeline);
