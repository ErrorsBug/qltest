import React, { useState, useCallback, useRef, useEffect,forwardRef, useImperativeHandle } from 'react'
import RollingDownNav from 'components/rolling-down-nav'
import HorizontalScrolling from 'components/horizontal-scrolling'

function TagNav(props,ref) {
    return (
        <RollingDownNav
            scrollNode="scroll-content-container"
            innerClass="ct-tag-inner"
            outerClass="ct-tag-outer">
            <HorizontalScrolling lists={ props.tagNavList } changeTag={props.changeTag} tagIdx={props.tagIdx} listStyle={props.listStyle} pStyle={props.pStyle}/>
        </RollingDownNav>
    )
}

export default forwardRef(TagNav)