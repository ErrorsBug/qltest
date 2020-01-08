/*
 * @Author: shuwen.wang 
 * @Date: 2017-05-11 10:53:26 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-06-02 14:37:28
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Page from 'components/page';
import Scrolltoload from 'components/scrollToLoad'
import { Tabbar, ProfitList } from 'components/live-profit-list'

import {
    fetchProfitDetailChannel,
    clearProfitDetailChannel,
} from '../../actions/profit'

const tabs = [
    { value: "course", text: "入场票" },
    { value: "gift", text: "赠礼" },
]

class LiveProfitDetailChannel extends Component {

    constructor(props) {
        super(props)
    }

    get channelId() {
        return this.props.params.channelId
    }

    componentDidMount() {
        if (this.props.page === 1) {
            this.fetchList()
        } else {
            if (!this.props.list.length) {
                this.setState({ noneOne: true })
            }
        }
    }

    componentWillUnmount() {
        this.props.clearProfitDetailChannel()
    }

    state = {
        activeTab: "course",

        noMore: false,
        noneOne: false,
    }

    fetchList = async (next) => {
        const result = await this.props.fetchProfitDetailChannel(this.channelId, this.state.activeTab, this.props.page, this.props.size)
        if (result && result.state && result.state.code === 0) {
            const len = result.data.list.length;
            console.log(len)
            if (len < this.props.size) {
                len === 0
                    ? this.setState({ noneOne: true })
                    : this.setState({ noMore: true })
            }
        }
        next && next()
    }

    onTabClick = async(value) => {
        await this.setState({
            activeTab: value,
            noneOne: false,
            noMore: false,
        })
        this.props.clearProfitDetailChannel()
        this.fetchList()
    }

    render() {
        console.log(111222, this.props.list)
        return (
            <Page title='系列课收益明细' cs="flex-full-scroll-container">
                <div className="live-profit-detail-channel-container">
                    <Tabbar
                        tabs={tabs}
                        onTabClick={this.onTabClick}
                        active={this.state.activeTab}
                    />
                    <div className="list">
                        <Scrolltoload
                            loadNext={this.fetchList}
                            toBottomHeight={500}
                            noMore={this.state.noMore}
                            page={this.state.page}
                            noneOne={this.state.noneOne}
                        >
                            {
                                this.props.list.length > 0 &&
                                < ProfitList
                                    tab={this.state.activeTab}
                                    list={this.props.list}
                                />
                            }
                        </Scrolltoload>
                    </div>
                </div>
            </Page>
        );
    }
}

LiveProfitDetailChannel.propTypes = {

};

function mapStateToProps(state) {
    return {
        list: state.profit.detailChannel,
        page: state.profit.detailChannelPage,
        size: state.profit.detailChannelSize,
    };
}

const mapActionToProps = {
    fetchProfitDetailChannel,
    clearProfitDetailChannel,
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProfitDetailChannel);