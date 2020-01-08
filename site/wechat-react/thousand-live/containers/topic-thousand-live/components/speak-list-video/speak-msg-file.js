import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import SpeakMsgContainer from './speak-msg-container';
import { getDocInfo, getDocAuth, docStat } from 'thousand_live_actions/thousand-live-common';
import { doPay } from 'common_actions/common'
import { logPayTrace } from 'components/log-util';
import Detect from 'components/detect';

@autobind
class FileItem extends Component {

    isUnmounted = false;

    state = {
        type: 'doc',
        name: '',
        isPaid: false,
        size: 0,
        amount: 0,
        convertUrl: '',
        icon: '',
    }

    componentDidMount() {
        this.initDocInfo();
        this.isUnmounted = false;
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    async initDocInfo() {
        if (!this.props.hadDocData) {
            const docInfo = await this.props.getDocInfo(this.props.content);

            if (this.isUnmounted) {
                return;
            }

            this.setState({
                ...docInfo.data
            });
        } else {
            this.setState({
                type: this.props.docData.type,
                name: this.props.docData.name,
                isPaid: this.props.docData.isPaid,
                size: this.props.docData.size,
                amount: this.props.docData.amount,
                convertUrl: this.props.docData.convertUrl,
                icon: this.props.docData.icon,
            });
        }
    }
    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    get docSize () {
        if (this.state.size > 1048576) {
            return (this.state.size/1048576).toFixed(2) + ' MB';
        } else if (this.state.size > 1024) {
            return (this.state.size/1024).toFixed(2) + ' KB';
        } else {
            return this.state.size + ' B';
        }
    }

    async onDownLoad () {
        try {
            const authResult = await this.props.getDocAuth(this.state.amount, this.props.content);

            if (authResult.state.code == 0) {
                // 如果有权限下载文件
                if (authResult.data.isPaid) {
                    await this.props.docStat(this.props.content);

                    window.location.href = `${this.state.convertUrl}?auth_key=${authResult.data.authKey}`
                } else {
                    await this.props.doPay({
                        docId: this.props.content,
                        type: 'DOC',
                        total_fee: this.state.amount / 100,
                        callback: () => {
                            logPayTrace({
                                id: this.props.content,
                                type: 'topic',
                                payType: 'DOC',
                            });
                            this.setState({
                                isPaid: true
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }


    }

    render() {
        return (
            <SpeakMsgContainer
                {...this.props}
            >
                <div className='doc-container'>
                    <div className='doc-content'>
                        <img className='doc-type-img' src={ this.state.icon } alt=""/>
                        <div className='doc-base-info'>
                            <span className='doc-name elli-text'>{ this.state.name }</span>
                            <span className='doc-size'>{ this.docSize }</span>
                        </div>
                    </div>
                    <div className='doc-opt'>
                        {
                            (!this.state.isPaid && this.state.amount > 0&&!(this.isWeapp&&Detect.os.ios))?
                            <span className='doc-amount'>支付</span>
                            :null
                        }
                        <span className='doc-money'>{ (this.state.amount > 0) ? (!(this.isWeapp&&Detect.os.ios)?'￥'+ (this.state.amount / 100):'') : '免费'}</span>
                        <span className='doc-dowload-btn on-log'
                            onClick={ this.onDownLoad }
                            data-log-region="speak-list"
                            data-log-pos="doc-download-btn"
                            data-log-business_id={this.props.content}
                            >
                            {
                                (this.state.isPaid || this.state.amount <= 0) ? '立即下载' : '点击下载'
                            }
                        </span>
                    </div>
                </div>
            </SpeakMsgContainer>
        );
    }
}

FileItem.propTypes = {

};

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
    getDocInfo,
    getDocAuth,
    docStat,
    doPay,
}

export default connect(mapStateToProps, mapActionToProps)(FileItem);
