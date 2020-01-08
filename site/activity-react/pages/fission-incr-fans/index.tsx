import * as React from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
// import uuid from 'uuid'
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'

// components
import Page from '../../components/page';
import RuleDialog from './components/rule-dialog';
import ShareGuideDialog from './components/share-guide-dialog';
import PageMainContent, { IProps } from './components/page-main-content';
import ProgressBar from './components/progress-bar';
import ToastTip from "./components/toast-tip";

import api from '../../utils/api';
import { share } from '../../utils/wx-utils'
import * as ui from '../../utils/ui'
import Confirm from '../../components/dialog/confirm';

import { IActivity, IInitData, IUSer } from './interfaces'

import './style.scss'

@autobind
class FissionIncrFans extends React.Component {

    /** 页面的滚动体 */
    private pageContentRef: HTMLElement;

    /** 页面初始化数据 */
    private initData: IInitData = (window as any).INIT_DATA

    private offlineDialog: Confirm

    state = {
        // 是否显示规则弹框
        showRuleDialog: false,
        // 是否显示分享弹框
        showShareDialog: false,
        // 进度
        progress: 0,
        // 是否可以领取奖品
        canReceive: false,
        // 是否显示tip
        showTip: false,
        // tip里面的加饭数量
        tipNum: 0,
        // 是否是助力端
        isAssistClient: false,
        // 是否关注
        isSubscribe: false,
        // 是否显示二维码
        showQrcode: false,
        // 当前的进度分数
        curScore: 0,
        // 是否已经助力过
        isHelped: false,
    }

    constructor (props: IProps) {
        super(props);

        // this.initData = {
        //     uid: '123',
        //     /** 当前登录的用户ID */
        //     curUserId: '123',
        //     /** 活动id */
        //     actid: '123',
        //     /** 活动用户状态： N未完成活动，Y已完成活动，R已领取奖品 */
        //     status: 'N',
        //     /** 活动用户已获得的活动分值 */
        //     score: 12,
        //     /** 活动信息对象 */
        //     activity: {
        //         /* 主键 */
        //         id: '123',
        //         /* 活动标题 */
        //         title: 'hahahah',
        //         /* 活动总分值 */
        //         score: 20,
        //         /* 活动关联的公众号 */
        //         appId: '123',
        //         /* 关注二维码图片链接 */
        //         qrcode: 'https://qr.api.cli.im/qr?data=https%253A%252F%252Fcli.im%252F&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=8a615f67ca33d3cb30e220c8e22e6bb3',
        //         /* Y：已上线 N：已下线 */
        //         status: 'N'
        //     },
        //     /** 活动用户对象 */
        //     user: {
        //         /* 用户呢称 */
        //         name: 'xiha',
        //         /* 用户ID */
        //         userId: '123',
        //         /* 用户头像 */
        //         headImgUrl: 'sadf'
        //     },
        //     /** 当前用户查看别人的活动时候，会返回， Y：已经助力过，N 还没助力过 */
        //     isHelped: 'N'
        // }
    }

    componentDidMount() {
        if (this.initData.activity.status === 'N') {
            this.offlineDialog.show();
        }

        this.pageContentRef = document.querySelector('.page-container');

        let progress = Math.floor(this.initData.score / this.initData.activity.score * 100);
        this.setState({
            progress,
            curScore: this.initData.score,
            isHelped: this.initData.isHelped === 'Y',
            isAssistClient: !!this.initData.uid && (this.initData.uid != this.initData.curUserId)
        });

        this.initShare();
    }

