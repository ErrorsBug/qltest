/**
 * 底部操作按钮及菜单，抽离自课程介绍页，按钮可配置
 * @author jiajun.li
 * @data 20180403
 */
 

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BottomDialog from 'components/dialog/bottom-dialog';



export default class OperateMenu extends Component {
    static propTypes = {
        config: PropTypes.array,
    }

    state = {
        isShowBottomMenu: false
    }

    render() {
        let { config } = this.props;

        return (
            <div className="__operate-menu">
                <aside className="operation-icon" onClick={this.showBottomMenu}>
                    <img src={ require('./img/operation-icon.png') } />
                    <span>操作</span>
                </aside>

                <BottomDialog 
                    key='operation-dialog'
                    show={this.state.isShowBottomMenu}
                    theme='empty'
                    onClose={this.hideBottomMenu}
                >
                    <div className="icons-container">
                        <div className="headers">
                            操作
                        </div>
                        <ul>
                            {
                                config.map((item, index) => 
                                    <li key={index} onClick={item.onClick}>
                                        <div>
                                            {
                                                item.qlicon ?
                                                <i className={`icon_${item.qlicon}`} style={item.style}></i> : 
                                                <img src={item.src} />
                                            }
                                            <span>{item.name}</span>
                                        </div>
                                    </li>
                                )
                            }
                        </ul>

                        {/* <div className="close-button" onClick={this.hideBottomMenu}>关闭</div> */}
                    </div> 
                </BottomDialog>
            </div>
        )
    }

    showBottomMenu = e => {
        this.setState({
            isShowBottomMenu: true
        })
    }

    hideBottomMenu = e => {
        this.setState({
            isShowBottomMenu: false
        })
    }
}