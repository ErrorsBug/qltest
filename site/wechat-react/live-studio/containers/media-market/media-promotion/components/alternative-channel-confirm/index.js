import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Confirm } from 'components/dialog';
import { locationTo } from 'components/util';
import { savePromote, saveTweet } from '../../../../../actions/live-studio';
import { setOperationType, setAlternativeChannel } from '../../../../../actions/live';

@autobind
class AlternativeChannelConfirm extends Component {

    constructor(props){
        super(props);
        this.state = {
            // 是否开启推广
            openPromotion: true,
            // 当前推文标题
            currentTweetTitle: '',
            // 当前推文链接
            currentTweetUrl: '',
            // 推文标题
            tweetTitle: '',
            // 推文链接
            tweetUrl: '',
        }
        this.data = {
            // 匹配普遍意义上的URL的正则
            urlPattern: /^https?:\/\/.+?$/i,
            // 黑名单链接
            forbiddenUrls: [
                /xiaoeknow.com/i,
                /tinfinite.com/i,
                /weike.fm/i,
                /ximalaya.com/i,
            ]
        }
    }

    get channelId(){
        return this.props.channel.channelId;
    }

    get liveId(){
        return this.props.liveId;
    }
    
    initState = (channel) => {
        let {publishStatus, tweetTitle, tweetUrl} = channel;
        if (tweetUrl === null) {
            tweetUrl = '';
            tweetTitle = '';
        }
        this.setState({
            openPromotion: publishStatus === 'Y',
            currentTweetTitle: tweetTitle,
            currentTweetUrl: tweetUrl,
            tweetTitle,
            tweetUrl,
        });
    }

    hookTweetTitleInput = (e) => {
        this.setState({
            tweetTitle: e.target.value.trim()
        });
    }

    hookTweetUrlInput = (e) => {
        this.setState({
            tweetUrl: e.target.value.trim()
        })
    }

    gotoChannelPage = () => {
        locationTo(`/live/channel/channelPage/${this.channelId}.htm`);
    }

    /**
     * 根据不同的操作类型显示不同的确认框
     */
    showConfirmDialog = (operation) => {
        switch (operation) {
            // 打开查看推文
            case 'viewTweet':
                this.refs['tweetview-confirm-dialog'].show();
                break;
            // 打开编辑推文
            case 'editTweet':
                this.refs['tweetedit-confirm-dialog'].show();
                break;
            // 打开推广操作
            case 'promote':
                this.refs['promote-confirm-dialog'].show();
                break;
            default:
                break;
        }
    }

    /**
     * 点击“查看推文”确认框的按钮
     */
    hookTweetViewClick = (buttonTag) => {
        const {currentTweetUrl} = this.state;
        if (buttonTag === 'cancel') {
            // 点击“查看”，跳转至推文页面
            locationTo(currentTweetUrl);
        } else {
            // 点击“编辑”, 打开推文编辑确认框
            const {setOperationType} = this.props;
            // 手动关闭推文查看确认框
            this.refs['tweetview-confirm-dialog'].hide();
            setOperationType('editTweet');
        }
    }

    /**
     * 点击“编辑推文”确认框的保存按钮
     */
    hookTweetEditClick = async (buttonTag) => {
        if (buttonTag === 'confirm') {
            const {urlPattern, forbiddenUrls} = this.data;
            // 1. 推文信息填写校验
            // 推文信息要么就都不填，要么就标题和链接都要填
            const {tweetTitle, tweetUrl} = this.state;
            if (tweetTitle && !tweetUrl) {
                window.toast('推文链接不能为空');
                return false;
            }
            if (!tweetTitle && tweetUrl) {
                window.toast('推文标题不能为空');
                return false;
            }
            // 推文标题不能超过20个字
            if (tweetTitle.length > 20) {
                window.toast('推文标题不能超过20个字');
                return false;
            }
            // 推文链接必须是正确的URL
            if (tweetUrl && !urlPattern.test(tweetUrl)) {
                window.toast('请输入合理的推文链接');
                return false;
            }
            // 推文链接里不能包含竞品链接
            if (tweetUrl) {
                const includeForbiddenUrl = forbiddenUrls.some((url) => {
                    return url.test(tweetUrl);
                });
                if (includeForbiddenUrl) {
                    window.toast('推文链接不合法');
                    return false;
                }
            }
            // 2. 发送HTTP请求
            const {saveTweet, setAlternativeChannel, setOperationType, channel} = this.props;
            const result = await saveTweet({
                liveId: this.liveId,
                channelId: this.channelId,
                url: tweetUrl,
                title: tweetTitle
            });
            if (result.state.code === 0) {
                // 3. 更新系列课信息
                setAlternativeChannel({
                    ...channel,
                    tweetTitle: tweetTitle,
                    tweetUrl: tweetUrl
                });
                 // 4. 关闭确认框
                 this.refs['tweetedit-confirm-dialog'].hide();
            } else {
                window.toast(result.state.msg);
            }
        }
    }

