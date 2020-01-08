import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BottomDialog, Confirm } from 'components/dialog';
import { coupon } from '../../../../../reducers/coupon';

class BottomPayDialog extends Component {

    state = {
        firstPrice:0,
        payPrice:0,
        chargeId:0,

    }

    componentDidMount() {
        this.setPayPrice();

        // this.props.fetchCouponList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.qlCouponMoney != nextProps.qlCouponMoney ||
            this.props.couponId != nextProps.couponId ||
            this.props.minMoney != nextProps.minMoney
        ) {
            this.setPayPrice(this.state.firstPrice, this.state.chargeId, nextProps.couponId, nextProps.qlCouponMoney, nextProps.minMoney);
        }
    }

    get price() {
        return this.props.chargeConfigs[0].discountStatus=='Y'?
                    this.props.chargeConfigs[0].discount:
                    this.props.chargeConfigs[0].amount;
    }

    setPayPrice( price, id, couponId = this.props.couponId, qlCouponMoney = this.props.qlCouponMoney, minMoney = this.props.minMoney ){
        id = id || this.props.chargeConfigs[0].id;
        price = price || this.price || 0;

        // if (this.props.isRelay === 'Y') {
        //     this.setState({
        //         firstPrice: price,
        //         payPrice: price,
        //         chargeId: id,
        //     })
        //     return
        // }

        this.setState({
            firstPrice:price,
            payPrice: (!couponId || (minMoney && minMoney > price) ) ? price : (price > qlCouponMoney) ? (price - qlCouponMoney).toFixed(2) : 0,
            chargeId :id
        })
    }

    selectPrice(index,price,id,enable){
        if (!enable) return;
        this.props.changeChargeIndex(index);
        this.setPayPrice(price,id);
    }

    render() {

        const disCouponPrice = this.props.qlCouponMoney > this.state.firstPrice? this.state.firstPrice : this.props.qlCouponMoney;

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
                                    this.props.chargeConfigs.map((amountItem,index)=>(
                                        <li key={`charge-list-item-${index}`} className={`${index ==  this.props.activeChargeIndex && "on"}`}
                                            onClick ={()=>{this.selectPrice(index,
                                                                            amountItem.discountStatus=='Y' ? amountItem.discount : amountItem.amount,
                                                                            amountItem.id,
                                                                            amountItem.status === 'Y'
                                                                            )
                                        }}>
                                            <p>¥{ amountItem.discountStatus=='Y' ? amountItem.discount : amountItem.amount }
                                                /
                                                { amountItem.chargeMonths }个月
                                            </p>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>)
                        :
                        <div className="pay-info-bar">
                            <span className="left-title">系列课票价</span>
                            <span className="flex-content color-red">¥
                                {
                                    this.props.chargeConfigs[0].discountStatus=='Y'?
                                    this.props.chargeConfigs[0].discount:
                                    this.props.chargeConfigs[0].amount
                                }
                            </span>
                        </div>
                    }
                    {
                        this.props.couponId &&
                        <div>
                            <div className="pay-info-bar">
                                <span className="left-title">优惠券</span>
                                <span className="flex-content">
                                {
                                    // this.props.isRelay === 'Y' ?
                                    // <span className="disable-coupon">转载系列课不支持使用优惠券抵扣</span> :
                                    (this.props.qlCouponMoney && this.props.minMoney <= this.state.firstPrice )?
                                    <var className="var-one" onClick={this.props.onSelectCouponList}>
                                        已使用优惠券抵扣¥
                                        {this.props.qlCouponMoney > this.state.firstPrice? this.state.firstPrice : this.props.qlCouponMoney }
                                        <i className='icon-coupon'></i>
                                        <i className='icon_enter'></i>
                                    </var>
                                    :
                                    <var className="var-one none">
                                        暂无优惠券可以使用
                                        <i className='icon_enter'></i>
                                    </var>


                                }
                                </span>
                            </div>
                            <div className="pay-info-bar">
                                <span className="left-title bold-text">还需支付</span>
                                <span className="flex-content"><var className="var-two bold-text">¥{this.state.payPrice}</var></span>
                            </div>
                        </div>
                    }
                </main>
                <footer className="comfirm-box">
                    <div className="btn-confirm on-log"
                         onClick={()=>{ this.props.payChannel(this.state.chargeId,this.state.payPrice)  }}
                         data-log-name="确认支付"
                         data-log-region="bottom-pay-dialog"
                         data-log-pos="btn-confirm"
                    >支付¥{this.state.payPrice}</div>
                </footer>
            </main>
            </BottomDialog>
        );
    }
}

BottomPayDialog.propTypes = {

};

export default BottomPayDialog;
