import React from 'react'

const Placard = ({ notice }) => (
    <div className="cl-placard-box">
        <div className="cl-placard-info">
            <div className="cl-placard-ti"></div>
            <h3>班级公告</h3>
            <p>{ !!notice ? notice : '暂无班级公告' }</p>
        </div>
    </div>
)

export default Placard