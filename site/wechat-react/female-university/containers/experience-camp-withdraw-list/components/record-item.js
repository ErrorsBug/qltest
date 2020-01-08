import React from 'react'
import { formatDate, formatMoney } from 'components/util'

function RecordItem({status,withdrawAmount,withdrawTime}) {
    //status ING-处理中、SUCCESS-已完成、ERROR-已失败
    return (
        <div className="wl-record-item">
            <p>提现时间:<span>{formatDate(withdrawTime,'yyyy年MM月dd日，hh:mm分')} </span></p>
            <p>提现金额:<span>{formatMoney(withdrawAmount)}元</span></p>
            <p>预计到账:<span>实时到账</span></p>
            <p>到账状态: 
                {
                    status=='SUCCESS'?
                    <span className={ 'end' }>已汇入微信钱包</span>
                    :status=='ING'?
                    <span className={ 'ing' }>等待到账中</span>
                    :<span className={ 'ing' }>提现失败</span>
                }
            </p>
        </div>
    )
}

export default RecordItem