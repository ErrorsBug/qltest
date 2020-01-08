import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BottomDialog, Confirm } from 'components/dialog';
import CouponItem from '../coupon-item';

class BottomCouponListDialog extends Component {

    state = {
        /**
         * ！！！此组件啊要维护自己的 activeCoupon
         * 点击确定时才把coupon传到父组件
         */
        activeCouponId: null
    }

    componentWillMount() {
        this.handleShowAndHide();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.isShow === true && this.props.isShow !== nextProps.isShow) {
            this.handleShowAndHide();
        }
    }

    handleShowAndHide() {
        let list = this.props.list;
        let activeCouponId = this.props?.campSatus?.couponId;
        if (activeCouponId) {
            this.setState({
                activeCouponId: activeCouponId
            })
        } else {
            this.setState({
                activeCouponId: null
            })
        }
    }

    handleConfirm = () => {
        this.props.onItemClick(this.state.activeCouponId);

        setTimeout(() => {
            this.props.onSelectedCouponItem();
        });
    }

    handleClickItem = (couponId) => {
        this.setState({
            activeCouponId: couponId
        });
    }

    render() {
        let { activeCouponId } = this.state;

        return (
            <BottomDialog
                className="bottom-coupon-list-dialog"
                show={this.props.isShow}
                bghide
                theme='empty'
                onClose={this.props.onCloseCouponList}
            >
            <main className='pay-dialog-container'>
                <header className='dialog-title'>
                    <i className='icon_back' onClick={this.props.onBackCouponList}></i>
                    选择优惠券
                    <span className='commit-button'
                        onClick={this.handleConfirm}>确认</span>
                </header>

                <main className='pay-dialog-content'>
                    <ul>
                        {
                            this.props.list && this.props.list.map((item, index) => (
                                <CouponItem
                                    key={`coupon-item-${index}`}
                                    onItemClick={this.handleClickItem}
                                    activeCouponId={activeCouponId}
                                    name={this.props.name}
                                    liveName={this.props.liveName}
                                    {...item}
                                />
                            ))
                        }
                    </ul>
                </main>
            </main>
            </BottomDialog>
        );
    }
}

BottomCouponListDialog.propTypes = {
    list: PropTypes.array,
    channelName: PropTypes.string,
};

export default BottomCouponListDialog;
