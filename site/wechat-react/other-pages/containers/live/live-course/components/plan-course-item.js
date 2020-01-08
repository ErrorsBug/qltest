import React from 'react';
import PropTypes from 'prop-types';
import { locationTo, imgUrlFormat } from 'components/util';

const CourseItem = ({ id, topic, backgroundUrl, browseNum }) => {
    return (
        <div className='course-item' onClick={ () => locationTo(`/topic/details?topicId=${id}`) }>
            <img src={imgUrlFormat(backgroundUrl, '@324w_200h_1e_1c_2o') } className='course-img' alt="" />
            <div className="course-right">
                <div className="course-title elli-text">{ topic }</div>    
                <div className="course-info">
                    <span>{ browseNum || 0 }次学习</span>
                </div>
            </div>
        </div>
    )
}

export default CourseItem;