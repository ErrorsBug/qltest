import * as React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { locationTo } from '../../../../components/util';

import styles from './style.scss';

import { fetchKnowledgeStoreInfo, fetchOrdersIncomeInfo } from '../../../../actions/manage';

export interface OrderIncomeProps {
    liveId: string;
    location?: any;
    fetchKnowledgeStoreInfo?: (params: any) => void;
    fetchOrdersIncomeInfo?: (params: any) => void;
}

@autobind
class OrderIncome extends React.Component<OrderIncomeProps, any> {
    state = {
        // 是否开通知识店铺
        isKnowledgeStore: false,
        // 直播间版本
        liveVersion: '基础版',
        // 直播间头像
        liveHeadImage: '',
        // 直播间名称
        liveName: '',
        // 直播间二维码
        liveQr: '',
        // 店内可提现金额
        amountWithDrawable: 0,
        // 今日推广订单
        ordersToday: 0,
        // 今日收益
        incomeToday: 0,
        // 累计推广订单
        ordersTotal: 0,
        // 累计收益
        incomeTotal: 0,
        // 是否展示知识店铺二维码
        displayQr: false,
        // 是否使收益数据处于可见状态
        incomeVisible: false,
    }

    get liveId() {
        return this.props.liveId || "";
    }

    // 展示知识店铺的二维码
    displayQr() {
        this.setState({
            displayQr: true,
        })
    }

    // 隐藏知识店铺的二维码
    hideQr() {
        this.setState({
            displayQr: false,
        })
    }

    // 展示或者隐藏收益数据
    toggleIncomeView() {
        this.setState({
            incomeVisible: !this.state.incomeVisible
        }, () => {
            const __INCOME_VISIBLE__ = this.state.incomeVisible ? 'Y' : 'N';
            localStorage.setItem('__INCOME_VISIBLE__', __INCOME_VISIBLE__);
        });
    }

    // 跳转至用户画像页面
    gotoUserPortrait() {
        locationTo([`/pc/knowledge-mall/user-portrait`]);
    }

    // 跳转至商城首页
    gotoMallIndex() {
        locationTo(['/pc/knowledge-mall/index']);
    }

    // 跳转至H5端的提现页面
    gotoProfitPage() {
        locationTo(['/wechat/page/mine-profit']);
    }

    // 跳转至服务升级页面
    gotoUpgradePage() {
        locationTo(['/wechat/page/live-studio/intro-nologin?type=h5']);
    }

    // 跳转至用户直播间页面
    gotoLivePage() {
        locationTo([this.state.liveQr.split('=').pop()]);
    }

    // 查询直播间信息
    fetchLiveInfo(liveId) {
        Promise.all([this.props.fetchKnowledgeStoreInfo({ liveId }), this.props.fetchOrdersIncomeInfo({ liveId })])
            .then(([liveInfoResult, incomeInfoResult]: any[]) => {
                if (liveInfoResult.state.code === 0) {
                    const data = liveInfoResult.data.knowledgeLiveInfo;
                    this.setState({
                        liveHeadImage: data.liveLog,
                        liveName: data.liveName,
                        liveVersion: data.liveVersion,
                        liveQr: data.liveQrCode
                    });
                }
                if (incomeInfoResult.state.code === 0) {
                    const data = incomeInfoResult.data;
                    this.setState({
                        ordersToday: data.todayOrderNum,
                        ordersTotal: data.totalOrderNum,
                        incomeToday: data.todayProfit,
                        incomeTotal: data.totalProfit,
                        amountWithDrawable: data.balanceMoney
                    });
                }
            });
    }

    componentDidMount() {
        // 从本地存储中查询收益数据的显示状态
        const __INCOME_VISIBLE__ = localStorage.getItem('__INCOME_VISIBLE__');
        this.setState({ 
            incomeVisible: __INCOME_VISIBLE__ === 'Y'
        });
        // 查询知识店铺的信息
        if (this.liveId) {
            this.setState({
                isKnowledgeStore: true
            });
            this.fetchLiveInfo(this.liveId);
        }
    }

    componentWillReceiveProps(nextProps) {
        // 用户选择了要登录的直播间
        // 或者 用户没有选择直播间，默认使用用户自己创建的直播间
        if (nextProps.liveId || nextProps.creatorList.length) {
            this.setState({
                isKnowledgeStore: true
            });
            if (nextProps.liveId) {
                this.fetchLiveInfo(nextProps.liveId);
            } else if (nextProps.creatorList.length) {
                this.fetchLiveInfo(nextProps.creatorList[0].liveId);
            }
        }
    }

