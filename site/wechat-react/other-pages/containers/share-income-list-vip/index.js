import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import ShareIncomeVipList from './components/share-income-flow';

//actions
import {getShareIncomeListVip} from '../../actions/share-income-flow';

class ShareIncomeListVip extends Component {
    state ={
        isNoMoreFlow:false,
        isNoFlow:false,
        page:1,
        size:20,
    }
    async componentDidMount() {
        const result=await this.props.getShareIncomeListVip(1,20);
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
        const result=await this.props.getShareIncomeListVip(this.state.page,this.state.size);
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
            <Page title={`直播间会员收益分析`} className="share-income-vip-list">
            <ScrollToLoad
                className="scroll-box"
                toBottomHeight={500}
                loadNext={ this.loadMoreFlow.bind(this) }
                noneOne={this.state.isNoFlow}
                noMore={ this.state.isNoMoreFlow } >
                <ShareIncomeVipList items={this.props.shareFlowList}/>
            </ScrollToLoad>
            </Page>
        );
    }
}

ShareIncomeListVip.propTypes = {

};
function mapStateToProps (state) {
    return {
        shareFlowList:state.ShareIncomeFlow.shareIncomeListVip
    }
}

const mapActionToProps = {
    getShareIncomeListVip,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ShareIncomeListVip);