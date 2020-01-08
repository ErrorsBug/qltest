import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators';
// import { authInfo } from '../../model'
import { loadavg } from 'os';
import cookie from 'cookie'
import Page from 'components/page';
import { getVal, locationTo } from 'components/util';
import { share } from 'components/wx-utils';

import ScrollToLoad from '../../components/scrollToLoad';
import BackTo from '../../components/back-to';

import BottomBrand from "components/bottom-brand";

import CampDetial from './components/camp-detail';
import CampInfo from './components/camp-info';
import CampReward from './components/camp-reward';
import CampCheckInInfo from './components/camp-check-in-info';
import OperComponent from './components/oper-component';
import BottomPay from './components/bottom-pay';
import BottomMenu from './components/bottom-menu';
import { isEqual } from 'lodash'
import IntroGroupBar from "components/intro-group-bar";


import { 
    campAuthInfoModel, 
    campBasicInfoModel, 
    campCheckInListModel, 
    campTopicsModel,
    campUserListModel,
    campUserInfoModel,
    campIntroModel,
} from '../../model';
import { 
    getUserInfo,
    uploadTaskPoint,
} from '../../actions/common';
import { 
    fetchCouponListAction
} from 'common_actions/coupon';
import {
    getCommunity
} from 'common_actions/common';
import MiddleDialog from 'components/dialog/middle-dialog';

const { fetchAuthInfo } = campAuthInfoModel;
const { fetchCampBasicInfo,fetchCampBasicInfoSuccess, fetchLshareKeyInfo, requestLshareKeyBind } = campBasicInfoModel;
const { requestCheckInList } = campCheckInListModel;
const { requestCampTopicList,requestTodayTopicList } = campTopicsModel;
const { requestCampUserList, requestUserHeadList,requestCheckInHeadList,requestCheckInTopNList } = campUserListModel;
const { requestCampUserInfo } = campUserInfoModel;
const { requestCampIntroList } = campIntroModel;

@autobind
export class CheckInCamp extends Component {
    static propTypes = {

    }
    
    constructor(props) {
        super(props)
        
        this.state = {
            testList: [],
            userId: '',
            curTabType: '',
            couponList: [],
            campSatus: {},
            isShowPayCompnent: false, // 是否展示支付组件 用于优惠券的返回太慢 2s
            isShowGroupDialog: false, // 是否显示社群弹窗
            groupHasBeenClosed: true,// 社群入口是否已经被关闭
            communityInfo: null, // 社群信息
        }

        this.data = {
            // 页面滚动加载的容器元素
            scrollToLoadContainer: null,
            // 页面对应每个tab的scrollTop值
            scrollTop: {
                "topic-tab": 0,
                "check-in-tab": 0
            }
        }
    }

    get campId() {
        return getVal(this.props, 'location.query.campId');
    }
    

