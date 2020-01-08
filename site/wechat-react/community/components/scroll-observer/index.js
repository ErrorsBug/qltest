import React, { useState, useEffect, useRef  } from 'react'
import MY_ENDLESS_LIST from  './data'

function ScrollObserver({ endLen = 20, nextLoad, lists = MY_ENDLESS_LIST }) {
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(endLen);
    const [observer, setObserver] = useState(null);
    const [isLoad, setIsLoad] = useState(false);
    const $bottomElement = useRef();
    const $topElement = useRef();

    useEffect(() => {
        initScrollObserver();
        return () => {
            resetObservation();
        };
    }, [end])
    //
    const initScrollObserver = () => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: [0.7]
        };
        const Observer = new IntersectionObserver(callback, options)
        if ($topElement.current) {
            Observer.observe($topElement.current);
        }
        if ($bottomElement.current) {
            Observer.observe($bottomElement.current);
        }
        setObserver(Observer)
    }

    const resetObservation = () => {
        observer && observer.unobserve($bottomElement.current);
        observer && observer.unobserve($topElement.current);
    }

    const updateStata = (newStart, newEnd) => {
        if(start !== newStart || end !== newEnd) {
            console.log(1212)
        }
    }

    const callback = (entries, observer) => {
        entries.forEach( async (entry, index) => {
            const len = lists.length;
            let newStart, newEnd;
            if(entry.isIntersecting && entry.target.id === 'top') {

            }
            if(entry.isIntersecting && entry.target.id === 'bottom') {
                nextLoad && await nextLoad();
                
                console.log(1212)
            }
        })
    }
    const getReference = (index, isLastIndex) => {
        if(index === 0) {
            return $topElement
        }
        if(isLastIndex) {
            return $bottomElement
        }
        return null
    }
    const updatedList = lists.slice(start, end);
    const lastIndex = updatedList.length - 1;
    return (
        <ul className="scroll-observer-box">
            { updatedList.map((item, index) => {
                const refVal = getReference(index, index === lastIndex);
                const id = index === 0 ? 'top' : (index === lastIndex ? 'bottom' : '');
                return (<li className="li-card" key={item.key} ref={refVal} id={id}>{item.value}</li>)
            }) }
        </ul>
    )
}

export default ScrollObserver