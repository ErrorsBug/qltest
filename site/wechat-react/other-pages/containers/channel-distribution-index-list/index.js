const isNode = typeof window == 'undefined';

import React, {Component} from 'react';

import {connect} from 'react-redux';
import Page from 'components/page';
import classnames from 'classnames';
//子组件
import ChannelDistributionIndexListItem from './components/distribution-item';
import ScrollToLoad from 'components/scrollToLoad';
//action
import {
    channelDistributionIndexList,
} from '../../actions/channel-distribution';

class ChannelDistributionIndexList extends Component {
    state = {
        itemList: [], //分销列表数组
        noneData:false,
        notShowLoaded: false, //加载完是否不显示文案
        isNoMore: false, //是否还有更多
        pageNum: 1, //请求第几页
        pageSize: 20, //请求每页的大小
    }

    //请求获取系列课分销列表
    async requestDistributionList(next) {
        let result = await this.props.channelDistributionIndexList(this.props.params.liveId, this.state.pageNum, this.state.pageSize);
        if(result.state.code == "0"){
            this.setState({
                itemList: [...this.state.itemList, ...result.data.list],
                pageNum: this.state.pageNum + 1,
            });
        }
        if(this.state.itemList.length<1){
            this.setState({
                noneData: true
            });
        }else if (result.data.list.length < this.state.pageSize) {
            this.setState({
                isNoMore: true
            });
        }
        next&&next();
    }

    componentDidMount() {
        this.requestDistributionList(); //挂载后立即请求获取第一页
    }

    render() {
        var items = this.state.itemList.map((obj,index) => {
            return (
                <ChannelDistributionIndexListItem 
                    {...obj} 
                    index={index} 
                />
            );
        });
        
        return (
            <Page title='系列课分销列表' className='channel-distri-index-list-container'>

                <ScrollToLoad
                    className={"scroll-box"}
                    toBottomHeight={500}
                    noneOne={this.state.noneData}
                    notShowLoaded = {this.state.notShowLoaded}
                    loadNext={ this.requestDistributionList.bind(this) }
                    noMore={ this.state.isNoMore } >

                    {items}
                </ScrollToLoad>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
    channelDistributionIndexList
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelDistributionIndexList);