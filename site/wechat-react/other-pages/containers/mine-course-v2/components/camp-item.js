import React from 'react'
import { formatDate, locationTo } from 'components/util';

function CampItem({ title, startTime, endTime, boughtImgUrl, id, channelId }) {
    return (
        <div className="camp-item" onClick={ () => {
            locationTo(`/wechat/page/experience-camp-list?campId=${ id }&channelId=${ channelId }`)
        } }>
            <img src={ boughtImgUrl } alt=""/>
            <div className="camp-item-info">
                <p>{ title }</p>
                { !!startTime && !!endTime && (
                    <span>带学时间：{ formatDate(startTime, 'MM/dd') } - { formatDate(endTime, 'MM/dd') }</span>
                ) }
            </div>
        </div>
    )
}
export default CampItem 