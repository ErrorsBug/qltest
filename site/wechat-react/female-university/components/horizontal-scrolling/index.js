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
            if(nodeRef.scrollTo) {
                nodeRef.scrollTo(position, 0);
            } else {
                nodeRef.scrollLeft = position
            }
        } else {
            if(nodeRef.scrollTo) {
                nodeRef.scrollTo(scrollLeft, 0);
            } else {
                nodeRef.scrollLeft = scrollLeft;
            }
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
function HorizontalScrolling({ lists = [], changeTag, className =' ' }) {
    const [tagId, setTagId] = useState(0);
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
            scrollSmoothTo(lf, tagRef.current);
            changeTag && changeTag(tagId);
        }
    }, [tagId])
    return (
        <div className={ `ct-tag-box ${ className }` }>
            <div className="ct-tag-list" ref={ tagRef }>
                { lists.map((item, index) => (
                    <p  key={ index }
                        ref={ tagId == index ? actionRef : null  }
                        className={ tagId === index ? 'action' : '' } 
                        onClick={ () => handleClick(index) }>{item.value}</p>
                )) }
            </div>
        </div>
    )
}

export default HorizontalScrolling