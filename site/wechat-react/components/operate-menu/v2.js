
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BottomDialog from 'components/dialog/bottom-dialog';
import { locationTo, isLogin } from 'components/util';


/**
 * @param {array} config [
 *      {
 *          name
 *          qlicon      svg图标
 *          icon        url图标
 *          style       覆盖样式
 *          onClick
 *      }
 * ]
 * @param {object} entryStyle
 */

export default class OperateMenu extends Component {
    static propTypes = {
        config: PropTypes.array,
    }

    static defaultProps = {
        config: []
    }

    state = {
        isShowBottomMenu: false
    }

    render() {
        let { config, entryStyle, showBackHome, scrolling, isUnHome } = this.props;
        if (!config || !config.length) return false;

        // ul分组
        let uls = [], ul = [];
        config.forEach(item => {
            ul.push(item);
            // if (ul.length >= 4) {
            //     uls.push(ul);
            //     ul = [];
            // }
        })
        uls.push(ul);
        return (
            <div className={`__operate-menu-v2 `}>
                <div className={`__operate-menu-box ${scrolling=='Y'?'scrolling':(scrolling=='S'?'scrolling-stop':'')} ${this.props.isFixMemberBlock ? 'member-up' : ''} ${this.props.fixFissionBlock ? this.props.fixFissionBlock : ''}`}>
                    <div className={`__operate-menu-entry on-log on-visible`}
                        data-log-name="更多按钮"
                        data-log-region="more-opreation-entry"
                        onClick={this.onClickEntry}
                        style={entryStyle}>
                        {/* 奖学金提示 */}
                        {this.props.haveSchloarship ? <span className="schloarship-tip">1</span> : null }
                        <i className="icon_functions"></i>
                    </div>

                    {
                        (showBackHome || isUnHome) && (
                            <div 
                                className="__operate-menu-entry __recommend-entry on-log on-visible"
                                data-log-name="回首页"
                                data-log-region="home"
                                onClick={() => { 
                                    if(isUnHome){
                                        locationTo('/wechat/page/university/home')
                                    } else {
                                        locationTo('/wechat/page/recommend')
                                    }
                                }}
                                >
                               { !isUnHome && <i className="icon_home"></i>}
                                { isUnHome && <i className="icon-un-home"></i>}
                            </div>
                        )
                    }
                </div>

                <BottomDialog 
                    key='operation-dialog'
                    show={this.state.isShowBottomMenu}
                    theme='empty'
                    onClose={this.hideBottomMenu}
                >
                    <div className="__operate-menu-list">
                        <div className="menu-list">
                            {
                                uls.map((item, index) => <ul key={index} className={item && item.length > 4 ? 'no-spacearound' : ''}>
                                    {
                                        item.map((item, index) => 
                                            <MenuItem
                                                key={index}
                                                data={item}
                                                onClick={this.onClickItem} />
                                        )
                                    }
                                </ul>)
                            }
                        </div>
                        <div className="close-button" onClick={this.hideBottomMenu}>关闭</div>
                    </div> 
                </BottomDialog>
            </div>
        )
    }

    onClickItem = (e, item) => {
        item.onClick && item.onClick(item);
        this.hideBottomMenu();
    }

    onClickEntry = () => {
        this.props.onClickEntry && this.props.onClickEntry();
        this.showBottomMenu();
    }

    showBottomMenu = () => {
        this.setState({
            isShowBottomMenu: true
        }, () => {
            // 手动触发打曝光日志
            setTimeout(() => {
                typeof _qla != 'undefined' && _qla.collectVisible();
            }, 10);
        })
    }

    hideBottomMenu = e => {
        this.setState({
            isShowBottomMenu: false
        })
        window._qla && _qla('click', {name: '更多操作弹窗-关闭', region: "more_close"});
    }
}


class MenuItem extends Component {
    render() {
        let { name, icon, qlicon, onClick, ...props } = this.props.data;
        return (
            <li>
                <div onClick={this.onClick} {...props}>
                    <p>
                        {
                            qlicon ?
                            <i className={`icon_${qlicon}`}></i> : 
                            <img src={icon} />
                        }
                    </p>
                    <span>{name}</span>
                </div>
            </li>
        )
    }

    onClick = e => {
        this.props.onClick(e, this.props.data);
    }
}