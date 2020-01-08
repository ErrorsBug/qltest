import React from 'react';

export default function(props) {
    return (
        <div className="form-item">
            <div className="title">
                {props.title}：
            </div>

            <div className="input">
                <input type="text" disabled={props.disabled} placeholder={props.placeholder} value={props.value} onChange={props.onChange}/>
            </div>
        </div>      
    )
}