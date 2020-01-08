import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { request } from 'common_actions/common';
import { locationTo, getVal, sortBy } from 'components/util';
import { fetchCouponListAction } from 'common_actions/coupon';
class MyQfuCoupon extends Component {

    state = {
        couponList:[],
        authStatus:false,
        couponInfo: {
        }
    }

    data = {
        
    }

    componentDidMount() {
        this.initCoupon();
        this.getUniversityStatus();
        
    }
    
    async initCoupon() {
        await this.fetchCouponListAction();
        await this.initInvaCoupon();
        let couponList = this.data.couponList || [];
        if (this.data.invaCouponArr) {
            couponList = [...couponList,...(Object.values(this.data.invaCouponArr))]
        }
        this.setState({
            couponList
        }, () => {
            this.updateCurCoupon();
        })

    }

     // 获取我的优惠券
     async fetchCouponListAction() {
        let result = await this.props.fetchCouponListAction({
            businessType: 'UFW',
            businessId:1,
            liveId:1
        })
        let couponList = getVal(result, 'data.couponList', []);
         this.data.couponList = couponList.map(item => {
            return {...item,title: '指定门票：千聊女子大学'}
        });
     }
    
    // 初始化已领取的虚拟优惠券
    initInvaCoupon() {
        let time = this.props.sysTime;
        let invaCouponArr = localStorage.getItem('invaCouponArr')||'{}';
        invaCouponArr = JSON.parse(invaCouponArr);
        if (invaCouponArr.witness) {
            // 过期不可使用
            if (invaCouponArr.witness.overTime && invaCouponArr.witness.overTime < time) {
                delete invaCouponArr.witness;
            }
        }
        if (invaCouponArr.share) {
            // 过期不可使用
            if (invaCouponArr.share.overTime && invaCouponArr.share.overTime < time) {
                delete invaCouponArr.share;
            }
        }
        if (invaCouponArr.pingmin) {
            invaCouponArr.pingmin.desc = '即将过期'
            // delete invaCouponArr.pingmin;
        }
        if (invaCouponArr.vip) {
            invaCouponArr.vip.desc = '千聊会员专属优惠'
        }
        for (const item in invaCouponArr) {
            invaCouponArr[item].title = '指定门票：千聊女子大学';
        }
        // 缓存里所有虚拟优惠券
        this.data.invaCouponArr = invaCouponArr;
    }

    // 更新选中的优惠券
    updateCurCoupon() {
        let couponList = this.state.couponList;
        couponList = couponList.sort(sortBy('money', false))
        this.setState({
            couponList,
            couponInfo: couponList[0],
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

    bindCoupon = () => {
        if (this.state.hasPayVip) {
            locationTo('/wechat/page/university/home')
        } else {
            locationTo('/wechat/page/university/home?couponType=pingmin')
        }
    }

    expireFormat(overTime){
		const now = Date.now();

		// 为空或者大于50年，就显示永久有效
		const isForever = !overTime || (overTime - now > 50 * 365 * 24 * 60 * 60 * 1000) ;
		if(isForever){
			return '永久有效';
		}

		if(overTime <= now){
			return '已过期';
		}

		const leftTime = overTime - now;
		if(leftTime < 60 * 60 * 1000){
			return '即将过期';
		}else if(leftTime < 24 * 60 * 60 * 1000){
			return `还有${Math.floor(leftTime / (60 * 60 * 1000))}小时过期`;
		}else if(leftTime < 30 * 24 * 60 * 60 * 1000){
			return `还有${Math.floor(leftTime / (24 * 60 * 60 * 1000))}天过期`;
		}else if(leftTime < 12 * 30 * 24 * 60 * 60 * 1000){
			return `还有${Math.floor(leftTime / (30 * 24 * 60 * 60 * 1000))}个月过期`;
		}

		const t = new Date(overTime);
		return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' 过期';
	}


    render() {
        let { couponInfo } = this.state;
        if ( this.state.authStatus || !couponInfo) {
            return null
        }
        return (
            <>
                <div className="title-bar">女子大学优惠券</div>
                <div className={`my-qfu-coupon-item on-log on-visible`}
                    data-log-region="my-coupon-university"
                    data-log-pos={'nzdx'}
                    data-log-name="已领优惠券"
                    onClick={() => { locationTo('/wechat/page/university/home') }}
                    style={this.props.style}
                >
                    <div className="coupon-item-wrap">
                        <div className="course-info">
                            <div className={`title`}>{couponInfo?.title}</div>
                            <div className="tip">
                                <span className={`expiration-time${couponInfo.overTime && (couponInfo.overTime - Date.now() < 3 * 24 * 60 * 60 * 1000) ? ' highlight' : ''}`}>{couponInfo?.desc ||  this.expireFormat(couponInfo?.overTime)}</span>
                            </div>
                        </div>
                        <div className="coupon-info" >
                            <div className="price">
                                <i className="unit" key='unit'>￥</i>{couponInfo?.money}
                            </div>
                            <div className="tip">立即使用</div>
                        </div>
                    </div>
                    </div>
            </>
        );
    }
}
function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    fetchCouponListAction,
}

module.exports = connect(mapStateToProps, mapActionToProps)(MyQfuCoupon);