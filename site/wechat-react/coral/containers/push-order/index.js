import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import ScrollToLoad from 'components/scrollToLoad';
import {
    locationTo,
    imgUrlFormat,
    formatDate,
	formatMoney
} from 'components/util';
import {
	fillParams,
} from 'components/url-utils'
import Detect from 'components/detect';
import { Confirm } from 'components/dialog';


// actions
// import { getUserInfo } from '../../actions/common';
import { getPushOrderList } from '../../actions/shop';


import Page from 'components/page';
const showGoodieBag = true;

class CoralPushOrder extends Component {

    state={
        orderList:[],
        pageNum:0,
        pageSize:20,
        noMore:false,
        noOne:false,
        emptyPicIndex:1,
    }
    componentDidMount(){
        this.loadPushOrderList();
    }
    async loadPushOrderList(next){
        let pageNum=++this.state.pageNum;
        await this.props.getPushOrderList(pageNum,this.state.pageSize);
        if(this.props.orderList.length<=0){
            this.setState({
                noOne:true,
            });
        }else if(this.props.orderList.length>0&&this.props.orderList.length<(pageNum*this.state.pageSize)){
            this.setState({
                noMore:true,
            });
        }
        this.setState({
            orderList:this.props.orderList,
            pageNum,
        },function(){
            next&&next();
        });
        
    }

    render() {
        return (
            <Page title="收益明细" className='coral-push-order'>
                <div className="order-list">
                <ScrollToLoad
                        className='shop-list-scroll'
                        toBottomHeight={1000}
                        loadNext={this.loadPushOrderList.bind(this)}
                        noneOne={this.state.noOne}
                        noMore={this.state.noMore}
                        emptyPicIndex={this.state.emptyPicIndex}
                        emptyMessage= '暂没有收益~'
                    >
                    <ul>
                    {
                        this.state.orderList&&
                        this.state.orderList.length>0&&
                        this.state.orderList.map((item,index)=>{
                            return <li key={`push-order-${index}`}>
                                <div className="business-info">
                                    <div className="name elli">{item.businessName}</div>
                                    <div className="time">{formatDate(item.createTime,'yyyy年MM月dd日')}</div>
                                </div>
                                <div className="business-detail">
                                    <span className="money">+{formatMoney(item.profit)}元</span>
                                    {
                                        item.userType ==="PROMOTION"?//升级
                                        <span className="people">来自：<var className="elli">{item.userName}</var></span>
                                        :
                                        (
                                            item.userType === 'TEAMSCORE'||item.userType === 'ACTIVITY'?//团队业绩
                                            null
                                            :
                                            <span className="people">{item.userType==='BUYER'?'购买人':'分享人'}：<var className="elli">{item.userName}</var></span>
                                        )
                                        
                                    }
                                </div>
                            </li>
                        })
                        
                    }
                    </ul>
                    </ScrollToLoad>
                </div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        orderList: state.shop.orderList,
    }
}

const mapActionToProps = {
    getPushOrderList,
}

module.exports = connect(mapStateToProps, mapActionToProps)(CoralPushOrder);
