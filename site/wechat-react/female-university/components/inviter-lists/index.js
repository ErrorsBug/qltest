import React from 'react'
import { formatDate, digitFormat, isBeginning, locationTo } from 'components/util';

const InviterLists = ({ lists, className = '' }) => (
    <ul className={ `un-family-inviter ${ className }` }>
        { !!lists.length && lists.map((item, index) => (
            <li key={ index }>
                <div className="un-inviter-info">
                    <div className="un-inviter-pic"><img src={ item.createByHeadImg } /></div>
                    <div className="un-inviter-name">{ item.createByName }</div>
                </div>
                <div className="un-inviter-time">{ formatDate(item.receiveTime, 'MM/dd hh:mm') } 已领取</div>
            </li>
        )) }
        { !lists.length && <li className="un-family-nodata">暂无亲友抢到哦~</li> }
    </ul>
)
export default InviterLists