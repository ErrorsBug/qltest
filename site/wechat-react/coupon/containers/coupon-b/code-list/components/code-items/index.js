import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate, formatMoney, locationTo } from 'components/util'

class CodeItems extends Component {

    state = {

    }

    selectCouponId = (e) => {
        this.props.selectCouponId(e);
    }
    selectShareCouponId = (e) => {
        this.props.selectShareCouponId(e);
    }

    componentWillReceiveProps(nextProps) {

    }

    usedue = (item) => {
        return item.codeNum !== null && item.useNum == item.codeNum
    }

    overdue = (item) => {
        return item.overTime && item.overTime < Date.now()
    }

    isShowShareBtn = (item) => {
        if (item.overTime && item.overTime < Date.now()) {
            return false
        }
        if (item.codeNum !== null && item.useNum == item.codeNum) {
            return false
        }
        return true;
    }

    gotoshare = (item) => {
        let url = '';
        switch (this.props.type) {
            case 'topic':
                url = `/wechat/page/send-coupon/topic-batch?topicId=${item.belongId}&codeId=${item.id}&liveId=${item.liveId}`;
                break;
            case 'channel':
                url = `/wechat/page/send-coupon/channel-batch?channelId=${item.belongId}&codeId=${item.id}&liveId=${item.liveId}`;
                break;
            case 'camp':
                url = `/wechat/page/send-coupon/camp-batch?campId=${item.belongId}&codeId=${item.id}&liveId=${item.liveId}`;
                break;
            case 'global-vip':
                url = `/wechat/page/send-coupon/vip-batch?liveId=${item.liveId}&codeId=${item.id}`;

                break;
        }
        location.href = url;
    }

    getBottomColor = (item) => {
        if (this.overdue(item)) {
            return 'overdue'
        }
        if (this.usedue(item)) {
            return 'usedue'
        }
        return ''
    }

    active = (item) => {
        return (this.overdue(item) || this.usedue(item));
    }

    couponType = () => {
        switch (this.props.type) {
            case 'channel': 
                return '系列课券';
            case 'topic':
                return '话题券';
            case 'global-vip':
                return 'vip券';
        }
    }

    uiDisable = (item) => {
        return (this.usedue(item) || this.overdue(item));
    }

    getIndicator = (item) => {
        switch (this.props.type) {
            case 'channel': 
                if (this.uiDisable(item)) {
                    return require('./img/channel-indicator-due.png');
                } else {
                    return require('./img/channel-indicator.png');
                }
            case 'topic':
                if (this.uiDisable(item)) {
                    return require('./img/topic-indicator-due.png');
                } else {
                    return require('./img/topic-indicator.png');
                }
            case 'global-vip':
                if (this.uiDisable(item)) {
                    return require('./img/vip-indicator-due.png');
                } else {
                    return require('./img/vip-indicator.png');
                }
        }
    }

    // 保留直播间vip 使用旧样式
    renderLiveVip = () => {
        return (
            <div className='coupon-code-list'>
                {
                    this.props.couponList.map((item, index) => {
                        return (

                            <div className={`code-item ${(item.overTime && item.overTime < Date.now()) && 'overTime'} ${this.uiDisable(item) ? 'code-item-disable' : ''}`} key={`code-item-${index}`}>
                                <div className={"code-item-inner " + (this.uiDisable(item) ? 'disable-code-item' : '')}>

                                    <div className={"code-item-inner-inner "}>
                                        {
                                            this.isShowShareBtn(item) ?
                                            <div className={"share-btn"} onClick={() => {
                                                this.gotoshare(item);
                                            }}>
                                                          
                                            <svg height="100%" width="100%" version="1.1" viewBox="0 0 136 60">
                                                <defs/>
                                                <g id="Page-1" fill="none" stroke="none" strokeWidth="1">
                                                    <g id="系列" transform="translate(-555.000000, -800.000000)">
                                                        <g id="Group-8" transform="translate(555.000000, 800.000000)">
                                                            <g id="Group-14">
                                                                <g id="分享系列-copy" transform="translate(20.000000, 12.000000)"/>
                                                                <g id="分享系列" transform="translate(20.000000, 12.000000)"/>
                                                                <rect height="60" id="Rectangle-7" width="136" fill="#F63556" rx="30" x="0" y="2.27373675e-13"/>
                                                                <rect height="36" id="Rectangle-2" width="36" x="20" y="12"/>
                                                                <path id="Rectangle" d="M52,30.7744502 L52,40 C52,42.209139 50.209139,44 48,44 L28,44 C25.790861,44 24,42.209139 24,40 L24,20 C24,17.790861 25.790861,16 28,16 L34.3876825,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-2" d="M46,16 L52.0373881,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-2" d="M52,16 L52,22.0373881" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-3" d="M34,33.4676769 L50.4676769,17" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <rect height="36" id="Rectangle-2" width="36" x="20" y="12"/>
                                                                <path id="Rectangle" d="M52,30.7744502 L52,40 C52,42.209139 50.209139,44 48,44 L28,44 C25.790861,44 24,42.209139 24,40 L24,20 C24,17.790861 25.790861,16 28,16 L34.3876825,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-2" d="M46,16 L52.0373881,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-2" d="M52,16 L52,22.0373881" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-3" d="M34,33.4676769 L50.4676769,17" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <text id="分享" fill="#FFFFFF" fontFamily="PingFangSC-Medium, PingFang SC" fontSize="26">
                                                                    <tspan x="62.0714282" y="40">分享</tspan>
                                                                </text>
                                                            </g>
                                                            <g id="Group-12"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            </div> : null
                                        }
                                        <div className={"coupon-indicator " + (this.uiDisable(item) ? 'disable-coupon-indicator': '')}>
                                            <img src={this.getIndicator(item)} />
                                        </div> 
                                        <li className="money">
                                            <span className="unit">¥</span><span className="content">{item.money}</span>
                                        </li>
                                        <li>
                                            <span className="label">到期时间：</span>
                                            <span className="content">{item.overTime ? formatDate(item.overTime, 'yyyy-MM-dd hh:mm:ss') : '永久有效'}</span>
                                        </li>
                                        <li>
                                            <span className="label">数量：</span>
                                            <span className="content">{(item.codeNum ? item.codeNum - item.useNum : '无限制' )+ '/' + (item.codeNum || '无限制')}</span>
                                        </li>
                                        {
                                            item.remark ?
                                                <li className="remark">
                                                    <span className="label">备注：</span>
                                                    <span className="content">{item.remark}</span>
                                                </li> : null
                                        }
                                    </div>
                                </div>
                                <div className="bottom-btn">
                                    <div className="bottom-btn-inner">
                                        {
                                            (item.businessType == 'topic' || item.businessType == 'channel' || item.businessType == 'camp')  ?
                                                <div className="show-intro" onClick={
                                                                                    ((item.overTime && item.overTime < Date.now()) ||this.uiDisable(item))?this.props.hideHelperHandle: 
                                                                                    (this.props.selectedCouponId != item.id   ) ?this.props.showHelperHandle:this.props.unselectCouponId} data-id={item.id}>
                                                    <span className={`check-box ${(this.props.selectedCouponId == item.id) ? 'on' : 'off'}`}>
                                                        {
                                                            this.props.selectedCouponId == item.id ? 
                                                            <img src={
                                                                (item.overTime && item.overTime < Date.now()) || this.uiDisable(item)?
                                                                require('./img/coupon-un.png'):
                                                                require('./img/coupon-on.png')
                                                            } />:null
                                                        }
                                                    </span>
                                                    <span className={"label-flex " + this.getBottomColor(item)}>显示在介绍页
                                                    </span>
                                                </div>
                                                : null 
                                        }
                                        {
                                            (item.businessType == 'topic' || item.businessType == 'channel') ?
                                                <div className="show-intro" onClick={ 
                                                                                    ((item.overTime && item.overTime < Date.now()) ||this.uiDisable(item))?this.props.hideHelperHandle: 
                                                                                    (item.shareStatus == 'N'  ) ? this.props.showIArrowHandle: this.props.hideInArrowHandle} data-id={item.id}>
                                                    <span className={`check-box ${(item.shareStatus == 'Y') ? 'on' : 'off'}`}>
                                                        {
                                                            item.shareStatus == 'Y' ? 
                                                            <img src={
                                                                (item.overTime && item.overTime < Date.now()) || this.uiDisable(item)?
                                                                require('./img/coupon-un.png'):
                                                                require('./img/coupon-on.png')
                                                            } />:null
                                                        }
                                                    </span>
                                                    <span className={"label-flex " + this.getBottomColor(item)}>允许课代表分销
                                                    </span>
                                                </div>
                                                : null

                                        }
                                    </div>
                                    <div className='link-detail on-log'
                                        data-log-region="coupon-code"
                                        data-log-pos={index+1 + '-details'}
                                        onClick={() => {
                                        locationTo(`/wechat/page/coupon-code/info/${item.businessType.replace('_', '-')}/${item.id}`)
                                    }}>
                                        <span className="label-flex">查看生成明细</span>
                                        <i className="icon_enter"></i>
                                    </div>
                                </div>
                            </div>)
                    })
                }
            </div>
        );
    }

