import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';

import {  
    formatDate,
    locationTo,
} from 'components/util';

import { fetchTotalCheckInProfit, fetchCheckInProfitDetail } from '../../actions/profit';

const ProfitItem = ({campId, name, createTime, money}) => {
    return (
        <div className="profit-item">
            <div className="left">
                <div className="camp-name elli" onClick={() => {locationTo(`/wechat/page/camp-detail?campId=${campId}`)}}>{name}</div>
                <div className="create-time">{formatDate(createTime, 'yyyy-MM-dd hh:mm')}</div>
            </div>
            <div className="right money">+{money}</div>
        </div>
    )
}

@autobind
class LiveProfitDetailCheckin extends Component {
    state = {
        // 列表数据是否经加载完毕
        noMore: false,
        // 列表数据是否为空
        noneOne: false,
        // 打卡契约金收益的列表数据
        profitList: [],
        // 打卡契约金的总收益
        totalProfit: 0,
    }

    data = {
        // 页码
        page: 1,
        // 每页加载的记录条数
        pageSize: 20,
    }

    /**
     * 记载契约金收益数据
     * @param {*function} next 
     */
    async loadMoreProfitDetail(next){
        const page = {
            page: this.data.page++,
            size: this.data.pageSize,
        }
        const result = await this.props.fetchCheckInProfitDetail(page);
        if (result.state.code === 0) {
            const list = result.data.detailList || [];
            if (list.length == 0 && page.page == 1) {
                this.setState({
                    noneOne: true
                });
            } else if (list.length < this.data.pageSize) {
                this.setState({
                    noMore: true
                });
            }
            // 将新加载的训练营数据推入数组
            if (list.length) {
                this.setState((prevState) => {
                    return {
                        profitList: [
                            ...prevState.profitList,
                            ...list,
                        ]
                    }
                });
            }
        }
        next && next();
    }

    componentDidMount(){
        // 加载打卡契约金收益总额
        fetchTotalCheckInProfit().then((result) => {
            if (result.state.code === 0) {
                this.setState({
                    totalProfit: result.data.totalProfit
                });
            }
        });
        // 加载第一页的打卡训练营数据
        this.loadMoreProfitDetail();
    }

    render(){
        const {
            noneOne,
            noMore,
            profitList,
            totalProfit,
        } = this.state;
        return (
            <Page title="我的打卡收益" className="check-in-profit-detail-container">
                <div className="total-profit">
                    <div className="total-profit-tip">累计契约打卡收益 (元)</div>
                    <div className="total-profit-number">{totalProfit}</div>
                </div>
                <div className="profit-detail-tip">
                    <span className="tip-title">打卡收益记录</span>
                    <span className="tip-detail">(每笔契约奖金已打款到您的微信钱包)</span>
                </div>
                <ScrollToLoad
                    className='dd check-in-profit-detail'
                    toBottomHeight={500}
                    loadNext={this.loadMoreProfitDetail}
                    noneOne={noneOne}
                    noMore={noMore}>
                {
                    profitList.map((item, index) => (
                        <ProfitItem
                            key={`profit-item-${index}`}
                            campId={item.campId}
                            name={item.name}
                            createTime={item.createTimeStamp}
                            money={item.money} />
                    ))
                }
                </ScrollToLoad>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({

});

const mapActionToProps = {
    fetchCheckInProfitDetail,
};

export default connect(mapStateToProps, mapActionToProps)(LiveProfitDetailCheckin);