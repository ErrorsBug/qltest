import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page'
import { imgUrlFormat, locationTo } from 'components/util'
import { ListItem, LinkList } from './components/link-list'
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import {
    getUserInfo,
} from 'studio_actions/common'
import { request } from 'common_actions/common';
import { getCheckUser, getRealStatus } from '../../actions/live'
import { judgeShowPhoneAuthGuide, showPhonAuthGuide } from 'components/phone-auth';
import { isServiceWhiteLive } from 'common_actions/common'
import { fetchIsAdminFlag } from '../../actions/live-studio'

class Mine extends Component {
    state = {
        waitEvalCount: 0,
        isRealName: false,
        realStatus: 'unwrite',
        newRealStatus: 'no',
        isShowReal: false,
        myLive: null,
        isWhiteLive: null,
        isLiveAdmin: null
    }

    constructor (props) {
        super(props);
    }

    get liveId(){
        return this.props.location.query.fromLiveId || this.props.liveInfo.entity.id
    }

    componentDidMount(){
        this.initData();
        if(!this.props.userInfo.username){
            this.props.getUserInfo().then(() => {
                // 绑定手机号提示
                if (this.props.userInfo.isBind === 'N' && judgeShowPhoneAuthGuide('JUDGE_SHOW_PHONE_AUTH_GUIDE_B')) {
                    showPhonAuthGuide().then(res => {
                        if (res) locationTo('/wechat/page/phone-auth');
                    })
                }
            })
        }

        this.initLiveWhite()

        request({
            url: '/api/wechat/transfer/h5/evaluate/waitEvalCount',
            method: 'POST',
            body: {
                liveId: this.liveId,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            this.setState({
                waitEvalCount: res.data.waitEvalCount
            })
        }).catch(err => {
            console.warn(err)
        })

        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    async initLiveWhite () {
        const white = await this.props.isServiceWhiteLive(this.liveId).then(res => {
            this.setState({
                isWhiteLive: res && res.data && res.data.isWhite || 'N'
            })
        })
        const admin = await this.props.fetchIsAdminFlag({ liveId: this.liveId})

        this.setState({
            isWhiteLive: white && white.data && white.data.isWhite || 'N',
            isLiveAdmin: admin && admin.data && admin.data.isLiveAdmin || 'N'
        })

    }

    get quickEntryList () {
        return [
            new ListItem('purchase', '购买记录', `/live/entity/myPurchaseRecord.htm?liveId=${this.liveId}`, 'buyRecord'),
            new ListItem('record', '学习记录', `/wechat/page/live-studio/my-joined?liveId=${this.liveId}`, 'learnRecord'),
            new ListItem('homework', '已完成作业', `/wechat/page/live-studio/my-homework?liveId=${this.liveId}`, 'completedWork'),
            new ListItem('comment', '我的评价', `/wechat/page/mine/unevaluated?liveId=${this.liveId}`, 'toBeEvaluated', this.state.waitEvalCount),
        ]
    }

    get allList () {
        return [
            new ListItem('coupon', '我的优惠券', `/wechat/page/mine/coupon-list?liveId=${this.liveId}`, 'myCoupon'),
            new ListItem('profit', '我的钱包', `/wechat/page/mine-profit${this.props.isLiveAdmin === 'Y' ? '?isLiveAdmin=Y' : ''}`, 'myWallet'),
            new ListItem('question', '我的提问', `/wechat/page/live-studio/mine/question/${this.liveId}`, 'myQuestion'),
            new ListItem('distribution', '分销推广', `/wechat/page/live-studio/my-shares?liveId=${this.liveId}`, 'distribution'),
            new ListItem('check-in-camp', '我的打卡', `/wechat/page/check-in-camp/join-list?liveId=${this.liveId}`, 'myClock'),
            new ListItem('helper', '帮助中心', `/wechat/page/help-center?wcl=live-mine`, 'helper'),
        ]
    }

    linkTo(e) {
        e.stopPropagation();
        locationTo(`/wechat/page/mine`);
    }

    async initData() {
        try {
            const myLiveRes = await request({
                url: '/api/wechat/transfer/h5/live/myLiveEntity',
                method: 'POST',
                body: {}
            });
            const entityPo = myLiveRes.data.entityPo;
            let myLiveId, realNameReq;
            if (entityPo) {
                myLiveId = entityPo.id;
                realNameReq = this.props.getRealStatus(myLiveId, 'live');
            }
            const verifyReq = this.props.getCheckUser();
            let reqs = [verifyReq];
            if (realNameReq) {
                reqs.push(realNameReq);
            }
            const [verifyRes, realNameRes] = await Promise.all(reqs);
            let data = {};
            if (realNameRes) {
                data = realNameRes.data;
            }
            const newReal = (verifyRes.data && verifyRes.data.status) || 'no';
            const oldReal = data.status || 'unwrite';
            this.setState({
                newRealStatus: newReal,
                realStatus: oldReal,
                isShowReal: Object.is(newReal, 'pass') || Object.is(newReal, 'no') && Object.is(oldReal, 'audited'),
                myLive: entityPo || {}
            });
        } catch (err) {
            console.error(`查询实名验证状态失败：${err}`);
        }

    }

    // 显示认证弹窗
    showRealName(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            isRealName: true
        })
    }
    clearRealName(){
        this.setState({
            isRealName: false
        })
    }

