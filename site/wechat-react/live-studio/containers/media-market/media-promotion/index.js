import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import Switch from 'components/switch';
import { isWeixin } from 'components/envi';
import { MiddleDialog, Confirm } from 'components/dialog';
import AlternativeChannelCard from './components/aternative-channel-card';
import PromotionalChannelCard from './components/promotional-channel-card';
import AlternativeChannelConfirm from './components/alternative-channel-confirm';
import PromotionalChannelConfirm from './components/promotional-channel-confirm';
import { 
        // fetchIsAutoPromote, 
        // saveAutoPromote,
        fetchAlternativeChannels,
        fetchPromotionalChannels,
        getConditions,
       } from '../../../actions/live-studio';
import { locationTo } from '../../../../components/util';

const emptyTipImg = require('./img/empty.png');

@autobind
class MediaPromotion extends Component {

    constructor(props){
        super(props);
        this.state = {
            // 页面title
            title: '推广投放',
            // 是否展示课程上架协议
            showAgreementStatement: false,
            // 是否展示“什么是推广投放”模态窗
            showPromotionModal: false,
            // 是否开启自动推广
            // openAutoPromote: false,
            // 展示“备选系列课(alternative)” or "成功投放中(promotional)"
            activeTab: ['alternative', 'promotional'].indexOf(this.activeTab) >= 0 ? this.activeTab : 'alternative',
            // 备选系列课列表
            alternativeChannels: [],
            // 成功投放中系列课列表
            promotionalChannels: [],
            // 备选系列课数据加载完毕
            alternativeNoMore: false,
            // 投放中系列课数据加载完毕
            promotionalNoMore: false,
            // 备选系列课列表数据为空
            alternativeNoneOne: false,
            // 投放中系列课列表数据为空
            promotionalNoneOne: false,
            // 备选库入选条件 - 报名人数
            conditionAuthNum: 200,
            // 备选库入选条件 - 报名人数
            conditionLearningNum: 500,
            // 显示顶层固定的Tab切换栏
            // showFixedTabSwitcher: false,
        }
    
        this.data = {
            // Tab标签
            tabs: [
                {
                    text: '备选系列课',
                    tag: 'alternative'
                },
                {
                    text: '成功投放中',
                    tag: 'promotional',
                }
            ],
            // 分页数据
            pageSize: 20,
            alternativePage: 1,
            promotionalPage: 1,
        }
    }
    
    get activeTab(){
        return this.props.location.query.activeTab;
    }

    get liveId(){
        return this.props.params.liveId;
    }

    /**
     * Tab切换
     */
    switchTab = (e) => {
        const tag = e.target.getAttribute('data-tag');
        this.setState({
            activeTab: tag
        });
    }

    /**
     * 展示模态窗
     */
    displayModal = () => {
        this.setState({
            showPromotionModal: true
        })
    }

    /**
     * 隐藏模态窗
     */
    hideModal = () => {
        this.setState({
            showPromotionModal: false
        })
    }

    /**
     * 处理“自动推广”开关变动
     */
    // hookSwitchChange = () => {
    //     this.refs['switch-confirm-dialog'].show();
    // }

    /**
     * 点击“自动推广”确认框的按钮
     */
    // hookConfirmClick = async (buttonTag) => {
    //     // 点击“确定”后
    //     if (buttonTag === 'confirm') {
    //         const autoPromoteStatus = this.state.openAutoPromote;
    //         // 1. 发送HTTP请求
    //         const liveId = this.liveId;
    //         const isOpenPublish = autoPromoteStatus ? 'N' : 'Y';
    //         const result = await this.props.saveAutoPromote({liveId, isOpenPublish});
    //         if (result.state.code === 0) {
    //             // 2. 切换开关状态；
    //             this.setState({
    //                 openAutoPromote: !autoPromoteStatus,
    //             });
    //             // 3. 如果是全局关闭操作，那么所有备选库的系列课切换为关闭推广状态，所有成功投放的系列课全部下架
    //             if (isOpenPublish === 'N') {
    //                 this.setState({
    //                     alternativeChannels: this.state.alternativeChannels.map((channel) => {
    //                         channel.publishStatus = 'N';
    //                         return channel;
    //                     }),
    //                     promotionalChannels: [],
    //                     promotionalNoneOne: true,
    //                 });
    //             }
    //             // 4. 关闭“确认弹框”
    //             this.refs['switch-confirm-dialog'].hide();
    //         } else {
    //             window.toast(result.state.msg);
    //         }
    //     }
    // }

