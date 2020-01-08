/**
 * 底部操作按钮及菜单，抽离自课程介绍页，按钮可配置
 * @author jiajun.li
 * @data 20180403
 */


import React, { Component } from 'react';
import { locationTo } from 'components/util';

export default class GoHome extends Component {
    handleLocation() {
        if(this.props.isUnHome){
            locationTo('/wechat/page/university/home')
        } else if (this.props.locationType == 'living') {
            locationTo(`/wechat/page/live/${this.props.liveId}`)
        } else {
            locationTo('/wechat/page/recommend')
        }
    }
    render() {
        let { scrolling, isUnHome, className = '' } = this.props;
        return (
            <div className={ `__operate-menu-v2 ${ className }` }>
                <div className={`__operate-menu-box ${scrolling=='Y'?'scrolling':(scrolling=='S'?'scrolling-stop':'')}`}>
                    <div 
                        className="__operate-menu-entry __recommend-entry"
                        // data-log-name="回首页1"
                        // data-log-region="home"
                        onClick={this.handleLocation.bind(this)}
                        >
                        { !isUnHome && <i className="icon_home"></i>}
                        { isUnHome && <i className="icon-un-home"></i>}
                        
                    </div>
                </div>
            </div>
        )
    }
}