import React, {Component} from 'react';
import {connect} from 'react-redux';
//组件
import Page from 'components/page';
import ListItem from './components/list-item';
import ScrollToLoad from 'components/scrollToLoad';

// actions
import { getChannelDistributionDetail, missionDetailList } from '../../actions/channel-distribution';
import { getTopicDistributionDetail } from '../../actions/distribution';

class ChannelDistributionRepresentDetailList extends Component {

    state = {
        businessId: this.props.params.businessId,
        shareId: this.props.location.query.shareId,
        type: this.props.location.query.type,
        businessType: this.props.location.query.businessType,
        page:1,
        size:20,
        isNoMoreDate:false,
        noneData:false,
        invitedList:[],
    };

    async componentDidMount() {
        if (this.state.type == 'return') {
            this.fetchReturnDetailList()
        } else {
            this.fetchChannelDistributionDetail()
        }
    }
    // 原本的课代表逻辑
    async fetchChannelDistributionDetail() {
        const { getChannelDistributionDetail, getTopicDistributionDetail } = this.props;
        const { businessId, businessType, shareId, page, size } = this.state;
        const result = await (businessType === 'channel' ? getChannelDistributionDetail(businessId, shareId, page, size) : getTopicDistributionDetail(businessId, shareId, page, size));

        if (result.state.code === 0) {
            this.setState({
                page: this.state.page+1,
                invitedList: [...this.state.invitedList,...result.data.result || []],
            });
            if (result.data.result.length <= 0) {
                console.log("没有数据");
                
                this.setState({
                    noneData:true,
                })
                console.log(this.state.noneData);
            }
        }
    }
    // 拉人返现
    async fetchReturnDetailList() {
        let { businessId, page, size, businessType} = this.state
        let result = await this.props.missionDetailList({
            businessId,
            businessType: businessType || 'channel',
            inviteFrom: this.props.location.query.userId,
            page: {
                page: page,
                size: size
            }
        })
        if (result.state.code === 0) {
            this.setState({
                page: page + 1,
                invitedList:[...this.state.invitedList, ...result.data.missionDetailList || []],
            });

            if(this.state.invitedList.length <= 0) {
                this.setState({
                    noneData: true,
                });
            } else if(result.data.missionDetailList && result.data.missionDetailList.length < size) {
                this.setState({
                    noneData: false,
                    isNoMoreDate: true
                });
            };
        }
    }

    async loadMoreData(next) {
        if (this.state.type == 'return') {
            await this.fetchReturnDetailList()
            next && next()
        } else {
            const { getChannelDistributionDetail, getTopicDistributionDetail } = this.props;
            const { businessId, businessType, shareId, page, size } = this.state;
            const res = await (businessType === 'channel' ? getChannelDistributionDetail(businessId, shareId, page, size) : getTopicDistributionDetail(businessId, shareId, page, size));
            if(res.state.code === 0){
                if (res.data.result) {
                    this.setState({
                        page: this.state.page + 1,
                        invitedList: [...this.state.invitedList, ...res.data.result],
                    });
                }
                if (res.data.result.length == 0 || res.data.result.length < this.state.size) {
                     console.log("没有更多数据了");
                    this.setState({
                        isNoMoreDate:true,
                    })
                }
                next && next();
            }
        }
    };

    render() {
        
        return (
            <Page title='课代表推广明细' className='channel-distri-re-detail-list'>
                <ScrollToLoad
                    className="scroll-box"
                    toBottomHeight={100}
                    page={this.state.page}
                    noneOne={this.state.noneData}
                    loadNext={ this.loadMoreData.bind(this) }
                    noMore={ this.state.isNoMoreDate } >
                    <ListItem items={this.state.invitedList} type={this.state.type}/>
                </ScrollToLoad>
                
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        // channelInvitedList:state.channelDistribution.channelInvitedList,
    };
}
const mapActionToProps = {
    getChannelDistributionDetail,
    getTopicDistributionDetail,
    missionDetailList,
};

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelDistributionRepresentDetailList);