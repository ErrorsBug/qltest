import React from 'react'

const Header = ({ orderNum }) => (
    <div className="st-table-header">
        <div className="st-table-count">
            <p>订单查询</p>
            <span>总计：{ orderNum }</span>
        </div>
        <div className="st-table-th">
            <p>日期</p>
            <p>数量</p>
        </div>
    </div>
)

export default Header