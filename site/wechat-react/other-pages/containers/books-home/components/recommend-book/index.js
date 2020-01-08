import React, { useCallback, useState, useEffect } from 'react'
import Picture from 'ql-react-picture'
import { locationTo } from 'components/util';
import PublicTitle from '../../../../components/public-title'
import BooksItem from '../../../../components/books-item'
import { useNodeData } from '../../../../hook/books'

function RecommendBook ({ region, className, title, decs, lastClass ='', nodeCode }) {
    const { lists } = useNodeData(nodeCode, { page: 1, size: 3 })
    const moreClick = useCallback((value) =>{
        locationTo(`/wechat/page/book-secondary?nodeCode=${ nodeCode }&sourceType=bookSet`)
    },[ ])
    if(!lists.length) return null
    return (
        <div className="ls-recommend-course on-log on-visible"
            data-log-region={ region }
            data-log-pos={'0'}
            data-log-name={'推荐课程'}
        >
            <PublicTitle 
                handleMoreLink={ moreClick }
                region={ `${region}-title` }
                className={ className } 
                title={title} 
                moreTxt="更多" 
                decs={ decs } />
            <div className={ `ls-recommend-items ${ lastClass }` }>
                { lists.map((item, index) => (
                    <BooksItem key={ index } isShowD index={ index } {...item} />
                )) }
            </div>
        </div>
    )
}
export default RecommendBook