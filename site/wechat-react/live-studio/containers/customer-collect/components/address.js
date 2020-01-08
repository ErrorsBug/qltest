import React from 'react';
import PropTypes from 'prop-types';
import Picker from 'components/picker'
import CommonTextarea from 'components/common-textarea';

const Address = props => {
    function changeData(e) {
        props.changeData(props.index,e.target.value);
    }
    return (
        <li>
            <div className="main-flex">
                <span className="title">
                    {props.item.isRequired == 'Y' && <i>*</i>}
                    {props.item.fieldValue}
                </span>
                <span className="value-box">
                    <Picker
                        col={2}
                        data={props.areaArray}
                        value={props.areaValue}
                        barClassName='picker-bar'   
                        title="选择地区"
                        onChange={props.addressHandleChange}
                        onPickerChange={props.addressHandlePickerChange}
                    >
                        <div className='text'>{props.areaLabel[0]} {props.areaLabel[1]}</div>
                    </Picker>
                    <i className='icon_enter'></i>
                </span>
                <span className="value-box address-box">
                    <CommonTextarea
                        className = "text-textarea"
                        placeholder = '详细地址'
                        noIntoView={true}
                        onFocus={props.onFocus}
                        onChange={changeData}
                        value = {props.item.content || ''}
                    />
                </span>
            </div>    
        </li>
    );
};

Address.propTypes = {
    
};

export default Address;