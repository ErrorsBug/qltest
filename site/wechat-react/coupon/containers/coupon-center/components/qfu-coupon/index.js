import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CouponItem from '../coupon-item';
import { request } from 'common_actions/common'
import {
    locationTo,
} from 'components/util';

class QfuCoupon extends Component {

    state = {
        authStatus:false,
        couponData:{
            businessName: '',
            logo:'',
            couponMoney: '',
            amount: '',
            discount:'',
            isGet: '',
            isReceiveOver: 'N',
            couponType:'qfu-coupon',
        }
    }

    componentDidMount() {
        this.initCoupon();
        
    }
    
    async initCoupon() {
        await Promise.all([this.hasPayVip(), this.getUniversityStatus(), this.getConfigMap(), this.getQfuSettings()])
        const amount = (this.state.chargeConfig?.UFW_TICKET_AMOUNT * 100).toFixed(0)
        const discount = (this.state.chargeConfig?.UFW_TICKET_DISCOUNT_AMOUNT * 100).toFixed(0)
        const money = this.state.hasPayVip ? this.state.memberCouponAmount : this.state.normalCouponAmount
        this.setState({
            couponData: {
                ...this.state.couponData,
                couponMoney: money,
                businessName: this.state.hasPayVip ? '[千聊会员专属]' : '' + '千聊女子大学门票优惠券',
                logo: this.state.hasPayVip ? this.state.memberCoupon?.keyA : this.state.normalCoupon?.keyA ,
                amount: amount,
                discount: (amount - discount - money).toFixed(0),
                
            },
            isShow: this.state.hasPayVip ? this.state.memberCoupon?.status ==='Y' : this.state.normalCoupon?.status ==='Y' ,
        })



    }



     /**
     * 获取是否购买过千聊会员
     *
     * @memberof MineCourse
     */
    async hasPayVip() {
        await request({
            url: '/api/wechat/transfer/h5/member/hasPay',
            method: 'POST',
            body: {
                courseId:''
            }
        }).then(res => {
            let status = res ?.data ?.status;
            this.setState({
                hasPayVip:status==='Y'?true:false
            })
		}).catch(err => {
			console.log(err);
		})
    }
     /**
     * 获取是否购买了女子大学
     *
     * @memberof MineCourse
     */
    async getUniversityStatus() {
        await request({
            url: '/api/wechat/transfer/h5/university/universityStatus',
            method: 'POST',
            body: {
                courseId:''
            }
        }).then(res => {
            let authStatus = res ?.data ?.authStatus;
            this.setState({
                authStatus:authStatus==='Y'?true:false
            })
		}).catch(err => {
			console.log(err);
		})
    }
     /**
     * 获取优惠券价格
     *
     * @memberof MineCourse
     */
    async getConfigMap() {
        await request({
            url: '/api/wechat/transfer/h5/system/getConfigMap',
            method: 'POST',
            body: {
                businessType:'UFW_CONFIG_KEY'
            }
        }).then(res => {
            let chargeConfig = res?.data;
            let memberCouponAmount = (res?.data?.UFW_MEMBER_COUPON_AMOUNT * 100).toFixed(0);
            let normalCouponAmount = (res?.data?.UFW_NORMAL_COUPON_AMOUNT * 100).toFixed(0);
            this.setState({
                chargeConfig,
                memberCouponAmount,
                normalCouponAmount
            })
            
		}).catch(err => {
			console.log(err);
		})
    }


     /**
     * 获取女子大学导流入口
     *
     * @memberof MineCourse
     */
    async getQfuSettings() {
        await request({
            url: '/api/wechat/transfer/baseApi/h5/menu/node/getWithChildren',
            method: 'POST',
            body: {
                nodeCode: 'QL_NZDX_DLRK',
                page:{
                    size: 20,
                    page:1
                }
            }
        }).then(res => {
            let menuNode = res?.data?.menuNode?.children;
            if (menuNode && menuNode.length) {
                let normalCoupon = menuNode.find(item=>item.nodeCode == 'QL_NZDX_DLRK_COUPON_CENTER_NORMAL')
                let memberCoupon = menuNode.find(item=>item.nodeCode == 'QL_NZDX_DLRK_COUPON_CENTER_MENBER')
                this.setState({
                    normalCoupon,
                    memberCoupon
                })
            }

            
		}).catch(err => {
			console.log(err);
		})
    }

    bindCoupon = () => {
        if (this.state.hasPayVip) {
            locationTo('/wechat/page/university/home')
        } else {
            locationTo('/wechat/page/university/home?couponType=pingmin')
        }
    }



    render() {
        if (!this.props.show|| this.state.authStatus || !this.state.isShow) {
            return null
        }
        return (
            <div>
                <CouponItem data={ this.state.couponData } 
                    index={ this.state.hasPayVip ? 'vip' : 'pingmin'  }
                    bindCoupon={ this.bindCoupon }
                />
            </div>
        );
    }
}

QfuCoupon.propTypes = {

};

export default QfuCoupon;