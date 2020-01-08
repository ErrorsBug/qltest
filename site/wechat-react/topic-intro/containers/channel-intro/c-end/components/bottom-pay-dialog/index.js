import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BottomDialog, Confirm } from 'components/dialog';
import {
	formatMoney,
	formatNumber
} from 'components/util';

class BottomPayDialog extends Component {

    state = {
        firstPrice:0,
        payPrice:0,
        chargeId:0,
        chargeInfo: this.props.currentChargeInfo,
        isShowLimit: false
    }

    componentDidMount() {
        this.setPayPrice();
    }

    get price() {
        return this.props.chargeConfigs[0].discountStatus=='Y'?
                    this.props.chargeConfigs[0].discount:
                    this.props.chargeConfigs[0].amount;
    }

    setPayPrice( price, id ){
        id = id || this.props.chargeConfigs[0].id;
        price = price || this.price || 0;

        this.setState({
            firstPrice:price,
            payPrice: price,
            chargeId :id
        })
    }

    selectPrice(chargeItem){
        if (chargeItem.status !== 'Y') return;
        this.setState({
	        chargeInfo: chargeItem
        });

        this.setPayPrice(chargeItem.discountStatus=='Y' ? chargeItem.discount : chargeItem.amount, chargeItem.id);
    }

    afterCouponPrice (chargeItem) {
        let price = chargeItem.discountStatus=='Y' ? chargeItem.discount : chargeItem.amount
        const {isHaveCoupon, qlCouponMoney, minMoney, isOpenMemberBuy} = this.props

        if (isHaveCoupon) {
            if (minMoney <= price) {
                price -= formatMoney(qlCouponMoney)
                price = price > 0 ? formatNumber(price) : 0

                if (isOpenMemberBuy) {
                    price = price > 0 ? formatNumber(price * 0.8) : 0
                    return (
                        <p>会员券后价￥{ price }/{ chargeItem.chargeMonths }个月</p>
                    )
                }

                return (
                    <p>券后价￥{ price }/{ chargeItem.chargeMonths }个月</p>
                )
            } else {
                if (!this.state.isShowLimit) {
                    this.setState({
                        isShowLimit: true
                    })
                }

                if (isOpenMemberBuy) {
                    price = price > 0 ? formatNumber(price * 0.8) : 0
                    return (
                        <p>会员价￥{ price }/{ chargeItem.chargeMonths }个月</p>
                    )
                }

                return (
                    <p>按时收费￥{ price }/{ chargeItem.chargeMonths }个月</p>
                )
            }
        }


        if (isOpenMemberBuy) {
            price = price > 0 ? formatNumber(price * 0.8) : 0
            return (
                <p>会员价￥{ price }/{ chargeItem.chargeMonths }个月</p>
            )
        }
        
        return (
            <p>￥{ price }/{ chargeItem.chargeMonths }个月</p>
        )

    }

    render() {
        
        const {isHaveCoupon, qlCouponMoney, minMoney, isOpenMemberBuy} = this.props
        let { payPrice } = this.state
        const originalPrice = payPrice
        if (isHaveCoupon) {
            if (minMoney <= payPrice) {
                payPrice = formatNumber(payPrice - formatMoney(qlCouponMoney))
            }
        }

        if (isOpenMemberBuy) {
            payPrice = formatNumber(payPrice * 0.8)
        }

        return (
            <BottomDialog
                className="bottom-pay-dialog"
                show={this.props.isShow}
                bghide
                theme='empty'
                onClose={this.props.onCloseSettings}
            >
            <main className='pay-dialog-container'>
                <header className='dialog-title'>
                    <i className='icon_delete' onClick={this.props.onCloseSettings}></i>
                    付款详情
                </header>

                <main className='pay-dialog-content'>
                    {
                        this.props.chargeType == 'flexible'?
                        (<div className="flexible-charge-box">
                            <span className="title">选择购买类型</span>
                            <ul className="charge-list">
                                {
                                    this.props.chargeConfigs.map((chargeItem,index)=>(
                                        <li key={`charge-list-item-${index}`} className={`${this.state.chargeInfo.id === chargeItem.id && "on"}`}
                                            onClick ={()=>{this.selectPrice(chargeItem)
                                        }}>
                                            {
                                                this.afterCouponPrice(chargeItem)
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                            {
                                this.state.isShowLimit && this.props.minMoney > 0 && (
                                    <section className="min-money-tips">
                                        <span>原价满&yen;{ this.props.minMoney }可用优惠券</span>
                                    </section>
                                )
                            }
                        </div>)
                        :
                        <div className="pay-info-bar">
                            <span className="left-title">系列课票价</span>
                            <span className="flex-content color-red">￥
                                {
                                    this.props.chargeConfigs[0].discountStatus=='Y'?
                                    this.props.chargeConfigs[0].discount:
                                    this.props.chargeConfigs[0].amount
                                }
                            </span>
                        </div>
                    }
                </main>
                <footer className="comfirm-box">
                    <div className="btn-confirm on-log"
                         onClick={()=>{ this.props.payChannel(this.state.chargeId, payPrice > 0 ? payPrice : 0)  }}
                         data-log-name="确认支付"
                         data-log-region="bottom-pay-dialog"
                         data-log-pos="btn-confirm"
                    >
                        {
                            isOpenMemberBuy ? (isHaveCoupon ? '会员券后价' : '会员价') : (isHaveCoupon ? '券后价' : '支付') 
                        }￥{payPrice > 0 ? payPrice : 0}
                        {
                            isHaveCoupon && (
                                <span style={{marginLeft: '.5em', opacity: .5, textDecoration: 'line-through'}}>
                                    <s>￥{originalPrice}</s>
                                </span>
                            )
                        }
                    </div>
                </footer>
            </main>
            </BottomDialog>
        );
    }
}

BottomPayDialog.propTypes = {

};

export default BottomPayDialog;
