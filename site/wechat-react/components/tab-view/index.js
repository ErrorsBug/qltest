import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * tab切换组件
 * 
 * @author jiajun.li
 * @date 20180402
 * 
 * @param {array} tabs tab配置列表
 *      [{name, render}, ...]
 * @param {bool} destoryWhenHide 隐藏tab的方式直接注销组件
 */


export default class TabView extends Component {
    static propTypes = {
        tabs: PropTypes.array,
        defaultIndex: PropTypes.number,
        destoryWhenHide: PropTypes.bool,
    }

    static defaultProps = {
        tabs: [],
        defaultIndex: 0,
        destoryWhenHide: false,
    }

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: props.defaultIndex,
        }
    }

    render() {
        let { tabs, destoryWhenHide } = this.props;
        let { activeIndex } = this.state;

        return (
            <div className="__tab-view">
                <div className="tab-list">
                {
                    tabs.map((item, index) => {
                        return (
                            <div className={activeIndex == index ? "tab-item active" : "tab-item"}
                                key={index}
                                data-index={index}
                                onClick={this.onClickTab}>
                                <span>{item.name}</span>
                            </div>
                        )
                    })
                }
                </div>
                <div className="content-list">
                {
                    tabs.map((item, index) => {
                        let cls = activeIndex == index ? "content-item active" : "content-item";

                        if (destoryWhenHide && activeIndex != index) return false;

                        return (
                            <div className={cls}
                                key={index}>
                                {
                                    item.render ? item.render() : false
                                }
                            </div>
                        )
                    })
                }
                </div>
            </div>
        )
    }

    onClickTab = e => {
        let index = e.currentTarget.getAttribute('data-index') || 0;
        this.setState({
            activeIndex: index
        })
    }
}
