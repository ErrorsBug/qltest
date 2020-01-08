import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatMoney, formatDate } from 'components/util'

const CouponItem = props => {
    const overdue = props.overTime ? (props.sysTime > props.overTime) : false
    const caniuse = props.overTime ? formatDate(props.overTime, 'yyyy/MM/dd hh:mm') : '永久有效'
    const codeNum = props.codeNum ? props.codeNum + '个' : '无限制'
    const finish  = props.codeNum==props.useNum 
    // props赋值
    const { isEdit, index, editCheckCoupon, useNum } = props
    // 是否在直播中心展示
    const showInCenter = props.showInCenter || false
    // 是否允许课代表分享优惠券
    const isArrowShare = props.shareStatus || false
    const charge = formatMoney(props.money, 1).toString()
    const minMoney = formatMoney(props.minMoney || 0, 1).toString()
    let chargeClass = 'large'
    if(charge.length>3){
        chargeClass = 'middle'
    }
    if(charge.length>6){
        chargeClass = 'small'
    }

    return (
        <li
            className={classNames('co-coupon-b-item', { 'overdue': overdue ,'overdue finish':finish })}
        >
            { isEdit &&
            <div className="edit-check-wrap">
                <label 
                    className="edit-check-label"
                >
                    <input 
                        className="edit-checkbox" 
                        type="checkbox" 
                        name="edit-checkbox"
                    />
                    <span 
                        className={'edit-checkboxAvater ' + (props.checked ? ' checked' : '')}
                        onClick={() => editCheckCoupon(index, useNum)}
                    ></span>
                </label>
            </div>}
           
            <div 
                className={ (isEdit ? 'check-status' : '') +' bg' }
                onClick={(e)=> { 
                    if( !/switch-show|icon_checked|show-in-center|icon_ask2|circle/.test(e.target.className)
                        && !isEdit) {
                        props.onItemClick(props.id)
                    }
                }}
            >
                <div className={`flex-wrap`}>
                <div className="left">
                    <span className='money'>
                        ￥<var className={chargeClass}>{charge}</var>
                    </span>
                    {
                        props.minMoney ?
                        <span className='text'>满{minMoney}元可用</span>
                        :<span className='text'>优惠金额</span>
                            
                    }
                </div>
                <div className="right">
                    <ul className="info">
                        <li className={classNames({ 'overdue': overdue })}>
                            <span className='desc'>生成时间:</span>
                            <span className='content'>{formatDate(props.createTime, 'yyyy/MM/dd hh:mm')}</span>
                        </li>

                        <li>
                            <span className='desc'>生成数量:</span>
                            <span className='content'>{codeNum} <span>(已领取{props.useNum}个)</span></span>
                        </li>

                        <li>
                            <span className='desc'>有效时间:</span>
                            <span className='content'>{caniuse}</span>
                        </li>
                        <li>
                            <span className='desc'>备注:</span>
                            <span className='content'>{props.remark || '无-最多10个字'}</span>
                        </li>
                    </ul> 

                        {
                            !props.hideShare &&
                            <div
                                className={classNames('share-button')}
                                onClick={(e) => {
                                    if(!overdue) {
                                        e.stopPropagation()
                                        props.onShareClick(props.id)
                                    }
                                }}
                            ></div>
                        }
                    </div>
                </div>

                <div className="show-in-center">
                    <div className="cou-left">
                        {
                            !overdue ? 
                                    <div className='switch-show'>  <span className={`${showInCenter&&'active'} circle`} onClick={(e) => { e.stopPropagation(); console.log("show" + props.id);
                                    (overdue ||finish)?props.hideHelperHandle: 
                                    showInCenter ? props.hideInCenterHandle(props.id): props.showHelperHandle(props.id);}}></span> </div>
                                :
                                <div className='switch-show'>  <span className={`${showInCenter&&'active'} circle`}></span></div>
                        }
                        <div className="des">允许领券中心显示</div>
                    </div>
                    <div className="cou-left">
                        {
                            !overdue ? 
                                    <div className='switch-show'>  <span className={`${isArrowShare&&'active'} circle right`} onClick={(e) => { e.stopPropagation(); console.log("show" + props.id);
                                    (overdue ||finish)?props.hideHelperHandle: 
                                    isArrowShare ? props.hideInArrowHandle(props.id): props.showIArrowHandle(props.id);}}></span> </div>
                                :
                                <div className='switch-show'>  <span className={`${isArrowShare&&'active'} circle right`}></span></div>
                        }
                        <div className="des">允许课代表分销</div>
                    </div>
                    {/* <div className="icon_ask2" onClick={props.showHelperHandle}></div> */}
                </div>
            </div>
        </li>
    );
};

CouponItem.propTypes = {
    id: PropTypes.number.isRequired,			// 优惠码id
    couponCode: PropTypes.string.isRequired,	// 优惠码编码
    createTime: PropTypes.number.isRequired,	// 创建时间
    overTime: PropTypes.number,			        // 过期时间（为空则永久有效）
    codeNum: PropTypes.number,			        // 生成数量（为空则无限个）
    createBy: PropTypes.number.isRequired,		// 创建人id
    money: PropTypes.number.isRequired,			// 优惠金额（元）
    remark: PropTypes.string,			        // 优惠码备注
    useNum: PropTypes.number.isRequired,	// 已经领取的数量

    showInCenter: PropTypes.bool,    // 是否在领券中心展示

    sysTime: PropTypes.number.isRequired,       // 服务器时间

    onShowInCenterClick: PropTypes.func,

    onItemClick: PropTypes.func,
    onShareClick: PropTypes.func,
    hideShare: PropTypes.bool,
};

CouponItem.defaultProps = {
    onItemClick: () => { },
    onShareClick: () => { },
    hideShare: false,
}

export default CouponItem;