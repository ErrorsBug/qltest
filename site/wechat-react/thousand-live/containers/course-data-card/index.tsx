import { getAllConfig, getTopicInfo, request } from 'common_actions/common';
import Curtain from 'components/curtain/index';
import { logQRCodeTouchTrace } from 'components/log-util';
import Page from 'components/page';
import { fomatFloat, locationTo, numberFormat } from 'components/util';
import { autobind } from 'core-decorators';
import * as html2canvas from 'html2canvas';
import * as moment from 'moment';
import * as QRCode from 'qrcode.react';
import * as React from 'react';
import { connect } from 'react-redux';

@autobind
class CourseDataCard extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            loading: true,
            cardImg: '',
            courseInfo: {},
            courseData: {},
            // 是否为机构版
            isLiveAdmin: false,
            // 是否在服务号白名单
            isWhite: false,
            cardboxOffsetTop: undefined
        };
    }

    isTouching = false;

    touchTimer = null;

    async componentDidMount() {
        typeof _qla != 'undefined' && _qla.collectVisible();
        const {
            params: { topicId }
        } = this.props;
        await this.initCourseData(topicId);
        await this.initUserConfig(this.state.courseInfo.liveId);
        // 生成课程数据邀请卡
        this.generateCard();

        // 隐藏微信分享菜单
        wx && wx.ready(() => {
            wx.hideOptionMenu();
        });
    }

    // 获取用户配置
    initUserConfig = async liveId => {
        const res = await getAllConfig({ liveId });
        if (res.state.code === 0) {
            const {
                data: { isLiveAdmin, isWhite }
            } = res;
            this.setState({
                isLiveAdmin: isLiveAdmin,
                isWhite: isWhite
            });
        }
        1;
    };

    // 初始化课程数据
    initCourseData = async topicId => {
        // 获取关联话题信息
        const resTopicInfo = await this.props.getTopicInfo(topicId);
        if (resTopicInfo.state.code == 0) {
            const courseInfo = resTopicInfo.data.topicPo || {};
            this.initUserConfig(courseInfo.liveId);
            this.setState({
                courseInfo
            });
        }
        // 获取课程数据
        const resCourseData = await request({
            url: '/api/wechat/transfer/h5/dataPage/get',
            method: 'POST',
            body: {
                topicId
            }
        });
        if (resCourseData.state.code == 0) {
            this.setState({
                courseData: resCourseData.data
            });
        }
    };

    generateCard = () => {
        const domImg: any = document.querySelector('#course-data-card-tmpl');

        const opts = {
            dpi: window.devicePixelRatio,
            // scale: 1/0.75,
            backgroundColor: null, // 背景透明
            useCORS: true // 允许跨域
        };

        html2canvas(domImg, opts).then(canvas => {
            const context: any = canvas.getContext('2d');
            // 禁用抗锯齿和平滑模式，以提高图片导出质量和效率
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;

            // 计算卡片距离视窗顶部的偏移量，以居中显示
            const cardboxOffsetTop =
                (document.body.clientHeight -
                    150 -
                    document
                        .querySelector('.course-data-card-box')
                        .getBoundingClientRect().height) /
                2;

            this.setState(
                {
                    cardImg: canvas.toDataURL('image/png'),
                    cardboxOffsetTop
                },
                () =>
                    setTimeout(() => {
                        this.setState({ loading: false });
                    }, 600)
            );
        });
    };

    /* 上报长按统计 */
    touchStartHandle() {
        this.isTouching = true;
        this.touchTimer = setTimeout(() => {
            if (this.isTouching) {
                logQRCodeTouchTrace('wclQrcode');
            }
        }, 700);
    }

    touchEndHandle() {
        if (this.isTouching) {
            clearTimeout(this.touchTimer);
            this.isTouching = false;
        }
    }

    render() {
        const {
            params: { topicId }
        } = this.props;
        const {
            showModal = false,
            loading,
            cardImg,
            courseInfo,
            courseData,
            isLiveAdmin,
            isWhite,
            cardboxOffsetTop
        } = this.state;

        const { topic = '', liveName, liveLogo, style } = courseInfo;

        const {
            commentNum,
            duration,
            liveTime,
            interactNum,
            browseNum,
            followerCount,
            likeNum,
            status
        } = courseData;

        // 判断是否为媒体类的话题
        const isMediaTopic = !(style === 'normal' || style === 'ppt');

        // 判断是否为互动类的媒体类话题
        const isMediaTopicInteractive =
            isMediaTopic && (style === 'audio' || style === 'video');

        let durationNode: any = '';

        // 显示时分秒，若最长单位为“时”，则隐藏“秒”
        if (isMediaTopic) {
            // 解析媒体时长(时分秒)
            const topicDuration = moment.duration({
                seconds: Math.round(liveTime || duration)
            });
            const { seconds, minutes, hours, days } = topicDuration._data;
            // 获取真实时长，单位时
            const realHours = topicDuration.asHours();

            durationNode =
                liveTime || duration ? (
                    realHours < 10 ? (
                        <span>
                            {days || hours ? (
                                <span>
                                    {hours + days * 24}
                                    <span className="c-fs-18">时</span>
                                </span>
                            ) : (
                                ''
                            )}
                            {hours || minutes ? (
                                <span>
                                    {minutes}
                                    <span className="c-fs-18">分</span>
                                </span>
                            ) : (
                                ''
                            )}
                            {days || hours ? (
                                ''
                            ) : seconds ? (
                                <span>
                                    {seconds}
                                    <span className="c-fs-18">秒</span>
                                </span>
                            ) : (
                                ''
                            )}
                        </span>
                    ) : (
                        <span>
                            {Math.floor(realHours)}
                            <span className="c-fs-18">时</span>
                        </span>
                    )
                ) : (
                    <span>0</span>
                );
        }

        let liveStatus = '未开始';

        switch (status) {
            case 'beginning':
                liveStatus = '直播中';
                break;
            case 'ended':
                liveStatus = '已结束';
                break;
            default:
                break;
        }

        const showLogo = isLiveAdmin === 'N' && isWhite === 'N';

        const interactVal = isMediaTopicInteractive ? interactNum : commentNum;

        /* 互动数、讨论数、粉丝数和点赞数均以万为单位显示 */
        // 互动或讨论数
        const interactNumNode =
            interactVal > 10000 ? (
                <span>
                    {fomatFloat(
                        interactVal / 10000,
                        interactVal > 10000000 ? 0 : 1
                    )}
                    <span className="c-fs-18">万</span>
                </span>
            ) : (
                numberFormat(interactVal, '')
            );
        // 累计粉丝数
        const followerNumNode =
            followerCount > 10000 ? (
                <span>
                    {fomatFloat(
                        followerCount / 10000,
                        followerCount > 10000000 ? 0 : 1
                    )}
                    <span className="c-fs-18">万</span>
                </span>
            ) : (
                numberFormat(followerCount, '')
            );
        // 点赞数
        const likeNumNode =
            likeNum > 10000 ? (
                <span>
                    {fomatFloat(likeNum / 10000, likeNum > 10000000 ? 0 : 1)}
                    <span className="c-fs-18">万</span>
                </span>
            ) : (
                numberFormat(likeNum, '')
            );

        /* 
            中间页go.html会decode一次
            target指访问的目标链接，pre是返回跳转的地址
        */
        const qrcodeUrl = `https://ql.kxz100.com/api/gos?target=${encodeURIComponent(
            `${window.location.origin}/topic/details?topicId=${topicId ||
                ''}&wcl=courseDataCard`
        )}&pre=${encodeURIComponent(
            `/wechat/page/topic-intro?topicId=${topicId}`
        )}`;

        return (
            <Page title="课程数据卡" className="page-course-data-card">
                <div className="course-data-card-container">
                    <div
                        className={`course-data-card-box c-flex-center${
                            loading ? ' out-of-view' : ''
                        }`}
                        {...(cardboxOffsetTop > 0
                            ? { style: { marginTop: cardboxOffsetTop } }
                            : {})}
                    >
                        {/* 由于html2canvas插件导出的图片模糊，暂时采用以实际渲染的dom为直观视图，底部放置真正需要保存的图片，并利用点击穿透的原理来实现该场景需求的方案 */}
                        <div className="wrapper-box">
                            <div id="course-data-card-tmpl">
                                <div className="container">
                                    <div className="header">
                                        {showLogo && (
                                            <img
                                                className="logo"
                                                src={require('./img/logo.png')}
                                            />
                                        )}
                                    </div>
                                    <div className="live-intro">
                                        <div className="live-intro__avatar">
                                            <img
                                                src={liveLogo}
                                                style={{
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            />
                                        </div>
                                        <div className="c-fs-24 c-mt-20 c-ellipsis">
                                            {liveName}
                                        </div>
                                        {/* 由于canvas暂不支持"c-ellipsis-line-*"类的画图，为保证此文字的输出，采用slice方法截取前30个字符 */}
                                        <div
                                            className="c-fs-24 c-mt-10 c-mb-10 c-fb"
                                            style={{ lineHeight: 1.5 }}
                                        >
                                            {`《${
                                                topic.length > 26
                                                    ? `${topic.slice(0, 26)}...`
                                                    : topic
                                            }》`}
                                        </div>
                                        {status !== 'ended' && (
                                            <div className="live-intro__status">
                                                {liveStatus}
                                            </div>
                                        )}
                                    </div>
                                    <div className="course-data">
                                        <div className="course-data__count--main">
                                            <div className="c-fs-40">
                                                学习人次
                                            </div>
                                            <div className="c-fb c-mt-20 c-fs-100">
                                                {numberFormat(browseNum, '')}
                                            </div>
                                        </div>
                                        <div className="course-data__count--sub">
                                            <div>
                                                <div className="c-fs-22">
                                                    {isMediaTopicInteractive
                                                        ? '互动'
                                                        : '讨论'}
                                                    数
                                                </div>
                                                <div className="c-fs-32 c-mt-15">
                                                    {interactNumNode}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="c-fs-22">
                                                    累计粉丝
                                                </div>
                                                <div className="c-fs-32 c-mt-15">
                                                    {followerNumNode}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="c-fs-22">
                                                    {isMediaTopic
                                                        ? `${
                                                              style ===
                                                                  'audioLive' ||
                                                              style ===
                                                                  'videoLive'
                                                                  ? '直播'
                                                                  : '课程'
                                                          }时长`
                                                        : '点赞数'}
                                                </div>
                                                <div className="c-fs-32 c-mt-15">
                                                    {isMediaTopic
                                                        ? durationNode
                                                        : likeNumNode}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="course-qrcode">
                                        <div className="course-qrcode__container on-visible">
                                            <QRCode
                                                value={qrcodeUrl}
                                                renderAs="svg"
                                            />
                                        </div>
                                        <div className="c-mt-10 c-fs-24">
                                            扫码一起看直播
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="bg-cover bg-cover-2"
                                    style={{
                                        background: `url(${require('./img/card-bg.jpg')}) center / cover no-repeat`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* 实际保存的成品卡图片 */}
                    <img
                        className={`course-data-card-output on-visible${
                            loading ? ' out-of-view' : ''
                        }`}
                        src={cardImg}
                        onTouchStart={this.touchStartHandle}
                        onTouchEnd={this.touchEndHandle}
                        log-region="DataCard"
                        log-pos={`longtouch_${style}`}
                    />
                    <div className="course-data-card-tips c-fs-22 c-text-center">
                        <p>长按页面，可以保存数据海报</p>
                        <p className="c-pt-10">
                            发送到朋友圈或者好友，一起来看直播
                        </p>
                    </div>
                </div>
                <div
                    className="bg-cover bg-cover-1"
                    style={{
                        background: `url(${require('./img/card-bg.jpg')}) center / cover no-repeat`
                    }}
                />
                <div
                    className="page-btn-back"
                    onClick={() =>
                        locationTo(`/topic/details?topicId=${topicId}`)
                    }
                >
                    返回上课页
                </div>
                {loading && (
                    <div className="loading">
                        <img
                            className="icon-loading"
                            src={require('./img/loading.gif')}
                        />
                        <p className="c-mt-20">数据加载中</p>
                    </div>
                )}
                <Curtain
                    isOpen={showModal}
                    showCloseBtn={false}
                    onClose={() => this.setState({ showModal: false })}
                >
                    <img
                        src={require('./img/icon-fingerprint.png')}
                        className="icon-fingerprint"
                    />
                    <div className="curtain-tips">
                        长按页面，可以保存数据海报哦~
                    </div>
                </Curtain>
            </Page>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapActionToProps = {
    getTopicInfo
};

export default connect(mapStateToProps, mapActionToProps)(CourseDataCard);
