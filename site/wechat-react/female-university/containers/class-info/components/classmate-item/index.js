import React from 'react'
import { locationTo, imgUrlFormat } from 'components/util';

const ClassmateItem = ({ headImgUrl, studentNo, userName, address, studentType, userId, bio }) => (
    <div className="classmate-item" onClick={ () => locationTo(`/wechat/page/university/my-file?studentId=${ userId }`) }>
        <div className="classmate-pic">
            <img src={ imgUrlFormat(headImgUrl || 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_130,w_130','/0') } />
        </div>
        <div className="classmate-g-1">
            <div>
                <div className="classmate-info">{ userName } 
                    { !!address && <span>{ address.split('&')[0] }</span> }
                    { Object.is(studentType, 'monitor') && (<span className="squad">班长</span>) }
                </div>
                <p>{ bio }</p>
            </div>
        </div>
    </div>
)

export default ClassmateItem