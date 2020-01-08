import React, { useState, useEffect, useCallback } from 'react'
import { locationTo } from 'components/util';
import PublicTitle from '../../../../components/public-title'
import RecommendItem from '../../../../components/recommend-books'
import { useNodeData } from '../../../../hook/books'

function BooksHot ({ nodeCode, title, linkUrl, decs }) {
    const { lists } = useNodeData(nodeCode)
    const moreClick = useCallback((value) =>{
        locationTo(`/wechat/page/book-list`)
    },[ ])
    if(!lists.length) return null
    return (
        <div className="ls-hot-books on-log on-visible"
            data-log-region="ls-hot-books"
            data-log-pos={'0'}
            data-log-name={title}
        >
            <PublicTitle 
                handleMoreLink={ moreClick }
                region="ls-books-title"
                title={ title }
                decs={ decs }
                moreTxt="更多" 
                className="ls-books-title"  />
            <div className="ls-books-items">
                { lists.slice(0,3).map((item, index) => (
                    <RecommendItem key={ index } { ...item } />
                )) }
            </div>
        </div>
    )
}
export default BooksHot