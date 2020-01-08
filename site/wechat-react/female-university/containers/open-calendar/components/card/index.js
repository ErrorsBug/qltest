import React from 'react'
import PosterBox from '../../../../components/show-camp-poster/other'

/**
 * 日历
 * @export
 * @returns
 */
export default function Card({ posterInfo, userInfo, updateChange, isCheck }) {
    return (
        <div className="oc-card-box">
            <div className="oc-card-tip">长按下图发送给朋友或朋友圈吧</div>
            <PosterBox isCheck={ isCheck } updateChange={ updateChange } {...posterInfo} { ...userInfo }/>
        </div>
    )
}