    /**
     * 点击“推广系列课”确认框的按钮
     */
    hookConfirmClick = async (buttonTag) => {
        // 点击“确定”后
        if (buttonTag === 'confirm') {
            const {savePromote, setOperationType, setAlternativeChannel, channel} = this.props;
            const promoteStatus = this.state.openPromotion;
            // 1. 发送HTTP请求
            const liveId = this.liveId;
            const channelId = this.channelId;
            const isOpenPublish = promoteStatus ? 'N' : 'Y';
            const result = await savePromote({liveId, channelId, isOpenPublish});
            if (result.state.code === 0) {
                // 2. 切换系列课状态；
                setAlternativeChannel({
                    ...channel,
                    publishStatus: isOpenPublish
                });
            } else {
                window.toast(result.state.msg);
            }
            // 3. 关闭“确认弹框”
            this.refs['promote-confirm-dialog'].hide();
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.channel !== nextProps.channel) {
            this.initState(nextProps.channel);
        }
        this.showConfirmDialog(nextProps.operation);
    }

    render(){
        const {
                openPromotion,
                currentTweetTitle,
                currentTweetUrl,
                tweetTitle,
                tweetUrl,
              } = this.state;
        return (
                <div>
                    {/* 推广操作确认 */}
                    <Confirm 
                        className="confirm-dialog switch-confirm"
                        title={`您是否确定${openPromotion ? '关闭' : '申请'}该系列课`}
                        onBtnClick={this.hookConfirmClick}
                        ref='promote-confirm-dialog'>
                        {
                            openPromotion ? 
                                '确认关闭后，该课程将没有机会被官方推广投放。您可通过重新申请获得推广机会。' 
                            : 
                                <div>
                                    <p>1、点击确认加入备选库，等待课程评测结果，通过即可上架，评审时间需要约5个工作日，详情可添加珊瑚课程十师姐了解：qlbzr10
                                    <br/>2、评测通过之后，您即可按照合作的分成比例享受收益（默认分成比例30%）。</p>
                                    <p className="law-statement-paragraph">申请即代表阅读并同意<a hrfe="javascript:void(0)" className="view-protocol-link" onClick={this.props.displayAgreementStatement}>《课程上架协议》</a></p>
                                </div>
                        }
                    </Confirm>
                    {/* 查看推文 */}
                    <Confirm 
                        className="confirm-dialog tweet-view-confirm"
                        title="查看推文链接"
                        onBtnClick={this.hookTweetViewClick}
                        ref="tweetview-confirm-dialog"
                        cancelText="查看"
                        confirmText="编辑">
                        <dl>
                            <dt>推文标题</dt>
                            <dd>{currentTweetTitle}</dd>
                            <dt>推文链接</dt>
                            <dd>{currentTweetUrl}</dd>
                        </dl>
                    </Confirm>
                    {/* 提供推文 */}
                    <Confirm
                        className="confirm-dialog tweet-edit-confirm"
                        title="提供推文链接"
                        onBtnClick={this.hookTweetEditClick}
                        ref="tweetedit-confirm-dialog"
                        buttons="confirm"
                        confirmText="保存">
                        <p className="desciption">提供推文能大大提升被投放的几率，同时代表您允许媒体渠道采用您本篇推文的所有素材和文案哦</p>
                        <section className="tweet-edit-form" role="form">
                            <div className="form-control">
                                <div className="form-label">推文标题</div>
                                <textarea className="textarea-field" placeholder="请输入推文标题..." value={tweetTitle} onChange={this.hookTweetTitleInput}/>
                            </div>
                            <div className="form-control">
                                <div className="form-label">推文链接</div>
                                <textarea className="textarea-field" placeholder="请输入推文链接..." value={tweetUrl} onChange={this.hookTweetUrlInput}/>
                            </div>
                        </section>
                    </Confirm>
                </div>
        )
    }
}

AlternativeChannelConfirm.propTypes = {
    
}

const mapStateToProps = (state) => {
    const {operationType, alternativeChannel} = state.live;
    return {
        operation: operationType,
        channel: alternativeChannel,
    }
}

const mapActionToProps = {
    savePromote,
    saveTweet,
    setOperationType,
    setAlternativeChannel,
}

export default connect(mapStateToProps, mapActionToProps)(AlternativeChannelConfirm);