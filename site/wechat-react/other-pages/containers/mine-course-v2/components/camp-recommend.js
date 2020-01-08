import React from 'react'
import ApplyUserList from '../../../components/apply-user-list'
import { formatDate, locationTo } from 'components/util';

function CampRecommend({ startTime, endTime, price, bestPrice, title, keyE, studyNum, headImg, keyA, keyF }) {
    return (
        <div className="camp-recommend-item" onClick={() => {
            locationTo(keyF)
        }}>
            <img src={ keyE } alt=""/>
            <div className="camp-recommend-info">
                <div className="camp-recommend-decs">
                    <p>{ title }</p>
                    { !!startTime && !!endTime && (
                        <span>带学时间：{ formatDate(startTime, 'MM/dd') } - { formatDate(endTime, 'MM/dd') }</span>
                    ) }
                </div>
                <ApplyUserList className="max-top"  userCount={ studyNum } userList={ headImg || [] } />
                <div className="camp-recommend-price">
                    <p>{ bestPrice == 0 ? '限时免费' : <>限时<i>￥</i><b>{ bestPrice }</b></> }<span>原价￥{ price }</span></p>
                    <div className="camp-recommend-btn">立即报名</div>
                </div>
            </div>
        </div>
    )
}
export default CampRecommend 