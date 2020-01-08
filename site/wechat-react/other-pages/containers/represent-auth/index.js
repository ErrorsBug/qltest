import { getUserInfoP, request, updateUserInfo } from 'common_actions/common';
import Curtain from 'components/curtain/index';
import Page from 'components/page';
import WechatPhoneBinding from 'components/wechat-phone-binding/index';
import { share } from 'components/wx-utils';
import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { getChannelInfo } from '../../actions/channel';
import {
    getChannelSharePercent,
    getChannelShareQualify
} from '../../actions/channel-distribution';
import { getLiveInfo } from '../../actions/live';
import { getTopicInfo } from '../../actions/topic';

class Represent extends Component {
    state = {
        shareKey: '',
        shareUrl: '',
        percent: '?',
        liveId: undefined,
        channelId: undefined,
        topicId: undefined,
        qrcode: '',
        showModalMoreInfo: false,
        showModalSubscribe: false,
        showModalShare: false,
        businessInfo: {}
    };

    constructor(props) {
        super(props);
        const query = props.location.query;
        const { liveId, channelId, topicId } = query;
        this.state = {
            query,
            liveId,
            channelId,
            topicId,
            businessType: channelId ? 'channel' : topicId ? 'topic' : 'live'
        };
    }

    async componentDidMount() {
        // 绑定手机号
        // if (!this.props.userInfo.mobile) {
        //     await showWinPhoneAuth({close: false});
        //     // node端处理：系列课走node端接受邀请逻辑，直播间或单课重定向到wt
        //     reloadPage();

        // 课代表邀请落地页渲染
        // } else {
        // if (this.state.channelId) {
        this.initInfo();
        // }
        // }
    }

    async initInfo() {
        const { userInfo, getUserInfoP, channelInfo } = this.props;
        const { businessType, query } = this.state;
        const distributionShareInfo =
            this.props[`${businessType}DistributionInfo`][
                businessType === 'channel'
                    ? 'shareQualifyChannelPo'
                    : 'shareQualifyPo'
            ] || {};
        const { shareKey, shareEarningPercent } = distributionShareInfo;

        let businessInfo = distributionShareInfo;

        try {
            // 格式化课代表关联业务信息
            switch (businessType) {
                case 'topic': {
                    const {
                        topicName: name,
                        topicBackgroundUrl: imgUrl
                    } = businessInfo;
                    businessInfo = {
                        ...businessInfo,
                        imgUrl,
                        name
                    };
                    break;
                }
                case 'live': {
                    const { liveLogo: imgUrl, liveName: name } = businessInfo;
                    businessInfo = {
                        ...businessInfo,
                        imgUrl,
                        name
                    };
                    break;
                }
                default: {
                    const {
                        channelLogo: imgUrl,
                        channelName: name
                    } = businessInfo;
                    businessInfo = {
                        ...businessInfo,
                        imgUrl,
                        name
                    };
                    break;
                }
            }
            !userInfo.userId && (await getUserInfoP());
        } catch (error) {
            console.error(error);
        }

        // 不是白名单 且 未关注公众号，显示二维码
        request
            .get({
                url: '/api/wechat/live/isServiceWhiteLive',
                body: {
                    liveId:
                        distributionShareInfo.liveId ||
                        (channelInfo || {}).liveId
                }
            })
            .then(res => {
                if (res.data.isWhite === 'N') {
                    request
                        .post({
                            url: '/api/wechat/user/getAppIdByType',
                            body: {
                                type: 'ql_share'
                            }
                        })
                        .then(res => {
                            if (res.data.isSubscribe === 'N') {
                                request
                                    .post({
                                        url:
                                            '/api/wechat/transfer/h5/live/getQr',
                                        body: {
                                            channel: 'share',
                                            liveId: this.props.channelInfo
                                                .liveId,
                                            appId: res.data.appId
                                        }
                                    })
                                    .then(res => {
                                        this.setState({
                                            qrcode: res.data.qrUrl,
                                            showModalSubscribe: !!(
                                                this.props.userInfo
                                                    .wechatAccount &&
                                                this.props.userInfo.mobile
                                            )
                                        });
                                    })
                                    .catch(err => {});
                            }
                        })
                        .catch(err => {});
                }
            })
            .catch(err => {});

        setTimeout(() => {
            this.initShare();
        }, 200);

        this.setState({
            businessInfo,
            percent: shareEarningPercent,
            shareKey: shareKey || query.shareKey,
            // 用户未绑定微信号和手机号时显示弹窗要求其完善信息
            showModalMoreInfo: !(userInfo.wechatAccount && userInfo.mobile)
        });
    }

