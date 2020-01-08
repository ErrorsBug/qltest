import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Page from 'components/page';

import { getVal, locationTo } from 'components/util';

import { fetchSubscribeStatus } from '../../actions/common';
import { getFollowQr } from 'common_actions/common';

class FocusQl extends Component {

    cancelPayTexts = [
        {
            text: '亲，你真的忍心放弃吗？长按下方二维码关注，可找聊妹进一步了解课程内容↓ ↓ ↓',
            channel: 'channelCancelPayA',
        },
        {
            text: '亲，你真的忍心放弃吗？长按下方二维码关注，可以获取更多优质大V课程，还有神秘惊喜哦↓ ↓ ↓',
            channel: 'channelCancelPayB',
        },
        {
            text: '亲，你真的忍心放弃吗？长按下方二维码关注，聊妹为你打造量身课程，还可以和聊妹咨询哦！',
            channel: 'channelCancelPayC',
        },
    ];

    state = {
        // 取消支付文案
        cancelPayText: '',
        redirect_url: '',
        qrcode: '',
    }

    static contextTypes = {
        router: PropTypes.object
    }

    componentDidMount() {

        const channel = getVal(this.context.router, 'location.query.channel', '1');  
        const redirect_url = getVal(this.context.router, 'location.query.redirect_url')

        const cancelPayText = this.cancelPayTexts.find(item => item.channel === channel)

        this.setState({
            cancelPayText: cancelPayText.text,
            redirect_url,
        });

        this.initQrcode(channel);
    }

    async initQrcode (channel) {
        const channelId = getVal(this.context.router, 'location.query.channelId', null);
        const topicId = getVal(this.context.router, 'location.query.topicId', null);
        const liveId = getVal(this.context.router, 'location.query.liveId', null);

        try {
            const subscribeStatus = await this.props.fetchSubscribeStatus({ liveId });

            let {
                // 是否绑定三方
                isBindThird,
                // 是否关注三方
                isFocusThree,
                // 是否关注千聊
                subscribe,
            } = subscribeStatus;

            const result = await this.props.getFollowQr({
                channelCode: channel,
                topicId,
                liveId,
                channelId,

                isBindThird,
                isFocusThree,
                subscribe,
            });

            if (getVal(result, 'state.code') == 0) {
                this.setState({
                    qrcode: getVal(result, 'data.qrUrl')
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Page title='关注千聊' className='focus-ql-container'>
                <section className='focus-text'>
                    { this.state.cancelPayText }
                </section>

                <section className="qr-code-container">
                    <img src={ this.state.qrcode } alt=""/>
                </section>

                <p className="tip">长按识别二维码</p>

                <a className="button-row" href={this.state.redirect_url}>
                    返回介绍页
                </a>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}
const mapDispatchToProps = {
    getFollowQr,
    fetchSubscribeStatus,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(FocusQl);
