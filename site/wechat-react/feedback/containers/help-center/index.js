import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import TabView from 'components/tab-view/v2';

import { request } from 'common_actions/common';
import { locationTo } from 'components/util';
import { fillParams } from 'components/url-utils';
import { collectVisible } from 'components/collect-visible';
import { LoadStatus } from 'components/scroll-view';


class PageContainer extends Component {
    state = {
        activeTabIndex: 0,
        hasNewMsg: false
    }

    constructor(props) {
        super(props);
        this.state.activeTabIndex = props.location.query.role === 'teacher' ? 1 : 0;
    }

    componentDidMount() {
        this.getCateList();
        // 先屏蔽红点
        this.initRedPoint();

        setTimeout(function () {
            typeof _qla !== 'undefined' && _qla.bindVisibleScroll('p-help-cen');
        }, 300);
    }

    async initRedPoint () {
        const res = await request({
            url: '/api/wechat/transfer/h5/feedback/getUserRedRot',
            method: 'POST',
            body: {}
        })
        if (res && res.data && res.data.isHaveRedRot == 'Y') {
            this.setState({
                hasNewMsg: true
            })
        }
    }

    goMyFeedback = () => {
        if (this.state.hasNewMsg) {
			request({
				url: '/api/wechat/transfer/h5/feedback/clearUserRedRot',
                method: 'POST',
				body: {}
			})

        }

        locationTo('/wechat/page/my-feedback')
    }

    render() {
        const role = this.tabViewConfig[this.state.activeTabIndex].id;
        const cateList = this.state[`role_${role}`];

        return <Page title="帮助中心" className="p-help-cen">
            <TabView 
                config={this.tabViewConfig}
                activeIndex={this.state.activeTabIndex}
                onClickItem={this.onClickTabItem}
            />
            
            {
                cateList && cateList.data && 
                <div className="cate-list">
                    {
                        cateList.data.map((cate, index) => {
                            return <div key={index}
                                className={`cate-item on-log on-visible ${cate.category}`}
                                data-log-region="cate-item"
                                data-log-pos={`${role}-${cate.category}`}
                                onClick={() => this.onClickCateItem(cate)}
                            >
                                <div className="avatar"></div>
                                <div className="info">
                                    <div className="name">{cate.categoryName}</div>
                                    <div className="desc">{cate.categoryContent}</div>
                                </div>
                            </div>
                        })
                    }
                </div>
            }

            {
                cateList && cateList.status === 'pending' &&
                <LoadStatus status={cateList.status} />
            }

            <div className="feedback">
                <div className="my-feedback on-log"
                    data-log-region="btn-my-feedback"
                    onClick={this.goMyFeedback}><i></i>我的反馈{this.state.hasNewMsg ? <i className="red"></i> : null}</div>
                <div className="do-feedback on-log"
                    data-log-region="btn-feedback"
                    onClick={() => locationTo('/wechat/page/feedback')}><i></i>意见反馈</div>
            </div>
        </Page>
    }

    tabViewConfig = [
        {
            id: 'student',
            name: '我是学员',
            className: 'on-log',
            attrs: {
                'data-log-region': 'tab-student',
            }
        },
        {
            id: 'teacher',
            name: '我是老师',
            className: 'on-log',
            attrs: {
                'data-log-region': 'tab-teacher',
            }
        },
    ]

    onClickTabItem = index => {
        this.setState({
            activeTabIndex: index
        }, () => {
            this.getCateList();
            collectVisible();

            const newUrl = fillParams({
                role: this.getCurRole()
            }, location.pathname + location.search + location.hash);
            this.props.router.replace(newUrl);
        })
    }

    onClickCateItem = cate => {
        const liveId = this.props.location.query.liveId
        locationTo(`/wechat/page/help-center/cate/${cate.category}?role=${this.getCurRole()}${liveId ? `&liveId=${liveId}` : ''}`);
    }

    getCurRole = () => {
        const curTab = this.tabViewConfig[this.state.activeTabIndex];
        return curTab.id || 'student';
    }

    getCateList = () => {
        const role = this.getCurRole();
        const dataObjKey = `role_${role}`;
        const dataObj = this.state[dataObjKey] || {
            status: '',
            data: undefined,
        }
        
        if (/pending|end/.test(dataObj.status)) return;
        this.setState({
            [dataObjKey]: {
                ...dataObj,
                status: 'pending',
            }
        })
        request({
            url: '/api/wechat/transfer/h5/faq/categoryList',
            method: 'POST',
            body: {
                role,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            this.setState({
                [dataObjKey]: {
                    ...this.state[dataObjKey],
                    status: 'end',
                    data: res.data.dataList || [],
                }
            }, () => {
                collectVisible();
            })
        }).catch(err => {
            window.toast(err.message);

            this.setState({
                [dataObjKey]: {
                    ...this.state[dataObjKey],
                    status: '',
                }
            })
        })
    }
}




export default connect(state => state)(PageContainer);