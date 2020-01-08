import React from 'react';

const FunctionBtn = (props) => {
    return (
        <div className='comp-live-function-btn on-log on-visible' data-log-region="live-info-suspension-btn" onClick={() => { props.showFunctionMenu(true) }}></div>
    );
};

export { FunctionBtn };
