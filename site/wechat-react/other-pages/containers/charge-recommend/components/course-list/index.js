import React from 'react';
import PropTypes from 'prop-types';
import { locationTo, digitFormat } from 'components/util';
import { fillParams } from 'components/url-utils';
// import ScrollToLoad from 'components/scrollToLoad';

const CourseList = ({ items=[] }) => {
    return (
        <div className='course-list'>
            {
                items.map((item, index) => (
                    <CourseItem
                        index = { index }
                        key = {`course-item-${index}`}
                        { ...item }
                    />
                ))
            }
        </div>
    );
};

CourseList.propTypes = {
    // 课程列表
    items: PropTypes.array.isRequired
};


/**
 * 列表item点击事件处理
 * @param {*} e 
 * @param {*} props 
 * @param {*} url 
 */
function handleCourseItemClick (props) {
    // if(!!props.auditionTopicId){
    //     url = `/topic/details?topicId=${props.auditionTopicId}`;
    // }else 
    {
        if (window.__wxjs_environment === 'miniprogram') {
            let url = props.type === 'channel' 
                ?
                `/pages/channel-index/channel-index?channelId=${props.businessId}`
                :
                `/pages/intro-topic/intro-topic?topicId=${props.businessId}`;
            
            wx.miniProgram.navigateTo({ url });
        } else {
            let url = props.url;
            
            if (!url) {
                url = props.type === 'channel'
                    ?
                    `/live/channel/channelPage/${props.businessId}.htm`
                    :
                    `/topic/${props.businessId}.htm?pro_cl=center`;
            }
            locationTo(url);
        }
    }
    
}

const CourseItem = (props) => {
    return (
        <div className="course-item on-log on-visible"
            style={{
                backgroundImage: `url(${props.logo}@690w_266h_1e_1c_2o)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}
            onClick={e => handleCourseItemClick(props)}
            data-log-region="list"
            data-log-pos={props.index}
            data-log-business_id={props.businessId}
            data-log-name={props.businessName}
            data-log-business_type={props.type}>
            <div className="detail">
                {/*
                    props.type === 'channel' ? (
                        <div className="channel-tag">系列课</div>
                    ) : null
                */}

                {
                    false && <div className="desc">
                        <div className="title">
                            {
                                props.hot === 'Y' ? (
                                    <span className="sign-up-icon"></span>
                                ) : null
                            }
                            {props.businessName}
                        </div>
                        <div className="other-info">
                            <span className="live-name">{props.liveName}</span>
                            {
                                props.type === 'channel' ? (
                                    <span className="topic-num">共{props.topicNum}节</span>
                                ) : null
                            }
                            <span className="view-num">{digitFormat(props.type === 'channel' ? props.learningNum : props.authNum)}次学习</span>
                        </div>
                    </div>
                }
                
            </div>
        </div>
    )
};


export default CourseList;
