import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { formatDate,locationTo ,imgUrlFormat} from 'components/util';
import { autobind} from 'core-decorators';

import { fetchProfitRecordTopic,clearProfitRecordTopic } from '../../actions/profit';
@autobind

class LiveProfitTopicAnalysis extends Component {

    state = {
        noneOne : false,
        noMore : false,
        currentTimeMillis : 0,
    }

    componentDidMount(){
        this.initState();
    }
    
    
    componentWillUnmount() {
        this.props.clearProfitRecordTopic();
    }

    async initState(){
        if(!this.props.currentTimeMillis && this.props.recordTopic.length < 1){
            await this.props.fetchProfitRecordTopic(this.props.params.liveId);
        }


        this.setState({
            noneOne : this.props.recordTopic.length < 1 ? true : false,
            currentTimeMillis : this.props.currentTimeMillis?this.props.currentTimeMillis:Date.now(),
        })
    }


    async loadMoreRepresent(next){
        let result =  await this.props.fetchProfitRecordTopic(this.props.params.liveId);
        if(result&&result.state&&result.state.code && result.state.code !=='0'){
            window.toast(result.state.msg);
        }
        if(result&&result.state&&result.data && result.data.topicList && result.data.topicList.length < 20){
            this.setState({
                noMore : true
            })
        }
        console.log('...',result);
        next && next();
    }

    render() {
        return (
            <Page title="直播间话题收益分析" className='analysis-center-page'>
                <div className='topic-analysis'>
                    <ScrollToLoad
                        className='dd'
                        toBottomHeight={500}
                        loadNext={ this.loadMoreRepresent }
                        noneOne={this.state.noneOne}
                        noMore={ this.state.noMore } >
                        
                        <div className="live-analysis-list">
                        {
                            this.props.recordTopic.map((listItem,index)=>(
                                <div className="item" key = {`record-topid-${index}`}>
                                    <div className="title-bar">
                                        <b>{listItem.topicPo.topic}</b>
                                        {listItem.isRelay =='Y'?<var className='icon-relay'>转播</var>:null}
                                    </div>
                                    {
                                        listItem.isRelay =='Y'?
                                        <div className="info-bar">
                                            <span className="title">转播来自</span>
                                            <span className="content">{listItem.sourceLiveName}(分成{listItem.profitRatio}%)</span>
                                        </div>
                                        :null
                                    }
                                    <div className="info-bar">
                                        {
                                            listItem.topicPo.style !="audioGraphic" ?
                                            <span>
                                                <span className="title">开始时间</span>
                                                <span className="content">{formatDate(listItem.topicPo.startTime,'yyyy-MM-dd hh:mm:ss')}</span>
                                            </span>
                                            :null
                                        }
                                        
                                        {
                                            (listItem.topicPo.status==="delete")?
                                            <var className="icon-status ended">已删除</var>
                                            :(listItem.topicPo.status==="ended" && listItem.topicPo.style !="audioGraphic")?
                                            <var className="icon-status ended">已结束</var>
                                            :(listItem.topicPo.status==="beginning" && listItem.topicPo.style !="audioGraphic" && Number(listItem.topicPo.startTime) > Number(this.state.currentTimeMillis))?
                                            <var className="icon-status beginning">即将开始</var>
                                            : listItem.topicPo.style !="audioGraphic" ?
                                            <var className="icon-status beginning">正在进行</var>
                                            :null
                                        }
                                    </div>
                                    <ul className="info-ul clearfix">
                                        <li>
                                            <span className="title">入场票收益：</span>
                                            <span className="content">¥{listItem.sumCourse||0}</span>
                                        </li>
                                        {
                                            listItem.topicPo.style !="audioGraphic" ?
                                            <li>
                                                <span className="title">赠礼收益：</span>
                                                <span className="content">¥{listItem.sumGift||0}</span>
                                            </li>
                                            :null
                                        }
                                        {
                                            listItem.topicPo.style !="audioGraphic" ?
                                            <li>
                                                <span className="title">赞赏收益：</span>
                                                <span className="content">¥{listItem.sumReward||0}</span>
                                            </li>
                                            :null
                                        }
                                        {
                                            listItem.topicPo.style !="audioGraphic" ?
                                            <li>
                                                <span className="title">文件收益：</span>
                                                <span className="content">¥{listItem.sumDoc||0}</span>
                                            </li>
                                            :null
                                        }
                                        {
                                            listItem.topicPo.style !="audioGraphic" ?
                                            <li>
                                                <span className="title">私问提成：</span>
                                                <span className="content">¥{listItem.sumWishper||0}</span>
                                            </li>
                                            :null
                                        }
                                        {
                                            listItem.isBeRelay =='Y'?
                                            <li>
                                                <span className="title">转播收益：</span>
                                                <span className="content">¥{listItem.sumRelay||0}</span>
                                            </li>
                                            :null
                                        }
                                        <li className='type-one'>
                                            <span className="title">累计收益：</span>
                                            <span className="content">¥{listItem.sum||0}</span>
                                        </li>
                                    </ul>
                                    <a href={`/live/reward/topicIncomelist/${listItem.topicPo.id}.htm`} className="btn-link">查看收益明细</a>
                                    {
                                        listItem.isBeRelay =='Y'?
                                        <a href={`/live/reward/relayIncomelist/${listItem.topicPo.id}.htm`} className="btn-link">查看转播方成交收益</a>
                                        :null
                                    }
                                </div>
                            ))
                        }
                        </div>
                    </ScrollToLoad>
                    
                </div>
            </Page>
            
        );
    }
}

LiveProfitTopicAnalysis.propTypes = {
    
};

function mapStateToProps(state) {
    return {
        recordTopic : state.profit.recordTopic,
        currentTimeMillis : state.profit.currentTimeMillis,
    };
}

const mapActionToProps = {
    fetchProfitRecordTopic,
    clearProfitRecordTopic,
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProfitTopicAnalysis);
