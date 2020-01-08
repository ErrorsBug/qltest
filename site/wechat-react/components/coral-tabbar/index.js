import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';

class CoralTabBar extends Component {
    state = {
    }
    componentDidMount() {

    }
    
    render() {
        return (
            <ul className="coral-tab-bar">
                <Link
                    className={classnames("tab-item", "coral-shop", "on-log", {
                        active: this.props.activeTab === 'coral-shop'
                    })}
                    to="/wechat/page/coral/shop"
                    data-log-region="coral-tab-bar"
                    data-log-pos="coral-shop"
                    data-log-name="知识分享商城">
                    <div className="tab-title">首页</div>
                </Link>
                <Link
                    className={classnames("tab-item", "coral-bought", "on-log", {
                        active: this.props.activeTab === 'coral-bought'
                    })}
                    to="/wechat/page/coral/bought-course"
                    data-log-region="bottom"
                    data-log-pos="bought"
                    data-log-name="我的">
                    <div className="tab-title">已购</div>
                </Link>
                <Link
                    className={classnames("tab-item", "coral-mine", "on-log", {
                        active: this.props.activeTab === 'coral-mine'
                    })}
                    to="/wechat/page/coral/mine"
                    data-log-region="bottom"
                    data-log-pos="mine"
                    data-log-name="我的">
                    <div className="tab-title">我的</div>
                </Link>
                
            </ul>
        );
    }
}

CoralTabBar.propTypes = {
    // 当前激活的tab名称
    activeTab: PropTypes.string.isRequired,
};

export default CoralTabBar;