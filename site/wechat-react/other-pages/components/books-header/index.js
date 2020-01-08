import React, {  } from 'react'
import Picture from 'ql-react-picture'
import { digitFormat, locationTo } from 'components/util';
import {authFreeCourse } from "common_actions/common";

function BooksHeader ({ className, title, decs }) {
    return (
        <div className="br-book-header on-log on-visible"
            data-log-region={ `br-book-header-${className}` }
            data-log-pos="0"
            data-log-name={ title }
        >
            <div className={ `br-book-title ${className}` }>
                <div>
                    <h3>{ title }</h3>
                    <p>{ decs }</p>
                </div>
                {/* <div className={ `br-book-icon ${ className }` }></div> */}
            </div>
        </div>
    )
}
export default BooksHeader