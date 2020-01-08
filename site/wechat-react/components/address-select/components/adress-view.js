import React from 'react';
import PropTypes from 'prop-types';
import Picker from 'components/picker'
import CommonTextarea from 'components/common-textarea';

const AddressView = props => {
    function changeData(e) {
        props.changeData(props.index,e.target.value);
    }
    return (
        <li>
            <div className="main-flex">
                <span className="title">
                    {props.item.fieldValue}
                    {props.item.isRequired == 'Y' && <i>*</i>}
                </span>
                <span className="value-box">
                    <Picker
                        col={2}
                        data={props.areaArray}
                        value={props.areaValue}
                        title="选择地区"
                        onChange={props.addressHandleChange}
                        onPickerChange={props.addressHandlePickerChange}
                    >
                        <div className='text'>{props.areaLabel[0]}{props.areaLabel[1]}</div>
                    </Picker>
                </span>
            </div>    
            <div className="main-flex">
                <span className="value-box address-box">
                    <CommonTextarea
                        className = "text-textarea"
                        placeholder = '详细地址'
                        onChange={changeData}
                        value = {props.item.content || ''}
                    />
                </span>
            </div>    
        </li>
    );
};

AddressView.propTypes = {
    
};

export default AddressView;