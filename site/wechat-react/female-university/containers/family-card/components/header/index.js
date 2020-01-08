import React from 'react'

const Header = ({ url }) => {
    return (
        <div className="un-family-head">
            <img src={ url || '' }/>
        </div>
    )
}

export default Header