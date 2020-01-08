import React from 'react';
import PropTypes from 'prop-types';
import CommonInput from 'components/common-input';

const NormalText = props => {
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
                    <CommonInput
                        className = "text-input"
                        placeholder = "请输入"
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

NormalText.propTypes = {
    
};

export default NormalText;