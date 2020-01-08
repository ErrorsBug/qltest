import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { autobind } from 'core-decorators'
import { locationTo, formatMoney, formatDate } from 'components/util';
import { getProfitRecordList, getRedEnvelopeAccount } from '../../actions/red-envelope';
import ScrollToLoad from 'components/scrollToLoad';
import Empty from './empty-page'


function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    
}
@autobind
class RedEnvelopeIncome extends Component {
    
    state = {
        // 列表
        list: [],
        // 是否为空
        empty: false,
        // 总收益
        totalAmount: 0,
        // 待提现
        balance: 0,
        // 已提现
        withdrawAmount: 0,
        pageSize: 20,
        pageNum: 1,
        isNoMore: false
    }

    async componentDidMount(){
        this.getRedEnvelopeAccount()
        this.getProfitRecordList()
    }

    // 获取账户信息列表
    async getProfitRecordList(load){
        const result = await getProfitRecordList({
            pageNum: load ? this.state.pageNum : 1,
            pageSize: this.state.pageSize
        })
        if(result.state.code === 0){
            let list = this.state.list.concat(result.data.list || [])
            this.setState({
                list,
                pageNum: this.state.pageNum + 1
            })
            if (result.data.list && result.data.list.length < this.state.pageSize) {
                this.setState({
                    isNoMore: true
                });
            }
        }
    }

    async loadMore() {
        this.getProfitRecordList(true)
    }

    // 获取红包账户信息
    async getRedEnvelopeAccount(){
        const result = await getRedEnvelopeAccount()
        if(result.state.code === 0){
            this.setState({
                totalAmount: result.data.totalAmount || 0,
                balance: result.data.balance || 0,
                withdrawAmount: result.data.withdrawAmount || 0,
            })
        }
    }

    // 红包收益类型
    redpackType(type){
        let state = ''
        switch(type){
            case 'accept': 
                state = '抢红包获得收益'; 
                break;
            case 'share':
                state = '分享课程红包奖励';
                break;
            case 'invite':
                state = '分享课程红包奖励';
                break;
            case 'award':
                state = '为老师打Call红包奖励';
                break;
            case 'return':
                state = '红包过期退还剩余金额';
                break;
        }
        return state
    }

    render() {
        const { withdrawAmount, balance, totalAmount, list, empty } = this.state
        return (
            <Page title="红包收益" className="red-envelope-income-page">
                <div className="top">
                    <div className="title">红包总收益</div>
                    <div className="money"><em>{totalAmount ? Number(formatMoney(totalAmount)).toFixed(2) : 0}</em> 元</div>
                    <div className="group">
                        <div className="balance list">
                            <div className="list-money"><em>{balance ? Number(formatMoney(balance)).toFixed(2) : 0}</em> 元</div>
                            <span>待发放</span>
                        </div>
                        <div className="list">
                            <div className="list-money"><em>{withdrawAmount ? Number(formatMoney(withdrawAmount)).toFixed(2) : 0}</em> 元</div>
                            <span>已发放</span>
                        </div>
                    </div>
                    <div className="tip-group">
                        <p>温馨提示</p>
                        <p>1. 红包会在次日直接发送到你的微信钱包；</p>
                        <p>2. 待发放金额至少满1元才能发放。</p>
                    </div>
                </div>
                <div className="label">领取明细列表</div>
                <div className="income">
                    <ScrollToLoad
                        className="scroll-box"
                        toBottomHeight={500}
                        loadNext={ this.loadMore }
                        noMore={ this.state.isNoMore } >
                        {
                            list.length > 0 && list.map((item, index) => (
                                <div className="list" key={`list${index}`}>
                                    <div className="group">
                                        <span className="type">{this.redpackType(item.profitType)}</span>
                                        <span className="time">{formatDate(item.createTime, 'yyyy.MM.dd hh:mm')}</span>
                                    </div>
                                    <span className="money">+{Number(formatMoney(item.money)).toFixed(2)}元</span>
                                </div>
                            ))
                        }
                    </ScrollToLoad>
                </div>
            </Page>
        );
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(RedEnvelopeIncome);
