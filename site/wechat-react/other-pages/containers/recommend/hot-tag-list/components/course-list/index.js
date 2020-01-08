import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney, digitFormat } from 'components/util';

const CourseList = (props) => {
    return (
        <div className='recommend-hot-tag-list-wrap'>
            {
                props.list.map((item, index) => {
                    return (<CourseItem
                        index={index}
                        key={`course-item-${index}`}
                        onCourseClick={props.onCourseClick}
                        tagId={props.tagId}
                        { ...item }
                    />)
                })
            }
        </div>
    )
}

const CourseItem = (props) => {
    return (
        <div
            className="course-item on-log on-visible"
            onClick={e => {

                props.onCourseClick(props.url, props.tagId);
            }}
            data-log-pos={props.index}
            data-log-name={props.courseName}
            data-log-business_type={props.courseType}
            data-log-business_id={props.courseId}
            data-log-region={`ab_course_list_${props.tagId}`}
        >
            <div className={`img-box ${props.flag === 'boutique' ?'boutique':''}`}>
                <img src={`${props.headImageUrl}@296h_480w_1e_1c_2o`} />
            </div>
            <div className="detail">
                <div className="title">{props.courseName}</div>

                <div className="other-info">
                    <div className="tip-name">
                        {
                            (props.type === 'channel' && props.topicNum)
                                ? <div className="tip-name-body">
                                    共{props.topicNum}节课
                                  </div>
                                : null
                        }
                    </div>
                    <div className="tag">

                        <div className="view-num">{digitFormat (props.learningNum,10000)}次学习</div>
                        {
                            props.price === 0
                                ? <div className="free">免费</div>
                                : null
                        }
                        {
                            props.price > 0 &&
                                (props.discount === -1
                                ? <div className="money">￥{formatMoney(props.price)}</div>
                                : <div className="money">
                                    <del>{formatMoney(props.price)}</del>
                                    ￥{formatMoney(props.discount)}
                                </div>)
                        }

                    </div>
                </div>
            </div>
        </div>
    )
};

export default CourseList