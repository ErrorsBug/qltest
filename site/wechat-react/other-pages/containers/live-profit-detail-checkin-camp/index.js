import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import ProfitList from 'components/live-profit-list/list'
import { imgUrlFormat } from 'components/util';

import { 
    fetchCheckinCampDetail,
    fetchCheckinCampProfitDetail,    
} from '../../actions/profit';

@autobind
class LiveProfitDetailCheckinCamp extends Component {
    state = {
        // 收益记录是否经加载完毕
        noMore: false,
        // 收益记录是否为空
        noneOne: false,
        // 收益记录数据
        profitDetailRecords: [],
        // 打卡训练营详情
        campDetail: {},
    }

    data = {
        // 页码
        page: 1,
        // 每页加载的记录条数
        pageSize: 20,
    }

    get campId(){
        return this.props.params.campId;
    }

    /**
     * 加载收益明细数据
     */
    async loadMoreProfitDetailRecords(next){
        const campId = this.campId;
        const page = {
            page: this.data.page++,
            size: this.data.pageSize,
        }
        const result = await this.props.fetchCheckinCampProfitDetail({campId, page});
        if (result.state && result.state.code === 0) {
            const list = result.data.list || [];
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
                        profitDetailRecords: [
                            ...prevState.profitDetailRecords,
                            ...list,
                        ]
                    }
                });
            }
        } else {
            window.toast(result.state.msg);
        }
        next && next();
    }

    componentDidMount(){
        // 获取打卡训练营的详情
        fetchCheckinCampDetail(this.campId).then((result) => {
            if (result.state.code === 0) {
                this.setState({
                    campDetail: result.data.liveCamp
                });
            } else {
                window.toast(result.state.msg);
            }
        }).catch((error) => {
            console.error(error);
        });
        // 加载第一页的收益明细记录
        this.loadMoreProfitDetailRecords();
    }

    render(){
        const {
            noneOne,
            noMore,
            profitDetailRecords,
            campDetail,
        } = this.state;
        return (
            <Page title="打卡训练营收益明细" className="checkin-camp-profit-detail">
                <div className="checkin-camp">
                    <div className="info-box">
                        <div className="pic"><img src={imgUrlFormat(campDetail.headImage, '@148h_240w_1e_1c_2o')}/></div>
                        <div className="info">
                            <div className="name elli-text">{campDetail.name}</div>
                            <div className="from">原价: {campDetail.price}</div>
                            {
                                campDetail.bonusStatus === 'Y' ?
                                    <div className="price">契约金比例: {campDetail.bonusPercent}%</div>
                                : 
                                <div className="price">未开启契约金计划</div>
                            }
                        </div>
                    </div>
                    <div className="money-box">
                        <div className="left">
                            <span>报名人数：<var>{campDetail.authNum}</var></span>                                     
                        </div>
                        <div className="right">
                            <span>实际收益：<var className="total-money">￥{campDetail.actualAmount}</var></span>
                        </div>
                    </div>
                </div>
                <ScrollToLoad
                        className='dd checkin-camp-profit-detail-list'
                        toBottomHeight={500}
                        loadNext={this.loadMoreProfitDetailRecords}
                        noneOne={noneOne}
                        noMore={noMore}>
                    <ProfitList list={profitDetailRecords} />
                </ScrollToLoad>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({

});

const mapActionToProps = {
    fetchCheckinCampProfitDetail,
}

export default connect(mapStateToProps, mapActionToProps)(LiveProfitDetailCheckinCamp);






