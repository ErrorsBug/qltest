import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import DetailVipList from './components/detail-list';

//actions
import {getShareIncomeDetailVipInit,getShareIncomeDetailVip} from '../../actions/share-income-flow';

class ShareIncomeDetailVip extends Component {
    state ={
        isNoMoreFlow:false,
        isNoFlow:false,
        page:1,
        size:20,
        liveId:this.props.params.liveId,
    }
    async componentDidMount() {
        await this.props.getShareIncomeDetailVipInit(this.state.liveId);
        const result=await this.props.getShareIncomeDetailVip(1,20,this.state.liveId);
        if(result.state.code===0){
            this.setState({
                page:(this.state.page+1),
            });
            if(result.data.shareEanring&&result.data.shareEanring.length<=0){
                console.log("没有数据");
                this.setState({
                    isNoFlow:true,
                })
            }
        }
    }
    async loadMoreFlow(next){
        const result=await this.props.getShareIncomeDetailVip(this.state.page,this.state.size,this.state.liveId);
        if(result.state.code===0){
            this.setState({
                page:(this.state.page+1),
            });
            if(result.data.shareEanring&&result.data.shareEanring.length<=0||result.data.shareEanring.length<this.state.size){
                console.log("没有更多数据了");
                this.setState({
                    isNoMoreFlow:true,
                })
            }
        }
        next&&next();
    }
    render() {
        return (
            <Page title={`直播间会员收益明细`} className="share-income-detail-vip">
                
                <ScrollToLoad
                className="scroll-box"
                toBottomHeight={500}
                page={this.state.page}
                noneOne={this.state.isNoFlow}
                loadNext={ this.loadMoreFlow.bind(this) }
                noMore={ this.state.isNoMoreFlow } >
                    <a href={`/wechat/page/live/${this.state.liveId}`} className="from icon_enter">
                        <span className="from_i">查看直播间</span>
                        <span className="from_title multi-elli">{this.props.shareDetailInfo.liveName}</span>
                    </a>
                    <div className="profit">
                        <span>你直播间目前的会员收益为</span>
                        <span><var>{this.props.shareDetailInfo.totalEarning}</var>元</span>
                    </div>
                    <DetailVipList topics={this.props.shareDetailList}/>
                </ScrollToLoad>
            </Page>
        );
    }
}

ShareIncomeDetailVip.propTypes = {

};
function mapStateToProps (state) {
    return {
        shareDetailList:state.ShareIncomeFlow.shareIncomeDetailVip,
        shareDetailInfo:state.ShareIncomeFlow.shareIncomeDetailVipInfo,
    }
}

const mapActionToProps = {
    getShareIncomeDetailVipInit,
    getShareIncomeDetailVip
}

module.exports = connect(mapStateToProps, mapActionToProps)(ShareIncomeDetailVip);