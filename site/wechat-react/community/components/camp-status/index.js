import React from 'react'
import classnames from 'classnames'

const CampStatus = ({ className, txtStatus, }) => (
    <span className={ classnames('camp-status',className) }>{ txtStatus }</span>
)

export default CampStatus