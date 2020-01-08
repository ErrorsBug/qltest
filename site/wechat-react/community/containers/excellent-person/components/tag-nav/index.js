import React, { useState, useCallback, useRef, useEffect } from 'react'
import RollingDownNav from 'components/rolling-down-nav'
import HorizontalScrolling from '../../../../components/horizontal-scrolling'

function TagNav(props) {
    return (
        <RollingDownNav
            scrollNode="ct-person-scroll"
            innerClass="ct-tag-inner"
            outerClass="ct-tag-outer">
            <HorizontalScrolling lists={ props.tagNavList } changeTag={props.changeTag}/>
        </RollingDownNav>
    )
}

export default TagNav