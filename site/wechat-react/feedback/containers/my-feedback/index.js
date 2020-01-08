import React from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import ScrollView from 'components/scroll-view';

import classNames from 'classnames';
import { request } from 'common_actions/common';
import { locationTo, formatDate } from 'components/util';
import exposure from 'components/exposure';



class PageContainer extends React.Component {
    state = {
        fbList: {
            status: '',
            data: undefined,
            page: {
                size: 10,
            }
        }
    }

    componentDidMount() {
        this.getFeedbackList();

        exposure.bindScroll({wrap: 'co-scroll-view'});
    }

    render() {
        return <Page title="我的反馈" className="p-my-feedback">
            <ScrollView
                status={this.state.fbList.status}
                onScrollBottom={() => this.getFeedbackList(true)}
                isEmpty={this.state.fbList.data && !this.state.fbList.data.length}
            >
                <div>{
                    this.state.fbList.data && this.state.fbList.data.map((item, index) => {
                        const cln = classNames('feedback on-visible on-log', {
                            'status-handle': item.status === 'handle',
                            'status-awaiting': item.status === 'awaiting',
                            'status-success': item.status === 'success',
                        });

                        return <div className={cln} key={index}
                            data-log-region="feedback-item"
                            data-log-pos={index}
                            onClick={() => this.props.router.push(`/wechat/page/feedback/${item.id}`)}
                        >
                            <div className="type">{item.categoryName}</div>
                            <div className="content">{item.content}</div>
                            <div className="time">{formatDate(item.updateTime, 'yyyy-MM-dd hh:mm:ss')}</div>
                            <div className="mark"></div>
                        </div>
                    })
                }</div>
            </ScrollView>
        </Page>
    }

    getFeedbackList = isContinue => {
        const fbList = this.state.fbList;
        if (/pending|end/.test(fbList.status)) return;

        const page = {...fbList.page};
        page.page = isContinue && page.page ? page.page + 1 : 1;

        this.setState({
            fbList: {
                ...fbList,
                status: 'pending'
            }
        })
        
        request({
            url: '/api/wechat/transfer/h5/feedback/list',
            method: 'POST',
            throwWhenInvalid: true,
            body: {
                page
            }
        }).then(res => {
            const list = res.data && res.data.feedbackPos || [];
            
            this.setState({
                fbList: {
                    ...this.state.fbList,
                    status: list.length < page.size ? 'end' : 'success',
                    data: isContinue ? (this.state.fbList.data || []).concat(list) : list,
                    page,
                }
            }, () => {
                exposure.collect({wrap: 'co-scroll-view'});
            })

        }).catch(err => {
            window.toast(err.message);
            this.setState({
                fbList: {
                    ...this.state.fbList,
                    status: '',
                }
            })
        })
    }
}




export default connect(state => state)(PageContainer);