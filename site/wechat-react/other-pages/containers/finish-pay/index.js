import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';

import { getVal, locationTo, isFromLiveCenter } from 'components/util';

import { getLiveInfo } from 'actions/finish-pay';
import { fetchIsLiveAdmin } from 'actions/common';
import { liveGetSubscribeInfo, fetchGetQr } from 'actions/live';
import { getSimpleTopic } from 'actions/topic';
import { getSimpleChannel, fetchCourseList } from 'actions/channel';
import { whatQrcodeShouldIGet } from 'common_actions/common';

import { Confirm } from 'components/dialog';
import QRImg from 'components/qr-img';

import { isServiceWhiteLive, getOfficialLiveIds, tripartiteLeadPowder } from 'common_actions/common'
import { giftValidate, giftCourseList, choseGift, giftAvailable } from '../../actions/activity-common'

function mapStateToProps(state) {
    return {
        finishPayData: state.finishPayData,
        isLiveAdmin: state.common && state.common.isLiveAdmin || 'N',
        sysTime: state.common.sysTime,
    };
}
const mapDispatchToProps = {
    fetchIsLiveAdmin,
    liveGetSubscribeInfo,
    getSimpleTopic,
    getSimpleChannel,
    fetchGetQr,
    getLiveInfo,
    fetchCourseList,
    isServiceWhiteLive,
    getOfficialLiveIds,
    tripartiteLeadPowder,

    giftValidate,
    giftCourseList,
    choseGift,
    giftAvailable,
};

class FinishPay extends Component {
    constructor(props) {
        super(props);
        this.liveId = props.location.query.liveId;
        this.actId = props.location.query.actId;
    }

    state = {
        paySuccess: true, // 支付是否成功
        // payType: 'topic', // 购买的类型
        gobackUrl: null,
        isBindThird: false,
        qrUrl: '', // 二维码
        qrAppId: '',
        paster: this.props.location.query.paster || this.props.finishPayData.paster,
        pasterUrl: this.props.finishPayData.pasterUrl,

        payType: '', // topic channel vip 三选一
        liveName: '',
        courseName: '',
        payAmount: '',

        // 活动赠礼
        showActiviyGift: false,

        giftList: [],
        chosenGift: null,
        isWhiteLive: 'N',
        isOfficialList: false,
    };

    async componentDidMount() {
        // console.log(this.props.finishPayData);
        if (this.props.finishPayData.type === 'topic') {
            this.setState({
                gobackUrl: `/topic/details?topicId=${this.props.finishPayData.id}`
            });
        } else if (this.props.finishPayData.type === 'channel') {
            const courseList = await this.props.fetchCourseList(this.props.finishPayData.id, this.liveId, 1, 1, false)
            if (courseList.length && courseList[0].id) {
                this.setState({
                    gobackUrl: `/topic/details?topicId=${courseList[0].id}`
                });
            } else {
                this.setState({
                    gobackUrl: '/live/channel/channelPage/' + this.props.finishPayData.id + '.htm'
                });
            }
        } else {
            this.setState({
                gobackUrl: '/wechat/page/live/' + this.liveId 
            });
        }
        await this.getExtendInfo();
        this.initIsServiceWhiteLive();

        if (this.props.location.query.actId) {
            this.initGiftData()
        }
    }

    async initIsServiceWhiteLive() {
        try {
            let [isWhiteLive, officialList] = await Promise.all([
                this.props.isServiceWhiteLive(this.liveId),
                this.props.getOfficialLiveIds(),
            ]);

            let list = getVal(officialList, 'data.dataList');

            this.setState({
                isWhiteLive: getVal(isWhiteLive, 'data.isWhite', 'N'),
                isOfficialList: list.find(item => this.liveId == item) != null
            });
        } catch (error) {
            console.error(error);
        }
    }

