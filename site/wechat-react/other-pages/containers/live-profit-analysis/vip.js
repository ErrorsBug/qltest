import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class LiveProfitVipAnalysis extends Component {
    render() {
        return (
            <div className='vip-analysis'>
                <div className="live-analysis-list">
                    <div className="item">
                        <div className="title-bar"><b>每天刷牙还有蛀牙？检测你刷牙的,dadadafsas sdfasdfjds f</b></div>
                        <div className="info-bar">
                            <span className="title">收费方式</span>
                            <span className="content">按时收费</span>
                        </div>
                        <ul className="info-ul clearfix">
                            <li>
                                <span className="title">收费笔数：</span>
                                <span className="content">99</span>
                            </li>
                            <li className='type-one'>
                                <span className="title">累计收益：</span>
                                <span className="content">¥1000</span>
                            </li>
                        </ul>
                        <a href="#" className="btn-link">查看收益</a>
                    </div>
                </div>
            </div>
        );
    }
}

LiveProfitVipAnalysis.propTypes = {

};

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProfitVipAnalysis);
