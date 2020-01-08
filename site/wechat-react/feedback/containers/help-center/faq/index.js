import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import BackToHelpCenter from '../components/back-to-help-center';
import { LoadStatus } from 'components/scroll-view';

import { request } from 'common_actions/common';



class PageContainer extends Component {
    state = {
        faq: {
            status: '',
            data: undefined,
        }
    }

    get liveId () {
        return this.props.location.query.liveId
    }

    componentDidMount() {
        if (/pending|success/.test(this.state.faq.status)) return;
        this.setState({
            faq: {
                ...this.state.faq,
                status: 'pending',
            }
        })
        request({
            url: '/api/wechat/transfer/h5/faq/loadFaq',
            method: 'POST',
            body: {
                faqId: this.props.params.id,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            this.setState({
                faq: {
                    ...this.state.faq,
                    status: 'success',
                    data: res.data.faq || {},
                }
            })
        }).catch(err => {
            window.toast(err.message);

            this.setState({
                faq: {
                    ...this.state.faq,
                    status: '',
                }
            })
        })
        
    }

    render() {
        const faqData = this.state.faq.data;
        return <Page title={faqData ? faqData.question : "帮助中心"} className="p-help-cen-faq">
            {
                faqData &&
                <div className="page-content">
                    <div className="title">{faqData.question}</div>
                    <div className="content">{faqData.answer}</div>
                </div>
            }

            {
                this.state.faq.status === 'pending' &&
                <LoadStatus status={this.state.faq.status} />
            }

            <BackToHelpCenter hasIndex={true} liveId={this.liveId} />
        </Page>
    }
}



export default connect(state => state)(PageContainer);

