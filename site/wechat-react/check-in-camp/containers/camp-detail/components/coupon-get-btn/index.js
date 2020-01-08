import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getUrlParams } from 'components/url-utils'
import { formatMoney,locationTo } from 'components/util'
import CouponDialog from '../receive-coupon-dialog'
import { createPortal } from 'react-dom'

import {
    getQueryCouponForIntro,
    bindCoupon
} from 'common_actions/coupon'

@autobind
class CouponGetBtn extends Component {

    state = {
        showDialog:false,
    }
    componentDidMount() {
        this.getQueryCouponForIntro();
        
    }

    async getQueryCouponForIntro() {
        let campId = getUrlParams('campId');
        const result = await this.props.getQueryCouponForIntro({
            businessId: campId,
            businessType: 'camp',
            isUpdate: false
        });
        if (result) {
            this.setState({
                campCoupon:{...result.codePo,money:formatMoney(result.codePo.money)},
                isGet:result.isGet,
            }, () => {
                this.autoBindCoupon();
            })
        }
    }   

    //进页面后5秒自动领取优惠券
    autoBindCoupon() {
        if (this.props.client == 'B') {
            return;
        }
        console.log('this.state?.isGet:',this.state?.isGet)
        if (this.state?.isGet == 'N' ) {
            setTimeout(() => {
                this.bindCoupon();
            }, 5000);
        }
    }


    async bindCoupon() {

        // 如果已经领取则调起支付
        if (this.state?.isGet == 'Y' ) {
            this.setState({
                showDialog:false,
            })
            this.props.gotoPay && this.props.gotoPay();
            return;
        }

        let campId = getUrlParams('campId');
        let res = await this.props.bindCoupon({
            businessId: campId,
            businessType: 'camp',
            receiveType:"batch",
            code:this.state.campCoupon.id,
        })
        // console.log(res)
        if (res?.state?.code == 0) {
            let couponItem = res.data;
            window.toast('领取成功')
            this.setState({
                isGet:'Y'
            })
            this.props.addCoupon && this.props.addCoupon({...couponItem.couponData,useRefId:couponItem.useRefId,couponId:couponItem.useRefId,couponType:couponItem.couponData.type})
        } else {
            window.toast(res?.state?.msg||'领取失败')
        }

        this.setState({
            showDialog:false,
        })
    }



    showCouponDialog() {
        if (this.props.client == 'B') {
            let campId = getUrlParams('campId');
            locationTo(`/wechat/page/coupon-code/list/camp/${campId}`)
            return;
        }

        this.setState({
            showDialog:true,
        })
    }
    hideCouponDialog() {
        this.setState({
            showDialog:false,
        })
    }

    render() {
        if (!this.state?.campCoupon?.money) {
            return  null
        }

        const node = document.querySelector('.portal-middle');

        return (
            <>
                <div className='coupon-get-btn' onClick={this.showCouponDialog}>
                    {
                        this.state?.isGet == 'Y' ?
                        <span className="title">购买时自动抵扣</span>
                    : <span className="title">优惠券</span>
                            
                    }
                    <span className="line"></span>
                    <span className="money">￥{this.state.campCoupon.money}</span>
                </div>

                {
                    node?
                    createPortal(
                        <CouponDialog
                            show={this.state.showDialog}
                            coupon={this.state.campCoupon}
                            onReceiveCoupon={this.bindCoupon}
                            onClose={this.hideCouponDialog}
                            isGet={this.state.isGet}
                        />,
                        node
                    ):null
                }
                
            </>
        );
    }
}

function mapStateToProps(state) {
	return {
        sysTime: state.common.sysTime,
	}
}

const mapActionToProps = {
    getQueryCouponForIntro,
    bindCoupon,
};

export default connect(mapStateToProps, mapActionToProps)(CouponGetBtn);