    async componentDidMount() {
        this.setUserId();
        this.setTimeShowPayComponent();
        this.data.scrollToLoadContainer = document.querySelector('.co-scroll-to-load');
    }
    // 设置2S之后才展示
    setTimeShowPayComponent() {
        setTimeout(() => {
            if(this.state.isShowPayCompnent) return
            this.setState({
                isShowPayCompnent: true
            })
        }, 2000)
    }
    async fetchCouponList(props) {
        if (!props.liveId) return 
        let result = await this.props.fetchCouponListAction({
            businessId: this.campId,
            liveId: props.liveId,
            businessType: 'camp',
        });
        if (result.state.code === 0) {
            let data = this.filterMinMoneyCoupon(result.data.couponList)
            this.setState({
                couponList: data
            }, () => {
                data.length > 0 && this.autoSelectCoupon();
                // 展示价格底部
                if (!this.state.isShowPayCompnent) {
                    this.setState({
                        isShowPayCompnent: true
                    })
                }
            })
        }
    }
    // 过滤掉大于本身满多少才能用的票
    filterMinMoneyCoupon(couponList) {
        return couponList.filter(item => item.minMoney <= this.props.campBasicInfo.price)
    }
    // 设置当前价格配置的最优优惠券
    autoSelectCoupon() {
        
        let money;
        let { couponList } = this.state

        if (!couponList || couponList.length < 1) {
            return false;
        }

        let activeCoupon = {};


        if (money == 0) {
            activeCoupon = {};
        } else {
            // 从小到大排序
            couponList = [...couponList].sort((l, r) => {
                return l.money <= r.money ? -1  : 1;
            });
            console.log('autoSelectCoupon:', couponList)
            for (let i in couponList) {
                let coupon = couponList[i];
                if (coupon.minMoney && coupon.minMoney > money) continue; // 过滤最低使用价格
                if (coupon.money >= money) {
                    // 选出第一张大于等于当前价格的
                    activeCoupon = coupon;
                    break;
                }
                activeCoupon = coupon;
            }
        }
        // activeCoupon.active = true // 设置选中的优惠券
        // 筛选自动选中的
        this.setState({ 
            campSatus: activeCoupon
        });
        
    }
    handleChangeCouponList(couponList) {
        this.setState({
            couponList
        })
    }
    updateCouponInfo(activeCoupon) {
        this.setState({ 
            campSatus: {...this.state.campSatus, ...activeCoupon} 
        });
    }

    addCoupon(item) {
        let couponList = this.state.couponList;
        couponList = [ ...couponList, item ]
        this.setState({
            couponList
        } ,() => {
            this.autoSelectCoupon();
        })
    }

    async setUserId() {
        const cookieData = cookie.parse(document.cookie);
        let userId = '';
        if (cookieData.userId) {
            userId = cookieData.userId;
            
        } else {
            let result = await this.props.getUserInfo('', '');
            if (result.state && result.state.code == '0') {
                userId = getVal(result, 'data.user.userId');
            }
            
        }
        
        this.setState({ userId }, () => {
            this.initData();
        });
    }

