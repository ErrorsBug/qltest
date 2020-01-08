import React, { useState, useEffect, useCallback } from 'react'
import { locationTo } from 'components/util';
import PublicTitle from '../../../../components/public-title'
import { useNodeData } from '../../../../hook/books'

function HotSort ({ nodeCode, title, linkUrl }) {
    const { lists } = useNodeData(nodeCode, { page: 1, size: 50 })
    const moreClick = useCallback((value) =>{
        locationTo("/wechat/page/books-all")
    },[ ])
    if(!lists.length) return null
    return (
        <div className="ls-hot-sort on-log on-visible"
            data-log-region="ls-hot-sort"
            data-log-pos={'0'}
            data-log-name={title}
        >
            <PublicTitle 
                handleMoreLink={ moreClick }
                region="ls-sort-title"
                className="ls-sort-title" 
                title={ title }
                moreTxt="更多" />
            <div className="ls-hot-items">
                { lists.map((item, index) => (
                    <p key={ index } onClick={ () => {
                        locationTo(`/wechat/page/books-all?tagId=${ item.id }`)
                    }}>{ item.name }</p>
                )) }
            </div>
        </div>
    )
}
export default HotSort