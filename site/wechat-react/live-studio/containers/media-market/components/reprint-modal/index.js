import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BottomDialog from 'components/dialog/bottom-dialog';
import ChannelItemCard from '../channel-item-card';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';
import classnames from 'classnames';
import { api } from '../../../../actions/common';

@autobind
export default class ReprintModal extends Component {

    static propTypes = {
        channelInfo: PropTypes.shape({
            tweetId: PropTypes.string,
            reprintLiveId: PropTypes.string,
            reprintChannelId: PropTypes.string,
            reprintChannelName: PropTypes.string,
            reprintChannelImg: PropTypes.string, 
            reprintChannelAmount: PropTypes.number,
            selfMediaPercent: PropTypes.number,
            selfMediaProfit: PropTypes.number,
        }),
        channelTagList: PropTypes.array,
        onClose: PropTypes.func,
        reprintChannel: PropTypes.func,
    }

    static defaultProps = {
        channelInfo: {},
        channelTagList: [],
        onClose: () => {},
    }

    constructor(props) {
        super(props)
        
        this.state = {
            curSelectTag: props.channelTagList[0] ? props.channelTagList[0].id : '',
            pushMsg: '',
            showPushPanel: false
        }

        this.pushMsgFlag = false; //判断是否请求过
        this.getIsBindThirdFlag = false; //记录是否请求过
    }

    componentDidUpdate () {
        if (!this.getIsBindThirdFlag) {
            this.getIsBindThird()
        }
    }

    async getIsBindThird () {
        if (!this.props.liveId) return ;

        this.getIsBindThirdFlag = true;

        const result = await api({
            method: 'POST',
            showLoading: false,
            body: {
                liveId: this.props.liveId
            },
            url: '/api/wechat/live/isSubscribe'
        })

        if (result && result.state && result.state.code === 0 ) {
            // result.data.isBindThird = true;
            if (result.data.isBindThird) {
                this.setState({
                    showPushPanel: true
                })

                if (!this.pushMsgFlag) {
                    let storage = localStorage.getItem('mediaMarketPushStatus')
                    if (storage) {
                        this.setState({
                            pushMsg: storage
                        })
                        return
                    }

                    this.getOpenStatus();
                }
            }
        } else {
            window.toast(result.state.msg)
        }
    }

    // 获取判断用户转载课程推送的开启状态
    async getOpenStatus () {
        if (!this.props.liveId) return ;

        this.pushMsgFlag = true;
        
        const result = await api({
            method: 'POST',
            showLoading: false,
            body: {liveId: this.props.liveId},
            url: '/api/wechat/studio/getPushStatus',
        });

        if ( result && result.state && result.state.code === 0 ) {
            this.setState({
                pushMsg: result.data.openStatus
            })
            localStorage.setItem('mediaMarketPushStatus', result.data.openStatus);
        } else {
            window.toast(result.state.msg);
        }
    }

    onTagClick(tag) {
        this.setState({ curSelectTag: tag.id});
    }

    async handleSubmitBtnClick() {
        const params = {
            relayLiveId: this.props.liveId,
            tagId: this.state.curSelectTag,
            sourceChannelId: this.props.channelInfo.reprintChannelId,
            tweetId: this.props.channelInfo.tweetId,
            pushStatus: this.state.pushMsg
        }
        // console.log(params);
        let result = await this.props.reprintChannel(params);
        if (result && result.state && result.state.code === 0) {
            localStorage.setItem('mediaMarketPushStatus', this.state.pushMsg);
        }
    }

    changePushMsg () {
        let {pushMsg} = this.state;
        this.setState({
            pushMsg: pushMsg === 'Y' ? 'N' : 'Y'
        })
    }
    

    render() {
        return (
            <BottomDialog 
                show={this.props.show}
                className="reprint-modal"
                theme="empty"
                bghide={true}
                onClose={this.props.onClose}
            >
                <div className="title">
                    <span className="name">系列课转载</span>
                    <span className="close-btn icon_delete" onClick={this.props.onClose}></span>
                </div>
                <div className="info">
                    <ChannelItemCard 
                         // 类型
                        itemType="reprint-item"
                        {...this.props.channelInfo}
                    />
                </div>
                {
                    this.state.showPushPanel ? 
                    <div className="push-msg">
                        <div className="push-msg-content">
                            <div className="push-msg-content-header">
                                转载后同时推送通知
                            </div>
                            <div className="push-msg-content-help" onClick={() => locationTo('https://mp.weixin.qq.com/s/Q5eOCFHIrWusXPeOvk3V2w')}>
                                如何使用自己的服务号推送
                                <img src={require('./img/pushmsg.png')} alt="" className="push-msg-icon"/>
                            </div>
                        </div>
                        <div className={classnames('push-msg-switch', this.state.pushMsg === 'Y' ? 'open': '')} onClick={this.changePushMsg}>

                        </div>
                    </div> : null
                }
                <div className="tags">
                    <p className="tag-title">设置我的系列课分类</p>
                    <div className="tag-list">
                        {
                            this.props.channelTagList.map((tag) => {
                                const isActive = this.state.curSelectTag === tag.id;
                                return <span className={`tag ${isActive ? 'active' : ''}`} key={tag.id} onClick={() => this.onTagClick(tag)}>{tag.name}</span>
                            })
                        }
                    </div>
                </div>
                <div className="submit-btn" onClick={this.handleSubmitBtnClick}>立即转载</div>
            </BottomDialog>
        )
    }
}