    /**
     * 获取系列课列表数据
     * @param {string} target 'alternative' or 'promotional'
     */
    fetchChannels = async (target, next) => {
        const liveId = this.liveId;
        const pageKey = `${target}Page`;
        const channelKey = `${target}Channels`;
        const noMoreKey = `${target}NoMore`;
        const noneOneKey = `${target}NoneOne`;
        const page = {
            size: this.data.pageSize,
            page: this.data[pageKey]
        };
        let result = {};
        if (target === 'alternative') {
            result = await this.props.fetchAlternativeChannels({liveId, page});
        } else {
            result = await this.props.fetchPromotionalChannels({liveId, page});
        }
        if (result.state.code === 0) {
            const channelList = result.data.channelList;
            // 没有数据
            if (channelList.length == 0 && page.page == 1) {
                this.setState({
                    [noneOneKey]: true
                });
                return;
            }
            // 将新获取到的channels推入数组
            this.setState({
                [channelKey]: [...this.state[channelKey], ...channelList]
            });
            // 数据加载完毕
            if (channelList.length < this.data.pageSize) {
                this.setState({
                    [noMoreKey]: true
                });
            }
            // 页码+1s
            this.data[pageKey] += 1;
        } else {
            window.toast(result.state.msg);
        }
        next && next();
    }

    /**
     * 获取进入备选库的条件
     */
    fetchConditions = async () => {
        const result = await this.props.getConditions();
        if (result.state.code === 0) {
            const data = result.data;
            this.setState({
                conditionAuthNum: data.authNum,
                conditionLearningNum: data.learningNum
            });
        } else {
            window.toast(result.state.msg);
        }
    }

    /**
     * 查询用户是否已经开启自动推广
     */
    // componentWillMount = async () => {
    //     const result = await this.props.fetchIsAutoPromote({liveId: this.liveId});
    //     if (result.state.code === 0) {
    //         this.setState({
    //             openAutoPromote: result.data.isOpenPublish === 'Y'
    //         })
    //     } else {
    //         window.toast(result.state.msg);
    //     }
    // }

    /**
     * 从已投放系列课列表中移除已经下架的系列课
     * @param {object} offshelfChannel 需要移除的系列课
     */
    removePromotional = (offshelfChannel) => {
        // 成功投放列表中移除该系列课
        const {promotionalChannels} = this.state;
        this.setState({
            promotionalChannels: promotionalChannels.filter((channel) => channel.channelId != offshelfChannel.channelId)
        });
        // 备选系列课列表数据刷新
        this.setState({
            alternativeChannels: []
        });
        this.data.alternativePage = 1;
        this.fetchChannels('alternative');
    }

    /**
     * 更新已投放系列课的相关信息
     * @param {object} channel 待更新的系列课
     * @param {object} newInfo 新的系列课信息
     */
    updatePromotional = (channel, newInfo) => {
        const {promotionalChannels} = this.state;
        this.setState({
            promotionalChannels: promotionalChannels.map(item => {
                if (channel.channelId == item.channelId) {
                    return {
                        ...channel,
                        ...newInfo
                    };
                } else {
                    return item;
                }
            })
        });
    }

    /**
     * 展示课程上架协议
     */
    displayAgreementStatement = () => {
        this.setState({
            showAgreementStatement: true,
            title: '课程上架协议'
        })
    }

    /**
     * 隐藏课程上架协议
     */
    hideAgreementStatement = () => {
        this.setState({
            showAgreementStatement: false,
            title: '推广投放'
        });
    }

