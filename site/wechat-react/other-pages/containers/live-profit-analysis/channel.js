import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { formatDate, locationTo, imgUrlFormat, formatMoney} from 'components/util';
import { autobind} from 'core-decorators';
import { isLiveAdmin } from '../../actions/live';
import { fetchProfitRecordChannel, clearProfitRecordChannel, fetchKnowledgeProfitList} from '../../actions/profit';
@autobind

class LiveProfitChannelAnalysis extends Component {
    state = {
        noneOne : false,
        noMore : false,
        currentTimeMillis : 0,
        type:'my',//my,techno
        
        noneTechOne:false,
        noTechMore:false,
        technopageNum:1,
        technopageSize:20,

        isLiveMedia: false,
    }

    componentDidMount(){
        this.initState();
    }


    async initState(){
        // 如果是自媒体版，就显示“知识通系列课”选项卡
        // const result = await this.props.isLiveAdmin(this.props.params.liveId);
        // if (result.state.code === 0) {
        //     if (result.data.liveLevel === 'selfMedia') {
                this.setState({
                    isLiveMedia: true
                });
        //     }
        // }

        if(!this.props.currentTimeMillis && this.props.recordChannel.length < 1){
            await this.props.fetchProfitRecordChannel(this.props.params.liveId);
        }
        this.setState({
            noneOne : this.props.recordChannel.length < 1 ? true : false,
            currentTimeMillis : this.props.currentTimeMillis?this.props.currentTimeMillis:Date.now(),
        })
        
    }


    async loadMoreRepresent(next){
        let result =  await this.props.fetchProfitRecordChannel(this.props.params.liveId);
        if(result&&result.state&&result.state.code && result.state.code !=='0'){
            window.toast(result.state.msg);
        }
        if(result&&result.state&&result.data && result.data.channelList && result.data.channelList.length < 20){
            this.setState({
                noMore : true
            })
        }
        console.log('...',result);
        next && next();
    }

    async loadMoreTechnoList(next){
        let result =  await this.props.fetchKnowledgeProfitList(this.props.params.liveId);
        if(result&&result.state&&result.state.code && result.state.code !=='0'){
            window.toast(result.state.msg);
        }
        if(result&&result.state&&result.data && result.data.knowledgeList && result.data.knowledgeList.length < 20){
            this.setState({
                noTechMore : true
            })
        }
        console.log('...',result);
        next && next();
    }

