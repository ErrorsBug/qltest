import React, { useState, useEffect } from 'react'
import Picture from 'ql-react-picture'
import { locationTo } from 'components/util';
import ReactSwiper from 'react-id-swiper'
import { useRequest } from '../../../../hook/books'

const opts = {
    pagination: {
        el: '.swiper-pagination',
    },
}

function SwiperImg ({ nodeCode }) {
    const {lists} = useRequest(nodeCode)
    if(!lists.length) return null
    return (
        <div className="ls-swiper-img on-log on-visible"
            data-log-region="ls-swiper-img"
            data-log-pos={'0'}
            data-log-name={'轮播'}
        >
            <ReactSwiper {...opts}>
                { lists.map((item, index) => (
                    <div className="on-log on-visible"
                        data-log-region="ls-swiper-img-item"
                        data-log-pos={'0'}
                        data-log-name={'轮播图片'}
                        key={ index } 
                        onClick={() => {
                            item.keyB && locationTo(item.keyB)
                        }}
                    >
                        <Picture src={ item.keyA } />
                    </div>
                )) }
            </ReactSwiper>
        </div>
    )
}
export default SwiperImg