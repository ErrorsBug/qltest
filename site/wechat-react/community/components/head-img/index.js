import React from 'react'

const HeadImg = ({ url, className = '' }) => (
    <div className={ `${ className } head-img-box` }>
        <img src={ url } />
    </div>
)
export default HeadImg