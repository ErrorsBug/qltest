/*
 * @Author: shuwen.wang 
 * @Date: 2017-05-11 10:53:26 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-06-05 10:00:44
 */

/* 外部库和组件*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import dayjs from 'dayjs'

/* 通用组件*/
import Page from 'components/page'
import ScrollToLoad from 'components/scrollToLoad'

/* 页面组件*/
import FilterPanel from './components/filter-panel'
import Checklist from './components/checklist'
import Header from './components/header'

/* 常量定义*/
import { timeFilter, typeFilter, profitMap } from './constant'

/* actions*/
import { fetchAndUpdateSysTime } from '../../actions/common'
import { isLiveAdmin, isHaveMediaProfit } from '../../actions/live'
import {
    fetchProfitOverview,
    fetchProfitRecords,
    clearProfitRecords,
} from '../../actions/profit'

/**
 * 收益流水页面
 * 
 * @class LiveProfitChecklist
 * @extends {Component}
 */
class LiveProfitChecklist extends Component {

    constructor(props) {
        super(props)
        const time = this.props.location.query.time || 'ALL'
        const type = this.props.location.query.type || 'ALL'

        this.state.timeFilterValue = time
        this.state.typeFilterValue = type

        this.state.timeVal = time
        this.state.typeVal = type
    }

    get liveId(){
        return this.props.params.liveId;
    }

    async componentDidMount() {
        if (!this.props.records.length) {
            this.fetchList()
        }
        // 非自媒体版本直播间，隐藏“知识通”类型筛选按钮
        // 直播间没有转载系列课收益，隐藏“媒体投放”类型筛选按钮
        const liveId = this.liveId;
        const {isLiveAdmin, isHaveMediaProfit} = this.props;
        const [isLiveAdminResult, isHaveMediaProfitResult] = await Promise.all([isLiveAdmin(liveId), isHaveMediaProfit(liveId)]);
        if (isLiveAdminResult.state.code === 0) {
            this.setState({
                isLiveMedia: isLiveAdminResult.data.liveLevel === 'selfMedia'
            });
        } else {
            console.error(isLiveAdminResult.state.msg);
        }
        if (isHaveMediaProfitResult.state.code === 0) {
            this.setState({
                haveMediaProfit: isHaveMediaProfitResult.data.isOrNotHave === 'Y'
            });
        } else {
            console.error(isHaveMediaProfitResult.state.msg);
        }
    }

    componentWillUnmount() {
        this.props.clearProfitRecords()
    }

    state = {
        /* filter选中值和确认值*/
        showFilter: false,
        timeFilterValue: 'ALL',
        typeFilterValue: 'ALL',

        timeVal: 'ALL',
        typeVal: 'ALL',

        /* 日期选择器状态*/
        startDate: new Date(this.props.sysTime),
        endDate: new Date(this.props.sysTime),

        /* 滚动加载列表状态*/
        noneData: false,
        noMore: false,

        // 是否是自媒体版直播间
        isLiveMedia: false,
        // 是否存在媒体投放收益
        haveMediaProfit: false,
    }
    /* 通过get方法获取liveId*/
    get liveId() {
        return this.props.params.liveId
    }

    /* 根据时间选中状态转换为请求的时间格式并返回*/
    get fetchTime() {
        switch (this.state.timeVal) {
            case 'ALL':
                return {
                    start: null,
                    end: null,
                }
            case 'WEEK':
                return {
                    start: dayjs(this.props.sysTime).subtract(7, 'days').format('YYYY-MM-DD'),
                    end: dayjs(this.props.sysTime).format('YYYY-MM-DD'),
                }
            case 'YESTERDAY':
                return {
                    start: dayjs(this.props.sysTime).subtract(1, 'days').format('YYYY-MM-DD'),
                    end: dayjs(this.props.sysTime).subtract(1, 'days').format('YYYY-MM-DD'),
                }
            case 'CUSTOM':
                return {
                    start: dayjs(this.state.startDate).format('YYYY-MM-DD'),
                    end: dayjs(this.state.endDate).format('YYYY-MM-DD'),
                }
            default:
                return { start: null, end: null }
        }
    }

    get fetchType() {
        return this.state.typeVal === 'ALL' ? null : this.state.typeVal
    }

    /* 点击筛选图标展示筛选栏*/
    onFilterIconClick = () => {
        this.setState({
            showFilter: true,
            scrollDisable: true
        })
    }

    /* 设置时间筛选条件*/
    onTimeFilterChange = (e) => {
        this.setState({
            timeFilterValue: e.target.value
        })
    }