    async getExtendInfo() {
        let result = null;
        let topicId = '';
        let channelId = '';

        let type = '';
        let courseName = '';
        let liveName = '';

        let qrChannel = '104'

        switch (this.props.location.query.type) {
            case 'topic':
                result = await this.props.getSimpleTopic(this.props.finishPayData.id)
                topicId = this.props.finishPayData.id
                type = 'topic'
                courseName = result && result.data && result.data.topic && result.data.topic.topic
                qrChannel = 'topicPayCompleted'
                break;
            case 'channel':
                result = await this.props.getSimpleChannel(this.props.finishPayData.id)
                channelId = this.props.finishPayData.id
                type = 'channel'
                courseName = result && result.data && result.data.channel && result.data.channel.name
                qrChannel = 'channelPayCompleted'
                break;
            case 'vip':
                type = 'vip'
                result = await this.props.getLiveInfo(this.liveId)
                liveName = result && result.data && result.data.entity && result.data.entity.name;
                qrChannel = 'liveVipPayCompleted'
                break;
            default:
                break;
        }


        if (result != null) {
            if (result.data.channel) {
                this.liveId = getVal(result, 'data.channel.liveId');
            } else if (result.data.topic) {
                this.liveId = getVal(result, 'data.topic.liveId');
            }
        }


        let [isLiveAdmin, subResult] = await Promise.all([
            this.props.fetchIsLiveAdmin({ liveId: this.liveId }),
            this.props.liveGetSubscribeInfo(this.liveId),
        ]);

        // var sss = { isShowQl: true, subscribe: true, isFocusThree: false, isBindThird: false }

        let qrResult = '';
        const _res = await whatQrcodeShouldIGet({
            isLiveAdmin: this.props.isLiveAdmin,
            isBindThird: subResult.isBindThird,
            isFocusThree: subResult.isFocusThree,
            isRecommend: isFromLiveCenter(),
            options: {
                subscribe: subResult.subscribe,
                channel: qrChannel,
                channelId,
                liveId: this.liveId,
            }
        })
        if(_res){
            this.setState({
                qrUrl: _res.url,
                qrAppId: _res.appId,
            })
        }

        this.setState({
            isBindThird: getVal(subResult, 'isBindThird', false),
            type,
            liveName,
            courseName,
        });
    }

    initGiftData = async () => {
        let [courseList, actCourse, giftValidate, isJoin] = await Promise.all([
            this.props.giftCourseList({
                activityCode: this.actId,
                groupCode: "course",
            }),
            this.props.giftCourseList({
                activityCode: this.actId,
                groupCode: "giftList",
            }),
            this.props.giftValidate({
                courseList: [{
                    businessType: "channel",
                    businessId: this.props.finishPayData.id
                }]
            }),
            this.props.giftAvailable({
                activityCode: this.actId
            })
        ])

        // console.log("giftValidate");
        // console.log(giftValidate.data.dataList[0].available);

        // console.log("isJoin");
        // console.log(isJoin.data.isJoin);

        if (actCourse.data.dataList[0].businessId != this.props.finishPayData.id) {
            this.setState({
                des: "无效的系列课",
            })
            return
        }
        if (giftValidate.data.dataList[0].available != "Y") {
            this.setState({
                des: "您尚未购买此课程"
            })
            return
        }
        if (isJoin.data.isJoin != "N") {
            this.setState({
                des: "您已领取过赠礼"
            })
            return
        }

        courseList = courseList && courseList.data && courseList.data.dataList
        let giftList = []
        courseList.length > 0 && courseList.map((item) => {
            giftList.push({
                businessType: item.businessType,
                giftImgUrl: item.headImage + '@296h_480w_1e_1c_2o',
                businessId: item.businessId,
                corseName: item.name,
                available: null,
                unavailableMsg: '',
                checked: false,
            })
        })

        let giftCourseListValidate = await this.props.giftValidate({
            courseList: giftList
        })

        giftCourseListValidate = giftCourseListValidate && giftCourseListValidate.data && giftCourseListValidate.data.dataList || {}
        giftCourseListValidate.map((item, index) => {
            if (item.available == 'N') {
                giftList[index].available = true
            } else if (item.available == 'Y') {
                giftList[index].available = false
                giftList[index].unavailableMsg = '已经拥有此课程'
            }
        })

        this.setState({
            showActiviyGift: true,
            giftList,
        })
    }

