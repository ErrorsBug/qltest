const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import ChannelList  from './components/channel-list';
import { locationTo ,updatePageData,isNumberValid} from 'components/util';

// actions
import {getChannelSort,saveChannelSort,changeChannelSort} from '../../actions/channel-list-sort';

class ChannelSort extends Component {
    state={
        isNoMoreChannelData:false,
    }

    componentDidMount() {
        this.getChannelList();

    };

    async changeChannelSort(id,weight){
        await this.props.changeChannelSort(id,weight);
    }

    async saveChannelSort(){
        let allPass = true;
        allPass = !this.props.channelList.some((item)=>{
            return item.weight==0?false:!isNumberValid(item.weight,1,99999,"系列课排序");
        })
        if(allPass){
            const result = await this.props.saveChannelSort(
                this.props.params.liveId,
                this.props.channelList,
                true,
            );
            window.toast(result.state.msg);
            if (result.state.code === 0) {
                updatePageData();
                window.history.go(-1);
            }
        }
    };

    async getChannelList(next){


        // 初始化系列课列表
        // if (this.props.channelList.length < 1) {
          const result= await this.props.getChannelSort(
                "weixin",
                this.props.params.liveId,
                this.props.channelPageNum,
                this.props.channelPageSize,
                true,
            );
        // }

        next && next();

        // 初始数据不够分页，则结束分页加载更多
        if (result && result.data && result.data.channelList.length < this.props.channelPageSize) {
            this.setState({
                isNoMoreChannelData: true
            });
        }
    };

    render() {
        let { channelList }=this.props;

        return (
            <Page title={`系列课排序`} className="channel-sort">
                <ScrollToLoad
                    className="sort-box"
                    toBottomHeight={100}
                    loadNext={ this.getChannelList.bind(this) }
                    noMore={ this.state.isNoMoreChannelData } >
                    <span  className="top-tips">在框内输入整数，数字越大排序越靠前，不填时则按默认排序，最早开课排前面。</span>
                    <ChannelList
                        items={ channelList }
                        changeChannelSort = {this.changeChannelSort.bind(this)}
                    />
                </ScrollToLoad>
                <div className="btn-box">
                    <a className="btn-save" href="javascript:;" onClick={this.saveChannelSort.bind(this)}>保存</a>
                </div>
            </Page>
        );
    }
}

ChannelSort.propTypes = {

};

function mapStateToProps (state) {
    return {
        channelList: state.channelListSort.channelList,
        channelPageSize: state.channelListSort.channelPageSize,
        channelPageNum: state.channelListSort.channelPageNum
    }
}

const mapActionToProps = {
    getChannelSort,
    saveChannelSort,
    changeChannelSort,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelSort);
