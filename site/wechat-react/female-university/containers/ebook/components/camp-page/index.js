import React, {  } from 'react'
import Picture from 'ql-react-picture'
import { formatDate } from 'components/util'

/**
 * 
 * @export
 * @param {*} { imgUrl, title, startTime, endTime, noteCount, paperCount }
 * @returns
 */
export default function CampPage({ imgUrl, title, startTime, endTime, noteCount, paperCount, nextPage }) {
    return (
        <div className="eb-camp-page">
            <div>
                <div className="eb-camp-img">
                    <Picture src={ imgUrl } resize={{ w: 406, h: 254 }}/>
                </div>
                <h4>{ title }</h4>
                <span>{ formatDate(startTime, 'yyyy/MM/dd') } - {formatDate(endTime, 'MM/dd')}</span>
                <p>— 已写{ noteCount }篇笔记{ `，${ paperCount }篇毕业论文` } —</p>
                <div className="eb-camp-btn" onClick={ nextPage }>进入</div>
            </div>
        </div>
    )
}