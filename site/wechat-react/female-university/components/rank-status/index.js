import React from 'react'
import classnames from 'classnames'

const RankStatus = ({ rankNum, className }) => {
    const cls = classnames("rank-num-box", className)
    return (
        <span className={ cls }>{ rankNum }</span>
    )
}

export default RankStatus