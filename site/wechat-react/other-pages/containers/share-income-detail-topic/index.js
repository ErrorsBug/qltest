import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import DetailTopicList from './components/detail-list';

//actions
import { getShareIncomeDetailTopic , getShareIncomeDetailTopicInit } from '../../actions/share-income-flow';

class ShareIncomeDetailTopic extends Component {

    state ={
        isNoMoreFlow:false,
        isNoFlow:false,
        page:1,
        size:20,
        topicId:this.props.params.topicId,
    }
    async componentDidMount() {
        await this.props.getShareIncomeDetailTopicInit(this.state.topicId);
        const result=await this.props.getShareIncomeDetailTopic(1,20,this.state.topicId);
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
        const result=await this.props.getShareIncomeDetailTopic(this.state.page,this.state.size,this.state.topicId);
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
        next && next();
    }

    render() {
        return (
            <Page title={`话题收益明细`} className="share-income-detail-topic">
                
                <ScrollToLoad
                className="scroll-box"
                toBottomHeight={500}
                page={this.state.page}
                noneOne={this.state.isNoFlow}
                loadNext={ this.loadMoreFlow.bind(this) }
                noMore={ this.state.isNoMoreFlow } >
                    <a href={`/topic/${this.state.topicId}.htm`} className="from icon_enter">
                        <span className="from_i">查看话题</span>
                        <span className="from_title multi-elli">{this.props.shareDetailInfo.topicName}</span>
                    </a>
                    <div className="profit">
                        <span>你本次课程目前收益为</span>
                        <span><var>{this.props.shareDetailInfo.totalEarning}</var>元</span>
                    </div>
                    <DetailTopicList topics={this.props.shareDetailList}/>
                </ScrollToLoad>
                
            </Page>
        );
    }
}

ShareIncomeDetailTopic.propTypes = {

};
function mapStateToProps (state) {
    return {
        shareDetailList:state.ShareIncomeFlow.shareIncomeDetailTopic,
        shareDetailInfo:state.ShareIncomeFlow.shareIncomeDetailTopicInfo,
    }
}

const mapActionToProps = {
    getShareIncomeDetailTopic,
    getShareIncomeDetailTopicInit,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ShareIncomeDetailTopic);