import React from 'react';
import PropTypes from 'prop-types';

const ComplainFooter = (props) => {
    if (props.isLiveAdmin === 'Y') {
        return null;
    }

    return (
            <div className="complain-footer">
                <i>千聊提供技术支持</i>
                <a href={`/wechat/page/complain-reason?topicId=${props.topicId}&link=${encodeURIComponent(props.pageUrl)}`} className="qianliao-complain">
                    <span>投诉举报</span>
                </a>
            </div>
        )
}

export default ComplainFooter;
