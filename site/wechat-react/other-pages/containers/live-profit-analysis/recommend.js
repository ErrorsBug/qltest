import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { formatMoney } from 'components/util';
import { autobind} from 'core-decorators';
import { fetchRecommendProfitList } from '../../actions/profit';
@autobind

class LiveProfitRecommendAnalysis extends Component {
    state = {
        noneTopicOne : false,
        noTopicMore : false,

        currentTimeMillis : 0,
        type:'topic', //channel,topic
        
        noneChannelOne: false,
        noChannelMore: false,
    }

    componentDidMount() {
        this.initState();
    }


    async initState() {

        if(!this.props.currentTimeMillis && this.props.recommendTopicList.length < 1) {
            await this.props.fetchRecommendProfitList(this.props.params.liveId, this.state.type);
        }
        this.setState({
            noneTopicOne : this.props.recommendTopicList.length < 1 ? true : false,
            currentTimeMillis : this.props.currentTimeMillis ? this.props.currentTimeMillis : Date.now(),
        })
        
    }


    async loadMoreRecommend(next){
        let result =  await this.props.fetchRecommendProfitList(this.props.params.liveId, this.state.type);
        if(result && result.state && result.state.code && result.state.code !=='0'){
            window.toast(result.state.msg);
        }
        if(result && result.state && result.data && result.data.resultList && result.data.resultList.length < 20) {
            if (this.state.type == 'topic') {
                this.setState({
                    noTopicMore: true
                })
            } else {
                this.setState({
                    noChannelMore: true
                })
            }
            
        }
        next && next();
    }


    async changeTabFunc(type){
        console.log('***************', this.props.recommendChannelPage);
        if(type == "channel" && this.props.recommendChannelPage == 1) {
            await this.props.fetchRecommendProfitList(this.props.params.liveId, type);
            if(this.props.recommendChannelList.length < 1){
                this.setState({
                    noneChannelOne: true,
                });
            }
        }
        this.setState({
            type,
        });
    }
    render() {
        let { recommendTotal } = this.props
        return (
            <Page title="推荐收益分析" className='analysis-center-page'>
              <div className="recommend-wrap">

                <div className="recommend-herder-box">
                    <h3 className="recommend-title">
                        <img className="live-profit-icon" src={require(`./img/icon-like.png`)}></img>
                        千聊推荐
                    </h3>
                    <div className="recommend-income">
                        <div className="income-item">
                            <div className="income-title">累计收益(元)</div>
                            <div className="income-num">{formatMoney(recommendTotal.totalMoney || 0, 1)}</div>
                        </div>
                        <div className="income-item">
                            <div className="income-title">累计订单数</div>
                            <div className="income-num">{recommendTotal.orderNum || 0}</div>
                        </div>
                    </div>
                </div>

                <div className="tab-bar">
                  <span className={this.state.type=="topic"? "active" : ''} onClick={()=>{this.changeTabFunc("topic")}}>话题</span>
                  <span className={this.state.type=="channel"? "active" : ''} onClick={()=>{this.changeTabFunc("channel")}}>系列课</span>
                </div>
                <div className='recommend-analysis'>
                    {
                        this.state.type=="topic"?
                        <ScrollToLoad
                            className='dd'
                            toBottomHeight={500}
                            loadNext={ this.loadMoreRecommend }
                            noneOne={this.state.noneTopicOne}
                            noMore={ this.state.noTopicMore } >
                            
                            <div className="live-analysis-list">
                                {
                                    this.props.recommendTopicList.map((listItem,index)=>(
                                        <div className="item" key={`normal-channel-${index}`}>
                                            <div className="title-bar"><b>{listItem.title}</b></div>
                                            <div className="info-bar">
                                                <span className="title">直播间收益: 
                                                    <span className="content">￥ {listItem.totalMoney}</span>
                                                </span>
                                                <span className="title">订单数: 
                                                    <span className="content">{listItem.orderNum}</span>
                                                </span>
                                            </div>

                                            <Link to={`/wechat/page/live/profit/anslysis/recommend-details/${listItem.businessId}?type=topic`} className="recommend-btn-link">
                                                查看收益明细
                                                <div className="enter-btn icon_enter"></div>
                                            </Link>
                                        </div>
                                    ))
                                }
                          </div>
                      </ScrollToLoad>
                      :
                      <ScrollToLoad
                        className='dd'
                        toBottomHeight={500}
                        loadNext={ this.loadMoreRecommend }
                        noneOne={ this.state.noneChannelOne }
                        noMore={ this.state.noChannelMore } >
                            
                        <div className="live-analysis-list">
                            {
                                this.props.recommendChannelList.map((listItem,index)=>{

                                    return (
                                        <div className="item" key={`normal-channel-${index}`}>
                                            <div className="title-bar"><b>{listItem.title}</b></div>
                                            <div className="info-bar">
                                                <span className="title">直播间收益: 
                                                    <span className="content">￥{listItem.totalMoney}</span>
                                                </span>
                                                <span className="title">订单数: 
                                                    <span className="content">{listItem.orderNum}</span>
                                                </span>
                                            </div>

                                            <Link to={`/wechat/page/live/profit/anslysis/recommend-details/${listItem.businessId}?type=channel`} className="recommend-btn-link">
                                                查看收益明细
                                                <div className="enter-btn icon_enter"></div>
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                      </ScrollToLoad>
                    }
                </div>
            </div>
          </Page>
        );
    }
}

LiveProfitRecommendAnalysis.propTypes = {
    
};

function mapStateToProps(state) {
    console.log('state::', state.profit)
     return {
        recommendChannelList: state.profit.recommendChannelList,
        recommendTopicList : state.profit.recommendTopicList,
        currentTimeMillis : state.profit.currentTimeMillis,
        recommendChannelPage: state.profit.recommendChannelPage,
        recommendTotal: state.profit.recommendTotal
    };
}

const mapActionToProps = {
    fetchRecommendProfitList
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProfitRecommendAnalysis);
