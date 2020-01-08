import React from 'react'
import HorizontalScrolling from '../../../../components/horizontal-scrolling'

function Header(props={}) {
    return (
        <div className="ct-topic-header">
            <HorizontalScrolling {...props} className="ct-topic-tags"/>
        </div>
    )
}

export default Header