import React from 'react'

const TopHead = ({ title, headImg }) => {
    return (
        <div className="tr-head" style={{ backgroundImage: `url(${ headImg })` }}>
            { title && <h3><span>{ title }</span></h3> }
            <p>按近7天校友学习数据排序 · 每日更新</p>
        </div>
    )
}

export default TopHead