    /* 设置类型筛选条件*/
    onTypeFilterChange = (e) => {
        this.setState({
            typeFilterValue: e.target.value
        })
    }

    /* 隐藏筛选栏*/
    onFilterHide = () => {
        this.setState({
            showFilter: false,
        })
    }

    /* 确定筛选条件后请求数据*/
    onFilterConfirm = async () => {
        this.props.clearProfitRecords()
        await this.setState({
            // page: 1,
            typeVal: this.state.typeFilterValue,
            timeVal: this.state.timeFilterValue,
            noMore: false,
            noneData: false,
            showFilter: false
        })
        await this.fetchList();
        this.setState({
            scrollDisable: false
        })
    }

    fetchList = async (next) => {
        const params = {
            liveId: this.liveId,
            page: this.props.page,
            size: this.props.size,
        }
        if (this.fetchTime.start !== null) {
            params.startTime = this.fetchTime.start
            params.endTime = this.fetchTime.end
        }
        if (this.fetchType !== null) {
            params.profitType = this.fetchType
        }

        const result = await this.props.fetchProfitRecords(params)
        result.state.code === 0
            ? this.handleResult(result)
            : window.toast(result.state.msg)
        next && next()
    }

    handleResult(result) {
        const { size, page } = this.props
        const len = result.data.list.length
        // 没有更多数据
        if (len < size) {
            !this.props.records.length
                ? this.setState({ noneData: true })
                : this.setState({ noMore: true })
        }
    }


    onStartDateSelect = (val) => {
        this.setState({
            startDate: val,
        })
    }

    onEndDateSelect = (val) => {
        this.setState({
            endDate: val,
        })
    }

    render() {
        const { typeFilterValue, timeFilterValue, showFilter, isLiveMedia, haveMediaProfit } = this.state
        const showStartDate = dayjs(this.state.startDate).format('YYYY-MM-DD')
        const showEndDate = dayjs(this.state.endDate).format('YYYY-MM-DD')
        return (
            <Page title='直播间收益明细'>
                <div className="live-profit-checklist-container">
                    {/* 头部filter和金额信息*/}
                    <Header
                        total={this.props.total}
                        checking={this.props.checking}

                        onFilterIconClick={this.onFilterIconClick}
                        timeFilter={timeFilter}
                        typeFilter={typeFilter}
                        timeVal={this.state.timeVal}
                        typeVal={this.state.typeVal}
                        startDate={showStartDate}
                        endDate={showEndDate}
                    />

                    {/* 收益清单*/}
                    <main>
                        <ScrollToLoad
                            toBottomHeight={500}
                            noneOne={this.state.noneData}
                            noMore={this.state.noMore}
                            loadNext={this.fetchList.bind(this)}
                            disable={this.state.scrollDisable}
                        >
                            {
                                this.props.records.length > 0 &&
                                <Checklist
                                    records={this.props.records}
                                    profitMap={profitMap}
                                />
                            }

                        </ScrollToLoad>
                    </main>

                    {/* filter面板*/}
                    <FilterPanel
                        isLiveMedia={isLiveMedia}
                        haveMediaProfit={haveMediaProfit}
                        showFilter={showFilter}
                        onFilterConfirm={this.onFilterConfirm}
                        onFilterHide={this.onFilterHide}

                        timeFilter={timeFilter}
                        timeFilterValue={timeFilterValue}
                        onTimeFilterChange={this.onTimeFilterChange}

                        typeFilter={typeFilter}
                        typeFilterValue={typeFilterValue}
                        onTypeFilterChange={this.onTypeFilterChange}

                        startDate={dayjs(this.state.startDate).format('YYYY-MM-DD')}
                        endDate={dayjs(this.state.endDate).format('YYYY-MM-DD')}
                        onStartDateSelect = {this.onStartDateSelect}
                        onEndDateSelect = {this.onEndDateSelect}
                    />
                </div>
            </Page>
        );
    }
}

LiveProfitChecklist.propTypes = {
    sysTime: PropTypes.number.isRequired,
    records: PropTypes.array.isRequired,
    // total: PropTypes.number.isRequired,
    // checking: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
    return {
        sysTime: state.common.sysTime,

        records: state.profit.records,
        page: state.profit.recordsPage,
        size: state.profit.recordsSize,

        total: state.profit.recordTotal,
        checking: state.profit.recordChecking,
    };
}

const mapActionToProps = {
    fetchAndUpdateSysTime,
    fetchProfitRecords,
    fetchProfitOverview,
    clearProfitRecords,
    isLiveAdmin,
    isHaveMediaProfit,
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProfitChecklist);