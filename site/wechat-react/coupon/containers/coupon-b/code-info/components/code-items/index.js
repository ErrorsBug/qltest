import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import MiddleDialog from 'components/dialog/middle-dialog';
import {locationTo } from 'components/util';
import { getQlchatVersion} from 'components/envi';


import dayjs from 'dayjs';
@autobind
class CodeItems extends Component {
    state = {
        showDetaileBox: false,
        couponItem:{},
    }


    toggleDialog(couponItem) {
        this.setState({
            showDetaileBox: !this.state.showDetaileBox,
            couponItem:couponItem?couponItem:{},
        })
    }

   
    sendCoupon(item) {
        let url = '';
        if (getQlchatVersion()) {
            switch (item.businessType) {
                case 'topic':
                    url = `/wechat/page/get-coupon-topic/${item.belongId}?couponCode=${item.couponCode}`;
                    break;
                case 'channel':
                    url = `/wechat/page/get-coupon-channel/${item.belongId}?couponCode=${item.couponCode}`;
                    break;
                case 'camp':
                    url = `/wechat/page/get-coupon-camp/${item.belongId}?couponCode=${item.couponCode}`;
                    break;
                case 'global_vip':
                    url = `/wechat/page/get-coupon-vip/${item.belongId}?couponCode=${item.couponCode}`;
    
                    break;
            }
			let shareTitle = this.props.businessName;
            let shareUrl = encodeURIComponent(window.location.origin+url);
            let shareImgUrl = encodeURIComponent('https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png');
            let content = encodeURIComponent("点击即可领取优惠码。");
            locationTo(`qlchat://dl/share/link?title=${shareTitle}&content=${content}&shareUrl=${shareUrl}&thumbImageUrl=${shareImgUrl}`);

        } else {
            switch (item.businessType) {
                case 'topic':
                    url = `/wechat/page/send-coupon/topic?topicId=${item.belongId}&couponCode=${item.couponCode}&liveId=${this.props.liveId}`;
                    break;
                case 'channel':
                    url = `/wechat/page/send-coupon/channel?channelId=${item.belongId}&couponCode=${item.couponCode}&liveId=${this.props.liveId}`;
                    break;
                case 'camp':
                    url = `/wechat/page/send-coupon/camp?campId=${item.belongId}&couponCode=${item.couponCode}&liveId=${this.props.liveId}`;
                    break;
                case 'global_vip':
                    url = `/wechat/page/send-coupon/vip?liveId=${item.belongId}&couponCode=${item.couponCode}`;
    
                    break;
            }
            
            locationTo(url);
        }
        
    }

    render() {
        if (typeof (document) == 'undefined') {
            return false;
        }
        const portalBody = document.querySelector(".portal-low");
        if (!portalBody) return null
        let { status } = this.props
        return (
            <div className='coupon-code-list'>
                <div className="title">
                    <span className="detail">优惠码明细</span>
                    {/* <span className="show-all"  onClick={this.props.toggle}>
                        <img className="showallimg" src={require('./img/showAll.svg')} />
                        显示全部
                    </span> */}
                    <div className="filter on-log"
                        data-log-region="coupon-info"
                        data-log-pos="filter"
                        onClick={this.props.toggle}>
                        <i className={`filter-ico ${status === '' ? 'filter-all-ico' : 'filter-other-ico'}`}></i>
                        <span className={status === '' ? 'filter-all' : 'filter-other'}>
                            {status === '' ? '显示全部' : status === 'unused' ? '显示未使用' : status === 'bind' ? '显示已领取未使用':'显示已使用'}
                        </span>
                    </div>
                </div>    
                <dl className="code-list">
                    <dt className="webkitBox">
                        <span>优惠码</span>
                        <span>使用状态</span>
                        <span>操作</span>
                    </dt>
                    {
                        this.props.couponList.map((item, index) => {
                            return <div className={"webkitBox " + (item.status == 'unused' ? 'unused' : 'others')} key={`code-item-${index}`}>
                                <span>
                                    {item.couponCode}
                                </span>
                                {   
                                    item.status == 'bind' ?
                                    <span>
                                        领取未使用
                                        </span>  
                                    :item.status == 'used' ?
                                        <span>
                                            已使用
                                        </span>
                                    :this.props.isOverTime ?
                                    <span>
                                        已过期
                                    </span>
                                    :item.status == 'unused' ?
                                        <span>未使用</span>
                                    :            
                                    null           
                                }
                                {
                                    (this.props.isOverTime && item.status == 'unused') ? 
                                    <span className="btn-empty"></span> :
                                    (item.status == 'unused' ) ?
                                        <span className='btn-span on-log'
                                            data-log-region="coupon-info"
                                            data-log-pos="send"
                                            onClick={()=>{this.sendCoupon(item)}}>
                                            <div className="btn-send">发送优惠码</div>
                                        </span>
                                    : <span className='btn-span disable'>
                                    <div className="btn-send disable on-log" 
                                        data-log-region="coupon-info"
                                        data-log-pos="details"
                                        onClick={() => {
                                        this.toggleDialog(item);
                                    }}>查看详情</div></span>
                                }
                            </div>
                        })
                    }
                </dl>

                {
                    this.state.showDetaileBox ?
                        createPortal(
                            <MiddleDialog 
                                className='coupon-user-detail-dialog'
                                show={true}
                                theme="empty"
                                bghide={true}
                                onClose={() => {
                                    this.toggleDialog(null);
                                }}
                            >   
                                <div className="user-info">
                                    <img src={`${this.state.couponItem.userHeadImage}`} />
                                    <div className="name">{this.state.couponItem.userName}</div>
                                </div>
                                <div className="get-coupon-info">
                                    <span className="time">{(this.state.couponItem.status == 'bind' || this.state.couponItem.status == 'used') ? dayjs(this.state.couponItem.useTime).format('YYYY-MM-DD HH:mm:ss') : this.props.overTime ? dayjs(this.props.overTime).format('YYYY-MM-DD HH:mm:ss') : '永久有效' }</span>
                                    <span className="use-info">{this.state.couponItem.status == 'bind'?'已领取':'已使用'}</span>
                                    {/* {
                                        <li>
                                            <span className="label">{ this.state.couponItem.status == 'bind' ? '过期时间' : '使用时间'}</span>
                                            
                                        </li>  
                                    } */}
                                </div>
                                <div className="bottom-btn on-log" 
                                    data-log-region="coupon-info"
                                    data-log-pos="details-finished"
                                    onClick={() => {
                                    this.toggleDialog(null)
                                }}>
                                    关闭
                                </div>
                            </MiddleDialog>
                            ,
                            portalBody
                        )
                    :null    
                }
               
            </div>
        );
    }
}

CodeItems.propTypes = {

};

export default CodeItems;