    giftChoseHandle = (chosenItem) => {
        if (!this.state.canReceiveGift || !chosenItem.available) {
            return
        }

        this.state.giftList.map((item) => {
            if (item.gitfCode == chosenItem.gitfCode) {
                item.checked = true
            } else {
                item.checked = false
            }
        })

        this.setState({
            giftList: this.state.giftList,
            chosenGift: chosenItem,
        })
    }

    redBtnHandle = () => {
        locationTo(this.state.gobackUrl)
    }

    whiteBtnHandle = () => {
        if (this.props.isLiveAdmin == "Y") {
            locationTo('/wechat/page/live/courseTable/' + this.liveId)
        } else {
            locationTo('/live/entity/myPurchaseRecord.htm')
        }
    }

    goApp = () => {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1392124274803';
    }

    jumpBtnHandle = () => {
        locationTo('/live/channel/channelPage/' + this.props.finishPayData.id + '.htm?finishPay=Y')
    }

    giftChoseHandle = (chosenItem) => {
        if (!chosenItem.available) {
            return
        }

        this.state.giftList.map((item) => {
            if (item.businessId == chosenItem.businessId) {
                item.checked = true
            } else {
                item.checked = false
            }
        })

        this.setState({
            giftList: this.state.giftList,
            chosenGift: chosenItem,
        })
    }

    giftDialogBtnHandle = async (tag) => {
        if (tag == "confirm") {
            const result = await this.props.choseGift({
                activityCode: this.actId,
                type: this.state.chosenGift.businessType,
                id: this.state.chosenGift.businessId,
            })

            if (result && result.state.code === 0) {
                window.toast("领取成功")
                const that = this
                setTimeout(() => {
                    that.setState({
                        showActiviyGift: false,
                    })
                }, 200);
            } else {
                window.toast("领取失败，请稍后再试")
            }

            this.refs.giftDialog.hide()

        }
    }

    onCloseGiftTipDialog = () => {
        this.refs.giftDialog.hide()
    }

    giftTypeText = (giftItem) => {
        switch (giftItem && giftItem.businessType) {
            case "channel":
                return "系列课"
            case "topic":
                return "话题"
            default:
                break;
        }
    }

    onImageClick() {
        // 1.服务号白名单对应直播间不跳转
        // 2.非官方直播间专业版不跳转
        let canJump = !this.masterUser;

        if (this.state.pasterUrl && canJump) {
            window.location.href = this.state.pasterUrl;
        }
    }

    get showCase() {
        let type = '';

        if (this.state.showActiviyGift) {
            type = 'gift';
        } else if (this.state.paster) {
            if (!this.masterUser) {
                type = 'paster';
            }
        } else if (this.state.qrUrl) {
            type = 'qrcode';
        }

        return type;
    }

    /**
     * 非官方直播间专业版及服务号白名单对应直播间
     */
    get masterUser() {
        return !(this.state.isWhiteLive == 'N' && (this.props.isLiveAdmin == 'N' || (this.props.isLiveAdmin == 'Y' && this.state.isOfficialList)))
    }

    get showAppBtn () {
        return !this.masterUser;
    }