    s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    
    guid(): string {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    initShare() {
        const uid = this.initData.uid
        const actid = this.initData.actid
        const curUserId = this.initData.curUserId || ''
        const random1 = this.guid()
        const random2 = this.guid()
        const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/activity/${random1}/fissionIncrFans?uid=${curUserId}&actid=${actid}&${random2}`
        share({
            title: this.initData.activity.title,
            desc: '好友来助力，豪礼免费领。',
            shareUrl,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/fission-incr-fans.jpg'
        });
    }

    showRule() {
        this.setState({
            showRuleDialog: true
        })
    }

    closeRuleDialog() {
        this.setState({
            showRuleDialog: false
        })
    }

    closeShareDialog() {
        this.setState({
            showShareDialog: false,
        });
    }

    async showShare() {
        ui.loading(true);
        const isSubscribe = await this.fetchIsSubscribe();
        ui.loading(false);
        if (!isSubscribe) {
            this.setState({
                showQrcode: true
            });
            return
        }

        this.setState({
            showShareDialog: true,
        });
    }

    async startAdd() {
        ui.loading(true);
        const isSubscribe = await this.fetchIsSubscribe();
        ui.loading(false);
        if (!isSubscribe) {
            this.setState({
                showQrcode: true
            });
            return
        } else {
            this.doFirstAddRice();
        }
    }

    async doFirstAddRice() {
        const result = await api('/api/activity/assist/selfhelp', {
            method: 'POST',
            body: {
                activityId: this.initData.actid
            }
        })

        if (result.state.code === 0) {
            let curScore = result.data.score;
            let progress = Math.floor(curScore / this.initData.activity.score * 100);
            this.setState({
                curScore,
                progress,
            });
            return
        } else {
            ui.toast(result.state.msg)
        }
    }

    scrollToTop() {
        requestAnimationFrame(() => {
            this.pageContentRef.scrollTop -= 80;

            if (this.pageContentRef.scrollTop > 0) {
                this.scrollToTop();
            }
        })
    }

    goToForm() {
        const uid = this.initData.uid
        const actid = this.initData.actid
        window.location.href = `/wechat/page/activity/addressForm?uid=${uid}&actid=${actid}`
    }

    async fetchIsSubscribe() {
        const result = await api('/api/activity/assist/isSubscribe')

        if (result.state.code === 0) {
            this.setState({
                isSubscribe: result.data.subscribe === 'Y'
            });
            return result.data.subscribe === 'Y';
        }
    }

    /**
     * 请求助力
     */
    async doHelp() {
        ui.loading(true);
        const isSubscribe = await this.fetchIsSubscribe();
        if (!isSubscribe) {
            this.setState({
                showQrcode: true
            });
            ui.loading(false);
            return
        }

        const result = await api('/api/activity/assist/doHelp', {
            method: 'POST',
            body: {
                activityUserId: this.initData.uid,
                activityId: this.initData.actid
            }
        });
        ui.loading(false);

        if (result.state.code === 0) {
            let curScore = this.state.curScore + result.data.score;
            let progress = Math.floor(curScore / this.initData.activity.score * 100);
            this.setState({
                showTip: true,
                tipNum: result.data.score,
                curScore,
                progress,
            }, () => {
                setTimeout(() => {
                    this.setState({
                        showTip: false,
                        isHelped: true,
                    });
                }, 2000);
            });
        } else {
            ui.toast(result.state.msg);
        }
    }

    meToo() {
        window.location.href = `/wechat/page/activity/fissionIncrFans?actid=${this.initData.actid}`;
    }

    get mainButton() {
        if (this.state.isAssistClient) {
            if (this.state.isHelped || this.initData.status !== 'N') {
                return (
                    <span className='button-text sm' onClick={ this.meToo }>
                        我也要领奖品
                    </span>
                )
            } else {
                return (
                    <span className='button-text' onClick={ this.doHelp }>
                        帮TA加饭
                    </span>
                )
            }
        } else {
            if (this.initData.status === 'N') {
                if (this.state.curScore === 0) {
                    return (
                        <span className='button-text' onClick={ this.startAdd }>
                            开始加饭
                        </span>
                    )
                } else {
                    return (
                        <span className='button-text' onClick={ this.showShare }>
                            继续加饭
                        </span>
                    )
                }
            } else if (this.initData.status === 'Y') {
                return (
                    <span className='button-text' onClick={ this.goToForm }>
                        领取奖品
                    </span>
                )
            } else if (this.initData.status === 'R') {
                return (
                    <span className='button-text'>
                        已领取奖品
                    </span>
                )
            }
        }
    }

    render() {
        return (
            <Page title={this.initData.activity.title}>
                {/* 头部首页展示内容 */}
                <section className='page-top-container'>
                    <img className='bg-top-icon' src={ require('./images/bg-top-icon.png') } />

                    {/* 规则的按钮 */}
                    <img src={require('./images/rule.png')}
                        className='rule-icon' 
                        onClick={ this.showRule }
                    />

                    {/* 助力端用户信息显示 */}
                    <section className={`user-info-container ${this.state.isAssistClient ? '' : 'hide'}`}>
                        <img src={ this.initData.user.headImgUrl + '?x-oss-process=image/resize,h_90,w_90,m_fill' } />
                        
                        <div className='user-info'>
                            <span className='user-name'>{ this.initData.user.name }</span>
                            <span className='invit-tip'>邀请你帮TA加饭免费领电热饭盒</span>
                        </div>
                    </section>

                    {/* 二维码 */}
                    <ReactCSSTransitionGroup
                        transitionName="qrcode"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {
                            this.state.showQrcode &&
                                <section className='qrcode-container'>
                                    <div className='images-wrap'>
                                        <img src={ this.initData.activity.qrcode } className='qrcode-img'/>
                                        <img src={ require('./images/finger.png') } className='finger-icon'/>
                                    </div>
                                    {
                                        this.state.isAssistClient ?
                                            <p>【温馨提示】如需帮助好友，请识别后再点开好友的链接</p>
                                            :
                                            <p>长按识别下方二维码，电热饭盒免费领</p>
                                    }
                                    
                                </section>
                        }
                    </ReactCSSTransitionGroup>
                    
                    
                    <ToastTip show={ this.state.showTip } num={this.state.tipNum} />

                    {
                        !this.state.showQrcode &&
                            <section className={`opration-area`}>
                                {/* progress bar */}
                                <ProgressBar 
                                    progress={ this.state.progress }
                                    curScore={ this.state.curScore }
                                    totalScore={ this.initData.activity.score } />

                                {/* 活动主按钮，中间那个大大的 */}
                                <section className="button-container">
                                    { this.mainButton }
                                    <img src={ require('./images/button.png') } className='button-wrap' />
                                </section>
                            </section>
                    }
                    
                </section>

                {/* 三个tab的容器 */}
                <PageMainContent />

                {/* 底部滚动到顶部的按钮 */}
                <footer className='page-footer' onClick={ this.scrollToTop }>
                    <img src={ require('./images/footer-text.png') } />
                </footer>

                {/* 规则弹框 */}
                <RuleDialog 
                    show={ this.state.showRuleDialog }
                    onCloseRuleDialog={ this.closeRuleDialog }
                />

                {/* 分享弹框 */}
                <ShareGuideDialog
                    show={ this.state.showShareDialog }
                    onCloseShareDialog={ this.closeShareDialog }
                />

                {/* 活动下线弹框 */}
                <Confirm
                    ref={ dom => this.offlineDialog = dom }
                    title='亲，本期奖品已经全部派完啦！'
                    content='没有中奖的朋友不用灰心，请留意公众号“千聊亲子”，每期都有丰富礼品领取！如有其他疑问，可添加客服qlfeng7'
                    buttons='confirm'
                    confirmText='我知道啦'
                    onConfirm={ () => this.offlineDialog.hide() }
                />
            </Page>
        );
    }
}

render(<FissionIncrFans />, document.getElementById('app'));