    initData() {
        const campId = this.campId;
        const { topicListPage } = this.data;
        fetchAuthInfo({campId, userId: this.state.userId});
        fetchCampBasicInfo({campId, setDataType: null, callback: this.dispatchGetCommunity});
        requestCheckInList({campId, type: 'all', beforeOrAfter:'before', time: Date.now(), pageSize:10});
        requestCampTopicList({campId});
        requestTodayTopicList({campId})
        // requestCampUserList({ campId, page: {page:1,size:9999},  searchName:''});
        requestUserHeadList({campId});
        requestCheckInHeadList({campId})
        requestCheckInTopNList({campId, page:{page:1, size: 10}});
        requestCampUserInfo({campId, shareUserId:this.state.userId||''});
        requestCampIntroList({campId});
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.campName) {
            this.initShare(nextProps);
        }
        if (!isEqual(this.props.basicInfo.liveId, nextProps.basicInfo.liveId)) {
            console.log(nextProps.basicInfo, this.props.basicInfo)
            this.fetchCouponList(nextProps)
        }
    }
    

    initedShare = false
    /**
     *
     * 初始化分享
     *
     * @memberof 
     */
    initShare(nextProps) {
        if (this.initedShare) { return }
        this.initedShare = true
        let wxqltitle = nextProps.campName;
        let descript = '坚持做一件事，做更优秀的自己。一起加入打卡吧！';
        let wxqlimgurl = nextProps.basicInfo.headImage||"https://img.qlchat.com/qlLive/liveCommon/normalShareLogo-red.png";
        let friendstr = wxqltitle;
        let shareUrl = window.location.href;

        let onShareComplete = () => {
            console.log('share completed!') 

            // 学分任务达成触发点
            uploadTaskPoint({
                assignmentPoint: 'grow_share_course',
            })
        }
        let lshareKey = nextProps.lshareKey.shareKey || this.props.location.query.lshareKey;
        if(nextProps.lshareKey && nextProps.lshareKey.shareKey && nextProps.lshareKey.status == 'Y' ){
            wxqltitle = "我推荐-" + wxqltitle;
            friendstr = "我推荐-" + friendstr.replace("欢迎", "");
            shareUrl = shareUrl + "&lshareKey=" + nextProps.lshareKey.shareKey;
        }else if(this.props.location.query.lshareKey){
            wxqltitle = "我推荐-" + wxqltitle;
            friendstr = "我推荐-" + friendstr.replace("欢迎", "");
            shareUrl = shareUrl + "&lshareKey=" + this.props.location.query.lshareKey;
        }

        share({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            timelineDesc: friendstr, // 分享到朋友圈单独定制
            imgUrl: wxqlimgurl,
            shareUrl: shareUrl,
            successFn: onShareComplete,
        });

        if(lshareKey){
            requestLshareKeyBind({
                liveId:nextProps.basicInfo.liveId,
                shareKey: lshareKey,
                userId: this.state.userId
            });
        }
    }
    
    loadNext(next) {
        const campId = this.campId;
        const { curTabType } = this.state;
        if (curTabType == 'topic-tab') {
            requestCampTopicList({campId, next});
        } else if (curTabType == 'check-in-tab') {
            requestCheckInList({campId, type: 'all', beforeOrAfter:'before', time:this.props.lastTimeStamp, pageSize:10, next,});
        }
    }

    scrollToDo() {
        this.data.scrollTop[this.state.curTabType] = this.data.scrollToLoadContainer.scrollTop;
    }

    onTabChange(type) {
        this.setState({curTabType: type});
        this.data.scrollToLoadContainer.scrollTop = this.data.scrollTop[type];
    }

    goMyCheckInDiary() {
        locationTo("/wechat/page/check-in-camp/check-in-diary/" + this.campId)
    }

    async dispatchGetCommunity({liveId}) {
        const res = await getCommunity(liveId, 'liveCamp', this.campId);
        if(res) {
            this.setState({
                communityInfo: res
            });
            this.getGroupShow();
        }
    }

    // 判断是否显示社群入口
    getGroupShow() {
        if(window && window.sessionStorage) {
            let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST_INTRO');
            if(!communityList) {
                communityList = "[]";
            }
            try {
                let communityRecord = JSON.parse(communityList).includes(`${this.props.liveId}_${this.campId}`);
                if(!communityRecord){
                    this.setState({
                        groupHasBeenClosed: false       
                    })
                } 
            } catch (error) {
                console.log(error);
            }
        };
    }

    onGroupEntranceClose() {
        this.setState({
            groupHasBeenClosed: true
        });
        if(window && window.sessionStorage) {
            let communityList = window.sessionStorage.getItem('SHOW_COMMUNITY_LIST_INTRO');
            if(!communityList) {
                communityList = "[]";
            }
            try {
                communityList = JSON.parse(communityList);
                let hasRecord = communityList.includes(`${this.props.liveId}_${this.campId}`);
                if(hasRecord === false) {
                    communityList.push(`${this.props.liveId}_${this.campId}`);
                }
                window.sessionStorage.setItem('SHOW_COMMUNITY_LIST_INTRO', JSON.stringify(communityList));
            } catch (error) {
                console.log('ERR',error);
            }
        };
    }

    render() {
        const {
            isEnd,
            client,
            payStatus,
            campBasicInfo,
        } = this.props;
        const {
            couponList,
            campSatus,
            isShowPayCompnent,
            curTabType,
        } = this.state;
        // let noMore = true;
        let isDisable = true;
        if (curTabType == 'topic-tab') {
            // noMore = this.props.hasNoMoreTopics === 'Y';
            isDisable = this.props.hasNoMoreTopics === 'Y';
        } else if (curTabType == 'check-in-tab') {
            // noMore = this.props.hasMoreData === 'N';
            isDisable = this.props.hasMoreData === 'N';
        }
        return (
            <Page title={this.props.campName} className="check-in-detail-container">
                <ScrollToLoad 
                    className={`camp-list-container`}
                    loadNext={this.loadNext}
                    // noMore={noMore}
                    disable={isDisable}
                    emptyPicIndex={3}
                    emptyMessage="暂无课程"
                    noneOne={false}
                    scrollToDo={this.scrollToDo}
                    // disableScroll={true}
                    footer={(this.props.liveId&& client === 'C')&&<BottomBrand
                        campId = {this.campId}
                        liveId = {this.props.liveId}
                        chtype="create-live_camp"
                    />}
                >
                    <CampInfo />
                    <CampReward campSatus={campSatus}/>
                    <CampCheckInInfo />
                    <div className="portal-coupon-get-btn"></div>
                    {
                        client === 'B' || payStatus === 'Y' ?
                        <div className="my-check-in-diary" onClick={this.goMyCheckInDiary}>
                            <div className="user-head-img common-bg-img" style={{backgroundImage: `url(${this.props.userHeadImage})`}}></div> 
                            <span>我的打卡日记</span>
                            <span className="icon_enter go-icon"></span>
                        </div> :
                        null
                    }
                    <CampDetial 
                        groupComponent={
                            <IntroGroupBar
                                communityInfo={this.state.communityInfo} 
                                hasBeenClosed={this.state.groupHasBeenClosed}
                                isBuy={payStatus === 'Y'}
                                allowMGLive={this.props.allowMGLive}
                                onClose={this.onGroupEntranceClose}
                                onModal={() => {this.setState({isShowGroupDialog: true})}}
                                padding=".666667rem 0 0"
                            />
                        } 
                        onTabChange={this.onTabChange}
                    />
                    {/* <OperComponent /> */}
                </ScrollToLoad>
                <BackTo eleClass="camp-list-container"
                    liveId={this.props.liveId}
                    client={this.props.client}
                    campInfo={campBasicInfo}
                    payStatus={payStatus}
                /> 
            {
                isShowPayCompnent && isEnd != 'Y' && client === 'C' && payStatus === 'N' && <BottomPay 
                    location={this.props.location}
                    couponList={couponList}
                    campInfo={campBasicInfo}
                    campSatus={campSatus}
                    changeCouponList={this.handleChangeCouponList}
                    updateCouponInfo={this.updateCouponInfo}
                    addCoupon={this.addCoupon}
                    />
            }
            {
                isEnd != 'Y' && client === 'B' && <BottomMenu campInfo={campBasicInfo} />
            }

            <MiddleDialog
                show={this.state.isShowGroupDialog}
                title = "什么是课程社群？"
                buttons="cancel"
                buttonTheme="line"
                cancelText="我知道了"
                onBtnClick={() => {this.setState({
                    isShowGroupDialog: false
                })}}
                className="group-entrance-understand-dialog"
            >
                <div className="content">
                    <p>
                        课程社群是直播间老师为了提升报名学员的学习效率，所设置的学习社群。
                    </p>
                    <br />
                    <p>
                        当你加入社群后，将能获得包括<span>上课提醒、学习氛围、和老师对话、反馈学习成果</span>等深度服务，帮助到你更好吸收所学知识。
                    </p>
                    <br />
                    <p>
                        马上报名课程，即可加入课程社群~
                    </p>
                </div>
            </MiddleDialog>
            
            </Page>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        liveId: state.campBasicInfo.liveId,
        isEnd: state.campBasicInfo.dateInfo.isEnd,
        allowMGLive: state.campAuthInfo.allowMGLive,
        client: state.campAuthInfo.allowMGLive ? 'B' : 'C',
        payStatus: state.campUserInfo.payStatus,
        hasMoreData: state.campCheckInList.hasMoreData,
        hasNoMoreTopics: state.campTopics.hasNoMoreTopics,
        lastTimeStamp: state.campCheckInList.lastTimeStamp,
        userHeadImage: state.campUserInfo.headImage,
        campName: state.campBasicInfo.name,
        campBasicInfo: state.campBasicInfo,
        lshareKey:getVal(state, 'campBasicInfo.lshareKey',{}),
        basicInfo: getVal(state, 'campBasicInfo'),
    }
};
const mapActionToProps = {
    getUserInfo,
    fetchCouponListAction
}
export default connect(mapStateToProps,mapActionToProps)(CheckInCamp);