    render() {
        return (
            <Page title="支付成功" className='finish-pay-container'>
                <div className='pay-header'>
                    <div className="icon_choosethis"></div>

                    <p className="success">恭喜你，支付成功</p>

                    {
                        this.state.type == "vip" || this.props.location.query.flexible ?
                            "" : <p className="des">课程购买后可支持回听哦</p>
                    }
                </div>

                <div className="des-con">
                    <span className="type">{this.state.type != "vip" ? "课程名称：" : "直播间名称："}</span>
                    <span className="course">{this.state.courseName || this.state.liveName}</span>
                </div>

                <div className="btn-con">
                    <div
                        className="fbtn red on-log"
                        onClick={this.redBtnHandle}
                        data-log-region="go-back-btn"
                        data-log-pay-type={this.state.type}
                        data-log-is-live-admin={this.props.isLiveAdmin}
                    >
                        {this.state.type != "vip" ? "进入首节课" : "返回直播间"}</div>
                    <div className="fbtn white on-log"
                        data-log-region="go-list-btn"
                        data-log-pay-type={this.state.type}
                        data-log-is-live-admin={this.props.isLiveAdmin}
                        onClick={this.jumpBtnHandle}
                    >查看课程列表</div>
                    {
                        this.showAppBtn ?
                            <div className="fbtn white on-log"
                                data-log-region="go-app-btn"
                                data-log-pay-type={this.state.type}
                                data-log-is-live-admin={this.props.isLiveAdmin}
                                onClick={this.goApp}
                            >在app中查看已购课程</div>
                            :
                            <div className="fbtn white on-log"
                                data-log-region="go-bought-btn"
                                data-log-pay-type={this.state.type}
                                data-log-is-live-admin={this.props.isLiveAdmin}
                                onClick={this.whiteBtnHandle}
                            >查看已购课程</div>
                    }
                    
                </div>

                {
                    /* 带有urlquery ?actId=xxx 的活动系列课 支付成功的时候 跳过来会显示赠品 */
                    this.showCase === 'gift' &&
                        <div className='gift-con'>
                            <div className="scroll-x">
                                {
                                    this.state.giftList.map((item, index) => {
                                        return (
                                            <div className='gift-item-con' key={'gift' + index} onClick={() => { this.giftChoseHandle(item) }}>
                                                {
                                                    !item.available && <div className='unavailable-layer'>{item.unavailableMsg}</div>
                                                }
                                                {
                                                    item.available && <div className={`check-tag icon_checked${item.checked ? " checked" : ""}`}></div>
                                                }
                                                {
                                                    <div className="gift"><img src={item.giftImgUrl} alt="" /></div>
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            {
                                this.state.chosenGift ?
                                    <div className="gift-btn chosen" onClick={() => { this.refs.giftDialog.show() }}>点击领取</div>
                                    :
                                    this.state.showActiviyGift && <div className="gift-btn">请选择图中赠品</div>
                            }

                        </div>
                }

                {
                    this.showCase === 'paster' &&
                        <div className="paster-wrap">
                            <img src={ this.state.paster } onClick={ this.onImageClick.bind(this) } />
                        </div>
                }

                {
                    this.showCase === 'qrcode' && 
                        <div className="qrcode-con">
                            {/* <img src={this.state.qrUrl} /> */}
                            <QRImg 
                                src={this.state.qrUrl}
                                appId={this.state.qrAppId}
                                traceData="finishPayQrcode"
                                channel = "104"
                            />
                            <p className="red-des">长按二维码，关注我们</p>
                            <p className="des">再也不用担心找不到上课入口啦</p>
                        </div>
                }

                <Confirm
                    ref='giftDialog'
                    theme='empty'
                    onClose={this.onCloseGiftTipDialog}
                    onBtnClick={this.giftDialogBtnHandle}
                    buttons='cancel-confirm'
                    confirmText="领取"
                >
                    {
                        this.state.chosenGift && <main className='gift-dialog-container'>
                            <img src={this.state.chosenGift.giftImgUrl}></img>
                            <p>
                                选择{this.giftTypeText(this.state.chosenGift)}《{this.state.chosenGift.corseName}》作为您的赠礼？
                    </p>
                        </main>
                    }

                </Confirm>

            </Page>
        )
    }
};


module.exports = connect(mapStateToProps, mapDispatchToProps)(FinishPay);