    componentDidMount = async () => {
        // 获取备选系列课列表数据
        this.fetchChannels('alternative');
        // 获取进入备选库的条件
        this.fetchConditions();
        // 首次进入该页面，展示“什么是推广投放”模态窗
        if (window.localStorage && !window.localStorage.getItem('has_shown_modal')) {
            this.displayModal();
            window.localStorage.setItem('has_shown_modal', 'Y');
        }
        // 获取投放中系列课列表数据
        this.fetchChannels('promotional');
        // 隐藏微信浏览器的分享操作
        if (isWeixin()) {
            const onBridgeReady = () => {
                // hideOptionMenu在ios上会使所有页面失去分享功能
                window.jWeixin.hideOptionMenu();
            }
            if ( document.addEventListener ) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }
    }

    componentWillUnmount = () => {
        // 手动恢复微信浏览器的分享功能
        if (isWeixin()) {
            window.jWeixin.showOptionMenu();
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.alternativeChannel !== nextProps.alternativeChannel) {
            const {alternativeChannels} = this.state;
            const {alternativeChannel} = nextProps;
            this.setState({
                alternativeChannels: alternativeChannels.map((channel) => {
                    if (channel.channelId === alternativeChannel.channelId) {
                        return alternativeChannel;
                    } else {
                        return channel;
                    }
                })
            });
        }
        if (this.props.promotionalChannel != nextProps.promotionalChannel) {
            const {promotionalChannels} = this.state;
            const {promotionalChannel} = nextProps;
            this.setState({
                promotionalChannels: promotionalChannels.map((channel) => {
                    if (channel.channelId === promotionalChannel.channelId) {
                        return promotionalChannel;
                    } else {
                        return channel;
                    }
                })
            });
        }
    }

    /**
     * 页面滚动时，固定显示顶部的标签切换栏
     */
    // scrollToDo = () => {
    //     const {showFixedTabSwitcher} = this.state;
    //     const innerTabbar = document.querySelector('.channel-list-wrapper .tabbar');
    //     const eleBox = innerTabbar.getBoundingClientRect();
    //     if (eleBox.top < 0 && !showFixedTabSwitcher) {
    //         this.setState({
    //             showFixedTabSwitcher: true
    //         });
    //     } else if (eleBox.top > 0 && showFixedTabSwitcher) {
    //         this.setState({
    //             showFixedTabSwitcher: false
    //         });
    //     }
    // }

