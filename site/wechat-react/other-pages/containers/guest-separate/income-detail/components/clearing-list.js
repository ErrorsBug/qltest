import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate,formatMoney } from 'components/util';

class ClearingList extends Component {
    render() {
        const listData=this.props.item.map((val,index)=>{
            return <div className="clearing-li" key={`clearing-li-${index}`}>
                    <span className="flow">收益结算-{formatDate(val.startTime,"MM")}{formatDate(val.startTime,"dd")}-{formatDate(val.endTime,"MM")}{formatDate(val.startTime,"dd")}</span>
                    <span className="ying">应发放：<var>{formatMoney(val.dueMoney)}元</var></span>
                    <span className="time">{formatDate(val.createTime,"yyyy-MM-dd hh:mm:ss")}</span>
                    {
                        val.remark!=""&&<span className="ps">备注：<var>{val.remark}</var></span>
                    }
                    <span className="money">实际发放￥ {formatMoney(val.actualMoney)}</span>
                </div>;  
        })
        return (
            <div>
                {listData}
            </div>
        );
    }
}

ClearingList.propTypes = {

};

export default ClearingList;