import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import ScrollToLoad from 'components/scrollToLoad';
import Header from './components/header'
import ChannelItem from './components/channel-item'
import { orderStatics } from '../../actions/home'

@autobind
class StatisticalTable extends Component {
    state = {
        isNoMore: false,
        lists: [],
        orderNum: 0
    }
    page = {
        size: 20,
        page: 1
    }
    isLoading = false;
    get chId(){
        return getUrlParams('chId', '')
    }

    async componentDidMount() { 
        this.initData();
    }

    // 初始化数据
    async initData() {
        const { orderList = [], orderNum } = await orderStatics({ chId: this.chId, ...this.page });
        if(!!orderList){
            if(orderList.length >= 0 && orderList.length < this.page.size){
                this.setState({
                    isNoMore: true
                })
            } else {
                this.page.page += 1;
            } 
            this.setState({
                orderNum: orderNum || this.state.orderNum,
                lists: [...this.state.lists, ...orderList]
            })
        } 
    } 

    // 下拉加载
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore) return false;
        this.isLoading = true;
        await this.initData();
        this.isLoading = false;
        next && next();
    }
    
    render(){
        const { isNoMore, lists, orderNum } = this.state;
        return (
            <Page title="渠道订单查询" className="st-table-box">
                <ScrollToLoad
                    className={"st-table-scroll"}
                    toBottomHeight={300}
                    disable={ isNoMore }
                    loadNext={ this.loadNext }>
                    <Header orderNum={ orderNum } />
                    <div className="st-table-lists">
                        { !!lists.length && lists.map((item, index) => (
                            <ChannelItem key={ index } {...item} />
                        )) }
                        { !lists.length  && <div className="no-data">暂无数据</div> }
                    </div>
                </ScrollToLoad>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    
};

module.exports = connect(mapStateToProps, mapActionToProps)(StatisticalTable);