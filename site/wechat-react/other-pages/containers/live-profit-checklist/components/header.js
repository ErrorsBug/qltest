import React from 'react';
import PropTypes from 'prop-types';

import { formatMoney, formatDate } from 'components/util'

function ProfitHeader(props) {
    const showTypeVal = (props.typeFilter.find(item => {
        return item.value === props.typeVal
    })).text


    let showTimeVal;

    if (props.timeVal === 'CUSTOM') {
        showTimeVal = `(${props.startDate} - ${props.endDate})`
    } else if (props.timeVal === 'ALL') {
        showTimeVal = '所有时间段'
    } else {
        showTimeVal = (props.timeFilter.find(item => {
            return item.value === props.timeVal
        })).text
    }

    return (
        <header>
            <div className="condition">
                <h1>
                    {showTypeVal}收益
                </h1>
                <p>{showTimeVal}</p>
            </div>
            {/*<ul>
                <li>
                    总收益
                    <p>￥{formatMoney(props.total)}</p>
                </li>
                <li>
                    待结算
                    <p>￥{formatMoney(props.checking)}</p>
                </li>
            </ul>*/}
            <img
                src={require('../img/icon-filter.png')}
                onClick={props.onFilterIconClick}
                className="filter"
            />
        </header>
    );
};

ProfitHeader.propTypes = {
};

export default ProfitHeader;