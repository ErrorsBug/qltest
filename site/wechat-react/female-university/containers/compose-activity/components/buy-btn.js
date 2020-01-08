import React from 'react' 
import PortalCom from '../../../components/portal-com';
import { formatNumber, fomatFloat } from 'components/util';

function BuyBtn({ courseIds, totalPrice, status, showShapping, curDisCount, pay, courseList }) {
    const isSelected = !!courseIds.length
    let discountPrice = 0;
    courseList.map((item) => {
        const price = fomatFloat(Number(item.price).mul(Number(curDisCount)),2)
        discountPrice += formatNumber(price)
    })
    return (
        <PortalCom className="cp-buy-byn">
            { Object.is(status, 'ing') && (
                <>
                    <div className="cp-buy-shapp">
                        <div className="cp-shapp-btn" onClick={ showShapping }>{ isSelected && <span>{ courseIds.length }</span> }</div>
                        <p><b>￥{ formatNumber((discountPrice || 0)) }</b>{ isSelected && <><span>￥{ formatNumber(totalPrice || 0) }</span> { formatNumber((curDisCount && Number( curDisCount) * 10) || 0) }折</> }</p>
                    </div>
                    <div className={ `cp-buy-btn ${ isSelected ? '' : 'blcok' }` } 
                        data-log-name="一键抢购"
                        data-log-region="compose-activity-buy"
                        data-log-pos="0"
                        onClick={ () => {
                            isSelected && pay()
                        } }>{ isSelected ? '一键抢购' : '请选择课程' }</div>
                </>
            ) }
            { !!status && !Object.is(status, 'ing') && <div className={ `cp-no-btn ${ status }` }>{ Object.is(status, 'start') ? '活动未开始' : '活动已结束' }</div>}
        </PortalCom>
    )
}

export default BuyBtn