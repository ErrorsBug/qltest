import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import BackToHelpCenter from '../components/back-to-help-center';

import { request } from 'common_actions/common';
import { locationTo } from 'components/util';
import { fillParams } from 'components/url-utils';
import { getUrlParams } from '../../../../components/url-utils';
import { collectVisible } from 'components/collect-visible';
import { LoadStatus } from 'components/scroll-view';
import EmptyPage from 'components/empty-page';


class PageContainer extends Component {
    state = {
        faqList: {
            status: '',
            data: undefined,
        }
    }

    componentDidMount() {
        this.getCateFaqList();

        setTimeout(function () {
            typeof _qla !== 'undefined' && _qla.bindVisibleScroll('p-help-cen-cate');
        }, 300);
    }

    render() {
        return <Page title={this.state.faqList.categoryName || "帮助中心"} className="p-help-cen-cate">
            <div className="page-content">
                {
                    this.state.faqList.data && this.state.faqList.data.map((item, index) => {
                        return <div key={index}
                            className="faq-entry on-log on-visible"
                            data-log-region="faq-entry"
                            data-log-pos={index}
                            onClick={() => this.onClickEntry(item)}
                        >
                            <div className="title">{index + 1}. {item.question}</div>
                            <i className="icon_enter"></i>
                        </div>
                    })
                }
            </div>

            {
                this.state.faqList.data && !this.state.faqList.data.length &&
                <EmptyPage show />
            }
            
            {
                this.state.faqList.status === 'pending' &&
                <LoadStatus status={this.state.faqList.status} />
            }

            <BackToHelpCenter />
        </Page>
    }

    onClickEntry = item => {
        const urlParams = getUrlParams();
        let targetUrl = `/wechat/page/help-center/faq/${item.id}`;
        
        targetUrl = fillParams({
            role: urlParams.role,
            liveId: urlParams.liveId,
            // hcstep: urlParams.hcstep > 0 ? Number(urlParams.hcstep) + 1 : undefined,
        }, targetUrl);

        locationTo(targetUrl);
    }

    getCateFaqList = () => {
        const dataObj = this.state.faqList;
        if (/pending|end/.test(dataObj.status)) return;

        this.setState({
            faqList: {
                ...dataObj,
                status: 'pending',
            }
        })
        request({
            url: '/api/wechat/transfer/h5/faq/list',
            method: 'POST',
            body: {
                category: this.props.params.category,
                role: this.props.location.query.role || 'student',
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            this.setState({
                faqList: {
                    ...this.state.faqList,
                    status: 'end',
                    data: res.data.faqs || [],
                    categoryName: res.data.categoryName,
                }
            }, () => {
                collectVisible();
            })
        }).catch(err => {
            window.toast(err.message);

            this.setState({
                faqList: {
                    ...this.state.faqList,
                    status: '',
                }
            })
        })
    }
}



export default connect(state => state)(PageContainer);