    // 系列课 和 话题 使用新的样式
    render() {
        if (this.props.type === 'global-vip') {
            return this.renderLiveVip()
        }

        return (
            <div className='coupon-code-list-v2'>
                {
                    this.props.couponList.map((item, index) => {
                        return (

                            <div className={`code-item ${(item.overTime && item.overTime < Date.now()) && 'overTime'} ${this.uiDisable(item) ? 'code-item-disable' : ''}`} key={`code-item-${index}`}>
                                <div className={"code-item-inner " + (this.uiDisable(item) ? 'disable-code-item' : '')}>

                                    <div className={"code-item-inner-inner "}>
                                        <li className="money code-item-flex">
                                            <p><span className="unit">¥</span><span className="content">{item.money}</span></p>
                                            
                                        <div className="operate-box code-item-flex">
                                        <div className="del-btn" onClick={this.props.deleteCouponId} data-id={item.id}>
                                            <span>删除</span>
                                        </div>
                                        {
                                            this.isShowShareBtn(item) ?
                                            <div className={"share-btn"} onClick={() => {
                                                this.gotoshare(item);
                                            }}>
                                                        
                                            <svg height="100%" width="100%" version="1.1" viewBox="0 0 136 60">
                                                <defs/>
                                                <g id="Page-1" fill="none" stroke="none" strokeWidth="1">
                                                    <g id="系列" transform="translate(-555.000000, -800.000000)">
                                                        <g id="Group-8" transform="translate(555.000000, 800.000000)">
                                                            <g id="Group-14">
                                                                <g id="分享系列-copy" transform="translate(20.000000, 12.000000)"/>
                                                                <g id="分享系列" transform="translate(20.000000, 12.000000)"/>
                                                                <rect height="60" id="Rectangle-7" width="136" fill="#F63556" rx="30" x="0" y="2.27373675e-13"/>
                                                                <rect height="36" id="Rectangle-2" width="36" x="20" y="12"/>
                                                                <path id="Rectangle" d="M52,30.7744502 L52,40 C52,42.209139 50.209139,44 48,44 L28,44 C25.790861,44 24,42.209139 24,40 L24,20 C24,17.790861 25.790861,16 28,16 L34.3876825,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-2" d="M46,16 L52.0373881,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-2" d="M52,16 L52,22.0373881" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-3" d="M34,33.4676769 L50.4676769,17" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <rect height="36" id="Rectangle-2" width="36" x="20" y="12"/>
                                                                <path id="Rectangle" d="M52,30.7744502 L52,40 C52,42.209139 50.209139,44 48,44 L28,44 C25.790861,44 24,42.209139 24,40 L24,20 C24,17.790861 25.790861,16 28,16 L34.3876825,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-2" d="M46,16 L52.0373881,16" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-2" d="M52,16 L52,22.0373881" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <path id="Path-3" d="M34,33.4676769 L50.4676769,17" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="3"/>
                                                                <text id="分享" fill="#FFFFFF" fontFamily="PingFangSC-Medium, PingFang SC" fontSize="26">
                                                                    <tspan x="62.0714282" y="40">分享</tspan>
                                                                </text>
                                                            </g>
                                                            <g id="Group-12"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            </div> : null
                                        }
                                    </div>
                                        </li>
                                        <li className="code-item-flex">
                                            <p>
                                                <span className="label">到期时间：</span>
                                                <span className="content">{item.overTime ? formatDate(item.overTime, 'yyyy-MM-dd hh:mm:ss') : '永久有效'}</span>
                                            </p>
                                            <p>
                                                <span className="label">数量：</span>
                                                <span className="content">{(item.codeNum ? item.codeNum - item.useNum : '无限制' )+ '/' + (item.codeNum || '无限制')}</span>
                                            </p>
                                        </li>
                                        <li className="code-item-flex">
                                            <p>
                                                {
                                                    item.remark ?
                                                        <React.Fragment>
                                                            <span className="label">备注：</span>
                                                            <span className="content">{item.remark}</span>
                                                        </React.Fragment>
                                                    : null
                                                }
                                            </p>
                                            
                                            <div 
                                                className='link-detail on-log'
                                                data-log-region="coupon-code"
                                                data-log-pos={index+1 + '-details'}
                                                onClick={() => {
                                                locationTo(`/wechat/page/coupon-code/info/${item.businessType.replace('_', '-')}/${item.id}`)
                                            }}>
                                                <span className="label-flex">查看生成明细</span>
                                                <i className="icon_enter"></i>
                                            </div>
                                        </li> 
                                    </div>
                                </div>
                                <div className="bottom-btn">
                                    <div className="bottom-btn-inner">
                                        {
                                            (item.businessType == 'topic' || item.businessType == 'channel' ||  item.businessType == 'camp')  ?
                                                <div className="show-intro" onClick={
                                                                                    ((item.overTime && item.overTime < Date.now()) ||this.uiDisable(item))?this.props.hideHelperHandle: 
                                                                                    (this.props.selectedCouponId != item.id   ) ?this.props.showHelperHandle:this.props.unselectCouponId} data-id={item.id}>
                                                    <span className={`check-box ${(this.props.selectedCouponId == item.id) ? 'on' : 'off'}`}>
                                                        {
                                                            this.props.selectedCouponId == item.id ? 
                                                            <img src={
                                                                (item.overTime && item.overTime < Date.now()) || this.uiDisable(item)?
                                                                require('./img/coupon-un.png'):
                                                                require('./img/coupon-on.png')
                                                            } />:null
                                                        }
                                                    </span>
                                                    <span className={"label-flex " + this.getBottomColor(item)}>显示在介绍页
                                                    </span>
                                                </div>
                                                : null 
                                        }
                                        {
                                            (item.businessType == 'topic' || item.businessType == 'channel') ?
                                                <div className="show-intro" onClick={ 
                                                                                    ((item.overTime && item.overTime < Date.now()) ||this.uiDisable(item))?this.props.hideHelperHandle: 
                                                                                    (item.shareStatus == 'N'  ) ? this.props.showIArrowHandle: this.props.hideInArrowHandle} data-id={item.id}>
                                                    <span className={`check-box ${(item.shareStatus == 'Y') ? 'on' : 'off'}`}>
                                                        {
                                                            item.shareStatus == 'Y' ? 
                                                            <img src={
                                                                (item.overTime && item.overTime < Date.now()) || this.uiDisable(item)?
                                                                require('./img/coupon-un.png'):
                                                                require('./img/coupon-on.png')
                                                            } />:null
                                                        }
                                                    </span>
                                                    <span className={"label-flex " + this.getBottomColor(item)}>允许课代表分销
                                                    </span>
                                                </div>
                                                : null

                                        }
                                    </div>
                                </div>
                            </div>)
                    })
                }
            </div>
        );
    }
}

CodeItems.propTypes = {

};

export default CodeItems;