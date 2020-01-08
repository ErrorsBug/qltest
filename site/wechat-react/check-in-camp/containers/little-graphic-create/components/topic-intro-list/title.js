import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommonTextarea from 'components/common-textarea';
import { htmlTransferGlobal } from 'components/util';


const TopicTitle = props => {
    let changeData = (e) => {
        if (!props.edit) {
            return false;
        }
        props.changeData && props.changeData(e);
    }


    return (
        <div className={`topic-title ${props.edit ? 'editing' : ''}`}>
            {
                props.edit?
                <CommonTextarea
                    className = "text-textarea"
                    placeholder = '课程标题'
                    onChange={changeData}
                    value = {htmlTransferGlobal(props.title) || ''}
                    />
                :null    
            }    
            <pre className="main-content" >
                <code>{htmlTransferGlobal(props.title)}</code>    
            </pre>
        </div>
    );
}

TopicTitle.propTypes = {

};

export default TopicTitle;