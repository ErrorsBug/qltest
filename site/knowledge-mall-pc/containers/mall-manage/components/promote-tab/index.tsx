import * as React from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { apiService } from '../../../../components/api-service'
import { encode } from 'querystring'

import styles from './style.scss'

import { Tabs, Modal, Pagination } from 'antd'
const TabPane = Tabs.TabPane

import PromoteBar from './components/promote-bar'
import PromoteTable from './components/promote-table'
import { TableEmpty } from '../empty-table-placeholder'

import { IPromoteOrder } from '../../../../models/promote.model'

import {
    fetchPromoteOrder,
} from '../../../../actions/promote'

import { Moment } from 'moment';

export interface PromoteTabProps {
    liveId: string
    userId: string
    queryName: string
    queryDate: Array<Moment>

    fetchPromoteOrder: (params: any) => any
    locationTo: (url: string) => void
    changeTab: (key: string) => void
}

@autobind
class PromoteTab extends React.Component<PromoteTabProps, any> {

    state = {
        /* 当前选中的分类id */
        activeId: 0,

        noone: false,
        loading: false,

        orderList: [],
        totalCount: 0,
        page: 1,
        size: 5,

        // 搜索关键词
        searchText: '',
    }

    componentDidMount() {

        if (this.props.liveId) {
            this.fetchPromoteOrder(this.props.liveId)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.liveId && nextProps.liveId !== this.props.liveId) {
            this.fetchPromoteOrder(nextProps.liveId);
        }
    }

    /* 请求订单数据 */
    async fetchPromoteOrder(liveId) {
        try {
            const { page, size } = this.state
            const { queryName, queryDate } = this.props
            // const timestamps = queryDate.map(item => (item && item.valueOf) ? item.valueOf() : null)
            this.setState({ loading: true })
            const result = await apiService.post({
                url: '/h5/knowledge/orderList',
                body: {
                    liveId,
                    channelName: '',
                    purchaserName: queryName,
                    startTime: queryDate[0] && queryDate[0].format('YYYY-MM-DD'),
                    endTime: queryDate[1] && queryDate[1].format('YYYY-MM-DD'),
                    page: {
                        page: this.state.page,
                        size: this.state.size
                    }
                }
            })

            if (result.state.code === 0) {
                const { orderList, totalCount } = result.data
                this.setState({
                    orderList, totalCount,
                    noone: totalCount === 0,
                })
            }
        } catch (error) {
            console.error('查询订单错误: ', error)
        } finally {
            this.setState({ loading: false })
        }
    }

    /* 点击查询推广订单 */
    consultPromoteOrder() {
        this.setState({ page: 1, searchText: ''}, () => {
            this.fetchPromoteOrder(this.props.liveId);
        });
    }

    get downloadLink() {
        const { queryName, queryDate, liveId, userId } = this.props
        const startTime = queryDate[0] && queryDate[0].format('YYYY-MM-DD')
        const endTime = queryDate[1] && queryDate[1].format('YYYY-MM-DD')

        const queries = {
            liveId: liveId,
            userId: userId,
            channelName: '',
            purchaserName: queryName,
            startTime,
            endTime,
        }
        return `/live/knowledge/export.htm?${encode(queries)}`
    }

    /* 点击去推广按钮 */
    onPromoteBtnClick() {
        this.props.changeTab('reprint')
    }

    onPageChange(page) {
        this.setState({ page }, () => {
            this.fetchPromoteOrder(this.props.liveId)
        })
    }

    // 输入搜索关键词
    inputSearchText(e) {
        this.setState({
            searchText: e.target.value.trim()
        });
    }

    // 监听搜索框的回车按键
    handleKeyUp(e){
        if (e.keyCode === 13) {
            this.onSearchPromoteOrder();
        }
    }

    // 搜索推广订单
    onSearchPromoteOrder() {
        this.setState({
            page: 1
        }, async () => {
            this.setState({ loading: true });
            const result = await apiService.post({
                url: '/h5/knowledge/orderList',
                body: {
                    liveId: this.props.liveId,
                    channelName: this.state.searchText,
                    page: {
                        page: this.state.page,
                        size: this.state.size
                    }
                }
            });
            if (result.state.code === 0) {
                const { orderList, totalCount } = result.data
                this.setState({
                    orderList, totalCount,
                    noone: totalCount === 0,
                });
            }
            this.setState({ loading: false });
        });
    }

    render() {
        const { activeId, noone, totalCount, orderList, page, size, loading } = this.state

        return (
            [
                <PromoteBar
                    onConsultClick={this.consultPromoteOrder}
                    downloadLink={this.downloadLink}
                    key='bar'
                />,
                <div key='content'>
                    {
                        noone
                            ?
                            <TableEmpty
                                tips='还未产生订单!快去推广吧~!'
                                buttonText='去推广'
                                onButtonClick={this.onPromoteBtnClick}
                                key='empty'
                            />
                            :
                            [
                                <PromoteTable
                                    list={orderList}
                                    loading={loading}
                                    key='table'
                                />,
                                <Pagination
                                    key='pagi'
                                    current={page}
                                    pageSize={size}
                                    total={totalCount}
                                    onChange={this.onPageChange}
                                    style={{ margin: '20px 0' }}
                                />
                            ]
                    }
                </div>,
                <div key="searchBox" className="search-box">
                    <input type="text" className="search-text" placeholder="课程标题" value={this.state.searchText} onChange={this.inputSearchText} onKeyUp={this.handleKeyUp} />
                    <i className="search-icon" onClick={this.onSearchPromoteOrder}></i>
                </div>
            ]
        )
    }
}

function mapStateToProps(state) {
    return {
        userId: state.common.userInfo.userId,
        queryName: state.promote.queryName,
        queryDate: state.promote.queryDate,
    }
}

const mapActionToProps = {
    fetchPromoteOrder,
}

export default connect(mapStateToProps, mapActionToProps)(PromoteTab)
