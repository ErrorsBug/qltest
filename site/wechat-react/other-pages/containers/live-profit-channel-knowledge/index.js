import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { MiddleDialog } from 'components/dialog';
import ChannelItemCard from './components/channel-Item-card';
import ChannelProfitCard from './components/channel-profit-card';
import { fetchChannelDetail, fetchMediaProfitRecords, clearProfitMediaRecord } from '../../actions/profit';

@autobind
class LiveProfitChannelKnowledge extends Component {
    state = {
        // 弹出媒体投放的说明提示模态窗
        showMediaDialog: false,
        // 是否还有更多的收益记录
        noMore: false,
        // 是否没有一条数据
        noneOne: false,
        // 收益记录数据
        profitRecords: [],
    }

    data = {
        // 页码，默认为1
        page : 1,
        // 每页的记录条数
        pageSize: 20
    }

    get channelId(){
        return this.props.params.channelId;
    }

    showDialog(){
        this.setState({
            showMediaDialog: true
        })
    }

    closeDialog(){
        this.setState({
            showMediaDialog: false
        })
    }

    /**
     * 加载更多的收益记录
     */
    loadMoreProfitRecords = async (next) => {
        const channelId = this.channelId;
        const page = {
            page: this.data.page++,
            size: this.data.pageSize,
        }
        const result = await this.props.fetchMediaProfitRecords({channelId, page});
        if (result.state && result.state.code === 0) {
            const list = result.data.list;
            if (list.length == 0 && page.page == 1) {
                this.setState({
                    noneOne: true
                });
            } else if (list.length < this.data.pageSize) {
                this.setState({
                    noMore: true
                })
            }
        }
        next && next();
    }

    componentDidMount = async () => {
        const channelId = this.channelId;
        await this.props.fetchChannelDetail({channelId});
        await this.loadMoreProfitRecords();
    }

    componentWillUnmount(){
        this.data.page = 1;
        this.props.clearProfitMediaRecord();
    }

    render(){
        return (
            <Page title="媒体投放收益" className="profit-channel-knowledge-container">
                <p className="knowledge-profit-tip" onClick={this.showDialog}>什么是媒体投放<i className="icon-ask icon_ask2"></i></p>
                {/* 系列课信息 */}
                <ChannelItemCard {...this.props.channelDetail} />
                {/* 媒体投放收益信息 */}
                <section className="all-profit-stream">
                    <ScrollToLoad
                        className='dd'
                        toBottomHeight={500}
                        loadNext={this.loadMoreProfitRecords}
                        noMore={this.state.noMore}
                        noneOne={this.state.noneOne} >
                        {
                            this.props.mediaProfitRecords.map((record, index) => <ChannelProfitCard {...record} key={index}/>)
                        }
                    </ScrollToLoad>
                </section>
                <MiddleDialog 
                    show={this.state.showMediaDialog}
                    buttons='none'
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="media-dialog"
                    title=''>
                    <div className="whatis-media-put">
                        <h1 className="media-put-title">什么是媒体投放?</h1>
                        <p className="media-put-text">为了帮老师们提高优质课程的曝光率，千聊与媒体渠道合作，选择老师的优质课程进行投放。您可从中获得更多销售渠道、提高课程收益。</p>
                        <button className="close-dialog-btn" onClick={this.closeDialog}>确定</button>
                    </div>
                </MiddleDialog>
            </Page>
        )
    }
}

function mapStateToProps(state){
    const profit = state.profit;
    return {
        channelDetail: {
            channelName: profit.channelName,
            channelImg: profit.channelImg,
            price: {...profit.chargeconfigList},
            sharePercent: Number(profit.sharePercent),
            chargeType: profit.chargeType,
        },
        mediaProfitRecords: profit.mediaProfitRecords,
    }
}

const mapActionToProps = {
    fetchChannelDetail,
    fetchMediaProfitRecords,
    clearProfitMediaRecord,
}

export default connect(mapStateToProps, mapActionToProps)(LiveProfitChannelKnowledge);