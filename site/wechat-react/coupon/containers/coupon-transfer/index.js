import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from "react-redux";
import { locationTo, getVal } from 'components/util';
class CouponTranfer extends Component {

    constructor (props) {
        super(props);
    }

    state = {
        couponCode: '',
        hideBtn: false,
        isOverTime:false,
    }

    componentDidMount() {
        if (this.props.couponInfo.overTime && this.props.couponInfo.overTime < Date.now()) {
            this.setState({
                isOverTime: true
            })
        }
        setTimeout(() => {
            locationTo('/wechat/page/mine/coupon-list');
        }, 3000);
    }

    


    render () {
        return (
            <Page className="coupon-transfer">
                <div className="middle-tips">当前优惠券已{this.state.isOverTime?'过期':'使用'}，请使用其他优惠券</div>
            </Page>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        couponInfo:state.coupon.couponInfo.couponInfoDto
    }
}

const mapActionToProps = {
}

module.exports = connect(mapStateToProps, mapActionToProps)(CouponTranfer);