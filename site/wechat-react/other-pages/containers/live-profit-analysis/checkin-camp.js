import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { imgUrlFormat } from 'components/util';

import { fetchCheckinCampProfits } from '../../actions/profit';

@autobind
class LiveProfitCheckinCampAnalysis extends Component {
    state = {
        // 收益记录是否经加载完毕
        noMore: false,
        // 收益记录是否为空
        noneOne: false,
        // 收益记录数据
        profitRecords: [],
    }

    data = {
        // 页码
        page: 1,
        // 每页加载的记录条数
        pageSize: 20,
    }

    get liveId(){
        return this.props.params.liveId;
    }

    /**
     * 加载更多的收益记录
     */
    async loadMoreProfitRecords(next){
        const liveId = this.liveId;
        const page = {
            page: this.data.page++,
            size: this.data.pageSize,
        }
        const result = await this.props.fetchCheckinCampProfits({liveId, page});
        if (result.state && result.state.code === 0) {
            const list = result.data.campList || [];
            if (list.length == 0 && page.page == 1) {
                this.setState({
                    noneOne: true
                });
            } else if (list.length < this.data.pageSize) {
                this.setState({
                    noMore: true
                });
            }
            // 将新加载的收益记录推入数组
            if (list.length) {
                this.setState((prevState) => {
                    return {
                        profitRecords: [
                            ...prevState.profitRecords,
                            ...list,
                        ]
                    }
                });
            }
        }
        next && next();
    }

    componentDidMount = async () => {
        this.loadMoreProfitRecords();
    }

    render(){
        const {
            noMore,
            noneOne,
            profitRecords,
        } = this.state;
        return (
            <Page title="打卡训练营收益分析" className="analysis-center-page">
                <div className="techno-analysis-list checkin-camp-analysis-list">
                    <ScrollToLoad
                        className='dd'
                        toBottomHeight={500}
                        loadNext={this.loadMoreProfitRecords}
                        noneOne={noneOne}
                        noMore={noMore}>
                        {
                            profitRecords.map((listItem, index) => (
                                <div className="item" key={`list-item-${index}`}>
                                    <div className="info-box">
                                        <div className="pic"><img src={imgUrlFormat(listItem.headImage, '@148h_240w_1e_1c_2o')}/></div>
                                        <div className="info">
                                            <div className="name elli-text">{listItem.name}</div>
                                            <div className="from">原价: {listItem.price}</div>
                                            {
                                                listItem.bonusStatus === 'Y' ?
                                                    <div className="price">契约金比例: {listItem.bonusPercent}%</div>
                                                :
                                                <div className="price">未开启契约金计划</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="money-box">
                                        <div className="left camp-left">
                                            <span>报名人数：<var>{listItem.authNum}</var></span>                                     
                                        </div>
                                        <div className="right camp-right">
                                            <span>实际收益：<var className="total-money">￥{listItem.actualAmount}</var></span>
                                        </div>
                                    </div>
                                    <Link to={`/wechat/page/live/profit/detail/checkinCamp/${listItem.campId}`} className="btn-link">查看收益明细</Link>
                                </div>
                            ))
                        }
                    </ScrollToLoad>
                </div>
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({

});

const mapActionToProps = {
    fetchCheckinCampProfits,
}

export default connect(mapStateToProps, mapActionToProps)(LiveProfitCheckinCampAnalysis);