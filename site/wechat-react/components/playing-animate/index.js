import React from 'react'

const PlayingAnimate = ({ className = '', length = 3 }) => {
    return (
        <div className={ `playing-animate ${ className }` }>
            { Array.from({ length: length }).map((_,index) => (
                <span key={ index } className={ `line${ index + 1 }` }></span>
            )) }
        </div>
    )
}

export default PlayingAnimate;