import React from 'react';

export default function TeacherGroup ({onClose = () => {}, onJoin = () => {}}) {
    return (
        <div className="teacher-group" onClick={onJoin}>
            <span className="btn-icon-close on-log" data-log-region="close-qr-code-follow-ql" onClick={e => { e.stopPropagation(); onClose && onClose();}}></span>
            <div className="teacher-cover"></div>
            {
                /*
                <div className="qr-wrap">
                    <img src="//open.weixin.qq.com/qr/code?username=qianliaoservice" />
                </div>
                 */
            }
            <div className="prompt">
                <p>加入讲师交流群</p>
                <p>领取价值<span style={{
                    color: '#F73657'
                }}>699</span>元资料礼包</p>
            </div>
            <div className="btn-box">
                <span className="join-btn">立即加入</span>
            </div>
        </div>
    )
}