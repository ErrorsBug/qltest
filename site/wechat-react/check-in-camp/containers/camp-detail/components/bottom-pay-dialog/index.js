import React, { Component } from 'react';
import { BottomDialog } from 'components/dialog';

class BottomPayDialog extends Component {

    state = {
        firstPrice:0,
        payPrice:0
    }

    componentDidMount() {
        this.setPayPrice();

        // this.props.fetchCouponList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.qlCouponMoney != nextProps.qlCouponMoney ||
            this.props.isHaveCoupon != nextProps.isHaveCoupon ||
            this.props.minMoney != nextProps.minMoney
        ) {
            this.setPayPrice(this.state.firstPrice, nextProps.isHaveCoupon, nextProps.qlCouponMoney, nextProps.minMoney);
        }
    }

    setPayPrice( price = this.props.price, isHaveCoupon = this.props.isHaveCoupon, qlCouponMoney = this.props.qlCouponMoney, minMoney = this.props.minMoney ){
        this.setState({
            firstPrice: price,
            payPrice: (!isHaveCoupon || (minMoney && minMoney > price) ) ? price : (price > qlCouponMoney) ? (price - qlCouponMoney).toFixed(2) : 0,
        })
    }

    selectPrice(index,price,enable){
        if (!enable) return;
        this.setPayPrice(price);
    }

    render() {
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
                    <div className="pay-info-bar">
                        <span className="left-title">票价</span>
                        <span className="flex-content color-red">¥
                            {
                                this.props.price
                            }
                        </span>
                    </div>
                    {
                        this.props.isHaveCoupon &&
                        <div>
                            <div className="pay-info-bar">
                                <span className="left-title">优惠券</span>
                                <span className="flex-content">
                                {
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
                    <div className="btn-confirm"
                         onClick={()=>{ this.props.payCamp(this.state.payPrice)}}
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
