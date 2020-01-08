import React from 'react';
import PropTypes  from 'prop-types';

const FocusQlGuide = (props) => {
    return (
        <div className='focus-guide-container'>
            <span className="logo"></span>
            <span className="text">关注千聊获取更多优质课程</span>
            <span className="close icon_cancel" onClick={()=>{props.onClose()}}></span>
            <span className="focus-btn" onClick={()=>{props.onShowFocusQlGuideBox()}}>立即关注</span>
            
        </div>
    );
}
//this.props.onShowFocusQlGuideBox()
export default FocusQlGuide;