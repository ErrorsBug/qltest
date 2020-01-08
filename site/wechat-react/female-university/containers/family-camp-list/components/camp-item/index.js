import React from 'react'
import { formatDate, locationTo } from 'components/util';

const CampItem = ({ boughtImgUrl, title, startTime, id }) => {
    return (
        <div className="uf-camp-item " 
            data-log-name={ title }
            data-log-region="uni-experience-camp"
            data-log-pos={ id }
            onClick={ () => { locationTo(`/wechat/page/university-experience-camp?campId=${ id }&wcl=university_pm_friendcard_191025`) } }>
            <img src={ boughtImgUrl } alt=""/>
            <div>
                <h4>{ title }</h4>
                {
                    startTime&&<p>带学时间: {  formatDate(startTime, 'MM/dd') }</p>
                }
            </div>
        </div>
    )
}

export default CampItem;