import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonTextarea from 'components/common-textarea';
import Detect from 'components/detect';
import { htmlTransferGlobal } from 'components/util';
const ItemText = props => {

    let changeData = (e) => {
        if (!props.edit) {
            return false;
        }
        props.changeData && props.changeData(e, props.index);
    }

    let onFocus = (e) => {
        if (!props.edit) {
            return false;
        }
        props.imFocus && props.imFocus(props.item.id)
    }
    
    let onBlur = (e) => {
        if (!props.edit) {
            return false;
        }
        if (!props.item.content) {
            props.delItem && props.delItem(props.item.id,'text')
        }
    }


    return (
        <div className={`item-text ${props.edit ? 'editing' : ''}`}>
            {
                props.edit?
                <CommonTextarea
                    className = "text-textarea"
                    placeholder = '请输入内容'
                    onChange={changeData}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    noIntoView={!Detect.os.phone}
                    value={htmlTransferGlobal(props.item.content) || ''}
                    />
                :null    
            }    
            <pre className="main-content"><code>{htmlTransferGlobal(props.item.content)}</code></pre>
        </div>
    );
}

ItemText.propTypes = {

};

export default ItemText;