    initShare() {
        const { businessInfo, channelId, topicId, liveId } = this.state;
        const { name, desc = '暂无描述', imgUrl } = businessInfo;
        let wxqltitle = name;
        let friendstr = wxqltitle;

        const { shareKey = '', businessType } = this.state;

        let shareUrl = '';

        switch (businessType) {
            case 'channel':
                shareUrl = `live/channel/channelPage/${channelId}.htm?shareKey=${shareKey}`;
                break;
            case 'topic':
                shareUrl = `topic/${topicId}.htm?shareKey=${shareKey}`;
                break;
            default:
                shareUrl = `live/${liveId}.htm?lshareKey=${shareKey}`;
                break;
        }
        shareUrl = `${shareUrl}&sourceNo=link&type=${businessType}`;

        shareUrl = `${window.location.origin}/${shareUrl}`;

        wxqltitle = '我推荐-' + wxqltitle;
        friendstr = '我推荐-' + friendstr;

        this.setState({
            shareUrl
        });

        share({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc,
            timelineDesc: friendstr, // 分享到朋友圈单独定制
            imgUrl,
            shareUrl,
            successFn: () => this.setState({ showModalShare: false })
        });
    }

    handleInfoBindingSuccess = () => {
        window.toast('提交成功！');
        this.setState({
            showModalMoreInfo: false
        });
        // 未关注公众号则需要提醒显示
        setTimeout(() => {
            this.setState({
                showModalSubscribe: !!this.state.qrcode
            });
        }, 500);
    };

    onCopyLink = (text, result) => {
        if (result) {
            window.toast('复制成功');
            this.setState({
                showModalClipboard: false
            });
        } else {
            window.toast('复制失败，请手动长按复制');
        }
    };

    handleShareCardGenerate = type => {
        const {
            businessInfo,
            liveId,
            topicId,
            channelId,
            shareKey
        } = this.state;
        let url = '';
        switch (type) {
            case 'channel':
                url = `/wechat/page/sharecard?type=channel&channelId=${channelId}&liveId=${businessInfo.liveId}`;
                break;
            case 'topic':
                url = '/wechat/page/sharecard?type=topic&topicId=' + topicId;
                break;
            default:
                url =
                    '/wechat/page/sharecard?type=live&liveId=' +
                    liveId +
                    '&lshareKey=' +
                    shareKey;
                break;
        }
        url && window.open(url, '_self');
    };

