import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import ShareIncomeChannelList from './components/share-income-flow';

//actions
import {getShareIncomeListChannel} from '../../actions/share-income-flow';

class ShareIncomeListChannel extends Component {
    state ={
        isNoMoreFlow:false,
        isNoFlow:false,
        page:1,
        size:20,
    }
    async componentDidMount() {
        const result=await this.props.getShareIncomeListChannel(1,20);
        if(result.state.code===0){
            this.setState({
                page:(this.state.page+1),
            });
            if(result.data.list.length<=0){
                console.log("没有数据");
                this.setState({
                    isNoFlow:true,
                })
            }
        }
    }
    async loadMoreFlow(next){
        const result=await this.props.getShareIncomeListChannel(this.state.page,this.state.size);
        if(result.state.code===0){
            this.setState({
                page:(this.state.page+1),
            });
            if(result.data.list.length<=0||result.data.list.length<this.state.size){
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
            <Page title={`系列课收益分析`} className="share-income-channel-list">
            <ScrollToLoad
                className="scroll-box"
                toBottomHeight={500}
                loadNext={ this.loadMoreFlow.bind(this) }
                noneOne={this.state.isNoFlow}
                noMore={ this.state.isNoMoreFlow } >
                <ShareIncomeChannelList items={this.props.shareFlowList}/>
            </ScrollToLoad>
            </Page>
        );
    }
}

ShareIncomeListChannel.propTypes = {

};
function mapStateToProps (state) {
    return {
        shareFlowList:state.ShareIncomeFlow.shareIncomeListChannel
    }
}

const mapActionToProps = {
    getShareIncomeListChannel,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ShareIncomeListChannel);