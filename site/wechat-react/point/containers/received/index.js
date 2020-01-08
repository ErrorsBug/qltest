import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import ScrollView from 'components/scroll-view';
import Pitcure from 'ql-react-picture';

import { request } from 'common_actions/common';
import { formatDate, locationTo } from 'components/util';
import { collectVisible, bindVisibleScroll } from 'components/collect-visible';



class PageContainer extends Component {
    state = {
        awardList: {
            status: '',
            data: undefined,
            page: {
                size: 5,
            }
        },
    }

    componentDidMount() {
        this.getList();
        bindVisibleScroll('co-scroll-view');
    }

    render() { 
        return <Page title="已领奖品" className="p-point-rece">
            <ScrollView
                onScrollBottom={() => this.getList(true)}
                status={this.state.awardList.status}
            >
                <div className="award-list">
                    {
                        this.state.awardList.data && this.state.awardList.data.map((item, index) => {
                            return <div key={index} className="award-item on-log on-visible"
                                data-log-region="award-item"
                                data-log-pos={index}
                                onClick={() => locationTo(item.url)}>
                                <div className="entity">
                                    <div className="head-img">
                                        <Pitcure src={`${item.headImageUrl}@240w_148h_1e_1c_2o`} />
                                    </div>
                                    <div className="info">
                                        <div className="name">{item.giftName}</div>
                                        <div className="receive-time">领取时间：{formatDate(item.receiveTime, 'yyyy.MM.dd')}</div>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </ScrollView>
        </Page>
    }

    getList = isContinue => {
        const awardList = this.state.awardList;
        if (/pending|end/.test(awardList.status)) return;

        const page = {...awardList.page};
        page.page = isContinue && page.page ? page.page + 1 : 1;

        this.setState({
            awardList: {
                ...awardList,
                status: 'pending'
            }
        })
        
        request({
            url: '/api/wechat/transfer/pointApi/point/userGift',
            method: 'POST',
            throwWhenInvalid: true,
            body: {
                page
            }
        }).then(res => {
            const list = res.data.giftList || [];
            
            this.setState({
                awardList: {
                    ...this.state.awardList,
                    status: list.length < page.size ? 'end' : 'success',
                    data: isContinue ? (this.state.awardList.data || []).concat(list) : list,
                    page,
                }
            }, () => {
                collectVisible();
            })

        }).catch(err => {
            window.toast(err.message);
            this.setState({
                awardList: {
                    ...this.state.awardList,
                    status: '',
                }
            })
        })
    }
}




module.exports = connect(state => state)(PageContainer);