    render() {
        const {
            isKnowledgeStore,
            liveHeadImage,
            liveName,
            liveVersion,
            liveQr,
            displayQr,
            incomeVisible,
            amountWithDrawable,
            ordersToday,
            ordersTotal,
            incomeToday,
            incomeTotal,
        } = this.state;

        return (
            <div className={styles.mainContainer}>
                <div className={styles.headTip}>我的知识店铺</div>
                <div className={styles.myStore}>
                    <div className={styles.overviewCard}>
                        {
                            isKnowledgeStore ?
                                <div className={styles.overviewWrapper}>
                                    <div className={styles.conentWrapper}>
                                        <div className={styles.leftContent}>
                                            <img alt="直播间Logo" src={`${liveHeadImage}@292h_292w_1e_1c_2o`} />
                                        </div>
                                        <div className={styles.rightContent}>
                                            <div>
                                                <h1 className={styles.liveName}>{liveName}</h1>
                                                <div className={styles.liveVersion}>
                                                    <span className={styles.basicLive}>{liveVersion}</span>
                                                    { liveVersion === '基础版' && <span className={styles.updateLive}><a href="/wechat/page/live-studio/intro-nologin?type=h5" target="_blank"><em>服务升级</em><i></i></a></span> }
                                                </div>
                                            </div>
                                            <div className={styles.profitInfo}>
                                                <span className={styles.amount}>店内可提现金额: { incomeVisible ? `￥${amountWithDrawable}` : '****' }</span>
                                                <span className={classNames({
                                                    [styles.viewSwitcher]: true,
                                                    [styles.iconCloseEyes]: !incomeVisible
                                                })} title={incomeVisible ? '点击隐藏收益' : '点击展示收益'} onClick={this.toggleIncomeView}>
                                                </span>
                                                <span className={styles.withDraw}><a href={`${location.origin}/wechat/page/live/profit/overview/${this.props.liveId}`} target="_blank">提现</a></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.buttons}>
                                        <div className={styles.jumpButton}><i className={styles.iconMall}></i><span><a href={this.state.liveQr.split('=').pop()} target="_blank">进入店铺</a></span></div>
                                        <div className={styles.verticalBar}></div>
                                        <div className={styles.jumpButton} onMouseOver={this.displayQr} onMouseOut={this.hideQr}><i className={styles.iconPhone}></i><span>手机端访问</span></div>
                                    </div>
                                    {
                                        displayQr &&
                                        <div className={styles.scanQr}>
                                            <i className={styles.triangle}></i>
                                            <div><img alt="知识店铺二维码" src={liveQr} /></div>
                                            <span>微信扫一扫查看店铺</span>
                                        </div>
                                    }
                                </div>
                            :
                                <div className={styles.notActivate}>
                                    <div className={styles.notActivateTip}>
                                        <img alt="" src={require('./img/icon_smile.png')} /><span>暂未激活店铺</span>
                                    </div>
                                    <div className={styles.activateButtons}>
                                        <span>激活方式: </span><span className={styles.activateButton} onClick={this.gotoUserPortrait}>填写画像</span>
                                        <span className={styles.activateButton} onClick={this.gotoMallIndex}>转载课程</span>
                                    </div>
                                </div>
                        }
                    </div>
                    <div className={styles.statCardsWrapper}>
                        <div className={styles.todayOrdersCard}>
                            <div className={styles.count}>{ordersToday}</div>
                            <div className={styles.cardTip}>今日推广订单</div>
                        </div>
                        <div className={styles.todayIncomeCard}>
                            <div className={styles.count}>{ incomeVisible ? `￥${incomeToday}` : '****' }</div>
                            <div className={styles.cardTip}>
                                <span>今日收益</span>
                                <i className={classNames({
                                    [styles.iconViewStat]: true,
                                    [styles.iconCloseView]: !incomeVisible
                                })} onClick={this.toggleIncomeView} title={incomeVisible ? '点击隐藏收益' : '点击展示收益'}></i>
                            </div>
                        </div>
                        <div className={styles.totalOrdersCard}>
                            <div className={styles.count}>{ordersTotal}</div>
                            <div className={styles.cardTip}>累计推广订单</div>
                        </div>
                        <div className={styles.totalIncomeCard}>
                            <div className={styles.count}>{ incomeVisible ? `￥${incomeTotal}` : '****' }</div>
                            <div className={styles.cardTip}>
                                <span>累计收益</span>
                                <i className={classNames({
                                    [styles.iconViewStat]: true,
                                    [styles.iconCloseView]: !incomeVisible
                                })} onClick={this.toggleIncomeView} title={incomeVisible ? '点击隐藏收益' : '点击展示收益'}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    liveId: state.common.liveInfo.liveId,
    creatorList: state.common.userMgrLiveList.creatorList,
    manageList: state.common.userMgrLiveList.manageList,
});

const mapActionToProps = {
    fetchKnowledgeStoreInfo,
    fetchOrdersIncomeInfo,
};


export default connect(mapStateToProps, mapActionToProps)(OrderIncome);

