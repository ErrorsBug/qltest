import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import DetailChannelList from './components/detail-list';

//actions
import {getShareIncomeDetailChannelInit,getShareIncomeDetailChannel} from '../../actions/share-income-flow';

class ShareIncomeDetailChannel extends Component {
    state ={
        isNoMoreFlow:false,
        isNoFlow:false,
        page:1,
        size:20,
        channelId:this.props.params.channelId,
    }
    async componentDidMount() {
        await this.props.getShareIncomeDetailChannelInit(this.state.channelId);
        const result=await this.props.getShareIncomeDetailChannel(1,20,this.state.channelId);
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
        const result=await this.props.getShareIncomeDetailChannel(this.state.page,this.state.size,this.state.channelId);
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
            <Page  title={`系列课收益明细`} className="share-income-detail-channel">
                
                <ScrollToLoad
                className="scroll-box"
                toBottomHeight={500}
                page={this.state.page}
                noneOne={this.state.isNoFlow}
                loadNext={ this.loadMoreFlow.bind(this) }
                noMore={ this.state.isNoMoreFlow } >
                    <a href={`/live/channel/channelPage/${this.state.channelId}.htm`} className="from icon_enter">
                        <span className="from_i">查看系列课</span>
                        <span className="from_title multi-elli">{this.props.shareDetailInfo.channelName}</span>
                    </a>
                    <div className="profit">
                        <span>你本次系列课目前收益为</span>
                        <span><var>{this.props.shareDetailInfo.totalEarning}</var>元</span>
                    </div>
                    <DetailChannelList topics={this.props.shareDetailList}/>
                </ScrollToLoad>
                
            </Page>
        );
    }
}

ShareIncomeDetailChannel.propTypes = {

};
function mapStateToProps (state) {
    return {
        shareDetailList:state.ShareIncomeFlow.shareIncomeDetailChannel,
        shareDetailInfo:state.ShareIncomeFlow.shareIncomeDetailChannelInfo,
    }
}

const mapActionToProps = {
    getShareIncomeDetailChannelInit,
    getShareIncomeDetailChannel
}

module.exports = connect(mapStateToProps, mapActionToProps)(ShareIncomeDetailChannel);