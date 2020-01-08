import React, { useState, useEffect } from 'react'
import Picture from 'ql-react-picture'
import { locationTo } from 'components/util';
import { useRequest } from '../../../../hook/books'
import classnames from 'classnames'

function TabLists ({ nodeCode }) {
    const { lists } = useRequest(nodeCode, { page: 1, size: 5 })
    if(!lists.length) return null
    const cls = classnames('ls-tab-lists on-log on-visible', {
        'five': lists.length >= 5,
        'fore': lists.length === 4,
        'three': lists.length === 3,
    })
    return (
        <div className={ cls }
            data-log-region="ls-tab-lists"
            data-log-pos={'0'}
            data-log-name={''}
        >
            { lists.slice(0, 5).map((item, index) => {
                return (
                    <div className="ls-tab-item on-log on-visible"
                        data-log-region="ls-tab-item"
                        data-log-pos={'0'}
                        data-log-name={'菜单tab'}
                        key={ index } 
                        onClick={() => {
                            item.keyB && locationTo(item.keyB)
                        }}
                    >
                        <Picture 
                            className='ls-tab-img'
                            placeholder={true}
                            resize={{w: 124,h: 112}} 
                            src={ item.keyA } />
                        <p>{ item.title }</p>
                    </div>
                )
            }) }
        </div>
    )
}
export default TabLists