    render() {
        const {
            userInfo: { headImgUrl, mobile, wechatAccount }
        } = this.props;
        const {
            percent,
            qrcode,
            showModalMoreInfo,
            showModalSubscribe,
            showModalClipboard,
            showModalShare,
            businessInfo = {},
            businessType,
            liveId,
            channelId,
            topicId
        } = this.state;

        let businessName = '';
        let businessUrl = '';

        switch (businessType) {
            case 'channel':
                businessName = '系列课';
                businessUrl = `channel-intro?channelId=${channelId}`;
                break;
            case 'topic':
                businessName = '话题';
                businessUrl = `topic-intro?topicId=${topicId}`;
                break;
            default:
                businessName = '直播间';
                businessUrl = `live/${liveId}`;
                break;
        }

        businessUrl = `/wechat/page/${businessUrl}`;

        return (
            <Page
                title="课代表专属页"
                className={`represent-container${
                    !!qrcode ? '' : ' subscribed'
                }`}
            >
                <div className="represent-container__header">
                    <img
                        className="icon"
                        src={require('./assets/icon-success.png')}
                    />
                    <p className="title">
                        恭喜你已成为本{businessName}的课代表！
                    </p>
                </div>
                <div className="content-box">
                    <div className="title">课代表权益说明：</div>
                    <div className="item">
                        <span>所属{businessName}：</span>
                        <a
                            className="course-link"
                            href={businessUrl}
                            style={{ lineHeight: 'normal' }}
                        >
                            <span className="topic-title c-ml-20 c-mr-10 elli">
                                {businessInfo.name}
                            </span>
                            <img
                                src={require('./assets/icon-right.png')}
                                width={18}
                                height={18}
                            />
                        </a>
                    </div>
                    <div className="item">
                        <span>分成比例</span>
                        <span className="text-active c-fb">{percent}%</span>
                    </div>
                    <div className="item">
                        <span>分成范围</span>
                        <span className="text-active c-fb">
                            本{businessName}付费或购买赠礼
                        </span>
                    </div>
                </div>
                <div className="content-box">
                    <div className="title">
                        你可以通过以下3种方式推广赚收益：
                    </div>
                    <div className="item">
                        <div className="flex flex-vcenter">
                            <img
                                src={require('./assets/icon-share.png')}
                                className="icon"
                            />
                            <span>转发{businessName}给好友</span>
                        </div>
                        <span
                            className="action text-active"
                            onClick={() =>
                                this.setState({ showModalShare: true })
                            }
                        >
                            一键转发
                        </span>
                    </div>
                    <div className="item">
                        <div className="flex flex-vcenter">
                            <img
                                src={require('./assets/icon-link.png')}
                                className="icon"
                            />
                            <span>复制链接放在公众号文章等入口</span>
                        </div>
                        <span
                            className="action text-active"
                            onClick={() =>
                                this.setState({ showModalClipboard: true })
                            }
                        >
                            复制链接
                        </span>
                    </div>
                    <div className="item">
                        <div className="flex flex-vcenter">
                            <img
                                src={require('./assets/icon-copy.png')}
                                className="icon"
                            />
                            <span>生成邀请卡并分享</span>
                        </div>
                        <span
                            className="action text-active"
                            onClick={() =>
                                this.handleShareCardGenerate(businessType)
                            }
                        >
                            点击生成
                        </span>
                    </div>
                </div>
                {!!this.state.qrcode && (
                    <div className="content-box">
                        <div className="title">收益提现说明</div>
                        <div className="text-center">
                            <img src={qrcode} className="qr-code" />
                            <div>
                                <p>长按二维码关注公众号</p>
                                <p className="c-mt-5">反馈问题</p>
                            </div>
                        </div>
                    </div>
                )}
                <Curtain
                    className="modal-user-info"
                    isOpen={showModalMoreInfo}
                    maskClosable={false}
                    showCloseBtn
                    onClose={() => this.setState({ showModalMoreInfo: false })}
                >
                    <img
                        className="user-avatar"
                        src={`${headImgUrl ||
                            '//img.qlchat.com/qlLive/liveCommon/normalLogo.png'}?x-oss-process=image/resize,w_75,h_75,m_fill,limit_0`}
                    />
                    <div className="display-text">
                        <p className="title">
                            恭喜你已成为本{businessName}的课代表！
                        </p>
                        <p className="desc">
                            根据
                            <span className="c-color-main">
                                《中华人民共和国互联网安全法》
                            </span>
                            要求，在互联网发布信息、直播等，需进行身份信息验证。请填写你的真实信息，感谢理解和支持。
                        </p>
                    </div>
                    <WechatPhoneBinding
                        wechat={wechatAccount}
                        phone={mobile}
                        onSuccess={this.handleInfoBindingSuccess}
                        onFail={({ msg }) =>
                            window.toast(msg || '提交信息失败')
                        }
                    />
                </Curtain>
                <Curtain
                    className="modal-subscribe"
                    isOpen={showModalSubscribe}
                    maskClosable={false}
                    showCloseBtn
                    onClose={() => this.setState({ showModalSubscribe: false })}
                >
                    <div className="c-text-center c-mt-20">
                        <img src={qrcode} className="qr-code" />
                        <p>扫描二维码并关注我们</p>
                        <p className="c-mt-10">
                            及时获取
                            <span className="c-color-main">
                                课程收入、分成动态
                            </span>
                        </p>
                    </div>
                </Curtain>
                <Curtain
                    className="modal-clipboard"
                    isOpen={showModalClipboard}
                    maskClosable={false}
                    showCloseBtn
                    onClose={() => this.setState({ showModalClipboard: false })}
                >
                    <div className="c-text-center c-mt-20">
                        <p className="title">收益链接</p>
                        <p className="c-mt-30">
                            可配置到文章、图文或其他可点击入口
                        </p>
                        <p className="c-mt-10">
                            链接地址：（链接已经过特殊处理）
                        </p>
                        <div className="link c-mt-30 c-ellipsis">
                            {this.state.shareUrl}
                        </div>
                        <CopyToClipboard
                            text={this.state.shareUrl}
                            onCopy={this.onCopyLink}
                        >
                            <div className="btn-copy">一键复制</div>
                        </CopyToClipboard>
                    </div>
                </Curtain>
                {showModalShare && (
                    <div
                        className="curtain-share"
                        onClick={e =>
                            e.target.className === 'curtain-share' &&
                            this.setState({ showModalShare: false })
                        }
                    >
                        <div className="curtain-share__content-box">
                            <img
                                src="http://img.qlchat.com/qlLive/liveCommon/page-loading.png"
                                width={80}
                                height={80}
                            />
                            <div className="c-ml-30">
                                <p>页面经过了特殊处理，</p>
                                <p className="c-mt-15">
                                    点击
                                    <span className="c-color-main c-fb">
                                        右上方“...”
                                    </span>
                                    直接转发给好友
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        userInfo: (state.common.userInfo && state.common.userInfo.user) || {},
        channelInfo: state.channel.channelInfo || {},
        topicInfo: state.topic.topicInfo || {},
        liveInfo: state.live.liveInfo.entity || {},
        channelDistributionInfo:
            state.distribution.channelDistributionInfo || {},
        liveDistributionInfo: state.distribution.liveDistributionInfo || {},
        topicDistributionInfo: state.distribution.topicDistributionInfo || {}
    };
}

const mapActionToProps = {
    getChannelInfo,
    getTopicInfo,
    getLiveInfo,
    getUserInfoP,
    getChannelSharePercent,
    getChannelShareQualify,
    updateUserInfo
};

module.exports = connect(mapStateToProps, mapActionToProps)(Represent);
