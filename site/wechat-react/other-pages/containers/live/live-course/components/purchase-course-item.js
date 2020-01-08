import React from 'react';
import PropTypes from 'prop-types';
import { locationTo, imgUrlFormat } from 'components/util';

const CourseItem = ({ bussinessId, pic, title, learningCount, type }) => {
    return (
        <div className='course-item' onClick={ () => linkTo(type, bussinessId) }>
            <img src={imgUrlFormat(pic, '@324w_200h_1e_1c_2o') } className='course-img' alt="" />
            <div className="course-right">
                <div className="course-title elli-text">{ title }</div>    
                <div className="course-info">
                    <span>{ learningCount }次学习</span>
                </div>
            </div>
        </div>
    )
}

function linkTo (type, id) {
    if (type === 'topic') {
        locationTo(`/topic/details?topicId=${id}`)
    } else {
        locationTo(`/live/channel/channelPage/${id}.htm`)
    }
}

export default CourseItem;