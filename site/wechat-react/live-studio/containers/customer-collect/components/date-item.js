import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'components/date-picker'
import dayjs from 'dayjs'
const DateItem = props => {

    let maxValue = dayjs(Date.now());

    function onDateSelect(val) {
        let dateVal = dayjs(val).format('YYYY-MM-DD');
        props.changeData(props.index,dateVal);
    }

    return (
        <li>
            <div className="main-flex">
                <span className="title">
                    {props.item.isRequired == 'Y' && <i>*</i>}
                    {props.item.fieldValue}
                </span>
                <span className="value-box">
                    <DatePicker
                        barClassName='picker-bar'    
                        mode='date'
                        title="选择时间"
                        onChange={onDateSelect}
                        maxValue={maxValue}
                        style="normal-time-picker"
                    >
                        <div className='text'>{props.item.content||' '}</div>    
                    </DatePicker>
                    <i className='icon_enter'></i>
                </span>
            </div>    
        </li>
    );
};

DateItem.propTypes = {
    
};

export default DateItem;
