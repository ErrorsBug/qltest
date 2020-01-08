import React from 'react'
import {locationTo } from 'components/util';

export class ListItem {
    /**
     * 生成一个列表项
     *
     * @param {any} icon 图标
     * @param {string} title 名称  
     * @param {string} link 链接
     * @memberof ListItem
     */
    constructor(icon, title, link, region, unreadNum) {
        return { icon, title, link, region, unreadNum }
    }
}

export function LinkList(props) {
    return <ul className='co-link-list'>
        {
            props.list.map((item, index) => {
                return <li
                    key={`link-list-${index}`}
                    className='right-arrow'
                    onClick={()=>{ typeof _qla !== 'undefined' && _qla('click', {region: item.region}); locationTo(item.link)}}
                >
                    <span className={`item-icon ${item.icon}`} alt="" />
                    <div className="title">{item.title}</div>
                    {
                        item.unreadNum > 0 &&
                        <div className="unread-num">{item.unreadNum}</div>
                    }
                </li>
            })
        }
    </ul>
}