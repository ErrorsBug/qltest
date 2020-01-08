import React from 'react'
import Picture from 'ql-react-picture'

function BooksHeader ({ className, title, decs }) {
    return (
        <div className="bd-book-header">
            <div>
                <h4>馆长推荐语</h4>
                <p><i className="iconfont iconyinhao"></i>{ decs }</p>
            </div>
        </div>
    )
}
export default BooksHeader