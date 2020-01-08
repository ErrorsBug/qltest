import React from 'react'

const CardItem = ({ children, className, title, isIcon, handleDialog }) => {
    return (
        <div className="un-card-item">
            <div className="un-card-title"><span className={ className }>{ title }</span></div>
            { isIcon && <div className="un-card-taost" onClick={ handleDialog }><span className="iconfont iconxingzhuang"></span></div> }
            { children }
        </div>
    )
}

export default CardItem