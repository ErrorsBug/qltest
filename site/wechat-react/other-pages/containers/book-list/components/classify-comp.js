import React, {  } from 'react'
import Picture from 'ql-react-picture'
import { digitFormat, locationTo } from 'components/util';
import BooksItem from '../../../components/books-item'
import PublicTitle from '../../../components/public-title'
function moreClick(nodeCode) {
    locationTo(`/wechat/page/book-details?nodeCode=${ nodeCode }&sourceType=bookSet`)
}

function ClassIfyComp ({ index, bookListData, sourceData }) {
    const lists = bookListData || []
    const obj = sourceData || {}
    if(!lists.length) return null
    return (
        <div className="bl-classify-item on-log on-visible"
            data-log-region="bl-classify-item"
            data-log-pos={ index }
            data-log-name={ obj.keyA }
        >
            <PublicTitle 
                handleMoreLink={ () => moreClick(obj.nodeCode) }
                region="bl-classify-title"
                title={ obj.keyA } 
                moreTxt="更多" 
                decs={ obj.keyB }  />
            <div className="bl-classify-course ">
                { lists.slice(0,4).map((item, index) => (
                    <BooksItem key={ index } region="bl-classify-course" isShowD {...item} resize={{ w: 160, h: 204 }} />
                )) }
            </div>
        </div>
    )
}
export default ClassIfyComp