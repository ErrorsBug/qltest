import React, { Component } from 'react';
import { formatDate } from 'components/util';
import Picture from 'ql-react-picture';

class GiftPackage extends Component {

    constructor(props){
        super(props)
    }

    state = {
        
    };

    render() {
        let {giftCourses,giftCoupons,couponText} = this.props;
        let coupon,max = 0,ind = 0;
        giftCoupons && giftCoupons.length > 0 && giftCoupons.map((item,index) => {
            if(item.money > max) {
                max = item.money;
                ind = index
            }
        });
        coupon = giftCoupons && giftCoupons[ind];
        return (
            <div className="gift-package-pop">
                <div className="black-pop" onClick={this.props.close}></div>
                <div className="gift-package-pop-container">
                    <div className="close" onClick={this.props.close}></div>
                    <div className="course-container">
                        <div className="title">恭喜你获得<span>新人专属礼包</span></div>
                        {
                            giftCourses && giftCourses.length > 0 &&
                            <div className="replace-container">
                                <div>
                                    <span>送两门精品课</span>
                                    <div className="replace" data-group={giftCourses[0].groupId} onClick = {this.props.getNewGroup}>
                                        <span className="label">换一换</span>
                                        <span className="icon"></span>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="course-content">
                            {
                                giftCourses && giftCourses.length > 0 && giftCourses.map((item,index)=>{
                                    return (
                                        <div className="course" key={`course-${index}`}>
                                            <div className="img-container">
                                                <Picture src={item.logo}
                                                         placeholder={true}
                                                         alt=""/>
                                            </div>
                                            <div className="course-title">{item.businessName}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {
                        coupon &&
                        <div className="coupon-container">
                            <div className="coupon-tip">
                                <div>{couponText}</div>
                            </div>
                            <div className="coupon-content">
                                <div className="fare">
                                    <span className="icon">￥</span>
                                    <span className="money">{coupon.money/100}</span>
                                </div>
                                <div className="tip">
                                    <p className="line1">新人专享优惠券</p>
                                    <p className="line2">{coupon.overTime ? '有效期至' + formatDate(coupon.overTime) : '永久有效'}</p>
                                </div>
                            </div>
                            <div className="receive on-log" log-region="receive-gift-package" onClick={this.props.receiveGift}>立即领取</div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default GiftPackage;
