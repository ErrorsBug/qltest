import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import ShareIncomeTopicList from './components/share-income-flow';
import Empty from 'components/empty-page';

//actions
import {getShareIncomeListTopic} from '../../actions/share-income-flow';

class ShareIncomeListTopic extends Component {
    state ={
        isNoMoreFlow:false,
        isNoFlow:false,
        page:1,
        size:20,
    }
    async componentDidMount() {
        const result=await this.props.getShareIncomeListTopic(1,20);
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
        const result=await this.props.getShareIncomeListTopic(this.state.page,this.state.size);
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
            <Page title={`话题收益分析`} className="share-income-topic-list">
            <ScrollToLoad
                className="scroll-box"
                toBottomHeight={500}
                page={this.state.page}
                noneOne={this.state.isNoFlow}
                loadNext={ this.loadMoreFlow.bind(this) }
                noMore={ this.state.isNoMoreFlow } >
                <ShareIncomeTopicList items={this.props.shareFlowList}/>
            </ScrollToLoad>
            </Page>
        );
    }
}

ShareIncomeListTopic.propTypes = {

};
function mapStateToProps (state) {
    return {
        shareFlowList:state.ShareIncomeFlow.shareIncomeListTopic
    }
}

const mapActionToProps = {
    getShareIncomeListTopic,
    Empty,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ShareIncomeListTopic);