    async changeTabFunc(type){
        console.log("********************************************");
        console.log(this.props.pageTechnoNum);
        if(type=="techno"&&this.props.pageTechnoNum==1){
            let result =  await this.props.fetchKnowledgeProfitList(this.props.params.liveId);
            if(this.props.technoChannel.length <1){
                this.setState({
                    noneTechOne:true,
                });
            }
        }
        this.setState({
            type,
        });
    }
    render() {
        return (
            <Page title="直播间系列课收益分析" className='analysis-center-page'>
                {
                    this.state.isLiveMedia ?
                        <div className="tab-bar">
                            <span className={this.state.type=="my"?"active":''} onClick={()=>{this.changeTabFunc("my")}}>我的系列课</span>
                            <span className={this.state.type=="techno"?"active":''} onClick={()=>{this.changeTabFunc("techno")}}>知识通系列课</span>
                        </div>
                    :
                        <div className="tab-bar">
                            <span>我的系列课</span>
                        </div>
                }
                <div className='channel-analysis'>
                    {
                        this.state.type=="my"?
                        <ScrollToLoad
                            className='dd'
                            toBottomHeight={500}
                            loadNext={ this.loadMoreRepresent }
                            noneOne={this.state.noneOne}
                            noMore={ this.state.noMore } >
                            
                            <div className="live-analysis-list">
                            {
                                this.props.recordChannel.map((listItem,index)=>(
                                    <div className="item" key={`normal-channel-${index}`}>
                                        <div className="title-bar"><b>{listItem.channelPo.name}</b></div>
                                        <div className="info-bar">
                                            <span className="title">收费方式</span>
                                            <span className="content">{listItem.channelPo.chargeType=='absolutely'?'固定收费':'按月收费'}</span>
                                        </div>
                                        <ul className="info-ul clearfix">
                                            <li>
                                                <span className="title">入场票收益：</span>
                                                <span className="content">¥{listItem.sumCourse}</span>
                                            </li>
                                            <li>
                                                <span className="title">赠礼收益：</span>
                                                <span className="content">¥{listItem.sumGift}</span>
                                            </li>
                                            <li className='type-one'>
                                                <span className="title">累计收益：</span>
                                                <span className="content">¥{listItem.sum}</span>
                                            </li>
                                        </ul>
                                        <Link to={`/wechat/page/live/profit/detail/channel/${listItem.channelPo.id}`} className="btn-link">查看收益明细</Link>
                                        {
                                            listItem.isKnowledge ? 
                                                <Link to={`/wechat/page/live/profit/detail/channel-Knowledge/${listItem.channelPo.id}`} className="btn-link">媒体投放收益</Link>
                                            :   null
                                        }
                                    </div>
                                ))
                            }
                            </div>
                        </ScrollToLoad>
                        :
                        <ScrollToLoad
                            className='dd'
                            toBottomHeight={500}
                            loadNext={ this.loadMoreTechnoList }
                            noneOne={ this.state.noneTechOne }
                            noMore={ this.state.noTechMore } >
                            
                            <div className="techno-analysis-list">
                            {
                                this.props.technoChannel.map((listItem,index)=>{

                                    const priceTag = listItem.salePrice.discountStatus === 'Y' ? "特惠" : "原价";

                                    let originPrice = '';
                                    let salesPrice = '';
                                    let salesProfit = ''
                                    
                                    if (listItem.chargeType=="absolutely") {
                                        if (listItem.salePrice.discountStatus === 'Y') {
                                            originPrice = listItem.salePrice.discount;
                                        } else {
                                            originPrice = listItem.salePrice.amount;
                                        }

                                        salesPrice = originPrice; //销售价格与原价暂时相等，以后估计会做调整
                                        salesProfit = salesPrice * listItem.profit;
                                    } else {
                                        originPrice = listItem.sourcePrice.amount+"/"+listItem.sourcePrice.chargeMonths+"月"
                                        salesPrice = originPrice; //销售价格与原价暂时相等，以后估计会做调整
                                        salesProfit = listItem.sourcePrice.amount * listItem.profit;
                                    }

                                    return (
                                        <div className="item" key={`techno-channel-${index}`}>
                                            <div className="info-box">
                                                <div className="pic"><img src={imgUrlFormat(listItem.channelImg,"@148h_240w_1e_1c_2o")}/></div>
                                                <div className="info">
                                                    <div className="name elli-text">{listItem.channelName}</div>
                                                    <div className="from">{listItem.sourceLiveName}</div>
                                                    <div className="price">{priceTag}：￥{originPrice}（分成比例{listItem.profit}%）</div>
                                                </div>
                                            </div>
                                            <div className="money-box">
                                                <div className="left">
                                                    <span>销售价格：<var>￥{salesPrice}</var></span>
                                                    <span>单价收益：<var>￥{formatMoney(salesProfit)}</var></span>                                                
                                                </div>
                                                <div className="right">
                                                    <span>累计售卖：<var>{listItem.totalCount}单</var></span>
                                                    <span>累计获益：<var className="total-money">￥{listItem.totalMoney}</var></span>
                                                </div>
                                            </div>
                                            <Link to={`/wechat/page/live/profit/detail/channel/${listItem.channelId}`} className="btn-link">查看收益明细</Link>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </ScrollToLoad>
                        
                    }
                    
                </div>
            </Page>
        );
    }
}

LiveProfitChannelAnalysis.propTypes = {
    
};

function mapStateToProps(state) {
     return {
        technoChannel: state.profit.technoChannel,
        recordChannel : state.profit.recordChannel,
        currentTimeMillis : state.profit.currentTimeMillis,
        pageTechnoNum: state.profit.pageTechnoNum,
    };
}

const mapActionToProps = {
    isLiveAdmin,
    fetchProfitRecordChannel,
    clearProfitRecordChannel,
    fetchKnowledgeProfitList,
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProfitChannelAnalysis);
