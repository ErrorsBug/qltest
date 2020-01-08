import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';
import { formatDate } from 'components/util';

export default function ReceiveCouponDialog(props) {
    const coupon = props.coupon;

    const closeCouponDialog = () => {
        props.onClose();
    }

    const receiveCoupon = () => {
        props.onReceiveCoupon();
    }

    return (
        <MiddleDialog
            show={props.show}
            buttons='none'
            theme='empty'
            bghide={true}
            onClose={closeCouponDialog}
            titleTheme={'white'}
            className='receive-coupon-dialog-2'
            title=''
        >
            <div className="receive-coupon-container">
                
                <div className="receive-coupon-body on-log on-visible" 
                     data-log-region='channel-c-activity-coupon'
                     data-log-pos='unreceived'>
                    <i className="icon_close" onClick={closeCouponDialog}></i>

                    <div className="top-section">
                        <div className="coupon-amount">
                            <div className="amount"><em>{coupon.money}</em></div>
                        </div>
                        <div className="coupon-type-tip">课程抵用券</div>
                    </div>
                    <div className="bottom-section">
                        <div className="coupon-validity">
                            {
                                coupon.overTime ? `${formatDate(coupon.overTime, '有效期至MM月dd日')}` : '永久有效'
                            }
                        </div>

                        <div>
                            <div className="coupon-from">
                                仅限该课程使用
                            </div>
                            
                            <div className="receive-button" role="button" onClick={receiveCoupon}>
                                {
                                    props.isGet?'立即使用':'马上领取'
                                }
                            </div>
                        </div>

                    </div>
                </div>
                
            </div>
        </MiddleDialog>
    )
}

ReceiveCouponDialog.propTypes = {
    // 是否显示弹窗
    show: PropTypes.bool.isRequired,
    // 关闭弹窗
    onClose: PropTypes.func.isRequired,
    // 优惠券信息
    coupon: PropTypes.object.isRequired,
}