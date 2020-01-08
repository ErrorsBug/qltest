/*
 * @Author: shuwen.wang 
 * @Date: 2017-05-11 10:53:26 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-06-02 14:38:16
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Page from 'components/page';

import { fetchProfitOverview } from '../../actions/profit'

class LiveProfitChecking extends Component {

    constructor(props) {
        super(props)
    }

    get liveId() {
        return this.props.params.liveId
    }

    componentDidMount() {
        if (this.props.checking === null) {
            this.updateOverview()
        }
    }

    updateOverview() {
        this.props.fetchProfitOverview(this.liveId)
    }

    render() {
        return (
            <Page title='待结算金额'>
                <div className="live-profit-checkling-container">
                    <header>
                        <span className='state'>待结算金额&nbsp;&nbsp;<var>(审核中)</var></span>
                        <span>{this.props.checking}元</span>
                    </header>
                    <p>
                        为了保障用户的权益，课程未开播产生的入场票收益待结算，已开播的课程购买3天后会自动计入可提现金额。系列课产生的收益及其他类型收益，均会在7天后计入可提现金额。
                        <br/>
                        打卡训练营产生的收益，会在7日后计入可提现金额
                    </p>
                </div>
            </Page>
        );
    }
}

LiveProfitChecking.propTypes = {
    checking: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
    return {
        checking: state.profit.checking,
    };
}

const mapActionToProps = {
    fetchProfitOverview,
};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProfitChecking);