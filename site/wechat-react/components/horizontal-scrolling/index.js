import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'

const scrollSmoothTo = (position, nodeRef, numb = 1) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            return setTimeout(callback, 17);
        };
    }
    let scrollLeft = nodeRef && nodeRef.scrollLeft;
    var step = function () {
        var distance = position - scrollLeft;
        scrollLeft = scrollLeft + distance / numb;
        if (Math.abs(distance) < 1) {
            nodeRef.scrollLeft = position
        } else {
            nodeRef.scrollLeft = scrollLeft;
            requestAnimationFrame(step);
        }
    };
    step();
}

/**
 * 水平滑动
 * @param {*} { lists = [], changeTag, className =' ' }
 * @returns
 */
function HorizontalScrolling({ tagIdx = 0, lists = [], changeTag, className = '', listStyle, pStyle}) {
    const [tagId, setTagId] = useState(tagIdx);
    const actionRef = useRef(null);
    const tagRef = useRef(null);
    const handleClick = useCallback((index) => {
        if(index != tagId) {
            setTagId(index);
        }
    },[tagId])
    useEffect(() => {
        if(actionRef.current){
            const { left, width } = actionRef.current.getBoundingClientRect();
            const { clientWidth, scrollLeft } = tagRef.current;
            const lf = scrollLeft + (left - (clientWidth / 2 - width/2));
            if(tagRef.current && !!tagRef.current.scrollTo) {
                tagRef.current.scrollTo({ left: lf, behavior: 'smooth' })
            } else {
                scrollSmoothTo(lf, tagRef.current);
            }
            changeTag && changeTag(tagId);
        }
    }, [tagId])
    useEffect(() => {
        if( typeof(tagIdx) == 'number' && tagId != tagIdx){
            setTagId(tagIdx)
        }
    }, [tagIdx])
    const newList = useMemo(() => lists, [lists]);
    return (
        <div className={ `ct-tag-box ${ className }` }>
            <div className="ct-tag-list" ref={ tagRef } style={listStyle}>
                { newList.map((item, index) => (
                    <p  key={ index }
                        data-log-name={ item.value }
                        data-log-region={ item.region }
                        data-log-pos={ item.pos }
                        ref={ tagId == index ? actionRef : null  }
                        className={ tagId === index ? 'action' : '' } 
                        style={tagId === index ? pStyle : {}}
                        onClick={ () => handleClick(index) }>{item.value}</p>
                )) }
            </div>
        </div>
    )
}

export default HorizontalScrolling