    render(){
        const {tabs} = this.data;
        const {
                title,
                showAgreementStatement,
                showPromotionModal, 
                // openAutoPromote, 
                activeTab, 
                alternativeNoMore, 
                alternativeNoneOne,
                promotionalNoMore,
                promotionalNoneOne,
                alternativeChannels,
                promotionalChannels,
                conditionAuthNum,
                conditionLearningNum,
                showFixedTabSwitcher,
              } = this.state;
        /*----- 去掉自动推广开关 -----*/
        // const topbar = <div className="topbar">
        //                     <div className="topbar-lt">{openAutoPromote ? '开启' : '关闭'}自动推广<span className="promote-tip-button" role="button" onClick={this.displayModal}>什么是自动推广<i className="icon_ask2"></i></span></div>
        //                     <div className="topbar-rt">
        //                         <Switch 
        //                             className="promote-switch"
        //                             active={openAutoPromote}
        //                             onChange={this.hookSwitchChange} />
        //                     </div>
        //                 </div>
        /*----- 去掉自动推广开关 -----*/
        const tabbar = <div className="tabbar" role="tablist">
                            {
                                tabs.map((tab, index) => <a 
                                                            href="javascript:void(0)" 
                                                            role="tab" 
                                                            key={index}
                                                            data-tag={tab.tag}
                                                            onClick={this.switchTab}
                                                            className={`tab-item ${activeTab === tab.tag ? 'active-tab-item' : ''}`}>
                                                            {tab.text}
                                                        </a>)
                            }
                        </div>
        const emptyTip = <div>
                            {/* {topbar} */}
                            {/* {tabbar} */}
                            <div className="empty-tips">
                                <img src={emptyTipImg} alt="空空如也" />
                                <p className="empty-text">加油,您当前暂无满足条件的系列课</p>
                                <p className="promote-condition">进入备选库的条件：报名人数满{conditionAuthNum}，且学习人次满{conditionLearningNum}</p> 
                            </div>
                        </div>
        return (
            <Page title={title} className="media-promotion-container">
                {/* 什么是推广投放 */}
                <MiddleDialog 
                    show={showPromotionModal}
                    buttons='none'
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="whatis-media-promotion"
                    onClose={this.hideModal}
                    title=''>
                    <div className="media-promotion-wrapper">
                        <header className="modal-header">
                            <h1 className="modal-title first-line">什么是</h1>
                            <h1 className="modal-title second-line">推广投放？</h1>
                        </header>
                        <section className="modal-body">
                            <div className="modal-content-item">
                                <div className="icon-item icon-tip"></div>
                                <div className="modal-content-detail">
                                    <h1>说明</h1>
                                    <p>为帮老师们提升课程销量,千聊与媒体渠道合作，在各大知识商城分发优质课程。系列课被采用后，即可按合作比例享受分成收益。<em>90%</em>的课程被推广后销量得到大幅提升。</p>
                                </div>
                            </div>
                            <div className="modal-content-item">
                                <div className="icon-item icon-people"></div>
                                <div className="modal-content-detail">
                                    <h1>备选条件</h1>
                                    <p>报名数满<em>{conditionAuthNum}</em>，学习人次满<em>{conditionLearningNum}</em>即可加入备选库，课程申请推广后，需等待5个工作日进行课程审核，详情可添加珊瑚课程十师姐了解 ，添加微信号：qlbzr10</p>
                                    {/* <p>报名人数满<em>{conditionAuthNum}</em>且学习人次满<em>{conditionLearningNum}</em>，自动进入推广备选库。</p> */}
                                    <p><b>小提示：</b>若您不希望课程被投放,可手动关闭</p>
                                </div>
                            </div>
                        </section>
                        <button type="button" className="i-know-button" onClick={this.hideModal}>我知道了</button>
                        <div className="close-modal" onClick={this.hideModal}></div>
                    </div>
                </MiddleDialog>
                <div className={classnames({
                    'invisible-block': showAgreementStatement
                })}>
                    <span className="promote-tip-button" role="button" onClick={this.displayModal}><i className="icon_ask2"></i>推广</span>
                    {/* {showFixedTabSwitcher && tabbar} */}
                    {tabbar}
                    <div className="channel-list-wrapper">
                        {
                            activeTab === 'alternative' ?
                            (alternativeNoneOne ? emptyTip:
                                    <ScrollToLoad
                                        className='alternative-list'
                                        toBottomHeight={500}
                                        // scrollToDo={this.scrollToDo}
                                        noMore={alternativeNoMore}
                                        loadNext={this.fetchChannels.bind(this, 'alternative')}>
                                        {/* {topbar} */}
                                        {/* {tabbar} */}
                                        {
                                            alternativeChannels.map((channel, index) => <AlternativeChannelCard key={index} channel={{...channel}} />)
                                        }
                                    </ScrollToLoad>)
                            :
                                (promotionalNoneOne ? emptyTip:
                                    <ScrollToLoad
                                        className='promotional-list'
                                        toBottomHeight={500}
                                        // scrollToDo={this.scrollToDo}
                                        noMore={promotionalNoMore}
                                        loadNext={this.fetchChannels.bind(this, 'promotional')}>
                                        {/* {topbar} */}
                                        {/* {tabbar} */}
                                        {
                                            promotionalChannels.map((channel, index) => <PromotionalChannelCard key={index} channel={{...channel}} />)
                                        }
                                    </ScrollToLoad>)
                        }
                    </div>
                        {/* 开启或关闭自动投放 */}
                        {/* <Confirm 
                            className="confirm-dialog switch-confirm"
                            title={`您是否确定${openAutoPromote ? '关闭' : '开启'}自动推广投放`}
                            onBtnClick={this.hookConfirmClick}
                            ref='switch-confirm-dialog'>
                            {
                                openAutoPromote ? '确认关闭后，您的所有课程将不参与自动投放计划' : '确认开启后，您的优质系列课将进入我们的备选库，有机会获得推广投放'
                            }
                        </Confirm> */}
                        {/* 备选系列课的对话框操作 */}
                        <AlternativeChannelConfirm liveId={this.liveId} displayAgreementStatement={this.displayAgreementStatement}/>
                        {/* 已经投放系列课的对话框操作 */}
                        <PromotionalChannelConfirm liveId={this.liveId} removePromotional={this.removePromotional} updatePromotional={this.updatePromotional} />
                </div>
                <div className={classnames('agreement-statement-container', {
                    'invisible-block': !showAgreementStatement
                })}>
                    <div className="agreement-statement-content">
                        <h1>知识产品授权协议</h1>
                        <p>本协议为千聊平台知识产品授权协议，由千聊平台讲师/课程权利人自愿将其投放在千聊平台上的知识产品，授权予千聊，由千聊将其知识产品通过千聊“知识通商城”业务模块进行推广销售，旨在为千聊平台讲师/课程权利人提供更为广阔的课程销售/传播渠道，为讲师/课程权利人获得更大收益。</p>
                        <p>各服务条款前所列索引关键词仅为帮助您理解该条款表达的主旨之用，不影响或限制本协议条款的含义或解释。协议涉及权利转移，为维护您自身权益，请您务必仔细阅读各条款的具体表述。</p>
                        <p><strong>【审慎阅读】</strong>请您在授权知识产品上架前，应当认真阅读（未成年人应当在监管人陪同下阅读）本协议。请您务必审慎阅读、充分理解各条款内容，<strong className="underline">特别是免除或者限制责任的条款、法律适用和争议解决条款。免除或者限制责任的条款将以粗体下划线标识，您应重点阅读。</strong>如您对协议有任何疑问，可向千聊客服咨询。</p>
                        <p><strong>【签约/授权主体】</strong>当您登录千聊账户并操作本授权过程，即表示您是被选课程的知识产权权利人，并且您有权同意本协议授权内容并签署本协议；如您并非被选课程的权利人，请停止本授权操作，或取得权利人的授权后继续进行本授权操作。“千聊”是指千聊平台运营商及关联公司、合作方，包括广州沐思信息科技有限公司、广州思坞信息科技有限公司等。</p>
                        <p><strong>【签约/授权动作】</strong>当您登录千聊平台账户、阅读并同意本协议且完成知识产品上架操作后，即表示已充分阅读、理解并接受本协议的全部内容，并与千聊达成一致，同意千聊按照协议约定的方式使用您的知识产品。<strong className="underline">阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止知识产品的授权操作，取消知识产品的上架程序。</strong></p>
                        <dl>
                            <dt>第一条 定义</dt>
                            <dd>1.1 授权知识产品：是指甲方按照本协议约定授权乙方使用的知识产品，该产品为数字化课程及推文，表现形式包括但不限于文字、语音、图片、视频等，本文又称“课程”。</dd>
                            <dd>1.2 知识通商城：是指千聊知识店铺特有的课程内容供应中心；千聊直播间用户及知识店铺用户（以下称渠道分销商），可在知识通商城自主选择课程转载至自己的直播间或知识店铺进行分发销售，并按照约定的分销比例取得分销收益。内容供应方可通过知识通商城拓展销售渠道，获得更多的课程收益。</dd>
                            <dd>1.3 课程净收益：是指课程实际销售额扣除课程推广销售过程中产生的渠道代理分成、渠道分销提成、优惠券、砍价等营销成本后剩余的课程收益，课程净收益是您与千聊收益分成的基础。</dd>
                        </dl>
                        <dl>
                            <dt>第二条 权利保证及许可</dt>
                            <dd>2.1 授权内容：授权知识产品及与授权知识产品相关的商标、个人姓名（含艺名）以及肖像，前述授权内容由以您实际选择上架的并通过千聊审核的知识产品为准。</dd>
                            <dd>2.2 授权性质及地域范围：授权知识产品在中华人民共和国境内（包括香港、澳门和台湾地区）的信息网络传播权、修改权、汇编权、转授权，以及授权知识产品录制角色的姓名权、肖像权。</dd>
                            <dd>2.3 授权期限：自知识产品上架到千聊平台“知识通商城”起至该知识产品被操作下架；您同意，即便授权期满、知识产品下架，千聊平台仍有权永久保留您的知识产品，以便已购买用户继续使用。</dd>
                            <dd>2.4 您应保证对授权知识产品拥有合法完整的知识产权，包括但不限于信息网络传播权在内的著作权,及其转授权权利；且您应保证授权知识产品不违反法律法规及相关规范性文件，亦不侵犯任何第三方的合法权利；否则，千聊有权下架您的课程，或依法删除您的知识产品。</dd>
                            <dd>2.5 您应尽量保证知识产品内容的质量，不得存在虚假宣传、内容抄袭、无故断更等情况，如您的课程遭到消费者投诉或举报，千聊有权根据投诉、举报的情况下架您的知识产品。</dd>
                            <dd>2.6 除上述的权利保证及授权外，您同意根据您选择的上架模块，授权千聊及相关的渠道分销商、分销人员、转发人员按照本协议约定的方式使用您上传的知识产品，并与您共享收益。</dd>
                        </dl>
                        <dl>
                            <dt>第三条 上架“知识通商城”须知</dt>
                            <dd>3.1 您同意将选定课程上架到知识通商城，供渠道分销商进行分销，并与分销商共享课程收益；本课程的分销收益，您同意仅收取<span className="red-text underline">【20 %】</span>的课程收益，其余归分销商所有；如需修改分销比例的，可与千聊联系进行修改，通过邮件进行确认。</dd>
                            <dd>3.2 知识通商城作为分销课程存储空间，您将课程投放到知识通商城后，即表示同意渠道分销商可在知识通商城挑选您的课程进行分发销售（包括但不限于一级分销、二级分销）；渠道分销商挑选您的课程后，会在其自己知识店铺生产链接，渠道分销商通过分发该链接发生的购买行为，您可按选择的比例获得提成，但购买用户不会对您的直播间/知识店铺产生关注。</dd>
                            <dd>3.3 渠道分销商从知识通商城选定您的课程后，有权对课程推文的文案标题、简介、描述等文字及图片内容进行修改，且经渠道分销商分发后的课程链接，不再显示课程来自千聊平台，而是展现在渠道分销商自己的平台上（包括但不限于微信、微博、京东、淘宝等全网社交、电商平台），您同意上述分销行为，并授权分销商利用合理方式对您的课程进行销售。</dd>
                            <dd>3.4 您应确保课程文案、大纲、图片、老师授课过程中不存在明显的广告与引导其他消费的行为。</dd>
                        </dl>
                        <dl>
                            <dt>第四条 争议解决</dt>
                            <dd>本协议签订地为中国广东省广州市天河区。</dd>
                            <dd>您和千聊均同意，因本协议解释或执行引起的任何争议，双方应首先友好协商解决。协商不成的，你同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。</dd>
                        </dl>
                        <dl>
                            <dt>第五条 协议的修改权及可分性</dt>
                            <dd>为更好地提供服务并符合相关监管政策，千聊有权及时修改本协议条款。本协议如果变更，千聊将提前发布通知。如果本协议修改或变更，而您不能接受修改或变更后的内容，您可以停止使用千聊知识店铺升级版。如果您继续使用，则表明您完全接受并愿意遵守修改或变更后的本协议。</dd>
                            <dd>本协议任一条款被视为废止、无效或不可执行，该条应视为可分的且并不影响本协议其余条款的有效性及可执行性。</dd>
                        </dl>
                        <p>请您再次确认您已全部阅读并充分理解上述协议。</p>
                    </div>
                    <div className="goback-button" role="button" onClick={this.hideAgreementStatement}>返回</div>
                </div>
            </Page>
        )
    }
}

const mapStateToProps = (state) => {
    const {alternativeChannel, promotionalChannel} = state.live;
    return {
        alternativeChannel,
        promotionalChannel,
    }
}

const mapActionToProps = {
    // fetchIsAutoPromote,
    // saveAutoPromote,
    fetchAlternativeChannels,
    fetchPromotionalChannels,
    getConditions,
}

export default connect(mapStateToProps, mapActionToProps)(MediaPromotion);