    render() {
        const {name,headImgUrl,userId}=this.props.userInfo;
        const { realStatus, newRealStatus,isShowReal, isWhiteLive, isLiveAdmin } = this.state;

        console.log(isWhiteLive, isLiveAdmin)
        return (
            <Page title={'学员中心'}>
                <div className='live-studio-mine'>
                    <div className="layer-bg"></div>
                    {
                        this.props.isLiveAdmin === 'N' ?
                        <div className="go-back">
                            <span className='go-to-mine on-log on-visible' data-log-region="returnMine" onClick={ this.linkTo.bind(this) }>
                                千聊个人中心
                                <img src={require('./img/change.png')} />
                            </span>
                        </div> : null
                    }
                    <header onClick={ () => {  _qla('click', { region: 'headImage'}) ;locationTo(`/wechat/page/mine/user-info`) }}>
                        <img src={imgUrlFormat(headImgUrl, '@292h_292w_1e_1c_2o')} alt="" />
                        <div className="user-info">
                            <span className="user-name">
                                {name}
                                <img className="edit-icon" src={require("./img/edit.png")} />
                                <i 
                                    className={ isShowReal ? 'ver' : '' } 
                                    onClick={ this.showRealName.bind(this) }></i>
                            </span>
                            <p>ID：{userId}</p>
                        </div>
                        <i className="icon-right-arrow"></i>
                    </header>

                    <div className="quick-entry-list">
                        {
                            this.quickEntryList.map((item, index) => (
                                <li key={`quick-entry-item-${index}`} className="quick-entry-item"
                                    onClick={()=>{ typeof _qla !== 'undefined' && _qla('click', {region: item.region}); locationTo(item.link)}}>
                                    <span className={`item-icon ${item.icon}`}></span>
                                    <p className="item-title">{item.title}</p>
                                </li>
                            ))
                        }
                    </div>

                    {
                        isWhiteLive === 'N' && isLiveAdmin === 'N' && 
                        this.state.myLive && !this.state.myLive.id ? 
                        <div className="create-course-btn on-log on-visible" data-log-region="liveCreate" onClick={() => {
                            locationTo(`/wechat/page/activity-entrance?ch=create-live-lmine`)
                        }}>
                        <span className="icon-create"></span>
                        我要开课
                        </div> : null
                    }
                    
                    <LinkList list={this.allList}></LinkList>

                </div>
                <NewRealNameDialog 
                    show = {this.state.isRealName}
                    onClose = {this.clearRealName.bind(this)}
                    realNameStatus = { realStatus || 'unwrite'}
                    checkUserStatus = { newRealStatus || 'no' }
                    isClose={true}
                />
            </Page>
        );
    }
}

function msp(state) {
    return {
        liveInfo: state.live.liveInfo,
        userInfo: state.common.userInfo.user,
        isLiveAdmin: state.common.isLiveAdmin,
    }
}

const map = {
    getUserInfo,
    getCheckUser,
    getRealStatus,
    isServiceWhiteLive,
    fetchIsAdminFlag
}

export default connect(msp, map)(Mine);
